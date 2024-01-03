<template>
	<view class="grand-prize-confirm">
		<van-popup :show="show" @close="popupClose" custom-style="background-color: transparent;"
			:close-on-click-overlay="false" :z-index="10000">
			<image class="grand-confirm-icon" src="/pages/scan/static/grand_confirm_icon.png" mode="aspectFill">
			</image>
			<view class="grand-prize-confirm-box">
				<view class="gpc-title">
					信息确认
				</view>
				<view class="gpc-msg">
					请确认姓名身份证号、联系地址、手机号码是否正确无误，该信息将作为奖品领取核对凭证，一经确认不得修改。
				</view>
				<!-- 按钮 -->
				<view class="gpc-tools">
					<van-button class="gpc-tools-btn" block round @click="popupClose">取消</van-button>
					<van-button class="gpc-tools-btn" block type="danger" round @click="confirm">确定</van-button>
				</view>
			</view>
		</van-popup>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false
			}
		},
		methods: {
			popupShow() {
				this.show = true
			},
			popupClose() {
				this.show = false
			},
			confirm() {
				this.show = false
				this.$emit('submit')
			}
		}
	}
</script>

<style lang="scss">
	.grand-prize-confirm {
		.grand-prize-confirm-box {
			width: 600rpx;
			height: 496rpx;
			background-color: #fffbfb;
			border-radius: 10px;
			position: relative;
			margin-top: -124rpx;
			box-sizing: border-box;
			padding-top: 104rpx;
		}

		.grand-confirm-icon {
			width: 218rpx;
			height: 218rpx;
			display: block;
			margin: 0 auto;
			position: relative;
			z-index: 1;
		}

		.gpc-title {
			font-size: 36rpx;
			font-weight: 700;
			text-align: center;
			color: #000000;
		}

		.gpc-msg {
			padding: 29rpx 34rpx 28rpx;
			font-size: 28rpx;
			font-weight: 400;
			text-align: justify;
			color: #4e4e4e;
			line-height: 2em;
		}

		.gpc-tools {
			display: flex;
			justify-content: space-between;
			padding: 0 40rpx 0;
		}

		.gpc-tools-btn {
			width: 240rpx;
		}



	}
</style>
