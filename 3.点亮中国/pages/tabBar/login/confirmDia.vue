<template>
<van-popup
	:show="isShow"
	custom-style="overflow: visible;background: transparent;"
	round
	:z-index="100"
	:safe-area-inset-bottom="false"
	:catchtouchmove="true"
	@close="onClose"
>
	<view class="cont_box">
		<image class="close" src="/static/images/close.png" mode="aspectFill" @click="onClose"></image>
		<view class="cont_text">
			<view class="cont_lab">上次登录账号</view>
			<van-image
				class="login_ava"
				width="120rpx"
				height="120rpx"
				radius="50%"
				fit="cover"
				:src="userInfo.oldAvaUrl" lazy-load use-loading-slot>
				<van-loading slot="loading" type="spinner" size="20" vertical />
			</van-image>
			<view class="login_name txt_ov_ell1">{{userInfo.oldNickName}}</view>
		</view>
		<view class="btn_box" @click="onConfirm">登录</view>
	</view>
</van-popup>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	computed: {
		...mapGetters(['userInfo', 'isAuthorization', 'isAutoLogin'])
	},
	props: {
		isShow: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return { }
	},
	methods: {
		onClose() {
			this.$emit("close");
		},
		onConfirm() {
			this.$emit("confirm");
		}
	}
}
</script>
<style scoped lang="scss">
.cont_box {
	width: 582rpx;
	background: #fff;
	border-radius: 24rpx;
	position: relative;
	padding: 40rpx;
	box-sizing: border-box;
	.close{
		width: 52rpx;
		height: 52rpx;
		position: absolute;
		top: -80rpx;
		right: -26rpx;
	}
}
.cont_text{
	font-size: 30rpx;
	color: #333;
	text-align: center;
	.cont_lab{
		color: #666;
	}
}
.login_ava{
	margin: 76rpx auto 10rpx;
	display: block;
}
.login_name{
	width: 100%;
}
.btn_box {
	width: 356rpx;
	height: 80rpx;
	line-height: 80rpx;
	background: #F84842;
	border-radius: 40rpx;
	font-size: 28rpx;
	font-weight: 600;
	text-align: center;
	color: #fff;
	margin: 76rpx auto 0;
}
</style>