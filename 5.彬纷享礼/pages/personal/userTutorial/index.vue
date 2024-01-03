<template>
	<view class="user-tutorial">
		<easy-loadimage imageClass="W-H-fill" mode="widthFix" image-src="https://file.y1b.cn/public/img/2022/xl3-1.jpg">
		</easy-loadimage>
		<view class="define-btn" @click="define">
			<easy-loadimage imageClass="define-btn-bg" image-src="../../../static/images/dialog_btn_bg01.png"
				mode="widthFix" @click="define"></easy-loadimage>
			<view class="define-btn-text">
				知道了，跳过
			</view>
		</view>
	</view>
</template>

<script>
	let _wxScanQrCode = '';

	export default {
		onLoad(o) {
			_wxScanQrCode = o.wxScanQrCode;
		},
		methods: {
			//知道了
			define() {
				this.$redirectTo({
					url: `/pages/scan/sweepRingCode/sweepRingCode?wxScanQrCode=${_wxScanQrCode}`
				});;
			}
		},

	};
</script>

<style lang="scss">
	.user-tutorial {
		.define-btn {
			width: 300rpx;
			position: fixed;
			bottom: 10%;
			left: 50%;
			transform: translateX(-50%);
		}

		.define-btn-bg {
			width: 300rpx;
		}

		.define-btn-text {
			position: absolute;
			left: 50%;
			top: 20rpx;
			transform: translateX(-50%);
			white-space: nowrap;
			color: red;
			font-weight: bold;
			font-size: 30rpx;
		}
	}
</style>