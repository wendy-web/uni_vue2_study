<template>
	<view class="err-tips-box" v-if="isShow">
		<view class="err-tips">
			<!-- 背景 -->
			<image class="err-tips-bg" src="https://file.y1b.cn/public/hn29th/exchangePoint/icon_12.png" mode="aspectFill"></image>
			<!-- title -->
			<view class="err-tips-title">
				温馨提示
			</view>
			<view class="err-tips-info" style="padding-top: 50rpx;padding-bottom: 15rpx;">
				若所到商户无法换购或附近无显示换购点，
			</view>
			<view class="err-tips-info">
				可拨打活动热线
				<text class="err-phone" @click="callPhone">4008185599</text>
				登记
			</view>
			<view class="err-tips-info" style="padding-top: 50rpx;">
				服务时间为工作日：
			</view>
			<view class="err-tips-info" style="padding-top: 16rpx;">
				8:30-11:30、13:00-17:30
			</view>
			<view class="err-tips-info" style="padding-top: 50rpx;">
				战马公司将安排当地工作人员与您联系并
			</view>
			<view class="err-tips-info" style="padding-top: 16rpx;">
				给您推荐换购点，感谢您的支持。
			</view>
			<image @click="isShow = false" class="tips-roger" src="https://file.y1b.cn/public/hn29th/exchangePoint/icon_13.png"
				mode="aspectFill"></image>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShow: false
			}
		},
		methods: {
			show() {
				this.isShow = true
			},
			callPhone() {
				uni.makePhoneCall({
					phoneNumber: '4008185599'
				})
			}
		}
	}
</script>

<style>
	.err-tips {
		position: fixed;
		width: 690rpx;
		height: 800rpx;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 1;
		box-sizing: border-box;
		padding: 0 60rpx;
	}

	.err-tips-bg {
		position: absolute;
		width: 690rpx;
		height: 800rpx;
		left: 0;
		top: 0;
		z-index: -1;
	}

	.err-tips-title {
		font-size: 52rpx;
		font-weight: 500;
		color: #E3001B;
		text-align: center;
		padding-top: 84rpx;
	}

	.err-tips-info {
		font-size: 30rpx;
		font-weight: 400;
		color: #ffffff;
	}

	.err-phone {
		font-size: 36rpx;
		font-weight: 500;
		color: #E3001B;
		border-bottom: 4rpx solid #E3001B;
		margin: 0 15rpx;
		position: relative;
		top: -6rpx;
	}

	.tips-roger {
		width: 428rpx;
		height: 98rpx;
		display: flex;
		margin: 55rpx auto 0;
	}

	.err-tips-box {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.68);
		z-index: 1;
	}
</style>