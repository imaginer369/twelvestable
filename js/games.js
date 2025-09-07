import { updateLanguage } from './ui.js';
import { initTimesTable } from './games/TimesTable.js';
import { currentLanguage } from './lang.js';
import { toHindiNumber, getRandomInt } from './utils.js';

export let currentGame = null;
export let gameData = {
    quickFire: { score: 0, timeLeft: 60, timer: null, currentProblem: null },
    memory: { flippedCards: [], matches: 0, cards: [] },
    racing: { solved: 0, currentProblem: null },
    target: { hits: 0, attempts: 0, currentProblem: null },
    challenge: { streak: 0, best: 0, currentProblem: null },
    reverse: { score: 0, timeLeft: 300, timer: null, currentProblem: null }
};

// --- Game Navigation ---
export function showGame(gameId) {
    const mainMenu = document.getElementById('mainMenu');
    if (mainMenu) mainMenu.style.display = 'none';
    const langToggle = document.getElementById('languageToggle');
    if (langToggle) langToggle.style.display = 'none';
    const header = document.querySelector('header');
    if (header) header.style.display = 'none';
    document.querySelectorAll('.game-area').forEach(area => {
        area.classList.remove('active');
        area.style.display = 'none';
    });
    const gameArea = document.getElementById(gameId);
    if (gameArea) {
        gameArea.classList.add('active');
        gameArea.style.display = '';
    }
    currentGame = gameId;
    // Robust back button insertion
    import('./insertBackButtons.js').then(module => {
        if (module && typeof module.insertAllBackButtons === 'function') {
            module.insertAllBackButtons();
        }
    }).catch(() => {});
    // Ensure game start button is visible
    const startBtnMap = {
        tableChart: 'tableTargetStart',
        quickFire: 'quickFireStart',
        memoryMatch: 'newGameBtn',
        racing: 'racingStart',
        targetPractice: 'targetStart',
        challenge: 'challengeStart',
        reverseGame: 'reverseStart'
    };
    const btnId = startBtnMap[gameId];
    if (btnId) {
        const btn = document.getElementById(btnId);
        if (btn) btn.style.display = 'inline-block';
    }
    if (gameId === 'tableChart') {
        initTimesTable();
    } else if (gameId === 'memoryMatch') {
        if (typeof initMemoryGame === 'function') initMemoryGame();
    } else if (gameId === 'reverseGame') {
        updateLanguage(gameData, currentGame);
    }
}

export function showMainMenu() {
    const mainMenu = document.getElementById('mainMenu');
    if (mainMenu) mainMenu.style.display = 'grid';
    const langToggle = document.getElementById('languageToggle');
    if (langToggle) langToggle.style.display = 'block';
    const header = document.querySelector('header');
    if (header) header.style.display = 'block';
    // Hide all game areas
    document.querySelectorAll('.game-area').forEach(area => {
        area.style.display = 'none';
        area.classList.remove('active');
    });
    currentGame = null;
    resetAllGames();
    // Show main menu only
    if (mainMenu) mainMenu.style.display = 'grid';
}

export function resetAllGames() {
    if (gameData.quickFire.timer) {
        clearInterval(gameData.quickFire.timer);
        gameData.quickFire.timer = null;
    }
    gameData.quickFire = { score: 0, timeLeft: 60, timer: null, currentProblem: null };
    if (gameData.reverse.timer) {
        clearInterval(gameData.reverse.timer);
        gameData.reverse.timer = null;
    }
    gameData.reverse = { score: 0, timeLeft: 300, timer: null, currentProblem: null };
    gameData.memory = { flippedCards: [], matches: 0, cards: [] };
    gameData.racing = { solved: 0, currentProblem: null };
    gameData.target = { hits: 0, attempts: 0, currentProblem: null };
    gameData.challenge = { streak: 0, best: localStorage.getItem('challengeBest') || 0, currentProblem: null };
    gameData.reverse = { score: 0, timeLeft: 300, timer: null, currentProblem: null };
    updateLanguage(gameData, currentGame);
}

