<template>
	<view class="width-full contentBox position-r all-m-b-30 info-item">
		<uv-form labelPosition="left" :model="formData" labelWidth="200rpx" ref="formRef">
			<view class="width-full all-p-t-30 display_row_center">
				<image class="iconBox" src="/static/otherImg/planFarmTitleIcon0.png"></image>
				<text class="all-m-l-10 t-c-000018 f-s-32 t-w-bold">检查信息</text>
			</view>
			<view class="width-full display_row_between_center">
				<view class="leftTextBox all-m-r-20">计划执行时间:</view>
				<view class="flex_full rightBox all-p-lr-30 display_row_center">
					<text>{{ getPlanTime(planData) }}</text>
				</view>
			</view>
			<uv-form-item label="任务开始时间:" prop="task_time_start" required @click="showTimeSelect(1)">
				<uv-input
					v-model="formData.task_time_start"
					disabled
					:disabledColor="disabled ? '#F5F7FA' : '#ffffff'"
					placeholder="请选择任务开始时间"
					suffixIcon="calendar"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="任务结束时间:" @click="showTimeSelect(2)">
				<uv-input
					v-model="formData.task_time_end"
					disabled
					:disabledColor="disabled ? '#F5F7FA' : '#ffffff'"
					placeholder="请选择任务结束时间"
					suffixIcon="calendar"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="执行人:" @click="selectExecuteUser(1)">
				<uv-input
					v-model="formData.executor_name"
					disabled
					:disabledColor="disabled ? '#F5F7FA' : '#ffffff'"
					placeholder="请选择执行人"
					suffixIcon="search"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="备注:" :borderBottom="false">
				<uv-input v-model="formData.note" :disabled="disabled"></uv-input>
			</uv-form-item>
		</uv-form>
		<uv-datetime-picker
			ref="datetimePicker"
			v-model="datetimeValue"
			mode="datetime"
			@confirm="timeSelectConfirm"
		></uv-datetime-picker>
	</view>
</template>

<script>
import dayJs from "@/utils/dayjs.min.js";
import { getRulePlanTime } from "@/utils/device.js";
import { mapGetters } from "vuex";
export default {
	props: {
		info: {
			type: Object,
			default: () => ({}),
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	// 这里存放数据
	data() {
		return {
			formData: {
				task_time_start: dayJs().format("YYYY-MM-DD HH:mm"), ///任务开始时间
				task_time_end: "", //任务结束时间
				executor_uid: [], //执行人uid
				executor_name: "", //执行人名称集合
				note: "", //备注
			},
			selectTimeType: 1, //1是选择任务开始时间 2是选择任务结束时间
			datetimeValue: Number(new Date()),
			planData: {},
		};
	},

	mounted() {
		this.formData.executor_uid = [this.defaultUid];
		this.formData.executor_name = this.defaultUser;
	},
	// 计算属性
	computed: {
		...mapGetters(["userInfo"]),
		defaultUser() {
			return `${this.userInfo.name}`;
		},
		defaultUid() {
			return this.userInfo.id;
		},
	},
	// 方法集合
	methods: {
		validateForm() {
			if (!this.formData.task_time_start) {
				uni.showToast({
					icon: "none",
					title: "请选择任务开始时间",
				});
				return false;
			}
			return true;
		},
		// 获取计划执行时间
		getPlanTime(data) {
			return getRulePlanTime(data);
		},
		// 点击选择时间
		showTimeSelect(type) {
			if (this.disabled) return;
			this.selectTimeType = type;
			this.$refs.datetimePicker.open();
		},
		// 选择时间点击确认选择
		timeSelectConfirm(e) {
			if (this.disabled) return;
			let time = uni.$uv.timeFormat(e.value, "yyyy-mm-dd hh:MM");
			if (this.selectTimeType == 1) {
				this.formData.task_time_start = time;
			} else {
				this.formData.task_time_end = time;
			}
		},
		selectExecuteUser(type) {
			if (this.disabled) return;
			uni.navigateTo({
				url: "/pages/common/user/user",
				events: {
					someEvent: (data) => {
						console.log("someEvent", data);
						this.formData.executor_name = data.ar_uname.join(",");
						this.formData.executor_uid = data.ar_uid;
					},
				},
				success: (res) => {
					let radioLabel = "";
					let radioValue = "";
					let executor_name_list = this.formData.executor_name ? this.formData.executor_name.split(",") : [];
					console.log("executor_name_list", executor_name_list);
					let data = {
						isMultiple: true,
						radioLabel,
						radioValue,
						checkboxValue: this.formData.executor_uid,
						labelList: executor_name_list,
					};

					// 通过eventChannel向被打开页面传送数据
					res.eventChannel.emit("acceptData", data);
				},
			});
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
