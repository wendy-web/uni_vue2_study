<template>
	<view class="flow-wrapper">
		<view class="flow-title">
			<uv-icon name="calendar" label="流程" color="#688bf2" size="28" label-size="18"></uv-icon>
		</view>
		<view class="flow-list">
			<!-- 发起人 -->
			<view class="flow-item">
				<uv-icon
					name="checkmark-circle-fill"
					label="发起人"
					size="20"
					color="#3c9cff"
					label-color="#000"
					space="10"
					v-if="!checkOrderStatus"
				></uv-icon>
				<uv-icon
					name="more-circle-fill"
					color="#c4c4c4"
					label="发起人"
					size="20"
					label-color="#000"
					space="10"
					v-else
				></uv-icon>
				<view class="flow-item-info">
					<text class="item-name">制单人</text>
				</view>
				<text class="line" :class="!checkOrderStatus ? 'success' : ''"></text>
			</view>
			<!-- 设置了审批人 -->
			<template v-if="approverList.length > 0">
				<view class="flow-item" v-for="(item, index) in approverList" :key="item.id">
					<uv-icon
						:name="dynamicIcon(item.approver_status)"
						:color="dynamicIconColor(item.approver_status)"
						label="审批人"
						size="20"
						label-color="#000"
						space="10"
					></uv-icon>
					<view class="flow-item-info">
						<text class="item-name">{{ item.name }}</text>
						<text class="item-dept">{{ item.dept_name }}</text>
					</view>
					<text class="line" :class="item.approver_status ? 'success' : ''"></text>
				</view>
			</template>
			<!-- 未设置审批人 -->
			<template v-else>
				<view class="flow-item">
					<uv-icon
						name="checkmark-circle-fill"
						label="审批人"
						color="#3c9cff"
						size="20"
						label-color="#000"
						space="10"
						v-if="checkApproveStatus"
					></uv-icon>
					<uv-icon
						name="more-circle-fill"
						color="#c4c4c4"
						label="审批人"
						size="20"
						label-color="#000"
						space="10"
						v-else
					></uv-icon>
					<view class="flow-item-info">
						<text class="item-name">未设置,自动跳过</text>
					</view>
					<text class="line" :class="checkApproveStatus ? 'success' : ''"></text>
				</view>
			</template>

			<!-- 仓库确认人 -->
			<view class="flow-item">
				<uv-icon
					:name="dynamicIcon(warehouse_status)"
					:color="dynamicIconColor(warehouse_status)"
					label="入库确认人"
					size="20"
					label-color="#000"
					space="10"
				></uv-icon>
				<view class="flow-item-info" v-for="(item, index) in inWarehouseList" :key="item.id">
					<text class="item-wh">{{ item.warehouse_name }}：</text>
					<text class="item-name">{{ item.name }}</text>
					<text class="item-dept">{{ item.dept_name }}</text>
				</view>
				<text class="line" :class="{ success: warehouse_status == 1, warning: warehouse_status == 2 }"></text>
			</view>

			<!-- 抄送人 -->
			<view class="flow-item">
				<uv-icon
					:name="dynamicIcon(copy_status)"
					:color="dynamicIconColor(copy_status)"
					label="抄送人"
					size="20"
					label-color="#000"
					space="10"
				></uv-icon>
				<template v-if="copyList.length > 0">
					<view class="flow-item-info" v-for="(item, index) in copyList" :key="item.id">
						<text class="item-name">{{ item.name }}</text>
						<text class="item-dept">{{ item.dept_name }}</text>
					</view>
				</template>
				<template v-else>
					<view class="flow-item-info">
						<text class="item-name">未设置自动跳过</text>
					</view>
				</template>
				<text class="line" :class="copy_status ? 'success' : ''"></text>
			</view>
			<!-- 结束 -->
			<view class="flow-item last-item">
				<uv-icon
					name="checkmark-circle-fill"
					color="#3c9cff"
					label="结束"
					size="20"
					label-color="#000"
					space="10"
					v-if="status == 3"
				></uv-icon>
				<uv-icon
					name="more-circle-fill"
					color="#c4c4c4"
					label="结束"
					size="20"
					label-color="#000"
					space="10"
					v-else
				></uv-icon>
			</view>
		</view>
	</view>
</template>

<script>
import { flowDetailApi } from "@/api/modules/common.js";
/**
 * 本组件是 流程详情组件,使用的页面有 采购入库单详情页,其他入库单详情页
 * @property {Number} order_type: 1调拨单 2采购入库单 3其他入库单
 * @property {Number} order_id 单据id
 * @property {Number} status 单据状态
 */
