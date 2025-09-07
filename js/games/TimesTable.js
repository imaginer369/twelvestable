import { currentLanguage } from '../lang.js';
import { toHindiNumber } from '../utils.js';

// Generate and display the 12x12 times table
export function initTimesTable() {
    const table = document.getElementById('timesTableGrid');
    table.innerHTML = '';
    for (let j = 1; j <= 10; j++) {
        let value = 12 * j;
        let text = currentLanguage === 'hi'
            ? `${toHindiNumber(12)} × ${toHindiNumber(j)} = ${toHindiNumber(value)}`
            : `12 × ${j} = ${value}`;
        const row = document.createElement('div');
        row.className = 'table-item-row';
        const cell = document.createElement('div');
        cell.className = 'table-item';
        cell.textContent = text;
        row.appendChild(cell);
        table.appendChild(row);
    }
}

// Optionally, export a function to update the table on language change
export function updateTimesTableLanguage() {
    initTimesTable();
}
