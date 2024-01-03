const Api = require("../utils/api");
module.exports = {
  // 基础配置
  getConfig(data="", mask = false) {
    return Api.postBase({
      url: '/api/get/getConfig',
      params: data,
      mask
    })
  },
  // 获取小店优惠积分信息
  getxdyhUser(data='', mask = false){
    return Api.postBase({
      url: '/api/user/getxdyhUser',
      params: data,
      mask
    })
  },
  // 发送短信验证码
  sendsms(params='', mask = false){
    return Api.postBase({
      url: '/api/task/sendsms',
      params,
      mask
    })
  },
  // 绑定手机号
  bdmobile(params='', mask = false){
    return Api.postBase({
      url: '/api/user/bdmobile',
      params,
      mask
    })
  },
  // 微信授权解析手机号
  mnmobile(params='', mask = false){
    return Api.postBase({
      url: '/api/user/mnmobile',
      params,
      mask
    })
  },
}