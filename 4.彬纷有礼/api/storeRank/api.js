const Api = require("../../utils/api");
module.exports = {
  //店铺排行榜活动：获取参与信息
  myRank(data, mask = false) {
    return Api.postBase({
      url: '/api/act2/getInfo8',
      params: data,
      mask
    })
  },
  //店铺排行榜列表
  rankList(data, mask = false){
    return Api.postBase({
      url: '/api/act2/rankList8',
      params: data,
      mask
    })
  },
  //获取指定用户100名后前后5名
  rankAsg(data, mask = true) {
    return Api.postBase({
      url: '/api/act2/rankAsg8',
      params: data,
      mask
    })
  },
  //领取奖励
  prizeAct(data, mask = true) {
    return Api.postBase({
      url: '/api/act2/prizeAct8',
      params: data,
      mask
    })
  },
  //当前店铺参与记录
  prizeLog(data, mask = true) {
    return Api.postBase({
      url: '/api/act/prizelog',
      params: data,
      mask
    })
  },
  //历史中奖排行榜
  allList(data, mask = true) {
    return Api.postBase({
      url: '/api/act/alllist',
      params: data,
      mask
    })
  },
  // 2023年5月28日 6月广东开箱冲榜活动
  // 开箱冲榜活动报名 
  enterFor(data='', mask = true){
    return Api.postBase({
      url: '/api/act4/enterFor',
      params: data,
      mask
    })
  },
  // 开箱冲榜活动信息
  unbox_getInfo(data='', mask = true){
    return Api.postBase({
      url: '/api/act4/getInfo',
      params: data,
      mask
    })
  },
  //开箱冲榜排行榜
  unbox_rankList(data='', mask = true){
    return Api.postBase({
      url: '/api/act4/rankList',
      params: data,
      mask
    })
  },
  // 开箱冲榜活动前五后五
  unbox_rankAsg(data='', mask = true){
    return Api.postBase({
      url: '/api/act4/rankAsg',
      params: data,
      mask
    })
  },
  // 2023年8月4日 深圳兑奖活动信息 issue:14 
  getInfo14(data='', mask = false){
    return Api.postBase({
      url: '/api/act6/getInfo14',
      params: data,
      mask
    })
  },
  // 14期活动排行榜 
  rankList14(data='', mask = true){
    return Api.postBase({
      url: '/api/act6/rankList14',
      params: data,
      mask
    })
  },
  // 14期排行榜 前5后5
  rankAsg14(data='', mask = true){
    return Api.postBase({
      url: '/api/act6/rankAsg14',
      params: data,
      mask
    })
  },
  //赢手机报名 
  signUp14(data='', mask = true){
    return Api.postBase({
      url: '/api/act6/signUp14',
      params: data,
      mask
    })
  },
  // 赢手机列表 
  mobList14(data='', mask = true){
    return Api.postBase({
      url: '/api/act6/mobList14',
      params: data,
      mask
    })
  },
  // 赢手机完善资料 
  mobUpdate14(data='', mask = true){
    return Api.postBase({
      url: '/api/act6/mobUpdate14',
      params: data,
      mask
    })
  },
}