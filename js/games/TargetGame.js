// Expose for inline HTML usage if needed
if (typeof window !== 'undefined') {
    window.startTarget = startTargetGame;
}
import { currentLanguage } from '../lang.js';
import { toHindiNumber, getRandomInt } from '../utils.js';

// Game state for Target Practice
let hits = 0;
let attempts = 0;
let currentProblem = null;
let prevNum2 = null;

export function startTargetGame() {
    hits = 0;
    attempts = 0;
    document.getElementById('targetStart').style.display = 'none';
    document.getElementById('targetAnswer').style.display = 'inline-block';
    document.getElementById('targetSubmit').style.display = 'inline-block';
    updateTargetScore();
    generateTargetProblem();
    document.getElementById('targetAnswer').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitTargetAnswer();
        }
    });
}

    const num1 = 12;
    let num2;
    do {
        num2 = getRandomInt(1, 10);
    } while (num2 === prevNum2);
    {
        prevNum2 = num2;
        currentProblem = { num1, num2, answer: num1 * num2 };
        document.getElementById('targetQuestion').textContent = `🎯 ${num1} × ${num2} = ?`;
    }

export function submitTargetAnswer() {
    const userAnswer = parseInt(document.getElementById('targetAnswer').value);
    attempts++;
    const questionElem = document.getElementById('targetQuestion');
    if (userAnswer === currentProblem.answer) {
        document.getElementById('audio-correct').currentTime = 0;
        document.getElementById('audio-correct').play();
        hits++;
        questionElem.classList.remove('sad-animation');
        questionElem.classList.add('happy-animation');
        setTimeout(() => {
            questionElem.classList.remove('happy-animation', 'sad-animation');
            updateTargetScore();
            document.getElementById('targetAnswer').value = '';
            generateTargetProblem();
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
            updateTargetScore();
            document.getElementById('targetAnswer').value = '';
            generateTargetProblem();
        }, 1200);
    }
}

function updateTargetScore() {
    const accuracy = attempts > 0 ? Math.round((hits / attempts) * 100) : 0;
    const scoreText = currentLanguage === 'hi' ? 
        `हिट: ${toHindiNumber(hits)} | सटीकता: ${toHindiNumber(accuracy)}%` :
        `Hits: ${hits} | Accuracy: ${accuracy}%`;
    document.getElementById('targetScore').textContent = scoreText;
}
