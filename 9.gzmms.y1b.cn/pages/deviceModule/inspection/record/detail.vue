<template>
	<view class="width-full scrollable-content">
		<view class="width-full all-p-t-20 position-f" style="top: 0; left: 0; background: #f6f6f6; z-index: 50">
			<scroll-view class="width-full all-scroll-view" :scroll-x="true" style="height: 70rpx">
				<view
					v-for="(item, index) in scrollList"
					:key="index"
					class="blockAll scrollBox"
					@click="scrollTap(item.scrollId, index)"
				>
					<view class="display_column_center">
						<view class="scrollTitle">{{ item.name }}</view>
						<view v-if="index == choiceIndex" class="choiceFeetBox"></view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="width-full" style="height: 60rpx"></view>
		<view class="width-full all-p-t-30 all-p-lr-20">
			<topInfoVue :info="planData" id="one">
				<template v-slot:status>
					<div class="status-box">
						<uv-tags text="待提审" type="primary" v-if="orderStatus == 0" plain></uv-tags>
						<uv-tags text="待审核" type="warning" plain v-else-if="orderStatus == 1"></uv-tags>
						<uv-tags text="已完成" type="success" plain v-else-if="orderStatus == 2"></uv-tags>
						<uv-tags text="已驳回" type="error" plain v-else-if="orderStatus == 3"></uv-tags>
						<uv-tags text="已撤回" type="info" plain v-else-if="orderStatus == 4"></uv-tags>
						<div style="width: 160rpx; margin-left: -20rpx" v-else-if="orderStatus == -2">
							<uv-tags text="过期未检" type="error" plain></uv-tags>
						</div>
					</div>
				</template>
			</topInfoVue>
			<checkInfoVue id="twe" ref="checkInfoRef" :info="planData" disabled></checkInfoVue>
			<uv-form labelPosition="left" :model="formData" labelWidth="200rpx" ref="formRef">
				<view id="three" class="width-full contentBox position-r all-m-b-30 info-item">
					<view class="width-full all-p-t-30 display_row_center">
						<image class="iconBox" src="/static/otherImg/planFarmTitleIcon1.png"></image>
						<text class="all-m-l-10 t-c-000018 f-s-32 t-w-bold">检查项内容</text>
					</view>
					<view class="width-full t-c-000018 all-m-t-30" v-for="(item, index) in tableList" :key="index">
						<view class="width-full titleText">{{ index + 1 }}、{{ item.item_content }}</view>
						<view class="width-full display_row_center f-s-24 all-m-t-15">
							<text>检查方法：</text>
							<text class="t-c-6F6F6F">{{ item.method }}</text>
						</view>
						<view class="width-full display_row_center f-s-24 all-m-t-15">
							<text>标准说明：</text>
							<text class="t-c-6F6F6F">{{ item.std_explain || "--" }}</text>
						</view>
						<template v-if="item.record_method == 0">
							<!-- 0是单选 -->
							<uv-form-item label-width="0">
								<uv-radio-group v-model="item.val" placement="column" size="18" iconSize="18" labelSize="18">
									<uv-radio
										:customStyle="{
											margin: '8px',
											border: '2rpx solid',
											borderColor: newitem.is_normal ? '#FFDEDE ' : '#D6FBD9',
											borderRadius: '8rpx',
											height: '80rpx',
											paddingLeft: '20rpx',
											background: newitem.is_normal ? '#FFF6F6 ' : '#F5FFF7',
										}"
										v-for="(newitem, newindex) in item.result_content"
										:key="newindex"
										:label="newitem.val"
										:name="newindex"
										:disabled="true"
									></uv-radio>
								</uv-radio-group>
							</uv-form-item>
						</template>
						<template v-if="item.record_method == 1">
							<uv-form-item label-width="0">
								<!-- 1是多选 -->
								<uv-checkbox-group v-model="item.val" placement="column">
									<uv-checkbox
										:customStyle="{
											margin: '8px',
											border: '2rpx solid',
											borderColor: newitem.is_normal ? '#FFDEDE ' : '#D6FBD9',
											borderRadius: '8rpx',
											height: '80rpx',
											paddingLeft: '20rpx',
											background: newitem.is_normal ? '#FFF6F6 ' : '#F5FFF7',
										}"
										v-for="(newitem, newindex) in item.result_content"
										:key="newindex"
										:label="newitem.val"
										:name="newindex"
										:disabled="true"
									></uv-checkbox>
								</uv-checkbox-group>
							</uv-form-item>
						</template>
						<template v-if="item.record_method == 2">
							<!-- 2是输入数值 -->
							<view class="width-full display_row_center f-s-24 all-m-t-15">
								<text>上限：</text>
								<text class="t-c-6F6F6F">{{ item.upper_limit_val }}</text>
							</view>
							<view class="width-full display_row_center f-s-24 all-m-t-15">
								<text>下限：</text>
								<text class="t-c-6F6F6F">{{ item.lower_limit_val }}</text>
							</view>

							<uv-form-item label-width="0">
								<uv-input v-model="item.val" type="digit" :disabled="true"></uv-input>
							</uv-form-item>
						</template>
						<template v-if="item.record_method == 3">
							<!-- 3是文本 -->
							<uv-form-item label-width="0">
								<uv-input v-model="item.val" :disabled="true"></uv-input>
							</uv-form-item>
						</template>
						<uv-form-item label="备注说明:" label-width="100">
							<uv-input v-model="item.note" :disabled="true"></uv-input>
						</uv-form-item>
					</view>
				</view>
				<sceneImgVue
					id="four"
					:is_must_pho="is_must_pho"
					:is_report="is_report_rectify"
					ref="sceneImgRef"
					:disabled="true"
					@changeReport="isReportChange"
				></sceneImgVue>
				<rectifyInfoVue id="six" ref="rectifyInfoRef" v-if="rectify_status === 1" :disabled="true"></rectifyInfoVue>
				<signVue id="five" :is_must_sig="is_must_sig" ref="signRef" :disabled="true"></signVue>
				<approveFlowVue id="seven" :order_id="listId" :order_type="3" :status="orderStatus"></approveFlowVue>
			</uv-form>
		</view>
		<deitalBtnVue
			:disabled="checkSubmit()"
			:loading="detailLoading"
			:assoc_type="assoc_type"
			:status="orderStatus"
			@submit="handleSubmit"
			@recall="handleRecall"
			@approve="handleApprove"
			@reject="handleReject"
		></deitalBtnVue>
		<uv-toast ref="toast"></uv-toast>
		<submitTimeVue ref="submitTimeRef" @submit="submitConfirm"></submitTimeVue>
	</view>
