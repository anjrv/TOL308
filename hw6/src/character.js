// A generic constructor which accepts an arbitrary descriptor object
function Character(descr) {
  for (const property in descr) {
    this[property] = descr[property];
  }
}

// Add these properties to the prototype, where they will server as
// shared defaults, in the absence of an instance-specific overrides.

const IDLE = 0;
const RUNNING = 1;
const ATTACK_FRAMES = 6;

Character.prototype.keyframe = 0;
Character.prototype.attackFrames = 0;
Character.prototype.state = 0;
Character.prototype.attacking = false;
Character.prototype.direction = 'L';
Character.prototype.halfWidth = 24;
Character.prototype.halfHeight = 24;
// Use more charitable hit detection than the actual sprite
Character.prototype.xHitbox = 40;
Character.prototype.yHitbox = 30;
Character.prototype.vel = 0;
Character.prototype.maxVel = 10;
Character.prototype.GO_LEFT = 'A'.charCodeAt(0);
Character.prototype.GO_RIGHT = 'D'.charCodeAt(0);

const RUN_ACCEL = 0.4;
const RUN_DECAY = 0.25;

Character.prototype.setAttacking = function () {
  this.attackFrames = 0;
  this.attacking = true;
};

Character.prototype.hitsLeft = function (prevX, prevY, nextX, nextY, r) {
  const characterHead = this.cy - this.yHitbox * 0.5;
  const characterLeft = this.cx - this.xHitbox;

  if (nextY + r >= characterHead) {
    if (
      (nextX >= characterLeft && nextX < this.cx) ||
      (characterLeft > prevX && characterLeft + this.vel < nextX)
    ) {
      this.setAttacking();
      return true;
    }
  }

  // It's a miss!
  return false;
};

Character.prototype.hitsRight = function (prevX, prevY, nextX, nextY, r) {
  const characterHead = this.cy - this.yHitbox * 0.5;
  const characterRight = this.cx + this.xHitbox;

  if (nextY + r >= characterHead) {
    if ((nextX <= characterRight && nextX > this.cx) || 
    (characterRight < prevX && characterRight + this.vel > nextX)) {
      this.setAttacking();
      return true;
    }
  }

  // It's a miss!
  return false;
};

Character.prototype.hitsUp = function (prevX, prevY, nextX, nextY, r) {
  const characterHead = this.cy - this.yHitbox;
  const characterLeft = this.cx - this.xHitbox;
  const characterRight = this.cx + this.xHitbox;

  // This hit detection becomes really aggressive due to the Y checks
  // This is mainly to compensate for the slidy character movement
  if (nextX > characterLeft && nextX < characterRight) {
    if (nextY + r > characterHead) {
      this.setAttacking();
      return true;
    }
  }

  // It's a miss!
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
      change -= RUN_ACCEL * 2;
    } else {
      this.state = 1;
      change -= RUN_ACCEL;
    }
  }

  if (g_keys[this.GO_RIGHT] && this.vel < this.maxVel) {
    if (!this.attacking) {
      this.state = 1;
      this.direction = 'R';
    }
    if (this.vel < 0) {
      change += RUN_ACCEL * 2;
    } else {
      change += RUN_ACCEL;
    }
  }

  // If player is not pushing a direction make character slow down
  if (!g_keys[this.GO_RIGHT] && !g_keys[this.GO_LEFT]) {
    if (this.vel > 0) {
      change -= RUN_DECAY;
    }

    if (this.vel < 0) {
      change += RUN_DECAY;
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
  const dashChange = this.computeChange();
  this.applyChange(dashChange, du);
};

Character.prototype.render = function (ctx, renderFrame) {
  if (renderFrame === 0 && this.attackFrames++ === ATTACK_FRAMES)
    this.attacking = false;

  if (renderFrame === 0) {
    this.keyframe++;
  }

  let flip = true;
  if (this.direction === 'R') {
    flip = false;
  }

  const canvasWidth = g_canvas.clientWidth;

  // The center of the sprite is somewhat unintuitively positioned so we adjust
  if (this.cx + this.halfWidth * 2 - this.vel < 0) {
    this.cx += canvasWidth;
  } else if (this.cx + this.halfWidth + this.vel > canvasWidth) {
    this.cx -= canvasWidth;
  }

  // For all states render 3 copies for wrapping purposes (offset by the canvas width)
  let i = 0;
  if (this.attacking) {
    for (i = -i; i < 2; i++) {
      this.sprites.attack[this.attackFrames].drawCentredAt(
        ctx,
        this.cx + canvasWidth * i,
        this.cy,
        3,
        0,
        flip
      );
    }
  } else if (this.state === IDLE) {
    for (i = -1; i < 2; i++) {
      this.sprites.idle[this.keyframe % this.sprites.idle.length].drawCentredAt(
        ctx,
        this.cx + canvasWidth * i,
        this.cy,
        3,
        0,
        flip
      );
    }
  } else if (this.state === RUNNING) {
    for (i = -i; i < 2; i++) {
      this.sprites.run[this.keyframe % this.sprites.run.length].drawCentredAt(
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
