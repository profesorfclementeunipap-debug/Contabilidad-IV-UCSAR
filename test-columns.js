// Script para probar las columnas de Google Sheets

async function testGoogleSheetColumns() {
    try {
        // Probar hoja de Administración de Empresas
        const url = 'https://docs.google.com/spreadsheets/d/1bTIrzyHKB6K7yzE8fKW9Gi_93NaniGHH/gviz/tq?tqx=out:json';
        
        console.log('🔍 Consultando Google Sheet de Administración de Empresas...');
        const response = await fetch(url);
        const text = await response.text();
        
        // Parsear respuesta
        const jsonData = JSON.parse(text.substring(47, text.length - 2));
        const rows = jsonData.table.rows;
        
        console.log(`📊 Total de filas: ${rows.length}`);
        
        // Buscar al estudiante SUAREZ CEDEÑO MANUEL ALEJANDRO
        for (let i = 2; i < rows.length; i++) {
            const row = rows[i];
            if (row.c && row.c.length >= 13) {
                const cedula = row.c[3]?.v?.toString() || '';
                const apellidos = row.c[1]?.v?.toString() || '';
                const nombres = row.c[2]?.v?.toString() || '';
                
                if (cedula === '30720049') {
                    console.log('\n🎯 ESTUDIANTE ENCONTRADO:');
                    console.log(`Cédula: ${cedula}`);
                    console.log(`Nombre: ${apellidos} ${nombres}`);
                    console.log('\n📋 DATOS DE COLUMNAS:');
                    console.log(`Columna A (0): ${row.c[0]?.v || 'N/A'}`);
                    console.log(`Columna B (1): ${row.c[1]?.v || 'N/A'} (Apellidos)`);
                    console.log(`Columna C (2): ${row.c[2]?.v || 'N/A'} (Nombres)`);
                    console.log(`Columna D (3): ${row.c[3]?.v || 'N/A'} (Cédula)`);
                    console.log(`Columna E (4): ${row.c[4]?.v || 'N/A'} (Exposiciones)`);
                    console.log(`Columna F (5): ${row.c[5]?.v || 'N/A'}`);
                    console.log(`Columna G (6): ${row.c[6]?.v || 'N/A'} (Ejercicios Exposición)`);
                    console.log(`Columna H (7): ${row.c[7]?.v || 'N/A'}`);
                    console.log(`Columna I (8): ${row.c[8]?.v || 'N/A'} (Informes Acumulados)`);
                    console.log(`Columna J (9): ${row.c[9]?.v || 'N/A'}`);
                    console.log(`Columna K (10): ${row.c[10]?.v || 'N/A'} (Ejercicios Acumulados)`);
                    console.log(`Columna L (11): ${row.c[11]?.v || 'N/A'}`);
                    console.log(`Columna M (12): ${row.c[12]?.v || 'N/A'} (Asistencia y Participación)`);
                    
                    console.log('\n✅ VERIFICACIÓN DE MAPEO:');
                    console.log(`Exposiciones (Columna E): ${row.c[4]?.v || 0}`);
                    console.log(`Ejercicios Exposición (Columna G): ${row.c[6]?.v || 0}`);
                    console.log(`Informes Acumulados (Columna I): ${row.c[8]?.v || 0}`);
                    console.log(`Ejercicios Acumulados (Columna K): ${row.c[10]?.v || 0}`);
                    console.log(`Asistencia y Participación (Columna M): ${row.c[12]?.v || 0}`);
                    
                    return;
                }
            }
        }
        
        console.log('❌ Estudiante no encontrado');
        
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testGoogleSheetColumns();
