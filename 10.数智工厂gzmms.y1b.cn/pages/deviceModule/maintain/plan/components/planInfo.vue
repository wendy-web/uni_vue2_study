<template>
	<view class="width-full contentBox position-r all-m-b-30 info-item">
		<uv-form labelPosition="left" :model="formData" labelWidth="200rpx" ref="formRef">
			<view class="width-full all-p-lr-30 all-p-tb-30 flex-between" style="border-bottom: 2rpx solid #efefef">
				<view class="">
					<image class="iconBox" src="/static/otherImg/planFarmTitleIcon0.png"></image>
					<text class="all-m-l-10 t-c-000018 f-s-32 t-w-bold">计划信息</text>
				</view>
				<slot name="status"></slot>
			</view>
			<view class="width-full all-p-t-20 all-p-lr-30 all-p-b-30 display_column_center f-s-28">
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">计划单号：</text>
					<text class="t-c-272727">{{ formData.plan_details_no }}</text>
				</view>
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">保养负责人：</text>
					<text class="t-c-272727">{{ formData.director_names }}</text>
				</view>
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">其他负责人：</text>
					<text class="t-c-272727">{{ formData.other_names || "--" }}</text>
				</view>
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F" space="nbsp">循环周期：</text>
					<text class="t-c-272727">{{ formData.cycle_type || "0" }} 个月</text>
				</view>
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">计划执行时间：</text>
					<text class="t-c-272727">{{ formData.plan_start_time || "-" }}</text>
				</view>
			</view>
		</uv-form>
	</view>
</template>

<script>
export default {
	props: {
		info: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			formData: {},
		};
	},
	watch: {
		info: {
			immediate: true,
			handler(newValue, oldValue) {
				if(!newValue) return;
				const { plan_details_no, director_names, director_uid, other_names, other_uid, cycle_type, plan_start_time } = newValue;
				this.formData = {
					plan_details_no,
					director_names,
					director_uid,
					other_names,
					other_uid,
					cycle_type,
					plan_start_time
				}
			},
		},
	},
	methods: {
	}
};
</script>
<style lang="scss"></style>
