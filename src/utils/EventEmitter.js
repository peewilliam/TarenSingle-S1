export class EventEmitter {
    constructor() {
        this._events = {};
    }

    on(event, listener) {
        if (!this._events[event]) {
            this._events[event] = [];
        }
        this._events[event].push(listener);
        return () => this.off(event, listener);
    }

    off(event, listener) {
        if (!this._events[event]) return;
        const idx = this._events[event].indexOf(listener);
        if (idx > -1) {
            this._events[event].splice(idx, 1);
        }
    }

    emit(event, ...args) {
        if (!this._events[event]) return;
        this._events[event].forEach(listener => listener(...args));
    }

    once(event, listener) {
        const remove = this.on(event, (...args) => {
            remove();
            listener(...args);
        });
    }
}
