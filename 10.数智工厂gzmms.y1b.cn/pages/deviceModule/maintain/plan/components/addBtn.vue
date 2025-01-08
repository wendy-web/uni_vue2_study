<template>
<view class="footer-btn">
	<view class="footer-btn-item">
		<uv-button text="返回" plain @click="onBack"></uv-button>
	</view>
	<view class="footer-btn-item">
		<uv-button text="执行计划" type="primary" @click="onSubmit" :disabled="disabled"></uv-button>
	</view>
</view>
</template>

<script>
export default {
	props: {
		loading: {
			type: Boolean,
			default: false,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {};
	},
	methods: {
		onBack() {
			uni.navigateBack({
				delta: 1
			});
		},
		onSubmit() {
			this.$emit("submit");
		},
	},
};
</script>
<style lang="scss">
.footer-btn {
	position: fixed;
	z-index: 199;
	bottom: 0;
	left: 0;
	right: 0;
	height: 100rpx;
	background-color: #ffffff;
	display: flex;
	justify-content: center;
	padding: 4rpx 20rpx 0rpx 20rpx;
	padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
	&-item {
		flex: 1;
		&:not(first-child) {
			margin-left: 40rpx;
		}
	}
}
</style>
