import {
  html,
  map,
  render,
} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';

const TRANSLATIONS = {
  days: 'Tage',
  hours: 'Stunden',
  minutes: 'Minuten',
  seconds: 'Sekunden',
};

/**
 * @param {Date} from
 * @param {Date} to
 * @returns {{days: number, hours: number, minutes: number, seconds: number}}
 */
function countDown(from, to) {
  const diff = to.getTime() - from.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return {
    days,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60,
  };
}

/**
 * @param {Date} from
 * @param {Date} to
 * @returns {import("lit").TemplateResult}
 */
function renderTime(from, to) {
  const remaining = countDown(from, to);
  return html`
    <section>
      ${map(
        Object.entries(remaining),
        ([key, value]) => html`
          <figure>
            <div>
              ${map(
                `${value}`.padStart(key === 'days' ? 3 : 2, '0'),
                (char) => html`<span>${char}</span>`
              )}
            </div>
            <figcaption>${TRANSLATIONS[key]}</figcaption>
          </figure>
        `
      )}
    </section>
  `;
}

/**
 * @param {Date} to
 * @param {() => HTMLElement} getEntry
 * @returns {void}
 */
function initCountdown(to, getEntry) {
  return function listener() {
    const root = getEntry();
    setInterval(() => render(renderTime(new Date(), to), root), 1000);
    render(renderTime(new Date(), to), root);
  };
}

const params = new URLSearchParams(location.search);
const year = params.get('year') || 2024;
document.addEventListener(
  'DOMContentLoaded',
  initCountdown(new Date(`${year}-01-01T00:00:00`), () => document.body)
);
