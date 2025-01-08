<template>
	<view class="drop-container">
		<view class="drop-wrapper">
			<view class="drop-item" v-for="(item, index) in list" @click="triggerLabel(item.value, index)" :key="item.value">
				<text class="label-text" :class="[currentValue === item.value || checkStatus(index) ? 'active' : '']">
					{{ item.label }}
				</text>
				<image
					src="https://file.y1b.cn/public/erpxcx_img/common/sanjiaoxia.png"
					class="icon-img"
					:class="[currentValue === item.value ? 'icon-active' : 'icon-none']"
				></image>
			</view>
		</view>
		<view class="select-status" v-if="showStatus">
			<view class="select-content animate__animated my-duration" :class="statusContentAnimate">
				<view class="select-group">
					<view
						class="select-item"
						:class="[currentStatusValue === item.value ? 'active' : '']"
						v-for="(item, index) in statusOptions"
						:key="item.value"
						@click="triggerStatus(item.value, index)"
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
		<uv-calendars
			ref="calendars"
			mode="range"
			@confirm="confirmCalendar"
			:endDate="endDate"
			@close="closeCalendar"
			:clearDate="clearDate"
		/>
		<gq-tree
			ref="gqTree"
			:range="range"
			childKey="_children"
			:multiple="false"
			:cascade="true"
			:foldAll="false"
			@cancel="treeCancel"
			@confirm="treeConfirm"
		></gq-tree>
	</view>
</template>

<script>
/* 引入 */
import { departmentListApi } from "@/api/modules/common.js";
import { fadeIn, fadeInDown, fadeOut, fadeOutUp } from "./index.js";
let statusTimerId = null;
/** 本组件为日期,状态,部门菜单选择组件 */
export default {
	name: "w-drop-menu",
	props: {
		status: {
			type: [Number, String],
		},
		statusList: {
			type: Array,
			default: [
				{
					label: "待提审",
					value: 0,
				},
				{
					label: "待审核",
					value: 1,
				},
				// {
				// 	label: "待入库",
				// 	value: 2,
				// },
				{
					label: "已完成",
					value: 3,
				},
				{
					label: "已撤回",
					value: 4,
				},
				{
					label: "已驳回",
					value: 5,
				},
				{
					label: "已作废",
					value: 6,
				},
				{
					label: "已审批",
					value: 7,
				},
				{
					label: "待领料",
					value: 8,
				},
				{
					label: "已确认",
					value: 9,
				},
			],
		},
	},
	data() {
		return {
			range: [],
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
			list: [
				{
					label: "时间",
					value: 1,
				},
				{
					label: "状态",
					value: 2,
				},
				{
					label: "部门",
					value: 3,
				},
			],
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
			/** 设置的最晚可选日期  */
			endDate: "",
			clearDate: false,
			statusOptions: [],
		};
	},
	computed: {
		/** 检测是否选择了状态  */
		checkStatus() {
			return (index) => {
				if (index === 1) {
					return !Number.isNaN(this.confirmStatusValue) ? true : false;
				} else if (index === 0) {
					return this.startDate ? true : false;
				} else if (index === 2) {
					return this.dept_id ? true : false;
				} else {
					return false;
				}
			};
		},
	},
	mounted() {
		this.statusOptions = this.statusList;
		let timestamp = new Date().getTime();
		this.endDate = uni.$uv.date(timestamp, "yyyy-mm-dd");
		// this.startDate = uni.$uv.date(timestamp - 24 * 60 * 60 * 1000, "yyyy-mm-dd");
		this.getData();
	},
	methods: {
		async getData() {
			const result = await departmentListApi();
			this.range = result.data.list;
			console.log("result", result);
		},
		// 点击菜单时触发的事件
		triggerLabel(val, index) {
			if (statusTimerId) {
				return;
			}
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
					this.selectStatus();
					break;
				case 3:
					this.selectDept();
					break;
			}
		},
		// 点击时间栏
		selectTime() {
			this.$refs.calendars.open();
		},
		// 点击状态栏
		selectStatus() {
			if (!this.showStatus) {
				this.showStatus = true;
			} else {
				this.closeStatus();
			}
		},
		// 点击部门栏
		selectDept() {
			this.$refs.gqTree._show();
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
		triggerStatus(val, index) {
			console.log("点击状态val", val);
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
		//确定选择日期事件
		confirmCalendar(val) {
			console.log("选择的日期是:val", val);
			let range = val.range;
			let startDate = range.before;
			let endDate = range.after;
			console.log("startDate", startDate);
			console.log("endDate", endDate);
			this.startDate = startDate;
			this.closeCalendar();
			uni.$uv.toast(`选择的日期是:${startDate}~${endDate}`);
			this.$emit("dateChange", { start_time: startDate, end_time: endDate });
		},
		closeCalendar() {
			this.currentValue = 0;
		},
		onchange(e) {
			const value = e.detail.value;
			console.log("value", value);
		},
		// 确定选择部门的触发事件
		treeConfirm(e) {
			this.currentValue = 0;
			console.log("确定选择部门", e);
			let dept_id = e[0]?.id;
			this.dept_id = dept_id;
			console.log("this.dept_id", this.dept_id);
			this.$emit("deptChange", { dept_id });
		},
		// 关闭/取消选择部门的触发事件
		treeCancel(e) {
			this.currentValue = 0;
		},
		// 重置
		reset() {
			console.log("触发重置");
			this.clearDate = true;
			this.triggerRest();
			this.$refs.gqTree._reTreeList();
			// 清空记录的部门id
			this.dept_id = 0;
			//清空记录的日期
			this.startDate = "";
		},
	},

	watch: {
		status: {
			immediate: true,
			handler(newVal) {
				if (newVal !== null) {
					this.currentStatusValue = Number(newVal);
					this.confirmStatusValue = Number(newVal);
					console.log("this.currentStatusValue", this.currentStatusValue);
					console.log("this.confirmStatusValue", this.confirmStatusValue);
				}
			},
		},
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
	height: 94rpx;
	background-color: #f6f6f6;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-column-gap: 36rpx;
	padding: 0 20rpx;
	box-sizing: border-box;
	align-items: center;

	.drop-item {
		background-color: #eeeeee;
		height: 56rpx;
		border-radius: 27rpx;
		font-size: 24rpx;
		padding-left: 10rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;

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
	top: 96rpx;

	.select-content {
		background-color: #eeeeee;
		position: absolute;
		z-index: 103;
		left: 0;
		top: 0rpx;
		right: 0;
		// height: 25vh;
		height: 376rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding-bottom: 40rpx;
		box-sizing: border-box;
		.select-group {
			// display: flex;
			// flex-wrap: wrap;
			display: grid;
			grid-template-columns: repeat(4,auto);
			padding: 0 30rpx;
			padding-top: 30rpx;
			box-sizing: border-box;

			.select-item {
				// min-width: 92rpx;
				// padding: 0 10rpx;
				// padding: 4rpx 14rpx;
				height: 56rpx;
				border-radius: 10rpx;
				text-align: center;
				line-height: 56rpx;
				margin-right: 40rpx;
				margin-bottom: 26rpx;
				font-size: 28rpx;
				color: #9e9e9e;
				background-color: #e2e2e2;
				// &:last-child {
				// 	margin-right: 0;
				// }

				&.active {
					color: #6086fc;
					border: 2rpx solid #6086fc;
					box-sizing: border-box;
					line-height: 52rpx;
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
		height: calc(54vh + 376rpx);
		background-color: #00000080;
		z-index: 101;
	}
}
</style>
