import moment from 'moment';

export const util = {
  verifyResult(data) {
    if (data && data.data && data.data.code) {
      if (data.data.code === 200) {
        return data.data.result;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
  verifyResultCode(data) {
    if (data && data.data && data.data.code) {
      return data.data.code === 200;
    } else {
      return false;
    }
  },
  use(vue) {
    this.vue = vue;
  },
  getDateString(timestamp){
    return moment(Number(timestamp)).format('YYYY-MM-DD HH:mm:ss');
  },
  vue: null
};
