<template>
	<view class="container">
		<uni-nav-bar
			background-color="linear-gradient(to left, #DAE3FF, #ECF4FF, #E1E8FF); "
			status-bar
			title="其他入库单详情"
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
							<wdetail-info :detailInfo="info" :type="12"></wdetail-info>
							<wgoods-list :type="4" :goods="info.goods"></wgoods-list>
						</view>
						<flow-vue :order_type="3" :order_id="order_id" :status="info.status" :whId="info.in_wh_id"></flow-vue>
					</template>
					<template v-slot:log>
						<!-- 单据日志 -->
						<wdocument-log :info="info.act_log"></wdocument-log>
					</template>
				</wtabs-swiper>
			</view>
			<wdetail-btn
				:type="12"
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
		<!-- 入库时间 -->
		<submitDateDia ref="submitDiaRef" @submit="submitWhApprove"></submitDateDia>
		<!-- 驳回原因 -->
		<submitReasonDia ref="submitReasonDiaRef" @submit="submitWhReject"></submitReasonDia>
	</view>
</template>

<script>
import {
	approveOtherInApi,
	detailOtherInApi,
	recallOtherInApi,
	rejectOtherInApi,
	submitOtherInApi,
	voidOtherInApi,
	whApproveApi,
	whRejectApi
} from "@/api/modules/otherIn.js";
import detailMixin from "@/mixin/detail_mixin.js";
import myMixin from "@/mixin/index.js";
import flowVue from "../../components/flow.vue";
import submitDateDia from '../../components/submitDateDia.vue';
import submitReasonDia from '../../components/submitReasonDia.vue';
export default {
	mixins: [myMixin, detailMixin],
	components:{
		flowVue,
		submitDateDia,
		submitReasonDia
	},
	data() {
		return {
			tabs: ["单据详情", "单据日志"],
			order_id: 0, //订单id
			assoc_type: 0, // 身份标识
			info: {},
			rejectValue: "",
		};
	},
	onLoad(options) {
		this.order_id = Number(options.id) || 0;
	},
	onShow() {
		this.getData();
	},
	methods: {
		async getData() {
			if (!this.order_id) return;
			const result = await detailOtherInApi({ id: this.order_id });
			this.skeletonLoading = false;
			this.info = result.data;
			this.assoc_type = result.data.assoc_type;
		},
		/* 点击提审 */
		async tapSubmit() {
			let id = this.order_id;
			const result = await submitOtherInApi({ id });
			this.toastRefresh(result.msg);
		},
		/* 点击作废 */
		tapVoid() {
			let id = this.order_id;
			let wh_in_no = this.info.wh_in_no;
			uni.showModal({
				title: "温馨提示",
				content: `您确定要作废该其他入库单吗?`,
				success: async (res) => {
					if (res.confirm) {
						console.log("用户点击确定");
						let result = await voidOtherInApi({ id });
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
			const result = await recallOtherInApi({ id });
			this.toastRefresh(result.msg);
		},
		// 点击审核通过
		async tapApprove() {
			let id = this.order_id;
			const result = await approveOtherInApi({ id });
			this.toastRefresh(result.msg);
		},
		// 触发点击驳回
		tapReject() {
			this.$refs.modal.open();
		},
		// 触发入库时间选择
		tapWhApprove() {
			let { id, in_time } = this.info;
			in_time = uni.$uv.timeFormat(in_time, "yyyy-mm-dd")
			this.$refs.submitDiaRef.open({ id, in_time });
		},
		// 入库弹窗确认
		async submitWhApprove(params) {
			const res = await whApproveApi(params);
			this.$refs.submitDiaRef.close();
			this.toastRefresh(res.msg);
		},
		// 触发入库驳回
		tapWhReject() {
			let { id } = this.info;
			this.$refs.submitReasonDiaRef.open({ id });
		},
		async submitWhReject(params) {
			const res = await whRejectApi(params);
			this.$refs.submitReasonDiaRef.close();
			this.toastRefresh(res.msg);
		},
		async rejectConfirm() {
			let data = {
				reason: this.rejectValue,
				id: this.order_id,
			};
			const result = await rejectOtherInApi(data);
			this.$refs.modal.close();
			this.rejectValue = "";
			this.toastRefresh(result.msg);
		},
		/** 操作提示且刷新页面  */
		toastRefresh(msg) {
			this.showToastRefresh(msg, this.getData);
		},
	}
};
</script>
<style lang="scss"></style>
