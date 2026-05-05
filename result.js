// ── Mock evaluation data (replace with real AI evaluation later) ──────────────
const evaluation = {
  topic: 'PM Process',
  topicSub: 'Prioritization under pressure',
  verdict: 'good',   // 'perfect' | 'good' | 'improve' | 'awful'
  stars: 3,
  maxStars: 5,
  summary: [
    'You correctly identified the need to balance short-term client demands against long-term technical health.',
    'Your response acknowledged both stakeholders (Sales VP and Tech Lead) rather than dismissing either.',
    'Consider proposing a concrete trade-off framework (e.g. RICE or weighted scoring) to make the decision defensible.',
    'Stronger answers also include a timeline estimate and a risk mitigation plan for the tech debt incurred.',
    'Overall, a solid mid-level response — add quantified trade-offs to reach the "Perfect" tier.',
  ],
  // Radar chart axes & scores (0–5)
  radarData: [
    { label: 'Stakeholder\nMgmt',  score: 4 },
    { label: 'Trade-off\nAnalysis', score: 3 },
    { label: 'Communication',      score: 4 },
    { label: 'Risk Awareness',      score: 2 },
    { label: 'Decision\nFramework', score: 2 },
  ],
};

const VERDICT_META = {
  perfect: { label: 'Perfect',          cssClass: 'verdict-perfect', stars: 5 },
  good:    { label: 'Good',             cssClass: 'verdict-good',    stars: 3 },
  improve: { label: 'Need Improvement', cssClass: 'verdict-improve', stars: 2 },
  awful:   { label: 'Awful',            cssClass: 'verdict-awful',   stars: 1 },
};

// ── Populate topic & verdict ──────────────────────────────────────────────────
document.getElementById('topic-name').textContent = evaluation.topic;
document.getElementById('topic-sub').textContent  = evaluation.topicSub;

const meta = VERDICT_META[evaluation.verdict];
const verdictCard = document.getElementById('verdict-card');
verdictCard.classList.add(meta.cssClass);
document.getElementById('verdict-badge').textContent = meta.label;

const filledStar = '★';
const emptyStar  = '☆';
const starCount  = evaluation.stars ?? meta.stars;
document.getElementById('verdict-stars').textContent =
  filledStar.repeat(starCount) + emptyStar.repeat(5 - starCount);

// ── Populate summary list ─────────────────────────────────────────────────────
const list = document.getElementById('summary-list');
evaluation.summary.forEach(text => {
  const li = document.createElement('li');
  li.innerHTML = `<span class="arrow">→</span><span>${text}</span>`;
  list.appendChild(li);
});

// ── Radar chart (pure Canvas, no dependencies) ────────────────────────────────
function drawRadar(canvasId, dataPoints) {
  const canvas = document.getElementById(canvasId);
  const ctx    = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const cx = W / 2;
  const cy = H / 2 + 8;
  const R  = 78;   // outer radius
  const n  = dataPoints.length;
  const maxScore = 5;

  ctx.clearRect(0, 0, W, H);

  function angleOf(i) { return (Math.PI * 2 * i / n) - Math.PI / 2; }
  function point(i, r) {
    const a = angleOf(i);
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  // Draw concentric grid rings
  const rings = 5;
  for (let r = 1; r <= rings; r++) {
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const p = point(i, R * r / rings);
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.strokeStyle = r === rings ? '#aaa' : '#ddd';
    ctx.lineWidth = r === rings ? 1.2 : 0.8;
    ctx.stroke();
  }

  // Draw axis spokes
  for (let i = 0; i < n; i++) {
    const p = point(i, R);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  // Draw filled data polygon
  ctx.beginPath();
  dataPoints.forEach((d, i) => {
    const p = point(i, R * d.score / maxScore);
    i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(102, 126, 234, 0.25)';
  ctx.fill();
  ctx.strokeStyle = '#667eea';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw data point dots
  dataPoints.forEach((d, i) => {
    const p = point(i, R * d.score / maxScore);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#667eea';
    ctx.fill();
  });

  // Draw axis labels
  ctx.fillStyle = '#2d3748';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  dataPoints.forEach((d, i) => {
    const p = point(i, R + 20);
    const lines = d.label.split('\n');
    lines.forEach((line, li) => {
      ctx.font = `bold ${lines.length > 1 ? 9 : 10}px sans-serif`;
      ctx.fillText(line, p.x, p.y + (li - (lines.length - 1) / 2) * 12);
    });
  });
}

drawRadar('radar-chart', evaluation.radarData);

// ── Next scenario ─────────────────────────────────────────────────────────────
document.getElementById('next-scenario-btn').addEventListener('click', () => {
  window.location.href = 'scenario.html';
});

document.getElementById('final-results-btn').addEventListener('click', () => {
  window.location.href = 'final.html';
});
