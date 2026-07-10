/**
 * ReBorn – Application Logic
 * Navigation, Page transitions, Component interactions
 */

'use strict';

/* ── State ───────────────────────────────────────────────── */
const state = {
  currentPage: 'splash',
  user: {
    name: 'Alex',
    streak: 7,
    xp: 2340,
    level: 5,
    xpToNext: 3000,
    mood: null,
    goals: [],
  },
  pomodoro: {
    phase: 'work',    // 'work' | 'break'
    seconds: 25 * 60,
    running: false,
    interval: null,
    sessions: 0,
  },
  habits: [
    { id: 1, name: 'Morning Run',      emoji: '🏃', done: false, streak: 12, bg: 'rgba(190,239,216,0.4)' },
    { id: 2, name: 'Meditate',         emoji: '🧘', done: true,  streak: 7,  bg: 'rgba(207,232,255,0.5)' },
    { id: 3, name: 'Read 30 min',      emoji: '📚', done: false, streak: 4,  bg: 'rgba(253,186,116,0.25)' },
    { id: 4, name: 'Drink 8 glasses',  emoji: '💧', done: true,  streak: 21, bg: 'rgba(196,181,253,0.3)' },
    { id: 5, name: 'Sleep by 11pm',    emoji: '🌙', done: false, streak: 3,  bg: 'rgba(190,239,216,0.3)' },
  ],
  water: 5,         // out of 8
  missions: [
    { id: 1, title: 'Morning Warrior',   emoji: '☀️', xp: 50,  done: false, cat: 'health',  progress: 60 },
    { id: 2, title: 'Deep Work Block',   emoji: '🧠', xp: 100, done: false, cat: 'study',   progress: 45 },
    { id: 3, title: 'Gratitude Entry',   emoji: '📝', xp: 30,  done: true,  cat: 'journal', progress: 100 },
    { id: 4, title: 'Hydration Hero',    emoji: '💧', xp: 20,  done: true,  cat: 'health',  progress: 100 },
    { id: 5, title: 'New Skill Started', emoji: '🎯', xp: 75,  done: false, cat: 'study',   progress: 20 },
  ],
  journalEntries: [
    {
      id: 1,
      date: 'Today, July 11',
      title: 'Starting Fresh ✨',
      preview: 'Today I woke up with a clear mind. The morning run felt incredible — my lungs were burning but my mind was at peace...',
      mood: '😊',
      tags: ['motivation', 'morning'],
    },
    {
      id: 2,
      date: 'Yesterday, July 10',
      title: 'Small Wins Matter 🏆',
      preview: 'Completed my pomodoro sessions without any distractions. The library was quiet and I got through 3 chapters...',
      mood: '🔥',
      tags: ['study', 'focus'],
    },
    {
      id: 3,
      date: 'July 9',
      title: 'Feeling Grateful 🙏',
      preview: 'Sometimes I forget how far I\'ve come. Looking back 6 months ago — wow. The person I am today is someone I\'d have admired...',
      mood: '🥹',
      tags: ['gratitude', 'reflection'],
    },
  ],
  subjects: [
    { id: 1, name: 'Mathematics',     emoji: '📐', color: '#A78BFA', hours: 12.5, target: 20, progress: 62 },
    { id: 2, name: 'Computer Science', emoji: '💻', color: '#60A5FA', hours: 18,   target: 25, progress: 72 },
    { id: 3, name: 'Physics',          emoji: '⚛️', color: '#34D399', hours: 8,    target: 15, progress: 53 },
    { id: 4, name: 'Literature',       emoji: '📖', color: '#FDBA74', hours: 5,    target: 10, progress: 50 },
  ],
  goals: [
    { id: 'fitness',  name: 'Get Fit',         emoji: '💪', desc: 'Build strength & healthy habits' },
    { id: 'study',    name: 'Ace My Studies',   emoji: '🎓', desc: 'Improve grades & focus' },
    { id: 'mind',     name: 'Mental Clarity',   emoji: '🧘', desc: 'Reduce stress & build mindfulness' },
    { id: 'career',   name: 'Career Growth',    emoji: '🚀', desc: 'Build skills & portfolio' },
    { id: 'social',   name: 'Better Socials',   emoji: '🤝', desc: 'Improve relationships & confidence' },
    { id: 'finances', name: 'Financial Health', emoji: '💰', desc: 'Save money & build discipline' },
  ],
  selectedGoals: [],
  blueprintStep: 1,
  selectedMood: null,
};

