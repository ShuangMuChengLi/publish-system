var express = require('express');
var _ = require('lodash');
var router = express.Router();
let util = require('../service/util') ;
let restore = require('../service/restore-script') ;
const versionList = require('../data/version.json');
const projectList = require('../data/project.json');
let versionDao = require('../service/version-dao');
let projectDao = require('../service/project-dao');
let { v4 } = require('uuid');
const moment = require('moment');
router.post('/', async function(req, res, next) {
  let versionId = req.body.id;
  let info = req.body.info;
  let versionItem = _.find(versionList, { id: versionId });
  if(!versionItem){
    util.endRequest(res, {
      code: 500,
      message: '没有找到该版本信息',
      success: false
    });
    return false;
  }

  let pId = versionItem.pId;
  let projectItem = _.find(projectList, { id: pId });
  if(!projectItem){
    util.endRequest(res, {
      code: 500,
      message: '没有找到该项目信息',
      success: false
    });
    return false;
  }

  let result = await restore(projectItem, versionItem).then((backPath)=>{
    return backPath;
  }).catch((err)=>{
    res.writeHead(500, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
      code: 500,
      message: err.message
    }));
    return false;
  });
  if(!result) return;

  let backVersionInfo = versionDao.getLastVersionItem(pId);
  if(backVersionInfo){
    backVersionInfo.filePath = result.backPath;
  }
  let currentVersionInfo = {
    'id': v4(),
    'pId': pId,
    'info': info,
    'publishDate': result.date,
    'filePath': 'dist'
  };
  versionDao.addVersion(currentVersionInfo);
  projectItem.publishDate = result.date;
  projectDao.save();
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({code: 200}));
});
module.exports = router;
