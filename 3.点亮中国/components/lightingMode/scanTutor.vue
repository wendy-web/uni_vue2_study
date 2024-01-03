<template>
	<view class="scan-tutor">
		<van-popup :show="show" @close="popupClose" custom-style="background-color: transparent;"
			:close-on-click-overlay="false" z-index="99">
			<view class="scan-tutor-box">
				<image class="close_icon" src="/static/images/icon_close.png" mode="aspectFill" @click="popupClose" ></image>
				<view class="stb-head">
					<image class="stb-head-icon" src="/static/home/scan_tutor_01.png" mode="aspectFill"></image>
				</view>
				<view class="cont__box">
					<view class="stb-item">扫中国红牛罐底码</view>
					<view class="gdm-box">
						<image class="gdm-box-icon" src="https://file.y1b.cn/public/img/bfzx/20230712/scan_tutor_02.png" mode="aspectFill"></image>
					</view>
					<view class="stb-item_nextcity">
						<text>本次扫码将点亮：</text>
						<text class="jjdl">{{nextCity.city}}</text>
					</view>
				</view>
				<view class="tools-box">
					<image class="again-light" src="https://file.y1b.cn/public/img/bfzx/20230712/scan_btn.png" mode="aspectFill" @click="goScan">
				</image>
				</view>
			</view>
		</van-popup>
	</view>
</template>

<script>
	import {
		// getScanWxMsgId,
		callWxMsgAuth
	} from '@/api/modules/home.js'
	import {
		getUserLocation
	} from '@/utils/getUserLocation.js'
	import {
		qrCode
	} from '@/api/modules/index.js'
	// import {
	// 	parseTime
	// } from '@/utils/index.js'
	export default {
		data() {
			return {
				show: false,
				nextCity: '',
				isAuthorization: false
			}
		},
		methods: {
			popupShow(nextCity, isAuthorization) {
				this.nextCity = nextCity || '？？？';
				this.show = true;
				this.isAuthorization = isAuthorization;
			},
			popupClose() {
				wx.reportEvent("click_closescpopup", {
					authorized_or_not: Number(this.isAuthorization),
					scenario_value: 1
				});
				this.show = false;
			},
			goScan() {
				/*点击【扫罐底码】 */
				wx.reportEvent("click_scanbottomcode", {
					authorized_or_not: Number(this.isAuthorization)
				});
				// /*上次订阅发起时的时间*/
				// let scanWxMsgDate = uni.getStorageSync('scanWxMsgDate')
				// /*scanWxMsgDate为空或者记录的时间与当前时间(日期)不一样，则重新发起*/
				// if (!scanWxMsgDate || parseTime(scanWxMsgDate, '{y}-{m}-{d}') !== parseTime(Date.now(), '{y}-{m}-{d}')) {
				// 	getScanWxMsgId().then(res => {
				// 		if (res.data) {
				// 			uni.requestSubscribeMessage({
				// 				tmplIds: [res.data],
				// 				complete: (e) => {
				// 					console.log('getScanWxMsgId', e)
				// 					this.wxScan()
				// 				},
				// 				success(e) {
				// 					console.log('getScanWxMsgId', e)
				// 					/*回调*/
				// 					callWxMsgAuth().then(res => {})
				// 				}
				// 			})
				// 			/*记录发起时间*/
				// 			uni.setStorageSync('scanWxMsgDate', Date.now())
				// 			return
				// 		}
				// 		this.wxScan()
				// 	})
				// 	return
				// }
				this.wxScan(2, true);
			},
			wxScan(scenario_value = 0, actual = false) {
				console.log('点击扫一扫');
				if(actual) {
					return this.actualWxScan(scenario_value);
				}
				console.log('wx.requirePrivacyAuthorize :>> ', wx.requirePrivacyAuthorize);
				// 进入扫一扫的页面
				if (wx.requirePrivacyAuthorize) {
					wx.requirePrivacyAuthorize({
						success: res => {
							// console.log('用户同意了隐私协议 或 无需用户同意隐私协议')
							wx.navigateTo({
								url: '/pages/scanModular/lightScan/index'
							});
						},
						fail: res => {
							console.log('用户拒绝了隐私协议');
						}
					})
				} else {
					console.log('跳转lightScan', )
					wx.navigateTo({
						url: '/pages/scanModular/lightScan/index'
					});
				}
			},
			actualWxScan(scenario_value) {
				getUserLocation().then(res => {
					let {
						longitude,
						latitude
					} = res.data;
					uni.scanCode({
						scanType: 'qrCode',
						success: (e) => {
							console.log('e.result :>> 扫码成功', e.result);
							//  http://1a0.cn/300021054244
							this.getQrInfo({
								code: e.result,
								longitude,
								latitude
							}, false);
						},
						fail: (e) => {
							// this.popupClose();
							this.$emit('resetScanState');
							wx.reportEvent("click_stopscan", {
								authorized_or_not: Number(this.isAuthorization),
								scenario_value
							});
						}
					});
				});
			},
			wxScanSuccess(codeId) {
				getUserLocation().then(res => {
					let {
						longitude,
						latitude
					} = res.data;
					this.getQrInfo({
						code: codeId,
						longitude,
						latitude
					}, false);
				});
			},
			wxScanFail(scenario_value = 0){
				this.$emit('resetScanState');
				wx.reportEvent("click_stopscan", {
					authorized_or_not: Number(this.isAuthorization),
					scenario_value
				});
			},
			h5QrCode({
				Lng,
				Lat,
				h5QrCode,
				NickName,
				HeadPic
			}) {

				this.getQrInfo({
					code: h5QrCode,
					longitude: Lng,
					latitude: Lat,
					nick_name: NickName,
					avatar_url: HeadPic
				}, true);
			},
			getQrInfo(parmas, isH5) {
				qrCode(parmas).then(res => {
					this.popupClose();
					//正常码
					if (res.code == 1) {
						//province need_scan_num
						let {
							lit_city,
							ad_show,
							donated_love,
						} = res.data;
						// console.log('res.data', res.data)
						// console.log('lit_city', lit_city)
						//是否显示广告
						if (ad_show) {
							uni.navigateTo({
								url: `/pages/advertising/scanTutorBanner?city=${lit_city.city}&image=${lit_city.image}&province=${lit_city.province}&need_scan_num=${lit_city.need_scan_num}&scan_num=${lit_city.scan_num}&donated_love=${donated_love}&isH5=${isH5}`
							});
							return;
						}
						// 已点亮
						if (lit_city && lit_city.scan_num == 0) {
							this.$emit('scanCodeType', {
								type: 1,
								...lit_city,
								isH5,
								donated_love
							});
							this.$emit('resetScanState')
							return
						}
						//感谢参与！即将点亮
						if (lit_city && lit_city.scan_num > 0) {
							this.$emit('scanCodeType', {
								type: 2,
								...lit_city
							})
							this.$emit('resetScanState')
							return
						}
						// 当前用户重复扫码
						if (!lit_city) {
							this.$emit('scanCodeType', {
								type: 3,
								...lit_city
							})
							this.$emit('resetScanState')
							return
						}
					}
					// 次数用完
					if ((res.code == 0) && (res.data.status == 1)) {
						this.$emit('scanCodeType', {
							type: 4
						})
						return;
					}
					//其它错误提示
					this.$emit('scanCodeType', {
						type: 5,
						msg: res.msg
					})
					this.$emit('resetScanState')
				})
			}
		}
	}
