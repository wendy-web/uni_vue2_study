<template>
	<view class="container">
		<!-- 自定义导航栏 -->
		<uni-nav-bar
			background-color="linear-gradient(to left, #DAE3FF, #ECF4FF, #E1E8FF); "
			status-bar
			title="领料单详情"
			:border="false"
			fixed
			left-icon="left"
			@clickLeft="back"
		/>
		<view class="main">
			<wtabs-swiper>
				<template v-slot:detail>
					<view class="content">
						<view class="header-info">
							<view class="header-top">
								<view class="order-info flex-between">
									<text class="order-num">{{ info.wh_rec_no }}</text>
									<text class="order-status">{{ orderStatus }}</text>
								</view>
								<view class="ct-name flex-between">
									<text>{{ info.ct_name }}</text>
									<uv-icon name="clock" :label="info.create_time"></uv-icon>
								</view>
							</view>
							<view class="header-bottom">
								<view class="header-bottom-item">
									<text class="gary-text">申请人：</text>
									<text>{{ info.rp_names }}</text>
								</view>
								<view class="header-bottom-item">
									<text class="gary-text">出库仓库：</text>
									<text>{{ info.warehouse_name }}</text>
								</view>
								<view class="header-bottom-item">
									<text class="gary-text">单据备注：</text>
									<text>{{ info.note || "无" }}</text>
								</view>
							</view>
						</view>
						<view class="list">
							<view class="detail-header flex-between">
								<view class="flex-align">
									<image
										src="https://file.y1b.cn/public/erpxcx_img/common/goods_titleicon@2x.png"
										class="detail-header-img"
									></image>
									<text>物料明细</text>
								</view>
								<view class="all" v-if="checkAssocType(assoc_type, 5) && status == 8">
									<uv-checkbox-group shape="circle" size="20">
										<uv-checkbox
											name="all"
											label="全选"
											@change="selectAll"
											labelSize="16"
											:checked="checkAll"
										></uv-checkbox>
									</uv-checkbox-group>
								</view>
							</view>

							<template v-if="checkAssocType(assoc_type, 5) && status == 8">
								<uv-checkbox-group
									v-model="checkboxValue"
									shape="circle"
									placement="column"
									iconPlacement="right"
									size="22"
									@change="watchSelect"
								>
									<uv-checkbox
										:customStyle="{ backgroundColor: '#fff' }"
										v-for="(item, index) in goods"
										:key="item.id"
										:name="item.id"
									>
										<view class="list-item">
											<view class="item-top flex-between">
												<text class="item-top-left">{{ item.warehouse_name }}</text>
												<text class="item-status" v-if="item.issuance_status == 1">部分发料</text>
												<text class="item-status" v-else-if="item.issuance_status == 2">全部发料</text>
												<text class="item-status" v-else>待发料</text>
											</view>
											<view class="goods-name flex-between">
												<text>{{ item.title }}</text>
												<text style="margin-left: 10rpx;color: red;"> {{ item.ws_code }}</text>
											</view>
											<view class="item-barcode flex-between">
												<text class="gary-text">条码：{{ item.barcode }}</text>
												<view class="">
													<view class="apply-box">
														<view class="apply-num">
															<text class="apply-num-left">{{ item.rec_num }}/</text>
															<text>{{ item.issue_num }}</text>
															<text>/{{ item.received_num }}</text>
														</view>
														<text class="apply-text">申请/已发/已领</text>
													</view>
													<view
														class="apply-detail"
														@click.stop="lookUnique(item.unique_label_detail, index)"
														v-if="item.is_have_unique"
													>
														申请明细
													</view>
												</view>
											</view>
											<view class="item-others">
												<view class="item-others-item" v-if="item.brank">{{ item.brank }}</view>
												<view class="item-others-item" v-if="item.spec">{{ item.spec }}</view>
											</view>
											<view class="item-place">
												<text class="gary-text">使用地点：</text>
												<text class="gary-text">{{ item.use_places || "无" }}</text>
											</view>
											<view class="item-flex">
												<view class="flex-box">
													<text>入库日期：</text>
													<text>{{ item.in_wh_date || '-' }}</text>
												</view>
												<view class="flex-box">
													<text>批次/日期：</text>
													<text>{{ item.ph_no || '-' }}</text>
												</view>
											</view>
											<view class="item-flex">
												<view class="flex-box">
													<text>生产日期：</text>
													<text>{{ item.pro_time || "-" }}</text>
												</view>
												<view class="flex-box">
													<text>到期日期：</text>
													<text>{{ item.exp_time || "-" }}</text>
												</view>
											</view>
											<view class="item-note gary-text">
												<text>备注：</text>
												<text>{{ item.note || "无" }}</text>
											</view>
										</view>
									</uv-checkbox>
								</uv-checkbox-group>
							</template>
							<template v-else>
								<view class="list-item" v-for="(item, index) in goods" :key="item.id">
									<view class="item-top flex-between">
										<text class="item-top-left">{{ item.warehouse_name }}</text>
										<text class="item-status" v-if="item.issuance_status == 1">部分发料</text>
										<text class="item-status" v-else-if="item.issuance_status == 2">全部发料</text>
										<text class="item-status" v-else>待发料</text>
									</view>
									<view class="goods-name flex-between">
										<text>{{ item.title }}</text>
										<text style="margin-left: 10rpx;color: red;" v-if="item.ws_code"> {{ item.ws_code || 'AS-cs' }}</text>
									</view>
									<view class="item-barcode flex-between">
										<text class="gary-text">条码：{{ item.barcode }}</text>
										<view class="">
											<view class="apply-box">
												<view class="apply-num">
													<text class="apply-num-left">{{ item.rec_num }}/</text>
													<text>{{ item.issue_num }}</text>
													<text>/{{ item.received_num }}</text>
												</view>
												<text class="apply-text">申请/已发/已领</text>
											</view>
											<view
												class="apply-detail"
												@click.stop="lookUnique(item.unique_label_detail, index)"
												v-if="item.is_have_unique"
											>
												申请明细
											</view>
										</view>
									</view>
									<view class="item-others">
										<view class="item-others-item" v-if="item.brank">{{ item.brank }}</view>
										<view class="item-others-item" v-if="item.spec">{{ item.spec }}</view>
									</view>
									<view class="item-place">
										<text class="gary-text">使用地点：</text>
										<text class="gary-text">{{ item.use_places || "无" }}</text>
									</view>
									<view class="item-flex">
										<view class="flex-box">
											<text>入库日期：</text>
											<text>{{ item.in_wh_date || "-" }}</text>
										</view>
										<view class="flex-box">
											<text>批次/日期：</text>
											<text>{{ item.ph_no|| '-' }}</text>
										</view>
									</view>
									<view class="item-flex">
										<view class="flex-box">
											<text>生产日期：</text>
											<text>{{ item.pro_time || "-" }}</text>
										</view>
										<view class="flex-box">
											<text>到期日期：</text>
											<text>{{ item.exp_time || "-" }}</text>
										</view>
									</view>
									<view class="item-note gary-text">
										<text>备注：</text>
										<text>{{ item.note || "无" }}</text>
									</view>
								</view>
							</template>
						</view>
						<!-- 流程组件 -->
						<!-- <flow :id="order_id" v-if="order_id"></flow> -->
						<flow :order_id="order_id" :status="status" :is_force_receive="is_force_receive" ref="flowRef"></flow>
					</view>
				</template>
				<template v-slot:log>
					<!-- 单据日志 -->
					<wdocument-log :info="info.act_log"></wdocument-log>
				</template>
			</wtabs-swiper>
		</view>

		<view class="bottom-btn">
			<!-- 当前为创建人 -->
			<template v-if="is_ct_user == 1">
				<!-- 待提审,已撤回,已驳回状态时 -->
				<template v-if="status == 0 || status == 4 || status == 5">
					<view class="btn-item" @click="tapSubmit" v-if="checkBtn(['sto:getsup:submit'])">
						<image
							src="https://file.y1b.cn/public/erpxcx_img/common/tishen@2x.png"
							mode=""
							class="btn-item-img"
						></image>
						<text>提审</text>
					</view>
					<view class="btn-item" @click="tapVoid" v-if="checkBtn(['sto:getsup:void'])">
						<image
							src="https://file.y1b.cn/public/erpxcx_img/common/zuofei@2x.png"
							mode=""
							class="btn-item-img"
						></image>
						<text>作废</text>
					</view>
				</template>
				<template v-else-if="status == 1 || status == 8">
					<template v-if="!is_part_issue">
						<view class="btn-item" @click="tapRecall" v-if="checkBtn(['sto:getsup:recall'])">
							<image
								src="https://file.y1b.cn/public/erpxcx_img/common/xiugai@2x.png"
								mode=""
								class="btn-item-img"
							></image>
							<text>撤回</text>
						</view>
					</template>
				</template>
			</template>
			<!-- 当前为审核人的时候 -->
			<template v-if="checkAssocType(assoc_type, 2)">
				<!-- 待审核状态时 -->
				<template v-if="status == 1">
					<view class="btn-item" @click="tapApprove" v-if="checkBtn(['sto:getsup:approve'])">
						<image
							src="https://file.y1b.cn/public/erpxcx_img/common/tongguo@2x.png"
							mode=""
							class="btn-item-img"
						></image>
						<text>通过</text>
					</view>
					<view class="btn-item" @click="tapReject" v-if="checkBtn(['sto:getsup:reject'])">
						<image src="https://file.y1b.cn/public/erpxcx_img/common/bohui@2x.png" mode="" class="btn-item-img"></image>
						<text>驳回</text>
					</view>
				</template>
			</template>
			<!-- 当前为仓库确认人的时候 -->
			<template v-if="checkAssocType(assoc_type, 5)">
				<!-- 待领料状态时 -->
				<template v-if="status == 8">
					<view class="btn-item" @click="tapWhGiveGoods" v-if="checkBtn(['sto:getsup:whapprove'])">
						<uv-icon name="empty-order" color="#398ade" size="30"></uv-icon>
						<text>仓库发料</text>
					</view>
				</template>
			</template>

			<template v-if="checkAssocType(assoc_type, 6) && status == 10">
				<view class="btn-item" @click="handleShowMa">
					<uv-icon name="empty-order" color="#53c21d" size="30"></uv-icon>
					<text>领取码</text>
				</view>
				<view class="btn-item" @click="handleRecallGive" v-if="checkBtn(['sto:getsup:giverecall'])">
					<uv-icon name="empty-order" color="#f1a532" size="30"></uv-icon>
					<text>发料撤回</text>
				</view>
			</template>

			<!-- 当前是制单人且存在部分领料,且状态不为3时 -->
			<template v-if="is_ct_user == 1 && is_have_received == 1 && status != 3">
				<view class="btn-item" @click="tapOver" v-if="checkBtn(['sto:getsup:over'])">
					<uv-icon name="empty-history" color="#4592D8" size="30"></uv-icon>
					<text>领料完结</text>
				</view>
			</template>
			<template v-if="checkAssocType(assoc_type, 8) && status == 10">
				<view class="btn-item" @click="tapReceive" v-if="checkBtn(['sto:getsup:receive'])">
					<uv-icon name="empty-news" color="#4592D8" size="30"></uv-icon>
					<text>确认领料</text>
				</view>
			</template>
		</view>

		<uv-popup
			ref="popup"
			mode="bottom"
			@close="receiveClose"
			:round="10"
			closeable
			safeAreaInsetTop
			@change="popupChange"
		>
			<receive :detailId="order_id" v-if="receiveShow" @close="receiveClose"></receive>
			<!-- 	<view class="close-btn">
				<uv-button text="关闭" shape="circle" @click="receiveClose"></uv-button>
			</view> -->
		</uv-popup>
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
		<uv-modal
			ref="passModal"
			title="请输入通过内容"
			showCancelButton
			:closeOnClickOverlay="false"
			asyncClose
			@confirm="passConfirm"
		>
			<uv-textarea v-model="approve_note" count placeholder="请输入内容"></uv-textarea>
		</uv-modal>
		<uv-toast ref="toast"></uv-toast>
		<qrcodeVue :value="receive_qrcode_url" ref="qrcodeRef"></qrcodeVue>
		<uniqueCode ref="uniqueCodeRef" @confirm="onUniqueConfirm"></uniqueCode>
		<page-container
			:show="pageContainerShow"
			position="right"
			:overlay="false"
			z-index="99999"
			@afterleave="afterleave"
			@close="preClose"
		>
			<confirmGiveVue
				ref="confirmGiveRef"
				@close="afterleave"
				:order_id="order_id"
				:goods="giveGoods"
				@confirm="giveConfirm"
			></confirmGiveVue>
		</page-container>
	</view>
