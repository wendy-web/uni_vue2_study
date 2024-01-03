import log from './log.js';
//缓存时间是否在有效期
export function VALID_CACHE(cacheMaxAge, lastModified) {
	return lastModified + cacheMaxAge * 1000 >= Date.now();
}
//判断用户Session 是否过期
export function xhCheckSession(isNoSession) {

	return new Promise((resolve, reject) => {

		if (isNoSession) return reject();

		if (!store.getters.token) return reject();

		uni.checkSession({
			success: res => {
				resolve();
			},
			fail: res => {
				reject();
			}
		});

	});

}

/*时间转化*/
export function parseTime(time, cFormat) {
	if (arguments.length === 0 || !time) {
		return null;
	}
	const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
	let date;
	if (typeof time === 'object') {
		date = time;
	} else {
		if ((typeof time === 'string')) {
			if ((/^[0-9]+$/.test(time))) {
				// support "1548221490638"
				time = parseInt(time);
			} else {
				// support safari
				// https://stackoverflow.com/questions/4310953/invalid-date-in-safari
				time = time.replace(new RegExp(/-/gm), '/');
			}
		}

		if ((typeof time === 'number') && (time.toString().length === 10)) {
			time = time * 1000;
		}
		date = new Date(time);
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	};
	const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
		const value = formatObj[key];
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') {
			return ['日', '一', '二', '三', '四', '五', '六'][value];
		}
		return value.toString().padStart(2, '0');
	});
	return time_str;
}


export function compareVersion(v1, v2) {
	v1 = v1.split('.');
	v2 = v2.split('.');
	const len = Math.max(v1.length, v2.length);

	while (v1.length < len) {
		v1.push('0');
	}
	while (v2.length < len) {
		v2.push('0');
	}

	for (let i = 0; i < len; i++) {
		const num1 = parseInt(v1[i]);
		const num2 = parseInt(v2[i]);

		if (num1 > num2) {
			return 1;
		} else if (num1 < num2) {
			return -1;
		}
	}

	return 0;
}

export function wrapTouch(event) {
	for (let i = 0; i < event.touches.length; ++i) {
		const touch = event.touches[i];
		touch.offsetX = touch.x;
		touch.offsetY = touch.y;
	}
	return event;
}


/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
	let timeout, args, context, timestamp, result;

	const later = function() {
		// 据上一次触发时间间隔
		const last = +new Date() - timestamp;

		// 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
		if (last < wait && last > 0) {
			timeout = setTimeout(later, wait - last);
		} else {
			timeout = null;
			// 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
			if (!immediate) {
				result = func.apply(context, args);
				if (!timeout) context = args = null;
			}
		}
	};

	return function(...args) {
		context = this;
		timestamp = +new Date();
		const callNow = immediate && !timeout;
		// 如果延时不存在，重新设定延时
		if (!timeout) timeout = setTimeout(later, wait);
		if (callNow) {
			result = func.apply(context, args);
			context = args = null;
		}

		return result;
	};
}
// 激励视频广告
export function RewardedVideoAd(adUnitId, closeFun, errorFun) {
	return {
		videoAd: null,
		adUnitId: adUnitId,
		resetNum: 0,
		errMsg: '',
		isLoadSuccess: false,
		isLoading: false,
		videoAdError: null,
		closeFun: closeFun || null,
		errorFun: errorFun || null,
		init({
			errMsg
		}) {
			if(this.videoAd) {
				this.destroyVideoAd();
			}
			if (wx.createRewardedVideoAd) {// && !this.videoAd
				this.videoAd = wx.createRewardedVideoAd({
					adUnitId: this.adUnitId
				});
				this.videoAd.onLoad((res) => {
					this.isLoadSuccess = true;
					console.log('videoAd onLoad', JSON.stringify(this), res)
				});
				this.videoAd.onError((err) => {
					this.isLoadSuccess = false;
					this.videoAdError = err;
					log.setFilterMsg('视频初始化异常');
					log.error('返回的error' + JSON.stringify(err));
				});
				this.videoAd.onClose((res) => {
					let complete = res && res.isEnded;
					console.log('videoAd onClose', JSON.stringify(this), res)
					this.isLoadSuccess = true;
					if (this.closeFun && (typeof this.closeFun == 'function')) this.closeFun(complete);
				});
			}
			this.errMsg = errMsg;
			this.resetNum = 0;
			console.log(this.videoAd,"init中创建")
		},
        delayedLoad(){
        	this.isLoadSuccess = false
		},
		destroyVideoAd() {
			this.videoAd.offLoad()
			this.videoAd.offError()
			this.videoAd.offClose()
			this.videoAd.destroy();
			this.videoAd = null;
		},
		show() {
			console.log('videoAd start show', JSON.stringify(this))
			if (!this.isLoading) {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				this.isLoading = true
			}

			if (this.isLoadSuccess) {
				this.delayedLoad()

				console.log('videoAd show isLoadSuccess = true')

				this.videoAd.show().then((res) => {

					uni.hideLoading()
					this.isLoading = false

					console.log('videoAd show then isLoadSuccess = true ----- 虽然为true，但却未打开', res);

				}).catch((err) => {

					this.isLoadSuccess = false

					this.show()

					console.log('videoAd show catch isLoadSuccess = true', err);
					log.setFilterMsg('视频初始化后播放异常');
					log.error('返回的error' + JSON.stringify(err));
				});
				if(this.errorFun && (typeof this.errorFun === 'function')) {
					this.errorFun();
				}


			} else if (this.resetNum < 3) {

				console.log('videoAd show catch isLoadSuccess = false', this.resetNum)

				this.resetNum++;

				this.videoAd.load().then((res) => {

					console.log('videoAd show load then isLoadSuccess = false', res)

					// this.videoAd.show()
					this.isLoadSuccess = true
					this.show()
					// uni.hideLoading()
					// this.isLoading = false
				}).catch((err) => {
					console.log('videoAd show load catch isLoadSuccess = false_已经被销毁的话，重新创建', err);

					// this.destroyVideoAd();
					// this.init({
					// 	errMsg: this.errMsg || ''
					// });
					this.show();
					this.videoAdError = err
				})

			} else {
				console.log('videoAd show 温馨提示');
				let errCode = '';
				if (this.videoAdError && this.videoAdError.errCode) {
					errCode = `(errCode=${this.videoAdError.errCode})`
				}
				uni.showModal({
					title: '温馨提示',
					content: this.errMsg + errCode
				});
				uni.hideLoading();
				this.isLoading = false
				if(this.errorFun && (typeof this.errorFun === 'function')) {
					this.errorFun(this.videoAdError || {
						errMsg: this.errMsg
					});
				}
				this.destroyVideoAd();
				this.init({
					errMsg: this.errMsg || ''
				});
			}
		}
	};
}

// 转化函数 一维数组转二维数组
export function setTwoDimensionalArray(list, size) {
	const listResult = []; // 最终返回的二维数组
	for (let i = 0; i < Math.ceil((list.length / size)); i++) {
		listResult[i] = [];
		for (let j = 0; j < size; j++) {
			// 如果是最后一个板块
			if (i === (Math.ceil((list.length / size)) - 1)) {
				if (Math.ceil((list.length % size)) !== 0) {
					// 只有最后一个板块的数据在余数以内的才赋值
					if (j < Math.ceil((list.length % size))) {
						listResult[i][j] = list[i * size + j];
					}
				} else {
					// 如果刚好整整一个板块，则全部附上值
					listResult[i][j] = list[i * size + j];
				}
			} else {
				listResult[i][j] = list[i * size + j];
			}
		}
	}
	return listResult;
}

