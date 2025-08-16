// ===== Study Timer (HTML/CSS/JS) — Codeboid edition =====
let total = 25 * 60;     // total seconds
let remaining = total;   // seconds left
let tick = null;         // interval id
let running = false;     // is the timer running?

// Elements
const elTime = document.getElementById('timer');
const elBar = document.getElementById('bar');
const elStart = document.getElementById('start');
const elPause = document.getElementById('pause');
const elReset = document.getElementById('reset');
const elMin = document.getElementById('minutes');
const elApply = document.getElementById('apply');
const elDing = document.getElementById('ding');
const elErr = document.getElementById('error');

// Helpers
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const fmt = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${m}:${ss}`;
};
const draw = () => {
    elTime.textContent = fmt(remaining);
    const pct = total ? (1 - remaining / total) * 100 : 0;
    elBar.style.width = `${clamp(pct, 0, 100)}%`;
};
const setButtons = () => {
    elStart.disabled = running;
    elPause.disabled = !running;
    elReset.disabled = !running && remaining === total;
};

// Core actions
function start() {
    if (running) return;
    running = true;
    setButtons();
    tick = setInterval(() => {
        if (remaining > 0) {
            remaining--;
            draw();
        } else {
            stop();
            // Friendly finish
            try { elDing.play(); } catch { }
            alert("Time's up! 🎉 Take a short break.");
        }
    }, 1000);
}

function stop() {
    running = false;
    clearInterval(tick);
    tick = null;
    setButtons();
}

function reset() {
    stop();
    remaining = total;
    draw();
    setButtons();
}

// Validate minutes input (1–180)
function applyMinutes() {
    const raw = parseInt(elMin.value || '25', 10);
    const mins = clamp(isNaN(raw) ? 25 : raw, 1, 180);

    // Show friendly messages for out-of-range
    if (raw < 1) elErr.textContent = 'Minimum is 1 minute.';
    else if (raw > 180) elErr.textContent = 'That’s a long session! Please enter ≤ 180 minutes.';
    else elErr.textContent = '';

    total = mins * 60;
    remaining = total;
    draw();
    setButtons();
    // Persist a tiny preference (optional)
    try { localStorage.setItem('cb:study:min', String(mins)); } catch { }
}

// Hook up events
elStart.addEventListener('click', start);
elPause.addEventListener('click', stop);
elReset.addEventListener('click', reset);
elApply.addEventListener('click', applyMinutes);

// Load saved minutes if present
(function init() {
    try {
        const saved = parseInt(localStorage.getItem('cb:study:min') || '25', 10);
        if (!isNaN(saved)) elMin.value = clamp(saved, 1, 180);
    } catch { }
    applyMinutes(); // also draws initial 25:00
})();
