const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
function end(){
  ssh.dispose();
}
console.log('开始登录远程服务器');
ssh.connect({
  host: 'localhost',
  username: 'root',
  privateKey: null,
  port: 10022,
  password: 'g7845120'
}).then(async (e) => {
  console.log('success');
  /**
   * { code: null, signal: null, stdout: '', stderr: '' }
   * {
  code: 1,
  signal: null,
  stdout: '',
  stderr: 'mkdir: cannot create directory ‘test1’: File exists'
}
   */
  await ssh.execCommand('mkdir -p /root/t/t').then(function (result, e) {
    console.log(result, e);
    console.log('新建成功');
  }).catch((err) => {
    console.error(err);
  });
}).catch((err) => {
  console.error(err);
  reject(err);
  end();
});
