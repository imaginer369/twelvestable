import { startGame } from './GameFactory.js';

export function registerGameEventHandlers() {
    // Times Table
    const chartBtn = document.getElementById('chartBtn');
    if (chartBtn) chartBtn.addEventListener('click', () => startGame('table'));

    // Target Practice
    const targetBtn = document.getElementById('targetBtn');
    if (targetBtn) targetBtn.addEventListener('click', () => startGame('target'));
    const targetStart = document.getElementById('targetStart');
    if (targetStart) targetStart.addEventListener('click', () => startGame('target'));

    // Quick Fire
    const quizBtn = document.getElementById('quizBtn');
    if (quizBtn) quizBtn.addEventListener('click', () => startGame('quickfire'));
    const quickFireStart = document.getElementById('quickFireStart');
    if (quickFireStart) quickFireStart.addEventListener('click', () => startGame('quickfire'));

    // Memory Match
    const memoryBtn = document.getElementById('memoryBtn');
    if (memoryBtn) memoryBtn.addEventListener('click', () => startGame('memory'));
    const newGameBtn = document.getElementById('newGameBtn');
    if (newGameBtn) newGameBtn.addEventListener('click', () => startGame('memory'));

    // Racing
    const racingBtn = document.getElementById('racingBtn');
    if (racingBtn) racingBtn.addEventListener('click', () => startGame('racing'));
    const racingStart = document.getElementById('racingStart');
    if (racingStart) racingStart.addEventListener('click', () => startGame('racing'));

    // Challenge
    const challengeBtn = document.getElementById('challengeBtn');
    if (challengeBtn) challengeBtn.addEventListener('click', () => startGame('challenge'));
    const challengeStart = document.getElementById('challengeStart');
    if (challengeStart) challengeStart.addEventListener('click', () => startGame('challenge'));

    // Reverse
    const reverseBtn = document.getElementById('reverseBtn');
    if (reverseBtn) reverseBtn.addEventListener('click', () => startGame('reverse'));
    const reverseStart = document.getElementById('reverseStart');
    if (reverseStart) reverseStart.addEventListener('click', () => startGame('reverse'));
}
