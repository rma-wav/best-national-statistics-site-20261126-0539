// STATNUSA router: hash routes, one page per section. No framework, no
// network: the route is read from location.hash, the matching view is
// rendered into #view, and its mount function wires up the controls.
import {
  mountEconomy,
  mountHome,
  mountPeople,
  mountPopulation,
  mountSources,
  renderEconomy,
  renderHome,
  renderPeople,
  renderPopulation,
  renderRegions,
  renderSources,
} from './views.js';

function parseRoute() {
  const hash = window.location.hash || '#/';
  const parts = hash.replace(/^#\//, '').split('/');
  const page = parts[0] || '';
  const year = Number(parts[1]);
  const kind = parts[2] === 'line' ? 'line' : 'bar';
  return { page, year: Number.isInteger(year) && year >= 2019 && year <= 2024 ? year : 2024, kind };
}

function render() {
  const { page, year, kind } = parseRoute();
  const view = document.getElementById('view');
  document.querySelectorAll('.site-nav a').forEach((link) => {
    const target = link.getAttribute('href');
    const active = target === '#/' ? page === '' : target.slice(2) === page;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  if (page === 'economy') {
    view.innerHTML = renderEconomy(year, kind);
    mountEconomy(year, kind);
  } else if (page === 'population') {
    view.innerHTML = renderPopulation();
    mountPopulation();
  } else if (page === 'people') {
    view.innerHTML = renderPeople();
    mountPeople();
  } else if (page === 'regions') {
    view.innerHTML = renderRegions();
  } else if (page === 'sources') {
    view.innerHTML = renderSources();
    mountSources();
  } else {
    view.innerHTML = renderHome();
    mountHome();
  }
  window.scrollTo(0, 0);
  document.title = `STATNUSA — ${document.querySelector('#view h1')?.textContent ?? 'Statistik Indonesia'}`;
}

function redrawCharts() {
  render();
}

window.addEventListener('hashchange', render);
let resizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(redrawCharts, 200);
});

render();
