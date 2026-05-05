const COMPETENCIES = [
  { id: 'domain',      label: 'Domain\nKnowledge',        icon: '🔬' },
  { id: 'communication', label: 'Communication',          icon: '💬' },
  { id: 'customer',    label: 'Customer\nUnderstanding',  icon: '👥' },
  { id: 'process',     label: 'PM\nProcess',              icon: '⚙️' },
  { id: 'requirements',label: 'Requirements',             icon: '📋' },
  { id: 'management',  label: 'Management',               icon: '🗂️' },
  { id: 'pricing',     label: 'Pricing',                  icon: '💰' },
  { id: 'marketing',   label: 'Marketing',                icon: '📣' },
  { id: 'leadership',  label: 'Leadership',               icon: '🏆' },
  { id: 'strategy',    label: 'Strategy',                 icon: '🎯' },
];

const CORE_IDS = ['domain', 'communication', 'customer'];

const FOCUS_BY_LEVEL = {
  new:         ['process', 'requirements', 'management'],
  mid:         ['process', 'requirements', 'management'],
  experienced: ['management', 'pricing', 'marketing'],
  director:    ['marketing', 'leadership', 'strategy'],
};

const LEVEL_LABELS = {
  new:         'New PM (0–2 yrs)',
  mid:         'Mid-level PM (3–7 yrs)',
  experienced: 'Experienced PM (8+ yrs)',
  director:    'Director / CPO (15+ yrs)',
};

const COMPANY_LABELS = {
  startup:    'Startup',
  emerging:   'Emerging Organization',
  enterprise: 'Enterprise Organization',
};

// Read profile from sessionStorage (set by index.html on submit)
const params = new URLSearchParams(location.search);
const experience = params.get('experience') || sessionStorage.getItem('experience') || 'new';
const company    = params.get('company')    || sessionStorage.getItem('company')    || 'startup';

const focusIds = FOCUS_BY_LEVEL[experience] || [];

// Track which cards are selected
const selected = new Set([...CORE_IDS, ...focusIds]);

// ── Build UI ──────────────────────────────────────────────────────────────────

document.getElementById('profile-label').textContent =
  `${LEVEL_LABELS[experience]} · ${COMPANY_LABELS[company]}`;

const CARD_WIDTH = 110; // px (card 108 + 2 border, no gap)

const rail = document.getElementById('competency-rail');

COMPETENCIES.forEach((comp, idx) => {
  const isCore  = CORE_IDS.includes(comp.id);
  const isFocus = focusIds.includes(comp.id);

  const card = document.createElement('div');
  card.className = 'comp-card' +
    (isCore  ? ' core'  : '') +
    (isFocus ? ' focus' : '') +
    ' selected'; // start selected for core + focus

  // optional cards start unselected
  if (!isCore && !isFocus) {
    card.classList.remove('selected');
    selected.delete(comp.id);
  }

  card.dataset.id = comp.id;
  card.innerHTML = `
    <span class="card-icon">${comp.icon}</span>
    <span class="card-label">${comp.label.replace('\n', '<br>')}</span>
  `;

  card.addEventListener('click', () => toggleCard(card, comp.id, isCore));
  rail.appendChild(card);
});

function toggleCard(card, id, isCore) {
  if (isCore) return; // core always selected, not toggleable
  if (card.classList.contains('selected')) {
    card.classList.remove('selected');
    selected.delete(id);
  } else {
    card.classList.add('selected');
    selected.add(id);
  }
  updateConfirmBtn();
}

function updateConfirmBtn() {
  document.getElementById('confirm-btn').disabled = selected.size === 0;
}

updateConfirmBtn();

// ── Brackets ──────────────────────────────────────────────────────────────────

function drawBracket(label, startIdx, endIdx, cssClass) {
  const brackets = document.getElementById('brackets');
  const left  = startIdx * CARD_WIDTH;
  const width = (endIdx - startIdx + 1) * CARD_WIDTH;

  const el = document.createElement('div');
  el.className = `bracket ${cssClass}`;
  el.style.left  = `${left}px`;
  el.style.width = `${width}px`;
  el.innerHTML = `<span class="bracket-label">${label}</span>`;
  brackets.appendChild(el);
}

const coreStart = 0;
const coreEnd   = CORE_IDS.length - 1;
drawBracket('Common Core', coreStart, coreEnd, 'core-bracket');

if (focusIds.length) {
  const indices = focusIds.map(id => COMPETENCIES.findIndex(c => c.id === id));
  drawBracket(
    `${LEVEL_LABELS[experience]} Focus`,
    Math.min(...indices),
    Math.max(...indices),
    'focus-bracket'
  );
}

// ── Actions ───────────────────────────────────────────────────────────────────

document.getElementById('back-btn').addEventListener('click', () => {
  history.back();
});

document.getElementById('confirm-btn').addEventListener('click', () => {
  sessionStorage.setItem('selectedCompetencies', JSON.stringify([...selected]));
  window.location.href = 'scenario.html';
});
