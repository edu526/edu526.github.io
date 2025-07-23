// Configuración central del sistema de audio del piano
//
// Esta configuración utiliza un enfoque centralizado donde:
// - Los valores maestros están en 'defaults' (masterVolume: 0.60, tempo: 110)
// - Los valores de UI se calculan automáticamente desde 'defaults' usando getters
// - Ejemplo: ui.volumeSliderDefault retorna automáticamente 60% (desde defaults.masterVolume 0.60)
// - No hay duplicación de valores, todo se mantiene sincronizado automáticamente

const AudioConfig = {
    // Configuraciones básicas de audio
    defaults: {
        // Volumen maestro por defecto (0-1)
        masterVolume: 0.60,

        // Tempo por defecto (BPM)
        tempo: 110,

        // Duración por defecto de notas y acordes (segundos)
        noteDuration: 1.5,
        chordDuration: 1.8,
        pauseBetweenChords: 0.2,

        // Rango de controles de UI
        volumeRange: {
            min: 0,
            max: 100,
            step: 1
        },
        tempoRange: {
            min: 40,
            max: 120,
            step: 1
        }
    },

    // Configuraciones de síntesis de audio
    synthesis: {
        // Configuración del reverb
        reverb: {
            duration: 2.0, // segundos
            decay: 0.3,
            dryGainLevel: 0.8,
            wetGainLevel: 0.2
        },

        // Configuración del filtro paso-bajo
        lowPassFilter: {
            baseFrequency: 3000,
            frequencyMultiplier: 2,
            qValue: 1
        },

        // Armónicos para simular el sonido del piano
        harmonics: [
            { multiplier: 1, volume: 1.0, type: 'triangle' },    // Fundamental
            { multiplier: 2, volume: 0.4, type: 'sine' },       // Octava
            { multiplier: 3, volume: 0.25, type: 'triangle' },  // Quinta perfecta
            { multiplier: 4, volume: 0.15, type: 'sine' },      // Doble octava
            { multiplier: 5, volume: 0.1, type: 'triangle' },   // Tercera mayor
            { multiplier: 6, volume: 0.08, type: 'sine' },      // Quinta + octava
            { multiplier: 8, volume: 0.05, type: 'triangle' }   // Triple octava
        ],

        // Configuración de desafinación para naturalidad
        detune: {
            range: 3, // ±1.5 cents
            factor: 0.5
        }
    },

    // Configuraciones de envolvente ADSR
    envelope: {
        // Para frecuencias graves (< 200 Hz)
        lowFrequency: {
            threshold: 200,
            attack: 0.02,
            decay: 0.4,
            sustain: 0.8,
            release: 1.2
        },

        // Para frecuencias agudas (>= 200 Hz)
        highFrequency: {
            attack: 0.005,
            decay: 0.15,
            sustain: 0.6,
            release: 0.4
        },

        // Factor de multiplicación para armónicos
        harmonicDecayMultiplier: 0.3,

        // Factor máximo para release time
        maxReleaseFactor: 0.4
    },

    // Frecuencias de las notas musicales (Hz)
    noteFrequencies: {
        'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41, 'F2': 87.31,
        'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'B2': 123.47,
        'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61,
        'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
        'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23,
        'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
        'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25
    },

    // Descripciones de tempo
    tempoDescriptions: {
        ranges: [
            { max: 60, description: 'Muy Lento (Largo)' },
            { max: 72, description: 'Lento (Adagio)' },
            { max: 84, description: 'Moderado Lento' },
            { max: 108, description: 'Moderado' },
            { max: Infinity, description: 'Rápido (Allegro)' }
        ]
    },

    // Configuraciones de la interfaz de usuario
    ui: {
        // Valores por defecto en los sliders (calculados dinámicamente desde defaults)
        // volumeSliderDefault se calcula automáticamente desde defaults.masterVolume
        // tempoSliderDefault se referencia directamente desde defaults.tempo
        get volumeSliderDefault() {
            return AudioConfig.utils.volumeToPercentage(AudioConfig.defaults.masterVolume);
        },
        get tempoSliderDefault() {
            return AudioConfig.defaults.tempo;
        },

        // Configuración del loading
        calculationDelay: 300, // ms

        // Configuración de audio feedback
        testNote: 'C4',
        testDuration: 1.0,

        // Configuración del sticky header
        stickyHeader: {
            // Porcentaje de visibilidad mínimo para mostrar sticky header
            // Cuando la sección de acordes tiene menos de este porcentaje visible, se muestra el sticky
            visibilityThreshold: 0.5, // 50% - cuando solo queda 30% o menos visible

            // Thresholds para el IntersectionObserver
            observerThresholds: [0, 0.1, 0.2, 0.3, 0.5, 0.7, 1.0],

            // Margen del observer (para ajustes finos de detección)
            observerRootMargin: '0px 0px 0px 0px'
        }
    },

    // Funciones utilitarias
    utils: {
        /**
         * Obtiene la configuración ADSR basada en la frecuencia
         * @param {number} frequency - Frecuencia de la nota
         * @returns {Object} Configuración ADSR
         */
        getEnvelopeConfig(frequency) {
            const config = this.envelope;
            if (frequency < config.lowFrequency.threshold) {
                return config.lowFrequency;
            } else {
                return config.highFrequency;
            }
        },

        /**
         * Obtiene la descripción del tempo basada en BPM
         * @param {number} bpm - Beats por minuto
         * @returns {string} Descripción del tempo
         */
        getTempoDescription(bpm) {
            const ranges = this.tempoDescriptions.ranges;
            for (let range of ranges) {
                if (bpm < range.max) {
                    return range.description;
                }
            }
            return ranges[ranges.length - 1].description;
        },

        /**
         * Convierte porcentaje a valor de volumen (0-1)
         * @param {number} percentage - Porcentaje (0-100)
         * @returns {number} Valor de volumen (0-1)
         */
        percentageToVolume(percentage) {
            return Math.max(0, Math.min(1, percentage / 100));
        },

        /**
         * Convierte volumen (0-1) a porcentaje
         * @param {number} volume - Valor de volumen (0-1)
         * @returns {number} Porcentaje (0-100)
         */
        volumeToPercentage(volume) {
            return Math.round(Math.max(0, Math.min(100, volume * 100)));
        },

        /**
         * Calcula la duración de un acorde basada en el tempo
         * @param {number} bpm - Beats por minuto
         * @param {number} beats - Número de beats por acorde (default: 4)
         * @returns {number} Duración en segundos
         */
        calculateChordDuration(bpm, beats = 4) {
            return (60 / bpm) * beats;
        },

        /**
         * Valida configuraciones
         * Verifica que los valores estén en rangos válidos
         */
        validateAndSync() {
            const volumePercentage = AudioConfig.ui.volumeSliderDefault;
            const tempo = AudioConfig.ui.tempoSliderDefault;
            const volumeRange = AudioConfig.defaults.volumeRange;
            const tempoRange = AudioConfig.defaults.tempoRange;

            // Validar que los valores estén dentro de los rangos permitidos
            const volumeValid = volumePercentage >= volumeRange.min && volumePercentage <= volumeRange.max;
            const tempoValid = tempo >= tempoRange.min && tempo <= tempoRange.max;

            if (!volumeValid) {
                console.warn(`Volumen fuera de rango: ${volumePercentage}% (rango: ${volumeRange.min}-${volumeRange.max}%)`);
            }

            if (!tempoValid) {
                console.warn(`Tempo fuera de rango: ${tempo} BPM (rango: ${tempoRange.min}-${tempoRange.max} BPM)`);
            }

            console.log(`Configuración validada - Volumen: ${volumePercentage}%, Tempo: ${tempo} BPM`);

            return {
                volumeValid,
                tempoValid,
                allValid: volumeValid && tempoValid
            };
        },

        /**
         * Función de conveniencia para cambiar configuraciones principales
         * @param {Object} newConfig - Objeto con nuevas configuraciones
         * @param {number} newConfig.volume - Nuevo volumen (0-1)
         * @param {number} newConfig.tempo - Nuevo tempo (BPM)
         */
        updateDefaults(newConfig) {
            if (newConfig.volume !== undefined) {
                const oldVolume = AudioConfig.defaults.masterVolume;
                AudioConfig.defaults.masterVolume = Math.max(0, Math.min(1, newConfig.volume));
                console.log(`Volumen actualizado: ${oldVolume} -> ${AudioConfig.defaults.masterVolume} (UI: ${AudioConfig.ui.volumeSliderDefault}%)`);
            }

            if (newConfig.tempo !== undefined) {
                const oldTempo = AudioConfig.defaults.tempo;
                const tempoRange = AudioConfig.defaults.tempoRange;
                AudioConfig.defaults.tempo = Math.max(tempoRange.min, Math.min(tempoRange.max, newConfig.tempo));
                console.log(`Tempo actualizado: ${oldTempo} -> ${AudioConfig.defaults.tempo} BPM`);
            }

            // Re-validar después del cambio
            return this.validateAndSync();
        }
    }
};

// Validar configuraciones al cargar
if (typeof window !== 'undefined') {
    window.AudioConfig = AudioConfig;
    // Ejecutar validación después de que se cargue la configuración
    setTimeout(() => {
        const validation = AudioConfig.utils.validateAndSync.call(AudioConfig);
        console.log('Validación de configuración:', validation);

        // Ejemplo de cómo los valores están sincronizados automáticamente:
        console.log('=== Demostración de sincronización automática ===');
        console.log(`defaults.masterVolume: ${AudioConfig.defaults.masterVolume} -> ui.volumeSliderDefault: ${AudioConfig.ui.volumeSliderDefault}%`);
        console.log(`defaults.tempo: ${AudioConfig.defaults.tempo} -> ui.tempoSliderDefault: ${AudioConfig.ui.tempoSliderDefault}`);
        console.log('=== Para cambiar valores, solo modifica AudioConfig.defaults ===');
    }, 0);
}

// Exportar para módulos ES6/CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioConfig;
}

// Exportar para módulos ES6
if (typeof exports !== 'undefined') {
    exports.AudioConfig = AudioConfig;
}
