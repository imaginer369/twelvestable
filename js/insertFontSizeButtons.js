// Insert font size buttons for each game area header
import { createFontSizeButtons } from './components/fontSizeButtons.js';

const gameAreas = [
    'targetPractice',
    'reverseGame',
    'tableChart',
    'quickFire',
    'memoryMatch',
    'racing',
    'challenge'
];

export function insertAllFontSizeButtons() {
    gameAreas.forEach(gameId => {
        const container = document.querySelector(`.font-size-btns-container[data-game="${gameId}"]`);
        if (container && !container.hasChildNodes()) {
            const btns = createFontSizeButtons(gameId);
            container.appendChild(btns);
        }
    });
}

window.addEventListener('DOMContentLoaded', insertAllFontSizeButtons);
