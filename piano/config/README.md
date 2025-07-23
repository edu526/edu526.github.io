# Configuración de Audio del Piano

Este archivo `audio-config.js` centraliza todas las configuraciones relacionadas con el sistema de audio del piano digital. La configuración utiliza un **sistema de referencias dinámicas** que elimina la duplicación y mantiene todo sincronizado automáticamente.

## 🔄 **Sistema de Sincronización Automática**

### Configuración Maestra
Los valores principales están en `AudioConfig.defaults`:
```javascript
defaults: {
    masterVolume: 0.60,  // Volumen maestro (0-1)
    tempo: 110           // Tempo en BPM
}
```

### Referencias Dinámicas UI
Los valores de UI se calculan automáticamente:
```javascript
ui: {
    get volumeSliderDefault() {
        return AudioConfig.utils.volumeToPercentage(AudioConfig.defaults.masterVolume);
        // Automáticamente retorna 60% desde masterVolume: 0.60
    },
    get tempoSliderDefault() {
        return AudioConfig.defaults.tempo;
        // Automáticamente retorna 110 desde defaults.tempo
    }
}
```

## ✨ **Ventajas del Nuevo Sistema**

1. **Sin Duplicación**: Un solo lugar para cada configuración
2. **Sincronización Automática**: Cambiar `defaults.masterVolume` actualiza automáticamente la UI
3. **Consistencia Garantizada**: Imposible tener valores desincronizados
4. **Fácil Mantenimiento**: Cambiar un valor actualiza toda la aplicación

## 🎛️ **Cómo Cambiar Configuraciones**

### Método 1: Directo
```javascript
// Cambiar volumen (actualiza automáticamente UI)
AudioConfig.defaults.masterVolume = 0.75; // UI mostrará 75%

// Cambiar tempo (actualiza automáticamente UI)
AudioConfig.defaults.tempo = 90; // UI mostrará 90 BPM
```

### Método 2: Función Utilitaria
```javascript
// Cambiar múltiples valores con validación
AudioConfig.utils.updateDefaults({
    volume: 0.45,  // 45%
    tempo: 85      // 85 BPM
});
```

### `AudioConfig.defaults`
Configuraciones básicas por defecto:
- `masterVolume`: Volumen maestro inicial (0-1)
- `tempo`: Tempo por defecto en BPM
- `noteDuration`: Duración por defecto de notas individuales
- `chordDuration`: Duración por defecto de acordes
- `pauseBetweenChords`: Pausa entre acordes en progresiones
- `volumeRange` y `tempoRange`: Rangos para los controles de UI

### `AudioConfig.synthesis`
Configuraciones del motor de síntesis de audio:
- `reverb`: Configuración del efecto de reverberación
- `lowPassFilter`: Configuración del filtro paso-bajo
- `harmonics`: Definición de armónicos para simular el sonido del piano
- `detune`: Configuración de desafinación para naturalidad

### `AudioConfig.envelope`
Configuraciones de envolvente ADSR (Attack, Decay, Sustain, Release):
- `lowFrequency`: Configuración para notas graves (< 200 Hz)
- `highFrequency`: Configuración para notas agudas (>= 200 Hz)
- Factores de multiplicación para armónicos

### `AudioConfig.noteFrequencies`
Mapa de frecuencias para todas las notas musicales disponibles.

### `AudioConfig.ui`
Configuraciones específicas de la interfaz de usuario:
- Valores por defecto de sliders
- Configuración de audio de prueba
- Tiempos de delay para animaciones

### `AudioConfig.utils`
Funciones utilitarias para:
- Obtener configuración ADSR basada en frecuencia
- Obtener descripción de tempo basada en BPM
- Convertir entre porcentajes y valores de volumen
- Calcular duración de acordes basada en tempo

## Cómo Usar

La configuración está disponible globalmente como `AudioConfig`. Los archivos que la utilizan son:

1. **`audio.js`**: Utiliza las configuraciones de síntesis, envolvente y frecuencias
2. **`app.js`**: Utiliza configuraciones de tempo, volumen y cálculos de timing
3. **`ui-init.js`**: Configura valores iniciales de la interfaz

## Personalización

Para personalizar las configuraciones:

1. Modifica los valores en `config/audio-config.js`
2. Los cambios se aplicarán automáticamente en toda la aplicación
3. No es necesario modificar múltiples archivos

## Ejemplos de Uso

```javascript
// Obtener volumen por defecto
const defaultVolume = AudioConfig.defaults.masterVolume;

// Calcular duración de acorde
const duration = AudioConfig.utils.calculateChordDuration(120); // 120 BPM

// Obtener configuración ADSR para una frecuencia
const envelope = AudioConfig.utils.getEnvelopeConfig(440); // A4

// Obtener descripción de tempo
const description = AudioConfig.utils.getTempoDescription(80);
```

## Beneficios

1. **Centralización**: Todas las configuraciones en un solo lugar
2. **Mantenibilidad**: Fácil modificación sin tocar múltiples archivos
3. **Consistencia**: Garantiza que todos los componentes usen los mismos valores
4. **Flexibilidad**: Funciones utilitarias para cálculos dinámicos
5. **Documentación**: Configuraciones claramente documentadas y organizadas
