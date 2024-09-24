<template>
	<view class="detail-list">
		<view class="detail-header">
			<image
				src="https://file.y1b.cn/public/erpxcx_img/common/goods_titleicon@2x.png"
				class="detail-header-img"
			></image>
			<text>物料信息</text>
		</view>
		<view class="goods-item" v-for="(item, index) in goodsList" :key="item.id">
			<view class="item-name flex-between">
				<text class="goods-name">{{ item.title }}</text>
				<text class="goods-price" v-if="type == 1">￥{{ item.price }}</text>
			</view>
			<view class="item-barcode flex-between">
				<text class="goods-barcode">条码：{{ item.barcode }}</text>
				<!-- 采购单 -->
				<view class="goods-num" v-if="type == 1">X{{ item.num }}</view>
				<!-- 采购退货单 -->
				<view class="in-box" v-else-if="type == 2">
					<text class="in-num">{{ item.ret_num }}</text>
					<text class="in-text">退货数量</text>
				</view>
				<!-- 采购入库单 -->
				<view class="in-box" v-else-if="type == 4 || type == 12">
					<text class="in-num">{{ item.in_num }}</text>
					<text class="in-text">入库数</text>
				</view>
				<!-- 退货出库单 -->
				<view class="in-box" v-else-if="type == 5">
					<text class="in-num">{{ item.ret_num }}</text>
					<text class="in-text">出库数量</text>
				</view>
				<!-- 退料入库单 -->
				<view class="in-box" v-else-if="type == 7">
					<text class="in-num">{{ item.rec_num }}</text>
					<text class="in-text">入库数量</text>
				</view>
				<!-- 调拨单 -->
				<view class="in-box" v-else-if="type == 9">
					<text class="in-num">{{ item.rec_num }}</text>
					<text class="in-text">调拨数量</text>
				</view>
				<!-- 盘点单 -->
				<view class="apply-box" v-else-if="type == 10">
					<view class="apply-num">
						<text class="apply-num-left">{{ item.in_num }}</text>
						<text>/{{ item.inv_num }}</text>
					</view>
					<text class="apply-text">盘前数/盘后数</text>
				</view>
				<!-- 报废单 -->
				<view class="in-box" v-else-if="type == 11">
					<text class="in-num">{{ item.scr_num }}</text>
					<text class="in-text">数量</text>
				</view>
			</view>
			<view class="item-others">
				<view class="item-others-left">
					<view class="item-others-left-item">{{ item.brand || "无" }}</view>
					<view class="item-others-left-item">{{ item.spec || "无" }}</view>
				</view>
				<view class="item-others-right">
					<text class="unit">{{ item.measure_name }}</text>
				</view>
			</view>
			<!-- 单据类型为1: 采购单时的专属内容 -->
			<template v-if="type == 1">
				<view class="item-date flex-between">
					<view class="item-common">
						<text class="item-common-left">提交日期：</text>
						<text>{{ formartDate(item.submit_time) }}</text>
					</view>
					<view class="item-common">
						<text class="item-common-left">交货期：</text>
						<text>{{ formartDate(item.submit_time) }}</text>
					</view>
				</view>
				<view class="item-common" v-if="item.contract_no">
					<text class="item-common-left">合同号：</text>
					<text>{{ item.contract_no }}</text>
				</view>
				<view class="item-common" v-if="item.dept.name">
					<text class="item-common-left">需求部门：</text>
					<text>{{ item.dept.name }}</text>
				</view>
				<view class="item-common">
					<text class="item-common-left">供应商：</text>
					<text>{{ item.sup_name }}</text>
				</view>
			</template>
			<!-- 单据类型为2: 采购退货单时的专属内容 -->
			<!-- <template v-if="type == 2"></template> -->

			<!-- 单据类型为4: 采购入库单时的专属内容 -->
			<template v-if="type == 4">
				<view class="item-common" v-if="item.dept.name">
					<text class="item-common-left">需求部门：</text>
					<text>{{ item.dept.name }}</text>
				</view>
				<view class="item-common">
					<text class="item-common-left">供应商：</text>
					<text>{{ item.sup_name }}</text>
				</view>
			</template>
			<!-- 单据类型为7: 退料入库单时的专属内容 -->
			<template v-if="type == 7">
				<view class="item-common">
					<text class="item-common-left">入库仓库：</text>
					<text>{{ item.warehouse_name }}</text>
				</view>
				<view class="item-common">
					<text class="item-common-left">退料状态：</text>
					<text v-if="item.warehouse_confirm == 0">-</text>
					<text v-if="item.warehouse_confirm == 1">已确认</text>
					<text v-if="item.warehouse_confirm == 2">已驳回</text>
				</view>
			</template>
			<!-- 单据类型为11: 报废单时的专属内容 -->
			<template v-if="type == 11">
				<view class="item-common">
					<text class="item-common-left">出库仓库：</text>
					<text>{{ item.warehouse_name }}</text>
				</view>
			</template>
			<!-- 单据类型为12: 其他入库单时的专属内容 -->
			<template v-if="type == 12">
				<view class="item-common">
					<text class="item-common-left">供应商：</text>
					<text>{{ item.sup_name }}</text>
				</view>
			</template>
			<view class="item-common note">
				<text class="item-common-left">备注：</text>
				<text>{{ item.note || "无" }}</text>
			</view>
		</view>
	</view>
