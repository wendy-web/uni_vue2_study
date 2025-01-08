<template>
<view class="order" :style="{
  '--padding': isShowPay ? '174rpx' : '0rpx'
}">
<xh-navbar
  :leftImage="imgUrl+'/static/images/left_back.png'"
	@leftCallBack="$leftBack"
  navberColor="#F5F5F5"
	titleColor="#333"
  :title="navbarTitle"
>
</xh-navbar>
    <!-- 待付款 -->
    <view class="order_top box_fl_end" v-if="isShowPay">
      <view class="cd_title"> 距离订单取消仅剩 </view>
      <van-count-down
        @finish="countFinished"
        :time="remainTime"
        millisecond
        use-slot
        format="mm:ss"
        @change="onChangeHandle"
        style="--count-down-text-color:#333333;--count-down-font-size:26rpx;"
        class="cd_time-con"
      >
        <text class="item">{{ timeData.minutes }}:</text>
        <text class="item">{{ timeData.seconds }}</text>
        <text class="item_mil">{{ timeData.milliseconds }}</text>
      </van-count-down>
    </view>
    <!-- 下单成功 -->
    <view class="order_rem" v-if="currentStatus == 2"> 餐品制作中，等待生成取餐码 </view>
    <!-- 等待取餐 || 已完成 -->
    <!-- <view class="order_status" v-if="currentStatus == 3 || currentStatus == 4">
      <view class="order_fin-txt" v-if="currentStatus == 3">
        <van-icon name="passed" color="#0022AB" size="28rpx" style="margin-right: 10rpx"/>
        已制作完成，请前往自提点扫码取餐
      </view>
      <block v-if="codesList.length">
        <view class="order_num fl_center">
          <block v-for="(item, index) in codesList" :key="index">
            {{item}}<text v-if="index < codesList.length - 1">,</text>
          </block>
        </view>
        <view>取餐码</view>
        <view class="order_code">
          <uQrcode :size="140" ref="uQrcodeRef"></uQrcode>
        </view>
      </block>
    </view> -->
    <!-- 订单的状态 -->
    <view class="status_box" v-if="currentStatus == 3 || currentStatus == 4">
      <view class="status_txt semicircle fl_center">
        <image class="status_txt-icon" :src="takeImgUrl + '/md_active.png'" mode="widthFix"></image>
        {{ currentStatus == 3 ? '已生成取餐码，请前往门店取餐' : '订单已完成'}}
      </view>
      <view class="status_code" v-if="codesList.length">
        <block v-for="(item, index) in codesList" :key="index">
          {{ item }}<text v-if="index < codesList.length - 1">,</text>
        </block>
      </view>
      <view class="status_lab">取餐码</view>
    </view>
    <!-- 已退款 -->
    <view class="order_top" v-if="currentStatus == 5">
      <view class="box_fl11" v-if="ticket_id">
        <view class="cd_title">兑换券已退回至您账户</view>
        <view class="cd_label" @click="goToMyCouponHandle"> 可在“我的-卡券”中查看和使用 <van-icon name="arrow" color="#666" size="26rpx"/> </view>
      </view>
      <block v-else>
        <view class="box_fl">
          <view class="cd_title"> 退款金额 </view>
          <view class="all_price">
            <text style="font-size: 26rpx">¥</text> {{config.pay_amount}}
          </view>
        </view>
        <view class="refund_time box_fl" v-if="config.refund_time">
          <text style="margin-right: 4rpx">退款时间：</text>{{config.refund_time}}
        </view>
      </block>

    </view>
    <view class="order_box order_add">
        <view class="add_shop fl_bet" @click="openGpsHandle">
          {{config.restaurant_name}}
          <view> 导航 <van-icon name="arrow" color="#333" size="28rpx"/> </view>
        </view>
        <view class="add_txt">{{ config.restaurant_address }}</view>
        <view class="again_btn" v-if="showAgainBtn" @click="againHandle">再来一单</view>
    </view>
    <view class="order_box order_detail" v-if="detailsList">
        <view class="list_cont" v-for="(item, index) in detailsList" :key="index"
        >
          <view class="fl_al_start">
            <view class="com_img fl_center">
              <image class="widHei" :src="item.product_img" mode="widthFix"></image>
            </view>
            <view class="list_txt">
                <view class="item_title">{{item.product_name}}</view>
                <view class="item_lab">{{item.sku_str}}</view>
            </view>
            <view class="price_box">
              <view class="price_num">
                <text style="font-size: 24rpx">¥</text> {{item.user_price}}
              </view>
              <view>×{{ item.amount }}</view>
            </view>
          </view>
        </view>
        <!-- 兑换券减免 -->
        <view class="discount_box" v-if="ticket_id">
          <view class="discount_item fl_bet" v-if="xsAmount">
                <view class="fl_center">
                  <image class="dis_icon" src="https://test-file.y1b.cn/store/1-0/2449/6614bbcc5f4d3.png" mode="aspectFill"></image>
                    <view>兑换券减免</view>
                </view>
                <view class="dis_price">
                    <text style="font-size: 24rpx">- ¥</text> {{ config.coupon_amount }}
                </view>
            </view>
        </view>
        <!-- 限时优惠 -->
        <view class="discount_box" v-else>
            <view class="discount_item fl_bet" v-if="xsAmount">
                <view class="fl_center">
                    <image class="dis_icon" :src="takeImgUrl +'/dis_icon1.png'" mode="aspectFill"></image>
                    <view>限时优惠</view>
                </view>
                <view class="dis_price">
                    <text style="font-size: 24rpx">- ¥</text>{{xsAmount}}
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
        </view>
        <!-- 行间距 -->
        <view class="line_dashed"></view>
        <view class="all_price-box fl_end">
            共{{ config.total_amount }}件商品
            {{ ([2,3,4,5].includes(Number(currentStatus)) || ticket_id)  ? '实付' : '应付' }}
          <view class="all_price">
            <text style="font-size: 28rpx">¥</text>{{ config.pay_amount }}
          </view>
        </view>
    </view>
    <!-- 订单编号 -->
    <view class="order_box order_info">
        <view class="info_item fl_bet">
            <view class="item_lab">订单编号</view>
            <view class="item_cont fl_center">
              {{ config.third_order_id }}
			        <view class="item_cont-operate" @click="copyHandle(config.third_order_id)">复制</view>
          </view>
        </view>
        <view class="info_item fl_bet">
            <view class="item_lab">下单时间</view>
            <view class="item_cont">
              {{ config.create_time }}
            </view>
        </view>
        <view class="info_item fl_bet">
            <view class="item_lab">取餐方式</view>
            <view class="item_cont">
              {{ config.channel_flag }}
            </view>
        </view>
        <!-- 客服入口 -->
      <view class="service_box" @click="goServerHandle">
        <image class="service_icon" :src="takeImgUrl + '/service_icon.png'" mode="aspectFit"></image>
        联系客服
      </view>
    </view>
    <!-- 红包待领取 -->
    <returnCash :isGoToWithdraw="true"></returnCash>
    <view class="toPay_btn" v-if="isShowPay" @click="orderPayHandle">
      <view class="btn fl_center">
        <image class="pay_icon" :src="takeImgUrl + '/pay_icon.png'" mode="aspectFit"></image>
        放心付
      </view>
    </view>
    <privacyOpen ref="privacyOpen"></privacyOpen>
