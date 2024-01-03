<template>
	<view class="tank-bottom-code">
		<!-- 相机自定义扫码 -->
		<!-- <xh-scan-code ref="xhScanCode" :openNow="false"/> -->
		<!-- 背景 -->
		<cover-image class="bfxl-tbc-bg" src="../static/bfxl_tbc_bg.png"></cover-image>
		<!-- 手机 -->
		<cover-image class="bfxl-tbc-phone" src="../static/bfxl_tbc_phone.png"></cover-image>
		<!-- 天天 -->
		<cover-image class="bfxl-tbc-tt" src="../static/bfxl_tbc_tt_icon.png"></cover-image>
		<!-- 扫码按钮 -->
		<cover-image v-if="bidData.length<scanMax" class="scan-btn" src="../static/scan-b-btn.png"
			@click="scan"></cover-image>
		<cover-image v-if="scanMax>0&&bidData.length===scanMax" class="bfxl-tbc-pay" src="../static/bfxl-tbc-pay.png"
			@click="haveProblem"></cover-image>
		<!-- 重新支付 -->
		<repayments ref="repayments" @closeNotice="closeNotice" @repayments="wxPlayHandle" />
		<!-- 消息提示 -->
		<xh-notify ref="xhNotify" @frequently="frequently" />
		<!-- 进度 -->
		<xh-steps :steps="steps" />
		<!-- 提示背景 -->
		<cover-view class="scan-tips">
			<cover-view class="scan-tips-num">已扫{{bidData.length}}次，总{{scanMax}}次</cover-view>
			<cover-view class="scan-tips-text">
				<cover-view>扫红牛维生素功能饮料罐底二维码</cover-view>
				<!-- 				<cover-view class="stt-left">
					<cover-image class="scan-tips-logo" src="../static/scan_bottom.png"></cover-image>
					<cover-view class="jprt">奖品如图</cover-view>
				</cover-view> -->
			</cover-view>
		</cover-view>
		<!-- 遇到问题？-->
		<cover-view class="have-problem" v-if="scanMax>0&&bidData.length===scanMax" @click="haveProblem">
			<cover-view class="have-problem-text">支付问题点我</cover-view>
			<cover-image class="have-problem-icon" src="../static/tips_red.png"></cover-image>
		</cover-view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapActions,
		mapMutations
	} from 'vuex';
	import {
		cscanBotqr,
		createcardpay,
		getcardqr
	} from '@/api/homeApi.js';
	import {
		setParmasData,
		// xhAudio,
		parseTime
	} from '@/utils/index.js';
	import {
		fileBaseUrl
	} from '@/api/http/xhHttp.js';
	import log from '@/utils/log.js';
	import {
		sendMessage
	} from '@/utils/socket.js';

	import {
		setCheckCardVolume,
		getCheckCardVolume
	} from '@/utils/auth.js';
	import {
		getUserLocation
	} from '@/utils/getUserLocation.js';
	let _currCode = null; //当前二维码code
	let _scanData = []; //二维码值集合，防止重复数据
	let _store_id = ''; //门店ID
	//音频控制
	// let error_audio = null,
	// 	written_audio = null,
	// 	swept_audio = null
	//统计相关
	let _startTime = 0;
	//微信支付参数
	let _playParams = null;
	//音频延时
	// let _audio_time = null
	export default {
		onLoad(option) {
			_currCode = '';
			_playParams = null;
			_scanData = [];
			_store_id = option.store_id; //门店ID
			//最大扫码罐数
			this.scanMax = Number(option.maxBottom) || this.checkCardVolume.length;
			/*兼容代码*/
			if (this.scanMax == 0) {
				this.scanMax = getCheckCardVolume().length;
			}
			/*兼容代码*/
			// //初始化音频
			// error_audio = xhAudio({ 
			// 	url: fileBaseUrl + '/public/img/to2/cmp3/02/BFXN_MUSIC_07.mp3'
			// })
			// //已核销
			// written_audio = xhAudio({
			// 	url: fileBaseUrl + '/public/img/to2/cmp3/02/BFXN_MUSIC_08.mp3'
			// })
			// //已扫 
			// swept_audio = xhAudio({
			// 	url: fileBaseUrl + '/public/img/to2/cmp3/02/BFXN_MUSIC_09.mp3'
			// })
			//记录时间
			_startTime = parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}');
			//调取扫码
			this.scan();
		},
		data() {
			return {
				bidData: [], //罐码集合
				scanMax: 0,
				steps: 1
			};
		},
		onHide() {
			// clearTimeout(_audio_time)
			// error_audio.stop()
			// written_audio.stop()
			// swept_audio.stop()
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
			scan() {
				wx.scanCode({
					success: (res) => {
						this.onScancode(res.result);
					},
					fail(e) {
						log.error('scan按钮点击 error==>' + JSON.stringify(e));
					}
				});
				log.setFilterMsg('scan按钮点击');
			},
			//亲，您扫太快了，处理不过来
			frequently() {
				setTimeout(() => {
					uni.showToast({
						icon: 'none',
						title: '亲，您扫太快了，处理不过来~',
						mask: true
					});
				}, 200);
			},
			async onScancode(scanCode) {
				// console.log('scanCode ----->onScancode', scanCode)
				//扫罐码次数已用完情况 
				if (_scanData.length >= this.scanMax) return;
				//值不为空说明当前code还未处理完，等处理完可继续扫码
				if (_currCode !== '') {
					this.frequently();
					return;
				}
				//播放音效
				// this.$refs.xhScanCode.play()
				//获取扫描数据
				_currCode = scanCode;
				//是否已被自己扫过
				if (_scanData.indexOf(_currCode) !== -1) {
					/* _audio_time = setTimeout(()=>{
						swept_audio.play()
					},1000) */
					return this.$refs.xhNotify.show({
						type: 'warning',
						message: '您已扫过该罐底码',
						duration: 1500,
						onClose: function() {
							_currCode = '';
						}
					});
				}

				try {
					let userLocation = await getUserLocation()

					let res = await cscanBotqr({
						code: _currCode,
						...userLocation.data
					})

					if (res.code == 1) {
						//添加到扫码集合
						_scanData.push(_currCode);
						//存储二维码值
						this.bidData.push({
							bid: res.data.bid,
							bot_qr: res.data.bot_qr
						});
						//达到要求发起支付
						if (this.bidData.length == this.scanMax) {
							try {
								//支付
								this.payment();
								//扫码成功 上报数据
								this.reporting();
								//罐底码扫码成功
								this.steps = 2;
							} catch (e) {
								this.$refs.repayments.show({
									msg: '意外情况导致失败，点击“重新支付”重新尝试,若无效可截图，并联系客服处理'
								});
								log.setFilterMsg('支付异常');
								log.error('requestPayment error==>' + JSON.stringify(e));
							}
							return;
						}
						//扫码成功提示
						this.$refs.xhNotify.show({
							type: 'success',
							message: '扫描成功',
							duration: 1500,
							onClose: function() {
								_currCode = '';
							}
						});
						return;
					}

					//音效
					// if (res.data && res.data.code == 3) {
					// 	_audio_time = setTimeout(()=>{
					// 		error_audio.play()
					// 	},1000)
					// }
					// if (res.data && res.data.code == 1) {
					// 	_audio_time = setTimeout(()=>{
					// 		written_audio.play()
					// 	},1000)
					// }
					//失败情况		
					this.$refs.xhNotify.show({
						type: 'danger',
						message: res.msg,
						duration: 1500,
						onClose: function() {
							_currCode = '';
						}
					});

				} catch (e) {
					//置空
					_currCode = '';
				}
			},
			haveProblem() {
				let len1 = getCheckCardVolume().length;
				let len2 = this.bidData.length;
				//判断现有支付条件漫步满足
				if (_store_id && len1 > 0 && len1 === len2) {
					//是否有支付参数
					if (_playParams) {
						//直接支付
						this.wxPlayHandle();
					} else {
						//创建新支付
						this.payment();
					}
				} else {
					uni.showToast({
						title: '未能解决问题，请联系客服反馈',
						icon: 'none'
					});
				}
			},
			repayments() { //重新支付
				this.$refs.repayments.onlyClose();
				this.payment();
			},
			closeNotice() { //重新支付弹窗关闭回调
				this.$refs.repayments.onlyClose();
				// this.$redirectTo({
				// 	url: '/pages/personal/myCardBag/index'
				// })
				// this.setCheckCardVolume([])
			},
			async payment() { //发起支付
				//关闭扫码防止性能问题
				// this.$refs.xhScanCode.close()
				/*兼容代码*/
				let checkCardVolume = getCheckCardVolume();
				if (checkCardVolume?.length === 0) {
					checkCardVolume = this.checkCardVolume || []
				}

				let userLocation = await getUserLocation()

				/*兼容代码*/
				let parmas = {
					sid: _store_id, //门店ID
					...userLocation.data,
					pull_arr: setParmasData(checkCardVolume, 'pull_qr', 'pid'), //拉环兑换卷id数组
					bot_arr: setParmasData(this.bidData, 'bot_qr', 'bid') //罐底码id数组
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
								uni.reLaunch({
									url: '/pages/personal/myCardBag/index?currTabs=0'
								});
							}
						}
					});
				}
				//输出日志
				if (JSON.stringify(parmas.pull_arr) === '{}') {
					this.$refs.repayments.show({
						msg: '意外情况导致失败，点击“重新支付”重新尝试,若无效可截图，并联系客服处理'
					});
					log.setFilterMsg('支付异常2');
					log.info('requestPayment error==>' + JSON.stringify(parmas));
					log.info('checkCardVolume==>' + JSON.stringify(checkCardVolume));
					log.error('checkCardVolume==>' + JSON.stringify(message));
					return;
				}
				//其它情况
				this.$refs.repayments.show({
					msg: message
				});
				//更新本地用户信息 
				this.getUserInfo();
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

								uni.reLaunch({
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
			/*数据上报*/
			reporting() {
				sendMessage({
					'type': 'Clog-gd',
					'count': this.scanMax,
					'num': _scanData.length,
					'start_time': _startTime,
					'end_time': parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')
				});
			}

		},
		onUnload() {
			//中间退出了扫罐底码流程
			if (_scanData.length < this.scanMax) {
				this.reporting();
			}
			// clearTimeout(_audio_time)
			// error_audio.destroy()
			// written_audio.destroy()
			// swept_audio.destroy()
		}
	};
