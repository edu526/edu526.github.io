// Utilidades para el manejo de notas musicales

/**
 * Función para normalizar notas (convertir bemoles a sostenidos y equivalencias enarmónicas)
 * @param {string} note - La nota a normalizar
 * @returns {string} - La nota normalizada
 */
function normalizeNote(note) {
    const enharmonicMap = {
        // Bemoles a sostenidos
        'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#',
        // Equivalencias enarmónicas especiales
        'E#': 'F', 'B#': 'C', 'Cb': 'B', 'Fb': 'E'
    };
    return enharmonicMap[note] || note;
}

/**
 * Función para convertir nota a valor numérico para cálculos de distancia
 * @param {string} note - La nota en formato como "C4", "F#3", etc.
 * @returns {number} - Valor numérico de la nota
 */
function noteToNumber(note) {
    const noteValues = {
        'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
        'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
    };
    const noteName = note.replace(/[0-9]/g, '');
    const octave = parseInt(note.match(/[0-9]/)) || 4;
    return (octave * 12) + (noteValues[normalizeNote(noteName)] || 0);
}

/**
 * Función para calcular la distancia promedio entre dos acordes
 * @param {string[]} chord1Notes - Notas del primer acorde
 * @param {string[]} chord2Notes - Notas del segundo acorde
 * @returns {number} - Distancia promedio entre los acordes
 */
function calculateChordDistance(chord1Notes, chord2Notes) {
    let totalDistance = 0;
    const minLength = Math.min(chord1Notes.length, chord2Notes.length);

    for (let i = 0; i < minLength; i++) {
        const note1 = noteToNumber(chord1Notes[i]);
        const note2 = noteToNumber(chord2Notes[i]);
        totalDistance += Math.abs(note1 - note2);
    }

    return totalDistance / minLength;
}

/**
 * Función para analizar movimientos de dedos entre acordes
 * @param {Object} previousChord - Acorde anterior
 * @param {Object} currentChord - Acorde actual
 * @returns {Array|null} - Array de movimientos o null si no hay acorde anterior
 */
function analyzeFingerMovements(previousChord, currentChord) {
    if (!previousChord) return null;

    const prevData = chordData[previousChord.chordKey][previousChord.variation];
    const currData = chordData[currentChord.chordKey][currentChord.variation];

    const movements = [];
    const minLength = Math.min(prevData.notes.length, currData.notes.length);

    for (let i = 0; i < minLength; i++) {
        const prevNote = prevData.notes[i];
        const currNote = currData.notes[i];
        const finger = currData.fingering[i];

        if (prevNote !== currNote) {
            movements.push({
                finger: finger,
                from: prevNote,
                to: currNote,
                distance: Math.abs(noteToNumber(currNote) - noteToNumber(prevNote))
            });
        }
    }

    return movements;
}

/**
 * Función para "calcular" las mejores inversiones usando algoritmo de optimización
 * @param {string[]} chords - Array de nombres de acordes
 * @returns {Array} - Progresión optimizada con inversiones
 */
function calculateOptimalChordProgression(chords) {
    const progression = [];
    const chordCache = new Map(); // Cache para mantener consistencia en acordes repetidos

    for (let index = 0; index < chords.length; index++) {
        const chord = chords[index];
        // Normalizar el nombre del acorde para búsqueda
        const normalizedChord = chord.trim();

        // Buscar el acorde en la base de datos (incluyendo equivalencias enarmónicas)
        let chordKey = normalizedChord;
        if (!chordData[chordKey]) {
            // Si no se encuentra, buscar equivalencias enarmónicas
            const alternativeNames = {
                'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#',
                'Dbm': 'C#m', 'Ebm': 'D#m', 'Gbm': 'F#m', 'Abm': 'G#m', 'Bbm': 'A#m'
            };
            chordKey = alternativeNames[normalizedChord] || normalizedChord;
        }

        if (!chordData[chordKey]) {
            console.warn(`Acorde no encontrado: ${chord}`);
            continue;
        }

        // Si ya hemos usado este acorde antes, usar la misma inversión para consistencia
        if (chordCache.has(chordKey)) {
            const cachedVariation = chordCache.get(chordKey);
            progression.push({
                chord: normalizedChord,
                chordKey: chordKey,
                variation: cachedVariation
            });
            continue;
        }

        const variations = Object.keys(chordData[chordKey] || {})
            .filter(key => ['fundamental', 'firstInv', 'secondInv'].includes(key));

        let bestVariation = variations[0]; // Por defecto usar fundamental
        let minDistance = Infinity;

        // Si no es el primer acorde, optimizar la transición
        if (progression.length > 0) {
            const previousChord = progression[progression.length - 1];
            const previousNotes = chordData[previousChord.chordKey][previousChord.variation].notes;

            // Probar cada variación y elegir la que minimice la distancia
            for (const variation of variations) {
                const currentNotes = chordData[chordKey][variation].notes;
                const distance = calculateChordDistance(previousNotes, currentNotes);

                if (distance < minDistance) {
                    minDistance = distance;
                    bestVariation = variation;
                }
            }
        }

        // Guardar en cache para mantener consistencia
        chordCache.set(chordKey, bestVariation);

        progression.push({
            chord: normalizedChord,
            chordKey: chordKey,
            variation: bestVariation
        });
    }

    return progression;
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        normalizeNote,
        noteToNumber,
        calculateChordDistance,
        analyzeFingerMovements,
        calculateOptimalChordProgression
    };
}
