import './ui/login/styles.css';
import { LoginScene } from './ui/login/LoginScene';

// Initialize login scene
const loginScene = new LoginScene();

// Start the animation
loginScene.start();

// Export loginScene for potential use in other modules
export { loginScene };