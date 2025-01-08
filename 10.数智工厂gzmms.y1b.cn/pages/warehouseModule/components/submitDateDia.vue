<template>
	<uv-popup ref="popup" mode="center" round="8" :safeAreaInsetBottom="false">
		<view class="width-full all-p-t-30 all-p-b-30 all-p-l-20 display_row_center text-align-c uv-border-bottom">
			<uv-icon name="info-circle-fill" color="#6086fc" size="20"></uv-icon>
			<text class="all-p-l-10 t-w-bold">请确认{{ typeText }}日期</text>
		</view>
		<view class="all-p-lr-30 dia_cont">
			<uv-form labelPosition="left" :model="formData" labelWidth="160rpx" ref="formRef">
				<uv-form-item :label="`${typeText}日期:`" prop="in_time" required @click="showTimeSelect">
					<uv-input
						v-model="formData[status == 1 ? 'out_time' : 'in_time']"
						:placeholder="`请选择${typeText}日期`"
						suffixIcon="calendar"
						disabled
					></uv-input>
				</uv-form-item>
				<view class="content_row all-p-b-30 all-p-t-20">
					<view class="all-m-r-30 footer-btn" @click="close">
						<uv-button text="取消" shape="circle"></uv-button>
					</view>
					<view class="footer-btn" @click="onSubmit">
						<uv-button text="确认" shape="circle" color="#6086fc" type="primary"></uv-button>
					</view>
				</view>
			</uv-form>
		</view>
		<uv-datetime-picker
			ref="datetimePicker"
			v-model="datetimeValue"
			:minDate="minDateValue"
			:maxDate="maxDateValue"
			mode="date"
			@confirm="timeSelectConfirm"
		></uv-datetime-picker>
	</uv-popup>
</template>

<script>
import dayJs from "@/utils/dayjs.min.js";
export default {
	props: {},
	computed: {
		typeText() {
			let text = "入库";
			if (this.status) {
				text = this.status == 1 ? "调出" : "调入";
			}
			return text;
		},
	},
	data() {
		return {
			selectTimeType: 1,
			datetimeValue: Number(new Date()),
			minDateValue: 0,
			maxDateValue: Number(new Date()),
			formData: {
				id: 0,
				in_time: dayJs().format("YYYY-MM-DD"),
			},
			status: 0,
		};
	},
	methods: {
		showTimeSelect() {
			this.$refs.datetimePicker.open();
		},
		// 选择时间点击确认选择
		timeSelectConfirm(e) {
			let time = uni.$uv.timeFormat(e.value, "yyyy-mm-dd");
			this.formData[this.status == 1 ? "out_time" : "in_time"] = time;
		},
		close() {
			this.$refs.popup.close();
		},
		async open(item) {
			const { id, in_time, out_time, status } = item;
			console.log("status", status);
			const outGetTime = out_time && new Date(out_time).getTime();
			const inGetTime = in_time && new Date(in_time).getTime();
			this.status = status;
			let timeYear = new Date(status == 1 ? out_time : in_time)?.getFullYear();
			this.minDateValue = new Date(`${timeYear - 1}-01-01`).getTime();
			this.maxDateValue = new Date(`${timeYear + 1}-12-31`).getTime();
			this.formData = { id };
			// 调回的日期
			if (status == 1) {
				this.datetimeValue = out_time;
				this.formData.out_time = out_time;
				// this.maxDateValue = new Date(2024, 8, 30).getTime();
				this.$refs.popup.open();
				return;
			}
			// 调入
			if (status == 2) {
				console.log("执行");
				// this.maxDateValue = outGetTime;
				// this.formData.in_time = (inGetTime < outGetTime) ? in_time : out_time;
				this.minDateValue = dayJs(out_time).valueOf();
				this.maxDateValue = dayJs().valueOf();
				this.formData.in_time = in_time;
				this.datetimeValue = in_time;
				this.$refs.popup.open();
				return;
			}
			this.datetimeValue = in_time;
			this.formData.in_time = in_time;
			this.$refs.popup.open();
		},
		onSubmit() {
			if (this.status == 1) {
				if (!this.formData.out_time) {
					uni.showToast({
						icon: "none",
						title: "请选择时间",
					});
					return false;
				}
			} else {
				if (!this.formData.in_time) {
					uni.showToast({
						icon: "none",
						title: "请选择时间",
					});
					return false;
				}
			}
			this.$emit("submit", this.formData);
		},
	},
};
</script>
<style lang="scss">
.dia_cont {
	width: 600rpx;
}
.footer-btn {
	width: 180rpx;
}
</style>
