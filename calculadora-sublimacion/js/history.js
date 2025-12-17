// history.js - Manejo del historial de cálculos

class HistorialManager {
    constructor() {
        this.historial = [];
        this.storageKey = 'historial-calculadora-sublimacion';
        this.cargarHistorial();
    }

    // Cargar historial desde localStorage
    cargarHistorial() {
        try {
            const data = localStorage.getItem(this.storageKey);
            this.historial = data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error al cargar historial:', error);
            this.historial = [];
        }
    }

    // Guardar historial en localStorage
    guardarHistorial() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.historial));
        } catch (error) {
            console.error('Error al guardar historial:', error);
        }
    }

    // Agregar cálculo al historial
    agregarCalculo(resultados) {
        const calculo = {
            id: Date.now(),
            ...resultados,
            fechaGuardado: new Date().toLocaleString('es-PE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        this.historial.unshift(calculo);

        // Limitar a 20 elementos
        if (this.historial.length > 20) {
            this.historial = this.historial.slice(0, 20);
        }

        this.guardarHistorial();
        this.renderizarHistorial();
        this.mostrarNotificacion('✓ Cálculo guardado en el historial');

        // Actualizar estadísticas del dashboard si existe la función
        if (typeof actualizarEstadisticas === 'function') {
            actualizarEstadisticas();
        }
    }

    // Eliminar cálculo del historial
    eliminarCalculo(id) {
        this.historial = this.historial.filter(item => item.id !== id);
        this.guardarHistorial();
        this.renderizarHistorial();
        this.mostrarNotificacion('✓ Cálculo eliminado');
    }

    // Limpiar todo el historial
    limpiarHistorial() {
        if (confirm('¿Estás seguro de que quieres eliminar todo el historial?')) {
            this.historial = [];
            this.guardarHistorial();
            this.renderizarHistorial();
            this.mostrarNotificacion('✓ Historial limpiado');
        }
    }

    // Cargar cálculo desde historial
    cargarCalculo(id, calculadora) {
        const calculo = this.historial.find(item => item.id === id);

        if (calculo) {
            calculadora.cargarDatos(calculo);
            const resultados = calculadora.calcular();
            calculadora.mostrarResultados(resultados);

            // Actualizar ultimosResultados global para que funcionen los botones
            window.ultimosResultados = resultados;

            this.mostrarNotificacion('✓ Cálculo cargado');

            // Scroll al formulario
            document.querySelector('.cost-form').scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Renderizar lista de historial
    renderizarHistorial() {
        const contenedor = document.getElementById('historial-lista');
        const btnLimpiar = document.getElementById('limpiar-historial-btn');

        if (this.historial.length === 0) {
            contenedor.innerHTML = '<p class="empty-message">No hay cálculos guardados aún</p>';
            btnLimpiar.style.display = 'none';
            return;
        }

        btnLimpiar.style.display = 'block';

        contenedor.innerHTML = this.historial.map(item => `
            <div class="historial-item">
                <h4>${item.nombreProducto}${item.cantidad > 1 ? ` (x${item.cantidad} unidades)` : ''}</h4>
                <div class="fecha">📅 ${item.fechaGuardado}</div>
                <div class="precio-historial">
                    <div><strong>Precio unitario:</strong> S/ ${item.precioUnitario.toFixed(2)}</div>
                    ${item.cantidad > 1 ? `<div style="margin-top: 5px;"><strong>Precio total (x${item.cantidad}):</strong> S/ ${item.precioTotal.toFixed(2)}</div>` : ''}
                    <div style="margin-top: 8px; font-size: 0.85em; color: #7f8c8d;">
                        Costo unitario: S/ ${item.costoTotal.toFixed(2)} | Ganancia: S/ ${item.ganancia.toFixed(2)} (${item.porcentajeGanancia}%)
                    </div>
                </div>
                <div class="historial-item-actions">
                    <button class="btn-cargar" onclick="historialManager.cargarCalculo(${item.id}, calculadora)">
                        📂 Cargar
                    </button>
                    <button class="btn-eliminar" onclick="historialManager.eliminarCalculo(${item.id})">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Compartir cálculo
    compartirCalculo(resultados) {
        const cantidadTexto = resultados.cantidad > 1 ? ` (x${resultados.cantidad} unidades)` : '';
        const descuentoTexto = resultados.descuentoVolumen > 0 ?
            `\n⚡ Descuento por volumen: ${resultados.descuentoVolumen}%` : '';

        // Determinar qué ganancia mostrar
        const gananciaTexto = resultados.descuentoVolumen > 0 ?
            `${resultados.porcentajeGanancia}% → ${resultados.porcentajeGananciaReal.toFixed(1)}% real` :
            `${resultados.porcentajeGanancia}%`;

        const gananciaValor = resultados.gananciaReal || resultados.ganancia;

        // Cálculos de totales si hay cantidad > 1
        const costoTotalFinal = resultados.costoTotal * resultados.cantidad;
        const gananciaFinal = gananciaValor * resultados.cantidad;
        const totalTexto = resultados.cantidad > 1 ? `
💰 Totales Finales (${resultados.cantidad} unidades):
• Costo total: S/ ${costoTotalFinal.toFixed(2)}
• Ganancia total: S/ ${gananciaFinal.toFixed(2)}
• Precio total de venta: S/ ${resultados.precioTotal.toFixed(2)}` : '';

        const texto = `
💰 Cálculo de Precio - ${resultados.nombreProducto}${cantidadTexto}${descuentoTexto}

📊 Desglose de Costos Unitarios:
• Materiales: S/ ${resultados.materiales.total.toFixed(2)}
  - Producto base: S/ ${resultados.materiales.producto.toFixed(2)}
  - Tinta/sublimación: S/ ${resultados.materiales.tinta.toFixed(2)}
  - Empaque: S/ ${resultados.materiales.empaque.toFixed(2)}
  - Otros: S/ ${resultados.materiales.otros.toFixed(2)}
• Mano de obra: S/ ${resultados.manoObra.toFixed(2)}
• Gastos generales (${resultados.porcentajeGG}%): S/ ${resultados.gastosGenerales.toFixed(2)}
• Costo total unitario: S/ ${resultados.costoTotal.toFixed(2)}

💵 Precio de Venta Unitario:
• Ganancia (${gananciaTexto}): S/ ${gananciaValor.toFixed(2)}
• Precio de venta: S/ ${resultados.precioUnitario.toFixed(2)}
${totalTexto}

Calculado con: Calculadora de Sublimación
        `.trim();

        if (navigator.share) {
            navigator.share({
                title: `Precio - ${resultados.nombreProducto}`,
                text: texto
            }).then(() => {
                this.mostrarNotificacion('✓ Compartido exitosamente');
            }).catch(err => {
                console.log('Error al compartir:', err);
                this.copiarAlPortapapeles(texto);
            });
        } else {
            this.copiarAlPortapapeles(texto);
        }
    }

    // Copiar al portapapeles
    copiarAlPortapapeles(texto) {
        // Método moderno
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(texto).then(() => {
                this.mostrarNotificacion('✓ Copiado al portapapeles');
            }).catch(err => {
                console.error('Error al copiar:', err);
                this.copiarConFallback(texto);
            });
        } else {
            this.copiarConFallback(texto);
        }
    }

    // Método alternativo para copiar
    copiarConFallback(texto) {
        const textarea = document.createElement('textarea');
        textarea.value = texto;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            document.execCommand('copy');
            this.mostrarNotificacion('✓ Copiado al portapapeles');
        } catch (err) {
            console.error('Error al copiar:', err);
            alert('Presiona Ctrl+C para copiar:\n\n' + texto.substring(0, 200) + '...');
        } finally {
            document.body.removeChild(textarea);
        }
    }

    // Mostrar notificación
    mostrarNotificacion(mensaje) {
        let notif = document.getElementById('notificacion-historial');

        if (!notif) {
            notif = document.createElement('div');
            notif.id = 'notificacion-historial';
            notif.style.cssText = `
                position: fixed;
                top: 80px;
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

    // Inicializar
    inicializar() {
        this.renderizarHistorial();

        // Event listener para limpiar historial
        document.getElementById('limpiar-historial-btn').addEventListener('click', () => {
            this.limpiarHistorial();
        });
    }
}

// Exportar para uso global
window.HistorialManager = HistorialManager;
