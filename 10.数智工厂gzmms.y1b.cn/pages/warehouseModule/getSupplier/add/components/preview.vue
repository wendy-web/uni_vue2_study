<template>
	<uv-popup
		ref="popup"
		mode="right"
		:overlay="false"
		duration="0"
		custom-style="width: 100vw;height:100vh;background-color:#f6f6f6;overflow:auto"
	>
		<uni-nav-bar
			background-color="linear-gradient(to left, #DAE3FF, #ECF4FF, #E1E8FF); "
			status-bar
			title="领料单预览"
			:border="false"
			fixed
			left-icon="left"
			@clickLeft="close"
		/>
		<view class="preview-container">
			<view class="info">
				<view class="info-item">
					<text class="info-item-label">出库仓库：</text>
					<text class="info-item-value">{{ preInfo.warehouse_name }}</text>
				</view>
				<view class="info-item">
					<text class="info-item-label">出库日期：</text>
					<text class="info-item-value">{{ preInfo.out_time }}</text>
				</view>
				<view class="info-item">
					<text class="info-item-label">单据备注：</text>
					<text class="info-item-value">{{ preInfo.note || "-" }}</text>
				</view>
				<view class="info-item">
					<text class="info-item-label">领料类型：</text>
					<text class="info-item-value">{{ preInfo.rec_type_name }}</text>
				</view>
				<view class="info-item">
					<text class="info-item-label">领料申请人：</text>
					<text class="info-item-value">{{ preInfo.rp_uname }}</text>
				</view>
				<view class="info-item">
					<text class="info-item-label">指定领取人：</text>
					<text class="info-item-value" v-for="(item, index) in preInfo.ar_uname" :key="index">{{ item }};</text>
				</view>
				<view class="info-item">
					<text class="info-item-label">指定审批人：</text>
					<text class="info-item-value">{{ preInfo.ap_uname }}</text>
				</view>
			</view>
			<view class="list">
				<view class="list-header">
					<view class="list-header-left">
						<!-- <uv-icon name="list" color="#688BF2" :custom-style="{ marginRight: '10rpx' }"></uv-icon> -->
						<image
							src="https://file.y1b.cn/public/erpxcx_img/common/goods_titleicon@2x.png"
							class="header-left-img"
						></image>
						<text class>领出商品</text>
					</view>
				</view>
				<view class="item" v-for="(item, index) in preInfo.goods" :key="index">
					<view class="item-header">
						<view class="item-warehouse">{{ item.warehouse_name }}</view>
						<view class="item-stock">
							<text>申请数量：</text>
							<text class="item-stock-num">{{ item.rec_num }}</text>
						</view>
					</view>
					<view class="item-content">
						<view class="goods-name">{{ item.title }}</view>
						<view class="content-row">
							<text class="row-label">备注：</text>
							<text class="row-value">{{ item.note || "-" }}</text>
						</view>
						<view class="content-row">
							<text class="row-label">使用地点：</text>
							<text class="row-value" v-for="(place, index) in item.use_place_name" :key="index">
								{{ place }}
							</text>
						</view>
						<view class="content-row">
							<text class="row-label">条码：</text>
							<text class="row-value">{{ item.barcode }}</text>
						</view>
						<view class="content-row">
							<text class="row-label">单位：</text>
							<text class="row-value">{{ item.unit || "-" }}</text>
						</view>
						<view class="content-row">
							<text class="row-label">品牌：</text>
							<text class="row-value">{{ item.brand || "-" }}</text>
						</view>
						<view class="content-row">
							<text class="row-label">规格型号：</text>
							<text class="row-value">{{ item.spec || "-" }}</text>
						</view>
						<!-- <view class="content-row">
							<text class="row-label">批次/日期：</text>
							<text class="row-value">{{ item.batch_number || "-" }}</text>
						</view> -->
						<view class="content-flex">
							<view class="flex-box">
								<text class="row-label">入库日期：</text>
								<text class="row-value">{{ item.in_wh_date || "-" }}</text>
							</view>
							<view class="flex-box">
								<text class="row-label">批次/日期：</text>
								<text class="row-value">{{ item.batch_number }}</text>
							</view>
						</view>
						<view class="content-flex">
							<view class="flex-box">
								<text class="row-label">生产日期：</text>
								<text class="row-value">{{ item.pro_time || "-" }}</text>
							</view>
							<view class="flex-box">
								<text class="row-label">到期日期：</text>
								<text class="row-value">{{ item.exp_time || "-" }}</text>
							</view>
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
import { addGetSupApi, editGetSupApi, submitGetSupApi } from "@/api/modules/getSupplier.js";
import { checkTargetType } from "@/utils/target.js";
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

	// 方法集合
	methods: {
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
		async handleSubmit() {
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
			let id = 0;
			if (this.preInfo.id) {
				id = await this.sendEditeData();
			} else {
				id = await this.sendAddData();
			}
			this.saveId = id;
			const result = await submitGetSupApi({ id });
			this.$refs.toast.show({
				type: "success",
				message: result.msg,
				duration: 1500,
			});
			setTimeout(() => {
				this.close();
			}, 1400);
			setTimeout(() => {
				checkTargetType("pages/warehouseModule/getSupplier/list/list");
			}, 1500);
		},
		async handleSave() {
			if (!this.preInfo.id) {
				delete this.preInfo.id;
			}
			let data = this.preInfo;
			const result = this.preInfo.id ? await editGetSupApi(data) : await addGetSupApi(data);
			this.$refs.toast.show({
				type: "success",
				message: result.msg,
				duration: 1500,
			});
			setTimeout(() => {
				this.close();
			}, 1400);
			setTimeout(() => {
				checkTargetType("pages/warehouseModule/getSupplier/list/list");
			}, 1500);
		},
		async sendAddData() {
			delete this.preInfo.id;
			let data = this.preInfo;
			const result = await addGetSupApi(data);
			return result.data.id;
		},
		async sendEditeData() {
			let data = this.preInfo;
			const result = await editGetSupApi(data);
			return result.data.id;
		},
	},
	// 计算属性
	computed: {},
};
</script>
<style lang="scss">
.preview-container {
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
	.list {
		margin-top: 30rpx;
		padding-bottom: 120rpx;
		&-header {
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
		.item {
			background-color: #fff;
			padding: 20rpx;
			margin-bottom: 20rpx;
			&-header {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.item-warehouse {
					font-weight: bold;
				}
				.item-stock {
					display: flex;
					align-items: center;
					&-num {
						color: #2979ff;
					}
				}
			}
			&-content {
				margin-top: 20rpx;
				.goods-name {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.content-row {
					margin-top: 10rpx;
					font-size: 24rpx;
					.row-label {
						color: #a3a2a8;
					}
					.row-value {
					}
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
