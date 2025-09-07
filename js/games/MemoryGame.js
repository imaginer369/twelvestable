import { currentLanguage } from '../lang.js';
import { toHindiNumber, getRandomInt } from '../utils.js';

let flippedCards = [];
let matches = 0;
let cards = [];

export function initMemoryGame() {
    matches = 0;
    flippedCards = [];
    cards = [];
    const problems = [];
    for (let i = 1; i <= 6; i++) {
        const num1 = 12;
        const num2 = getRandomInt(1, 12);
        const answer = num1 * num2;
        const problemText = `${num1} × ${num2}`;
        const answerText = answer.toString();
        problems.push({ type: 'problem', content: problemText, answer });
        problems.push({ type: 'answer', content: answerText, answer });
    }
    cards = problems.sort(() => Math.random() - 0.5);
    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = '';
    cards.forEach((card, index) => {
        const cardElement = document.createElement('button');
        cardElement.className = 'memory-card';
        cardElement.textContent = '?';
        cardElement.addEventListener('click', () => flipCard(index));
        grid.appendChild(cardElement);
    });
    updateMemoryScore();
}

function flipCard(index) {
    if (flippedCards.length >= 2 || flippedCards.includes(index)) {
        return;
    }
    const cardElements = document.querySelectorAll('.memory-card');
    cardElements[index].textContent = cards[index].content;
    cardElements[index].classList.add('flipped');
    flippedCards.push(index);
    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 1000);
    }
}

function checkMatch() {
    const [index1, index2] = flippedCards;
    const card1 = cards[index1];
    const card2 = cards[index2];
    const cardElements = document.querySelectorAll('.memory-card');
    if (card1.answer === card2.answer && card1.type !== card2.type) {
        document.getElementById('audio-correct').currentTime = 0;
        document.getElementById('audio-correct').play();
        cardElements[index1].classList.add('matched');
        cardElements[index2].classList.add('matched');
        matches++;
        cardElements[index1].classList.remove('sad-animation');
        cardElements[index2].classList.remove('sad-animation');
        cardElements[index1].classList.add('happy-animation');
        cardElements[index2].classList.add('happy-animation');
        updateMemoryScore();
        if (matches === 6) {
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
    flippedCards = [];
}

function updateMemoryScore() {
    const matchText = currentLanguage === 'hi' ? `जोड़े: ${toHindiNumber(matches)}/6` : `Matches: ${matches}/6`;
    document.getElementById('memoryScore').textContent = matchText;
}
