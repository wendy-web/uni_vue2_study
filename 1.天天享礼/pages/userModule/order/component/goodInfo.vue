<template>
	<!-- 商品信息 -->
	<view class="good-info-box">
		<view class="card">
			<view class="good-info">
				<image
					class="good-img"
					mode="aspectFit"
					:src="orderInfo.goods_imgs"
					@click="goCouponDetailsHandle"
				></image>
				<view class="right-block">
					<view class="good-name">
						<view class="maxTwoLine" @click="goCouponDetailsHandle">
							{{orderInfo.goods_sku_name}}
						</view>
						<view class="good-price">￥{{orderInfo.goods_market_price}}</view>
					</view>
					<view class="bg-arrow-down" @click="isfold=!isfold" v-if="isShowArrowDown">
						<van-icon :name="!isfold?'arrow-up':'arrow-down'" />
					</view>
				</view>
			</view>
			<view class="fold-box" :class="{'fold-box-open':isfold}">
				<!-- 优惠券信息 -->
				<!-- <view class="coupon-info">
					<view class="title">
						<image class="icon-coupon" src="../../static/order/icon_coupon.png" mode="aspectFit"></image>
						<view v-if="orderInfo.coupon_id">使用￥{{orderInfo.coupon_amount}}优惠券</view>
						<view v-else>限时优惠</view>
					</view>
					<view class="tips">-¥{{orderInfo.coupon_amount}}</view>
				</view> -->
                <view class="discount_item fl_bet" v-if="xsAmount">
                    <view class="fl_center">
                        <image class="dis_icon" :src="cardImgUrl + '/card_icon6.png'" mode="aspectFill"></image>
                        <view>限时优惠</view>
                    </view>
                    <view class="dis_price">
                        <text style="font-size: 24rpx">- ¥</text> {{ xsAmount }}
                    </view>
                </view>
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
				<!-- 付款信息：应付，实付 -->
				<view class="pay-info">
					<text>{{[2,3,4,5].includes(Number(orderInfo.status))?'实付':'应付'}}:</text>
					<text class="fontW500">￥</text>
					<view v-html="formatPrice(orderPrice)"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getImgUrl } from '@/utils/auth.js';
	export default {
		props: {
			orderInfo: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		watch: {
			orderInfo: {
				handler(newVal, oldVal) {
					if (newVal) {
						let {
							status,
							goods_type
						} = newVal;
						if ([3, 4].includes(Number(status)) && goods_type == 1) {
							this.isfold = false
						}
					}
				},
				immediate: true
			}
		},
		computed: {
			isShowArrowDown() {
				let {
					status,
					goods_type
				} = this.orderInfo
				if ([3, 4].includes(Number(status)) && goods_type == 1) {
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
                if(savings) {
                    amount = savings.time_amount
                }
                return amount;
            },
            orderPrice() {
                if(!this.orderInfo) return 0;
                const { order_price, savings } = this.orderInfo;
                let price = Number(order_price);
                if(savings) {
                    price = Number(order_price) - Number(savings.saving_money);
                    if(savings.get_saving) price = price + 0.9;
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
			}
		}
	}
</script>

<style lang="scss">
.discount_item {
    padding: 24rpx 0;
    font-size: 28rpx;
    color: #333333;
    line-height: 40rpx;
    position: relative;
    padding: 14rpx 0;
    &.new_item{
        background: linear-gradient(270deg,rgba(248,72,66,0.00) 0%, rgba(248,72,66,0.06) 75%, rgba(248,72,66,0.00));
    }
    .dis_icon {
        width: 36rpx;
        height: 36rpx;
        margin-right: 8rpx;
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
    align-items: flex-start;
}

.good-img {
    width: 112rpx;
    height: 112rpx;
    background: #d8d8d8;
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
}

.good-name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10rpx;
    font-size: 30rpx;
    font-weight: 500;
    color: #333333;
    line-height: 42rpx;
    width: 100%;
}

.good-price {
    font-size: 32rpx;
    font-weight: 500;
    color: #333333;
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
    border-top: 1rpx dashed #e1e1e1;
    margin-top: 10rpx;
}

.fontW500 {
    font-weight: 500;
}

.decimal {
    font-size: 26rpx;
    font-weight: 500;
    color: #333333;
    line-height: 32rpx;
}

.fold-box {
    box-sizing: border-box;
    transition: all .5s;
    height: 0;
    overflow: hidden;
    margin-top: 10rpx;
}

.fold-box-open {
    height: auto;
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
}
</style>
