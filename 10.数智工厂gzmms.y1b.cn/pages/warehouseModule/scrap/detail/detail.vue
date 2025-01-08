<template>
	<view class="container">
		<uni-nav-bar
			background-color="linear-gradient(to left, #DAE3FF, #ECF4FF, #E1E8FF); "
			status-bar
			title="报废单详情"
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
							<wdetail-info :detailInfo="info" :type="11"></wdetail-info>
							<wgoods-list :type="11" :goods="info.goods"></wgoods-list>
						</view>
					</template>
					<template v-slot:log>
						<!-- 单据日志 -->
						<wdocument-log :info="info.act_log"></wdocument-log>
					</template>
				</wtabs-swiper>
			</view>
			<wdetail-btn
				:type="11"
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
	detailScrapApi,
	submitScrapApi,
	recallScrapApi,
	voidScrapApi,
	rejectScrapApi,
	approveScrapApi,
} from "@/api/modules/scrap.js";
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
			const result = await detailScrapApi({ id: this.order_id });
			this.skeletonLoading = false;
			console.log("报废单详情res", result);
			this.info = result.data;
		},
		/* 点击提审 */
		async tapSubmit() {
			let id = this.order_id;
			const result = await submitScrapApi({ id });
			this.toastRefresh(result.msg);
		},
		/* 点击作废 */
		tapVoid() {
			let id = this.order_id;
			uni.showModal({
				title: "温馨提示",
				content: `您确定要作废该报废单吗?`,
				success: async (res) => {
					if (res.confirm) {
						console.log("用户点击确定");
						let result = await voidScrapApi({ id });
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
			const result = await recallScrapApi({ id });
			this.toastRefresh(result.msg);
		},
		// 点击审核通过
		async tapApprove() {
			let id = this.order_id;
			const result = await approveScrapApi({ id });
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
			const result = await rejectScrapApi(data);
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
<style lang="scss"></style>
