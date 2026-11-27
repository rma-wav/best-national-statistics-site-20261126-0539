// STATNUSA views: one render function per page. Every page is reached by
// a hash link in the header, shows real figures with source and year, and
// every control on it works: year pickers, chart toggles, table sorting,
// search filters and the CSV download.
import {
  AGE_GROUPS,
  DIGITAL,
  INDICATORS,
  PROVINCES,
  RELEASES,
  SECTORS,
  SERIES,
  SOURCES,
  TRADE,
  formatNumber,
  seriesByYear,
  totalPopulation,
} from './data.js';
import { drawBarChart, drawDonutChart, drawHorizontalBars, drawLineChart } from './charts.js';

function sourceLine(source) {
  return `<p class="source">Source: ${source}</p>`;
}

function kpiCards() {
  return `<div class="kpis">${INDICATORS.map(
    (item) => `<a class="kpi" href="${item.route}">
      <span class="kpi-label">${item.label}</span>
      <span class="kpi-value">${item.value}</span>
      <span class="kpi-detail">${item.detail}</span>
      <span class="kpi-change">${item.change}</span>
      <span class="kpi-source">${item.source}</span>
    </a>`,
  ).join('')}</div>`;
}

function chartCard(id, title, source, note = '') {
  return `<section class="card chart-card">
    <h2>${title}</h2>
    ${note ? `<p class="note">${note}</p>` : ''}
    <canvas id="${id}" role="img" aria-label="${title} chart"></canvas>
    ${sourceLine(source)}
  </section>`;
}

function dataTable(series, year) {
  const rows = series.values
    .map(
      (row) => `<tr class="${row.year === year ? 'current' : ''}">
        <td>${row.year}</td><td>${formatNumber(row.value)}</td>
      </tr>`,
    )
    .join('');
  return `<table class="data-table"><thead><tr>
    <th>Year</th><th>Value (${series.unit})</th>
  </tr></thead><tbody>${rows}</tbody></table>`;
}

export function renderHome() {
  return `<section class="hero">
    <p class="eyebrow">Portal Statistik Indonesia</p>
    <h1>Indonesia, in numbers.</h1>
    <p class="lede">Population, economy, work and wellbeing — the country's official
    statistics in one place, each figure with its source and year, free for
    everyone to read, compare and download.</p>
    <div class="hero-actions">
      <a class="btn" href="#/economy">Explore the economy</a>
      <a class="btn btn-ghost" href="#/population">See the population</a>
    </div>
    <p class="hero-meta">281.6 million people · 38 provinces · 17,500 islands ·
    figures from BPS, the national statistics office · updated 26 Nov 2026</p>
  </section>
  ${kpiCards()}
  <div class="grid-2">
    ${chartCard('home-gdp', 'The economy keeps growing', SERIES.gdpGrowth.source,
      'Real GDP growth, 2019–2024. The 2020 dip is the pandemic year; growth has held above 5% since 2022.')}
    ${chartCard('home-pop', 'Where Indonesians live', 'BPS, Proyeksi Penduduk 2024',
      'Largest provinces by projected 2024 population, in millions. Jawa Barat alone holds about one in six Indonesians.')}
  </div>
  <section class="card">
    <h2>Latest releases</h2>
    <ul class="releases">${RELEASES.map(
      (item) => `<li><a href="${item.route}">
        <span class="release-date">${item.date}</span>
        <span class="release-title">${item.title}</span>
        <span class="release-text">${item.text}</span>
      </a></li>`,
    ).join('')}</ul>
  </section>
  <section class="card digital">
    <h2>Digital Indonesia</h2>
    <p><strong>${DIGITAL.internetUsers} million people</strong> used the internet in 2024 —
    <strong>${DIGITAL.internetShare}%</strong> of the population. ${sourceLine(DIGITAL.source)}</p>
  </section>`;
}

export function mountHome() {
  drawBarChart(document.getElementById('home-gdp'), SERIES.gdpGrowth, { highlightYear: 2024 });
  drawHorizontalBars(
    document.getElementById('home-pop'),
    PROVINCES.slice(0, 6).map((p) => ({ label: p.name, value: p.population })),
  );
}

