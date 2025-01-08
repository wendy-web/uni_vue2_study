<template>
	<view class="width-full scrollable-content">
		<view class="width-full all-p-t-20 position-f" style="top: 0; left: 0; background: #f6f6f6; z-index: 50">
			<scroll-view class="width-full all-scroll-view" :scroll-x="true" style="height: 70rpx">
				<view v-for="(item, index) in scrollList" :key="index"
					class="blockAll scrollBox"
					@click="scrollTap(item.scrollId, index)">
					<view class="display_column_center">
						<view class="scrollTitle">{{ item.name }}</view>
						<view v-if="index == choiceIndex" class="choiceFeetBox"></view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="width-full" style="height: 90rpx"></view>
		<view class="width-full all-p-t-30 all-p-lr-20">
			<topInfoVue
				id="one"
				:info="planData"
				:disabled="isDisableOperateType"
				@changeEqId="changeEqIdHandle"
			></topInfoVue>
			<block v-if="scrollList.length > 1">
				<checkInfoVue
					id="twe" ref="checkInfoRef"
					:info="planData"
					:classTypeOptions="classTypeOptions"
					:disabled="isDisableOperateType"
					:productLineOptions="productLineOptions"
				></checkInfoVue>
				<checkInfoFace
					id="three"
					ref="checkInfoFaceRef"
					:info="planData"
					:disabled="isDisableOperateType"
				></checkInfoFace>
				<changeUnit
					id="four"
					ref="changeUnitRef"
					:isReplace="planData.is_replace"
					:disabled="isDisabledReported"
					@changeReport="reportChangeHandle"
				></changeUnit>
				<block v-if="isReplaceShop">
					<changeItem
						ref="changeItemRef"
						:listId="listId"
						:info="planData"
						:disabled="isDisabledReported"
					></changeItem>
					<changeDownItem
						ref="changeDownItemRef"
						:listId="listId"
						:info="planData"
						:equipment_id="planData.equipment_id"
						:disabled="isDisabledReported"
					></changeDownItem>
				</block>
			</block>
			<!-- 流程 -->
			<approveFlowVue
				id="five"
				:order_id="listId"
				:order_type="1"
				:status="orderStatus"
			></approveFlowVue>
		</view>
		<!-- 操作的按钮 -->
		<operateBtn
			@save="submit(0)"
			@submit="submit(1)"
			:loading="detailLoading"
			:info="planData"
			:disabled="isDisableOperateType"
			:operateType="operateType"
		></operateBtn>
	</view>
