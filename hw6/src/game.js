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

const g_canvas = document.getElementById('mid');
const g_ctx = g_canvas.getContext('2d');

const g_f = document.getElementById('front');
const g_bg1 = document.getElementById('back1');
const g_bg2 = document.getElementById('back2');

const g_foreground = g_f.getContext('2d');
const g_background1 = g_bg1.getContext('2d');
const g_background2 = g_bg2.getContext('2d');

/*
0        1         2         3         4         5         6         7         8         9
123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// Units

const g_character = new Character({
  cx: g_canvas.width / 2,
  cy: g_canvas.height - 96,
});

const g_wall = new Wall({
  tileWidth: 64,
  tileHeight: 32,
});

const g_balls = [];
const g_ball = new Ball({
  cx: g_canvas.width * 0.3,
  cy: g_canvas.height * 0.6,
  radius: 8,

  xVel: 5,
  yVel: 4,
});

g_balls.push(g_ball);

let renderFrame = 0;

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
  renderFrame = ++renderFrame % 6;

  g_wall.update(du);

  for (let i = 0; i < g_balls.length; i++) {
    g_balls[i].update(du);
  }

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
  g_wall.render(ctx, renderFrame);

  for (let i = 0; i < g_balls.length; i++) {
    g_balls[i].render(ctx, renderFrame);
  }

  g_character.render(ctx, renderFrame);
}

const world = [];

// Far away background assets
function drawBackground2() {
  const viewWidth = g_canvas.width;
  const viewHeight = g_canvas.height;

  // Background landscape
  world[4].drawCentredAt(
    g_background2,
    viewWidth / 2,
    viewHeight / 2,
    3,
    0,
    false
  );
  world[5].drawCentredAt(
    g_background2,
    viewWidth / 2,
    viewHeight / 1.5,
    3,
    0,
    false
  );

  // Pillar thingies
  // Left
  world[2].drawCentredAt(
    g_background2,
    viewWidth * 0.14,
    viewHeight / 2.1,
    3,
    0,
    false
  );
  world[0].drawCentredAt(g_background2, 0, viewHeight / 2.2, 3, 0, false);
  // Right
  world[2].drawCentredAt(
    g_background2,
    viewWidth * 0.86,
    viewHeight / 2.3,
    3,
    0,
    false
  );
  world[3].drawCentredAt(
    g_background2,
    viewWidth * 0.96,
    viewHeight / 2.2,
    3,
    0,
    false
  );

  // Rock thingies
}

// "Mid ground" static assets
function drawBackground1() {
  const viewWidth = g_canvas.width;
  const viewHeight = g_canvas.height;
}

function drawBackgrounds() {
  drawBackground2();
  drawBackground1();
}

function mainInit() {
  drawBackgrounds();
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
    './assets/ball/hit_effect01.png',
    './assets/ball/hit_effect02.png',
    './assets/ball/hit_effect03.png',
    './assets/ball/hit_effect04.png',
    './assets/ball/hit_effect05.png',
    './assets/world/background_obj01.png',
    './assets/world/background_obj02.png',
    './assets/world/background_obj03.png',
    './assets/world/background_obj04.png',
    './assets/world/background02.png',
    './assets/world/background03.png'
  ];

  const attack = [];
  const idle = [];
  const run = [];
  const hit = [];

  for (let i = 0; i < 7; i++) {
    const img = new Image();
    img.src = preload[i];
    setTimeout(function () {
      attack[i] = new Sprite(img);
    }, 100);
  }

  for (let i = 0; i < 9; i++) {
    const img = new Image();
    img.src = preload[i + 7];
    setTimeout(function () {
      idle[i] = new Sprite(img);
    }, 100);
  }

  for (let i = 0; i < 8; i++) {
    const img = new Image();
    img.src = preload[i + 16];
    setTimeout(function () {
      run[i] = new Sprite(img);
    }, 100);
  }

  for (let i = 0; i < 5; i++) {
    const img = new Image();
    img.src = preload[i + 24];
    setTimeout(function () {
      hit[i] = new Sprite(img);
    }, 100);
  }

  for (let i = 0; i < 6; i++) {
    const img = new Image();
    img.src = preload[i + 29];
    setTimeout(function () {
      world[i] = new Sprite(img);
    }, 100);
  }

  const sprites = {};
  sprites.attack = attack;
  sprites.idle = idle;
  sprites.run = run;
  g_character.sprites = sprites;

  g_ball.sprites = hit;

  setTimeout(function () { g_wall.sprite = world[0]; }, 100);

  setTimeout(function () {
    completionCallback();
  }, 100);
}

preloadStuff_thenCall(mainInit);
