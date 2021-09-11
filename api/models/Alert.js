/**
 * Alert.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    description: {
      type: `string`
    },
    driver:{
      model: `driver`
    },
    coordinates: {
      type: `json`
    },
    responded: {
      type: `boolean`,
      defaultsTo: false
    }
  }
};

