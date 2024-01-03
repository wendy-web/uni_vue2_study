<template>
	<view :class="['box', showPayment ? 'payment_bottom' : '']">
		<xh-navbar :title="navbarTitle" titleColor="#333" :leftImage="imgUrl+'/static/images/left_back.png'"
			@leftCallBack="leftCallBack" navberColor="#F7F7F7"></xh-navbar>
		<view class="pd24" v-if="orderInfo">
			<!-- 待支付 -->
			<view class="count-down" v-if="showPayment&&remainTime">
				<view class="cd_title">
					<image class="cd_title-icon" src="../static/order/close_icon.png" mode="aspectFit"></image>
					等待付款
				</view>
				<view class="cd_txt">
					<view>剩余时间：</view>
					<van-count-down @finish="countFinished" :time="remainTime" millisecond use-slot format="mm:ss"
						@change="onChangeHandle" style="--count-down-text-color:#333333;--count-down-font-size:26rpx;"
						class="cd_time-con">
						<text class="item">{{ timeData.minutes }}:</text>
						<text class="item">{{ timeData.seconds }}.</text>
						<text class="item_mil">{{ timeData.milliseconds }}</text>
					</van-count-down>
				</view>
				<view class="play_btn" @click="playBtnHandle">放心付</view>
			</view>
			<!-- 待使用 -->
			<view class="count-down" v-if="pastCountTime && pastTime">
				<view class="cd_title">
					<image class="cd_title-icon" src="../static/order/close_icon.png" mode="aspectFit"></image>
					请在24小时内使用
				</view>
				<view class="cd_txt">
					<view>剩余：</view>
					<van-count-down @finish="countFinished" :time="pastCountTime" millisecond format="HH小时mm分"
						style="--count-down-text-color:#333333;--count-down-font-size:26rpx;" />
				</view>
			</view>

			<!-- 商品信息 -->
			<goodInfo :orderInfo="orderInfo"></goodInfo>
			<!-- 退款信息 -->
			<view class="refund-info-box" v-if="orderInfo.status == 5">
				<view class="title">退款信息</view>
				<!-- <view class="table-row">
					<view class="subtitle">退还牛金豆：</view>
					<view class="content">{{orderInfo.third_order_id}}</view>
				</view> -->
				<view class="table-row">
					<view class="subtitle">退款金额：</view>
					<view class="content">
						<text>金额原路退回</text>
						<view v-html="formatPrice(orderInfo.order_price)"></view>
					</view>
				</view>
			</view>
			<!-- 二维码条形码 -->
			<couponQr :orderInfo="orderInfo" v-if="orderInfo.goods_type==1 && orderInfo.card_qr_link"></couponQr>
			<!-- 卡券消息 -->
			<couponInfo ref="couponInfo" :orderInfo="orderInfo" v-if="orderInfo.card_number || orderInfo.card_pwd"
				@updateOrderInfo="init"></couponInfo>
			<!-- 商品使用说明 -->
			<goodIntro :orderInfo="orderInfo"></goodIntro>
			<!-- 订单标号：充值修改 -->
			<orderInfo ref="orderInfo" @updateOrderInfo="init"></orderInfo>
			<!-- 红包待领取 -->
			<returnCash :isGoToWithdraw="true"></returnCash>
		</view>
		<!-- 取消订单，去支付 -->
		<payment v-if="showPayment" ref="paymentRef" :orderInfo="orderInfo" @updateOrderInfo="init"
			@cancelPlay="cancelPlay" />
		<!-- toast提示 -->
		<van-toast id="van-toast" />
		<continuePayText :isShow="isContinueShow" :imgArr="orderInfo.imgArr" :payValue="orderInfo.coupon_face_value"
			:remindText="orderInfo.text" :orderId="order_id" @close="closeHandle" @confirm="toPayHandle">
		</continuePayText>
		<!-- 支付成功的弹窗 -->
		<paySuccessDia :isShow="isShowPaySucDia" @close="closeHandleDia" :payment="payment"></paySuccessDia>
	</view>
</template>

