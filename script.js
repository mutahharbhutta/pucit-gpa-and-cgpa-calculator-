// ===== UTILITY FUNCTIONS =====
function getGP(marks) {
  if (marks >= 85) return 4.0;
  else if (marks >= 80) return 3.7;
  else if (marks >= 75) return 3.3;
  else if (marks >= 70) return 3.0;
  else if (marks >= 65) return 2.7;
  else if (marks >= 61) return 2.3;
  else if (marks >= 58) return 2.0;
  else if (marks >= 55) return 1.7;
  else if (marks >= 50) return 1.0;
  else return 0.0;
}

function getGrade(gpa) {
  if (gpa >= 3.7) return 'A';
  else if (gpa >= 3.3) return 'A-';
  else if (gpa >= 3.0) return 'B+';
  else if (gpa >= 2.7) return 'B';
  else if (gpa >= 2.3) return 'B-';
  else if (gpa >= 2.0) return 'C+';
  else if (gpa >= 1.7) return 'C';
  else if (gpa >= 1.0) return 'D';
  else return 'F';
}

function getMotivationalMessage(value) {
  if (value >= 3.8) return "🎉 Outstanding! You're at the top of your game!";
  else if (value >= 3.5) return "🔥 Excellent work! Keep up the momentum!";
  else if (value >= 3.0) return "😎 Good job! You're on the right track!";
  else if (value >= 2.5) return "💪 Keep pushing! You can improve further!";
  else if (value >= 2.0) return "📚 Focus and work harder - you've got this!";
  else return "🚀 Time to level up! Every effort counts!";
}

function showNotification(message, type = 'success') {
  const copyBtn = document.getElementById('copyBtn');
  let msgSpan = document.getElementById('copyMsgSpan');
  if (!msgSpan) {
    msgSpan = document.createElement('span');
    msgSpan.id = 'copyMsgSpan';
    msgSpan.style.marginLeft = '10px';
    msgSpan.style.fontWeight = '600';
    copyBtn?.parentNode?.insertBefore(msgSpan, copyBtn.nextSibling);
  }
  if (!msgSpan) return;
  msgSpan.textContent = message;
  msgSpan.style.display = 'inline';
  msgSpan.style.color = type === 'error' ? '#ef4444' : '#10b981';
  setTimeout(() => { msgSpan.textContent = ''; msgSpan.style.display = 'none'; }, 3000);
}

function showResultMessage(containerId, message, isError = false) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = message;
  container.className = `result-message ${isError ? 'error' : ''} show`;
  setTimeout(() => container.classList.remove('show'), 5000);
}

// ===== THEME =====
class ThemeManager {
  constructor() {
    this.themes = ['theme-ocean', 'theme-sunset', 'theme-forest', 'theme-orchid'];
    this.currentThemeIndex = 0;
    this.isDarkMode = false;
    this.init();
  }
  init() {
    document.getElementById('themeBtn')?.addEventListener('click', () => this.switchTheme());
    document.getElementById('modeToggle')?.addEventListener('click', () => this.toggleDarkMode());
  }
  switchTheme() {
    document.body.classList.remove(this.themes[this.currentThemeIndex]);
    this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themes.length;
    document.body.classList.add(this.themes[this.currentThemeIndex]);
  }
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark', this.isDarkMode);
    const t = document.getElementById('modeToggle');
    if (t) t.textContent = this.isDarkMode ? '🌙' : '☀️';
  }
}

