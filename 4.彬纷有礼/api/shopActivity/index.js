const Api = require("../../utils/api");
module.exports = {
  //开箱活动：获取参与信息
  getInfo(data, mask = false) {
    return Api.postBase({
      url: '/api/act2/getInfo',
      params: data,
      mask
    })
  },
  //获取陈列信息:/api/act3/getInfo
  getDisplayInfo(data, mask = false){
    return Api.postBase({
      url: '/api/act3/getInfo',
      params: data,
      mask
    })
  },
  //拍照记录/api/act3/uploadLog
  uploadLog(data, mask = true) {
    return Api.postBase({
      url: '/api/act3/uploadLog',
      params: data,
      mask
    })
  },
  //获奖记录/api/act3/signupList
  signupList(data, mask = true) {
    return Api.postBase({
      url: '/api/act3/signupList',
      params: data,
      mask
    })
  },
  //上传陈列图片
  upload(data, mask = true) {
    return Api.postBase({
      url: '/api/act3/upload',
      params: data,
      mask
    })
  },
  //东莞战马兑奖活动 
  getInfoDG(data, mask=false){
    return Api.postBase({
      url: '/api/act5/getInfo_dg',
      params: data,
      mask
    })
  },
  // 8月深圳开箱活动
  getInfoSZ(data='', mask=false){
    return Api.postBase({
      url: '/api/act5/getInfo_sz',
      params: data,
      mask
    })
  },
  // 深圳开箱活动报名
  unboxSignUpSZ(data='', mask=true){
    return Api.postBase({
      url: '/api/act5/signUpSz',
      params: data,
      mask
    })
  },
  // 2023年8月24日 广州开箱活动信息
  unboxActInfoGz(data='', mask=true){
    return Api.postBase({
      url: '/api/act7/getInfoGz16',
      params: data,
      mask
    })
  },
  // 广州开箱活动报名
  unboxSignUpGZ(data='', mask=true){
    return Api.postBase({
      url: '/api/act7/signUpGz16',
      params: data,
      mask
    })
  },
  // 排行榜
  rankListGz16(data='', mask=true){
    return Api.postBase({
      url: '/api/act7/rankListGz16',
      params: data,
      mask
    })
  },
  //2023年8月25日 广州战马兑奖活动 
  excActInfoGz(data='', mask=true){
    return Api.postBase({
      url: '/api/act8/getInfoGz17',
      params: data,
      mask
    })
  },
  // 10月东莞战马兑奖活动 11月30日结束
  getInfoDg18(data='', mask=true){
    return Api.postBase({
      url: '/api/act8/getInfoDg18',
      params: data,
      mask
    })
  },

}