# PM Competency Evaluator

An interactive web app that guides product managers through a competency self-evaluation and provides a personalised career advancement summary.

No frameworks, no dependencies — pure HTML, CSS, and JavaScript.

---

## Live Flow

```
index.html → competencies.html → scenario.html → result.html → final.html
```

---

## Pages

### 1. Onboarding (`index.html`)
Collects the user's profile via two questions:
- **Experience level** — New PM (0–2 yrs), Mid-level (3–7 yrs), Experienced (8+ yrs), Director/CPO (15+ yrs)
- **Company size** — Startup, Emerging Organization, Enterprise

The profile is saved to `sessionStorage` and passed as URL query parameters to subsequent pages.

### 2. Competency Selection (`competencies.html`)
A horizontal rail of 10 competency cards the user can customise:

| Category | Competencies |
|---|---|
| Common Core (all levels) | Domain Knowledge, Communication, Customer Understanding |
| New / Mid-level focus | PM Process, Requirements, Management |
| Experienced PM focus | Management, Pricing, Marketing |
| Director focus | Marketing, Leadership, Strategy |

Cards are colour-coded (blue = core, green = recommended focus, white = optional). The user can toggle any non-core card on or off. Labeled brackets below the rail show which group each card belongs to.

### 3. Scenario (`scenario.html`)
A situational judgment exercise:
- Instruction banner at the top
- SVG illustration of the scenario (PM, VP of Sales, Tech Lead) alongside a bullet-point situation description
- Bullet-style answer field at the bottom — press **Enter** to add new bullet rows
- Left/right arrows for navigating multiple scenarios

### 4. Scenario Result (`result.html`)
Per-scenario feedback:
- Reuses the scenario illustration
- **Topic** card — competency being evaluated
- **Final Result** card — verdict (Perfect / Good / Need Improvement / Awful) with colour-coding and star rating
- Written summary with actionable feedback bullets
- **Radar chart** (Canvas) scoring 5 evaluation dimensions

### 5. Final Evaluation (`final.html`)
Overall career advancement summary:
- **Left panel** — headline tailored to the user's next career milestone, career narrative, "needs work" competency tags, CTA box, and a **"Make your plan now!"** button
- **Right panel** — **scatter chart** (Canvas) plotting all competencies by score vs. index, with numbered dots, a dotted average line, delta % annotations for significant outliers, and a three-column legend

---

## Project Structure

```
project/
├── index.html           # Onboarding questionnaire
├── competencies.html    # Competency selection rail
├── scenario.html        # Scenario + answer input
├── result.html          # Per-scenario result & radar chart
├── final.html           # Final evaluation & scatter chart
│
├── styles.css           # Shared base styles
├── competencies.css     # Styles for competency rail page
├── scenario.css         # Styles for scenario page
├── result.css           # Styles for result page
├── final.css            # Styles for final evaluation page
│
├── app.js               # Onboarding logic
├── competencies.js      # Competency selection logic
├── scenario.js          # Scenario rendering & answer input
├── result.js            # Result rendering & radar chart
└── final.js             # Final evaluation & scatter chart
```

---

## Running Locally

Open `index.html` directly in any modern browser — no build step or server required.

```bash
open index.html
```

---

## Data & Evaluation

All evaluation scores and scenario data are currently **mock data** hardcoded in each page's JavaScript file. The app is structured to be wired up to a backend or AI evaluation API:

- User answers are saved to `sessionStorage` under `lastAnswers`
- Selected competencies are saved under `selectedCompetencies`
- Replace the `evaluation` object in `result.js` and the `competencies` array in `final.js` with API responses to enable real scoring

---

## Roadmap

- [ ] AI-powered answer evaluation
- [ ] Multiple scenario bank per competency
- [ ] Personalised practice plan generator
- [ ] User accounts and progress tracking
- [ ] Export results as PDF