/* ── Router ──────────────────────────────────────────────── */
function navigate(pageId, options = {}) {
  const prev = document.getElementById(`page-${state.currentPage}`);
  const next = document.getElementById(`page-${pageId}`);
  if (!next) return;

  // Hide previous
  if (prev) {
    prev.classList.remove('active');
  }

  // Show next
  next.style.animation = 'none';
  next.classList.add('active');
  setTimeout(() => {
    next.style.animation = '';
  }, 10);

  state.currentPage = pageId;

  // Nav visibility
  const noNavPages = ['splash', 'login', 'signup', 'blueprint'];
  const nav = document.getElementById('bottom-nav');
  if (noNavPages.includes(pageId)) {
    nav.classList.add('hidden');
  } else {
    nav.classList.remove('hidden');
    updateNavActive(pageId);
  }

  // Scroll to top
  next.scrollTop = 0;

  // Page-specific init
  const inits = {
    dashboard: initDashboard,
    journal:   initJournal,
    study:     initStudy,
    health:    initHealth,
    profile:   initProfile,
    blueprint: initBlueprint,
  };
  if (inits[pageId]) inits[pageId]();
}

function updateNavActive(pageId) {
  const map = { dashboard: 'home', missions: 'missions', study: 'study', health: 'wellness', profile: 'profile' };
  const navId = map[pageId] || pageId;
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.nav === navId);
  });
}

/* ── Toast ───────────────────────────────────────────────── */
function showToast(msg, duration = 2500) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), duration);
}

/* ── Blueprint ───────────────────────────────────────────── */
function initBlueprint() {
  state.blueprintStep = 1;
  state.selectedGoals = [];
  renderBlueprintStep();
}

function renderBlueprintStep() {
  document.querySelectorAll('.blueprint-step').forEach((el, i) => {
    el.classList.toggle('active', i + 1 === state.blueprintStep);
  });
  // Update step dots
  document.querySelectorAll('.step-dot').forEach((dot, i) => {
    dot.classList.remove('active', 'done');
    if (i + 1 === state.blueprintStep) dot.classList.add('active');
    else if (i + 1 < state.blueprintStep) dot.classList.add('done');
  });
}

function blueprintNext() {
  if (state.blueprintStep === 1 && state.selectedGoals.length === 0) {
    showToast('Please select at least one goal 🎯');
    return;
  }
  if (state.blueprintStep < 3) {
    state.blueprintStep++;
    renderBlueprintStep();
  } else {
    // Complete onboarding
    navigate('dashboard');
    showToast('Your ReBorn journey begins! 🚀✨');
  }
}

function blueprintBack() {
  if (state.blueprintStep > 1) {
    state.blueprintStep--;
    renderBlueprintStep();
  }
}

function toggleGoal(goalId) {
  const idx = state.selectedGoals.indexOf(goalId);
  if (idx >= 0) {
    state.selectedGoals.splice(idx, 1);
  } else {
    state.selectedGoals.push(goalId);
  }
  document.querySelectorAll('.goal-option').forEach(el => {
    const selected = state.selectedGoals.includes(el.dataset.goal);
    el.classList.toggle('selected', selected);
    const check = el.querySelector('.goal-check');
    if (check) {
      check.innerHTML = selected
        ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" width="10" height="10"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>`
        : '';
    }
  });
}

/* ── Dashboard ───────────────────────────────────────────── */
function initDashboard() {
  renderDashboardMissions();
  renderDashboardXP();
}

function renderDashboardMissions() {
  const wrap = document.getElementById('dash-missions-scroll');
  if (!wrap) return;
  const active = state.missions.filter(m => !m.done);
  wrap.innerHTML = active.map(m => `
    <div class="mission-mini-card" onclick="navigate('missions')">
      <div class="mission-mini-emoji">${m.emoji}</div>
      <div class="mission-mini-title">${m.title}</div>
      <div class="mission-mini-progress">${m.progress}% done</div>
      <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:${m.progress}%"></div></div>
    </div>
  `).join('');
}

function renderDashboardXP() {
  const pct = Math.round((state.user.xp / state.user.xpToNext) * 100);
  const xpFill = document.getElementById('dash-xp-fill');
  const xpLabel = document.getElementById('dash-xp-label');
  if (xpFill) xpFill.style.width = `${pct}%`;
  if (xpLabel) xpLabel.textContent = `${state.user.xp} / ${state.user.xpToNext} XP`;
}

