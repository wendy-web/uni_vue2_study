<template>
	<view class="width-full scrollable-content">
		<view class="width-full all-p-t-20 position-f" style="top: 0; left: 0; background: #f6f6f6; z-index: 50">
			<scroll-view class="width-full all-scroll-view" :scroll-x="true" style="height: 70rpx">
				<view class="blockAll scrollBox"
					v-for="(item, index) in scrollList" :key="index"
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
			<planInfo :info="planData" id="one">
				<view slot="status">
				<uv-tags text="待提审" size="mini" plain type="primary" v-if="orderStatus == 0"></uv-tags>
                <uv-tags text="待验证" size="mini" plain v-if="orderStatus == 1"></uv-tags>
                <uv-tags text="已完成" size="mini" plain type="success" v-if="orderStatus == 2"></uv-tags>
                <uv-tags text="已驳回" size="mini" plain type="error" v-if="orderStatus == 3"></uv-tags>
                <uv-tags text="已撤回" size="mini" plain type="error" v-if="orderStatus == 4"></uv-tags>
				</view>
			</planInfo>
			<topInfoVue :info="planData" id="twe"></topInfoVue>
			<checkInfoFace id="three"
				ref="checkInfoRef"
				:info="planData"
				:disabled="isDisableOperateType"
			></checkInfoFace>
			<checkProject
				id="four"
				ref="checkProjectInfoRef"
				:info="planData"
				:disabled="isDisableOperateType"
			></checkProject>
			<changeUnit
				id="five"
				ref="changeUnitRef"
				:disabled="isDisabledReported"
				:isReplace="planData.is_replace"
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
			<approveFlowVue
				id="six"
				:order_id="listId"
				:order_type="2"
				:status="orderStatus"
			></approveFlowVue>
		</view>
		<operateBtn
			@save="submit(0)"
			@submit="submit(1)"
			:disabled="isDisableOperateType"
			:loading="detailLoading"
			:info="planData"
			:operateType="operateType"
		></operateBtn>
	</view>
