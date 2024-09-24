<template>
	<view class="goods-list">
		<uv-skeletons :loading="loading" :skeleton="skeleton">
			<view class="goods-item">
				<view class="goods-info">
					<view class="info-name">{{ scanInfo.title }}</view>
					<view class="info-item">
						<text class="info-item-label">条码：</text>
						<text>{{ scanInfo.barcode }}</text>
					</view>
					<view class="info-item">
						<text class="info-item-label">规格型号：</text>
						<text>{{ scanInfo.spec || "-" }}</text>
					</view>
					<view class="info-item">
						<text class="info-item-label">单位：</text>
						<text>{{ scanInfo.measure_name }}</text>
					</view>
					<view class="info-item">
						<text class="info-item-label">分类：</text>
						<text>{{ scanInfo.class_name }}</text>
					</view>
					<view class="info-item">
						<text class="info-item-label">品牌：</text>
						<text>{{ scanInfo.brand || "-" }}</text>
					</view>
					<view class="info-item">
						<text class="info-item-label">自定义类别：</text>
						<text>{{ scanInfo.goods_class || "-" }}</text>
					</view>
				</view>
				<view class="stock-info" v-for="(item, index) in scanInfo.inventory" :key="index">
					<view class="stock-info-warehouse">{{ item.warehouse_name }}</view>
					<view class="stock-info-content">
						<view class="stock-info-content-sub">
							<text class="row-label">可用库存:</text>
							<text>{{ item.stock }}</text>
						</view>
						<view class="stock-info-content-sub">
							<text class="row-label" decode>安全库存:</text>
							<text>{{ item.stock_warning_qty }}</text>
						</view>
						<view class="stock-info-content-sub">
							<text class="row-label" decode>订货点:</text>
							<text>{{ item.goods_warning_qty }}</text>
						</view>
					</view>
				</view>
				<view class="stock-info-null" v-if="scanInfo.inventory.length === 0">
					<uv-empty text="该货品没有可用库存" icon="info-circle-fill" iconSize="30"></uv-empty>
				</view>
				<view class="btn-box">
					<view class="btn-item">
						<uv-button type="primary" text="领用出库" @click="toGetSupplier"></uv-button>
					</view>
				</view>
			</view>
		</uv-skeletons>
	</view>
</template>

<script>
/* 此页面是物料扫码(标签)进入的页面 */
import { parseQuery } from "@/utils/index.js";
import { getLabelInfoXcxApi } from "@/api/modules/common.js";
import { mapMutations } from "vuex";
export default {
	// 这里存放数据
	data() {
		return {
			content: "", //存放扫码内容
			scanInfo: {
				inventory: [],
			}, //数据
			loading: true,
			skeleton: [
				{
					type: "flex",
					num: 1,
					style: "background:#fff;marginBottom:40rpx;padding:40rpx",
					children: [
						{
							type: "line",
							num: 1,
							style: "width:200rpx;height:100rpx;",
						},
						{
							type: "line",
							num: 4,
							style: [null, "width:360rpx;", "width:300rpx;", "width:200rpx;"],
						},
					],
				},
				{
					type: "flex",
					num: 1,
					style: "background:#fff;marginBottom:40rpx;padding:40rpx",
					children: [
						{
							type: "line",
							num: 1,
							style: "width:200rpx;height:100rpx;",
						},
						{
							type: "line",
							num: 4,
							style: [null, "width:360rpx;", "width:300rpx;", "width:200rpx;"],
						},
					],
				},
			],
		};
	},

	// 生命周期 - 监听页面加载
	onLoad(options) {
		console.log("options", options);
		if (options.q) {
			const q = decodeURIComponent(options.q); // 获取到二维码原始链接内容
			console.log("q", q);
			let ewmQuery = parseQuery(q);
			console.log("ewmQuery", ewmQuery);
			this.content = ewmQuery.c;
			this.getData();
		}
	},
	// 生命周期 - 监听页面显示
	onShow() {},
	// 计算属性
	computed: {},
	// 方法集合
	methods: {
		...mapMutations({
			SETMODULETYPE: "user/SETMODULETYPE",
		}),
		async getData() {
			this.SETMODULETYPE(0);
			const result = await getLabelInfoXcxApi({ content: this.content });
			this.loading = false;
			this.scanInfo = result.data;
		},
		// 点击领用出库按钮
		toGetSupplier() {
			this.SETMODULETYPE(0);
			let barcode = this.scanInfo.barcode;
			uni.redirectTo({
				url: `/pages/warehouseModule/getSupplier/add/add?barcode=${barcode}`,
			});
		},
	},
	onHide() {}, // 生命周期 - 监听页面隐藏
	onUnload() {}, // 生命周期 - 监听页面卸载
};
</script>
<style lang="scss">
page {
	background-color: #f6f6f6;
}
.goods-list {
	padding-bottom: 80rpx;
	.goods-item {
		padding: 20rpx;
		background-color: #fff;
		// margin-bottom: 20rpx;
		.goods-info {
			margin-bottom: 20rpx;
			.info-name {
				font-weight: bold;
			}
			.info-item {
				font-size: 28rpx;
				margin-top: 8rpx;
				&-label {
					color: #a3a2a8;
				}
				&-value {
				}
			}
		}
		.stock-info {
			border-top: 2rpx solid #e5e5e5;
			padding: 20rpx 0;
			&-warehouse {
				font-weight: bold;
				margin-bottom: 8rpx;
			}
			&-content {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.row-label {
					color: #a3a2a8;
				}
			}
		}
	}

	.btn-box {
		margin-top: 20rpx;
	}
}
</style>
