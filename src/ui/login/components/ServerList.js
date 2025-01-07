class ServerList {
    constructor(container) {
        this.container = container;
        this.init();
    }

    init() {
        this.container.className = 'server-list';
        this.createServers();
    }

    createServers() {
        const servers = [
            { id: 1, name: 'Servidor 1', status: 'online', population: 'high' },
            { id: 2, name: 'Servidor 2', status: 'online', population: 'medium' },
            { id: 3, name: 'Servidor 3', status: 'online', population: 'low' }
        ];

        servers.forEach(server => {
            const serverItem = this.createServerItem(server);
            this.container.appendChild(serverItem);
        });
    }

    createServerItem(server) {
        const item = document.createElement('div');
        item.className = 'server-item';

        const status = document.createElement('div');
        status.className = `server-status ${server.status}`;

        const name = document.createElement('span');
        name.className = 'server-name';
        name.textContent = server.name;

        const population = document.createElement('span');
        population.className = `server-population ${server.population}`;
        population.textContent = this.getPopulationText(server.population);

        item.appendChild(status);
        item.appendChild(name);
        item.appendChild(population);

        return item;
    }

    getPopulationText(population) {
        switch (population) {
            case 'high': return 'Alto';
            case 'medium': return 'Médio';
            case 'low': return 'Baixo';
            default: return '';
        }
    }
}

export default ServerList;
