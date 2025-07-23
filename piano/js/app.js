// Módulo principal de la aplicación del optimizador de digitaciones

class PianoOptimizer {
    constructor() {
        this.chordInput = document.getElementById('chordInput');
        this.calculateBtn = document.getElementById('calculateBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.resultsSection = document.getElementById('resultsSection');
        this.chordSequence = document.getElementById('chordSequence');
        this.chordInfo = document.getElementById('chordInfo');
        this.loading = document.getElementById('loading');

        // Audio controls
        this.volumeSlider = document.getElementById('volumeSlider');
        this.volumeValue = document.getElementById('volumeValue');
        this.testAudioBtn = document.getElementById('testAudioBtn');
        this.stopAllBtn = document.getElementById('stopAllBtn');
        this.tempoSlider = document.getElementById('tempoSlider');
        this.tempoValue = document.getElementById('tempoValue');
        this.tempoDescription = document.getElementById('tempoDescription');

        // Current tempo (BPM)
        this.currentTempo = AudioConfig.defaults.tempo;

        // Current progression for audio playback
        this.currentProgression = null;

        this.init();
    }

    /**
     * Inicializar la aplicación
     */
    init() {
        this.setupEventListeners();
        this.setupInitialCalculation();
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        this.calculateBtn.addEventListener('click', () => this.handleCalculate());
        this.resetBtn.addEventListener('click', () => this.handleReset());

        // Permitir calcular al presionar Enter en el input
        this.chordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleCalculate();
            }
        });

        // Audio controls
        this.setupAudioControls();
    }

    /**
     * Configurar controles de audio
     */
    setupAudioControls() {
        if (this.volumeSlider && this.volumeValue) {
            this.volumeSlider.addEventListener('input', (e) => {
                const volume = parseInt(e.target.value);
                this.volumeValue.textContent = volume + '%';
                if (typeof pianoAudio !== 'undefined') {
                    pianoAudio.setMasterVolume(volume / 100);
                }
            });
        }

        if (this.testAudioBtn) {
            this.testAudioBtn.addEventListener('click', () => this.testAudio());
        }

        if (this.stopAllBtn) {
            this.stopAllBtn.addEventListener('click', () => this.stopAllAudio());
        }

        if (this.tempoSlider && this.tempoValue && this.tempoDescription) {
            this.tempoSlider.addEventListener('input', (e) => {
                const tempo = parseInt(e.target.value);
                this.currentTempo = tempo;
                this.tempoValue.textContent = tempo;

                // Actualizar descripción del tempo usando configuración
                const description = AudioConfig.utils.getTempoDescription.call(AudioConfig, tempo);
                this.tempoDescription.textContent = description;
            });
        }
    }

    /**
     * Probar el sistema de audio
     */
    async testAudio() {
        try {
            if (typeof pianoAudio === 'undefined') {
                alert('Sistema de audio no disponible');
                return;
            }

            this.testAudioBtn.disabled = true;
            this.testAudioBtn.textContent = '🎵 Reproduciendo...';

            // Tocar nota de prueba usando configuración
            await pianoAudio.playNote(AudioConfig.ui.testNote, AudioConfig.ui.testDuration);

            this.testAudioBtn.disabled = false;
            this.testAudioBtn.textContent = '🎵 Probar Audio';
        } catch (error) {
            console.error('Error al probar audio:', error);
            alert('Error al reproducir audio. Verifica que tu navegador permita audio.');
            this.testAudioBtn.disabled = false;
            this.testAudioBtn.textContent = '🎵 Probar Audio';
        }
    }

    /**
     * Calcula la duración de cada acorde basado en el tempo (BPM) respetando 4/4
     * Cada acorde dura exactamente 4 beats (1 compás completo de 4/4)
     * @returns {Object} Objeto con duración del acorde y pausa entre acordes
     */
    calculateTimingFromTempo() {
        // Usar la función utilitaria de configuración para calcular duración
        const chordDuration = AudioConfig.utils.calculateChordDuration.call(AudioConfig, this.currentTempo);
        
        // Calcular pausa como porcentaje del compás
        const beatDuration = 60 / this.currentTempo;
        const pauseBetween = beatDuration * 0.1; // 0.1 beats para transición suave (2.5% del compás)

        const timing = {
            chordDuration: Math.max(1.0, chordDuration), // Mínimo 1 segundo
            pauseBetween: Math.max(0.05, pauseBetween)   // Mínimo 0.05 segundos
        };

        console.log(`Tempo: ${this.currentTempo} BPM`);
        console.log(`Beat duration: ${beatDuration.toFixed(3)} segundos`);
        console.log(`Chord duration: ${timing.chordDuration.toFixed(3)} segundos (${(timing.chordDuration / beatDuration).toFixed(1)} beats)`);
        console.log(`Pause between: ${timing.pauseBetween.toFixed(3)} segundos`);

        return timing;
    }

    /**
     * Detener todo el audio
     */
    stopAllAudio() {
        if (typeof pianoAudio !== 'undefined') {
            pianoAudio.stopAll();
        }

        // Resetear el botón de reproducir progresión si existe
        const playButton = document.getElementById('playProgressionBtn');
        if (playButton) {
            playButton.disabled = false;
            playButton.textContent = '🎶 Reproducir Progresión Completa';
        }
    }

    /**
     * Configurar cálculo inicial automático
     */
    setupInitialCalculation() {
        setTimeout(() => {
            this.calculateBtn.click();
        }, 500);
    }    /**
     * Manejar clic en el botón Calcular
     */
    handleCalculate() {
        const input = this.chordInput.value.trim();
        if (!input) return;

        // Mostrar animación de carga
        this.showLoading();

        // Simular tiempo de procesamiento
        setTimeout(() => {
            const chords = input.split(',').map(chord => chord.trim());

            try {
                // Calcular progresión óptima
                const progression = calculateOptimalChordProgression(chords);

                // Mostrar resultados
                this.displayChordProgression(progression);

                // Ocultar carga y mostrar resultados
                this.hideLoading();
                this.showResults();
            } catch (error) {
                console.error('Error al calcular la progresión:', error);
                this.hideLoading();
                this.showError('Error al procesar los acordes. Verifica la entrada.');
            }
        }, 1500);
    }

    /**
     * Manejar clic en el botón Reset
     */
    handleReset() {
        this.chordInput.value = '';
        this.hideResults();
        this.chordInput.focus();
    }

    /**
     * Mostrar animación de carga
     */
    showLoading() {
        this.loading.style.display = 'block';
        this.resultsSection.style.display = 'none';
    }

    /**
     * Ocultar animación de carga
     */
    hideLoading() {
        this.loading.style.display = 'none';
    }

    /**
     * Mostrar sección de resultados
     */
    showResults() {
        this.resultsSection.style.display = 'block';
    }

    /**
     * Ocultar sección de resultados
     */
    hideResults() {
        this.resultsSection.style.display = 'none';
    }

    /**
     * Mostrar mensaje de error
     */
    showError(message) {
        // Implementar sistema de notificaciones
        alert(message); // Temporal - mejorar con toast notifications
    }

    /**
     * Mostrar la progresión de acordes
     */
    displayChordProgression(progression) {
        this.chordSequence.innerHTML = "";
        this.currentProgression = progression;

        // Agregar botón para reproducir toda la progresión
        const playAllButton = document.createElement('div');
        playAllButton.className = 'text-center mb-6';
        playAllButton.innerHTML = `
            <button
                id="playProgressionBtn"
                class="px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold text-lg hover:bg-purple-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
                🎶 Reproducir Progresión Completa
            </button>
        `;
        this.chordSequence.appendChild(playAllButton);

        // Agregar event listener para el botón
        document.getElementById('playProgressionBtn').addEventListener('click', () => {
            this.playFullProgression();
        });

        progression.forEach((item, index) => {
            const chordCard = this.createChordCard(item, index, progression);
            this.chordSequence.appendChild(chordCard);

            // Seleccionar el primer acorde automáticamente
            if (index === 0) {
                chordCard.classList.add('active');
                this.showChordInfo(item.chord, item.chordKey, item.variation, null);
            }
        });
    }

    /**
     * Reproducir la progresión completa
     */
    async playFullProgression() {
        if (!this.currentProgression || typeof pianoAudio === 'undefined') {
            alert('No hay progresión para reproducir o el audio no está disponible');
            return;
        }

        const button = document.getElementById('playProgressionBtn');
        button.disabled = true;
        button.textContent = '🎶 Reproduciendo...';

        try {
            // Calcular tiempos basados en el tempo actual
            const timing = this.calculateTimingFromTempo();

            // Convertir progresión al formato requerido por el sistema de audio
            const audioProgression = this.currentProgression.map(item => {
                const chordObj = chordData[item.chordKey];
                const variationData = chordObj[item.variation];
                return {
                    symbol: item.chord,
                    notes: variationData.notes
                };
            });

            await pianoAudio.playProgression(audioProgression, timing.chordDuration, timing.pauseBetween);
        } catch (error) {
            console.error('Error al reproducir la progresión:', error);
            alert('Error al reproducir la progresión');
        } finally {
            button.disabled = false;
            button.textContent = '🎶 Reproducir Progresión Completa';
        }
    }

    /**
     * Crear tarjeta de acorde
     */
    createChordCard(item, index, progression) {
        const chordCard = document.createElement('div');
        chordCard.className = 'chord-card';
        chordCard.innerHTML = `
            <div class="chord-name">${item.chord}</div>
            <div class="chord-type">${chordData[item.chordKey][item.variation].inversion}</div>
        `;

        chordCard.addEventListener('click', () => {
            // Remover clase activa de todos los acordes
            document.querySelectorAll('.chord-card').forEach(card => {
                card.classList.remove('active');
            });

            // Añadir clase activa al acorde seleccionado
            chordCard.classList.add('active');

            // Obtener el acorde anterior para mostrar transiciones
            const previousChord = index > 0 ? progression[index - 1] : null;

            // Mostrar detalles del acorde con información de transición
            this.showChordInfo(item.chord, item.chordKey, item.variation, previousChord);
        });

        return chordCard;
    }

    /**
     * Mostrar información de acorde seleccionado
     */
    showChordInfo(chord, chordKey, variation, previousChord = null) {
        const chordObj = chordData[chordKey];
        if (!chordObj) return;

        const variationData = chordObj[variation];
        if (!variationData) return;

        // Analizar movimientos de dedos si hay acorde anterior
        const movements = previousChord ? analyzeFingerMovements(previousChord, { chordKey, variation }) : null;

        // Crear información de transición
        const transitionInfo = createTransitionInfo(movements, previousChord);

        // Generar HTML completo de información del acorde
        this.chordInfo.innerHTML = `
            ${createPianoKeyboard(variationData.notes, variationData.fingering)}

            <div class="mt-6 mb-6">
                <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-secondary mb-2">${chord} ${chordObj.type} - ${variationData.inversion}</h2>
                <p class="text-sm sm:text-base text-gray-600">${chordObj.description}</p>
            </div>

            <!-- Audio Controls for Chord -->
            <div class="flex justify-center gap-4 my-4">
                <button
                    class="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-sm"
                    onclick="playCurrentChord('${JSON.stringify(variationData.notes).replace(/"/g, '&quot;')}')"
                >
                    🎵 Reproducir Acorde
                </button>
                <button
                    class="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm"
                    onclick="playNotesSequentially('${JSON.stringify(variationData.notes).replace(/"/g, '&quot;')}')"
                >
                    🎼 Reproducir Notas Secuencialmente
                </button>
            </div>

            ${transitionInfo}

            <!-- Notas del acorde con colores -->
            <div class="mb-4">
                <h3 class="text-lg font-semibold text-center text-gray-700 mb-3">🎵 Notas del Acorde</h3>
                <div class="flex flex-wrap justify-center gap-3 sm:gap-4">
                    ${createNoteBadges(variationData.notes, variationData.fingering)}
                </div>
            </div>

            <!-- Digitación correspondiente -->
            <div class="mb-6">
                <h3 class="text-lg font-semibold text-center text-gray-700 mb-3">✋ Digitación</h3>
                <div class="flex flex-wrap justify-center gap-4 sm:gap-6">
                    ${createFingeringBadges(variationData.fingering, variationData.notes)}
                </div>
            </div>

            ${this.createFingeringTips()}
        `;

        // Store current chord for audio playback
        this.currentChord = variationData.notes;
    }    /**
     * Crear consejos de digitación
     */
    createFingeringTips() {
        return `
            <div class="bg-blue-50 p-4 sm:p-6 rounded-xl mt-6 border-l-4 border-primary">
                <h4 class="text-secondary text-lg sm:text-xl font-semibold mb-3 sm:mb-4">💡 Consejos de digitación:</h4>
                <ul class="space-y-2 sm:space-y-3 text-sm sm:text-base">
                    <li class="flex items-center"><span class="finger-badge finger-1 mr-2 sm:mr-3">1</span> Pulgar: Notas graves, posición estable</li>
                    <li class="flex items-center"><span class="finger-badge finger-2 mr-2 sm:mr-3">2</span> Índice: Notas intermedias, movimientos precisos</li>
                    <li class="flex items-center"><span class="finger-badge finger-3 mr-2 sm:mr-3">3</span> Medio: Centro de la mano, fuerza principal</li>
                    <li class="flex items-center"><span class="finger-badge finger-4 mr-2 sm:mr-3">4</span> Anular: Notas agudas intermedias</li>
                    <li class="flex items-center"><span class="finger-badge finger-5 mr-2 sm:mr-3">5</span> Meñique: Notas más agudas, movimientos delicados</li>
                </ul>
                <p class="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
                    <strong>Colores en el piano:</strong> Cada color representa un dedo diferente para facilitar la práctica.
                </p>
            </div>
        `;
    }
}

/**
 * Función global para reproducir un acorde
 * @param {string} notesJson - Notas del acorde en formato JSON
 */
async function playCurrentChord(notesJson) {
    try {
        const notes = JSON.parse(notesJson.replace(/&quot;/g, '"'));
        if (typeof pianoAudio !== 'undefined') {
            await pianoAudio.playChord(notes, 2.0);
        }
    } catch (error) {
        console.error('Error al reproducir acorde:', error);
        alert('Error al reproducir el acorde');
    }
}

/**
 * Función global para reproducir notas secuencialmente
 * @param {string} notesJson - Notas en formato JSON
 */
async function playNotesSequentially(notesJson) {
    try {
        const notes = JSON.parse(notesJson.replace(/&quot;/g, '"'));
        if (typeof pianoAudio !== 'undefined') {
            for (let i = 0; i < notes.length; i++) {
                await pianoAudio.playNote(notes[i], 0.8);
                await pianoAudio.delay(400); // Pausa entre notas
            }
        }
    } catch (error) {
        console.error('Error al reproducir notas secuencialmente:', error);
        alert('Error al reproducir las notas');
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    new PianoOptimizer();
});

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PianoOptimizer };
}
