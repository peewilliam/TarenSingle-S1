export class GeneralTab {
    constructor(modal) {
        this.modal = modal;
        this.defaultSettings = {
            resolution: '1920x1080 (Recomendado)',
            brightness: 40,
            quality: 60,
            fullscreen: false,
            ambientSound: true,
            textureQuality: 'normal'
        };
    }

    create() {
        const container = document.createElement('div');
        container.className = 'tab-container';
        container.innerHTML = `
            <div class="left-column">
                <div class="options-section">
                    <h3>RESOLUÇÃO</h3>
                    <select class="custom-select" id="resolution">
                        <option value="1920x1080">1920x1080 (Recomendado)</option>
                        <option value="1600x900">1600x900</option>
                        <option value="1366x768">1366x768</option>
                    </select>
                </div>
                
            </div>
            <div class="right-column">
                <div class="options-section">
                    <h3>CONFIGURAÇÕES DE VÍDEO</h3>
                    <label class="custom-checkbox">
                        <input type="checkbox" id="fullscreen">
                        <span>Tela Cheia</span>
                    </label>
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
            });

            const onMouseMove = (e) => {
                if (!isDragging) return;
                
                const dx = e.clientX - startX;
                let newLeft = startLeft + (dx / handle.parentElement.offsetWidth) * 100;
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
        const container = document.querySelector('#general-tab');
        return {
            resolution: container.querySelector('#resolution').value,
            brightness: parseInt(container.querySelector('.slider-handle').style.left),
            quality: parseInt(container.querySelectorAll('.slider-handle')[1].style.left),
            fullscreen: container.querySelector('#fullscreen').checked,
            ambientSound: container.querySelector('#ambientSound').checked,
            textureQuality: container.querySelector('input[name="textures"]:checked')?.value || 'normal'
        };
    }

    loadSettings(settings) {
        const container = document.querySelector('#general-tab');
        const defaulted = { ...this.defaultSettings, ...settings };

        const resolution = container.querySelector('#resolution');
        if (resolution) resolution.value = defaulted.resolution;

        const sliderHandles = container.querySelectorAll('.slider-handle');
        if (sliderHandles[0]) {
            sliderHandles[0].style.left = `${defaulted.brightness}%`;
            const brightnessValue = sliderHandles[0].parentElement.nextElementSibling;
            if (brightnessValue) brightnessValue.textContent = `${defaulted.brightness}%`;
        }
        if (sliderHandles[1]) {
            sliderHandles[1].style.left = `${defaulted.quality}%`;
        }

        const fullscreen = container.querySelector('#fullscreen');
        if (fullscreen) fullscreen.checked = defaulted.fullscreen;

        const ambientSound = container.querySelector('#ambientSound');
        if (ambientSound) ambientSound.checked = defaulted.ambientSound;

        const textureQuality = container.querySelector(`input[name="textures"][value="${defaulted.textureQuality}"]`);
        if (textureQuality) textureQuality.checked = true;
    }
}
