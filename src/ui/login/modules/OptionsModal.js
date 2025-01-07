export class OptionsModal {
    constructor() {
        this.overlay = null;
        this.modal = null;
    }

    create() {
        // Overlay de fundo
        this.overlay = document.createElement('div');
        this.overlay.className = 'modal-overlay';

        // Janela de configurações
        this.modal = document.createElement('div');
        this.modal.className = 'options-modal';
        this.modal.innerHTML = `
            <div class="options-header">
                <h2 class="options-title">CONFIGURAÇÕES</h2>
                <button class="options-close" aria-label="Fechar configurações">&times;</button>
            </div>
            <div class="options-tabs">
                <button class="tab-button active">GERAL</button>
                <button class="tab-button">GRÁFICOS</button>
                <button class="tab-button">ÁUDIO</button>
            </div>
            <div class="options-content">
                <div class="left-column">
                    <div class="options-section">
                        <h3>RESOLUÇÃO</h3>
                        <select class="custom-select">
                            <option>Selecione a resolução</option>
                            <option>1920x1080 (Recomendado)</option>
                            <option>1600x900</option>
                            <option>1366x768</option>
                        </select>
                    </div>
                    <div class="options-section">
                        <h3>BRILHO</h3>
                        <div class="custom-slider">
                            <div class="slider-handle" style="left: 40%"></div>
                        </div>
                        <div style="text-align: right; color: #666;">40%</div>
                    </div>
                    <div class="options-section">
                        <h3>QUALIDADE GERAL</h3>
                        <div class="custom-slider">
                            <div class="slider-handle" style="left: 60%"></div>
                        </div>
                        <div style="display: flex; justify-content: space-between; color: #666;">
                            <span>Baixa</span>
                            <span>Média</span>
                            <span>Alta</span>
                        </div>
                    </div>
                </div>
                <div class="right-column">
                    <div class="options-section">
                        <h3>CONFIGURAÇÕES DE VÍDEO</h3>
                        <label class="custom-checkbox">
                            <input type="checkbox">
                            <span>Tela Cheia</span>
                        </label>
                    </div>
                    <div class="options-section">
                        <h3>CONFIGURAÇÕES DE ÁUDIO</h3>
                        <label class="custom-checkbox">
                            <input type="checkbox" checked>
                            <span>Som Ambiente</span>
                        </label>
                    </div>
                    <div class="options-section">
                        <h3>QUALIDADE DAS TEXTURAS</h3>
                        <div class="custom-radio">
                            <input type="radio" name="textures" id="radio1">
                            <label for="radio1">Normal</label>
                        </div>
                        <div class="custom-radio">
                            <input type="radio" name="textures" id="radio2">
                            <label for="radio2">Alta Qualidade</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="options-footer">
                <button class="apply-button">APLICAR</button>
            </div>
        `;

        document.body.appendChild(this.overlay);
        document.body.appendChild(this.modal);

        this.setupEvents();
    }

    saveSettings() {
        const settings = {
            resolution: this.modal.querySelector('.custom-select').value,
            brightness: parseInt(this.modal.querySelector('.slider-handle').style.left),
            quality: parseInt(this.modal.querySelectorAll('.slider-handle')[1].style.left),
            fullscreen: this.modal.querySelector('input[type="checkbox"]').checked,
            ambientSound: this.modal.querySelectorAll('input[type="checkbox"]')[1].checked,
            textureQuality: this.modal.querySelector('input[name="textures"]:checked')?.id || 'radio1'
        };

        localStorage.setItem('gameSettings', JSON.stringify(settings));
        return settings;
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('gameSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            
            // Aplica as configurações salvas
            this.modal.querySelector('.custom-select').value = settings.resolution;
            this.modal.querySelector('.slider-handle').style.left = `${settings.brightness}%`;
            this.modal.querySelectorAll('.slider-handle')[1].style.left = `${settings.quality}%`;
            this.modal.querySelector('input[type="checkbox"]').checked = settings.fullscreen;
            this.modal.querySelectorAll('input[type="checkbox"]')[1].checked = settings.ambientSound;
            
            if (settings.textureQuality) {
                const radioButton = this.modal.querySelector(`#${settings.textureQuality}`);
                if (radioButton) radioButton.checked = true;
            }
        }
    }

    setupEvents() {
        // Botão de configurações
        const settingsButton = document.createElement('button');
        settingsButton.className = 'settings-button';
        settingsButton.setAttribute('aria-label', 'Configurações');
        settingsButton.innerHTML = '<i class="fas fa-cog"></i>';
        document.body.appendChild(settingsButton);

        // Eventos do modal
        settingsButton.addEventListener('click', () => {
            this.overlay.classList.add('active');
            this.modal.classList.add('active');
            this.loadSettings(); // Carrega as configurações salvas
        });

        // Botão de fechar
        const closeButton = this.modal.querySelector('.options-close');
        closeButton.addEventListener('click', () => {
            this.overlay.classList.remove('active');
            this.modal.classList.remove('active');
        });

        // Botão de aplicar
        const applyButton = this.modal.querySelector('.apply-button');
        applyButton.addEventListener('click', () => {
            const settings = this.saveSettings();
            console.log('Configurações salvas:', settings);
            
            // Feedback visual
            applyButton.textContent = 'APLICADO!';
            setTimeout(() => {
                applyButton.textContent = 'APLICAR';
                this.overlay.classList.remove('active');
                this.modal.classList.remove('active');
            }, 1000);
        });

        // Eventos dos sliders
        const sliderHandles = this.modal.querySelectorAll('.slider-handle');
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
                
                // Limita entre 0% e 100%
                newLeft = Math.max(0, Math.min(100, newLeft));
                
                handle.style.left = `${newLeft}%`;
                
                // Atualiza o texto de porcentagem se existir
                const percentageText = handle.parentElement.nextElementSibling;
                if (percentageText && !percentageText.querySelector('span')) {
                    percentageText.textContent = `${Math.round(newLeft)}%`;
                }
            };

            const onMouseUp = () => {
                isDragging = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
        });
    }
}
