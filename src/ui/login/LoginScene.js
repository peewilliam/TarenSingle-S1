export class LoginScene {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.init();
    }

    init() {
        this.createElements();
        this.setupEventListeners();
        this.createParticles();
    }

    createElements() {
        // Create background canvas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'loginBackground';
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);

        // Create login container
        const loginContainer = document.createElement('div');
        loginContainer.className = 'login-container';
        loginContainer.innerHTML = `
            <div class="logo-container">
                <div class="logo">
                    <img src="/assets/logo.svg" alt="TarenOnline">
                    <div class="logo-glow"></div>
                </div>
                <div class="server-status online">
                    <span class="status-dot"></span>
                    Server Status: Online
                </div>
            </div>
            <div class="login-form">
                <div class="form-group">
                    <div class="input-icon">
                        <i class="fas fa-user"></i>
                    </div>
                    <input type="text" id="username" placeholder="USERNAME" autocomplete="off">
                </div>
                <div class="form-group">
                    <div class="input-icon">
                        <i class="fas fa-lock"></i>
                    </div>
                    <input type="password" id="password" placeholder="PASSWORD">
                </div>
                <div class="remember-me">
                    <label class="custom-checkbox">
                        <input type="checkbox" id="remember">
                        <span class="checkmark"></span>
                        <span class="label-text">Remember my account info</span>
                    </label>
                </div>
                <button id="loginBtn" class="login-button">
                    <span class="button-text">LOGIN</span>
                    <div class="button-effect"></div>
                </button>
                <div class="footer-links">
                    <a href="#" class="forgot-password">Forgot your Password?</a>
                    <span class="separator">•</span>
                    <a href="#" class="create-account">Create Account</a>
                </div>
            </div>
            <div class="social-media">
                <a href="#" class="social-icon discord"><i class="fab fa-discord"></i></a>
                <a href="#" class="social-icon twitter"><i class="fab fa-twitter"></i></a>
                <a href="#" class="social-icon facebook"><i class="fab fa-facebook"></i></a>
            </div>
            <div class="version-info">
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
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });

            // Add keypress event for Enter key
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleLogin(e);
                }
            });
        });
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        for (let i = 0; i < 100; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: Math.random() * 1 - 0.5,
                speedY: Math.random() * 1 - 0.5,
                opacity: Math.random(),
                color: `rgba(${Math.random() * 50 + 200}, ${Math.random() * 50 + 150}, ${Math.random() * 50}, ${Math.random() * 0.5 + 0.2})`
            });
        }
    }

    animate() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.opacity += Math.random() * 0.02 - 0.01;

            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
            if (particle.opacity < 0) particle.opacity = 0;
            if (particle.opacity > 1) particle.opacity = 1;

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
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
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
