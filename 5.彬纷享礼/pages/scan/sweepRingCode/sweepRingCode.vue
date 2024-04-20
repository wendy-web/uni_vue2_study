<template>
	<view class="sweep-ring-code">
		<privacy-popup ref="privacyPopup"></privacy-popup>
		<!-- 相机自定义扫码 -->
		<xh-scan-code ref="xhScanCode" @onScancode="onScancode" :openNow="false" />
		<!-- 中奖弹窗 -->
		<xh-winning-window ref="winningWindow" @closeNotice="closeNotice" />
		<!-- 中奖弹窗二 -->
		<win-again ref="winAgain" @closeNotice="closeNotice" />
		<!-- 中奖弹窗三 -->
		<win-again-three ref="winAgainThree" @closeNotice="closeNotice" />
		<!-- 中奖第四次弹窗 -->
		<win-again-four ref="winAgainFour" @closeNotice="closeNotice" />
		<!-- 红牛未中奖弹窗 -->
		<xh-msg-dialog ref="xhMsgDialog" @closeNotice="closeNotice" @goWxScan="goWxScan" buttonText="继续扫码" />
		<!-- 战马中奖弹窗 -->
		<war-horse-win ref="warHorseWin" @closeNotice="closeNotice" />
		<!-- 战马提示 -->
		<!-- <war-horse-msg ref="warHorseMsg" @closeNotice="closeNotice" /> -->
		<!-- 28周年红牛初次中奖 -->
		<win-popup-new ref="winPopupNew" @closeNotice="closeNotice" :awardList="awardList" />
		<!-- 中大奖 -->
		<grand-prize ref="grandPrize" @closeNotice="closeNotice" :awardList="awardList" />
		<!-- 提示背景 -->
		<cover-view class="scan-tips" v-show="isShowTips">
			<cover-view class="scan-tips-num">扫拉环二维码</cover-view>
			<cover-view class="scan-tips-text">
				<cover-view>请扫正确的促销拉环二维码</cover-view>
				<!-- 				<cover-view class="stt-left">
					<cover-image class="scan-tips-logo" src="../static/sweep-ring-code-icon.png"></cover-image>
					<cover-view class="jprt">奖品如图</cover-view>
				</cover-view> -->
			</cover-view>
		</cover-view>
		<!-- 遇到问题？ -->
		<cover-view v-if="isShowTips" class="have-problem" @click="haveProblem">
			<cover-view class="have-problem-text">扫码问题</cover-view>
			<cover-image class="have-problem-icon" src="../static/tips_red.png"></cover-image>
		</cover-view>
	</view>
</template>

