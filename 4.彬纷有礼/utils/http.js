import {
  VALID_CACHE,
  setStorage,
  getStorage
} from './util.js';
import log from "./log.js"
/**
 * 使用配置
	return http.post({
		url:'xxx', //请求url
		data:{app:1},//请求参数
		isCache:Boolean,//是否开启缓存
		type:'cache',//接口类型 cache 属于缓存类型
		cacheMaxAge:Number,//缓存有效时间  单位秒
		isNoLoading:Boolean //true不开启loading  false开启loading 默认开启
	})
 */
//获取小程序版本号
const getVersion = wx.getAccountInfoSync();
const envVersion = getVersion.miniProgram.envVersion || 'release';
// const envVersion =  'release';
console.log("获取小程序版本：", envVersion, getVersion);
log.info("getVersion:", getVersion);
const baseURL = 'https://txc.y1b.cn'; //正式
const devURL = 'https://new-test.y1b.cn'; //测试
const COS_URL = 'https://file.y1b.cn'; //正式; 
const WSS_URL = envVersion == 'release' ? 'wss://socket.y1b.cn/txc/' : 'wss://new-test.y1b.cn/wss/'; //正式、测试; 
const domainMap = {
  "release": baseURL,
  "develop": devURL,
  "trial": devURL,
}
const whiteList = ['/api/ad/get', '/api/get/getConfig', '/api/user/update', '/api/user/getuser', '/api/user/mnmobile', '/api/post/wxregister']; //白名单：不处理(有些是需要code解密的，不能重复请求)
//页面白名单：不需要授权用户信息
const pageWhiteList = [
  'pages/tabBar/shouye/index', //首页
  'pages/tabBar/shouye/notice', //消息
  'pages/tabBar/shouye/jifen', //积分
  'pages/tabBar/shouye/storeQr', //店铺码
  'pages/user/register/index', //登录页
  'pages/zongduan/saoma/index', //扫一扫
  'pages/user/register/dy', //加入店铺
];
//默认请求头
const defaultHeader = {
  // contentType: 'application/x-www-form-urlencoded'
  'content-type': 'application/json'
};

//统计loading次数
let _loadingNum = 0;

//cache 缓存默认时间 单位秒
const _cacheTime = 1800;

