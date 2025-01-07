import { GeneralTab } from './tabs/GeneralTab.js';
import { GraphicsTab } from './tabs/GraphicsTab.js';
import { AudioTab } from './tabs/AudioTab.js';

export class OptionsModal {
    constructor() {
        this.overlay = null;
        this.modal = null;
        this.currentTab = 'general';
        this.tabs = {
            general: new GeneralTab(this),
            graphics: new GraphicsTab(this),
            audio: new AudioTab(this)
        };
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
                <button class="tab-button active" data-tab="general">GERAL</button>
                <button class="tab-button" data-tab="graphics">GRÁFICOS</button>
                <button class="tab-button" data-tab="audio">ÁUDIO</button>
            </div>
            <div class="options-content">
                <div id="general-tab" class="tab-content active"></div>
                <div id="graphics-tab" class="tab-content"></div>
                <div id="audio-tab" class="tab-content"></div>
            </div>
            <div class="options-footer">
                <button class="reset-button">REDEFINIR</button>
                <button class="apply-button">APLICAR</button>
            </div>
        `;

        document.body.appendChild(this.overlay);
        document.body.appendChild(this.modal);

        // Inicializa as tabs
        this.initializeTabs();
        this.setupEvents();
    }

    initializeTabs() {
        // Monta o conteúdo de cada tab
        const generalTab = this.modal.querySelector('#general-tab');
        const graphicsTab = this.modal.querySelector('#graphics-tab');
        const audioTab = this.modal.querySelector('#audio-tab');

        generalTab.appendChild(this.tabs.general.create());
        graphicsTab.appendChild(this.tabs.graphics.create());
        audioTab.appendChild(this.tabs.audio.create());
    }

    saveSettings() {
        const settings = {
            ...this.tabs.general.getSettings(),
            ...this.tabs.graphics.getSettings(),
            ...this.tabs.audio.getSettings()
        };

        localStorage.setItem('gameSettings', JSON.stringify(settings));
        return settings;
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('gameSettings');
        const settings = savedSettings ? JSON.parse(savedSettings) : {};

        // Carrega as configurações em cada tab
        this.tabs.general.loadSettings(settings);
        this.tabs.graphics.loadSettings(settings);
        this.tabs.audio.loadSettings(settings);
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
            this.loadSettings();
            
            // Ativa a primeira tab por padrão
            this.switchTab('general');
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
            
            applyButton.textContent = 'APLICADO!';
            setTimeout(() => {
                applyButton.textContent = 'APLICAR';
                this.overlay.classList.remove('active');
                this.modal.classList.remove('active');
            }, 1000);
        });

        // Botão de redefinir
        const resetButton = this.modal.querySelector('.reset-button');
        resetButton.addEventListener('click', () => {
            localStorage.removeItem('gameSettings');
            this.loadSettings();
            
            resetButton.textContent = 'REDEFINIDO!';
            setTimeout(() => {
                resetButton.textContent = 'REDEFINIR';
            }, 1000);
        });

        // Eventos das tabs
        const tabButtons = this.modal.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tab = button.dataset.tab;
                this.switchTab(tab);
            });
        });
    }

    switchTab(tabName) {
        const tabButtons = this.modal.querySelectorAll('.tab-button');
        const tabContents = this.modal.querySelectorAll('.tab-content');
        
        // Atualiza botões
        tabButtons.forEach(btn => {
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Atualiza conteúdo
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        const activeTab = this.modal.querySelector(`#${tabName}-tab`);
        if (activeTab) {
            activeTab.classList.add('active');
            this.currentTab = tabName;
        }
    }
}
