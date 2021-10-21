// ==========
// SHIP STUFF
// ==========

'use strict';

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// A generic contructor which accepts an arbitrary descriptor object
function Ship(descr) {
  // Common inherited setup logic from Entity
  this.setup(descr);

  this.rememberResets();

  // Default sprite, if not otherwise specified
  this.sprite = this.sprite || g_sprites.ship;

  // Set normal drawing scale, and warp state off
  this._scale = 1;
  this._isWarping = false;
}

Ship.prototype = new Entity();

Ship.prototype.rememberResets = function () {
  // Remember my reset positions
  this.reset_cx = this.cx;
  this.reset_cy = this.cy;
  this.reset_rotation = this.rotation;
};

Ship.prototype.KEY_THRUST = 'W'.charCodeAt(0);
Ship.prototype.KEY_RETRO = 'S'.charCodeAt(0);
Ship.prototype.KEY_LEFT = 'A'.charCodeAt(0);
Ship.prototype.KEY_RIGHT = 'D'.charCodeAt(0);

Ship.prototype.KEY_FIRE = ' '.charCodeAt(0);

// Initial, inheritable, default values
Ship.prototype.rotation = 0;
Ship.prototype.cx = 200;
Ship.prototype.cy = 200;
Ship.prototype.velX = 0;
Ship.prototype.velY = 0;
Ship.prototype.launchVel = 2;
Ship.prototype.numSubSteps = 1;

// HACKED-IN AUDIO (no preloading)
Ship.prototype.warpSound = new Audio('sounds/shipWarp.ogg');

Ship.prototype.warp = function () {
  this._isWarping = true;
  this._scaleDirn = -1;
  this.warpSound.play();

  // Unregister me from my old posistion
  // ...so that I can't be collided with while warping
  spatialManager.unregister(this);
};

Ship.prototype._updateWarp = function (du) {
  const SHRINK_RATE = 3 / SECS_TO_NOMINALS;
  this._scale += this._scaleDirn * SHRINK_RATE * du;

  if (this._scale < 0.2) {
    this._moveToASafePlace();
    this.halt();
    this._scaleDirn = 1;
  } else if (this._scale > 1) {
    this._scale = 1;
    this._isWarping = false;

    // Reregister me from my old posistion
    // ...so that I can be collided with again
    spatialManager.register(this);
  }
};

Ship.prototype._moveToASafePlace = function () {
  // Move to a safe place some suitable distance away
  let origX = this.cx,
    origY = this.cy,
    MARGIN = 40,
    isSafePlace = false;

  for (let attempts = 0; attempts < 100; ++attempts) {
    const warpDistance = 100 + (Math.random() * g_canvas.width) / 2;
    const warpDirn = Math.random() * consts.FULL_CIRCLE;

    this.cx = origX + warpDistance * Math.sin(warpDirn);
    this.cy = origY - warpDistance * Math.cos(warpDirn);

    this.wrapPosition();

    // Don't go too near the edges, and don't move into a collision!
    if (!util.isBetween(this.cx, MARGIN, g_canvas.width - MARGIN)) {
      isSafePlace = false;
    } else if (!util.isBetween(this.cy, MARGIN, g_canvas.height - MARGIN)) {
      isSafePlace = false;
    } else {
      isSafePlace = !this.isColliding();
    }

    // Get out as soon as we find a safe place
    if (isSafePlace) break;
  }
};

Ship.prototype.update = function (du) {
  // Handle warping
  if (this._isWarping) {
    this._updateWarp(du);
    return;
  }

  // TODO: YOUR STUFF HERE! --- Unregister and check for death
  spatialManager.unregister(this);
  if (this.isDeadNow) return entityManager.KILL_ME_NOW;

  // Perform movement substeps
  const steps = this.numSubSteps;
  const dStep = du / steps;
  for (let i = 0; i < steps; ++i) {
    this.computeSubStep(dStep);
  }

  // Handle firing
  this.maybeFireBullet();

  // Warp if isColliding, otherwise Register
  this.isColliding() ? this.warp() : spatialManager.register(this);
};