<script>
	import goodInfo from './component/goodInfo.vue';
	import couponQr from './component/couponQr.vue';
	import couponInfo from './component/couponInfo.vue';
	import orderInfo from './component/orderInfo.vue';
	import goodIntro from './component/goodIntro.vue';
	import payment from './component/payment.vue';
	import continuePayText from './component/continuePayText.vue';
	import paySuccessDia from './component/paySuccessDia.vue';
	import { getImgUrl } from '@/utils/auth.js';
	import { query } from '@/api/modules/order.js';
	import { orderDetail} from '@/api/modules/order.js';
	import returnCash from './component/returnCash/index.vue';
	import { titleObj } from './static/config';
	let _options = null;
	let _payFunc = null
	export default {
		components: {
			goodInfo,
			couponQr,
			couponInfo,
			orderInfo,
			goodIntro,
			payment,
			continuePayText,
			paySuccessDia,
			returnCash
		},
		data() {
			return {
				imgUrl: getImgUrl(),
				remainTime: 0,
				showPayment: false,
				order_id: '',
				orderInfo: null,
				orderStatus: null,
				source: '', // 埋点类别的区分
				backPath: 1,
				navbarTitle: '',
				isContinueShow: false,
				pastTime: 0,
				pastCountTime: 0,
				isShowPaySucDia: false,
				payment: 0,
				timeData: null,
				alertUsed: 0
			}
		},
		onLoad(options) {
			_options = options
			if (options.id) {
				this.order_id = options.id;
			}
			if (options.source) {
				this.source = Number(options.source);
			}
			if (options.backPath) {
				this.backPath = Number(options.backPath);
			}
			if (options.payment) {
				this.isShowPaySucDia = true;
				this.payment = Number(options.payment);
			}
			if (options.alertUsed) {
				this.alertUsed = Number(options.alertUsed);
			}
		},
		onShow() {
			if (this.order_id) {
				this.init();
			}
		},
		methods: {
			onChangeHandle(event) {
				let {
					hours,
					minutes,
					seconds,
					milliseconds,
					days
				} = event.detail;
				hours = hours < 10 ? '0' + hours : hours
				minutes = minutes < 10 ? '0' + minutes : minutes
				seconds = seconds < 10 ? '0' + seconds : seconds
				milliseconds = Math.floor(milliseconds / 100);
				this.timeData = {
					hours,
					minutes,
					seconds,
					milliseconds,
					days
				}
			},
			async closeHandleDia() {
				this.isShowPaySucDia = false;
				const res = await query({ id: this.order_id });
				if (!res.code) return;
				this.init();
			},
			//倒计时结束
			countFinished(e) {
				this.showPayment = false;
			},
			leftCallBack() {
				if (this.alertUsed) return this.$switchTab('/pages/tabBar/shopMall/index');
				uni.navigateBack({
					delta: this.backPath,
					fail(e) {
						uni.switchTab({
							url: '/pages/tabBar/shopMall/index'
						})
					}
				});
			},
			playBtnHandle() {
				this.$refs.paymentRef.toPay();
			},
			init() {
				let params = { id: this.order_id };
				orderDetail(params).then(res => {
					let {
						code,
						data,
						msg
					} = res;
					if (code == 1) {
						let order_price = 0;
						let coupon_amount = 0;
						let goods_market_price = 0;
						if (!data.coupon_id) {
							goods_market_price = data.marketPrice;
							coupon_amount = data.marketPrice - data.coupon_price;
							order_price = data.coupon_price / 100;
						} else {
							goods_market_price = data.goods_market_price;
							coupon_amount = data.coupon_amount;
							order_price = (data.goods_market_price - data.coupon_amount) / 100;
						}
						data.goods_market_price = goods_market_price / 100;
						data.coupon_amount = coupon_amount / 100;
						data.order_price = order_price;
						this.orderInfo = data;
						let cur_time = new Date().getTime();
						let create_time = new Date(data.create_time?.replace(new RegExp(/-/gm), '/')).getTime();
						let dead_line = new Date(data.card_deadline?.replace(new RegExp(/-/gm), '/')).getTime();
						// 待支付，显示订单倒计时：创建时间+10分钟 - 当前时间>0
						if (data.status == 0) {
							let expire_time = create_time + 600000; // 10分钟后过期
							let remainTime = expire_time - Date.now();
							if (remainTime > 0) {
								this.remainTime = remainTime;
							}
						}
						if (data.status == 3 && dead_line > cur_time) {
							const pastTime = dead_line - create_time;
							this.pastCountTime = dead_line - cur_time;
							this.pastTime = Math.ceil(pastTime / (60 * 60 * 1000));
						}
						this.initOrderStatus(data);
						this.$nextTick(() => {
							this.initProps(data);
							// 处理页面参数
							this.initOptions();
						});
						return;
					}
					this.$toast(msg);
				});
			},
			initOrderStatus(data) {
				this.orderStatus = data.status;
				this.showPayment = this.orderStatus == 0 ? true : false; //支付状态：0未支付，1已支付
				let orderInfo = data;
				let title = titleObj[data.status];
				this.navbarTitle = titleObj[data.status];
				// orderInfo.card_expired = false;
				// let cur_time = new Date().getTime();
				// let card_deadline = orderInfo.card_deadline;
				// // 待使用状态
				// if(card_deadline && data.status == 3) {
				// 	let dead_line = new Date(card_deadline.replace(new RegExp(/-/gm), '/')).getTime();
				// 	if(cur_time>=dead_line){
				// 		title = '已过期';
				// 		orderInfo.card_expired = true;
				// 	}
				// }
				if (orderInfo.card_status == 2) {
					orderInfo.order_status_name = '已过期';
					title = '已过期';
				}
				this.orderInfo = orderInfo;
				uni.setNavigationBarTitle({
					title: title
				})
			},
			initProps(data) {
				this.$refs.orderInfo.init({
					...data
				});
			},
			initOptions() {
				if (_options && _options.isPay) {
					this.$refs.paymentRef.cancelPay();
				}
				_options = null
			},
			formatPrice(price) {
				if (!price) return;
				const priceNum = Number(price).toFixed(2);
				let splitPrice = priceNum.split(".");
				//2.重新赋值
				return `<span style="margin-left:8px;font-weight:500;font-size: 16px">¥${splitPrice[0]}.<span style="font-size: 12px;">${splitPrice[1]}</span></span>`;
			},
			//取消支付
			cancelPlay(func) {
				this.isContinueShow = true;
				_payFunc = func;
			},
			closeHandle() {
				this.isContinueShow = false;
				_payFunc = null
			},
			toPayHandle() {
				this.isContinueShow = false;
				setTimeout(() => {
					_payFunc();
				}, 300);
			}

		}
	}
