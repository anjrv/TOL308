// ====
// ROCK
// ====

'use strict';

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

function Rock() {
  // Rock randomisation
  this.cx = util.randRange(0, g_canvas.width); 
  this.cy = util.randRange(0, g_canvas.height);
  this.rotation = 0;

  const MIN_SPEED = 20,
    MAX_SPEED = 70;

  const xRatio = Math.random() * util.randRange(MIN_SPEED, MAX_SPEED);
  const xDir = Math.random() < 0.5 ? -1 : 1;
  const yDir = Math.random() < 0.5 ? -1 : 1;

  this.velX = xRatio * xDir / SECS_TO_NOMINALS;
  this.velY = (1 - xRatio) * yDir / SECS_TO_NOMINALS;

  const MIN_ROT_SPEED = 0.5,
    MAX_ROT_SPEED = 2.5;

  this.velRot = util.randRange(MIN_ROT_SPEED, MAX_ROT_SPEED) / SECS_TO_NOMINALS;
}

Rock.prototype.update = function (du) {
  this.cx += this.velX * du;
  this.cy += this.velY * du;

  this.rotation += this.velRot * du;
  this.rotation = util.wrapRange(this.rotation, 0, consts.FULL_CIRCLE);

  this.wrapPosition();
};

Rock.prototype.setPos = function (cx, cy) {
  this.cx = cx;
  this.cy = cy;
};

Rock.prototype.getPos = function () {
  return { posX: this.cx, posY: this.cy };
};

Rock.prototype.wrapPosition = function () {
  this.cx = util.wrapRange(this.cx, 0, g_canvas.width);
  this.cy = util.wrapRange(this.cy, 0, g_canvas.height);
};

Rock.prototype.render = function (ctx) {
  g_sprites.rock.drawWrappedCentredAt(ctx, this.cx, this.cy, this.rotation);
};
