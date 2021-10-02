// ==========
// WALL STUFF
// ==========

function Wall(descr) {
  for (const property in descr) {
    this[property] = descr[property];
  }
}

Wall.prototype.initializeTiles = function () {
  let tiles = [];
  const xTiles = g_canvas.width / this.tileWidth;
  const yTiles = g_canvas.height / this.tileHeight;

  this.topEdge = Math.floor(yTiles * 0.1);
  this.bottomEdge = Math.ceil(yTiles * 0.4);
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

Wall.prototype.checkHit = function (row, col, prevX, prevY) {
  if (this.tiles[row] && this.tiles[row][col]) {
    if (this.tiles[row][col] === 'T' || this.tiles[row][col] === 'S') {
      if (this.tiles[row][col] === 'S') {
        g_hearts.hearts.push({ cx: prevX, cy: prevY });
      }

      this.tiles[row][col] = 'F';

      if (g_sounds) glassSounds[randomIntFromInterval(0, 1)].play();

      return true;
    }
  }

  return false;
};

Wall.prototype.collidesWith = function (prevX, prevY, nextX, nextY, r) {
  // Inside the wall Y-axis
  if (
    nextY + r < this.bottomEdge * this.tileHeight + this.tileHeight &&
    nextY - r > this.topEdge * this.tileHeight
  ) {
    let rows = [];
    let columns = [];

    if (nextY < prevY) {
      rows.push(Math.ceil((nextY - r) / this.tileHeight));
    } else {
      rows.push(Math.floor((nextY + r) / this.tileHeight));
    }

    if (nextX < prevX) {
      columns.push(Math.ceil((nextX - r) / this.tileWidth));
    } else {
      columns.push(Math.floor((nextX + r) / this.tileWidth));
    }

    if (this.checkHit(rows[0], columns[0])) return true;

    return false;
  }
};

Wall.prototype.update = function (du) {
  if (!this.tiles) {
    this.initializeTiles();
  }
};

Wall.prototype.render = function (ctx, renderFrame) {
  ctx.save();

  const regularGradient = ctx.createLinearGradient(
    0,
    0,
    this.tileWidth,
    this.tileHeight
  );
  regularGradient.addColorStop(0, '#302b3c');
  regularGradient.addColorStop(1, 'rgba(45, 40, 55, 0.8');

  const specialGradient = ctx.createLinearGradient(
    0,
    0,
    this.tileWidth,
    this.tileHeight
  );
  specialGradient.addColorStop(0, '#302b3c');
  specialGradient.addColorStop(1, 'rgba(216, 59, 46, 0.8');

  for (let i = this.topEdge; i <= this.bottomEdge; i++) {
    for (let j = 0; j < this.tiles[this.topEdge].length; j++) {
      if (this.tiles[i][j] === 'T') {
        roundedRect(
          ctx,
          j * this.tileWidth,
          i * this.tileHeight,
          this.tileWidth,
          this.tileHeight,
          8,
          regularGradient,
          '#b482ae'
        );
      } else if (this.tiles[i][j] === 'S') {
        roundedRect(
          ctx,
          j * this.tileWidth,
          i * this.tileHeight,
          this.tileWidth,
          this.tileHeight,
          8,
          specialGradient,
          '#b482ae'
        );
      }
    }
  }
  ctx.restore();
};
