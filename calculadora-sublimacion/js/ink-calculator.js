// ink-calculator.js - Calculadora de costo de tinta

class CalculadoraTinta {
    constructor() {
        this.modal = null;
        this.costoCalculado = 0;
    }

    // Inicializar
    inicializar() {
        this.modal = document.getElementById('modal-calculadora-tinta');
        this.configurarEventListeners();
    }

    // Configurar event listeners
    configurarEventListeners() {
        // Abrir modal
        document.getElementById('abrir-calculadora-tinta').addEventListener('click', () => {
            this.abrirModal();
        });

        // Cerrar modal
        document.getElementById('cerrar-modal-tinta').addEventListener('click', () => {
            this.cerrarModal();
        });

        document.getElementById('cancelar-modal-tinta').addEventListener('click', () => {
            this.cerrarModal();
        });

        // Cerrar al hacer click fuera del modal
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.cerrarModal();
            }
        });

        // Calcular
        document.getElementById('calcular-tinta-btn').addEventListener('click', () => {
            this.calcularCosto();
        });

        // Aplicar al formulario
        document.getElementById('aplicar-tinta-btn').addEventListener('click', () => {
            this.aplicarAlFormulario();
        });

        // Presets de rendimiento
        document.querySelectorAll('.btn-preset-rendimiento').forEach(btn => {
            btn.addEventListener('click', () => {
                const rendimiento = btn.dataset.rendimiento;
                document.getElementById('rendimiento-tinta').value = rendimiento;
            });
        });

        // Calcular al presionar Enter
        document.getElementById('precio-botella').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.calcularCosto();
        });

        document.getElementById('rendimiento-tinta').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.calcularCosto();
        });
    }

    // Abrir modal
    abrirModal() {
        this.modal.classList.add('show');
        document.getElementById('precio-botella').focus();
        
        // Limpiar valores anteriores
        document.getElementById('resultado-tinta-modal').style.display = 'none';
        document.getElementById('aplicar-tinta-btn').style.display = 'none';
    }

    // Cerrar modal
    cerrarModal() {
        this.modal.classList.remove('show');
        this.limpiarFormulario();
    }

    // Calcular costo
    calcularCosto() {
        const precioBotella = parseFloat(document.getElementById('precio-botella').value) || 0;
        const rendimiento = parseFloat(document.getElementById('rendimiento-tinta').value) || 0;

        // Validaciones
        if (precioBotella <= 0) {
            this.mostrarError('Por favor, ingresa el precio de la botella');
            document.getElementById('precio-botella').focus();
            return;
        }

        if (rendimiento <= 0) {
            this.mostrarError('Por favor, ingresa el rendimiento estimado');
            document.getElementById('rendimiento-tinta').focus();
            return;
        }

        // Calcular costo unitario
        this.costoCalculado = precioBotella / rendimiento;

        // Mostrar resultado
        document.getElementById('costo-unitario-tinta').textContent = 
            'S/ ' + this.costoCalculado.toFixed(2);
        
        document.getElementById('resultado-tinta-modal').style.display = 'block';
        document.getElementById('aplicar-tinta-btn').style.display = 'inline-block';

        // Animación
        const resultado = document.getElementById('resultado-tinta-modal');
        resultado.style.animation = 'none';
        setTimeout(() => {
            resultado.style.animation = 'slideIn 0.3s ease';
        }, 10);
    }

    // Aplicar al formulario principal
    aplicarAlFormulario() {
        document.getElementById('costo-tinta').value = this.costoCalculado.toFixed(2);
        this.cerrarModal();
        this.mostrarNotificacion('✓ Costo de tinta aplicado');

        // Si ya hay resultados mostrados, recalcular
        if (document.getElementById('resultados').style.display !== 'none') {
            realizarCalculo();
        }
    }

    // Limpiar formulario
    limpiarFormulario() {
        document.getElementById('precio-botella').value = '';
        document.getElementById('rendimiento-tinta').value = '';
        document.getElementById('resultado-tinta-modal').style.display = 'none';
        document.getElementById('aplicar-tinta-btn').style.display = 'none';
        this.costoCalculado = 0;
    }

    // Mostrar error
    mostrarError(mensaje) {
        let errorDiv = document.getElementById('error-tinta-modal');
        
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'error-tinta-modal';
            errorDiv.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #e74c3c;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 1001;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(errorDiv);
        }

        errorDiv.textContent = '⚠️ ' + mensaje;
        errorDiv.style.opacity = '1';

        setTimeout(() => {
            errorDiv.style.opacity = '0';
        }, 3000);
    }

    // Mostrar notificación
    mostrarNotificacion(mensaje) {
        let notif = document.getElementById('notif-tinta');
        
        if (!notif) {
            notif = document.createElement('div');
            notif.id = 'notif-tinta';
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

// Exportar
window.CalculadoraTinta = CalculadoraTinta;
