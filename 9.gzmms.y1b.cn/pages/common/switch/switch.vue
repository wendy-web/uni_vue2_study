<template>
	<view class="width-full">
		<uni-nav-bar
			status-bar
			background-color="transparent"
			title=" "
			:border="false"
			fixed
			left-icon="left"
			@clickLeft="back"
		/>
		<image class="width-full position-a backBox" src="../../../static/otherImg/switchImg_0.png"></image>
		<view class="width-full position-r contentBox display_column_center">
			<image class="position-a backImgBox0" src="../../../static/otherImg/switchImg_1.png"></image>
			<image class="position-a backImgBox1" src="../../../static/otherImg/switchImg_5.png"></image>
			<view
				class="width-full contentBut all-m-b-24 b-r-16 all-p-tb-30 all-p-lr-20 display_row_between_center"
				@click="targetPage(0)"
			>
				<image class="contentButImg all-m-r-20" src="../../../static/otherImg/switchImg_3.png"></image>
				<view class="flex_full">
					<view class="t-c-33302D f-s-44 t-w-bold">物料管理系统</view>
					<!-- <view class="t-c-BBBBBB f-s-28 all-m-t-20">没有消息</view> -->
				</view>
				<image class="contentButRightImg" src="../../../static/otherImg/switchImg_4.png"></image>
			</view>
			<view
				class="width-full contentBut all-m-b-24 b-r-16 all-p-tb-30 all-p-lr-20 display_row_between_center"
				@click="targetPage(1)"
			>
				<image class="contentButImg all-m-r-20" src="../../../static/otherImg/switchImg_3.png"></image>
				<view class="flex_full">
					<view class="t-c-33302D f-s-44 t-w-bold">设备管理系统</view>
					<!-- <view class="t-c-BBBBBB f-s-28 all-m-t-20">没有消息</view> -->
				</view>
				<image class="contentButRightImg" src="../../../static/otherImg/switchImg_4.png"></image>
			</view>
			<view
				class="width-full contentBut all-m-b-24 b-r-16 all-p-tb-30 all-p-lr-20 display_row_between_center"
				@click="targetPage(2)"
			>
				<image class="contentButImg all-m-r-20" src="../../../static/otherImg/switchImg_2.png"></image>
				<view class="flex_full">
					<view class="t-c-33302D f-s-44 t-w-bold">安全管理系统</view>
					<!-- <view class="t-c-BBBBBB f-s-28 all-m-t-20">您有待处理消息，快去查看吧</view> -->
				</view>
				<image class="contentButRightImg" src="../../../static/otherImg/switchImg_4.png"></image>
			</view>
			<view class="t-c-33302D f-s-32 t-w-bold all-p-t-10">更多功能···</view>
			<view class="t-c-BBBBBB f-s-28 all-m-t-10">敬请期待</view>
		</view>
		<!-- <view class="width-full feetBox">
			<view class="width-full feetButBox text-align-c t-c-fff f-s-26">退出登录</view>
		</view> -->
	</view>
</template>

<script>
import { mapMutations } from "vuex";
export default {
	// 这里存放数据
	data() {
		return {};
	},

	mounted() {},
	// 计算属性
	computed: {},
	// 方法集合
	methods: {
		...mapMutations({
			SETMODULETYPE: "user/SETMODULETYPE",
		}),
		back() {
			uni.navigateBack();
		},
		targetPage(type) {
			this.SETMODULETYPE(type);
			uni.reLaunch({
				url: "/pages/tabBar/home/index",
			});
		},
	},
};
</script>
<style lang="scss">
page {
	background: #f4f6fa;
}

.backBox {
	height: 634rpx;
	left: 0;
	top: 0;
	z-index: -1;
}

.contentBox {
	padding: 310rpx 30rpx 190px;
	z-index: 5;
}

.backImgBox0 {
	width: 422rpx;
	height: 252rpx;
	top: 18rpx;
	left: 12rpx;
	z-index: 1;
}

.backImgBox1 {
	width: 302rpx;
	height: 266rpx;
	top: 9rpx;
	right: 30rpx;
	z-index: 2;
}

.contentBut {
	background: #fff;
}

.contentButImg {
	width: 220rpx;
	height: 180rpx;
}

.contentButRightImg {
	width: 40rpx;
	height: 40rpx;
}

.feetBox {
	position: fixed;
	bottom: 0;
	left: 0;
	padding: 40rpx 40rpx 50rpx;
	background: #fff;
	z-index: 20;
}

.feetButBox {
	height: 80rpx;
	line-height: 80rpx;
	border-radius: 80rpx;
	background: #038cf8;
}
</style>
