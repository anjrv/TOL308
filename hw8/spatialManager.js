/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

'use strict';

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

const spatialManager = {
  // "PRIVATE" DATA

  _nextSpatialID: 1, // make all valid IDs non-falsey (i.e. don't start at 0)

  _entities: [],

  // "PRIVATE" METHODS
  //
  // <none yet>

  // PUBLIC METHODS

  getNewSpatialID: function () {
    return this._nextSpatialID++;
  },

  register: function (entity) {
    const spatialID = entity.getSpatialID();
    this._entities[spatialID] = entity;
  },

  unregister: function (entity) {
    const spatialID = entity.getSpatialID();
    this._entities[spatialID] = null;
  },

  findEntityInRange: function (posX, posY, radius) {
    for (let ID in this._entities) {
      const e = this._entities[ID];

      if (e) {
        const ePos = e.getPos();
        const eRad = e.getRadius();

        if (
          Math.pow(posX - ePos.posX, 2) + Math.pow(posY - ePos.posY, 2) <=
          Math.pow(radius + eRad, 2)
        ) {
          return e;
        }
      }
    }

    return false;
  },

  render: function (ctx) {
    const oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = 'red';

    for (let ID in this._entities) {
      const e = this._entities[ID];
      if (e) {
        const ePos = e.getPos();
        const eRad = e.getRadius();
        util.strokeCircle(ctx, ePos.posX, ePos.posY, eRad);
      }
    }
    ctx.strokeStyle = oldStyle;
  },
};
