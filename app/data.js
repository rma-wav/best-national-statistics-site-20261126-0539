// STATNUSA data: national statistics for Indonesia.
// Every figure carries its source and year. Sources are the Badan Pusat
// Statistik (BPS) unless noted. Values are rounded as published; see the
// Sources page for the exact publication behind each series.
export const META = {
  country: 'Indonesia',
  updated: '26 November 2026',
  currency: 'Rupiah (Rp)',
};

export const YEARS = [2019, 2020, 2021, 2022, 2023, 2024];

// Headline indicators shown on the home page. Each card links to its page.
export const INDICATORS = [
  {
    id: 'population',
    label: 'Population',
    value: '281.6 jt',
    detail: '2024 projection',
    change: '+0.82% per year',
    source: 'BPS, 2024',
    route: '#/population',
  },
  {
    id: 'gdp',
    label: 'GDP (current prices)',
    value: 'Rp22,139 T',
    detail: '2024, +5.03% real growth',
    change: 'US$4,920 per capita',
    source: 'BPS, 2024',
    route: '#/economy',
  },
  {
    id: 'inflation',
    label: 'Inflation (Dec, y-on-y)',
    value: '1.57%',
    detail: 'December 2024',
    change: 'Down from 2.61% in 2023',
    source: 'BPS, 2024',
    route: '#/economy',
  },
  {
    id: 'unemployment',
    label: 'Unemployment rate',
    value: '4.91%',
    detail: 'August 2024 (Sakernas)',
    change: 'Down from 5.32% in 2023',
    source: 'BPS, 2024',
    route: '#/people',
  },
  {
    id: 'poverty',
    label: 'Poverty rate',
    value: '8.57%',
    detail: 'September 2024',
    change: '24.06 million people',
    source: 'BPS, 2024',
    route: '#/people',
  },
  {
    id: 'hdi',
    label: 'Human Development Index',
    value: '75.02',
    detail: '2024, "high" category',
    change: 'Life expectancy 73.93 years',
    source: 'BPS, 2024',
    route: '#/people',
  },
];

// Annual series. `unit` is shown on the chart axis.
export const SERIES = {
  gdpGrowth: {
    title: 'Real GDP growth',
    unit: '% per year',
    source: 'BPS, Berita Resmi Statistik, Feb 2025',
    values: [
      { year: 2019, value: 5.02 },
      { year: 2020, value: -2.07 },
      { year: 2021, value: 3.7 },
      { year: 2022, value: 5.31 },
      { year: 2023, value: 5.05 },
      { year: 2024, value: 5.03 },
    ],
  },
  inflation: {
    title: 'Inflation, December year-on-year',
    unit: '%',
    source: 'BPS, Berita Resmi Statistik, Jan 2025',
    values: [
      { year: 2019, value: 2.72 },
      { year: 2020, value: 1.68 },
      { year: 2021, value: 1.87 },
      { year: 2022, value: 5.51 },
      { year: 2023, value: 2.61 },
      { year: 2024, value: 1.57 },
    ],
  },
  unemployment: {
    title: 'Open unemployment rate, August',
    unit: '% of labour force',
    source: 'BPS, Sakernas Agustus 2024',
    values: [
      { year: 2019, value: 5.28 },
      { year: 2020, value: 7.07 },
      { year: 2021, value: 6.49 },
      { year: 2022, value: 5.86 },
      { year: 2023, value: 5.32 },
      { year: 2024, value: 4.91 },
    ],
  },
  poverty: {
    title: 'Poverty rate, September',
    unit: '% of population',
    source: 'BPS, Profil Kemiskinan, Sep 2024',
    values: [
      { year: 2019, value: 9.22 },
      { year: 2020, value: 10.19 },
      { year: 2021, value: 9.71 },
      { year: 2022, value: 9.57 },
      { year: 2023, value: 9.36 },
      { year: 2024, value: 8.57 },
    ],
  },
  population: {
    title: 'Population',
    unit: 'million people',
    source: 'BPS, Proyeksi Penduduk 2024',
    values: [
      { year: 2019, value: 268.1 },
      { year: 2020, value: 270.2 },
      { year: 2021, value: 272.7 },
      { year: 2022, value: 275.8 },
      { year: 2023, value: 278.7 },
      { year: 2024, value: 281.6 },
    ],
  },
  gini: {
    title: 'Gini ratio, March',
    unit: '0 to 1',
    source: 'BPS, Gini Ratio, Mar 2024',
    values: [
      { year: 2019, value: 0.38 },
      { year: 2020, value: 0.381 },
      { year: 2021, value: 0.384 },
      { year: 2022, value: 0.381 },
      { year: 2023, value: 0.379 },
      { year: 2024, value: 0.379 },
    ],
  },
};

// GDP by sector, share of GDP at current prices, 2024 (BPS).
export const SECTORS = [
  { name: 'Manufacturing', share: 18.67 },
  { name: 'Wholesale & retail trade', share: 12.94 },
  { name: 'Agriculture, forestry & fishing', share: 11.91 },
  { name: 'Construction', share: 9.71 },
  { name: 'Mining & quarrying', share: 8.42 },
  { name: 'Transportation & storage', share: 5.38 },
  { name: 'Information & communication', share: 4.17 },
  { name: 'Financial & insurance', share: 4.15 },
  { name: 'Other sectors', share: 24.65 },
];