// ===== GPA =====
class GPACalculator {
  constructor() { this.init(); }
  init() {
    document.getElementById('generateSubjectsBtn')?.addEventListener('click', () => this.generateSubjects());
  }
  generateSubjects() {
    const count = parseInt(document.getElementById('subjectCount')?.value);
    const container = document.getElementById('subjectsContainer');
    if (!container) return;

    if (!count || count < 1 || count > 20) {
      showResultMessage('gpaResult', '<p> Please enter a valid number of subjects (1-20).</p>', true);
      return;
    }

    let html = `
      <div class="table-container">
        <table class="data-table">
          <thead><tr><th>Subject Name</th><th>Marks (%)</th><th>Credit Hours</th></tr></thead>
          <tbody>
            ${Array.from({length: count}).map(() => `
              <tr>
                <td><input type="text" class="subject-name" placeholder="Optional"/></td>
                <td><input type="number" class="subject-marks" min="0" max="100" step="0.1"/></td>
                <td><input type="number" class="subject-credits" min="0.5" max="10" step="0.1"/></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <button class="btn btn-primary" style="margin-top:1.5rem;" id="calculateGPABtn"><span></span> Calculate GPA</button>
    `;
    container.innerHTML = html;

    document.getElementById('calculateGPABtn')?.addEventListener('click', () => this.calculateGPA());

    // immediate refresh so ring/stats don't stay at 0.00 right after generation
    displayManager?.updateDisplay();
  }
  calculateGPA() {
    const marks = document.querySelectorAll('#subjectsContainer .subject-marks');
    const credits = document.querySelectorAll('#subjectsContainer .subject-credits');
    let totalPoints = 0, totalCredits = 0, validSubjects = 0, hasValid = false;

    marks.forEach((m, i) => {
      const mark = parseFloat(m.value);
      const cr = parseFloat(credits[i]?.value);
      if (!isNaN(mark) && !isNaN(cr) && cr > 0 && mark >= 0 && mark <= 100) {
        totalPoints += getGP(mark) * cr;
        totalCredits += cr;
        validSubjects++; hasValid = true;
      }
    });

    if (!hasValid) {
      showResultMessage('gpaResult', '<p> Please enter valid marks (0-100) and credits for at least one subject.</p>', true);
      return;
    }

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    const resultHtml = `
      <div style="text-align:center;">
        <p><strong> Your GPA: ${gpa.toFixed(2)}</strong></p>
        <p><strong> Grade: ${getGrade(gpa)}</strong></p>
        <p><strong> Total Credits: ${totalCredits.toFixed(1)}</strong></p>
        <p><strong> Valid Subjects: ${validSubjects}</strong></p>
        <hr style="margin:1rem 0;border:none;height:1px;background:rgba(255,255,255,0.3);">
        <p>${getMotivationalMessage(gpa)}</p>
      </div>`;
    showResultMessage('gpaResult', resultHtml);
    displayManager?.updateDisplay();
  }
  getLiveGPA() {
    const marks = document.querySelectorAll('#subjectsContainer .subject-marks');
    const credits = document.querySelectorAll('#subjectsContainer .subject-credits');
    let totalPoints = 0, totalCredits = 0;
    marks.forEach((m, i) => {
      const mark = parseFloat(m.value);
      const cr = parseFloat(credits[i]?.value || 0);
      if (!isNaN(mark) && !isNaN(cr) && cr > 0 && mark >= 0 && mark <= 100) {
        totalPoints += getGP(mark) * cr;
        totalCredits += cr;
      }
    });
    return { gpa: totalCredits > 0 ? totalPoints / totalCredits : 0, credits: totalCredits };
  }
}

// ===== CGPA =====
class CGPACalculator {
  constructor() { this.init(); }
  init() {
    document.getElementById('generateSemestersBtn')?.addEventListener('click', () => this.generateSemesters());
  }
  generateSemesters() {
    const count = parseInt(document.getElementById('semesterCount')?.value);
    const container = document.getElementById('semestersContainer');
    if (!container) return;

    if (!count || count < 1 || count > 10) {
      showResultMessage('cgpaResult', '<p> Please enter a valid number of semesters (1-10).</p>', true);
      return;
    }

    let html = `
      <div class="option-note">Choose Appropriate Option: If you already know the GPA of a specific semester, use the first option. Otherwise, calculate it using individual subject marks.</div>
      ${Array.from({length: count}).map((_, i) => {
        const n = i + 1;
        return `
        <div class="semester-card">
          <div class="card-header">
            <div class="card-title"><div class="card-number">${n}</div>Semester ${n}</div>
          </div>

          <div class="radio-group">
            <label class="radio-option"><input type="radio" name="sem${n}Type" value="direct" checked/> <span>Enter GPA Directly</span></label>
            <label class="radio-option"><input type="radio" name="sem${n}Type" value="subjects"/> <span>Calculate from Marks</span></label>
          </div>

          <div class="semester-direct" id="sem${n}Direct">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Semester GPA</label>
                <input type="number" class="semester-gpa" min="0" max="4" step="0.01"/>
              </div>
              <div class="form-group">
                <label class="form-label">Credit Hours</label>
                <input type="number" class="semester-credits" min="0.5" step="0.1"/>
              </div>
            </div>
          </div>

          <div class="semester-subjects" id="sem${n}Subjects" style="display:none;">
            <div class="form-group">
              <label class="form-label">Number of Subjects</label>
              <input type="number" class="subject-count" min="1" max="15"/>
            </div>
            <button type="button" class="btn btn-secondary" data-gen-subjects="${n}"><span></span> Generate Subject Fields</button>
            <div class="semester-subjects-container"></div>
          </div>
        </div>`;
      }).join('')}
      <button class="btn btn-primary" style="margin-top:1.5rem;" id="calculateCGPABtn"><span></span> Calculate CGPA</button>
    `;
    container.innerHTML = html;

    // radio toggle
    container.querySelectorAll('input[type="radio"]').forEach(r => {
      r.addEventListener('change', (e) => {
        const semNum = e.target.name.replace('sem','').replace('Type','');
        const direct = document.getElementById(`sem${semNum}Direct`);
        const subs = document.getElementById(`sem${semNum}Subjects`);
        if (e.target.value === 'direct') { direct.style.display='block'; subs.style.display='none'; }
        else { direct.style.display='none'; subs.style.display='block'; }
        displayManager?.updateDisplay();
      });
    });

    // calc button
    document.getElementById('calculateCGPABtn')?.addEventListener('click', () => this.calculateCGPA());

    displayManager?.updateDisplay();
  }
  generateSemesterSubjects(semesterNum) {
    const count = parseInt(document.querySelector(`#sem${semesterNum}Subjects .subject-count`)?.value);
    const container = document.querySelector(`#sem${semesterNum}Subjects .semester-subjects-container`);
    if (!container) return;

    if (!count || count < 1 || count > 15) {
      container.innerHTML = '<p style="color: var(--error); text-align:center; padding:1rem;"> Please enter a valid number of subjects (1-15).</p>';
      return;
    }

    let html = `
      <div class="table-container" style="margin-top:1rem;">
        <table class="data-table">
          <thead><tr><th>Subject Name</th><th>Marks (%)</th><th>Credit Hours</th></tr></thead>
          <tbody>
            ${Array.from({length: count}).map(() => `
              <tr>
                <td><input type="text" class="subject-name" placeholder=" Optional"/></td>
                <td><input type="number" class="subject-marks" min="0" max="100" step="0.1"/></td>
                <td><input type="number" class="subject-credits" min="0.5" max="10" step="0.1"/></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;
    container.innerHTML = html;

    displayManager?.updateDisplay();
  }
  calculateCGPA() {
    const semesterCards = document.querySelectorAll('.semester-card');
    let totalPoints = 0, totalCredits = 0, validSemesters = 0, hasValid = false;

    semesterCards.forEach((card, idx) => {
      const semNum = idx + 1;
      const selected = card.querySelector(`input[name="sem${semNum}Type"]:checked`);
      if (!selected) return;

      if (selected.value === 'direct') {
        const gpa = parseFloat(card.querySelector('.semester-gpa')?.value);
        const credits = parseFloat(card.querySelector('.semester-credits')?.value);
        if (!isNaN(gpa) && !isNaN(credits) && credits > 0 && gpa >= 0 && gpa <= 4) {
          totalPoints += gpa * credits;
          totalCredits += credits;
          validSemesters++; hasValid = true;
        }
      } else {
        const marks = card.querySelectorAll('.subject-marks');
        const credits = card.querySelectorAll('.subject-credits');
        let semPts = 0, semCrs = 0, used = false;
        marks.forEach((m,i) => {
          const mk = parseFloat(m.value);
          const cr = parseFloat(credits[i]?.value || 0);
          if (!isNaN(mk) && !isNaN(cr) && cr > 0 && mk >= 0 && mk <= 100) {
            semPts += getGP(mk) * cr;
            semCrs += cr; used = true;
          }
        });
        if (used && semCrs > 0) {
          totalPoints += semPts;
          totalCredits += semCrs;
          validSemesters++; hasValid = true;
        }
      }
    });

    if (!hasValid) {
      showResultMessage('cgpaResult', '<p> Please enter valid data for at least one semester.</p>', true);
      return;
    }

    const cgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    const resultHtml = `
      <div style="text-align:center;">
        <p><strong>🎓 Your CGPA: ${cgpa.toFixed(2)}</strong></p>
        <p><strong>📊 Grade: ${getGrade(cgpa)}</strong></p>
        <p><strong>📚 Total Credits: ${totalCredits.toFixed(1)}</strong></p>
        <p><strong>📅 Valid Semesters: ${validSemesters}</strong></p>
        <hr style="margin:1rem 0;border:none;height:1px;background:rgba(255,255,255,0.3);">
        <p>${getMotivationalMessage(cgpa)}</p>
      </div>`;
    showResultMessage('cgpaResult', resultHtml);
    displayManager?.updateDisplay();
  }
  getLiveCGPA() {
    const semesterCards = document.querySelectorAll('.semester-card');
    let totalPoints = 0, totalCredits = 0;
    semesterCards.forEach((card, idx) => {
      const semNum = idx + 1;
      const selected = card.querySelector(`input[name="sem${semNum}Type"]:checked`);
      if (!selected) return;

      if (selected.value === 'direct') {
        const gpa = parseFloat(card.querySelector('.semester-gpa')?.value);
        const credits = parseFloat(card.querySelector('.semester-credits')?.value);
        if (!isNaN(gpa) && !isNaN(credits) && credits > 0 && gpa >= 0 && gpa <= 4) {
          totalPoints += gpa * credits;
          totalCredits += credits;
        }
      } else {
        const marks = card.querySelectorAll('.subject-marks');
        const credits = card.querySelectorAll('.subject-credits');
        marks.forEach((m,i) => {
          const mk = parseFloat(m.value);
          const cr = parseFloat(credits[i]?.value || 0);
          if (!isNaN(mk) && !isNaN(cr) && cr > 0 && mk >= 0 && mk <= 100) {
            totalPoints += getGP(mk) * cr;
            totalCredits += cr;
          }
        });
      }
    });
    return { cgpa: totalCredits > 0 ? totalPoints / totalCredits : 0, semesters: semesterCards.length };
  }
}

