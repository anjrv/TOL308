// ==========
// WALL STUFF
// ==========

function Wall(descr) {
  for (const property in descr) {
    this[property] = descr[property];
  }
}

garbage = [];

Wall.prototype.initializeTiles = function () {
  let tiles = [];

  // Some arbitrary Y-axis definition of the wall
  // Do not fill entire screen.
  const xTiles = g_canvas.width / this.tileWidth;
  const yTiles = g_canvas.height / this.tileHeight;
  this.topEdge = Math.floor(yTiles * 0.1);
  this.bottomEdge = Math.ceil(yTiles * 0.4);

  // Generate wall array
  for (let i = this.topEdge; i <= this.bottomEdge; i++) {
    const row = [];
    for (let j = 0; j < xTiles; j++) {
      if (Math.random() < this.blockFrequency) {
        const roll = Math.random();
        if (roll < 0.05) {
          row.push('E');
        } else if (roll < 0.2) {
          row.push('S');
        } else {
          row.push('T');
        }
      } else {
        row.push('F');
      }
    }
    tiles[i] = row;
  }

  // Populate one random ball duplication tile
  const dupeY = randomIntFromInterval(this.topEdge, this.bottomEdge);
  const dupeX = randomIntFromInterval(0, xTiles - 1);
  tiles[dupeY][dupeX] = 'B';
  this.tiles = tiles;
};

resolveTag = function (tag, row, col, prevX, prevY) {
  if (tag === 'T') return;

  if (tag === 'S') {
    g_hearts.hearts.push({ cx: prevX, cy: prevY });
  } else if (tag === 'B') {
    // Wroom
    g_character.maxVel *= 1.5;
    g_character.runAccel *= 1.5;
    g_character.runDecay *= 1.5;

    const dupe_ball = new Ball({
      cx: prevX,
      cy: prevY,
      radius: 8,

      xVel: -g_ball.xVel,
      yVel: -g_ball.yVel,
    });

    g_balls.push(dupe_ball);

    console.log(g_balls);
  } else if (tag === 'E') {
    for (let i = -1; i <= 2; i++) {
      for (let j = -1; j <= 2; j++) {
        garbage.push({ x: col - j, y: row - i });
      }
    }

    g_explosions.explosions.push({ cx: prevX, cy: prevY, frame: 0 });
  }
};

// Check whether in a populated array index
// Uses row and col sort of like hashes in a hashtable
// This way we don't check every block on every iteration
Wall.prototype.checkHit = function (row, col, prevX, prevY) {
  if (this.tiles[row] && this.tiles[row][col]) {
    if (this.tiles[row][col] !== 'F') {
      const tag = this.tiles[row][col];
      resolveTag(tag, row, col, prevX, prevY);

      this.tiles[row][col] = 'F';
      garbage.push({ x: col, y: row });

      if (g_sounds) glassSounds[randomIntFromInterval(0, 1)].play();

      return true;
    }
  }

  return false;
};

// Create row and column indexes based on ball direction then check hit
// Note, theres no actual hit detection, this is basically a 2d hash table
Wall.prototype.collidesWith = function (prevX, prevY, nextX, nextY, r) {
  // Inside the wall Y-axis ish
  if (
    nextY + r < this.bottomEdge * this.tileHeight + this.tileHeight &&
    nextY - r > this.topEdge * this.tileHeight
  ) {
    let row;
    let column;

    if (nextY < prevY) {
      row = Math.floor((nextY - r) / this.tileHeight);
    } else {
      row = Math.floor((nextY + r) / this.tileHeight);
    }

    if (nextX < prevX) {
      column = Math.floor((nextX - r) / this.tileWidth);
    } else {
      column = Math.floor((nextX + r) / this.tileWidth);
    }

    if (this.checkHit(row, column, prevX, prevY)) return true;

    return false;
  }
};

Wall.prototype.populate = function () {
  const ctx = g_wall_ctx;

  const regularGradient = ctx.createLinearGradient(
    0,
    0,
    this.tileWidth,
    this.tileHeight
  );
  regularGradient.addColorStop(0, '#302b3c');
  regularGradient.addColorStop(1, 'rgba(45, 40, 55, 0.6');

  const heartGradient = ctx.createLinearGradient(
    0,
    0,
    this.tileWidth,
    this.tileHeight
  );
  heartGradient.addColorStop(0, '#302b3c');
  heartGradient.addColorStop(1, 'rgba(216, 59, 46, 0.6');

  const explosionGradient = ctx.createLinearGradient(
    0,
    0,
    this.tileWidth,
    this.tileHeight
  );
  explosionGradient.addColorStop(0, '#302b3c');
  explosionGradient.addColorStop(1, 'rgba(184, 230, 252, 0.6');

  const ballGradient = ctx.createLinearGradient(
    0,
    0,
    this.tileWidth,
    this.tileHeight
  );
  ballGradient.addColorStop(0, '#302b3c');
  ballGradient.addColorStop(1, 'rgba(45, 102, 170, 0.6');

  for (let i = this.topEdge; i <= this.bottomEdge; i++) {
    for (let j = 0; j < this.tiles[this.topEdge].length; j++) {
      const tile = this.tiles[i][j];
      if (tile !== 'F') {
        let gradient;

        if (tile === 'T') {
          gradient = regularGradient;
        } else if (tile === 'B') {
          gradient = ballGradient;
        } else if (tile === 'E') {
          gradient = explosionGradient;
        } else {
          gradient = heartGradient;
        }

        roundedRect(
          ctx,
          j * this.tileWidth,
          i * this.tileHeight,
          this.tileWidth,
          this.tileHeight,
          8,
          gradient,
          '#b482ae'
        );
      }
    }
  }
};

// Wall doesn't move so updates mostly done through collision
// Mainly just used to initialize wall after initial load
Wall.prototype.update = function (du) {
  if (!this.tiles) {
    this.initializeTiles();
    this.populate();
  }
};

// Instead of drawing the M*N array every time we don't redraw it at all
// We just cull out rectangles that have been marked as garbage
//
// In general this means the wall "rendering" is now
// O(1) instead of O(M*N)
// Based on the size of the garbage, which in most cases should be 1
Wall.prototype.cull = function (ctx) {
  if (garbage) {
    for (let i = 0; i < garbage.length; i++) {
      if (garbage[i].y && garbage[i].x) {
        // The rectangle stroke actually makes this annoying, try adjust by expanding by a pixel
        const x = garbage[i].x * this.tileWidth - 1;
        const y = garbage[i].y * this.tileHeight - 1;
        ctx.clearRect(x, y, this.tileWidth + 2, this.tileHeight + 2);
      }
    }

    garbage = [];
  }
};
