<template>
<van-popup
	:show="isShow"
	custom-style="overflow: inherit;background: transparent;"
	round
	safe-area-inset-bottom
>
<view class="lucky">
	<image class="lucky_title" src="../static/credit/luckytitle.png" mode="aspectFill"></image>
	<view class="lucky_lab">剩余抽奖次数:4</view>
	<view class="content">
		<!-- 转盘架子背景 -->
		<van-image class="desk-turntable" use-loading-slot lazy-load width="750rpx" height="820rpx"
			src="https://file.y1b.cn/store/1-0/2359/6459dfe982f2a.png">
			<van-loading slot="loading" type="spinner" size="20" vertical />
		</van-image>
		<!-- 转盘背景 -->
		<van-image class="img-turntable-bg" use-loading-slot lazy-load width="504rpx" height="504rpx"
			style="'-webkit-transform:rotate(' + deg + 'deg) translateZ(0);transform:rotate(' + deg + 'deg) translateZ(0)'"
			src="https://file.y1b.cn/store/1-0/2359/6459e0d1a658d.png">
			<van-loading slot="loading" type="spinner" size="20" vertical />
		</van-image>
		<!-- 选中的图片 -->
		<van-image class="img-turntable-select" use-loading-slot lazy-load width="318rpx" height="294rpx"
			src="https://file.y1b.cn/store/1-0/2359/6459e09d60225.png">
			<van-loading slot="loading" type="spinner" size="20" vertical />
		</van-image>
		<!-- 指针 -->
		<view class="pointer_box" @click="start">
			<image class="pointer_box_bg" src="../static/credit/pointer_bg.png" mode="aspectFill"></image>
			<image class="pointer_box_txt" src="../static/credit/pointer_text.png" mode="aspectFill"></image>
		</view>
		<!-- 扇形内容 -->
		<view class="panel"
			:style="'-webkit-transform:rotate(' + deg + 'deg) translateZ(0);transform:rotate(' + deg + 'deg) translateZ(0)'">
			<view class="sector" v-for="(item, index) in prizeOption" :key="index">
				<view class="sector-inner">
					<view class="item">
						<view class="prize-title">{{item.title ||'谢谢参与'}}</view>
						<van-image class="icon-bean-few" use-loading-slot lazy-load width="66rpx" height="66rpx"
							:src="item.image || imgUrl+'/task/icon_bean_few.png'">
							<van-loading slot="loading" type="spinner" size="20" vertical />
						</van-image>
					</view>
				</view>
			</view>
		</view>
	</view>
	<view class="close" @click="closeHandle">
		<image class="close_icon" src="../static/credit/close.png" mode="aspectFill"></image>
	</view>
</view>
</van-popup>
</template>
<script>
	let _result = null
	//控制初始化次数
	let _isLoading = false
	export default {
		data() {
			return {
				deg: 0,
				singleAngle: '', // 每片扇形的角度
				isStart: false,
				prizeOption: null,
			}
		},
		props: {
			isShow: {
				type: Boolean,
				default: false
			},
			// 划分区域
			areaNumber: {
				type: Number,
				default: 6
			},
			// 速度
			speed: {
				type: Number,
				default: 20
			},
			isAuthorization: {
				type: Boolean
			},
			taskReward: {
				type: Object,
				default: () => {}
			}
		},
		mounted() {
			_isLoading = false
			_result = null
			// this.init()
		},
		methods: {
			closeHandle() {
				this.$emit('close');
			},
			init() {
				if (_isLoading) return
				_isLoading = true
				let {
					areaNumber
				} = this;
				const singleAngle = 360 / areaNumber;
				this.singleAngle = singleAngle;
				lotteryOption({
					type: 2,
					platform: this.platform
				}).then(res => {
					_isLoading = false
					let {
						code,
						data,
						msg
					} = res;
					if (code == 1) {
						this.prizeOption = data;
						return
					}
					uni.showModal({
						title: '温馨提示',
						content: msg,
						showCancel: false
					})
				})

			},
			start() {
				this.$wxReportEvent('bigwheel');
				// let index = Math.floor(Math.random() * 6 + 1) //前端随机数，这里应该后台返回中奖结果
				// this.begin(index)
				// return
				if (this.isStart) return;
				lottery({
					type: 2,
					platform: this.platform
				}).then(res => {
					let {
						code,
						data,
						msg
					} = res;
					if (code == 1) {
						this.$emit('deductBeans', this.taskReward.cost);
						let position = data.position;
						position = position > 6 ? position % 6 : position; //大于6取余
						if (position > 0) { //大于零按数组索引-1
							position -= 1;
						}
						this.begin(position);
						_result = data
						return
					}
					this.isStart = false;
					uni.showToast({
						icon: 'none',
						title: msg
					})
				})
			},
			begin(awardNumer) {
				var deg = this.deg;
				var singleAngle = this.singleAngle;
				var speed = this.speed;
				var isStart = this.isStart;
				if (isStart) return;
				this.isStart = true;
				let endAddAngle = 0;
				// endAddAngle = 360 - ((awardNumer - 1) * singleAngle + singleAngle / 2); // 中奖角度
				endAddAngle = 360 - ((awardNumer - 1) * singleAngle + singleAngle); // 中奖角度


				// const rangeAngle = (Math.floor(Math.random() * 4) + 4) * 360; // 随机旋转几圈再停止
				const rangeAngle = 6 * 360; // 随机旋转几圈再停止
				let cAngle;
				deg = 0;
				this.timer = setInterval(() => {
					if (deg < rangeAngle) {
						if (deg < rangeAngle * 0.2) {
							deg = deg + (speed * 0.5)
						} else {
							deg += speed;
						}
					} else {
						cAngle = (endAddAngle + rangeAngle - deg) / speed;
						cAngle = cAngle > speed ? speed : cAngle < 1 ? 1 : cAngle;
						deg += cAngle;

						if (deg >= endAddAngle + rangeAngle) {
							deg = endAddAngle + rangeAngle;
							this.isStart = false;
							clearInterval(this.timer);

							if (!_result.credits && !_result.coupon_id) {
								this.$emit('success', awardNumer);
							}
							let type = 3
							let btnText = '我知道了'
							if (_result.credits) {
								type = 1
								btnText = _result.times > 0 ? '继续抽奖' : '我知道了'
							}
							if (_result.coupon_id) {
								type = 2
								btnText = '去使用'
							}
							this.$emit('showAwardModel', 'BIG_WHEEL', {
								id: _result.id,
								type,
								coupon_id: _result.coupon_id,
								coupon_title: _result.coupon_title,
								title: type < 3 ? '恭喜中奖啦' : '别灰心',
								tips: '剩余抽奖次数：' + _result.times,
								btnText,
								reward: _result.credits,
								failMsg: '哎呀，就差那么一点点~'
							})
						}
					}

					this.deg = deg;
				}, 1000 / 60);
			}
		}
	}
