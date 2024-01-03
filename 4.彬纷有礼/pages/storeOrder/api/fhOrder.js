const http = require('../../../utils/api');

module.exports = {

  //核销详情
  hxdetail(data, mask = false) {
    return http.postBase({
      url: '/app/store/hxdetail',
      params: data,
      mask
    })
  },
  //提醒配送商
  remind(data,mask=false){
    return http.postBase({
      url: '/api/card/remind',
      params: data,
      mask
    })
  },
  //取消订单 
  cancelpack(data,mask=false){
    return http.postBase({
      url: '/api/card/cancelpack',
      params: data,
      mask
    })
  },
  //核销订单 
  checkpage(data,mask=false){
    return http.postBase({
      url: '/api/card/checkpage',
      params: data,
      mask
    })
  },
}