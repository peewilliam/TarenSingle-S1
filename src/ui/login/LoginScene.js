import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import LoginForm from './components/LoginForm.js';
import ServerList from './components/ServerList.js';
import ChannelSelect from './components/ChannelSelect.js';
import SystemInfo from './components/SystemInfo.js';
import NewsPanel from './components/NewsPanel.js';
import StorePanel from './components/StorePanel.js';

export class LoginScene {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.clock = new THREE.Clock();
        this.lastFrame = performance.now();
        this.fpsDisplay = null;
        this.pingDisplay = null;
        this.isRunning = false;
        this.magicCircles = [];
        this.particles = null;
        this.skybox = null;
        this.mainContainer = document.createElement('div');
        this.mainContainer.className = 'main-container';
        document.body.appendChild(this.mainContainer);
        this.leftPanel = document.createElement('div');
        this.leftPanel.className = 'left-panel';
        this.mainContainer.appendChild(this.leftPanel);
        this.serverList = new ServerList(document.createElement('div'));
        this.leftPanel.appendChild(this.serverList.container);
        this.createTabs();
        this.newsPanel = new NewsPanel(document.createElement('div'));
        this.storePanel = new StorePanel(document.createElement('div'));
        this.leftPanel.appendChild(this.newsPanel.container);
        this.leftPanel.appendChild(this.storePanel.container);
        this.loginForm = new LoginForm(document.createElement('div'));
        this.mainContainer.appendChild(this.loginForm.container);
        this.channelSelect = new ChannelSelect(document.createElement('div'));
        this.mainContainer.appendChild(this.channelSelect.container);
        this.systemInfo = new SystemInfo(document.createElement('div'));
        this.mainContainer.appendChild(this.systemInfo.container);
        this.createLogo();
        this.initializeEvents();
        this.setupScene();
        this.setupLights();
        this.setupControls();
        this.createEnvironment();
        window.addEventListener('resize', () => this.onWindowResize());
        this.init();
    }

    init() {
        // Configuração do renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        document.body.appendChild(this.renderer.domElement);

        // Configuração da câmera
        this.camera.position.set(0, 3, 7);
        
        // Ambiente e efeitos
        this.createEnvironment();
        this.createLighting();
        this.createAtmosphericEffects();
        this.createDynamicBackground();

        // Post-processing
        this.setupPostProcessing();
        
        // Controles de órbita limitados
        this.setupControls();

        // Event listeners
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Iniciar animação
        this.start();
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }
    }

    stop() {
        this.isRunning = false;
    }

    setupPostProcessing() {
        const renderPass = new RenderPass(this.scene, this.camera);
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, // strength
            0.4, // radius
            0.85  // threshold
        );

        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(renderPass);
        this.composer.addPass(bloomPass);
    }

    createEnvironment() {
        // Plataforma Principal com material mais realista
        const platformGeometry = new THREE.CylinderGeometry(5, 5.2, 0.2, 64);
        const platformMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            metalness: 0.9,
            roughness: 0.2,
            envMapIntensity: 1.0
        });
        this.platform = new THREE.Mesh(platformGeometry, platformMaterial);
        this.platform.receiveShadow = true;
        this.scene.add(this.platform);

        // Círculos Mágicos Animados
        this.createMagicCircles();

        // Pilares Decorativos
        this.createPillars();

        // Névoa Volumétrica mais suave
        const fog = new THREE.FogExp2(0x000000, 0.015);
        this.scene.fog = fog;

        // Ambiente básico
        const envTexture = new THREE.CubeTextureLoader().load([
            'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/cube/Park2/posx.jpg',
            'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/cube/Park2/negx.jpg',
            'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/cube/Park2/posy.jpg',
            'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/cube/Park2/negy.jpg',
            'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/cube/Park2/posz.jpg',
            'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/cube/Park2/negz.jpg'
        ]);
        this.scene.environment = envTexture;
        this.scene.background = new THREE.Color(0x000000);
    }

    createMagicCircles() {
        const circleCount = 3;
        this.magicCircles = [];

        for (let i = 0; i < circleCount; i++) {
            const radius = 4.5 - i * 0.5;
            const geometry = new THREE.RingGeometry(radius, radius + 0.1, 64);
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color(0.5, 0.8, 1.0),
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });

            const circle = new THREE.Mesh(geometry, material);
            circle.rotation.x = -Math.PI / 2;
            circle.position.y = 0.1 + i * 0.1;
            this.magicCircles.push(circle);
            this.scene.add(circle);
        }
    }

    createPillars() {
        const pillarCount = 6;
        const radius = 4.5;

        for (let i = 0; i < pillarCount; i++) {
            const angle = (i / pillarCount) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            const pillarGeometry = new THREE.CylinderGeometry(0.2, 0.2, 4, 8);
            const pillarMaterial = new THREE.MeshStandardMaterial({
                color: 0x3a3a3a,
                metalness: 0.8,
                roughness: 0.2
            });

            const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
            pillar.position.set(x, 2, z);
            pillar.castShadow = true;
            pillar.receiveShadow = true;
            this.scene.add(pillar);

            // Adicionar efeito de brilho no topo
            const glowGeometry = new THREE.SphereGeometry(0.3, 16, 16);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                transparent: true,
                opacity: 0.5
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            glow.position.set(x, 4.1, z);
            this.scene.add(glow);
        }
    }

    createLighting() {
        // Luz principal
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
        mainLight.position.set(5, 10, 5);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        this.scene.add(mainLight);

        // Luz ambiente mais forte
        const ambientLight = new THREE.AmbientLight(0x404040, 1.0);
        this.scene.add(ambientLight);

        // Luzes pontuais para efeitos
        const pointLight1 = new THREE.PointLight(0x00ffff, 2, 10);
        pointLight1.position.set(0, 2, 0);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xff00ff, 2, 10);
        pointLight2.position.set(-5, 2, 0);
        this.scene.add(pointLight2);
    }

    createAtmosphericEffects() {
        // Sistema de partículas para efeito de poeira
        const particleCount = 1000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = Math.random() * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

            colors[i * 3] = Math.random() * 0.5 + 0.5;
            colors[i * 3 + 1] = Math.random() * 0.5 + 0.5;
            colors[i * 3 + 2] = Math.random() * 0.5 + 0.5;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.5
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    createDynamicBackground() {
        // Skybox dinâmico
        const skyGeometry = new THREE.SphereGeometry(100, 32, 32);
        const skyMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                varying vec3 vPosition;
                void main() {
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                varying vec3 vPosition;
                
                void main() {
                    vec3 color1 = vec3(0.1, 0.2, 0.3);
                    vec3 color2 = vec3(0.3, 0.4, 0.5);
                    float noise = sin(vPosition.x * 0.05 + time) * 
                                cos(vPosition.y * 0.05 + time) * 
                                sin(vPosition.z * 0.05 + time);
                    vec3 color = mix(color1, color2, noise * 0.5 + 0.5);
                    gl_FragColor = vec4(color, 1.0);
                }
            `,
            side: THREE.BackSide
        });

        this.skybox = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(this.skybox);
    }

    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 15;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.5;
    }

    createLogo() {
        const logo = document.createElement('div');
        logo.className = 'game-logo';
        logo.innerHTML = `
            <div class="logo-container">
                <div class="logo-decoration left"></div>
                <svg width="400" height="120" viewBox="0 0 400 120">
                    <defs>
                        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style="stop-color:#B8860B;stop-opacity:1" />
                            <stop offset="50%" style="stop-color:#FFD700;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#B8860B;stop-opacity:1" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    <text x="50%" y="50%" font-family="Cinzel" font-size="56" fill="url(#logoGradient)" text-anchor="middle" dominant-baseline="middle" filter="url(#glow)">
                        TarenOnline
                    </text>
                    <text x="50%" y="80%" font-family="Cinzel" font-size="16" fill="#DAA520" text-anchor="middle" dominant-baseline="middle">
                        Um Novo Mundo o Aguarda
                    </text>
                </svg>
                <div class="logo-decoration right"></div>
            </div>
        `;
        this.mainContainer.appendChild(logo);
    }

    createTabs() {
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'left-panel-tabs';
        tabsContainer.innerHTML = `
            <button class="panel-tab active" data-tab="store">
                <i class="fas fa-shopping-cart"></i>
                Loja
            </button>
            <button class="panel-tab" data-tab="news">
                <i class="fas fa-newspaper"></i>
                Notícias
            </button>
        `;
        this.leftPanel.appendChild(tabsContainer);
    }

    initializeEvents() {
        // Event listeners para as tabs
        const tabs = this.leftPanel.querySelectorAll('.panel-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.playButtonSound();

                const tabName = tab.dataset.tab;
                this.newsPanel.container.classList.toggle('active', tabName === 'news');
                this.storePanel.container.classList.toggle('active', tabName === 'store');
            });
        });
    }

    playButtonSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Atualizar controles
        this.controls.update();

        // Atualizar círculos mágicos
        const time = this.clock.getElapsedTime();
        this.magicCircles.forEach((circle, index) => {
            circle.rotation.z = time * (0.2 + index * 0.1);
            circle.material.opacity = 0.3 + Math.sin(time * 2) * 0.1;
        });

        // Atualizar partículas
        if (this.particles) {
            this.particles.rotation.y = time * 0.05;
            const positions = this.particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(time + positions[i]) * 0.001;
            }
            this.particles.geometry.attributes.position.needsUpdate = true;
        }

        // Atualizar skybox
        if (this.skybox) {
            this.skybox.material.uniforms.time.value = time;
        }

        // Atualizar métricas do sistema
        this.updateSystemMetrics();

        // Renderizar cena com post-processing
        this.composer.render();
    }

    updateSystemMetrics() {
        const fpsCounter = document.querySelector('.fps-counter');
        const pingCounter = document.querySelector('.ping-counter');
        
        if (fpsCounter) {
            const fps = Math.round(1000 / (performance.now() - this.lastFrame));
            fpsCounter.textContent = `${Math.min(fps, 60)} FPS`;
            this.lastFrame = performance.now();
        }
        
        if (pingCounter) {
            // Simular variação de ping
            const ping = Math.round(20 + Math.random() * 10);
            pingCounter.textContent = `${ping}ms`;
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);
    }
}
