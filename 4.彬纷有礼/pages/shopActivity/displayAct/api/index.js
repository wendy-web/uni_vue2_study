const Api = require('../../../../utils/api')

//报名申请
function signUp(data, mask = true) {
  return Api.postBase({
    url: '/api/act3/signUp',
    params: data,
    mask
  })
}
//获取参与信息
function getInfo(data, mask = true) {
  return Api.postBase({
    url: '/api/act3/getInfo',
    params: data,
    mask
  })
}
//拍照记录/api/act3/uploadLog
function uploadLog(data,mask=true){
  return Api.postBase({
    url: '/api/act3/uploadLog',
    params: data,
    mask
  })
}
//获奖记录/api/act3/signupList
function signupList(data,mask=true){
  return Api.postBase({
    url: '/api/act3/signupList',
    params: data,
    mask
  })
}
//上传陈列图片
function upload(data,mask=true){
  return Api.postBase({
    url: '/api/act3/upload',
    params: data,
    mask
  })
}
module.exports = {
  signUp,getInfo,uploadLog,signupList
}