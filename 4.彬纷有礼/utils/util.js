//获取应用实例
// var app = getApp();
const http = require("./api.js");
const log = require("./log.js");
// const storeRankArea = ["广州市","佛山市","中山市","清远市","肇庆市","韶关市","珠海市"];//四期广州分公司7个市
// const storeRankArea = ["湛江市","茂名市","阳江市","江门市","云浮市"];//五期湛江分公司5个市 湛江市、茂名市、阳江市、江门市、云浮市
// const storeRankArea = ["广东省"]; //六期 广东省
const storeRankArea = ["湛江市", "江门市"]; //2023年4月 28周年 湛江市 江门
// 白名单页面：无需用户授权
const pagewhiteList = [
  'pages/tabBar/shouye/index', //首页
  'pages/tabBar/shouye/notice', //消息
  'pages/tabBar/shouye/jifen', //积分
  'pages/tabBar/shouye/storeQr', //店铺码
  'pages/user/register/index', //登录页
  'pages/zongduan/saoma/index', //扫一扫
  // 'pages/user/register/dy',//加入店铺
]
const phoneBlackList = [
  'pages/zhongduan/geren/yuer/tixian/index', // 提现
  'pages/zhongduan/geren/mendian/renzhen/index', //创建店铺页面
]
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const getLastMonth = function () {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1; //0-11表示1-12月
  var day = now.getDate();
  if (day < 10) {
    day = '0' + day;
  }
  if (month < 10) {
    month = '0' + month;
  }
  var dateObj = {};
  dateObj.now = year + '-' + month + '-' + day;
  var nowMonthDay = new Date(year, month, 0).getDate(); //当前月的总天数
  if (month - 1 <= 0) { //如果是1月，年数往前推一年<br>　　　　 
    dateObj.last = (year - 1) + '-' + 12 + '-' + day;
  } else {
    var lastMonthDay = new Date(year, (parseInt(month) - 1), 0).getDate();
    if (lastMonthDay < 10) {
      lastMonthDay = '0' + lastMonthDay;
    }
    var _lastMonthDay = parseInt(lastMonthDay);
    var _day = parseInt(day);
    if ((month - 1) < 10) {
      month = '-0' + (month - 1);
    } else {
      month = '-' + (month - 1);
    }
    if (_lastMonthDay < _day) { //1个月前所在月的总天数小于现在的天日期
      if (_day < _lastMonthDay) { //当前天日期小于当前月总天数
        dateObj.last = year + month + '-' + (lastMonthDay - (nowMonthDay - day));
      } else {
        dateObj.last = year + month + '-' + lastMonthDay;
      }
    } else {
      dateObj.last = year + month + '-' + day;
    }
  }
  return dateObj;
}
var API_BASE_URL = http.baseURL || 'https://txc.y1b.cn'; //正式版
// var API_BASE_URL = 'https://new-test.y1b.cn'; //测试版

