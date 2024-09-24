<template>
	<view class="width-full contentBox position-r all-m-b-30">
		<view class="width-full all-p-lr-30 all-p-tb-30 flex-between" style="border-bottom: 2rpx solid #efefef">
			<view class="">
				<image class="iconBox" src="/static/otherImg/equipmentImg1.png"></image>
				<text class="all-m-l-10 t-c-000018 f-s-32 t-w-bold">{{ planData.bar_title }}</text>
			</view>
			<slot name="status"></slot>
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
				<!-- 		<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">循环周期：</text>
					<text class="t-c-272727">{{ getCycleName(planData.cycle_type) }}</text>
				</view> -->
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">执行时间：</text>
					<text class="t-c-272727">{{ planData.last_start_time || "--" }}</text>
				</view>
				<view class="width-full display_row_center">
					<text class="t-c-6F6F6F">执行规则：</text>
					<text class="t-c-272727">{{ planData.executive_rule_type === 1 ? "按固定周期" : "按上次执行时间" }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getRulePlanTime, getInspecCycleName } from "@/utils/device.js";
export default {
	props: {
		info: {
			type: Object,
			default: () => ({}),
		},
	},
	// 这里存放数据
	data() {
		return {
			planData: {},
		};
	},

	mounted() {},
	// 计算属性
	computed: {},
	// 方法集合
	methods: {
		// 获取循环周期名称
		getCycleName(cycle_type) {
			return getInspecCycleName(cycle_type);
		},
	},
	watch: {
		info: {
			immediate: true, //初始化时让handler调用一下
			handler(newValue, oldValue) {
				this.planData = newValue;
			},
		},
	},
};
</script>
<style lang="scss"></style>
