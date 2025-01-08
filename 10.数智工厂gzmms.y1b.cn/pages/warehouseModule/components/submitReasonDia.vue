<template>
<uv-popup ref="popup" mode="center" round="8" :safeAreaInsetBottom="false">
	<view class="width-full all-p-t-30 all-p-b-30 all-p-l-20 display_row_center text-align-c">
		<uv-icon name="info-circle-fill" color="#6086fc" size="20"></uv-icon>
		<text class="all-p-l-10 t-w-bold">请输入驳回原因</text>
	</view>
	<view class="all-p-lr-30 dia_cont">
		<uv-textarea v-model="formData.reason" placeholder="请输入内容"></uv-textarea>
		<view class="content_row all-p-b-30 all-p-t-20">
			<view class="all-m-r-30 footer-btn" @click="close" >
				<uv-button text="取消" shape="circle"></uv-button>
			</view>
			<view class="footer-btn" @click="onSubmit">
				<uv-button text="确认" shape="circle"  color="#6086fc" type="primary"></uv-button>
			</view>
		</view>
	</view>
</uv-popup>
</template>

<script>
export default {
	props: {
	},
	data() {
		return {
			formData: {
				id: 0,
				reason: ''
			}
		};
	},
	methods: {
		close() {
			this.$refs.popup.close();
		},
		async open(item) {
			const { id } = item;
			this.formData = {
				id,
				reason: ''
			}
			this.$refs.popup.open();
		},
		onSubmit() {
			if (!this.formData.reason.trim()) {
				uni.showToast({
					icon: "none",
					title: "请输入驳回原因",
				});
				return false;
			}
			this.$emit('submit', this.formData);
		}
	}
};
</script>
<style lang="scss">
.dia_cont {
	width: 600rpx;
}
.footer-btn {
	width: 180rpx;
}
</style>