// ===== DISPLAY =====
class DisplayManager {
  constructor(pageType) { this.pageType = pageType; this.init(); }
  init() {
    const titleEl = document.getElementById('resultTitle');
    const labelEl = document.getElementById('progressLabel');
    const auxLabel = document.getElementById('auxLabel');
    if (titleEl) titleEl.textContent = this.pageType === 'gpa' ? 'Your GPA' : 'Your CGPA';
    if (labelEl) labelEl.textContent = this.pageType.toUpperCase();
    if (auxLabel) auxLabel.textContent = this.pageType === 'gpa' ? 'Credits' : 'Semesters';
    this.updateDisplay();
  }
  updateDisplay() {
    let value = 0, auxiliary = 0;
    if (this.pageType === 'gpa' && window.gpaCalculator) {
      const r = window.gpaCalculator.getLiveGPA(); value = r.gpa; auxiliary = r.credits;
    } else if (this.pageType === 'cgpa' && window.cgpaCalculator) {
      const r = window.cgpaCalculator.getLiveCGPA(); value = r.cgpa; auxiliary = r.semesters;
    }
    this.updateProgressRing(value);
    const pv = document.getElementById('progressValue');
    const sv = document.getElementById('statValue');
    const av = document.getElementById('auxValue');
    const gv = document.getElementById('gradeValue');
    if (pv) pv.textContent = value.toFixed(2);
    if (sv) sv.textContent = value.toFixed(2);
    if (av) av.textContent = (this.pageType === 'gpa' ? auxiliary : Math.round(auxiliary)).toString();
    if (gv) gv.textContent = value > 0 ? getGrade(value) : '-';
  }
  updateProgressRing(value) {
    const maxValue = 4.0;
    const percentage = Math.min(Math.max(value / maxValue, 0), 1);
    const circumference = 2 * Math.PI * 90;
    const offset = circumference - (percentage * circumference);
    const ring = document.getElementById('progressRingFill');
    if (ring) ring.style.strokeDashoffset = offset;
  }
}