<script>
	import {
awardList,
cscanQr
} from '@/api/homeApi.js';
	/*消息提示*/
	import {
fileBaseUrl
} from '@/api/http/xhHttp.js';
import {
xhAudio
} from '@/utils/index.js';
import warHorseWin from './warHorseWin.vue';
import winAgain from './winAgain.vue';
import winAgainFour from './winAgainFour.vue';
import winAgainThree from './winAgainThree.vue';
import xhWinningWindow from './xh-winning-window.vue';
	// import warHorseMsg from './warHorseMsg.vue'
	import {
getScanSweepNum,
removeWxScanQrCode,
setScanSweepNum
} from '@/utils/auth.js';
import {
getUserLocation
} from '@/utils/getUserLocation.js';
import grandPrize from './grandPrize.vue';
import winPopupNew from './winPopupNew.vue';
	//scanCode
	let _currCode = '';
	//音频控制
	let error_audio = null,
		success_audio = null,
		swept_audio = null;
	//连续中奖累计
	let _number = 0;
	let _wxScanQrCode = '';
	export default {
		onLoad(o) {
			wx.getPrivacySetting && wx.getPrivacySetting({
				success: (res) => {
					if (res.needAuthorization) {
						this.$refs.privacyPopup.popUp()
					}
				}
			})
			//接受页面参数
			_currCode = '';
			//接收传参
			_wxScanQrCode = o.wxScanQrCode;
			//次数清零
			_number = getScanSweepNum();
			//请扫中国红牛拉环二维码
			error_audio = xhAudio({
				url: 'https://file.y1b.cn/public/music/hnlh.mp3'
			});
			this.initSuccessAudio(_number);
			//您已领取过该奖券
			swept_audio = xhAudio({
				url: fileBaseUrl + '/public/img/to2/cmp3/02/BFXN_MUSIC_04.mp3'
			});

		},
		data() {
			return {
				isShowTips: true,
				isHaveProblem: false,
				awardList: []
			};
		},
		onShow() {
			// //接受页面参数
			// _currCode = '';
			//处理页面参数
			setTimeout(() => {
				if (_wxScanQrCode) {
					//先关闭扫码页
					_currCode = _wxScanQrCode;
					this.closeScan();
					//处理传参结果
					this.winningCheck(_wxScanQrCode);
				} else if (!_currCode) {
					this.showScan();
				}
			}, 0);

			awardList({
				prizeratetype: 14
			}).then(res => {
				this.awardList = res.data || []
			})
		},
		components: {
			xhWinningWindow,
			winAgain,
			winAgainThree,
			winAgainFour,
			warHorseWin,
			// warHorseMsg,
			winPopupNew,
			grandPrize
		},
		methods: {
			initSuccessAudio(number) {
				let index = number >= 4 ? 1 : (number + 1);
				//恭喜您中奖了
				success_audio = xhAudio({
					url: 'https://file.y1b.cn/public/music/bfxl/202105/win_0' + (index) + '.mp3'
				});
			},
			haveProblem() {
				this.isHaveProblem = true;
				//关闭
				this.$refs.xhScanCode.close();
				this.$refs.xhMsgDialog.show({
					msg: '扫码遇到问题？黑屏或相机无法打开？请点击确认按钮，为您提供中转方案~'
				}, 'goWxScan');
			},
			goWxScan() {
				//调取系统扫码
				wx.scanCode({
					success: (res) => {
						this.onScancode(res.result);
					}
				});
			},
			onScancode(scanCode) {
				// console.log('scanCode ----->onScancode', scanCode)
				//有值说明还在处理，先暂停
				if (_currCode) return;
				_currCode = scanCode; //存储当前值
				// this.$refs.xhScanCode.play(); //播放音效
				//关闭扫码背景
				this.closeScan();
				setTimeout(() => {
					//查询是否中奖
					this.winningCheck(_currCode);
				}, 0);
			},
			closeScan() {
				this.isShowTips = false;
				this.$refs.xhScanCode.close();
			},
			showScan() {
				this.isShowTips = true;
				if (!this.isHaveProblem) this.$refs.xhScanCode.reset();
			},
			async winningCheck(scanCode) {
				/*未登录或授权*/
				if (!this.$hasLogin()) {
					return
				}

				try {
					//定位参数
					let location = await getUserLocation()
					//拉环扫码
					let res = await cscanQr({
						code: _currCode,
						...location.data
					});
					//扫码code
					_wxScanQrCode = '';
					//删除微信扫码进来的code
					removeWxScanQrCode();
					if (res.code == 1) {
						//将25周年劵统一设置为 prizeratetype = 1
						if ([null, 0].indexOf(res.data.prizeratetype) > -1) res.data.prizeratetype = 1
						//战马券
						if ([4, 11, 15].includes(res.data.prizeratetype)) {
							this.$refs.warHorseWin.popupShow(res.data)
							//控制插屏广告
							if (!wx.getStorageSync('zmcpad')) {
								wx.setStorageSync('zmcpad', JSON.stringify({
									lastModified: Date.now(),
									num: 0
								}))
							}
							return
						}
						//超级大奖
						if ([6, 14].includes(res.data.prizeratetype) && res.data.qr_type === 3) {
							this.$refs.grandPrize.show(res.data.prizeratetype)
							return
						}
						//累加次数
						_number++;
						//防止下标越界
						if (_number > 4) _number = 1;
						//音效
						// success_audio.play();
						//再次中奖
						switch (_number) {
							case 1: //第一中奖
								//28-29周年样式一样
								if ([6, 14].includes(res.data.prizeratetype)) {
									this.$refs.winPopupNew.show(res.data)
								} else {
									//往期
									this.$refs.winningWindow.show(res.data)
								}
								break;
							case 2: //第二次中奖
								this.$refs.winAgain.show(res.data);
								break;
							case 3: //第三次中奖
								this.$refs.winAgainThree.show(res.data);
								break;
							case 4: //第四次次中奖
								this.$refs.winAgainFour.show(res.data);
								break;
						}
						//预加载下一次中奖音效
						this.initSuccessAudio(_number);
						setScanSweepNum(_number);
						return;
					}
					//中奖卡劵
					if (res.code == 2) {
						_currCode = ''
						_number = 0; //中断连续
						setScanSweepNum(0);
						this.$go({
							url: '/pages/personal/scanResult/index?type=2&data=' + encodeURIComponent(JSON
								.stringify(res.data))
						});
						return;
					}
					// 中奖积分
					if (res.code == 3) {
						_currCode = ''
						_number = 0; //中断连续
						setScanSweepNum(0);
						this.$go({
							url: '/pages/personal/scanResult/index?type=1&data=' + encodeURIComponent(JSON
								.stringify(res.data))
						});
						return;
					}
					// 战马溯源
					if (res.code == 6) {
						_currCode = ''
						_number = 0; //中断连续
						setScanSweepNum(0);
						const pathName = res.data.prizeratetype === 1 ? 'bottled' : 'tank'
						this.$go({
							url: `/pages/zm/traceability/${pathName}/index?data=${encodeURIComponent(JSON
								.stringify(res.data))}`
						});
						return

					}

					_currCode = ''

					if (res.data && res.data.prizeratetype == 4) {
						// this.$refs.warHorseMsg.popupShow(res);
						this.$go({
							url: `/pages/scan/scanErr/index?type=zm&msg=${res.msg}&tips=${res.data&&res.data.tips}`
						})
						return
					}
					this.$go({
						url: `/pages/scan/scanErr/index?type=hn&msg=${res.msg}&tips=${res.data&&res.data.tips}`
					})

					// this.$refs.xhMsgDialog.show(res);

					// //非红牛拉环二维码
					// if (res.data && res.data.code == 3) error_audio.play();
					// //已扫
					// if (res.data && res.data.code == 10) swept_audio.play();

				} catch (e) {
					if (e?.type === 'loaction') {
						removeWxScanQrCode();
						this.$navigateBack({
							fail: () => {
								this.$reLaunch({
									url: "/pages/tabBar/personal/index"
								})
							}
						})
						return
					}
					setTimeout(function() {
						_currCode = '';
					}, 3000);
				}
			},
			closeNotice() {
				_currCode = '';
				this.showScan();
			}
		},
		onUnload() {
			error_audio.destroy();
			success_audio.destroy();
		}
	};
