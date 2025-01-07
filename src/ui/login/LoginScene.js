export class LoginScene {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.touchStartX = 0;
        this.touchStartY = 0;
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
        loginContainer.setAttribute('aria-label', 'Login Form');
        
        loginContainer.innerHTML = `
            <div class="logo-container" role="banner">
                <div class="logo">
                    <img src="/assets/logo.svg" alt="TarenOnline Logo" aria-label="TarenOnline Game Logo">
                    <div class="logo-glow"></div>
                </div>
                <div class="server-status online" role="status" aria-live="polite">
                    <span class="status-text">Server Status:</span>
                    <span class="status-dot" aria-hidden="true"></span>
                    <span class="status-text">Online</span>
                </div>
            </div>
            <div class="login-form" role="form" aria-label="Login Form">
                <div class="form-group">
                    <div class="input-icon" aria-hidden="true">
                        <i class="fas fa-user"></i>
                    </div>
                    <input type="text" 
                           id="username" 
                           placeholder="USERNAME" 
                           autocomplete="username"
                           aria-label="Username"
                           required>
                </div>
                <div class="form-group">
                    <div class="input-icon" aria-hidden="true">
                        <i class="fas fa-lock"></i>
                    </div>
                    <input type="password" 
                           id="password" 
                           placeholder="PASSWORD"
                           autocomplete="current-password"
                           aria-label="Password"
                           required>
                </div>
                <div class="remember-me">
                    <label class="custom-checkbox">
                        <input type="checkbox" 
                               id="remember"
                               aria-label="Remember my account info">
                        <span class="checkmark" aria-hidden="true"></span>
                        <span class="label-text">Remember my account info</span>
                    </label>
                </div>
                <button id="loginBtn" 
                        class="login-button"
                        aria-label="Login to TarenOnline">
                    <span class="button-text">LOGIN</span>
                    <div class="button-effect" aria-hidden="true"></div>
                </button>
                <div class="footer-links">
                    <a href="#" class="forgot-password" aria-label="Forgot your Password">Forgot your Password?</a>
                    <span class="separator" aria-hidden="true">•</span>
                    <a href="#" class="create-account" aria-label="Create new account">Create Account</a>
                </div>
            </div>
            <div class="social-media" role="navigation" aria-label="Social Media Links">
                <a href="#" class="social-icon discord" aria-label="Join our Discord">
                    <i class="fab fa-discord" aria-hidden="true"></i>
                </a>
                <a href="#" class="social-icon twitter" aria-label="Follow us on Twitter">
                    <i class="fab fa-twitter" aria-hidden="true"></i>
                </a>
                <a href="#" class="social-icon facebook" aria-label="Like us on Facebook">
                    <i class="fab fa-facebook" aria-hidden="true"></i>
                </a>
            </div>
            <div class="version-info" role="contentinfo">
                Version 1.0.0 | 2025 TarenOnline
            </div>
        `;
        document.body.appendChild(loginContainer);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());
        this.resizeCanvas();

        const loginBtn = document.getElementById('loginBtn');
        const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
        
        loginBtn.addEventListener('click', this.handleLogin.bind(this));
        
        // Enhanced input handling
        inputs.forEach(input => {
            // Focus and blur effects
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

            // Validation
            input.addEventListener('input', () => this.validateInput(input));

            // Enter key handling
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleLogin(e);
                }
            });
        });

        // Touch events for mobile
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
        
        this.ctx.scale(dpr, dpr);
    }

    createParticles() {
        const particleCount = window.innerWidth < 768 ? 20 : 35;
        this.particles = [];

        for (let i = 0; i < particleCount; i++) {
            const shade = Math.floor(Math.random() * 100) + 50;
            const color = `rgba(${shade}, ${shade}, ${shade}, ${Math.random() * 0.4 + 0.3})`;

            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.4 + 0.3,
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

            // Verifica limites
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Desenha
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
            this.showError('Please fill in all fields');
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
            console.log('Login attempt:', { username });
        }, 1500);
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

    start() {
        this.animate();
    }
}
