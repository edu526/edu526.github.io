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
        // Configurar controles usando UIUtils
        UIUtils.setupAudioControls({
            volume: {
                sliderId: 'volumeSlider',
                valueId: 'volumeValue',
                onChange: (volume) => {
                    AudioUtils.setMasterVolume(volume / 100);
                }
            },
            tempo: {
                sliderId: 'tempoSlider',
                valueId: 'tempoValue',
                onChange: (tempo) => {
                    this.currentTempo = tempo;
                    // Actualizar descripción del tempo usando configuración
                    const description = AudioConfig.utils.getTempoDescription.call(AudioConfig, tempo);
                    document.getElementById('tempoDescription').textContent = description;
                }
            },
            testButton: {
                buttonId: 'testAudioBtn',
                onClick: () => this.testAudio()
            },
            stopButton: {
                buttonId: 'stopAllBtn',
                onClick: () => this.stopAllAudio()
            }
        });
    }

    /**
     * Probar el sistema de audio
     */
    async testAudio() {
        const button = this.testAudioBtn;
        if (!button) return;

        await UIUtils.setupButtonWithLoading(
            button,
            '🎵 Reproduciendo...',
            '🎵 Probar Audio',
            async () => {
                if (!AudioUtils.isAudioAvailable()) {
                    throw new Error('Sistema de audio no disponible');
                }

                // Tocar nota de prueba usando configuración
                await pianoAudio.playNote(AudioConfig.ui.testNote, AudioConfig.ui.testDuration);
            }
        );
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
        AudioUtils.stopAllAudio();

        // Limpiar resaltado de acordes
        this.highlightCurrentChord(-1);

        // Remover indicador de progresión
        this.removeProgressionIndicator();

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

        // Limpiar sticky header
        this.cleanupStickyHeader();
    }

    /**
     * Mostrar animación de carga
     */
    showLoading() {
        UIUtils.toggleVisibility('loading', true);
        UIUtils.toggleVisibility('resultsSection', false);
    }

    /**
     * Ocultar animación de carga
     */
    hideLoading() {
        UIUtils.toggleVisibility('loading', false);
    }

    /**
     * Mostrar sección de resultados
     */
    showResults() {
        UIUtils.toggleVisibility('resultsSection', true);
    }

    /**
     * Ocultar sección de resultados
     */
    hideResults() {
        UIUtils.toggleVisibility('resultsSection', false);
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

        // Crear y configurar sticky header de acordes
        this.createStickyChordHeader(progression);

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
     * Crear sticky header con acordes compactos
     */
    createStickyChordHeader(progression) {
        // Remover sticky header anterior si existe
        const existingStickyHeader = document.getElementById('stickyChordHeader');
        if (existingStickyHeader) {
            existingStickyHeader.remove();
        }

        // Crear contenedor sticky
        const stickyContainer = document.createElement('div');
        stickyContainer.id = 'stickyChordHeader';
        stickyContainer.className = 'chord-sequence-sticky hidden';

        // Crear contenedor de scroll horizontal
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'sticky-chords-container';
        scrollContainer.id = 'stickyScrollContainer';

        // Crear acordes compactos
        progression.forEach((item, index) => {
            const compactChord = document.createElement('div');
            compactChord.className = 'chord-card sticky-chord';
            compactChord.dataset.chordIndex = index;
            compactChord.innerHTML = `
                <div class="chord-name">${item.chord}</div>
                <div class="chord-type">${chordData[item.chordKey][item.variation].inversion}</div>
            `;

            // Event listener para acordes en sticky header
            compactChord.addEventListener('click', () => {
                this.selectChordFromSticky(index, item, progression);
            });

            scrollContainer.appendChild(compactChord);
        });

        stickyContainer.appendChild(scrollContainer);

        // Insertar al inicio del body
        document.body.insertBefore(stickyContainer, document.body.firstChild);

        // Detectar si necesita centrado después de insertar en DOM
        setTimeout(() => {
            const containerWidth = scrollContainer.offsetWidth;
            const scrollWidth = scrollContainer.scrollWidth;

            console.log(`Container width: ${containerWidth}, Scroll width: ${scrollWidth}`);

            // Si el contenido cabe sin scroll, centrarlo
            if (scrollWidth <= containerWidth + 10) { // Margen de 10px para tolerancia
                scrollContainer.classList.add('centered');
                console.log('Aplicando centrado automático');
            } else {
                console.log('Manteniendo scroll horizontal - progresión larga');
            }
        }, 100); // Aumentar tiempo para asegurar renderizado        // Configurar observer para mostrar/ocultar sticky header
        this.setupStickyHeaderObserver();
    }

    /**
     * Configurar observer para el sticky header
     */
    setupStickyHeaderObserver() {
        const stickyHeader = document.getElementById('stickyChordHeader');
        // Observar específicamente el contenedor de la secuencia de acordes
        const chordSequenceContainer = this.chordSequence.parentElement;

        if (!stickyHeader || !chordSequenceContainer) return;

        // Detectar si estamos en móvil para ajustar el comportamiento
        const isMobile = window.innerWidth <= 640;
        const rootMargin = isMobile ? '-200px 0px 0px 0px' : '-100px 0px 0px 0px';

        console.log(`Configurando observer - Mobile: ${isMobile}, RootMargin: ${rootMargin}`);

        // Observer para detectar cuando la sección de acordes sale de vista
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                console.log(`Chord container intersecting: ${entry.isIntersecting}, Mobile: ${isMobile}`);

                if (entry.isIntersecting) {
                    // La sección de acordes está visible, ocultar sticky header
                    stickyHeader.classList.add('hidden');
                    console.log('Sección de acordes visible - ocultando sticky header');
                } else {
                    // La sección de acordes no está visible, mostrar sticky header
                    stickyHeader.classList.remove('hidden');
                    console.log('Sección de acordes fuera de vista - mostrando sticky header');
                }
            });
        }, {
            threshold: 0, // Activar cuando la sección esté completamente fuera de vista
            rootMargin: rootMargin // Más conservador en móviles
        });

        observer.observe(chordSequenceContainer);

        // Guardar referencia del observer para limpieza posterior
        this.stickyObserver = observer;
    }

    /**
     * Seleccionar acorde desde sticky header
     */
    selectChordFromSticky(index, item, progression) {
        // Actualizar selección en sticky header
        const stickyChords = document.querySelectorAll('.sticky-chord');
        stickyChords.forEach(chord => chord.classList.remove('active'));
        stickyChords[index].classList.add('active');

        // Actualizar selección en la lista principal
        const mainChords = document.querySelectorAll('.chord-card:not(.sticky-chord)');
        mainChords.forEach(chord => chord.classList.remove('active'));

        // Buscar el acorde correspondiente en la lista principal (excluyendo botón)
        const mainChordCards = Array.from(mainChords).filter(card =>
            !card.querySelector('#playProgressionBtn')
        );

        if (index < mainChordCards.length) {
            mainChordCards[index].classList.add('active');
        }

        // Reproducir el acorde
        const chordObj = chordData[item.chordKey];
        const variationData = chordObj[item.variation];
        AudioUtils.playChordSelection(variationData);

        // Mostrar información del acorde
        const previousChord = index > 0 ? progression[index - 1] : null;
        this.showChordInfo(item.chord, item.chordKey, item.variation, previousChord);
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

        // Crear indicador de progresión flotante
        this.createProgressionIndicator();

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

            // Callback para manejar el cambio de acorde durante la reproducción
            const onChordStart = (chordIndex, chord) => {
                this.highlightCurrentChord(chordIndex, false); // Sin auto-scroll
            };

            await pianoAudio.playProgression(audioProgression, timing.chordDuration, timing.pauseBetween, onChordStart);
        } catch (error) {
            console.error('Error al reproducir la progresión:', error);
            alert('Error al reproducir la progresión');
        } finally {
            // Limpiar resaltado y restaurar botón
            this.highlightCurrentChord(-1);
            this.removeProgressionIndicator();
            button.disabled = false;
            button.textContent = '🎶 Reproducir Progresión Completa';
        }
    }

    /**
     * Crear indicador de progresión flotante
     */
    createProgressionIndicator() {
        // Remover indicador existente si hay uno
        this.removeProgressionIndicator();

        const indicator = document.createElement('div');
        indicator.className = 'progression-indicator';
        indicator.id = 'progressionIndicator';
        indicator.innerHTML = `
            <span class="current-chord">-</span>
            <span class="chord-progress">0/0</span>
        `;

        document.body.appendChild(indicator);

        // Mostrar con animación
        setTimeout(() => {
            indicator.classList.add('visible');
        }, 100);
    }

    /**
     * Actualizar indicador de progresión flotante
     * @param {number} chordIndex - Índice del acorde actual
     * @param {Object} chord - Objeto del acorde actual
     */
    updateProgressionIndicator(chordIndex, chord) {
        const indicator = document.getElementById('progressionIndicator');
        if (!indicator) return;

        if (chordIndex >= 0 && chord && this.currentProgression) {
            const currentChordSpan = indicator.querySelector('.current-chord');
            const progressSpan = indicator.querySelector('.chord-progress');

            if (currentChordSpan && progressSpan) {
                currentChordSpan.textContent = chord.symbol;
                progressSpan.textContent = `${chordIndex + 1}/${this.currentProgression.length}`;
            }
        }
    }

    /**
     * Remover indicador de progresión flotante
     */
    removeProgressionIndicator() {
        const indicator = document.getElementById('progressionIndicator');
        if (indicator) {
            indicator.classList.remove('visible');
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            }, 300);
        }
    }

    /**
     * Resaltar el acorde que se está reproduciendo actualmente
     * @param {number} chordIndex - Índice del acorde actual (-1 para limpiar)
     * @param {boolean} autoScroll - Si debe hacer scroll automático (por defecto false)
     */
    highlightCurrentChord(chordIndex, autoScroll = false) {
        // Limpiar todos los resaltados anteriores (main y sticky)
        const allChordCards = document.querySelectorAll('.chord-card');
        allChordCards.forEach(card => {
            card.classList.remove('playing');
        });

        // Si chordIndex es válido, resaltar el acorde actual
        if (chordIndex >= 0) {
            // Resaltar en la lista principal
            const mainChordCards = Array.from(allChordCards).filter(card =>
                !card.querySelector('#playProgressionBtn') && !card.classList.contains('sticky-chord')
            );

            if (chordIndex < mainChordCards.length) {
                const currentCard = mainChordCards[chordIndex];
                if (currentCard) {
                    currentCard.classList.add('playing');

                    // Solo hacer scroll si está habilitado Y el elemento no es visible
                    if (autoScroll && !this.isElementInViewport(currentCard)) {
                        currentCard.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest', // Más sutil que 'center'
                            inline: 'nearest'
                        });
                    }
                }
            }

            // Resaltar en sticky header
            const stickyChords = document.querySelectorAll('.sticky-chord');
            if (chordIndex < stickyChords.length) {
                const stickyCard = stickyChords[chordIndex];
                if (stickyCard) {
                    stickyCard.classList.add('playing');

                    // Auto-scroll horizontal en sticky header para mantener acorde visible
                    const stickyContainer = document.getElementById('stickyScrollContainer');
                    if (stickyContainer) {
                        const cardRect = stickyCard.getBoundingClientRect();
                        const containerRect = stickyContainer.getBoundingClientRect();

                        if (cardRect.left < containerRect.left || cardRect.right > containerRect.right) {
                            stickyCard.scrollIntoView({
                                behavior: 'smooth',
                                block: 'nearest',
                                inline: 'center'
                            });
                        }
                    }
                }
            }

            // Log para debugging
            console.log(`Resaltando acorde ${chordIndex + 1} en ambas listas`);
        } else {
            console.log('Limpiando resaltado de acordes');
        }
    }

    /**
     * Limpiar sticky header
     */
    cleanupStickyHeader() {
        // Remover sticky header
        const stickyHeader = document.getElementById('stickyChordHeader');
        if (stickyHeader) {
            stickyHeader.remove();
        }

        // Limpiar observer
        if (this.stickyObserver) {
            this.stickyObserver.disconnect();
            this.stickyObserver = null;
        }
    }

    /**
     * Verificar si un elemento está visible en el viewport
     * @param {Element} element - Elemento a verificar
     * @returns {boolean} - True si está visible
     */
    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
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

        chordCard.addEventListener('click', async () => {
            // Remover clase activa de todos los acordes usando UIUtils
            UIUtils.toggleClass('.chord-card', 'active', false);

            // Añadir clase activa al acorde seleccionado
            chordCard.classList.add('active');

            // Reproducir el acorde automáticamente al seleccionarlo
            const chordObj = chordData[item.chordKey];
            const variationData = chordObj[item.variation];
            await AudioUtils.playChordSelection(variationData);

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
                ${UIUtils.createAudioButton(
                    'Reproducir Acorde',
                    '🎵',
                    'bg-green-500',
                    `playCurrentChord('${JSON.stringify(variationData.notes).replace(/"/g, '&quot;')}')`
                )}
                ${UIUtils.createAudioButton(
                    'Reproducir Notas Secuencialmente',
                    '🎼',
                    'bg-blue-500',
                    `playNotesSequentially('${JSON.stringify(variationData.notes).replace(/"/g, '&quot;')}')`
                )}
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

// Las funciones globales ahora están centralizadas en audio-utils.js
// Se mantiene por compatibilidad pero delegan a AudioUtils

/**
 * Función global para reproducir un acorde (DEPRECATED - usar AudioUtils)
 * @param {string} notesJson - Notas del acorde en formato JSON
 */
async function playCurrentChord(notesJson) {
    return AudioUtils.playChordFromJson(notesJson);
}

/**
 * Función global para reproducir notas secuencialmente (DEPRECATED - usar AudioUtils)
 * @param {string} notesJson - Notas en formato JSON
 */
async function playNotesSequentially(notesJson) {
    return AudioUtils.playNotesSequentiallyFromJson(notesJson);
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    new PianoOptimizer();
});

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PianoOptimizer };
}
