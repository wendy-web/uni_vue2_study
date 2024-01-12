<template>
<view class="item">
	<view class="type_top">
		<view class="type_lft">
			<image class="type_top-icon" mode="scaleToFill" :src="currentHaiwei.icon"></image>
			<text class="type_lft-label">{{ item.restaurant_name }} </text>
		</view>
		<view class="type_rit" :class="'order-status-'+ item.status">{{ status_title }}</view>
	</view>
	<view class="order" @click="toOrderDetailHandle">
		<view class="order_tag">{{item.channel_flag}}</view>
		<view class="order_cont" v-for="(orderItem, index) in item.detail" :key="index">
			<view class="order-img fl_center">
				<image class="widHei" mode="widthFix" :src="orderItem.product.product_img || currentHaiwei.product_img"></image>
			</view>
			<view class="order-detail">
				<view class="order-detail_txt">
					<view class="maxTwoLine">{{orderItem.product.product_name}}</view>
					<view class="order_type txt_ov_ell1" v-if="orderItem.sku_str">{{ orderItem.sku_str }}</view>
				</view>
				<view class="order_num"> 共{{orderItem.amount}}件 </view>
			</view>
		</view>
	</view>
	<!-- 支付金额 -->
	<view class="pay-info" @click="toOrderDetailHandle">
		<!-- 其他的品牌 >=2 -->
		<view class="total_amount" v-if="showTotalAmount(item.total_amount)">共{{ item.total_amount }}件</view>
		<text class="pay-info_label">{{[2,3,4,5].includes(Number(item.status))? '实付' : '应付' }}</text>
		<view v-html="formatPrice(item.pay_amount)"></view>
	</view>
	<!-- 只有瑞幸与麦当劳 - 呈现 -->
	<block v-if="[0, 1].includes(Number(currentHaiwei.type))">
		<!-- 待支付||去使用-->
		<view class="order-operate" v-if="item.status == 0" @click="payHandle">
			<view class="order-remain-time">
				<block v-if="item.remainTime">
					<view>剩余时间：</view>
					<view class="count-down">
						<view>{{item.remainTime|remainTime}}</view>
					</view>
				</block>
			</view>
			<view class="btn">去支付</view>
		</view>
		<view class="take"
			v-if="[3].includes(Number(item.status))"
			@click="takeCodeHandle"
		>
			<view class="take_btn">取餐码</view>
		</view>
		<view class="take" @click="againHandle(item.id)">
			<view class="take_btn">再来一单</view>
		</view>
	</block>
</view>
</template>

