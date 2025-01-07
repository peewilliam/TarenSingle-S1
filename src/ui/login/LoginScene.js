import { CreateAccountForm } from './modules/forms/CreateAccountForm.js';
import { ResetPasswordForm } from './modules/forms/ResetPasswordForm.js';
import { OptionsModal } from './modules/OptionsModal.js';

export class LoginScene {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.container = null;
        this.originalLoginForm = null;
        this.optionsModal = null;
        this.createAccountForm = new CreateAccountForm(this);
        this.resetPasswordForm = new ResetPasswordForm(this);
        
        // Inicializa a cena
        this.init();
    }

    init() {
        // Inicializa o canvas e background
        this.setupCanvas();
        
        // Cria os elementos da página
        this.createLoginContainer();
        
        // Configura os eventos
        this.setupEventListeners();
        
        // Verifica capacidades do dispositivo
        this.checkDeviceCapabilities();
        
        // Inicia a animação
        this.animate();
    }

    setupCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'login-background';
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);

        // Configuração das partículas
        this.particles = [];
        this.numParticles = window.innerWidth < 768 ? 20 : 35;
        
        // Criar partículas iniciais
        this.createParticles();
        
        // Configurar resize
        this.resizeCanvas();
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
            this.adjustLayout();
        });
    }

    createLoginContainer() {
        // Remove container existente se houver
        const existingContainer = document.querySelector('.login-container');
        if (existingContainer) {
            existingContainer.remove();
        }

        this.container = document.createElement('div');
        this.container.className = 'login-container';
        
        // Conteúdo do login
        this.container.innerHTML = `
            <div class="logo-container" role="banner">
                <div class="logo">
                    <img src="/assets/logo.svg" alt="TarenOnline Logo" aria-label="Logo TarenOnline">
                </div>
            </div>
            <form class="login-form" id="mainLoginForm" autocomplete="off" spellcheck="false" data-lpignore="true">
                <!-- Campo oculto para enganar o Chrome -->
                <div style="display:none">
                    <input type="text" name="hidden_username" />
                    <input type="password" name="hidden_password" />
                </div>
                <div class="form-group">
                    <div class="input-icon" aria-hidden="true">
                        <i class="fas fa-user"></i>
                    </div>
                    <input type="text" 
                           id="username" 
                           name="random_username_${Math.random()}"
                           placeholder="USUÁRIO"
                           autocomplete="chrome-off"
                           readonly
                           onfocus="this.removeAttribute('readonly');"
                           data-lpignore="true"
                           data-form-type="other"
                           autocapitalize="off"
                           autocorrect="off"
                           spellcheck="false"
                           aria-label="Nome de usuário"
                           required>
                </div>
                <div class="form-group">
                    <div class="input-icon" aria-hidden="true">
                        <i class="fas fa-lock"></i>
                    </div>
                    <input type="password" 
                           id="password" 
                           name="random_password_${Math.random()}"
                           placeholder="SENHA"
                           autocomplete="chrome-off"
                           readonly
                           onfocus="this.removeAttribute('readonly');"
                           data-lpignore="true"
                           data-form-type="other"
                           autocapitalize="off"
                           autocorrect="off"
                           spellcheck="false"
                           aria-label="Senha"
                           required>
                </div>
                <label class="remember-me" for="mainRememberMe">
                    <input type="checkbox" id="mainRememberMe">
                    <div class="checkbox-custom"></div>
                    <span>Lembrar informações</span>
                </label>
                <button type="submit" class="login-button">
                    <span class="button-text">ENTRAR</span>
                </button>
                <div class="footer-links">
                    <a href="#" class="forgot-password" id="forgotPassword" aria-label="Esqueceu sua senha">Esqueceu sua senha?</a>
                    <span class="separator" aria-hidden="true">•</span>
                    <a href="#" class="create-account" id="createAccount" aria-label="Criar nova conta">Criar Conta</a>
                </div>
            </form>
            <div class="social-media" role="navigation" aria-label="Links de Redes Sociais">
                <a href="#" class="social-icon discord" aria-label="Entre no nosso Discord">
                    <i class="fab fa-discord" aria-hidden="true"></i>
                </a>
                <a href="#" class="social-icon twitter" aria-label="Siga-nos no Twitter">
                    <i class="fab fa-twitter" aria-hidden="true"></i>
                </a>
                <a href="#" class="social-icon facebook" aria-label="Curta nossa página no Facebook">
                    <i class="fab fa-facebook" aria-hidden="true"></i>
                </a>
            </div>
            <div class="version-info" role="contentinfo">
                Versão 1.0.0 | 2025 TarenOnline
            </div>
        `;
        
        document.body.appendChild(this.container);
        
        // Configurar eventos do formulário após adicionar ao DOM
        this.setupLoginFormEvents();

        // Salvar o formulário original para uso posterior
        this.originalLoginForm = document.querySelector('#mainLoginForm').cloneNode(true);

        // Adiciona o botão de configurações
        this.setupSettingsButton();
    }

    setupSettingsButton() {
        // Remove botão existente se houver
        const existingButton = document.querySelector('.settings-button');
        if (existingButton) {
            existingButton.remove();
        }

        const settingsButton = document.createElement('button');
        settingsButton.className = 'settings-button';
        settingsButton.setAttribute('aria-label', 'Configurações');
        settingsButton.innerHTML = '<i class="fas fa-cog"></i>';
        document.body.appendChild(settingsButton);

        // Configura o modal de opções
        this.optionsModal = new OptionsModal();
        this.optionsModal.create();

        // Adiciona evento de clique
        settingsButton.addEventListener('click', () => {
            const overlay = document.querySelector('.modal-overlay');
            const modal = document.querySelector('.options-modal');
            if (overlay && modal) {
                overlay.classList.add('active');
                modal.classList.add('active');
            }
        });
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());
        this.resizeCanvas();

        // Setup canvas touch events
        this.setupCanvasEvents();
        
        // Setup login form events
        this.setupLoginFormEvents();
    }

    setupLoginFormEvents() {
        const forgotPasswordLink = document.getElementById('forgotPassword');
        const createAccountLink = document.getElementById('createAccount');

        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleForgotPassword(e);
            });
        }

        if (createAccountLink) {
            createAccountLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCreateAccount(e);
            });
        }

        // Event listener para o formulário de login
        const loginForm = document.getElementById('mainLoginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e);
            });
        }
    }

    setupCanvasEvents() {
        this.canvas.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
        });

        this.canvas.addEventListener('touchmove', (e) => {
            if (!this.touchStartX || !this.touchStartY) return;

            const xDiff = this.touchStartX - e.touches[0].clientX;
            const yDiff = this.touchStartY - e.touches[0].clientY;

            if (Math.abs(xDiff) > 5 || Math.abs(yDiff) > 5) {
                this.particles.forEach(particle => {
                    particle.speedX += xDiff * 0.01;
                    particle.speedY += yDiff * 0.01;
                });
            }
        });

        this.canvas.addEventListener('touchend', () => {
            this.touchStartX = null;
            this.touchStartY = null;
        });
    }

    createParticles() {
        this.particles = [];
        const particleCount = window.innerWidth < 768 ? 20 : 35;
        
        for (let i = 0; i < particleCount; i++) {
            const shade = Math.floor(Math.random() * 100) + 50;
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1,
                color: `rgba(${shade}, ${shade}, ${shade}, 0.8)`
            });
        }
    }

    adjustInitialPosition() {
        const container = document.querySelector('.login-container');
        
        // Verificar se o conteúdo está visível
        const rect = container.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        if (rect.bottom > viewportHeight) {
            container.style.top = '0';
            container.style.transform = 'translate(-50%, 0)';
            container.style.marginTop = '20px';
        }

        // Ajustar em telas muito pequenas
        if (viewportHeight < 600) {
            document.body.style.minHeight = '100vh';
            document.body.style.overflowY = 'auto';
        }
    }

    scrollToInput(input) {
        if (window.innerHeight < 700) {
            setTimeout(() => {
                input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }

    handleInputFocus(input) {
        const form = document.querySelector('.login-form');
        form.classList.add('input-focused');
        
        // Smooth scroll on mobile
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        }
    }

    handleInputBlur(input) {
        const form = document.querySelector('.login-form');
        const anyInputFocused = Array.from(form.querySelectorAll('input')).some(i => i === document.activeElement);
        if (!anyInputFocused) {
            form.classList.remove('input-focused');
        }
    }

    validateInput(input) {
        if (input.value.length > 0) {
            input.parentElement.classList.add('has-value');
        } else {
            input.parentElement.classList.remove('has-value');
        }
    }

    animate() {
        if (!this.ctx || !this.canvas) return;
        
        // Limpa o canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Atualiza e desenha cada partícula
        this.particles.forEach(particle => {
            // Atualiza posição
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Verifica colisão com as bordas
            if (particle.x <= 0 || particle.x >= this.canvas.width) {
                particle.speedX *= -1;
            }
            if (particle.y <= 0 || particle.y >= this.canvas.height) {
                particle.speedY *= -1;
            }
            
            // Desenha a partícula
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
        });
        
        // Continua a animação
        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    async handleLogin(event) {
        event.preventDefault();
        
        // Limpa os eventos e animações do login
        this.cleanup();
        
        // Limpa o corpo da página
        document.body.innerHTML = '';
        
        // Carrega e inicializa a tela de seleção de personagem
        const { CharacterSelectScene } = await import('../character-select/CharacterSelectScene.js');
        const characterSelect = new CharacterSelectScene();
        characterSelect.init();
    }

    handleCreateAccount(e) {
        e.preventDefault();
        const container = document.querySelector('.login-container');
        
        // Salva o formulário de login original se ainda não foi salvo
        if (!this.originalLoginForm) {
            this.originalLoginForm = document.querySelector('#mainLoginForm').cloneNode(true);
        }

        // Limpa apenas o conteúdo do formulário, não o container inteiro
        const currentForm = container.querySelector('.login-form');
        if (currentForm) {
            currentForm.remove();
        }
        
        // Adiciona o formulário de criar conta
        this.createAccountForm.mount(container);
    }

    handleForgotPassword(e) {
        e.preventDefault();
        const container = document.querySelector('.login-container');
        
        // Salva o formulário de login original se ainda não foi salvo
        if (!this.originalLoginForm) {
            this.originalLoginForm = document.querySelector('#mainLoginForm').cloneNode(true);
        }

        // Limpa apenas o conteúdo do formulário, não o container inteiro
        const currentForm = container.querySelector('.login-form');
        if (currentForm) {
            currentForm.remove();
        }
        
        // Adiciona o formulário de resetar senha
        this.resetPasswordForm.mount(container);
    }

    restoreLoginForm() {
        if (this.originalLoginForm) {
            const container = document.querySelector('.login-container');
            const currentForm = container.querySelector('.login-form');
            const logoContainer = container.querySelector('.logo-container');
            
            // Remove o formulário atual
            if (currentForm) {
                currentForm.remove();
            }
            
            // Cria uma cópia do formulário original
            const newForm = this.originalLoginForm.cloneNode(true);
            
            // Insere o formulário após o logo-container
            if (logoContainer && logoContainer.nextSibling) {
                container.insertBefore(newForm, logoContainer.nextSibling);
            } else {
                container.appendChild(newForm);
            }
            
            // Reconfigura os eventos
            this.setupLoginFormEvents();
        }
    }

    resizeCanvas() {
        // Atualiza o tamanho do canvas para cobrir toda a janela
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Atualiza o estilo CSS para garantir que cubra toda a tela
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.position = 'fixed';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '-1';
    }

    adjustLayout() {
        // Ajusta o número de partículas baseado no tamanho da tela
        this.numParticles = window.innerWidth < 768 ? 20 : 35;
        
        // Atualiza o layout responsivo
        const container = document.querySelector('.login-container');
        if (container) {
            if (window.innerWidth <= 768) {
                container.classList.add('mobile-device');
                container.classList.remove('desktop-device');
            } else {
                container.classList.add('desktop-device');
                container.classList.remove('mobile-device');
            }
        }

        // Ajusta o modal de opções se estiver aberto
        const optionsModal = document.querySelector('.options-modal');
        if (optionsModal && optionsModal.classList.contains('active')) {
            if (window.innerWidth <= 768) {
                optionsModal.style.width = '90%';
                optionsModal.style.maxHeight = '90vh';
            } else {
                optionsModal.style.width = '600px';
                optionsModal.style.maxHeight = '80vh';
            }
        }
    }

    checkDeviceCapabilities() {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const container = document.querySelector('.login-container');
        
        if (isMobile) {
            container.classList.add('mobile-device');
            this.adjustForMobile();
        }

        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            container.classList.add('reduced-motion');
        }

        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.resizeCanvas();
                this.adjustForMobile();
            }, 100);
        });
    }

    adjustForMobile() {
        const form = document.querySelector('.login-form');
        const inputs = form.querySelectorAll('input');
        
        // Adjust input behavior for mobile
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                setTimeout(() => {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
        });

        // Handle virtual keyboard
        window.addEventListener('resize', () => {
            if (document.activeElement.tagName === 'INPUT') {
                setTimeout(() => {
                    document.activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        });
    }

    start() {
        this.optionsModal.create();
        this.animate();
    }

    showError(message) {
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.setAttribute('role', 'alert');
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
            <span>${message}</span>
        `;
        
        const loginForm = document.querySelector('.login-form');
        loginForm.insertBefore(errorDiv, loginForm.firstChild);
        
        setTimeout(() => {
            errorDiv.classList.add('fade-out');
            setTimeout(() => errorDiv.remove(), 300);
        }, 3000);
    }

    showSuccess(message) {
        const existingSuccess = document.querySelector('.success-message');
        if (existingSuccess) {
            existingSuccess.remove();
        }

        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.setAttribute('role', 'alert');
        successDiv.innerHTML = `
            <i class="fas fa-check-circle" aria-hidden="true"></i>
            <span>${message}</span>
        `;
        
        const form = document.querySelector('form');
        form.insertBefore(successDiv, form.firstChild);
        
        setTimeout(() => {
            successDiv.classList.add('fade-out');
            setTimeout(() => successDiv.remove(), 300);
        }, 3000);
    }

    cleanup() {
        // Cancela a animação
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        // Remove event listeners
        window.removeEventListener('resize', this.resizeCanvas);
        
        // Limpa o canvas
        if (this.canvas && this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // Remove elementos do DOM
        if (this.canvas) {
            this.canvas.remove();
            this.canvas = null;
            this.ctx = null;
        }

        if (this.container) {
            this.container.remove();
            this.container = null;
        }

        // Limpa as partículas
        this.particles = [];
    }
}
