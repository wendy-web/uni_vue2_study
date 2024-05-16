<template>
	<!-- 服务充值 -->
	<view class="container" v-if="couponInfo">
		<xh-navbar
			title="使用优惠券"
			titleColor="#333"
			:leftImage="imgUrl+'/static/images/left_back.png'"
			@leftCallBack="leftCallBack"
			navberColor="#F7F7F7"
		></xh-navbar>
			<view class="ser_box ser_box_top">
				<image class="shop_bg" :src="subImgUrl +'/shop_bg.png'" mode="aspectFit"></image>
				<image class="shop_img" :src="couponInfo.image" mode="aspectFit"></image>
				<view class="shop_title">
					<view class="shop_title-text">{{couponInfo.goods_name}}</view>
					<view class="shop_title-label">已使用最大优惠</view>
				</view>
				<view class="shop_price">
					<view v-html="formatPrice(couponInfo.goods_market_price, 2)"></view>
					<image class="shop_gf" :src="subImgUrl +'/gf_icon.png'" mode="aspectFit"></image>
				</view>
			</view>
			<view class="ser_box">
			<block v-if="couponInfo.goods_type==0">
				<view class="recharge-account">
					<text>充值账号</text>
					<text class="icon-star">*</text>
				</view>
				<view class="input-box">
					<input
						class="input-account"
						v-model="account"
						type="number"
						:maxlength='cz_type == 1 ? 11 : -1'
						placeholder-class="place-holder"
						:placeholder="placeholderString"
					/>
				</view>
			</block>
			<view class="discount-box">
				<image class="discount_bg" src="https://file.y1b.cn/store/1-0/23713/64afe7181b6c9.png" mode="aspectFit"></image>
				<view class="content">
					<image class="content_icon" :src="subImgUrl +'/zs_icon.png'" mode="aspectFit"></image>
					<text class="content_lab">专属优惠</text>
					优惠券减{{couponInfo.coupon_face_value}}元
				</view>
				<view class="discount-price">
					<text>-¥{{couponInfo.coupon_face_value}}</text>
				</view>
			</view>
			<view class="buy-price">
				<text>已优惠¥</text>
				<text class="icon-star">{{couponInfo.coupon_face_value}}</text>元
				<text class="price_txt">应付</text>
				<view v-html="formatPrice(price, 3)"></view>
			</view>
		</view>
		<view class="ser_box" v-if="goodsIntro">
			<!-- 使用说明 -->
			<view class="intro-title">使用说明</view>
			<view class="intro-content">
				<u-parse :content="goodsIntro"></u-parse>
			</view>
		</view>
		<view class="ser_box" v-if="exchangeRule">
			<!-- 兑换须知 -->
			<view class="intro-title">兑换须知</view>
			<view class="intro-content">
				<u-parse :content="exchangeRule"></u-parse>
			</view>
		</view>
		<view class="buy_btn-box">
			<view class="discount_rem">
				<image class="discount_rem-icon" :src="subImgUrl +'/zs_plan.png'" mode="aspectFit"></image>
				<image class="discount_rem_bg" :src="subImgUrl + '/discount_rem_bg.png'" mode="aspectFit"></image>
				<text>共优惠¥{{couponInfo.coupon_face_value}}</text>
			</view>
			<view class="buy_btn"  @click="check">
				立即支付<view class="price" v-html="formatPrice(price,3)"></view>
			</view>
		</view>
		<!-- 立即购买 -->
		<!-- toast提示 -->
		<van-toast id="van-toast" />
		<!-- 返回的弹窗 -->
		<continueDia
			:isShow="isShowBackDia"
			cancelText="离开"
			confirmText="再考虑下"
			:faceValue="couponInfo.coupon_face_value"
			:creditsValue="couponInfo.credits"
			@close ="confirmBackHandle"
			@confirm="closeDiaHandle"
		></continueDia>
		<!-- 确认手机号 -->
		<continueDia
			:isShow="isShowNumDia"
			:accountNum ="account"
			@close ="closeDiaHandle"
			@confirm="confirmNumHandle"
		></continueDia>
	</view>
</template>

<script>
	import { query } from '@/api/modules/order.js';
