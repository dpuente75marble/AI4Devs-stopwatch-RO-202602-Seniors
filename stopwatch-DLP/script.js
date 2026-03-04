// ===== DOM =====
const $ = (sel) => document.querySelector(sel);

const timeDisplay = $("#timeDisplay");
const subDisplay = $("#subDisplay");
const primaryBtn = $("#primaryBtn");
const secondaryBtn = $("#secondaryBtn");

const tabs = document.querySelectorAll(".tab");
const countdownInputs = $("#countdownInputs");
const displayEl = document.querySelector(".display");

const cdMin = $("#cdMin");
const cdSec = $("#cdSec");

// ===== State =====
const state = {
  mode: "stopwatch", // "stopwatch" | "countdown"
  running: false,

  // Stopwatch
  swStartTs: 0, // performance.now() when started/resumed
  swElapsedMs: 0, // accumulated elapsed ms when paused

  // Countdown
  cdConfiguredMs: 0,
  cdStartTs: 0,
  cdRemainingMs: 0,
};

// ===== Helpers =====
function pad2(n) {
  return String(n).padStart(2, "0");
}

function pad3(n) {
  return String(n).padStart(3, "0");
}

/**
 * Returns { main: "MM:SS:CC" OR "HH:MM:SS", sub: "000" }
 * CC = centiseconds (00-99). sub = milliseconds (000-999)
 */
function formatTime(ms) {
  const safe = Math.max(0, Math.floor(ms));
  const h = Math.floor(safe / 3600000);
  const m = Math.floor((safe % 3600000) / 60000);
  const s = Math.floor((safe % 60000) / 1000);

  const millis = safe % 1000;
  const cs = Math.floor(millis / 10);

  if (h > 0) {
    // In HH:MM:SS we don't show centiseconds; keep sub as ms
    return { main: `${pad2(h)}:${pad2(m)}:${pad2(s)}`, sub: pad3(millis) };
  }

  return { main: `${pad2(m)}:${pad2(s)}:${pad2(cs)}`, sub: pad3(millis) };
}

function setPrimaryLabel() {
  if (!state.running) {
    const isFresh =
      state.mode === "stopwatch"
        ? state.swElapsedMs === 0
        : state.cdRemainingMs === 0 ||
          state.cdRemainingMs === state.cdConfiguredMs;

    primaryBtn.textContent = isFresh ? "Start" : "Resume";
    return;
  }
  primaryBtn.textContent = "Pause";
}

function readCountdownInputsMs() {
  const min = parseInt(cdMin.value, 10);
  const sec = parseInt(cdSec.value, 10);

  const m = Number.isFinite(min) ? Math.max(0, Math.min(99, min)) : 0;
  const s = Number.isFinite(sec) ? Math.max(0, Math.min(59, sec)) : 0;

  cdMin.value = pad2(m);
  cdSec.value = pad2(s);

  return (m * 60 + s) * 1000;
}

function flashDisplay() {
  if (!displayEl) return;
  displayEl.classList.remove("is-flashing");
  // Force reflow to restart animation
  void displayEl.offsetWidth;
  displayEl.classList.add("is-flashing");
  setTimeout(() => displayEl.classList.remove("is-flashing"), 1200);
}

// ===== Rendering =====
function renderStopwatch(ms) {
  const t = formatTime(ms);
  timeDisplay.textContent = t.main;
  subDisplay.textContent = t.sub;
}

function renderCountdown(ms) {
  const t = formatTime(ms);
  timeDisplay.textContent = t.main;
  subDisplay.textContent = t.sub;
}

function render() {
  // Tabs UI
  tabs.forEach((btn) => {
    const isActive = btn.dataset.mode === state.mode;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-selected", String(isActive));
  });

  // Countdown inputs visibility
  countdownInputs.hidden = state.mode !== "countdown";

  // Buttons labels
  setPrimaryLabel();

  // Display based on mode
  if (state.mode === "stopwatch") {
    renderStopwatch(state.swElapsedMs);
  } else {
    const configured = state.cdConfiguredMs || readCountdownInputsMs();
    const shown = state.cdRemainingMs > 0 ? state.cdRemainingMs : configured;
    renderCountdown(shown);
  }
}

// ===== Animation loop =====
let rafId = null;

