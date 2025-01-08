<template>
	<view class="gray-gap" :style="{ height: newHeight }"></view>
</template>

<script>
export default {
	name: "gray-gap",
	props: {
		height: {
			type: [String, Number],
			default: 30,
		},
	},
	data() {
		return {};
	},
	computed: {
		newHeight() {
			return parseInt(this.height) + "rpx";
		},
	},
};
</script>

<style lang="scss">
.gray-gap {
	width: 100%;
	background-color: #f6f6f6;
}
</style>
