let express = require('express');
let url = require('url');
let projectData = require('../data/project.json');
let prjectRoute = express.Router();
let util = require('../service/util') ;
let { v4 } = require('uuid');
let _ = require('lodash');
const projectDao = require('../service/project-dao');
const createProject = require('../service/project-script');
function formatPath(fields){
  let serverPath = fields.serverPath;
  if(serverPath){
    if(serverPath[serverPath.length - 1] === '/'){
      serverPath = serverPath.substring(0, serverPath.length - 1);
    }
  }
  fields.serverPath = serverPath;
  return fields;
}
/**
 * 项目新增
 *
 */
prjectRoute.post('/', async (req, res)=>{
  let fields = req.body;
  fields.id = v4();
  fields = formatPath(fields);
  await createProject(fields).then((e)=>{
  }).catch((e)=>{
  });

  projectData.push(fields);
  projectDao.save();
  res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
  res.end(JSON.stringify({
    'code': 200,
    'message': '添加成功',
    'success': true,
    'result': null
  }));
});
prjectRoute.put('/', async (req, res)=>{
  // console.log('修改项目的:', arg.id);
  let fields = req.body;
  fields = formatPath(fields);
  const resultKey = _.findIndex(projectData, {id : fields.id});
  if(resultKey === -1 ){
    util.endRequest(res, {
      code: 500,
      message: '查无此记录',
      success: false
    });
    return;
  }

  let modifyItem = _.cloneDeep(projectData[resultKey]);
  modifyItem = Object.assign(
    {},
    modifyItem,
    fields
  );
  await createProject(modifyItem).then((e)=>{
  }).catch((e)=>{
  });
  projectData.splice(resultKey, 1, modifyItem);
  projectDao.save();
  res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
  res.end(JSON.stringify({
    'code': 200,
    'message': '添加成功',
    'success': true,
    'result': null
  }));
});
prjectRoute.delete('/', (req, res)=>{
  let arg = url.parse(req.url, true).query;
  // logger.error('this is debug');
  console.log('删除项目id:', arg.id);
  if(!arg.id){
    util.endRequest(res, {
      code: 500,
      message: '缺少字段id',
      success: false
    });
    return;
  }

  let resultIndex = _.findIndex(projectData, { id: arg.id});

  if(resultIndex === -1){
    util.endRequest(res, {
      code: 500,
      message: '查无此记录',
      success: false
    });
    return;
  }

  projectData.splice(resultIndex, 1);
  projectDao.save();
  // let pId = _.get(arg, 'pId');
  res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
  res.end(JSON.stringify({
    'code': 200,
    'message': '',
    'success': true,
    'result': null
  }));
});

module.exports = prjectRoute;