// --- Utility ---
export function generateProblem(includeOtherTables = false) {
    let num1, num2;
    if (includeOtherTables) {
        num1 = getRandomInt(1, 12);
        num2 = getRandomInt(1, 12);
    } else {
        num1 = 12;
        num2 = getRandomInt(1, 10);
    }
    return { num1, num2, answer: num1 * num2 };
}

// --- Reverse Game ---
export function startReverseGame() {
    gameData.reverse.score = 0;
    document.getElementById('reverseStart').style.display = 'none';
    document.getElementById('reverseAnswer').style.display = 'inline-block';
    document.getElementById('reverseSubmit').style.display = 'inline-block';
    document.getElementById('reverseAnswer').focus();
    generateReverseProblem();
    // Remove timer and time bar logic
    document.getElementById('reverseTimer').style.display = 'none';
    const bar = document.getElementById('reverseProgress');
    if (bar) bar.style.display = 'none';
    document.getElementById('reverseAnswer').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitReverse();
        }
    });
}

export function generateReverseProblem() {
    let n = getRandomInt(1, 10);
    gameData.reverse.currentProblem = { num: n, product: 12 * n };
    // Inline input box in the question
    const questionElem = document.getElementById('reverseQuestion');
    const answerInput = document.getElementById('reverseAnswer');
    // Hide the default input
    answerInput.style.display = 'none';
    // Build the question with inline input
    questionElem.innerHTML = `
        <span>${gameData.reverse.currentProblem.product} = 12 × </span>
        <input type="number" id="reverseInlineInput" class="answer-input" style="display:inline-block;width:3.5em;max-width:60px;" placeholder="?" autocomplete="off" inputmode="numeric">
    `;
    // Focus and handle Enter key
    const inlineInput = document.getElementById('reverseInlineInput');
    if (inlineInput) {
        inlineInput.value = '';
        inlineInput.focus();
        inlineInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitReverse();
            }
        });
    }
}

export function submitReverse() {
    // Use inline input if present
    let userAnswer;
    const inlineInput = document.getElementById('reverseInlineInput');
    if (inlineInput) {
        userAnswer = parseInt(inlineInput.value);
    } else {
        userAnswer = parseInt(document.getElementById('reverseAnswer').value);
    }
    const questionElem = document.getElementById('reverseQuestion');
    if (userAnswer === gameData.reverse.currentProblem.num) {
        document.getElementById('audio-correct').currentTime = 0;
        document.getElementById('audio-correct').play();
        gameData.reverse.score++;
        const scoreText = currentLanguage === 'hi' ? `स्कोर: ${gameData.reverse.score}` : `Score: ${gameData.reverse.score}`;
        document.getElementById('reverseScore').textContent = scoreText;
        questionElem.classList.remove('sad-animation');
        questionElem.classList.add('happy-animation');
        setTimeout(() => {
            questionElem.classList.remove('happy-animation', 'sad-animation');
            generateReverseProblem();
        }, 700);
    } else {
        document.getElementById('audio-wrong').currentTime = 0;
        document.getElementById('audio-wrong').play();
        questionElem.classList.remove('happy-animation');
        questionElem.classList.add('sad-animation');
        const correctText = currentLanguage === 'hi' ? `सही जवाब था: <b>${gameData.reverse.currentProblem.num}</b>` : `Correct answer: <b>${gameData.reverse.currentProblem.num}</b>`;
        questionElem.innerHTML = `
            <div class="correct-answer-feedback">
                <span class="icon">✔️</span> <span class="text">${correctText}</span>
                <div class="ok-btn">
                    <button id='reverseOkBtn' class='btn btn-primary' style='margin-top:0.3em;'>OK</button>
                </div>
            </div>
        `;
        const okBtn = document.getElementById('reverseOkBtn');
        if (okBtn) {
            okBtn.focus();
            okBtn.onclick = () => {
                questionElem.classList.remove('happy-animation', 'sad-animation');
                generateReverseProblem();
            };
        }
    }
}

