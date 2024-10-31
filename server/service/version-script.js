const { NodeSSH } = require('node-ssh');
const moment = require('moment');
// const config = require('../config');
function deleteVersion(projectData, versionData){
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
      console.log(`开始移除：rm -rf ${versionData.filePath}`);
      await ssh.execCommand(`rm -rf ${versionData.filePath}`, { cwd: projectData.serverPath }).then(function (result) {
        resolve();
        end();
      }).catch((err) => {
        console.error(err);
        end();
        reject(err);
      });
    }).catch((err) => {
      console.error(err);
      reject(err);
      end();
    });
  });


}
module.exports = {
  deleteVersion
};