</template>

<script>
import {
	approveGetSupApi,
	detailGetSupApi,
	overGetSupApi,
	recallGetSupApi,
	recallGiveApi,
	rejectGetSupApi,
	submitGetSupApi,
	voidGetSupApi
} from "@/api/modules/getSupplier.js";
import { checkAssocType as checkAssocTypeFn, statusMap } from "../index.js";
// 引入组件
import { proUrl } from "@/api/http/xhHttp.js";
import { hasPerm } from "@/utils/auth.js";
import confirmGiveVue from "../components/confirmGive.vue";
import flow from "../components/flow.vue";
import qrcodeVue from "../components/qrcode.vue";
import receive from "../components/receive.vue";
import uniqueCode from "../components/uniqueCode.vue";
/* 领料单详情页面 */
export default {
	components: {
		flow,
		receive,
		confirmGiveVue,
		qrcodeVue,
		uniqueCode,
	},
	// 这里存放数据
	data() {
		return {
			checkAll: false, //全选状态
			giveGoods: [], //传给发料子组件的数据
			checkboxValue: [], //选择的商品id数组
			pageContainerShow: false,
			tabs: ["单据详情", "单据日志"],
			order_id: 0,
			info: {},
			goods: [],
			status: 0, //单据状态
			/** 身份表示数组 */
			assoc_type: [], //
			/** 新标识, 是否制单人:1为制单人,0不是 */
			is_ct_user: 0,
			/** 是否部分领取 是否有领取过；0：不是；1：是； */
			is_have_received: 0,
			/** 是否强制完结；0：否；1：是；  */
			is_force_receive: 0,
			/** 是否部分发料  0：不是；1：部分发料；*/
			is_part_issue: 0,
			rejectValue: "",
			receiveShow: false,
			approve_note: "同意", //审批通过时的内容 默认 同意
			receive_qrcode_url: "",
			qrcodeVisible: false,
		};
	},

	// 生命周期 - 监听页面加载
	onLoad(options) {
		console.log("领料出库详情页的options", options);
		this.order_id = Number(options.order_id) || Number(options.id) || 0;
	},
	// 生命周期 - 监听页面显示
	onShow() {
		this.getData();
		// this.tapWhGiveGoods();
	},
	methods: {
		lookUnique(unique_label_detail, index) {
			this.current_index = index;
			this.$refs.uniqueCodeRef.open(unique_label_detail);
		},
		afterleave() {
			this.pageContainerShow = false;
		},
		watchSelect(selectList) {
			this.checkAll = selectList.length === this.goods.length;
		},
		// 点击全选
		selectAll(val) {
			this.checkAll = val;
			let arr = this.goods.map((item) => {
				return item.id;
			});
			this.checkboxValue = val ? arr : [];
		},
		// 监听子组件 确认发料事件
		giveConfirm() {
			this.getData();
			this.handleShowMa();
		},
		// 点击仓库发料
		tapWhGiveGoods() {
			if (this.checkboxValue.length === 0) {
				uni.$uv.toast("请先选择需要发料的货品", 1500);
				return;
			}
			this.giveGoods = this.goods.filter((item) => {
				return this.checkboxValue.includes(item.id);
			});
			this.pageContainerShow = true;
			this.$refs.confirmGiveRef.open();
		},
		// 点击显示领取码
		handleShowMa() {
			this.$refs.qrcodeRef.open();
		},
		async handleRecallGive() {
			const result = await recallGiveApi({ id: this.order_id });
			this.showToastRefresh(result.msg);
			this.getData();
		},
		checkBtn(sign) {
			return hasPerm(sign);
		},
		checkAssocType(assocType, query) {
			return checkAssocTypeFn(assocType, query);
		},
		async getData() {
			if (!this.order_id) return;
			const result = await detailGetSupApi({ id: this.order_id });
			console.log("领料详情res", result);
			let res = result.data;
			this.info = result.data;
			this.goods = result.data.goods;
			this.status = result.data.status;
			this.assoc_type = result.data.assoc_type;
			this.is_ct_user = result.data.is_ct_user;
			this.is_have_received = result.data.is_have_received;
			this.is_force_receive = result.data.is_force_receive;
			this.is_part_issue = result.data.is_part_issue;
			this.receive_qrcode_url = proUrl + result.data.receive_qrcode_url;
			// this.receive_qrcode_url = "https://h5.uvui.cn";
		},
		back() {
			uni.navigateBack({
				delta: 1,
			});
		},
		// 点击提审
		async tapSubmit() {
			let id = this.order_id;
			const result = await submitGetSupApi({ id });
			this.showToastRefresh(result.msg);
		},
		// 点击作废
		tapVoid() {
			let id = this.order_id;
			let { wh_rec_no } = this.info;
			uni.showModal({
				title: "温馨提示",
				content: `您确定要作废【${wh_rec_no}】领料出库单吗?`,
				success: async (res) => {
					if (res.confirm) {
						console.log("用户点击确定");
						let result = await voidGetSupApi({ id });
						this.showToastRefresh(result.msg);
					} else if (res.cancel) {
						console.log("用户点击取消");
					}
				},
			});
		},
		// 点击撤回
		async tapRecall() {
			let id = this.order_id;
			const result = await recallGetSupApi({ id });
			this.showToastRefresh(result.msg);
		},
		// 点击通过
		async tapApprove() {
			this.$refs.passModal.open();
		},
		async passConfirm() {
			let data = {
				approve_note: this.approve_note,
				id: this.order_id,
			};
			const result = await approveGetSupApi(data);
			this.$refs.passModal.close();
			this.approve_note = "同意";
			this.showToastRefresh(result.msg);
		},

		// 点击驳回
		tapReject() {
			this.$refs.modal.open();
		},
		async rejectConfirm() {
			console.log("点击确认按钮");
			let data = {
				reason: this.rejectValue,
				id: this.order_id,
			};
			const result = await rejectGetSupApi(data);
			this.$refs.modal.close();
			this.rejectValue = "";
			this.showToastRefresh(result.msg);
		},
		// 点击领料完结
		tapOver() {
			let id = this.order_id;
			uni.showModal({
				title: "温馨提示",
				content: `本单存在未领取完物料，请确认是否完结?`,
				success: async (res) => {
					if (res.confirm) {
						console.log("用户点击确定");
						const result = await overGetSupApi({ id });
						this.showToastRefresh(result.msg);
						this.$refs.flowRef.getData();
					} else if (res.cancel) {
						console.log("用户点击取消");
					}
				},
			});
		},
		/** 点击确认领料 */
		tapReceive() {
			this.$refs.popup.open();
		},
		/** 关闭领料弹窗 */
		receiveClose() {
			this.$refs.popup.close();
		},
		// 领料弹窗打开关闭时
		popupChange() {
			this.receiveShow = !this.receiveShow;
			this.getData();
		},

		/**@example 显示消息提示框并且刷新列表
		 * @param {String} msg 传入接口返回的消息,默认空字符串
		 * @param {Number} duration 提示的延迟时间 默认2000
		 * @param {String} type 提示的类型 默认 success
		 */
		showToastRefresh(msg = "", duration = 2000, type = "success") {
			this.$refs.toast.show({
				type,
				message: msg,
				duration,
			});
			this.getData();
		},
	},
	// 计算属性
	computed: {
		orderStatus() {
			let check = checkAssocTypeFn(this.assoc_type, 3);
			if (this.status == 1 && check) return "已审核";
			return statusMap.get(this.status);
		},
	},
	onHide() {}, // 生命周期 - 监听页面隐藏
	onUnload() {}, // 生命周期 - 监听页面卸载
};
</script>
<style lang="scss">
page {
	background-color: #f6f6f6;
	overflow: hidden;
	height: 100%;
}
::v-deep .uv-status-bar {
	height: 60rpx !important;
}

