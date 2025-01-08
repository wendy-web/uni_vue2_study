<template>
	<view class="stock-warning">
		<view class="stock-warning-header">
			<text class="line"></text>
			<text class="header-text">库存预警</text>
		</view>
		<view class="stock-warning-list">
			<navigator url="/pages/reportModule/goodsStock/list/list?type=1" class="stock-warning-item bg-blue">
				<text>库存下限</text>
				<text class="warning-num">{{ stock_warning_qty }}</text>
			</navigator>
			<navigator url="/pages/reportModule/goodsStock/list/list?type=2" class="stock-warning-item bg-blue">
				<text>库存上限</text>
				<text class="warning-num">{{ stock_warning_upper_qty }}</text>
			</navigator>
			<!-- 	<view class="stock-warning-item bg-blue">
				<text>库存上限</text>
				<text class="warning-num">{{ stock_warning_qty }}</text>
			</view> -->
		<!-- 	<navigator url="" class="stock-warning-item bg-gray">
				<text>保质期</text>
				<text class="warning-num">{{ exp_warning_qty }}</text>
			</navigator> -->
			<navigator url="/pages/reportModule/goodsStock/list/list?type=3" class="stock-warning-item bg-orange">
				<text>订货预警</text>
				<text class="warning-num">{{ goods_warning_qty }}</text>
			</navigator>
			<!-- 	<view class="stock-warning-item bg-orange">
				<text>订货预警</text>
				<text class="warning-num">{{ goods_warning_qty }}</text>
			</view> -->
		</view>
	</view>
</template>

<script>
import { getWarningDataApi } from "@/api/modules/home.js";
export default {
	data() {
		return {
			stock_warning_qty: "", //库存下限
			stock_warning_upper_qty: "", //库存上限
			exp_warning_qty: "", //保质期
			goods_warning_qty: "", //订货预警
		};
	},
	mounted() {
		this.getData();
	},
	methods: {
		async getData() {
			const result = await getWarningDataApi();
			this.stock_warning_qty = result.data.stock_warning_qty;
			this.stock_warning_upper_qty = result.data.stock_warning_upper_qty;
			this.exp_warning_qty = result.data.exp_warning_qty;
			this.goods_warning_qty = result.data.goods_warning_qty;
		},
	},
};
</script>
<style lang="scss">
$primary: #3c9cff;
.stock-warning {
	padding: 20rpx;
	&-header {
		font-weight: bold;
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		.line {
			display: inline-block;
			width: 8rpx;
			height: 36rpx;
			background-color: $primary;
			margin-right: 8rpx;
		}
	}
	.stock-warning-list {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(1, 140rpx);
		grid-column-gap: 20rpx;
		justify-content: center;
		.stock-warning-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			color: #fff;
			border-radius: 8rpx;
			&.bg-blue {
				background-color: #79bbff;
			}
			&.bg-gray {
				background-color: #c4c6c9;
			}
			&.bg-orange {
				background-color: #eebe77;
			}
			.warning-num {
				font-weight: bold;
				font-size: 40rpx;
			}
		}
	}
}
</style>
