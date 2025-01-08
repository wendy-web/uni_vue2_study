<template>
	<view class="container">
		<uv-sticky offsetTop="0">
			<view class="search-container">
				<uv-search
					:showAction="true"
					actionText="搜索"
					:animation="true"
					bgColor="#F8FAFF"
					borderColor="#AEC2FF"
					@search="handleSearch"
					@custom="handleSearch"
					v-model="searchQuery.keyword"
				></uv-search>
				<wsearch-btn @reset="handleReset"></wsearch-btn>
			</view>
			<!-- <view class="select-dept">
				<span>所属部门</span>
				<uv-icon name="arrow-right"></uv-icon>
			</view> -->
			<wdrop @whChange="whConfirm" @deptChange="deptConfirm" ref="dropSelectRef"></wdrop>
		</uv-sticky>
		<view class="list">
			<template v-if="isMultiple">
				<uv-checkbox-group :value="checkboxValue" shape="circle" placement="column" iconPlacement="right" size="20">
					<uv-checkbox
						:customStyle="{ padding: '10rpx 20rpx', borderBottom: '2rpx solid #e5e5e5' }"
						v-for="(item, index) in dataList" :key="item.id"
						:label="item.name"
						:name="item.id"
						:disabled="disableList.includes(item.id)"
						@change="checkGroupChange($event, item.name, item.id)"
					>
						<!-- 	:disabled="item.id == checkboxValue[0]" -->
						<view class="item">
							<view class="sub-item">
								<text class="sub-item-label">名称：</text>
								<text>{{ item.name }}</text>
							</view>
							<view class="sub-item">
								<text class="sub-item-label">所属部门：</text>
								<text>{{ item.dept_name || "-" }}</text>
							</view>
							<view class="sub-item">
								<text class="sub-item-label">所属仓库：</text>
								<text class="sub-item-value">{{ item.belong_warehouses || "-" }}</text>
							</view>
						</view>
					</uv-checkbox>
				</uv-checkbox-group>
			</template>
			<template v-else>
				<uv-radio-group v-model="radioValue" placement="column" iconPlacement="right" size="20">
					<uv-radio
						:customStyle="{ padding: '10rpx 20rpx', borderBottom: '2rpx solid #e5e5e5' }"
						v-for="(item, index) in dataList" :key="item.id"
						:label="item.name"
						:name="item.id"
						:disabled="disableList.includes(item.id)"
						@change="radioChange($event, item.name)"
					>
						<view class="item">
							<view class="sub-item">
								<text class="sub-item-label">名称：</text>
								<text>{{ item.name }}</text>
							</view>
							<view class="sub-item">
								<text class="sub-item-label">所属部门：</text>
								<text>{{ item.dept_name || "-" }}</text>
							</view>
							<view class="sub-item">
								<text class="sub-item-label">所属仓库：</text>
								<text class="sub-item-value">{{ item.belong_warehouses || "-" }}</text>
							</view>
						</view>
					</uv-radio>
				</uv-radio-group>
			</template>
			<view class="footer-btn">
				<uv-button
					text="取消" plain type="primary"
					:custom-style="{ minWidth: '260rpx', borderRadius: '10rpx', borderWidth: '2rpx !important'}"
					@click="onCancel"
				></uv-button>
				<uv-button
					text="确认选择"
					type="primary"
					:custom-style="{ width: '260rpx', borderRadius: '10rpx', marginLeft: '60rpx' }"
					@click="onConfirm"
				></uv-button>
			</view>
		</view>
	</view>
</template>

<script>
import { getUserListApi } from "@/api/modules/common.js";
import wdrop from "@/components/wdrop-menu/wdrop.vue";
let eventChannel = undefined;
export default {
	components: {
		wdrop,
	},
	data() {
		return {
			isMultiple: false, //是否多选 默认不多选
			radioValue: 0, //单选value
			radioLabel: "", //单选label
			radioDisable: "", // 不可选
			checkboxValue: [], //多选value
			disableList: [], // 不可选列表
			// 列表数据
			dataList: [],
			searchQuery: {
				keyword: undefined,
				warehouse_id: undefined,
				dept_id: undefined,
			},
		};
	},
	onLoad(options) {
		eventChannel = this.getOpenerEventChannel();
		// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
		if (eventChannel.on) {
			eventChannel.on("acceptData", (data) => {
				console.log("acceptData", data);
				this.isMultiple = data.isMultiple;
				this.radioValue = data.radioValue;
				this.radioLabel = data.radioLabel;
				this.disableList = data.disableList || [];
				if(!data.isMultiple) return;
				this.checkboxValue = [...data.checkboxValue];
				this.labelList = [...data.labelList];
			});
		}
		this.getData();
	},
	methods: {
		async getData(page) {
			// console.log("data", data);
			let data = {
				...this.searchQuery,
			};
			try {
				uni.showLoading({
					title: "加载中",
				});
				const result = await getUserListApi(data);
				console.log("人员列表页", result);
				let res = result.data;
				this.dataList = res.list;
			} finally {
				uni.hideLoading();
			}
		},
		//点击搜索触发
		handleSearch() {
			this.getData();
		},
		checkGroupChange(e, label, id) {
			if (e) {
				this.labelList.push(label);
				this.checkboxValue.push(id);
			} else {
				let index = this.checkboxValue.indexOf(id);
				if (index !== -1) {
					this.labelList.splice(index, 1);
					this.checkboxValue.splice(index, 1);
				}
			}
		},
		radioChange(e, label) {
			this.radioLabel = label;
		},
		// 点击确认选择
		onConfirm() {
			// console.log('checkboxValue',this.checkboxValue);
			if (this.isMultiple) {
				console.log("checkboxValue", this.checkboxValue);
				console.log("labelList", this.labelList);
				eventChannel.emit("someEvent", { ar_uname: this.labelList, ar_uid: this.checkboxValue });
			} else {
				console.log("radioValue", this.radioValue);
				console.log("radioLabel", this.radioLabel);
				eventChannel.emit("someEvent", { label: this.radioLabel, value: this.radioValue });
			}
			uni.navigateBack();
		},
		onCancel() {
			uni.navigateBack();
		},
		// 选择仓库触发筛选
		whConfirm(e) {
			this.searchQuery.warehouse_id = e.warehouse_id;
			this.getData();
		},
		// 选择部门触发筛选
		deptConfirm(e) {
			this.searchQuery.dept_id = e.dept_id;
			this.getData();
		},
		// 点击重置
		handleReset() {
			this.searchQuery = {
				warehouse_id: undefined,
				dept_id: undefined, //部门id
				keyword: undefined,
			};
			this.$refs.dropSelectRef.reset();
			this.handleSearch();
		},
	},
};
</script>
<style lang="scss">
.container {
	padding-bottom: 120rpx;
	padding-bottom: calc(120rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}
.select-dept {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10rpx 20rpx;
	background-color: #f6f6f6;
	color: #676767;
}
.list {
	// padding-bottom: 120rpx;
	.item {
		margin-right: 40rpx;
		.sub-item {
			display: flex;
		}
		.sub-item-label {
			flex-shrink: 0;
			display: inline-block;
			width: 180rpx;
			color: #6f6f6f;
			margin-bottom: 10rpx;
		}
		.sub-item-value {
			display: inline-block;
		}
	}
}
.footer-btn {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 100rpx;
	background-color: #ffffff;
	display: flex;
	justify-content: center;
	border-top: 1rpx solid #e5e5e5;
	padding-top: 10rpx;
	padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
}
</style>
