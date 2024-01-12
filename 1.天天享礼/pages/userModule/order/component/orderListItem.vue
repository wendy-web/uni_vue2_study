<template>
<view class="box">
<block v-for="(item,index) in newList" :key="index">
	<!-- 千猪电影的模块 -->
	<orderItemMovie ref="orderItemMovie" :item="item" v-if="item.goods_type == 2">
	</orderItemMovie>
	<orderItemKfc ref="orderItemKfc" :item="item" v-else-if="item.goods_type == 3">
	</orderItemKfc>
	<orderItemStarbucks ref="orderItemStarbucks" :item="item" v-else-if="item.goods_type == 4">
	</orderItemStarbucks>
	<!-- 海威的订单 -->
	<orderItemHaiwei ref="orderItemHaiwei"
		:item="item"
		v-else-if="[6].includes(item.goods_type)"
		@showTakeCode="(item) => this.$emit('showTakeCode', item)"
	>
	</orderItemHaiwei>
	<orderItemPhone ref="orderItemPhone" :item="item" v-else-if="[9].includes(item.goods_type)"></orderItemPhone>
	<view class="item" v-else>
		<view class="type_top">
			<view class="type_lft">
				<image class="type_top-icon" mode="scaleToFill" :src="item.goodsTypeIcon"></image>
				<text>{{ item.goodsTypeTxt }} </text>
			</view>
			<view class="type_rit" :class="'order-status-'+ item.status">
				{{ item.goods_type == 7 ? item.statusDesc : item.order_status_name}}
			</view>
		</view>
		<view class="order" @click="goToUse(item)">
			<view class="order_cont">
				<van-image
                    height="160rpx"
                    width="160rpx"
                    radius="16rpx"
                    :src="item.goods_imgs"
                    use-loading-slot
                    use-error-slot
					class="order-img"
					v-if="item.goods_imgs"
                >
                    <van-loading slot="loading" type="spinner" size="24" vertical />
                    <van-icon slot="error" color="#edeef1" size="120" name="photo-fail" />
                </van-image>
				<view class="order-detail">
					<view class="maxTwoLine">{{item.goods_sku_name}}</view>
					<view v-html="formatPrice(item.amount, 1)"></view>
				</view>
			</view>
		</view>
		<!-- 支付金额 -->
		<view class="pay-info" @click="goToUse(item)">
			<text class="pay-info_label">{{[2,3,4,5].includes(Number(item.status))?'实付':'应付'}}</text>
			<view v-html="formatPrice(item.pay_amount)"></view>
		</view>
		<!-- 待支付||去使用 - 京东/深爱购模式不呈现-->
		<view class="order-operate" v-if="item.status==0 && ![5, 8].includes(item.goods_type)" @click="toPay(item)">
			<view class="order-remain-time">
				<block v-if="item.remainTime">
					<view>剩余时间：</view>
					<view class="count-down">
						<!-- <van-count-down @finish="countFinished" :time="time" format="mm:ss"  style="--count-down-text-color:#EF2B20;--count-down-font-size: 24rpx;"/> -->
						<!-- <van-count-down :time="time" format="mm:ss"  style="--count-down-text-color:#EF2B20;--count-down-font-size: 24rpx;"/> -->
						<view>{{item.remainTime|remainTime}}</view>
					</view>
				</block>
			</view>
			<view class="btn">去支付</view>
		</view>
		<!-- goods_type = 1卡券的状态 0直充 -->
		<view class="order-operate" v-if="item.isShowGoToUse" @click="goToUse(item)">
			<view class="expire-time">
				<block v-if="item.card_deadline">
					<text>有效期至</text>
					<text>{{item.card_deadline}}</text>
				</block>
			</view>
			<view class="btn btn_status3">去使用</view>
		</view>
		<!-- 所有状态都打开 -->
		<view class="order-operate" @click="goCouponDetailsHandle(item)">
            <view class="expire-time"></view>
			<view class="btn btn_status3">再来一单</view>
		</view>
	</view>
</block>
</view>
</template>

<script>
	import { pay, query } from '@/api/modules/order.js';
