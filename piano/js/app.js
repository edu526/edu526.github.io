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

            ${transitionInfo}

            <div class="flex flex-wrap justify-center gap-3 sm:gap-4 my-6">
                ${createNoteBadges(variationData.notes)}
            </div>

            <div class="flex flex-wrap justify-center gap-4 sm:gap-6 my-6 sm:my-8">
                ${createFingeringBadges(variationData.fingering, variationData.notes)}
            </div>

            ${this.createFingeringTips()}
        `;
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

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    new PianoOptimizer();
});

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PianoOptimizer };
}
