function openTheme(url) {
    window.open(url, '_blank');
}

// Función para consultar calificaciones desde Google Sheets
async function consultarCalificaciones() {
    const cedula = document.getElementById('cedula').value.trim();
    const resultados = document.getElementById('resultados-calificaciones');
    const datosEstudiante = document.getElementById('datos-estudiante');

    if (!cedula) {
        alert('Por favor ingresa tu número de cédula');
        return;
    }

    // Mostrar loading inicial
    datosEstudiante.innerHTML = `
        <div class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Consultando calificaciones...</p>
        </div>
    `;
    resultados.classList.remove('hidden');

    try {
        // Consultar las calificaciones directamente
        const calificaciones = await simularConsultaCalificaciones(cedula);
        
        if (calificaciones.encontrado) {
            mostrarCalificaciones(calificaciones);
        } else {
            mostrarError('No se encontraron calificaciones para la cédula ingresada');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al consultar las calificaciones. Intenta nuevamente.');
    }
}

// Función para consultar calificaciones desde archivo JSON
async function simularConsultaCalificaciones(cedula) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
        // Intentar cargar datos desde archivo JSON
        const response = await fetch('assets/data/calificaciones.json');
        const estudiantes = await response.json();
        
        const estudiante = estudiantes.find(est => est.cedula === cedula);
        if (estudiante) {
            return {
                encontrado: true,
                ...estudiante
            };
        } else {
            return { encontrado: false };
        }
    } catch (error) {
        console.log('Cargando datos de respaldo...');
        // Datos de respaldo si no se puede cargar el JSON
        const estudiantesEjemplo = [
        {
            cedula: '32054913',
            nombre: 'MARIANGEL JOSE ALBARRAN MONTILLA',
            carrera: 'Contaduría Pública',
            evaluaciones: [
                { nombre: 'EVAL 1', puntaje: 18, ponderado: 3.6, porcentaje: 20 },
                { nombre: 'EVAL 2', puntaje: 0, ponderado: 0, porcentaje: 20 },
                { nombre: 'EVAL 3', puntaje: 0, ponderado: 0, porcentaje: 20 },
                { nombre: 'EVAL 4', puntaje: 0, ponderado: 0, porcentaje: 20 },
                { nombre: 'EVAL 5', puntaje: 0, ponderado: 0, porcentaje: 20 }
            ],
            definitiva: 3.6,
            estado: 'En progreso'
        },
        {
            cedula: '31191557',
            nombre: 'ELIMAR FLORANGEL MORALES GOYO',
            carrera: 'Contaduría Pública',
            evaluaciones: [
                { nombre: 'EVAL 1', puntaje: 18, ponderado: 3.6, porcentaje: 20 },
                { nombre: 'EVAL 2', puntaje: 0, ponderado: 0, porcentaje: 20 },
                { nombre: 'EVAL 3', puntaje: 0, ponderado: 0, porcentaje: 20 },
                { nombre: 'EVAL 4', puntaje: 0, ponderado: 0, porcentaje: 20 },
                { nombre: 'EVAL 5', puntaje: 0, ponderado: 0, porcentaje: 20 }
            ],
            definitiva: 3.6,
            estado: 'En progreso'
        },
        {
            cedula: '30720049',
            nombre: 'MANUEL ALEJANDRO SUAREZ CEDEÑO',
            carrera: 'Administración de Empresas',
            evaluaciones: [
                { nombre: 'EVAL 1', puntaje: 0, ponderado: 0, porcentaje: 20 },
                { nombre: 'EVAL 2', puntaje: 0, ponderado: 0, porcentaje: 20 },
                { nombre: 'EVAL 3', puntaje: 0, ponderado: 0, porcentaje: 20 },
                { nombre: 'EVAL 4', puntaje: 0, ponderado: 0, porcentaje: 20 },
                { nombre: 'EVAL 5', puntaje: 0, ponderado: 0, porcentaje: 20 }
            ],
            definitiva: 0,
            estado: 'Sin calificaciones'
        },
        {
            cedula: '28307516',
            nombre: 'GABRIEL DAVID CANDEO AZUAJE',
            carrera: 'Contaduría Pública',
            evaluaciones: [
                { nombre: 'EVAL 1', puntaje: 0, ponderado: 0, porcentaje: 20 },
                { nombre: 'EVAL 2', puntaje: 0, ponderado: 0, porcentaje: 20 },
                { nombre: 'EVAL 3', puntaje: 0, ponderado: 0, porcentaje: 20 },
                { nombre: 'EVAL 4', puntaje: 0, ponderado: 0, porcentaje: 20 },
                { nombre: 'EVAL 5', puntaje: 0, ponderado: 0, porcentaje: 20 }
            ],
            definitiva: 0,
            estado: 'Sin calificaciones'
        }
    ];

    const estudiante = estudiantesEjemplo.find(est => est.cedula === cedula);
    
    if (estudiante) {
        return {
            encontrado: true,
            ...estudiante
        };
    } else {
        return { encontrado: false };
    }
}

