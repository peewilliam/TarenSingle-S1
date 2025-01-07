export class CharacterSelectScene {
    static instance = null;

    constructor() {
        // Singleton pattern
        if (CharacterSelectScene.instance) {
            return CharacterSelectScene.instance;
        }
        CharacterSelectScene.instance = this;

        this.container = null;
        this.characterList = [
            {
                id: 1,
                name: 'IndexJS',
                level: 55,
                class: 'Assassino',
                image: './assets/characters/assassin.jpg',
                selected: false
            },
            {
                id: 2,
                name: 'BlackOut',
                level: 55,
                class: 'Guerreiro',
                image: './assets/characters/warrior.jpg',
                selected: false
            },
            {
                id: 3,
                name: 'D0LLINH0',
                level: 55,
                class: 'Mago',
                image: './assets/characters/mage.jpg',
                selected: false
            }
        ];
        this.selectedCharacter = null;
    }

    loadStyles() {
        // Carrega os estilos se ainda não estiverem carregados
        if (!document.querySelector('link[href*="character-select/styles.css"]')) {
            const styles = document.createElement('link');
            styles.rel = 'stylesheet';
            styles.href = '/src/ui/character-select/styles.css';
            document.head.appendChild(styles);
        }

        // Carrega as fontes
        if (!document.querySelector('link[href*="fonts.googleapis.com/css2?family=Cinzel"]')) {
            const fontLink = document.createElement('link');
            fontLink.rel = 'stylesheet';
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap';
            document.head.appendChild(fontLink);
        }

        // Carrega os ícones
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const iconLink = document.createElement('link');
            iconLink.rel = 'stylesheet';
            iconLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
            document.head.appendChild(iconLink);
        }
    }

    init() {
        // Se já estiver inicializado, retorna
        if (this.container && document.body.contains(this.container)) {
            return;
        }

        // Carrega os estilos necessários
        this.loadStyles();
        
        // Cria e adiciona o container ao body
        this.container = this.create();
        document.body.appendChild(this.container);
        
        // Configura os eventos
        this.setupEvents();
    }

    create() {
        const container = document.createElement('div');
        container.className = 'character-select-scene';
        
        // Layout principal
        const mainContent = document.createElement('div');
        mainContent.className = 'main-content';

        // Mensagem importante (lado esquerdo)
        const messageBox = document.createElement('div');
        messageBox.className = 'important-message';
        messageBox.innerHTML = `
            <h2>MENSAGEM IMPORTANTE</h2>
            <p>Bem-vindo ao mundo de Taren! Aqui você poderá criar e selecionar seus personagens para iniciar sua jornada neste universo épico.</p>
            <button class="read-more-btn">LEIA MAIS</button>
        `;
        mainContent.appendChild(messageBox);

        // Preview do personagem (centro)
        const characterPreview = document.createElement('div');
        characterPreview.className = 'character-preview';
        characterPreview.innerHTML = '<div class="character-silhouette"></div>';
        mainContent.appendChild(characterPreview);

        // Lista de personagens (lado direito)
        const charactersPanel = document.createElement('div');
        charactersPanel.className = 'characters-panel';
        charactersPanel.innerHTML = `
            <div class="panel-header">
                <h2>PERSONAGENS</h2>
            </div>
            <div class="character-list">
                ${this.characterList.map(char => `
                    <div class="character-slot" data-character-id="${char.id}">
                        <div class="character-icon">
                            <img src="${char.image}" alt="${char.name}">
                        </div>
                        <div class="character-info">
                            <h3>${char.name}</h3>
                            <p>Nível ${char.level} ${char.class}</p>
                        </div>
                        <button class="delete-character" title="Deletar Personagem">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
            <div class="panel-footer">
                <button class="create-character-btn">CRIAR PERSONAGEM</button>
                <button class="ready-btn">PRONTO</button>
            </div>
        `;
        mainContent.appendChild(charactersPanel);

        container.appendChild(mainContent);
        return container;
    }

    setupEvents() {
        // Eventos dos slots de personagem
        const characterSlots = this.container.querySelectorAll('.character-slot');
        characterSlots.forEach(slot => {
            slot.addEventListener('click', () => {
                const characterId = parseInt(slot.dataset.characterId);
                this.selectCharacter(characterId);
            });
        });

        // Botão Pronto
        const readyBtn = this.container.querySelector('.ready-btn');
        readyBtn.addEventListener('click', () => {
            if (this.selectedCharacter) {
                this.startGame();
            } else {
                this.showMessage('Por favor, selecione um personagem primeiro.');
            }
        });

        // Botão Criar Personagem
        const createBtn = this.container.querySelector('.create-character-btn');
        createBtn.addEventListener('click', () => {
            console.log('Botão criar personagem clicado');
        });

        // Botões Deletar
        const deleteButtons = this.container.querySelectorAll('.delete-character');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Tem certeza que deseja deletar este personagem?')) {
                    console.log('Deletar personagem clicado');
                }
            });
        });
    }

    cleanup() {
        if (this.container) {
            // Remove todos os event listeners
            const characterSlots = this.container.querySelectorAll('.character-slot');
            characterSlots.forEach(slot => {
                slot.replaceWith(slot.cloneNode(true));
            });

            // Remove o container
            this.container.remove();
            this.container = null;
        }
        
        // Reseta o estado
        this.selectedCharacter = null;
        CharacterSelectScene.instance = null;
    }

    showMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message-popup';
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.classList.add('fade-out');
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }

    selectCharacter(characterId) {
        // Remove seleção anterior
        const previousSelected = this.container.querySelector('.character-slot.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }

        // Seleciona novo personagem
        const character = this.characterList.find(char => char.id === characterId);
        if (character) {
            this.selectedCharacter = character;
            const slot = this.container.querySelector(`.character-slot[data-character-id="${characterId}"]`);
            slot.classList.add('selected');
        }
    }

    startGame() {
        // Limpa a cena antes de iniciar o jogo
        this.cleanup();
        console.log('Iniciando jogo com o personagem:', this.selectedCharacter);
    }
}
