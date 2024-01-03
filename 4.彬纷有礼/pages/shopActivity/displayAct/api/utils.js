const Api = require('../../../../utils/api')
module.exports = {
  uploadImgAI:function(file,parmas){

    wx.showLoading({
      title: '上传中',
      mask:true
    })

    return new Promise(function(resolve,reject){
        wx.uploadFile({
          url: Api.baseURL + '/api/act3/upload', //仅为示例，非真实的接口地址
          filePath: file,
          name: 'img',
          header:{
            'Authorization': wx.getStorageSync('token')
          },
          formData: {
            ...parmas
          },
          success (res){
            let result =JSON.parse(res.data)
            if(result.code == 0){
              wx.showModal({
                title:'温馨提示',
                content: result.msg
              })
              return reject(result.msg)
            }
            resolve(result.data)
          },
          fail(err){
            reject(err)
          },
          complete(){
            wx.hideLoading()
          }
        })
    })
  },
  parseTime:function(time, cFormat, zero = true) {
    if (arguments.length === 0 || !time) {
      return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if ((typeof time === 'string')) {
        if ((/^[0-9]+$/.test(time))) {
          // support "1548221490638 1612339800000"
          time = parseInt(time)
        } else {
          // support safari
          // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
          time = time.replace(new RegExp(/-/gm), '/')
        }
      }
  
      if ((typeof time === 'number') && (time.toString().length === 10)) {
        time = time * 1000
      }
      date = new Date(time)
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    }
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
      const value = formatObj[key]
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') {
        return ['日', '一', '二', '三', '四', '五', '六'][value]
      }
      if (zero) {
        return value.toString().padStart(2, '0')
      } else {
        return value.toString()
      }
    })
    return time_str
  },

}