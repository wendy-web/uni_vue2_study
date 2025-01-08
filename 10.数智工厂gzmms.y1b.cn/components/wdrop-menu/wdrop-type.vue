<template>
	<view class="drop-container">
		<view class="drop-wrapper">
			<block v-for="(item, index) in filtrateList" :key="item.value">
				<view class="drop-item" @click="triggerLabel(item.value)" v-if="item.value == 6">
					<uv-checkbox-group v-model="checkboxValue" iconPlacement="left" size="12" @change="checkboxChange">
						<uv-checkbox
							activeColor="#6086fc"
							:customStyle="{margin: 'auto',}"
							:label="item.label"
							name="check"
						></uv-checkbox>
					</uv-checkbox-group>
				</view>
				<view class="drop-item" @click="triggerLabel(item.value)" v-else>
					<text class="label-text" :class="[currentValue === item.value || checkStatus(item.value) ? 'active' : '']">
						{{ item.label }}
					</text>
					<image
						src="https://file.y1b.cn/public/erpxcx_img/common/sanjiaoxia.png"
						class="icon-img"
						:class="[currentValue === item.value ? 'icon-active' : 'icon-none']"
					></image>
				</view>
			</block>
		</view>
		<view class="select-status" v-if="showStatus">
			<view class="select-content animate__animated my-duration" :class="statusContentAnimate">
				<view class="select-group">
					<view
						v-for="(item, index) in statusList" :key="item.status"
						@click="triggerStatus(item.status)"
						:class="['select-item', currentStatusValue === item.status ? 'active' : '']"
					>
						<text>{{ item.label }}</text>
					</view>
				</view>
				<view class="select-footer">
					<uv-button shape="circle" plain text="重置" :customStyle="resetBtn" @click="triggerRest"></uv-button>
					<uv-button
						shape="circle"
						type="primary"
						text="确定"
						:customStyle="confirmBtn"
						@click="triggerConfirm"
					></uv-button>
				</view>
			</view>
			<view
				class="overlay animate__animated my-duration"
				:class="statusOverlayAnimate"
				@click.stop="closeStatus"
			></view>
		</view>
		<!-- 日期选择 -->
		<uv-calendars
			ref="calendars"
			mode="range"
			@confirm="confirmCalendar"
			startDate="2023-01-01"
			:endDate="endLimitDate"
			@close="closeHandle"
			:allowSameDay="true"
			:date="defaultDate"
			:clearDate="clearDate"
			:showFastBtn="showFastBtn"
		/>
		<!-- 类型列表 -->
		<gq-tree
			ref="typeTree"
			:range="eqipmentTypeOptions"
			childKey="_children"
			:multiple="false"
			:cascade="true"
			:foldAll="false"
			:showParentId="true"
			@cancel="closeHandle"
			@confirm="treeTypeConfirm"
		></gq-tree>
		<!-- 部门列表 -->
		<gq-tree
			ref="gqTree"
			:range="deptlistOptions"
			childKey="_children"
			:multiple="false"
			:cascade="true"
			:foldAll="false"
			@cancel="closeHandle"
			@confirm="treeConfirm"
		></gq-tree>
		<uv-picker
			ref="picker"
			keyName="name"
			:columns="[userListOptions]"
			@confirm="pickerOnfirm"
			@cancel="closeHandle"
			:title="pickerTitle"
		></uv-picker>
	</view>
</template>