<script>
import { hwHome } from '@/api/modules/discounts.js';
import { orderAgain, orderPay } from '@/api/modules/takeawayMenu/luckin.js';
import { parseTime } from '@/utils/index.js';
import { haiWeiObj, haiWeiStatus } from '../static/config';
export default {
	props: {
		item: {
			type: Object,
		},
	},
	filters: {
		remainTime(val) {
			let format_time = '';
			if (val > 0) {
				format_time = parseTime(val, '{i}:{s}')
			}
			return format_time;
		}
	},
	computed: {
		status_title() {
			const status = this.item.status;
			return haiWeiStatus[status].title;
		},
		currentHaiwei(){
			const pay_way = this.item.pay_way;
			return haiWeiObj[pay_way];
		}
	},
	data() {
		return { }
	},
	methods: {
		formatPrice(price, type) {
			if (!price) return;
			price = Number(price / 100).toFixed(2);
			let splitPrice = price.split(".");
			let dom= '';
			switch(type) {
				case 1:
					dom = `<span style="font-weight:500;font-size: 16px;color: #333">¥${splitPrice[0]}.<span style="font-size: 13px;">${splitPrice[1]}</span></span>`;
					break;
				default:
					dom = `<span style="font-weight:500;font-size: 20px;color: #F84842">¥${splitPrice[0]}.<span style="font-size: 14px;">${splitPrice[1]}</span></span>`;
					break;
			}
			return dom;
		},
		showTotalAmount(amount) {
			let isShowTotal = amount > 1;
			if([0,1].includes(this.currentHaiwei.type)) {
				isShowTotal = (amount > 3);
			}
			return isShowTotal;
		},
		async payHandle() {
			const orderRes = await orderPay({ oid: this.item.id });
			const { code, data, msg } = orderRes;
			if(code != 1) return this.this.$toast(msg);
			this.createPayment(data);
		},
		// 创建支付
		createPayment(params) {
			uni.requestPayment({
				'nonceStr': params.nonceStr,
				'package': params.package,
				'paySign': params.paySign,
				'signType': params.signType,
				'timeStamp': params.timeStamp,
				success: (res) => {
					console.log('支付成功 - 下单成功', );
					this.toOrderDetailHandle();
				},
				fail: (res) => {
					console.log('取消支付', );
				}
			});
		},
		takeCodeHandle() {
			// 瑞幸 - 展示取餐码
			if(!this.currentHaiwei.type) return this.$emit('showTakeCode', this.item);
			this.toOrderDetailHandle();
		},
		async toOrderDetailHandle() {
			const { id, brand_id } = this.item;
			// 瑞幸/麦当劳进入 - 小程序的订单详情
			if([0, 1].includes(Number(this.currentHaiwei.type))) {
				this.$go(`${this.currentHaiwei.path}/order/index?oid=${id}`);
				return;
			}
			const res = await hwHome({brand_id});
			if(res.code != 1) return this.$toast(res.msg);
			const link = encodeURIComponent(res.data);
			this.$go(`/pages/webview/webview?link=${link}&bgColor=#fff`);
		},
		async againHandle(oid) {
			const res = await orderAgain({ oid });
			if(res.code != 1) return;
			const { brand_id } = res.data;
			this.$go(`${this.currentHaiwei.path}/index?brand_id=${brand_id}&rote=1&again=true&isBack=1`);
		}
	},
}
</script>
<style lang="scss">
.item {
	min-height: 258rpx;
	box-sizing: border-box;
	background: #ffffff;
	border-radius: 16rpx;
	margin-top: 16rpx;
	padding-bottom: 32rpx;
}
.order {
	padding: 19rpx 24rpx 26rpx;
	.order_tag {
		display: inline-block;
		padding: 0 12rpx;
		height: 34rpx;
		background: rgba($color: #FEA367, $alpha: .3);
		border-radius: 8rpx;
		font-size: 24rpx;
		text-align: center;
		color: #ff9b58;
		line-height: 34rpx;
		margin-bottom: 20rpx;
	}
	.order_cont{
		display: flex;
		justify-content: space-between;
		margin-top: 13rpx;
	}
	.order_type{
		height: 36rpx;
		font-size: 26rpx;
		text-align: left;
		color: #aaa;
		line-height: 36rpx;
	}
	.order_num {
		height: 40rpx;
		font-size: 28rpx;
		color: #333333;
		line-height: 40rpx;
		margin-left: 10rpx;
	}
}
.order-img {
	flex-shrink: 0;
	width: 160rpx;
	height: 160rpx;
	margin-right: 26rpx;
	border-radius: 16rpx;
}
.order-detail {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	min-height: 100rpx;
	padding-right: 10rpx;
	font-size: 28rpx;
	color: #333333;
	line-height: 40rpx;
	.order-detail_txt {
		flex: 1;
		align-self: stretch;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		width: 0;
	}
}
.order-status {
	font-size: 26rpx;
	font-weight: 400;
	line-height: 36rpx;
	min-width: 88rpx;
	text-align: right;
}
.order-status-0 {
	color: #ef2b20;
}
.order-status-1 {
	color: #999999;
}
.order-status-2 {
	color: #333333;
}
.order-type {
	width: 72rpx;
	height: 34rpx;
	line-height: 34rpx;
	text-align: center;
	background: #f3f5f9;
	border-radius: 4rpx;
	font-size: 24rpx;
	font-weight: 400;
	color: #666666;
	margin-top: 30rpx;
}
.pay-info {
	font-size: 24rpx;
	font-weight: 400;
	color: #333333;
	line-height: 34rpx;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	padding: 0 24rpx;
	.pay-info_label {
		margin-right: 8rpx;
	}
	.total_amount{
		margin-right: 10rpx;
	}
}
.pay-price {
	font-size: 32rpx;
	font-weight: 500;
	color: #333333;
	line-height: 38rpx;
}
.order-operate {
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-sizing: border-box;
	margin-top: 24rpx;
	padding: 21rpx 24rpx 0;
}
.take{
	display: flex;
	justify-content: flex-end;
	margin: 32rpx 24rpx 0 0;
	.take_btn {
		padding: 0 30rpx;
		display: inline-block;
		line-height: 56rpx;
		border: 1rpx solid #cccccc;
		border-radius: 32rpx;
		text-align: center;
		font-size: 28rpx;
		color: #333333;
	}
}

.order-remain-time {
	line-height: 34rpx;
	display: flex;
	align-items: center;
	font-size: 26rpx;
	text-align: left;
	color: #999999;
	line-height: 36rpx;
}
.btn {
	// width: 144rpx;
	padding: 0 30rpx;
	height: 60rpx;
	line-height: 60rpx;
	box-sizing: border-box;
	text-align: center;
	border: 1rpx solid #f84842;
	border-radius: 36rpx;
	font-size: 28rpx;
	font-weight: 400;
	color: #f84842;
}
.count-down {
	color: #333333;
	font-size: 26rpx;
}
.maxTwoLine {
	text-overflow: -o-ellipsis-lastline;
	overflow: hidden;
	text-overflow: ellipsis;
	// white-space: nowrap;
	display: -webkit-box;
	line-clamp: 2;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	font-weight: 600;
}
.type_top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 18rpx 24rpx 18rpx 26rpx;
	border-bottom: 2rpx solid #f1f1f1;
	.type_lft {
		display: flex;
		align-items: center;
		font-size: 26rpx;
		font-weight: 500;
		color: #333333;
		line-height: 36rpx;
		overflow: hidden;
		.type_lft-label{
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
			flex: 1;
		}
	}
	.type_top-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 10rpx;
	}
}
.type_rit {
	font-size: 26rpx;
	font-weight: 400;
	color: #666666;
	line-height: 36rpx;
	white-space: nowrap;
}
</style>