</view>
</template>
<script>
import { orderDetail } from '@/api/modules/order.js';
import {
  orderPay
} from '@/api/modules/takeawayMenu/luckin.js';
import uQrcode from '@/components/uQrcode/index.vue';
import { getImgUrl } from '@/utils/auth.js';
import { mapGetters } from 'vuex';
import returnCash from '../../component/returnCash/index.vue';
import { statusTitle } from '../../static/config';
export default {
    components: {
      uQrcode,
      returnCash
    },
    computed: {
      ...mapGetters(['brand_id', 'userInfo']),
      navbarTitle() {
        return statusTitle[this.currentStatus].title;
      },
      isShowPay() {
        return [0].includes(Number(this.currentStatus)) && (this.remainTime > 0);
      },
      showAgainBtn() {
        return [4, 5].includes(Number(this.currentStatus));
      },
      detailsList() {
        return (this.config && this.config.details) || [];
      },
      xsAmount() {
        if(!this.config) return 0;
        let amount = this.config.coupon_amount;
        if(this.savings) {
            amount = this.savings.time_amount
        }
        return amount;
      }
    },
    data() {
        return {
		      imgUrl: getImgUrl(),
          takeImgUrl: getImgUrl() + '/static/subPackages/userModule/takeawayMenu',
          cardImgUrl:`${getImgUrl()}static/card/`,
          currentStatus: 0,
          remainTime: 0,
          timeData: null,
          oid: 0,
          config: null,
          codesList: [],
          restaurant_id: 0,
          savings: null,
          ticket_id: 0
        };
    },
    onLoad(option) {
      if(option.oid) {
        this.oid = option.oid;
      }
    },
    onShow() {
      if (this.oid) this.init();
    },
    methods: {
      async init() {
        const res = await orderDetail({ id: this.oid });
        if(res.code !=  1) return;
        this.config = res.data;
        this.savings = res.data.savings;
        this.currentStatus = this.config.status;
        // this.currentStatus = 5;
        const code = this.config.qr_codes[0];
        this.$nextTick(() => {
          this.$refs.uQrcodeRef && this.$refs.uQrcodeRef.createCode(code);
        });
        this.codesList = this.config.codes;
        this.ticket_id = this.config.ticket_id;
        const expire_time = this.config.expire_time;
        // 过期时间的倒计时
        this.remainTime = new Date(expire_time.replace(new RegExp(/-/gm), '/')).getTime() - Date.now();
      },
      goToMyCouponHandle() {
				this.$go('/pages/userModule/myCoupon/index');
      },
      async againHandle() {
			  this.$goToDiscountsMini();
      },
      countFinished() {
        // 倒计时结束 - 展示已取消
        this.currentStatus = 1;
      },
      async orderPayHandle() {
        const orderRes = await orderPay({ oid: this.config.id });
        const { code, data, msg } = orderRes;
        if(code != 1) return this.$toast(msg);
        this.paymentParams = data;
        this.createPayment(this.paymentParams);
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
            this.currentStatus = 2;
          },
          fail: (res) => {
          }
        });
      },
      copyHandle(str){
            uni.setClipboardData({
                data:str,
                success: () => this.$toast('复制成功')
            })
      },
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
        milliseconds = Math.floor(milliseconds/100);
        this.timeData = {
            hours,
            minutes,
            seconds,
            milliseconds,
            days
        }
    },
    async openGpsHandle() {
    const {
            longitude,
            latitude,
            restaurant_name,
            restaurant_address
        } = this.config;
        uni.openLocation({
            latitude: Number(latitude),
            longitude: Number(longitude),
            name: restaurant_name,
            address: restaurant_address
        });
    },
    goServerHandle() {
      this.$go('/pages/tabAbout/service/service');
    }
},
};
</script>
<style lang="scss">
@import '@/static/css/mixin.scss';
page {
    background: #F5F5F5;
}
.order {
  // 132 是底部的按钮内容的高度
  // 42 是底部的边距的距离
  // --padding：是底部按钮定位的留白
  padding-bottom: calc(var(--padding) + constant(safe-area-inset-bottom));
  /* 兼容 IOS<11.2 */
  padding-bottom: calc(var(--padding) + env(safe-area-inset-bottom));
  /* 兼容 IOS>11.2 */
  padding-left: 24rpx;
  padding-right: 24rpx;
}
.toPay_btn {
  width: 100%;
  background: #ffffff;
  box-shadow: 0rpx -6rpx 16rpx 0rpx rgba(0,0,0,0.06);
  position: fixed;
  left: 0;
  bottom: 0;
  padding-bottom:constant(safe-area-inset-bottom);
  /* 兼容 IOS<11.2 */
  padding-bottom: env(safe-area-inset-bottom);
  .btn{
    margin: 24rpx;
    height: 88rpx;
    background: $mcDonaldColor;
    border-radius: 44rpx;
    font-size: 28rpx;
    font-weight: 600;
    text-align: center;
    color: #333;
    line-height: 88rpx;
    .pay_icon {
      width: 30rpx;
      height: 32rpx;
      margin-right: 8rpx;
    }
  }
}
.order_rem{
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
  line-height: 50rpx;
  margin-top: 50rpx;
  .timer{
      color: $mcDonaldColor;
  }
}
.order_top{
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
  margin-top: 50rpx;
  .cd_title {
    margin-right: 12rpx;
  }
  .cd_label {
    font-size: 26rpx;
    color: #666;
    margin-top: 16rpx;
    line-height: 36rpx;
  }
  .cd_time-con{
    .item{
      font-size: 36rpx;
      font-weight: 600;
      color: #f95731;
    }
    .item_mil{
      font-size: 26rpx;
      color: #f95731;
      font-weight: 600;
      margin-left: 4rpx;
    }
  }
  .all_price{
    color: #F95731;
  }
  .refund_time{
    font-size: 26rpx;
    color: #999999;
    line-height: 36rpx;
    margin-top: 14rpx;
  }
}
.order_status {
  font-size: 28rpx;
  color: #666666;
  text-align: center;
  .order_fin-txt{
      margin-top: 58rpx;
      line-height: 40rpx;
  }
  .order_num{
      font-size: 56rpx;
      color: #333333;
      line-height: 80rpx;
      margin-top: 24rpx;
  }
  .order_code{
    width: 280rpx;
    height: 280rpx;
    margin: 32rpx auto;
    position: relative;
    z-index: 1;
  }
}
.order_box {
  background: #ffffff;
  border-radius: 16rpx;
  box-sizing: border-box;
}

