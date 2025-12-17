// presets.js - Presets de productos comunes

const PRESETS_PRODUCTOS = {
    taza: {
        nombre: 'Taza Blanca 11oz',
        producto: 2.50,
        tinta: 0.20,
        empaque: 0.20,
        otrosMateriales: 0.20,
        manoObra: 1.50,
        gastosGenerales: 5,
        margenGanancia: 30
    },
    polo: {
        nombre: 'Polo Blanco Talla M',
        producto: 12.00,
        tinta: 2.50,
        empaque: 1.00,
        otrosMateriales: 0.50,
        manoObra: 5.00,
        gastosGenerales: 12,
        margenGanancia: 45
    },
    llavero: {
        nombre: 'Llavero Acrílico',
        producto: 1.50,
        tinta: 0.30,
        empaque: 0.20,
        otrosMateriales: 0.10,
        manoObra: 0.80,
        gastosGenerales: 8,
        margenGanancia: 60
    },
    tomatodo: {
        nombre: 'Tomatodo 500ml',
        producto: 8.00,
        tinta: 1.20,
        empaque: 1.50,
        otrosMateriales: 0.30,
        manoObra: 3.00,
        gastosGenerales: 10,
        margenGanancia: 50
    },
    mousepad: {
        nombre: 'Mousepad Rectangular',
        producto: 4.00,
        tinta: 1.00,
        empaque: 0.50,
        otrosMateriales: 0.20,
        manoObra: 1.50,
        gastosGenerales: 10,
        margenGanancia: 55
    },
    personalizado: {
        nombre: '',
        producto: 0,
        tinta: 0,
        empaque: 0,
        otrosMateriales: 0,
        manoObra: 0,
        gastosGenerales: 10,
        margenGanancia: 40
    }
};

class PresetsManager {
    constructor(calculadora) {
        this.calculadora = calculadora;
        this.productoActual = null;
    }

    // Cargar preset de producto
    cargarPreset(tipoProducto) {
        const preset = PRESETS_PRODUCTOS[tipoProducto];

        if (!preset) {
            console.error('Preset no encontrado:', tipoProducto);
            return;
        }

        this.productoActual = tipoProducto;

        // Cargar valores en el formulario
        document.getElementById('producto-nombre').value = preset.nombre;
        document.getElementById('costo-producto').value = preset.producto;
        document.getElementById('costo-tinta').value = preset.tinta;
        document.getElementById('costo-empaque').value = preset.empaque;
        document.getElementById('otros-materiales').value = preset.otrosMateriales;
        document.getElementById('mano-obra').value = preset.manoObra;
        document.getElementById('gastos-generales').value = preset.gastosGenerales;
        document.getElementById('margen-ganancia').value = preset.margenGanancia;

        // Actualizar UI de botones
        document.querySelectorAll('.product-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        const btnActivo = document.querySelector(`[data-product="${tipoProducto}"]`);
        if (btnActivo) {
            btnActivo.classList.add('active');
        }

        // Feedback visual
        this.mostrarNotificacion(`Preset cargado: ${preset.nombre || 'Producto personalizado'}`);
    }

    // Mostrar notificación temporal
    mostrarNotificacion(mensaje) {
        // Crear elemento de notificación si no existe
        let notif = document.getElementById('notificacion-preset');

        if (!notif) {
            notif = document.createElement('div');
            notif.id = 'notificacion-preset';
            notif.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #2ecc71;
                color: white;
                padding: 15px 25px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(notif);
        }

        notif.textContent = mensaje;
        notif.style.opacity = '1';

        setTimeout(() => {
            notif.style.opacity = '0';
        }, 2000);
    }

    // Inicializar event listeners
    inicializar() {
        document.querySelectorAll('.product-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tipoProducto = btn.dataset.product;
                this.cargarPreset(tipoProducto);
            });
        });
    }
}

// Exportar para uso global
window.PresetsManager = PresetsManager;
window.PRESETS_PRODUCTOS = PRESETS_PRODUCTOS;