export function renderEconomy(year, chartKind) {
  const growth = seriesByYear(SERIES.gdpGrowth, year);
  const inflation = seriesByYear(SERIES.inflation, year);
  return `<section class="page-head">
    <p class="eyebrow">Economy</p>
    <h1>The economy in ${year}</h1>
    <p class="lede">Growth, prices, trade and the sectors that make up GDP —
    all from the national statistics office.</p>
    <label class="picker">Year
      <select id="year-picker">${[2019, 2020, 2021, 2022, 2023, 2024]
        .map((y) => `<option value="${y}" ${y === year ? 'selected' : ''}>${y}</option>`)
        .join('')}</select>
    </label>
  </section>
  <div class="kpis">
    <div class="kpi"><span class="kpi-label">Real GDP growth</span>
      <span class="kpi-value">${formatNumber(growth)}%</span>
      <span class="kpi-detail">${year}</span>
      <span class="kpi-source">BPS, ${year}</span></div>
    <div class="kpi"><span class="kpi-label">Inflation (Dec, y-on-y)</span>
      <span class="kpi-value">${formatNumber(inflation)}%</span>
      <span class="kpi-detail">${year}</span>
      <span class="kpi-source">BPS, ${year}</span></div>
    <div class="kpi"><span class="kpi-label">Exports</span>
      <span class="kpi-value">US$${TRADE.exports} bn</span>
      <span class="kpi-detail">2024</span>
      <span class="kpi-source">${TRADE.source}</span></div>
    <div class="kpi"><span class="kpi-label">Trade surplus</span>
      <span class="kpi-value">US$${TRADE.surplus} bn</span>
      <span class="kpi-detail">2024: exports minus imports</span>
      <span class="kpi-source">BPS, 2024</span></div>
  </div>
  <div class="grid-2">
    <section class="card chart-card">
      <h2>Real GDP growth, 2019–2024</h2>
      <div class="toggle" role="group" aria-label="Chart type">
        <button data-kind="bar" class="${chartKind === 'bar' ? 'active' : ''}">Bars</button>
        <button data-kind="line" class="${chartKind === 'line' ? 'active' : ''}">Line</button>
      </div>
      <canvas id="econ-growth" role="img" aria-label="GDP growth chart"></canvas>
      ${sourceLine(SERIES.gdpGrowth.source)}
    </section>
    ${chartCard('econ-inflation', 'Inflation, December year-on-year', SERIES.inflation.source)}
  </div>
  <div class="grid-2">
    ${chartCard('econ-sectors', 'What makes up GDP, 2024', 'BPS, 2024',
      'Share of GDP at current prices. Manufacturing is the largest sector, at 18.67%.')}
    <section class="card">
      <h2>GDP growth by year</h2>
      ${dataTable(SERIES.gdpGrowth, year)}
      ${sourceLine(SERIES.gdpGrowth.source)}
    </section>
  </div>
  <section class="card">
    <h2>Trade, 2024</h2>
    <p>Indonesia exported <strong>US$${TRADE.exports} billion</strong> and imported
    <strong>US$${TRADE.imports} billion</strong>, a surplus of
    <strong>US$${TRADE.surplus} billion</strong> — the fifth straight year of surplus.
    ${sourceLine(TRADE.source)}</p>
    <p><button class="btn" id="download-csv">Download the data (CSV)</button>
    <span class="note">The file is built in your browser from the figures on this page — no account, no network.</span></p>
  </section>`;
}

export function mountEconomy(year, chartKind) {
  const chart = document.getElementById('econ-growth');
  if (chartKind === 'line') drawLineChart(chart, SERIES.gdpGrowth, { highlightYear: year });
  else drawBarChart(chart, SERIES.gdpGrowth, { highlightYear: year });
  drawLineChart(document.getElementById('econ-inflation'), SERIES.inflation);
  drawDonutChart(document.getElementById('econ-sectors'), SECTORS);
  document.querySelectorAll('.toggle button').forEach((button) => {
    button.addEventListener('click', () => {
      window.location.hash = `#/economy/${year}/${button.dataset.kind}`;
    });
  });
  document.getElementById('year-picker').addEventListener('change', (event) => {
    window.location.hash = `#/economy/${event.target.value}/${chartKind}`;
  });
  document.getElementById('download-csv').addEventListener('click', downloadCsv);
}

