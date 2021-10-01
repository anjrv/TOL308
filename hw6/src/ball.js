// ==========
// BALL STUFF
// ==========

function Ball(descr) {
  for (const property in descr) {
    this[property] = descr[property];
  }
}

Ball.prototype.update = function (du) {
  // Remember my previous position
  var prevX = this.cx;
  var prevY = this.cy;

  // Compute my provisional new position (barring collisions)
  var nextX = prevX + this.xVel * du;
  var nextY = prevY + this.yVel * du;

  // Bounce off of character
  // if (g_character.collidesWith(prevX, prevY, nextX, nextY, this.radius)) {
  //     this.xVel *= -1;
  // }

  if (this.yVel > 0) {
    if (g_character.hitsUp(prevX, prevY, nextX, nextY, this.radius)) {
      this.yVel *= -1;
    } else if (g_character.hitsLeft(prevX, prevY, nextX, nextY, this.radius)) {
      this.yVel *= -1;
    } else if (g_character.hitsRight(prevX, prevY, nextX, nextY, this.radius)) {
      this.yVel *= -1;
    }
  }

  // Bounce off edges
  if (
    nextY < 0 || // top edge
    nextY > g_canvas.height
  ) {
    // bottom edge
    this.yVel *= -1;
  }

  if (nextX < 0 || nextX > g_canvas.width) {
    this.xVel *= -1;
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
  this.xVel = -5;
  this.yVel = 4;
};

Ball.prototype.render = function (ctx) {
  fillCircle(ctx, this.cx, this.cy, this.radius);
};
