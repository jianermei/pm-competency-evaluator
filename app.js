const form = document.getElementById('quiz-form');
const submitBtn = document.getElementById('submit-btn');
const resultDiv = document.getElementById('result');
const resultText = document.getElementById('result-text');
const restartBtn = document.getElementById('restart-btn');

const experienceLabels = {
  new: 'New PM (0–2 years)',
  mid: 'Mid-level PM (3–7 years)',
  experienced: 'Experienced PM (8+ years)',
  director: 'Director / CPO (15+ years)',
};

const companyLabels = {
  startup: 'Startup',
  emerging: 'Emerging Organization',
  enterprise: 'Enterprise Organization',
};

function checkComplete() {
  const exp = form.querySelector('input[name="experience"]:checked');
  const company = form.querySelector('input[name="company"]:checked');
  submitBtn.disabled = !(exp && company);
}

form.addEventListener('change', checkComplete);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const experience = form.querySelector('input[name="experience"]:checked').value;
  const company = form.querySelector('input[name="company"]:checked').value;

  sessionStorage.setItem('experience', experience);
  sessionStorage.setItem('company', company);

  window.location.href = `competencies.html?experience=${experience}&company=${company}`;
});

restartBtn.addEventListener('click', () => {
  form.reset();
  submitBtn.disabled = true;
  resultDiv.classList.add('hidden');
  form.classList.remove('hidden');
});
