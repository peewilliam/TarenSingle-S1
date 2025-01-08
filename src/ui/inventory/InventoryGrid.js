export class InventoryGrid {
    constructor(columns, rows) {
        this.columns = columns;
        this.rows = rows;
        this.slots = [];
        this.element = this.createGrid();
    }

    createGrid() {
        const grid = document.createElement('div');
        grid.className = 'inventory-grid';
        
        const totalSlots = this.columns * this.rows;
        
        for (let i = 0; i < totalSlots; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            slot.dataset.slot = i;
            
            slot.addEventListener('click', () => this.handleSlotClick(slot));
            
            this.slots.push(slot);
            grid.appendChild(slot);
        }
        
        return grid;
    }

    handleSlotClick(slot) {
        // Remove seleção de todos os slots
        this.slots.forEach(s => s.classList.remove('selected'));
        
        // Adiciona seleção ao slot clicado
        slot.classList.add('selected');
    }

    // Método vazio para compatibilidade
    updateCurrency() {
        // A atualização de moeda agora é feita no InventoryUI
    }
}
