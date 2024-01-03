//激励视频广告
export default function(adUnitId, closeFun, errorFun) {
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
			if (this.videoAd) {
				this.destroyVideoAd();
			}
			if (wx.createRewardedVideoAd) { // && !this.videoAd
				this.videoAd = wx.createRewardedVideoAd({
					adUnitId: this.adUnitId,
					multiton: true
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
			console.log(this.videoAd, "init中创建")
		},
		delayedLoad() {
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
				if (this.errorFun && (typeof this.errorFun === 'function')) {
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
				if (this.errorFun && (typeof this.errorFun === 'function')) {
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
