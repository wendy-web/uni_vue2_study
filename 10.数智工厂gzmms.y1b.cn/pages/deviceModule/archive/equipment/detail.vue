<template>
	<view class="width-full all-p-tb-30 all-p-lr-20">
		<view class="width-full contentBox position-r all-m-b-30">
			<statusImgVue :status="detailInfo.status"></statusImgVue>
			<view class="width-full all-p-lr-30 all-p-tb-30 display_row_center" style="border-bottom: 2rpx solid #efefef">
				<image class="iconBox" src="/static/otherImg/equipmentImg5.png"></image>
				<text class="all-m-l-10 t-c-000018 f-s-32 t-w-bold">{{ detailInfo.bar_title }}</text>
			</view>
			<view class="width-full all-p-t-20 all-p-lr-30 all-p-b-30 display_column_center f-s-28">
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">设备编码：</text>
					<text class="t-c-272727">{{ detailInfo.asset_no }}</text>
				</view>
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">设备型号：</text>
					<text class="t-c-272727">{{ detailInfo.spec || "--" }}</text>
				</view>
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">使用部门：</text>
					<text class="t-c-272727">{{ detailInfo.use_dept_text || "--" }}</text>
				</view>
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">使用位置：</text>
					<text class="t-c-272727">{{ detailInfo.save_addr_text || "--" }}</text>
				</view>
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">使用负责人：</text>
					<text class="t-c-272727">{{ detailInfo.use_duty_user_text || "--" }}</text>
				</view>
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">责任部门：</text>
					<text class="t-c-272727">{{ detailInfo.duty_dept_text || "--" }}</text>
				</view>
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">资产类型：</text>
					<text class="t-c-272727">{{ detailInfo.eq_type_text }}</text>
				</view>
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">序列号：</text>
					<text class="t-c-272727">{{ detailInfo.sn || "--" }}</text>
				</view>
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">品牌：</text>
					<text class="t-c-272727">{{ detailInfo.brand || "--" }}</text>
				</view>
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">功率(KW)：</text>
					<text class="t-c-272727">{{ detailInfo.power || "--" }}</text>
				</view>
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">国产/进口：</text>
					<text class="t-c-272727">{{ detailInfo.export_type_text || "--" }}</text>
				</view>
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">启用日期：</text>
					<text class="t-c-272727">{{ detailInfo.open_date || "--" }}</text>
				</view>
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">使用年限(月)：</text>
					<text class="t-c-272727">{{ detailInfo.use_year || "--" }}</text>
				</view>
				<view class="width-full display_row_center">
					<text class="t-c-6F6F6F">预计到期：</text>
					<text class="t-c-272727">{{ detailInfo.expire_date || "--" }}</text>
				</view>
			</view>
		</view>
		<view class="width-full feetBox">
			<view class="width-full feetButBox text-align-c t-c-fff f-s-26" @click="getBackTap">返回设备管理</view>
		</view>
	</view>
</template>

<script>
import statusImgVue from "./components/statusImg.vue";
export default {
	components: {
		statusImgVue,
	},
	data() {
		return {
			detailInfo: {
				status: -1,
			},
		};
	},
	// 生命周期 - 监听页面加载
	onLoad(options) {
		const eventChannel = this.getOpenerEventChannel();
		eventChannel.on("detailData", (data) => {
			this.detailInfo = data;
		});
	},
	methods: {
		getBackTap() {
			uni.navigateBack();
		},
	},
};
</script>
<style lang="scss">
page {
	background: #f6f6f6;
	padding-bottom: calc(120rpx +  constant(safe-area-inset-bottom));
    padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

.contentBox {
	background: #ffffff;
	border-radius: 20rpx;
	box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(0, 0, 0, 0.06);

	.statusImg {
		width: 110rpx;
		height: 110rpx;
		right: 0;
		top: 0;
		z-index: 1;
	}

	.iconBox {
		width: 32rpx;
		height: 32rpx;
	}
}

.feetBox {
	position: fixed;
	bottom: 0;
	left: 0;
	padding: 20rpx 40rpx 0;
	background: #fff;
	z-index: 20;
	padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
}

.feetButBox {
	height: 80rpx;
	line-height: 80rpx;
	border-radius: 80rpx;
	background: #038cf8;
}
</style>
