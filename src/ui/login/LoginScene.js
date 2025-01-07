export class LoginScene {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.touchStartX = null;
        this.touchStartY = null;
        this.originalLoginForm = null;
        this.init();
    }

    init() {
        this.createElements();
        this.setupEventListeners();
        this.createParticles();
        this.checkDeviceCapabilities();
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

    createElements() {
        // Create background canvas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'loginBackground';
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);

        // Create login container with enhanced accessibility
        const loginContainer = document.createElement('div');
        loginContainer.className = 'login-container';
        loginContainer.setAttribute('role', 'main');
        loginContainer.setAttribute('aria-label', 'Formulário de Login');
        
        loginContainer.innerHTML = `
            <div class="logo-container" role="banner">
                <div class="logo">
                    <img src="/assets/logo.svg" alt="TarenOnline Logo" aria-label="Logo TarenOnline">
                </div>
            </div>
            <form class="login-form" id="loginForm" autocomplete="off" spellcheck="false" data-lpignore="true">
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
                <label class="remember-me" for="rememberMe">
                    <input type="checkbox" id="rememberMe">
                    <div class="checkbox-custom"></div>
                    <span>Lembrar informações</span>
                </label>
                <button type="submit" class="login-button">
                    <span class="button-text">ENTRAR</span>
                </button>
                <div class="footer-links">
                    <a href="#" class="forgot-password" aria-label="Esqueceu sua senha">Esqueceu sua senha?</a>
                    <span class="separator" aria-hidden="true">•</span>
                    <a href="#" class="create-account" aria-label="Criar nova conta">Criar Conta</a>
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
        document.body.appendChild(loginContainer);
        
        // Salva uma cópia do formulário de login original
        this.originalLoginForm = document.getElementById('loginForm').cloneNode(true);
        
        this.setupLogoEffects();

        // Botão de configurações
        const settingsButton = document.createElement('button');
        settingsButton.className = 'settings-button';
        settingsButton.setAttribute('aria-label', 'Configurações');
        settingsButton.innerHTML = '<i class="fas fa-cog"></i>';
        document.body.appendChild(settingsButton);

        // Adiciona evento de clique ao botão de configurações
        settingsButton.addEventListener('click', () => {
            // Aqui você pode adicionar a lógica para abrir as configurações
            console.log('Abrir configurações');
        });
    }

    setupLogoEffects() {
        const logo = document.getElementById('gameLogo');
        if (!logo) return;

        let rafId = null;
        let targetRotateX = 0;
        let targetRotateY = 0;
        let currentRotateX = 0;
        let currentRotateY = 0;

        const animate = () => {
            currentRotateX += (targetRotateX - currentRotateX) * 0.1;
            currentRotateY += (targetRotateY - currentRotateY) * 0.1;
            
            logo.style.transform = `
                perspective(1000px) 
                rotateX(${currentRotateX}deg) 
                rotateY(${currentRotateY}deg)
            `;

            rafId = requestAnimationFrame(animate);
        };

        logo.addEventListener('mousemove', (e) => {
            const rect = logo.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            targetRotateY = x * 10; 
            targetRotateX = -y * 10;

            if (!rafId) {
                rafId = requestAnimationFrame(animate);
            }
        });

        logo.addEventListener('mouseleave', () => {
            targetRotateX = 0;
            targetRotateY = 0;
        });

        logo.addEventListener('mousedown', () => {
            logo.style.transform += ' scale(0.98)';
        });

        logo.addEventListener('mouseup', () => {
            logo.style.transform = logo.style.transform.replace(' scale(0.98)', '');
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
        const loginBtn = document.getElementById('loginBtn');
        const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
        const createAccountLink = document.querySelector('.create-account');
        const forgotPasswordLink = document.querySelector('.forgot-password');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', this.handleLogin.bind(this));
        }
        
        if (createAccountLink) {
            createAccountLink.addEventListener('click', this.handleCreateAccount.bind(this));
        }
        
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', this.handleForgotPassword.bind(this));
        }
        
        inputs.forEach(input => {
            if (input) {
                input.addEventListener('focus', () => {
                    input.parentElement.classList.add('focused');
                    this.handleInputFocus(input);
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        input.parentElement.classList.remove('focused');
                    }
                    this.handleInputBlur(input);
                });

                input.addEventListener('input', () => this.validateInput(input));

                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.handleLogin(e);
                    }
                });
            }
        });
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

    adjustInitialPosition() {
        const container = document.querySelector('.login-container');
        const form = document.querySelector('.login-form');
        
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

    resizeCanvas() {
        const dpr = 1;
        const { width, height } = document.body.getBoundingClientRect();
        
        this.canvas.width = width * dpr;
        this.canvas.height = height * dpr;
        
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        
        // Garante que o fundo seja preto após o resize
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Ajusta a escala para retina displays
        this.ctx.scale(dpr, dpr);
    }

    createParticles() {
        const particleCount = window.innerWidth < 768 ? 20 : 35;
        
        this.particles = [];

        for (let i = 0; i < particleCount; i++) {
            const shade = Math.floor(Math.random() * 100) + 50;
            const color = `rgba(${shade}, ${shade}, ${shade}, 0.8)`;

            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1,
                color: color
            });
        }
    }

    animate() {
        // Limpa o canvas com fundo preto ao invés de transparente
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Adiciona um gradiente sutil
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, 'rgba(20, 20, 20, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Atualiza e desenha as partículas
        this.particles.forEach(particle => {
            // Atualiza posição
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Verifica colisão com as bordas
            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;

            // Desenha a partícula
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }

    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            this.showError('Por favor, preencha todos os campos');
            return;
        }
        
        const button = document.getElementById('loginBtn');
        button.classList.add('loading');
        button.disabled = true;
        
        // Simulate login request
        setTimeout(() => {
            button.classList.remove('loading');
            button.disabled = false;
            // Add your login logic here
            console.log('Tentativa de login:', { username });
        }, 1500);
    }

    backToLogin() {
        const currentForm = document.querySelector('.login-form');
        if (currentForm && this.originalLoginForm) {
            // Cria uma nova cópia do formulário original
            const newLoginForm = this.originalLoginForm.cloneNode(true);
            currentForm.parentNode.replaceChild(newLoginForm, currentForm);
            this.setupLoginFormEvents();
        }
    }

    handleCreateAccount(e) {
        e.preventDefault();
        const loginForm = document.querySelector('.login-form');
        const createAccountForm = document.createElement('form');
        createAccountForm.className = 'login-form';
        createAccountForm.id = 'createAccountForm';
        createAccountForm.autocomplete = 'off';
        createAccountForm.spellcheck = 'false';
        createAccountForm.dataLpignore = 'true';
        
        createAccountForm.innerHTML = `
            <form autocomplete="off" spellcheck="false" data-lpignore="true">
                <!-- Campo oculto para enganar o Chrome -->
                <div style="display:none">
                    <input type="text" name="hidden_username" />
                    <input type="password" name="hidden_password" />
                </div>
                <div class="form-group">
                    <div class="input-icon">
                        <i class="fas fa-user"></i>
                    </div>
                    <input type="text" 
                           id="newUsername" 
                           name="random_newuser_${Math.random()}"
                           placeholder="NOVO USUÁRIO"
                           autocomplete="chrome-off"
                           readonly
                           onfocus="this.removeAttribute('readonly');"
                           data-lpignore="true"
                           data-form-type="other"
                           autocapitalize="off"
                           autocorrect="off"
                           spellcheck="false"
                           required>
                </div>
                <div class="form-group">
                    <div class="input-icon">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <input type="text" 
                           id="email" 
                           name="random_email_${Math.random()}"
                           placeholder="E-MAIL"
                           autocomplete="chrome-off"
                           readonly
                           onfocus="this.removeAttribute('readonly');"
                           data-lpignore="true"
                           data-form-type="other"
                           autocapitalize="off"
                           autocorrect="off"
                           spellcheck="false"
                           required
                           pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$">
                </div>
                <div class="form-group">
                    <div class="input-icon">
                        <i class="fas fa-lock"></i>
                    </div>
                    <input type="password" 
                           id="newPassword" 
                           name="random_newpass_${Math.random()}"
                           placeholder="NOVA SENHA"
                           autocomplete="chrome-off"
                           readonly
                           onfocus="this.removeAttribute('readonly');"
                           data-lpignore="true"
                           data-form-type="other"
                           autocapitalize="off"
                           autocorrect="off"
                           spellcheck="false"
                           required>
                </div>
                <div class="form-group">
                    <div class="input-icon">
                        <i class="fas fa-lock"></i>
                    </div>
                    <input type="password" 
                           id="confirmPassword" 
                           name="random_confpass_${Math.random()}"
                           placeholder="CONFIRMAR SENHA"
                           autocomplete="chrome-off"
                           readonly
                           onfocus="this.removeAttribute('readonly');"
                           data-lpignore="true"
                           data-form-type="other"
                           autocapitalize="off"
                           autocorrect="off"
                           spellcheck="false"
                           required>
                </div>
                <button type="submit" class="login-button">
                    <span class="button-text">CRIAR CONTA</span>
                </button>
                <div class="footer-links">
                    <a href="#" class="back-to-login">Voltar para o Login</a>
                </div>
            `;

        if (loginForm) {
            loginForm.parentNode.replaceChild(createAccountForm, loginForm);

            // Adiciona evento de voltar para login
            const backToLoginLink = document.querySelector('.back-to-login');
            if (backToLoginLink) {
                backToLoginLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.backToLogin();
                });
            }

            // Adiciona evento de submit do formulário de criação
            createAccountForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('newUsername').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('newPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;

                if (password !== confirmPassword) {
                    this.showError('As senhas não coincidem');
                    return;
                }

                console.log('Criando conta:', { username, email });
                
                setTimeout(() => {
                    this.showSuccess('Conta criada com sucesso!');
                    setTimeout(() => {
                        this.backToLogin();
                    }, 1500);
                }, 1000);
            });

            // Setup events for the new form
            const newInputs = createAccountForm.querySelectorAll('input');
            newInputs.forEach(input => {
                if (input) {
                    input.addEventListener('focus', () => {
                        input.parentElement.classList.add('focused');
                        this.handleInputFocus(input);
                    });
                    
                    input.addEventListener('blur', () => {
                        if (!input.value) {
                            input.parentElement.classList.remove('focused');
                        }
                        this.handleInputBlur(input);
                    });

                    input.addEventListener('input', () => this.validateInput(input));
                }
            });
        }
    }

    handleForgotPassword(e) {
        e.preventDefault();
        const loginForm = document.querySelector('.login-form');
        const resetForm = document.createElement('form');
        resetForm.className = 'login-form';
        resetForm.id = 'resetForm';
        resetForm.autocomplete = 'off';
        resetForm.spellcheck = 'false';
        resetForm.dataLpignore = 'true';
        
        resetForm.innerHTML = `
            <form autocomplete="off" spellcheck="false" data-lpignore="true">
                <!-- Campo oculto para enganar o Chrome -->
                <div style="display:none">
                    <input type="text" name="hidden_username" />
                    <input type="password" name="hidden_password" />
                </div>
                <div class="form-group">
                    <div class="input-icon">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <input type="text" 
                           id="resetEmail" 
                           name="random_resetemail_${Math.random()}"
                           placeholder="SEU E-MAIL"
                           autocomplete="chrome-off"
                           readonly
                           onfocus="this.removeAttribute('readonly');"
                           data-lpignore="true"
                           data-form-type="other"
                           autocapitalize="off"
                           autocorrect="off"
                           spellcheck="false"
                           required
                           pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$">
                </div>
                <button type="submit" class="login-button">
                    <span class="button-text">RECUPERAR SENHA</span>
                </button>
                <div class="footer-links">
                    <a href="#" class="back-to-login">Voltar para o Login</a>
                </div>
            `;

        if (loginForm) {
            loginForm.parentNode.replaceChild(resetForm, loginForm);

            // Adiciona evento de voltar para login
            const backToLoginLink = document.querySelector('.back-to-login');
            if (backToLoginLink) {
                backToLoginLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.backToLogin();
                });
            }

            // Adiciona evento de submit do formulário de reset
            resetForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('resetEmail').value;

                console.log('Solicitando reset de senha para:', email);
                
                setTimeout(() => {
                    this.showSuccess('E-mail de recuperação enviado!');
                    setTimeout(() => {
                        this.backToLogin();
                    }, 1500);
                }, 1000);
            });

            // Setup events for the reset form
            const resetEmail = document.getElementById('resetEmail');
            if (resetEmail) {
                resetEmail.addEventListener('focus', () => {
                    resetEmail.parentElement.classList.add('focused');
                    this.handleInputFocus(resetEmail);
                });
                
                resetEmail.addEventListener('blur', () => {
                    if (!resetEmail.value) {
                        resetEmail.parentElement.classList.remove('focused');
                    }
                    this.handleInputBlur(resetEmail);
                });

                resetEmail.addEventListener('input', () => this.validateInput(resetEmail));
            }
        }
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

    start() {
        this.animate();
    }
}
