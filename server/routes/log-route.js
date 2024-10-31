let express = require('express');
let os = require('os');
let route = express.Router();
let fs = require('fs');
let util = require('../service/util');
let _ = require('lodash');
route.get('/', async (req, res) =>{
  let readStream = fs.createReadStream(os.homedir() + '/.forever/publish-system.log');
  readStream.pipe(res);
  readStream.on('error', (e)=>{
    console.error(e);
    util.endRequest(res, {
      code: 500,
      message: e.message,
      success: false
    });
  });
});
module.exports = route;
