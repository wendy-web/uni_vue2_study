import store from '@/store';
import {
    getBaseUrl,
    getPlatform,
    getStorage,
    getToken,
    getUnionId,
    setStorage
} from '@/utils/auth.js';
import log from "@/utils/log.js";
import { XhHttp } from './index';
//获取小程序版本号
const getVersion = uni.getAccountInfoSync();
const envVersion = getVersion.miniProgram.envVersion || 'release';
let platform = getPlatform();
export const baseUrl = envVersion == 'release' ? "https://xdyh.y1b.cn" : getBaseUrl();
/**
 * 使用配置
    return API.request({
        url:'/api/ad/get', //请求url
        data:{app:1},//请求参数
		params:{id:1,name:'xiaohei'},//url参数  => '/api/ad/get?id=1&name=xiaohei'
        isCache:Boolean,//是否开启缓存
        type:'cache',//接口类型 cache 属于缓存类型
        cacheMaxAge:Number,//缓存有效时间  单位秒
        isNoLoading:Boolean //true不开启loading  false开启loading 默认开启
		//测试参数  给接口新增延迟响应
		_delaySecond:2
    })
 */
export default new XhHttp({
    baseUrl,
    whiteURL: [
        "/api/post/wxlogin",
    ],
    loadingDelaySecond: 5,
    /**拦截器 */
    interceptor: {
        /**请求前 */
        request(config, context, resolve) {
            let isContinueExecute = true;
            let token = getToken();
            if (token) {
                context.config.header['authorization'] = token;
            }
            if (platform) {
                context.config.header['device'] = platform;
            }
            if (!config.isNoLoading) context.startLoading();
            //缓存类型接口先查询是否有缓存
            if (config.isCache) {
                let cache = getStorage(config.url)
                let result = cache && JSON.parse(cache)
                    // 是否在缓存有效期
                if (result && context.VALID_CACHE(config.cacheMaxAge || context.cacheTime, result.lastModified)) {
                    //关闭loading
                    if (!config.isNoLoading) context.closeLoading();
                    //还回缓存结果
                    resolve({
                        code: '1',
                        msg: '',
                        data: result.data
                    });
                    isContinueExecute = false;
                    //清除当前请求队列
                    context.popAsyncReqUrl(config.url);
                }
            }
            if (config.data && config.data.hasOwnProperty("unionid") && !config.data.unionid) {
                config.data.unionid = getUnionId();
            }
            return isContinueExecute;

        },
        /**响应前 */
        response(res, config, context, resolve, reject) {
            // 是否是登录接口
            const isLoginURL = /wxlogin/.test(config.url);
            // 清除当前请求队列里的url
            context.popAsyncReqUrl(config.url)
                //关闭loading
            if (!config.isNoLoading) {
                context.closeLoading()
            }
            // 响应成功
            if (res.statusCode == 200 && res.data) {
                let result = res.data;
                //身份验证失败 刷新token 重启请求
                if (result.code == -1 || result.code == 5) {
                    // 确保没有其它请求干扰了
                    if (context.asyncReqListSize.length === 0 && !context.isRefreshToken) {
                        context.isRefreshToken = true;
                        // 确保没有其它请求干扰了
                        setTimeout(() => {
                            // 清除登录信息
                            store.commit('user/loginout')
                            store.dispatch('user/wxlogin').then(res => {
                                context.isRefreshToken = false;
                            }).catch(() => {
                                context.isRefreshToken = false;
                            })
                        }, 200)
                    }
                    //将未登录导致调用异常的接口缓存到队列
                    context.reqErrList.push(() => {
                        context.request(config).then(res => {
                            resolve(res);
                        }).catch(err => {
                            reject(err);
                        })
                    });
                    return;
                }
                // 配置彬纷的-弹窗访问
                if (result.code == 0 && config.data && config.data.hasOwnProperty("unionid")) {
                    context.reqErrList.push(() => {
                        context.request(config).then(res => {
                            resolve(res);
                        }).catch(err => {
                            reject(err);
                        })
                    });
                    return;
                }
                resolve(result);
                if (isLoginURL || !context.whiteURL.includes(config.url)) {
                    setTimeout(() => {
                        for (; context.reqErrList.length > 0;) {
                            let cb = context.reqErrList.pop();
                            cb();
                        }
                    }, 0);
                }

                if (config.type === 'cache' && result) {

                    if (result.code == 1 && result.data) {
                        //添加缓存
                        setStorage(config.url, JSON.stringify({
                            lastModified: Date.now(),
                            data: result.data
                        }))
                    }
                }
                return;
            }
            /**请求失败 统一提示 */
            wx.showModal({
                title: '请求异常',
                content: context.getHttpErrMsg(res),
                showCancel: false
            });
            reject(res);
            log.setFilterMsg('网络请求异常');
            log.warn('请求接口：' + config.url);
            log.warn('请求参数：' + JSON.stringify(config));
            log.error('响应结果：' + JSON.stringify(res));
        }
    }
})