/* ── Missions (dedicated page) ───────────────────────────── */
function initMissions() {
  renderMissionsList();
}

function renderMissionsList() {
  const wrap = document.getElementById('missions-list');
  if (!wrap) return;
  wrap.innerHTML = state.missions.map(m => `
    <div class="mission-card ${m.done ? 'completed' : ''}" onclick="completeMission(${m.id})">
      <div class="mission-icon-box" style="background:${getMissionBg(m.cat)}">${m.emoji}</div>
      <div class="mission-info">
        <div class="mission-title">${m.title}</div>
        <div class="mission-sub">${m.done ? 'Completed! 🎉' : m.progress + '% complete'}</div>
        ${!m.done ? `<div class="progress-bar-wrap mt-2" style="width:100%"><div class="progress-bar-fill" style="width:${m.progress}%"></div></div>` : ''}
      </div>
      <span class="mission-xp">+${m.xp}XP</span>
    </div>
  `).join('');
}

function getMissionBg(cat) {
  const map = {
    health:  'rgba(190,239,216,0.5)',
    study:   'rgba(207,232,255,0.6)',
    journal: 'rgba(196,181,253,0.4)',
  };
  return map[cat] || 'rgba(167,139,250,0.2)';
}

function completeMission(id) {
  const m = state.missions.find(x => x.id === id);
  if (!m || m.done) return;
  m.done = true;
  m.progress = 100;
  state.user.xp += m.xp;
  renderMissionsList();
  renderDashboardXP();
  showToast(`Mission complete! +${m.xp} XP 🎉`);
}

/* ── Journal ─────────────────────────────────────────────── */
function initJournal() {
  renderJournalEntries();
  renderMoodSelector();
}

function renderMoodSelector() {
  const wrap = document.getElementById('mood-selector');
  if (!wrap) return;
  const moods = [
    { emoji: '😔', label: 'Low' },
    { emoji: '😐', label: 'Meh' },
    { emoji: '🙂', label: 'Okay' },
    { emoji: '😊', label: 'Good' },
    { emoji: '🤩', label: 'Great' },
  ];
  wrap.innerHTML = moods.map((m, i) => `
    <button class="mood-btn ${state.selectedMood === i ? 'selected' : ''}"
            onclick="selectMood(${i})" aria-label="${m.label}">
      <span class="mood-emoji">${m.emoji}</span>
      <span class="mood-label">${m.label}</span>
    </button>
  `).join('');
}

function selectMood(idx) {
  state.selectedMood = state.selectedMood === idx ? null : idx;
  renderMoodSelector();
}

