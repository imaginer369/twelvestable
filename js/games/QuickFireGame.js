import { currentLanguage } from '../lang.js';
import { toHindiNumber, getRandomInt } from '../utils.js';

let score = 0;
let timeLeft = 60;
let timer = null;
let currentProblem = null;

export function startQuickFireGame() {
    score = 0;
    timeLeft = 60;
    document.getElementById('quickFireStart').style.display = 'none';
    document.getElementById('quickFireAnswer').style.display = 'inline-block';
    document.getElementById('quickFireSubmit').style.display = 'inline-block';
    document.getElementById('quickFireAnswer').focus();
    updateQuickFireScore();
    generateQuickFireProblem();
    timer = setInterval(() => {
        timeLeft--;
        const timeText = currentLanguage === 'hi' ? `समय: ${toHindiNumber(timeLeft)} सेकंड` : `Time: ${timeLeft}s`;
        document.getElementById('timer').textContent = timeText;
        if (timeLeft <= 0) {
            endQuickFireGame();
        }
    }, 1000);
    document.getElementById('quickFireAnswer').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitQuickFireAnswer();
        }
    });
}

export function generateQuickFireProblem() {
    const num1 = 12;
    const num2 = getRandomInt(1, 12);
    currentProblem = { num1, num2, answer: num1 * num2 };
    document.getElementById('quickFireQuestion').textContent = `${num1} × ${num2} = ?`;
}

export function submitQuickFireAnswer() {
    const userAnswer = parseInt(document.getElementById('quickFireAnswer').value);
    const questionElem = document.getElementById('quickFireQuestion');
    if (userAnswer === currentProblem.answer) {
        document.getElementById('audio-correct').currentTime = 0;
        document.getElementById('audio-correct').play();
        score++;
        updateQuickFireScore();
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
        const correctText = currentLanguage === 'hi' ? `सही जवाब: ${toHindiNumber(currentProblem.answer)}` : `Correct answer: ${currentProblem.answer}`;
        const prevText = questionElem.textContent;
        questionElem.textContent = prevText + '  ' + correctText;
        setTimeout(() => {
            questionElem.classList.remove('happy-animation', 'sad-animation');
            document.getElementById('quickFireAnswer').value = '';
            generateQuickFireProblem();
        }, 1200);
    }
}

export function endQuickFireGame() {
    clearInterval(timer);
    const gameOverText = currentLanguage === 'hi' ? 
        `खेल समाप्त! अंतिम स्कोर: ${toHindiNumber(score)}` :
        `Game Over! Final Score: ${score}`;
    document.getElementById('quickFireQuestion').textContent = gameOverText;
    document.getElementById('quickFireAnswer').style.display = 'none';
    document.getElementById('quickFireSubmit').style.display = 'none';
    document.getElementById('quickFireStart').style.display = 'inline-block';
}

function updateQuickFireScore() {
    const scoreText = currentLanguage === 'hi' ? `स्कोर: ${toHindiNumber(score)}` : `Score: ${score}`;
    document.getElementById('quickFireScore').textContent = scoreText;
}