</template>

<script>
import {
	getInspecRecordApproveApi,
	getInspecRecordDetailApi,
	getInspecRecordRecallApi,
	getInspecRecordRejectApi,
	getInspecRecordSubmitApi,
} from "@/api/device/inspection/record.js";
import { baseUrl } from "@/api/http/xhHttp.js";
import approveFlowVue from "@/pages/deviceModule/components/approveFlow/approveFlow.vue";
import checkInfoVue from "./components/checkInfo.vue";
import deitalBtnVue from "./components/deitalBtn.vue";
import rectifyInfoVue from "./components/rectifyInfo.vue";
import sceneImgVue from "./components/sceneImg.vue";
import signVue from "./components/sign.vue";
import submitTimeVue from "./components/submitTime.vue";
import topInfoVue from "./components/topInfo.vue";
import { changeDetail } from "./index.js";

export default {
	components: {
		sceneImgVue,
		signVue,
		topInfoVue,
		checkInfoVue,
		rectifyInfoVue,
		approveFlowVue,
		deitalBtnVue,
		submitTimeVue,
	},
	// 这里存放数据
	data() {
		return {
			choiceIndex: 0,
			scrollList: [
				{
					name: "设备信息",
					scrollId: "#one",
				},
				{
					name: "检查信息",
					scrollId: "#twe",
				},
				{
					name: "检查项内容",
					scrollId: "#three",
				},
				{
					name: "现场照片",
					scrollId: "#four",
				},
				{
					name: "签名",
					scrollId: "#five",
				},
				{
					name: "流程",
					scrollId: "#seven",
				},
			],
			planData: {},
			listId: 0,
			tableList: [],
			is_report_rectify: 0,
			is_must_pho: 1,
			is_must_sig: 1,
			rectify_status: 0,
			orderStatus: 0, //单据状态
			assoc_type: [],
			elementPositions: {}, //元素高度集合
			scrollContainerHeight: 0, //
			contentHeight: 0,
			scrollStatus: false, //控制滚动开关
			detailLoading: true,
		};
	},

	// 生命周期 - 监听页面加载
	onLoad(options) {
		this.listId = options.id ? Number(options.id) : 0;
		if (this.listId) {
			this.getEditData();
		}
	},
	// 生命周期 - 监听页面显示
	onShow() {},
	onPageScroll(e) {
		if (this.scrollStatus) return;
		this.scrollStatus = true;
		let scrollTop = e.scrollTop;
		for (const key in this.elementPositions) {
			if (scrollTop >= this.elementPositions[key]) {
				let index = this.scrollList.findIndex((item) => item.scrollId == key);
				this.choiceIndex = index;
			} else if (this.contentHeight + scrollTop >= this.scrollContainerHeight) {
				this.choiceIndex = 5;
			}
		}
		this.scrollStatus = false;
	},
	// 计算属性
	computed: {},
	// 方法集合
	methods: {
		/** 检查提交验收按钮是否禁用 */
		checkSubmit() {
			let { is_report_rectify, rectify_status } = this.planData;
			if (is_report_rectify === 1) {
				return rectify_status === 1 ? false : true;
			}
			return false;
		},
		async submitConfirm(submitData) {
			console.log("submitData", submitData);
			const result = await getInspecRecordSubmitApi({
				id: this.listId,
				...submitData
			});
			this.showMsg(result.msg);
		},
		handleSubmit() {
			let end_time = this.planData.task_time_end ?? ""
			this.$refs.submitTimeRef.open(end_time);
		},
		async handleRecall() {
			const result = await getInspecRecordRecallApi({ id: this.listId });
			this.showMsg(result.msg);
		},
		async handleApprove() {
			const result = await getInspecRecordApproveApi({ id: this.listId });
			this.showMsg(result.msg);
		},
		async handleReject() {
			const result = await getInspecRecordRejectApi({ id: this.listId });
			this.showMsg(result.msg);
		},
		showMsg(msg, type = "success") {
			this.$refs.toast.show({
				type,
				message: msg,
				complete: () => {
					this.getEditData();
				},
			});
		},
		getContentHeight() {
			uni.getSystemInfo({
				success: (info) => {
					this.contentHeight = info.windowHeight - 84;
				},
			});

			const query = uni.createSelectorQuery().in(this);
			query.select(".scrollable-content").boundingClientRect();
			query.exec((results) => {
				this.scrollContainerHeight = results[0].height;
			});
		},
		getElementPositions() {
			const query = uni.createSelectorQuery().in(this); // 限制查询作用域
			// const elements = this.$refs.rectifyInfoRef
			// 	? ["#one", "#twe", "#three", "#four", "#five", "#six"]
			// 	: ["#one", "#twe", "#three", "#four", "#five"];
			const elements = ["#one", "#twe", "#three", "#four", "#five", "#seven"];
			elements.forEach((elementId) => {
				query.select(elementId).boundingClientRect(); // 获取元素的位置
			});

			query.exec((results) => {
				results.forEach((result, index) => {
					const elementId = elements[index];
					this.elementPositions[elementId] = result.top - 45; // 存储元素到顶部的距离
				});
			});
		},

		scrollTap(id, indexid) {
			if (this.scrollStatus) return;
			let that = this;
			if (this.choiceIndex == indexid) return;
			const position = this.elementPositions[id];
			console.log("position", position);
			that.choiceIndex = indexid;
			if (typeof position === "number") {
				this.scrollStatus = true;
				if (indexid + 1 === this.scrollList.length) {
					uni.pageScrollTo({
						scrollTop: position + this.contentHeight,
						duration: 300,
					});
				} else {
					uni.pageScrollTo({
						scrollTop: position,
						duration: 300,
					});
				}

				setTimeout(() => {
					this.scrollStatus = false;
				}, 500);
			}
		},
		async getEditData() {
			uni.showLoading({
				title: "加载中",
				mask: true,
			});
			const result = await getInspecRecordDetailApi({ id: this.listId });
			let data = result.data;

			this.planData = data;
			this.orderStatus = data.status;
			// this.planId = data.plant_id;
			this.assoc_type = data.assoc_type;
			this.tableList = changeDetail(data.item_arr);

			this.$refs.checkInfoRef.formData.note = data.note;
			this.$refs.checkInfoRef.formData.task_time_start = data.task_time_start;
			this.$refs.checkInfoRef.formData.task_time_end = data.task_time_end;
			// this.$refs.checkInfoRef.formData.executor_uid = data.executor_uid
			// 	? data.executor_uid.split(",").map((m) => Number(m))
			// 	: []; //执行人
			this.$refs.checkInfoRef.formData.executor_name = data.executor_user_text;

			this.is_must_pho = data.is_must_pho;
			this.is_must_sig = data.is_must_sig;

			this.is_report_rectify = data.is_report_rectify; //是否整改
			this.$refs.sceneImgRef.fromData.rectify_uid = data.rectify_uid;
			this.$refs.sceneImgRef.fromData.rectify_name = data.rectify_uid_text;
			this.$refs.sceneImgRef.fromData.rectify_problem = data.rectify_problem;
			this.$refs.sceneImgRef.picture = data.picture;
			this.$refs.sceneImgRef.fileList1 = data.picture.map((item) => {
				return {
					url: baseUrl + item,
				};
			});

			this.$refs.signRef.imgUrl = data.sign ? baseUrl + data.sign : "";
			this.$refs.signRef.singImg = data.sign ?? "";

			this.rectify_status = data.rectify_status;
			if (data.is_report_rectify == 1) {
				this.$nextTick(() => {
					if (this.$refs.rectifyInfoRef) {
						this.$refs.rectifyInfoRef.formData.rectify_time = data.rectify_time || "";
						this.$refs.rectifyInfoRef.formData.rectify_feedback = data.rectify_feedback || "";
						this.$refs.rectifyInfoRef.rectify_picture = data.rectify_picture;
						this.$refs.rectifyInfoRef.fileList2 = data.rectify_picture.map((item) => {
							return {
								url: baseUrl + item,
							};
						});
						this.$refs.rectifyInfoRef.setRectifyList(data.rectify_list);
					}
				});
			}
			uni.hideLoading();
			this.detailLoading = false;
			this.$nextTick(() => {
				this.getElementPositions();
				this.getContentHeight();
			});
		},
	}
};
</script>
<style lang="scss">
page {
	background: #f6f6f6;
	padding-bottom: calc(120rpx +  constant(safe-area-inset-bottom));
    padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}
