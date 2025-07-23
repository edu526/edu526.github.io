// Inicialización de valores por defecto de la UI con la configuración de audio

document.addEventListener('DOMContentLoaded', function() {
    // Configurar valores por defecto de los sliders usando AudioConfig
    
    // Slider de volumen
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');
    if (volumeSlider && volumeValue) {
        const defaultVolumePercentage = AudioConfig.ui.volumeSliderDefault;
        
        // Configurar rango
        volumeSlider.min = AudioConfig.defaults.volumeRange.min;
        volumeSlider.max = AudioConfig.defaults.volumeRange.max;
        volumeSlider.step = AudioConfig.defaults.volumeRange.step;
        
        // Configurar valor por defecto
        volumeSlider.value = defaultVolumePercentage;
        volumeValue.textContent = defaultVolumePercentage + '%';
        
        console.log(`Volumen configurado: ${defaultVolumePercentage}%`);
    }
    
    // Slider de tempo
    const tempoSlider = document.getElementById('tempoSlider');
    const tempoValue = document.getElementById('tempoValue');
    const tempoDescription = document.getElementById('tempoDescription');
    if (tempoSlider && tempoValue && tempoDescription) {
        const defaultTempo = AudioConfig.ui.tempoSliderDefault;
        
        // Configurar rango
        tempoSlider.min = AudioConfig.defaults.tempoRange.min;
        tempoSlider.max = AudioConfig.defaults.tempoRange.max;
        tempoSlider.step = AudioConfig.defaults.tempoRange.step;
        
        // Configurar valor por defecto
        tempoSlider.value = defaultTempo;
        tempoValue.textContent = defaultTempo;
        
        // Configurar descripción inicial
        const initialDescription = AudioConfig.utils.getTempoDescription.call(AudioConfig, defaultTempo);
        tempoDescription.textContent = initialDescription;
        
        console.log(`Tempo configurado: ${defaultTempo} BPM - ${initialDescription}`);
    }
    
    // Configurar el volumen inicial en el sistema de audio cuando esté disponible
    if (typeof pianoAudio !== 'undefined') {
        const defaultVolumeDecimal = AudioConfig.utils.percentageToVolume.call(AudioConfig, AudioConfig.ui.volumeSliderDefault);
        pianoAudio.setMasterVolume(defaultVolumeDecimal);
        console.log(`Volumen del sistema de audio configurado: ${defaultVolumeDecimal}`);
    } else {
        // Si pianoAudio no está disponible aún, configurar cuando se cargue
        window.addEventListener('load', function() {
            if (typeof pianoAudio !== 'undefined') {
                const defaultVolumeDecimal = AudioConfig.utils.percentageToVolume.call(AudioConfig, AudioConfig.ui.volumeSliderDefault);
                pianoAudio.setMasterVolume(defaultVolumeDecimal);
                console.log(`Volumen del sistema de audio configurado (delayed): ${defaultVolumeDecimal}`);
            }
        });
    }
    
    console.log('Configuraciones de audio inicializadas desde AudioConfig');
});