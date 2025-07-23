// Utilidades para manejo de audio y reproductores
// Centraliza la lógica común de reproducción de audio

/**
 * Clase utilitaria para manejo de audio del piano
 */
class AudioUtils {
    /**
     * Valida que el sistema de audio esté disponible
     * @returns {boolean} - True si pianoAudio está disponible
     */
    static isAudioAvailable() {
        return typeof pianoAudio !== 'undefined';
    }

    /**
     * Parsea JSON de notas de forma segura
     * @param {string} notesJson - JSON string con las notas
     * @returns {Array|null} - Array de notas o null si hay error
     */
    static parseNotesJson(notesJson) {
        try {
            return JSON.parse(notesJson.replace(/&quot;/g, '"'));
        } catch (error) {
            console.error('Error al parsear notas JSON:', error);
            return null;
        }
    }

    /**
     * Muestra error de audio de forma consistente
     * @param {string} operation - Operación que falló
     * @param {Error} error - Error ocurrido
     */
    static showAudioError(operation, error) {
        console.error(`Error al ${operation}:`, error);
        alert(`Error al ${operation}. Verifica que tu navegador permita audio.`);
    }

    /**
     * Reproduce un acorde desde JSON
     * @param {string} notesJson - Notas del acorde en formato JSON
     * @param {number} duration - Duración de reproducción
     */
    static async playChordFromJson(notesJson, duration = 2.0) {
        if (!this.isAudioAvailable()) {
            alert('Sistema de audio no disponible');
            return;
        }

        const notes = this.parseNotesJson(notesJson);
        if (!notes) {
            this.showAudioError('parsear las notas del acorde', new Error('JSON inválido'));
            return;
        }

        try {
            await pianoAudio.playChord(notes, duration);
        } catch (error) {
            this.showAudioError('reproducir el acorde', error);
        }
    }

    /**
     * Reproduce notas secuencialmente desde JSON
     * @param {string} notesJson - Notas en formato JSON
     * @param {number} noteDuration - Duración de cada nota
     * @param {number} pauseBetween - Pausa entre notas en ms
     */
    static async playNotesSequentiallyFromJson(notesJson, noteDuration = 0.8, pauseBetween = 400) {
        if (!this.isAudioAvailable()) {
            alert('Sistema de audio no disponible');
            return;
        }

        const notes = this.parseNotesJson(notesJson);
        if (!notes) {
            this.showAudioError('parsear las notas', new Error('JSON inválido'));
            return;
        }

        try {
            for (let i = 0; i < notes.length; i++) {
                await pianoAudio.playNote(notes[i], noteDuration);
                if (i < notes.length - 1) { // No pausar después de la última nota
                    await pianoAudio.delay(pauseBetween);
                }
            }
        } catch (error) {
            this.showAudioError('reproducir las notas secuencialmente', error);
        }
    }

    /**
     * Reproduce una nota individual
     * @param {string} note - Nota a reproducir
     * @param {number} duration - Duración de la nota
     */
    static async playNote(note, duration = 1.0) {
        if (!this.isAudioAvailable()) {
            console.warn('Sistema de audio no disponible');
            return;
        }

        try {
            await pianoAudio.playNote(note, duration);
        } catch (error) {
            console.warn(`No se pudo reproducir la nota ${note}:`, error);
        }
    }

    /**
     * Detiene todo el audio
     */
    static stopAllAudio() {
        if (this.isAudioAvailable()) {
            pianoAudio.stopAll();
        }
    }

    /**
     * Configura el volumen maestro
     * @param {number} volume - Volumen (0-1)
     */
    static setMasterVolume(volume) {
        if (this.isAudioAvailable()) {
            pianoAudio.setMasterVolume(volume);
        }
    }

    /**
     * Reproduce un acorde automáticamente al seleccionarlo
     * @param {Object} chordData - Datos del acorde seleccionado
     */
    static async playChordSelection(chordData) {
        if (!this.isAudioAvailable()) return;

        try {
            await pianoAudio.playChord(
                chordData.notes,
                AudioConfig.ui.chordSelectionDuration
            );
        } catch (error) {
            console.error('Error al reproducir acorde seleccionado:', error);
        }
    }
}

// Funciones globales para mantener compatibilidad con HTML existente
window.playCurrentChord = (notesJson) => AudioUtils.playChordFromJson(notesJson);
window.playNotesSequentially = (notesJson) => AudioUtils.playNotesSequentiallyFromJson(notesJson);
window.playKeySound = (note) => AudioUtils.playNote(note);

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AudioUtils };
}