import { applyCoupon, buy } from '@/api/modules/user.js';
import { getImgUrl } from '@/utils/auth.js';
import {
checkRichText,
escape2Html
} from '@/utils/index.js';
import Toast from '@/wxcomponents/vant_update/toast/toast.js';
import continueDia from './continueDia.vue';
	let _request = false;
	export default {
		components: {
			continueDia,
		},
		data() {
			return {
				imgUrl: getImgUrl(),
				price: '',
				account: '',
				id: '', //优惠券id
				couponInfo: null,
				paymentParams: null, //支付参数
				order_id: '',
				source: '', // 埋点类别的区分
				cz_type: 0, // 充值类型
				placeholderString: '请输入充值账号', //输入框的内容
				isShowBackDia: false,
				isShowNumDia: false,
				isDirectBack: false, // 是否直接返回
				subImgUrl: `${getImgUrl()}static/subPackages/shopMallModule`,
			}
		},
		computed: {
			goodsIntro() {
				if (!this.couponInfo) return
				let {
					goods_instruction
				} = this.couponInfo;

				if (goods_instruction) {
					let html = escape2Html(goods_instruction || '')
					let result = checkRichText(html)
					if (result) {
						return html
					} else {
						return ''
					}
				}
				return ''
			},
			exchangeRule() {
				if (!this.couponInfo) return
				let {
					goods_details
				} = this.couponInfo
				if (goods_details) {
					// return escape2Html(goods_details||'')
					let html = escape2Html(goods_details || '')
					let result = checkRichText(html)
					if (result) {
						return html
					} else {
						return ''
					}
				}
				return ''
			}
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id;
				this.init();
			}
			if(options.source) {
				this.source = Number(options.source);
			}
			if(options.isDirectBack) {
				this.isDirectBack = Boolean(options.isDirectBack);
			}
		},
		onUnload() {
			_request = false;
		},
		methods: {
			init() {
				let params = {
					id: this.id
				}
				applyCoupon(params).then(res => {
					let {
						code,
						msg,
						data
					} = res;
					if (code == 1) {
						this.couponInfo = data;
						this.cz_type = data.cz_type; // 充值类型
						if(data.cz_type && data.cz_type_intro) {
							this.placeholderString = data.cz_type_intro;
						}
						let price = Number(data.goods_market_price) - Number(data.coupon_face_value);
						this.price = price.toFixed(2);
						return;
					}
					uni.showToast({
						icon: 'none',
						title: msg
					})
				})
			},
			// 验证手机号码的正则
			isPhoneReg(num){
				var num_reg = /^1\d{10}$/;
				if(!num_reg.test(num)){
					return false;
				}
				return true;
			},
			// 充值类型 1-手机号码充值 2-其它账号充值
			// 【立即购买】时，校验相关信息：
			check() {
				this.$wxReportEvent('buynow', {source: this.source});
				// 直充类型的判断的验证
				if (this.couponInfo.goods_type == 0) {
					if(!this.account) {
						return uni.showToast({
							icon: 'none',
							title: this.placeholderString
						});
					}
					// 手机号码的类型判断
					if(this.cz_type == 1 && !this.isPhoneReg(this.account)) {
						return uni.showToast({
							icon: 'none',
							title: '请输入正确的手机号码'
						});
					}
					this.isShowBackDia = false;
					this.isShowNumDia = true;
					return;
				}
				this.checkBuy();
			},
			confirmNumHandle() {
				this.checkBuy();
			},
			checkBuy() {
				if (_request) return _request = true;
				let params = {
					id: this.couponInfo.goods_id, //商品id
					coupon_id: this.couponInfo.coupon_id, //优惠券id
					charge_account: this.account, //充值账号
					goods_market_price: this.couponInfo.goods_market_price * 100 //商品价格
				}
				if (!this.paymentParams) {
					buy(params).then(res => {
						let {
							code,
							data,
							msg
						} = res;
						_request = false;
						if (code == 1) {
							this.paymentParams = JSON.parse(data.jspay_info);
							this.order_id = data.order_id;
							this.createPayment(this.paymentParams)
							return
						}
						// 价格有变化
						if (code == 2) {
							uni.showToast({
								icon: 'none',
								title: msg,
								duration: 3000
							})
							this.couponInfo.goods_market_price = data
							return
						}
						uni.showToast({
							icon: 'none',
							title: msg,
							duration: 3000
						})
					})
				} else {
					this.createPayment(this.paymentParams)
				}
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
						_request = false;
						// 支付成功，用order_id 查询结果
						let params = {
							id: this.order_id
						}
						query(params).then(res => {
							let {
								code,
								data,
								msg
							} = res;
							if (code == 1) {
								let {
									pay_amount,
									status
								} = data;
								pay_amount = (pay_amount / 100).toFixed(2);
								uni.redirectTo({
									url: `/pages/tabAbout/paySuccess/index?payment=${pay_amount}&status=${status}`
								})
								return
							}
							uni.showModal({
								title: '温馨提示',
								content: msg,
								showCancel: false
							})
						})


					},
					fail: (err) => {
						_request = false;
						if (err.errMsg == 'requestPayment:fail cancel') {
							this.$wxReportEvent('refusetobuy', {source: this.source});
							// return Toast({
							// 	message: "您已取消支付操作",
							// 	position: 'bottom',
							// 	onClose: () => {
							// 		uni.redirectTo({
							// 			url: `/pages/userModule/order/detail?id=${this.order_id}&isPay=1`
							// 		})
							// 	},
							// })
							uni.navigateTo({
								url: `/pages/userModule/order/detail?id=${this.order_id}&isPay=1&source=${this.source}`
							});
							return

						}
						Toast({
							message: err.errMsg,
							position: 'bottom'
						})

					}
				});
			},
			formatPrice(price, type) {
				// 先转类型为数字，再保留2位小数
				price = Number(price).toFixed(2);
				if (!price) return;
				let splitPrice = price.split(".");
				if (type == 1) {
					return `¥<span style="font-weight:500;font-size: 16px">${splitPrice[0]}.<span style="font-size: 13px;">${splitPrice[1]}</span></span>`;
				}
				if (type == 2) {
					return `¥<span style="font-weight:500;font-size: 20px">${splitPrice[0]}.<span style="font-size: 14px;">${splitPrice[1]}</span></span>`;
				}
				if (type == 3) {
					return `¥<span style="font-weight:500;font-size: 24px">${splitPrice[0]}.<span style="font-size: 15px;">${splitPrice[1]}</span></span>`;
				}
			},
			// 返回上一页
			leftCallBack() {
				this.isShowNumDia = false;
				if(this.isDirectBack) {
					return this.confirmBackHandle();
				};
				this.isShowBackDia = true;
				this.diaType = 'back';
			},
			// 关闭弹窗
			closeDiaHandle() {
				this.isShowBackDia = false;
				this.isShowNumDia = false;
			},
			confirmBackHandle() {
				uni.navigateBack({
					fail(e) {
						uni.switchTab({
							url:'/pages/tabBar/shopMall/index'
						});
					}
				});
			},

		}
	}
