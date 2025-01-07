export class GraphicsTab {
    constructor(modal) {
        this.modal = modal;
        this.defaultSettings = {
            shadows: false,
            particles: true,
            antialiasing: false,
            vsync: true,
            fov: 90,
            renderDistance: 70,
            textureQuality: 'high'
        };
    }

    create() {
        const container = document.createElement('div');
        container.className = 'tab-container';
        container.innerHTML = `
            <div class="left-column">
                <div class="options-section">
                    <h3>EFEITOS VISUAIS</h3>
                    <label class="custom-checkbox">
                        <input type="checkbox" id="shadows">
                        <span>Sombras Dinâmicas</span>
                    </label>
                    <label class="custom-checkbox">
                        <input type="checkbox" id="particles" checked>
                        <span>Efeitos de Partículas</span>
                    </label>
                    <label class="custom-checkbox">
                        <input type="checkbox" id="antialiasing">
                        <span>Anti-Aliasing</span>
                    </label>
                    <label class="custom-checkbox">
                        <input type="checkbox" id="vsync" checked>
                        <span>V-Sync</span>
                    </label>
                </div>
                <div class="options-section">
                    <h3>QUALIDADE DAS TEXTURAS</h3>
                    <div class="custom-radio">
                        <input type="radio" name="textureQuality" id="textureLow" value="low">
                        <label for="textureLow">Baixa</label>
                    </div>
                    <div class="custom-radio">
                        <input type="radio" name="textureQuality" id="textureMedium" value="medium">
                        <label for="textureMedium">Média</label>
                    </div>
                    <div class="custom-radio">
                        <input type="radio" name="textureQuality" id="textureHigh" value="high" checked>
                        <label for="textureHigh">Alta</label>
                    </div>
                </div>
            </div>
            <div class="right-column">
            <div class="options-section">
                    <h3>QUALIDADE GERAL</h3>
                    <div class="custom-slider">
                        <div class="slider-handle" style="left: 60%"></div>
                    </div>
                    <div class="quality-labels">
                        <span>Baixa</span>
                        <span>Média</span>
                        <span>Alta</span>
                    </div>
                </div>
            <div class="options-section">
                    <h3>BRILHO</h3>
                    <div class="custom-slider">
                        <div class="slider-handle" style="left: 40%"></div>
                    </div>
                    <div class="slider-value">40%</div>
                </div>
                <div class="options-section">
                    <h3>CAMPO DE VISÃO (FOV)</h3>
                    <div class="custom-slider">
                        <div class="slider-handle" style="left: 60%"></div>
                    </div>
                    <div class="slider-value">90°</div>
                </div>
                <div class="options-section">
                    <h3>DISTÂNCIA DE RENDERIZAÇÃO</h3>
                    <div class="custom-slider">
                        <div class="slider-handle" style="left: 70%"></div>
                    </div>
                    <div class="quality-labels">
                        <span>Próximo</span>
                        <span>Médio</span>
                        <span>Longe</span>
                    </div>
                </div>
                
                
            </div>
        `;

        this.setupSliders(container);
        return container;
    }

    setupSliders(container) {
        const sliderHandles = container.querySelectorAll('.slider-handle');
        sliderHandles.forEach((handle, index) => {
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
                    if (index === 0) { // FOV slider
                        const fov = Math.round(60 + (newLeft/100) * 60); // FOV range: 60-120
                        valueDisplay.textContent = `${fov}°`;
                    }
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
        const container = document.querySelector('#graphics-tab');
        const fovHandle = container.querySelector('.slider-handle');
        const renderDistanceHandle = container.querySelectorAll('.slider-handle')[1];
        
        const fovValue = parseInt(fovHandle.style.left);
        const fov = Math.round(60 + (fovValue/100) * 60); // FOV range: 60-120
        
        return {
            shadows: container.querySelector('#shadows').checked,
            particles: container.querySelector('#particles').checked,
            antialiasing: container.querySelector('#antialiasing').checked,
            vsync: container.querySelector('#vsync').checked,
            fov: fov,
            renderDistance: parseInt(renderDistanceHandle.style.left),
            textureQuality: container.querySelector('input[name="textureQuality"]:checked').value
        };
    }

    loadSettings(settings) {
        const container = document.querySelector('#graphics-tab');
        const defaulted = { ...this.defaultSettings, ...settings };

        // Checkboxes
        container.querySelector('#shadows').checked = defaulted.shadows;
        container.querySelector('#particles').checked = defaulted.particles;
        container.querySelector('#antialiasing').checked = defaulted.antialiasing;
        container.querySelector('#vsync').checked = defaulted.vsync;

        // FOV Slider
        const fovHandle = container.querySelector('.slider-handle');
        const fovPercentage = ((defaulted.fov - 60) / 60) * 100; // Convert FOV back to percentage
        fovHandle.style.left = `${fovPercentage}%`;
        const fovDisplay = fovHandle.parentElement.nextElementSibling;
        if (fovDisplay) fovDisplay.textContent = `${defaulted.fov}°`;

        // Render Distance Slider
        const renderDistanceHandle = container.querySelectorAll('.slider-handle')[1];
        if (renderDistanceHandle) {
            renderDistanceHandle.style.left = `${defaulted.renderDistance}%`;
        }

        // Texture Quality
        const textureQuality = container.querySelector(`input[name="textureQuality"][value="${defaulted.textureQuality}"]`);
        if (textureQuality) textureQuality.checked = true;
    }
}
