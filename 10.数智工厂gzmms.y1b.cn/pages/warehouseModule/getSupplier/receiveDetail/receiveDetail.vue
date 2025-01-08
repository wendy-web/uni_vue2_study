<template>
	<view class="container">
		<uv-skeletons :loading="loading" :skeleton="skeleton">
			<view class="header-hint flex-align">
				<uv-icon
					name="info-circle-fill"
					color="#ff9100"
					:label="orderStatus"
					labelColor="#ff9100"
					labelSize="14"
					space="8"
				></uv-icon>
			</view>
			<!-- 物料品种和合计数 -->
			<view class="total" v-if="status == 10">
				<view class="total-item">
					<text class="total-item-num">{{ info.breed_num }}</text>
					<text class="total-item-hint">物料品种</text>
				</view>
				<view class="total-item">
					<text class="total-item-num">{{ info.wait_receive_total_num }}</text>
					<text class="total-item-hint">合计数</text>
				</view>
			</view>
			<!-- 领料明细 -->
			<view class="list">
				<view class="detail-header">
					<image
						src="https://file.y1b.cn/public/erpxcx_img/common/goods_titleicon@2x.png"
						class="detail-header-img"
					></image>
					<text>领料明细</text>
				</view>
				<view class="list-item" v-for="(item, index) in goods" :key="item.id">
					<view class="item-top flex-between">
						<text class="item-top-left">{{ item.warehouse_name }}</text>
						<!-- <text class="gary-text">申请数：{{ item.rec_num }}</text> -->
						<text class="item-top-right">{{ item.ws_code }}</text>
					</view>
					<view class="goods-name">{{ item.title }}</view>
					<view class="item-barcode flex-between">
						<text class="gary-text">条码：{{ item.barcode }}</text>
						<!-- 	<view class="flex-align">
							<text class="gary-text">待领数：</text>
							<text class="item-barcode-num">{{ item.this_wait_received_num }}</text>
						</view> -->
					</view>
					<view class="item-others">
						<view class="item-others-item" v-if="item.brank">{{ item.brank }}</view>
						<view class="item-others-item" v-if="item.spec">{{ item.spec }}</view>
					</view>
					<view class="item-flex">
						<view class="flex-box">
							<text>入库日期：</text>
							<text>{{ item.in_wh_date || "-" }}</text>
						</view>
						<view class="flex-box">
							<text>批次/日期：</text>
							<text>{{ item.ph_no }}</text>
						</view>
					</view>
					<view class="item-flex">
						<view class="flex-box">
							<text>申请数：</text>
							<text class="blue">{{ item.rec_num }}</text>
						</view>
						<view class="flex-box">
							<text>已发数：</text>
							<text class="green">{{ item.issue_num }}</text>
						</view>
					</view>
					<view class="item-num flex-between">
						<text>本次发料</text>
						<text class="item-num-value">{{ item.this_wait_received_num }}</text>
					</view>
				</view>
			</view>
			<view class="footer-btn">
				<template v-if="checkAssocType(assoc_type, 8) && status == 10 && checkBtn(['sto:getsup:receive'])">
					<uv-button type="primary" shape="circle" text="确认领料" size="large" @click="confirmReceive"></uv-button>
				</template>
			</view>
		</uv-skeletons>
	</view>
</template>