</script>

<style lang="scss">
@import url("@/components/u-parse/u-parse.css");
page {
	background-color: #f7f7f7;
	height: 100%;
}
.ser_box {
	margin: 0 24rpx 20rpx;
	border-radius: 24rpx;
	background: #fff;
	padding: 32rpx 24rpx 40rpx;
	position: relative;
	z-index: 0;
	&.ser_box_top {
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
.shop_bg {
	position: absolute;
	top: 0;
	left: 0;
	z-index: -1;
	width: 100%;
	height: 100%;

}
.shop_img {
	width: 128rpx;
	height: 128rpx;
	border-radius: 12rpx;
	margin-right: 20rpx;
	background: gray;
}
.shop_title {
	flex: 1;
	align-self: stretch;
	// background: gray;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-start;
	.shop_title-text {
		font-size: 28rpx;
		font-family: PingFang SC, PingFang SC-Medium;
		font-weight: 500;
		text-align: left;
		color: #333333;
		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2; /* 这里是超出几行省略 */
		overflow: hidden;
	}
	.shop_title-label {
		display: inline-block;
		height: 28rpx;
		border: 1rpx solid #f84842;
		border-radius: 4rpx;
		font-weight: 400;
		color: #f84842;
		line-height: 28rpx;
		padding: 0 8rpx;
		font-size: 20rpx;
	}
}
.shop_title {
	flex: 1;
	align-self: stretch;
	// background: gray;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-start;
	.shop_title-text {
		font-size: 28rpx;
		font-family: PingFang SC, PingFang SC-Medium;
		font-weight: 500;
		text-align: left;
		color: #333333;
		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2; /* 这里是超出几行省略 */
		overflow: hidden;
	}
	.shop_title-label {
		display: inline-block;
		height: 28rpx;
		border: 1rpx solid #f84842;
		border-radius: 4rpx;
		font-weight: 400;
		color: #f84842;
		line-height: 28rpx;
		padding: 0 8rpx;
		font-size: 20rpx;
	}
}
.shop_price {
	align-self: start;
	margin-left: 10rpx;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	.shop_gf {
		width: 82rpx;
		height: 32rpx;
		margin-top: 6rpx;
	}
}
.direct-recharge-box {
	box-sizing: border-box;
	background: #ffffff;
	border-radius: 24rpx;
	padding: 9rpx 0 32rpx;
	margin-top: 16rpx;
	margin-bottom: 16rpx;
}
.recharge-account {
	font-size: 26rpx;
	font-weight: 600;
	color: #333333;
	line-height: 36rpx;
}
.icon-star {
	color: #EF2B20;
}
.input-box {
	display: flex;
	align-items: flex-end;
	box-sizing: border-box;
	padding: 26rpx 0 12rpx;
	position: relative;
	&::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		width: auto;
		border-bottom: 1rpx solid #F1F1F1;
	}
	.place-holder {
		color: #aaaaaa;
		font-size: 32rpx;
		// font-weight: 600;
		line-height: 44rpx;
	}
	.input-account {
		font-size: 30rpx;
		font-weight: 500;
		color: #333333;
		line-height: 42px;
		width: 100%;
	}
}
.discount-box {
	padding: 0 24rpx;
	height: 100rpx;
	box-sizing: border-box;
	line-height: 36rpx;
	font-size: 26rpx;
	color: #F84842;
	display: flex;
	align-items: center;
	justify-content: space-between;
	position: relative;
	z-index: 0;
	margin-top: 32rpx;
	.discount_bg {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: -1;
	}
	.content {
		font-size: 26rpx;
		font-weight: 500;
		display: flex;
		align-items: center;
		.content_icon {
			width: 48rpx;
			height: 48rpx;
		}
		.content_lab {
			margin: 0 16rpx;
		}
	}

	.discount-price {
		font-size: 28rpx;
		font-weight: 500;
	}
}
.pay-info {
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 30rpx;
	font-weight: 500;
	padding: 19rpx 24rpx 0;
	color: #333333;

	.pay-price {
		font-size: 26rpx;
		font-weight: 500;
		color: #ef2b20;
		display: flex;
		align-items: flex-end;
	}
}
.buy-price {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	margin-top: 32rpx;
	line-height: 36rpx;
	font-size: 24rpx;
	.price_txt {
		margin-left: 20rpx;
		font-size: 26rpx;
	}
}
.intro-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #333333;
	line-height: 42rpx;
}

