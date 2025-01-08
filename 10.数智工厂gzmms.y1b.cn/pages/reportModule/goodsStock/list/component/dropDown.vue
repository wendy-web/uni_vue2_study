<template>
	<view class="">
		<uv-drop-down
			ref="dropDown"
			sign="dropDown_1"
			text-active-color="#3c9cff"
			:extra-icon="{ name: 'arrow-down-fill', color: '#666', size: '26rpx' }"
			:extra-active-icon="{ name: 'arrow-up-fill', color: '#3c9cff', size: '26rpx' }"
			:defaultValue="defaultValue"
			:custom-style="{ padding: '0 30rpx' }"
			@click="selectMenu"
		>
			<uv-drop-down-item
				name="is_all"
				type="2"
				:label="dropItem('is_all').label"
				:value="dropItem('is_all').value"
			></uv-drop-down-item>
			<uv-drop-down-item
				name="warehouse_id"
				type="2"
				:label="dropItem('warehouse_id').label"
				:value="dropItem('warehouse_id').value"
			></uv-drop-down-item>
			<uv-drop-down-item
				name="class_name"
				type="2"
				:label="dropItem('class_name').label"
				:value="dropItem('class_name').value"
			></uv-drop-down-item>
			<uv-drop-down-item
				name="type"
				type="2"
				:label="dropItem('type').label"
				:value="dropItem('type').value"
			></uv-drop-down-item>
		</uv-drop-down>
		<uv-drop-down-popup
			sign="dropDown_1"
			:click-overlay-on-close="true"
			:currentDropItem="currentDropItem"
			@clickItem="clickItem"
			@popupChange="change"
		></uv-drop-down-popup>
	</view>
</template>