<script>
/* 引入 */
import { mapActions, mapGetters } from "vuex";
import { fadeIn, fadeInDown, fadeOut, fadeOutUp } from "./index.js";
let statusTimerId = null;
/** 本组件为日期,状态,部门菜单选择组件 */
export default {
	name: "w-drop-menu",
	props: {
		status: {
			type: [Number, String],
		},
		isAdvent: {
			type: Number,
			default: 0
		},
		statusList: {
			type: Array,
			default: [],
		},
		pickerTitle: {
			type: String,
			default: '选择负责人'
		},
		showFastBtn: {
			type: Boolean,
			default: false
		},
		filtrateList: {
			type: Array,
			default: [
				{
					label: "时间",
					value: 1,
				},
				{
					label: "类型",
					value: 2,
				},
				{
					label: "状态",
					value: 3,
				},
				{
					label: "部门",
					value: 4,
				},
				{
					label: "负责人",
					value: 5,
				},
				{
					label: "临期",
					value: 6,
					is_advent: 0
				}
			]
		},
		// 是否校验登录
		noValidationLogin: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			resetBtn: {
				width: "246rpx",
				height: "80rpx",
				border: "2rpx solid #000000",
				backgroundColor: "#eeeeee",
				boxSizing: "border-box",
				color: "#000",
			},
			confirmBtn: {
				width: "260rpx",
				height: "84rpx",
				backgroundColor: "#6086fc",
				color: "#ffffff",
			},
			/** 记录当前点击的是哪个菜单,对应list的value  */
			currentValue: 0,
			/** 是否显示 选择状态的开关 */
			showStatus: false,
			/** 状态列表默认的动画名称 */
			statusContentAnimate: fadeInDown,
			/** 状态列表遮罩默认的动画名称  */
			statusOverlayAnimate: fadeIn,
			/** 记录当前选择的是哪个状态  */
			currentStatusValue: NaN,
			/** 确认后的状态  */
			confirmStatusValue: NaN,
			/** 记录选择的日期范围---开始日期  */
			startDate: "",
			/** 记录的部门id  */
			dept_id: 0,
			dept_type_id: 0,
			/** 设置的最晚可选日期  */
			endLimitDate: 0,
			clearDate: false,
			director_id: 0, // 负责人ID
			defaultDate: ['', ''], //
			checkboxValue: [],
			currentDay: ''
		};
	},
	computed: {
		...mapGetters(['eqipmentTypeOptions', 'deptlistOptions', 'userListOptions', 'token']),
		/** 检测是否选择了状态  */
		checkStatus() {
			return (value) => {
				let status = false;
				switch(value) {
					case 1:
						status = this.startDate ? true : false;
						break;
					case 2:
						status = this.dept_type_id ? true : false;
						break;
					case 3:
						status = !Number.isNaN(this.confirmStatusValue) ? true : false;
						break;
					case 4:
						status = this.dept_id ? true : false;
						break;
					case 5:
						status = this.director_id ? true : false;
						break;
				}
				return status;
			};
		},
	},
	async mounted() {
		let timestamp = new Date().getTime();
		let currentDay = uni.$uv.date(timestamp, "yyyy-mm-dd");
		this.currentDay = currentDay;
		this.endLimitDate = this.showFastBtn ? '' : currentDay;
		// this.startDate = uni.$uv.date(timestamp - 24 * 60 * 60 * 1000, "yyyy-mm-dd");
		this.defaultDate = [currentDay, currentDay];
		const noValidationLogin = (this.noValidationLogin || !this.token);
		if(!this.deptlistOptions) this.initDepartmentList(noValidationLogin);
		if(!this.eqipmentTypeOptions || !this.userListOptions) await this.initGetEqBaseSelect(noValidationLogin);
		this.checkboxValue = this.isAdvent ? ['check'] : [];
	},
	methods: {
		...mapActions({
			initGetEqBaseSelect: "device/initGetEqBaseSelect",
			initDepartmentList : 'device/initDepartmentList'
		}),
		// 点击菜单时触发的事件
		triggerLabel(val) {
			if (statusTimerId) return;
			if (this.showStatus) {
				this.closeStatus();
				return;
			}
			this.currentValue = val === this.currentValue ? 0 : val;
			switch (val) {
				case 1:
					this.selectTime();
					break;
				case 2:
					this.selectTypeDept();
					break;
				case 3:
					this.selectStatus();
					break;
				case 4:
					this.selectDept();
					break;
				case 5:
					this.selectWh();
					break;
			}
		},
		// 点击时间栏
		selectTime() {
			this.$refs.calendars.open();
		},
		// 类型选择
		selectTypeDept() {
			this.$refs.typeTree._show();
		},
		// 点击状态栏
		selectStatus() {
			if (!this.showStatus) return this.showStatus = true;
			this.closeStatus();
		},
		// 点击部门栏
		selectDept() {
			this.$refs.gqTree._show();
		},
		// 点击负责人
		selectWh() {
			this.$refs.picker.open();
		},
		// 关闭选择状态
		closeStatus() {
			this.statusContentAnimate = fadeOutUp;
			this.statusOverlayAnimate = fadeOut;
			statusTimerId = setTimeout(() => {
				this.statusContentAnimate = fadeInDown;
				this.statusOverlayAnimate = fadeIn;
				this.showStatus = false;
				this.currentValue = 0;
				if (Number.isNaN(this.confirmStatusValue)) {
					// 如果confirmStatusValue不存在,表示没有选过状态,此时置空currentStatusValue
					this.currentStatusValue = NaN;
				} else {
					this.currentStatusValue = this.confirmStatusValue;
				}
				statusTimerId = null;
				/* 定时器时间与css动画时间一致 */
			}, 300);
		},
		//点击选择状态事件
		triggerStatus(val) {
			this.currentStatusValue = val;
		},
		// 状态点击重置
		triggerRest() {
			this.currentStatusValue = NaN;
			this.confirmStatusValue = NaN;
			this.closeStatus();
			this.$emit("statusChange", { status: undefined });
		},
		// 状态点击确定
		triggerConfirm() {
			this.confirmStatusValue = this.currentStatusValue;
			this.closeStatus();
			if (!Number.isNaN(this.confirmStatusValue)) {
				this.$emit("statusChange", { status: this.confirmStatusValue });
			}
		},
		// 确定选择日期事件
		confirmCalendar(val) {
			let range = val.range;
			let startDate = range.before;
			let endDate = range.after;
			this.startDate = startDate;
			this.closeHandle();
			uni.$uv.toast(`选择的日期是:${startDate}~${endDate}`);
			this.$emit("dateChange", { start_time: startDate, end_time: endDate });
		},
		closeHandle() {
			this.currentValue = 0;
		},
		// 负责人
		pickerOnfirm(e) {
			let director_id = e.value[0]?.id;
			this.director_id = director_id;
			this.closeHandle();
			this.$emit("directorChange", { director_id });
		},
		// 临期
		checkboxChange(event) {
			this.$emit("checkChange", { check: event.length });
		},
		// 确定选择部门的触发事件
		treeConfirm(e) {
			this.currentValue = 0;
			let dept_id = e[0]?.id;
			this.dept_id = dept_id;
			this.$emit("deptChange", { dept_id });
		},
		treeTypeConfirm(e) {
			this.currentValue = 0;
			let dept_type_id = e[0]?.id;
			this.dept_type_id = dept_type_id;
			this.$emit("deptTypeChange", { dept_type_id });
		},
		// 重置
		reset() {
			this.clearDate = true;
			this.triggerRest();
			this.$refs.gqTree._reTreeList();
			// 清空记录的部门id
			this.dept_id = 0;
			this.dept_type_id = 0;
			// 清空记录的日期
			this.startDate = "";
			this.director_id = 0; // 负责人Id
			this.checkboxValue = []; // 重置临期
		},
	},
	watch: {
		status: {
			immediate: true,
			handler(newVal) {
				if (newVal !== null) {
					this.currentStatusValue = Number(newVal);
					this.confirmStatusValue = Number(newVal);
				}
			},
		}
	},
};
</script>

