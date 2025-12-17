// app.js - Inicialización y manejo de eventos

// Instancias globales
let calculadora;
let presetsManager;
let historialManager;
let calculadoraTinta;
let descuentosManager;
let ultimosResultados;

// Función para actualizar estadísticas del dashboard
function actualizarEstadisticas() {
    const historial = JSON.parse(localStorage.getItem('historialCalculos')) || [];
    const totalCalculos = historial.length;

    // Actualizar total de cálculos
    const totalCalculosEl = document.getElementById('total-calculos');
    if (totalCalculosEl) {
        totalCalculosEl.textContent = totalCalculos;
    }

    // Actualizar último precio y ganancia
    if (historial.length > 0 && window.ultimosResultados) {
        const ultimoPrecioEl = document.getElementById('ultimo-precio');
        const ultimaGananciaEl = document.getElementById('ultima-ganancia');

        if (ultimoPrecioEl) {
            ultimoPrecioEl.textContent = `S/ ${window.ultimosResultados.precioVentaUnitario.toFixed(2)}`;
        }

        if (ultimaGananciaEl) {
            ultimaGananciaEl.textContent = `S/ ${window.ultimosResultados.gananciaFinal.toFixed(2)}`;
        }
    }
}

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', () => {
    // Crear instancias
    calculadora = new CalculadoraSublimacion();
    presetsManager = new PresetsManager(calculadora);
    historialManager = new HistorialManager();
    calculadoraTinta = new CalculadoraTinta();
    descuentosManager = new DescuentosManager();

    // Inicializar componentes
    presetsManager.inicializar();
    historialManager.inicializar();
    calculadoraTinta.inicializar();
    descuentosManager.inicializar();

    // Hacer accesible globalmente
    window.descuentosManager = descuentosManager;
    window.ultimosResultados = ultimosResultados;

    // Actualizar estadísticas al inicio
    actualizarEstadisticas();

    // Event listeners
    configurarEventListeners();

    console.log('✓ Calculadora de Sublimación inicializada');
});

// Configurar todos los event listeners
function configurarEventListeners() {
    // Botón calcular
    document.getElementById('calcular-btn').addEventListener('click', () => {
        realizarCalculo();
    });

    // Botón limpiar
    document.getElementById('limpiar-btn').addEventListener('click', () => {
        calculadora.limpiarFormulario();
    });

    // Botón guardar
    document.getElementById('guardar-btn').addEventListener('click', () => {
        const resultados = window.ultimosResultados || ultimosResultados;
        if (resultados) {
            historialManager.agregarCalculo(resultados);
        } else {
            mostrarError('Primero debes calcular un precio');
        }
    });

    // Botón compartir
    document.getElementById('compartir-btn').addEventListener('click', () => {
        const resultados = window.ultimosResultados || ultimosResultados;
        if (resultados) {
            historialManager.compartirCalculo(resultados);
        } else {
            mostrarError('Primero debes calcular un precio');
        }
    });

    // Calcular automáticamente cuando se cambian valores (opcional)
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            // Auto-calcular solo si ya se mostró resultados una vez
            if (document.getElementById('resultados').style.display !== 'none') {
                realizarCalculo();
            }
        });
    });

    // Enter en el nombre del producto
    document.getElementById('producto-nombre').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            realizarCalculo();
        }
    });

    // Validación de porcentajes
    document.getElementById('gastos-generales').addEventListener('input', (e) => {
        validarPorcentaje(e.target, 0, 100);
    });

    document.getElementById('margen-ganancia').addEventListener('input', (e) => {
        validarPorcentaje(e.target, 0, 500);
    });

    // Validación de cantidad
    document.getElementById('cantidad').addEventListener('input', (e) => {
        if (parseInt(e.target.value) < 1) {
            e.target.value = 1;
        }
    });
}

// Realizar cálculo
function realizarCalculo() {
    try {
        // Validar que al menos haya un nombre de producto
        const nombreProducto = document.getElementById('producto-nombre').value.trim();

        if (!nombreProducto) {
            mostrarError('Por favor, ingresa un nombre para el producto');
            document.getElementById('producto-nombre').focus();
            return;
        }

        // Realizar cálculo
        ultimosResultados = calculadora.calcular();
        window.ultimosResultados = ultimosResultados;

        // Mostrar resultados
        calculadora.mostrarResultados(ultimosResultados);

        // Actualizar estadísticas del dashboard
        actualizarEstadisticas();

        // Animación de éxito
        const resultadosDiv = document.getElementById('resultados');
        resultadosDiv.style.animation = 'none';
        setTimeout(() => {
            resultadosDiv.style.animation = 'fadeIn 0.5s ease';
        }, 10);

    } catch (error) {
        console.error('Error al calcular:', error);
        mostrarError('Ocurrió un error al realizar el cálculo');
    }
}

// Validar porcentaje
function validarPorcentaje(input, min, max) {
    let valor = parseFloat(input.value);

    if (isNaN(valor)) {
        valor = 0;
    }

    if (valor < min) {
        valor = min;
    } else if (valor > max) {
        valor = max;
    }

    input.value = valor;
}

// Mostrar error
function mostrarError(mensaje) {
    let errorDiv = document.getElementById('error-notification');

    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'error-notification';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #e74c3c;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 1001;
            opacity: 0;
            transition: opacity 0.3s ease;
            max-width: 90%;
            text-align: center;
        `;
        document.body.appendChild(errorDiv);
    }

    errorDiv.textContent = '⚠️ ' + mensaje;
    errorDiv.style.opacity = '1';

    setTimeout(() => {
        errorDiv.style.opacity = '0';
    }, 3000);
}

// Atajos de teclado
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter para calcular
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        realizarCalculo();
    }

    // Ctrl/Cmd + L para limpiar
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        calculadora.limpiarFormulario();
    }

    // Ctrl/Cmd + S para guardar (si hay resultados)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (ultimosResultados) {
            historialManager.agregarCalculo(ultimosResultados);
        }
    }
});

// Mensaje de bienvenida en consola
console.log('%c💰 Calculadora de Precios de Sublimación', 'font-size: 20px; font-weight: bold; color: #3498db;');
console.log('%cAtajos de teclado:', 'font-weight: bold; color: #2ecc71;');
console.log('Ctrl/Cmd + Enter → Calcular');
console.log('Ctrl/Cmd + L → Limpiar formulario');
console.log('Ctrl/Cmd + S → Guardar cálculo');
