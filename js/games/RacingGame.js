import { currentLanguage } from '../lang.js';
import { getRandomInt } from '../utils.js';

let solved = 0;
let currentProblem = null;

export function startRacingGame() {
    solved = 0;
    document.getElementById('racingStart').style.display = 'none';
    document.getElementById('racingAnswer').style.display = 'inline-block';
    document.getElementById('racingSubmit').style.display = 'inline-block';
    document.getElementById('racingCar').style.left = '0%';
    document.getElementById('racingProgress').style.width = '0%';
    updateRacingScore();
    generateRacingProblem();
    document.getElementById('racingAnswer').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitRacingAnswer();
        }
    });
}

export function generateRacingProblem() {
    const num1 = 12;
    const num2 = getRandomInt(1, 12);
    currentProblem = { num1, num2, answer: num1 * num2 };
    document.getElementById('racingQuestion').textContent = `${num1} × ${num2} = ?`;
}

export function submitRacingAnswer() {
    const userAnswer = parseInt(document.getElementById('racingAnswer').value);
    const questionElem = document.getElementById('racingQuestion');
    if (userAnswer === currentProblem.answer) {
        document.getElementById('audio-correct').currentTime = 0;
        document.getElementById('audio-correct').play();
        solved++;
        const progress = (solved / 10) * 100;
        const carPosition = (solved / 10) * 85;
        updateRacingScore();
        document.getElementById('racingProgress').style.width = `${progress}%`;
        document.getElementById('racingCar').style.left = `${carPosition}%`;
        questionElem.classList.remove('sad-animation');
        questionElem.classList.add('happy-animation');
        if (solved >= 10) {
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
        const correctText = currentLanguage === 'hi' ? `सही जवाब: ${currentProblem.answer}` : `Correct answer: ${currentProblem.answer}`;
        const prevText = questionElem.textContent;
        questionElem.textContent = prevText + '  ' + correctText;
        setTimeout(() => {
            questionElem.classList.remove('happy-animation', 'sad-animation');
            document.getElementById('racingAnswer').value = '';
            generateRacingProblem();
        }, 1200);
    }
}

function updateRacingScore() {
    const scoreText = currentLanguage === 'hi' ? 
        `हल किए गए सवाल: ${solved}/10` :
        `Problems Solved: ${solved}/10`;
    document.getElementById('racingScore').textContent = scoreText;
}
