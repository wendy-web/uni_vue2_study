<template>
	<!-- <view class="add-btn-content">
  	<uv-button type="primary" text="提交" customStyle="margin-top: 10px" @click="submit"></uv-button>
  </view> -->
	<view class="footer-btn">
		<view class="footer-btn-item">
			<uv-button text="取消" @click="onCancel"></uv-button>
		</view>
		<template v-if="!loading">
			<view class="footer-btn-item">
				<uv-button text="确定" plain type="primary" @click="onSave"></uv-button>
			</view>
			<view class="footer-btn-item">
				<uv-button text="提交验收" type="primary" @click="onSubmit" :disabled="disabled"></uv-button>
			</view>
		</template>
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
	mounted() {},
	methods: {
		onCancel() {
			uni.redirectTo({
				url: "./list",
			});
		},
		onSave() {
			this.$emit("save");
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