export default {
	props: {
		/** 入库仓库id */
		whId: {
			type: Number,
		},
		order_type: {
			type: Number,
			require: true,
			default: 0,
		},
		order_id: {
			type: Number,
			require: true,
			default: 0,
		},
		status: {
			type: Number,
			require: true,
			default: 0,
		},
	},
	// 这里存放数据
	data() {
		return {
			/** 记录审批人数据 */
			approverList: [],
			/** 记录抄送人数据 */
			copyList: [],
			/** 记录仓库确认人数据 */
			warehouseList: [],
			/** 仓库确认状态 0：未处理（灰色）、1：已审批或已确认（蓝色）2：进行中（橙色） */
			warehouse_status: 0,
			/** 抄送人状态 0：未处理（灰色）、1：已审批或已确认（蓝色）2：进行中（橙色） */
			copy_status: 0,
		};
	},
	mounted() {
		if (this.order_id) {
			this.getData();
		}
	},
	methods: {
		async getData() {
			let id = this.order_id;
			let type = this.order_type;
			const result = await flowDetailApi({ id, type });
			this.approverList = result.data.approver;
			this.copyList = result.data.copy;
			this.warehouseList = result.data.warehouse;
			//状态
			this.warehouse_status = result.data.warehouse_status;
			this.copy_status = result.data.copy_status;
		},
	},
	computed: {
		/** 入库仓库确认人 */
		inWarehouseList (){
		  console.log("props.toWhId", this.whId);
		  return this.warehouseList.filter((item) => {
		    return item.warehouse_id.includes(this.whId);
		  });
		},
		dynamicIconColor() {
			return (status) => {
				if (status == 1) {
					return "#3c9cff";
				} else if (status == 2) {
					return "#f9ae3d";
				} else {
					return "#c4c4c4";
				}
			};
		},
		dynamicIcon() {
			return (status) => {
				if (status == 1) {
					return "checkmark-circle-fill";
				} else if (status == 2) {
					return "clock-fill";
				} else {
					return "more-circle-fill";
				}
			};
		},
		checkOrderStatus() {
			let statusList = [0, 4, 6];
			let status = Number(this.status);
			return statusList.includes(status) ? true : false;
		},
		/** 检测审批人是否设置和status是否是待提审状态 */
		checkApproveStatus() {
			// let status = this.status != 0;
			let len = this.approverList.length;
			let status = !this.checkOrderStatus;
			return len === 0 && status ? true : false;
		},

		/* 动态返回的 结束的描述 */
		dynamicOverDesc() {
			return this.is_force_receive == 1 ? "完结结束" : "领料已完成";
		},
	},
};
</script>
<style lang="scss">
.flow-wrapper {
	padding: 40rpx;
	background-color: #ffffff;
	border-top-left-radius: 20rpx;
	border-top-right-radius: 20rpx;
	/* 流程标题 */
	.flow-title {
		margin-bottom: 40rpx;
	}
	/* 流程列表 */
	.flow-list {
		display: flex;
		flex-direction: column;
		/* 流程分组 */
		.flow-item {
			position: relative;
			min-height: 140rpx;
			// margin-bottom: 20rpx;
			padding-bottom: 20rpx;
			/* 线条 */
			.line {
				display: block;
				width: 2rpx;
				min-height: 140rpx;
				height: 90%;
				background-color: #c4c4c4;
				position: absolute;
				left: 20rpx;
				top: 40rpx;
				/* 成功的颜色 */
				&.success {
					background-color: #3a91ff;
				}
				&.warning {
					background-color: #f9ae3d;
				}
			}
			&-info {
				padding-left: 60rpx;
				/* 名称 */
				.item-name {
					font-size: 28rpx;
					color: #606266;
				}
				/* 部门 */
				.item-dept {
					color: #3a91ff;
					font-size: 24rpx;
					display: inline-block;
					padding: 4rpx 8rpx;
					background-color: #c9e1ff66;
					margin-left: 8rpx;
					border-radius: 4rpx;
				}
				/* 仓库 */
				.item-wh {
					font-size: 28rpx;
				}
			}

			/* 最后分组的样式 */
			&.last-item {
				min-height: 60rpx;
				height: 60rpx !important;
				margin-bottom: 0;
			}
		}
	}
}
</style>
