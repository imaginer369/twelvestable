// Insert all back buttons on DOMContentLoaded
import { insertBackButton } from './components/backButton.js';

export function insertAllBackButtons() {
    const btns = [
        { id: 'backBtn1-container', btnId: 'backBtn1' },
        { id: 'backBtn2-container', btnId: 'backBtn2' },
        { id: 'backBtn3-container', btnId: 'backBtn3' },
        { id: 'backBtn4-container', btnId: 'backBtn4' },
        { id: 'backBtn5-container', btnId: 'backBtn5' },
        { id: 'backBtn6-container', btnId: 'backBtn6' },
        { id: 'backBtn7-container', btnId: 'backBtn7' },
        { id: 'backBtn8-container', btnId: 'backBtn8' }
    ];
    btns.forEach(({ id, btnId }) => {
        const container = document.getElementById(id);
        if (!container) return; // Robust: skip if container missing
        // Remove only previous back-btn, not all children
        const oldBtn = container.querySelector('.back-btn');
        if (oldBtn) container.removeChild(oldBtn);
        // Only insert if not already present
        if (!container.querySelector('.back-btn')) {
            const btn = insertBackButton(btnId, window.showMainMenu || (()=>{}));
            container.appendChild(btn);
        }
    });
}
// Still insert on DOMContentLoaded for initial load
window.addEventListener('DOMContentLoaded', insertAllBackButtons);
