const { NodeSSH } = require('node-ssh');
function createProject(projectData){
  console.log(projectData);
  return new Promise((resolve, reject)=>{
    const ssh = new NodeSSH();
    function end(){
      ssh.dispose();
    }
    console.log('开始登录远程服务器， 添加文件夹');
    ssh.connect({
      host: projectData.host,
      username: projectData.username,
      privateKey: projectData.privateKey || null,
      port: projectData.port || 22,
      password: projectData.password || null
    }).then(async (e) => {
      console.log('登录远程服务器成功');
      /**
       * { code: null, signal: null, stdout: '', stderr: '' }
       * {
          code: 1,
          signal: null,
          stdout: '',
          stderr: 'mkdir: cannot create directory ‘test1’: File exists'
        }
       */
      await ssh.execCommand(`mkdir -p ${projectData.serverPath}`).then(function (result) {
        if(result.stderr){
          console.error('新建目录失败', result.stderr);
          return false;
        }

        console.log('新建目录成功');
        return true;
      }).catch((err) => {
        console.error('新建目录失败', err);
        return false;
      });


      end();
    }).catch((err) => {
      console.error('登录失败，添加文件夹失败', err);
      reject(err);
    });
  });


}
module.exports = createProject;
