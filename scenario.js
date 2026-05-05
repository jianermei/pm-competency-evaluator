// Sample scenario data — replace with dynamic data later
const scenarios = [
  {
    situation: [
      'A sudden market opportunity opened up.',
      'The VP of Sales demands an immediate feature build for a big client.',
      'The Tech Lead warns of dangerous technical debt and over-indexing the code.',
      'A conflict arose in prioritizing the new request against existing debt.',
      'A key chart shown visually represents the dilemma of choice.',
      'The PM (you) must navigate this high-pressure conflict.',
      'The main problem is to decide and respond professionally.',
    ],
  },
];

let currentIndex = 0;

function renderSituation(idx) {
  const list = document.getElementById('situation-list');
  list.innerHTML = '';
  scenarios[idx].situation.forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    list.appendChild(li);
  });
}

// ── Bullet answer field ───────────────────────────────────────────────────────

const NUM_BULLETS = 5;
const bulletField = document.getElementById('bullet-field');

function createBulletRow(placeholder) {
  const row = document.createElement('div');
  row.className = 'bullet-row';

  const dash = document.createElement('span');
  dash.className = 'bullet-dash';
  dash.textContent = '–';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'bullet-input';
  input.placeholder = placeholder || '';

  // Press Enter to jump to next row, or create a new one
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const rows = [...bulletField.querySelectorAll('.bullet-input')];
      const i = rows.indexOf(input);
      if (i < rows.length - 1) {
        rows[i + 1].focus();
      } else {
        const newRow = createBulletRow();
        bulletField.appendChild(newRow);
        newRow.querySelector('.bullet-input').focus();
      }
    }
  });

  row.appendChild(dash);
  row.appendChild(input);
  return row;
}

for (let i = 0; i < NUM_BULLETS; i++) {
  bulletField.appendChild(createBulletRow(i === 0 ? 'Type your first point…' : ''));
}

// ── Navigation ────────────────────────────────────────────────────────────────

document.getElementById('prev-btn').addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderSituation(currentIndex);
  }
});

document.getElementById('next-btn').addEventListener('click', () => {
  if (currentIndex < scenarios.length - 1) {
    currentIndex++;
    renderSituation(currentIndex);
  }
});

// ── Submit ────────────────────────────────────────────────────────────────────

document.getElementById('submit-answer-btn').addEventListener('click', () => {
  const answers = [...bulletField.querySelectorAll('.bullet-input')]
    .map(i => i.value.trim())
    .filter(Boolean);

  if (answers.length === 0) {
    alert('Please enter at least one response before submitting.');
    return;
  }

  sessionStorage.setItem('lastAnswers', JSON.stringify(answers));
  window.location.href = 'result.html';
});

// ── Init ──────────────────────────────────────────────────────────────────────

renderSituation(currentIndex);
