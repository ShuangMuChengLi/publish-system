let express = require('express');
let projectData = require('../data/project.json'); // 项目列表
let dataListRoute = express.Router();
let _ = require('lodash');
/**
 * 查询列表
 *
 * */
dataListRoute.get('/', (req, res)=>{
  res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
  let result = _.cloneDeep(projectData).map(item=>{
    delete item.password;
    return item;
  });
  res.end(JSON.stringify({
    'code': 200,
    'message': '',
    'success': true,
    'result': result
  }));
});

module.exports = dataListRoute;