</script>

<style lang="scss">
	.sweep-ring-code {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		background-color: #333;

		.scan-tips {
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 348rpx;
			background-color: #44924F;
		}

		.scan-tips-text {
			display: flex;
			justify-content: center;
			align-items: center;
			color: #FFFFFF;
			font-size: 40rpx;
			margin-top: 128rpx;
		}

		.stt-left {
			margin-left: 28rpx;
		}

		.jprt {
			font-size: 20rpx;
			text-align: center;
			margin-top: 10rpx;
			color: #FFFFFF;
		}

		.scan-tips-logo {
			width: 150rpx;
			height: 125rpx;
		}

		.scan-tips-num {
			color: #FFFFFF;
			position: absolute;
			top: 20rpx;
			left: 0;
			width: 100%;
			text-align: center;
		}

		.have-problem {
			width: 168rpx;
			height: 50rpx;
			padding-left: 24rpx;
			padding-right: 10rpx;
			box-sizing: border-box;
			background-color: #FFE4E1;
			position: fixed;
			bottom: 265rpx;
			right: 0;
			border-radius: 15px 0 0 15px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			z-index: 1;
		}

		.have-problem-text {
			font-size: 24rpx;
			color: #FE2821;
		}

		.have-problem-icon {
			width: 28rpx;
			height: 28rpx;
			margin-left: 10rpx;
		}
	}
</style>
