let express = require('express');
let router = express.Router();
const planDao = require('../service/plan-dao');
const _ = require('lodash');
let util = require('../service/util');
const publishVersion = require('../service/publish-version');
router.get('/getPlanByPId', (req, res)=>{
  let searchParams = new URL(req.url, 'http://localhost:10999').searchParams;
  let pId = searchParams.get('pId');
  res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
  res.end(JSON.stringify({
    'code': 200,
    'message': '',
    'success': true,
    'result':planDao.getPlanByPId(pId)
  }));
});

router.delete('/', async (req, res)=>{
  let searchParams = new URL(req.url, 'http://localhost:10999').searchParams;
  let id = searchParams.get('id');
  const result = planDao.deletePlan(id);
  util.endRequest(res, {
    code: result.status,
    message: result.message,
    success: true
  });
});

router.post('/immediatePublish', async (req, res)=>{
  let fields = req.body;
  let id = fields.id;
  const planList = planDao.getPlan(0);
  const plan = _.find(planList, {id});
  if(!plan){
    util.endRequest(res, {
      code: 500,
      message: '未找到该计划',
      success: true
    });
    return;
  }

  let result = await publishVersion({
    pId: plan.pId,
    path: plan.path,
    info: plan.info
  }).then(()=>{
    planDao.executed(plan.id, 1, '发布成功');
    return {
      code: 200,
      message: '发布成功',
      success: true
    };
  }).catch((e)=>{
    planDao.executed(plan.id, 2, e);
    return {
      code: 500,
      message: e,
      success: false
    };
  });
  util.endRequest(res, result);
});

module.exports = router;
