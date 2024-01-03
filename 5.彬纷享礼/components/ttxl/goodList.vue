<template>
	<view class="goods-list">
		<view class="goods-item" v-for="(item,index) in list" :key="index" @click="goodsClick(item)">
			<van-image width="344rpx" height="344rpx" fit="cover" radius="8px 8px 0 0" lazy-load :src="item.image"
				use-loading-slot>
				<van-loading slot="loading" type="spinner" size="20" vertical />
			</van-image>
			<!-- 商品信息 -->
			<view class="goods-info">
				<view class="good-name">
					<view class="card-discount">
						<van-image class="discount-icon" width="100%" height="100%"
							src="/static/ttxl/ttxl_card_discount.png"></van-image>
						<text class="discount-text">抵¥{{item.discount}}券</text>
					</view>
					{{item.skuName}}
				</view>
				<view>
					<text class="jf-num">{{item.credits}}</text>
					<text class="jf-label">积分</text>
					<text class="exchange-num">{{item.exchange_num}}人兑换</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		bysubunionid
	} from "@/api/modules/ttxl.js"
	import {
		mapGetters
	} from 'vuex'
	export default {
		props: {
			list: {
				type: Array,
				default () {
					return []
				}
			},
			pathType: {
				type: Number,
				default: 0
			}
		},

		methods: {
			async goodsClick({
				positionId,
				skuId
			}) {
				if (!this.$hasLogin()) {
					return
				}
				let res = await bysubunionid({
					positionId,
					skuId,
					path_type: this.pathType
				})
				let {
					appId,
					path,
					jump_type
				} = res.data || {}
				if (appId && path) {
					let open = jump_type === 1 ? this.$navigateToMiniProgram : this.$openEmbeddedMiniProgram
					open({
						appId,
						envVersion:'release',
						path
					})
					return
				}
				uni.showModal({
					title: '数据异常',
					content: `截图并联系客服(positionId=${positionId},skuId=${skuId},appId=${appId},path=${path})`
				})
			}
		}
	}
</script>

<style lang="scss">
	.goods-list {
		padding: 24rpx 20rpx 0;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;

		.goods-item {
			width: 344rpx;
			flex-shrink: 0;
			background-color: #ffffff;
			border-radius: 8px;
			overflow: hidden;
			position: relative;
			font-size: 0;
			margin-bottom: 20rpx;
		}

		.goods-info {
			padding: 20rpx 18rpx 24rpx;
		}

		.good-name {
			margin-bottom: 18rpx;
			position: relative;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			height: 74rpx;
			font-size: 28rpx;
			color: #333;
			line-height: 37rpx;
		}

		.card-discount {
			padding: 0 10rpx 0 20rpx;
			color: #ffffff;
			position: relative;
			z-index: 0;
			margin-right: 8rpx;
			display: inline-block;
		}

		.discount-icon {
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
			width: 100%;
			height: 100%;
		}

		.discount-text {
			white-space: nowrap;
			font-size: 24rpx;
			font-weight: 600;
			color: #ffffff;
		}

		.jf-num {
			font-size: 36rpx;
			font-weight: 500;
			color: #E7331B;
			margin-right: 4rpx;
		}

		.jf-label {
			font-size: 24rpx;
			color: #e7331b;
			margin-right: 12rpx;
		}

		.exchange-num {
			font-size: 24rpx;
			color: #aaaaaa;
		}
	}
</style>
