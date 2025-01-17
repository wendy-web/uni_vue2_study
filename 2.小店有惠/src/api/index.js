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
        //同步发起的请求队列
    asyncReqListSize = []
        //是否在刷新token
    isRefreshToken = false
    constructor(option) {
        this.baseUrl = option.baseUrl;
        this.config = {
            ...this.config,
            ...option.config
        }
        this.whiteURL = option.whiteURL || this.whiteURL
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
            let isContinueExecute = true;
            if (this.interceptor.request) {
                isContinueExecute = this.interceptor.request(config, this, resolve);
            }
            if (!isContinueExecute) return;
            let _url = this.qs(config);
            uni.request({
                url: this.baseUrl + _url,
                method: config.method || this.config.method,
                data: config.data,
                header: this.config.header,
                dataType: this.config.dataType,
                responseType: this.config.responseType,
                timeout: this.config.timeout,
                complete: (response) => {
                    // 响应拦截处理
                    if (this.interceptor.response) {
                        this.interceptor.response(response, config, this, resolve, reject);
                        return;
                    }
                    // 成功
                    if (response.statusCode == 200) {
                        return resolve(response);
                    }
                    // 失败
                    reject(response);
                }
            })
        }).catch((e) => {});
    }
    qs({
        url,
        params
    }) {
        // 没有则直接返回
        if (Object.prototype.toString.call(params) !== "[object Object]") return url;
        // url参数处理
        let val = url.split('?')
        let _url = val[0]
        let qs = val[1] || ''
        Object.keys(params).forEach((attr, index) => {
            let prefix = '';
            if (index === 0 && qs || index > 0) {
                prefix = '&';
            }
            qs += `${prefix}${attr}=${params[attr]}`;
        });
        return _url + '?' + qs;
    }

    closeLoading() { // 关闭loading
        if (this.loadingNum >= 1) {
            // 延时调用
            this.loadingNum--;
            if (this.loadingNum == 0) {
                clearTimeout(this.loadingTime);
                if (this.hasPageLoading) uni.hideLoading({ fail() {} });
                if (this.hasNavigationBarLoading) uni.hideNavigationBarLoading();
                this.loadingStatus = false;
            }
        }
    }

    startLoading() { // 打开loading
        this.loadingNum++;
        if (this.loadingStatus) return;
        clearTimeout(this.loadingTime);
        /*仅在网络不好时才会显示*/
        this.loadingTime = setTimeout(() => {
            this.loadingStatus = true;
            if (this.hasPageLoading) {
                uni.showLoading({
                    title: '请稍后···',
                    mask: true
                });
            }
            if (this.hasNavigationBarLoading) {
                uni.showNavigationBarLoading({
                    complete(e) {}
                });
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
        url = url.split('?')[0];
        if (this.asyncReqListSize.length > 0 && !this.whiteURL.includes(url)) {
            this.asyncReqListSize.pop();
        }
    }

    VALID_CACHE(cacheMaxAge, lastModified) {
        // 缓存时间是否在有效期
        return lastModified + cacheMaxAge * 1000 >= Date.now();
    }

    setCacheData(res, url) { // 设置接口缓存
        // 请求正确，返回值不为空
        if (res.code == 1 && res.data) {
            // 添加缓存
            uni.setStorageSync(url, JSON.stringify({
                lastModified: Date.now(),
                data: res.data
            }))
        }
    }

    getHttpErrMsg({ // 处理错误信息
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
