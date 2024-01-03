// const Api = require("./utils/api");
import Api from '../../utils/http'

module.exports = {
  //卡券统计
  couponCount(data = '', mask = false) {
    return Api.postBase({
      url: '/api/card/getcountcard',
      params: data,
      mask
    })
  },
  // 换购券-红牛列表
  getcardlog(data, mask = false) {
    return Api.postBase({
      url: '/api/card/getcardlog',
      params: data,
      mask
    })
  },
  // 换购券-战马列表
  getexclog(data, mask = false) {
    return Api.postBase({
      url: '/api/card/getexclog',
      params: data,
      mask
    })
  },
  // 折扣券
  discountList(data, mask = false) {
    return Api.postBase({
      url: '/api/card/actlist',
      params: data,
      mask
    })
  },
  // 活动券 
  act4List(data, mask = false) {
    return Api.postBase({
      url: '/api/card/act4List',
      params: data,
      mask
    })
  },
  // 可用卡券分组统计 
  groupCount(data = '', mask = false) {
    return Api.postBase({
      url: '/api/voucher/groupCount',
      params: data,
      mask
    })
  },
  // 获取或设置经销商列表 
  getDealerList(data = '', mask = false) {
    return Api.postBase({
      url: '/api/voucher/getDealerList',
      params: data,
      mask
    })
  },
  // 发起一键核销 
  forApply(data = '', mask = false) {
    return Api.postBase({
      url: '/api/voucher/forApp',
      params: data,
      mask
    })
  },
  // 产品类型参数
  getSkuParam(data = '', mask = false) {
    return Api.postBase({
      url: '/api/voucher/getSkuParam',
      params: data,
      mask
    })
  },
  // 卡券使用记录 
  getPackLogVoucher(data = '', mask = false) {
    return Api.postBase({
      url: '/api/voucher/getPackLog',
      params: data,
      mask
    })
  },
  //已过期-折扣券 
  getPackLogCard(data = '', mask = false) {
    return Api.postBase({
      url: '/api/card/getpacklog',
      params: data,
      mask
    })
  },
  //卡券统计-累计获得
  accumCount(data = '', mask = false) {
    return Api.postBase({
      url: '/api/voucher/accumCount',
      params: data,
      mask
    })
  },
  //卡券统计-其它统计 
  otherCount(data = '', mask = false) {
    return Api.postBase({
      url: '/api/voucher/otherCount',
      params: data,
      mask
    })
  },
  // 核销确认列表 
  pendingList(data = '', mask = false) {
    return Api.postBase({
      url: '/api/voucher/pendingList',
      params: data,
      mask
    })
  },
  // 系统通知 
  getnotice(data = '', mask = false) {
    return Api.postBase({
      url: '/api/user/getnotice',
      params: data,
      mask
    })
  },
}