// Utilidades para manejo de interfaz de usuario
// Centraliza lógica común de UI y configuración de elementos

/**
 * Clase utilitaria para manejo de UI
 */
class UIUtils {
    /**
     * Configura un botón con estado de carga
     * @param {HTMLElement} button - Elemento del botón
     * @param {string} loadingText - Texto durante carga
     * @param {string} originalText - Texto original
     * @param {Function} action - Función a ejecutar
     */
    static async setupButtonWithLoading(button, loadingText, originalText, action) {
        if (!button) return;

        button.disabled = true;
        button.textContent = loadingText;

        try {
            await action();
        } catch (error) {
            console.error('Error en acción de botón:', error);
            throw error;
        } finally {
            button.disabled = false;
            button.textContent = originalText;
        }
    }

    /**
     * Crea un botón de audio estándar
     * @param {string} text - Texto del botón
     * @param {string} emoji - Emoji del botón
     * @param {string} bgColor - Color de fondo (bg-green-500, etc.)
     * @param {Function} onClick - Función al hacer click
     * @returns {string} - HTML del botón
     */
    static createAudioButton(text, emoji, bgColor, onClick) {
        const onClickAttr = onClick ? `onclick="${onClick}"` : '';
        const hoverColor = bgColor.replace('500', '600');

        return `
            <button
                class="px-4 py-2 ${bgColor} text-white rounded-lg font-medium hover:${hoverColor} transition-colors text-sm"
                ${onClickAttr}
            >
                ${emoji} ${text}
            </button>
        `;
    }

    /**
     * Actualiza múltiples elementos de texto de una vez
     * @param {Object} updates - Objeto con id: texto a actualizar
     */
    static updateTextElements(updates) {
        Object.entries(updates).forEach(([id, text]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = text;
            }
        });
    }

    /**
     * Toggle de clases CSS en elementos
     * @param {string} selector - Selector CSS
     * @param {string} className - Clase a alternar
     * @param {boolean} force - Forzar agregar (true) o quitar (false)
     */
    static toggleClass(selector, className, force = undefined) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (force !== undefined) {
                element.classList.toggle(className, force);
            } else {
                element.classList.toggle(className);
            }
        });
    }

    /**
     * Muestra/oculta elementos por ID
     * @param {string} elementId - ID del elemento
     * @param {boolean} show - Mostrar (true) u ocultar (false)
     */
    static toggleVisibility(elementId, show) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = show ? 'block' : 'none';
        }
    }

    /**
     * Configura un slider con callback de cambio
     * @param {string} sliderId - ID del slider
     * @param {string} valueId - ID del elemento que muestra el valor
     * @param {Function} onChange - Callback cuando cambia el valor
     * @param {string} suffix - Sufijo para el valor (%, BPM, etc.)
     */
    static setupSlider(sliderId, valueId, onChange, suffix = '') {
        const slider = document.getElementById(sliderId);
        const valueDisplay = document.getElementById(valueId);

        if (!slider || !valueDisplay) return;

        slider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            valueDisplay.textContent = value + suffix;

            if (onChange) {
                onChange(value);
            }
        });
    }

    /**
     * Limpia y actualiza el contenido de un contenedor
     * @param {string} containerId - ID del contenedor
     * @param {string} newContent - Nuevo contenido HTML
     */
    static updateContainer(containerId, newContent) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = newContent;
        }
    }

    /**
     * Añade un event listener de forma segura
     * @param {string} elementId - ID del elemento
     * @param {string} event - Tipo de evento
     * @param {Function} handler - Manejador del evento
     */
    static addEventListenerSafe(elementId, event, handler) {
        const element = document.getElementById(elementId);
        if (element && handler) {
            element.addEventListener(event, handler);
        }
    }

    /**
     * Configura elementos de audio control de forma estándar
     * @param {Object} controls - Objeto con configuración de controles
     */
    static setupAudioControls(controls) {
        // Volume control
        if (controls.volume) {
            this.setupSlider(
                controls.volume.sliderId,
                controls.volume.valueId,
                controls.volume.onChange,
                '%'
            );
        }

        // Tempo control
        if (controls.tempo) {
            this.setupSlider(
                controls.tempo.sliderId,
                controls.tempo.valueId,
                controls.tempo.onChange,
                ''
            );
        }

        // Test button
        if (controls.testButton) {
            this.addEventListenerSafe(
                controls.testButton.buttonId,
                'click',
                controls.testButton.onClick
            );
        }

        // Stop button
        if (controls.stopButton) {
            this.addEventListenerSafe(
                controls.stopButton.buttonId,
                'click',
                controls.stopButton.onClick
            );
        }
    }

    /**
     * Valida que todos los elementos requeridos existan
     * @param {Array} elementIds - Array de IDs a validar
     * @returns {boolean} - True si todos existen
     */
    static validateElements(elementIds) {
        return elementIds.every(id => {
            const exists = document.getElementById(id) !== null;
            if (!exists) {
                console.warn(`Elemento no encontrado: ${id}`);
            }
            return exists;
        });
    }

    /**
     * Crea un elemento DOM de forma fluida
     * @param {string} tag - Tag del elemento
     * @param {Object} attributes - Atributos del elemento
     * @param {string} content - Contenido HTML interno
     * @returns {HTMLElement} - Elemento creado
     */
    static createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);

        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else {
                element.setAttribute(key, value);
            }
        });

        if (content) {
            element.innerHTML = content;
        }

        return element;
    }
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UIUtils };
}
