<template>
	<view class="good-info-box">
		<view class="card">
			<view class="good-info">
				<image class="good-img" mode="aspectFit"
					:src="orderInfo.goods_imgs" @click="goCouponDetailsHandle"
				></image>
				<view :class="['right-block', is_pay_way ? 'active' : '']">
					<view class="good-name">
						<view :class="[isShowArrowDown && 'maxOneLine', (!isShowArrowDown && !is_pay_way) && 'maxTwoLine']"
                            @click="goCouponDetailsHandle">
							{{ orderInfo.goods_sku_name }}
						</view>
					</view>
                    <!-- <view class="pay_way" v-if="is_pay_way">1张</view> -->
					<view class="bg-arrow-down" @click="isfold=!isfold" v-if="isShowArrowDown">
						<van-icon :name="!isfold?'arrow-up':'arrow-down'" />
					</view>
				</view>
				<view class="good-price">￥{{orderInfo.goods_market_price}}</view>
			</view>
			<view :class="['fold-box', isfold && 'fold-box-open' ]">
				<!-- 优惠券信息 -->
				<!-- <view class="coupon-info">
					<view class="title">
						<image class="icon-coupon" src="../../static/order/icon_coupon.png" mode="aspectFit"></image>
						<view v-if="orderInfo.coupon_id">使用￥{{orderInfo.coupon_amount}}优惠券</view>
						<view v-else>限时优惠</view>
					</view>
					<view class="tips">-¥{{orderInfo.coupon_amount}}</view>
				</view> -->
                <view class="discount_item fl_bet" v-if="is_pay_way">
                    <view class="fl_center">
                        <image class="dis_icon" src="https://test-file.y1b.cn/store/1-0/2449/6614bbcc5f4d3.png" mode="aspectFill"></image>
                        <view>使用￥{{orderInfo.coupon_amount}}优惠券</view>
                    </view>
                    <view class="dis_price">
                        <text style="font-size: 24rpx">- ¥</text> {{orderInfo.coupon_amount}}
                    </view>
                </view>
                <view class="discount_item fl_bet" v-else-if="xsAmount">
                    <view class="fl_center">
                        <image class="dis_icon" :src="cardImgUrl + '/card_icon6.png'" mode="aspectFill"></image>
                        <view>限时优惠</view>
                    </view>
                    <view class="dis_price">
                        <text style="font-size: 24rpx">- ¥</text> {{ xsAmount }}
                    </view>
                </view>
                <block v-if="orderInfo.vip_type == 2">
					<view class="discount_item fl_bet" @click="openVipHandle">
						<view class="fl_center">
							<image class="dis_icon" src="https://file.y1b.cn/store/1-0/2471/6682110e24584.png" mode="aspectFill"></image>
							<view>开通会员</view>
							<image class="vip_icon" src="https://file.y1b.cn/store/1-0/2471/6682218539eb2.png" mode="aspectFill"></image>
						</view>
						<view class="dis_price" style="color: #333;">
							¥{{ cardPrice }}
							<!-- <van-icon custom-style="font-weight: 600;margin-left: 10rpx" size="26rpx" name="arrow" color="#999"/> -->
						</view>
					</view>
					<view class="discount_item fl_bet" v-if="orderInfo.zero_credits" @click="openVipHandle">
						<view class="fl_center">
							<image class="dis_icon" :src="cardImgUrl +'/card_icon5.png'" mode="aspectFill"></image>
							<view>免豆特权1年</view>
						</view>
						<view class="dis_price" style="color: #333;">
							¥{{not_creditsPrice}}
							<!-- <van-icon custom-style="font-weight: 600;margin-left: 10rpx" size="26rpx" name="arrow" color="#999"/> -->
						</view>
					</view>
				</block>
                <block v-else>
                <block v-if="savings.get_saving">
                    <view class="discount_item fl_bet">
                        <view class="fl_center">
                            <image class="dis_icon" :src="cardImgUrl +'/card_icon1.png'" mode="aspectFill"></image>
                            <view>开通省钱卡</view>
                        </view>
                        <view class="dis_price" style="color: #333;">
                            <text style="font-size: 24rpx">¥</text> {{ savings.card_money }}
                        </view>
                    </view>
                    <view class="discount_item new_item fl_bet">
                        <view class="fl_center">
                            <image class="dis_icon" :src="cardImgUrl +'/card_icon2.png'" mode="aspectFill"></image>
                            <view>新人开卡立减</view>
                        </view>
                        <view class="dis_price">
                            <text style="font-size: 24rpx">-¥</text> {{ savings.card_discount }}
                        </view>
                    </view>
                </block>
                <view class="discount_item fl_bet" v-if="savings.saving_money">
                    <view class="fl_center">
                        <image class="dis_icon" :src="cardImgUrl +'/card_icon3.png'" mode="aspectFill"></image>
                        <view>省钱卡红包</view>
                    </view>
                    <view class="dis_price box_fl">
                        <image class="dis_icon" :src="cardImgUrl +'/card_icon4.png'" mode="aspectFill"></image>
                        <text style="font-size: 24rpx;line-height: 34rpx;">-¥</text> {{ savings.saving_money }}
                    </view>
                </view>
                </block>
                <!-- 行间距 -->
                <view class="line_dashed"></view>
				<!-- 付款信息：应付，实付 -->
				<view class="pay-info">
					<text>{{[2,3,4,5].includes(Number(orderInfo.status)) ? '实付' : '应付' }}:</text>
					<text class="fontW500">￥</text>
					<view v-html="formatPrice(orderPrice)"></view>
				</view>
                <!-- 囤券申请退款 -->
                <view class="apply_box" v-if="isShowUse">
                    <view class="apply_refund" @click="refundHandle">申请退款</view>
                </view>
			</view>
		</view>
	</view>
