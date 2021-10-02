// GENERIC UPDATE LOGIC

// The "nominal interval" is the one that all of our time-based units are
// calibrated to e.g. a velocity unit is "pixels per nominal interval"
//
const NOMINAL_UPDATE_INTERVAL = 16.666;

let g_isFirstUpdate = true;

// Dt means "delta time" and is in units of the timer-system (i.e. milliseconds)
//
let g_prevUpdateDt = null;

// Du means "delta u", where u represents time in multiples of our nominal interval
//
let g_prevUpdateDu = null;

// Track odds and evens for diagnostic / illustrative purposes
//
let g_isUpdateOdd = false;

function update(dt) {
  // Get out if skipping (e.g. due to pause-mode)
  //
  if (shouldSkipUpdate()) return;

  if (g_isFirstUpdate) {
    g_isFirstUpdate = false;
    clearCanvas(g_foreground);
  }

  if (g_sounds && !g_character.isDead) music.play();
  if (shouldShutUp() || g_character.isDead) music.pause();

  // Remember this for later
  //
  let original_dt = dt;

  // Warn about very large dt values -- they may lead to error
  //
  if (dt > 200) {
    console.log('Big dt =', dt, ': CLAMPING TO NOMINAL');
    dt = NOMINAL_UPDATE_INTERVAL;
  }

  // If using variable time, divide the actual delta by the "nominal" rate,
  // giving us a conveniently scaled "du" to work with.
  //
  var du = dt / NOMINAL_UPDATE_INTERVAL;

  updateSimulation(du);

  g_prevUpdateDt = original_dt;
  g_prevUpdateDu = du;
  g_isUpdateOdd = !g_isUpdateOdd;
}

// Togglable Pause Mode
//
const KEY_PAUSE = 'P'.charCodeAt(0);
const KEY_STEP = 'O'.charCodeAt(0);
const KEY_SOUND = 'S'.charCodeAt(0);
let g_isUpdatePaused = true;

function shouldSkipUpdate() {
  if (eatKey(KEY_PAUSE)) {
    music.pause();
    g_isUpdatePaused = !g_isUpdatePaused;
  }
  return g_isUpdatePaused && !eatKey(KEY_STEP);
}

function shouldShutUp() {
  if (eatKey(KEY_SOUND)) {
    g_sounds = !g_sounds;
  }

  return !g_sounds;
}
