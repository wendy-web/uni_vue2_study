import store from '@/store';
import { BASEURL } from '@/config';
import {
    VALID_CACHE
} from '@/utils/index.js';
import {
    setStorage,
    getStorage
} from '@/utils/auth.js';
import log from "@/utils/log.js";
/**
 * 使用配置
	return http.post({
		url:'/api/ad/get', //请求url
		data:{app:1},//请求参数
		isCache:Boolean,//是否开启缓存
		type:'cache',//接口类型 cache 属于缓存类型
		cacheMaxAge:Number,//缓存有效时间  单位秒
		isNoLoading:Boolean //true不开启loading  false开启loading 默认开启
	})
 */

//默认请求头
const defaultHeader = {
    contentType: 'application/x-www-form-urlencoded'
        // 'Content-Type': 'application/json'
};

//统计loading次数
let _loadingNum = 0;

//cache 缓存默认时间 单位秒
const _cacheTime = 1800;

//请求队列
let REQLIST = []
    //请求队列size
let REQLISTSIZE = []

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
    //出栈
    if (REQLISTSIZE.length > 0) {
        REQLISTSIZE.pop()
    }
    //隐藏loading
    if (!config.isNoLoading) _closeLoading();
    //请求成功响应
    if (response.statusCode == 200) {
        let result = response.data;
        if (!result) return 'error';
        //身份验证失败 刷新token
        const isLoginURL = /wxlogin/.test(config.url)
        if (result.code == -1 || (result.code == 0 && isLoginURL)) {
            //确保没有其它请求干扰了
            if (REQLISTSIZE.length == 0) {
                setTimeout(() => {
                    //清除登录信息
                    store.commit('user/loginout')
                    store.dispatch('user/wxlogin').then(res => {
                        // debugger

                        for (; REQLIST.length > 0;) {

                            let cb = REQLIST.pop()

                            cb()

                        }

                    })
                }, 200)
            }
            return 'not';
        }

        //被拉黑的用户
        if (result.code == 2 && isLoginURL) {
            //确保没有其它请求干扰了
            if (REQLISTSIZE.length == 0) {
                setTimeout(() => {
                    //清空用户信息
                    user.loginout()
                    uni.showModal({
                        title: '温馨提示',
                        content: result.msg,
                        showCancel: false
                    });
                }, 200)
            }
            return 'not';
        }
        //您已被移除团队
        if (result.code == 3 && !config.isHome) {
            //确保没有其它请求干扰了
            if (REQLISTSIZE.length == 0) {
                uni.showModal({
                    title: '温馨提示',
                    content: '您已被移除团队',
                    showCancel: false,
                    success() {
                        uni.reLaunch({
                            url: '/pages/tabBar/home/index'
                        })
                    }
                });
                //更新用户信息
                store.dispatch('user/getUserInfo').then(res => {})
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
XHService.prototype._request = function(config) {
    // 进栈
    REQLISTSIZE.push(config.url);
    // 动态加入token
    const {
        token
    } = store.getters

    if (token) {
        config.header = {
            'authorization': token
        };
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
                if (REQLIST.length > 0) {
                    REQStackOut(config.url)
                }
                if (REQLISTSIZE.length > 0) {
                    REQLISTSIZE.pop()
                }
                //关闭loading
                if (!config.isNoLoading) _closeLoading();
                //直接返回缓存值
                return resolve({
                    code: 1,
                    data: cache.data
                });
            }
        }

        //发起请求
        uni.request({
            url: BASEURL + config.url,
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
                //登录失效情况则不处理
                if (res == 'not') {
                    REQLIST.push(() => {

                        this._request(config).then(res => {

                            resolve(res)

                        })
                    })

                    return
                };
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
export function _startLoading() {
    _loadingNum++;
    uni.showLoading({
        title: '请稍后···',
        mask: true
    });
}
//关闭loading
function _closeLoading() {
    if (_loadingNum >= 1) {
        //延时调用
        _loadingNum--;
        if (_loadingNum == 0) uni.hideLoading(); //隐藏
    }
}
//请求出栈
function REQStackOut(url) {

    let index = REQLIST.findIndex(item => item.url === url)

    REQLIST.splice(index, 1)

}
//请求异常处理
function getHttpErrMsg(errMsg) {

    return `亲，您的网络好像出现了状况，请稍后再尝试哟！(${errMsg.replace(/(request:fail)|(。)/g, '')})`

}

const HTTP = new XHService({
    config: {}, //全局配置
    req: _req, //请求前拦截
    res: _res //响应拦截
});
/*创建请求实例*/
export default function(config) {
    return HTTP._request(config)
}