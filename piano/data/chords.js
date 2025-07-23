// Datos completos de acordes con notas específicas y digitaciones
const chordData = {
    "C": {
        name: "C",
        type: "Mayor",
        fundamental: { notes: ["C4", "E4", "G4"], fingering: [1, 3, 5], inversion: "Fundamental" },
        firstInv: { notes: ["E3", "G3", "C4"], fingering: [1, 2, 5], inversion: "1ª Inversión" },
        secondInv: { notes: ["G3", "C4", "E4"], fingering: [1, 3, 5], inversion: "2ª Inversión" },
        description: "Acorde de Do Mayor"
    },
    "C#": {
        name: "C#",
        type: "Mayor",
        fundamental: { notes: ["C#4", "F4", "G#4"], fingering: [1, 3, 5], inversion: "Fundamental" },
        firstInv: { notes: ["F3", "G#3", "C#4"], fingering: [1, 2, 5], inversion: "1ª Inversión" },
        secondInv: { notes: ["G#3", "C#4", "F4"], fingering: [1, 3, 5], inversion: "2ª Inversión" },
        description: "Acorde de Do# Mayor"
    },
    "Db": {
        name: "Db",
        type: "Mayor",
        fundamental: { notes: ["C#4", "F4", "G#4"], fingering: [1, 3, 5], inversion: "Fundamental" },
        firstInv: { notes: ["F3", "G#3", "C#4"], fingering: [1, 2, 5], inversion: "1ª Inversión" },
        secondInv: { notes: ["G#3", "C#4", "F4"], fingering: [1, 3, 5], inversion: "2ª Inversión" },
        description: "Acorde de Reb Mayor"
    },
    "D": {
        name: "D",
        type: "Mayor",
        fundamental: { notes: ["D4", "F#4", "A4"], fingering: [1, 3, 5], inversion: "Fundamental" },
        firstInv: { notes: ["F#3", "A3", "D4"], fingering: [1, 2, 5], inversion: "1ª Inversión" },
        secondInv: { notes: ["A3", "D4", "F#4"], fingering: [1, 3, 5], inversion: "2ª Inversión" },
        description: "Acorde de Re Mayor"
    },
    "D#": {
        name: "D#",
        type: "Mayor",
        fundamental: { notes: ["D#4", "G4", "A#4"], fingering: [1, 3, 5], inversion: "Fundamental" },
        firstInv: { notes: ["G3", "A#3", "D#4"], fingering: [1, 2, 5], inversion: "1ª Inversión" },
        secondInv: { notes: ["A#3", "D#4", "G4"], fingering: [1, 3, 5], inversion: "2ª Inversión" },
        description: "Acorde de Re# Mayor"
    },
    "Eb": {
        name: "Eb",
        type: "Mayor",
        fundamental: { notes: ["D#4", "G4", "A#4"], fingering: [1, 3, 5], inversion: "Fundamental" },
        firstInv: { notes: ["G3", "A#3", "D#4"], fingering: [1, 2, 5], inversion: "1ª Inversión" },
        secondInv: { notes: ["A#3", "D#4", "G4"], fingering: [1, 3, 5], inversion: "2ª Inversión" },
        description: "Acorde de Mib Mayor"
    },
    "E": {
        name: "E",
        type: "Mayor",
        fundamental: { notes: ["E3", "G#3", "B3"], fingering: [1, 3, 5], inversion: "Fundamental" },
        firstInv: { notes: ["G#3", "B3", "E4"], fingering: [1, 2, 5], inversion: "1ª Inversión" },
        secondInv: { notes: ["B3", "E4", "G#4"], fingering: [1, 3, 5], inversion: "2ª Inversión" },
        description: "Acorde de Mi Mayor"
    },
    "F": {
        name: "F",
        type: "Mayor",
        fundamental: { notes: ["F3", "A3", "C4"], fingering: [1, 2, 5], inversion: "Fundamental" },
        firstInv: { notes: ["A3", "C4", "F4"], fingering: [1, 3, 5], inversion: "1ª Inversión" },
        secondInv: { notes: ["C4", "F4", "A4"], fingering: [1, 2, 5], inversion: "2ª Inversión" },
        description: "Acorde de Fa Mayor"
    },
    "F#": {
        name: "F#",
        type: "Mayor",
        fundamental: { notes: ["F#3", "A#3", "C#4"], fingering: [1, 2, 5], inversion: "Fundamental" },
        firstInv: { notes: ["A#3", "C#4", "F#4"], fingering: [1, 3, 5], inversion: "1ª Inversión" },
        secondInv: { notes: ["C#4", "F#4", "A#4"], fingering: [1, 2, 5], inversion: "2ª Inversión" },
        description: "Acorde de Fa# Mayor"
    },
    "Gb": {
        name: "Gb",
        type: "Mayor",
        fundamental: { notes: ["F#3", "A#3", "C#4"], fingering: [1, 2, 5], inversion: "Fundamental" },
        firstInv: { notes: ["A#3", "C#4", "F#4"], fingering: [1, 3, 5], inversion: "1ª Inversión" },
        secondInv: { notes: ["C#4", "F#4", "A#4"], fingering: [1, 2, 5], inversion: "2ª Inversión" },
        description: "Acorde de Solb Mayor"
    },
    "G": {
        name: "G",
        type: "Mayor",
        fundamental: { notes: ["G3", "B3", "D4"], fingering: [1, 3, 5], inversion: "Fundamental" },
        firstInv: { notes: ["B3", "D4", "G4"], fingering: [1, 2, 5], inversion: "1ª Inversión" },
        secondInv: { notes: ["D4", "G4", "B4"], fingering: [1, 3, 5], inversion: "2ª Inversión" },
        description: "Acorde de Sol Mayor"
    },
    "G#": {
        name: "G#",
        type: "Mayor",
        fundamental: { notes: ["G#3", "C4", "D#4"], fingering: [1, 3, 5], inversion: "Fundamental" },
        firstInv: { notes: ["C4", "D#4", "G#4"], fingering: [1, 2, 5], inversion: "1ª Inversión" },
        secondInv: { notes: ["D#4", "G#4", "C5"], fingering: [1, 3, 5], inversion: "2ª Inversión" },
        description: "Acorde de Sol# Mayor"
    },
    "Ab": {
        name: "Ab",
        type: "Mayor",
        fundamental: { notes: ["G#3", "C4", "D#4"], fingering: [1, 3, 5], inversion: "Fundamental" },
        firstInv: { notes: ["C4", "D#4", "G#4"], fingering: [1, 2, 5], inversion: "1ª Inversión" },
        secondInv: { notes: ["D#4", "G#4", "C5"], fingering: [1, 3, 5], inversion: "2ª Inversión" },
        description: "Acorde de Lab Mayor"
    },
    "A": {
        name: "A",
        type: "Mayor",
        fundamental: { notes: ["A3", "C#4", "E4"], fingering: [1, 3, 5], inversion: "Fundamental" },
        firstInv: { notes: ["C#4", "E4", "A4"], fingering: [1, 2, 5], inversion: "1ª Inversión" },
        secondInv: { notes: ["E4", "A4", "C#5"], fingering: [1, 3, 5], inversion: "2ª Inversión" },
        description: "Acorde de La Mayor"
    },
    "A#": {
        name: "A#",
        type: "Mayor",
        fundamental: { notes: ["A#3", "D4", "F4"], fingering: [1, 3, 5], inversion: "Fundamental" },
        firstInv: { notes: ["D4", "F4", "A#4"], fingering: [1, 2, 5], inversion: "1ª Inversión" },
        secondInv: { notes: ["F4", "A#4", "D5"], fingering: [1, 3, 5], inversion: "2ª Inversión" },
        description: "Acorde de La# Mayor"
    },
    "Bb": {
        name: "Bb",
        type: "Mayor",
        fundamental: { notes: ["A#3", "D4", "F4"], fingering: [1, 3, 5], inversion: "Fundamental" },
        firstInv: { notes: ["D4", "F4", "A#4"], fingering: [1, 2, 5], inversion: "1ª Inversión" },
        secondInv: { notes: ["F4", "A#4", "D5"], fingering: [1, 3, 5], inversion: "2ª Inversión" },
        description: "Acorde de Sib Mayor"
    },
    "B": {
        name: "B",
        type: "Mayor",
        fundamental: { notes: ["B3", "D#4", "F#4"], fingering: [1, 3, 5], inversion: "Fundamental" },
        firstInv: { notes: ["D#4", "F#4", "B4"], fingering: [1, 2, 5], inversion: "1ª Inversión" },
        secondInv: { notes: ["F#4", "B4", "D#5"], fingering: [1, 3, 5], inversion: "2ª Inversión" },
        description: "Acorde de Si Mayor"
    },

    // Acordes menores
    "Am": {
        name: "Am",
        type: "Menor",
        fundamental: { notes: ["A3", "C4", "E4"], fingering: [1, 3, 5], inversion: "Fundamental" },
        firstInv: { notes: ["C4", "E4", "A4"], fingering: [1, 2, 5], inversion: "1ª Inversión" },
        secondInv: { notes: ["E4", "A4", "C5"], fingering: [1, 3, 5], inversion: "2ª Inversión" },
        description: "Acorde de La Menor"
    },
    "A#m": {
        name: "A#m",
        type: "Menor",
        fundamental: { notes: ["A#3", "C#4", "F4"], fingering: [1, 3, 5], inversion: "Fundamental" },
        firstInv: { notes: ["C#4", "F4", "A#4"], fingering: [1, 2, 5], inversion: "1ª Inversión" },
        secondInv: { notes: ["F4", "A#4", "C#5"], fingering: [1, 3, 5], inversion: "2ª Inversión" },
        description: "Acorde de La# Menor"
    },
    "Bbm": {
        name: "Bbm",
        type: "Menor",
        fundamental: { notes: ["A#3", "C#4", "F4"], fingering: [1, 3, 5], inversion: "Fundamental" },
        firstInv: { notes: ["C#4", "F4", "A#4"], fingering: [1, 2, 5], inversion: "1ª Inversión" },
        secondInv: { notes: ["F4", "A#4", "C#5"], fingering: [1, 3, 5], inversion: "2ª Inversión" },
        description: "Acorde de Sib Menor"
    },
    "Bm": {
        name: "Bm",
        type: "Menor",
        fundamental: { notes: ["B3", "D4", "F#4"], fingering: [1, 3, 5], inversion: "Fundamental" },
        firstInv: { notes: ["D4", "F#4", "B4"], fingering: [1, 2, 5], inversion: "1ª Inversión" },
        secondInv: { notes: ["F#4", "B4", "D5"], fingering: [1, 3, 5], inversion: "2ª Inversión" },
        description: "Acorde de Si Menor"
    },
    "Cm": {
        name: "Cm",
        type: "Menor",
        fundamental: { notes: ["C4", "D#4", "G4"], fingering: [1, 3, 5], inversion: "Fundamental" },
        firstInv: { notes: ["D#3", "G3", "C4"], fingering: [1, 2, 5], inversion: "1ª Inversión" },
        secondInv: { notes: ["G3", "C4", "D#4"], fingering: [1, 3, 5], inversion: "2ª Inversión" },
        description: "Acorde de Do Menor"
    },
    "C#m": {
        name: "C#m",
        type: "Menor",
        fundamental: { notes: ["C#4", "E4", "G#4"], fingering: [1, 3, 5], inversion: "Fundamental" },
        firstInv: { notes: ["E3", "G#3", "C#4"], fingering: [1, 2, 5], inversion: "1ª Inversión" },
        secondInv: { notes: ["G#3", "C#4", "E4"], fingering: [1, 3, 5], inversion: "2ª Inversión" },
        description: "Acorde de Do# Menor"
    },
    "Dm": {
        name: "Dm",
        type: "Menor",
        fundamental: { notes: ["D3", "F3", "A3"], fingering: [1, 3, 5], inversion: "Fundamental" },
        firstInv: { notes: ["F3", "A3", "D4"], fingering: [1, 2, 5], inversion: "1ª Inversión" },
        secondInv: { notes: ["A3", "D4", "F4"], fingering: [1, 3, 5], inversion: "2ª Inversión" },
        description: "Acorde de Re Menor"
    },
    "D#m": {
        name: "D#m",
        type: "Menor",
        fundamental: { notes: ["D#4", "F#4", "A#4"], fingering: [1, 3, 5], inversion: "Fundamental" },
        firstInv: { notes: ["F#3", "A#3", "D#4"], fingering: [1, 2, 5], inversion: "1ª Inversión" },
        secondInv: { notes: ["A#3", "D#4", "F#4"], fingering: [1, 3, 5], inversion: "2ª Inversión" },
        description: "Acorde de Re# Menor"
    },
    "Em": {
        name: "Em",
        type: "Menor",
        fundamental: { notes: ["E3", "G3", "B3"], fingering: [1, 3, 5], inversion: "Fundamental" },
        firstInv: { notes: ["G3", "B3", "E4"], fingering: [1, 2, 5], inversion: "1ª Inversión" },
        secondInv: { notes: ["B3", "E4", "G4"], fingering: [1, 3, 5], inversion: "2ª Inversión" },
        description: "Acorde de Mi Menor"
    },
    "Fm": {
        name: "Fm",
        type: "Menor",
        fundamental: { notes: ["F3", "G#3", "C4"], fingering: [1, 2, 5], inversion: "Fundamental" },
        firstInv: { notes: ["G#3", "C4", "F4"], fingering: [1, 3, 5], inversion: "1ª Inversión" },
        secondInv: { notes: ["C4", "F4", "G#4"], fingering: [1, 2, 5], inversion: "2ª Inversión" },
        description: "Acorde de Fa Menor"
    },
    "F#m": {
        name: "F#m",
        type: "Menor",
        fundamental: { notes: ["F#3", "A3", "C#4"], fingering: [1, 2, 5], inversion: "Fundamental" },
        firstInv: { notes: ["A3", "C#4", "F#4"], fingering: [1, 3, 5], inversion: "1ª Inversión" },
        secondInv: { notes: ["C#4", "F#4", "A4"], fingering: [1, 2, 5], inversion: "2ª Inversión" },
        description: "Acorde de Fa# Menor"
    },
    "Gm": {
        name: "Gm",
        type: "Menor",
        fundamental: { notes: ["G3", "A#3", "D4"], fingering: [1, 3, 5], inversion: "Fundamental" },
        firstInv: { notes: ["A#3", "D4", "G4"], fingering: [1, 2, 5], inversion: "1ª Inversión" },
        secondInv: { notes: ["D4", "G4", "A#4"], fingering: [1, 3, 5], inversion: "2ª Inversión" },
        description: "Acorde de Sol Menor"
    },
    "G#m": {
        name: "G#m",
        type: "Menor",
        fundamental: { notes: ["G#3", "B3", "D#4"], fingering: [1, 3, 5], inversion: "Fundamental" },
        firstInv: { notes: ["B3", "D#4", "G#4"], fingering: [1, 2, 5], inversion: "1ª Inversión" },
        secondInv: { notes: ["D#4", "G#4", "B4"], fingering: [1, 3, 5], inversion: "2ª Inversión" },
        description: "Acorde de Sol# Menor"
    },

    // Acordes de séptima
    "G7": {
        name: "G7",
        type: "Séptima",
        fundamental: { notes: ["G3", "B3", "D4", "F4"], fingering: [1, 2, 3, 5], inversion: "Fundamental" },
        firstInv: { notes: ["B3", "D4", "F4", "G4"], fingering: [1, 2, 4, 5], inversion: "1ª Inversión" },
        description: "Acorde de Sol Séptima"
    },
    "C7": {
        name: "C7",
        type: "Séptima",
        fundamental: { notes: ["C4", "E4", "G4", "A#4"], fingering: [1, 2, 3, 5], inversion: "Fundamental" },
        firstInv: { notes: ["E3", "G3", "A#3", "C4"], fingering: [1, 2, 4, 5], inversion: "1ª Inversión" },
        description: "Acorde de Do Séptima"
    },
    "F7": {
        name: "F7",
        type: "Séptima",
        fundamental: { notes: ["F3", "A3", "C4", "D#4"], fingering: [1, 2, 3, 5], inversion: "Fundamental" },
        firstInv: { notes: ["A3", "C4", "D#4", "F4"], fingering: [1, 2, 4, 5], inversion: "1ª Inversión" },
        description: "Acorde de Fa Séptima"
    }
};

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { chordData };
}
