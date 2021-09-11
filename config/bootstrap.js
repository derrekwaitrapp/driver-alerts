/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

class Accelerometer {
  constructor() {}
  direction(){
    return 'N';
  }
}

class GPS {
  constructor() {
    //https://www.google.com/maps/@36.0739127,-115.1871686,17z
    this.fakeRoute = [

      // Normal Route
      {coordinates: [36.07260417352472, -115.19002256575678]},
      {coordinates: [36.07224862841272, -115.190001108086], description: `Starting Route - Driving`},
      {coordinates: [36.07282964032391, -115.190001108086]},
      {coordinates: [36.07319385455726, -115.19003329459215]},
      {coordinates: [36.07358408222138, -115.18999037925062]},
      {coordinates: [36.07352338026748, -115.18925008960889]},

      // Long Stop - Should trigger alert
      {coordinates: [36.07180207957854, -115.18992697033393]},
      {coordinates: [36.07180207957854, -115.18992697033393], description: `Stopped - Should begin to start long stop detection`},
      {coordinates: [36.07180207957854, -115.18992697033393]},
      {coordinates: [36.07180207957854, -115.18992697033393]},
      {coordinates: [36.07180207957854, -115.18992697033393]},
      {coordinates: [36.07180207957854, -115.18992697033393]},
      {coordinates: [36.07180207957854, -115.18992697033393], description: `Long Stop - Should be detected`},
      {coordinates: [36.07180207957854, -115.18992697033393]},
      {coordinates: [36.07180207957854, -115.18992697033393]},

      // Short stop - Shouldn't trigger alert
      {coordinates: [36.07348869341562, -115.18885312269957]},
      {coordinates: [36.07348869341562, -115.18885312269957], description: `Stopped - but only for a short time. Should not trigger long stop`},
      {coordinates: [36.07348869341562, -115.18885312269957]},
      {coordinates: [36.07348869341562, -115.18885312269957]},
      {coordinates: [36.07348869341562, -115.18885312269957]},

      // Normal Route
      {coordinates: [36.07348869341562, -115.18882093619342], description: `Driving - Continuing route`},
      {coordinates: [36.07344533482931, -115.18847761346103]},
      {coordinates: [36.073436663109156, -115.18815574839942]},
      {coordinates: [36.07341931966603, -115.18782315450242]},
      {coordinates: [36.073150495808406, -115.18785534100857]},
      {coordinates: [36.07276026599299, -115.18781242566703]},

      // Long Stop - Should trigger alert
      {coordinates: [36.07244808074663, -115.18784461217321]},
      {coordinates: [36.07244808074663, -115.18784461217321], description: `Stopped - Should begin to start long stop detection`},
      {coordinates: [36.07244808074663, -115.18784461217321]},
      {coordinates: [36.07244808074663, -115.18784461217321]},
      {coordinates: [36.07244808074663, -115.18784461217321]},
      {coordinates: [36.07244808074663, -115.18784461217321], description: `Long Stop - Should be detected`},
      {coordinates: [36.07244808074663, -115.18784461217321]},
      {coordinates: [36.07244808074663, -115.18784461217321]},

      // Normal Route
      {coordinates: [36.07210987866473, -115.18784461217321], description: `Driving - Continuing route`},
      {coordinates: [36.071832378434465, -115.18787679867935]},
      {coordinates: [36.071598236853646, -115.18793044285627]},
      {coordinates: [36.07161522376756, -115.18830873227309]},
      {coordinates: [36.07172563861861, -115.18869752972925]},
      {coordinates: [36.07172563861861, -115.18898124679188]},
      {coordinates: [36.07179358614222, -115.18963274523196]},
      {coordinates: [36.07204838883294, -115.19001103464875], description: `Ending Route`}

    ];
    this.arrayLoc = 0;
  }
  latitude(){
    return this.fakeRoute[this.arrayLoc].coordinates[0];
  }
  longitude(){
    return this.fakeRoute[this.arrayLoc].coordinates[1];
  }
  description(){
    return (this.fakeRoute[this.arrayLoc].hasOwnProperty(`description`) ? this.fakeRoute[this.arrayLoc].description : ``);
  }
  async getLocationUpdate(){
    if(this.arrayLoc < this.fakeRoute.length-1){
      this.arrayLoc++;
    }else{
      this.arrayLoc = 0;
      await Alert.destroy({});
    }
  }
}

class Phone {
  constructor(driverId = 1){
    this.driverId = driverId;
    this.accelerometer = new Accelerometer();
    this.gps = new GPS();
    sails.log.info(`Fake Phone Started.`);
    setInterval(this.onUpdate.bind(this), 5000);
  }
  async onUpdate(){
    await this.gps.getLocationUpdate();
    sails.request(`POST /GeoLocation`, {driver: this.driverId, coordinates: [this.gps.latitude(), this.gps.longitude()], description: this.gps.description()}, (err, res)=>{
      if(err){
        sails.log.error(err);
      }else{
        if(this.gps.description()) {
          sails.log.info(``);
          sails.log.info(`###########`, this.gps.description(), `###########`);
          sails.log.info(``);
        }
        sails.log.info("Driver Id:", res.body.driver.id, "Route Coordinates:", res.body.coordinates);
      }
    });
  }
}

module.exports.bootstrap = async function() {

  /**
   * Check if any drivers exist in the DB
   */
  if (await Driver.count() > 0) {
    const driver = await Driver.find({}).limit(1);
    /**
     * Create fake User/Phone
     */
    new Phone(driver[0].id);
    return;
  }

  /**
   * Seed my driver if it does not exist
   */
  const driver = await Driver
    .create( { active: true } )
    .fetch();

  sails.log.info(`Driver data seeded.`);
  new Phone(driver.id);
};
