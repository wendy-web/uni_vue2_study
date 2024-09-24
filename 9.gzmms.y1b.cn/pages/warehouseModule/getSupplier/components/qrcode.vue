<template>
	<uv-popup ref="popup" mode="center" :safeAreaInsetBottom="false">
		<view class="qrcode">
			<image :src="value" mode="" class="qrcode-img"></image>
			<view class="qrcode-bottom">
				<text>领取人扫码确认</text>
				<uv-button text="关闭" type="primary" @click="close"></uv-button>
			</view>
		</view>
	</uv-popup>
</template>

<script>
export default {
	props: {
		value: {
			type: String,
			default: "",
		},
	},
	// 这里存放数据
	data() {
		return {};
	},

	mounted() {},
	// 计算属性
	computed: {},
	// 方法集合
	methods: {
		open() {
			this.$refs.popup.open();
		},
		close() {
			this.$refs.popup.close();
		},
	},
};
</script>
<style lang="scss">
.qrcode {
	.qrcode-img {
		width: 300rpx;
		height: 300rpx;
	}
	.qrcode-bottom{
		text-align: center;
	}
}
</style>