export function endReverseGame() {
    clearInterval(gameData.reverse.timer);
    const gameOverText = currentLanguage === 'hi' ?
        `खेल समाप्त! अंतिम स्कोर: ${gameData.reverse.score}` :
        `Game Over! Final Score: ${gameData.reverse.score}`;
    document.getElementById('reverseQuestion').textContent = gameOverText;
    document.getElementById('reverseAnswer').style.display = 'none';
    document.getElementById('reverseSubmit').style.display = 'none';
    document.getElementById('reverseStart').style.display = 'inline-block';
}

function updateReverseTimerBar() {
    const percent = (gameData.reverse.timeLeft / 300) * 100;
    document.getElementById('reverseProgress').style.width = percent + '%';
}

// --- Quick Fire Quiz ---
export function startQuickFire() {
    gameData.quickFire.score = 0;
    gameData.quickFire.timeLeft = 60;
    document.getElementById('quickFireStart').style.display = 'none';
    document.getElementById('quickFireAnswer').style.display = 'inline-block';
    document.getElementById('quickFireSubmit').style.display = 'inline-block';
    document.getElementById('quickFireAnswer').focus();
    generateQuickFireProblem();
    gameData.quickFire.timer = setInterval(() => {
        gameData.quickFire.timeLeft--;
        const timeText = currentLanguage === 'hi' ? `समय: ${toHindiNumber(gameData.quickFire.timeLeft)} सेकंड` : `Time: ${gameData.quickFire.timeLeft}s`;
        document.getElementById('timer').textContent = timeText;
        if (gameData.quickFire.timeLeft <= 0) {
            endQuickFire();
        }
    }, 1000);
    document.getElementById('quickFireAnswer').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitQuickFire();
        }
    });
}

export function generateQuickFireProblem() {
    gameData.quickFire.currentProblem = generateProblem();
    const problem = gameData.quickFire.currentProblem;
    document.getElementById('quickFireQuestion').textContent = `${problem.num1} × ${problem.num2} = ?`;
}

export function submitQuickFire() {
    const userAnswer = parseInt(document.getElementById('quickFireAnswer').value);
    const questionElem = document.getElementById('quickFireQuestion');
    if (userAnswer === gameData.quickFire.currentProblem.answer) {
        document.getElementById('audio-correct').currentTime = 0;
        document.getElementById('audio-correct').play();
        gameData.quickFire.score++;
        const scoreText = currentLanguage === 'hi' ? `स्कोर: ${gameData.quickFire.score}` : `Score: ${gameData.quickFire.score}`;
        document.getElementById('quickFireScore').textContent = scoreText;
        questionElem.classList.remove('sad-animation');
        questionElem.classList.add('happy-animation');
        setTimeout(() => {
            questionElem.classList.remove('happy-animation', 'sad-animation');
            document.getElementById('quickFireAnswer').value = '';
            generateQuickFireProblem();
        }, 700);
    } else {
        document.getElementById('audio-wrong').currentTime = 0;
        document.getElementById('audio-wrong').play();
        questionElem.classList.remove('happy-animation');
        questionElem.classList.add('sad-animation');
        const correctText = currentLanguage === 'hi' ? `सही जवाब था: <b>${gameData.quickFire.currentProblem.answer}</b>` : `Correct answer: <b>${gameData.quickFire.currentProblem.answer}</b>`;
        questionElem.innerHTML = `
            <div class="correct-answer-feedback">
                <span class="icon">✔️</span> <span class="text">${correctText}</span>
                <div class="ok-btn">
                    <button id='quickFireOkBtn' class='btn btn-primary' style='margin-top:0.3em;'>OK</button>
                </div>
            </div>
        `;
        const okBtn = document.getElementById('quickFireOkBtn');
        if (okBtn) {
            okBtn.focus();
            okBtn.onclick = () => {
                questionElem.classList.remove('happy-animation', 'sad-animation');
                document.getElementById('quickFireAnswer').value = '';
                generateQuickFireProblem();
            };
        }
    }
}

