<template>
	<view class="exchange-point-bottled">
		<privacy-popup ref="privacyPopup"></privacy-popup>
		<xh-navbar navber-color="transparent" left-image="/static/images/left_black_arrow.png">
			<view slot="title" class="epb-title">
				查看换购点
			</view>
		</xh-navbar>
		<!-- top-icon -->
		<image class="top-icon" src="https://file.y1b.cn/public/hn29th/exchangePoint/icon_01.png" mode="aspectFill"></image>
		<!-- 选项卡 -->
		<view class="tabs">
			<view class="tab-item" :class="{'tab-active':type===0}" @click="tabsChange(0)">
				按推荐星级排序
			</view>
			<view class="tab-item" :class="{'tab-active':type===1}" @click="tabsChange(1)">
				按推荐距离排序
			</view>
			<view class="tab-item-cursor" :style="'transform: translateX('+(type===0?0:'310rpx')+');'" />
		</view>
		<!-- 店铺列表 -->
		<shop-item v-for="item in list" :key="item.id" :config="item" :exchange-type="0" />
		<!-- 异常换购点反馈 -->
		<view class="err-point-box">
			<view class="err-point" @click="showBottledErrTips">
				<image class="err-point-icon" src="https://file.y1b.cn/public/hn29th/exchangePoint/icon_11.png" mode="aspectFill">
				</image>
				异常换购点反馈
			</view>
		</view>
		<BottledErrTips ref="BottledErrTips" />
	</view>
</template>

<script>
	import mixin from "./common/mixin.js"
	import shopItem from "./common/shop-item.vue"
	import BottledErrTips from "./common/BottledErrTips.vue"
	export default {
		mixins: [mixin],
		components: {
			shopItem,
			BottledErrTips
		},
		onLoad() {
			this.getData()
		},
		methods: {
			showBottledErrTips() {
				this.$refs.BottledErrTips.show()
			}
		}
	}
</script>

<style>
	page {
		background-color: #EDEDED;
	}

	.epb-title {
		font-size: 36rpx;
		font-weight: 700;
		color: #000000;
		letter-spacing: 1.58rpx;
	}

	.top-icon {
		width: 100%;
		height: 146rpx;
		display: block;
	}

	.tabs {
		width: 620rpx;
		display: flex;
		justify-content: center;
		position: relative;
		z-index: 1;
		margin: 28rpx auto 20rpx;
		background-color: #FFFFFF;
		border-radius: 18rpx;
		overflow: hidden;
	}

	.tab-item {
		width: 310rpx;
		height: 72rpx;
		text-align: center;
		line-height: 72rpx;
		font-size: 32rpx;
		font-weight: 700;
		color: #636266;
		position: relative;
		z-index: 1;
	}

	.tab-active {
		color: #181818;
	}


	.tab-item-cursor {
		background-color: #FFDE00;
		width: 310rpx;
		height: 72rpx;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 0;
		border-radius: 18rpx;
		transition: 0.3s;
	}

	.err-point-box {
		height: 120rpx;
		width: 100%;
	}

	.err-point {
		height: 120rpx;
		background-color: #ededed;
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

	/* .err-point::after {
		content: '';
		display: block;
		height: 120rpx;
		width: 100%;
	} */

	.err-point-icon {
		width: 32rpx;
		height: 32rpx;
		margin-right: 6rpx;
	}
</style>