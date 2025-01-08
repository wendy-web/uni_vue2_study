<template>
<view class="width-full switch_box">
	<uni-nav-bar
		status-bar
		background-color="transparent"
		title=" "
		:border="false"
		fixed
		left-icon="left"
		@clickLeft="back"
	/>
	<image class="width-full position-a backTopBox" mode="widthFix" src="../../../static/otherImg/bg_top.png"></image>
	<image class="width-full position-a backBottomBox" mode="widthFix" src="../../../static/otherImg/bg_bottom.png"></image>
	<view class="top_title display_row_end f-s-46 t-w-bold">
		<image class="width-full top_title-img" mode="widthFix" src="../../../static/otherImg/title_left.png"></image>
		{{ `华彬数智工厂(${baseName})` }}
	</view>
	<view class="width-full position-r contentBox display_column_center" :style="{'--padding': navHeight + 'px'}">
		<view
			v-for="item in typeList" :key="item.type"
			@click="targetPage(item.type)"
			:class="['list_item width-full all-m-b-40 all-p-tb-60 all-p-l-40',
				(isAuth(item.type) || (item.type == -1)) ? '' : 'active'
			]"
		>
			<image class="list_item-bg" :src="item[getImgSrcKey(item.type)]" mode="'scaleToFill'"></image>
			<view class="f-s-32">{{item.text}}</view>
			<!-- 开发中 -->
			<view class="item_right" v-if="item.type == -1">
				<image class="icon_load" src="/static/otherImg/icon_load.png" mode="'scaleToFill'"></image>
				<view class="loading_text">开发中</view>
			</view>
			<!-- 无权限 -->
			<view class="item_right" v-else-if="!isAuth(item.type)">
				<image class="icon_no" src="/static/otherImg/icon_no.png" mode="'scaleToFill'"></image>
				<view>无权限</view>
			</view>
		</view>
	</view>
	<!-- <view class="width-full feetBox">
		<view class="width-full feetButBox text-align-c t-c-fff f-s-26">退出登录</view>
	</view> -->
</view>
</template>
<script>
import { getViewPort } from "@/utils/index.js";
import { mapMutations } from "vuex";
import { getModuleAuthApi } from "@/api/device/common/index.js";
export default {
	data() {
		return {
			navHeight: 0,
			typeList: [
				{
					type: 0,
					bgImg: '../../../static/otherImg/item01.png',
					bgImgNo: '../../../static/otherImg/item01_no.png',
					bgImgLoad: '../../../static/otherImg/item01_load.png',
					text: '仓储管理WMS',
				},
				{
					type: 1,
					bgImg: '../../../static/otherImg/item02.png',
					bgImgNo: '../../../static/otherImg/item02_no.png',
					bgImgLoad: '../../../static/otherImg/item02_load.png',
					text: '设备管理EMS',
				},
				{
					type: 2,
					bgImg: '../../../static/otherImg/item03.png',
					bgImgNo: '../../../static/otherImg/item03_no.png',
					bgImgLoad: '../../../static/otherImg/item03_Load.png',
					text: '安全管理ANDON',
				},
				// {
				// 	type: 3,
				// 	bgImg: '../../../static/otherImg/item04.png',
				// 	bgImgNo: '../../../static/otherImg/item04_no.png',
				// 	bgImgLoad: '../../../static/otherImg/item04_Load.png',
				// 	text: '生产管理PMC',
				// },
				// {
				// 	type: 4,
				// 	bgImg: '../../../static/otherImg/item05.png',
				// 	bgImgNo: '../../../static/otherImg/item05_no.png',
				// 	bgImgLoad: '../../../static/otherImg/item05_Load.png',
				// 	text: '质量管理QMS',
				// },
				// {
				// 	type: 5,
				// 	bgImg: '../../../static/otherImg/item06.png',
				// 	bgImgNo: '../../../static/otherImg/item06_no.png',
				// 	bgImgLoad: '../../../static/otherImg/item06_Load.png',
				// 	text: '能源管理EMIS',
				// }
			],
			moduleAuthList: [],
			baseName: ''
		};
	},
	onLoad(options) {
		this.initAuth();
	},

	mounted() {
		const res = getViewPort();
		this.navHeight = res.navHeight;
	},
	methods: {
		...mapMutations({
			SETMODULETYPE: "user/SETMODULETYPE",
		}),
		async initAuth() {
			uni.showLoading({
				title: '加载中...',
			});
			const result = await getModuleAuthApi();
			if(result.code != 1 || !result.data) return uni.hideLoading();;
			const { module_ids, base_info } = result.data;
  			this.moduleAuthList = module_ids;
			this.baseName = base_info.base_name.replace(/基地/g, '');
			uni.hideLoading();
		},
		getImgSrcKey(type) {
			if (type == -1) return "bgImgLoad";
			if (this.isAuth(type)) return "bgImg";
			return "bgImgNo";
		},
		isAuth(type){
			return this.moduleAuthList.includes(type);
		},

		back() {
			uni.navigateBack();
		},
		targetPage(type) {
			if(type == -1 || !this.isAuth(type)) return;
			this.SETMODULETYPE(type);
			uni.reLaunch({
				url: "/pages/tabBar/home/index",
			});
		},
	}
};
</script>
<style lang="scss">
page {
	background: #F0F6FF;
}
.switch_box {
	position: relative;
	height: 100vh;
	z-index: 0;
	overflow: hidden;
}
.backTopBox {
	height: 138rpx;
	left: 0;
	top: 0;
	z-index: -1;
}
.backBottomBox {
	height: 112rpx;
	left: 0;
	bottom: 0;
	z-index: -1;
}

.contentBox {
	height: calc(100% - 210rpx - var(--padding));
	overflow: hidden;
	overflow-y: scroll;
	padding: 0 40rpx;
}
.top_title {
	margin: 32rpx 0 60rpx 70rpx;
	&-img {
		width: 118rpx;
		height: 70rpx;
		margin-right: 24rpx;
	}
}
.list_item {
	position: relative;
	z-index: 0;
	color: #38414E;
	&-bg {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: -1;
	}
	&.active {
		color: #848990;
	}
	.item_right {
		font-size: 20rpx;
		color: #484849;
		line-height: 16rpx;
		position: absolute;
		right: 100rpx;
		top: 50%;
		transform: translateY(-50%);
		text-align: center;
		.loading_text {
			position: relative;
			&::after {
				content: ' . . . ';
				position: absolute;
				width: 100%;
				top: 100%;
				left: 0;
			}

		}
	}
	.icon_no {
		width: 56rpx;
		height: 68rpx;
		margin-bottom: 10rpx;
	}
	.icon_load {
		width: 60rpx;
		height: 70rpx;
		margin-bottom: 10rpx;
	}
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