export function endQuickFire() {
    clearInterval(gameData.quickFire.timer);
    const gameOverText = currentLanguage === 'hi' ? 
        `खेल समाप्त! अंतिम स्कोर: ${toHindiNumber(gameData.quickFire.score)}` :
        `Game Over! Final Score: ${gameData.quickFire.score}`;
    document.getElementById('quickFireQuestion').textContent = gameOverText;
    document.getElementById('quickFireAnswer').style.display = 'none';
    document.getElementById('quickFireSubmit').style.display = 'none';
    document.getElementById('quickFireStart').style.display = 'inline-block';
}

// --- Memory Match ---
export function initMemoryGame() {
    gameData.memory.matches = 0;
    gameData.memory.flippedCards = [];
    gameData.memory.cards = [];
    const problems = [];
    for (let i = 1; i <= 6; i++) {
        const problem = generateProblem();
        const problemText = `${problem.num1} × ${problem.num2}`;
        const answerText = problem.answer.toString();
        problems.push({ type: 'problem', content: problemText, answer: problem.answer });
        problems.push({ type: 'answer', content: answerText, answer: problem.answer });
    }
    gameData.memory.cards = problems.sort(() => Math.random() - 0.5);
    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = '';
    gameData.memory.cards.forEach((card, index) => {
        const cardElement = document.createElement('button');
        cardElement.className = 'memory-card';
        cardElement.textContent = '?';
        cardElement.addEventListener('click', () => flipCard(index));
        grid.appendChild(cardElement);
    });
    const matchText = currentLanguage === 'hi' ? 'जोड़े: 0/6' : 'Matches: 0/6';
    document.getElementById('memoryScore').textContent = matchText;
}

function flipCard(index) {
    if (gameData.memory.flippedCards.length >= 2 || gameData.memory.flippedCards.includes(index)) {
        return;
    }
    const cards = document.querySelectorAll('.memory-card');
    cards[index].textContent = gameData.memory.cards[index].content;
    cards[index].classList.add('flipped');
    gameData.memory.flippedCards.push(index);
    if (gameData.memory.flippedCards.length === 2) {
        setTimeout(checkMatch, 1000);
    }
}

function checkMatch() {
    const [index1, index2] = gameData.memory.flippedCards;
    const card1 = gameData.memory.cards[index1];
    const card2 = gameData.memory.cards[index2];
    const cardElements = document.querySelectorAll('.memory-card');
    if (card1.answer === card2.answer && card1.type !== card2.type) {
        document.getElementById('audio-correct').currentTime = 0;
        document.getElementById('audio-correct').play();
        cardElements[index1].classList.add('matched');
        cardElements[index2].classList.add('matched');
        gameData.memory.matches++;
        cardElements[index1].classList.remove('sad-animation');
        cardElements[index2].classList.remove('sad-animation');
        cardElements[index1].classList.add('happy-animation');
        cardElements[index2].classList.add('happy-animation');
        const matchText = currentLanguage === 'hi' ? 
            `जोड़े: ${gameData.memory.matches}/6` :
            `Matches: ${gameData.memory.matches}/6`;
        document.getElementById('memoryScore').textContent = matchText;
        if (gameData.memory.matches === 6) {
            const congratsText = currentLanguage === 'hi' ? 
                'बधाई हो! आपने सभी जोड़े मिला लिए! 🎉' :
                'Congratulations! You matched all pairs! 🎉';
            setTimeout(() => alert(congratsText), 500);
        }
        setTimeout(() => {
            cardElements[index1].classList.remove('happy-animation');
            cardElements[index2].classList.remove('happy-animation');
        }, 700);
    } else {
        document.getElementById('audio-wrong').currentTime = 0;
        document.getElementById('audio-wrong').play();
        cardElements[index1].textContent = '?';
        cardElements[index2].textContent = '?';
        cardElements[index1].classList.remove('happy-animation');
        cardElements[index2].classList.remove('happy-animation');
        cardElements[index1].classList.add('sad-animation');
        cardElements[index2].classList.add('sad-animation');
        setTimeout(() => {
            cardElements[index1].classList.remove('sad-animation');
            cardElements[index2].classList.remove('sad-animation');
            cardElements[index1].classList.remove('flipped');
            cardElements[index2].classList.remove('flipped');
        }, 700);
    }
    gameData.memory.flippedCards = [];
}

