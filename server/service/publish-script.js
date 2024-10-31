const { NodeSSH } = require('node-ssh');
const moment = require('moment');
const fs = require('fs');
// const config = require('../config');
function publish(projectData, filePath){
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
      console.log(`开始备份:${projectData.serverPath}/${backPath}`);
      let result = await ssh.execCommand(`cp -r ${projectName} ${backPath}`, { cwd: projectData.serverPath }).then(function (result) {
        console.log(`备份成功:${projectData.serverPath}/${backPath}`);
        return true;
      }).catch((err) => {
        console.error(err);
        reject(err);
        return false;
      });
      if (!result) {
        end();
        return;
      }
      console.log(`开始移除：${projectData.serverPath}/${projectName}`);
      result = await ssh.execCommand(`rm -rf ${projectName}/*`, { cwd: projectData.serverPath }).then(function (result) {
        console.log(`移除成功：${projectData.serverPath}/${projectName}`);
        return true;
      }).catch((err) => {
        reject(err);
        console.error(err);
        return false;
      });
      if (!result) {
        end();
        return;
      }
      console.log('开始上传：' + projectData.serverPath + `/${projectName}/dist.zip`);
      result = await ssh.putFile(filePath, projectData.serverPath + `/${projectName}/dist.zip`).then(function (result) {
        console.log('上传成功：' + projectData.serverPath + `/${projectName}/dist.zip`);
        return true;
      }).catch((err) => {
        console.error(err);
        reject(err);
        return false;
      });
      if (!result) {
        end();
        return;
      }

      console.log('开始解压:dist.zip');
      result = await ssh.execCommand('unzip dist.zip', { cwd: projectData.serverPath + `/${projectName}` }).then(function (result) {
        console.log('解压成功:dist.zip');
        return true;
      }).catch((err) => {
        console.error(err);
        reject(err);
      });

      if (!result) {
        end();
        return;
      }

      console.log('开始删除:dist.zip');
      await ssh.execCommand('rm -f dist.zip', { cwd: projectData.serverPath + `/${projectName}` }).then(function (result) {
        console.log('删除成功:dist.zip');
        console.log('恭喜你发布成功！');
        try{
          fs.unlinkSync(filePath);
          console.log('删除上传文件缓存成功！');
        }catch (e){
          console.error('删除上传文件缓存失败', e);
        }

        resolve({
          backPath: backPath,
          date: dateString
        });
        end();
      }).catch((err) => {
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
module.exports = publish;
