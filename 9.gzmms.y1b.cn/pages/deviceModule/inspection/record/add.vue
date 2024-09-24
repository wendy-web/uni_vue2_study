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
		<view class="width-full" style="height: 90rpx"></view>
		<view class="width-full all-p-t-30 all-p-lr-20">
			<topInfoVue :info="planData" id="one"></topInfoVue>
			<checkInfoVue id="twe" ref="checkInfoRef" :info="planData" :disabled="isShowRectifyCondition"></checkInfoVue>
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
								<uv-radio-group v-model="item.val" placement="column" size="18" iconSize="18">
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
										:disabled="isShowRectifyCondition"
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
										:disabled="isShowRectifyCondition"
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
								<uv-input
									v-model="item.val"
									type="digit"
									placeholder="请输入"
									@blur="handleBlur($event, index)"
									:disabled="isShowRectifyCondition"
								></uv-input>
							</uv-form-item>
						</template>
						<template v-if="item.record_method == 3">
							<!-- 3是文本 -->
							<uv-form-item label-width="0">
								<uv-input v-model="item.val" placeholder="请输入" :disabled="isShowRectifyCondition"></uv-input>
							</uv-form-item>
						</template>
						<uv-form-item label="备注说明:" label-width="100">
							<uv-input v-model="item.note" placeholder="非必填" :disabled="isShowRectifyCondition"></uv-input>
						</uv-form-item>
					</view>
				</view>

				<sceneImgVue
					id="four"
					:is_must_pho="is_must_pho"
					:is_report="is_report_rectify"
					ref="sceneImgRef"
					:disabled="isDisabledReported"
					@changeReport="isReportChange"
				></sceneImgVue>
				<rectifyInfoVue
					ref="rectifyInfoRef"
					v-if="isShowRectifyCondition || rectify_status === 1"
					:disabled="!isShowRectifyCondition && rectify_status === 1"
				></rectifyInfoVue>
				<signVue id="five" :is_must_sig="is_must_sig" ref="signRef" :disabled="isShowRectifyCondition"></signVue>
				<approveFlowVue id="seven" :order_id="listId" :order_type="3" :status="orderStatus"></approveFlowVue>
			</uv-form>
		</view>
		<addBtnVue
			@save="submit(0)"
			@submit="submit(1)"
			:disabled="isDisabledSubmit"
			:loading="detailLoading"
		></addBtnVue>
	</view>
</template>

<script>
import { getExecuteCheckApi } from "@/api/device/common/index.js";
import { getInspecRecordAddEditApi, getInspecRecordDetailApi } from "@/api/device/inspection/record.js";
import { baseUrl } from "@/api/http/xhHttp.js";
import approveFlowVue from "@/pages/deviceModule/components/approveFlow/approveFlow.vue";
import { onlyNumPoint } from "@/utils/device.js";
import addBtnVue from "./components/addBtn.vue";
import checkInfoVue from "./components/checkInfo.vue";
import rectifyInfoVue from "./components/rectifyInfo.vue";
import sceneImgVue from "./components/sceneImg.vue";
import signVue from "./components/sign.vue";
import topInfoVue from "./components/topInfo.vue";
import { changeDetail, changeTable, getCheckTotal } from "./index.js";

