import { currentLanguage } from '../lang.js';
import { toHindiNumber, getRandomInt } from '../utils.js';

let streak = 0;
let best = 0;
let currentProblem = null;

export function startChallengeGame() {
    streak = 0;
    best = parseInt(localStorage.getItem('challengeBest') || '0', 10);
    document.getElementById('challengeStart').style.display = 'none';
    document.getElementById('challengeAnswer').style.display = 'inline-block';
    document.getElementById('challengeSubmit').style.display = 'inline-block';
    updateChallengeScore();
    generateChallengeProblem();
    document.getElementById('challengeAnswer').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitChallengeAnswer();
        }
    });
}

export function generateChallengeProblem() {
    const num1 = getRandomInt(1, 12);
    const num2 = getRandomInt(1, 12);
    currentProblem = { num1, num2, answer: num1 * num2 };
    document.getElementById('challengeQuestion').textContent = `${num1} × ${num2} = ?`;
}

export function submitChallengeAnswer() {
    const userAnswer = parseInt(document.getElementById('challengeAnswer').value);
    const questionElem = document.getElementById('challengeQuestion');
    if (userAnswer === currentProblem.answer) {
        document.getElementById('audio-correct').currentTime = 0;
        document.getElementById('audio-correct').play();
        streak++;
        if (streak > best) {
            best = streak;
            localStorage.setItem('challengeBest', best);
        }
        questionElem.classList.remove('sad-animation');
        questionElem.classList.add('happy-animation');
        setTimeout(() => {
            questionElem.classList.remove('happy-animation', 'sad-animation');
            updateChallengeScore();
            document.getElementById('challengeAnswer').value = '';
            generateChallengeProblem();
        }, 700);
    } else {
        document.getElementById('audio-wrong').currentTime = 0;
        document.getElementById('audio-wrong').play();
        if (streak > 0) {
            const wrongText = currentLanguage === 'hi' ? 
                `गलत जवाब! आपकी स्ट्रिक थी ${toHindiNumber(streak)}। फिर कोशिश करें!` :
                `Wrong answer! Your streak was ${streak}. Try again!`;
            alert(wrongText);
        }
        streak = 0;
        questionElem.classList.remove('happy-animation');
        questionElem.classList.add('sad-animation');
        const correctText = currentLanguage === 'hi' ? `सही जवाब: ${toHindiNumber(currentProblem.answer)}` : `Correct answer: ${currentProblem.answer}`;
        const prevText = questionElem.textContent;
        questionElem.textContent = prevText + '  ' + correctText;
        setTimeout(() => {
            questionElem.classList.remove('happy-animation', 'sad-animation');
            updateChallengeScore();
            document.getElementById('challengeAnswer').value = '';
            generateChallengeProblem();
        }, 1200);
    }
}

function updateChallengeScore() {
    const scoreText = currentLanguage === 'hi' ? 
        `स्ट्रिक: ${toHindiNumber(streak)} | सर्वश्रेष्ठ: ${toHindiNumber(best)}` :
        `Streak: ${streak} | Best: ${best}`;
    document.getElementById('challengeScore').textContent = scoreText;
}
