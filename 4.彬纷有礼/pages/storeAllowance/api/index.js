const http = require('../../../utils/api');

module.exports = {
  
  /**
   * 现金券领取记录
   * @param {
   * start_time,end_time,
   * status:0扫箱内码，1收到助力，2订单抵扣，3采购订单，4退回，100（获取）
   * source:不传全部，0红牛，1战马
   * next
   * } data 
   * @param {*} mask 
   */
  recLogs(data,mask=false){
    return http.postBase({
      url:'/api/cash/recLogs',
      params:data,
      mask
    })
  },
  
  /**
   * 现金券统计
   * 
   * 
   */
  count(data='',mask=false){
    return http.postBase({
      url:'/api/cash/count',
      params:data,
      mask
    })
  },
  /**
   * 现金券助力
   * @param {
   *  start_time,
   *  end_time,
   * next
   * } data 
   * @param {*} mask 
   */
  helpLogs(data,mask=false){
    return http.postBase({
      url:'/api/cash/helpLogs',
      params:data,
      mask
    })
  },
  // 业务员信息 /api/info/salesman
  salesman(data,mask=false){
    return http.postBase({
      url:'/api/info/salesman',
      params:data,
      mask
    })
  },
  // 现金券统计（助力看自己）
  helpCount(data,mask=false){
    return http.postBase({
      url:'/api/cash/helpCount',
      params:data,
      mask
    })
  },
}