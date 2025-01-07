class ChannelSelect {
    constructor(container) {
        this.container = container;
        this.init();
    }

    init() {
        this.container.className = 'channel-select';
        this.createChannels();
    }

    createChannels() {
        const channels = [
            { id: 1, name: 'Canal 1', population: 'high' },
            { id: 2, name: 'Canal 2', population: 'medium' },
            { id: 3, name: 'Canal 3', population: 'low' },
            { id: 4, name: 'Canal 4', population: 'low' }
        ];

        channels.forEach(channel => {
            const channelBtn = this.createChannelButton(channel);
            this.container.appendChild(channelBtn);
        });
    }

    createChannelButton(channel) {
        const button = document.createElement('button');
        button.className = 'channel-btn';
        
        const populationTitle = {
            high: 'População Alta',
            medium: 'População Média',
            low: 'População Baixa'
        };

        button.innerHTML = `
            ${channel.name}
            <div class="population-indicator population-${channel.population}" 
                title="${populationTitle[channel.population]}">
            </div>
        `;

        button.addEventListener('click', () => {
            this.container.querySelectorAll('.channel-btn').forEach(btn => 
                btn.classList.remove('active')
            );
            button.classList.add('active');
            this.onChannelSelect(channel);
        });

        return button;
    }

    onChannelSelect(channel) {
        // Evento para ser sobrescrito pela classe pai
        console.log(`Canal selecionado: ${channel.name}`);
    }
}

export default ChannelSelect;
