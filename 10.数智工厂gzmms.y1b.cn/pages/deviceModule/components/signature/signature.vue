<template>
	<view class="sing-wrapper">
		<!-- <uv-popup ref="popup" mode="bottom">
			<view style="width: 750rpx; height: 750rpx">
				<l-signature
					disableScroll
					ref="signatureRef"
					:penColor="penColor"
					:penSize="penSize"
					:openSmooth="openSmooth"
				></l-signature>
			</view>
			<view>
				<button @click="onClick('clear')">清空</button>
				<button @click="onClick('undo')">撤消</button>
				<button @click="onClick('save')">保存</button>
				<!-- uvue 不支持 openSmooth -->
				<!-- <button @click="onClick('openSmooth')">压感{{ openSmooth ? "开" : "关" }}</button> -->
			<!-- </view> -->
		<!-- </uv-popup> --> 
	</view>
</template>

<script>
export default {
	// 这里存放数据
	data() {
		return {
			siagn_url: "",
		};
	},

	mounted() {},
	// 计算属性
	computed: {},
	// 方法集合
	methods: {
		open() {
			this.$refs.popup.open();
		},
		save() {
			this.$refs.signatureRef.canvasToTempFilePath({
				// 是否为空画板 无签名
				success: (res) => {
					console.log(res.isEmpty);
					// 生成图片的临时路径
					// H5 生成的是base64
					this.siagn_url = res.tempFilePath;
					this.$emit("change", this.siagn_url);
				},
			});
		},
		clear() {
			this.$refs.signatureRef.clear();
		},
		undo() {
			this.$refs.signatureRef.undo();
		},
	},
};
</script>
<style lang="scss">
.sing-content {
	width: 100%;
	height: 500rpx;
}
</style>