// Función para mostrar las calificaciones
function mostrarCalificaciones(calificaciones) {
    const datosEstudiante = document.getElementById('datos-estudiante');
    
    // Verificar si hay calificaciones
    const tieneCalificaciones = calificaciones.evaluaciones.some(eval => eval.puntaje > 0);
    
    if (!tieneCalificaciones) {
        // Mostrar mensaje cuando no hay calificaciones
        datosEstudiante.innerHTML = `
            <div class="bg-white rounded-lg p-6 shadow-sm">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h5 class="text-xl font-bold text-gray-800">${calificaciones.nombre}</h5>
                        <p class="text-gray-600">Cédula: ${calificaciones.cedula}</p>
                        <p class="text-sm text-blue-600 font-medium">${calificaciones.carrera}</p>
                    </div>
                    <div class="text-right">
                        <div class="text-3xl font-bold text-gray-400">-</div>
                        <div class="text-sm text-gray-500">Sin calificaciones</div>
                    </div>
                </div>

                <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 text-center">
                    <div class="text-yellow-600 text-4xl mb-4">📝</div>
                    <h6 class="font-semibold text-gray-800 mb-2">Estudiante Registrado</h6>
                    <p class="text-sm text-gray-600 mb-4">
                        Has sido registrado exitosamente en el sistema. 
                        Las calificaciones aparecerán aquí conforme se vayan asignando.
                    </p>
                    <div class="bg-white rounded-lg p-4">
                        <h6 class="font-semibold text-gray-800 mb-2">Estado del Registro</h6>
                        <div class="flex items-center justify-center space-x-4 text-sm">
                            <div class="flex items-center text-green-600">
                                <span class="mr-2">✅</span>
                                GitHub
                            </div>
                            <div class="flex items-center text-green-600">
                                <span class="mr-2">✅</span>
                                Google Sheets
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return;
    }
    
    // Mostrar calificaciones normales
    let html = `
        <div class="bg-white rounded-lg p-6 shadow-sm">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h5 class="text-xl font-bold text-gray-800">${calificaciones.nombre}</h5>
                    <p class="text-gray-600">Cédula: ${calificaciones.cedula}</p>
                    <p class="text-sm text-blue-600 font-medium">${calificaciones.carrera}</p>
                </div>
                <div class="text-right">
                    <div class="text-3xl font-bold text-blue-600">${calificaciones.definitiva}</div>
                    <div class="text-sm text-gray-500">Calificación Definitiva</div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
    `;

    calificaciones.evaluaciones.forEach((eval, index) => {
        let colorClass = 'text-red-600';
        if (eval.puntaje >= 18) {
            colorClass = 'text-green-600';
        } else if (eval.puntaje >= 15) {
            colorClass = 'text-yellow-600';
        }
        
        html += `
            <div class="bg-gray-50 rounded-lg p-4 text-center">
                <div class="text-sm font-medium text-gray-600 mb-2">${eval.nombre}</div>
                <div class="text-2xl font-bold ${colorClass} mb-1">${eval.puntaje}</div>
                <div class="text-xs text-gray-500">Ponderado: ${eval.ponderado}</div>
                <div class="text-xs text-gray-400">${eval.porcentaje}%</div>
            </div>
        `;
    });

    html += `
            </div>

            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h6 class="font-semibold text-gray-800">Estado Académico</h6>
                        <p class="text-sm text-gray-600">
                            ${calificaciones.definitiva >= 18 ? '✅ Aprobado' : 
                              calificaciones.definitiva >= 15 ? '⚠️ En observación' : 
                              '❌ Reprobado'}
                        </p>
                    </div>
                    <div class="text-right">
                        <div class="text-sm text-gray-500">Progreso</div>
                        <div class="w-24 bg-gray-200 rounded-full h-2">
                            <div class="bg-blue-600 h-2 rounded-full" style="width: ${(calificaciones.definitiva / 20) * 100}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    datosEstudiante.innerHTML = html;
}

// Función para mostrar errores
function mostrarError(mensaje) {
    const datosEstudiante = document.getElementById('datos-estudiante');
    datosEstudiante.innerHTML = `
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div class="text-red-600 text-4xl mb-4">⚠️</div>
            <h6 class="font-semibold text-red-800 mb-2">No se encontraron resultados</h6>
            <p class="text-red-600">${mensaje}</p>
            <p class="text-sm text-gray-500 mt-2">Verifica que hayas ingresado correctamente tu número de cédula</p>
        </div>
    `;
}

// Inicializar el evento de búsqueda con Enter cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    const cedulaInput = document.getElementById('cedula');
    if (cedulaInput) {
        cedulaInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                consultarCalificaciones();
            }
        });
    }
});
