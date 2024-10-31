let express = require('express');
let formidable = require('formidable');
let projectData = require('../data/project.json'); // 项目列表
let route = express.Router();
let url = require('url');
let fs = require('fs');
let path = require('path');
let util = require('../service/util');
let _ = require('lodash');
let { getNginxConfig, putNginxConfig } = require('../service/nginx-script.js');
route.get('/', async (req, res) =>{
  let arg = url.parse(req.url, true).query;
  function showError(msg){
    console.error(msg);
    res.writeHead(500, {'Content-Type': 'application/json;charset=utf-8'});
    res.end(JSON.stringify({
      'code': 500,
      'message': msg,
      'success': false,
      'result': null
    }));
  }
  let id = _.get(arg, 'id', false);
  if(!id){
    showError('缺少项目的id');
    return;
  }

  const item = _.find(projectData, {'id': id });
  if(!item){
    showError('查无此项目');
    return;
  }

  if(!item.nginxPath){
    showError('没有配置nginx');
    return;
  }

  console.log('getNginxConfig');
  await getNginxConfig(item).then((data)=>{
    let readStream = fs.createReadStream(data);
    readStream.pipe(res);
  }).catch(()=>{
    showError('下载失败');
  });

});
route.post('/', async (req, res) =>{
  const form = formidable({ multiples: true });
  function showError(msg){
    console.error(msg);
    res.writeHead(500, {'Content-Type': 'application/json;charset=utf-8'});
    res.end(JSON.stringify({
      'code': 500,
      'message': msg,
      'success': false,
      'result': null
    }));
  }
  form.uploadDir = path.resolve(__dirname, '../tem');
  form.parse(req, async function (err, fields, files) {
    if (err) {
      console.error(err);
      util.endRequest(res, {
        code: 500,
        message: '上传异常',
        success: false
      });
      return;
    }

    let pId = _.get(fields, 'pId', false);
    if(!pId){
      showError('缺少项目的id');
      return;
    }

    let file = _.get(files, 'file', false);
    if(!file){
      showError('请上传配置文件');
      return;
    }

    const item = _.find(projectData, {'id': pId });
    if(!item){
      showError('查无此项目');
      return;
    }

    if(!item.nginxPath){
      showError('没有配置nginx');
      return;
    }

    console.log('putNginxConfig');
    await putNginxConfig(item, files.file.path).then((data)=>{
      util.endRequest(res, {
        code: 200,
        message: '上传成功',
        success: false
      });
    }).catch((e)=>{
      console.error(e);
      showError('下载失败');
    });
  });



});

module.exports = route;
