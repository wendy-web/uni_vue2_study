<template>
	<view class="detail-info">
		<view class="flex-between">
			<view class="info-item">
				<text class="left-text">{{ orderLabel }}：</text>
				<text>{{ info[orderKey] }}</text>
			</view>
			<view class="info-status">
				<uv-text type="primary" text="待提审" bold size="14" v-if="info.status == 0"></uv-text>
				<template v-else-if="info.status == 1">
					<uv-text type="primary" text="已审核" bold size="14" v-if="info.assoc_type == 3"></uv-text>
					<uv-text type="primary" text="待审核" bold size="14" v-else></uv-text>
				</template>
				<uv-text type="primary" text="待入库" bold size="14" v-else-if="info.status == 2"></uv-text>
				<uv-text type="success" text="已完成" bold size="14" v-else-if="info.status == 3"></uv-text>
				<uv-text type="info" text="已撤回" bold size="14" v-else-if="info.status == 4"></uv-text>
				<uv-text type="error" text="已驳回" bold size="14" v-else-if="info.status == 5"></uv-text>
				<uv-text type="error" text="已作废" bold size="14" v-else-if="info.status == 6"></uv-text>
				<uv-text type="warning" text="待领料" bold size="14" v-else-if="info.status == 8"></uv-text>
			</view>
		</view>

		<view class="info-item">
			<text class="left-text">创建时间：</text>
			<text>{{ info.create_time }}</text>
		</view>
		<template v-if="orderType === 6">
			<!-- 领料出库单 专属内容 -->
			<view class="info-item">
				<text class="left-text">出库日期:：</text>
				<text>{{ info.out_time }}</text>
			</view>
		</template>
		<template v-if="orderType === 10">
			<!-- 盘点单 专有内容 -->
			<view class="info-item">
				<text class="left-text">盘点日期:：</text>
				<text>2023-09-06</text>
			</view>
			<view class="info-item">
				<text class="left-text">盘点仓库:：</text>
				<text>2023-09-06</text>
			</view>
		</template>

		<view class="info-item">
			<text class="left-text">单据备注：</text>
			<text>{{ info.note || "无" }}</text>
		</view>
		<template v-if="orderType === 6">
			<view class="info-item flex">
				<text class="left-text">领料申请人</text>
				<view class="right-list">
					<view class="right-list-item">{{ info.rp_names }}</view>
				</view>
			</view>
			<view class="info-item flex">
				<text class="left-text">指定领取人</text>
				<view class="right-list">
					<view class="right-list-item">{{ info.ar_names }}</view>
					<!-- 			<view class="right-list-item">大白(采购部)</view>
					<view class="right-list-item">白白(采购部)</view> -->
				</view>
			</view>
		</template>
	</view>
</template>

<script>
/* 本组件是 详情页头部信息组件 */
import { keyMap } from "./index.js";
/**
 * 子组件
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
		/* 订单类型统一转为数字类型 */
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
			return key;
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
	border-radius: 20rpx;
	padding: 34rpx 40rpx;
	// padding-bottom: 14rpx;
	.info-status{
		margin-bottom: 30rpx;
	}
	/* 每组item的样式 */
	.info-item {
		margin-bottom: 30rpx;

		&.flex {
			display: flex;
			margin-bottom: 10rpx;
		}

		&:last-child {
			margin-bottom: 0;
		}

		/* 左侧label的样式 */
		.left-text {
			font-size: 32rpx;
			color: #6f6f6f;
			flex-shrink: 0;
		}

		/* 右侧蓝色块列表样式 */
		.right-list {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			margin-left: 20rpx;

			/* 右侧蓝色块分组样式 */
			.right-list-item {
				height: 48rpx;
				padding: 0 20rpx;
				background-color: #ecf0ff;
				color: #2b5afc;
				line-height: 48rpx;
				font-size: 28rpx;
				border-color: #2b5afc;
				border-radius: 24rpx;
				margin-right: 30rpx;
				margin-bottom: 20rpx;

				&:nth-child(2n) {
					margin-right: 0;
				}
			}
		}
	}
}
</style>
