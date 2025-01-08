<template>
	<uv-popup ref="popup" mode="right" custom-style="width: 80vw;height:100vh;overflow:auto">
		<uni-nav-bar
			background-color="linear-gradient(to left, #DAE3FF, #ECF4FF, #E1E8FF); "
			status-bar
			title="选择标签明细"
			:border="false"
			fixed
			@clickLeft="close"
		/>
		<view class="unique-container">
			<view class="unique-list">
				<uv-checkbox-group v-model="checkboxValue">
					<uv-checkbox
						:customStyle="{ padding: '0 20rpx', width: '100%' }"
						v-for="(item, index) in checkboxList"
						:key="item.code"
						:label="item.code"
						:name="item.code"
					>
						<view class="unique-item">
							{{ item.code }}
						</view>
					</uv-checkbox>
				</uv-checkbox-group>
			</view>
			<view class="unique-footer">
				<view class="unique-footer-item">
					<uv-button text="关闭" @click="close"></uv-button>
				</view>
				<view class="unique-footer-item">
					<uv-button text="确定" plain type="primary" @click="handleConfirm"></uv-button>
				</view>
			</view>
		</view>
	</uv-popup>
</template>

<script>
import { getStocksUniqueLabelApi } from "@/api/modules/common.js";

export default {
	props: {
		listId: {
			type: Number,
			default: 0,
		},
	},
	// 这里存放数据
	data() {
		return {
			checkboxList: [],
			checkboxValue: [],
		};
	},

	// 计算属性
	computed: {},
	// 方法集合
	methods: {
		open(stock_id, list = []) {
			this.checkboxValue = list;
			this.$refs.popup.open();
			this.getData(stock_id);
		},
		close() {
			this.$refs.popup.close();
		},
		handleConfirm() {
			let list = this.checkboxList.filter((item)=>{
				return this.checkboxValue.includes(item.code)
			})
			// this.$emit("change", this.checkboxValue);
			this.$emit("change", list);
			this.close();
		},
		async getData(stock_id) {
			if (!stock_id) return;
			let apiData = {
				stock_id,
				type: this.listId ? 2 : 1,
				order_id: this.listId ? this.listId : undefined,
				order_type: 3,
				operate_type: 3,
			};
			const result = await getStocksUniqueLabelApi(apiData);
			let list = result.data.labels;
			this.checkboxList = list;
		},
	},
	watch: {
		list: {
			immediate: true, //初始化时让handler调用一下
			handler(newValue, oldValue) {
				this.checkboxList = newValue;
			},
		},
	},
};
</script>
<style lang="scss" scoped>
.unique-container {
	.unique-list {
		padding-top: 40rpx;
		padding-bottom: 140rpx;
		.unique-item {
			background-color: #ffffff;
			padding: 10rpx 20rpx;
		}
	}
	.unique-footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 100rpx;
		background-color: #ffffff;
		display: flex;
		justify-content: center;
		padding: 4rpx 40rpx 0rpx 40rpx;
		&-item {
			flex: 1;
			&:first-child {
				margin-right: 40rpx;
			}
			&:nth-child(2) {
				margin-right: 40rpx;
			}
		}
	}
}
</style>
