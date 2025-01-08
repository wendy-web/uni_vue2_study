<template>
	<van-popup :show="isShow" @close="onClose" custom-style="height: 270rpx;overflow: visible;" position="bottom" round
		:safe-area-inset-bottom="false">
		<view class="continue-pay">
			<view class="btn-close">
				<image @click="onClose" class="icon-pop-close" mode="aspectFit"
					src="https://file.y1b.cn/public/img/ttxl/202303/icon_pop_close.png">
				</image>
			</view>
			<view class="pop-box">
				<view class="pop-title">
					<text>专属优惠打败</text>
					<text class="color-red">{{randomPercent}}%</text>
					<text>的用户哦</text>
				</view>
				<view class="pop-btn-box">
					<view class="pop-btn-confirm" @click="toPay">继续支付</view>
				</view>
			</view>
		</view>
	</van-popup>
</template>

<script>
	//支付函数
	let _payFunc = null
	export default {

		data() {
			return {
				isShow: false,
				randomPercent: '' //随机百分比
			}
		},
		methods: {
			show(func) {
				this.randomPercent = Number(Math.random() * 14 + 85).toFixed(2);
				_payFunc = func
				this.isShow = true
			},
			onClose() {
				this.isShow = false
				_payFunc = null
			},
			toPay() {
				_payFunc()
			}
		}

	}
</script>

<style lang="scss">
	.continue-pay {
		.btn-close {
			position: absolute;
			top: -70rpx;
			right: 20rpx;
			text-align: right;
			padding: 10rpx 22rpx;

			.icon-pop-close {
				width: 48rpx;
				height: 48rpx;
			}
		}

		.pop-box {
			box-sizing: border-box;
			height: 324rpx;
			background: #ffffff;
			border-radius: 24rpx 24rpx 0px 0px;
			padding: 40rpx 32rpx;

			.pop-title {
				font-size: 30rpx;
				font-weight: 500;
				text-align: center;
				color: #333333;
				line-height: 42rpx;

				.color-red {
					color: #EF2B20;
				}
			}

			.pop-btn-box {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-top: 56rpx;
			}

			.pop-btn-confirm {
				width: 328rpx;
				height: 88rpx;
				box-sizing: border-box;
				line-height: 88rpx;
				text-align: center;
				background: linear-gradient(135deg, #f96a02, #ef2b20);
				border-radius: 16rpx;
				box-shadow: 0px 4rpx 16rpx 2rpx rgba(238, 81, 73, 0.45);
				font-size: 28rpx;
				font-weight: 500;
				color: #FFFFFF !important;
				border: none;
			}
		}
	}
</style>