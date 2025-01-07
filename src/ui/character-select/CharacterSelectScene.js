import { GameEngine } from '../../game/core/GameEngine.js';

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
                this.startGame(this.selectedCharacter);
            } else {
                this.showMessage('Por favor, selecione um personagem primeiro.');
            }
        });

        // Botão Criar Personagem
        const createBtn = this.container.querySelector('.create-character-btn');
        createBtn.addEventListener('click', () => {
            this.createCharacterModal();
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

    createCharacterModal() {
        const modal = document.createElement('div');
        modal.className = 'create-character-modal';
        modal.innerHTML = `
            <div class="modal-content character-creation">
                <div class="creation-container">
                    <div class="left-panel">
                        <!-- Gênero -->
                        <div class="section gender-section">
                            <h3>GÊNERO</h3>
                            <div class="gender-options">
                                <label class="gender-option">
                                    <input type="radio" name="gender" value="masculine" required>
                                    <span class="gender-icon masculine">♂</span>
                                </label>
                                <label class="gender-option">
                                    <input type="radio" name="gender" value="feminine">
                                    <span class="gender-icon feminine">♀</span>
                                </label>
                            </div>
                        </div>

                        <!-- Aparência -->
                        <div class="section appearance-section">
                            <h3>APARÊNCIA</h3>
                            <div class="appearance-options">
                                <div class="appearance-row">
                                    <label>CABELO</label>
                                    <div class="slider-controls">
                                        <button class="prev-btn">◄</button>
                                        <button class="next-btn">►</button>
                                    </div>
                                </div>
                                <div class="appearance-row">
                                    <label>ROSTO</label>
                                    <div class="slider-controls">
                                        <button class="prev-btn">◄</button>
                                        <button class="next-btn">►</button>
                                    </div>
                                </div>
                                <div class="appearance-row">
                                    <label>TATUAGEM</label>
                                    <div class="slider-controls">
                                        <button class="prev-btn">◄</button>
                                        <button class="next-btn">►</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Tom de Pele -->
                        <div class="section skin-section">
                            <h3>TOM DE PELE</h3>
                            <div class="skin-tones">
                                <button class="skin-tone" data-tone="1"></button>
                                <button class="skin-tone" data-tone="2"></button>
                                <button class="skin-tone" data-tone="3"></button>
                                <button class="skin-tone" data-tone="4"></button>
                                <button class="skin-tone" data-tone="5"></button>
                                <button class="skin-tone" data-tone="6"></button>
                            </div>
                        </div>
                    </div>

                    <div class="center-panel">
                        <!-- Preview do Personagem -->
                        <div class="character-preview">
                            <div class="character-silhouette"></div>
                        </div>
                        <!-- Campo de Nome -->
                        <div class="name-input">
                            <input type="text" id="charName" name="charName" placeholder="NOME DO PERSONAGEM"
                                   required maxlength="12" pattern="[a-zA-Z0-9]+"
                                   title="Apenas letras e números são permitidos">
                        </div>
                    </div>
                </div>

                <div class="footer-actions">
                    <button type="button" class="back-btn">VOLTAR</button>
                    <button type="button" class="play-btn">CRIAR</button>
                </div>
            </div>
        `;

        // Eventos do modal
        const backBtn = modal.querySelector('.back-btn');
        const playBtn = modal.querySelector('.play-btn');
        const nameInput = modal.querySelector('#charName');
        const genderInputs = modal.querySelectorAll('input[name="gender"]');
        const skinTones = modal.querySelectorAll('.skin-tone');

        // Estado do personagem
        const characterState = {
            name: '',
            gender: '',
            hair: 0,
            face: 0,
            tattoo: 0,
            skinTone: 1
        };

        // Eventos dos botões de aparência
        modal.querySelectorAll('.prev-btn, .next-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const feature = btn.closest('.appearance-row').querySelector('label').textContent.toLowerCase();
                const isNext = btn.classList.contains('next-btn');
                const max = 5; // Número máximo de opções para cada característica

                if (isNext) {
                    characterState[feature] = (characterState[feature] + 1) % max;
                } else {
                    characterState[feature] = (characterState[feature] - 1 + max) % max;
                }
                
                // Aqui você atualizaria a preview do personagem
                updateCharacterPreview();
            });
        });

        // Evento dos tons de pele
        skinTones.forEach(btn => {
            btn.addEventListener('click', () => {
                const tone = btn.dataset.tone;
                characterState.skinTone = parseInt(tone);
                
                // Remove seleção anterior
                skinTones.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                
                updateCharacterPreview();
            });
        });

        // Eventos de gênero
        genderInputs.forEach(input => {
            input.addEventListener('change', () => {
                characterState.gender = input.value;
                updateCharacterPreview();
            });
        });

        // Evento do nome
        nameInput.addEventListener('input', (e) => {
            characterState.name = e.target.value;
        });

        backBtn.addEventListener('click', () => {
            modal.remove();
        });

        playBtn.addEventListener('click', () => {
            if (!characterState.name) {
                this.showMessage('Por favor, insira um nome para seu personagem.');
                return;
            }
            if (!characterState.gender) {
                this.showMessage('Por favor, selecione um gênero para seu personagem.');
                return;
            }

            // Verifica se já existe um personagem com o mesmo nome
            if (this.characterList.some(char => char.name.toLowerCase() === characterState.name.toLowerCase())) {
                this.showMessage('Já existe um personagem com este nome.');
                return;
            }

            // Verifica se atingiu o limite de personagens
            if (this.characterList.length >= 3) {
                this.showMessage('Você atingiu o limite máximo de personagens.');
                return;
            }

            // Cria o novo personagem
            const newCharacter = {
                id: this.characterList.length + 1,
                name: characterState.name,
                level: 1,
                gender: characterState.gender,
                appearance: {
                    hair: characterState.hair,
                    face: characterState.face,
                    tattoo: characterState.tattoo,
                    skinTone: characterState.skinTone
                },
                selected: false
            };

            // Adiciona o novo personagem
            this.characterList.push(newCharacter);
            this.updateCharacterList();
            modal.remove();
            this.showMessage('Personagem criado com sucesso!');
        });

        function updateCharacterPreview() {
            // Aqui você implementaria a lógica para atualizar a preview do personagem
            // baseado no characterState
            console.log('Preview atualizada:', characterState);
        }

        document.body.appendChild(modal);

        // Seleciona o primeiro tom de pele por padrão
        skinTones[0].classList.add('selected');
    }

    updateCharacterList() {
        const characterList = this.container.querySelector('.character-list');
        characterList.innerHTML = this.characterList.map(char => `
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
        `).join('');

        // Reaplica os eventos
        this.setupEvents();
    }

    startGame(character) {
        // Limpa a animação do LoginScene
        const loginScene = document.querySelector('.login-scene');
        if (loginScene && loginScene._instance) {
            loginScene._instance.cleanup();
        }

        // Remove a tela de seleção de personagem
        if (this.container) {
            this.container.remove();
        }

        // Remove o background e outros elementos da tela de login se existirem
        const loginBackground = document.querySelector('.login-background');
        if (loginBackground) {
            loginBackground.remove();
        }

        // Limpa o conteúdo do body mantendo apenas os scripts essenciais
        const scripts = Array.from(document.getElementsByTagName('script'));
        const scriptSrcs = scripts.map(script => script.src);
        document.body.innerHTML = '';
        
        // Reinsere os scripts essenciais
        scriptSrcs.forEach(src => {
            if (src) {
                const script = document.createElement('script');
                script.src = src;
                document.body.appendChild(script);
            }
        });

        // Inicia o jogo
        const game = new GameEngine();
        // Configura o personagem selecionado
        game.player.name = character.name;
        game.player.level = character.level;
        game.player.class = character.class;

        // Inicia o jogo
        game.start();
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
}