// ===== ACTIONS =====
class ActionManager {
  constructor(pageType) { this.pageType = pageType; this.init(); }
  init() {
    document.getElementById('copyBtn')?.addEventListener('click', () => this.copyResult());
    document.getElementById('exportBtn')?.addEventListener('click', () => this.exportResult());
    document.getElementById('resetBtn')?.addEventListener('click', () => this.resetAll());
  }
  copyResult() {
    const value = document.getElementById('progressValue')?.textContent || '0.00';
    const auxiliary = document.getElementById('auxValue')?.textContent || '0';
    const grade = document.getElementById('gradeValue')?.textContent || '-';
    const type = this.pageType.toUpperCase();
    const auxType = this.pageType === 'gpa' ? 'Credits' : 'Semesters';
    const text = `PUCIT ${type} Calculator Result
${type}: ${value}
Grade: ${grade}
${auxType}: ${auxiliary}
Date: ${new Date().toLocaleDateString()}`;
    navigator.clipboard.writeText(text).then(
      () => showNotification('Result copied to clipboard!'),
      () => showNotification('❌ Failed to copy result', 'error')
    );
  }
  exportResult() {
    const value = document.getElementById('progressValue')?.textContent || '0.00';
    const auxiliary = document.getElementById('auxValue')?.textContent || '0';
    const grade = document.getElementById('gradeValue')?.textContent || '-';
    const type = this.pageType.toUpperCase();
    const auxType = this.pageType === 'gpa' ? 'Credits' : 'Semesters';
    const exportData = `PUCIT ${type} CALCULATOR REPORT
============================

${type}: ${value}
Grade: ${grade}
${auxType}: ${auxiliary}
Calculation Date: ${new Date().toLocaleDateString()}
Calculation Time: ${new Date().toLocaleTimeString()}

Generated by PUCIT ${type} Calculator
© 2025 Mutahhar Bhutta`.trim();
    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {
      href: url,
      download: `PUCIT_${type}_Report_${new Date().toISOString().split('T')[0]}.txt`
    });
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    showNotification('Report exported successfully!');
  }
  resetAll() {
    if (!confirm('Are you sure you want to reset all data? This action cannot be undone.')) return;
    if (this.pageType === 'gpa') {
      document.getElementById('subjectCount').value = '';
      document.getElementById('subjectsContainer').innerHTML = '';
      document.getElementById('gpaResult')?.classList.remove('show');
    } else {
      document.getElementById('semesterCount').value = '';
      document.getElementById('semestersContainer').innerHTML = '';
      document.getElementById('cgpaResult')?.classList.remove('show');
    }
    displayManager?.updateDisplay();
    showNotification('All data has been reset');
  }
}