// --- Racing Challenge ---
export function startRacing() {
    gameData.racing.solved = 0;
    document.getElementById('racingStart').style.display = 'none';
    document.getElementById('racingAnswer').style.display = 'inline-block';
    document.getElementById('racingSubmit').style.display = 'inline-block';
    document.getElementById('racingCar').style.left = '0%';
    document.getElementById('racingProgress').style.width = '0%';
    generateRacingProblem();
    document.getElementById('racingAnswer').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitRacing();
        }
    });
}

export function generateRacingProblem() {
    gameData.racing.currentProblem = generateProblem();
    const problem = gameData.racing.currentProblem;
    document.getElementById('racingQuestion').textContent = `${problem.num1} × ${problem.num2} = ?`;
}

export function submitRacing() {
    const userAnswer = parseInt(document.getElementById('racingAnswer').value);
    const questionElem = document.getElementById('racingQuestion');
    if (userAnswer === gameData.racing.currentProblem.answer) {
        document.getElementById('audio-correct').currentTime = 0;
        document.getElementById('audio-correct').play();
        gameData.racing.solved++;
        const progress = (gameData.racing.solved / 10) * 100;
        const carPosition = (gameData.racing.solved / 10) * 85;
        const scoreText = currentLanguage === 'hi' ? 
            `हल किए गए सवाल: ${gameData.racing.solved}/10` :
            `Problems Solved: ${gameData.racing.solved}/10`;
        document.getElementById('racingScore').textContent = scoreText;
        document.getElementById('racingProgress').style.width = `${progress}%`;
        document.getElementById('racingCar').style.left = `${carPosition}%`;
        questionElem.classList.remove('sad-animation');
        questionElem.classList.add('happy-animation');
        if (gameData.racing.solved >= 10) {
            const winText = currentLanguage === 'hi' ? 
                'रेस पूरी! आप जीत गए! 🏆' :
                'Race Complete! You won! 🏆';
            const raceAgainText = currentLanguage === 'hi' ? 'फिर से रेस करें' : 'Race Again';
            document.getElementById('racingQuestion').textContent = winText;
            document.getElementById('racingAnswer').style.display = 'none';
            document.getElementById('racingSubmit').style.display = 'none';
            document.getElementById('racingStart').style.display = 'inline-block';
            document.getElementById('racingStart').textContent = raceAgainText;
            setTimeout(() => {
                questionElem.classList.remove('happy-animation', 'sad-animation');
            }, 700);
            return;
        }
        setTimeout(() => {
            questionElem.classList.remove('happy-animation', 'sad-animation');
            document.getElementById('racingAnswer').value = '';
            generateRacingProblem();
        }, 700);
    } else {
        document.getElementById('audio-wrong').currentTime = 0;
        document.getElementById('audio-wrong').play();
        questionElem.classList.remove('happy-animation');
        questionElem.classList.add('sad-animation');
        const correctText = currentLanguage === 'hi' ? `सही जवाब था: <b>${gameData.racing.currentProblem.answer}</b>` : `Correct answer: <b>${gameData.racing.currentProblem.answer}</b>`;
        questionElem.innerHTML = `
            <div class="correct-answer-feedback">
                <span class="icon">✔️</span> <span class="text">${correctText}</span>
                <div class="ok-btn">
                    <button id='racingOkBtn' class='btn btn-primary' style='margin-top:0.3em;'>OK</button>
                </div>
            </div>
        `;
        const okBtn = document.getElementById('racingOkBtn');
        if (okBtn) {
            okBtn.focus();
            okBtn.onclick = () => {
                questionElem.classList.remove('happy-animation', 'sad-animation');
                document.getElementById('racingAnswer').value = '';
                generateRacingProblem();
            };
        }
    }
}

