export class GameStateManager {
  constructor() {
    this.state = {
      isPaused: false,
      isGameOver: false,
      score: 0
    };
  }

  pause() {
    this.state.isPaused = true;
  }

  resume() {
    this.state.isPaused = false;
  }

  gameOver() {
    this.state.isGameOver = true;
  }

  reset() {
    this.state.isPaused = false;
    this.state.isGameOver = false;
    this.state.score = 0;
  }

  addScore(points) {
    this.state.score += points;
  }
}