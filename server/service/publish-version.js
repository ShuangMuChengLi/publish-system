let projectData = require('../data/project.json');
let versionDao = require('../service/version-dao');
let projectDao = require('../service/project-dao');
let _ = require('lodash');
let publish = require('../service/publish-script');
let { v4 } = require('uuid');
const moment = require('moment');
async function publishVersion(versionInfo){
  return new Promise(async (resolve, reject)=>{
    // 校验pid是否存在
    const resultKey = _.findIndex(projectData, {id : versionInfo.pId});
    if(resultKey === -1 ){
      reject('查无此记录');
      return;
    }

    let projectItem = projectData[resultKey];
    let result = await publish(projectItem, versionInfo.path).then((backPath)=>{
      return backPath;
    }).catch((err)=>{
      reject(err.message);
      return false;
    });
    if(!result) {
      return false;
    }

    let backVersionInfo = versionDao.getLastVersionItem(versionInfo.pId);
    if(backVersionInfo){
      backVersionInfo.filePath = result.backPath;
    }
    let currentVersionInfo = {
      'id': v4(),
      'pId': versionInfo.pId,
      'info': versionInfo.info,
      'publishDate': result.date,
      'filePath': projectItem.projectDirName || 'dist'
    };
    versionDao.addVersion(currentVersionInfo);
    projectItem.publishDate = result.date;
    projectDao.save();
    resolve();
  });

}
module.exports = publishVersion;
