let express = require('express');
let projectData = require('../data/project.json'); // 项目列表
let detailRoute = express.Router();
let url = require('url');
let _ = require('lodash');
/**
 * 查询详情
 *
 * */
detailRoute.get('/', (req, res) =>{

  let arg = url.parse(req.url, true).query;
  let id = _.get(arg, 'id', false);
  if(!id){
    res.writeHead(500, {'Content-Type': 'application/json;charset=utf-8'});
    res.end(JSON.stringify({
      'code': 500,
      'message': '缺少项目的id',
      'success': false,
      'result': null
    }));
    return;
  }

  const item = _.find(projectData, {'id': id });
  if(!item){
    res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
    res.end(JSON.stringify({
      'code': 200,
      'message': '查无此项目',
      'success': true,
      'result': null
    }));
    return;
  }

  res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
  let result = _.cloneDeep(item);
  delete result.password;
  res.end(JSON.stringify({
    'code': 200,
    'message': '查询成功',
    'success': true,
    'result': result
  }));
});

module.exports = detailRoute;
