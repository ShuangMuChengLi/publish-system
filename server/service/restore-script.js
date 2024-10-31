const { NodeSSH } = require('node-ssh');
const moment = require('moment');
// const config = require('../config');
function restore(projectData, versionData){
  console.log(projectData);
  return new Promise((resolve, reject)=>{
    const ssh = new NodeSSH();
    function end(){
      ssh.dispose();
    }
    console.log('开始登录远程服务器');
    ssh.connect({
      host: projectData.host,
      username: projectData.username,
      privateKey: projectData.privateKey || null,
      port: projectData.port || 22,
      password: projectData.password || null
    }).then(async (e) => {
      console.log('登录远程服务器成功');
      let projectName = projectData.projectDirName || 'dist';
      let dateString = new Date().getTime();
      let momentString = `${moment(dateString).format('YYYY-MM-DD-HH:mm:ss')}`;
      let backPath = `${projectName}${momentString}`;
      console.log(`开始备份:cp -r ${projectName} ${backPath}`);
      await ssh.execCommand(`cp -r ${projectName} ${backPath}`, { cwd: projectData.serverPath }).then(function (result) {
      }).catch((err) => {
        console.error(err);
      });
      console.log(`开始移除：rm -rf ${projectName}`);
      await ssh.execCommand(`rm -rf ${projectName}`, { cwd: projectData.serverPath }).then(function (result) {
      }).catch((err) => {
        console.error(err);
      });

      console.log(`开始还原:cp -r ${versionData.filePath} ${projectName}`);
      await ssh.execCommand(`cp -r ${versionData.filePath} ${projectName}`, { cwd: projectData.serverPath }).then(function (result) {
        resolve({
          backPath: backPath,
          date: dateString
        });
        end();
      }).catch((err) => {
        console.error(err);
        reject(err);
        end();
      });
    }).catch((err) => {
      console.error(err);
      reject(err);
      end();
    });
  });


}
module.exports = restore;
