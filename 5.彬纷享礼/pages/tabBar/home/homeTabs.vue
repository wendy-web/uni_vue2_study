<template>
	<view class="xh-tabs">
<!-- 		<view class="xh-tabs-item" @click="tabsChange(0)">
			<view class="label-text" :class="{'xh-tab-active':currTabs == 0}">
				新闻
			</view>
		</view> -->
		<view class="xh-tabs-item" @click="tabsChange(0)">
			<view class="label-text" :class="{'xh-tab-active':currTabs == 0}">
				<text>品牌</text>
			</view>
		</view>
		<view class="xh-tabs-item" @click="tabsChange(1)">
			<view class="label-text" :class="{'xh-tab-active':currTabs == 1}">
				<text>热门活动</text>
			</view>
		</view>
		<!-- cursor -->
		<view class="cursor" :style="{left:(currTabs*50 + 17.5)+'%'}"></view>
	</view>
</template>

<script>
	export default {
		props: ['currTabs'],
		methods: {
			tabsChange(index) {
				this.$emit('tabsChange', index);
			}
		}
	};
</script>

<style lang="scss">
	/*顶部导航样式*/
	.xh-tabs {
		position: fixed;
		width: 100%;
		left: 0;
		top: 0;
		height: 80rpx;
		background-color: #FFFFFF;
		display: flex;
		z-index: 1;
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);

		.xh-tabs-item {
			flex: 1;
			color: #999999;
			font-size: RPX(16);
			font-weight: bold;
			@include flex-vh-center;
		}

		.label-text {
			position: relative;
		}

		.cursor {
			position: absolute;
			height: RPX(4);
			width: 15%;
			left: 5%;
			bottom: 0;
			background-color: #E02020;
			transition: 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
			 // filter: grayscale(1);
		}

		.xh-tab-active {
			color: #ee0a24;
			font-size: RPX(16);
		}

	}
</style>
