// Central Back Button Component
// Usage: insertBackButton('backBtnX', showMainMenu)

export function insertBackButton(id, onClickFn) {
    const btn = document.createElement('button');
    btn.className = 'btn back-btn';
    btn.id = id;
    btn.setAttribute('aria-label', 'वापस जाएं');
    btn.innerHTML = `<svg width="28" height="28" viewBox="0 0 28 28"><polyline points="18,6 10,14 18,22" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    btn.onclick = onClickFn;
    return btn;
}
