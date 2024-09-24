<template>
	<view class="list-item">
		<view class="header">
			<view class="top">
				<view class="order-num">
					<image src="https://file.y1b.cn/public/erpxcx_img/common/order_icon@2x.png" class="order-num-img"></image>
					<text class="order-num-text">{{ info[orderNo] }}</text>
				</view>
				<view class="order-status" @click="tapStatus">
					<uv-text type="primary" text="待提审" bold size="14" v-if="info.status == 0"></uv-text>
					<template v-else-if="info.status == 1">
						<!-- <uv-text type="primary" text="已审核" bold size="14" v-if="info.assoc_type == 3"></uv-text> -->
						<uv-text type="primary" text="已审核" bold size="14" v-if="checkAssocTypeFn(3)"></uv-text>
						<uv-text type="primary" text="待审核" bold size="14" v-else></uv-text>
					</template>
					<uv-text type="primary" text="待入库" bold size="14" v-else-if="info.status == 2"></uv-text>
					<uv-text type="success" text="已完成" bold size="14" v-else-if="info.status == 3"></uv-text>
					<uv-text type="info" text="已撤回" bold size="14" v-else-if="info.status == 4"></uv-text>
					<uv-text type="error" text="已驳回" bold size="14" v-else-if="info.status == 5"></uv-text>
					<uv-text type="error" text="已作废" bold size="14" v-else-if="info.status == 6"></uv-text>
					<template v-else-if="info.status == 7">
						<uv-text type="primary" text="待入库确认" bold size="14" v-if="type === 4 || type === 12"></uv-text>
					</template>

					<uv-text
						type="warning"
						:text="type == 9 ? '待调出确认' : '待领料'"
						bold
						size="14"
						v-else-if="info.status == 8"
					></uv-text>
					<uv-text
						type="warning"
						:text="type == 9 ? '待调入确认' : ''"
						bold
						size="14"
						v-else-if="info.status == 9"
					></uv-text>
					<uv-text type="warning" text="待确认" bold size="14" v-else-if="info.status == 10"></uv-text>
				</view>
			</view>
			<view class="bottom">
				<text>{{ info.ct_name || info.create_name }}</text>
				<text>{{ info.create_time }}</text>
			</view>
		</view>
		<view class="info" @click="toDetail">
			<view class="info-item" v-if="!noProcureNo">
				<!-- 采购单号 type:为6,7,9,10,11不显示 -->
				<view class="info-item-left">采购单号：</view>
				<text>{{ info.procure_no || "无" }}</text>
			</view>
			<view class="info-item" v-if="!noGoodsName">
				<!-- 商品明细 采购单 采购退货单都显示 -->
				<view class="info-item-left">商品明细：</view>
				<text class="goods-name">{{ info.product_name }}</text>
			</view>

			<template v-if="type === 1">
				<!-- type1,采购单专属显示内容 -->
				<view class="flex-between">
					<view class="info-item">
						<view class="info-item-left">采购数量：</view>
						<text>{{ info.all_num }}</text>
					</view>
					<view class="info-item">
						<view class="info-item-left">待入数量：</view>
						<text>{{ info.total_rem_num }}</text>
					</view>
				</view>
				<view class="flex-between">
					<view class="info-item">
						<view class="info-item-left">入库数量：</view>
						<text>{{ info.total_rec_num }}</text>
					</view>
					<view class="info-item">
						<view class="info-item-left">退货数量：</view>
						<text>{{ info.total_ret_num }}</text>
					</view>
				</view>
				<view class="flex-between">
					<view class="info-item">
						<view class="info-item-left">采购类型：</view>
						<text>{{ info.type == 1 ? "普通采购" : "退换补货" }}</text>
					</view>
					<view class="info-item">
						<view class="info-item-left">采购金额：</view>
						<text>{{ info.all_price }}</text>
					</view>
				</view>
			</template>

			<template v-else-if="type === 2">
				<!-- type2, 采购退货单专属显示内容 -->
				<view class="info-item">
					<view class="info-item-left">退货日期：</view>
					<text>{{ formartDate(info.return_time) }}</text>
				</view>
			</template>

			<template v-else-if="type === 3">
				<!-- type3, 换货单专属显示内容 -->
				<view class="info-item">
					<view class="info-item-left">退回商品明细：</view>
					<text class="goods-name">{{ info.return_goods_detail }}</text>
				</view>
				<view class="info-item">
					<view class="info-item-left">换货商品明细：</view>
					<text class="goods-name">{{ info.replacement_goods_detail }}</text>
				</view>
				<view class="info-item">
					<view class="info-item-left">换货日期：</view>
					<text>{{ formartDate(info.replacement_data) }}</text>
				</view>
			</template>
			<template v-else-if="type === 4 || type === 12">
				<!-- type4, 采购入库单专属显示内容 -->
				<!-- 		<view class="flex-between">
					<view class="info-item">
						<view class="info-item-left">入库类型：</view>
						<text>{{ info.procure_no ? "采购入库" : "直接入库" }}</text>
					</view>
					<view class="info-item">
						<view class="info-item-left">入库数量：</view>
						<text>{{ info.all_num }}</text>
					</view>
				</view> -->
				<view class="info-item">
					<view class="info-item-left">入库数量：</view>
					<text>{{ info.all_num }}</text>
				</view>
				<view class="info-item">
					<view class="info-item-left">入库日期：</view>
					<text>{{ formartDate(info.in_time) }}</text>
				</view>
			</template>
			<template v-else-if="type === 5">
				<!-- type5,退货出库单专属显示内容 -->
				<view class="info-item">
					<view class="info-item-left">退货日期：</view>
					<text>{{ formartDate(info.return_time) }}</text>
				</view>
				<view class="info-item">
					<view class="info-item-left">出库日期：</view>
					<text>{{ formartDate(info.out_time) }}</text>
				</view>
			</template>

			<template v-else-if="type === 6">
				<!-- type6,领料单专属显示内容 -->
				<view class="info-item">
					<view class="info-item-left">申请人：</view>
					<text>{{ info.rp_names }}</text>
				</view>
				<view class="info-item">
					<view class="info-item-left">领取人：</view>
					<text>{{ info.ar_names }}</text>
				</view>
				<view class="info-item">
					<view class="info-item-left">出库日期：</view>
					<text>{{ formartDate(info.out_time) }}</text>
				</view>
			</template>
			<template v-else-if="type === 7">
				<!-- type: 7退料入库单-->
				<view class="info-item">
					<view class="info-item-left">领料出库单号：</view>
					<text>{{ info.wh_rec_no }}</text>
				</view>
				<view class="info-item">
					<view class="info-item-left">入库日期：</view>
					<text>{{ formartDate(info.in_time) }}</text>
				</view>
			</template>
			<template v-else-if="type === 8">
				<!-- type: 8拆装单-->
				<view class="info-item">
					<view class="info-item-left">拆前商品明细：</view>
					<text class="goods-name">{{ info.before_goods_detail }}</text>
				</view>
				<view class="info-item">
					<view class="info-item-left">拆后商品明细：</view>
					<text class="goods-name">{{ info.after_goods_detail }}</text>
				</view>
				<view class="flex-between">
					<view class="info-item">
						<view class="info-item-left">拆前数量：</view>
						<text>{{ info.before_num }}</text>
					</view>
					<view class="info-item">
						<view class="info-item-left">拆后数量：</view>
						<text>{{ info.after_num }}</text>
					</view>
				</view>
				<view class="info-item">
					<view class="info-item-left">拆装仓库：</view>
					<text>{{ info.warehouse.name }}</text>
				</view>
				<view class="info-item">
					<view class="info-item-left">拆装日期：</view>
					<text>{{ formartDate(info.split_assemble_time) }}</text>
				</view>
			</template>

			<template v-else-if="type === 9">
				<!-- type: 9调拨单 -->
				<view class="info-item">
					<view class="info-item-left">调出仓库：</view>
					<text>{{ info.out_wh_name }}</text>
				</view>
				<view class="info-item">
					<view class="info-item-left">调出时间：</view>
					<text>{{ info.out_time }}</text>
				</view>
				<view class="info-item">
					<view class="info-item-left">调入仓库：</view>
					<text>{{ info.to_wh_name }}</text>
				</view>
				<view class="info-item">
					<view class="info-item-left">调入时间：</view>
					<text>{{ info.in_time }}</text>
				</view>
			</template>
			<template v-else-if="type === 10">
				<!-- type10,盘点单专属显示内容 -->
				<view class="info-item">
					<view class="info-item-left">盘点仓库：</view>
					<text>{{ info.warehouse_name }}</text>
				</view>
				<view class="info-item">
					<view class="info-item-left">盘点日期：</view>
					<text>{{ formartDate(info.inventory_time) }}</text>
				</view>
				<view class="info-item">
					<view class="info-item-left">是否更新库存：</view>
					<text>{{ info.up_inv == 1 ? "是" : "否" }}</text>
				</view>
				<view class="info-item">
					<view class="info-item-left">盈/亏总数量：</view>
					<text :class="[info.surplus_num > 0 ? 'green-text' : '']">{{ info.surplus_num }}</text>
					<text>/</text>
					<text :class="[ifno.shortage_num < 0 ? 'red-text' : '']">{{ info.shortage_num }}</text>
				</view>
			</template>
			<template v-else-if="type === 11">
				<!-- type11,报废单专属显示内容 -->
				<view class="info-item">
					<view class="info-item-left">出库日期：</view>
					<text>{{ formartDate(info.out_time) }}</text>
				</view>
			</template>
			<view class="info-item">
				<view class="info-item-left">单据备注：</view>
				<text>{{ info.note || "无" }}</text>
			</view>
		</view>

		<!-- 		<view class="reject-wrapper">
				<view class="info-item-left">驳回原因：</text>
				<text>原因原因原因原因原因</text>
			</view> -->
		<view class="footer">
			<slot name="operation">
				<!-- 当前为创建人 -->
				<!-- <template v-if="info.assoc_type == 1"> -->
				<template v-if="checkAssocTypeFn(1)">
					<!-- 待提审,已撤回,已驳回状态时 -->
					<template v-if="info.status == 0 || info.status == 4 || info.status == 5">
						<view class="footer-btn" v-if="checkBtn(editSign)">
							<uv-button text="编辑" shape="circle" color="#6086fc" plain :customStyle="footerBtn" @click="handleEdit"></uv-button>
						</view>
						<view class="footer-btn" v-if="checkBtn(voidSign)">
							<uv-button text="作废" shape="circle" :customStyle="footerBtn" @click="handleVoid"></uv-button>
						</view>
						<view class="footer-btn mr-0" v-if="checkBtn(submitSign)">
							<uv-button
								text="提审"
								shape="circle"
								color="#6086fc"
								:customStyle="footerBtn"
								@click="submitAudit"
							></uv-button>
						</view>
					</template>
					<!-- 待审核状态时 -->
					<template v-else-if="info.status == 1">
						<view class="footer-btn" v-if="checkBtn(recallSign)">
							<uv-button text="撤回" shape="circle" :customStyle="footerBtn" @click="cellRecall"></uv-button>
						</view>
					</template>
				</template>
				<!-- 当前为审核人的时候 -->
				<!-- <template v-if="info.assoc_type == 2"> -->
				<template v-if="checkAssocTypeFn(2)">
					<!-- 待审核状态时 -->
					<template v-if="info.status == 1">
						<view class="footer-btn" v-if="checkBtn(approveSign)">
							<uv-button
								text="通过"
								shape="circle"
								color="#6086fc"
								:customStyle="footerBtn"
								@click="cellApprove"
								plain
							></uv-button>
						</view>
						<view class="footer-btn" v-if="checkBtn(rejectSign)">
							<uv-button
								text="驳回"
								shape="circle"
								color="#f9ae3d"
								:customStyle="footerBtn"
								@click="cellReject"
								plain
							></uv-button>
						</view>
					</template>
				</template>
				<!-- 当前为仓库待确认的时候,即为仓库确认人 -->
				<!-- 	<template v-if="row.assoc_type == 5">
				<template v-if="row.status == 8">
					<view class="footer-btn">
						<uv-button text="仓库确认" shape="circle" color="#6086fc" :customStyle="footerBtn" @click="cellwhApprove"></uv-button>
					</view>
					<view class="footer-btn">
						<uv-button text="仓库驳回" shape="circle" color="#f9ae3d" :customStyle="footerBtn" @click="cellwhReject"></uv-button>
					</view>
				</template>
			</template> -->
				<view class="footer-btn mr-0" v-if="checkBtn(detailSign)">
					<uv-button text="详情" shape="circle" color="#6086fc" :customStyle="footerBtn" @click="toDetail"></uv-button>
				</view>
			</slot>
		</view>
	</view>