export default {
	components: {
		sceneImgVue,
		signVue,
		topInfoVue,
		checkInfoVue,
		rectifyInfoVue,
		addBtnVue,
		approveFlowVue,
	},
	// 这里存放数据
	data() {
		return {
			choiceIndex: 0,
			pageScrollNums: 0, //页面当前滚动
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
			formData: {
				task_time_start: "", ///任务开始时间
				task_time_end: "", //任务结束时间
				executor_uid: [], //执行人uid
				executor_name: "", //执行人名称集合
				note: "", //备注
			},
			image2: "",
			is_must_pho: 1, //是否必须上传现场照片
			is_must_sig: 1, // 是否必须签名
			// equipment_id: 0, //记录设备id
			// plan_details_no: "", //计划明细单号
			tableList: [],

			picture: [], //现场照片
			sign: "", //签名图片
			assoc_type: [],
			rectify_status: -1, //编辑时记录一下返回的整改状态;
			pageType: 1, // 1新建2编辑
			orderType: 0, //如果从列表页面点击去整改按钮进来的 则设为1
			partData: {
				plan_details_no: "", // 计划明细单号
				eq_id: 0, // 设备id
				use_dept_id: "", //
				use_dept_names: "",
			},
			listId: 0,
			planId: 0, //计划id
			is_report_rectify: 0,
			orderStatus: 0, //单据状态
			elementPositions: {},
			scrollContainerHeight: 0,
			contentHeight: 0,
			scrollStatus: false,
			detailLoading: true,
		};
	},

	// 生命周期 - 监听页面加载
	onLoad(options) {
		console.log("options", options);
		this.planId = options.planId ? Number(options.planId) : 0;
		this.listId = options.id ? Number(options.id) : 0;
		this.pageType = this.listId ? 2 : 1;
		this.orderType = options.orderType ? Number(options.orderType) : 0;
		if (this.pageType === 2) {
			uni.setNavigationBarTitle({
				title: "点巡检执行编辑",
			});
		}
		if (this.planId) {
			this.getPlanData();
		}
		if (this.listId) {
			this.getEditData();
		}
	},
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
	watch: {
		tableList: {
			deep: true,
			handler(newVal) {
				let totalCount = getCheckTotal(this.tableList);
				console.log("totalCount111", totalCount);
				if (totalCount >= 1) {
					this.is_report_rectify = 1;
				} else {
					this.is_report_rectify = 0;
				}
			},
		},
	},
	// 计算属性
	computed: {
		/** 判断如果是编辑页,且为整改人角色,就返回true,限制其他可操作项,显示整改情况组件(可操作) */
		isShowRectifyCondition() {
			let result = false;
			if (this.pageType == 2 && this.assoc_type.includes(6) && this.orderType) {
				return (result = true);
			}
			return result;
		},
		/** 判断是否禁止修改是否上报整改表单 */
		isDisabledReported() {
			// 如果是如果编辑页,为整改人角色,就返回true,禁止修改, 或者为已整改状态也禁止修改
			if (this.isShowRectifyCondition || this.rectify_status === 1) {
				return true;
			} else {
				return false;
			}
		},
		/** 判断是否可以操作 提交验收按钮 */
		isDisabledSubmit() {
			// console.log("this.is_report_rectify", this.is_report_rectify);
			if (this.is_report_rectify === 1) {
				return this.rectify_status === 1 ? false : true;
			}
			return false;
		},
	},
	// 方法集合
	methods: {
		isReportChange(val) {
			this.is_report_rectify = val;
		},
		// apiStatus:0是保存 1是提交
		async submit(apiStatus = 0) {
			uni.showLoading({
				mask: true,
				title: apiStatus == 1 ? "正在提交中~" : "正在保存中~",
			});
			let validateCheckRes = this.$refs.checkInfoRef.validateForm();

			if (!validateCheckRes) return;

			const findRes = this.tableList.some((item) => item.val === undefined);
			if (findRes) {
				uni.showToast({
					icon: "none",
					title: "请将检查项内容填写完整",
				});
				return;
			}

			let validateRes = this.$refs.sceneImgRef.validateForm();
			if (!validateRes) return;

			let validateSingRes = this.$refs.signRef.validateForm();
			if (!validateSingRes) return;

			let item = changeTable(this.tableList, this.listId);

			let checkInfo = this.$refs.checkInfoRef.formData;
			let sceneImgInfo = this.$refs.sceneImgRef.fromData;
			let picture = this.$refs.sceneImgRef.picture; //现场图片
			let is_report_rectify = this.is_report_rectify;
			let sign = this.$refs.signRef.singImg;

			let rectifyInfoRef = this.$refs.rectifyInfoRef;
			if (this.isShowRectifyCondition) {
				let validateRectifyRes = rectifyInfoRef.validateRectify();
				if (!validateRectifyRes) return;
			}

			let sendData = {
				id: this.listId ? this.listId : undefined,
				plant_id: this.planId,
				plan_details_no: this.partData.plan_details_no,
				eq_id: this.partData.eq_id,
				plan_start_time: this.planData.plan_start_time,
				use_dept_id: this.partData.use_dept_id,
				use_dept_names: this.partData.use_dept_names,
				task_time_start: checkInfo.task_time_start,
				task_time_end: checkInfo.task_time_end,
				executor_uid: checkInfo.executor_uid.join(","),
				note: checkInfo.note,
				cycle_type: this.planData.cycle_type,
				status: apiStatus,
				picture: picture,
				sign: sign,
				item: item,
				is_report_rectify: is_report_rectify,
				rectify_problem: is_report_rectify ? sceneImgInfo.rectify_problem : undefined,
				rectify_uid: is_report_rectify ? sceneImgInfo.rectify_uid : undefined,
				// 整改内容
				rectify_time: rectifyInfoRef ? rectifyInfoRef.formData.rectify_time : undefined,
				rectify_feedback: rectifyInfoRef ? rectifyInfoRef.formData.rectify_feedback : undefined,
				rectify_picture: rectifyInfoRef ? rectifyInfoRef.rectify_picture : undefined,
				rectify_list: rectifyInfoRef ? changeTable(rectifyInfoRef.rectify_list, this.listId) : undefined,
				rectify_status: this.isShowRectifyCondition ? 1 : undefined,
			};
			console.log("sendData", sendData);
			uni.hideLoading();
			try {
				const result = await getInspecRecordAddEditApi(sendData);
				let content = `${result.msg},请回到列表页面查看~`;
				uni.showModal({
					title: "温馨提示",
					content: content,
					showCancel: false,
					confirmText: "我知道了",
					success: (res) => {
						if (res.confirm) {
							console.log("用户点击确定");
							uni.redirectTo({
								url: "./list",
							});
						}
					},
				});
			} finally {
				uni.hideLoading();
			}
		},

		// 编辑时获取详情数据
		async getEditData() {
			uni.showLoading({
				title: "加载中",
				mask: true,
			});
			const result = await getInspecRecordDetailApi({ id: this.listId });
			let data = result.data;
			this.planData = data;
			this.planId = data.plant_id;
			this.assoc_type = data.assoc_type;
			this.orderStatus = data.status;

			this.partData.plan_details_no = data.plan_details_no;
			this.partData.eq_id = data.equipment_id;
			this.partData.use_dept_names = data.use_dept_names;
			this.partData.use_dept_id = data.use_dept_id;

			this.$refs.checkInfoRef.formData.note = data.note;
			this.$refs.checkInfoRef.formData.task_time_start = data.task_time_start;
			this.$refs.checkInfoRef.formData.task_time_end = data.task_time_end;
			this.$refs.checkInfoRef.formData.executor_uid = data.executor_uid
				? data.executor_uid.split(",").map((m) => Number(m))
				: []; //执行人
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
					noBaseUrl: item,
				};
			});

			this.$refs.signRef.imgUrl = data.sign ? baseUrl + data.sign : "";
			this.$refs.signRef.singImg = data.sign ?? "";

			this.tableList = changeDetail(data.item_arr);
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
								noBaseUrl: item,
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

		// 获取计划数据
		async getPlanData() {
			uni.showLoading({
				title: "加载中",
				mask: true,
			});
			const result = await getExecuteCheckApi({ id: this.planId });
			let data = result.data;
			this.planData = data;
			this.tableList = data.cycle;
			this.is_must_pho = data.is_must_pho;
			this.is_must_sig = data.is_must_sig;
			this.partData.plan_details_no = data.plan_details_no;
			this.partData.eq_id = data.equipment_id;
			this.partData.use_dept_names = data.equipment.use_dept_names;
			this.partData.use_dept_id = data.equipment.use_dept_id;
			uni.hideLoading();
			this.detailLoading = false;
			this.$nextTick(() => {
				this.getElementPositions();
				this.getContentHeight();
			});
		},
		// 数值框失去焦点时触发
		handleBlur(e, index) {
			let value = onlyNumPoint(e, 4);
			this.$set(this.tableList[index], "val", value);
		},
		// 滚动到对应位置
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

		getBackTap() {
			uni.navigateBack();
		},
	},
};
</script>
<style lang="scss">
page {
	background: #f6f6f6;
	padding-bottom: calc(120rpx +  constant(safe-area-inset-bottom));
    padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
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