// --- Target Practice ---
export function startTarget() {
    gameData.target.hits = 0;
    gameData.target.attempts = 0;
    document.getElementById('targetStart').style.display = 'none';
    generateTargetProblem();
}

export function generateTargetProblem() {
    gameData.target.currentProblem = generateProblem();
    const problem = gameData.target.currentProblem;
    // Show the question with an input box for the answer
    const questionElem = document.getElementById('targetQuestion');
    questionElem.innerHTML = `🎯 ${problem.num1} × ${problem.num2} = <input id='targetAnswerInline' type='number' class='answer-input' placeholder='?' style='width:4em; display:inline-block;'>`;
    // Focus the inline input and set up event listener
    const input = document.getElementById('targetAnswerInline');
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitTarget();
            }
        });
        input.focus();
    }
    // Hide the old input and submit button if they exist
    const oldInput = document.getElementById('targetAnswer');
    if (oldInput) oldInput.style.display = 'none';
    const oldBtn = document.getElementById('targetSubmit');
    if (oldBtn) oldBtn.style.display = 'none';
}

export function submitTarget() {
    // Try to get answer from inline input first, fallback to old input
    let userAnswer = null;
    const inlineInput = document.getElementById('targetAnswerInline');
    if (inlineInput && inlineInput.style.display !== 'none') {
        userAnswer = parseInt(inlineInput.value);
    } else {
        userAnswer = parseInt(document.getElementById('targetAnswer').value);
    }
    gameData.target.attempts++;
    const questionElem = document.getElementById('targetQuestion');
    if (userAnswer === gameData.target.currentProblem.answer) {
        document.getElementById('audio-correct').currentTime = 0;
        document.getElementById('audio-correct').play();
        gameData.target.hits++;
        questionElem.classList.remove('sad-animation');
        questionElem.classList.add('happy-animation');
        setTimeout(() => {
            questionElem.classList.remove('happy-animation', 'sad-animation');
            const accuracy = Math.round((gameData.target.hits / gameData.target.attempts) * 100);
            const scoreText = currentLanguage === 'hi' ? 
                `हिट: ${gameData.target.hits} | सटीकता: ${accuracy}%` :
                `Hits: ${gameData.target.hits} | Accuracy: ${accuracy}%`;
            document.getElementById('targetScore').textContent = scoreText;
            const oldInput = document.getElementById('targetAnswer');
            if (oldInput) oldInput.value = '';
            generateTargetProblem();
        }, 700);
    } else {
        document.getElementById('audio-wrong').currentTime = 0;
        document.getElementById('audio-wrong').play();
        questionElem.classList.remove('happy-animation');
        questionElem.classList.add('sad-animation');
        const correctText = currentLanguage === 'hi' ? `सही जवाब था: <b>${gameData.target.currentProblem.answer}</b>` : `Correct answer: <b>${gameData.target.currentProblem.answer}</b>`;
        // Show the correct answer using a reusable feedback card class
        questionElem.innerHTML = `
            <div class="correct-answer-feedback">
                <span class="icon">✔️</span> <span class="text">${correctText}</span>
                <div class="ok-btn">
                    <button id='targetOkBtn' class='btn btn-primary' style='margin-top:0.3em;'>OK</button>
                </div>
            </div>
        `;
        const okBtn = document.getElementById('targetOkBtn');
        if (okBtn) {
            okBtn.focus();
            okBtn.onclick = () => {
                questionElem.classList.remove('happy-animation', 'sad-animation');
                const accuracy = Math.round((gameData.target.hits / gameData.target.attempts) * 100);
                const scoreText = currentLanguage === 'hi' ? 
                    `हिट: ${gameData.target.hits} | सटीकता: ${accuracy}%` :
                    `Hits: ${gameData.target.hits} | Accuracy: ${accuracy}%`;
                document.getElementById('targetScore').textContent = scoreText;
                const oldInput2 = document.getElementById('targetAnswer');
                if (oldInput2) oldInput2.value = '';
                generateTargetProblem();
            };
        }
    }
}