</template>
<script>
import { getMaintenancePlanApi, OrderCreateApi, OrderDetailsApi, OrderEditApi } from "@/api/device/maintain/order.js";
import approveFlowVue from "@/pages/deviceModule/components/approveFlow/approveFlow.vue";
import changeDownItem from "@/pages/deviceModule/components/changeItem/changeDownItem.vue";
import changeItem from "@/pages/deviceModule/components/changeItem/changeItem.vue";
import { setBarTitle } from '@/utils/method.js';
import changeUnit from "./components/changeUnit.vue";
import checkInfoFace from "./components/checkInfoFace.vue";
import checkProject from "./components/checkProject.vue";
import operateBtn from "./components/operateBtn.vue";
import planInfo from "./components/planInfo.vue";
import topInfoVue from "./components/topInfo.vue";
export default {
	components: {
		changeUnit,
		planInfo,
		topInfoVue,
		checkProject,
		operateBtn,
		approveFlowVue,
		checkInfoFace,
		changeItem,
		changeDownItem
	},
	data() {
		return {
			listId: 0,
			choiceIndex: 0,
			pageScrollNums: 0, //页面当前滚动
			scrollList: [
			{
					name: "计划信息",
					scrollId: "#one",
				},
				{
					name: "设备信息",
					scrollId: "#twe",
				},
				{
					name: "保养处理情况",
					scrollId: "#three",
				},
				{
					name: "保养项目",
					scrollId: "#four",
				},
				{
					name: "更换备件",
					scrollId: "#five",
				},
				{
					name: "流程",
					scrollId: "#six",
				},
			],
			planData: {},
			tableList: [],
			rectify_status: -1, //编辑时记录一下返回的整改状态;
			orderStatus: 0, //单据状态
			elementPositions: {},
			scrollContainerHeight: 0,
			contentHeight: 0,
			scrollStatus: false,
			detailLoading: true,
			operateType: 0, // 进入类型，1 新建 2 编辑 3查看
			isReplaceShop: false,
		};
	},

	// 生命周期 - 监听页面加载
	onLoad(options) {
		this.listId = options.id ? Number(options.id) : 0;
		this.operateType = options.operateType ? Number(options.operateType) : 3;
		setBarTitle(this.operateType, '保养工单');
		if(this.listId) {
			if(this.operateType == 1) {
				this.addInitData();
			} else {
				this.initData();
			}
		}
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
		isDisableOperateType() {
			if(this.operateType == 3) return true;
			return false;
		},
		isDisabledReported() {
			// 如果是如果编辑页,为整改人角色,就返回true,禁止修改, 或者为已整改状态也禁止修改
			if (this.isDisableOperateType || this.rectify_status === 1)  return true;
			return false;
		}
	},
	methods: {
		reportChangeHandle(val) {
			this.planData.is_replace = val;
			this.isReplaceShop = Boolean(val);
		},
		async addInitData() {
			this.detailLoading = true;
			const result = await getMaintenancePlanApi({ id: this.listId });
			this.planData = result.data;
			this.orderStatus = result.data.status;
			this.detailLoading = false;
			if(this.planData) {
				this.$refs.checkInfoRef.upDateForm(this.planData);
				const { cycle_item } = this.planData;
				this.$refs.checkProjectInfoRef.upDateForm(cycle_item);
			}
		},
		async initData() {
			this.detailLoading = true;
			const result = await OrderDetailsApi({ id: this.listId });
			this.planData = result.data;
			this.orderStatus = result.data.status;
			this.detailLoading = false;
			if(this.planData) {
				this.$refs.checkInfoRef.upDateForm(this.planData);
				const { maintenance_project } = this.planData;
				this.$refs.checkProjectInfoRef.upDateForm(maintenance_project);
				this.isReplaceShop = Boolean(this.planData.is_replace);
			}
		},
		selectIdHandle(item) {
			// 选择设备单号
			this.$refs.selectIdListRef.open();
		},
		// apiStatus:0是保存 1是提交
		async submit(apiStatus = 0) {
			uni.showLoading({
				mask: true,
				title: apiStatus == 1 ? "正在提交中~" : "正在保存中~",
			});
			let validateCheckRes = this.$refs.checkInfoRef.validateForm();
			if (!validateCheckRes) return;
			const { is_replace } = this.planData;
			let validateCheckProjectRes = this.$refs.checkProjectInfoRef.validateForm();
			if (!validateCheckProjectRes) return;
			// 更换备件
			if(is_replace) {
				let validateChangeRes = this.$refs.changeItemRef.validateForm();
				if (!validateChangeRes) return;
				let validateChangeDownRes = this.$refs.changeDownItemRef.validateForm();
				if (!validateChangeDownRes) return;
			}

			let checkInfo = this.$refs.checkInfoRef.formData;
			const img_info = this.$refs.checkInfoRef.img_info;
			let maintenance_project = this.$refs.checkProjectInfoRef.maintenance_project;
			const { maintenance_start_time, complete_time, director_uid, other_uid, outsourced_units, maintenance_desc, maintenance_cost } = checkInfo;

			let sendData = {
				maintenance_start_time,
				complete_time,
				director_uid,
				other_uid,
				outsourced_units,
				maintenance_desc,
				maintenance_cost,
				img_info,
				maintenance_project,
				is_replace: is_replace || 0,
			};
			let submitRequestApi = '';
			// 新建工单
			if(this.operateType == 1) {
				sendData.plan_id = this.listId;
				submitRequestApi = OrderCreateApi;
			} else {
				sendData.id = this.listId
				submitRequestApi = OrderEditApi;
			}
			if(is_replace) {
				let rec_arr = this.$refs.changeItemRef.rec_arr;
				let down_arr = this.$refs.changeDownItemRef.down_arr;
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
				const result = await submitRequestApi(sendData);
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
			const elements = ["#one", "#twe", "#three", "#four", "#five", "#six"];
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