</script>

<style lang="scss">
	.tank-bottom-code {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;

		.scan-tips {
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 348rpx;
			background-color: #44924F;
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

		.scan-tips-text {
			display: flex;
			justify-content: center;
			align-items: center;
			color: #FFFFFF;
			font-size: 40rpx;
			margin-top: 128rpx;
		}

		.scan-tips-logo {
			width: 160rpx;
			height: 120rpx;
		}

		.scan-tips-num {
			color: #FFFFFF;
			position: absolute;
			top: 20rpx;
			left: 0;
			width: 100%;
			text-align: center;
		}

		.bfxl-tbc-bg {
			width: 100%;
			position: fixed;
			top: 140rpx;
			bottom: 348rpx;
			left: 0;
			height: auto;
		}

		.bfxl-tbc-phone {
			width: 259.2rpx;
			height: 510.4rpx;
			position: fixed;
			left: 50%;
			bottom: 520rpx;
			transform: translateX(-50%);
			z-index: 1;
		}

		.bfxl-tbc-tt {
			width: 172.83rpx;
			height: 236.48rpx;
			position: fixed;
			bottom: 440rpx;
			right: 100rpx;
			z-index: 1;
		}

		.scan-btn,
		.bfxl-tbc-pay {
			position: fixed;
			width: 260rpx;
			height: 91rpx;
			left: 50%;
			bottom: 400rpx;
			transform: translateX(-50%);
			z-index: 2;
		}

		.have-problem {
			width: 220rpx;
			height: 50rpx;
			padding-left: 24rpx;
			padding-right: 10rpx;
			box-sizing: border-box;
			background-color: #FFE4E1;
			position: fixed;
			bottom: 240rpx;
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