//请求封装
var request = function request(url, data, callback, page = '') {

  var _url = API_BASE_URL + url;
  var that = this;
  var auth = wx.getStorageSync('token');
  //此处需要判断token是否存在！！！！！！！！！
  if (!auth) {
    http.login('', page).then(res => {
      http.post(_url, data).then(res => {
        if (typeof (callback) == 'function') {
          callback(res)
        }
      })
    })
    return
  } else {
    return new Promise(function (resolve, reject) {
      wx.request({
        url: _url,
        data: data,
        method: 'POST',
        header: {
          'Authorization': auth,
          'Content-Type': 'application/json;charset=utf-8'
        },
        success: function success(res) {
          switch (res.data.code) {
            case '0':
              // wx.showToast({
              //   title: res.data.msg,
              //   icon: 'none',
              //   duration: 2000
              // })
              //回调函数
              if (typeof (callback) == 'function') {
                callback(res)
              }
              break;
            case '1':
              //回调函数
              if (typeof (callback) == 'function') {
                callback(res)
              }
              break;
            case '-1':
              wx.removeStorageSync('who');
              wx.removeStorageSync('token');
              wx.removeStorageSync('userdata');
              wx.removeStorageSync('islogin');
              wx.showToast({
                title: res.data.msg + '重新登录中',
                icon: 'none',
                duration: 2000
              })
              wx.setStorageSync('islogin', '-1');
              return http.login(true);
              // return wxlogin();
              break
            default:
              if (res.statusCode != 200) {
                wx.hideLoading({
                  success: (res) => {},
                })
                wx.showModal({
                  title: '温馨提示',
                  content: '请求异常：statusCode=' + res.statusCode,
                  showCancel: false
                })
              }
              if (typeof (callback) == 'function') {
                callback(res)
              }
          }

        },
        fail: function fail(error) {
          reject(error);
        },
        complete: function complete(aaa) {
          // 加载完成
        }
      });
    });
  }


};
//防止用户多次点击解决方案：showLoading/ throttle
var throttle = function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }
  let _lastTime = null
  // 返回新的函数
  return function () {
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments) //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}
//获取模板消息id
var getMID = function getMID(admin, callback) {
  admin = admin ? admin : 0;
  var data = {
    type: admin
  };
  return new Promise((resolve, reject) => {
    http.post('/api/tools/getmid', data, false).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })

}
//获取url地址参数
var getUrlPara = function getUrlPara(para, callback) {
  var param = para.split("?");
  var pair = '';
  for (var i = 0; i < param.length; i++) {
    pair = param[i].split("=");
    if (pair[0] == para) {
      return pair[1];
    }
  }
  if (typeof callback == "function") callback(pair)
}
var getUrlObj = function getUrlObj(url) {
  let o = {}
  let queryString = url.split('?')[1]
  if (queryString) {
    queryString
      .split('&')
      .forEach(item => {
        let [key, val] = item.split('=')
        val = val ? decodeURI(val) : true
        //          转码         无值赋值true
        if (o.hasOwnProperty(key)) {
          //   已有属性转为数组
          o[key] = [].concat(o[key], val)
        } else {
          o[key] = val
        }
      })
  }
  return o
}
//判断用户是否授权
var checkAuth = function checkAuth(checkUserInfo = false) {
  return new Promise((resolve, reject) => {
    var islogin = wx.getStorageSync('islogin');
    let pages = getCurrentPages() || [];
    let countPages = pages.length;
    let currentPage = pages[countPages - 1] || {};
    let route = '';
    if (currentPage) {
      route = currentPage.route;
    }
    // 一键登录页 'pages/user/register/index' 
    if (route && route == 'pages/user/register/index') {
      reject(true);
      return
    }
    if (islogin && islogin == 1) {
      resolve(true);
    } else {
      reject(false);
      if (wx.getStorageSync('newUser')) {
        return
      }
      wx.reLaunch({
        url: '/pages/user/register/index',
      })
    }


  })

}
//随机token
var randomToken = function randomToken() {
  var len = len || 32;
  var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  var maxPos = chars.length;
  var pwd = '';
  for (var i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }

  return pwd

}
//获取屏幕高度-广告位高度差
var contentBottom = function contentBottom(id, height) {
  return new Promise((resolve, reject) => {
    const query = wx.createSelectorQuery()
    query.select(id).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      var contentBottom = height - res[1].top;
      if (contentBottom) {
        resolve(contentBottom);
      } else {
        contentBottom = '350';
        reject(contentBottom);
      }


    })
  })
}
var InnerAudio = function InnerAudio(config) {
  let innerAudioContext = wx.createInnerAudioContext();
  innerAudioContext.src = config.url;
  innerAudioContext.loop = config.loop;
  //音频开始播放
  innerAudioContext.onPlay((res) => {
    if (config.onPlay) config.onPlay();
  });
  //音频播放异常
  innerAudioContext.onError((res) => {
    if (config.onError) config.onError();
  });
  //音频播放自然结束
  innerAudioContext.onEnded((res) => {
    if (config.onEnded) config.onEnded();
  });
  return {
    innerAudioContext,
    play(url) { //播放
      //有新值，赋值播放
      if (url) this.innerAudioContext.src = config.url;
      //直接播放
      this.innerAudioContext.play()
    },
    pause() { //暂停
      this.innerAudioContext.pause()
    },
    stop() { //停止
      this.innerAudioContext.stop()
    },
    seek(seek) { //设置进度
      this.innerAudioContext.seek = seek;
    },
    destroy() {
      this.innerAudioContext.destroy();
    }
  }
}
//格式化当前时间
var parseTime = function parseTime(time, cFormat, zero = true) {
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
}
const getShopQr = function (data, time = 60 * 2) {
  return new Promise((resolve, reject) => {
    let cache = getStorage("getShopQr");
    cache = cache && JSON.parse(cache);
    //判断是否有缓存，并且在缓存有效期内
    if (cache && VALID_CACHE(time, cache.lastModified)) {
      wx.hideLoading({
        success: (res) => {},
      })
      return resolve({
        data: cache.data
      })
    }
    //不在缓存有效期，重新获取
    http.post('/api/tools/getshopqr2', data).then(res => {
      if (res.code == 1) {
        resolve({
          data: res.data
        })
        setStorage('getShopQr', JSON.stringify({
          lastModified: Date.now(),
          data: res.data
        }))
        return false
      }
      if (res.code == 5) {
        //code = 5 unionid不存在需一键登录重新获取
        wx.reLaunch({
          url: '/pages/user/register/index',
        })
        return false;
      }
      if (res.code == 0) {

        wx.showModal({
          title: '温馨提示',
          content: "填写店铺信息，您即可拥有专属唯一的店铺码",
          confirmText: "填写获取",
          cancelText: "放弃",
          success: (_res) => {
            if (_res.confirm) {
              wx.redirectTo({
                url: '/pages/zhongduan/geren/mendian/renzhen/index',
              })
            } else {
              // wx.navigateBack();
              wx.switchTab({
                url: '/pages/tabBar/shouye/index',
              })
            }
          }
        })
        return false;
      }


      reject(res)


    });
  })
}
//缓存时间是否在有效期
function VALID_CACHE(cacheMaxAge, lastModified) {
  return lastModified + cacheMaxAge * 1000 >= Date.now()

}

