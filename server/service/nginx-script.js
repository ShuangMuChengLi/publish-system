const { NodeSSH } = require('node-ssh');
const path = require('path');
function getConfPath(projectData){
  return projectData.nginxConfPath;
}
function getNginxConfig(projectData){
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
      let configPath = path.resolve(__dirname, '../tem/nginx.conf' + '_' + new Date().getTime());
      console.log('开始下载', configPath, getConfPath(projectData));
      await ssh.getFile(configPath, getConfPath(projectData)).then(function(Contents) {
        resolve(configPath);
        end();
      }, function(error) {
        console.log(error);
        reject();
        end();
      });
    }).catch((err) => {
      console.error(err);
      reject(err);
      end();
    });
  });
}
function putNginxConfig(projectData, filePath){
  return new Promise((resolve, reject)=>{
    const ssh = new NodeSSH();
    function end(){
      ssh.dispose();
    }
    console.log('开始登录远程服务器');
    console.log(projectData.username);
    ssh.connect({
      host: projectData.host,
      username: projectData.username,
      privateKey: projectData.privateKey || null,
      port: projectData.port || 22,
      password: projectData.password || null
    }).then(async (e) => {
      let uploadResult = await ssh.putFile(filePath, getConfPath(projectData)).then(function(Contents) {
        return true;
      }, function(error) {
        console.log(error);
        return false;
      });

      if(!uploadResult){
        reject();
        end();
        return;
      }

      await ssh.execCommand(`${projectData.nginxPath} -s reload`).then(function(Contents) {
        resolve();
        end();
      }, function(error) {
        console.log(error);
        reject();
        end();
      });
    }).catch((err) => {
      console.error(err);
      reject(err);
      end();
    });
  });
}
module.exports = {
  getNginxConfig,
  putNginxConfig
};
