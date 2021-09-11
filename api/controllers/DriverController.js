/**
 * DriverController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const moment = require("moment-timezone");
module.exports = {
  findOne: async (req, res)=>{

    const {id} = req.params;
    const now = moment.now();
    const past = moment().subtract(30, 'seconds').format("x")

    const driver = await Driver
      .find({id})
      .populate(`geoLocation`, {
        where:{
          createdAt: {
            '>=': past,
            '<=': now
          }
        },
        limit: 10,
        sort: `id DESC`
      });

    // if(driver.active){
    //   console.log(driver.geoLocation);
    // }

    res.send(driver);
  }

};