function setStorage(key, data) {

  try {
    wx.setStorageSync(key, data)
  } catch (e) {
    //TODO handle the exception
  }
}

function getStorage(key) {
  let cache = null
  try {
    cache = wx.getStorageSync(key)
  } catch (e) {
    //TODO handle the exception
  }
  return cache
}

function clearStorage(key) {

  try {
    wx.removeStorageSync(key)
  } catch (e) {
    //TODO handle the exception
  }
}

function getNavbarData() {

  return new Promise(function (resolve, reject) {
    /*从本地获取navbar 信息*/
    let data = wx.getStorageSync('TJ-navBar-system');

    if (data) {
      getApp().globalData.navBarSystem = data;
      return resolve(JSON.parse(data))
    };

    /* 从系统获取 */
    wx.getSystemInfo({
      success: (res) => {
        let {
          statusBarHeight,
          system
        } = res
        let capsulePosition = wx.getMenuButtonBoundingClientRect();
        let navBarHeight = /ios/.test(system.toLocaleLowerCase()) ? 44 : 48
        let menuWidth = capsulePosition.width + 20;
        let contentWidth = res.windowWidth - (2 * menuWidth);
        let screenHeight = res.screenHeight;
        resolve({
          navBarHeight,
          statusBarHeight,
          menuWidth,
          capsulePosition,
          contentWidth,
          screenHeight,
        })
        let navBarSystem = JSON.stringify({
          navBarHeight,
          statusBarHeight,
          menuWidth,
          capsulePosition,
          contentWidth,
          screenHeight
        })
        getApp().globalData.navBarSystem = navBarSystem;
        wx.setStorageSync('TJ-navBar-system', navBarSystem);
      }
    })

  })



}

function formatAmount(num) {
  if (num) {
    //将num中的$,去掉，将num变成一个纯粹的数据格式字符串
    num = num.toString().replace(/\$|\,/g, '');
    //如果num不是数字，则将num置0，并返回
    if ('' == num || isNaN(num)) {
      return 'Not a Number ! ';
    }
    //如果num是负数，则获取她的符号
    var sign = num.indexOf("-") > 0 ? '-' : '';
    //如果存在小数点，则获取数字的小数部分
    var cents = num.indexOf(".") > 0 ? num.substr(num.indexOf(".")) : '';
    cents = cents.length > 1 ? cents : ''; //注意：这里如果是使用change方法不断的调用，小数是输入不了的
    //获取数字的整数数部分
    num = num.indexOf(".") > 0 ? num.substring(0, (num.indexOf("."))) : num;
    //如果没有小数点，整数部分不能以0开头
    if ('' == cents) {
      if (num.length > 1 && '0' == num.substr(0, 1)) {
        return 'Not a Number ! ';
      }
    }
    //如果有小数点，且整数的部分的长度大于1，则整数部分不能以0开头
    else {
      if (num.length > 1 && '0' == num.substr(0, 1)) {
        return 'Not a Number ! ';
      }
    }
    //针对整数部分进行格式化处理，这是此方法的核心，也是稍难理解的一个地方，逆向的来思考或者采用简单的事例来实现就容易多了
    /*
      也可以这样想象，现在有一串数字字符串在你面前，如果让你给他家千分位的逗号的话，你是怎么来思考和操作的?
      字符串长度为0/1/2/3时都不用添加
      字符串长度大于3的时候，从右往左数，有三位字符就加一个逗号，然后继续往前数，直到不到往前数少于三位字符为止
     */
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
      num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
    }
    //将数据（符号、整数部分、小数部分）整体组合返回
    return (sign + num + cents);
  }
}
//倒计时 countDownTime(new Date() - new Date('2021-01-12')) 
function countDownTime(val, zero = true) { //val 时间戳
  val = Math.abs(val) / 1000
  let day = parseInt(val / (60 * 60 * 24))
  let h = parseInt(val / (60 * 60)) % 24
  let m = parseInt(val / (60)) % 60
  let s = parseInt(val % 60)
  if (zero) {
    m = m > 9 ? m : '0' + m
    s = s > 9 ? s : '0' + s
    h = h > 9 ? h : '0' + h
  }
  return day + '天' + h + '小时' + m + '分' + s + '秒'
  // return '距离活动开始还剩' + day + '天' + h + '小时' + m + '分钟' + s + '秒'
}
//时分秒倒计时 
function hms_countDownTime(val, zero = true) { //val 时间戳
  val = Math.abs(val) / 1000
  let day = parseInt(val / (60 * 60 * 24))
  let h = parseInt(val / (60 * 60)) % 24
  let m = parseInt(val / (60)) % 60
  let s = parseInt(val % 60)
  if (zero) {
    m = m > 9 ? m : '0' + m
    s = s > 9 ? s : '0' + s
    h = h > 9 ? h : '0' + h
  }
  if (day > 0) {
    return day + '天' + h + '小时' + m + '分' + s + '秒'
  } else {
    return h + ':' + m + ':' + s
  }
  // return '距离活动开始还剩' + day + '天' + h + '小时' + m + '分钟' + s + '秒'
}