</template>

<script>
import { keyMap } from "./index.js";
import { hasPerm, btnPermsMap, checkAssocType } from "@/utils/auth.js";
import { formartDate as formartDateFn } from "@/utils/validate";
/**
 * 本组件是list列表页面的分组组件
 * @property {Number} type 1:采购单号,2:采购退货单号,3:换货单号,4采购入库单号,5退货出库单号,6领料出库单号,7:退料入库单号,8:拆装单单号,9:调拨单单号,10:盘点单单号,11:报废单单号,12: 其他入库单号
 * @property {Object} info 数据内容
 */
export default {
	name: "wlist-item",
	props: {
		type: {
			type: Number,
			default: 1,
		},
		info: {
			type: Object,
			// 对象或数组默认值必须从一个工厂函数获取
			default: function () {
				return {};
			},
		},
	},
	data() {
		return {};
	},
	computed: {
		/** 返回详情按钮的权限标识 */
		detailSign() {
			let sign = btnPermsMap.get(this.type)?.detail || [];
			return sign;
		},
		/** 返回提审按钮的权限标识 */
		submitSign() {
			let sign = btnPermsMap.get(this.type)?.submit || [];
			return sign;
		},
		/** 返回编辑按钮的权限标识  */
		editSign() {
			let sign = btnPermsMap.get(this.type)?.edit || [];
			return sign;
		},
		/** 返回作废按钮的权限标识  */
		voidSign() {
			let sign = btnPermsMap.get(this.type)?.void || [];
			return sign;
		},
		/** 返回撤回按钮的权限标识  */
		recallSign() {
			let sign = btnPermsMap.get(this.type)?.recall || [];
			return sign;
		},
		/** 返回删除按钮的权限标识  */
		delSign() {
			let sign = btnPermsMap.get(this.type)?.del || [];
			return sign;
		},
		/** 返回审核按钮的权限标识  */
		approveSign() {
			let sign = btnPermsMap.get(this.type)?.approve || [];
			return sign;
		},
		/** 返回驳回按钮的权限标识  */
		rejectSign() {
			let sign = btnPermsMap.get(this.type)?.reject || [];
			return sign;
		},
		/* uv-button的样式 */
		footerBtn() {
			return {
				width: "180rpx",
				height: "70rpx",
			};
		},
		orderNo() {
			let key = keyMap.get(this.type);
			console.log("key", key);
			return key;
			// return "procure_no";
		},
		/** 不显示采购单号的数组 */
		noProcureNo() {
			let arr = [6, 7, 8, 9, 10, 11, 12];
			return arr.includes(this.type);
		},
		/** 不显示商品明细(商品名称)的数组 */
		noGoodsName() {
			let arr = [3, 8, 10];
			return arr.includes(this.type);
		},
	},
	methods: {
		/** 判断身份标识  */
		checkAssocTypeFn(checkNum) {
			let assoc_type = this.info.assoc_type;
			let result = false;
			if (Array.isArray(assoc_type)) {
				result = checkAssocType(assoc_type, checkNum);
			} else {
				result = assoc_type == checkNum ? true : false;
			}
			return result;
		},
		checkBtn(sign) {
			if (this.type == 6) return false;
			return hasPerm(sign);
		},
		// 点击详情按钮,
		toDetail() {
			console.log("detailSign1111", this.detailSign);
			if (this.type == 6) {
				let { id } = this.info;
				this.$emit("tapDetail", { id });
				return;
			}
			if (!this.checkBtn(this.detailSign)) {
				wx.showModal({
					title: "温馨提示",
					content: "很抱歉,您没有操作权限!",
					showCancel: false,
					confirmText: "我知道了",
				});
				return;
			}
			let { id, assoc_type } = this.info;
			this.$emit("tapDetail", { id, assoc_type });
		},
		//点击提审按钮
		submitAudit() {
			let { id } = this.info;
			this.$emit("tapSubmit", { id });
		},
		//点击编辑按钮
		handleEdit() {
			let { id } = this.info;
			this.$emit("tapEdit", { id });
		},
		// 点击作废按钮
		handleVoid() {
			let { id } = this.info;
			this.$emit("tapVoid", { id });
		},
		// 点击撤回按钮
		cellRecall() {
			let { id } = this.info;
			this.$emit("tapRecall", { id });
		},
		// 点击通过按钮
		cellApprove() {
			let { id } = this.info;
			this.$emit("tapApprove", { id });
		},
		// 点击驳回按钮
		cellReject() {
			let { id } = this.info;
			this.$emit("tapReject", { id });
		},
		// 点击仓库确认按钮
		cellwhApprove() {
			let { id } = this.info;
			this.$emit("tapWhApprove", { id });
		},
		// 点击仓库驳回按钮
		cellwhReject() {
			let { id } = this.info;
			this.$emit("tapWhReject", { id });
		},
		// 点击状态
		tapStatus() {
			let list = [6, 12];
			if (list.includes(this.type)) return;
			let { id, status } = this.info;
			if (!status) {
				uni.$uv.toast("暂无审批日志");
				return;
			}
			this.$emit("tapStatus", { id });
		},
		/** 直接使用 全局方法 编译到小程序报错,故使用此方法转译一次  */
		formartDate(date) {
			return formartDateFn(date);
		},
	},
};
</script>