</script>

<style lang="scss">
	@import url("@/components/u-parse/u-parse.css");
	page {
		background-color: #f7f7f7;
	}
	.payment_bottom {
		padding-bottom: 196rpx;
	}
	.box {
		box-sizing: border-box;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		.pd24 {
			padding: 24rpx;
		}
	}
	.play_btn {
		width: 180rpx;
		height: 72rpx;
		background: linear-gradient(135deg, #f96a02, #f04037);
		border-radius: 12rpx;
		font-size: 28rpx;
		font-family: PingFang SC, PingFang SC-Medium;
		font-weight: 500;
		text-align: center;
		color: #ffffff;
		line-height: 72rpx;
		margin: 24rpx auto 40rpx;
	}

	.count-down {
		font-size: 32rpx;
		font-weight: 500;
		text-align: left;
		color: #333333;
		line-height: 44rpx;

		.cd_txt {
			font-size: 26rpx;
			color: #333333;
			line-height: 36rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 18rpx;

			.item {
				font-size: 26rpx;
			}

			.item_mil {
				font-size: 20rpx;
				margin-left: 4rpx;
			}

			.cd_time-con {
				min-width: 100rpx;
			}
		}
	}

	.cd_title {
		font-size: 40rpx;
		font-weight: 500;
		text-align: center;
		color: #ef2b20;
		line-height: 56rpx;
		display: flex;
		align-items: center;
		justify-content: center;

		.cd_title-icon {
			width: 36rpx;
			height: 36rpx;
			margin-right: 14rpx;
		}
	}


	.refund-info-box {
		box-sizing: border-box;
		padding: 32rpx 24rpx;
		width: 702rpx;
		background: #ffffff;
		border-radius: 24rpx;
		margin-top: 16rpx;

		.title {
			font-size: 30rpx;
			font-weight: 500;
			color: #333333;
		}

		.table-row {
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: relative;
			margin-top: 24rpx;

			.subtitle {
				flex-shrink: 0;
				font-size: 26rpx;
				font-weight: 400;
				color: #999999;
			}

			.content {
				margin-left: 8rpx;
				font-size: 26rpx;
				font-weight: 400;
				color: #333333;
				display: flex;
				align-items: center;
			}

		}
	}
</style>
