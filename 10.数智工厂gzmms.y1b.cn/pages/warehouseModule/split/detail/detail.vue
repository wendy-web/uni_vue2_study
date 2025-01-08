<template>
	<view class="container">
		<uni-nav-bar
			background-color="linear-gradient(to left, #DAE3FF, #ECF4FF, #E1E8FF); "
			status-bar
			title="拆装单详情"
			:border="false"
			fixed
			left-icon="left"
			@clickLeft="back"
		/>
	</view>
</template>

<script>
export default {
	// 这里存放数据
	data() {
		return {};
	},

	// 生命周期 - 监听页面加载
	onLoad(options) {},
	// 生命周期 - 监听页面显示
	onShow() {},
	// 方法集合
	methods: {
		back() {
			uni.navigateBack({
				delta: 1,
			});
		},
	},
	// 计算属性
	computed: {},
	onHide() {}, // 生命周期 - 监听页面隐藏
	onUnload() {}, // 生命周期 - 监听页面卸载
};
</script>
<style lang="scss"></style>
