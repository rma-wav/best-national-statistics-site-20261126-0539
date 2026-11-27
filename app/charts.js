// STATNUSA charts: small canvas charts drawn from the data, no libraries.
// Every chart is drawn by code on a <canvas> so the site loads no images
// and no network request is ever made. Colours come from the site palette.
export const PALETTE = ['#0b2a4a', '#c98a1b', '#2e7d6b', '#7a9cc6', '#b5542d', '#5b7a99'];

function setupCanvas(canvas, height) {
  const width = canvas.clientWidth || canvas.parentElement.clientWidth || 600;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);
  return { ctx, width, height };
}

function axes(ctx, width, height, labels, min, max) {
  const padL = 44;
  const padB = 26;
  const padT = 12;
  const plotW = width - padL - 12;
  const plotH = height - padB - padT;
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillStyle = '#5b6b7a';
  ctx.strokeStyle = '#d7dee5';
  ctx.lineWidth = 1;
  // Gridlines and y labels: 4 steps.
  for (let i = 0; i <= 4; i += 1) {
    const value = min + ((max - min) * i) / 4;
    const y = padT + plotH - (plotH * i) / 4;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(padL + plotW, y);
    ctx.stroke();
    ctx.textAlign = 'right';
    ctx.fillText(String(Math.round(value * 100) / 100), padL - 6, y + 4);
  }
  // X labels.
  ctx.textAlign = 'center';
  labels.forEach((label, i) => {
    const x = padL + (plotW * (i + 0.5)) / labels.length;
    ctx.fillText(String(label), x, height - 8);
  });
  return { padL, padB, padT, plotW, plotH };
}

function niceBounds(values, zeroBased = true) {
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (zeroBased) {
    // Bars need a zero baseline so heights compare honestly.
    if (min > 0) min = Math.min(0, min);
    if (max < 0) max = 0;
  }
  if (min === max) {
    max += 1;
    min -= 1;
  }
  const span = max - min;
  min -= span * 0.05;
  max += span * 0.08;
  return { min, max };
}

export function drawBarChart(canvas, series, options = {}) {
  const height = options.height || 240;
  const { ctx, width } = setupCanvas(canvas, height);
  const values = series.values.map((v) => v.value);
  const { min, max } = niceBounds(values);
  const { padL, padT, plotW, plotH } = axes(
    ctx,
    width,
    height,
    series.values.map((v) => v.year),
    min,
    max,
  );
  const zeroY = padT + plotH - ((0 - min) / (max - min)) * plotH;
  const slot = plotW / values.length;
  const barW = Math.min(46, slot * 0.58);
  series.values.forEach((row, i) => {
    const x = padL + slot * i + (slot - barW) / 2;
    const y = padT + plotH - ((row.value - min) / (max - min)) * plotH;
    const highlight = options.highlightYear === row.year;
    ctx.fillStyle = highlight ? '#c98a1b' : row.value < 0 ? '#b5542d' : '#0b2a4a';
    const top = Math.min(y, zeroY);
    const h = Math.max(2, Math.abs(zeroY - y));
    ctx.fillRect(x, top, barW, h);
    ctx.fillStyle = '#0b2a4a';
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    const labelY = row.value >= 0 ? top - 5 : top + h + 14;
    ctx.fillText(String(row.value), x + barW / 2, labelY);
  });
}

export function drawLineChart(canvas, series, options = {}) {
  const height = options.height || 240;
  const { ctx, width } = setupCanvas(canvas, height);
  const values = series.values.map((v) => v.value);
  // A line chart tracks change, so its axis hugs the data instead of
  // starting at zero (which would flatten a slow-moving series).
  const { min, max } = niceBounds(values, false);
  const { padL, padT, plotW, plotH } = axes(
    ctx,
    width,
    height,
    series.values.map((v) => v.year),
    min,
    max,
  );
  const point = (i, value) => ({
    x: padL + (plotW * i) / (values.length - 1),
    y: padT + plotH - ((value - min) / (max - min)) * plotH,
  });
  ctx.strokeStyle = '#0b2a4a';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  values.forEach((value, i) => {
    const p = point(i, value);
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();
  ctx.fillStyle = '#c98a1b';
  values.forEach((value, i) => {
    const p = point(i, value);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0b2a4a';
    ctx.font = 'bold 12px system-ui, sans-serif';
    // Keep the first and last value labels clear of the y-axis labels.
    if (i === 0) {
      ctx.textAlign = 'left';
      ctx.fillText(String(value), p.x + 8, p.y - 10);
    } else if (i === values.length - 1) {
      ctx.textAlign = 'right';
      ctx.fillText(String(value), p.x - 8, p.y - 10);
    } else {
      ctx.textAlign = 'center';
      ctx.fillText(String(value), p.x, p.y - 10);
    }
    ctx.fillStyle = '#c98a1b';
  });
}

export function drawDonutChart(canvas, items, options = {}) {
  const height = options.height || 260;
  const { ctx, width } = setupCanvas(canvas, height);
  const total = items.reduce((sum, item) => sum + item.share, 0);
  const cx = Math.min(width * 0.32, 150);
  const cy = height / 2;
  const radius = Math.min(height / 2 - 14, 100);
  const inner = radius * 0.58;
  let angle = -Math.PI / 2;
  items.forEach((item, i) => {
    const sweep = (item.share / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, angle, angle + sweep);
    ctx.closePath();
    ctx.fillStyle = PALETTE[i % PALETTE.length];
    ctx.fill();
    angle += sweep;
  });
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.fillStyle = '#0b2a4a';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('100%', cx, cy - 2);
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillStyle = '#5b6b7a';
  ctx.fillText('of GDP', cx, cy + 15);
  // Legend on the right.
  const legendX = cx + radius + 18;
  ctx.textAlign = 'left';
  ctx.font = '12px system-ui, sans-serif';
  items.forEach((item, i) => {
    const y = 18 + i * 26;
    ctx.fillStyle = PALETTE[i % PALETTE.length];
    ctx.fillRect(legendX, y - 9, 12, 12);
    ctx.fillStyle = '#22303d';
    const label = `${item.name} — ${item.share}%`;
    ctx.fillText(label.length > 34 ? `${label.slice(0, 33)}…` : label, legendX + 18, y + 2);
  });
}

export function drawHorizontalBars(canvas, items, options = {}) {
  const rowH = 30;
  const height = items.length * rowH + 16;
  const { ctx, width } = setupCanvas(canvas, height);
  const max = Math.max(...items.map((item) => item.value));
  ctx.font = '12px system-ui, sans-serif';
  items.forEach((item, i) => {
    const y = 8 + i * rowH;
    ctx.fillStyle = '#22303d';
    ctx.textAlign = 'left';
    ctx.fillText(item.label, 0, y + 11);
    const barX = 150;
    const barW = (width - barX - 64) * (item.value / max);
    ctx.fillStyle = i === 0 ? '#c98a1b' : '#0b2a4a';
    ctx.fillRect(barX, y, Math.max(2, barW), 16);
    ctx.fillStyle = '#0b2a4a';
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.fillText(String(item.value), barX + barW + 6, y + 12);
    ctx.font = '12px system-ui, sans-serif';
  });
}
