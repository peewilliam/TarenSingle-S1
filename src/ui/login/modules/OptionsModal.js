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

    setupEvents() {
        // Botão de configurações
        const settingsButton = document.createElement('button');
        settingsButton.className = 'settings-button';
        settingsButton.setAttribute('aria-label', 'Configurações');
        settingsButton.innerHTML = '<i class="fas fa-cog"></i>';
        document.body.appendChild(settingsButton);

        // Eventos
        settingsButton.addEventListener('click', () => {
            this.overlay.classList.add('active');
            this.modal.classList.add('active');
        });

        const closeButton = this.modal.querySelector('.options-close');
        closeButton.addEventListener('click', () => {
            this.overlay.classList.remove('active');
            this.modal.classList.remove('active');
        });

        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.overlay.classList.remove('active');
                this.modal.classList.remove('active');
            }
        });

        // Eventos das tabs
        const tabButtons = this.modal.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }
}
