// ── Data ──────────────────────────────────────────────────────────────────────
// Each competency has an index (x-axis position), a score (y-axis), and a flag
// for whether it needs improvement.
const competencies = [
  { id: 1,  name: 'Strategy',              score: 6.4, needsWork: true  },
  { id: 2,  name: 'Market Research',       score: 6.8, needsWork: false },
  { id: 3,  name: 'Competitive Analysis',  score: 5.6, needsWork: true  },
  { id: 4,  name: 'Pricing',               score: 5.6, needsWork: true  },
  { id: 5,  name: 'Forecasting',           score: 5.9, needsWork: false },
  { id: 6,  name: 'End Of Life',           score: 5.5, needsWork: false },
  { id: 7,  name: 'Business Skills',       score: 6.4, needsWork: false },
  { id: 8,  name: 'Domain Knowledge',      score: 7.6, needsWork: false },
  { id: 9,  name: 'Marketing and Launch',  score: 6.3, needsWork: false },
  { id: 10, name: 'Requirements',          score: 7.0, needsWork: false },
  { id: 11, name: 'Customer Understanding',score: 7.2, needsWork: false },
  { id: 12, name: 'PM Process',            score: 6.6, needsWork: false },
  { id: 13, name: 'Communication',         score: 7.2, needsWork: false },
  { id: 14, name: 'Management',            score: 7.0, needsWork: false },
  { id: 15, name: 'Leadership',            score: 7.2, needsWork: false },
];

const AVERAGE = 6.6;
const BASELINE_LABEL = 'Baseline';

// ── Left panel: career summary ────────────────────────────────────────────────
const level = sessionStorage.getItem('experience') || 'mid';

const NEXT_ROLE = {
  new:         { title: 'Set Yourself up\nfor a Mid-Level Role', path: 'Path to\nMid-Level' },
  mid:         { title: 'Set Yourself up\nfor a Senior Role',    path: 'Path to\nSenior PM' },
  experienced: { title: 'Set Yourself up\nfor a Director Role',  path: 'Path to\nDirector'  },
  director:    { title: 'Set Yourself up\nfor a CPO Role',       path: 'Path to\nCPO'       },
};

const meta = NEXT_ROLE[level] || NEXT_ROLE.experienced;
document.getElementById('career-headline').innerHTML =
  meta.title.replace('\n', '<br>');
document.getElementById('arrow-label').innerHTML =
  meta.path.replace('\n', '<br>');

// Populate "needs work" tags from competency list
const tagsEl = document.getElementById('improve-tags');
competencies.filter(c => c.needsWork).forEach(c => {
  const tag = document.createElement('div');
  tag.className = 'improve-tag';
  tag.textContent = c.name;
  tagsEl.appendChild(tag);
});

// ── Legend table ──────────────────────────────────────────────────────────────
const legendEl = document.getElementById('legend-table');
competencies.forEach(c => {
  const row = document.createElement('div');
  row.className = 'legend-row';

  const num = document.createElement('span');
  num.className = 'legend-num' + (c.needsWork ? ' needs-work' : '');
  num.textContent = c.id;

  const name = document.createElement('span');
  name.textContent = c.name;

  const score = document.createElement('span');
  score.className = 'legend-score';
  score.textContent = c.score.toFixed(1);

  row.appendChild(num);
  row.appendChild(name);
  row.appendChild(score);
  legendEl.appendChild(row);
});

// ── Scatter chart ─────────────────────────────────────────────────────────────
function drawScatter() {
  const canvas = document.getElementById('scatter-chart');
  const parent = canvas.parentElement;

  // Match canvas resolution to CSS size
  const W = parent.clientWidth  || 500;
  const H = parent.clientHeight || 340;
  canvas.width  = W;
  canvas.height = H;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);

  // Chart margins
  const ml = 62, mr = 24, mt = 36, mb = 28;
  const cw = W - ml - mr;
  const ch = H - mt - mb;

  const xMin = 0, xMax = competencies.length + 1;
  const yMin = 5.3, yMax = 8.1;

  function toX(v) { return ml + ((v - xMin) / (xMax - xMin)) * cw; }
  function toY(v) { return mt + ((yMax - v) / (yMax - yMin)) * ch; }

  // ── Grid & axes ──
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;

  // Horizontal grid lines
  for (let y = Math.ceil(yMin * 2) / 2; y <= yMax; y += 0.5) {
    ctx.beginPath();
    ctx.moveTo(ml, toY(y));
    ctx.lineTo(ml + cw, toY(y));
    ctx.stroke();

    // Y labels
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    if (Number.isInteger(y) || y % 0.5 === 0) {
      ctx.fillText(y.toFixed(1), ml - 6, toY(y));
    }
  }

  // Vertical grid lines + x labels
  for (let i = 1; i <= competencies.length; i++) {
    ctx.beginPath();
    ctx.moveTo(toX(i), mt);
    ctx.lineTo(toX(i), mt + ch);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(i, toX(i), mt + ch + 6);
  }

  // Axis lines
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(ml, mt);
  ctx.lineTo(ml, mt + ch);
  ctx.lineTo(ml + cw, mt + ch);
  ctx.stroke();

  // ── Average dotted line ──
  const avgY = toY(AVERAGE);
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = '#f6ad55';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(ml, avgY);
  ctx.lineTo(ml + cw, avgY);
  ctx.stroke();
  ctx.setLineDash([]);

  // "Average X.X" label
  ctx.fillStyle = '#f6ad55';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText(`Average`, ml - 6, avgY - 2);
  ctx.fillText(`${AVERAGE}`, ml - 6, avgY + 11);

  // ── Baseline reference dot ──
  const baseX = toX(competencies.length * 0.55);
  const baseY = toY(yMax - 0.15);
  ctx.beginPath();
  ctx.arc(baseX, baseY, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(BASELINE_LABEL, baseX + 8, baseY);

  // ── Delta labels & dots ──
  competencies.forEach(c => {
    const x = toX(c.id);
    const y = toY(c.score);
    const delta = ((c.score - AVERAGE) / AVERAGE * 100).toFixed(1);
    const absDelta = Math.abs(parseFloat(delta));

    // Only annotate points with significant deviation
    if (absDelta >= 5) {
      const sign = parseFloat(delta) >= 0 ? '+' : '';
      ctx.fillStyle = parseFloat(delta) >= 0 ? '#a8f0c8' : '#fca5a5';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = parseFloat(delta) >= 0 ? 'bottom' : 'top';
      ctx.fillText(`${sign}${delta}%`, x, y + (parseFloat(delta) >= 0 ? -14 : 14));
    }

    // Dot
    const radius = 13;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = c.needsWork ? '#f6ad55' : '#ffffff';
    ctx.fill();

    // Number inside dot
    ctx.fillStyle = '#0d1b2a';
    ctx.font = `bold ${c.id >= 10 ? 9 : 10}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(c.id, x, y);
  });
}

// Draw on load and on resize
drawScatter();
window.addEventListener('resize', drawScatter);

// ── Plan button ───────────────────────────────────────────────────────────────
document.getElementById('plan-btn').addEventListener('click', () => {
  alert('Plan builder coming soon!');
});