<style lang="scss">
.list-item {
	background-color: #ffffff;
	border-radius: 20rpx;
	box-shadow: 0 4rpx 10rpx 0rpx #00000006;
	.header {
		padding: 20rpx 30rpx 20rpx 19rpx;

		.top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;

			.order-num {
				&-img {
					width: 32rpx;
					height: 32rpx;
					margin-right: 15rpx;
				}

				&-text {
					font-weight: bold;
					font-size: 32rpx;
				}
			}

			.order-status {
			}
		}

		.bottom {
			padding-left: calc(66rpx - 19rpx);
			font-size: 24rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}

	.info {
		border-top: 2rpx solid #f6f6f6;
		padding: 20rpx 66rpx 0 66rpx;

		&-item {
			display: flex;
			margin-bottom: 20rpx;
			font-size: 28rpx;
			.info-item-left {
				flex-shrink: 0;
			}
			.goods-name {
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 3;
				overflow: hidden;
				color: #6f6f6f;
			}
		}
	}

	.reject-wrapper {
		font-size: 24rpx;
		color: #ff9100;
		padding: 20rpx 0;
		padding-left: 66rpx;
		border-top: 2rpx solid #f6f6f6;
	}

	.footer {
		display: flex;
		justify-content: flex-end;
		padding: 30rpx;
		padding-bottom: 20rpx;
		border-top: 2rpx solid #f7f7f7;
		flex-wrap: wrap;
		justify-content: flex-end;
		.footer-btn {
			width: 180rpx;
			height: 60rpx;
			margin-right: 40rpx;
			margin-bottom: 20rpx;
			&.mr-0{
				margin-right: 0;
			}
			&:last-child {
				// margin-right: 0;
			}
		}
	}
}
</style>
