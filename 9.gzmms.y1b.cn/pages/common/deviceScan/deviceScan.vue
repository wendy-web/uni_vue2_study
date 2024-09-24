<template>
	<view class="width-full all-p-tb-30 all-p-lr-20">
		<view v-for="(item, index) in 1" :key="index" class="width-full contentBox position-r all-m-b-30">
			<image class="statusImg position-a" src="/static/otherImg/equipmentImg0.png"></image>
			<view class="width-full all-p-lr-30 all-p-tb-30 display_row_center" style="border-bottom: 2rpx solid #efefef">
				<image class="iconBox" src="/static/otherImg/equipmentImg1.png"></image>
				<text class="all-m-l-10 t-c-000018 f-s-32 t-w-bold">{{ scanInfo.bar_title }}</text>
			</view>
			<view class="width-full all-p-t-20 all-p-lr-30 all-p-b-50 display_column_center f-s-28">
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">设备编码：</text>
					<text class="t-c-272727">{{ scanInfo.asset_no }}</text>
				</view>
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">设备型号：</text>
					<text class="t-c-272727">{{ scanInfo.spec || "--" }}</text>
				</view>
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">使用部门：</text>
					<text class="t-c-272727">{{ scanInfo.use_dept_text }}</text>
				</view>
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">使用位置：</text>
					<text class="t-c-272727">{{ scanInfo.save_addr_text }}</text>
				</view>
				<view class="all-p-t-20 t-c-0171FD text-align-c" @click="lookMore">查看更多 ></view>
			</view>
		</view>

		<view class="width-full contentBox all-m-b-30" v-if="moduleType == 1 || moduleType == 2">
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
/* 此页面是设备扫码(标签)进入的页面 */
import { parseQuery } from "@/utils/index.js";
// import { getLabelInfoXcxApi } from "@/api/modules/common.js";
import { getEquipmentScanApi } from "@/api/device/common/index.js";
import { mapMutations } from "vuex";
export default {
	// 这里存放数据
	data() {
		return {
			menuList: [
				// {
				// 	name: '设备维修',
				// 	img: '/static/otherImg/operateMenu0.png',
				// 	num: 1,
				// 	path: './deviceList'
				// },
				// {
				// 	name: '保养计划',
				// 	img: '/static/otherImg/operateMenu1.png',
				// 	num: 99,
				// 	path: ''
				// },
				// {
				// 	name: '保养任务',
				// 	img: '/static/otherImg/operateMenu2.png',
				// 	path: ''
				// },
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
				// 	name: '抄表记录',
				// 	img: '/static/otherImg/operateMenu5.png',
				// 	path: ''
				// },
			],
			scanInfo: {},
			moduleType: 0,
		};
	},
	// 生命周期 - 监听页面加载
	onLoad(options) {
		console.log("options", options);
		if (options.q) {
			const q = decodeURIComponent(options.q); // 获取到二维码原始链接内容
			console.log("q", q);
			let ewmQuery = parseQuery(q);
			console.log("ewmQuery", ewmQuery);
			this.content = ewmQuery.c;
			this.getData();
		}
	},
	// 计算属性
	computed: {},
	// 方法集合
	methods: {
		...mapMutations({
			SETMODULETYPE: "user/SETMODULETYPE",
		}),
		async getData() {
			const result = await getEquipmentScanApi({ content: this.content });
			this.loading = false;
			this.scanInfo = result.data;
			this.moduleType = result.data?.module_type || 0;
			console.log("this.moduleType",this.moduleType);
			this.SETMODULETYPE(this.moduleType);
		},
		lookMore() {
			// this.SETMODULETYPE(this.moduleType);
			uni.navigateTo({
				url: "/pages/deviceModule/archive/equipment/detail",
				success: (res) => {
					// 通过eventChannel向被打开页面传送数据
					res.eventChannel.emit("detailData", this.scanInfo);
				},
			});
		},
		targetPage(url) {
			this.SETMODULETYPE(this.moduleType);
			let { asset_no } = this.scanInfo;
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
