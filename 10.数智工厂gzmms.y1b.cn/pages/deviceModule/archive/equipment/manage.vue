<template>
	<view class="width-full all-p-tb-30 all-p-lr-20">
		<view class="width-full contentBox position-r all-m-b-30">
			<statusImgVue :status="detailInfo.status"></statusImgVue>
			<view class="width-full all-p-lr-30 all-p-tb-30 display_row_center" style="border-bottom: 2rpx solid #efefef">
				<image class="iconBox" src="/static/otherImg/equipmentImg1.png"></image>
				<text class="all-m-l-10 t-c-000018 f-s-32 t-w-bold">{{ detailInfo.bar_title }}</text>
			</view>
			<view class="width-full all-p-t-20 all-p-lr-30 all-p-b-50 display_column_center f-s-28">
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
					<text class="t-c-272727">{{ detailInfo.use_dept_text }}</text>
				</view>
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">使用位置：</text>
					<text class="t-c-272727">{{ detailInfo.save_addr_text }}</text>
				</view>
				<view class="all-p-t-20 t-c-0171FD text-align-c" @click="lookMore">查看更多 ></view>
			</view>
		</view>

		<view class="width-full contentBox all-m-b-30">
			<view class="width-full all-p-lr-30 all-p-t-30 display_row_center">
				<image class="iconBox" src="/static/otherImg/equipmentImg2.png"></image>
				<text class="all-m-l-10 t-c-000018 f-s-32 t-w-bold">操作面板</text>
			</view>
			<view class="width-full all-p-lr-25 all-p-b-40 t-c-4E4D52 f-s-28 menuBox">
				<view
					v-for="(item, index) in menuList"
					:key="index"
					class="width-full display_column_center all-m-t-50"
					@click="targetPage(item.path)"
				>
					<view class="menuImgBox position-r">
						<view v-if="item.num > 0" class="position-a numBox t-c-fff">{{ item.num }}</view>
						<image class="full-100" :src="item.img"></image>
					</view>
					<view class="all-m-t-10">{{ item.name }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import statusImgVue from "./components/statusImg.vue";
export default {
	components: {
		statusImgVue,
	},
	// 这里存放数据
	data() {
		return {
			menuList: [
				{
					name: "设备维修",
					img: "/static/deviceHome/maintain-repair.png",
					path: "/pages/deviceModule/maintain/repair/list",
				},
				{
					name: "保养计划",
					img: "/static/deviceHome/maintain-plan.png",
					path: "/pages/deviceModule/maintain/plan/list",
				},
				{
					name: "保养工单",
					img: "/static/deviceHome/maintain-workOrder.png",
					path: "/pages/deviceModule/maintain/workOrder/list",
				},
				{
					name: "点巡检计划",
					img: "/static/deviceHome/plan.png",
					path: "/pages/deviceModule/inspection/plan/list",
				},
				{
					name: "点巡记录",
					img: "/static/deviceHome/record.png",
					path: "/pages/deviceModule/inspection/record/list",
				},
				// {
				// 	name: "抄表记录",
				// 	img: "/static/otherImg/operateMenu5.png",
				// 	path: "",
				// },
			],
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
	onShow() {},
	// 计算属性
	computed: {},
	// 方法集合
	methods: {
		// async getData() {
		// 	const result = await getEquipmentInfoApi({ id: this.listId });
		// },
		lookMore() {
			uni.navigateTo({
				url: `./detail`,
				success: (res) => {
					// 通过eventChannel向被打开页面传送数据
					res.eventChannel.emit("detailData", this.detailInfo);
				},
			});
		},
		targetPage(url) {
			let { asset_no } = this.detailInfo;
			if (url) {
				uni.navigateTo({
					url: `${url}?asset_no=${asset_no}`,
				});
			}
		},
	},
};
</script>
<style lang="scss">
page {
	background: #f6f6f6;
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

	.menuBox {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;

		.menuImgBox {
			width: 136rpx;
			height: 136rpx;

			.numBox {
				width: 36rpx;
				height: 36rpx;
				right: -10rpx;
				top: -10rpx;
				font-size: 20rpx;
				text-align: center;
				line-height: 36rpx;
				background: #ec3a3a;
				border-radius: 50%;
			}
		}
	}
}
</style>
