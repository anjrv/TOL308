// ===============
// CHARACTER STUFF
// ===============

// I recommend not reading any of this
// I have no idea what I'm doing with these keyframes

// A generic constructor which accepts an arbitrary descriptor object
function Character(descr) {
  for (const property in descr) {
    this[property] = descr[property];
  }
}

const IDLE = 0;
const RUNNING = 1;
const ATTACK_FRAMES = 6;

// Uhh... Some defined variables...
Character.prototype.keyframe = 0;
// Arguably this could be 1 variable called specialFrames
Character.prototype.deathFrames = 0;
Character.prototype.attackFrames = 0;
Character.prototype.state = 0;
// Health mechanic, cannot go past 3 with hearts
Character.prototype.health = 3;
Character.prototype.maxHealth = 3;
// Ideally attacking and dead would also be common state flags
// But they only run their animation once instead of looping
// Which makes it hard to use the flag in the same way
// ( Loop states simply go through their array repeatedly with modulo )
Character.prototype.attacking = false;
Character.prototype.isDead = false;
Character.prototype.direction = 'L';
// Assumed sprite size based on 3x scale ( 16px at 1x )
Character.prototype.halfWidth = 24;
Character.prototype.halfHeight = 24;
// Use more charitable hit detection than the actual sprite
Character.prototype.xHitbox = 40;
Character.prototype.yHitbox = 30;
// Don't care about jumping so we only track X-axis velocity
Character.prototype.vel = 0;
Character.prototype.maxVel = 10;
Character.prototype.runAccel = 0.4,
Character.prototype.runDecay = 0.25,
// Buttons
Character.prototype.GO_LEFT = 'A'.charCodeAt(0);
Character.prototype.GO_RIGHT = 'D'.charCodeAt(0);

Character.prototype.setAttacking = function () {
  this.attackFrames = 0;
  this.attacking = true;
};

// Left "rectangle"
Character.prototype.hitsLeft = function (prevX, prevY, nextX, nextY, r) {
  if (this.isDead) {
    return false;
  }

  const characterHead = this.cy - this.yHitbox * 0.8;
  const characterLeft = this.cx - this.xHitbox;

  if (nextY + r >= characterHead) {
    if (
      (nextX + r >= characterLeft && nextX < this.cx) ||
      (characterLeft > prevX && characterLeft + this.vel < nextX)
    ) {
      this.setAttacking();
      return true;
    }
  }

  return false;
};

// Right "rectangle"
Character.prototype.hitsRight = function (prevX, prevY, nextX, nextY, r) {
  if (this.isDead) {
    return false;
  }

  const characterHead = this.cy - this.yHitbox * 0.8;
  const characterRight = this.cx + this.xHitbox;

  if (nextY + r >= characterHead) {
    if (
      (nextX - r <= characterRight && nextX > this.cx) ||
      (characterRight < prevX && characterRight + this.vel > nextX)
    ) {
      this.setAttacking();
      return true;
    }
  }

  return false;
};

// Top "rectangle"
Character.prototype.hitsUp = function (prevX, prevY, nextX, nextY, r) {
  if (this.isDead) {
    return false;
  }

  const characterHead = this.cy - this.yHitbox;
  const characterLeft = this.cx - this.xHitbox;
  const characterRight = this.cx + this.xHitbox;

  // This hit detection becomes really aggressive due to the Y checks
  // This is mainly to compensate for the slidy character movement
  if (nextX + r > characterLeft && nextX - r < characterRight) {
    if (nextY + r > characterHead) {
      this.setAttacking();
      return true;
    }
  }

  return false;
};

// Character healing mechanic
Character.prototype.getsHeart = function (x, y) {
  if (this.isDead) {
    return false;
  }

  const characterHead = this.cy - this.yHitbox;
  const characterLeft = this.cx - this.xHitbox;
  const characterRight = this.cx + this.xHitbox;

  // Not gonna work too hard no this, character is a lot bigger than the heart
  // And the hearts move pretty slowly, just check whether its in the char box
  if (y > characterHead) {
    if (x > characterLeft && x < characterRight) {
      this.health =
        this.health < this.maxHealth ? this.health + 1 : this.maxHealth;

      return true;
    }
  }

  return false;
};

