<template>
	<van-popup :show="isShow" round position="center" custom-style="width: 90%;padding:50rpx 35rpx">
		<view class="protocol-confirm">
			<text><text style="color: #e71919;">同意授权使用您的"微信和昵称"可以带来更加友好的体验</text>，点击不同意将为您随机创建昵称或头像</text>
		</view>
		<view class="protocol-confirm-tools">
			<van-button round type="default" block style="width: 280rpx;" @click="handler(true)">不同意</van-button>
			<van-button round type="primary" block style="width: 280rpx;"
				color="linear-gradient(180deg,#e71919 26%, #a31015 100%);" @click="handler(false)"
				open-type="chooseAvatar" @chooseavatar="chooseavatar">去授权</van-button>
		</view>
	</van-popup>
</template>

<script>
	export default {
		data() {
			return {
				isShow: false
			};
		},
		methods: {
			show() {
				this.isShow = true
			},
			handler(flag) {
				this.isShow = false
				this.$emit('handler', flag)
			}
		}
	}
</script>

<style lang="less">
	.protocol-confirm {
		font-size: 28rpx;

	}

	.protocol-confirm-tools {
		display: flex;
		justify-content: space-between;
		padding: 40rpx 10rpx 0;
	}
</style>