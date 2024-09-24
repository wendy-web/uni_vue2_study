<template>
	<view>
		<!-- <view class="search-container-reset" @click="reset">重置</view> -->
		<uv-button :customStyle="customStyle" text="重置" @click="reset" :color="textColor"></uv-button>
	</view>
</template>

<script>
/** 本组件为search搜索框的 右侧重置按钮组件 */
export default {
	name: "wsearch-btn",
	props: {
		color: String,
	},
	data() {
		return {
			customStyle: {
				width: "80rpx",
				height: "64rpx",
				lineHeight: "64rpx",
				backgroundColor: "transparent",
				border: "none",
				paddingTop: "6rpx",
				paddingLeft: "0",
				paddingRight: "20rpx",
				marginLeft: "20rpx",
			},
		};
	},
	computed: {
		textColor() {
			return this.color;
		},
	},
	methods: {
		reset() {
			this.$emit("reset");
		},
	},
};
</script>

<style lang="scss"></style>