</script>

<style lang="scss">
.lucky {
	width: 100vw;
	font-size: 30rpx;
	font-weight: 500;
	text-align: center;
	color: #f34d14;
	line-height: 36rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	.lucky_title {
		width: 394rpx;
		height: 76rpx;
	}
	.lucky_lab {
		font-size: 32rpx;
		color: #ffffff;
		line-height: 44rpx;
		margin-top: 25rpx;
	}
}
.content {
	position: relative;
	box-sizing: border-box;
	width: 750rpx;
	height: 820rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 56rpx;
}

.desk-turntable {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0rpx;
	left: 0rpx;
	right: 0rpx;
	bottom: 0rpx;
	margin: auto;
	z-index: 0;
}
.img-turntable-bg {
	position: absolute;
	top: 40rpx;
	left: 0rpx;
	right: 0rpx;
	margin: auto;
	border-radius: 50%;
	z-index: 1;
}
.img-turntable-select {
	position: absolute;
	right: 0rpx;
	margin: 0 auto;
	top: 0;
	left: 8rpx;
	z-index: 10;
}

.pointer_box {
	width: 200rpx;
	height: 228rpx;
	position: absolute;
	top: 160rpx;
	left: 0rpx;
	right: 0rpx;
	margin: auto;
	z-index: 10;
	.pointer_box_bg{
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: -1;
	}
	.pointer_box_txt{
		position: absolute;
		width: 52rpx;
		height: 70rpx;
		left: 50%;
		bottom: 66rpx;
		transform: translateX(-50%);
	}
}
.close_icon{
	width: 56rpx;
	height: 56rpx;
	margin-top: 17rpx;
}

	.panel {
		position: relative;
		height: 510rpx;
		width: 510rpx;
		border-radius: 50%;
		margin: auto;
		z-index: 2;
	}

	.sector {
		position: absolute;
		left: 255rpx;
		top: 0px;
		width: 255rpx;
		height: 510rpx;
		font-size: 24rpx;
		border-radius: 0px 255rpx 255rpx 0;
		overflow: hidden;
		transform-origin: left center;
	}

	.sector:nth-child(1) {
		transform: rotate(-30deg);
	}

	.sector:nth-child(2) {
		transform: rotate(30deg);
	}

	.sector:nth-child(3) {
		transform: rotate(90deg);
	}

	.sector:nth-child(4) {
		transform: rotate(150deg);
	}

	.sector:nth-child(5) {
		transform: rotate(210deg);
	}

	.sector:nth-child(6) {
		transform: rotate(270deg);
	}

	// .sector:nth-child(2n+1) .sector-inner {
	// 	background: #fef6e0;
	// }

	// .sector:nth-child(2n) .sector-inner {
	// 	background: #ffffff;
	// }

	.sector-inner {
		text-align: center;
		display: block;
		box-sizing: border-box;
		width: 255rpx;
		// padding: 50rpx 0rpx 0 50rpx;
		padding: 35rpx 0rpx 0 80rpx;
		height: 510rpx;
		transform: translateX(-255rpx) rotate(60deg);
		transform-origin: right center;
		border-radius: 255rpx 0 0 255rpx;
		box-sizing: border-box;

	}

	.sector-inner .item {
		// display: block;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		transform-origin: center;
		transform: rotate(-30deg);
		color: #d46854;
		box-sizing: border-box;
		min-height: 155rpx;

	}

	.icon-bean-few {
		width: 66rpx;
		height: 66rpx;
	}

	.prize-title {
		word-break: break-word;
		width: 140rpx;
		text-align: center;

		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2; /* 这里是超出几行省略 */
		overflow: hidden;
	}

	.turntable-pointer-text {
		width: 52rpx;
		height: 70rpx;
		position: absolute;
		top: 92rpx;
		left: 76rpx;
	}
</style>
