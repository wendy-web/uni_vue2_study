<template>
	<view class="type-tabs" :style="{top:navHeight+'px'}">
		<view class="xh-tabs-item" @click="tabsChange(0)">
			<view class="label-text" :class="{'xh-tab-active':currTabs == 0}">
				<image v-if="currTabs == 0" class="label-text-icon" src="../static/hn_select_icon.png" mode="aspectFill"></image>
				<image v-else class="label-text-icon" src="../static/hn_icon.png" mode="aspectFill"></image>
				<text>中国红牛</text>
			</view>
		</view>
		<view class="xh-tabs-item" @click="tabsChange(1)">
			<view class="label-text" :class="{'xh-tab-active':currTabs == 1}">
				<image v-if="currTabs == 1" class="label-text-icon" src="../static/zm_select_icon.png" mode="aspectFill"></image>
				<image v-else class="label-text-icon" src="../static/zm_icon.png" mode="aspectFill"></image>
				<text>战马</text>
			</view>
		</view>
		<!-- cursor -->
		<view class="cursor" :style="{left:(currTabs*50 + 25)+'%'}"></view>
	</view>
</template>

<script>
	export default {
		props: ['currTabs','navHeight'],
		methods: {
			tabsChange(index) {
				if(this.currTabs == index)return
				this.$emit('tabsChange', index);
			}
		}
	};
</script>

<style lang="scss">
	/*顶部导航样式*/
	.type-tabs {
		width: 100%;
		height: 80rpx;
		display: flex;
		position: fixed;
		margin-bottom: 20rpx;
		z-index: 3;
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
		background-color: #FFFFFF;

		.xh-tabs-item {
			flex: 1;
			font-size: 28rpx;
			font-weight: 500;
			color: #4a4a4a;
			font-weight: bold;
			@include flex-vh-center;
		}

		.label-text {
			position: relative;
			@include flex-vh-center;
		}
		
		.label-text-icon{
			width: 50rpx;
			height: 50rpx;
		}

		.cursor {
			position: absolute;
			height: 4rpx;
			width: 6%;
			left: 5%;
			bottom: 6rpx;
			background-color: #E02020;
			transition: 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
			 // filter: grayscale(1);
		}

		.xh-tab-active {
			color: #ee0a24;
			font-size: 28rpx;
		}

	}
</style>
