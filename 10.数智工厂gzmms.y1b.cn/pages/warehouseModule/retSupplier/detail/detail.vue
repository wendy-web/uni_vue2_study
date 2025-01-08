<template>
	<view class="container">
		<uni-nav-bar
			background-color="linear-gradient(to left, #DAE3FF, #ECF4FF, #E1E8FF); "
			status-bar
			title="退料入库单详情"
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
							<wdetail-info :detailInfo="info" :type="7"></wdetail-info>
							<wgoods-list :type="7" :goods="info.goods"></wgoods-list>
						</view>
						<flow-vue :order_type="5" :order_id="order_id" :status="info.status" :whId="info.in_wh_id"></flow-vue>
					</template>
					<template v-slot:log>
						<!-- 单据日志 -->
						<wdocument-log :info="info.act_log"></wdocument-log>
					</template>
				</wtabs-swiper>
			</view>
			<wdetail-btn
				:type="7"
				:assoc_type="assoc_type"
				:status="info.status"
				@tapSubmit="tapSubmit"
				@tapVoid="tapVoid"
				@tapRecall="tapRecall"
				@tapApprove="tapApprove"
				@tapReject="tapReject"
				@tapWhApprove="tapWhApprove"
				@tapWhReject="tapWhReject"
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
		<!-- 驳回原因 -->
		<submitReasonDia ref="submitReasonDiaRef" @submit="submitWhReject"></submitReasonDia>
	</view>
</template>

<script>
import myMixin from "@/mixin/index.js";
import detailMixin from "@/mixin/detail_mixin.js";
import {
	detailRetSupInApi,
	submitRetSupInApi,
	recallRetSupInApi,
	voidRetSupInApi,
	rejectRetSupInApi,
	approveRetSupInApi,
	rejectRetSupInWhApi,
	approveRetSupInWhApi,
} from "@/api/modules/retSupplier.js";
import flowVue from "../../components/flow.vue";
import submitReasonDia from "../../components/submitReasonDia.vue";
export default {
	mixins: [myMixin, detailMixin],
	components: {
		flowVue,
		submitReasonDia,
	},
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
		// this.assoc_type = Number(options.assoc_type) || 0;
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
			const result = await detailRetSupInApi({ id: this.order_id });
			this.skeletonLoading = false;
			console.log("退料入库单详情res", result);
			this.assoc_type = result.data.assoc_type;
			this.info = result.data;
		},
		/* 点击提审 */
		async tapSubmit() {
			let id = this.order_id;
			try {
				const result = await submitRetSupInApi({ id });
				this.toastRefresh(result.msg);
			} catch (error) {}
		},
		/* 点击作废 */
		tapVoid() {
			let id = this.order_id;
			uni.showModal({
				title: "温馨提示",
				content: `您确定要作废该退料入库单吗?`,
				success: async (res) => {
					if (res.confirm) {
						console.log("用户点击确定");
						let result = await voidRetSupInApi({ id });
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
			const result = await recallRetSupInApi({ id });
			this.toastRefresh(result.msg);
		},
		// 点击审核通过
		async tapApprove() {
			let id = this.order_id;
			const result = await approveRetSupInApi({ id });
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
			const result = await rejectRetSupInApi(data);
			this.$refs.modal.close();
			this.rejectValue = "";
			this.toastRefresh(result.msg);
		},

		// 触发入库确认
		async tapWhApprove() {
			let { id } = this.info;
			const result = await approveRetSupInWhApi({ id });
			this.toastRefresh(result.msg);
		},
		// 触发入库驳回
		tapWhReject() {
			let { id } = this.info;
			this.$refs.submitReasonDiaRef.open({ id });
		},
		async submitWhReject(params) {
			const res = await rejectRetSupInWhApi(params);
			this.$refs.submitReasonDiaRef.close();
			this.toastRefresh(res.msg);
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
<style lang="scss"></style>