<script>
import { parseQuery } from "@/utils/index.js";
import { detailGetSupApi, confirmReceiveApi } from "@/api/modules/getSupplier.js";
import { statusMap, checkAssocType as checkAssocTypeFn } from "../index.js";
import { hasPerm } from "@/utils/auth.js";
export default {
	data() {
		return {
			isConfirm: false, //是否已经确认了
			order_id: 0,
			info: {},
			goods: [],
			status: 0, //单据状态
			/** 身份表示数组 */
			assoc_type: [], //
			/** 新标识, 是否制单人:1为制单人,0不是 */
			is_ct_user: 0,
			/** 是否部分领取 是否有领取过；0：不是；1：是； */
			is_have_received: 0,
			/** 是否强制完结；0：否；1：是；  */
			is_force_receive: 0,
			/** 是否部分发料  0：不是；1：部分发料；*/
			is_part_issue: 0,
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
				{
					type: "flex",
					num: 1,
					style: "background:#fff;marginBottom:40rpx;padding:40rpx;",
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
	onLoad(options) {
		console.log("options", options);
		if (options.q) {
			const q = decodeURIComponent(options.q); // 获取到二维码原始链接内容
			console.log("q", q);
			let ewmQuery = parseQuery(q);
			console.log("ewmQuery", ewmQuery);
			this.order_id = ewmQuery.id;
		}
	},
	// 生命周期 - 监听页面显示
	onShow() {
		this.getData();
	},
	methods: {
		checkBtn(sign) {
			return hasPerm(sign);
		},
		checkAssocType(assocType, query) {
			return checkAssocTypeFn(assocType, query);
		},
		async getData() {
			if (!this.order_id) return;
			const result = await detailGetSupApi({ id: this.order_id });
			this.loading = false;
			console.log("领料详情res", result);
			let res = result.data;
			this.info = result.data;
			this.goods = result.data.goods;
			this.status = result.data.status;
			this.assoc_type = result.data.assoc_type;
			this.is_ct_user = result.data.is_ct_user;
			this.is_have_received = result.data.is_have_received;
			this.is_force_receive = result.data.is_force_receive;
			this.is_part_issue = result.data.is_part_issue;
		},
		/* 点击确认领取 */
		async confirmReceive() {
			// uni.$uv.toast("点击确认领料");
			uni.showModal({
				title: "温馨提示",
				content: `确认本次领料种类、数量无误吗?`,
				success: async (res) => {
					if (res.confirm) {
						this.sendReceive();
					} else if (res.cancel) {
						console.log("用户点击取消");
					}
				},
			});
		},
		async sendReceive() {
			let goods = this.goods.map((item) => {
				return {
					id: item.id,
					receiv_num: item.this_wait_received_num,
					goods_id: item.goods_id,
					goods_all_id: item.goods_all_id,
				};
			});
			let id = this.order_id;
			const result = await confirmReceiveApi({ id, goods });
			uni.showToast({
				title: result.msg,
				duration: 1500,
				mask: true,
			});
			setTimeout(() => {
				this.getData();
			}, 1500);
		},
	},

	// 计算属性
	computed: {
		orderStatus() {
			let check = checkAssocTypeFn(this.assoc_type, 3);
			if (this.status == 1 && check) return "已审核";
			return statusMap.get(this.status);
		},
	},
};
</script>

<style lang="scss">
page {
	background-color: #f5f5f5;
}
.container {
	position: relative;
	padding-bottom: calc(120rpx + env(safe-area-inset-bottom));

	/* 已经 确认领取了 展示的头部信息 */
	.give-info {
		padding: 40rpx;
		background-color: #fff;
		margin-bottom: 20rpx;
		font-size: 28rpx;
		.give-item {
			margin-bottom: 20rpx;
			&-left {
				display: inline-block;
				width: 160rpx;
				text-align: right;
				margin-right: 20rpx;
				font-weight: bold;
			}
			&:last-child {
				margin-bottom: 0;
			}
		}
	}

	.header-hint {
		height: 80rpx;
		background-color: #fff9f5;
		border: 2rpx solid #ff9100;
		padding-left: 40rpx;
		margin: 10rpx 0;
	}

	/* 底部按钮 */
	.footer-btn {
		position: fixed;
		bottom: 0rpx;
		left: 0rpx;
		right: 0rpx;
		background-color: #fff;
		padding: 20rpx 20rpx 60rpx 20rpx;
	}

	.total {
		height: 140rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: space-around;
		padding: 0 100rpx;
		margin-bottom: 20rpx;
		.total-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			&-num {
				display: block;
				font-size: 40rpx;
				font-weight: bold;
				color: #ff5722;
				margin-bottom: 20rpx;
			}
			&-hint {
				font-size: 28rpx;
				font-weight: bold;
			}
		}
	}
	.list {
		// background-color: #fff;
		/* 商品列表头部样式 */
		.detail-header {
			height: 104rpx;
			display: flex;
			align-items: center;
			padding-left: 40rpx;
			font-size: 32rpx;
			font-weight: bold;
			border-bottom: 1rpx solid #e5e5e5;
			background-color: #fff;
			&-img {
				width: 40rpx;
				height: 40rpx;
				margin-right: 16rpx;
			}
		}
		/* 通用灰色类名 */
		.gary-text {
			color: #a3a2a8;
		}
		.list-item {
			padding: 20rpx 40rpx;
			font-size: 28rpx;
			// border-bottom: 2rpx solid #e5e5e5;
			background-color: #fff;
			margin-bottom: 10rpx;
			.goods-name {
				font-weight: bold;
				max-width: 600rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				margin-bottom: 10rpx;
			}
			.item-top {
				margin-bottom: 10rpx;
				&-left {
					font-weight: bold;
				}
				&-right {
					font-weight: bold;
					color: #2b5afc;
				}
			}
			.item-barcode {
				margin-bottom: 10rpx;
				&-num {
					color: #2b5afc;
					font-weight: bold;
					font-size: 40rpx;
				}
				.unit {
					display: inline-block;
					margin-left: 8rpx;
				}
			}
			.item-others {
				display: flex;
				margin-bottom: 10rpx;
				&-item {
					background-color: #ecf0ff;
					max-width: 212rpx;
					height: 48rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					border-radius: 10rpx;
					line-height: 48rpx;
					text-align: center;
					font-size: 28rpx;
					color: #707072;
					padding: 0 20rpx;
					margin-right: 20rpx;

					&:last-child {
						margin-right: 0;
					}
				}
			}
			.item-flex {
				margin-bottom: 10rpx;
				display: flex;
				justify-content: space-between;
				.flex-box {
					flex: 1;
					flex-shrink: 0;
					color: #767a82;
				}
				.blue {
					color: #688bf2;
					font-weight: bold;
				}
				.green {
					color: #53c21d;
					font-weight: bold;
				}
			}
			.item-num {
				font-weight: bold;
				&-value {
					font-size: 32rpx;
					color: #ff9100;
				}
			}
		}
	}
}
</style>
