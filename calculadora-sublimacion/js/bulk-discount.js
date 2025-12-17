// bulk-discount.js - Gestión de descuentos por volumen

class DescuentosManager {
    constructor() {
        this.descuentos = {
            '1-5': 0,
            '6-20': 5,
            '21-50': 10,
            '51+': 15
        };
        this.cargarDescuentos();
        this.modal = null;
    }

    // Cargar descuentos desde localStorage
    cargarDescuentos() {
        try {
            const saved = localStorage.getItem('descuentos-volumen');
            if (saved) {
                this.descuentos = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error al cargar descuentos:', error);
        }
    }

    // Guardar descuentos en localStorage
    guardarDescuentos() {
        try {
            localStorage.setItem('descuentos-volumen', JSON.stringify(this.descuentos));
        } catch (error) {
            console.error('Error al guardar descuentos:', error);
        }
    }

    // Obtener descuento según cantidad
    obtenerDescuento(cantidad) {
        if (cantidad >= 51) {
            return this.descuentos['51+'];
        } else if (cantidad >= 21) {
            return this.descuentos['21-50'];
        } else if (cantidad >= 6) {
            return this.descuentos['6-20'];
        } else {
            return this.descuentos['1-5'];
        }
    }

    // Inicializar
    inicializar() {
        this.modal = document.getElementById('modal-descuentos');
        this.cargarValoresEnFormulario();
        this.configurarEventListeners();
    }

    // Cargar valores actuales en el formulario
    cargarValoresEnFormulario() {
        document.getElementById('desc-1-5').value = this.descuentos['1-5'];
        document.getElementById('desc-6-20').value = this.descuentos['6-20'];
        document.getElementById('desc-21-50').value = this.descuentos['21-50'];
        document.getElementById('desc-51-mas').value = this.descuentos['51+'];
    }

    // Configurar event listeners
    configurarEventListeners() {
        // Checkbox para activar/desactivar descuentos
        const checkbox = document.getElementById('aplicar-descuento-volumen');
        const btnConfigurar = document.getElementById('configurar-descuentos-btn');

        checkbox.addEventListener('change', () => {
            btnConfigurar.style.display = checkbox.checked ? 'inline-block' : 'none';

            // Recalcular si ya hay resultados
            if (document.getElementById('resultados').style.display !== 'none') {
                realizarCalculo();
            }
        });

        // Abrir modal de configuración
        btnConfigurar.addEventListener('click', () => {
            this.abrirModal();
        });

        // Cerrar modal
        document.getElementById('cerrar-modal-descuentos').addEventListener('click', () => {
            this.cerrarModal();
        });

        document.getElementById('cancelar-modal-descuentos').addEventListener('click', () => {
            this.cerrarModal();
        });

        // Cerrar al hacer click fuera
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.cerrarModal();
            }
        });

        // Guardar descuentos
        document.getElementById('guardar-descuentos-btn').addEventListener('click', () => {
            this.guardarConfiguracion();
        });
    }

    // Abrir modal
    abrirModal() {
        this.cargarValoresEnFormulario();
        this.modal.classList.add('show');
    }

    // Cerrar modal
    cerrarModal() {
        this.modal.classList.remove('show');
    }

    // Guardar configuración
    guardarConfiguracion() {
        // Obtener valores del formulario
        this.descuentos['1-5'] = parseFloat(document.getElementById('desc-1-5').value) || 0;
        this.descuentos['6-20'] = parseFloat(document.getElementById('desc-6-20').value) || 0;
        this.descuentos['21-50'] = parseFloat(document.getElementById('desc-21-50').value) || 0;
        this.descuentos['51+'] = parseFloat(document.getElementById('desc-51-mas').value) || 0;

        // Guardar en localStorage
        this.guardarDescuentos();

        // Cerrar modal
        this.cerrarModal();

        // Mostrar notificación
        this.mostrarNotificacion('✓ Descuentos guardados');

        // Recalcular si hay resultados visibles
        if (document.getElementById('resultados').style.display !== 'none') {
            realizarCalculo();
        }
    }

    // Mostrar notificación
    mostrarNotificacion(mensaje) {
        let notif = document.getElementById('notif-descuentos');

        if (!notif) {
            notif = document.createElement('div');
            notif.id = 'notif-descuentos';
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
}

// Exportar y crear instancia global
window.DescuentosManager = DescuentosManager;
