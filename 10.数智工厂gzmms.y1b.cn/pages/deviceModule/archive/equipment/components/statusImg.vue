<template>
	<view class="status-wrapper position-a">
		<!-- 正常状态图片 -->
		<image v-if="status == 1" class="status-img" src="/static/otherImg/equipmentImg0.png"></image>
		<!-- 停用状态图片 -->
		<image v-if="status == 0" class="status-img" src="/static/otherImg/equipmentImg3.png"></image>
		<!-- 报废状态图片 -->
		<image v-if="status == 4" class="status-img" src="/static/otherImg/equipmentImg4.png"></image>
	</view>
</template>

<script>
export default {
	props: {
		status: {
			type: Number,
			default: "-1",
		},
	},
	// 这里存放数据
	data() {
		return {};
	},
};
</script>
<style lang="scss">
.status-wrapper {
	width: 110rpx;
	height: 110rpx;
	right: 0;
	top: 0;
	z-index: 1;
	.status-img {
		width: 100%;
		height: 100%;
	}
}
</style>
