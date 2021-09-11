/**
 * GeoLocation.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const moment = require("moment-timezone");

module.exports = {

  attributes: {
    coordinates: {
      type: `json`
    },
    description: {
      type: `text`,
      defaultsTo: ``
    },
    driver:{
      model: `driver`
    }
  },
  afterCreate: async function (geoLocation, proceed){

    // todo add driverInterval as an api settings param
    const driverInterval = 5000 / 1000; // Drivers phone will send an update every 5 seconds so we will use that the determine how many results we need to check over 30 seconds
    const alertThresholdSeconds = 30;
    const geoLocationLimit = alertThresholdSeconds / driverInterval;

    const now = moment.now();
    const past = moment().subtract(alertThresholdSeconds, 'seconds').format("x")
    const geoLocations = await GeoLocation
      .find({driver: geoLocation.driver})
      .where({
        createdAt: {
          '>=': past,
          '<=': now
        }
      })
      .sort(`id DESC`)
      .limit(geoLocationLimit);

    sails.log.silly(geoLocations);

    if(geoLocations.length === geoLocationLimit){
      const locations = _.groupBy(geoLocations, `coordinates`);
      let locationsCount = 0;
      for(const location in locations){
        locationsCount++;
      }
      if(locationsCount === 1){
        sails.log.debug(`Found Long Stop for driver id: ${geoLocation.driver} checking if alert has already been sent`)
        const alertAlreadyExists = await Alert.findOne({
          driver: geoLocation.driver,
          coordinates: geoLocation.coordinates
        });
        if(!alertAlreadyExists){
          sails.request(`POST /alert`, {
            driver: geoLocation.driver,
            coordinates: geoLocation.coordinates,
            description: `Long Stop Detected - driver has been stationary for ${alertThresholdSeconds} seconds or more`
          }, (err, res)=>{
            if(err){
              console.error(err);
            }else{
              sails.log.silly(res.body);
            }
          });
        }else{
          sails.log.debug(`Long Stop alert already sent for driver id: ${geoLocation.driver}`)
        }
      }
    }
    proceed();
  }
};