//请求栈
let REQLIST = [];
let REQLISTSIZE = [];
//是否重复请求
let isRepeat = false;
//请求封装
function XHService(data) {

  this.header = data.config.header || defaultHeader;
  this.timeout = data.config.timeout || 30000;
  this.dataType = data.config.dataType || 'json';
  this.responseType = data.config.responseType || 'text';
  this.interceptor = {
    request: data.req, //请求前拦截
    response: data.res //响应结果拦截
  };

}
/*请求前拦截*/
function _req(config) {

  //是否需要加载loading
  if (!config.isNoLoading) _startLoading();

  return config;
}
/*响应前拦截*/
function _res(response, config) { //响应拦截
  //出栈:判断 是有无需token的白名单接口
  if (REQLISTSIZE.length > 0 || whiteList.includes(config.url)) {
    REQLISTSIZE.pop();
  }
  //隐藏loading
  if (!config.isNoLoading) _closeLoading();
  //请求成功响应
  if (response.statusCode == 200) {

    let result = response.data;

    if (!result) return 'error';

    //身份验证失败 刷新token
    const isLoginURL = /wxlogin/.test(config.url)
    if (result.code == -1) {
      if (REQLISTSIZE.length === 0) {
        setTimeout(() => {
          //清除登录信息
          loginout();
          //刷新token
          wxlogin().then(res => {
            console.log("user.wxlogin:", res)
            for (; REQLIST.length > 0;) {
              let cb = REQLIST.pop();
              cb();
            }
          }).catch(err => {
            console.error("userApi:", err)
          })

        }, 200)
      }
      return 'not';
    }

    //被拉黑的用户
    if (result.code == 0 && isLoginURL) {
      //确保没有其它请求干扰了
      if (REQLISTSIZE.length == 0) {
        setTimeout(() => {
          //清空用户信息
          loginout();
          wx.showModal({
            title: '温馨提示',
            content: result.msg,
            showCancel: false
          });
        }, 200)
      }
      return 'not';
    }
    //请求成功
    return result;
  }
  //只打印异常情况
  log.setFilterMsg('网络请求异常');
  log.warn('请求接口：' + config.url);
  log.warn('请求参数：' + JSON.stringify(config));
  log.error('响应结果：' + JSON.stringify(response));

  return 'error'; //请求异常情况
}
//请求函数
XHService.prototype._request = function (config) {
  //动态加入token
  const token = wx.getStorageSync('token');

  if (token) {
    config.header = {
      'authorization': token
    };
  }
  //入栈
  if (!whiteList.includes(config.url) && !config.fromApp) {
    REQLISTSIZE.push(config.url);
  }
  return new Promise((resolve, reject) => {
    //请求拦截处理请求数据
    if (this.interceptor.request) {
      config = this.interceptor.request(config);
    }
    //是否开启了缓存
    if (config.isCache) {
      //从本地获取缓存
      let cache = getStorage(config.url);
      cache = cache && JSON.parse(cache);

      //有缓存并且在缓存有效期
      if (cache && VALID_CACHE(config.cacheMaxAge || _cacheTime, cache.lastModified)) {
        //出栈
        if (REQLISTSIZE.length > 0) REQLISTSIZE.pop();
        //关闭loading
        if (!config.isNoLoading) _closeLoading();
        // console.log('缓存有效，走缓存囖',config)
        //直接返回缓存值
        return resolve({
          code: 1,
          data: cache.data
        });
      }
    }
    let domain = domainMap[envVersion] || baseURL;
    //发起请求
    wx.request({
      url: domain + config.url,
      method: config.method,
      data: config.data,
      header: config.header || this.header,
      dataType: config.dataType || this.dataType,
      responseType: config.responseType || this.responseType,
      timeout: config.timeout || this.timeout,
      complete: (response) => {

        let res = response;

        //响应前拦截
        if (this.interceptor.response) {
          res = this.interceptor.response(res, config);
        }
        //登录失效情况:排除白名单不需要处理的、不是来自app.js的请求（异步）
        // if (res == 'not' && config.url !== '/api/user/getuser' && !config.fromApp) {
        if (res == 'not' && !whiteList.includes(config.url) && !config.fromApp) {
          REQLIST.push(() => {
            this._request(config).then(res => {
              resolve(res)
            })
          })
          //登录失效的时候 全部reject(上面的resolve就没意思了)，wxlogin可以reject:重置isRepeat
          if (/wxlogin/.test(config.url)) {
            return reject(response);
          }
          return
        }
        //异常情况
        if (res == 'error') {
          //处理请求异常消息
          let statusCode = response.statusCode,
            errMsg = getHttpErrMsg(response.errMsg);
          //异常状态码
          if (statusCode !== null && statusCode !== undefined) errMsg +=
            ' statusCode=' + statusCode;
          //提示给用户   
          wx.showModal({
            title: '请求异常',
            content: errMsg,
            showCancel: false
          });
          return reject(response);
        }
        //是缓存接口类型 --> 添加缓存
        if (config.type === 'cache' && res) _setCacheData(res, config.url);
        //正确情况
        resolve(res);
      }
    });
  });

};

function getHttpErrMsg(errMsg) {

  return `亲，您的网络好像出现了状况，请稍后再尝试哟！(${errMsg.replace(/(request:fail)|(。)/g, '')})`

}
//添加缓存
function _setCacheData(res, url) {
  //请求正确，返回值不为空
  if (res.code == 1 && res.data) {
    //添加缓存
    setStorage(url, JSON.stringify({
      lastModified: Date.now(),
      data: res.data
    }));
  }
}

