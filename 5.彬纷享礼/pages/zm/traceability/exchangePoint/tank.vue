<template>
	<view class="exchange-point-tank">
		<!-- 背景 -->
		<image class="ept-bg" src="https://file.y1b.cn/public/hn29th/exchangePoint/icon_06.png" mode="aspectFill"></image>
		<privacy-popup ref="privacyPopup"></privacy-popup>
		<xh-navbar navber-color="transparent" left-image="/static/images/left_arrow.png" />
		<!-- top-icon -->
		<image class="top-icon" src="https://file.y1b.cn/public/hn29th/exchangePoint/icon_07.png" mode="aspectFill"></image>
		<!-- 选项卡 -->
		<view class="tabs">
			<view class="tab-item" :class="{'tab-active':type===0}" @click="tabsChange(0)">
				按推荐星级排序
			</view>
			<view class="tab-item" :class="{'tab-active':type===1}" @click="tabsChange(1)">
				按推荐距离排序
			</view>
		</view>
		<!-- 店铺列表 -->
		<shop-item v-for="item in list" :key="item.id" :config="item" :exchange-type="1" />
		<!-- 异常换购点反馈 -->
		<view class="err-point-box">
			<view class="err-point" @click="showBottledErrTips">
				<image class="err-point-icon" src="https://file.y1b.cn/public/hn29th/exchangePoint/icon_11.png" mode="aspectFill">
				</image>
				异常换购点反馈
			</view>
		</view>
		<tankErrTips ref="tankErrTips" />
	</view>
</template>

<script>
	import mixin from "./common/mixin.js"
	import shopItem from "./common/shop-item.vue"
	import tankErrTips from "./common/tankErrTips.vue"
	export default {
		mixins: [mixin],
		components: {
			shopItem,
			tankErrTips
		},
		data() {
			return {
				prizeratetype: 2
			}
		},
		onLoad() {
			this.getData()
		},
		methods: {
			showBottledErrTips() {
				this.$refs.tankErrTips.show()
			}
		}
	}
</script>

<style>
	.ept-bg {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
	}

	.top-icon {
		width: 324rpx;
		height: 60rpx;
		display: block;
		margin: 0 auto 40rpx;
	}

	.tabs {
		padding: 0 70rpx;
		display: flex;
		justify-content: space-between;
		position: relative;
		z-index: 1;
		margin-bottom: 20rpx;
		overflow: hidden;
	}

	.tab-item {
		font-size: 32rpx;
		font-weight: 700;
		color: #828282;
		position: relative;
		z-index: 1;
		padding-bottom: 6rpx;
		position: relative;
	}

	.tab-item::after {
		content: '';
		position: absolute;
		width: 100%;
		left: 0;
		bottom: 0;
		background-color: #fff;
		height: 2rpx;
		display: none;
	}

	.tab-active {
		color: #fff;
	}

	.tab-active::after {
		display: block;
	}

	.err-point-box {
		height: 120rpx;
		width: 100%;
	}

	.err-point {
		height: 120rpx;
		background-color: #000000;
		width: 100%;
		position: fixed;
		left: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		opacity: 0.95;
		font-size: 24rpx;
		text-align: center;
		color: #fc534d;
		z-index: 1;
	}

	.err-point-icon {
		width: 32rpx;
		height: 32rpx;
		margin-right: 6rpx;
	}
</style>