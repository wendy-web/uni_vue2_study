<template>
<van-popup
  :show="isShow"
  position="bottom"
  custom-style="overflow: inherit;background: transparent;max-height:75%;"
  round
  safe-area-inset-bottom
>
  <view class="order">
    <image class="close_icon" :src="takeImgUrl + '/close_icon.png'" mode="widthFix" @click="popupClose"></image>
    <view class="order_cont">
      <view class="order_title">确认订单</view>
      <!-- 门店信息 -->
      <view class="order_box order_add" @click="changeShopHandle">
        <view class="fl_bet">
          <view class="add_shop txt_ov_ell1">
            {{restaurant_name}}
            <van-icon name="arrow" color="#333" size="28rpx"/>
          </view>
          <view class="remind_box fl_center">
            <image class="remind_icon" :src="takeImgUrl +'/mdl_gift.png'" mode="aspectFill"></image>
            到店取
          </view>
        </view>
        <view class="add_txt">{{restaurant_address}}</view>
      </view>
      <view class="order_box order_detail">
        <view class="list_cont fl_al_start"
          v-for="(item, index) in resProduct" :key="index"
        >
          <view class="com_img fl_center">
            <image class="widHei" :src="item.product_img" mode="widthFix"></image>
          </view>
          <view class="list_txt">
              <view class="item_title">{{item.product_name}}</view>
              <view class="item_lab">{{item.sku_str}}</view>
          </view>
          <view class="price_box">
            <view class="price_num">
              <text style="font-size: 24rpx">¥</text> {{ item.user_price }}
            </view>
            <view>×{{ item.amount }}</view>
          </view>
        </view>
        <!-- 限时优惠 -->
        <view class="discount_box">
            <view class="discount_item fl_bet" v-if="savings.time_amount">
                <view class="fl_center">
                    <image class="dis_icon" :src="takeImgUrl +'/dis_icon1.png'" mode="aspectFill"></image>
                    <view>限时优惠</view>
                </view>
                <view class="dis_price">
                    <text style="font-size: 24rpx">- ¥</text> {{ savings.time_amount }}
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
            <view class="discount_item fl_bet" @click="goredPayIndexHandle">
                <view class="fl_center">
                    <image class="dis_icon" :src="cardImgUrl +'/card_icon3.png'" mode="aspectFill"></image>
                    <view>省钱卡红包</view>
                </view>
                <view class="dis_price box_fl">
                    <image class="dis_icon" :src="cardImgUrl +'/card_icon4.png'" mode="aspectFill"></image>
                    <text style="font-size: 24rpx; line-height: 34rpx;">-¥</text> {{ savings.saving_money }}
                    <van-icon custom-style="font-weight: 600;margin-left: 10rpx" size="26rpx" name="arrow" color="#999"/>
                </view>
            </view>
        </view>
        <!-- 行间距 -->
        <view class="line_dashed"></view>
        <view class="all_price-box fl_end">
            应付
            <view class="all_price"><text style="font-size: 28rpx">¥</text>{{ pay_amount }}</view>
        </view>
      </view>
      <view class="order_box order_info fl_bet info_box">
        <view class="order_lab-box">
          <view class="order_info-lab">取餐方式</view>
          <view class="order_info-lab">联系电话</view>
        </view>
        <view class="order_info-cont">
          <van-radio-group :value="radio" @change="onChangeHandle">
            <van-radio use-icon-slot :name="item.value"
              v-for="(item, index) in eat_type" :key="index">
              <view :class="['box_fl', radio === item.value  ? 'active' : '']">
                <view slot="icon" class="clot_icon">
                  <image class="bg_img radio_active" :src="takeImgUrl + '/md_active.png'" mode="aspectFill"></image>
                </view>
                <view :class="['lab_radio',index == 0 ? 'first_radio' : '']">{{ item.label }}</view>
              </view>
            </van-radio>
          </van-radio-group>
          <view class="input_box">
            <van-field
              :value="phoneValue"
              :border="false"
              placeholder="请输入手机号"
              type="number"
              :maxlength="11"
              custom-style="padding: 0"
              @change="phoneValueChange"
            />
          </view>
        </view>
      </view>
    </view>
    <!-- 去支付 -->
    <view class="toPay_box fl_bet">
      <view class="toPay_left">
        <view class="all_price-box fl_end">
          应付<view class="all_price"><text style="font-size: 28rpx">¥</text>{{ pay_amount }}</view>
          <view class="all_price-vip" v-if="savings.get_saving">含开卡折扣¥{{ disPrice }}</view>
        </view>
        <view class="toPay_dis">已优惠¥{{ coupon_amount }}</view>
      </view>
      <view class="pay_btn" @click="payHandle">去支付</view>
    </view>
  </view>
