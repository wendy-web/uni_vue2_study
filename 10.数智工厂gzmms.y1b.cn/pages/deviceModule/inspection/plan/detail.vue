<template>
	<view class="width-full scrollable-content">
		<view class="width-full contentBox position-r all-m-b-30">
			<view class="width-full all-p-lr-30 all-p-tb-30 flex-between" style="border-bottom: 2rpx solid #efefef">
				<view class="">
					<image class="iconBox" src="/static/otherImg/equipmentImg1.png"></image>
					<text class="all-m-l-10 t-c-000018 f-s-32 t-w-bold">{{ planData.bar_title }}</text>
				</view>
				<div class="status-box">
					<uv-tags text="未开始" type="info" plain v-if="orderStatus == 0"></uv-tags>
					<uv-tags text="待检查" type="warning" plain v-else-if="orderStatus == 1"></uv-tags>
					<uv-tags text="检查中" type="success" plain v-else-if="orderStatus == 2"></uv-tags>
					<uv-tags text="待审核" type="primary" plain v-else-if="orderStatus == 3"></uv-tags>
					<uv-tags text="停用" type="error" plain v-else-if="orderStatus == 4"></uv-tags>
				</div>
			</view>
			<view class="width-full all-p-t-20 all-p-lr-30 all-p-b-30 display_column_center f-s-28">
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">设备编码：</text>
					<text class="t-c-272727">{{ planData.asset_no }}</text>
				</view>
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">设备型号：</text>
					<text class="t-c-272727">{{ planData.spec || "--" }}</text>
				</view>
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">使用部门：</text>
					<text class="t-c-272727">{{ planData.use_dept_names || "--" }}</text>
				</view>
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">使用位置：</text>
					<text class="t-c-272727">{{ planData.use_places || "-" }}</text>
				</view>
				<!-- <view class="all-p-b-35 all-p-t-20 t-c-0171FD text-align-c">查看更多 ></view> -->
				<view class="width-full all-p-t-22" style="border-top: 2rpx solid #efefef">
					<view class="width-full t-c-000018 f-s-32 t-w-bold all-m-b-20">计划信息</view>
					<view class="width-full all-m-b-20 display_row_center">
						<text class="t-c-6F6F6F">计划单号：</text>
						<text class="t-c-272727">{{ planData.plan_details_no }}</text>
					</view>
					<view class="width-full all-m-b-20 display_row_center">
						<text class="t-c-6F6F6F">执行人：</text>
						<text class="t-c-272727">{{ planData.executor_names || "--" }}</text>
					</view>
					<view class="width-full all-m-b-20 display_row_center">
						<text class="t-c-6F6F6F">循环周期：</text>
						<text class="t-c-272727">{{ getCycleName(planData.cycle_type) }}</text>
					</view>
					<view class="width-full display_row_center">
						<text class="t-c-6F6F6F">上次执行时间：</text>
						<text class="t-c-272727">{{ planData.last_start_time || "--" }}</text>
					</view>
					<view class="width-full display_row_center">
						<text class="t-c-6F6F6F">计划执行时间：</text>
						<text class="t-c-272727">{{ planData.plan_start_time || "--" }}</text>
					</view>
				</view>
			</view>
		</view>
		<view id="three" class="width-full contentBox position-r all-m-b-30 info-item">
			<view class="width-full all-p-t-30 display_row_center">
				<image class="iconBox" src="/static/otherImg/planFarmTitleIcon1.png"></image>
				<text class="all-m-l-10 t-c-000018 f-s-32 t-w-bold">检查项内容</text>
			</view>
			<view class="width-full t-c-000018 all-m-t-30" v-for="(item, index) in tableList" :key="index">
				<view class="width-full titleText">{{ index + 1 }}、{{ item.item_content }}</view>
				<view class="width-full display_row_center f-s-24 all-m-t-15">
					<text>检查方法：</text>
					<text class="t-c-6F6F6F">{{ item.method || "--"}}</text>
				</view>
				<view class="width-full display_row_center f-s-24 all-m-t-15">
					<text>标准说明：</text>
					<text class="t-c-6F6F6F">{{ item.std_explain || "--" }}</text>
				</view>
				<view class="width-full display_row_center f-s-24 all-m-t-15">
					<text>记录方式：</text>
					<text class="t-c-6F6F6F">{{ getRecordName(item.record_method) }}</text>
				</view>
				<view class="width-full display_row_center f-s-24 all-m-t-15 pb-40">
					<text>结果选项：</text>
					<view class="" v-if="item.record_method == 0 || item.record_method == 1">
						<view class="">
							<text>正常值:</text>
							<text>{{ item.normal_val }}</text>
						</view>
						<view class="">
							<text>异常值:</text>
							<text>{{ item.abnormal_val }}</text>
						</view>
					</view>
					<view class="" v-else-if="item.record_method == 2">
						<!-- 2是输入数值 -->
						<view class="width-full display_row_center f-s-24 all-m-t-15">
							<text>上限：</text>
							<text class="t-c-6F6F6F">{{ item.upper_limit_val }}</text>
						</view>
						<view class="width-full display_row_center f-s-24 all-m-t-15">
							<text>下限：</text>
							<text class="t-c-6F6F6F">{{ item.lower_limit_val }}</text>
						</view>
					</view>
					<text class="t-c-6F6F6F" v-else>--</text>
				</view>
			</view>
		</view>
		<deitalBtnVue :status="orderStatus" :loading="detailLoading" @execute="executePlan"></deitalBtnVue>
	</view>
</template>

<script>
import { getInspectionPlanDetailApi } from "@/api/device/inspection/plan.js";
import { getInspecCycleName } from "@/utils/device.js";
import deitalBtnVue from "./components/deitalBtn.vue";
export default {
	components: {
		deitalBtnVue,
	},
	// 这里存放数据
	data() {
		return {
			planData: {},
			listId: 0,
			tableList: [],
			orderStatus: 0,
			detailLoading: true,
		};
	},

	// 生命周期 - 监听页面加载
	onLoad(options) {
		this.listId = options.id ? Number(options.id) : 0;
		if (this.listId) {
			this.getData();
		}
	},
	// 生命周期 - 监听页面显示
	onShow() {},
	// 计算属性
	computed: {},
	// 方法集合
	methods: {
		executePlan() {
			uni.redirectTo({
				url: `/pages/deviceModule/inspection/record/add?planId=${this.listId}`,
			});
		},
		async getData() {
			this.detailLoading = true;
			const result = await getInspectionPlanDetailApi({ id: this.listId });
			this.planData = result.data;
			this.tableList = result.data.cycle;
			this.orderStatus = result.data.status;
			this.detailLoading = false;
		},
		// 获取循环周期名称
		getCycleName(cycle_type) {
			return getInspecCycleName(cycle_type);
		},
		/** 点巡检根据记录方式类型返回名称 */
		getRecordName(type) {
			switch (type) {
				case 0:
					return "单选";
				case 1:
					return "多选";
				case 2:
					return "数值";
				case 3:
					return "长文本";
				default:
					return "";
			}
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
