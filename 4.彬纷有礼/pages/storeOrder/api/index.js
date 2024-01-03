const http = require('../../../utils/api');

module.exports = {

  //订单列表/app/user/getPackLog
  getPackLog(data, mask = false) {
    return http.postBase({
      url: '/app/user/getPackLog',
      params: data,
      mask
    })
  },
  //引单详情
  detail(data, mask = false) {
    return http.postBase({
      url: '/app/store/detail',
      params: data,
      mask
    })
  },
  //订单列表tab统计/api/card/ylcount
  ylcount(data = {}, mask = false) {
    return http.postBase({
      url: '/api/card/ylcount',
      params: data,
      mask
    })
  },
  //查询支付结果（中信）
  dpQueryCitic(data = {}, mask = false) {
    return http.postBase({
      url: '/store/post/dpQueryCitic',
      params: data,
      mask
    })
  },

  //核销拒绝
  verifyCancel(data = {}, mask = false) {
    return http.postBase({
      url: '/app/store/verifyCancel',
      params: data,
      mask
    })
  },
  //取消
  cancelCitic(data = {}, mask = false) {
    return http.postBase({
      url: '/app/store/cancelCitic',
      params: data,
      mask
    })
  },
  //催各种
  press(data = {}, mask = false) {
    return http.postBase({
      url: '/app/store/press',
      params: data,
      mask
    })
  },
  //代下单确认
  confirm(data = {}, mask = false) {
    return http.postBase({
      url: '/app/store/confirm',
      params: data,
      mask
    })
  },
  //确认收货
  verifyConfirmCitic(data = {}, mask = false) {
    return http.postBase({
      url: '/app/store/verifyConfirmCitic',
      params: data,
      mask
    })
  },
  //发起支付
  storePayCitic(data = {}, mask = false) {
    return http.postBase({
      url: '/store/pay/citic',
      params: data,
      mask
    })
  },
}