function stopLoop() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

function loop() {
  if (!state.running) return;

  const now = performance.now();

  if (state.mode === "stopwatch") {
    const current = state.swElapsedMs + (now - state.swStartTs);
    renderStopwatch(current);
  } else {
    const elapsed = now - state.cdStartTs;
    const remaining = Math.max(0, state.cdRemainingMs - elapsed);

    renderCountdown(remaining);

    if (remaining === 0) {
      // Stop + flash at end
      state.running = false;
      state.cdRemainingMs = 0;
      stopLoop();
      flashDisplay();
      render();
      return;
    }
  }

  rafId = requestAnimationFrame(loop);
}

// ===== Actions =====
function switchMode(nextMode) {
  if (nextMode === state.mode) return;

  // Stop any running loop
  state.running = false;
  stopLoop();

  // Reset per mode (keep countdown inputs)
  if (nextMode === "stopwatch") {
    state.swStartTs = 0;
    state.swElapsedMs = 0;
  } else {
    // Capture configured value on entering countdown
    state.cdConfiguredMs = readCountdownInputsMs();
    state.cdRemainingMs = state.cdConfiguredMs;
    state.cdStartTs = 0;
  }

  state.mode = nextMode;
  render();
}

function toggleStartPause() {
  if (state.mode === "stopwatch") {
    if (!state.running) {
      // Start or Resume
      state.running = true;
      state.swStartTs = performance.now();
      setPrimaryLabel();
      stopLoop();
      rafId = requestAnimationFrame(loop);
      return;
    }

    // Pause
    const now = performance.now();
    state.swElapsedMs = state.swElapsedMs + (now - state.swStartTs);
    state.running = false;
    stopLoop();
    render();
    return;
  }

  // Countdown
  if (!state.running) {
    // Decide whether this is Start (fresh) or Resume (paused)
    const configuredNow = readCountdownInputsMs();

    const isFresh =
      state.cdRemainingMs === 0 ||
      state.cdRemainingMs === state.cdConfiguredMs ||
      state.cdConfiguredMs === 0;

    if (isFresh) {
      state.cdConfiguredMs = configuredNow;
      state.cdRemainingMs = configuredNow;
    }

    if (state.cdRemainingMs <= 0) {
      render();
      return;
    }

    state.running = true;
    state.cdStartTs = performance.now();
    setPrimaryLabel();
    stopLoop();
    rafId = requestAnimationFrame(loop);
    return;
  }

  // Pause countdown: store remaining precisely
  const now = performance.now();
  const elapsed = now - state.cdStartTs;
  state.cdRemainingMs = Math.max(0, state.cdRemainingMs - elapsed);
  state.running = false;
  stopLoop();
  render();
}

function clearAll() {
  state.running = false;
  stopLoop();

  if (state.mode === "stopwatch") {
    state.swStartTs = 0;
    state.swElapsedMs = 0;
  } else {
    // Reset to last configured value
    state.cdConfiguredMs = readCountdownInputsMs();
    state.cdRemainingMs = state.cdConfiguredMs;
    state.cdStartTs = 0;
  }

  render();
}

// ===== Events =====
tabs.forEach((btn) => {
  btn.addEventListener("click", () => switchMode(btn.dataset.mode));
});

primaryBtn.addEventListener("click", toggleStartPause);
secondaryBtn.addEventListener("click", clearAll);

// Keyboard shortcuts: Space = Start/Pause/Resume, R = Clear
window.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();

  // Avoid interfering when typing in inputs
  const isTyping =
    document.activeElement &&
    (document.activeElement.tagName === "INPUT" ||
      document.activeElement.tagName === "TEXTAREA");

  if (key === " " && !isTyping) {
    e.preventDefault();
    toggleStartPause();
  }

  if (key === "r" && !isTyping) {
    e.preventDefault();
    clearAll();
  }
});

// Keep countdown configured value in sync (basic)
[cdMin, cdSec].forEach((inp) => {
  inp.addEventListener("blur", () => {
    if (state.mode !== "countdown") return;
    if (state.running) return;
    state.cdConfiguredMs = readCountdownInputsMs();
    state.cdRemainingMs = state.cdConfiguredMs;
    render();
  });
});

// Initial paint
render();
