let versionData = require('../data/version.json');
let path = require('path');
let fs = require('fs');
let versionPath = path.resolve(__dirname, '../data/version.json');
module.exports = {
  addVersion(versionInfo){
    versionData.push(versionInfo);
    this.save();
  },
  getLastVersionItem(pId){
    let currentPIdVersionList = versionData.filter((item)=>{
      return item.pId === pId;
    });
    let sortedList = currentPIdVersionList.sort((a, b)=>
    {
      return a.publishDate - b.publishDate;
    });
    return sortedList[sortedList.length - 1];
  },
  save(){
    fs.writeFile(versionPath, JSON.stringify(versionData, null, 2), (err)=>{
      if(err){
        console.error(err);
      }
    });
  }
};
