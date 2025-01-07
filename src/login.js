import { LoginScene } from './ui/login/LoginScene';
import './ui/login/styles.css';

// Inicializar a cena de login
const loginScene = new LoginScene();

// Iniciar a animação
loginScene.start();

// Exportar a instância para uso em outros lugares, se necessário
export { loginScene };
