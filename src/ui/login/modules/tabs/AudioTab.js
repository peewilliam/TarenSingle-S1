export class AudioTab {
    constructor(modal) {
        this.modal = modal;
        this.defaultSettings = {
            masterVolume: 100,
            musicVolume: 70,
            effectsVolume: 80,
            voiceVolume: 90,
            ambientVolume: 60,
            audioDevice: 'default',
            audioQuality: 'high'
        };
    }

    create() {
        const container = document.createElement('div');
        container.className = 'tab-container';
        container.innerHTML = `
            <div class="left-column">
                <div class="options-section">
                    <h3>VOLUME PRINCIPAL</h3>
                    <div class="volume-slider">
                        <label>Volume Geral</label>
                        <div class="custom-slider">
                            <div class="slider-handle" style="left: 100%"></div>
                        </div>
                        <div class="slider-value">100%</div>
                    </div>
                    <div class="volume-slider">
                        <label>Música</label>
                        <div class="custom-slider">
                            <div class="slider-handle" style="left: 70%"></div>
                        </div>
                        <div class="slider-value">70%</div>
                    </div>
                    <div class="volume-slider">
                        <label>Efeitos Sonoros</label>
                        <div class="custom-slider">
                            <div class="slider-handle" style="left: 80%"></div>
                        </div>
                        <div class="slider-value">80%</div>
                    </div>
                </div>
            </div>
            <div class="right-column">
                <div class="options-section">
                    <h3>VOLUME AMBIENTE</h3>
                    <div class="volume-slider">
                        <label>Vozes</label>
                        <div class="custom-slider">
                            <div class="slider-handle" style="left: 90%"></div>
                        </div>
                        <div class="slider-value">90%</div>
                    </div>
                    <div class="volume-slider">
                        <label>Sons Ambiente</label>
                        <div class="custom-slider">
                            <div class="slider-handle" style="left: 60%"></div>
                        </div>
                        <div class="slider-value">60%</div>
                    </div>
                </div>
                <div class="options-section">
                    <h3>DISPOSITIVOS</h3>
                    <select class="custom-select" id="audioDevice">
                        <option value="default">Dispositivo Padrão</option>
                        <option value="speakers">Alto-falantes</option>
                        <option value="headphones">Fones de Ouvido</option>
                    </select>
                </div>
                <div class="options-section">
                    <h3>QUALIDADE DO ÁUDIO</h3>
                    <div class="custom-radio">
                        <input type="radio" name="audioQuality" id="audioLow" value="low">
                        <label for="audioLow">Baixa (Stereo)</label>
                    </div>
                    <div class="custom-radio">
                        <input type="radio" name="audioQuality" id="audioHigh" value="high" checked>
                        <label for="audioHigh">Alta (Surround)</label>
                    </div>
                </div>
            </div>
        `;

        this.setupSliders(container);
        return container;
    }

    setupSliders(container) {
        const sliderHandles = container.querySelectorAll('.slider-handle');
        sliderHandles.forEach(handle => {
            let isDragging = false;
            let startX, startLeft;

            handle.addEventListener('mousedown', (e) => {
                isDragging = true;
                startX = e.clientX;
                startLeft = parseInt(handle.style.left) || 0;
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
                e.preventDefault(); // Previne seleção de texto
            });

            const onMouseMove = (e) => {
                if (!isDragging) return;
                
                const dx = e.clientX - startX;
                const parentRect = handle.parentElement.getBoundingClientRect();
                let newLeft = startLeft + (dx / parentRect.width) * 100;
                newLeft = Math.max(0, Math.min(100, newLeft));
                
                handle.style.left = `${newLeft}%`;
                
                const valueDisplay = handle.parentElement.nextElementSibling;
                if (valueDisplay && valueDisplay.classList.contains('slider-value')) {
                    valueDisplay.textContent = `${Math.round(newLeft)}%`;
                }
            };

            const onMouseUp = () => {
                isDragging = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
        });
    }

    getSettings() {
        const container = document.querySelector('#audio-tab');
        const sliders = container.querySelectorAll('.slider-handle');
        
        return {
            masterVolume: parseInt(sliders[0].style.left),
            musicVolume: parseInt(sliders[1].style.left),
            effectsVolume: parseInt(sliders[2].style.left),
            voiceVolume: parseInt(sliders[3].style.left),
            ambientVolume: parseInt(sliders[4].style.left),
            audioDevice: container.querySelector('#audioDevice').value,
            audioQuality: container.querySelector('input[name="audioQuality"]:checked').value
        };
    }

    loadSettings(settings) {
        const container = document.querySelector('#audio-tab');
        const defaulted = { ...this.defaultSettings, ...settings };

        const sliders = container.querySelectorAll('.slider-handle');
        const volumes = [
            defaulted.masterVolume,
            defaulted.musicVolume,
            defaulted.effectsVolume,
            defaulted.voiceVolume,
            defaulted.ambientVolume
        ];

        sliders.forEach((slider, index) => {
            slider.style.left = `${volumes[index]}%`;
            const valueDisplay = slider.parentElement.nextElementSibling;
            if (valueDisplay) valueDisplay.textContent = `${volumes[index]}%`;
        });

        // Dispositivo de áudio
        const audioDevice = container.querySelector('#audioDevice');
        if (audioDevice && defaulted.audioDevice) {
            audioDevice.value = defaulted.audioDevice;
        }

        // Qualidade do áudio
        const audioQuality = container.querySelector(`input[name="audioQuality"][value="${defaulted.audioQuality}"]`);
        if (audioQuality) audioQuality.checked = true;
    }
}
