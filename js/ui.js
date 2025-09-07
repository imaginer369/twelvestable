import { translations, currentLanguage } from './lang.js';
import { initTimesTable } from './games/TimesTable.js';

// UI update and DOM manipulation logic
export function updateLanguage(gameData, currentGame) {
    const t = translations[currentLanguage];
    // Main content
    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };
    setText('mainTitle', t.title);
    setText('mainSubtitle', t.subtitle);
    // Game cards
    setText('chartTitle', t.chartTitle);
    setText('chartDesc', t.chartDesc);
    setText('chartBtn', t.chartBtn);
    setText('quizTitle', t.quizTitle);
    setText('quizDesc', t.quizDesc);
    setText('quizBtn', t.quizBtn);
    setText('memoryTitle', t.memoryTitle);
    setText('memoryDesc', t.memoryDesc);
    setText('memoryBtn', t.memoryBtn);
    setText('racingTitle', t.racingTitle);
    setText('racingDesc', t.racingDesc);
    setText('racingBtn', t.racingBtn);
    setText('targetTitle', t.targetTitle);
    setText('targetDesc', t.targetDesc);
    setText('targetBtn', t.targetBtn);
    setText('challengeTitle', t.challengeTitle);
    setText('challengeDesc', t.challengeDesc);
    setText('challengeBtn', t.challengeBtn);
    setText('reverseTitle', t.reverseTitle);
    setText('reverseDesc', t.reverseDesc);
    setText('reverseBtn', t.reverseBtn);
    // Game area titles and instructions
    setText('tableChartTitle', t.tableChartTitle);
    setText('tableInstructions', t.tableInstructions);
    setText('quickFireTitle', t.quickFireTitle);
    setText('quickFireInstructions', t.quickFireInstructions);
    setText('memoryMatchTitle', t.memoryMatchTitle);
    setText('memoryInstructions', t.memoryInstructions);
    setText('racingGameTitle', t.racingGameTitle);
    setText('racingInstructions', t.racingInstructions);
    setText('targetGameTitle', t.targetGameTitle);
    setText('targetInstructions', t.targetInstructions);
    setText('challengeGameTitle', t.challengeGameTitle);
    setText('challengeInstructions', t.challengeInstructions);
    setText('reverseGameTitle', t.reverseGameTitle);
    setText('reverseInstructions', t.reverseInstructions);
    // Buttons and labels
    setText('quickFireStart', t.startQuiz);
    setText('quickFireSubmit', t.submitAnswer);
    setText('newGameBtn', t.newGameBtn);
    setText('racingStart', t.startRace);
    setText('racingSubmit', t.submit);
    setText('targetStart', t.startPractice);
    setText('targetSubmit', t.fire);
    setText('challengeStart', t.startChallenge);
    setText('challengeSubmit', t.submit);
    // Scores and timers
    const safeSet = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };
    safeSet('timer', currentLanguage === 'hi' ? `${t.timeLeft} 60 ${t.seconds}` : `${t.timeLeft} 60${t.seconds}`);
    safeSet('quickFireScore', currentLanguage === 'hi' ? `स्कोर: ${gameData.quickFire.score}` : `Score: ${gameData.quickFire.score}`);
    safeSet('memoryScore', currentLanguage === 'hi' ? `जोड़े: ${gameData.memory.matches}/6` : `Matches: ${gameData.memory.matches}/6`);
    safeSet('racingScore', currentLanguage === 'hi' ? `हल किए गए सवाल: ${gameData.racing.solved}/10` : `Problems Solved: ${gameData.racing.solved}/10`);
    safeSet('targetScore', `${t.hits} ${gameData.target.hits} | ${t.accuracy} ${gameData.target.attempts > 0 ? Math.round((gameData.target.hits / gameData.target.attempts) * 100) : 0}%`);
    safeSet('challengeScore', `${t.streak} ${gameData.challenge.streak} | ${t.best} ${gameData.challenge.best}`);
    safeSet('reverseScore', currentLanguage === 'hi' ? `स्कोर: ${gameData.reverse.score}` : `Score: ${gameData.reverse.score}`);
    safeSet('reverseTimer', currentLanguage === 'hi' ? `समय: 5:00` : `Time: 5:00`);
    // Question placeholders
    const t_startMessage = currentLanguage === 'hi' ? 'शुरू करने के लिए स्टार्ट दबाएं!' : 'Click Start to begin!';
    document.getElementById('quickFireQuestion').textContent = t_startMessage;
    document.getElementById('racingQuestion').textContent = t_startMessage;
    document.getElementById('targetQuestion').textContent = t_startMessage;
    document.getElementById('challengeQuestion').textContent = t_startMessage;
    document.getElementById('reverseQuestion').textContent = t_startMessage;
    // Times table if visible
    if (currentGame === 'tableChart') {
        initTimesTable();
    }
}