</template>

<script>
import { getImgUrl } from '@/utils/auth.js';
import { mapGetters } from "vuex";
	export default {
		props: {
			orderInfo: {
				type: Object,
				default () {
					return {}
				}
			},
            isShowUse: {
                type: Boolean,
                default: false
            },
            is_pay_way: {
                type: Boolean,
                default: false
            }
		},
		watch: {
			orderInfo: {
				handler(newVal, oldVal) {
					if (!newVal) return;
                    let { status, goods_type } = newVal;
                    if ([3, 4].includes(Number(status)) && (goods_type == 1) && !this.is_pay_way) {
                        this.isfold = false
                    }
				},
				immediate: true
			}
		},
		computed: {
            ...mapGetters(['cardPrice', 'not_creditsPrice']),
			isShowArrowDown() {
				let { status, goods_type } = this.orderInfo;
				if ([3, 4].includes(Number(status)) && (goods_type == 1) && !this.is_pay_way) {
					return true
				}
				return false
			},
            savings() {
                if(!this.orderInfo) return;
                return this.orderInfo.savings;
            },
            xsAmount() {
                if(!this.orderInfo) return 0;
                const { coupon_amount, savings } = this.orderInfo;
                let amount = coupon_amount;
                if(savings) amount = savings.time_amount;
                return amount;
            },
            orderPrice() {
                if(!this.orderInfo) return 0;
                const { order_price, savings, pay_amount, vip_type, zero_credits} = this.orderInfo;
                let price = Number(order_price);
                if(savings) {
                    price = Number(order_price) - Number(savings.saving_money);
                    if(savings.get_saving && (vip_type == 1)) price = price + 0.9;
                }
                if(this.is_pay_way) price = Number(pay_amount);
                if(vip_type == 2) {
                    price += Number(this.cardPrice);
                    zero_credits && (price += Number(this.not_creditsPrice));
                }
                return price.toFixed(2);
            }
		},
		data() {
			return {
				price: '20.00',
				isfold: true,
                imgUrl: getImgUrl(),
                cardImgUrl:`${getImgUrl()}static/card/`,
			}
		},
		methods: {
			formatPrice(price) {
				const priceNum = Number(price).toFixed(2);
				let splitPrice = priceNum.split(".");
				//2.重新赋值
				return `<span style="font-weight:500;font-size: 20px">${splitPrice[0]}.<span style="font-size: 13px;">${splitPrice[1]}</span></span>`;
			},
			goCouponDetailsHandle() {
				const { coupon_id, status } = this.orderInfo;
				if(!status) return;
                this.$go(`/pages/shopMallModule/couponDetails/index?id=${coupon_id}`);
			},
            refundHandle() {
                this.$emit('refund');
            }
		}
	}