// Trade, 2024 (BPS): exports US$264.7 bn, imports US$233.7 bn.
export const TRADE = {
  year: 2024,
  exports: 264.7,
  imports: 233.7,
  surplus: 31.0,
  source: 'BPS, Perkembangan Ekspor Impor, Jan 2025',
};

// Age structure, 2024 projection (BPS): shares of total population.
export const AGE_GROUPS = [
  { group: '0–14 years', share: 24.3 },
  { group: '15–24 years', share: 16.9 },
  { group: '25–54 years', share: 42.1 },
  { group: '55–64 years', share: 9.4 },
  { group: '65+ years', share: 7.3 },
];

// Largest provinces by 2024 projected population (BPS), millions, rounded.
export const PROVINCES = [
  { name: 'Jawa Barat', island: 'Jawa', population: 50.3 },
  { name: 'Jawa Timur', island: 'Jawa', population: 41.8 },
  { name: 'Jawa Tengah', island: 'Jawa', population: 37.9 },
  { name: 'Sumatera Utara', island: 'Sumatera', population: 16.0 },
  { name: 'Banten', island: 'Jawa', population: 12.4 },
  { name: 'DKI Jakarta', island: 'Jawa', population: 10.6 },
  { name: 'Sulawesi Selatan', island: 'Sulawesi', population: 9.4 },
  { name: 'Lampung', island: 'Sumatera', population: 9.3 },
  { name: 'Sumatera Selatan', island: 'Sumatera', population: 9.0 },
  { name: 'Riau', island: 'Sumatera', population: 7.0 },
  { name: 'Sumatera Barat', island: 'Sumatera', population: 5.8 },
  { name: 'Nusa Tenggara Timur', island: 'Nusa Tenggara', population: 5.7 },
  { name: 'Aceh', island: 'Sumatera', population: 5.6 },
  { name: 'Nusa Tenggara Barat', island: 'Nusa Tenggara', population: 5.6 },
  { name: 'Kalimantan Barat', island: 'Kalimantan', population: 5.9 },
];

// Digital indicator, APJII survey 2024.
export const DIGITAL = {
  internetUsers: 221.6,
  internetShare: 79.5,
  source: 'APJII, Survei Penetrasi Internet 2024',
};

// Latest releases, newest first.
export const RELEASES = [
  {
    date: '5 Feb 2025',
    title: 'Economy grew 5.03% in 2024',
    text: 'Real GDP rose 5.03% in 2024; GDP at current prices reached Rp22,139 trillion.',
    source: 'BPS',
    route: '#/economy',
  },
  {
    date: '15 Jan 2025',
    title: 'Poverty fell to 8.57% in September 2024',
    text: 'The poor population was 24.06 million people, down 0.79 points from March 2024.',
    source: 'BPS',
    route: '#/people',
  },
  {
    date: '5 Nov 2024',
    title: 'Unemployment at 4.91% in August 2024',
    text: 'The open unemployment rate fell from 5.32% a year earlier; 144.64 million people were working.',
    source: 'BPS',
    route: '#/people',
  },
  {
    date: '2 Jan 2025',
    title: 'December 2024 inflation 1.57% year-on-year',
    text: 'Annual inflation stayed inside the 2.5% ± 1% target band for the whole of 2024.',
    source: 'BPS',
    route: '#/economy',
  },
];

// Full source list for the Sources page.
export const SOURCES = [
  {
    name: 'BPS — Berita Resmi Statistik: Pertumbuhan Ekonomi 2024',
    detail: 'Real GDP growth 5.03%, GDP Rp22,139 trillion, GDP per capita US$4,919.7. Released 5 Feb 2025.',
  },
  {
    name: 'BPS — Berita Resmi Statistik: Inflasi Desember 2024',
    detail: 'December year-on-year inflation 1.57%; annual series 2019–2024. Released 2 Jan 2025.',
  },
  {
    name: 'BPS — Sakernas Agustus 2024',
    detail: 'Open unemployment rate 4.91% (August); series 2019–2024. Released 5 Nov 2024.',
  },
  {
    name: 'BPS — Profil Kemiskinan, September 2024',
    detail: 'Poverty rate 8.57%, 24.06 million poor people. Released 15 Jan 2025.',
  },
  {
    name: 'BPS — Indeks Pembangunan Manusia 2024',
    detail: 'HDI 75.02; life expectancy 73.93 years. Released 2024.',
  },
  {
    name: 'BPS — Proyeksi Penduduk 2024',
    detail: 'Population 281.6 million; provincial projections; age structure. Released 2024.',
  },
  {
    name: 'BPS — Perkembangan Ekspor dan Impor, 2024',
    detail: 'Exports US$264.7 billion, imports US$233.7 billion, surplus US$31.0 billion.',
  },
  {
    name: 'BPS — Gini Ratio, Maret 2024',
    detail: 'Gini ratio 0.379. Released 2024.',
  },
  {
    name: 'APJII — Survei Penetrasi Internet Indonesia 2024',
    detail: '221.6 million internet users, 79.5% of the population.',
  },
];

// Helpers shared by the views.
export function seriesByYear(series, year) {
  const row = series.values.find((v) => v.year === year);
  return row ? row.value : null;
}

export function formatNumber(value, decimals = 2) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function totalPopulation() {
  return PROVINCES.reduce((sum, p) => sum + p.population, 0);
}
