import { InventoryUI } from '../ui/inventory/InventoryUI';
import { EventEmitter } from './utils/EventEmitter';

export class GameManager {
    constructor() {
        this.events = new EventEmitter();
        this.inventory = new InventoryUI();
        
        // MMORPG Character Stats
        this.playerStats = {
            'pontos-de-vida': '3420/3420',
            'energia': '1200/1200',
            'forca': '342',
            'agilidade': '256',
            'esquiva': '15%',
            'dano': '380-520',
            'velocidade-de-ataque': '1.8',
            'dps': '450',
            'armadura': '1250',
            'velocidade': '115%',
        };

        this.currencies = {
            gold: 6874,
            silver: 254,
            copper: 264
        };

        this.init();
        this.setupEventListeners();
    }

    init() {
        // Update initial stats
        this.inventory.updateStats(this.playerStats);
        this.inventory.updateCurrency(this.currencies);

        // Load starting inventory items
        this.loadPlayerInventory();
    }

    setupEventListeners() {
        // Listen for stat changes
        this.events.on('stat:update', (stat, value) => {
            this.playerStats[stat] = value;
            this.inventory.updateStats({ [stat]: value });
        });

        // Listen for currency changes
        this.events.on('currency:update', (currency, amount) => {
            this.currencies[currency] = amount;
            this.inventory.updateCurrency(this.currencies);
        });

        // Listen for inventory changes
        this.events.on('inventory:itemAdded', (slot, item) => {
            this.inventory.inventoryGrid.addItem(slot, item);
        });

        this.events.on('inventory:itemRemoved', (slot) => {
            this.inventory.inventoryGrid.removeItem(slot);
        });
    }

    loadPlayerInventory() {
        // Example items - replace with your actual item system
        const exampleItems = [
            {
                slot: 0,
                item: {
                    id: 'sword_1',
                    name: 'Steel Sword',
                    icon: '/assets/items/sword.png',
                    rarity: 'common',
                    quantity: 1
                }
            },
            {
                slot: 2,
                item: {
                    id: 'potion_1',
                    name: 'Health Potion',
                    icon: '/assets/items/potion.png',
                    rarity: 'common',
                    quantity: 5
                }
            }
        ];

        // Load items into inventory
        exampleItems.forEach(({ slot, item }) => {
            this.events.emit('inventory:itemAdded', slot, item);
        });
    }

    // Methods for other systems to interact with
    updateStat(stat, value) {
        this.events.emit('stat:update', stat, value);
    }

    updateCurrency(currency, amount) {
        this.events.emit('currency:update', currency, amount);
    }

    addItem(slot, item) {
        this.events.emit('inventory:itemAdded', slot, item);
    }

    removeItem(slot) {
        this.events.emit('inventory:itemRemoved', slot);
    }
}