</script>

<style lang="scss">
	.scan-tutor {
		.scan-tutor-box {
			position: relative;
			width: 600rpx;
			height: 980rpx;
			background-color: #ffffff;
			border-radius: 10px;
			font-size: 0;
			text-align: center;
			.close_icon{
				position: absolute;
				padding: 30rpx;
				width: 21rpx;
				height: 21rpx;
				top: 0rpx;
				right: 0rpx;
				color: #ccc;
			}
		}
		.cont__box {
			width: 536rpx;
			height: 556rpx;
			background: #f4f6f8;
			border-radius: 16rpx;
			margin: 0 auto 68rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		.stb-head {
			text-align: center;
			font-size: 0;
			padding: 71rpx 0 30rpx;
		}

		.stb-head-icon {
			width: 243rpx;
			height: 84rpx;
		}

		.gdm-box {
			text-align: center;
			font-size: 0;
			padding: 24rpx 0;
		}

		.gdm-box-icon {
			width: 236rpx;
			height: 236rpx;
		}

		.stb-item {
			font-weight: 400;
			color: #000018;
			height: 58rpx;
			font-size: 40rpx;
			margin-top: 60rpx;
		}
		.stb-item_nextcity {
			width: 488rpx;
			height: 86rpx;
			background: #eaeef2;
			border: 1rpx solid #e2e6ea;
			border-radius: 45rpx;
			font-size: 36rpx;
			font-weight: 400;
			text-align: center;
			color: #000018;
			line-height: 86rpx;
		}

		.jjdl {
			color: #E03134;
		}
		.tools-box {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 68rpx;
			.again-light {
				width: 350rpx;
				height: 80rpx;
			}
		}
	}
</style>
