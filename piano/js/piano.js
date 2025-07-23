// Módulo para crear y manejar el piano virtual

/**
 * Función para crear un teclado de piano con las notas resaltadas por color de dedo
 * @param {string[]} notes - Array de notas a resaltar
 * @param {number[]} fingering - Array de digitaciones correspondientes
 * @returns {string} - HTML del teclado de piano
 */
function createPianoKeyboard(notes, fingering) {
    // Definir todas las teclas del piano
    const whiteKeys = ['C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2', 'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5'];
    const blackKeys = ['C#2', 'D#2', 'F#2', 'G#2', 'A#2', 'C#3', 'D#3', 'F#3', 'G#3', 'A#3', 'C#4', 'D#4', 'F#4', 'G#4', 'A#4', 'C#5', 'D#5'];

    // Crear mapa de notas resaltadas con sus dedos
    const highlightedNotes = {};
    notes.forEach((note, index) => {
        // Normalizar la nota
        let noteName = note.replace(/[0-9]/g, '');
        let octave = note.match(/[0-9]/g) ? note.match(/[0-9]/g).join('') : '4';
        const normalizedNoteName = normalizeNote(noteName);
        const normalizedNote = normalizedNoteName + octave;

        // Agregar tanto la nota original como la normalizada al mapa
        highlightedNotes[note] = fingering[index];
        highlightedNotes[normalizedNote] = fingering[index];

        console.log(`Mapeo nota: "${note}" -> "${normalizedNote}" = dedo ${fingering[index]}`);
    });

    // Crear HTML de teclas blancas
    let whiteKeysHTML = '';
    whiteKeys.forEach(note => {
        const finger = highlightedNotes[note];
        const indicator = finger ? `<div class="key-indicator finger-${finger}">${finger}</div>` : '';
        whiteKeysHTML += `<div class="white-key clickable-key" data-note="${note}" onclick="playKeySound('${note}')">${indicator}</div>`;
    });

    // Crear HTML de teclas negras
    let blackKeysHTML = '';
    blackKeys.forEach(note => {
        const finger = highlightedNotes[note];
        const indicator = finger ? `<div class="key-indicator finger-${finger}">${finger}</div>` : '';
        blackKeysHTML += `<div class="black-key clickable-key" data-note="${note}" onclick="playKeySound('${note}')">${indicator}</div>`;
    });

    return `
        <div class="keyboard-container mt-4 sm:mt-6 p-4 sm:p-6">
            <h4 class="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">🎹 Teclado de Piano:</h4>
            <div class="keyboard p-3 sm:p-4">
                <div class="keyboard-keys">
                    ${whiteKeysHTML}
                    ${blackKeysHTML}
                </div>
            </div>
        </div>
    `;
}

/**
 * Función para crear badges de notas musicales
 * @param {string[]} notes - Array de notas
 * @param {number[]} fingering - Array de digitaciones correspondientes
 * @returns {string} - HTML con badges de notas
 */
function createNoteBadges(notes, fingering = null) {
    return notes.map((note, index) => {
        const finger = fingering ? fingering[index] : null;
        const colorClass = finger ? `finger-${finger}` : 'bg-primary';
        return `<div class="w-12 h-12 sm:w-14 sm:h-14 ${colorClass} text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base lg:text-lg shadow-md">${note}</div>`;
    }).join('');
}

/**
 * Función para crear badges de digitación
 * @param {number[]} fingering - Array de digitaciones
 * @param {string[]} notes - Array de notas correspondientes
 * @returns {string} - HTML con badges de digitación
 */
function createFingeringBadges(fingering, notes) {
    return fingering.map((finger, index) => `
        <div class="flex flex-col items-center">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base text-white mb-2 sm:mb-3 finger-${finger}">${finger}</div>
            <div class="text-xs sm:text-sm font-medium text-gray-700">${notes[index]}</div>
        </div>
    `).join('');
}

/**
 * Función para crear información de transición entre acordes
 * @param {Array|null} movements - Array de movimientos de dedos
 * @param {Object|null} previousChord - Acorde anterior
 * @returns {string} - HTML con información de transición
 */
function createTransitionInfo(movements, previousChord) {
    if (movements && movements.length > 0) {
        const movementList = movements.map(mov => `
            <div class="flex items-center gap-2 sm:gap-3 py-1 sm:py-2 text-sm sm:text-base">
                <span class="finger-badge finger-${mov.finger}">${mov.finger}</span>
                <span class="font-medium">${mov.from}</span>
                <span class="text-gray-500 font-bold">→</span>
                <span class="font-medium">${mov.to}</span>
                <span class="text-xs sm:text-sm text-gray-500 ml-2">
                    (${mov.distance} semitonos)
                </span>
            </div>
        `).join('');

        return `
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6 my-4 sm:my-6">
                <h5 class="text-yellow-800 font-semibold text-base sm:text-lg mb-3 sm:mb-4">🎹 Movimientos desde el acorde anterior:</h5>
                ${movementList}
                <div class="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
                    <strong>Dedos que no se mueven:</strong> ${
                        [1,2,3,4,5].filter(f => !movements.some(m => m.finger === f))
                        .map(f => `<span class="finger-badge finger-${f} inline-flex mx-1">${f}</span>`)
                        .join('') || 'Ninguno'
                    }
                </div>
            </div>
        `;
    } else if (previousChord) {
        return `
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 my-4 sm:my-6">
                <h5 class="text-green-800 font-semibold text-base sm:text-lg mb-2">✨ ¡Perfecto! No hay movimientos necesarios</h5>
                <p class="text-sm sm:text-base text-green-700">
                    Todos los dedos permanecen en la misma posición.
                </p>
            </div>
        `;
    }
    return '';
}

/**
 * Función global para reproducir el sonido de una tecla
 * @param {string} note - Nota a reproducir
 */
async function playKeySound(note) {
    try {
        if (typeof pianoAudio !== 'undefined') {
            await pianoAudio.playNote(note, 1.0);
        }
    } catch (error) {
        console.warn('No se pudo reproducir la nota:', error);
    }
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createPianoKeyboard,
        createNoteBadges,
        createFingeringBadges,
        createTransitionInfo
    };
}