</template>
<script>
import { getRepairDetailApi, repairOrderApi } from "@/api/device/maintain/repair.js";
import approveFlowVue from "@/pages/deviceModule/components/approveFlow/approveFlow.vue";
import changeDownItem from "@/pages/deviceModule/components/changeItem/changeDownItem.vue";
import changeItem from "@/pages/deviceModule/components/changeItem/changeItem.vue";
import { setBarTitle } from '@/utils/method.js';
import { mapActions, mapGetters } from "vuex";
import changeUnit from "./components/changeUnit.vue";
import checkInfoVue from "./components/checkInfo.vue";
import checkInfoFace from "./components/checkInfoFace.vue";
import operateBtn from "./components/operateBtn.vue";
import topInfoVue from "./components/topInfo.vue";
let eventChannel = undefined;
export default {
	components: {
		changeUnit,
		topInfoVue,
		checkInfoVue,
		operateBtn,
		approveFlowVue,
		checkInfoFace,
		changeItem,
		changeDownItem
	},
	data() {
		return {
			listId: 0,
			planData: { equipment_id: ''},
			classTypeOptions: [
				{
					label: "A",
					value: 1,
				},
				{
					label: "B",
					value: 2,
				},
				{
					label: "C",
					value: 3,
				},
			],
			choiceIndex: 0,
			pageScrollNums: 0, //页面当前滚动
			scrollList: [
				{
					name: "设备信息",
					scrollId: "#one",
				},
				{
					name: "故障信息",
					scrollId: "#twe",
				},
				{
					name: "维修处理情况",
					scrollId: "#three",
				},
				{
					name: "更换备件",
					scrollId: "#four",
				},
				{
					name: "流程",
					scrollId: "#five",
				},
			],
			rectify_status: -1, // 编辑时记录一下返回的整改状态;
			orderStatus: 0, // 单据状态
			elementPositions: {},
			scrollContainerHeight: 0,
			contentHeight: 0,
			scrollStatus: false,
			detailLoading: true,
			operateType: 0, // 进入类型，1 新建 2 编辑 3查看
			isReplaceShop: false,
		};
	},
	async onLoad(options) {
		if(!this.productLineOptions) this.initGetEqBaseSelect();
		this.listId = options.id ? Number(options.id) : 0;
		this.operateType = options.operateType ? Number(options.operateType) : 3;
		setBarTitle(this.operateType, '设备维修单');
		if(this.listId) this.initData();
		if(this.operateType == 1) {
			this.scrollList = this.scrollList.slice(0, 1);
			return;
		};
		this.$nextTick(() => {
			this.getElementPositions();
			this.getContentHeight();
		});
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
	computed: {
		...mapGetters(['productLineOptions']),
		isDisableOperateType() {
			if(this.operateType == 3) return true;
			return false;
		},
		isDisabledReported() {
			// 如果是如果编辑页,为整改人角色,就返回true,禁止修改, 或者为已整改状态也禁止修改
			if (this.isDisableOperateType || this.rectify_status === 1) return true;
			return false;
		}
	},
	watch: {
		'planData.equipment_id': function(newValue, oldValue) {
			if(newValue && !oldValue) {
				this.scrollList = this.scrollList.concat([
					{
						name: "故障信息",
						scrollId: "#twe",
					},
					{
						name: "维修处理情况",
						scrollId: "#three",
					},
					{
						name: "更换备件",
						scrollId: "#four",
					},
					{
						name: "流程",
						scrollId: "#five",
					},
				]);
				this.$nextTick(() => {
					this.getElementPositions();
					this.getContentHeight();
				});
			}
		}
	},
	methods: {
		...mapActions({
			initGetEqBaseSelect: "device/initGetEqBaseSelect",
		}),
		changeEqIdHandle(selItem) {
			const { id, bar_title, barcode, spec, use_dept_text, save_addr_text } = selItem;
			this.planData.equipment_id = id;
			this.planData.bar_title = bar_title;
			this.planData.barcode = barcode;
			this.planData.spec = spec;
			this.planData.use_dept_text = use_dept_text;
			this.planData.save_addr_text = save_addr_text;
		},
		async initData() {
			this.detailLoading = true;
			const result = await getRepairDetailApi({ id: this.listId });
			this.planData = result.data;
			this.orderStatus = result.data.status;
			this.detailLoading = false;
			if(this.planData) {
				this.$refs.checkInfoRef.upDateForm(this.planData);
				this.$refs.checkInfoFaceRef.upDateForm(this.planData);
				this.isReplaceShop = Boolean(this.planData.is_replace);
			}
		},
		reportChangeHandle(val) {
			this.planData.is_replace = val;
			this.isReplaceShop = Boolean(val);
		},
		// apiStatus:0 是保存 1 是提交
		async submit(apiStatus = 0) {
			uni.showLoading({
				mask: true,
				title: apiStatus == 1 ? "正在提交中~" : "正在保存中~",
			});
			const { equipment_id, is_replace } = this.planData;
			if(!equipment_id) {
				uni.showToast({
					icon: "none",
					title: "请选择设备",
				});
				return;
			}
			let validateCheckRes = this.$refs.checkInfoRef.validateForm();
			if (!validateCheckRes) return;
			let validateCheckFaceRes = this.$refs.checkInfoFaceRef.validateForm(apiStatus);
			if (!validateCheckFaceRes) return;
			// 更换备件
			if(is_replace) {
				let validateChangeRes = this.$refs.changeItemRef.validateForm();
				if (!validateChangeRes) return;
				let validateChangeDownRes = this.$refs.changeDownItemRef.validateForm();
				if (!validateChangeDownRes) return;
			}

			// 故障信息
			let checkInfo = this.$refs.checkInfoRef.formData;
			let fault_picture = this.$refs.checkInfoRef.fault_picture;
			const { occurrence_time, repair_user_id, fault_body, product_line, fault_note, class_type } = checkInfo;
			// 维修情况
			let checkInfoFace = this.$refs.checkInfoFaceRef.formData;
			const { repair_type, fault_type, fault_reason, repair_director,other_repair_director,
				repair_start_time, repair_end_time, is_stop, stop_time, outsourcing_id, repair_price,
				repair_note  } = checkInfoFace;
			let repair_picture = this.$refs.checkInfoFaceRef.repair_picture;
			// 更换设备
			let sendData = {
				class_type,
				equipment_id,
				status: apiStatus,

				occurrence_time,
				repair_user_id,
				fault_body,
				product_line,
				fault_note,
				fault_picture,

				repair_type,
				fault_type,
				fault_reason,
				repair_director,
				other_repair_director,
				repair_start_time,
				repair_end_time,
				is_stop: Number(is_stop),
				stop_time,
				outsourcing_id,
				repair_price,
				repair_note,
				repair_picture,
				is_replace: is_replace || 0,
			};
			if(this.listId) sendData.id = this.listId;
			if(is_replace) {
				let rec_arr = this.$refs.changeItemRef.repair_parts;
				let down_arr = this.$refs.changeDownItemRef.chage_parts;
				down_arr = down_arr.map(res => {
					const { is_have_unique, down_date, unique_label_detail, parts_id, stock_id } = res;
					let down_num = res.down_num;
					if(is_have_unique) down_num = unique_label_detail.length;
					return {
						down_date: down_date,
						down_num,
						id: res.id,
						parts_id,
						stock_id,
						unique_label_detail
					}
				})
				sendData.rec_arr = rec_arr;
				sendData.down_arr = down_arr;
			}
			console.log("sendData", sendData);
			uni.hideLoading();
			try {
				const result = await repairOrderApi(sendData);
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
		// 滚动到对应位置
		scrollTap(id, indexid) {
			if (this.scrollStatus) return;
			let that = this;
			if (this.choiceIndex == indexid) return;
			const position = this.elementPositions[id];
			if(!position) return;
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
				success: (info) => this.contentHeight = info.windowHeight - 84
			});
			const query = uni.createSelectorQuery().in(this);
			query.select(".scrollable-content").boundingClientRect();
			query.exec((results) => {
				this.scrollContainerHeight = results[0].height;
			});
		},
		getElementPositions() {
			const query = uni.createSelectorQuery().in(this);
			const elements = ["#one", "#twe", "#three", "#four", "#five"];
			elements.forEach((elementId) => {
				query.select(elementId).boundingClientRect(); // 获取元素的位置
			});
			query.exec((results) => {
				results.forEach((result, index) => {
					const elementId = elements[index];
					this.elementPositions[elementId] = result.top - 45; // 存储元素到顶部的距离
				});
			});
		}
	}
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
