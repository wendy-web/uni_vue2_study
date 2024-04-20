<template>
	<view class="shop-item">
		<!-- title -->
		<view class="shop-item-head">
			<view class="shop-item-title">
				{{config.shop_name}}
			</view>
			<view class="shop-item-distance">
				{{config.distText}}
			</view>
		</view>
		<!-- 等级 -->
		<view class="grade">
			<image v-if="[1,2,3,4].includes(config.grade)" class="icon-sun"
				src="https://file.y1b.cn/public/hn29th/exchangePoint/icon_04.png" mode="aspectFill"></image>
			<image v-if="[1,2,5,6].includes(config.grade)" class="icon-moon"
				src="https://file.y1b.cn/public/hn29th/exchangePoint/icon_03.png" mode="aspectFill"></image>
			<image v-if="[1,3,5,7].includes(config.grade)" class="icon-star"
				src="https://file.y1b.cn/public/hn29th/exchangePoint/icon_02.png" mode="aspectFill"></image>
		</view>
		<!-- 地址 -->
		<view class="address">
			{{config.address}}
		</view>
		<!-- 瓶 -->
		<image v-if="exchangeType===0" class="go-exchange-2" src="https://file.y1b.cn/public/hn29th/exchangePoint/icon_08.png"
			mode="aspectFill" @click="openLocation"></image>
		<!-- 前往兑换 罐 -->
		<view class="go-exchange" v-else @click="openLocation">
			<!-- 背景 -->
			<image class="go-exchange-bg" src="https://file.y1b.cn/public/hn29th/exchangePoint/icon_05.png" mode="aspectFill"></image>
			<text>前往兑换</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['config', 'exchangeType'],
		methods: {
			//导航指定商铺
			openLocation() {
				let data = this.config
				if (!data.latitude || !data.longitude) {
					return uni.showToast({
						title: '该商铺没有经纬度，无法前往',
						icon: 'none'
					})
				}

				uni.openLocation({
					latitude: data.latitude - 0,
					longitude: data.longitude - 0,
					name: data.shop_name,
					address: data.address
				});
			},
		}
	}
</script>

<style>
	.shop-item {
		width: 710rpx;
		height: 174rpx;
		background-color: #ffffff;
		border-radius: 20rpx;
		margin: 0 auto 20rpx;
		box-sizing: border-box;
		padding: 30rpx 30rpx 0;
		position: relative;
		z-index: 1;
	}

	.shop-item-head {
		display: flex;
		justify-content: space-between;
		padding-right: 30rpx;
	}

	.shop-item-title,
	.shop-item-distance {
		font-size: 32rpx;
		font-weight: 700;
		color: #000018;
	}

	.shop-item-title {
		max-width: 410rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.grade {
		display: flex;
		align-items: center;
		margin-top: 4rpx;
		margin-bottom: 6rpx;
	}

	.icon-sun {
		width: 32rpx;
		height: 32rpx;
	}

	.icon-moon {
		width: 28rpx;
		height: 28rpx;
	}

	.icon-star {
		width: 24rpx;
		height: 24rpx;
	}

	.address {
		font-size: 20rpx;
		color: #636266;
	}

	.go-exchange-2 {
		width: 166rpx;
		height: 56rpx;
		position: absolute;
		bottom: 30rpx;
		right: 33rpx;
	}

	.go-exchange {
		width: 162rpx;
		height: 52rpx;
		position: absolute;
		bottom: 30rpx;
		right: 33rpx;
		z-index: 1;
		font-size: 24rpx;
		font-weight: 700;
		color: #ffde00;
		text-align: center;
		line-height: 52rpx;
	}

	.go-exchange-bg {
		width: 162rpx;
		height: 52rpx;
		position: absolute;
		z-index: -1;
		left: 0;
		top: 0;
	}
</style>