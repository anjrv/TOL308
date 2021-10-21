// =========
// ASTEROIDS
// =========
/*

A sort-of-playable version of the classic arcade game.


HOMEWORK INSTRUCTIONS:

You have some "TODO"s to fill in again, particularly in:

spatialManager.js

But also, to a lesser extent, in:

Rock.js
Bullet.js
Ship.js


...Basically, you need to implement the core of the spatialManager,
and modify the Rock/Bullet/Ship to register (and unregister)
with it correctly, so that they can participate in collisions.

Be sure to test the diagnostic rendering for the spatialManager,
as toggled by the 'X' key. We rely on that for marking. My default
implementation will work for the "obvious" approach, but you might
need to tweak it if you do something "non-obvious" in yours.
*/

'use strict';

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// ====================
// CREATE INITIAL SHIPS
// ====================

function createInitialShips() {
  entityManager.generateShip({
    cx: 200,
    cy: 200,
  });
}

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
  processDiagnostics();

  entityManager.update(du);

  // Prevent perpetual firing!
  eatKey(Ship.prototype.KEY_FIRE);
}

// GAME-SPECIFIC DIAGNOSTICS

let g_allowMixedActions = true;
let g_useGravity = false;
let g_useAveVel = true;
let g_renderSpatialDebug = false;

const KEY_MIXED = keyCode('M');
const KEY_GRAVITY = keyCode('G');
const KEY_AVE_VEL = keyCode('V');
const KEY_SPATIAL = keyCode('X');
const KEY_HALT = keyCode('H');
const KEY_RESET = keyCode('R');
const KEY_0 = keyCode('0');
const KEY_1 = keyCode('1');
const KEY_2 = keyCode('2');
const KEY_K = keyCode('K');

function processDiagnostics() {
  if (eatKey(KEY_MIXED)) g_allowMixedActions = !g_allowMixedActions;

  if (eatKey(KEY_GRAVITY)) g_useGravity = !g_useGravity;

  if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

  if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

  if (eatKey(KEY_HALT)) entityManager.haltShips();

  if (eatKey(KEY_RESET)) entityManager.resetShips();

  if (eatKey(KEY_0)) entityManager.toggleRocks();

  if (eatKey(KEY_1))
    entityManager.generateShip({
      cx: g_mouseX,
      cy: g_mouseY,

      sprite: g_sprites.ship,
    });

  if (eatKey(KEY_2))
    entityManager.generateShip({
      cx: g_mouseX,
      cy: g_mouseY,

      sprite: g_sprites.ship2,
    });

  if (eatKey(KEY_K)) entityManager.killNearestShip(g_mouseX, g_mouseY);
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
  entityManager.render(ctx);

  if (g_renderSpatialDebug) spatialManager.render(ctx);
}

// =============
// PRELOAD STUFF
// =============

const g_images = {};

function requestPreloads() {
  const requiredImages = {
    ship: 'https://notendur.hi.is/~pk/308G/images/ship.png',
    ship2: 'https://notendur.hi.is/~pk/308G/images/ship_2.png',
    rock: 'https://notendur.hi.is/~pk/308G/images/rock.png',
  };

  imagesPreload(requiredImages, g_images, preloadDone);
}

const g_sprites = {};

function preloadDone() {
  g_sprites.ship = new Sprite(g_images.ship);
  g_sprites.ship2 = new Sprite(g_images.ship2);
  g_sprites.rock = new Sprite(g_images.rock);

  g_sprites.bullet = new Sprite(g_images.ship);
  g_sprites.bullet.scale = 0.25;

  entityManager.init();
  createInitialShips();

  main.init();
}

// Kick it off
requestPreloads();
