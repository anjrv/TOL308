// "Crappy PONG" -- step by step
//
// Step 9: Homework
/*

* Make the ball bounce off the left and right 
  edges of the playfield, instead of "resetting".
  
* Add a scoring system! When the ball hits the
  left edge, the right paddle earns a point, and
  vice versa. Display each paddle's score, in
  "bold 40px Arial", at the top of the playfield 

* Prevent the paddles from moving out of the
  playfield, by having them "collide" with it.
  
* Let the user also move the paddles horizontally
  i.e. left and right within 100 pixels of the edges,
  using the 'A' and 'D' keys for the left paddle,
  and   the 'J' and 'L' keys for the right paddle
  
* Add a second ball, with half the velocity 
  of the first one.

*/

'use strict';

/* jshint browser: true, devel: true, globalstrict: true */

const g_canvas = document.getElementById('myCanvas');
let g_ctx = g_canvas.getContext('2d');
g_ctx.font = 'bold 40px Arial';
g_ctx.textAlign = 'center';

// Quantity of trail smileys,
// Careful - large numbers chug
const g_trailSize = 10;

/*
0        1         2         3         4         5         6         7         8         9
123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// =================
// KEYBOARD HANDLING
// =================

let g_keys = [];

function handleKeydown(evt) {
  g_keys[evt.keyCode] = true;
}

function handleKeyup(evt) {
  g_keys[evt.keyCode] = false;
}

// Inspects, and then clears, a key's state
//
// This allows a keypress to be "one-shot" e.g. for toggles
// ..until the auto-repeat kicks in, that is.
//
function eatKey(keyCode) {
  const isDown = g_keys[keyCode];
  g_keys[keyCode] = false;
  return isDown;
}

window.addEventListener('keydown', handleKeydown);
window.addEventListener('keyup', handleKeyup);

// ============
// PADDLE STUFF
// ============

// COMMON PADDLE STUFF

// A generic contructor which accepts an arbitrary descriptor object
function Paddle(descr) {
  for (const property in descr) {
    this[property] = descr[property];
  }
}

// Add these properties to the prototype, where they will serve as
// shared defaults, in the absence of an instance-specific overrides.

Paddle.prototype.halfWidth = 10;
Paddle.prototype.halfHeight = 50;
Paddle.prototype.score = 0;

Paddle.prototype.update = function () {
  if (g_keys[this.GO_UP] && this.cy - this.halfHeight >= 0) {
    this.cy -= 5;
  }

  if (g_keys[this.GO_DOWN] && this.cy + this.halfHeight <= g_canvas.height) {
    this.cy += 5;
  }

  if (
    g_keys[this.GO_RIGHT] &&
    this.cx < this.anchor + 100 &&
    this.cx + this.halfWidth <= g_canvas.width
  ) {
    this.cx += 5;
  }

  if (
    g_keys[this.GO_LEFT] &&
    this.cx > this.anchor - 100 &&
    this.cx - this.halfWidth >= 0
  ) {
    this.cx -= 5;
  }
};

Paddle.prototype.render = function (ctx) {
  // (cx, cy) is the centre; must offset it for drawing
  ctx.fillStyle = 'black';
  ctx.fillRect(
    this.cx - this.halfWidth,
    this.cy - this.halfHeight,
    this.halfWidth * 2,
    this.halfHeight * 2
  );
};

Paddle.prototype.collidesWith = function (prevX, prevY, nextX, nextY, r) {
  let paddleEdge = this.cx;
  // Check X coords
  if (
    (nextX - r < paddleEdge && prevX - r >= paddleEdge) ||
    (nextX + r > paddleEdge && prevX + r <= paddleEdge)
  ) {
    // Check Y coords
    if (
      nextY + r >= this.cy - this.halfHeight &&
      nextY - r <= this.cy + this.halfHeight
    ) {
      // It's a hit!
      return true;
    }
  }
  // It's a miss!
  return false;
};

Paddle.prototype.incrementScore = function () {
  this.score++;
};

// PADDLE 1

const KEY_W = 'W'.charCodeAt(0);
const KEY_A = 'A'.charCodeAt(0);
const KEY_S = 'S'.charCodeAt(0);
const KEY_D = 'D'.charCodeAt(0);

const g_paddle1 = new Paddle({
  cx: 30,
  cy: 100,
  anchor: 0,

  GO_UP: KEY_W,
  GO_DOWN: KEY_S,
  GO_LEFT: KEY_A,
  GO_RIGHT: KEY_D,
});

// PADDLE 2

const KEY_I = 'I'.charCodeAt(0);
const KEY_J = 'J'.charCodeAt(0);
const KEY_K = 'K'.charCodeAt(0);
const KEY_L = 'L'.charCodeAt(0);

const g_paddle2 = new Paddle({
  cx: 370,
  cy: 300,
  anchor: 400,

  GO_UP: KEY_I,
  GO_DOWN: KEY_K,
  GO_LEFT: KEY_J,
  GO_RIGHT: KEY_L,
});

// ==========
// BALL STUFF
// ==========

function Ball(descr) {
  for (const property in descr) {
    this[property] = descr[property];
  }
}

Ball.prototype.radius = 10;

Ball.prototype.update = function () {
  // Remember my previous position
  const prevX = this.cx;
  const prevY = this.cy;

  for (let i = this.trail.length - 1; i >= 1; i--) {
    this.trail[i] = this.trail[i - 1];
  }

  this.trail[0] = [prevX, prevY];

  // Compute my provisional new position (barring collisions)
  const nextX = prevX + this.xVel;
  const nextY = prevY + this.yVel;

  // Bounce off the paddles
  if (
    g_paddle1.collidesWith(prevX, prevY, nextX, nextY, this.radius) ||
    g_paddle2.collidesWith(prevX, prevY, nextX, nextY, this.radius)
  ) {
    this.xVel *= -1;
  }

  // Bounce off top and bottom edges
  if (
    nextY < 0 || // top edge
    nextY > g_canvas.height
  ) {
    // bottom edge
    this.yVel *= -1;
  }

  if (nextX < 0 || nextX > g_canvas.width) {
    this.xVel *= -1;
    this.cx < 200 ? g_paddle2.incrementScore() : g_paddle1.incrementScore();
  }

  // *Actually* update my position
  // ...using whatever velocity I've ended up with
  this.cx += this.xVel;
  this.cy += this.yVel;
};

Ball.prototype.render = function (ctx) {
  for (let i = this.trail.length - 1; i >= 0; i--) {
    drawSmileyAt(
      ctx,
      this.trail[i][0],
      this.trail[i][1],
      this.radius * ((g_trailSize - i) / g_trailSize)
    );
  }

  drawSmileyAt(ctx, this.cx, this.cy, this.radius);
};

Ball.prototype.reset = function () {
  this.cx = randomIntFromInterval(150, 250);
  this.cy = randomIntFromInterval(150, 250);
  this.xVel = -this.xVel;
  this.yVel = -this.yVel;
};

// BALL STUFF

// BALL 1
const ball1StartX = randomIntFromInterval(150, 250);
const ball1StartY = randomIntFromInterval(150, 250);

const g_ball1 = new Ball({
  cx: ball1StartX,
  cy: ball1StartY,
  // Initially there is no history, just fill our trail array with current loc
  trail: Array(g_trailSize).fill([ball1StartX, ball1StartY]),
  xVel: 5,
  yVel: 4,
});

// BALL 2
const ball2StartX = randomIntFromInterval(150, 250);
const ball2StartY = randomIntFromInterval(150, 250);

const g_ball2 = new Ball({
  cx: ball2StartX,
  cy: ball2StartY,
  trail: Array(g_trailSize).fill([ball2StartX, ball2StartY]),
  // For this one flip the direction so both aren't thrown at the same player
  xVel: -g_ball1.xVel / 2,
  yVel: -g_ball1.yVel / 2,
});

// =====
// UTILS
// =====

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function clearCanvas(ctx) {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function fillCircle(ctx, x, y, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

// ===============
// INVADING SMILEY
// ===============
//
// There always has to be a smiley

const g_defaultSmileyX = 200,
  g_defaultSmileyY = 200,
  g_defaultSmileyRadius = 150;

function drawBackground(ctx) {
  const gradient = ctx.createRadialGradient(
    g_defaultSmileyX,
    g_defaultSmileyY,
    g_defaultSmileyRadius - 15,
    g_defaultSmileyX,
    g_defaultSmileyY,
    g_defaultSmileyRadius
  );

  gradient.addColorStop(0, '#ffd000');
  gradient.addColorStop(1, 'gray');

  ctx.fillStyle = gradient;
  ctx.arc(
    g_defaultSmileyX,
    g_defaultSmileyY,
    g_defaultSmileyRadius,
    0,
    2 * Math.PI
  );

  ctx.closePath();
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawSmile(ctx) {
  ctx.beginPath();
  ctx.moveTo(120, 240);
  ctx.bezierCurveTo(120, 290, 280, 290, 280, 240);
  ctx.bezierCurveTo(280, 300, 120, 300, 120, 240);
  ctx.closePath();
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.stroke();
}

function splatter(ctx) {
  // Smaller shadow on blood
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.fillStyle = '#bd0111';

  ctx.beginPath();
  ctx.moveTo(95, 95);
  ctx.bezierCurveTo(95, 110, 130, 110, 130, 120);
  ctx.bezierCurveTo(130, 125, 110, 125, 110, 115);
  ctx.bezierCurveTo(110, 150, 180, 150, 180, 180);
  ctx.bezierCurveTo(180, 200, 110, 125, 100, 130);
  ctx.bezierCurveTo(100, 160, 130, 170, 130, 180);
  ctx.bezierCurveTo(130, 200, 100, 150, 75, 130);
  ctx.bezierCurveTo(75, 130, 75, 130, 73, 125);
  ctx.bezierCurveTo(75, 105, 99, 96, 97, 95);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
}

function drawDefaultSmiley(ctx) {
  drawBackground(ctx);

  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.shadowBlur = 1;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.fillStyle = 'black';

  fillEllipse(ctx, 150, 150, 10, 40, Math.PI);
  fillEllipse(ctx, 250, 150, 10, 40, Math.PI);
  drawSmile(ctx);
  fillEllipse(ctx, 120, 240, 3, 14, 0.4 * Math.PI);
  fillEllipse(ctx, 280, 240, 3, 14, 0.6 * Math.PI);
  splatter(ctx);
}

function drawSmileyAt(ctx, cx, cy, radius, angle) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  const scale = radius / g_defaultSmileyRadius;
  ctx.scale(scale, scale);
  ctx.translate(-g_defaultSmileyX, -g_defaultSmileyY);
  drawDefaultSmiley(ctx);
  ctx.restore();
}

function fillEllipse(ctx, cx, cy, halfWidth, halfHeight, angle) {
  ctx.save();
  ctx.beginPath();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.scale(halfWidth, halfHeight);

  ctx.arc(0, 0, 1, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.restore();
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

function updateSimulation() {
  if (shouldSkipUpdate()) return;

  g_ball1.update();
  g_ball2.update();

  g_paddle1.update();
  g_paddle2.update();
}

// Togglable Pause Mode
const KEY_PAUSE = 'P'.charCodeAt(0);
const KEY_STEP = 'O'.charCodeAt(0);

let g_isUpdatePaused = false;

function shouldSkipUpdate() {
  if (eatKey(KEY_PAUSE)) {
    g_isUpdatePaused = !g_isUpdatePaused;
  }
  return g_isUpdatePaused && !eatKey(KEY_STEP);
}

// =================
// RENDER SIMULATION
// =================

function renderSimulation(ctx) {
  clearCanvas(ctx);

  g_ball1.render(ctx);
  g_ball2.render(ctx);

  g_paddle1.render(ctx);
  g_paddle2.render(ctx);
}

// ========
// MAINLOOP
// ========

function showScores(ctx) {
  ctx.fillStyle = 'black';
  ctx.fillText(g_paddle1.score, (g_canvas.width / 10) * 4, 40);
  ctx.fillText(g_paddle2.score, (g_canvas.width / 10) * 6, 40);
}

function mainIter() {
  if (!requestedQuit()) {
    gatherInputs();
    updateSimulation();
    renderSimulation(g_ctx);
    showScores(g_ctx);
  } else {
    window.clearInterval(intervalID);
  }
}

// Simple voluntary quit mechanism
const KEY_QUIT = 'Q'.charCodeAt(0);
function requestedQuit() {
  return g_keys[KEY_QUIT];
}

// ..and this is how we set it all up, by requesting a recurring periodic
// "timer event" which we can use as a kind of "heartbeat" for our game.
//
const intervalID = window.setInterval(mainIter, 16.666);

//window.focus();