export function renderPopulation() {
  return `<section class="page-head">
    <p class="eyebrow">Population</p>
    <h1>281.6 million people</h1>
    <p class="lede">Indonesia is the world's fourth most populous country. The population
    grows about 0.82% a year, and more than half lives on Jawa.</p>
  </section>
  <div class="grid-2">
    ${chartCard('pop-trend', 'Population, 2019–2024', SERIES.population.source,
      'Millions of people, BPS projections.')}
    ${chartCard('pop-age', 'Age structure, 2024', 'BPS, Proyeksi Penduduk 2024',
      'Share of the population in each age band. The working-age share (15–64) is about 68%.')}
  </div>
  <section class="card">
    <h2>Largest provinces</h2>
    <p class="note">Projected 2024 population, millions. Type to filter the table;
    click a column heading to sort it.</p>
    <label class="picker">Search provinces
      <input id="province-search" type="search" placeholder="e.g. Jawa" autocomplete="off">
    </label>
    <table class="data-table sortable" id="province-table"><thead><tr>
      <th data-sort="name">Province</th><th data-sort="island">Island</th>
      <th data-sort="population">Population (millions)</th><th data-sort="share">Share of the 15</th>
    </tr></thead><tbody></tbody></table>
    ${sourceLine('BPS, Proyeksi Penduduk 2024 — the 15 largest provinces; together they hold '
      + `${formatNumber(totalPopulation(), 1)} million people.`)}
  </section>`;
}

export function mountPopulation() {
  drawLineChart(document.getElementById('pop-trend'), SERIES.population);
  drawHorizontalBars(
    document.getElementById('pop-age'),
    AGE_GROUPS.map((g) => ({ label: g.group, value: g.share })),
  );
  const table = document.getElementById('province-table');
  const tbody = table.querySelector('tbody');
  const total = totalPopulation();
  let sortKey = 'population';
  let sortDir = -1;
  let query = '';
  function renderRows() {
    const rows = PROVINCES
      .filter((p) => p.name.toLowerCase().includes(query) || p.island.toLowerCase().includes(query))
      .sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        if (typeof av === 'number') return (av - bv) * sortDir;
        return String(av).localeCompare(String(bv)) * sortDir;
      });
    tbody.innerHTML = rows
      .map(
        (p) => `<tr><td>${p.name}</td><td>${p.island}</td>
          <td>${formatNumber(p.population, 1)}</td>
          <td>${formatNumber((p.population / total) * 100, 1)}%</td></tr>`,
      )
      .join('') || '<tr><td colspan="4">No province matches that search.</td></tr>';
  }
  table.querySelectorAll('th[data-sort]').forEach((th) => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (sortKey === key) sortDir *= -1;
      else {
        sortKey = key;
        sortDir = key === 'name' || key === 'island' ? 1 : -1;
      }
      renderRows();
    });
  });
  document.getElementById('province-search').addEventListener('input', (event) => {
    query = event.target.value.trim().toLowerCase();
    renderRows();
  });
  renderRows();
}

export function renderPeople() {
  return `<section class="page-head">
    <p class="eyebrow">People</p>
    <h1>Work, poverty and wellbeing</h1>
    <p class="lede">How Indonesians live: who works, who is poor, and how long and
    healthy lives are getting.</p>
  </section>
  <div class="kpis">
    <div class="kpi"><span class="kpi-label">Unemployment</span>
      <span class="kpi-value">4.91%</span><span class="kpi-detail">August 2024</span>
      <span class="kpi-source">BPS, Sakernas 2024</span></div>
    <div class="kpi"><span class="kpi-label">Poverty rate</span>
      <span class="kpi-value">8.57%</span><span class="kpi-detail">September 2024</span>
      <span class="kpi-source">BPS, 2024</span></div>
    <div class="kpi"><span class="kpi-label">Human Development Index</span>
      <span class="kpi-value">75.02</span><span class="kpi-detail">2024, "high"</span>
      <span class="kpi-source">BPS, 2024</span></div>
    <div class="kpi"><span class="kpi-label">Gini ratio</span>
      <span class="kpi-value">0.379</span><span class="kpi-detail">March 2024</span>
      <span class="kpi-source">BPS, 2024</span></div>
  </div>
  <div class="grid-2">
    ${chartCard('people-poverty', 'Poverty is falling', SERIES.poverty.source,
      'Poverty rate, September each year. 2024 is the lowest since the series began.')}
    ${chartCard('people-jobs', 'Unemployment, August each year', SERIES.unemployment.source,
      'The 2020 spike is the pandemic; the rate has fallen every year since.')}
  </div>
  <section class="card">
    <h2>Wellbeing in one line</h2>
    <p>Life expectancy reached <strong>73.93 years</strong> in 2024 (BPS), up from 71.9
    years a decade earlier. The Human Development Index, which combines health,
    schooling and income, stood at <strong>75.02</strong> — in the "high" category for
    the first time in the country's history. ${sourceLine('BPS, Indeks Pembangunan Manusia 2024')}</p>
    <p><button class="btn" id="download-csv-people">Download the data (CSV)</button></p>
  </section>`;
}

