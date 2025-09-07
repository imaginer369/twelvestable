/**
 * Constants for font size control configuration
 */
const FONT_SIZE_CONFIG = {
    MIN_SIZE: 0.7,
    MAX_SIZE: 2.5,
    STEP_SIZE: 0.1,
    DEBOUNCE_MS: 120,
    STORAGE_PREFIX: 'fontSize_'
};

/**
 * SVG templates for button icons with accessibility attributes
 */
const SVG_TEMPLATES = {
    increase: `<svg width="1.7em" height="1.7em" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" 
        aria-label="Increase font size" role="img" focusable="false" style="display:block;">
        <rect x="20" y="8" width="8" height="32" rx="4" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
        <rect x="8" y="20" width="32" height="8" rx="4" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
    </svg>`,
    decrease: `<svg width="1.7em" height="1.7em" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" 
        aria-label="Decrease font size" role="img" focusable="false" style="display:block;">
        <rect x="8" y="20" width="32" height="8" rx="4" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
    </svg>`
};

/**
 * Creates font size control buttons for a game area
 * @param {string} gameAreaId - The ID of the game area element
 * @returns {HTMLElement} The container element with font size buttons
 */
export function createFontSizeButtons(gameAreaId) {
    if (!gameAreaId || typeof gameAreaId !== 'string') {
        throw new Error('Invalid gameAreaId provided to createFontSizeButtons');
    }

    const container = document.createElement('div');
    container.className = 'font-size-btns';

    const plusBtn = document.createElement('button');
    plusBtn.className = 'btn font-btn font-btn-increase';
    plusBtn.title = 'Increase font size';
    plusBtn.setAttribute('aria-label', 'Increase font size');
    plusBtn.onclick = (e) => handleFontSizeClick(e, gameAreaId, 1);
    plusBtn.innerHTML = SVG_TEMPLATES.increase;

    const minusBtn = document.createElement('button');
    minusBtn.className = 'btn font-btn font-btn-decrease';
    minusBtn.title = 'Decrease font size';
    minusBtn.setAttribute('aria-label', 'Decrease font size');
    minusBtn.onclick = (e) => handleFontSizeClick(e, gameAreaId, -1);
    minusBtn.innerHTML = SVG_TEMPLATES.decrease;

    container.appendChild(minusBtn);
    container.appendChild(plusBtn);

    // On load, apply saved font size
    setTimeout(() => {
        applySavedFontSize(gameAreaId);
    }, 0);

    return container;
}

/**
 * Handles font size button clicks with debouncing
 * @param {Event} event - The click event object
 * @param {string} gameAreaId - The ID of the game area
 * @param {number} delta - The change in font size (-1 or 1)
 */
function handleFontSizeClick(event, gameAreaId, delta) {
    event.preventDefault();
    const area = document.getElementById(gameAreaId);
    if (!area) {
        console.warn(`Game area not found: ${gameAreaId}`);
        return;
    }

    if (area._fontSizeDebounce) {
        return;
    }

    area._fontSizeDebounce = true;
    setTimeout(() => { area._fontSizeDebounce = false; }, FONT_SIZE_CONFIG.DEBOUNCE_MS);

    // Selector list for font size adjustment. Update if new UI elements are added.
    const selectors = [
        '.score', '.question', '.answer-input', '.memory-grid', '.progress-bar', '.times-table',
        '.table-item', '.memory-card', '.racing-track', '.challenge-content', '.game-content', '.game-desc', '.game-main', '.game-body', '.game-grid', '.game-row', '.game-cell', '.feedback-card', '.challenge-question', '.challenge-answer', '.challenge-score', '.challenge-progress', '.challenge-main', '.challenge-grid', '.challenge-row', '.challenge-cell'
    ];
    selectors.forEach(sel => {
        area.querySelectorAll(sel).forEach(el => {
            // Exclude h2, .game-header-row, and their children. Update if header structure changes.
            if (el.closest('.game-header-row') || el.tagName === 'H2') return;
            // Only affect visible elements
            if (el.offsetParent === null) return;
            let current = parseFloat(el.style.fontSize);
            if (!current || isNaN(current)) {
                // Try computed style, fallback to parent if needed
                current = parseFloat(window.getComputedStyle(el).fontSize) / 16;
                if (!current || isNaN(current)) {
                    current = el.parentElement ? parseFloat(window.getComputedStyle(el.parentElement).fontSize) / 16 : 1;
                }
                if (!current || isNaN(current)) current = 1;
            }
            let newSize = current + delta * 0.1;
            newSize = Math.max(0.7, Math.min(newSize, 2.5));
            el.style.fontSize = newSize + 'em';
            // Persist per game
            try {
                saveFontSize(gameAreaId, sel, newSize);
            } catch (e) {
                // Fallback: show a warning if localStorage fails
                if (!window._fontSizeStorageWarned) {
                    window._fontSizeStorageWarned = true;
                    alert('Font size changes will not be saved due to browser storage restrictions.');
                }
            }
        });
    });
}

function saveFontSize(gameAreaId, sel, size) {
    try {
        const key = `fontSize_${gameAreaId}_${sel}`;
        localStorage.setItem(key, size);
    } catch (e) {
        // Fallback: do nothing, handled in adjustFontSize
    }
}

function applySavedFontSize(gameAreaId) {
    const area = document.getElementById(gameAreaId);
    if (!area) return;
    // Selector list for font size adjustment. Update if new UI elements are added.
    const selectors = [
        '.score', '.question', '.answer-input', '.memory-grid', '.progress-bar', '.times-table',
        '.table-item', '.memory-card', '.racing-track', '.challenge-content', '.game-content', '.game-desc', '.game-main', '.game-body', '.game-grid', '.game-row', '.game-cell', '.feedback-card', '.challenge-question', '.challenge-answer', '.challenge-score', '.challenge-progress', '.challenge-main', '.challenge-grid', '.challenge-row', '.challenge-cell'
    ];
    selectors.forEach(sel => {
        try {
            const key = `fontSize_${gameAreaId}_${sel}`;
            const size = parseFloat(localStorage.getItem(key));
            if (size && !isNaN(size)) {
                area.querySelectorAll(sel).forEach(el => {
                    // Exclude h2, .game-header-row, and their children. Update if header structure changes.
                    if (el.closest('.game-header-row') || el.tagName === 'H2') return;
                    el.style.fontSize = size + 'em';
                });
            }
        } catch (e) {
            // Fallback: do nothing, handled in adjustFontSize
        }
    });
}
