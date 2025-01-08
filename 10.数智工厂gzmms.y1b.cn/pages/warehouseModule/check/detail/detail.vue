<template>
	<view class="container">
		<uni-nav-bar
			background-color="linear-gradient(to left, #DAE3FF, #ECF4FF, #E1E8FF); "
			status-bar
			title="盘点单详情"
			:border="false"
			fixed
			left-icon="left"
			@clickLeft="back"
		/>
		<uv-skeletons :loading="skeletonLoading" :skeleton="skeleton" :animate="skeletonAnimate">
			<view class="main">
				<wtabs-swiper>
					<template v-slot:detail>
						<view class="content">
							<wdetail-info :detailInfo="info" :type="10"></wdetail-info>
							<wgoods-list :type="10" :goods="info.goods"></wgoods-list>
						</view>
					</template>
					<template v-slot:log>
						<!-- 单据日志 -->
						<wdocument-log :info="info.act_log"></wdocument-log>
					</template>
				</wtabs-swiper>
			</view>
			<wdetail-btn
				:type="10"
				:assoc_type="assoc_type"
				:status="info.status"
				@tapSubmit="tapSubmit"
				@tapVoid="tapVoid"
				@tapRecall="tapRecall"
				@tapApprove="tapApprove"
				@tapReject="tapReject"
			></wdetail-btn>
		</uv-skeletons>
		<uv-modal
			ref="modal"
			title="请输入驳回原因"
			showCancelButton
			:closeOnClickOverlay="false"
			asyncClose
			@confirm="rejectConfirm"
		>
			<uv-textarea v-model="rejectValue" count placeholder="请输入内容"></uv-textarea>
		</uv-modal>
		<uv-toast ref="toast"></uv-toast>
	</view>
</template>

<script>
import {
	detailCheckApi,
	submitCheckApi,
	recallCheckApi,
	voidCheckApi,
	rejectCheckApi,
	approveCheckApi,
} from "@/api/modules/check.js";
import myMixin from "@/mixin/index.js";
import detailMixin from "@/mixin/detail_mixin.js";
export default {
	mixins: [myMixin, detailMixin],
	// 这里存放数据
	data() {
		return {
			tabs: ["单据详情", "单据日志"],
			order_id: 0, //订单id
			assoc_type: 0, // 身份标识
			info: {},
			rejectValue: "", //驳回Value
		};
	},

	// 生命周期 - 监听页面加载
	onLoad(options) {
		this.order_id = Number(options.id) || 0;
		this.assoc_type = Number(options.assoc_type) || 0;
	},
	// 生命周期 - 监听页面显示
	onShow() {
		this.getData();
	},
	// 方法集合
	methods: {
		async getData() {
			console.log("this.order_id", this.order_id);
			if (!this.order_id) return;
			const result = await detailCheckApi({ id: this.order_id });
			this.skeletonLoading = false;
			console.log("盘点单详情res", result);
			this.info = result.data;
		},
		/* 点击提审 */
		async tapSubmit() {
			let id = this.order_id;
			uni.showModal({
				title: "温馨提示",
				content: `是否需要更新库存?`,
				confirmText: "需要",
				cancelText: "不需要",
				success: async (res) => {
					if (res.confirm) {
						const result = await submitCheckApi({ id, up_inv: 1 });
						this.toastRefresh(result.msg);
					} else if (res.cancel) {
						const result = await submitCheckApi({ id, up_inv: 2 });
						this.toastRefresh(result.msg);
					}
				},
			});
		},
		/* 点击作废 */
		tapVoid() {
			let id = this.order_id;
			uni.showModal({
				title: "温馨提示",
				content: `您确定要作废该盘点单吗?`,
				success: async (res) => {
					if (res.confirm) {
						console.log("用户点击确定");
						let result = await voidCheckApi({ id });
						this.toastRefresh(result.msg);
					} else if (res.cancel) {
						console.log("用户点击取消");
					}
				},
			});
		},
		/* 点击撤回 */
		async tapRecall() {
			let id = this.order_id;
			const result = await recallCheckApi({ id });
			this.toastRefresh(result.msg);
		},
		// 点击审核通过
		async tapApprove() {
			let id = this.order_id;
			const result = await approveCheckApi({ id });
			this.toastRefresh(result.msg);
		},
		// 触发点击驳回
		tapReject() {
			this.$refs.modal.open();
		},
		async rejectConfirm() {
			console.log("点击确认按钮");
			let data = {
				reason: this.rejectValue,
				id: this.order_id,
			};
			const result = await rejectCheckApi(data);
			this.$refs.modal.close();
			this.rejectValue = "";
			this.toastRefresh(result.msg);
		},
		/** 操作提示且刷新页面  */
		toastRefresh(msg) {
			this.showToastRefresh(msg, this.getData);
		},
	},
	// 计算属性
	computed: {},
	onHide() {}, // 生命周期 - 监听页面隐藏
	onUnload() {}, // 生命周期 - 监听页面卸载
};
</script>
<style lang="scss">
page {
	background-color: #f6f6f6;
}
</style>