Ship.prototype.computeSubStep = function (du) {
  const thrust = this.computeThrustMag();

  // Apply thrust directionally, based on our rotation
  const accelX = +Math.sin(this.rotation) * thrust;
  let accelY = -Math.cos(this.rotation) * thrust;
  accelY += this.computeGravity();

  this.applyAccel(accelX, accelY, du);

  this.wrapPosition();

  if (thrust === 0 || g_allowMixedActions) {
    this.updateRotation(du);
  }
};

const NOMINAL_GRAVITY = 0.12;

Ship.prototype.computeGravity = function () {
  return g_useGravity ? NOMINAL_GRAVITY : 0;
};

const NOMINAL_THRUST = +0.2;
const NOMINAL_RETRO = -0.1;

Ship.prototype.computeThrustMag = function () {
  let thrust = 0;

  if (keys[this.KEY_THRUST]) {
    thrust += NOMINAL_THRUST;
  }
  if (keys[this.KEY_RETRO]) {
    thrust += NOMINAL_RETRO;
  }

  return thrust;
};

Ship.prototype.applyAccel = function (accelX, accelY, du) {
  // u = original velocity
  const oldVelX = this.velX;
  const oldVelY = this.velY;

  // v = u + at
  this.velX += accelX * du;
  this.velY += accelY * du;

  // v_ave = (u + v) / 2
  const aveVelX = (oldVelX + this.velX) / 2;
  const aveVelY = (oldVelY + this.velY) / 2;

  // Decide whether to use the average or not (average is best!)
  const intervalVelX = g_useAveVel ? aveVelX : this.velX;
  let intervalVelY = g_useAveVel ? aveVelY : this.velY;

  // s = s + v_ave * t
  const nextX = this.cx + intervalVelX * du;
  const nextY = this.cy + intervalVelY * du;

  // bounce
  if (g_useGravity) {
    const minY = g_sprites.ship.height / 2;
    const maxY = g_canvas.height - minY;

    // Ignore the bounce if the ship is already in
    // the "border zone" (to avoid trapping them there)
    if (this.cy > maxY || this.cy < minY) {
      // do nothing
    } else if (nextY > maxY || nextY < minY) {
      this.velY = oldVelY * -0.9;
      intervalVelY = this.velY;
    }
  }

  // s = s + v_ave * t
  this.cx += du * intervalVelX;
  this.cy += du * intervalVelY;
};

Ship.prototype.maybeFireBullet = function () {
  if (keys[this.KEY_FIRE]) {
    const dX = +Math.sin(this.rotation);
    const dY = -Math.cos(this.rotation);
    const launchDist = this.getRadius() * 1.2;

    const relVel = this.launchVel;
    const relVelX = dX * relVel;
    const relVelY = dY * relVel;

    entityManager.fireBullet(
      this.cx + dX * launchDist,
      this.cy + dY * launchDist,
      this.velX + relVelX,
      this.velY + relVelY,
      this.rotation,
    );
  }
};

Ship.prototype.getRadius = function () {
  return (this.sprite.width / 2) * 0.9;
};

Ship.prototype.takeBulletHit = function () {
  this.warp();
};

Ship.prototype.reset = function () {
  this.setPos(this.reset_cx, this.reset_cy);
  this.rotation = this.reset_rotation;

  this.halt();
};

Ship.prototype.halt = function () {
  this.velX = 0;
  this.velY = 0;
};

const NOMINAL_ROTATE_RATE = 0.1;

Ship.prototype.updateRotation = function (du) {
  if (keys[this.KEY_LEFT]) {
    this.rotation -= NOMINAL_ROTATE_RATE * du;
  }
  if (keys[this.KEY_RIGHT]) {
    this.rotation += NOMINAL_ROTATE_RATE * du;
  }
};

Ship.prototype.render = function (ctx) {
  const origScale = this.sprite.scale;
  // pass my scale into the sprite, for drawing
  this.sprite.scale = this._scale;
  this.sprite.drawWrappedCentredAt(ctx, this.cx, this.cy, this.rotation);
  this.sprite.scale = origScale;
};