function renderJournalEntries() {
  const wrap = document.getElementById('journal-entries');
  if (!wrap) return;
  wrap.innerHTML = state.journalEntries.map(e => `
    <div class="journal-entry-card">
      <div class="flex-between mb-2">
        <div class="journal-entry-date">${e.date}</div>
        <span>${e.mood}</span>
      </div>
      <div class="journal-entry-title">${e.title}</div>
      <div class="journal-entry-preview">${e.preview}</div>
      <div class="chip-group mt-3">
        ${e.tags.map(t => `<span class="badge badge-primary">${t}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

function saveJournalEntry() {
  const input = document.getElementById('journal-new-text');
  if (!input || !input.value.trim()) {
    showToast('Write something first! ✍️');
    return;
  }
  const entry = {
    id: Date.now(),
    date: 'Just now',
    title: 'New Entry 📝',
    preview: input.value.trim(),
    mood: state.selectedMood !== null ? ['😔','😐','🙂','😊','🤩'][state.selectedMood] : '🙂',
    tags: ['new'],
  };
  state.journalEntries.unshift(entry);
  input.value = '';
  state.user.xp += 20;
  renderJournalEntries();
  renderDashboardXP();
  showToast('Entry saved! +20 XP 📝');
}

/* ── Study / Pomodoro ────────────────────────────────────── */
function initStudy() {
  renderPomodoro();
  renderSubjects();
}

function renderPomodoro() {
  updatePomodoroDisplay();
}

function updatePomodoroDisplay() {
  const el = document.getElementById('pomodoro-timer');
  if (!el) return;
  const m = Math.floor(state.pomodoro.seconds / 60).toString().padStart(2, '0');
  const s = (state.pomodoro.seconds % 60).toString().padStart(2, '0');
  el.textContent = `${m}:${s}`;

  // SVG ring
  const ring = document.getElementById('pomodoro-ring-fill');
  if (ring) {
    const total = state.pomodoro.phase === 'work' ? 25 * 60 : 5 * 60;
    const progress = 1 - (state.pomodoro.seconds / total);
    const circumference = 2 * Math.PI * 80;
    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = circumference * (1 - progress);
  }

  const phaseEl = document.getElementById('pomodoro-phase-label');
  if (phaseEl) phaseEl.textContent = state.pomodoro.phase === 'work' ? 'FOCUS TIME' : 'BREAK TIME';

  const phaseSub = document.getElementById('pomodoro-phase-sub');
  if (phaseSub) phaseSub.textContent = state.pomodoro.phase === 'work' ? 'Focus' : 'Rest';
}

function togglePomodoro() {
  if (state.pomodoro.running) {
    clearInterval(state.pomodoro.interval);
    state.pomodoro.running = false;
  } else {
    state.pomodoro.running = true;
    state.pomodoro.interval = setInterval(() => {
      state.pomodoro.seconds--;
      if (state.pomodoro.seconds <= 0) {
        clearInterval(state.pomodoro.interval);
        state.pomodoro.running = false;
        pomodoroPhaseComplete();
      }
      updatePomodoroDisplay();
    }, 1000);
  }
  const btn = document.getElementById('pomodoro-play-btn');
  if (btn) btn.innerHTML = state.pomodoro.running ? pauseIcon() : playIcon();
}

function pomodoroPhaseComplete() {
  if (state.pomodoro.phase === 'work') {
    state.pomodoro.sessions++;
    state.user.xp += 50;
    state.pomodoro.phase = 'break';
    state.pomodoro.seconds = 5 * 60;
    showToast(`Focus session done! +50 XP 🧠 Take a 5 min break.`);
  } else {
    state.pomodoro.phase = 'work';
    state.pomodoro.seconds = 25 * 60;
    showToast('Break over! Time to focus again 🚀');
  }
  updatePomodoroDisplay();
  renderDashboardXP();

  const sessEl = document.getElementById('pomodoro-sessions');
  if (sessEl) sessEl.textContent = state.pomodoro.sessions;
}

function resetPomodoro() {
  clearInterval(state.pomodoro.interval);
  state.pomodoro.running = false;
  state.pomodoro.phase = 'work';
  state.pomodoro.seconds = 25 * 60;
  updatePomodoroDisplay();
  const btn = document.getElementById('pomodoro-play-btn');
  if (btn) btn.innerHTML = playIcon();
}

function playIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M8 5v14l11-7z"/></svg>`;
}
function pauseIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
}

function renderSubjects() {
  const wrap = document.getElementById('subjects-list');
  if (!wrap) return;
  wrap.innerHTML = state.subjects.map(s => `
    <div class="subject-card">
      <div class="subject-color-dot" style="background:${s.color}"></div>
      <div class="subject-info">
        <div class="subject-name">${s.emoji} ${s.name}</div>
        <div class="subject-hours">${s.hours}h / ${s.target}h this week</div>
        <div class="progress-bar-wrap mt-2" style="width:100%">
          <div class="progress-bar-fill" style="width:${s.progress}%; background: linear-gradient(90deg, ${s.color}, ${s.color}bb)"></div>
        </div>
      </div>
      <div class="subject-progress">${s.progress}%</div>
    </div>
  `).join('');
}

/* ── Health ──────────────────────────────────────────────── */
function initHealth() {
  renderHabits();
  renderWaterTracker();
  renderHealthRings();
}

