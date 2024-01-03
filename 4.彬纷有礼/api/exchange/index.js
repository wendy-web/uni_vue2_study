const Api = require("../../utils/api");
module.exports = {
  //换购统计
  excCount(mask = false) {
    return Api.postBase({
      url: '/api/exc/count',
      mask
    })
  },
  // 换购记录
  excLogs(data, mask = false) {
    return Api.postBase({
      url: '/api/exc/logs',
      params: data,
      mask
    })
  },
  // 发起兑换
  excReplace(data, mask = false) {
    return Api.postBase({
      url: '/api/exc/replace',
      params: data,
      mask
    })
  },
  // 换购券列表
  getexclog(data, mask = false) {
    return Api.postBase({
      url: '/api/card/getexclog',
      params: data,
      mask
    })
  },
  // 获取店长信息
  getuserShop(mask = false) {
    return Api.postBase({
      url: '/api/user/getuserShop',
      mask
    })
  },
  //可扫现金券额度 
  canScanNum(mask = false) {
    return Api.postBase({
      url: '/api/cash/canScanNum',
      mask
    })
  },
  // 好礼二选一
  /**
   * 
   * @param {
   *   "qr_code": "中奖的二维码",
   *   "award_type": "0红包,2产品券"
   * }
   * 
   */
  selectAward(data, mask = false) {
    return Api.postBase({
      url: '/api/scan23/selectAward',
      params: data,
      mask
    })
  },
  /**
   * 
   * @param {*} mask 
   */
  // 扫码用户信息 
  scan23getUser(mask = false) {
    return Api.postBase({
      url: '/api/scan23/getUser',
      params: '',
      mask
    })
  },
  //兑换明细记录 
  scan23excLogs(data,mask = false) {
    return Api.postBase({
      url: '/api/scan23/excLogs',
      params: data,
      mask
    })
  },
  //额度兑换 
  /**
   * 
   * @param {
   *  "exc_type": "兑换方式,32,54"
   * } 
   * 
   */
  scan23exc(data,mask = false) {
    return Api.postBase({
      url: '/api/scan23/exc',
      params: data,
      mask
    })
  },
  // 收益累计页面：余额明细列表
  getbalancelog(data,mask = false) {
    return Api.postBase({
      url: '/api/user/getbalancelog',
      params: data,
      mask
    })
  },
}