function act_countDownTime(val, zero = true) { //val 时间戳

  if (val < 0) return false
  val = Math.abs(val) / 1000
  let day = parseInt(val / (60 * 60 * 24))
  let h = parseInt(val / (60 * 60)) % 24
  let m = parseInt(val / (60)) % 60
  let s = parseInt(val % 60)
  if (zero) {
    m = m > 9 ? m : '0' + m
    s = s > 9 ? s : '0' + s
    h = h > 9 ? h : '0' + h
  }
  return day + '天' + h + '小时' + m + '分' + s + '秒'
  // return '距离活动开始还剩' + day + '天' + h + '小时' + m + '分钟' + s + '秒'
}
//新版获取用户信息 es6
function getUserInfoNew() {

  return new Promise(function (resolve, reject) {
    // 未登录不请求
    // if(wx.getStorageSync('islogin') !=1)return reject(null);
    http.postBase({
      url: '/api/user/getuser',
      mask: false
    }).then(res => {
      if (res.code == 1) {
        wx.setStorageSync('who', res.data.condition);
        wx.setStorageSync('userdata', res.data);
        wx.setStorageSync('UID', res.data.id);
        log.setFilterMsg('UID' + res.data.id);
        let {
          avatar_url,
          nick_name,
          mobile
        } = res.data;
        // if (![avatar_url, nick_name, mobile].every(Boolean) || nick_name === "微信用户") {
        // 只有提现页面和创建店铺页面需要强制授权手机号
        if (![avatar_url, nick_name].every(Boolean)) {
          let pages = getCurrentPages() || [];
          let countPages = pages.length;
          let currentPage = pages[countPages - 1] || {};
          let route = '';
          if (currentPage) {
            route = currentPage.route;
          }
          if (route && pagewhiteList.includes(route)) return resolve(res.data);
          // if (route && phoneBlackList.includes(route)){
          //   resolve(res.data);
          //   return
          // }
          wx.reLaunch({
            url: '/pages/user/register/index',
          })
        }
        var reg = /^(\d{3})\d*(\d{4})$/;
        if (res.data.mobile) {
          res.data.phoneStr = res.data.mobile.replace(reg, '$1****$2');
        }
        resolve(res.data);
      } else {
        reject(res)
      }
    }).catch(err => {
      console.log("getUserInfoNew catch:", err);
      reject(err)
    })
  })
}
//获取店铺信息
function getShopInfo(mask = true) {
  return new Promise(function (resolve, reject) {
    http.post('/api/shop/getInfo', false, mask).then(res => {
      if (res.code == 1) {
        var reg = /^(\d{3})\d*(\d{4})$/;
        res.data.member.forEach(item => {
          if (item.mobile) {
            item.phoneStr = item.mobile.replace(reg, '$1****$2');
          }
        })
        resolve(res.data);
        wx.setStorageSync('storeInfo', res.data);
      } else {
        reject(res)
      }
    }).catch(err => {
      reject(err)
    })
  })
}
//获取店铺简洁信息
function getShopInfoMini(sid) {
  return new Promise(function (resolve, reject) {
    http.post('/api/shop/getmshop', {
      sid: sid
    }, false).then(res => {
      if (res.code == 1) {
        resolve(res.data);
      } else {
        reject(res)
      }
    }).catch(err => {
      reject(err)
    })
  })
}
//字符串保留首尾，中间替换为星号