</script>

<style lang="scss">
.discount_item {
    padding: 24rpx 0;
    font-size: 28rpx;
    color: #333;
    line-height: 40rpx;
    position: relative;
    padding: 24rpx 0;
    &:first-child {
        margin-top: 25rpx;
        border-top: 2rpx dashed #e1e1e1;
    }
    &.new_item{
        background: linear-gradient(270deg,rgba(248,72,66,0.00) 0%, rgba(248,72,66,0.06) 75%, rgba(248,72,66,0.00));
    }
    .dis_icon {
        width: 36rpx;
        height: 36rpx;
        margin-right: 8rpx;
    }
    .vip_icon {
		width: 80rpx;
		height: 28rpx;
		margin-left: 8rpx;
	}
    .dis_price{
        font-size: 32rpx;
        font-weight: 600;
        text-align: right;
        color: #f95731;
        line-height: 34rpx;
    }
}

.good-info-box {
    box-sizing: border-box;
}

.card {
    width: 702rpx;
    background: #ffffff;
    border-radius: 24rpx;
    padding: 32rpx 24rpx;
    margin-top: 24rpx;
    box-sizing: border-box;
}

.good-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.good-img {
    width: 112rpx;
    height: 112rpx;
    border-radius: 16rpx;
    flex-shrink: 0;
    margin-right: 24rpx;
}

.right-block {
    width: 100%;
    height: 100rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    &.active {
        height: auto;
        .good-name{
            margin: 0;
        }
    }
}

.good-name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10rpx;
    font-size: 30rpx;
    font-weight: 500;
    color: #333;
    width: 100%;
}

.good-price {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    line-height: 38rpx;
}

.bg-arrow-down {
    width: 55rpx;
    height: 36rpx;
    line-height: 36rpx;
    text-align: center;
    background-color: #f1f1f1;
    border-radius: 25rpx;
}
.pay_way {
    background: #f84842;
    border-radius: 8rpx;
    font-size: 24rpx;
    font-weight: bold;
    color: #ffffff;
    line-height: 34rpx;
    text-align: center;
    width: 58rpx;
}

.coupon-info {
    width: 100%;
    height: 66rpx;
    box-sizing: border-box;
    background: #f7f8fa;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 24rpx;
    padding: 0 24rpx;
    transition: all .5s;
    opacity: 1;

    .title {
        display: flex;
        align-items: center;
        font-size: 24rpx;
        text-align: left;
        color: #333333;
        line-height: 34rpx;

        .icon-coupon {
            width: 26rpx;
            height: 26rpx;
            margin-right: 8rpx;
        }

    }

    .tips {
        font-size: 26rpx;
        font-weight: 400;
        color: #ef2b20;
        line-height: 36rpx;
    }
}

.pay-info {
    padding-top: 24rpx;
    box-sizing: border-box;
    text-align: right;
    font-size: 26rpx;
    font-weight: 500;
    text-align: right;
    color: #333333;
    line-height: 36rpx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    transition: all .5s;
    opacity: 1;
    // border-top: 1rpx dashed #e1e1e1;
    // margin-top: 10rpx;
}

.fontW500 {
    font-weight: 500;
    font-weight: 24rpx;
}

.decimal {
    font-size: 26rpx;
    font-weight: 500;
    color: #333;
    line-height: 32rpx;
}

.fold-box {
    box-sizing: border-box;
    transition: all .5s;
    height: 0;
    overflow: hidden;
}

.fold-box-open {
    height: auto;
    overflow: visible;
}
.maxOneLine {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    font-weight: bold;
    text-overflow: ellipsis;
    // white-space: nowrap;
    display: -webkit-box;
    line-clamp: 1;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
}
.maxTwoLine {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    font-weight: bold;
    text-overflow: ellipsis;
    // white-space: nowrap;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.apply_box{
  margin-top: 32rpx;
  text-align: right;
  .apply_refund {
    line-height: 64rpx;
    border: 2rpx solid #aaa;
    border-radius: 8rpx;
    padding: 0 24rpx;
    display: inline-block;
    font-size: 28rpx;
    color: #333;
  }
}
</style>
