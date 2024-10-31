let projectData = require('../data/project.json');
let path = require('path');
let fs = require('fs');
let projectPath = path.resolve(__dirname, '../data/project.json');
module.exports = {
  addProject(projectInfo){
    projectData.push(projectInfo);
    this.save();
  },
  save(){
    fs.writeFile(projectPath, JSON.stringify(projectData, null, 2), (err)=>{
      if(err){
        console.error(err);
      }
    });
  }
};