function renderHabits() {
  const wrap = document.getElementById('habits-list');
  if (!wrap) return;
  wrap.innerHTML = state.habits.map(h => `
    <div class="habit-card ${h.done ? 'done' : ''}" id="habit-${h.id}">
      <div class="habit-icon-wrap" style="background:${h.bg}">${h.emoji}</div>
      <div class="habit-info">
        <div class="habit-name">${h.name}</div>
        <div class="habit-streak">🔥 ${h.streak} day streak</div>
      </div>
      <div class="habit-check ${h.done ? 'done' : ''}" onclick="toggleHabit(${h.id})">
        ${h.done ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>` : ''}
      </div>
    </div>
  `).join('');
}

function toggleHabit(id) {
  const h = state.habits.find(x => x.id === id);
  if (!h) return;
  h.done = !h.done;
  if (h.done) {
    h.streak++;
    state.user.xp += 15;
    showToast(`${h.emoji} Habit done! +15 XP`);
  }
  renderHabits();
  renderDashboardXP();
}

function renderWaterTracker() {
  const wrap = document.getElementById('water-tracker');
  if (!wrap) return;
  wrap.innerHTML = Array.from({ length: 8 }, (_, i) => `
    <span class="water-drop ${i < state.water ? 'filled' : ''}"
          onclick="setWater(${i + 1})" title="Glass ${i + 1}">💧</span>
  `).join('');
}

function setWater(count) {
  const prev = state.water;
  state.water = count;
  if (count > prev) {
    state.user.xp += 5 * (count - prev);
    showToast(`💧 ${count}/8 glasses! Keep it up!`);
  }
  renderWaterTracker();
  renderHealthRings();
  renderDashboardXP();
}

function renderHealthRings() {
  // Steps ring
  drawRing('steps-ring', 7842, 10000, '#34D399');
  // Sleep ring
  drawRing('sleep-ring', 7.5, 8, '#A78BFA');
  // Active ring
  drawRing('active-ring', 38, 60, '#FDBA74');

  const stepsVal = document.getElementById('steps-val');
  const sleepVal = document.getElementById('sleep-val');
  const activeVal = document.getElementById('active-val');
  if (stepsVal) stepsVal.textContent = '7,842';
  if (sleepVal) sleepVal.textContent = '7.5h';
  if (activeVal) activeVal.textContent = '38m';
}

function drawRing(id, value, max, color) {
  const svg = document.getElementById(id);
  if (!svg) return;
  const r = 36;
  const cx = 44; const cy = 44;
  const circumference = 2 * Math.PI * r;
  const progress = Math.min(value / max, 1);
  svg.innerHTML = `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#EDE9F6" stroke-width="8"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="8"
            stroke-linecap="round"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${circumference * (1 - progress)}"
            transform="rotate(-90 ${cx} ${cy})"
            style="transition: stroke-dashoffset 0.8s cubic-bezier(0.34,1.56,0.64,1)"/>
  `;
}

/* ── Profile ─────────────────────────────────────────────── */
function initProfile() {
  const levelEl = document.getElementById('profile-level');
  const xpEl    = document.getElementById('profile-xp');
  const xpFill  = document.getElementById('profile-xp-fill');
  if (levelEl) levelEl.textContent = state.user.level;
  if (xpEl) xpEl.textContent = `${state.user.xp} XP`;
  const pct = Math.round((state.user.xp / state.user.xpToNext) * 100);
  if (xpFill) xpFill.style.width = `${pct}%`;
}

/* ── Sidebar/Misc helpers ────────────────────────────────── */
function goBack(pageId) {
  navigate(pageId || 'dashboard');
}

/* ── Boot ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Show splash for 2.5s then allow interaction
  setTimeout(() => {
    const skipBtn = document.getElementById('splash-skip');
    if (skipBtn) skipBtn.style.opacity = '1';
  }, 1500);

  // Init missions page
  initMissions();

  // Bottom nav clicks
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const navId = item.dataset.nav;
      const pageMap = { home: 'dashboard', missions: 'missions', study: 'study', wellness: 'health', profile: 'profile' };
      navigate(pageMap[navId] || navId);
    });
  });

  // Touch ripple effect on buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn, .mission-card, .habit-card');
    if (!btn) return;
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute; border-radius: 50%;
      width: 4px; height: 4px;
      background: rgba(255,255,255,0.5);
      pointer-events: none;
      animation: ripple 0.5s ease-out both;
      left: ${e.clientX - btn.getBoundingClientRect().left}px;
      top: ${e.clientY - btn.getBoundingClientRect().top}px;
    `;
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Ripple keyframe (add dynamically)
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    from { width: 4px; height: 4px; opacity: 0.8; transform: translate(-50%,-50%) scale(1); }
    to   { width: 200px; height: 200px; opacity: 0; transform: translate(-50%,-50%) scale(1); }
  }
`;
document.head.appendChild(style);