.main {
	padding-bottom: 160rpx;
	.content {
		.header-info {
			background-color: #ffffff;
			margin-bottom: 20rpx;
			padding: 20rpx 30rpx;
			.header-top {
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
			}
			.header-bottom {
				font-size: 28rpx;
				&-item {
					margin-bottom: 16rpx;
					&:last-child {
						margin-bottom: 0;
					}
				}
			}
		}
	}
}
/* 通用灰色类名 */
.gary-text {
	color: #a3a2a8;
}
.list {
	background-color: #fff;
	padding: 0 20rpx;
	padding-bottom: 20rpx;
	margin-bottom: 20rpx;
	/* 商品列表头部样式 */
	.detail-header {
		height: 104rpx;
		display: flex;
		align-items: center;
		padding-left: 20rpx;
		font-size: 32rpx;
		font-weight: bold;
		// border-bottom: 1rpx solid #e5e5e5;
		background-color: #fff;
		&-img {
			width: 40rpx;
			height: 40rpx;
			margin-right: 16rpx;
		}
	}

	.list-item {
		padding: 20rpx;
		font-size: 28rpx;
		// border-bottom: 2rpx solid #e5e5e5;
		background-color: #fcfdff;
		margin-bottom: 10rpx;
		border: 1rpx solid #bccbff;
		border-radius: 20rpx;
		margin-right: 20rpx;
		.goods-name {
			font-weight: bold;
			max-width: 600rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			// margin-bottom: 10rpx;
		}
		.item-top {
			margin-bottom: 10rpx;
			/* 仓库名称的样式 */
			&-left {
				font-weight: bold;
				color: #688bf2;
			}
		}
		.item-barcode {
			.apply-box {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;
				width: 180rpx;
				height: 90rpx;
				border: 2rpx solid #688bf2;
				border-radius: 10rpx;
				color: #688bf2;
				overflow: hidden;
				font-size: 24rpx;
				position: relative;
				box-sizing: border-box;
				.apply-num {
					display: block;
					text-align: center;
					height: 45rpx;
					line-height: 45rpx;
					&-left {
						font-weight: bold;
					}
				}
				.apply-text {
					color: #87a3f4;
					display: block;
					width: 100%;
					height: 45rpx;
					text-align: center;
					background-color: #e6edff;
					line-height: 45rpx;
				}
			}
			.apply-detail {
				color: #3c9cff;
				text-align: center;
				margin-top: 6rpx;
			}
		}
		.item-others {
			display: flex;
			margin-bottom: 10rpx;
			&-item {
				background-color: #ecf0ff;
				max-width: 280rpx;
				height: 48rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				border-radius: 10rpx;
				line-height: 48rpx;
				text-align: center;
				font-size: 28rpx;
				color: #707072;
				padding: 0 20rpx;
				margin-right: 20rpx;

				&:last-child {
					margin-right: 0;
				}
			}
		}
		.item-place {
			margin-bottom: 10px;
		}
		.item-flex {
			margin-bottom: 10rpx;
			display: flex;
			justify-content: space-between;
			white-space: nowrap;
			.flex-box {
				flex: 1;
				flex-shrink: 0;
				color: #767a82;
				&:first-child {
					margin-right: 10rpx;
				}
			}
		}
		/* 备注的样式 */
		.item-note {
			padding-top: 20rpx;
			margin-top: 10rpx;
			border-top: 1rpx solid #e5e5e5;
		}
	}
}

.bottom-btn {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;

	justify-content: space-around;
	height: 120rpx;
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

/* 单据详情页面内容结束 */
</style>
