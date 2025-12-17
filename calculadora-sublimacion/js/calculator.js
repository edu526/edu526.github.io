// calculator.js - Lógica principal de cálculo

class CalculadoraSublimacion {
    constructor() {
        this.costos = {
            producto: 0,
            tinta: 0,
            empaque: 0,
            otrosMateriales: 0,
            manoObra: 0,
            gastosGenerales: 10,
            margenGanancia: 40,
            cantidad: 1
        };

        this.nombreProducto = '';
    }

    // Obtener valores del formulario
    obtenerValoresFormulario() {
        this.nombreProducto = document.getElementById('producto-nombre').value || 'Producto sin nombre';
        this.costos.producto = parseFloat(document.getElementById('costo-producto').value) || 0;
        this.costos.tinta = parseFloat(document.getElementById('costo-tinta').value) || 0;
        this.costos.empaque = parseFloat(document.getElementById('costo-empaque').value) || 0;
        this.costos.otrosMateriales = parseFloat(document.getElementById('otros-materiales').value) || 0;
        this.costos.manoObra = parseFloat(document.getElementById('mano-obra').value) || 0;
        this.costos.gastosGenerales = parseFloat(document.getElementById('gastos-generales').value) || 0;
        this.costos.margenGanancia = parseFloat(document.getElementById('margen-ganancia').value) || 0;
        this.costos.cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    }

    // Calcular total de materiales
    calcularMateriales() {
        return this.costos.producto +
               this.costos.tinta +
               this.costos.empaque +
               this.costos.otrosMateriales;
    }

    // Calcular costo base (materiales + mano de obra)
    calcularCostoBase() {
        return this.calcularMateriales() + this.costos.manoObra;
    }

    // Calcular gastos generales
    calcularGastosGenerales() {
        const costoBase = this.calcularCostoBase();
        return (costoBase * this.costos.gastosGenerales) / 100;
    }

    // Calcular costo total unitario
    calcularCostoTotal() {
        return this.calcularCostoBase() + this.calcularGastosGenerales();
    }

    // Calcular ganancia
    calcularGanancia() {
        const costoTotal = this.calcularCostoTotal();
        return (costoTotal * this.costos.margenGanancia) / 100;
    }

    // Calcular precio de venta unitario
    calcularPrecioVentaUnitario() {
        let precioBase = this.calcularCostoTotal() + this.calcularGanancia();

        // Aplicar descuento por volumen si está activado
        const aplicarDescuento = document.getElementById('aplicar-descuento-volumen').checked;
        if (aplicarDescuento && window.descuentosManager) {
            const descuento = window.descuentosManager.obtenerDescuento(this.costos.cantidad);
            precioBase = precioBase * (1 - descuento / 100);
        }

        return precioBase;
    }

    // Calcular precio total (unitario * cantidad)
    calcularPrecioTotal() {
        return this.calcularPrecioVentaUnitario() * this.costos.cantidad;
    }

    // Obtener descuento aplicado
    obtenerDescuentoAplicado() {
        const aplicarDescuento = document.getElementById('aplicar-descuento-volumen').checked;
        if (aplicarDescuento && window.descuentosManager) {
            return window.descuentosManager.obtenerDescuento(this.costos.cantidad);
        }
        return 0;
    }

    // Formatear número a moneda peruana
    formatearMoneda(valor) {
        return 'S/ ' + valor.toFixed(2);
    }

    // Realizar todos los cálculos y devolver resultados
    calcular() {
        this.obtenerValoresFormulario();
        const descuentoAplicado = this.obtenerDescuentoAplicado();
        const gananciaBase = this.calcularGanancia();
        const precioUnitario = this.calcularPrecioVentaUnitario();
        const costoTotal = this.calcularCostoTotal();

        // Calcular ganancia real después del descuento
        const gananciaReal = precioUnitario - costoTotal;

        return {
            nombreProducto: this.nombreProducto,
            materiales: {
                producto: this.costos.producto,
                tinta: this.costos.tinta,
                empaque: this.costos.empaque,
                otros: this.costos.otrosMateriales,
                total: this.calcularMateriales()
            },
            manoObra: this.costos.manoObra,
            gastosGenerales: this.calcularGastosGenerales(),
            porcentajeGG: this.costos.gastosGenerales,
            costoTotal: costoTotal,
            gananciaBase: gananciaBase,
            gananciaReal: gananciaReal,
            ganancia: gananciaReal, // Para compatibilidad
            porcentajeGanancia: this.costos.margenGanancia,
            porcentajeGananciaReal: ((gananciaReal / costoTotal) * 100),
            precioUnitario: precioUnitario,
            cantidad: this.costos.cantidad,
            precioTotal: this.calcularPrecioTotal(),
            descuentoVolumen: descuentoAplicado,
            fecha: new Date().toISOString()
        };
    }

