export class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = new Map();
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;

            // Carregar sons
            await Promise.all([
                this.loadSound('button-hover', '/assets/audio/hover.mp3'),
                this.loadSound('button-click', '/assets/audio/click.mp3'),
                this.loadSound('input-focus', '/assets/audio/focus.mp3'),
                this.loadSound('input-type', '/assets/audio/type.mp3')
            ]);
        } catch (error) {
            console.error('Erro ao inicializar AudioManager:', error);
        }
    }

    async loadSound(name, url) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.sounds.set(name, audioBuffer);
        } catch (error) {
            console.error(`Erro ao carregar som ${name}:`, error);
        }
    }

    playSound(name) {
        if (!this.initialized || !this.sounds.has(name)) return;

        try {
            const source = this.audioContext.createBufferSource();
            source.buffer = this.sounds.get(name);
            source.connect(this.audioContext.destination);
            source.start(0);
        } catch (error) {
            console.error(`Erro ao reproduzir som ${name}:`, error);
        }
    }

    playHoverSound() {
        this.playSound('button-hover');
    }

    playClickSound() {
        this.playSound('button-click');
    }

    dispose() {
        if (this.audioContext) {
            this.audioContext.close();
        }
        this.sounds.clear();
        this.initialized = false;
    }
}
