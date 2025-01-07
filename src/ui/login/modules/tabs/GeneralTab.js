import { SettingsManager } from '../SettingsManager.js';

export class GeneralTab {
    constructor(modal) {
        this.modal = modal;
        this.settingsManager = SettingsManager.getInstance();
    }

    create() {
        const container = document.createElement('div');
        container.className = 'tab-container';
        container.innerHTML = `
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

        // Configura o checkbox
        const fullscreenCheckbox = container.querySelector('#fullscreen');
        if (fullscreenCheckbox) {
            // Define estado inicial
            fullscreenCheckbox.checked = this.settingsManager.getSetting('fullscreen');
            
            // Adiciona listener para mudanças
            fullscreenCheckbox.addEventListener('change', (e) => {
                this.settingsManager.setSetting('fullscreen', e.target.checked);
            });
        }

        return container;
    }

    getSettings() {
        const fullscreenCheckbox = document.querySelector('#general-tab #fullscreen');
        return {
            fullscreen: fullscreenCheckbox ? fullscreenCheckbox.checked : false
        };
    }

    loadSettings(settings) {
        const fullscreenCheckbox = document.querySelector('#general-tab #fullscreen');
        if (fullscreenCheckbox && settings.fullscreen !== undefined) {
            fullscreenCheckbox.checked = settings.fullscreen;
        }
    }

    async applySettings(settings) {
        if (settings.fullscreen !== undefined) {
            await this.settingsManager.applySettings();
        }
    }
}
