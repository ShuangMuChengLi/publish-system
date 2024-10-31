let express = require('express');
// let projectData = require('../data/project.json');
let router = express.Router();
let formidable = require('formidable');
const path = require('path');
let util = require('../service/util') ;
const publishVersion = require('../service/publish-version');
const planDao = require('../service/plan-dao');
const _ = require('lodash');
setInterval(async ()=>{
  let planList = planDao.getPlan(0);
  if(_.isEmpty(planList))return;

  const nowTime = new Date().getTime();
  for(let plan of planList){
    if(plan.planDate < nowTime){
      await publishVersion({
        pId: plan.pId,
        path: plan.path,
        info: plan.info
      }).then(()=>{
        planDao.executed(plan.id, 1, '发布成功');
        return true;
      }).catch((e)=>{
        planDao.executed(plan.id, 2, e);
        return false;
      });
    }
  }
}, 1000 * 5);
/**
 * 版本发布
 */
router.post('/', (req, res)=>{
  const form = formidable({ multiples: true, maxFileSize: 200 * 1024 * 1024 * 100 });
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

    // 校验是否为zip类型的文件
    if(files.file.type.indexOf('zip') === -1){
      util.endRequest(res, {
        code: 500,
        message: '请上传zip类型文件',
        success: false
      });
      return;
    }

    let result;
    if(fields.isPlan === '1'){
      planDao.addPlan({
        pId: fields.pId,
        path: files.file.path,
        info: fields.info,
        planDate: fields.planDate
      });
      result = {
        code: 200,
        message: '发布成功',
        success: true
      };
    }else{
      result = await publishVersion({
        pId: fields.pId,
        path: files.file.path,
        info: fields.info
      }).then(()=>{
        return {
          code: 200,
          message: '发布成功',
          success: true
        };
      }).catch((e)=>{
        return {
          code: 500,
          message: e,
          success: false
        };
      });
    }
    util.endRequest(res, result);
  });
});
module.exports = router;