import { parseTime } from '@/utils/index.js';
import Toast from '@/wxcomponents/vant_update/toast/toast.js';
import { goodsTypeObj, orderClass, orderStatus } from '../static/config';
import orderItemHaiwei from './orderItemHaiwei.vue';
import orderItemKfc from './orderItemKfc.vue';
import orderItemMovie from './orderItemMovie.vue';
import orderItemPhone from './orderItemPhone.vue';
import orderItemStarbucks from './orderItemStarbucks.vue';
	// 当前操作的item数据
	export default {
		components: {
			orderItemMovie,
			orderItemKfc,
			orderItemStarbucks,
			orderItemHaiwei,
			orderItemPhone
		},
		props: {
			list: {
				type: Array,
				default () {
					return []
				}
			},
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
			},
			checkOrderStatus(val) {
				return orderStatus[val];
			},

		},
		computed: {
			newList() {
				const list = this.list;
				const showList = list.map(item => {
					const goods_type = item.goods_type;
					const goodsTypeIcon = goodsTypeObj[goods_type] ? goodsTypeObj[goods_type].icon : goodsTypeObj[0].icon;
					let goodsTypeTxt = goodsTypeObj[goods_type] ? goodsTypeObj[goods_type].label : goodsTypeObj[0].label;
					const isShowGoToUse = item.status==3 && item.goods_type==1 && item.card_status != 2;
					return {
						...item,
						goodsTypeTxt,
						goodsTypeIcon,
						isShowGoToUse
					}
				});
				return showList;
			},
		},
		data() {
			return {
				time: 1 * 10 * 1000,
				paymentParams: null, //支付参数
				pay_order_id: null, //支付订单id
			}
		},
		mounted() {
		},

		methods: {
			countFinished(e) {
				timerEnd = true;
				this.$emit("updateOrderInfo");
			},
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
			goToUse(item) {
				const {
					goods_type,
					jdShareLink,
					type_id
				} = item;
                // 京东/拼多多 深爱购的详情
				if([5, 7, 8].includes(goods_type)) {
					this.$openEmbeddedMiniProgram({
						appId: type_id,
						path: jdShareLink
					});
					return;
				}
				const status = item.status;
				let pathUrl = '/pages/userModule/order/detail';
				if(status == 0) {
					pathUrl = '/pages/userModule/order/payDetail';
				} else if(status == 3) {
					pathUrl = '/pages/userModule/order/useDetail';
				}
                this.$go(`${pathUrl}?id=${item.id}&status=${item.status}`);
			},
			goCouponDetailsHandle(item) {
				const {
					goods_type,
					coupon_id,
					cid1,
					skuId,
					cid3,
                    goods_sign
				} = item;
                if(goods_type === 8) return this.goToUse(item);
                let pathUrl = `/pages/shopMallModule/couponDetails/index?id=${coupon_id}`;
				// 京东的进入feed流
				if(goods_type == 5) pathUrl = `/pages/shopMallModule/feedDetailsList/index?cid1=${cid1}&skuId=${skuId}&cid3=${cid3}`;
                if(goods_type == 7) pathUrl = `/pages/shopMallModule/feedDetailsList/index?goods_sign=${goods_sign}`;
				this.$go(pathUrl)
			},
			checkOrderClass(val) {
				return orderClass[val];
			},
			toPay(item) {
				_CURRDATA = item
				this.isDisabled = true;
				let params = { id: item.id };
				if (!this.paymentParams) {
					pay(params).then(res => {
						let {
							code,
							data,
							msg
						} = res;
						if (code == 1) {
							this.paymentParams = JSON.parse(data.jspay_info);
							this.pay_order_id = data.order_id;
							this.createPayment(this.paymentParams)
							return;
						}
						this.isDisabled = false;
						this.$toast(msg);
					});
					return;
				}
				this.createPayment(this.paymentParams)
			},
			//发起支付
			createPayment(obj) {
				uni.requestPayment({
					'nonceStr': obj.nonceStr,
					'package': obj.package,
					'paySign': obj.paySign,
					'signType': obj.signType,
					'timeStamp': obj.timeStamp,
					success: (res) => {
						this.isDisabled = false
						// 支付成功，用order_id 查询结果
						let params = {
							id: this.pay_order_id
						}
						query(params).then(res => {
							let {
								code,
								data,
								msg
							} = res;
							if (code == 1) {
								// 支付成功刷新订单信息
								this.$emit('updateOrderInfo');
								let { pay_amount, status } = data;
								pay_amount = (pay_amount / 100).toFixed(2);
								this.$$redirectTo(`/pages/tabAbout/paySuccess/index?payment=${pay_amount}&status=${status}`);
								return;
							}
							uni.showModal({
								title: '温馨提示',
								content: msg,
								showCancel: false
							});
						});
					},
					fail: (err) => {
						this.isDisabled = false
						if (err.errMsg == 'requestPayment:fail cancel') {
							// this.$emit('cancelPlay', () => {
							// 	this.toPay(_CURRDATA)
							// })
							Toast({
								message: "您已取消支付操作",
								position: 'bottom'
							});
							return;
						}
						Toast({
							message: err.errMsg,
							position: 'bottom'
						});
					}
				});
			},
		}
	}
</script>
<style lang="scss">
.box {
	// box-sizing: border-box;
	// display: flex;
	// flex-direction: column;
	// align-items: center;
	padding: 0 16rpx;
}
.item {
	min-height: 258rpx;
	box-sizing: border-box;
	padding-bottom: 32rpx;
	background: #ffffff;
	border-radius: 16rpx;
	margin-top: 16rpx;
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
		align-items: center;
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
}
.order-status {
	font-size: 26rpx;
	font-weight: 400;
	line-height: 36rpx;
	min-width: 88rpx;
	text-align: right;
}
.order-status-0 {
	color: #F84842;
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
	line-height: 36rpx;
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
.be-paid {
	color: #EF2B20;
}

.be-used {
	color: #EF2B20;
}
.be-done {
	color: #999999;
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
	height: 56rpx;
	line-height: 56rpx;
	box-sizing: border-box;
	text-align: center;
	border: 1rpx solid #f84842;
	border-radius: 32rpx;
	font-size: 28rpx;
	color: #f84842;
	&.btn_status3{
		border-color: #CCCCCC;
		color: #333333;
	}
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
	margin-right: 10rpx;
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
}
</style>
