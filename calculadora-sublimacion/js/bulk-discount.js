// bulk-discount.js - Gestión de descuentos por volumen dinámicos

class DescuentosManager {
    constructor() {
        // Rangos por defecto: {desde, hasta, descuento}
        // hasta = null significa "en adelante"
        this.rangos = [
            { desde: 1, hasta: 5, descuento: 0 },
            { desde: 6, hasta: 20, descuento: 5 },
            { desde: 21, hasta: 50, descuento: 10 },
            { desde: 51, hasta: null, descuento: 15 }
        ];
        this.cargarDescuentos();
    }

    // Cargar descuentos desde localStorage
    cargarDescuentos() {
        try {
            const saved = localStorage.getItem('descuentos-volumen');
            if (saved) {
                const parsed = JSON.parse(saved);

                // Migrar formato antiguo (objeto) a nuevo formato (array)
                if (!Array.isArray(parsed)) {
                    console.log('Migrando descuentos del formato antiguo al nuevo...');
                    this.rangos = [
                        { desde: 1, hasta: 5, descuento: parsed['1-5'] || 0 },
                        { desde: 6, hasta: 20, descuento: parsed['6-20'] || 5 },
                        { desde: 21, hasta: 50, descuento: parsed['21-50'] || 10 },
                        { desde: 51, hasta: null, descuento: parsed['51+'] || 15 }
                    ];
                    this.guardarDescuentos(); // Guardar en nuevo formato
                } else {
                    this.rangos = parsed;
                }
            }
        } catch (error) {
            console.error('Error al cargar descuentos:', error);
        }
    }

    // Guardar descuentos en localStorage
    guardarDescuentos() {
        try {
            // Ordenar rangos por 'desde' antes de guardar
            this.rangos.sort((a, b) => a.desde - b.desde);
            localStorage.setItem('descuentos-volumen', JSON.stringify(this.rangos));
        } catch (error) {
            console.error('Error al guardar descuentos:', error);
        }
    }

    // Obtener descuento según cantidad
    obtenerDescuento(cantidad) {
        for (const rango of this.rangos) {
            const dentroMin = cantidad >= rango.desde;
            const dentroMax = rango.hasta === null || cantidad <= rango.hasta;

            if (dentroMin && dentroMax) {
                return rango.descuento;
            }
        }
        return 0; // Sin descuento si no encaja en ningún rango
    }

    // Agregar nuevo rango
    agregarRango(desde, hasta, descuento) {
        this.rangos.push({
            desde: parseInt(desde),
            hasta: hasta ? parseInt(hasta) : null,
            descuento: parseFloat(descuento)
        });
        this.guardarDescuentos();
    }

    // Eliminar rango por índice
    eliminarRango(index) {
        this.rangos.splice(index, 1);
        this.guardarDescuentos();
    }

    // Actualizar rango existente
    actualizarRango(index, desde, hasta, descuento) {
        if (this.rangos[index]) {
            this.rangos[index] = {
                desde: parseInt(desde),
                hasta: hasta ? parseInt(hasta) : null,
                descuento: parseFloat(descuento)
            };
            this.guardarDescuentos();
        }
    }