.order_add {
  padding: 24rpx 14rpx 24rpx 24rpx;
  margin-top: 32rpx;
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
  .again_btn {
    width: 654rpx;
    height: 88rpx;
    background: $mcDonaldColor;
    border-radius: 8rpx;
    text-align: center;
    font-size: 28rpx;
    color: #333;
    line-height: 88rpx;
    margin-top: 24rpx;
    font-weight: 600;
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
		width: 210rpx;
		height: 160rpx;
		margin-right: 24rpx;
		position: relative;
		z-index: 0;
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
  .price_num{
    font-size: 32rpx;
    font-weight: 600;
    color: #333333;
    line-height: 34rpx;
    margin-bottom: 8rpx;
  }
}
.semicircle {
  position: relative;
  &::before {
    content: '\3000';
    width: 30rpx;
    height: 30rpx;
    background: #F5F5F5;
    position: absolute;
    bottom: -15rpx;
    left: -39rpx;
    border-radius: 50%;
  }
  &::after {
    content: '\3000';
    width: 30rpx;
    height: 30rpx;
    background: #F5F5F5;
    position: absolute;
    bottom: -15rpx;
    right: -39rpx;
    border-radius: 50%;
  }
}
.discount_box{
    border-top: 1rpx dashed #e1e1e1;
}
.discount_item {
  font-size: 28rpx;
  color: #333;
  line-height: 40rpx;
  position: relative;
  padding: 14rpx 0;
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
}
.order_info {
    padding: 32rpx 24rpx 0;
    margin-top: 24rpx;
    font-size: 28rpx;
    line-height: 40rpx;
    .info_item {
        &:not(:first-child) {
            margin-top: 24rpx;
        }
    }
    .item_lab{
        color: #999999;
    }
    .item_cont{
        color: #000000;
    }
}
.service_box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 36rpx;
  font-size: 26rpx;
  text-align: center;
  color: #333333;
  line-height: 36rpx;
  padding: 20rpx 0;
  margin-top: 32rpx;
  border-top: 2rpx solid  #e8e8e8;
  .service_icon{
    width: 32rpx;
    height: 30rpx;
    margin-right: 14rpx;
  }
}
.item_cont-operate{
  width: 72rpx;
  height: 44rpx;
  border: 2rpx solid #e1e1e1;
  border-radius: 8rpx;
  font-size: 24rpx;
  color: #666666;
  line-height: 44rpx;
  margin-left: 16rpx;
  text-align: center;
}
.refund_box{
  width: 100%;
  height: 70rpx;
  position: relative;
  z-index: 0;
  margin-top: 8rpx;
  .refund_txt{
    height: 36rpx;
    font-size: 26rpx;
    color: #666666;
    line-height: 36rpx;
    padding: 0 0 12rpx 20rpx;
    .refund_price{
      color: #F95731;
      margin-left: 12rpx;
    }
  }
}
.status_box {
  margin: auto;
  width: 606rpx;
  text-align: center;
  background: #fff;
  border-radius: 32rpx;
  box-shadow: 0rpx 6rpx 16rpx 0rpx rgba(0,0,0,0.02);
  padding-bottom: 32rpx;
  position: relative;
  margin-top: 32rpx;
  &::before {
    content: '\3000';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 638rpx;
    height: 16rpx;
    background: linear-gradient(180deg,#d3d3d3, rgba(255, 255, 255, 0.00));
    border-radius: 8rpx;
  }
  .status_txt {
    font-size: 36rpx;
    font-weight: 600;
    text-align: left;
    color: #333333;
    line-height: 50rpx;
    padding: 40rpx 30rpx;
    border-bottom: 1rpx dashed #e1e1e1;
    white-space: nowrap;
    &.semicircle::before {
      left: -15rpx;
    }
    &.semicircle::after {
      right: -15rpx;
    }
    .status_txt-icon {
      width: 34rpx;
      height: 34rpx;
      margin-right: 8rpx;
    }
  }
  .status_code{
    font-size: 36rpx;
    font-weight: 600;
    text-align: center;
    color: #333333;
    line-height: 56rpx;
    margin-top: 12rpx;
    display: flex;
    justify-content: center;
    padding: 10rpx;
    flex-wrap: wrap;
  }
  .status_lab {
    font-size: 28rpx;
    color: #999999;
    line-height: 40rpx;
  }
}
</style>
