// ===============
// EXPLOSION STUFF
// ===============

function Explosions(descr) {
  for (const property in descr) {
    this[property] = descr[property];
  }
}

const EXPLOSION_FRAMES = 4;

Explosions.prototype.render = function (ctx, renderFrame) {
  let scale = 2;

  if (g_wall.tileWidth > 32) scale = 3;

  for (let i = this.explosions.length - 1; i >= 0; i--) {
    if (this.explosions[i].frame > EXPLOSION_FRAMES) {
      this.explosions.splice(i, 1);
    } else {
      this.sprites[this.explosions[i].frame].drawCentredAt(
        ctx,
        this.explosions[i].cx,
        this.explosions[i].cy,
        scale,
        0,
        false
      );

      if (renderFrame === 0) {
        this.explosions[i].frame++;
      }
    }
  }
};
