export class SettingsManager {
    static instance = null;
    
    constructor() {
        if (SettingsManager.instance) {
            return SettingsManager.instance;
        }
        
        this.settings = {
            fullscreen: false,
            // Outras configurações aqui
        };
        
        // Carrega configurações do localStorage
        this.loadSettings();
        
        // Singleton
        SettingsManager.instance = this;
        
        // Adiciona listener para mudanças no estado de fullscreen
        document.addEventListener('fullscreenchange', () => {
            this.settings.fullscreen = !!document.fullscreenElement;
            this.saveSettings();
            this.notifyListeners('fullscreen');
        });
        
        // Lista de callbacks para notificar mudanças
        this.listeners = new Map();
    }
    
    // Carrega configurações do localStorage
    loadSettings() {
        const savedSettings = localStorage.getItem('gameSettings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                this.settings = { ...this.settings, ...parsed };
                console.log('Settings loaded:', this.settings);
            } catch (err) {
                console.error('Error loading settings:', err);
            }
        }
    }
    
    // Salva configurações no localStorage
    saveSettings() {
        try {
            localStorage.setItem('gameSettings', JSON.stringify(this.settings));
            console.log('Settings saved:', this.settings);
        } catch (err) {
            console.error('Error saving settings:', err);
        }
    }
    
    // Obtém uma configuração
    getSetting(key) {
        return this.settings[key];
    }
    
    // Define uma configuração
    setSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
        this.notifyListeners(key);
    }
    
    // Aplica todas as configurações
    async applySettings() {
        console.log('Applying settings:', this.settings);
        
        // Aplica fullscreen
        if (this.settings.fullscreen && !document.fullscreenElement) {
            try {
                await document.documentElement.requestFullscreen();
            } catch (err) {
                console.error('Error requesting fullscreen:', err);
            }
        } else if (!this.settings.fullscreen && document.fullscreenElement) {
            try {
                await document.exitFullscreen();
            } catch (err) {
                console.error('Error exiting fullscreen:', err);
            }
        }
        
        // Outras aplicações de configurações aqui
    }
    
    // Adiciona um listener para mudanças em configurações
    addListener(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, new Set());
        }
        this.listeners.get(key).add(callback);
    }
    
    // Remove um listener
    removeListener(key, callback) {
        if (this.listeners.has(key)) {
            this.listeners.get(key).delete(callback);
        }
    }
    
    // Notifica listeners sobre mudanças
    notifyListeners(key) {
        if (this.listeners.has(key)) {
            const value = this.settings[key];
            this.listeners.get(key).forEach(callback => callback(value));
        }
    }
    
    // Obtém a instância do singleton
    static getInstance() {
        if (!SettingsManager.instance) {
            new SettingsManager();
        }
        return SettingsManager.instance;
    }
}
