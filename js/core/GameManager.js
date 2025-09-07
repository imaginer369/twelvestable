import { startGame, getGame } from '../games/GameFactory.js';
import { UIManager } from './UIManager.js';

export class GameManager {
    constructor() {
        this.currentGame = null;
        this.gameState = {};
    }

    launchGame(gameName) {
        this.currentGame = gameName;
        UIManager.showGameArea(this.getGameAreaId(gameName));
        startGame(gameName);
    }

    exitGame() {
        this.currentGame = null;
        UIManager.showMainMenu();
    }

    getGameAreaId(gameName) {
        // Map logical game names to DOM area IDs
        const map = {
            table: 'tableChart',
            target: 'targetPractice',
            quickfire: 'quickFire',
            memory: 'memoryMatch',
            racing: 'racing',
            reverse: 'reverseGame',
            challenge: 'challenge'
        };
        return map[gameName] || gameName;
    }

    // Optionally, add more methods for pausing, resuming, saving, etc.
}
