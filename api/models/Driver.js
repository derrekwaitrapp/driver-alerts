/**
 * Driver.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    geoLocation: {
      collection: `GeoLocation`,
      via: `driver`
    },
    active: {
      type: `boolean`,
      defaultsTo: false
    }
  }
};

