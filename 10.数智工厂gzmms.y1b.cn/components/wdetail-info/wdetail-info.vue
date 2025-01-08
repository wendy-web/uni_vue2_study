<template>
	<view class="detail-info">
		<view class="info-top">
			<view class="order-info flex-between">
				<text class="order-num">{{ info[orderKey] }}</text>
				<!-- <text class="order-status">{{ orderStatus }}</text> -->
				<uv-text :type="statusType" :text="statusText" bold size="14" align="right"></uv-text>
			</view>
			<view class="ct-name flex-between">
				<text>{{ info.ct_name }}</text>
				<uv-icon name="clock" :label="info.create_time" size="12" labelSize="12" top="2rpx"></uv-icon>
			</view>
		</view>
		<view class="info-bottom">
			<!-- type:1 采购单 -->
			<template v-if="type == 1">
				<view class="info-bottom-flex">
					<view class="">
						<text class="gary-text">采购数量：</text>
						<text>{{ info.all_num }}</text>
					</view>
					<view class="">
						<text class="gary-text">采购金额：</text>
						<text>{{ info.all_price }}</text>
					</view>
				</view>
			</template>
			<!-- type:2 采购退货单 -->
			<template v-if="type == 2">
				<view class="info-bottom-item">
					<text class="gary-text">采购单号：</text>
					<text>{{ info.procure_no }}</text>
				</view>
			</template>
			<!-- type:4 采购入库单 -->
			<template v-if="type == 4">
				<view class="info-bottom-item">
					<text class="gary-text">采购单号：</text>
					<text>{{ info.procure_no || "无" }}</text>
				</view>
				<view class="info-bottom-flex">
					<view class="">
						<text class="gary-text">入库日期：</text>
						<text>{{ formartDate(info.in_time) }}</text>
					</view>
					<!-- <view class="">
						<text class="gary-text">入库类型：</text>
						<text>{{ info.procure_no ? "采购入库" : "直接入库" }}</text>
					</view> -->
				</view>
			</template>
			<!-- type:6 领料出库单 -->
			<template v-if="type == 6">
				<view class="info-bottom-item">
					<text class="gary-text">申请人：</text>
					<text>{{ info.rp_names }}</text>
				</view>
			</template>
			<!-- type:9 调拨单 -->
			<template v-if="type == 9">
				<view class="info-bottom-item">
					<text class="gary-text">调出仓库：</text>
					<text>{{ info.out_wh_name }}</text>
				</view>
				<view class="info-bottom-item">
					<text class="gary-text">调入仓库：</text>
					<text>{{ info.to_wh_name }}</text>
				</view>
				<view class="info-bottom-flex">
					<view class="">
						<text class="gary-text">调出日期：</text>
						<text>{{ formartDate(info.out_time) }}</text>
					</view>
					<view class="">
						<text class="gary-text">调入日期：</text>
						<text>{{ formartDate(info.in_time) }}</text>
					</view>
				</view>
			</template>
			<!-- type:10 盘点单 -->
			<template v-if="type == 10">
				<view class="info-bottom-item">
					<text class="gary-text">盘点日期：</text>
					<text>{{ formartDate(info.inventory_time) }}</text>
				</view>
			</template>
			<!-- type:11 盘点单 -->
			<template v-if="type == 11">
				<view class="info-bottom-item">
					<text class="gary-text">出库日期：</text>
					<text>{{ formartDate(info.out_time) }}</text>
				</view>
			</template>
			<template v-if="type == 12">
				<view class="info-bottom-flex">
					<view class="">
						<text class="gary-text">入库日期：</text>
						<text>{{ formartDate(info.in_time) }}</text>
					</view>
				</view>
			</template>
			<view class="info-bottom-item">
				<text class="gary-text">单据备注：</text>
				<text>{{ info.note || "无" }}</text>
			</view>
		</view>
	</view>
</template>
<script>
import { keyMap, statusMap } from "./index.js";
import { formartDate as formartDateFn } from "@/utils/validate";
/**
 * 本组件是 详情页头部信息组件
 * @property {Number} type 1:采购单号,2:采购退货单号,3:换货单号,4采购入库单号,5退货出库单号,6领料出库单号,7:退料入库单号,8:拆装单单号,9:调拨单单号,10:盘点单单号,11:报废单单号
 * @property {Object} detailInfo 数据内容
 */
export default {
	name: "wdetail-info",
	props: {
		/* 用于区分单据类型 */
		type: {
			type: [Number, String],
			default: 1,
		},
		detailInfo: {
			type: Object,
			// 对象或数组默认值必须从一个工厂函数获取
			default: function () {
				return {};
			},
		},
	},
	data() {
		return {
			info: {},
		};
	},
	computed: {
		statusText() {
			let status = this.info.status;
			if (this.type == 9 && status == 8) {
				return "待调出确认";
			}
			if (this.type == 9 && status == 9) {
				return "待调入确认";
			}
			if ((this.type === 4 || this.type === 12) && status === 7) {
				return "待入库确认";
			}
			if (this.type == 7 && status == 8) {
				// 退料入库单,状态为8时,显示待退料
				return "待退料";
			}

			return statusMap.get(status);
		},
		//
		statusType() {
			let primaryStatus = [0, 1, 2, 7];
			let warningStatus = [8, 9, 10];
			let errorStatus = [5, 6];
			let status = this.info.status;
			if (primaryStatus.includes(status)) {
				return "primary";
			} else if (warningStatus.includes(status)) {
				return "warning";
			} else if (errorStatus.includes(status)) {
				return "error";
			} else if (status == 3) {
				return "success";
			} else {
				return "info";
			}
		},
		//
		orderType() {
			return parseInt(this.type);
		},
		/* 订单label */
		orderLabel() {
			let label = keyMap.get(parseInt(this.type)).label;

			return label;
		},
		/* 订单key */
		orderKey() {
			let key = keyMap.get(parseInt(this.type)).key;
			console.log("keyMap的key", key);
			return key;
		},
	},
	methods: {
		/** 直接使用 全局方法 编译到小程序报错,故使用此方法转译一次  */
		formartDate(date) {
			return formartDateFn(date);
		},
	},
	watch: {
		detailInfo: {
			// immediate: true, //初始化时让handler调用一下 //handler什么时候调用？当isHot发生改变时。
			handler(newValue, oldValue) {
				console.log("detailInfo被修改了", newValue, oldValue);
				this.info = newValue;
			},
		},
	},
};
</script>
<style lang="scss">
.detail-info {
	background-color: #ffffff;
	margin-bottom: 20rpx;
	padding: 20rpx 30rpx;
	.info-top {
		border-bottom: 1rpx solid #e5e5e5;
		margin-bottom: 18rpx;
		padding-bottom: 18rpx;
		font-size: 28rpx;
		.order-info {
			margin-bottom: 10rpx;
			.order-num {
				font-weight: bold;
			}
			.order-status {
				font-weight: bold;
			}
		}
		.ct-name {
			font-size: 24rpx;
		}
	}
	.info-bottom {
		font-size: 28rpx;
		&-item {
			margin-bottom: 16rpx;
			&:last-child {
				margin-bottom: 0;
			}
		}
		&-flex {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 16rpx;
		}
	}
}
</style>