<style lang="scss">
.my-duration {
	--animate-duration: 0.3s;
}

.drop-container {
	position: relative;
}

.drop-wrapper {
	// height: 94rpx;
	background-color: #f6f6f6;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-column-gap: 36rpx;
	padding: 20rpx;
	box-sizing: border-box;
	align-items: center;
	.drop-item {
		background-color: #eeeeee;
		height: 56rpx;
		border-radius: 27rpx;
		font-size: 24rpx;
		// padding-left: 10rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		&:nth-child(n + 4) {
			margin-top: 20rpx;
		}
		.label-text {
			color: #676767;
			&.active {
				color: #6086fc;
			}
		}

		.icon-img {
			width: 36rpx;
			height: 36rpx;
		}

		.icon-active {
			transform: rotate(180deg);
			transition: all 0.5s ease;
		}

		.icon-none {
			transform: rotate(0deg);
			transition: all 0.5s ease;
			padding-bottom: 8rpx;
		}
	}
}
.select-status {
	position: absolute;
	left: 0;
	right: 0;
	top: 94rpx;
	.select-content {
		background-color: #eeeeee;
		position: absolute;
		z-index: 103;
		left: 0;
		top: 0rpx;
		right: 0;
		// height: 25vh;
		min-height: 276rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding-bottom: 40rpx;
		box-sizing: border-box;
		.select-group {
			display: grid;
			grid-template-columns: repeat(4,auto);
			padding: 0 30rpx;
			padding-top: 30rpx;
			box-sizing: border-box;
			.select-item {
				height: 56rpx;
				border-radius: 10rpx;
				text-align: center;
				line-height: 52rpx;
				margin-right: 40rpx;
				margin-bottom: 26rpx;
				font-size: 28rpx;
				color: #9e9e9e;
				background-color: #e2e2e2;
				border: 2rpx solid transparent;
				box-sizing: border-box;
				&.active {
					color: #6086fc;
					border-color: currentColor;
				}
			}
		}
		.select-footer {
			display: flex;
			align-items: center;
			justify-content: space-around;
			// padding: 0 40rpx;
		}
	}
	.overlay {
		position: absolute;
		inset: 0;
		height: calc(60vh + 376rpx);
		background-color: #00000080;
		z-index: 101;
	}
}
</style>
