<template>
<uv-popup ref="popup" mode="right">
	<uv-sticky :offset-top="0">
		<view class="width-full all-p-t-30 all-p-b-30 display_row_center text-align-c uv-border-bottom" style="background-color: #fff; width: 600rpx;">
			<uv-icon name="arrow-left" color="#333" size="24" @click="close"></uv-icon>
			<text class="width-full position-a t-w-bold">标识明细</text>
		</view>
		<view class="width-full uv-border-bottom all-p-lr-15 t-c-fff" style="background-color: #02A7F0; width: 600rpx;">
			<uv-checkbox-group v-model="checkboxAllValue" placement="column" @change="selChangeAllHandle">
				<uv-checkbox name="all" activeColor="#01C29F">
					<view class="width-full all-p-t-20 all-p-b-20 " slot="default">
						标识标签ID
					</view>
				</uv-checkbox>
			</uv-checkbox-group>
		</view>
	</uv-sticky>
	<view class="sel_cont">
		<view class="width-full all-p-lr-30">
			<uv-checkbox-group v-model="checkboxValue" placement="column" @change="selChangeHandle">
				<view class="width-full uv-border-bottom"
					v-for="(item, index) in checkboxList" :key="index">
					<uv-checkbox
						:label="item.code"
						:name="item.code"
						activeColor="#01C29F"
					>
						<view class="width-full all-p-t-20 all-p-b-20 " slot="default">
							{{ item.code }}
						</view>
					</uv-checkbox>
				</view>
			</uv-checkbox-group>
		</view>

	</view>
	<view class="footer-btn">
		<view class="footer-btn-item">
			<uv-button text="取消" plain type="primary" @click="close"></uv-button>
		</view>
		<view class="footer-btn-item">
			<uv-button text="确定" type="primary" @click="confirmHandle"></uv-button>
		</view>
	</view>
</uv-popup>
</template>

<script>
import { getStocksUniqueLabelApi } from "@/api/device/maintain/repair.js";
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
			checkboxValue: [],
			checkboxAllValue: [],
			// 基本案列数据
			checkboxList: []
		};
	},
	methods: {
		close() {
			this.$refs.popup.close();
		},
		async open(item) {
			const { rec_detail_id, stock_id, unique_label_detail,repair_id } = item;
			const params = {
				operate_type: this.operate_type,
				order_type: 11,
				rec_detail_id,
				stock_id,
				type: this.listId ? 2 : 1
			}
			if(this.listId) params.order_id = this.listId;
			if(this.operate_type==2) params.repair_id = repair_id;
			const res = await getStocksUniqueLabelApi(params);
			if(res.code != 1 || !res.data) return;
			this.checkboxList = res.data.labels;
			this.$refs.popup.open();
			if(unique_label_detail) {
				this.checkboxValue = unique_label_detail.map(res => res.unique_code || res.code);
				this.selChangeHandle();
			}
		},
		selChangeHandle(event) {
			event && (this.checkboxValue = event);
			if(this.checkboxValue.length == this.checkboxList.length) return this.checkboxAllValue = ['all'];
			this.checkboxAllValue = [];
		},
		selChangeAllHandle(event) {
			if(!event.length) return this.checkboxValue = [];
			this.checkboxValue = this.checkboxList.map(res => res.code);
		},
		confirmHandle() {
			const selList = this.checkboxList.filter(res => this.checkboxValue.includes(res.code));
			this.$emit('selList', selList);
			this.close();
		}
	},
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
