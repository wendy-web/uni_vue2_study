export class XhHttp {

	baseUrl = ""

	whiteURL = []

	config = {
		header: {
			contentType: 'application/x-www-form-urlencoded'
		},
		method: 'POST',
		timeout: 30000,
		dataType: 'json',
		responseType: 'text'
	}

	interceptor = {}

	loadingStatus = false

	loadingNum = 0

	loadingDelaySecond = 0.5 //！该值就算不设置，在正常网络上也是能体现无感刷新的，根据自己情况设置

	loadingTime = null

	hasPageLoading = true //showLoading

	hasNavigationBarLoading = true //showNavigationBarLoading

	cacheTime = 1800

	// 因登录失效而请求失败的请求队列
	reqErrList = []
	//不加入失效重启队列的名单
	errListWhiteURL = []
	//同步发起的请求队列
	asyncReqListSize = []
	//是否在刷新token
	isRefreshToken = false

	constructor(option) {
		this.baseUrl = option.baseUrl
		if (option.config) {
			this.config.header = option.config.header || this.config.header
			this.config.timeout = option.config.timeout || this.config.timeout
			this.config.dataType = option.config.dataType || this.config.dataType
			this.config.responseType = option.config.responseType || this.config.responseType
		}
		this.whiteURL = option.whiteURL || this.whiteURL
		this.errListWhiteURL = option.errListWhiteURL || this.errListWhiteURL
		this.cacheTime = option.cacheTime || this.cacheTime
		this.loadingDelaySecond = option.loadingDelaySecond || this.loadingDelaySecond
		this.hasPageLoading = option.hasPageLoading || this.hasPageLoading
		this.hasNavigationBarLoading = option.hasNavigationBarLoading || this.hasNavigationBarLoading
		if (option.interceptor) {
			this.interceptor = option.interceptor
		}

	}


	request(config) {

		this.pushAsyncReqUrl(config.url)

		return new Promise((resolve, reject) => {

			let isContinueExecute = true

			if (this.interceptor.request) {

				isContinueExecute = this.interceptor.request(config, this, resolve);

			}

			if (!isContinueExecute) return

			let _url = this.qs(config)

			uni.request({
				url: this.baseUrl + _url,
				method: config.method || this.config.method,
				data: config.data,
				header: this.config.header,
				dataType: this.config.dataType,
				responseType: this.config.responseType,
				timeout: this.config.timeout,
				complete: (response) => {

					/*xiaohei test*/

					// if (config._delaySecond) {

					// 	setTimeout(() => {

					// 		//响应拦截处理
					// 		if (this.interceptor?.response) {

					// 			this.interceptor.response(response, config, this,
					// 				resolve, reject);

					// 			return
					// 		}

					// 		//成功
					// 		if (response.statusCode == 200) {
					// 			return resolve(response)
					// 		}

					// 		//失败
					// 		reject(response)

					// 	}, config._delaySecond * 1000)

					// 	return
					// }

					/*xiaohei test*/

					//响应拦截处理
					if (this.interceptor.response) {

						this.interceptor.response(response, config, this, resolve, reject);

						return
					}

					//成功
					if (response.statusCode == 200) {
						return resolve(response)
					}

					//失败
					reject(response)


				}
			})
		})
	}

	//处理url参数  {id:1,name:'xiaohei'} => '/api2/ccard/createcardpay?id=1&name=xiaohei'
	qs({
		url,
		params
	}) {
		//没有则直接返回
		if (Object.prototype.toString.call(params) !== "[object Object]") return url

		//url参数处理 
		let val = url.split('?')
		let _url = val[0]
		let qs = val[1] || ''

		Object.keys(params).forEach((attr, index) => {

			let prefix = ''

			if (index === 0 && qs || index > 0) {

				prefix = '&'

			}

			qs += `${prefix}${attr}=${params[attr]}`

		})

		return _url + '?' + qs
	}

	//关闭loading
	closeLoading() {
		if (this.loadingNum >= 1) {
			//延时调用
			this.loadingNum--;

			if (this.loadingNum == 0) {

				clearTimeout(this.loadingTime)

				if (this.hasPageLoading) uni.hideLoading();

				if (this.hasNavigationBarLoading) uni.hideNavigationBarLoading()

				this.loadingStatus = false
			}
		}
		// console.log(
		// 	`loadingNum=${this.loadingNum} loadingStatus=${this.loadingStatus} loadingTime=${this.loadingTime}`)
	}
	//打开loading
	startLoading() {

		this.loadingNum++;

		// console.log(
		// 	`loadingNum=${this.loadingNum} loadingStatus=${this.loadingStatus} loadingTime=${this.loadingTime}`)

		if (this.loadingStatus) return

		clearTimeout(this.loadingTime)

		/*仅在网络不好时才会显示*/
		this.loadingTime = setTimeout(() => {

			this.loadingStatus = true

			if (this.hasPageLoading) {
				uni.showLoading({
					title: '请稍后···',
					mask: true
				});
			}

			if (this.hasNavigationBarLoading) {
				uni.showNavigationBarLoading({
					complete(e) {
						// console.log('showNavigationBarLoading', e)
					}
				})
			}

		}, this.loadingDelaySecond * 1000)
	}

	pushAsyncReqUrl(url) {

		url = url.split('?')[0]

		if (!this.whiteURL.includes(url)) {

			this.asyncReqListSize.push(url);

		}


	}

	popAsyncReqUrl(url) {

		url = url.split('?')[0]

		if (this.asyncReqListSize.length > 0 && !this.whiteURL.includes(url)) {

			this.asyncReqListSize.pop();

		}

	}


	//缓存时间是否在有效期
	VALID_CACHE(cacheMaxAge, lastModified) {

		return lastModified + cacheMaxAge * 1000 >= Date.now();

	}
	//设置接口缓存
	setCacheData(res, url) {
		//请求正确，返回值不为空
		if (res.code == 1 && res.data) {
			//添加缓存
			uni.setStorageSync(url, JSON.stringify({
				lastModified: Date.now(),
				data: res.data
			}))
		}
	}

	//处理错误信息
	getHttpErrMsg({
		errMsg,
		statusCode
	}) {

		errMsg = `亲，您的网络好像出现了状况，请稍后再尝试哟！(${errMsg.replace(/(request:fail)|(。)/g, '')})`

		if (statusCode) {
			errMsg += ' statusCode=' + statusCode;
		}

		return errMsg

	}

}