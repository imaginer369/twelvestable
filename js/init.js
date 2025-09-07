import { translations, currentLanguage, setLanguage } from './lang.js';
import { updateLanguage } from './ui.js';
import { showGame, showMainMenu, resetAllGames, gameData, currentGame, startTarget, startReverseGame } from './games.js';

// On DOMContentLoaded, initialize UI and language
window.addEventListener('DOMContentLoaded', () => {
    resetAllGames();
    updateLanguage(gameData, currentGame);

    // Language toggle buttons
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            const lang = event.target.textContent === 'E' ? 'en' : 'hi';
            setLanguage(lang);
            // Update active button
            document.querySelectorAll('.language-btn').forEach(b => b.classList.remove('active'));
            event.target.classList.add('active');
            updateLanguage(gameData, currentGame);
        });
    });

    // Main menu game buttons (robust: check existence)
    const btnMap = [
        ['chartBtn', 'tableChart'],
        ['targetBtn', 'targetPractice'],
        ['quizBtn', 'quickFire'],
        ['memoryBtn', 'memoryMatch'],
        ['racingBtn', 'racing'],
        ['challengeBtn', 'challenge'],
        ['reverseBtn', 'reverseGame']
    ];
    btnMap.forEach(([btnId, gameId]) => {
        const btn = document.getElementById(btnId);
        if (btn) btn.addEventListener('click', () => showGame(gameId));
    });

    // Back buttons
    document.querySelectorAll('[id^="backBtn"]').forEach(btn => {
        btn.addEventListener('click', showMainMenu);
    });
});

// Expose functions for inline HTML event handlers
window.showGame = showGame;
window.showMainMenu = showMainMenu;
window.setLanguage = setLanguage;
window.startTarget = startTarget;
window.startReverseGame = startReverseGame;
import { submitTarget } from './games.js';
window.submitTarget = submitTarget;