<script>
import { number } from "../../../../../uni_modules/uv-ui-tools/libs/function/test";
import { goodsCateListApi, getWarehouseApi } from "@/api/modules/report.js";
export default {
	onPageScroll() {
		// 滚动后及时更新位置
		this.$refs.dropDown.init();
	},
	props: {
		listType: {
			type: Number,
			default: 0,
		},
	},
	// 这里存放数据
	data() {
		return {
			// 表示value等于这些值，就属于默认值
			defaultValue: [0],
			// 筛选结果
			// result: [{ name: "order", label: "最新发布", value: "new" }],
			result: [],
			// { name: 'order', label: '最新发布', value: 'new' }
			activeName: "is_all",
			is_all: {
				label: "库存数",
				value: 0,
				// activeIndex: -1,
				activeIndex: 0,
				color: "#333",
				activeColor: "#2878ff",
				child: [
					{
						label: "大于0",
						value: 0,
					},
					{
						label: "全部",
						value: 1,
					},
					{
						label: "等于0",
						value: 2,
					},
				],
			},
			warehouse_id: {
				label: "仓库",
				value: 0,
				// activeIndex: -1,
				activeIndex: 0,
				color: "#333",
				activeColor: "#2878ff",
				child: [],
			},
			class_name: {
				label: "所属分类",
				value: 0,
				// activeIndex: -1,
				activeIndex: 0,
				color: "#333",
				activeColor: "#2878ff",
				child: [],
			},
			type: {
				label: "列表类型",
				value: 0,
				// activeIndex: -1,
				activeIndex: 0,
				color: "#333",
				activeColor: "#2878ff",
				child: [
					{
						label: "全部",
						value: 0,
					},
					{
						label: "库存上限",
						value: 1,
					},
					{
						label: "库存下限",
						value: 2,
					},
					{
						label: "订货预警",
						value: 3,
					},
				],
			},
		};
	},
	computed: {
		dropItem(name) {
			return (name) => {
				const result = {};
				const find = this.result.find((item) => item.name === name);

				if (find) {
					result.label = find.label;
					result.value = find.value;
				} else {
					result.label = this[name].label;
					result.value = this[name].value;
				}
				return result;
			};
		},
		// 获取当前下拉筛选项
		currentDropItem() {
			return this[this.activeName];
		},
	},
	mounted() {
		this.getCateList();
		this.getWarehouseList();
	},
	// 方法集合
	methods: {
		reset() {
			this.result = [];
			this.activeName = "is_all";
			this.is_all.activeIndex = 0;
			this.warehouse_id.activeIndex = 0;
			this.class_name.activeIndex = 0;
			this.type.activeIndex = 0;
		},
		async getCateList() {
			const result = await goodsCateListApi();
			let list = result.data.list;
			let cateList = list.map((item) => {
				// return { label: item.name, value: item.id };
				return { label: item.name, value: item.name };
			});
			cateList.unshift({ label: "全部", value: 0 });
			this.class_name.child = cateList;
		},
		async getWarehouseList() {
			const result = await getWarehouseApi();
			let list = result.data;
			let warehouseList = list.map((item) => {
				return { label: item.name, value: item.id };
			});
			warehouseList.unshift({ label: "全部", value: 0 });
			this.warehouse_id.child = warehouseList;
		},
		back() {
			uni.navigateBack({
				delta: 1,
			});
		},
		change(e) {
			console.log("弹窗打开状态：", e);
		},
		/**
		 * 点击每个筛选项回调
		 * @param {Object} e { name, active, type } = e
		 */
		selectMenu(e) {
			const { name, active, type } = e;
			this.activeName = name;
			console.log("this.result", this.result);
			const find = this.result.find((item) => item.name == this.activeName);
			if (find) {
				console.log("111");
				const findIndex = this[this.activeName].child.findIndex(
					(item) => item.label == find.label && item.value == find.value,
				);
				this[this.activeName].activeIndex = findIndex;
			} else {
				console.log("222");
				// if(name === 'type'){
				// 	console.log("222",this[this.activeName]);
				// 	this[this.activeName].activeIndex = this[this.activeName].value;
				// 	return
				// }
				this[this.activeName].activeIndex = 0;
			}
		},
		/**
		 * 点击菜单回调处理
		 * @param {Object} item 选中项 { label,value } = e
		 */
		clickItem(e) {
			// 下面有重新赋值，所以用let
			let { label, value } = e;
			console.log("label", label);
			console.log("value", value);
			const findIndex = this.result.findIndex((item) => item.name == this.activeName);
			if (this.defaultValue.indexOf(value) > -1 && this[this.activeName].label) {
				label = this[this.activeName].label;
			}
			// label = this[this.activeName].label;
			console.log("findIndex", findIndex);
			// 已经存在筛选项
			if (findIndex > -1) {
				this.$set(this.result, findIndex, {
					name: this.activeName,
					label,
					value,
				});
			} else {
				this.result.push({
					name: this.activeName,
					label,
					value,
				});
			}
			this.result = this.result.filter((item) => this.defaultValue.indexOf(item.value) == -1);
			console.log("this.result", JSON.stringify(this.result));
			let list = this.result.map((item) => {
				return {
					name: item.name,
					value: item.value,
				};
			});
			console.log("list", list);
			let data = {
				is_all: 0,
				warehouse_id: undefined,
				class_name: undefined,
				type: undefined,
			};
			list.forEach((item) => {
				data[item.name] = item.value;
			});
			console.log("data", data);
			this.$emit("changeQuery", data);
			// uni.showModal({
			// 	content: `筛选的值：${JSON.stringify(this.result)}`,
			// });
		},
	},
	watch: {
		listType: {
			immediate: true, //初始化时让handler调用一下 //handler什么时候调用？当isHot发生改变时。
			handler(newValue, oldValue) {
				console.log("newValue", newValue);
				this.type.value = newValue;
				// this.type.label = this.type.child[newValue].label;
				// this.type.activeIndex = newValue;
				this.result[0] = {
					label: this.type.child[newValue].label,
					value: this.type.value,
					name: "type",
				};
			},
		},
	},
};
</script>

<style></style>