    // Mostrar resultados en la interfaz
    mostrarResultados(resultados) {
        // Mostrar sección de resultados
        document.getElementById('resultados').style.display = 'block';

        // Mostrar info de descuento si aplica
        const infoDescuento = document.getElementById('info-descuento');
        if (resultados.descuentoVolumen > 0) {
            infoDescuento.style.display = 'block';
            document.getElementById('descuento-aplicado-texto').textContent =
                `${resultados.descuentoVolumen}% de descuento (${resultados.cantidad} unidades)`;
        } else {
            infoDescuento.style.display = 'none';
        }

        // Precio de venta
        document.getElementById('precio-unitario').textContent = this.formatearMoneda(resultados.precioUnitario);
        document.getElementById('precio-total').textContent = this.formatearMoneda(resultados.precioTotal);
        document.getElementById('cantidad-display').textContent = resultados.cantidad;

        // Mostrar/ocultar sección de totales
        const resumenTotales = document.getElementById('resumen-totales');
        if (resultados.cantidad > 1) {
            resumenTotales.style.display = 'block';
            document.getElementById('total-materiales-cantidad').textContent = this.formatearMoneda(resultados.materiales.total * resultados.cantidad);
            document.getElementById('total-mano-obra-cantidad').textContent = this.formatearMoneda(resultados.manoObra * resultados.cantidad);
            document.getElementById('total-gastos-cantidad').textContent = this.formatearMoneda(resultados.gastosGenerales * resultados.cantidad);
            document.getElementById('total-costos-cantidad').textContent = this.formatearMoneda(resultados.costoTotal * resultados.cantidad);
            document.getElementById('total-ganancia-cantidad').textContent = this.formatearMoneda(resultados.ganancia * resultados.cantidad);
            document.getElementById('cantidad-resumen').textContent = resultados.cantidad;
        } else {
            resumenTotales.style.display = 'none';
        }

        // Desglose de materiales
        document.getElementById('materiales-total').textContent = this.formatearMoneda(resultados.materiales.total);
        document.getElementById('resultado-producto').textContent = this.formatearMoneda(resultados.materiales.producto);
        document.getElementById('resultado-tinta').textContent = this.formatearMoneda(resultados.materiales.tinta);
        document.getElementById('resultado-empaque').textContent = this.formatearMoneda(resultados.materiales.empaque);
        document.getElementById('resultado-otros').textContent = this.formatearMoneda(resultados.materiales.otros);

        // Otros costos
        document.getElementById('resultado-mano-obra').textContent = this.formatearMoneda(resultados.manoObra);
        document.getElementById('resultado-gastos').textContent = this.formatearMoneda(resultados.gastosGenerales);
        document.getElementById('porcentaje-gg').textContent = resultados.porcentajeGG;

        // Costo total y ganancia
        document.getElementById('costo-total').textContent = this.formatearMoneda(resultados.costoTotal);

        // Mostrar ganancia con o sin descuento
        if (resultados.descuentoVolumen > 0) {
            // Con descuento, mostrar ganancia real
            document.getElementById('resultado-ganancia').textContent = this.formatearMoneda(resultados.gananciaReal);
            document.getElementById('porcentaje-ganancia').textContent =
                `${resultados.porcentajeGanancia}% → ${resultados.porcentajeGananciaReal.toFixed(1)}%`;
        } else {
            // Sin descuento, mostrar ganancia normal
            document.getElementById('resultado-ganancia').textContent = this.formatearMoneda(resultados.ganancia);
            document.getElementById('porcentaje-ganancia').textContent = resultados.porcentajeGanancia;
        }

        // Scroll suave a resultados en móvil
        if (window.innerWidth < 768) {
            document.getElementById('resultados').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Limpiar formulario
    limpiarFormulario() {
        document.getElementById('producto-nombre').value = '';
        document.getElementById('costo-producto').value = '';
        document.getElementById('costo-tinta').value = '';
        document.getElementById('costo-empaque').value = '';
        document.getElementById('otros-materiales').value = '';
        document.getElementById('mano-obra').value = '';
        document.getElementById('gastos-generales').value = '10';
        document.getElementById('margen-ganancia').value = '40';
        document.getElementById('cantidad').value = '1';

        // Limpiar descuento por volumen
        document.getElementById('aplicar-descuento-volumen').checked = false;
        document.getElementById('configurar-descuentos-btn').style.display = 'none';

        // Limpiar productos activos
        document.querySelectorAll('.product-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Ocultar resultados
        document.getElementById('resultados').style.display = 'none';
    }

    // Cargar datos desde objeto
    cargarDatos(datos) {
        document.getElementById('producto-nombre').value = datos.nombreProducto || '';
        document.getElementById('costo-producto').value = datos.materiales.producto || 0;
        document.getElementById('costo-tinta').value = datos.materiales.tinta || 0;
        document.getElementById('costo-empaque').value = datos.materiales.empaque || 0;
        document.getElementById('otros-materiales').value = datos.materiales.otros || 0;
        document.getElementById('mano-obra').value = datos.manoObra || 0;
        document.getElementById('gastos-generales').value = datos.porcentajeGG || 10;
        document.getElementById('margen-ganancia').value = datos.porcentajeGanancia || 40;
        document.getElementById('cantidad').value = datos.cantidad || 1;

        // Restaurar configuración de descuento
        const checkboxDescuento = document.getElementById('aplicar-descuento-volumen');
        const btnConfigurar = document.getElementById('configurar-descuentos-btn');

        if (datos.descuentoVolumen > 0) {
            checkboxDescuento.checked = true;
            btnConfigurar.style.display = 'inline-block';
        } else {
            checkboxDescuento.checked = false;
            btnConfigurar.style.display = 'none';
        }
    }
}

// Exportar para uso global
window.CalculadoraSublimacion = CalculadoraSublimacion;