.intro-content {
	margin-top: 16rpx;
	word-break: break-word;
}
.discount_rem {
	line-height: 68rpx;
	height: 68rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 26rpx;
	color: #f97f02;
	position: relative;
	z-index: 0;
	.discount_rem_bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
	}
	.discount_rem-icon {
		width: 24rpx;
		height: 24rpx;
		margin-right: 8rpx;
	}
}
.buy_btn-box {
	background: #fff;
	position: sticky;
	bottom: 0;
	box-sizing: border-box;
	background: #ffffff;
	z-index: 10;
	font-size: 32rpx;
	font-weight: 400;
	color: #333333;
	padding-bottom: constant(safe-area-inset-bottom); /* 兼容 IOS<11.2 */
	padding-bottom: env(safe-area-inset-bottom); /* 兼容 IOS>11.2 */
	.buy_btn {
		margin: 22rpx 32rpx 0;
		height: 76rpx;
		line-height: 76rpx;
		background: #f04037;
		border-radius: 38rpx;
		font-size: 28rpx;
		font-weight: 600;
		text-align: left;
		color: #ffffff;
		display: flex;
		justify-content: center;
		align-items: center;
		.price {
			margin-left: 10rpx;
		}
	}
}
	.container {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		height: 100%;

		// justify-content: space-between;
		.box {
			padding: 42rpx 24rpx;
			// min-height: calc(100vh - 196rpx);
			box-sizing: border-box;
			flex: 1;

			.good-info {
				width: 702rpx;
				height: 106rpx;
				box-sizing: border-box;
				background: #ffffff;
				border-radius: 24rpx 24rpx 56rpx 24rpx;
				padding: 32rpx 24rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				position: relative;

				font-size: 30rpx;
				font-weight: 500;
				color: #333333;
				line-height: 42rpx;

				.price-box {
					font-size: 32rpx;
					font-weight: 500;
					color: #333333;
					line-height: 38rpx;
					display: flex;
					align-items: center;
				}

				.icon-tag-price {
					position: absolute;
					top: -24rpx;
					right: -24rpx;
					width: 104rpx;
					height: 56rpx;
				}
			}

			.direct-recharge-box {
				width: 702rpx;
				// height: 336rpx;
				box-sizing: border-box;
				background: #ffffff;
				border-radius: 24rpx;
				padding: 9rpx 0 32rpx;
				margin-top: 16rpx;
				margin-bottom: 16rpx;

				.recharge-account {
					font-size: 26rpx;
					font-weight: 500;
					color: #333333;
					line-height: 36rpx;
					padding: 23rpx 24rpx 0;

					.icon-star {
						color: #EF2B20;
					}
				}

				.input-box {
					display: flex;
					align-items: flex-end;
					box-sizing: border-box;
					padding: 16rpx 24rpx 26rpx;
					position: relative;

					&::before {
						content: '';
						position: absolute;
						bottom: 16rpx;
						left: 24rpx;
						right: 24rpx;
						width: auto;
						border-bottom: 2rpx solid #F1F1F1;
					}

					&::after {
						content: '';
						position: absolute;
						bottom: 0;
						left: 0;
						right: 0;
						width: auto;
						border-bottom: 1rpx solid #F1F1F1;
					}

					.place-holder {
						color: #aaaaaa;
						font-size: 30rpx;
					}

					.input-account {
						font-size: 30rpx;
						font-weight: 500;
						color: #333333;
						line-height: 42px;
						width: 100%;
					}
				}

				.discount-box {
					padding: 0 24rpx;
					height: 84rpx;
					box-sizing: border-box;
					line-height: 36rpx;
					font-size: 26rpx;
					color: #333333;
					display: flex;
					align-items: center;
					justify-content: space-between;
					position: relative;

					&::after {
						content: '';
						position: absolute;
						bottom: 0;
						left: 24rpx;
						right: 24rpx;
						width: auto;
						border-bottom: 1rpx solid #F1F1F1;
					}

					.content {
						font-size: 26rpx;
						font-weight: 400;
						color: #999999;
						line-height: 36rpx;
						margin-left: 32rpx;
					}

					.discount-price {
						font-size: 26rpx;
						font-weight: 500;
						color: #ef2b20;
						line-height: 36rpx;
					}
				}

				.pay-info {
					display: flex;
					align-items: center;
					justify-content: space-between;
					font-size: 30rpx;
					font-weight: 500;
					padding: 19rpx 24rpx 0;
					color: #333333;

					.pay-price {
						font-size: 26rpx;
						font-weight: 500;
						color: #ef2b20;
						display: flex;
						align-items: flex-end;
					}
				}
			}

			.intro-box {
				box-sizing: border-box;
				padding: 32rpx 24rpx;
				margin-top: 16rpx;
				width: 702rpx;
				background: #ffffff;
				border-radius: 24rpx;
				font-size: 26rpx;
				font-weight: 400;
				color: #666666;

				.intro-title {
					font-size: 30rpx;
					font-weight: 500;
					color: #333333;
					line-height: 42rpx;
				}

				.intro-content {
					margin-top: 16rpx;
					word-break: break-word;
				}
			}


		}

		.buy-box {
			position: sticky;
			bottom: 0;
			padding: 32rpx 32rpx 0;
			box-sizing: border-box;
			height: 196rpx;
			background: #ffffff;
			z-index: 10;
			font-size: 32rpx;
			font-weight: 400;
			color: #333333;

			.buy-box-content {
				display: flex;
				align-items: flex-start;
				justify-content: space-between;
			}

			.buy-price {
				display: flex;
				align-items: center;
			}

			.btn-buy {
				width: 192rpx;
				height: 88rpx;
				line-height: 88rpx;
				text-align: center;
				background: linear-gradient(135deg, #f96a02, #f04037);
				border-radius: 16rpx;
				box-shadow: 0px 4rpx 16rpx 2rpx rgba(238, 81, 73, 0.45);
				font-size: 28rpx;
				font-weight: 500;
				color: #ffffff;
			}

			.safe-area {
				height: 32rpx;
				padding-bottom: env(safe-area-inset-bottom);
				box-sizing: border-box;
			}
		}

		.maxTwoLine {
			text-overflow: -o-ellipsis-lastline;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			line-clamp: 2;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}

	}
</style>
