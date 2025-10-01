// Script para actualizar calificaciones desde Google Sheets
// Este script se ejecuta en el servidor para actualizar calificaciones.json

const fs = require('fs');
const path = require('path');

async function consultarGoogleSheet(sheetId) {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
    
    try {
        const response = await fetch(url);
        const text = await response.text();
        
        // Parsear respuesta de Google Sheets
        const jsonData = JSON.parse(text.substring(47, text.length - 2));
        const rows = jsonData.table.rows;
        
        const estudiantes = [];
        
        // Procesar filas (saltar encabezados)
        for (let i = 2; i < rows.length; i++) {
            const row = rows[i];
            if (row.c && row.c.length >= 13) {
                const cedula = row.c[3]?.v?.toString() || '';
                const apellidos = row.c[1]?.v?.toString() || '';
                const nombres = row.c[2]?.v?.toString() || '';
                
                if (cedula && cedula !== '0' && apellidos && nombres) {
                    const evaluaciones = [
                        { nombre: 'Exposiciones', puntaje: parseFloat(row.c[4]?.v) || 0, ponderado: 0, porcentaje: 20 }, // Columna E (EVAL 1)
                        { nombre: 'Ejercicios Exposición', puntaje: parseFloat(row.c[6]?.v) || 0, ponderado: 0, porcentaje: 20 }, // Columna G (EVAL 2)
                        { nombre: 'Informes Acumulados', puntaje: parseFloat(row.c[8]?.v) || 0, ponderado: 0, porcentaje: 20 }, // Columna I (EVAL 3)
                        { nombre: 'Ejercicios Acumulados', puntaje: parseFloat(row.c[10]?.v) || 0, ponderado: 0, porcentaje: 20 }, // Columna K (EVAL 4)
                        { nombre: 'Asistencia y Participación', puntaje: parseFloat(row.c[12]?.v) || 0, ponderado: 0, porcentaje: 20 } // Columna M (EVAL 5)
                    ];
                    
                    // Calcular ponderados
                    evaluaciones.forEach(eval => {
                        eval.ponderado = (eval.puntaje * eval.porcentaje) / 100;
                    });
                    
                    const definitiva = evaluaciones.reduce((sum, eval) => sum + eval.ponderado, 0);
                    
                    estudiantes.push({
                        cedula: cedula,
                        nombre: `${apellidos} ${nombres}`.toUpperCase(),
                        carrera: sheetId === '17rp0GHTxVf4G3kTJzSXXurKpcVgyJgZC' ? 'Contaduría Pública' : 'Administración de Empresas',
                        evaluaciones: evaluaciones,
                        definitiva: definitiva,
                        estado: definitiva > 0 ? 'En progreso' : 'Sin calificaciones'
                    });
                }
            }
        }
        
        return estudiantes;
    } catch (error) {
        console.error('Error consultando Google Sheet:', error);
        return [];
    }
}

async function actualizarCalificaciones() {
    try {
        console.log('Consultando Google Sheets...');
        
        // Consultar ambas hojas
        const contaduriaData = await consultarGoogleSheet('17rp0GHTxVf4G3kTJzSXXurKpcVgyJgZC');
        const administracionData = await consultarGoogleSheet('1bTIrzyHKB6K7yzE8fKW9Gi_93NaniGHH');
        
        // Combinar datos
        const todosLosEstudiantes = [...contaduriaData, ...administracionData];
        
        // Guardar en calificaciones.json
        const filePath = path.join(__dirname, 'assets', 'data', 'calificaciones.json');
        fs.writeFileSync(filePath, JSON.stringify(todosLosEstudiantes, null, 2));
        
        console.log(`✅ Actualizado: ${todosLosEstudiantes.length} estudiantes`);
        console.log('📊 Contaduría Pública:', contaduriaData.length);
        console.log('🏢 Administración de Empresas:', administracionData.length);
        
        return todosLosEstudiantes;
    } catch (error) {
        console.error('❌ Error actualizando calificaciones:', error);
        throw error;
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    actualizarCalificaciones()
        .then(() => {
            console.log('🎉 Actualización completada');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Error:', error);
            process.exit(1);
        });
}

module.exports = { actualizarCalificaciones, consultarGoogleSheet };
