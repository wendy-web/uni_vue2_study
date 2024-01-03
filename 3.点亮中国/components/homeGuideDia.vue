<template>
<van-popup
	:show="show"
	custom-style="background-color: transparent;overflow:auto;"
	:close-on-click-overlay="false"
	:z-index="10000"
>
	<view class="cont_dia">
		<image class="home_guide_bg" src="https://file.y1b.cn/store/1-0/2348/643120c079d6e.png" mode="aspectFill"></image>
		<image class="close" src="/static/images/close.png" mode="aspectFill" @click="popupClose"></image>
		<view class="cont_btn" @click="more">
			开始点亮
		</view>
	</view>
</van-popup>
</template>

<script>
export default {
	data() {
		return {
			show: false
		}
	},
	methods: {
		popupShow() {
			this.show = true
		},
		popupClose() {
			this.show = false
		},
		more() {
			this.popupClose();
		}
	}
}
</script>

<style lang="scss">
.cont_dia {
	position: relative;
	width: 654rpx;
	height: 600rpx;
	z-index:1;
	.home_guide_bg {
		position:absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: -1;
	}
	.cont_btn {
		height: 88rpx;
		line-height: 88rpx;
		background: #f76f2a;
		border-radius: 20rpx;
		font-size: 28rpx;
		font-weight: 500;
		text-align: left;
		color: #ffffff;
		position: absolute;
		bottom: 32rpx;
		left: 32rpx;
		right:32rpx;
		text-align: center;
	}
}
.close {
	width: 56rpx;
	height: 56rpx;
	position: absolute;
	right: 0;
	top: -96rpx;
}

</style>
