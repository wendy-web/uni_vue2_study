<template>
	<uv-popup ref="popup" mode="right" :overlay="false" duration="0" custom-style="width: 100vw;height:100vh;background-color:#f6f6f6;overflow:auto">
		<uni-nav-bar
			background-color="linear-gradient(to left, #DAE3FF, #ECF4FF, #E1E8FF); "
			status-bar
			title="新建盘点预览"
			:border="false"
			fixed
			left-icon="left"
			@clickLeft="back"
		/>
		<view class="preview-wrapper">
			<view class="info">
				<view class="info-item">
					<text class="info-item-label">盘点日期：</text>
					<text class="info-item-value">{{ preInfo.inventory_time }}</text>
				</view>
				<view class="info-item">
					<text class="info-item-label">盘点仓库：</text>
					<text class="info-item-value">{{ preInfo.warehouse_name }}</text>
				</view>
				<view class="info-item">
					<text class="info-item-label">单据备注：</text>
					<text class="info-item-value">{{ preInfo.note }}</text>
				</view>
			</view>
			<view class="preview-list">
				<view class="preview-list-header">
					<view class="list-header">
						<view class="list-header-left">
							<image
								src="https://file.y1b.cn/public/erpxcx_img/common/goods_titleicon@2x.png"
								class="header-left-img"
							></image>
							<text>已盘商品列表</text>
						</view>
					</view>
					<!-- 商品提示 -->
					<view class="goods-header">
						<text>商品信息</text>
						<text>盘盈/亏</text>
					</view>
				</view>

				<view class="goods-item" v-for="(item, index) in preInfo.goods" :key="index">
					<view class="item-name">
						<text class="goods-name">{{ item.title }}</text>
						<text
							class="count-num"
							:class="{ red: item.diff_num < 0, green: item.diff_num > 0, black: item.diff_num == 0 }"
						>
							{{ item.diff_num }}
						</text>
					</view>
					<view class="goods-subitem">
						<text>条码：</text>
						<text>{{ item.barcode }}</text>
					</view>
					<view class="goods-subitem">
						<text>规格：</text>
						<text>{{ item.spec || "-" }}</text>
					</view>
					<view class="goods-subitem">
						<text>单位：</text>
						<text>{{ item.measure_name }}</text>
					</view>
					<view class="goods-subitem">
						<text>分类：</text>
						<text>{{ item.class_name }}</text>
					</view>
					<view class="goods-subitem">
						<text>批次/日期：</text>
						<text>{{ item.ph_no }}</text>
					</view>
					<view class="goods-subitem">
						<text>备注：</text>
						<text>{{ item.note || "无" }}</text>
					</view>
					<view class="goods-num">
						<view class="item-num">
							<text class="item-num-label">盘前数量：</text>
							<text>{{ item.in_num }}</text>
						</view>
						<view class="item-num">
							<text class="item-num-label">盘后数量：</text>
							<text>{{ item.inv_num }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="preview-footer">
				<view class="preview-footer-item">
					<uv-button text="关闭" @click="onCancel"></uv-button>
				</view>
				<view class="preview-footer-item">
					<uv-button text="保存" plain type="primary" @click="handleSave"></uv-button>
				</view>
				<view class="preview-footer-item">
					<uv-button text="提交审核" type="primary" @click="handleSubmit"></uv-button>
				</view>
			</view>
			<uv-toast ref="toast"></uv-toast>
		</view>
	</uv-popup>
</template>

<script>
import { addCheckApi, editCheckApi, submitCheckApi } from "@/api/modules/check.js";
export default {
	props: {
		preInfo: {
			type: Object,
			default: () => ({}),
		},
	},
	// 这里存放数据
	data() {
		return {
			saveId: 0,
		};
	},
	mounted() {},
	// 计算属性
	computed: {
		// 盘亏总数量
		shortage_num() {
			let goods = this.preInfo.goods;
			if (goods.length > 0) {
				let sum = 0;
				goods.forEach((item) => {
					sum += item.diff_num;
				});
				// 如果 sum 小于0 则返回sum,否则为0
				return sum < 0 ? sum : 0;
			} else {
				return 0;
			}
		},
		// 盘盈总数量
		surplus_num() {
			let goods = this.preInfo.goods;
			if (goods.length > 0) {
				let sum = 0;
				goods.forEach((item) => {
					sum += item.diff_num;
				});
				// 如果 sum 大于0 则返回sum,否则为0
				return sum > 0 ? sum : 0;
			} else {
				return 0;
			}
		},
	},
	// 方法集合
	methods: {
		back() {
			this.close();
		},
		open() {
			this.$refs.popup.open();
		},
		close() {
			this.$refs.popup.close();
			this.$emit("close");
		},
		// 点击取消
		onCancel() {
			this.close();
		},
		// 提交审核
		handleSubmit() {
			if (this.saveId) {
				uni.showModal({
					title: "温馨提示",
					content: "当前单据已保存,请您返回列表页后重试该操作。",
					showCancel: false,
					confirmText: "我知道了",
					success: (res) => {
						if (res.confirm) {
							this.saveId = 0;
							uni.reLaunch({
								url: "../list/list",
							});
						} else if (res.cancel) {
							console.log("用户点击取消");
						}
					},
				});
				return;
			}
			uni.showModal({
				title: "温馨提示",
				content: `是否需要更新库存?`,
				confirmText: "需要",
				cancelText: "不需要",
				success: async (res) => {
					if (res.confirm) {
						this.sendSubmit(1);
					} else if (res.cancel) {
						this.sendSubmit(2);
					}
				},
			});
		},
		async sendSubmit(up_inv) {
			let id = 0;
			if (this.preInfo.id) {
				id = await this.sendEditeData();
			} else {
				id = await this.sendAddData();
			}
			this.saveId = id;
			const result = await submitCheckApi({ id, up_inv });
			this.$refs.toast.show({
				type: "success",
				message: result.msg,
				duration: 1500,
			});
			setTimeout(() => {
				this.close();
			}, 1400);
			setTimeout(() => {
				uni.navigateBack();
			}, 1500);
		},
		async handleSave() {
			if (!this.preInfo.id) {
				delete this.preInfo.id;
			}
			let data = {
				...this.preInfo,
				shortage_num: this.shortage_num,
				surplus_num: this.surplus_num,
			};

			const result = this.preInfo.id ? await editCheckApi(data) : await addCheckApi(data);
			this.$refs.toast.show({
				type: "success",
				message: result.msg,
				duration: 1500,
			});
			setTimeout(() => {
				this.close();
			}, 1400);
			setTimeout(() => {
				uni.navigateBack();
			}, 1500);
		},
		async sendAddData() {
			delete this.preInfo.id;
			let data = {
				...this.preInfo,
				shortage_num: this.shortage_num,
				surplus_num: this.surplus_num,
			};
			const result = await addCheckApi(data);
			return result.data.id;
		},
		async sendEditeData() {
			let data = {
				...this.preInfo,
				shortage_num: this.shortage_num,
				surplus_num: this.surplus_num,
			};
			const result = await editCheckApi(data);
			return result.data.id;
		},
	},
};
</script>
<style lang="scss">
.preview-wrapper {
	.info {
		background-color: #fff;
		padding: 20rpx;
		.info-item {
			margin-bottom: 20rpx;
			&:last-child {
				margin-bottom: 0;
			}
		}
	}
	.preview-list {
		margin-top: 30rpx;
		padding-bottom: 120rpx;
		.preview-list-header {
			position: sticky;
			top: 0;
			z-index: 99;
		}
		.list-header {
			display: flex;
			justify-content: space-between;
			padding: 20rpx 0;
			background-color: #fff;
			border-bottom: 1rpx solid #e5e5e5;
			position: sticky;
			top: 0rpx;
			z-index: 99;
			&-left {
				display: flex;
				align-items: center;
				padding: 0 20rpx;
				.header-left-img {
					width: 40rpx;
					height: 40rpx;
					margin-right: 16rpx;
				}
			}
		}
		/* 商品提示 */
		.goods-header {
			background-color: #ecf0ff;
			height: 80rpx;
			font-size: 28rpx;
			color: #707072;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 40rpx;
		}
		.goods-item {
			background-color: #fff;
			padding: 20rpx;
			margin-bottom: 20rpx;
			/* 商品样式 */
			.goods-subitem {
				font-size: 24rpx;
				margin-top: 10rpx;
			}
			.goods-num {
				margin-top: 10rpx;
				display: flex;
				align-items: center;
				.item-num {
					flex: 1;
					text-align: left;
					&-label {
						color: #6f6f6f;
					}
				}
			}
			/* 商品名称样式 */
			.item-name {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 28rpx;
				margin-bottom: 16rpx;

				.goods-name {
					display: block;
					font-weight: bold;
					max-width: 490rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				/* 盘盈盘亏数量样式 */
				.count-num {
					display: block;
					width: 100rpx;
					text-align: center;
					font-weight: bold;
				}
			}
		}
	}
	.preview-footer {
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
