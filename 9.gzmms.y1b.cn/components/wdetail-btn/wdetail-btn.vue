<template>
	<view class="bottom-btn">
		<!-- <template v-if="assoc_type == 1"> -->
		<template v-if="checkAssocTypeFn(1)">
			<!-- 待提审,已撤回,已驳回状态时 -->
			<template v-if="status == 0 || status == 4 || status == 5">
				<view class="btn-item" @click="tapSubmit" v-if="checkBtn(submitSign)">
					<image src="https://file.y1b.cn/public/erpxcx_img/common/tishen@2x.png" mode="" class="btn-item-img"></image>
					<text>提审</text>
				</view>
				<view class="btn-item" @click="tapVoid" v-if="checkBtn(voidSign)">
					<image src="https://file.y1b.cn/public/erpxcx_img/common/zuofei@2x.png" mode="" class="btn-item-img"></image>
					<text>作废</text>
				</view>
			</template>
			<!-- 待审核状态时 -->
			<template v-else-if="status == 1">
				<view class="btn-item" @click="tapRecall" v-if="checkBtn(recallSign)">
					<image src="https://file.y1b.cn/public/erpxcx_img/common/xiugai@2x.png" mode="" class="btn-item-img"></image>
					<text>撤回</text>
				</view>
			</template>
			<!-- 已作废状态时 -->
			<!-- <template v-else-if="status == 6">
				<view class="btn-item" @click="tapDel">
					<image src="https://file.y1b.cn/public/erpxcx_img/common/zuofei@2x.png" mode="" class="btn-item-img"></image>
					<text>删除</text>
				</view>
			</template> -->
		</template>
		<!-- 当前为审核人的时候 -->
		<!-- <template v-if="assoc_type == 2"> -->
		<template v-if="checkAssocTypeFn(2)">
			<!-- 待审核状态时 -->
			<template v-if="status == 1">
				<view class="btn-item" @click="tapApprove" v-if="checkBtn(approveSign)">
					<image src="https://file.y1b.cn/public/erpxcx_img/common/tongguo@2x.png" mode="" class="btn-item-img"></image>
					<text>通过</text>
				</view>
				<view class="btn-item" @click="tapReject" v-if="checkBtn(rejectSign)">
					<image src="https://file.y1b.cn/public/erpxcx_img/common/bohui@2x.png" mode="" class="btn-item-img"></image>
					<text>驳回</text>
				</view>
			</template>
		</template>
	</view>
</template>

<script>
import { btnPermsMap, checkAssocType, hasPerm } from "@/utils/auth.js";

/**
 * 本组件是详情页的 底部按钮组件
 * @property {Number} type 1:采购单号,2:采购退货单号,3:换货单号,4采购入库单号,5退货出库单号,6领料出库单号,7:退料入库单号,8:拆装单单号,9:调拨单单号,10:盘点单单号,11:报废单单号
 * @property {Number} status 单据状态
 * @property {Number} assoc_type 身份标识
 */
export default {
	name: "wdetail-btn",
	props: {
		type: {
			type: Number,
			default: 1,
		},
		/*  */
		assoc_type: {
			type: [Number,Array],
			default: 0,
		},
		status: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {};
	},
	computed: {
		/** 返回提审按钮的权限标识 */
		submitSign() {
			let sign = btnPermsMap.get(this.type)?.submit || [];
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
	},
	methods: {
		/** 判断身份标识  */
		checkAssocTypeFn(checkNum) {
			let assoc_type = this.assoc_type;
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
		// 点击提审
		tapSubmit() {
			this.$emit("tapSubmit");
		},
		// 点击作废
		tapVoid() {
			this.$emit("tapVoid");
		},
		// 点击撤回
		tapRecall() {
			this.$emit("tapRecall");
		},
		// 点击删除
		tapDel() {
			this.$emit("tapDel");
		},
		// 点击审核通过
		tapApprove() {
			this.$emit("tapApprove");
		},
		// 点击审核驳回
		tapReject() {
			this.$emit("tapReject");
		},
	},
};
</script>

<style lang="scss">
.bottom-btn {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	justify-content: space-around;
	height: 100rpx;
	background-color: #fff;
	color: #000018;
	font-size: 28rpx;
	box-shadow: 10rpx 6rpx 12rpx 0rpx rgba(0, 0, 0, 0.16);
	padding-bottom: env(safe-area-inset-bottom);
	.btn-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		.btn-item-img {
			width: 48rpx;
			height: 48rpx;
		}
	}
}
</style>
