const Api = require('../../../utils/api')

 function getShopProList(data){ 
  return Api.postBase({
     url:'/api/display/getShopProList',
     params:data
  })
}

 function getShopDisDays(data){ 
  return Api.postBase({
     url:'/api/display/getShopDisDays',
     params:data
  })
}

function getShopDis(data){ 
  return Api.postBase({
     url:'/api/display/getShopDis',
     params:data
  })
}

function getShopPro(data){ 
  return Api.postBase({
     url:'/api/display/getShopPro',
     params:data
  })
}

function uploadImgAI(data){ 
  return Api.postBase({
     url:'/api/display/uploadImgAI',
     params:data
  })
}
 function applyRecheck(data){ 
  return Api.postBase({
     url:'/api/display/applyRecheck',
     params:data
  })
}
 function getShopProNum(data){ 
  return Api.postBase({
     url:'/api/display/getShopProNum',
     params:data
  })
}

function essStatus(data){ 
  return Api.postBase({
     url:'/app/store/essStatus',
     params:data
  })
}

module.exports = {
  getShopProList,getShopDisDays,getShopDis,getShopPro,uploadImgAI,applyRecheck,getShopProNum,essStatus
}