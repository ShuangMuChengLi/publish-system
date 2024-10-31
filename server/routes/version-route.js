let express = require('express');
let url = require('url');
let projectList = require('../data/project.json');
let versionList = require('../data/version.json');
let route = express.Router();
let util = require('../service/util') ;
let versionScript = require('../service/version-script') ;
let versionDao = require('../service/version-dao') ;
let _ = require('lodash');
const projectDao = require('../service/project-dao');
route.delete('/', async (req, res)=>{
  let arg = url.parse(req.url, true).query;
  let versionItemIndex = _.findIndex(versionList, { id: arg.id });
  if(versionItemIndex === -1){
    util.endRequest(res, {
      code: 500,
      message: '没有找到该版本信息',
      success: false
    });
    return false;
  }

  let versionItem = _.find(versionList, { id: arg.id });
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

  let result = await versionScript.deleteVersion(projectItem, versionItem).then((backPath)=>{
    return true;
  }).catch((err)=>{
    res.writeHead(500, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
      code: 500,
      message: err.message
    }));
    return false;
  });
  if(!result) return;

  versionList.splice(versionItemIndex, 1);
  versionDao.save();
  util.endRequest(res, {
    code: 200,
    message: '删除成功',
    success: true
  });
});

module.exports = route;
