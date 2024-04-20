<template>
	<view v-if="awardList.length>0" class="an-notice-bar-show" :style="{backgroundColor:bgColor,margin:margin}">
		<swiper :vertical="true" :circular="true" :autoplay="true" :interval="3000" :duration="1000"
			style="height: 100%;">

			<swiper-item v-for="item in awardList" :key="item.id">
				<view class="swiper-item">
					<image class="icon" :src="grand_prize_souces[prizeratetype].icon" mode="aspectFill"></image>
					<view class="text">
						恭喜{{item.nick_name}}{{grand_prize_souces[prizeratetype].text}}
					</view>
				</view>
			</swiper-item>

		</swiper>
	</view>
</template>
<script>
	const grand_prize_souces = {
		6: {
			icon: '/static/images/grand_prize_icon.png',
			text: '获得28g金牌一块 '
		},
		14: {
			icon: '/static/images/grand_prize_icon_29.png',
			text: '获得29g金牌一块 '
		}
	}

	export default {
		props: {
			awardList: {
				type: Array,
				default () {
					return []
				}
			},
			bgColor: {
				type: String,
				default: '#3d3d3d'
			},
			margin: {
				type: String,
				default: '0 auto'
			},
		},
		data() {
			return {
				grand_prize_souces,
				list: [],
				prizeratetype: 14
			};
		}
	}
</script>
<style lang="scss">
	.an-notice-bar-show {
		width: 654rpx;
		height: 66rpx;
		border-radius: 10rpx;
		position: relative;
		z-index: 1;

		.swiper-item {
			display: flex;
			align-items: center;
			height: 100%;
			padding-left: 28rpx;
		}

		.icon {
			width: 32rpx;
			height: 32rpx;
		}

		.text {
			font-size: 20rpx;
			font-weight: 400;
			color: #fff33d;
			letter-spacing: 2rpx;
			margin-left: 20rpx;
		}
	}
</style>