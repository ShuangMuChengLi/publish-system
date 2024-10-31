let _ = require('lodash');
module.exports = {
  /**
   *  @param param 接口接收到的参数
   *  @param checkoutParamNameList 需要校验的名称组成的数组
   * */
  isHasParams(param, checkoutParamNameList){
    let resultList = [];
    for(let item of checkoutParamNameList){
      if(!param.hasOwnProperty(item)){
        resultList.push(item);
      }
    }

    if(_.isEmpty(resultList)) {
      return {
        isPass: true
      };
    }

    return {
      isPass: false,
      lackParamList: resultList
    };
  },
  /**
   *  接口返回
   *  @param res 请求
   *  @param requestBody 返回信息
   *   requestBody.code 返回代码
   *   requestBody.writeHeadMessage 书写头部
   *   requestBody.message 返回信息
   *   requestBody.success 是否成功
   *   requestBody.result 返回结果
   *
   * */
  endRequest(res, requestBody){
    let code = requestBody.code || 200; // 返回代码

    //返回头部修改
    let writeHead = {'Content-Type': 'application/json;charset=utf-8'};
    if(requestBody.hasOwnProperty('writeHeadMessage')){
      writeHead = Object.assign(
        writeHead,
        requestBody.writeHeadMessage
      );
    }
    const resultMessage = JSON.stringify({
      'code': code,
      'message': requestBody.message,
      'success': requestBody.success,
      'result':requestBody.result
    });

    res.writeHead(code, writeHead);
    res.end(resultMessage);
  }
};
