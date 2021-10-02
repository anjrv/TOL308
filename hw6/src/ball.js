// ==========
// BALL STUFF
// ==========

function Ball(descr) {
  for (const property in descr) {
    this[property] = descr[property];
  }
}

const HIT_FRAMES = 5;

Ball.prototype.hits = [];
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

  let gotHit = false;

  if (g_wall.collidesWith(prevX, prevY, nextX, nextY, this.radius)) {
    gotHit = true;
    this.yVel *= -1;
  }

  if (this.yVel > 0) {
    if (g_character.hitsLeft(prevX, prevY, nextX, nextY, this.radius)) {
      this.yVel *= -0.95;
      gotHit = true;
      if (this.xVel > 0) {
        this.xVel *= -0.95;
      } else {
        this.xVel *= -0.5 * g_character.vel;
      }
    } else if (g_character.hitsRight(prevX, prevY, nextX, nextY, this.radius)) {
      this.yVel *= -0.95;
      gotHit = true;
      if (this.xVel < 0) {
        this.xVel *= -0.95;
      } else {
        this.xVel += 0.5 * g_character.vel;
      }
    } else if (g_character.hitsUp(prevX, prevY, nextX, nextY, this.radius)) {
      gotHit = true;
      this.yVel *= -1.05;
    }
  }

  // Bounce off edges
  if (nextY < 0 || nextY > g_canvas.height) {
    if (nextY > g_canvas.height)
      g_character.health--;

    gotHit = true;
    this.yVel *= -1;
  }

  // Sides
  if (nextX < 0 || nextX > g_canvas.width) {
    gotHit = true;
    this.xVel *= -1;
  }

  // Clamp between min and max
  if (Math.abs(this.xVel) > this.maxXVel) {
    this.xVel = this.xVel < 0 ? -this.maxXVel : this.maxXVel;
  }

  if (Math.abs(this.yVel) > this.maxYVel) {
    this.yVel = this.yVel < 0 ? -this.maxYVel : this.maxYVel;
  }

  // *Actually* update my position
  // ...using whatever velocity I've ended up with
  this.cx += this.xVel * du;
  this.cy += this.yVel * du;

  // Push a hit location
  if (gotHit) {
    this.gotHit(prevX, prevY);
  }
};

Ball.prototype.gotHit = function (cx, cy) {
  this.hits.push([cx, cy, 0]);
};

Ball.prototype.reset = function () {
  this.cx = 300;
  this.cy = 100;
  this.xVel = -this.minXVel;
  this.yVel = this.minYVel;
};

Ball.prototype.render = function (ctx, renderFrame) {
  const oldStyle = ctx.fillStyle;
  const gradient = ctx.createRadialGradient(
    this.cx,
    this.cy,
    this.radius - this.radius / 1.2,
    this.cx,
    this.cy,
    this.radius
  );

  gradient.addColorStop(0, '#368ecc');
  gradient.addColorStop(1, '#223582');

  ctx.fillStyle = gradient;
  fillCircle(ctx, this.cx, this.cy, this.radius);
  ctx.fillStyle = oldStyle;

  // Iterate backwards through hit locations
  // Expired hits are spliced out
  for (let i = this.hits.length - 1; i >= 0; i--) {
    const hitx = this.hits[i][0];
    const hity = this.hits[i][1];
    const frame = this.hits[i][2];

    if (renderFrame === 0) {
      this.hits[i][2]++;
    }

    if (frame === HIT_FRAMES - 1) {
      this.hits.splice(i, 1);
    } else {
      this.sprites[frame].drawCentredAt(ctx, hitx, hity, 1, 0, false);
    }
  }
};
