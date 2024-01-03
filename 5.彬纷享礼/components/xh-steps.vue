<template>
	<cover-view class="xh-steps" :style="{top:top+'px'}">
		<!-- 底部背景 -->
		<cover-image class="xh-steps-bottom-bg" src="/static/images/xh_steps_bottom_bg.png"></cover-image>
		<!-- 完成进度背景 -->
		<cover-view class="xh-steps-bg-box">
			<cover-view class="xh-steps-bg" :style="{width: steps*50 +'%'}"></cover-view>
		</cover-view>
		<!-- 总进度列表 -->
		<cover-view class="xh-steps-icon-list">
			<cover-view class="steps-item">
				<cover-image class="steps-item-img"
					:src="steps>0?'/static/images/steps_success.png':'/static/images/steps_wait.png'"></cover-image>
			</cover-view>
			<cover-view class="steps-item">
				<cover-image v-if="steps>=1" class="steps-item-img"
					:src="steps>1?'/static/images/steps_success.png':'/static/images/steps_wait.png'"></cover-image>
			</cover-view>
			<cover-view class="steps-item">
				<cover-image v-if="steps>=2" class="steps-item-img"
					:src="steps>2?'/static/images/steps_success.png':'/static/images/steps_wait.png'"></cover-image>
			</cover-view>
			<!-- 			<cover-view class="steps-item">
				<cover-image v-if="steps>=3" class="steps-item-img"
					:src="steps>3?'../static/images/steps_success.png':'../static/images/steps_wait.png'"></cover-image>
			</cover-view> -->
		</cover-view>
		<cover-view class="xh-steps-text-list">
			<cover-view class="xsl-text">扫店铺码</cover-view>
			<!-- <cover-view class="xsl-text">扫罐底码</cover-view> -->
			<cover-view class="xsl-text">付款</cover-view>
			<cover-view class="xsl-text">换购成功</cover-view>
		</cover-view>

	</cover-view>
</template>

<script>
	export default {
		name: 'xh-steps',
		props: {
			steps: {
				type: Number,
				default: 0
			},
			top: {
				type: Number,
				default: 0
			}
		}
	};
</script>

<style lang="scss">
	.xh-steps {
		height: 140rpx;
		background-color: rgba(0, 0, 0, 0.3);
		width: 100rpx;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		box-sizing: border-box;
		z-index: 100;

		.xh-steps-bottom-bg {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			left: 76rpx;
			right: 76rpx;
			width: auto;
			height: 10rpx;
		}

		.xh-steps-bg-box {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			right: 76rpx;
			left: 76rpx;
			height: 6rpx;
		}

		.xh-steps-bg {
			background-color: #6DE241;
			height: 6rpx;
		}

		.xh-steps-icon-list {
			position: absolute;
			right: 68rpx;
			left: 68rpx;
			display: flex;
			justify-content: space-between;
			top: 56rpx;
		}

		.xh-steps-text-list {
			position: absolute;
			right: 0;
			left: 0;
			display: flex;
			justify-content: space-between;
			top: 100rpx;
		}

		.steps-item,
		.steps-item-img {
			width: 32rpx;
			height: 32rpx;
		}

		.xsl-text {
			flex: 1;
			text-align: center;
			font-size: 20rpx;
			color: #FFFFFF;
		}


	}
</style>