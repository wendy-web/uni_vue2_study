<template>
	<view class="xh-tabs">
		<view class="xh-tabs-item" @click="tabsChange(0)">
			<view class="label-text" :class="{'xh-tab-active':currTabs == 0}">
				捐献记录
			</view>
		</view>
		<view class="xh-tabs-item" @click="tabsChange(1)">
			<view class="label-text" :class="{'xh-tab-active':currTabs == 1}">
				获取记录
			</view>
		</view>
		<!-- cursor -->
		<view class="cursor" :style="{left:currTabs*50+17.5+'%'}"></view>
	</view>
</template>

<script>
	export default {
		props:{
			currTabs:{
				type:Number,
				default:0
			}
		},
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
		width: 100%;
		display: flex;
		position: relative;
		height: 64rpx;
		background-color: #fff5e2;

		.xh-tabs-item {
			flex: 1;
			color: #797979;
			font-size: 32rpx;
			font-weight: 400;
			display: flex;
			justify-content: center;
			align-items: center;
			padding-bottom: 20rpx;
		}

		.label-text {
			position: relative;
		}

		.cursor {
			position: absolute;
			height: 4rpx;
			width: 15%;
			left: 5%;
			bottom: 0;
			background-color: #FF6F00;
			transition: 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
		}

		.xh-tab-active {
			color: #FF6F00;
			font-size: 32rpx;
			font-weight: 700;
		}

	}
</style>
