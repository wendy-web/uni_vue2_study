<!-- 中奖提示传 -->
<template>

	<view class="grand-prize" :style="{display: isShow?'block':'none'}">
		<!-- 头部 -->
		<image class="grand-prize-head  animated  bounceInDown" src="../static/grandPrize/grand_prize_head.png"
			mode="aspectFill"></image>
		<!-- 身体 -->
		<image class="grand-prize-body  animated rubberBand" src="../static/grandPrize/grand_prize_body.png"
			mode="aspectFill"></image>
		<!-- 按钮 -->
		<view class="xwwh-xh-dialog-btn animated lightSpeedIn">
			<image class="grand-prize-btn" src="../static/grandPrize/grand_prize_left.png" mode="aspectFill"
				@click="close"></image>
			<image class="grand-prize-btn" src="../static/grandPrize/grand_prize_right.png" mode="aspectFill"
				@click="goAward"></image>
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
			goAward() {
				this.$redirectTo({
					url: '/pages/scan/grandPrize/index'
				});
			},
			close() {
				this.isShow = false;
				this.$emit('closeNotice');
			}
		}
	};
</script>

<style lang="scss">
	.grand-prize {

		.grand-prize-head {
			position: fixed;
			width: 570rpx;
			height: 178rpx;
			top: 92rpx;
			left: 50%;
			margin-left: -285rpx;
			z-index: 1;
		}

		.grand-prize-body {
			width: 100%;
			height: 698rpx;
			position: fixed;
			left: 50%;
			top: 196rpx;
			margin-left: -50%;
			z-index: 0;
			-webkit-animation-delay: 1s;
			animation-delay: 1s;
		}

		//按钮
		.xwwh-xh-dialog-btn {
			position: fixed;
			top: 900rpx;
			left: 50%;
			width: 700rpx;
			margin-left: -350rpx;
			padding-top: 20rpx;
			display: flex;
			justify-content: space-around;
			margin-top: 15rpx;
			z-index: 2;
			-webkit-animation-delay: 2s;
			animation-delay: 2s;
		}

		.grand-prize-btn {
			width: 278rpx;
			height: 90rpx;
		}


	}
</style>