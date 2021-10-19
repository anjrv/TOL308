/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/

'use strict';

// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/

const entityManager = {
  // "PRIVATE" DATA

  _rocks: [],
  _bullets: [],
  _ships: [],

  _bShowRocks: false,

  // "PRIVATE" METHODS

  _generateRocks: function () {
    const NUM_ROCKS = 4;

    for (let i = 0; i < NUM_ROCKS; i++) {
      this._rocks.push(new Rock());
    }
  },

  _findNearestShip: function (posX, posY) {
    const width = g_canvas.width;
    const height = g_canvas.height;

    let minDist = Number.MAX_VALUE;
    let closestIndex = -1;
    let closestShip = null;

    for (let i = 0; i < this._ships.length; i++) {
      let xDiff = Math.abs(posX - this._ships[i].cx);
      xDiff = xDiff > width/2 ? width - xDiff : xDiff;

      let yDiff = Math.abs(posY - this._ships[i].cy);
      yDiff = yDiff > height/2 ? height - yDiff : yDiff;

      const curr = Math.pow(xDiff, 2) + Math.pow(yDiff, 2);

      console.log(curr);

      if (curr < minDist) {
        minDist = curr;
        closestIndex = i;
        closestShip = this._ships[i];
      }
    }

    return {
      theShip: closestShip, // the object itself
      theIndex: closestIndex, // the array index where it lives
    };
  },

  _forEachOf: function (aCategory, fn, value) {
    for (let i = 0; i < aCategory.length; ++i) {
      fn.call(aCategory[i], value);
    }
  },

  // PUBLIC METHODS

  // A special return value, used by other objects,
  // to request the blessed release of death!
  KILL_ME_NOW: -1,

  // Some things must be deferred until after initial construction
  // i.e. thing which need `this` to be defined.
  deferredSetup: function () {
    this._categories = [this._rocks, this._bullets, this._ships];
  },

  init: function () {
    this._generateRocks();
  },

  fireBullet: function (cx, cy, velX, velY, rotation) {
    const vars = {
      cx: cx,
      cy: cy,
      velX: velX,
      velY: velY,
      rotation: rotation,
    };

    this._bullets.push(new Bullet(vars));
  },

  generateShip: function (descr) {
    this._ships.push(new Ship(descr));
  },

  killNearestShip: function (xPos, yPos) {
    if (xPos > g_canvas.width || xPos < 0 || yPos > g_canvas.height || yPos < 0)
      return;

    const shipInfo = this._findNearestShip(xPos, yPos);
    this._ships.splice(shipInfo.theIndex, 1);
  },

  yoinkNearestShip: function (xPos, yPos) {
    if (xPos > g_canvas.width || xPos < 0 || yPos > g_canvas.height || yPos < 0)
      return;

    const shipInfo = this._findNearestShip(xPos, yPos);
    console.log(shipInfo);
    shipInfo.theShip.cx = xPos;
    shipInfo.theShip.cy = yPos;
  },

  resetShips: function () {
    this._forEachOf(this._ships, Ship.prototype.reset);
  },

  haltShips: function () {
    this._forEachOf(this._ships, Ship.prototype.halt);
  },

  toggleRocks: function () {
    this._bShowRocks = !this._bShowRocks;
  },

  updateBullets: function (du) {
    for (let i = this._bullets.length - 1; i >= 0; i--) {
      const shuffleOff = this._bullets[i].update(du);

      if (shuffleOff === this.KILL_ME_NOW) {
        this._bullets.splice(i, 1);
      }
    }
  },

  update: function (du) {
    this._forEachOf(this._ships, Ship.prototype.update, du);
    this._forEachOf(this._rocks, Rock.prototype.update, du);
    this.updateBullets(du);
  },

  render: function (ctx) {
    this._forEachOf(this._ships, Ship.prototype.render, ctx);
    this._forEachOf(this._bullets, Bullet.prototype.render, ctx);

    if (!this._bShowRocks) return;
    this._forEachOf(this._rocks, Rock.prototype.render, ctx);
  },
};

entityManager.deferredSetup();

entityManager.init();