    // Renderizar lista de rangos en la configuración
    renderizarRangos() {
        const container = document.getElementById('rangos-descuentos');
        if (!container) return;

        if (this.rangos.length === 0) {
            container.innerHTML = '<p class="empty-message">No hay rangos de descuento configurados</p>';
            return;
        }

        container.innerHTML = this.rangos.map((rango, index) => `
            <div class="rango-item" data-index="${index}">
                <div class="rango-info">
                    <span class="rango-info-label">Desde:</span>
                    <strong>${rango.desde}</strong>
                    <span class="rango-info-label">hasta:</span>
                    <strong>${rango.hasta || '∞'}</strong>
                    <span class="rango-info-label">unidades</span>
                </div>
                <div class="rango-descuento-display">
                    <strong>${rango.descuento}</strong>
                    <span class="rango-percent">%</span>
                </div>

                <!-- Hidden inputs for compatibility -->
                <input type="number" class="rango-desde" value="${rango.desde}" min="1" step="1" style="display:none">
                <input type="number" class="rango-hasta" value="${rango.hasta || ''}" min="1" step="1" style="display:none">
                <input type="number" class="rango-descuento" value="${rango.descuento}" min="0" max="100" step="0.1" style="display:none">
            </div>
        `).join('');

        // Event listeners para abrir modal de edición al hacer clic en la fila
        container.querySelectorAll('.rango-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const index = parseInt(item.dataset.index);
                this.abrirModalEdicion(index);
            });
        });
    }

    abrirModalEdicion(index) {
        const rango = this.rangos[index];
        const modal = document.getElementById('modal-editar-rango');
        const titulo = modal.querySelector('h2');
        const btnEliminar = document.getElementById('eliminar-rango-modal');

        // Cambiar título
        if (titulo) {
            titulo.textContent = '✏️ Editar Rango de Descuento';
        }

        // Mostrar botón eliminar en modo editar
        if (btnEliminar) {
            btnEliminar.style.display = '';
        }

        // Llenar el formulario con los datos del rango
        document.getElementById('editar-desde').value = rango.desde;
        document.getElementById('editar-hasta').value = rango.hasta || '';
        document.getElementById('editar-descuento').value = rango.descuento;

        // Guardar el índice en el modal para usarlo después
        modal.dataset.editIndex = index;

        // Mostrar el modal
        modal.classList.add('show');
        document.body.classList.add('modal-open');
    }

    cerrarModalEdicion() {
        const modal = document.getElementById('modal-editar-rango');
        modal.classList.remove('show');
        document.body.classList.remove('modal-open');
    }

    guardarEdicion() {
        const modal = document.getElementById('modal-editar-rango');
        const index = parseInt(modal.dataset.editIndex);

        const desde = parseInt(document.getElementById('editar-desde').value);
        const hasta = document.getElementById('editar-hasta').value ? parseInt(document.getElementById('editar-hasta').value) : null;
        const descuento = parseFloat(document.getElementById('editar-descuento').value);

        // Validaciones
        if (isNaN(desde) || desde < 1) {
            alert('El valor "desde" debe ser un número mayor a 0');
            return;
        }

        if (hasta !== null && (isNaN(hasta) || hasta < desde)) {
            alert('El valor "hasta" debe ser mayor que "desde"');
            return;
        }

        if (isNaN(descuento) || descuento < 0 || descuento > 100) {
            alert('El descuento debe ser un número entre 0 y 100');
            return;
        }

        // Si index es -1, es un nuevo rango, sino es edición
        if (index === -1) {
            // Agregar nuevo rango
            this.agregarRango(desde, hasta, descuento);
        } else {
            // Actualizar el rango existente
            this.rangos[index] = { desde, hasta, descuento };
        }

        // Guardar en localStorage
        this.guardarDescuentos();

        // Re-renderizar
        this.renderizarRangos();

        // Cerrar modal
        this.cerrarModalEdicion();

        // Recalcular si hay un cálculo activo
        if (window.calculadora && document.getElementById('modal-resultados').classList.contains('show')) {
            window.calculadora.calcular();
        }
    }

    eliminarRangoDesdeModal() {
        const modal = document.getElementById('modal-editar-rango');
        const index = parseInt(modal.dataset.editIndex);

        if (confirm('¿Estás seguro de eliminar este rango de descuento?')) {
            this.eliminarRango(index);
            this.renderizarRangos();
            this.cerrarModalEdicion();

            // Recalcular si hay un cálculo activo
            if (window.calculadora && document.getElementById('modal-resultados').classList.contains('show')) {
                window.calculadora.calcular();
            }
        }
    }

    // Inicializar
    inicializar() {
        this.renderizarRangos();
        this.configurarEventListeners();
        this.inicializarModalEdicion();
    }

    // Configurar event listeners
    configurarEventListeners() {
        // Botón agregar rango
        const btnAgregar = document.getElementById('agregar-rango-btn');
        if (btnAgregar) {
            btnAgregar.addEventListener('click', () => {
                this.mostrarDialogoNuevoRango();
            });
        }

        // Botón guardar configuración
        const btnGuardar = document.getElementById('guardar-descuentos-btn');
        if (btnGuardar) {
            btnGuardar.addEventListener('click', () => {
                this.guardarCambios();
            });
        }

        // Checkbox de aplicar descuento
        const checkbox = document.getElementById('aplicar-descuento-volumen');
        if (checkbox) {
            checkbox.addEventListener('change', (e) => {
                const infoDescuento = document.getElementById('info-descuento');
                if (infoDescuento) {
                    infoDescuento.style.display = e.target.checked ? 'block' : 'none';
                }
            });
        }
    }

    // Mostrar modal para nuevo rango
    mostrarDialogoNuevoRango() {
        const modal = document.getElementById('modal-editar-rango');
        const titulo = modal.querySelector('h2');
        const btnEliminar = document.getElementById('eliminar-rango-modal');

        // Cambiar título
        if (titulo) {
            titulo.textContent = '➕ Agregar Rango de Descuento';
        }

        // Ocultar botón eliminar en modo agregar
        if (btnEliminar) {
            btnEliminar.style.display = 'none';
        }

        // Limpiar el formulario
        document.getElementById('editar-desde').value = '';
        document.getElementById('editar-hasta').value = '';
        document.getElementById('editar-descuento').value = '';

        // Marcar como modo agregar (sin índice)
        modal.dataset.editIndex = '-1';

        // Mostrar el modal
        modal.classList.add('show');
        document.body.classList.add('modal-open');
    }

    // Guardar todos los cambios de los inputs
    guardarCambios() {
        const container = document.getElementById('rangos-descuentos');
        if (!container) return;

        const items = container.querySelectorAll('.rango-item');
        items.forEach((item, index) => {
            const desde = item.querySelector('.rango-desde').value;
            const hasta = item.querySelector('.rango-hasta').value;
            const descuento = item.querySelector('.rango-descuento').value;

            this.actualizarRango(index, desde, hasta || null, descuento);
        });

        alert('✅ Configuración guardada correctamente');

        // Recalcular si hay un cálculo activo
        if (window.calculadora && document.getElementById('modal-resultados').classList.contains('show')) {
            window.calculadora.calcular();
        }
    }

    // Inicializar event listeners del modal de edición
    inicializarModalEdicion() {
        // Botón guardar
        const btnGuardar = document.getElementById('guardar-edicion-rango');
        if (btnGuardar) {
            btnGuardar.addEventListener('click', () => this.guardarEdicion());
        }

        // Botón eliminar
        const btnEliminar = document.getElementById('eliminar-rango-modal');
        if (btnEliminar) {
            btnEliminar.addEventListener('click', () => this.eliminarRangoDesdeModal());
        }

        // Botón cancelar
        const btnCancelar = document.getElementById('cancelar-editar-rango');
        if (btnCancelar) {
            btnCancelar.addEventListener('click', () => this.cerrarModalEdicion());
        }

        // Botón cerrar (X)
        const btnCerrar = document.getElementById('cerrar-modal-editar-rango');
        if (btnCerrar) {
            btnCerrar.addEventListener('click', () => this.cerrarModalEdicion());
        }

        // Cerrar al hacer clic fuera del modal
        const modal = document.getElementById('modal-editar-rango');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.cerrarModalEdicion();
                }
            });
        }
    }
}
