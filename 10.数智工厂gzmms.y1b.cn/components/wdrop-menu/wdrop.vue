<template>
	<view class="drop-container">
		<view class="drop-wrapper">
			<view
				class="drop-item"
				v-for="(item, index) in dropList"
				@click="triggerLabel(item.value, index)"
				:key="item.value"
			>
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
		<uv-picker
			ref="picker"
			:columns="columns"
			@confirm="pickerOnfirm"
			@cancel="closePicker"
			keyName="name"
			title="选择仓库"
		></uv-picker>
	</view>
</template>

<script>
/* 本组件是选择所属仓库和所属部门 */
import { departmentListApi, storageListApi } from "@/api/modules/common.js";
let statusTimerId = null;
export default {
	// 这里存放数据
	data() {
		return {
			columns: [],
			range: [],
			dropList: [
				{
					label: "所属仓库",
					value: 1,
				},
				{
					label: "所属部门",
					value: 2,
				},
			],
			/** 记录当前点击的是哪个菜单,对应dropList的value  */
			currentValue: 0,
			/** 记录当前选择的是哪个状态  */
			currentStatusValue: NaN,
			dept_id: 0,
			warehouse_id: 0,
		};
	},
	mounted() {
		this.getData();
		this.getWhList();
	},

	// 方法集合
	methods: {
		async getWhList() {
			const result = await storageListApi();
			this.columns.push(result.data.list);
		},
		async getData() {
			const result = await departmentListApi();
			this.range = result.data.list;
		},
		// 点击菜单时触发的事件
		triggerLabel(val, index) {
			this.currentValue = val === this.currentValue ? 0 : val;
			switch (val) {
				case 1:
					this.selectWh();
					break;
				case 2:
					this.selectDept();
					break;
			}
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
		// 仓库选择确认
		pickerOnfirm(e) {
			console.log("pickerOnfirm", e);
			let warehouse_id = e.value[0]?.id;
			this.warehouse_id = warehouse_id;
			this.closePicker();
			this.$emit("whChange", { warehouse_id });
		},
		closePicker() {
			this.currentValue = 0;
		},
		// 点击部门栏
		selectDept() {
			this.$refs.gqTree._show();
		},
		// 点击仓库栏
		selectWh() {
			this.$refs.picker.open();
		},
		// 重置
		reset() {
			this.currentValue = 0;
			console.log("触发重置");
			this.$refs.gqTree._reTreeList();
			// 清空记录的部门id
			this.dept_id = 0;
			this.warehouse_id = 0;
		},
	},
	// 计算属性
	computed: {
		checkStatus() {
			return (index) => {
				if (index === 0) {
					return this.warehouse_id ? true : false;
				} else if (index === 1) {
					return this.dept_id ? true : false;
				} else {
					return false;
				}
			};
		},
	},
};
</script>
<style lang="scss">
.drop-container {
	position: relative;
	.drop-wrapper {
		height: 94rpx;
		background-color: #f6f6f6;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
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
}
</style>
