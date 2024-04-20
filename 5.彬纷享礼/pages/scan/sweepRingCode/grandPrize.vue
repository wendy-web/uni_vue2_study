<!-- 中奖提示传 -->
<template>

	<view class="grand-prize" :style="{display: isShow?'block':'none'}">
		<!-- 头部 -->
		<image :class="grand_prize_souces[prizeratetype].headClass" class="animated  bounceInDown"
			:src="grand_prize_souces[prizeratetype].head" mode="aspectFill"></image>
		<!-- 身体 -->
		<image class="grand-prize-body  animated rubberBand" :src="grand_prize_souces[prizeratetype].body"
			mode="aspectFill"></image>
		<!-- 按钮 -->
		<view class="xwwh-xh-dialog-btn animated lightSpeedIn">
			<anNoticeBarShow :awardList="awardList" margin="0 auto 20rpx" />
			<view style="display: flex;justify-content: space-around;">
				<image class="grand-prize-btn" src="/pages/scan/static/grandPrize/grand_prize_left.png"
					mode="aspectFill" @click="close"></image>
				<image class="grand-prize-btn" src="/pages/scan/static/grandPrize/grand_prize_right.png"
					mode="aspectFill" @click="goAward"></image>
			</view>

		</view>
	</view>

</template>

<script>
	import anNoticeBarShow from "@/components/anNoticeBarShow.vue"

	const grand_prize_souces = {
		6: {
			head: '/pages/scan/static/grandPrize/grand_prize_head.png',
			headClass: "grand-prize-head",
			body: '/pages/scan/static/grandPrize/grand_prize_body.png'
		},
		14: {
			head: '/pages/scan/static/grandPrize/grand_prize_head_29.png',
			headClass: "grand-prize-head_29",
			body: '/pages/scan/static/grandPrize/grand_prize_body_29.png'
		}
	}

	export default {
		props: ["awardList"],
		data() {
			return {
				grand_prize_souces,
				isShow: false,
				prizeratetype: 14
			}
		},
		components: {
			anNoticeBarShow
		},
		methods: {
			show(prizeratetype = 14) {
				this.prizeratetype = prizeratetype
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

		.grand-prize-head,
		.grand-prize-head_29 {
			position: fixed;
			top: 92rpx;
			left: 50%;
			margin-left: -285rpx;
			z-index: 1;
		}

		.grand-prize-head {
			width: 570rpx;
			height: 178rpx;
		}

		.grand-prize-head_29 {
			width: 560rpx;
			height: 162rpx;
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
			top: 918rpx;
			left: 50%;
			width: 700rpx;
			margin-left: -350rpx;
			padding-top: 20rpx;
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