// "Crappy PONG" -- step by step
//
// Step 13: Simplify
/*

Supporting timer-events (via setInterval) *and* frame-events (via requestAnimationFrame)
adds significant complexity to the the code.

I can simplify things a little by focusing on the latter case only (which is the
superior mechanism of the two), so let's try doing that...

The "MAINLOOP" code, inside g_main, is much simplified as a result.

*/

'use strict';

const g_canvas = document.getElementById('myCanvas');
const g_ctx = g_canvas.getContext('2d');

/*
0        1         2         3         4         5         6         7         8         9
123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// Units

const g_character = new Character({
  cx: g_canvas.width / 2,
  cy: g_canvas.height - 120,
});

const g_ball = new Ball({
  cx: 50,
  cy: 200,
  radius: 10,

  xVel: 5,
  yVel: 4,
});

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
  // Nothing to do here!
  // The event handlers do everything we need for now.
}

// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`

// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
  g_ball.update(du);
  g_character.update(du);
}

// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`

// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {
  g_ball.render(ctx);
  g_character.render(ctx);
}

function mainInit() {
  g_main.init();
}

function preloadStuff_thenCall(completionCallback) {
  const preload = [
    './assets/character/attack/AttackC01.png',
    './assets/character/attack/AttackC02.png',
    './assets/character/attack/AttackC03.png',
    './assets/character/attack/AttackC04.png',
    './assets/character/attack/AttackC05.png',
    './assets/character/attack/AttackC06.png',
    './assets/character/attack/AttackC07.png',
    './assets/character/idle/idle01.png',
    './assets/character/idle/idle02.png',
    './assets/character/idle/idle03.png',
    './assets/character/idle/idle04.png',
    './assets/character/idle/idle05.png',
    './assets/character/idle/idle06.png',
    './assets/character/idle/idle07.png',
    './assets/character/idle/idle08.png',
    './assets/character/idle/idle09.png',
    './assets/character/run/run01.png',
    './assets/character/run/run02.png',
    './assets/character/run/run03.png',
    './assets/character/run/run04.png',
    './assets/character/run/run05.png',
    './assets/character/run/run06.png',
    './assets/character/run/run07.png',
    './assets/character/run/run08.png',
  ];

  const attack = [];
  const idle = [];
  const run = [];

  for (let i = 0; i < 7; i++) {
    const img = new Image();
    img.src = preload[i];
    setTimeout(function() { attack[i] = new Sprite(img); }, 100);
  }

  for (let i = 0; i < 9; i++) {
    const img = new Image();
    img.src = preload[i+7];
    setTimeout(function() { idle[i] = new Sprite(img); }, 100);
  }

  for (let i = 0; i < 8; i++) {
    const img = new Image();
    img.src = preload[i+16];
    setTimeout(function() { run[i] = new Sprite(img); }, 100);
  }

  const sprites = {};
  sprites.attack = attack;
  sprites.idle = idle;
  sprites.run = run;
  g_character.sprites = sprites;

  setTimeout(function() { completionCallback() }, 100);
}

preloadStuff_thenCall(mainInit);
