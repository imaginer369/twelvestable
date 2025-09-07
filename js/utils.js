// Utility functions

export function toHindiNumber(num) {
    // Always use standard numerals for now
    return num.toString();
}

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
