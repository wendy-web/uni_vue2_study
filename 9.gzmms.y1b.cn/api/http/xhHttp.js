import store from '@/store'
import log from "@/utils/log.js"
import {
	XhHttp
} from './index'

//接口域名
//获取小程序版本号
const getAccountInfo = uni.getAccountInfoSync();
// envVersion: develop开发版,trial	体验版,release	正式版
const envVersion = getAccountInfo.miniProgram.envVersion || 'release';
console.log("envVersion", envVersion)
const devUrl = 'https://203.195.203.96:803';
export const proUrl = 'https://gzmms.y1b.cn';
// export const baseUrl = 'https://203.195.203.96:803'; //正式
export const baseUrl = envVersion === "release" ? proUrl : devUrl;
export const imgBaseUrl = 'https://file.y1b.cn/public/erpxcx_img/'
export const uploadUrl = baseUrl + "/apios/post/upimg"
/** 带水印的 */
export const watermarkUploadUrl = baseUrl + "/apios/post/upWatermarkImg"

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
	whiteURL: ['/api/get/gpt', '/api/ad/get', '/api2/cget/getConfig', '/api2/cpost/wxlogin'],
	/**拦截器 */
	interceptor: {
		/**请求前 */
		request(config, context, resolve) {

			let isContinueExecute = true

			let token = uni.getStorageSync('token')

			let moduleType = uni.getStorageSync('moduleType') || 0;
			console.log("moduleType", moduleType);
			if (token) {

				context.config.header['authorization'] = token

			}
			if (typeof moduleType === "number" || typeof moduleType === "string") {
				context.config.header['Module-Type'] = moduleType;
			}

			if (!config.isNoLoading) context.startLoading();


			//缓存类型接口先查询是否有缓存
			if (config.isCache) {

				let cache = uni.getStorageSync(config.url)

				let result = cache && JSON.parse(cache)
				//是否在缓存有效期
				if (result && context.VALID_CACHE(config.cacheMaxAge || context.cacheTime, result
						.lastModified)) {
					//关闭loading
					if (!config.isNoLoading) context.closeLoading();
					//还回缓存结果    
					resolve({
						code: '1',
						msg: '',
						data: result.data
					});

					isContinueExecute = false

					//清除当前请求队列
					context.popAsyncReqUrl(config.url)
				}
			}

			return isContinueExecute

		},
		/**响应前 */
		response(res, config, context, resolve, reject) {
			//是否是登录接口
			const isLoginURL = /login\/check/.test(config.url);
			// console.log("isLoginURL", isLoginURL)
			//清除当前请求队列里的url
			context.popAsyncReqUrl(config.url)
			//关闭loading
			if (!config.isNoLoading) {
				context.closeLoading()
			}
			//响应成功
			if (res.statusCode == 200 && res.data) {

				let result = res.data

				//身份验证失败 刷新token 重启请求
				if (result.code == -1 || result.code == 5) {
					//未被刷新过或者正在刷新就不再执行 
					if (context.asyncReqListSize.length === 0 && !context.isRefreshToken) {

						context.isRefreshToken = true

						//确保没有其它请求干扰了
						setTimeout(() => {
							//清除登录信息
							store.commit('user/LOGINOUT')
							store.dispatch('user/wxlogin').then((res) => {
								context.isRefreshToken = false
								if (res.code == 3) {
									const pages = getCurrentPages();
									console.log("pages", pages)
									let path = pages[pages.length - 1].route;
									let options = pages[pages.length - 1].options;
									let router = "/" + path

									// console.log("router", router)
									let url = options.q ?
										`/pages/login/login?router=${encodeURIComponent(router)}&q=${options.q}` :
										`/pages/login/login?router=${encodeURIComponent(router)}`

									uni.redirectTo({
										url,
									});
									context.reqErrList = []
									return
								} else if (res.code == 2) {
									uni.redirectTo({
										url: "/pages/ipHint/ipHint",
									});
									context.reqErrList = []
									return
								}
							}).catch(() => {
								context.isRefreshToken = false
							})
						}, 200)
					}

					//将未登录导致调用异常的接口缓存到队列
					context.reqErrList.push(() => {

						context.request(config).then(res => {

							resolve(res)

						}).catch(err => {

							reject(err)

						})
					})

					return
				} else if (result.code == 0) {
					uni.showToast({
						title: result.msg,
						icon: "none",
						duration: 3000
					});
					reject(result)
					return
				} else if (result.code == -2) {
					wx.showModal({
						title: '温馨提示',
						content: "很抱歉,您没有操作权限!",
						showCancel: false,
						confirmText: "我知道了",
						success() {
							uni.reLaunch({
								url: "/pages/tabBar/home/index"
							})
						}
					});
					reject(result)
					return
				}

				resolve(result)

				if (isLoginURL || !context.whiteURL.includes(config.url)) {
					setTimeout(() => {
						for (; context.reqErrList.length > 0;) {
							let cb = context.reqErrList.pop()
							cb()
						}
					}, 0)
				}

				if (config.type === 'cache' && result) {
					context.setCacheData(result, config.url)
				}

				return

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