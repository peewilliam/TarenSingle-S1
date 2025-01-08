import { PlayerStats } from './PlayerStats.js';
import { InventoryGrid } from './InventoryGrid.js';
import './inventory.css';

export class InventoryUI {
    constructor() {
        this.isVisible = false;
        this.isStatsVisible = false;
        this.container = null;
        this.statsContainer = null;
        this.playerStats = new PlayerStats();
        this.inventoryGrid = new InventoryGrid(5, 7); // 5 colunas, 7 linhas
        this.init();
    }

    init() {
        this.initStats();
        this.initInventory();
        this.addKeyboardListener();
    }

    initInventory() {
        // Create inventory container
        this.container = document.createElement('div');
        this.container.className = 'inventory-container draggable';
        this.container.style.display = 'none';

        // Add header with close button
        const headerBar = document.createElement('div');
        headerBar.className = 'window-header';
        
        const title = document.createElement('div');
        title.className = 'window-title';
        title.textContent = 'INVENTÁRIO';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-btn';
        closeBtn.innerHTML = '×';
        closeBtn.addEventListener('click', () => {
            this.container.style.display = 'none';
            this.isVisible = false;
        });

        headerBar.appendChild(title);
        headerBar.appendChild(closeBtn);
        this.container.appendChild(headerBar);

        // Add toggle stats button
        const toggleStatsBtn = document.createElement('button');
        toggleStatsBtn.className = 'toggle-stats-btn';
        toggleStatsBtn.innerHTML = '<span>⟪</span>';
        toggleStatsBtn.addEventListener('click', () => this.toggleStats());
        this.container.appendChild(toggleStatsBtn);

        // Create inventory section
        const inventorySection = document.createElement('div');
        inventorySection.className = 'inventory-section';

        // Add character header
        // const characterHeader = document.createElement('div');
        // characterHeader.className = 'character-header';
        // characterHeader.innerHTML = `
        //     <div class="character-title">CHARACTER NAME</div>
        //     <div class="character-subtitle">Title Goes Here</div>
        // `;
        // inventorySection.appendChild(characterHeader);

        // Create character equipment section
        const equipmentSection = document.createElement('div');
        equipmentSection.className = 'equipment-section';

        // Create left equipment slots
        const leftEquipSlots = document.createElement('div');
        leftEquipSlots.className = 'equipment-slots left';
        for (let i = 0; i < 6; i++) {
            const slot = document.createElement('div');
            slot.className = 'equipment-slot';
            leftEquipSlots.appendChild(slot);
        }

        // Create character model
        const characterModel = document.createElement('div');
        characterModel.className = 'character-model';

        // Create right equipment slots
        const rightEquipSlots = document.createElement('div');
        rightEquipSlots.className = 'equipment-slots right';
        for (let i = 0; i < 6; i++) {
            const slot = document.createElement('div');
            slot.className = 'equipment-slot';
            rightEquipSlots.appendChild(slot);
        }

        // Add all elements to equipment section
        equipmentSection.appendChild(leftEquipSlots);
        equipmentSection.appendChild(characterModel);
        equipmentSection.appendChild(rightEquipSlots);

        // Add equipment section before inventory grid
        inventorySection.appendChild(equipmentSection);

        // Add inventory grid
        inventorySection.appendChild(this.inventoryGrid.element);

        // Add currency display
        const currencyDisplay = document.createElement('div');
        currencyDisplay.className = 'currency-display';
        currencyDisplay.innerHTML = `
            <div class="currency-item">
                <div class="currency-icon currency-gold"></div>
                <span>2,874</span>
            </div>
            <div class="currency-item">
                <div class="currency-icon currency-silver"></div>
                <span>254</span>
            </div>
            <div class="currency-item">
                <div class="currency-icon currency-copper"></div>
                <span>264</span>
            </div>
        `;
        inventorySection.appendChild(currencyDisplay);
        
        this.container.appendChild(inventorySection);
        
        document.body.appendChild(this.container);
        document.body.appendChild(this.statsContainer);
        this.setupDraggable(this.container);
    }

    initStats() {
        // Create stats container
        this.statsContainer = document.createElement('div');
        this.statsContainer.className = 'stats-container';
        this.statsContainer.style.display = 'none';

        // Add header with title
        const headerBar = document.createElement('div');
        headerBar.className = 'window-header';
        
        const title = document.createElement('div');
        title.className = 'window-title';
        title.textContent = 'STATUS DO PERSONAGEM';
        
        headerBar.appendChild(title);
        this.statsContainer.appendChild(headerBar);

        // Create stats section
        const statsSection = document.createElement('div');
        statsSection.className = 'stats-section';
        statsSection.appendChild(this.playerStats.element);

        this.statsContainer.appendChild(statsSection);
    }

    setupDraggable(element) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        // Bind do this para todas as funções
        const self = this;

        function applyDrag(e) {
            if (e.target.closest('.window-header') && !e.target.closest('.close-btn')) {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
                isDragging = true;
            }
        }

        function moveElements(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;

                // Move ambos os elementos mantendo-os alinhados
                const offsetX = -273; // Invertido para posicionar à esquerda
                self.container.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`;
                self.statsContainer.style.transform = `translate(calc(-50% + ${currentX + offsetX}px), calc(-50% + ${currentY}px))`;
            }
        }

        function stopDrag() {
            isDragging = false;
        }

        // Adiciona listeners no inventário
        element.addEventListener('mousedown', applyDrag);
        
        // Adiciona listeners no stats
        this.statsContainer.addEventListener('mousedown', applyDrag);

        // Listeners globais para movimento e parada
        document.addEventListener('mousemove', moveElements);
        document.addEventListener('mouseup', stopDrag);
    }

    addKeyboardListener() {
        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'i') {
                this.toggleInventory();
            }
        });
    }

    toggleInventory() {
        this.isVisible = !this.isVisible;
        if (this.isVisible) {
            this.container.style.display = 'flex';
            if (this.isStatsVisible) {
                this.statsContainer.style.display = 'flex';
            }
        } else {
            this.container.style.display = 'none';
            this.statsContainer.style.display = 'none';
        }
    }

    handleSend() {
        // Implementar lógica de envio aqui
        console.log('Send clicked');
    }

    toggleStats() {
        this.isStatsVisible = !this.isStatsVisible;
        const toggleBtn = this.container.querySelector('.toggle-stats-btn');
        
        if (this.isStatsVisible) {
            this.statsContainer.style.display = 'flex';
            this.container.classList.add('stats-visible');
            toggleBtn.innerHTML = '<span>⟪</span>';
        } else {
            this.statsContainer.style.display = 'none';
            this.container.classList.remove('stats-visible');
            toggleBtn.innerHTML = '<span>⟫</span>';
        }
    }

    updateStats(stats) {
        this.playerStats.updateStats(stats);
    }

    updateCurrency(currencies) {
        const { gold, silver, copper } = currencies;
        const goldSpan = this.container.querySelector('.currency-display .currency-item:nth-child(1) span');
        const silverSpan = this.container.querySelector('.currency-display .currency-item:nth-child(2) span');
        const copperSpan = this.container.querySelector('.currency-display .currency-item:nth-child(3) span');
        
        if (goldSpan) goldSpan.textContent = gold.toLocaleString();
        if (silverSpan) silverSpan.textContent = silver.toLocaleString();
        if (copperSpan) copperSpan.textContent = copper.toLocaleString();
    }
}
