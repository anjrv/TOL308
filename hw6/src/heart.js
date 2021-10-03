// ===========
// HEART STUFF
// ===========

function Hearts(descr) {
  for (const property in descr) {
    this[property] = descr[property];
  }
}

Hearts.prototype.keyframe = 0;

const FALL_RATE = 2;

Hearts.prototype.update = function (du) {
  // Loop backwards to be able to splice
  for (let i = this.hearts.length - 1; i >= 0; i--) {
    this.hearts[i].cy += FALL_RATE * du;
    if (
      g_character.getsHeart(this.hearts[i].cx, this.hearts[i].cy) ||
      this.hearts[i].cy > g_canvas.height
    ) {
      // Cut out expired hearts
      this.hearts.splice(i, 1);
    }
  }
};

Hearts.prototype.render = function (ctx, renderFrame) {
  if (renderFrame === 0) {
    this.keyframe++;
  }

  // Not really gonna make a specific draw function
  // There's only one thing that can even happen here
  for (let i = 0; i < this.hearts.length; i++) {
    // Loop the sprite array infinitely using modulo
    this.sprites[this.keyframe % this.sprites.length].drawCentredAt(
      ctx,
      this.hearts[i].cx,
      this.hearts[i].cy,
      2,
      0,
      false
    );
  }
};