//开启loading
function _startLoading() {
  _loadingNum++;
  wx.showLoading({
    title: '请稍后···',
    mask: true
  });
}
//关闭loading
function _closeLoading() {
  if (_loadingNum >= 1) {
    //延时调用
    setTimeout(() => {
      _loadingNum--;
      if (_loadingNum == 0) wx.hideLoading(); //隐藏
    }, 100);
  }
}
//loginOut
function loginout() {
  wx.removeStorageSync('token');
  wx.removeStorageSync('userdata');
  wx.removeStorageSync('islogin');
}
//wxlogin
function wxlogin() {

  return new Promise((resolve, reject) => {
    if (isRepeat) {
      reject(false);
      return
    }
    isRepeat = true;
    // 微信登录
    wx.login({
      success: (res) => {
        // 解构出code
        let {
          code
        } = res;
        HTTP._request({
          url: '/api/post/wxlogin',
          method: 'post',
          data: {
            code
          },
          isNoLoading: true
        }).then(res => {
          isRepeat = false;

          let {
            code: loginCode,
            msg,
            data
          } = res;
          // 先判断登录成功的状态
          if (loginCode == 1) {
            wx.setStorageSync('token', data.token);
            wx.setStorageSync('islogin', 1);
            wx.setStorageSync('UID', data.uid);
            wx.removeStorageSync('newUser');
            log.addFilterMsg('UID' + data.uid);
            log.info("token:", data.token);
            const app = getApp();
            if (app.tokenReadyCallback) {
              app.tokenReadyCallback(data.token);
            }
            resolve(data.token);
            if (data.new_user == 1) {
              wx.setStorageSync('newUser', true);
              let pages = getCurrentPages() || [];
              let countPages = pages.length;
              let currentPage = pages[countPages - 1] || {};
              let route = '';
              if (currentPage) {
                route = currentPage.route;
              }
              // 首页不需要授权用户信息
              if (route && pageWhiteList.includes(route)) return
              wx.reLaunch({
                url: '/pages/user/register/index',
              })

              return
            }
            //获取用户信息
            getUserInfo().then(res => {}).catch(err => {

            });
            return
          }

          // 登录失败的状态
          if (loginCode == 0) {
            reject(res)
            wx.showModal({
              title: '温馨提示',
              content: msg,
              showCancel: false
            })
            return
          }
          wx.showModal({
            title: '温馨提示',
            content: msg,
            showCancel: false
          })
        }).catch(err => {
          console.log("wxlogin catch:", err)
          isRepeat = false;
        })

      },
      fail: (err) => {
        isRepeat = false;
        reject(err)
        var str = JSON.stringify(err);
        wx.showModal({
          title: '微信登录失败',
          content: str,
        })
        console.log("login fail:", err);
      }
    })
  })
}
//getUserInfo
function getUserInfo() {
  return new Promise((resolve, reject) => {
    HTTP._request({
      url: '/api/user/getuser',
      method: 'post',
      data: '',
      isNoLoading: true
    }).then(res => {
      let {
        code,
        data,
        msg
      } = res;
      if (code == 1) {
        //判断用户身份：不同身份引导页展示不同，存手机号判断是否需要注册
        wx.setStorageSync('who', data.condition);
        wx.setStorageSync('userdata', data);
        wx.setStorageSync('UID', data.id);
        resolve(data)
        return
      }
      reject(res)
    }).catch()
  })
}

const HTTP = new XHService({
  config: {}, //全局配置 
  req: _req, //请求前拦截
  res: _res //响应拦截
});
/*创建请求实例*/
module.exports = {
  baseURL:domainMap[envVersion] || baseURL,
  COS_URL,
  WSS_URL,
  wxlogin,
  HTTP(config) {
    return HTTP._request(config)
  },
  get(url, params = {}) {
    return HTTP._request({
      url,
      data: params,
      method: 'get',
      isNoLoading: true
    })
  },
  post(url, params = {}, mask = true) {
    return HTTP._request({
      url,
      data: params,
      isNoLoading: !mask,
      method: 'post'
    })

  },
  postBase({
    url = '',
    params = {},
    mask = true,
    fromApp = false
  }) {
    return HTTP._request({
      url,
      data: params,
      isNoLoading: !mask,
      method: 'post',
      fromApp
    })
  },
}