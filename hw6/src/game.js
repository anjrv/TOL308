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

const g_wall_canvas = document.getElementById('wall');
const g_wall_ctx = g_wall_canvas.getContext('2d');

const g_f = document.getElementById('front');
const g_bg = document.getElementById('back');

const g_foreground = g_f.getContext('2d');
const g_background = g_bg.getContext('2d');

let g_sounds = true;

/*
0        1         2         3         4         5         6         7         8         9
123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// Units

const g_hearts = new Hearts({
  hearts: [],
});

const g_explosions = new Explosions({
  explosions: [],
});

const g_character = new Character({
  cx: g_canvas.width / 2,
  cy: g_canvas.height - 88,
});

// Provide some randomization for wall generation
const scales = [32, 64];
const blockFreq = randomIntFromInterval(5, 9);
const blockWidth = randomIntFromInterval(0, 1);
const blockHeight = randomIntFromInterval(0, 1);
const g_wall = new Wall({
  tileWidth: scales[blockWidth],
  tileHeight: scales[blockHeight],
  blockFrequency: blockFreq / 10,
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

let renderFrame = 1;

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

  g_hearts.update(du);
  g_character.update(du);

  for (let i = 0; i < g_balls.length; i++) {
    g_balls[i].update(du);
  }

  g_wall.update(du);
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
  g_explosions.render(ctx, renderFrame);
  g_hearts.render(ctx, renderFrame);
  g_character.render(ctx, renderFrame);
  // This isn't rendered, it's garbage collection
  g_wall.cull(g_wall_ctx);

  for (let i = 0; i < g_balls.length; i++) {
    g_balls[i].render(ctx, renderFrame);
  }
}

const world = [];

function drawBackgrounds() {
  const viewWidth = g_canvas.width;
  const viewHeight = g_canvas.height;

  // Background landscape
  world[4].drawCentredAt(
    g_background,
    viewWidth / 2,
    viewHeight / 2,
    3,
    0,
    false
  );
  world[5].drawCentredAt(
    g_background,
    viewWidth / 2,
    viewHeight / 1.5,
    3,
    0,
    false
  );

  // Pillar thingies
  // Left
  world[2].drawCentredAt(
    g_background,
    viewWidth * 0,
    viewHeight / 2.1,
    3,
    0,
    false
  );
  world[0].drawCentredAt(
    g_background,
    -viewWidth * 0.1,
    viewHeight / 2.2,
    3,
    0,
    false
  );
  // Right
  world[2].drawCentredAt(
    g_background,
    viewWidth * 0.86,
    viewHeight / 2.3,
    3,
    0,
    false
  );
  world[3].drawCentredAt(
    g_background,
    viewWidth * 0.96,
    viewHeight / 2.2,
    3,
    0,
    false
  );
}

function drawWelcome() {
  g_foreground.font = 'Bold 30pt Courier';
  g_foreground.fillStyle = '#2d2837';
  g_foreground.strokeStyle = '#f5c0ad';
  g_foreground.textAlign = 'center';
  g_foreground.textBaseline = 'middle';

  // Title
  g_foreground.fillText(
    '"Little Red breaks through the glass ceiling"',
    g_canvas.width / 2,
    g_canvas.height / 3
  );
  g_foreground.strokeText(
    'Little Red breaks through the glass ceiling',
    g_canvas.width / 2,
    g_canvas.height / 3
  );

  // Sound
  g_foreground.fillText(
    "'S' to make it shut up...",
    g_canvas.width / 2,
    g_canvas.height / 2.4
  );
  g_foreground.strokeText(
    "'S' to make it shut up...",
    g_canvas.width / 2,
    g_canvas.height / 2.4
  );

  // Unpause
  g_foreground.fillText(
    "'P' to unpause!",
    g_canvas.width / 2,
    g_canvas.height / 2
  );
  g_foreground.strokeText(
    "'P' to unpause!",
    g_canvas.width / 2,
    g_canvas.height / 2
  );
}

function mainInit() {
  drawBackgrounds();
  drawWelcome();
  g_main.init();
}

let oofSound = null;
let music = null;
let glassSounds = [];
let explosionSound = null;

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
    './assets/character/death/death01.png',
    './assets/character/death/death02.png',
    './assets/character/death/death03.png',
    './assets/character/death/death04.png',
    './assets/character/death/death05.png',
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
    './assets/world/background03.png',
    './assets/heart/heart01.png',
    './assets/heart/heart02.png',
    './assets/heart/heart03.png',
    './assets/heart/heart04.png',
    './assets/heart/heart05.png',
    './assets/heart/heart06.png',
    './assets/explosion/destr_effect01.png',
    './assets/explosion/destr_effect02.png',
    './assets/explosion/destr_effect03.png',
    './assets/explosion/destr_effect04.png',
    './assets/explosion/destr_effect05.png',
  ];

  const attack = [];
  const idle = [];
  const run = [];
  const hit = [];
  const death = [];
  const hearts = [];
  const explosions = [];

  for (let i = 0; i < 7; i++) {
    const img = new Image();
    img.src = preload[i];
    setTimeout(function () {
      attack[i] = new Sprite(img);
    }, 2000);
  }

  for (let i = 0; i < 9; i++) {
    const img = new Image();
    img.src = preload[i + 7];
    setTimeout(function () {
      idle[i] = new Sprite(img);
    }, 2000);
  }

  for (let i = 0; i < 8; i++) {
    const img = new Image();
    img.src = preload[i + 16];
    setTimeout(function () {
      run[i] = new Sprite(img);
    }, 2000);
  }

  for (let i = 0; i < 5; i++) {
    const img = new Image();
    img.src = preload[i + 24];
    setTimeout(function () {
      death[i] = new Sprite(img);
    }, 2000);
  }

  for (let i = 0; i < 5; i++) {
    const img = new Image();
    img.src = preload[i + 29];
    setTimeout(function () {
      hit[i] = new Sprite(img);
    }, 2000);
  }

  for (let i = 0; i < 6; i++) {
    const img = new Image();
    img.src = preload[i + 34];
    setTimeout(function () {
      world[i] = new Sprite(img);
    }, 2000);
  }

  for (let i = 0; i < 6; i++) {
    const img = new Image();
    img.src = preload[i + 40];
    setTimeout(function () {
      hearts[i] = new Sprite(img);
    }, 2000);
  }

  for (let i = 0; i < 5; i++) {
    const img = new Image();
    img.src = preload[i + 46];
    setTimeout(function () {
      explosions[i] = new Sprite(img);
    }, 2000);
  }


  const sprites = {};
  sprites.attack = attack;
  sprites.idle = idle;
  sprites.run = run;
  sprites.death = death;
  g_character.sprites = sprites;
  g_balls.sprites = hit;
  g_hearts.sprites = hearts;
  g_explosions.sprites = explosions;

  music = new Audio('./assets/sounds/music.mp3');
  oofSound = new Audio('./assets/sounds/oof.wav');
  glassSounds.push(new Audio('./assets/sounds/glass1.wav'));
  glassSounds.push(new Audio('./assets/sounds/glass2.wav'));
  explosionSound = new Audio('./assets/sounds/explosion.wav');

  music.loop = true;

  setTimeout(function () {
    completionCallback();
  }, 2000);
}

preloadStuff_thenCall(mainInit);