// ===== GLOBAL INIT =====
let themeManager, gpaCalculator, cgpaCalculator, displayManager, actionManager;

document.addEventListener('DOMContentLoaded', () => {
  const pageType = (document.body.dataset.page || 'gpa').toLowerCase();

  themeManager = new ThemeManager();

  if (pageType === 'gpa') {
    gpaCalculator = new GPACalculator();
    window.gpaCalculator = gpaCalculator; // expose for live reads
  } else {
    cgpaCalculator = new CGPACalculator();
    window.cgpaCalculator = cgpaCalculator; // expose for live reads & inline generation
  }

  displayManager = new DisplayManager(pageType);
  actionManager = new ActionManager(pageType);

  // ---- KEYBOARD SHORTCUTS ----
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'c' && document.activeElement?.id === 'copyBtn') {
      e.preventDefault(); actionManager.copyResult();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
      e.preventDefault(); actionManager.resetAll();
    }
    if (e.key === 'Enter' && e.target.matches('#subjectCount, #semesterCount')) {
      e.preventDefault();
      (pageType === 'gpa'
        ? document.getElementById('generateSubjectsBtn')
        : document.getElementById('generateSemestersBtn')
      )?.click();
    }
  });

  // ---- UNIVERSAL LIVE UPDATE (EVENT DELEGATION) ----
  // Any future input that affects math will trigger a refresh automatically.
  document.addEventListener('input', (e) => {
    if (e.target.matches(
      '.subject-marks, .subject-credits, .semester-gpa, .semester-credits, .subject-count'
    )) {
      // If they switch a subject-count, don’t recompute here (no data yet), but refreshing is harmless.
      displayManager?.updateDisplay();
    }
  });

  // ---- Delegated click for generating subjects inside each semester ----
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-gen-subjects]');
    if (btn && window.cgpaCalculator) {
      const semNum = parseInt(btn.getAttribute('data-gen-subjects'));
      window.cgpaCalculator.generateSemesterSubjects(semNum);
    }
  });

  // Buttons loading micro-UX
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function () {
      if (!this.classList.contains('loading')) {
        this.classList.add('loading');
        setTimeout(() => this.classList.remove('loading'), 500);
      }
    });
  });

  // Tooltips
  [
    { sel: '#themeBtn', txt: 'Switch between color themes' },
    { sel: '#modeToggle', txt: 'Toggle dark/light mode' },
    { sel: '#exportBtn', txt: 'Export result as text file' },
    { sel: '#resetBtn', txt: 'Reset all data (Ctrl+R)' }
  ].forEach(({ sel, txt }) => {
    const el = document.querySelector(sel);
    if (el) el.title = txt;
  });
});

// Errors & SW
window.addEventListener('error', e => {
  console.error('Application Error:', e.error);
  showNotification('An error occurred. Please refresh the page.', 'error');
});
window.addEventListener('unhandledrejection', e => {
  console.error('Unhandled Promise Rejection:', e.reason);
  showNotification('An error occurred. Please try again.', 'error');
});
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err =>
      console.log('SW registration failed:', err)
    );
  });
}