// --- Challenge Mode ---
export function startChallenge() {
    gameData.challenge.streak = 0;
    document.getElementById('challengeStart').style.display = 'none';
    document.getElementById('challengeAnswer').style.display = 'inline-block';
    document.getElementById('challengeSubmit').style.display = 'inline-block';
    generateChallengeProblem();
    document.getElementById('challengeAnswer').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitChallenge();
        }
    });
}

export function generateChallengeProblem() {
    gameData.challenge.currentProblem = generateProblem(true);
    const problem = gameData.challenge.currentProblem;
    document.getElementById('challengeQuestion').textContent = `${problem.num1} × ${problem.num2} = ?`;
}

export function submitChallenge() {
    const userAnswer = parseInt(document.getElementById('challengeAnswer').value);
    const questionElem = document.getElementById('challengeQuestion');
    if (userAnswer === gameData.challenge.currentProblem.answer) {
        document.getElementById('audio-correct').currentTime = 0;
        document.getElementById('audio-correct').play();
        gameData.challenge.streak++;
        questionElem.classList.remove('sad-animation');
        questionElem.classList.add('happy-animation');
        if (gameData.challenge.streak > gameData.challenge.best) {
            gameData.challenge.best = gameData.challenge.streak;
            localStorage.setItem('challengeBest', gameData.challenge.best);
        }
        setTimeout(() => {
            questionElem.classList.remove('happy-animation', 'sad-animation');
            const scoreText = currentLanguage === 'hi' ? 
                `स्ट्रिक: ${gameData.challenge.streak} | सर्वश्रेष्ठ: ${gameData.challenge.best}` :
                `Streak: ${gameData.challenge.streak} | Best: ${gameData.challenge.best}`;
            document.getElementById('challengeScore').textContent = scoreText;
            document.getElementById('challengeAnswer').value = '';
            generateChallengeProblem();
        }, 700);
    } else {
        document.getElementById('audio-wrong').currentTime = 0;
        document.getElementById('audio-wrong').play();
        if (gameData.challenge.streak > 0) {
            const wrongText = currentLanguage === 'hi' ? 
                `गलत जवाब! आपकी स्ट्रिक थी ${gameData.challenge.streak}। फिर कोशिश करें!` :
                `Wrong answer! Your streak was ${gameData.challenge.streak}. Try again!`;
            alert(wrongText);
        }
        gameData.challenge.streak = 0;
        questionElem.classList.remove('happy-animation');
        questionElem.classList.add('sad-animation');
        const correctText = currentLanguage === 'hi' ? `सही जवाब: ${gameData.challenge.currentProblem.answer}` : `Correct answer: ${gameData.challenge.currentProblem.answer}`;
        const prevText = questionElem.textContent;
        questionElem.textContent = prevText + '  ' + correctText;
        setTimeout(() => {
            questionElem.classList.remove('happy-animation', 'sad-animation');
            const scoreText = currentLanguage === 'hi' ? 
                `स्ट्रिक: ${gameData.challenge.streak} | सर्वश्रेष्ठ: ${gameData.challenge.best}` :
                `Streak: ${gameData.challenge.streak} | Best: ${gameData.challenge.best}`;
            document.getElementById('challengeScore').textContent = scoreText;
            document.getElementById('challengeAnswer').value = '';
            generateChallengeProblem();
        }, 1200);
    }
}
