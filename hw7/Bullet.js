// ======
// BULLET
// ======

'use strict';

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// A generic contructor which accepts an arbitrary descriptor object
function Bullet(descr) {
  for (const property in descr) {
    this[property] = descr[property];
  }
}

// Convert times from seconds to "nominal" time units.
Bullet.prototype.lifeSpan = 3 * SECS_TO_NOMINALS;

Bullet.prototype.update = function (du) {
  this.cx += this.velX * du;
  this.cy += this.velY * du;
  this.lifeSpan -= du;

  this.wrapPosition();

  if (this.lifeSpan <= 0) return entityManager.KILL_ME_NOW;
};

Bullet.prototype.setPos = function (cx, cy) {
  this.cx = cx;
  this.cy = cy;
};

Bullet.prototype.getPos = function () {
  return { posX: this.cx, posY: this.cy };
};

Bullet.prototype.wrapPosition = function () {
  this.cx = util.wrapRange(this.cx, 0, g_canvas.width);
  this.cy = util.wrapRange(this.cy, 0, g_canvas.height);
};

Bullet.prototype.render = function (ctx) {
  const fadeThresh = Bullet.prototype.lifeSpan / 3;

  if (this.lifeSpan < fadeThresh);
    ctx.globalAlpha = this.lifeSpan / fadeThresh;

  g_sprites.bullet.drawWrappedCentredAt(ctx, this.cx, this.cy, this.rotation);

  ctx.globalAlpha = 1;
};
