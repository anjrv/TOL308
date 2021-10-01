// ==========
// BALL STUFF
// ==========

function Ball(descr) {
  for (const property in descr) {
    this[property] = descr[property];
  }
}

Ball.prototype.maxYVel = 10;
Ball.prototype.maxXVel = 8;
Ball.prototype.minYVel = 4;
Ball.prototype.minXVel = 5;

Ball.prototype.update = function (du) {
  // Remember my previous position
  const prevX = this.cx;
  const prevY = this.cy;

  // Compute my provisional new position (barring collisions)
  const nextX = prevX + this.xVel * du;
  const nextY = prevY + this.yVel * du;

  // Bounce off of character
  // if (g_character.collidesWith(prevX, prevY, nextX, nextY, this.radius)) {
  //     this.xVel *= -1;
  // }

  if (this.yVel > 0) {
    if (g_character.hitsLeft(prevX, prevY, nextX, nextY, this.radius)) {
      this.yVel *= -0.95;
      if (this.xVel > 0) {
        this.xVel *= -0.95;
      } else {
        this.xVel *= -0.5 * g_character.vel;
      }
    } else if (g_character.hitsRight(prevX, prevY, nextX, nextY, this.radius)) {
      this.yVel *= -0.95;
      if (this.xVel < 0) {
        this.xVel *= -0.95;
      } else {
        this.xVel += 0.5 * g_character.vel;
      }
    } else if (g_character.hitsUp(prevX, prevY, nextX, nextY, this.radius)) {
      this.yVel *= -1.2;
    }
  }

  // Bounce off edges
  if (
    nextY < 0 ||
    nextY > g_canvas.height
  ) {
    this.yVel *= -1;
  }

  // Sides
  if (nextX < 0 || nextX > g_canvas.width) {
    this.xVel *= -1;
  }

  if (Math.abs(this.xVel) > this.maxXVel) {
    this.xVel = this.xVel < 0 ? -this.maxXVel : this.maxXVel;
  }

  if (Math.abs(this.yVel) > this.maxYVel) {
    this.yVel = this.yVel < 0 ? -this.maxYVel : this.maxYVel;
  }

  // *Actually* update my position
  // ...using whatever velocity I've ended up with
  //
  this.cx += this.xVel * du;
  this.cy += this.yVel * du;
};

Ball.prototype.reset = function () {
  this.cx = 300;
  this.cy = 100;
  this.xVel = -this.minXVel;
  this.yVel = this.minYVel;
};

Ball.prototype.render = function (ctx) {
  fillCircle(ctx, this.cx, this.cy, this.radius);
};
