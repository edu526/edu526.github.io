// Sistema de audio para el piano usando Web Audio API

class PianoAudio {
    constructor() {
        this.audioContext = null;
        this.isInitialized = false;
        this.currentlyPlaying = new Set();
        this.masterVolume = 0.3;
        this.reverbNode = null;
        this.masterGainNode = null;
        this.activeOscillators = new Set();
        this.isProgressionCancelled = false; // Bandera para cancelar progresiones

        // Frecuencias de las notas musicales (Hz)
        this.noteFrequencies = {
            'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'B2': 123.47,
            'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
            'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
            'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25
        };
    }

    /**
     * Inicializa el contexto de audio
     */
    async initialize() {
        if (this.isInitialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Crear nodo de ganancia maestro
            this.masterGainNode = this.audioContext.createGain();
            this.masterGainNode.gain.setValueAtTime(this.masterVolume, this.audioContext.currentTime);

            // Crear reverb para dar espacialidad
            await this.createReverb();

            // Conectar al destino
            this.masterGainNode.connect(this.audioContext.destination);

            this.isInitialized = true;
            console.log('Sistema de audio inicializado correctamente');
        } catch (error) {
            console.error('Error al inicializar el sistema de audio:', error);
            throw new Error('No se pudo inicializar el sistema de audio');
        }
    }

