<template>
	<view class="stores-code">
		<privacy-popup></privacy-popup>
		<!-- 相机自定义扫码 -->
		<xh-scan-code ref="xhScanCode" @onScancode="onScancode" />
		<!-- 门店码绑定成功 -->
		<binding-succeeded ref="bindingSucceeded" @closeNotice="closeNotice" />
		<!-- 消息提示 -->
		<xh-msg-dialog ref="xhMsgDialog" @closeNotice="msgCloseNotice" @goWxScan="goWxScan" />
		<!-- 重新支付 -->
		<repayments ref="repayments" @closeNotice="payCloseNotice" @repayments="wxPlayHandle" />
		<!-- 消息提示 -->
		<xh-notify ref="xhNotify" />
		<!-- 底部图片 -->
		<cover-image src="../static/bfxn_xcx_sdpm_tips.png" class="bottom-image"></cover-image>
		<!-- 进度 -->
		<xh-steps :steps="steps" />
		<!-- 遇到问题？ -->
		<cover-view class="have-problem" @click="haveProblem">
			<cover-view class="have-problem-text">扫码问题</cover-view>
			<cover-image class="have-problem-icon" src="../static/tips_red.png"></cover-image>
		</cover-view>
	</view>
</template>

<script>
	/*消息提示*/
	import {
		mapGetters,
		mapActions,
		mapMutations
	} from 'vuex';
	import bindingSucceeded from './bindingSucceeded';
	import {
		shopwhite,
		createcardpay,
		getcardqr
	} from '@/api/homeApi.js';
	import {
		parseQuery,
		xhAudio,
		PLAQUEADVERTISING,
		setParmasData
	} from '@/utils/index.js';
	import {
		fileBaseUrl
	} from '@/api/http/xhHttp.js';
	import {
		getCheckCardVolume,
		setCheckCardVolume
	} from '@/utils/auth.js';
	import log from '@/utils/log.js';
	import {
		getUserLocation
	} from '@/utils/getUserLocation.js';
	//门店二维值
	let _store_code = null;
	//音频控制
	let error_audio = null,
		success_audio = null;
	//插屏广告管理
	let _PLAQUEADVERTISING = null;
	//门店Id
	let _store_id = null;
	//play参数
	let _playParams = null;
	export default {
		onLoad() {
			_playParams = null;
			_store_code = null;
			//初始化音频
			error_audio = new xhAudio({
				url: fileBaseUrl + '/public/img/to2/cmp3/02/BFXN_MUSIC_05.mp3'
			});
			success_audio = new xhAudio({
				url: fileBaseUrl + '/public/img/to2/cmp3/02/BFXN_MUSIC_06.mp3'
			});
			_PLAQUEADVERTISING = PLAQUEADVERTISING({
				isAutoPlay: true
			});
			//初始化广告
			_PLAQUEADVERTISING.init('adunit-4c35192c4bc064d2');

		},
		data() {
			return {
				steps: 0
			};
		},
		onShow() {
			//在用户主动触发定位权限设置后返回会调用
			if (this.steps === 1) {
				this.payment()
			}
		},
		components: {
			bindingSucceeded
		},
		computed: {
			...mapGetters(['checkCardVolume'])
		},
		methods: {
			...mapActions({
				getCardTopCount: 'personal/getCardTopCount',
				getUserInfo: 'login/getUserInfo'
			}),
			...mapMutations({
				setCheckCardVolume: 'personal/setCheckCardVolume'
			}),
			//遇到问题
			haveProblem() {
				this.$refs.xhMsgDialog.show({
					msg: '扫码遇到问题？黑屏或相机无法打开？请点击确认按钮，为您提供中转方案~'
				}, 'goWxScan');
			},
			goWxScan() {
				//关闭
				this.$refs.xhScanCode.close();
				//调取扫码
				wx.scanCode({
					success: (res) => {
						this.onScancode(res.result);
					}
				});
			},
			onScancode(qrcode) {
				// console.log('scanCode ----->onScancode', qrcode)
				if (_store_code) return;
				_store_code = qrcode + '';
				this.$refs.xhScanCode.play(); //播放音效
				let sid = parseQuery(_store_code).sid;
				if (!sid) {
					//音效
					error_audio.play();
					return this.$refs.xhNotify.show({
						type: 'danger',
						message: '请扫商户的店铺码',
						onClose: function() {
							_store_code = '';
						}
					});
				}
				// sid = Number(sid);
				//检测门店id
				shopwhite({
					sid: sid
				}).then(res => {
					//门店ID绑定成功
					if (res.code == 1) {
						_store_id = res.data.id;
						//门店码扫码成功
						this.steps = 1;
						//bottom_num等于0，不需要扫罐底码
						if (res.data.bottom_num === 0) {
							//直接支付
							return this.payment();
						}
						//正常情况
						if (res.data.bottom_num === -1) {
							//绑定成功
							success_audio.play();
							return this.$refs.bindingSucceeded.show(_store_id, this.checkCardVolume.length);
						}
						//绑定成功 按指定扫码罐数来
						success_audio.play();
						return this.$refs.bindingSucceeded.show(_store_id, res.data.bottom_num);


					}
					this.$refs.xhMsgDialog.show(res);
				});
			},
			async payment() { //发起支付

				try {


					//关闭扫码防止性能问题
					this.$refs.xhScanCode.close();
					/*兼容代码*/
					let checkCardVolume = getCheckCardVolume();

					let userLocation = await getUserLocation()

					/*兼容代码*/
					let parmas = {
						sid: _store_id, //门店ID
						pull_arr: setParmasData(checkCardVolume, 'pull_qr', 'pid'), //拉环兑换卷id数组
						...userLocation.data
					};

					//微信支付
					let res = await createcardpay(parmas)

					//正常支付
					if (res.code == 1) {
						//保存支付参数
						_playParams = res.data;
						//调用支付
						this.wxPlayHandle();
						return;
					}
					//错误信息
					let message = res.msg;
					//手机号未绑定
					if (message === '手机号未绑定') {
						//更新本地用户信息
						this.getUserInfo();
						//引导用户
						return uni.showModal({
							title: '温馨提示',
							content: '意外导致手机号未绑定成功，无法发起支付，确认回到我的卡包重新发起换购',
							success: (res) => {
								if (res.confirm) {
									//跳转
									this.$reLaunch({
										url: '/pages/personal/myCardBag/index?currTabs=0'
									});
								}
							}
						});
					}
					//其它情况
					this.$refs.repayments.show({
						msg: message
					});
					//更新本地用户信息 
					this.getUserInfo();
					//输出日志
					if (JSON.stringify(parmas.pull_arr) === '{}') {
						log.setFilterMsg('支付异常2');
						log.info('requestPayment error==>' + JSON.stringify(parmas));
						log.info('checkCardVolume==>' + JSON.stringify(checkCardVolume));
						log.error('checkCardVolume==>' + JSON.stringify(message));
					}

				} catch (e) {
					if (e?.type === 'loaction') {
						this.$navigateBack({
							fail: () => {
								this.$reLaunch({
									url: "/pages/personal/myCardBag/index"
								})
							}
						})
						return
					}
				}

			},
			//微信支付处理
			wxPlayHandle() {
				if (!_playParams) {
					return this.payment();
				}
				uni.requestPayment({
					'nonceStr': _playParams.nonceStr,
					'package': _playParams.package,
					'paySign': _playParams.paySign,
					'signType': _playParams.signType,
					'timeStamp': _playParams.timeStamp,
					success: (res) => {

						getcardqr({
							order: _playParams.qr_code
						}).then(_res => {

							if (_res.code == 1 && _res.data.pay_time) {

								this.$reLaunch({
									url: `/pages/personal/exchangeCode/index?codeData=${_playParams.qr_code}&isplay=1&type=1`
								});
								this.getCardTopCount(); //更新顶部状态
								log.setFilterMsg('支付成功');
								log.info('requestPayment success==>' + JSON.stringify(res));
								this.setCheckCardVolume([]);
								setCheckCardVolume(); //传空等于清除
								return

							}

							//其它提示
							this.$refs.repayments.show({
								msg: '支付结果，查询失败',
								order: _playParams.qr_code
							});


						})

					},
					fail: (err) => {
						if (err.errMsg == 'requestPayment:fail cancel') {
							return this.$refs.repayments.show({
								msg: '您已取消换购支付操作',
								order: _playParams.qr_code
							});
						}
						//其它提示
						this.$refs.repayments.show({
							msg: err.errMsg,
							order: _playParams.qr_code
						});
					}
				});
			},
			msgCloseNotice() { //消息弹窗关闭
				_store_code = '';
				this.$navigateBack({
					fail: () => {
						this.$reLaunch({
							url: "/pages/personal/myCardBag/index"
						})
					}
				})
			},
			payCloseNotice() {
				this.$refs.repayments.onlyClose();
				this.$navigateBack({
					fail: () => {
						this.$reLaunch({
							url: "/pages/personal/myCardBag/index"
						})
					}
				})
			},
			closeNotice() { //成功弹窗关闭
				//友情提示
				this.$refs.xhNotify.show({
					type: 'warning',
					message: '已取消，请重扫店铺码',
					onClose: () => {
						_store_code = '';
						this.steps = 0;
					}
				});
			}
		},
		onUnload() {
			error_audio.destroy();
			success_audio.destroy();
		}
	};
</script>

<style lang="scss">
	.stores-code {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		background-color: #000;

		.bottom-image {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			width: 100%;
			height: auto;
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
			z-index: 1;
			border-radius: 15px 0 0 15px;
			display: flex;
			justify-content: space-between;
			align-items: center;
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