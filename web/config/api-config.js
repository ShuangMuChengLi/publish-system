import config from './config';
/**
 * 接口配置
 */
const wsLocal = `ws://localhost:${ config.api_local_port }`;
export const api = {
  'websocket':{
    'policeCarInfo': `${ wsLocal }/webSocket/policeCarInfo/token`
  },
  'project':{
    'list': config.api + '/list', // 项目列表查询
    'project' : config.api + '/project', // 项目新建
    'detail' : config.api + '/detail',
    'publish' : config.api + '/publish',
    'history' : config.api + '/history',
    'getPlanByPId' : config.api + '/plan/getPlanByPId',
    'plan' : config.api + '/plan',
    'immediatePublish' : config.api + '/plan/immediatePublish',
    'restore' : config.api + '/restore',
    'nginx' : config.api + '/nginx',
    'nginxRestart' : config.api + '/nginxRestart',
    'version' : config.api + '/version',
    'log' : config.api + '/log'
  }
};
