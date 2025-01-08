export class PlayerStats {
    constructor() {
        this.element = this.createStatsPanel();
    }

    createStatsPanel() {
        const panel = document.createElement('div');
        panel.className = 'stats-panel';

        const statsContainer = document.createElement('div');
        statsContainer.className = 'stats-container';

        // Character name and title
        const characterInfo = document.createElement('div');
        characterInfo.className = 'character-info';
     

        // Character silhouette
        const characterModel = document.createElement('div');
        characterModel.className = 'character-model';

        // Stats list
        const statsList = document.createElement('div');
        statsList.className = 'stats-list';
        
        const stats = [
            'Pontos de Vida', 'Energia', 'Força', 'Agilidade',
            'Esquiva', 'Dano', 'Velocidade de Ataque',
            'DPS', 'Armadura', 'Velocidade', 
        ];


        stats.forEach(stat => {
            const statElement = document.createElement('div');
            statElement.className = 'stat-item';
            statElement.innerHTML = `
                <span class="stat-name">${stat}</span>
                <span class="stat-value" data-stat="${stat.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ /g, '-')}">0</span>
            `;
            statsList.appendChild(statElement);
        });

        panel.appendChild(characterInfo);
        panel.appendChild(characterModel);
        panel.appendChild(statsList);

        return panel;
    }

    updateStats(stats) {
        Object.entries(stats).forEach(([stat, value]) => {
            const statElement = this.element.querySelector(`[data-stat="${stat}"]`);
            if (statElement) {
                statElement.textContent = value;
            }
        });
    }
}