function parseStringToStar(str) {
  if (str.length > 2) {
    return str.substr(0, 1) + new Array(str.length - 1).join('*') + str.substr(-1)

  } else {
    return '*' + str.substr(-1)
  }


  return str.length > 2 ? str.substr(0, 1) + new Array(str.length - 2).join('*') + str.substr(-1) : str
}
//1转换001
function padLeft(nr, n, str) {
  return Array(n - String(nr).length + 1).join(str || '0') + nr;
}
//获取是否隐藏显示配置
function isHide(time = 60 * 1) {
  return new Promise(function (resolve, reject) {
    let cache = getStorage("isHide");
    cache = cache && JSON.parse(cache);
    //判断是否有缓存，并且在缓存有效期内
    if (cache && VALID_CACHE(time, cache.lastModified)) {
      return resolve(cache.data)
    }

    http.post('/api/tools/ishide', false, false).then(res => {
      if (res.code == 1) {
        wx.setStorageSync('hideAd', res.data.hide);
        wx.setStorageSync('phaseIII', res.data.show);
        wx.setStorageSync('activitySZ', res.data.act_time.show);
        let initApp = getApp();
        if (initApp && initApp.globalData) {
          initApp.globalData.phaseIII = res.data.show;
          initApp.globalData.act_time = res.data.act_time;
        }
        setStorage('isHide', JSON.stringify({
          lastModified: Date.now(),
          data: res.data
        }))
        resolve(res.data)
      }
    });
  }).catch(err => {
    console.error("utils isHide err:", err);
  })
}
//获取兑奖排行榜个人活动信息 
function getMyRankInfo() {
  return new Promise(function (resolve, reject) {
    http.post('/api/act/myrank', '').then(res => {
      if (res.code == 1) {
        //报名成功
        resolve(res.data)
      } else {
        //2未报名或者,0其它异常信息
        reject(res)
      }
    })
  })
}
//店铺纸质码判断以及获取真实店铺id
function paperCodeExchangeShopId(codeValue) {

  return new Promise(function (resolve, reject) {
    let sid = Number(codeValue);
    let nineHundredMillion = 9e8;
    if (!sid || sid && sid < nineHundredMillion) {
      reject();
      return;
    }
    http.post('/api/shop/getsid', {
      sid: sid
    }).then(result => {
      /** 
       * code=0 请创建店铺后再扫纸质码
          code=1 //纸质码已被绑定
          code=2 //您的店铺已绑定纸质码，是否需要更换纸质码？
          code=3 //您所在的店铺已绑定纸质码，若需更换，请联系掌柜
          code=4 //绑定后，不影响原有彬纷有礼-店铺码的使用。
          code=5 //您无权限绑定该纸质码，请联系您所在店铺掌柜绑定。
       */
      resolve(result);
      if (result.code == 0) {
        wx.showModal({
          title: '温馨提示',
          content: result.msg,
          confirmText: "前往创建",
          cancelText: '暂不创建',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: "/pages/zhongduan/geren/mendian/renzhen/index"
              })
            }
          }
        })

        return
      }
      if (result.code == 3) {
        wx.showModal({
          title: '温馨提示',
          content: result.msg,
          showCancel: false,
          confirmText: '我知道了'
        })
        return
      }
      if (result.code == 5) {
        wx.showModal({
          title: '温馨提示',
          content: result.msg,
          showCancel: false,
          confirmText: '我知道了'
        })
        return
      }
    }).catch(err => {
      console.error("paperCodeExchangeShopId catch:", err);
      reject();
    })
  })

}
//绑定修改纸质码
function bindChangePaperCode(sid) {
  return new Promise(function (resolve, reject) {
    http.post('/api/shop/sidbind', {
      sid: sid
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
//更新用户信息
function updateUserInfo(data) {
  return new Promise((resolve, reject) => {
    http.post('/api/user/update', data, false, true).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
//获取弹窗信息
function getMsg(page) {

  return new Promise((resolve, reject) => {
    // 未登录不请求
    if (wx.getStorageSync('islogin') != 1) return reject(null);
    http.post("/api/msg/get", {
      page: page
    }, false).then(res => {
      console.log("/api/msg/get:", res)
      // res.code =1;
      // res.data={
      //   msg_type:"bottom",
      //   name:'业务员',
      //   time:"lalal",
      //   type:2
      // }
      if (res.code == 1) {
        resolve(res.data)
      }
      // else{
      //   reject(res)
      // }
    })
  })
}
//新用户微信注册
function newUser(param) {
  return new Promise((resolve, reject) => {
    http.post('/api/post/wxregister', param).then(result => {
      if (result.code == 0) {
        reject(result);
        return
      }
      if (result.code == 1) {
        wx.setStorageSync('token', result.data.token);
        wx.setStorageSync('UID', result.data.uid);
        wx.setStorageSync('islogin', 1);
        wx.removeStorageSync('newUser');
        log.setFilterMsg('UID' + result.data.uid);
        const app = getApp();
        if (app && app.globalData.token) {
          app.globalData.token = result.data.token;
        }
        if (app.tokenReadyCallback) {
          app.tokenReadyCallback(result.data.token);
        }
        resolve(result.data.token);
        //获取用户信息
        getUserInfoNew().then(res => {})
        return
      }
    })
  })
}
//根据本地经纬度获取用户地址
/**
 * /api/tools/getlbs
 * longitude 经度
 * latitude 纬度
 */
function getlbs(param) {
  return new Promise((resolve, reject) => {
    http.post('/api/tools/getlbs', param, false).then(res => {
      if (res.code == 1) {
        resolve(res.data);
        wx.setStorageSync('mylbs', JSON.stringify(res.data));
      } else {
        reject(res);
      }
    })
  })
}
//获取系统未读消息
function getUnreadNotice() {
  return new Promise((resolve, reject) => {
    http.post('/api/user/getunread', false, false).then(res => {
      resolve(res.data)
      if (res.code == 1 && res.data > 0) {
        wx.showTabBarRedDot({
          index: 1,
          fail: res => {

          },
        })
        wx.setStorageSync('noticeUnread', res.data);
      } else {
        wx.hideTabBarRedDot({
          index: 1,
          fail: res => {

          },
        })

      }
    })
  })

}
//获取商户卡包统计
function getcountcard() {
  return new Promise((resolve, reject) => {
    http.post("/api/card/getcountcard", false, false).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
//传参年月获取 对应 月首位日：2021-04=> 2021-04-01 2021-04-30
var getParseDate = function parseTime(time) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = '{y}-{m}-{d} {h}:{i}:{s}'
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
  let firstDay = new Date(formatObj.y, date.getMonth(), 1);
  let lastDay = new Date(formatObj.y, formatObj.m, 0);
  return {
    start_time: this.parseTime(firstDay, "{y}-{m}-{d}"),
    end_time: this.parseTime(lastDay, "{y}-{m}-{d}"),
  }

}
//获取微信用户授权设置 wx.getSetting
function getSetting(time = 60 * 1) {
  return new Promise((resolve, reject) => {
    let cache = getStorage("wx_getSetting");
    cache = cache && JSON.parse(cache);
    //判断是否有缓存，并且在缓存有效期内
    if (cache && VALID_CACHE(time, cache.lastModified)) {
      return resolve(cache.data)
    }
    wx.getSetting({
      withSubscriptions: true,
      success: (res) => {
        setStorage('wx_getSetting', JSON.stringify({
          lastModified: Date.now(),
          data: res
        }))
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
//店铺排行榜活动地区判断
function isStoreRankArea(city) {
  // return city =="深圳市" || city == "惠州市" //二期
  // return city =="东莞市";  //三期
  // return true;//不限制店铺所在地区，只要接口显示就能看到
  return storeRankArea.includes(city); //
}
//按地区屏蔽广告：banner、插屏
function blockAd() {
  let _isHide = wx.getStorageSync('isHide');
  if (_isHide) {
    _isHide = JSON.parse(_isHide);
    return _isHide.data.ad_show
  }
  return true

}


//开箱活动券：活动入口
function actCoupon_getinfo() {
  let that = this;
  return new Promise((resolve, reject) => {
    http.post('/api/act2/getInfo', false).then(res => {

      if (res.code == 1) {
        let e_time = res.data.e_time;

        e_time = new Date(e_time.replace(new RegExp(/-/gm), '/'));
        e_time = e_time.getTime() - 86400000;
        e_time = that.parseTime(e_time, "{y}-{m}-{d} {h}:{i}:{s}");
        res.data.e_time_new = e_time;
      }

      resolve(res)
      if (+res.code == 0) {
        // 清除活动参与缓存：转让店铺给店员，扫面对面码加入店铺，修改地址判断
        wx.removeStorageSync('inActCoupon');
      }
    }).catch(err => {
      reject(err)
    });
  })
}
//开箱活动券：领取奖励
function actCoupon_prizeact(issues) {
  if (!issues) {
    return wx.showToast({
      title: '缺少issues参数',
      icon: 'none',
      duration: 1500
    })
  }
  let data = {};
  data.issues = issues;
  return new Promise((resolve, reject) => {
    http.post('/api/act2/prizeact', data).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    });
  })
}
//开箱活动券：参与记录
function actCoupon_history() {
  return new Promise((resolve, reject) => {
    http.post('/api/act2/sList', false).then(res => {

      resolve(res)
    }).catch(err => {
      reject(err)
    });
  })
}
//inActCoupon 开箱活动券进行中禁止转让店铺，加入店铺，修改店铺地址 param:true false
function inActCoupon(param) {
  wx.setStorageSync('inActCoupon', param);
}
//开箱活动券提示
function inActCouponTips(name = 'inActCoupon') {
  let inActCoupon = wx.getStorageSync(name);
  if (inActCoupon) {
    // wx.showModal({
    //   title: '温馨提示',
    //   content: '活动期间，不可操作',
    //   showCancel: false
    // })
    return true
  }
  return false
}

//门店地址：店铺信息l_province+l_city+l_direct 没有区就显示l_town + address
function storeAddress(shopInfo) {
  let address = '';
  let oldAddress = '';
  if (shopInfo.l_province == shopInfo.l_city) {
    address = shopInfo.l_province;
  } else {
    address = shopInfo.l_province + shopInfo.l_city;
    oldAddress = shopInfo.l_province + shopInfo.l_city;
  }


  if (shopInfo.l_district) {
    address += shopInfo.l_district;
    oldAddress += shopInfo.l_district;
  }
  if (shopInfo.l_town) {
    address += shopInfo.l_town;
  }
  // if(shopInfo.l_street){
  //   address += shopInfo.l_street
  // }
  //旧店铺信息处理：address包含省市区信息匹配并截取
  let _address = JSON.parse(JSON.stringify(shopInfo.address));
  let _index = _address.lastIndexOf(oldAddress);
  shopInfo.address = _index > -1 ? _address.substring(oldAddress.length) : _address;
  address += shopInfo.address;
  return address

}
//版本号比较
function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}
//东莞开箱陈列活动：参与信息
function act3_getinfo() {
  let that = this;
  return new Promise((resolve, reject) => {
    http.post('/api/act3/getInfo', false, false).then(res => {
      if (res.code == 1) {
        let e_time = res.data.e_time;

        e_time = new Date(e_time.replace(new RegExp(/-/gm), '/'));
        // e_time = e_time.getTime() - 86400000;
        e_time = that.parseTime(e_time, "{y}-{m}-{d} {h}:{i}:{s}");
        res.data.e_time_new = e_time;
      }

      resolve(res)
      if (+res.code == 0) {
        // 清除活动参与缓存：转让店铺给店员，扫面对面码加入店铺，修改地址判断
        wx.removeStorageSync('inActCoupon');
      }
    }).catch(err => {
      reject(err)
    });
  })
}
/*
 *@method 设置缓存
 *@param string key 前缀
 *@param mixed value 值
 *@param number time 缓存秒数,默认永久
 *@return void
 */
const setCache = (key, val, time = 0) => {
  if (time) {
    val = {
      "_exp_": new Date().getTime() + time * 1000,
      "data": val
    };
  }
  return wx.setStorageSync(key, val);
}

/*
 *@method 获取缓存
 *@param string key 前缀
 *@return void
 */
const getCache = (key) => {
  var val = wx.getStorageSync(key);
  if (val && val.hasOwnProperty('_exp_')) {
    if (new Date().getTime() > val._exp_) {
      wx.removeStorageSync(key);
      return '';
    }
    val = val.data;
  }
  return val;
}
//版本更新
const updateManger = function updateManger() {
  return new Promise((resolve) => {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        resolve(res);

        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新版本下载失败
            wx.showModal({
              title: '系统检查已经有新版本了',
              content: '亲，新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })

    } else {
      resolve({
        hasUpdated: false
      });
      wx.showModal({
        title: '温馨提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }

  })
}
// 上传图片
const uploadImgAI = (file) => {

  wx.showLoading({
    title: '上传中',
    mask: true
  })

  return new Promise(function (resolve, reject) {
    wx.uploadFile({
      url: http.baseURL + '/api/tools/imgupload',
      filePath: file,
      name: 'img',
      header: {
        'Authorization': wx.getStorageSync('token')
      },

      success(res) {
        let result = JSON.parse(res.data)
        if (result.code == 0) {
          wx.showModal({
            title: '温馨提示',
            content: result.msg
          })
          return reject(result.msg)
        }
        resolve(result.data)
      },
      fail(err) {
        reject(err)
      },
      complete() {
        wx.hideLoading()
      }
    })
  })
}
// 获取首页广告资源
const getAd = () => {
  return new Promise((resolve, reject) => {
    http.postBase({
      url: '/api/ad/get',
      mask: false
    }).then(res => {
      let {
        code,
        data
      } = res;
      if (code == 1) {
        setCache('cosAddressNew_c', JSON.stringify(data));
        return resolve(data)
      }
      reject(res)
    }).catch(err => {
      reject(err)
    })
  })
}
// 替换第二个字符串
const replaceSecStar = function replaceSecStar(str, char = "*") {
  if (str && str.length >= 2) {
    return str.substring(0, 1) + char + str.substring(2);
  } else {
    return str;
  }
}
// 防止重复打开页面导致异常(小程序中页面栈最多十层。)：传参路径前缀不要有/
const navigateFrequentPage = (url = '', param = '') => {
  if (!url) {
    return
  }
  //获取当前页面栈
  let pages = getCurrentPages() || [];
  if (pages.length) {
    //查询排行榜页面索引
    let pageIndex = pages.findIndex(item => item.route == url);
    //找到索引的，返回至排行榜页（wx.navigateBack关闭当前页面）
    if (pageIndex > -1) {
      wx.navigateBack({
        delta: pageIndex,
      })
      return
    }
  }
  //页面栈里无指定页面再跳转（小程序中页面栈最多10层，超出会报错：fail webview count limit exceed）
  wx.navigateTo({
    url: `/${url+param}`,
    fail: (err) => {
      wx.showToast({
        title: JSON.stringify(err),
        icon: 'none'
      })
    }
  })
}
const current_date = parseTime(new Date(), '{y}-{m}-{d}');
// 每日弹窗一次缓存判断逻辑
function checkDateShowDailyPop(key) {
  if (wx.getStorageSync(key) !== current_date) {
    wx.setStorageSync(key, current_date);
    return true;
  }
  return false;
}

function debounce(fn, delay, immediate) {
  let timer
  let result
  return function (...args) {
    if (timer) clearTimeout(timer)

    if (immediate) {
      // 如果timer存在，说明第二次调用的时候还没到delay时间，因为如果超过delay时间
      // timer会被赋值为null，所以这个时候我们不应该执行fn，应该重新设置一个定时器
      // 但如果是一次的时候，因为还没有设过定时器，所以这里timer会是undefined
      if (timer) {
        timer = setTimeout(() => timer = null, delay)
      } else {
        result = fn.apply(this, args)
        return result
      }
    } else {
      timer = setTimeout(() => fn.apply(this, args), delay)
    }
  }
}


module.exports = {
  formatTime: formatTime,
  request: request,
  throttle: throttle,
  getMID: getMID,
  getLastMonth: getLastMonth,
  getUrlPara: getUrlPara,
  checkAuth: checkAuth,
  randomToken: randomToken,
  contentBottom: contentBottom,
  InnerAudio: InnerAudio,
  getUrlObj: getUrlObj,
  parseTime: parseTime,
  getShopQr,
  getNavbarData,
  formatAmount,
  countDownTime,
  getUserInfoNew,
  getShopInfo,
  parseStringToStar,
  padLeft,
  isHide,
  getMyRankInfo,
  paperCodeExchangeShopId,
  bindChangePaperCode,
  getShopInfoMini,
  updateUserInfo,
  getMsg,
  newUser,
  getlbs,
  getUnreadNotice,
  VALID_CACHE,
  getcountcard,
  getParseDate,
  getSetting,
  isStoreRankArea,
  // storeRankArea:storeRankArea.join("、"),
  storeRankArea: '广州市、东莞市、深圳市、佛山市、中山市、惠州市、湛江市、江门市、珠海市、汕头市、肇庆市、清远市、茂名市、揭阳市、阳江市、河源市、梅州市、韶关市、云浮市、汕尾市、潮州市',
  blockAd,
  actCoupon_getinfo,
  actCoupon_prizeact,
  actCoupon_history,
  inActCoupon,
  inActCouponTips,
  storeAddress,
  act_countDownTime,
  compareVersion,
  act3_getinfo, //东莞3期店铺陈列活动参与信息
  hms_countDownTime,
  setCache: setCache,
  getCache: getCache,
  updateManger: updateManger,
  uploadImgAI: uploadImgAI,
  getAd: getAd,
  replaceSecStar,
  navigateFrequentPage, // 频繁打开重复页面
  checkDateShowDailyPop,
  debounce
}