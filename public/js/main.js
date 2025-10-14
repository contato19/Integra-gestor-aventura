import { mountStatusCards } from './modules/status-cards.js';
import { mountScheduleTable } from './modules/schedule-table.js';
import { mountSettings } from './modules/settings.js';
import { mountNovoRoteiro } from './modules/novo-roteiro.js';

const panels = document.querySelectorAll('.panel');
const navButtons = document.querySelectorAll('[data-target]');

function setActivePanel(id) {
  panels.forEach((panel) => {
    panel.classList.toggle('is-active', panel.id === id);
  });
}

function wireNavigation() {
  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      setActivePanel(btn.dataset.target);
    });
  });
}

function bootstrap() {
  wireNavigation();
  mountNovoRoteiro();
  mountStatusCards();
  mountScheduleTable();
  mountSettings();
}

document.addEventListener('DOMContentLoaded', bootstrap);
