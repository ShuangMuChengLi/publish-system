let planData = require('../data/plan.json');
let path = require('path');
let fs = require('fs');
let planPath = path.resolve(__dirname, '../data/plan.json');
let { v4 } = require('uuid');
const _ = require('lodash');
module.exports = {
  addPlan(planInfo){
    planData.push({
      ...planInfo,
      'executedInfo': '',
      'status': 0,
      'id': v4()
    });
    this.save();
  },
  deletePlan(id){
    const index = _.findIndex(planData, {id});
    if(index !== -1){
      planData.splice(index, 1);
      this.save();
      return {
        status: 200,
        message: '成功'
      };
    }else{
      return {
        status: 500,
        message: '未找到该计划信息'
      };
    }
  },
  executed(id, status, info){
    const item = _.find(planData, {id});
    if(item){
      item.status = status;
      item.executedInfo = info;
      this.save();
    }
  },
  getPlan(status){
    if(_.isUndefined(status))return planData;

    return planData.filter((item)=>{
      return item.status === status;
    });
  },
  getPlanByPId(pId){
    let currentPIdPlanList = planData.filter((item)=>{
      return item.pId === pId;
    });
    return currentPIdPlanList.sort((a, b)=>
    {
      return b.planDate - a.planDate;
    });
  },
  save(){
    fs.writeFile(planPath, JSON.stringify(planData, null, 2), (err)=>{
      if(err){
        console.error(err);
      }
    });
  }
};
