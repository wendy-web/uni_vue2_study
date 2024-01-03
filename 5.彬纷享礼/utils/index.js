import log from '@/utils/log.js';
import store from '@/store';

//转化url地址
export function parseQuery(url = '') {
	let o = {};
	let queryString = url.split('?')[1];
	if (queryString) {
		queryString
			.split('&')
			.forEach(item => {
				let [key, val] = item.split('=');
				val = val ? decodeURI(val) : true;
				//转码无值赋值true
				if (o.hasOwnProperty(key)) {
					//已有属性转为数组
					o[key] = [].concat(o[key], val);
				} else {
					o[key] = val;
				}
			});
	}
	return o;
}
//组合支付数据
export function setParmasData(arr, key, value) {
	let o = {};
	arr.forEach(function(item) {

		o[item[key]] = item[value];

	});
	return o;
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


//缓存时间是否在有效期
export function VALID_CACHE(cacheMaxAge, lastModified) {

	return lastModified + cacheMaxAge * 1000 >= Date.now();

}

//filter广告数据
export function filterAdData(arr = [], key) {
	let _arr = [];
	for (let i = 0; i < arr.length; i++) {
		let data = arr[i][key];
		if (data) {
			_arr.push(data);
		}
	}
	return _arr;
}

//插屏广告
export function PLAQUEADVERTISING(option = {}) {
	return {
		interstitialAd: null,
		adUnitId: '',
		timer: null,
		init: function(adUnitId) {
			this.adUnitId = adUnitId;
			// 在页面onLoad回调事件中创建插屏广告实例
			if (wx.createInterstitialAd) {
				this.interstitialAd = wx.createInterstitialAd({
					adUnitId: adUnitId
				});
				this.interstitialAd.onLoad(() => {
					//是否自动播放
					if (option.isAutoPlay) {
						console.log('play');
						clearTimeout(this.timer)
						this.timer = setTimeout(() => {
							this.play();
						}, 666)
					}
					if (option.onLoadBack) option.onLoadBack();
				});
				this.interstitialAd.onError((err) => {
					if (this.interstitialAd) {
						this.interstitialAd.destroy(); //销毁实列
					}
					// this.interstitialAd = wx.createInterstitialAd({
					// 	adUnitId: adUnitId
					// })
				});
				this.interstitialAd.onClose(() => {
					console.log('onClose');
					if (option.onClose) option.onClose();
				});
			}
		},
		destroy: function() {
			if (this.interstitialAd) this.interstitialAd.destroy(); //销毁实列
			clearTimeout(this.timer)
		},
		playBase: function() {
			return new Promise((resolve, reject) => {
				if (store.getters.isShowAd && this.interstitialAd) {
					setTimeout(() => {
						//控制插屏广告
						let zmcpad = wx.getStorageSync('zmcpad')

						if (this.interstitialAd && (!zmcpad || showZmcpad(zmcpad))) {
							this.interstitialAd.show().then(res => {
								resolve();
								//处理战马广告弹出记录
								if (zmcpad) showZmcpadRecord(zmcpad)
							}).catch((err) => {
								reject();
							});
							wx.removeStorageSync('zmcpad')
							return;
						}
						reject();
					}, 100);
					return;
				}
				reject();
			});
		},
		play: function() {

			// 在适合的场景显示插屏广告
			if (store.getters.isShowAd && this.interstitialAd) {
				setTimeout(() => {
					let zmcpad = wx.getStorageSync('zmcpad')

					if (this.interstitialAd && (!zmcpad || showZmcpad(zmcpad))) {

						this.interstitialAd.show().then(() => {
							//处理战马广告弹出记录
							if (zmcpad) showZmcpadRecord(zmcpad)
						}).catch((err) => {
							if (option.errback) option.errback();
						});
					}
				}, 100);
			}
		}
	};
}

function showZmcpad(json) {

	let zmcpad = JSON.parse(json)

	return !VALID_CACHE(24 * 60 * 60, zmcpad.lastModified) || zmcpad.num < store.getters.zm_show_num

}

function showZmcpadRecord(json) {

	let zmcpad = JSON.parse(json)

	if (!VALID_CACHE(24 * 60 * 60, zmcpad.lastModified)) {
		return wx.removeStorageSync('zmcpad')
	}

	zmcpad.num++

	wx.setStorageSync('zmcpad', JSON.stringify(zmcpad))

}

//激励视频广告
export function RewardedVideoAd(adUnitId, onClose, onError) {

	return {
		videoAd: null,
		adUnitId: adUnitId,
		init() {
			if (wx.createRewardedVideoAd) {
				this.videoAd = wx.createRewardedVideoAd({
					adUnitId: this.adUnitId
				});
				this.videoAd.onLoad(() => {});
				this.videoAd.onError((err) => {
					if (this.videoAd) {
						this.videoAd.destroy(); //销毁实列
					}
					if (onError) onError();
				});
				this.videoAd.onClose((res) => {
					let complete = res && res.isEnded;
					if (onClose) onClose(complete);
				});
			}
		},
		show() {
			this.videoAd.show().catch(() => {
				// 失败重试
				this.videoAd.load()
					.then(() => this.videoAd.show())
					.catch(err => {
						console.log('激励视频 广告显示失败');
					});
			});
		}
	};

}

//音频播放
export function xhAudio(config) { //url,onPlay,onError,onEnded

	let innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.src = config.url;
	//音频开始播放
	innerAudioContext.onPlay(() => {
		if (config.onPlay) config.onPlay();
	});
	//音频播放异常
	innerAudioContext.onError(() => {
		if (config.onError) config.onError();
	});
	//音频播放自然结束
	innerAudioContext.onEnded(() => {
		if (config.onEnded) config.onEnded();
	});

	return {
		innerAudioContext,
		setSrc(url) {
			this.innerAudioContext.src = url;
		},
		play(url) { //播放
			//有新值，赋值播放
			if (url) this.innerAudioContext.src = config.url;
			//直接播放
			this.innerAudioContext.play();
		},
		pause() { //暂停
			this.innerAudioContext.pause();
		},
		stop() { //停止
			this.innerAudioContext.stop();
		},
		seek(seek) { //设置进度
			this.innerAudioContext.seek = seek;
		},
		destroy() {
			this.innerAudioContext.destroy();
		}
	};
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
				//只打印异常情况
				// log.setFilterMsg('checkSession')
				// log.error('响应结果：' + JSON.stringify(res))
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