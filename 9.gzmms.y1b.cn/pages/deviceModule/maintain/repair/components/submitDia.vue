<template>
<uv-popup ref="popup" mode="center" round="8" :safeAreaInsetBottom="false">
	<view class="width-full all-p-t-30 all-p-b-30 all-p-l-20 display_row_center text-align-c uv-border-bottom">
		<uv-icon name="info-circle-fill" color="primary" size="20"></uv-icon>
		<text class="all-p-l-10 t-w-bold">提交验证</text>
	</view>
	<view class="all-p-lr-30">
		<uv-form labelPosition="left" :model="formData" labelWidth="200rpx" ref="formRef">
			<uv-form-item label="维修开始时间:" prop="repair_start_time" required @click="showTimeSelect(1)">
				<uv-input
					v-model="formData.repair_start_time"
					disabled
					:disabledColor="disabled ? '#F5F7FA' : '#ffffff'"
					placeholder="请选择开始时间"
					suffixIcon="calendar"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="维修结束时间:" prop="repair_end_time" required @click="showTimeSelect(2)">
				<uv-input
					v-model="formData.repair_end_time"
					disabled
					:disabledColor="disabled ? '#F5F7FA' : '#ffffff'"
					placeholder="请选择结束时间"
					suffixIcon="calendar"
				></uv-input>
			</uv-form-item>
			<view class="content_row all-p-b-30 all-p-t-20">
				<view class="all-m-r-30" @click="close">
					<uv-button text="取消"></uv-button>
				</view>
				<uv-button text="提交验收" type="primary" @click="onSubmit"></uv-button>
			</view>
		</uv-form>
	</view>
	<uv-datetime-picker
		ref="datetimePicker"
		v-model="datetimeValue"
		:minDate="minDateValue"
		mode="datetime"
		@confirm="timeSelectConfirm"
	></uv-datetime-picker>
</uv-popup>
</template>

<script>
import dayJs from "@/utils/dayjs.min.js";
export default {
	props: {
		operate_type: {
			type: Number,
			default: 1
		},
		listId: {
			type: Number,
			default: 0
		}
	},
	// 这里存放数据
	data() {
		return {
			selectTimeType: 1,
			datetimeValue: Number(new Date()),
			minDateValue: '',
			formData: {
				is: 0,
				repair_start_time: '',
				repair_end_time: ''
			}
		};
	},
	methods: {
		// 点击选择时间 1: 开始 2：结束
		showTimeSelect(type) {
			this.selectTimeType = type;
			this.minDateValue = (type == 2) ? Date.parse(this.formData.repair_start_time) : '';
			this.$refs.datetimePicker.open();
		},
		// 选择时间点击确认选择
		timeSelectConfirm(e) {
			let time = uni.$uv.timeFormat(e.value, "yyyy-mm-dd hh:MM");
			if (this.selectTimeType == 1) {
				this.formData.repair_start_time = time;
			} else {
				this.formData.repair_end_time = time;
			}
		},
		close() {
			this.$refs.popup.close();
		},
		async open(item) {
			const { id, repair_start_time, repair_end_time } = item;
			this.formData = {
				id,
				repair_start_time,
				repair_end_time: repair_end_time || dayJs().format("YYYY-MM-DD HH:mm")
			}
			this.$refs.popup.open();
		},
		onSubmit() {
			if (!this.formData.repair_start_time) {
				uni.showToast({
					icon: "none",
					title: "请选择维修开始时间",
				});
				return false;
			}
			if (!this.formData.repair_end_time) {
				uni.showToast({
					icon: "none",
					title: "请选择维修结束时间",
				});
				return false;
			}
			this.$emit('submit', this.formData);
		}
	}
};
</script>
<style lang="scss">
.sel_cont {
	width: 600rpx;
	height: calc(100vh - 192rpx);
	overflow: hidden;
	overflow-y: scroll;
	box-sizing: border-box;
	position: relative;
	padding-bottom: env(safe-area-inset-bottom);
	// display: flex;
	// flex-direction: column;
	// align-items: center;
	// .tree-view-sc {
	// 	flex: 1;
	// 	align-self: stretch;
	// 	justify-self: stretch;

	// }
}
.submit-wrapper {
	padding: 40rpx;
}
.footer-btn {
	width: 100%;
	position: absolute;
	z-index: 199;
	bottom: 0;
	left: 0;
	right: 0;
	height: 100rpx;
	background-color: #ffffff;
	display: flex;
	justify-content: center;
	padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
	&-item {
		flex: 1;
		&:not(first-child) {
			margin: 0 20rpx;
		}
	}
}
</style>
