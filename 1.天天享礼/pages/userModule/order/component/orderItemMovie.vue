<template>
<view class="item">
	<view class="type_top">
		<view class="type_lft">
			<image class="type_top-icon" mode="scaleToFill" src="../../static/order/icon_02.png"></image>
			<text class="type_lft-label">{{ item.movie.goods_sku_name }} </text>
		</view>
		<view class="type_rit" :class="'order-status-'+item.status">
			{{ ((item.status == 0) ? '待付款': item.statusDesc ) || item.order_status_name}}
		</view>
	</view>
	<view class="order" @click="jumpLinkHandle(item)">
		<view class="order_cont">
			<image class="order-img" mode="scaleToFill" :src="item.movie.goods_imgs"></image>
			<view class="order-detail">
				<view class="order-detail_txt">
					<view class="maxTwoLine">{{item.movie.goods_sku_name}}</view>
					<view class="order_type">{{item.movie.showTime}}</view>
				</view>
				<view class="order_num">
					共{{item.movie.seatsCount}}张
				</view>
			</view>
		</view>
	</view>
	<!-- 支付金额 -->
	<view class="pay-info" @click="jumpLinkHandle(item)">
		<text class="pay-info_label">{{[2,3,4,5].includes(Number(item.status))?'实付':'应付'}}</text>
		<view v-html="formatPrice(item.amount)"></view>
	</view>
	<!-- 待支付||去使用-->
	<view class="order-operate" v-if="item.status== 0" @click="jumpLinkHandle(item)">
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
	<view class="take" @click="jumpLinkHandle(item, 'home')" v-if="Number(item.status)">
		<view class="take_btn">再来一单</view>
	</view>
</view>
</template>
<script>
import { jumpLink } from '@/api/modules/discounts.js';
import { parseTime } from '@/utils/index.js';
import { mapGetters } from 'vuex';
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
	data() {
		return {
			bgColor:'#FCDB28'
		}
	},
	computed: {
        ...mapGetters(['userInfo']),
	},
	methods: {
		formatPrice(price = 0, type) {
			// if (!price) return;
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
		jumpLinkHandle(item, page = 'order') {
			if(page == 'home') return this.$goToMoviePlugin();
			// 1-电影票 2-肯德基 3-星巴克
			const params = {
				type: 1,
				page,
				orderNo: item.third_order_id,
				status: 1
			}
			jumpLink(params).then(res => {
				const link = res.data.url;
				this.$go(`/pages/webview/webview?link=${encodeURIComponent(link)}&bgColor=${this.bgColor}`);
			})
		}
	}
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
		width: 72rpx;
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
		color: #aaaaaa;
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
.order-remain-time {
	line-height: 34rpx;
	display: flex;
	align-items: center;
	font-size: 26rpx;
	text-align: left;
	color: #999999;
	line-height: 36rpx;
}
.expire-time {
	font-size: 26rpx;
	color: #aaaaaa;
	line-height: 36rpx
}
.btn {
	padding: 0 30rpx;
	height: 60rpx;
	line-height: 60rpx;
	box-sizing: border-box;
	text-align: center;
	border: 2rpx solid #ef2b20;
	border-radius: 36rpx;
	font-size: 28rpx;
	font-weight: 400;
	color: #ef2b20;
}
.count-down {
	color: #333333;
	font-size: 26rpx;
}
.maxTwoLine {
	text-overflow: -o-ellipsis-lastline;
	overflow: hidden;
	text-overflow: ellipsis;
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
.take{
	display: flex;
	justify-content: flex-end;
	margin: 32rpx 24rpx 0 0;
	.take_btn {
		padding: 0 30rpx;
		display: inline-block;
		line-height: 56rpx;
		border: 2rpx solid #cccccc;
		border-radius: 32rpx;
		text-align: center;
		font-size: 28rpx;
		color: #333333;
	}
}
</style>
