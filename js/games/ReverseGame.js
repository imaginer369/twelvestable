import { currentLanguage } from '../lang.js';
import { toHindiNumber, getRandomInt } from '../utils.js';

let score = 0;
let timeLeft = 300;
let timer = null;
let currentProblem = null;

export function startReverseGame() {
    score = 0;
    timeLeft = 300;
    document.getElementById('reverseStart').style.display = 'none';
    document.getElementById('reverseAnswer').style.display = 'inline-block';
    document.getElementById('reverseSubmit').style.display = 'inline-block';
    document.getElementById('reverseAnswer').focus();
    generateReverseProblem();
    updateReverseTimerBar();
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        updateReverseTimerBar();
        let min = Math.floor(timeLeft / 60);
        let sec = timeLeft % 60;
        let timeStr = currentLanguage === 'hi' ? `समय: ${min}:${sec.toString().padStart(2, '0')}` : `Time: ${min}:${sec.toString().padStart(2, '0')}`;
        document.getElementById('reverseTimer').textContent = timeStr;
        if (timeLeft <= 0) {
            endReverseGame();
        }
    }, 1000);
    document.getElementById('reverseAnswer').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitReverseAnswer();
        }
    });
}

export function generateReverseProblem() {
    let n = getRandomInt(1, 12);
    currentProblem = { num: n, product: 12 * n };
    document.getElementById('reverseQuestion').textContent = `${currentProblem.product} = 12 × ?`;
}

export function submitReverseAnswer() {
    const userAnswer = parseInt(document.getElementById('reverseAnswer').value);
    const questionElem = document.getElementById('reverseQuestion');
    if (userAnswer === currentProblem.num) {
        document.getElementById('audio-correct').currentTime = 0;
        document.getElementById('audio-correct').play();
        score++;
        const scoreText = currentLanguage === 'hi' ? `स्कोर: ${toHindiNumber(score)}` : `Score: ${score}`;
        document.getElementById('reverseScore').textContent = scoreText;
        questionElem.classList.remove('sad-animation');
        questionElem.classList.add('happy-animation');
        setTimeout(() => {
            questionElem.classList.remove('happy-animation', 'sad-animation');
            document.getElementById('reverseAnswer').value = '';
            generateReverseProblem();
        }, 700);
    } else {
        document.getElementById('audio-wrong').currentTime = 0;
        document.getElementById('audio-wrong').play();
        questionElem.classList.remove('happy-animation');
        questionElem.classList.add('sad-animation');
        const correctText = currentLanguage === 'hi' ? `सही जवाब: ${toHindiNumber(currentProblem.num)}` : `Correct answer: ${currentProblem.num}`;
        const prevText = questionElem.textContent;
        questionElem.textContent = prevText + '  ' + correctText;
        setTimeout(() => {
            questionElem.classList.remove('happy-animation', 'sad-animation');
            document.getElementById('reverseAnswer').value = '';
            generateReverseProblem();
        }, 1200);
    }
}

export function endReverseGame() {
    clearInterval(timer);
    const gameOverText = currentLanguage === 'hi' ?
        `खेल समाप्त! अंतिम स्कोर: ${toHindiNumber(score)}` :
        `Game Over! Final Score: ${score}`;
    document.getElementById('reverseQuestion').textContent = gameOverText;
    document.getElementById('reverseAnswer').style.display = 'none';
    document.getElementById('reverseSubmit').style.display = 'none';
    document.getElementById('reverseStart').style.display = 'inline-block';
}

function updateReverseTimerBar() {
    const percent = (timeLeft / 300) * 100;
    document.getElementById('reverseProgress').style.width = percent + '%';
}
