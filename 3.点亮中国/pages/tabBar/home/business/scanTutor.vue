<template>
	<view class="scan-tutor">
		<van-popup :show="show" @close="popupClose" custom-style="background-color: transparent;"
			:close-on-click-overlay="false" :z-index="10000">
			<view class="scan-tutor-box">
				<view class="stb-head">
					<image class="stb-head-icon" src="/static/home/scan_tutor_01.png" mode="aspectFill"></image>
				</view>
				<view class="stb-item">
					<view class="stb-item-no">1</view>
					<text>扫中国红牛罐底码</text>
				</view>
				<view class="gdm-box">
					<image class="gdm-box-icon" src="https://file.y1b.cn/public/img/bfzx/20230712/scan_tutor_02.png" mode="aspectFill"></image>
				</view>
				<view class="stb-item">
					<view class="stb-item-no">2</view>
					<text>即将点亮</text>
					<text class="jjdl">{{nextCity}}</text>
				</view>
				<!-- 创建团队 -->
				<view class="create-team-btn">
					<van-button round color="linear-gradient(180deg,#fda80c, #f5882e)" type="info" size="normal" block
						@click="goScan">扫罐底码</van-button>
				</view>
			</view>
			<image class="close" src="/static/images/close.png" mode="aspectFill" @click="popupClose"></image>
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
				this.nextCity = nextCity || '？？？'
				this.show = true
				this.isAuthorization = isAuthorization
			},
			popupClose() {
				this.show = false
			},
			goScan() {

				/*点击【扫罐底码】 */
				wx.reportEvent("click_scanbottomcode", {
					authorized_or_not: Number(this.isAuthorization)
				})
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

				this.wxScan()

			},
			wxScan() {

				getUserLocation().then(res => {

					let {
						longitude,
						latitude
					} = res.data

					uni.scanCode({
						scanType: 'qrCode',
						success: (e) => {
							this.getQrInfo({
								code: e.result,
								longitude,
								latitude
							})
						},
						fail: (e) => {
							this.popupClose()
							this.$emit('resetScanState')
							wx.reportEvent("click_stopscan", {
								authorized_or_not: Number(this.isAuthorization)
							})
						}
					})

				})

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
				}, true)
			},
			getQrInfo(parmas, isH5) {
				qrCode(parmas).then(res => {
					this.popupClose()
					//正常码
					if (res.code == 1) {
						//province need_scan_num
						let {
							lit_city
						} = res.data
						//已点亮
						if (lit_city && lit_city.scan_num == 0) {
							this.$emit('scanCodeType', {
								type: 1,
								...lit_city
							})
							this.$emit('resetScanState', true && !isH5)
							return
						}
						//感谢参与！即将点亮
						if (lit_city && lit_city.scan_num > 0) {
							this.$emit('scanCodeType', {
								type: 2,
								...lit_city
							})
							this.$emit('resetScanState', true && !isH5)
							return
						}
						//当前用户重复扫码
						if (!lit_city) {
							this.$emit('scanCodeType', {
								type: 3,
								...lit_city
							})
							this.$emit('resetScanState')
							return
						}
					}
					//其它错误提示
					this.$emit('scanCodeType', {
						type: 4,
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
			height: 850rpx;
			background-color: #ffffff;
			border-radius: 10px;
			font-size: 0;
			text-align: center;
			// padding-bottom: 180rpx;
		}

		.close {
			width: 56rpx;
			height: 56rpx;
			display: block;
			margin: 60rpx auto 0;
		}

		.create-team-btn {
			position: absolute;
			bottom: 50rpx;
			width: 432rpx;
			left: 50%;
			transform: translateX(-50%);
		}

		.stb-head {
			text-align: center;
			font-size: 0;
			padding: 50rpx 0;
		}

		.stb-head-icon {
			width: 416rpx;
			height: 144rpx;
		}

		.gdm-box {
			text-align: center;
			font-size: 0;
			padding: 20rpx 0;
		}

		.gdm-box-icon {
			width: 264rpx;
			height: 264rpx;
		}

		.stb-item {
			display: flex;
			align-items: center;
			font-size: 28rpx;
			font-weight: 400;
			color: #000018;
			padding-left: 118rpx;
		}

		.stb-item-no {
			width: 50rpx;
			height: 50rpx;
			background-color: #ff7f48;
			border-radius: 50%;
			text-align: center;
			line-height: 50rpx;
			color: #fff;
			font-size: 34rpx;
			font-weight: 700;
			margin-right: 12rpx;
		}

		.jjdl {
			color: #E03134;
		}


	}
</style>
