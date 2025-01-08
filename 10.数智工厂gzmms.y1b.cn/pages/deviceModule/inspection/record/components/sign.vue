<template>
	<view  class="width-full contentBox position-r all-m-b-30">
		<view class="width-full all-p-lr-30 all-p-t-30 display_row_center">
			<image class="iconBox" src="/static/otherImg/planFarmTitleIcon3.png"></image>
			<text class="title-label all-m-l-10 t-c-000018 t-w-bold f-s-32">签名</text>
			<text class="red-text" v-if="is_must_sig">*</text>
		</view>
		<view class="width-full all-p-lr-40 all-m-t-30 all-p-b-30">
			<uv-button type="primary" text="点此签名" @click="tapSignature" :disabled="disabled" v-if="!disabled"></uv-button>
			<div class="sign-img-box">
				<image :src="imgUrl" mode="" class="sign-img" v-if="imgUrl"></image>
			</div>
		</view>
		<jp-signature-popup ref="signatureRef" popup v-model="imgUrl" @change="changeSign" beforeDelay="300" />
	</view>
</template>

<script>
import { uploadFilePromise } from "@/utils/device.js";
export default {
	props: {
		is_must_sig: {
			type: Number,
			default: 1,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	// 这里存放数据
	data() {
		return {
			imgUrl: "", //临时图片地址
			singImg: "", //通过接口上传后拿到的签名图片
		};
	},

	mounted() {},
	// 计算属性
	computed: {},
	// 方法集合
	methods: {
		validateForm() {
			if (this.is_must_sig && !this.singImg) {
				uni.showToast({
					icon: "none",
					title: "请您签字",
				});
				return false;
			}
			return true;
		},
		// 点击签字触发
		tapSignature() {
			this.$refs.signatureRef.toPop();
		},
		// 签字内容变化时触发
		async changeSign(e) {
			let url = e;
			if (!url) return;
			this.singImg = await uploadFilePromise(url);
			console.log("this.sign", this.singImg);
		},
	},
};
</script>
<style lang="scss">
.sign-img-box {
	width: 80%;
	margin-top: 20rpx;
	.sign-img {
		width: 100%;
		height: 176rpx;
	}
}
</style>
