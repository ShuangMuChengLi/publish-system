let express = require('express');
let url = require('url');
let _ = require('lodash');
let versionData = require('../data/version.json');
let versionRoute = express.Router();
// 获取历史版本
versionRoute.get('/', (req, res)=>{
  let arg = url.parse(req.url, true).query;
  let pId = _.get(arg, 'pId');
  let versionList = versionData.filter((item)=>{
    return item.pId === pId;
  });
  console.log(JSON.stringify(versionList, null, 2));
  versionList = versionList.sort((a, b)=>{
    return b.publishDate - a.publishDate;
  });
  console.log(JSON.stringify(versionList, null, 2));
  res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
  res.end(JSON.stringify({
    'code': 200,
    'message': '',
    'success': true,
    'result':versionList
  }));
});
module.exports = versionRoute;
