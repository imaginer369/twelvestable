// Core constants for the 12 Times Table app

export const GAME_MODES = Object.freeze([
    'table',
    'target',
    'quickfire',
    'memory',
    'racing',
    'reverse',
    'challenge'
]);

export const TIMES_TABLE_NUMBER = 12;
export const MAX_MEMORY_PAIRS = 6;
export const RACING_GOAL = 10;
export const QUICKFIRE_TIME = 60; // seconds
export const REVERSE_TIME = 300; // seconds
export const CHALLENGE_BEST_KEY = 'challengeBest';

export const DOM_IDS = Object.freeze({
    mainMenu: 'mainMenu',
    languageToggle: 'languageToggle',
    header: 'header',
    gameAreas: '.game-area',
    tableChart: 'tableChart',
    targetPractice: 'targetPractice',
    quickFire: 'quickFire',
    memoryMatch: 'memoryMatch',
    racing: 'racing',
    reverseGame: 'reverseGame',
    challenge: 'challenge'
});

// Add more constants as needed for configuration