</van-popup>
</template>
<script>
import {
msgTemplate,
orderCreate,
orderPay,
orderSure,
restaurantChange
} from '@/api/modules/takeawayMenu/luckin.js';
import { getImgUrl } from '@/utils/auth.js';
import { isPhoneReg } from '@/utils/index.js';
import { mapActions, mapGetters } from 'vuex';
export default {
  props: {
    comNum: {
      type: Number,
      default:1
    },
    restaurant_name: {
      type: String,
      default: ''
    },
    restaurant_address: {
      type: String,
      default: ''
    },
    lng: {
      type: Number,
      default: 0
    },
    lat: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      takeImgUrl: getImgUrl() + '/static/subPackages/userModule/takeawayMenu',
      cardImgUrl:`${getImgUrl()}static/card/`,
      checkAllFlag: true,
      radio: 'TAKE_AWAY',
      isShow: false,
      config: null,
      eat_type: [
        {
          label: '自提带走',
          value: 'TAKE_AWAY'
        },
        {
          label: '店内用餐',
          value: 'EAT_IN'
        },
      ],
      phoneValue: '',
      oid: 0, // 订单id
      orderCreateParams: null,
      resProduct: null,
      isAloneProducts: false,
      updateData: null,
      coupon_amount: 0,
      pay_amount: 0,
      car_id: '', // 购物车id
      continuePayObj: null,
      paymentParams: null,
      savings: null
    }
  },
  computed: {
    ...mapGetters(['submitList', 'cartComList', 'brand_id', 'restaurant_id']),
    disPrice() {
      if(!this.savings) return 0;
      const { card_money, card_discount } = this.savings;
      return (Number(card_money) - Number(card_discount)).toFixed(2)
    },
  },
  methods: {
    ...mapActions({
      requestCarList: 'cart/requestCarList',
    }),
    popupShow({ products, isAloneProducts }) {
      this.radio = 'TAKE_AWAY';
      this.paymentParams = null;
      this.car_id = '';
      // submitList筛选购物车的列表
      let params = {
        brand_id: this.brand_id,
        restaurant_id: this.restaurant_id,
        products
      }
      // 单个商品的立即购买
      this.isAloneProducts = isAloneProducts;
      orderSure(params).then((res) => {
        if(res.code == 1) {
          this.isShow = true;
          this.config = res.data;
          const {coupon_amount, pay_amount,phone_number, product, imgArr, text, savings } = this.config;
          this.savings = savings;
          this.coupon_amount = coupon_amount;
          this.pay_amount = pay_amount;
          this.phoneValue = phone_number;
          this.resProduct = product;
          // 挽留支付弹窗使用的对象
          this.continuePayObj = { imgArr, text, coupon_amount };
          return;
        }
        this.$toast(res.msg);
      });
    },
    async updateOrder() {
      const params = {
        brand_id: this.brand_id,
        restaurant_id: this.restaurant_id,
        products: this.resProduct
      }
      const res= await restaurantChange(params);
      if(res.code == 2) return this.$emit('updateOrder'); // 门店变更
      this.updateData = res.data;
      if(res.code == 3) return this.$emit('updateOrderPrice'); // 价格变更
      this.updateOrderShow();
    },
    updateOrderShow(){
      const {
        product,
        coupon_amount,
        pay_amount,
        car_id
      } = this.updateData;
      this.resProduct = product;
      this.coupon_amount = coupon_amount;
      this.pay_amount = pay_amount;
      this.car_id = car_id;
    },
    popupClose() {
      this.isShow = false;
      this.$emit('close');
    },
    onChangeHandle(event){
      this.radio = event.detail;
    },
    phoneValueChange({detail}) {
      this.phoneValue = detail;
    },
    async payHandle() {
      // 验证手机号
      if(this.phoneValue && !isPhoneReg(this.phoneValue)) return this.$toast('请输入正确的手机号码');
      const res = await msgTemplate();
      if(res.code != 1) return;
      const { refund, take } = res.data;
      const tmplIds = [take, refund];
      // 订阅消息模板
      uni.requestSubscribeMessage({
        tmplIds,
        complete:() => this.$emit('toPay')
      });
    },
    changeShopHandle() {
      this.$emit('changeShop');
    },
    async orderCreateRequest() {
      if(this.paymentParams) {
        this.createPayment();
        return;
      }
      let car_id = this.car_id;
      // 非独立的商品，传入购物车的id 直接支付 使用购物车的id
      if(!this.isAloneProducts && !car_id) {
        car_id += this.cartComList.map(res => res.id) + ',';
      }
      const orderCreateParams = {
        products: this.resProduct,
        car_id,
        brand_id: this.brand_id,
        restaurant_id: this.restaurant_id,
        lng: this.lng,
        lat: this.lat,
        eat_type: this.radio,
        phone_number: this.phoneValue,
        restaurant_name: this.restaurant_name,
        restaurant_address: this.restaurant_address,
        savings: this.savings
      }
      this.orderCreateParams = orderCreateParams;
      const res =  await orderCreate(this.orderCreateParams);
      if(res.code != 1) return;
      const { oid } = res.data;
      this.oid = oid;
      const orderRes = await orderPay({oid});
      const { code, data, msg } = orderRes;
      if(code != 1) return this.$toast(msg);
      this.paymentParams = data;
      this.createPayment();
    },
    // 创建支付
    createPayment() {
      const params = this.paymentParams;
      uni.requestPayment({
        'nonceStr': params.nonceStr,
        'package': params.package,
        'paySign': params.paySign,
        'signType': params.signType,
        'timeStamp': params.timeStamp,
        success: (res) => {
          this.$go( `/pages/userModule/takeawayMenu/mcDonald/order/index?oid=${this.oid}`);
          this.isShow = false;
        },
        fail: (res) => {
          this.$emit('cancelPay', {
            ...this.continuePayObj,
            oid: this.oid
          });
          // this.$go( `/pages/userModule/takeawayMenu/mcDonald/order/index?oid=${this.oid}`);
        },
        complete: () => {
          this.requestCarList({
            brand_id: this.brand_id,
            restaurant_id: this.restaurant_id
          })
        }
      });
    },
    goredPayIndexHandle(){
      const { saving_money } = this.savings;
      this.$go(`/pages/userCard/card/cardVip/redPayIndex?saving_money=${saving_money}&ly_type=1`);
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/static/css/mixin.scss';
.order {
  position: relative;
  max-height: 75vh;
  display: flex;
	flex-direction: column;
  .close_icon {
    width: 52rpx;
    height: 52rpx;
    flex: 0 0 52rpx;
    padding: 16rpx;
    margin: 0 24rpx 4rpx auto;
    display: block;
  }
}
.order_cont{
  background: #F5F5F5;
  border-radius: 32rpx 32rpx 0rpx 0rpx;
  position: relative;
  overflow: scroll;
  flex: 1;
  padding-bottom: calc(160rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(160rpx + env(safe-area-inset-bottom));
}
.order_title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  line-height: 44rpx;
  padding: 32rpx 0;
  text-align: center;
  background: #F5F5F5;
  border-radius: 32rpx 32rpx 0rpx 0rpx;
  position: fixed;
  width: 100%;
  z-index: 1;
}
.order_box {
  background: #ffffff;
  border-radius: 16rpx;
  box-sizing: border-box;
  margin: 108rpx 24rpx 0;
}
.order_add {
  padding: 24rpx 14rpx 24rpx 24rpx;
  .add_shop{
    font-size: 28rpx;
    font-weight: 500;
    color: #333333;
    line-height: 40rpx;
  }
  .add_txt{
    font-size: 26rpx;
    color: #999999;
    line-height: 36rpx;
    margin-top: 8rpx;
  }
  .remind_box{
    font-size: 28rpx;
    color: #333;
    line-height: 40rpx;
    white-space: nowrap;
    margin-right: 6rpx;
    .remind_icon{
      width: 24rpx;
      height: 24rpx;
      margin-right: 8rpx;
    }
  }
}
.order_detail{
  margin-top: 24rpx;
  padding: 32rpx 24rpx 24rpx 24rpx;
}

.list_cont {
    flex: 1;
    &:not(:last-child) {
      margin-bottom: 40rpx;
    }
    &:last-child {
      margin-bottom: 30rpx;
    }
	.com_img {
		width: 144rpx;
		height: 144rpx;
		margin-right: 24rpx;
		.sell_out{
			width: 144rpx;
			height: 56rpx;
			background: rgba(0,0,0,0.30);
			position: absolute;
			bottom: 0;
			left: 0;
			font-size: 26rpx;
			font-weight: 500;
			text-align: center;
			color: #ffffff;
			line-height: 56rpx;
		}
	}
	.list_right {
		font-size: 0;
		.sell_out-txt{
			height: 40rpx;
			font-size: 28rpx;
			color: #aaa;
			line-height: 40rpx;
		}
	}
	.list_txt {
		flex: 1;
		align-self:stretch;
		.item_title{
			font-size: 28rpx;
			font-weight: 600;
			color: #333;
			line-height: 40rpx;
		}
    .item_lab{
      font-size: 24rpx;
      color: #aaaaaa;
      line-height: 34rpx;
      margin-top: 8rpx;
    }
	}
}
.price_box{
  text-align: end;
  font-size: 26rpx;
  font-weight: 400;
  color: #aaaaaa;
  line-height: 36rpx;
  margin-left: 10rpx;
  .price_num{
    font-size: 32rpx;
    font-weight: 600;
    color: #333333;
    line-height: 34rpx;
    margin-bottom: 8rpx;
  }
}
.discount_box {
    border-top: 1rpx dashed #e1e1e1;
    padding: 24rpx 0;
}
.discount_item {
  font-size: 28rpx;
  color: #333;
  line-height: 40rpx;
  position: relative;
  padding: 14rpx 0;
  width: 100%;
  box-sizing: border-box;
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
.all_price-box{
  margin-top: 24rpx;
  font-size: 28rpx;
  text-align: right;
  color: #666666;
  line-height: 40rpx;
  .all_price{
    font-size: 36rpx;
    font-weight: 600;
    color: #333333;
    line-height: 40rpx;
    margin-left: 16rpx;
  }
  .all_price-vip {
    margin-left: 16rpx;
    font-size: 24rpx;
    color: #999;
  }
}
.clot_icon{
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid #666;
  border-radius: 50%;
  box-sizing: border-box;
  padding: 2rpx;
  position: relative;
  z-index: 0;
  box-sizing: border-box;
  .radio_active{
    width: 28rpx;
    height: 28rpx;
    opacity: 0;
  }
}
.lab_radio{
  white-space: nowrap;
  color: #aaa;
  margin-left: 10rpx;
}
.first_radio{
  margin-right: 64rpx;
}
.order_info{
  margin-top: 24rpx;
  padding: 32rpx 24rpx;
  .order_lab-box {
    flex: 1;
    flex: 0 0 20%;
    white-space: nowrap;
  }
  .order_info-cont {
    flex: 0 0 60%;
    display: flex;
    flex-direction: column;
    white-space: nowrap;
    color: #333;
    .active {
      border-color: transparent;
      .clot_icon{
        border-color: transparent;
      }
      .radio_active {
        opacity: 1;
      }
      .lab_radio{
        color: #333;
      }
    }
  }
  .order_info-lab {
    white-space: nowrap;
  }
  .order_info-lab:last-child,
  .input_box {
    margin-top: 40rpx;
  }
}
.info_item{
  padding: 32rpx 24rpx;

}
.place-holder{
  font-size: 28rpx;
  text-align: right;
  color: #aaa;
  line-height: 40rpx;
}
.toPay_box{
  height: 120rpx;
  background: #ffffff;
  box-shadow: 0rpx -6rpx 16rpx 0rpx rgba(0,0,0,0.06);
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 9;
  padding-bottom: constant(safe-area-inset-bottom);
  /* 兼容 IOS<11.2 */
  padding-bottom: env(safe-area-inset-bottom);
  .toPay_left{
    padding-left: 32rpx;
  }
  .pay_btn {
    line-height: 80rpx;
    width: 240rpx;
    height: 80rpx;
    background: $mcDonaldColor;
    border-radius: 40rpx;
    font-size: 32rpx;
    font-weight: 600;
    text-align: center;
    color: #333333;
    margin-right: 24rpx;
  }
  .toPay_dis{
    font-size: 26rpx;
    color: #f95731;
    line-height: 36rpx;
  }
  .all_price-box {
    margin: 0;
  }
}
</style>
