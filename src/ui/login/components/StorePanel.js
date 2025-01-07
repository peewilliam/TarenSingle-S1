class StorePanel {
    constructor(container) {
        this.container = container;
        this.init();
    }

    init() {
        this.container.className = 'panel-content store-content';
        this.loadStore();
    }

    async loadStore() {
        const storeContent = document.createElement('div');
        storeContent.className = 'store-content';

        const featuredItem = this.createFeaturedItem();
        const categories = this.createCategories();

        storeContent.appendChild(featuredItem);
        storeContent.appendChild(categories);
        this.container.appendChild(storeContent);
    }

    createFeaturedItem() {
        const featured = document.createElement('div');
        featured.className = 'store-featured';

        featured.innerHTML = `
            <div class="featured-item">
                <div class="item-preview" style="background-image: url('assets/images/store/mount-dragon.jpg');">
                    <div class="item-badges">
                        <span class="badge new">Novo</span>
                        <span class="badge limited">Limitado</span>
                    </div>
                    <div class="item-overlay">
                        <h3>Dragão Celestial</h3>
                        <div class="item-description">
                            <p>Monte lendária com efeitos visuais exclusivos e bônus de velocidade</p>
                            <ul class="item-features">
                                <li>+50% Velocidade de Movimento</li>
                                <li>Efeito Visual Único</li>
                                <li>Animações Exclusivas</li>
                            </ul>
                        </div>
                        <div class="item-price">
                            <div class="price-info">
                                <span class="original-price">2500</span>
                                <span class="discount-price">1875 TC</span>
                                <span class="discount-tag">-25%</span>
                            </div>
                            <button class="buy-button">Comprar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return featured;
    }

    createCategories() {
        const categories = document.createElement('div');
        categories.className = 'store-categories';

        const items = [
            {
                image: 'assets/images/store/costume1.jpg',
                name: 'Armadura do Guardião',
                type: 'Traje Completo',
                price: '1200 TC',
                badge: 'Popular'
            },
            {
                image: 'assets/images/store/pet1.jpg',
                name: 'Filhote de Fênix',
                type: 'Mascote',
                price: '800 TC',
                badge: 'Novo'
            },
            {
                image: 'assets/images/store/effect1.jpg',
                name: 'Aura Celestial',
                type: 'Efeito Visual',
                price: '500 TC'
            }
        ];

        const row = document.createElement('div');
        row.className = 'category-row';

        items.forEach(item => {
            const storeItem = this.createStoreItem(item);
            row.appendChild(storeItem);
        });

        categories.appendChild(row);
        return categories;
    }

    createStoreItem({ image, name, type, price, badge }) {
        const item = document.createElement('div');
        item.className = 'store-item';

        item.innerHTML = `
            <div class="item-preview" style="background-image: url('${image}');">
                ${badge ? `<span class="badge ${badge.toLowerCase()}">${badge}</span>` : ''}
                <div class="quick-view">
                    <span class="price">${price}</span>
                    <button class="preview-btn">Visualizar</button>
                </div>
            </div>
            <div class="item-details">
                <h4>${name}</h4>
                <span class="item-type">${type}</span>
            </div>
        `;

        // Event Listeners
        const quickView = item.querySelector('.quick-view');
        item.addEventListener('mouseenter', () => quickView.style.opacity = '1');
        item.addEventListener('mouseleave', () => quickView.style.opacity = '0');

        const previewBtn = item.querySelector('.preview-btn');
        previewBtn.addEventListener('click', () => this.handlePreview(name));

        return item;
    }

    handlePreview(itemName) {
        console.log(`Previewing item: ${itemName}`);
        // Implementar preview do item
    }
}

export default StorePanel;