Character.prototype.computeChange = function () {
  let change = 0;

  // Adjust according to pushed direction ( Attack animation overrides )
  if (g_keys[this.GO_LEFT] && this.vel > -this.maxVel) {
    if (!this.attacking) {
      this.state = 1;
      this.direction = 'L';
    }
    if (this.vel > 0) {
      change -= this.runAccel * 4;
    } else {
      this.state = 1;
      change -= this.runAccel;
    }
  }

  if (g_keys[this.GO_RIGHT] && this.vel < this.maxVel) {
    if (!this.attacking) {
      this.state = 1;
      this.direction = 'R';
    }
    if (this.vel < 0) {
      change += this.runAccel * 4;
    } else {
      change += this.runAccel;
    }
  }

  // If player is not pushing a direction make character slow down
  if (!g_keys[this.GO_RIGHT] && !g_keys[this.GO_LEFT]) {
    if (this.vel > 0) {
      change -= this.runDecay;
    }

    if (this.vel < 0) {
      change += this.runDecay;
    }
  }

  return change;
};

Character.prototype.applyChange = function (change, du) {
  this.vel = (this.vel + change * du + this.vel) / 2;

  // Why are you running
  if (Math.abs(this.vel) < 0.1) {
    this.vel = 0;

    if (!this.attacking) this.state = IDLE;
  }

  this.cx += this.vel * du;
};

Character.prototype.update = function (du) {
  if (this.health < 1 && !this.isDead) {
    if (g_sounds) oofSound.play();
    this.isDead = true;
  }

  if (this.isDead) {
    return;
  }

  const dashChange = this.computeChange();
  this.applyChange(dashChange, du);
};

Character.prototype.drawDead = function (ctx, renderFrame, canvasWidth, flip) {
  if (this.deathFrames < this.sprites.death.length - 1) {
    for (i = -1; i < 2; i++) {
      this.sprites.death[this.deathFrames].drawCentredAt(
        ctx,
        this.cx + canvasWidth * i,
        this.cy,
        3,
        0,
        flip
      );
    }

    if (renderFrame === 0) {
      this.deathFrames++;
    }
  } else {
    for (i = -1; i < 2; i++) {
      this.sprites.death[this.sprites.death.length - 1].drawCentredAt(
        ctx,
        this.cx + canvasWidth * i,
        this.cy,
        3,
        0,
        flip
      );
    }
  }
};

Character.prototype.wrapPosition = function (canvasWidth) {
  if (this.cx + this.halfWidth - this.vel < 0) {
    this.cx += canvasWidth;
  } else if (this.cx + this.halfWidth + this.vel > canvasWidth) {
    this.cx -= canvasWidth;
  }
};

Character.prototype.showHealth = function (ctx) {
  for (let i = 1; i <= this.health; i++) {
    g_hearts.sprites[0].drawCentredAt(
      ctx,
      g_hearts.sprites[0].width * 2.5 * i,
      g_hearts.sprites[0].height * 2.5,
      2,
      0,
      false
    );
  }
};

Character.prototype.drawAttacking = function (ctx, canvasWidth, flip) {
  for (let i = -1; i < 2; i++) {
    this.sprites.attack[this.attackFrames].drawCentredAt(
      ctx,
      this.cx + canvasWidth * i,
      this.cy,
      3,
      0,
      flip
    );
  }
};

Character.prototype.drawIdle = function (ctx, canvasWidth, flip) {
  for (let i = -1; i < 2; i++) {
    this.sprites.idle[this.keyframe % this.sprites.idle.length].drawCentredAt(
      ctx,
      this.cx + canvasWidth * i,
      this.cy,
      3,
      0,
      flip
    );
  }
};

Character.prototype.drawRunning = function (ctx, canvasWidth, flip) {
  for (let i = -1; i < 2; i++) {
    this.sprites.run[this.keyframe % this.sprites.run.length].drawCentredAt(
      ctx,
      this.cx + canvasWidth * i,
      this.cy,
      3,
      0,
      flip
    );
  }
};

Character.prototype.render = function (ctx, renderFrame) {
  const canvasWidth = g_canvas.clientWidth;

  let flip = true;
  if (this.direction === 'R') {
    flip = false;
  }

  if (this.isDead) {
    // Don't need to go further if dead
    this.drawDead(ctx, renderFrame, canvasWidth, flip);

    return;
  }

  // This entire renderFrame business is scuffed, pay no mind
  if (renderFrame === 0 && this.attackFrames++ === ATTACK_FRAMES)
    this.attacking = false;

  if (renderFrame === 0) {
    this.keyframe++;
  }

  this.wrapPosition(canvasWidth);
  this.showHealth(ctx);

  // Show a sprite based on state
  if (this.attacking) {
    this.drawAttacking(ctx, canvasWidth, flip);
  } else if (this.state === IDLE) {
    this.drawIdle(ctx, canvasWidth, flip);
  } else if (this.state === RUNNING) {
    this.drawRunning(ctx, canvasWidth, flip);
  }
};
