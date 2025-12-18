// app.js - Inicialización y manejo de eventos

// Instancias globales
let calculadora;
let presetsManager;
let historialManager;
let calculadoraTinta;
let descuentosManager;
let ultimosResultados;

// Función para actualizar estadísticas del dashboard (DESHABILITADA)
/*
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
*/

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', () => {
  // Crear instancias
  calculadora = new CalculadoraSublimacion();
  presetsManager = new PresetsManager(calculadora);
  historialManager = new HistorialManager();
  calculadoraTinta = new CalculadoraTinta();
  descuentosManager = new DescuentosManager();

  // Inicializar componentes
  historialManager.inicializar();
  calculadoraTinta.inicializar();
  descuentosManager.inicializar();

  // Inicializar navegación por tabs
  inicializarTabs();

  // Inicializar selector de presets
  inicializarPresets();

  // Hacer accesible globalmente
  window.calculadora = calculadora;
  window.descuentosManager = descuentosManager;
  window.ultimosResultados = ultimosResultados;

  // Actualizar estadísticas al inicio (DESHABILITADO)
  // actualizarEstadisticas();

  // Event listeners
  configurarEventListeners();
  configurarModalResultados();

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

  // Los botones guardar y compartir ahora están en el modal

  // Calcular automáticamente cuando se cambian valores (opcional)
  const inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      // Auto-calcular solo si el modal está abierto
      if (document.getElementById('modal-resultados').classList.contains('show')) {
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

    // Actualizar estadísticas del dashboard (DESHABILITADO)
    // actualizarEstadisticas();

    // Ya no necesitamos animación aquí, el modal tiene la suya

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

// ========================================
// SISTEMA DE TABS Y NAVEGACIÓN
// ========================================

function inicializarTabs() {
  const navItems = document.querySelectorAll('.nav-item');
  const tabContents = document.querySelectorAll('.tab-content');

  console.log('Inicializando tabs...', {
    navItems: navItems.length,
    tabContents: tabContents.length
  });

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabId = item.getAttribute('data-tab');
      console.log('Cambiando a tab:', tabId);

      // Remover active de todos
      navItems.forEach(nav => nav.classList.remove('active'));
      tabContents.forEach(tab => tab.classList.remove('active'));

      // Activar el seleccionado
      item.classList.add('active');
      const targetTab = document.getElementById(`tab-${tabId}`);
      if (targetTab) {
        targetTab.classList.add('active');
        console.log('Tab activado:', tabId);
      } else {
        console.error('No se encontró el tab:', `tab-${tabId}`);
      }
    });
  });
}

// ========================================
// MODAL DE RESULTADOS
// ========================================

function configurarModalResultados() {
  const modal = document.getElementById('modal-resultados');
  const btnCerrar = document.getElementById('cerrar-modal-resultados');
  const btnGuardar = document.getElementById('guardar-btn-modal');
  const btnCompartir = document.getElementById('compartir-btn-modal');

  // Cerrar modal
  btnCerrar.addEventListener('click', () => {
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
  });

  // Cerrar al hacer clic fuera del modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
      document.body.classList.remove('modal-open');
    }
  });

  // Guardar desde modal
  btnGuardar.addEventListener('click', () => {
    const resultados = window.ultimosResultados || ultimosResultados;
    if (resultados) {
      historialManager.agregarCalculo(resultados);
      modal.classList.remove('show');
      document.body.classList.remove('modal-open');
    }
  });

  // Compartir desde modal
  btnCompartir.addEventListener('click', () => {
    const resultados = window.ultimosResultados || ultimosResultados;
    if (resultados) {
      historialManager.compartirCalculo(resultados);
    }
  });
}

// ========================================
// SELECTOR DE PRESETS EN CALCULADORA
// ========================================

function inicializarPresets() {
  const productBtns = document.querySelectorAll('.preset-icon-btn');

  productBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const producto = btn.getAttribute('data-product');

      // Remover active de todos
      productBtns.forEach(b => b.classList.remove('active'));

      // Activar el seleccionado
      btn.classList.add('active');

      // Aplicar preset si existe
      if (presetsManager && presetsManager.presets[producto]) {
        presetsManager.aplicarPreset(producto);
      }
    });
  })
}