    /**
     * Crea un efecto de reverb natural
     */
    async createReverb() {
        const convolver = this.audioContext.createConvolver();
        const reverbGain = this.audioContext.createGain();
        const dryGain = this.audioContext.createGain();

        // Crear impulse response sintético para reverb
        const length = this.audioContext.sampleRate * 2; // 2 segundos
        const impulse = this.audioContext.createBuffer(2, length, this.audioContext.sampleRate);

        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                const decay = Math.pow(1 - i / length, 2);
                channelData[i] = (Math.random() * 2 - 1) * decay * 0.3;
            }
        }

        convolver.buffer = impulse;

        // Configurar mezcla dry/wet
        dryGain.gain.setValueAtTime(0.8, this.audioContext.currentTime);
        reverbGain.gain.setValueAtTime(0.2, this.audioContext.currentTime);

        // Crear el nodo de reverb
        this.reverbNode = this.audioContext.createGain();

        // Conectar las señales
        this.reverbNode.connect(dryGain);
        this.reverbNode.connect(convolver);
        convolver.connect(reverbGain);

        dryGain.connect(this.masterGainNode);
        reverbGain.connect(this.masterGainNode);
    }

    /**
     * Toca una nota individual
     * @param {string} note - Nota a tocar (ej: 'C4', 'F#3')
     * @param {number} duration - Duración en segundos
     * @param {number} volume - Volumen (0-1)
     */
    async playNote(note, duration = 1.5, volume = null) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        const frequency = this.noteFrequencies[note];
        if (!frequency) {
            console.warn(`Frecuencia no encontrada para la nota: ${note}`);
            return;
        }

        const actualVolume = volume !== null ? volume : this.masterVolume;
        const noteKey = `${note}-${Date.now()}`;

        try {
            // Crear múltiples osciladores para simular armónicos naturales del piano
            const oscillators = [];
            const gainNodes = [];
            const masterGain = this.audioContext.createGain();

            // Crear filtro paso-bajo para suavizar el sonido
            const lowPassFilter = this.audioContext.createBiquadFilter();
            lowPassFilter.type = 'lowpass';
            lowPassFilter.frequency.setValueAtTime(3000 + frequency * 2, this.audioContext.currentTime);
            lowPassFilter.Q.setValueAtTime(1, this.audioContext.currentTime);

            // Armónicos que simulan las cuerdas del piano
            const harmonics = [
                { multiplier: 1, volume: 1.0, type: 'triangle' },      // Fundamental
                { multiplier: 2, volume: 0.4, type: 'sine' },          // Octava
                { multiplier: 3, volume: 0.25, type: 'triangle' },     // Quinta perfecta
                { multiplier: 4, volume: 0.15, type: 'sine' },         // Doble octava
                { multiplier: 5, volume: 0.1, type: 'triangle' },      // Tercera mayor
                { multiplier: 6, volume: 0.08, type: 'sine' },         // Quinta + octava
                { multiplier: 8, volume: 0.05, type: 'triangle' }      // Triple octava
            ];

            harmonics.forEach((harmonic, index) => {
                const osc = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();

                osc.type = harmonic.type;
                osc.frequency.setValueAtTime(frequency * harmonic.multiplier, this.audioContext.currentTime);

                // Agregar ligera desafinación para naturalidad
                const detune = (Math.random() - 0.5) * 3; // ±1.5 cents
                osc.detune.setValueAtTime(detune, this.audioContext.currentTime);

                gainNode.gain.setValueAtTime(harmonic.volume, this.audioContext.currentTime);

                osc.connect(gainNode);
                gainNode.connect(masterGain);

                oscillators.push(osc);
                gainNodes.push(gainNode);
            });

            // Conectar filtro y salida
            masterGain.connect(lowPassFilter);

            // Conectar al sistema de reverb si está disponible
            if (this.reverbNode) {
                lowPassFilter.connect(this.reverbNode);
            } else {
                lowPassFilter.connect(this.audioContext.destination);
            }

            // Configurar envolvente ADSR más realista para piano
            const now = this.audioContext.currentTime;

            // Parámetros ADSR adaptados según la frecuencia (graves más lentos, agudos más rápidos)
            const baseAttackTime = frequency < 200 ? 0.02 : 0.005;  // Graves más lentos
            const baseDecayTime = frequency < 200 ? 0.4 : 0.15;     // Graves con más sustain
            const sustainLevel = frequency < 200 ? 0.8 : 0.6;       // Graves más resonantes
            const baseReleaseTime = frequency < 200 ? 1.2 : 0.4;    // Graves más largos

            const attackTime = baseAttackTime;
            const decayTime = baseDecayTime;
            const releaseTime = Math.min(baseReleaseTime, duration * 0.4);

            // Envolvente principal
            masterGain.gain.setValueAtTime(0, now);
            masterGain.gain.exponentialRampToValueAtTime(actualVolume, now + attackTime);
            masterGain.gain.exponentialRampToValueAtTime(actualVolume * sustainLevel, now + attackTime + decayTime);
            masterGain.gain.setValueAtTime(actualVolume * sustainLevel, now + duration - releaseTime);
            masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

            // Modificar armónicos durante la reproducción para más realismo
            gainNodes.forEach((gainNode, index) => {
                const harmonic = harmonics[index];
                const harmonicVolume = actualVolume * harmonic.volume;

                // Los armónicos superiores decaen más rápido
                const harmonicDecayMultiplier = 1 + (index * 0.3);
                const harmonicSustainLevel = sustainLevel / harmonicDecayMultiplier;

                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.exponentialRampToValueAtTime(harmonicVolume, now + attackTime);
                gainNode.gain.exponentialRampToValueAtTime(harmonicVolume * harmonicSustainLevel, now + attackTime + decayTime * harmonicDecayMultiplier);
                gainNode.gain.setValueAtTime(harmonicVolume * harmonicSustainLevel, now + duration - releaseTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
            });

            // Modular ligeramente el filtro para añadir vida al sonido
            if (duration > 1) {
                lowPassFilter.frequency.exponentialRampToValueAtTime(
                    (3000 + frequency * 2) * 0.7,
                    now + duration * 0.3
                );
            }

            // Iniciar osciladores
            oscillators.forEach(osc => {
                osc.start(now);
                osc.stop(now + duration);
                this.activeOscillators.add(osc);

                // Limpiar cuando termine
                osc.onended = () => {
                    this.activeOscillators.delete(osc);
                };
            });

            this.currentlyPlaying.add(noteKey);

            // Limpiar después de que termine la nota
            setTimeout(() => {
                this.currentlyPlaying.delete(noteKey);
            }, duration * 1000);

        } catch (error) {
            console.error(`Error al tocar la nota ${note}:`, error);
        }
    }

    /**
     * Toca un acorde (múltiples notas simultáneamente)
     * @param {string[]} notes - Array de notas del acorde
     * @param {number} duration - Duración en segundos
     * @param {number} volume - Volumen (0-1)
     */
    async playChord(notes, duration = 2, volume = null) {
        if (!Array.isArray(notes) || notes.length === 0) return;

        const actualVolume = (volume !== null ? volume : this.masterVolume) / Math.sqrt(notes.length);

        // Tocar todas las notas del acorde simultáneamente
        const promises = notes.map(note =>
            this.playNote(note, duration, actualVolume)
        );

        await Promise.all(promises);
    }

    /**
     * Toca una secuencia de acordes
     * @param {Array} chordProgression - Array de objetos con acordes y digitaciones
     * @param {number} chordDuration - Duración de cada acorde en segundos
     * @param {number} pauseBetween - Pausa entre acordes en segundos
     */
    async playProgression(chordProgression, chordDuration = 1.8, pauseBetween = 0.2) {
        console.log(`Iniciando progresión: ${chordProgression.length} acordes, cada uno dura ${chordDuration.toFixed(3)}s`);

        // Resetear bandera de cancelación al iniciar
        this.isProgressionCancelled = false;

        for (let i = 0; i < chordProgression.length; i++) {
            // Verificar si se ha cancelado la progresión
            if (this.isProgressionCancelled) {
                console.log('Progresión cancelada por el usuario');
                return;
            }

            const chord = chordProgression[i];
            // Cada acorde es el primer beat (1/4) de su propio compás
            console.log(`Tocando acorde 1/4 (compás ${i + 1}): ${chord.symbol}`);

            // Detener todos los sonidos anteriores antes de tocar el siguiente acorde
            if (i > 0) {
                this.stopAllExceptCancellation();
                // Pequeña pausa para evitar solapamiento
                await this.delay(pauseBetween * 1000);

                // Verificar cancelación después de la pausa
                if (this.isProgressionCancelled) {
                    console.log('Progresión cancelada durante pausa');
                    return;
                }
            }

            // Tocar el acorde actual (sin await para que no bloquee)
            this.playChord(chord.notes, chordDuration);

            // Esperar exactamente la duración del acorde antes del siguiente
            if (i < chordProgression.length - 1) {
                // No es el último acorde, esperar la duración completa
                await this.delay(chordDuration * 1000);
            } else {
                // Es el último acorde, solo esperar su duración
                await this.delay(chordDuration * 1000);
            }
        }

        console.log('Progresión completada');
    }    /**
     * Hace fade out gradual de los osciladores actuales
     * @param {number} fadeTime - Tiempo de fade en segundos
     */
    fadeOutCurrent(fadeTime = 0.3) {
        const now = this.audioContext.currentTime;

        this.activeOscillators.forEach(osc => {
            try {
                // Hacer fade out gradual en lugar de corte abrupto
                const gainNode = osc.gainNode || osc.context.createGain();
                if (gainNode && gainNode.gain) {
                    gainNode.gain.exponentialRampToValueAtTime(0.001, now + fadeTime);

                    // Detener después del fade
                    setTimeout(() => {
                        try {
                            osc.stop();
                        } catch (e) {
                            // Ya detenido
                        }
                    }, fadeTime * 1000);
                }
            } catch (error) {
                // Oscilador ya detenido o error
            }
        });
    }

    /**
     * Detiene todas las notas que se están reproduciendo actualmente
     */
    stopAll() {
        // Cancelar cualquier progresión en curso
        this.isProgressionCancelled = true;

        // Detener todos los osciladores activos inmediatamente
        this.activeOscillators.forEach(osc => {
            try {
                osc.stop();
            } catch (error) {
                // Oscilador ya detenido
            }
        });

        this.activeOscillators.clear();
        this.currentlyPlaying.clear();

        console.log('Todas las notas detenidas y progresión cancelada');
    }

    /**
     * Detiene solo el audio sin cancelar la progresión
     */
    stopAllExceptCancellation() {
        // Detener todos los osciladores activos inmediatamente
        this.activeOscillators.forEach(osc => {
            try {
                osc.stop();
            } catch (error) {
                // Oscilador ya detenido
            }
        });

        this.activeOscillators.clear();
        this.currentlyPlaying.clear();

        console.log('Todas las notas detenidas (sin cancelar progresión)');
    }    /**
     * Establece el volumen maestro
     * @param {number} volume - Volumen entre 0 y 1
     */
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        if (this.masterGainNode) {
            this.masterGainNode.gain.setValueAtTime(this.masterVolume, this.audioContext.currentTime);
        }
    }

    /**
     * Obtiene el volumen maestro actual
     * @returns {number} Volumen actual
     */
    getMasterVolume() {
        return this.masterVolume;
    }

    /**
     * Función auxiliar para crear pausas
     * @param {number} ms - Milisegundos de pausa
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Convierte una nota del formato usado en el piano a formato estándar
     * @param {string} note - Nota a convertir
     * @returns {string} Nota en formato estándar
     */
    normalizeNoteForAudio(note) {
        // Si la nota ya tiene octava, usarla tal como está
        if (/[0-9]/.test(note)) {
            return note;
        }

        // Si no tiene octava, agregar octava 4 por defecto
        return note + '4';
    }

    /**
     * Verifica si el sistema de audio está disponible
     * @returns {boolean} True si está disponible
     */
    isAudioAvailable() {
        return !!(window.AudioContext || window.webkitAudioContext);
    }
}

// Crear instancia global del sistema de audio
const pianoAudio = new PianoAudio();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PianoAudio, pianoAudio };
}
