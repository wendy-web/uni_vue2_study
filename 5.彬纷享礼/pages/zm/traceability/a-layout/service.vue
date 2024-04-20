<template>

	<view class="zm-kefu-box" :class="isShow?'zm-kefu-show':'zm-kefu-hide'" @click="goService">
		<image class="zm-kefu" src="https://file.y1b.cn/public/hn29th/traceability/icon_08.png" mode="aspectFill"></image>
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
			goService() {
				if (this.isShow) {
					this.$reLaunch({
						url: "/pages/tabBar/service/service"
					});
				}
				this.isShow = !this.isShow
			}
		}
	}
</script>

<style lang="scss">
	.zm-kefu-box {
		position: fixed;
		width: 154rpx;
		height: 114rpx;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		font-size: 22rpx;
		color: #333333;
		z-index: 1000;
		transition: right .3s ease, top .3s ease;

		.zm-kefu {
			width: 154rpx;
			height: 114rpx;
		}

	}

	.zm-kefu-show {
		bottom: 194rpx;
		right: 10px;
	}

	.zm-kefu-hide {
		bottom: 194rpx;
		right: -65rpx;
	}
</style>