export function mountPeople() {
  drawLineChart(document.getElementById('people-poverty'), SERIES.poverty);
  drawLineChart(document.getElementById('people-jobs'), SERIES.unemployment);
  document.getElementById('download-csv-people').addEventListener('click', downloadCsv);
}

export function renderRegions() {
  return `<section class="page-head">
    <p class="eyebrow">Regions</p>
    <h1>38 provinces, one country</h1>
    <p class="lede">From Aceh in the west to Papua in the east, Indonesia spans three
    time zones. These are its largest provinces — and the islands they sit on.</p>
  </section>
  <section class="card">
    <h2>Population by island</h2>
    <p>Jawa holds about <strong>54%</strong> of the population on <strong>7%</strong> of the
    land; Kalimantan, the largest island, holds under <strong>6%</strong>. That gap is
    why the capital is moving from Jakarta to Nusantara in East Kalimantan.
    ${sourceLine('BPS, Proyeksi Penduduk 2024; BPS, Luas Wilayah 2024')}</p>
    <table class="data-table"><thead><tr>
      <th>Island</th><th>Share of population</th><th>Largest province</th>
    </tr></thead><tbody>
      <tr><td>Jawa</td><td>~54%</td><td>Jawa Barat (50.3 jt)</td></tr>
      <tr><td>Sumatera</td><td>~21%</td><td>Sumatera Utara (16.0 jt)</td></tr>
      <tr><td>Sulawesi</td><td>~7%</td><td>Sulawesi Selatan (9.4 jt)</td></tr>
      <tr><td>Kalimantan</td><td>~6%</td><td>Kalimantan Barat (5.9 jt)</td></tr>
      <tr><td>Papua</td><td>~2%</td><td>Papua (1.1 jt)</td></tr>
      <tr><td>Others (Nusa Tenggara, Maluku, Bali)</td><td>~10%</td><td>Nusa Tenggara Timur (5.7 jt)</td></tr>
    </tbody></table>
  </section>
  <section class="card">
    <h2>Find a province</h2>
    <p class="note">The full province table lives on the
    <a href="#/population">Population page</a> — search and sort it there.</p>
    <p><a class="btn" href="#/population">Open the province table</a></p>
  </section>`;
}

export function renderSources() {
  return `<section class="page-head">
    <p class="eyebrow">Sources &amp; method</p>
    <h1>Where every number comes from</h1>
    <p class="lede">STATNUSA republishes figures from Indonesia's official statistics,
    with the publication behind each one. Figures are rounded as published;
    nothing here is estimated by this site.</p>
  </section>
  <section class="card">
    <h2>Publications</h2>
    <ol class="sources">${SOURCES.map(
      (s) => `<li><strong>${s.name}</strong><br>${s.detail}</li>`,
    ).join('')}</ol>
  </section>
  <section class="card">
    <h2>Method</h2>
    <p>Population figures are BPS projections based on the 2020 census. GDP growth
    is real (constant-price) growth. Inflation is the year-on-year change in the
    consumer price index each December. Unemployment and poverty are measured by
    BPS surveys (Sakernas and Susenas). The Human Development Index combines life
    expectancy, expected and mean years of schooling, and per-capita expenditure.</p>
    <p>This site is an independent presentation of public statistics. It is not
    affiliated with BPS or any government body, and it copies no other site's
    design, text or images.</p>
    <p><button class="btn" id="download-csv-sources">Download the data (CSV)</button></p>
  </section>`;
}

export function mountSources() {
  document.getElementById('download-csv-sources').addEventListener('click', downloadCsv);
}

export function downloadCsv() {
  const lines = ['indicator,year,value,unit,source'];
  Object.entries(SERIES).forEach(([key, series]) => {
    series.values.forEach((row) => {
      lines.push(`${key},${row.year},${row.value},"${series.unit}","${series.source}"`);
    });
  });
  PROVINCES.forEach((p) => {
    lines.push(`province-population,2024,${p.population},"million people","BPS, Proyeksi Penduduk 2024"`);
  });
  SECTORS.forEach((s) => {
    lines.push(`gdp-sector-share,2024,${s.share},"% of GDP","BPS, 2024"`);
  });
  const blob = new Blob([`${lines.join('\n')}\n`], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'statnusa-indonesia-statistics.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
