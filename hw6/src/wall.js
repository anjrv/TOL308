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
        if (Math.random() < 0.1) {
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

  this.tiles = tiles;
};

// Check whether in a populated array index
// Uses row and col sort of like hashes in a hashtable
// This way we don't check every block on every iteration
Wall.prototype.checkHit = function (row, col, prevX, prevY) {
  if (this.tiles[row] && this.tiles[row][col]) {
    if (this.tiles[row][col] === 'T' || this.tiles[row][col] === 'S') {
      if (this.tiles[row][col] === 'S') {
        g_hearts.hearts.push({ cx: prevX, cy: prevY });
      }

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
    let rows = [];
    let columns = [];

    if (nextY < prevY) {
      rows.push(Math.floor((nextY - r) / this.tileHeight));
    } else {
      rows.push(Math.floor((nextY + r) / this.tileHeight));
    }

    if (nextX < prevX) {
      columns.push(Math.floor((nextX - r) / this.tileWidth));
    } else {
      columns.push(Math.floor((nextX + r) / this.tileWidth));
    }

    if (this.checkHit(rows[0], columns[0], prevX, prevY)) return true;

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

  const specialGradient = ctx.createLinearGradient(
    0,
    0,
    this.tileWidth,
    this.tileHeight
  );
  specialGradient.addColorStop(0, '#302b3c');
  specialGradient.addColorStop(1, 'rgba(216, 59, 46, 0.6');

  for (let i = this.topEdge; i <= this.bottomEdge; i++) {
    for (let j = 0; j < this.tiles[this.topEdge].length; j++) {
      const tile = this.tiles[i][j];
      if (tile === 'T' || tile === 'S') {
        roundedRect(
          ctx,
          j * this.tileWidth,
          i * this.tileHeight,
          this.tileWidth,
          this.tileHeight,
          8,
          (gradient = tile === 'T' ? regularGradient : specialGradient),
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
      // The rectangle stroke actually makes this annoying, try adjust by expanding by a pixel
      const x = garbage[i].x * this.tileWidth - 1;
      const y = garbage[i].y * this.tileHeight - 1;
      ctx.clearRect(x, y, this.tileWidth + 2, this.tileHeight + 2);
    }

    garbage = [];
  }
};
