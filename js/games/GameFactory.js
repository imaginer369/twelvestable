import * as TargetGame from './TargetGame.js';
import * as MemoryGame from './MemoryGame.js';
import * as QuickFireGame from './QuickFireGame.js';
import * as RacingGame from './RacingGame.js';
import * as ReverseGame from './ReverseGame.js';
import * as ChallengeGame from './ChallengeGame.js';

const gameMap = {
    target: TargetGame,
    memory: MemoryGame,
    quickfire: QuickFireGame,
    racing: RacingGame,
    reverse: ReverseGame,
    challenge: ChallengeGame
};

export function getGame(gameName) {
    return gameMap[gameName.toLowerCase()] || null;
}

// Optionally, a unified start function
export function startGame(gameName) {
    const game = getGame(gameName);
    if (!game) throw new Error(`Unknown game: ${gameName}`);
    if (typeof game.start === 'function') {
        game.start();
    } else if (typeof game[`start${capitalize(gameName)}Game`] === 'function') {
        game[`start${capitalize(gameName)}Game`]();
    } else if (typeof game[`init${capitalize(gameName)}Game`] === 'function') {
        game[`init${capitalize(gameName)}Game`]();
    } else {
        throw new Error(`No start/init function found for game: ${gameName}`);
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