.scrollable-content {
	width: 100%;
	// height: 100vh;
}
.status-box {
	width: 130rpx;
	// height: 40rpx;
	font-size: 24rpx;
}

.info-item {
	padding: 0 30rpx;
	.item-header {
		border-bottom: 2rpx solid #e5e5e5;
		padding-bottom: 20rpx;
	}
}

.scrollBox {
	margin-right: 30rpx;
}

.scrollBox:first-child {
	margin-left: 30rpx;
}

.scrollTitle {
	font-size: 28rpx;
	color: #8b8b8b;
}

.choiceFeetBox {
	width: 56rpx;
	height: 6rpx;
	margin-top: 4rpx;
	background: #0171fd;
}

.contentBox {
	background: #ffffff;
	border-radius: 20rpx;
	box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(0, 0, 0, 0.06);

	.statusImg {
		width: 110rpx;
		height: 110rpx;
		right: 0;
		top: 0;
		z-index: 1;
	}

	.iconBox {
		width: 32rpx;
		height: 32rpx;
	}

	.leftTextBox {
		width: 176rpx;
		color: #6f6f6f;
		font-size: 28rpx;
		text-align: right;
	}

	.leftTextBox1 {
		width: 176rpx;
		color: #6f6f6f;
		font-size: 28rpx;
		text-align: right;
		position: relative;
	}

	.leftTextBox1::after {
		position: absolute;
		content: "*";
		color: red;
		left: -15rpx;
		top: 3px;
	}

	.rightBox {
		height: 62rpx;
		color: #6f6f6f;
		font-size: 24rpx;
		background: #fbfbfb;
		border: 2rpx solid #f6f6f6;
		border-radius: 6rpx;
	}

	.rightBox1 {
		height: 62rpx;
		color: #6f6f6f;
		font-size: 24rpx;
		background: #fefeff;
		border: 2rpx solid #e3f0ff;
		border-radius: 6rpx;
	}

	.rightIconBox {
		width: 38rpx;
		height: 38rpx;
	}
	.title-label {
		font-size: 28rpx;
		font-weight: 700;
		color: #000018;
		position: relative;
	}

	.titleText {
		font-size: 28rpx;
		font-weight: 700;
		color: #000018;
		position: relative;
	}

	.titleText::after {
		position: absolute;
		top: 3px;
		content: "*";
		color: red;
		margin: 0rpx 0rpx 0rpx 6rpx;
	}

	.choiceBox0 {
		height: 88rpx;
		background: #fefeff;
		border: 2rpx solid #e3f0ff;
		border-radius: 6rpx;
	}

	.roundBox {
		width: 32rpx;
		height: 32rpx;
		background: #ffffff;
		border: 2rpx solid #c5c5c5;
		border-radius: 50%;
	}

	.choiceBox1 {
		height: 88rpx;
		background: #fff6f6;
		border: 2rpx solid #ffdede;
		border-radius: 6rpx;
	}

	.choiceBox2 {
		height: 88rpx;
		background: #f5fff7;
		border: 2rpx solid #d6fbd9;
		border-radius: 6rpx;
	}

	.choiceBox3 {
		height: 88rpx;
		background: #fefeff;
		border: 2rpx solid #e3f0ff;
		border-radius: 6rpx;
	}

	.rightBox2 {
		height: 52rpx;
		color: #d4d4d4;
		border: 2rpx solid #f2f2f2;
		border-radius: 6rpx;
	}

	.nameBox {
		height: 176rpx;
		color: #acacac;
		font-size: 24rpx;
		background: #f8f8f8;
		border-radius: 10rpx;
	}
}

.feetBox {
	position: fixed;
	bottom: 0;
	left: 0;
	padding: 40rpx 40rpx 50rpx;
	background: #fff;
	z-index: 20;
}

.feetButBox {
	height: 80rpx;
	line-height: 80rpx;
	border-radius: 80rpx;
	background: #038cf8;
}

.upImgBox {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;

	.fourBox {
		width: 116rpx;
		height: 116rpx;
		color: #acacac;
		background: #efefef;
	}

	.fourBox1 {
		width: 116rpx;
		height: 116rpx;
		background-image: url("/static/otherImg/planFarmIcon3.png");
		background-size: 100% 100%;
	}
}
</style>
