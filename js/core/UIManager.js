import { translations, currentLanguage } from '../../js/lang.js';

export class UIManager {
    static updateLanguage(gameData, currentGame) {
        const t = translations[currentLanguage];
        // Main content
        document.getElementById('mainTitle').textContent = t.title;
        document.getElementById('mainSubtitle').textContent = t.subtitle;
        // Game cards
        document.getElementById('chartTitle').textContent = t.chartTitle;
        document.getElementById('chartDesc').textContent = t.chartDesc;
        document.getElementById('chartBtn').textContent = t.chartBtn;
        document.getElementById('quizTitle').textContent = t.quizTitle;
        document.getElementById('quizDesc').textContent = t.quizDesc;
        document.getElementById('quizBtn').textContent = t.quizBtn;
        document.getElementById('memoryTitle').textContent = t.memoryTitle;
        document.getElementById('memoryDesc').textContent = t.memoryDesc;
        document.getElementById('memoryBtn').textContent = t.memoryBtn;
        document.getElementById('racingTitle').textContent = t.racingTitle;
        document.getElementById('racingDesc').textContent = t.racingDesc;
        document.getElementById('racingBtn').textContent = t.racingBtn;
        document.getElementById('targetTitle').textContent = t.targetTitle;
        document.getElementById('targetDesc').textContent = t.targetDesc;
        document.getElementById('targetBtn').textContent = t.targetBtn;
        document.getElementById('challengeTitle').textContent = t.challengeTitle;
        document.getElementById('challengeDesc').textContent = t.challengeDesc;
        document.getElementById('challengeBtn').textContent = t.challengeBtn;
        document.getElementById('reverseTitle').textContent = t.reverseTitle;
        document.getElementById('reverseDesc').textContent = t.reverseDesc;
        document.getElementById('reverseBtn').textContent = t.reverseBtn;
        // Back buttons
        document.querySelectorAll('[id^="backBtn"]').forEach(btn => {
            btn.textContent = t.backBtn;
        });
        // Game area titles and instructions
        document.getElementById('tableChartTitle').textContent = t.tableChartTitle;
        document.getElementById('tableInstructions').textContent = t.tableInstructions;
        document.getElementById('quickFireTitle').textContent = t.quickFireTitle;
        document.getElementById('quickFireInstructions').textContent = t.quickFireInstructions;
        document.getElementById('memoryMatchTitle').textContent = t.memoryMatchTitle;
        document.getElementById('memoryInstructions').textContent = t.memoryInstructions;
        document.getElementById('racingGameTitle').textContent = t.racingGameTitle;
        document.getElementById('racingInstructions').textContent = t.racingInstructions;
        document.getElementById('targetGameTitle').textContent = t.targetGameTitle;
        document.getElementById('targetInstructions').textContent = t.targetInstructions;
        document.getElementById('challengeGameTitle').textContent = t.challengeGameTitle;
        document.getElementById('challengeInstructions').textContent = t.challengeInstructions;
        document.getElementById('reverseGameTitle').textContent = t.reverseGameTitle;
        document.getElementById('reverseInstructions').textContent = t.reverseInstructions;
        // ...add more UI updates as needed...
    }

    static showGameArea(gameId) {
        document.getElementById('mainMenu').style.display = 'none';
        document.getElementById('languageToggle').style.display = 'none';
        document.querySelector('header').style.display = 'none';
        document.querySelectorAll('.game-area').forEach(area => {
            area.classList.remove('active');
        });
        document.getElementById(gameId).classList.add('active');
    }

    static showMainMenu() {
        document.getElementById('mainMenu').style.display = 'grid';
        document.getElementById('languageToggle').style.display = 'block';
        document.querySelector('header').style.display = 'block';
        document.querySelectorAll('.game-area').forEach(area => {
            area.classList.remove('active');
        });
    }

    static updateScore(elementId, value, label) {
        document.getElementById(elementId).textContent = `${label}: ${value}`;
    }

    // Add more UI management methods as needed
}