</template>
0
<script>
import dayJs from "@/utils/dayjs.min.js";
import { formartDate as formartDateFn } from "@/utils/validate";
/**
 * 本组件是详情页的 商品分组组件
 * @property {Number} type 1:采购单号,2:采购退货单号,3:换货单号,4采购入库单号,5退货出库单号,6领料出库单号,7:退料入库单号,8:拆装单单号,9:调拨单单号,10:盘点单单号,11:报废单单号
 * @property {Arrar} goods 数据内容数组
 */
export default {
	name: "wgoods-item",
	props: {
		/** 用于区分单据类型 */
		type: {
			type: Number,
			require: true,
		},
		goods: {
			type: Object,
			default: () => [],
		},
	},
	data() {
		return {
			goodsList: [],
		};
	},
	methods: {
		/** 直接使用 全局方法 编译到小程序报错,故使用此方法转译一次  */
		formartDate(date) {
			return formartDateFn(date);
		},
	},
	watch: {
		goods: {
			// immediate: true, //初始化时让handler调用一下 //handler什么时候调用？当isHot发生改变时。
			handler(newValue, oldValue) {
				// console.log("goods被修改了", newValue, oldValue);
				this.goodsList = newValue;
			},
		},
	},
};
</script>

<style lang="scss">
$commonColor: #707072;
$grayColor: #a3a2a8;

/* 商品列表样式开始 */
.detail-list {
	background-color: #ffffff;
	padding: 0 20rpx;
	padding-bottom: 20rpx;
	/* 商品列表头部样式 */
	.detail-header {
		height: 104rpx;
		display: flex;
		align-items: center;
		padding-left: 20rpx;
		font-size: 32rpx;
		font-weight: bold;
		&-img {
			width: 40rpx;
			height: 40rpx;
			margin-right: 16rpx;
		}
	}
}

/* 商品分组样式 */
.goods-item {
	padding: 20rpx;
	font-size: 28rpx;
	background-color: #fcfdff;
	margin-bottom: 10rpx;
	border: 1rpx solid #bccbff;
	border-radius: 20rpx;
	/* 商品名称整行样式 */
	.item-name {
		margin-bottom: 20rpx;
		.goods-name {
			display: block;
			font-weight: bold;
			max-width: 560rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.goods-price {
		}
	}

	/* 商品条码整行的样式 */
	.item-barcode {
		margin-bottom: 20rpx;
		.goods-barcode {
			font-size: 24rpx;
			color: $grayColor;
		}
		.goods-num {
			font-size: 36rpx;
			font-weight: bold;
			&::first-letter {
				font-size: 24rpx;
				color: $grayColor;
				letter-spacing: 10rpx;
			}
		}
		/* 入库单右侧数量 */
		.in-box {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			width: 172rpx;
			height: 90rpx;
			border: 2rpx solid #688bf2;
			border-radius: 10rpx;
			color: #688bf2;
			overflow: hidden;
			font-size: 24rpx;
			position: relative;
			box-sizing: border-box;
			.in-num {
				display: block;
				text-align: center;
				height: 45rpx;
				line-height: 45rpx;
			}
			.in-text {
				color: #87a3f4;
				display: block;
				width: 100%;
				height: 45rpx;
				text-align: center;
				background-color: #e6edff;
				line-height: 45rpx;
			}
		}

		.apply-box {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			width: 172rpx;
			height: 90rpx;
			border: 2rpx solid #688bf2;
			border-radius: 10rpx;
			color: #688bf2;
			overflow: hidden;
			font-size: 24rpx;
			position: relative;
			box-sizing: border-box;
			.apply-num {
				display: block;
				text-align: center;
				height: 45rpx;
				line-height: 45rpx;
				&-left {
					font-weight: bold;
				}
			}
			.apply-text {
				color: #87a3f4;
				display: block;
				width: 100%;
				height: 45rpx;
				text-align: center;
				background-color: #e6edff;
				line-height: 45rpx;
			}
		}
	}

	/* 商品其他信息: 品牌,规格,单位样式 */
	.item-others {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20rpx;

		/* 左侧品牌规格 */
		&-left {
			display: flex;

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

		/* 右侧单位 */
		&-right {
			.unit {
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
			}
		}
	}

	/* 使用地点样式 */
	.item-place {
		color: #a3a2a8;
		font-size: 28rpx;
	}
	.item-date {
		// margin-bottom: 20rpx;
	}
	.item-common {
		font-size: 26rpx;
		margin-bottom: 20rpx;
		&-left {
			color: $commonColor;
		}
		&.note {
			padding-top: 20rpx;
			margin-top: 20rpx;
			border-top: 1rpx solid #e5e5e5;
		}
	}
}
</style>
