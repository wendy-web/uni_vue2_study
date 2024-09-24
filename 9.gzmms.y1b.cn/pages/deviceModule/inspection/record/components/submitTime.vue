<template>
	<uv-popup ref="popup">
		<view class="submit-wrapper">
			<uv-form labelPosition="left" :model="formData" labelWidth="200rpx" ref="formRef">
				<uv-form-item label="任务开始时间:" prop="task_time_start" required @click="showTimeSelect(1)">
					<uv-input
						v-model="formData.task_time_start"
						disabled
						disabledColor="#ffffff"
						placeholder="请选择任务开始时间"
						suffixIcon="calendar"
					></uv-input>
				</uv-form-item>
				<uv-form-item label="任务结束时间:" @click="showTimeSelect(2)">
					<uv-input
						v-model="formData.task_time_end"
						disabled
						disabledColor="#ffffff"
						placeholder="请选择任务结束时间"
						suffixIcon="calendar"
					></uv-input>
				</uv-form-item>
				<view class="flex mt-40">
					<view class="flex-1">
						<uv-button text="取消" @click="cancel"></uv-button>
					</view>
					<view class="flex-1">
						<uv-button text="确定" type="primary" @click="confirm"></uv-button>
					</view>
				</view>
			</uv-form>
			<uv-datetime-picker
				ref="datetimePicker"
				v-model="datetimeValue"
				mode="datetime"
				@confirm="timeSelectConfirm"
			></uv-datetime-picker>
		</view>
	</uv-popup>
</template>

<script>
import dayJs from "@/utils/dayjs.min.js";
export default {
	props: {},
	// 这里存放数据
	data() {
		return {
			formData: {
				task_time_start: "", ///任务开始时间
				task_time_end: "", //任务结束时间
			},
			selectTimeType: 1, //1是选择任务开始时间 2是选择任务结束时间
			datetimeValue: Number(new Date()),
		};
	},

	mounted() {},
	// 计算属性
	computed: {},
	// 方法集合
	methods: {
		cancel() {
			this.$refs.popup.close();
		},
		confirm() {
			this.$emit("submit",this.formData);
			this.cancel();
		},
		open(end_time) {
			this.formData.task_time_end = end_time;
			this.formData.task_time_start = dayJs().format("YYYY-MM-DD HH:mm");
			this.$refs.popup.open();
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
<style lang="scss">
.submit-wrapper {
	padding: 40rpx;
}
</style>
