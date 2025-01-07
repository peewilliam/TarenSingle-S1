class SystemInfo {
    constructor(container) {
        this.container = container;
        this.lastFrame = performance.now();
        this.init();
    }

    init() {
        this.container.className = 'system-info';
        this.createMetrics();
        this.startUpdating();
    }

    createMetrics() {
        const fpsCounter = this.createCounter('fps-counter', `
            <svg class="icon" width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm10-6h-4V8c0-2.21-1.79-4-4-4h-4C7.79 4 6 5.79 6 8v2H2v8h20v-8zM8 8c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v2H8V8z"/>
            </svg>
            60 FPS
        `);

        const pingCounter = this.createCounter('ping-counter', `
            <svg class="icon" width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                <path fill="currentColor" d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
            </svg>
            15ms
        `);

        this.container.appendChild(fpsCounter);
        this.container.appendChild(pingCounter);

        this.fpsDisplay = fpsCounter;
        this.pingDisplay = pingCounter;
    }

    createCounter(className, innerHTML) {
        const counter = document.createElement('span');
        counter.className = className;
        counter.innerHTML = innerHTML;
        return counter;
    }

    startUpdating() {
        setInterval(() => this.updateMetrics(), 1000);
    }

    updateMetrics() {
        if (this.fpsDisplay) {
            const fps = Math.round(1000 / (performance.now() - this.lastFrame));
            this.fpsDisplay.textContent = `${Math.min(fps, 60)} FPS`;
            this.lastFrame = performance.now();
        }

        if (this.pingDisplay) {
            const ping = Math.round(20 + Math.random() * 10);
            this.pingDisplay.textContent = `${ping}ms`;
        }
    }
}

export default SystemInfo;
