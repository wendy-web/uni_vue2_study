<template>
<view class="repair_detail">
  <view
			class="icon_box"
			:style="{ height: navBarHeight + 'px', top: topHeight + 'px'}"
			@click="navBackHandle"
		>
			<image class="icon_box-icon" :src="imgUrl+'/static/images/icon_close.png'" mode="aspectFill"></image>
		</view>
    <view class="content_box">
			<view class="sph-box">
				<van-image
					:width="screenWidth+'px'"
					:height="screenWidth+'px'"
					:src="config.imgArr[0]"
					use-loading-slot
				>
					<van-loading slot="loading" type="spinner" size="20" vertical />
				</van-image>
			</view>
    </view>
    <view class="cont_price fl_bet">
			<image class="bg_img" src="https://file.y1b.cn/store/1-0/23817/64dde66e90236.png" mode="aspectFill"></image>
      <view class="cont_price-left">
        <view class="fl_center">
          捡漏价
          <view class="cont_price-txt">
            <text style="font-size: 28rpx;">¥</text>
            {{ config.coupon_price }}
          </view>
        </view>
        <view class="price_lab">日常价 ¥{{ config.salePrice }}</view>
      </view>
      <view class="cont_price-right">
        <image class="price_title" src="https://file.y1b.cn/store/1-0/23118/654b2f19e4638.png" mode="aspectFill"></image>
        <view class="cd_txt">
          <van-count-down
            @finish="countFinished"
            :time="remainTime"
            millisecond
            use-slot
            format="mm:ss"
            @change="onChangeHandle"
            style="--count-down-text-color:#fff;--count-down-font-size:26rpx;"
            class="cd_time-con"
          >
            <text class="item">{{ timeData.hours }}</text>
            :
            <text class="item">{{ timeData.minutes }}</text>
            :
            <text class="item">{{ timeData.seconds }}</text>
          </van-count-down>
        </view>
      </view>
    </view>
    <view class="cont_info">
      <view class="cont_info-title">
        {{ config.goods_name }}
      </view>
      <view class="input-box" v-if="!config.type">
        <view class="recharge-account">
          <text>充值账号</text>
          <text class="icon-star">*</text>
        </view>
        <input
          class="input-account"
          v-model="charge_account"
          type="number"
          placeholder-class="place-holder"
          placeholder="请输入充值账号"
        />
      </view>
    </view>

    <!-- 富文本详情 -->
    <view class="u-parse-box" v-if="config.instruction">
      <view class="u-parse_title">
        <image class="remind_icon" :src="subImgUrl + '/remind_icon.png'" mode="aspectFill"></image>
        需要注意
        <image class="remind_qa" :src="subImgUrl + '/qa.png'" mode="aspectFill"></image>
      </view>
      <view class="u-parse_cont">
        <u-parse :content="config.instruction" @preview="preview" @navigate="navigate"></u-parse>
      </view>
    </view>
    <view class="pay_btn-box" @click="payHandle">
      <view class="pay_btn fl_center">
        立即支付
        <view class="price" v-html="formatPrice(config.coupon_price,3)"></view>
      </view>
    </view>
    <!-- 确认手机号 -->
<continuePhoneRegDia
	:isShow="isShowNumDia"
	:accountNum="charge_account"
	@close ="isShowNumDia = false"
	@confirm="confirmNumHandle"
></continuePhoneRegDia>
<!-- 手慢 - 商品被抢 -->
<noProductDia
	:isShow="isShowNoProduct"
	@close="navBackHandle"
	:remindText="showNoProductText"
></noProductDia>
</view>
</template>

<script>
import { leakOrder, leshuaDetails } from '@/api/modules/allowance.js';
import { query } from '@/api/modules/order.js';
import { getNavbarData } from "@/components/xhNavbar/xhNavbar.js";
import { getImgUrl } from '@/utils/auth.js';
import { parseTime } from '@/utils/index.js';
import continuePhoneRegDia from './continuePhoneRegDia.vue';
import noProductDia from './noProductDia.vue';
let _request = false;
export default {
  components: {
    continuePhoneRegDia,
    noProductDia
  },
  data() {
    return {
      imgUrl: getImgUrl(),
			subImgUrl: `${getImgUrl()}static/subPackages/shopMallModule`,
			screenWidth: null, //屏幕宽度
      navBarHeight: 0,
      topHeight: 0,
      remainTime: 6000,
      start_time: 0,
      over_time: 0,
      charge_account: '',
      timeData: null,
      isShowNumDia: false,
			isShowNoProduct: false ,// 展示手慢 - 没商品的弹窗
			showNoProductText: '',
      config: {
        imgArr: []
      },
      order_id: 0,
      paymentParams: null,
    }
  },
  watch: {
    start_time() {
      const currentDate = new Date();
      let cur_date = parseTime(currentDate, "{y}-{m}-{d}");
      const timestamp = currentDate.getTime(); // 当前时间戳
      let popover_start = cur_date + ' ' + this.start_time;
      let popover_over = cur_date + ' ' + this.over_time;
      const popover_startStamp = new Date(popover_start).getTime(); // 开始时间戳
      const popover_overStamp = new Date(popover_over).getTime(); // 结束时间戳
      this.remainTime = popover_overStamp - timestamp;
      if(timestamp >= popover_startStamp && timestamp <=popover_overStamp) {
        this.isGoDetail = true;
      }

    }
  },
  // 页面周期函数--监听页面加载
  async onLoad(option) {
		let system = uni.getSystemInfoSync();
		this.screenWidth = system.screenWidth || 375;
    const goods_id = option.goods_id;
    leshuaDetails({goods_id}).then((res) => {
      if(res.code != 1) return this.$toast(res.msg);
      this.config = res.data;
      const {leak} = res.data;
      if(!this.start_time || !this.over_time) {
        this.start_time = leak.start_time;
        this.over_time = leak.over_time;
      }
    });
    const res = await getNavbarData();
    let { navBarHeight, statusBarHeight } = res;
    this.navBarHeight = navBarHeight;
    this.topHeight = statusBarHeight;
  },
  methods: {
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
      if (type == 4) {
        return `¥<span style="font-weight:500;font-size: 26px">${splitPrice[0]}.<span style="font-size: 15px;">${splitPrice[1]}</span></span>`;
      }
    },
    // 倒计时结束
    countFinished(e) { },
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
      milliseconds = Math.floor(milliseconds/10);
      this.timeData = {
        hours,
        minutes,
        seconds,
        milliseconds,
        days
      }
    },
    navBackHandle() {
      this.isShowNoProduct = false
      // 手慢无 - 返回首页
      this.$leftBack();
    },
    payHandle() {
      if(this.config.type) {
        const params = { goods_id: this.config.id };
        this.leakOrderRequest(params);
        return;
      }
      // 直充
      const inputValue = this.charge_account.trim();
      if(!inputValue) return this.$toast('充值账号不能为空');
      this.isShowNumDia = true;
    },
    // 确认账号
    confirmNumHandle() {
      const params = {
        goods_id: this.config.id,
        charge_account: this.charge_account.trim()
      };
      this.isShowNumDia = false;
      this.leakOrderRequest(params);
    },
    async leakOrderRequest(params) {
			if (_request) return _request = true;
      const res = await leakOrder(params);
      _request = false;
      let { code, data, msg } = res;
      if (code == 1) {
        this.paymentParams = JSON.parse(data.jspay_info);
        this.order_id = data.order_id;
        this.createPayment(this.paymentParams)
        return;
      }
      // 价格有变化
      if (code == 2) {
        this.$toast(msg);
        this.couponInfo.coupon_price = data;
        return;
      }
      // 手太慢，商品被抢光咯
      if (code == 3) {
        this.showNoProductText = msg;
        this.isShowNoProduct = true;
        return;
      }
      this.$toast(msg);
    },
    // 发起支付
    createPayment(obj) {
      uni.requestPayment({
        'nonceStr': obj.nonceStr,
        'package': obj.package,
        'paySign': obj.paySign,
        'signType': obj.signType,
        'timeStamp': obj.timeStamp,
        success: (res) => {
          _request = false;
          let params = { id: this.order_id }
          query(params).then(res => {
            let {code, data,msg} = res;
            if (code == 1) {
              let { pay_amount, status } = data;
              pay_amount = (pay_amount / 100).toFixed(2);
              // 卡券类跳转详情
              if(this.config.type) {
                this.reLaunch(`/pages/userModule/order/detail?id=${this.order_id}&payment=${pay_amount}`);
                return;
              }
              this.$redirectTo(`/pages/tabAbout/paySuccess/index?payment=${pay_amount}&status=${status}`);
              return
            }
            uni.showModal({
              title: '温馨提示',
              content: msg,
              showCancel: false
            });
          });
        },
        fail: (err) => {
          _request = false;
          if (err.errMsg == 'requestPayment:fail cancel') {
            this.$redirectTo(`/pages/userModule/order/detail?id=${this.order_id}`);
          }
        }
      });
    },
  }
}
</script>

<style lang="scss">
page {
  background: #F7F7F7;
}
.repair_detail{
  padding-bottom: calc(120rpx + constant(safe-area-inset-bottom)); /* 兼容 IOS<11.2 */
	padding-bottom: calc(120rpx + env(safe-area-inset-bottom)); /* 兼容 IOS>11.2 */
}
.icon_box {
  position: fixed;
  left: 25rpx;
  display: flex;
  align-items: center;
  z-index: 9;
  .icon_box-icon {
    width: 56rpx;
    height: 56rpx;
  }
}
.content_box {
  height: 100%;
  overflow: scroll;
  background: #F7F7F7;
}
.sph-box {
  width: 100%;
  font-size: 0;
  .sph-item {
    width: 100%;
  }
}
.cont_price{
  position: relative;
  z-index: 0;
  color: #fff;
  padding: 12rpx 0 40rpx;
  .cont_price-left{
    margin-left: 24rpx;
    font-size: 26rpx;
    font-weight: 600;
    line-height: 36rpx;
    .cont_price-txt{
      font-size: 48rpx;
      line-height: 40rpx;
      line-height: 66rpx;
      margin-left: 12rpx;
    }
    .price_lab{
      font-size: 26rpx;
      line-height: 36rpx;
      font-weight: 400;
    }
  }
  .cont_price-right{
    margin-right: 40rpx;
  }
  .price_title{
    width: 156rpx;
    height: 36rpx;
  }
}
.cd_txt{
  font-weight: 600;
  margin-top: 15rpx;
  .item{
    width: 40rpx;
    height: 40rpx;
    background: rgba(255,255,255,0.30);
    border-radius: 4rpx;
    text-align: center;
    line-height: 40rpx;
    margin: 0 8rpx;
    display: inline-block;
  }
}
.cont_info{
  width: 718rpx;
  background: #ffffff;
  margin: -20rpx auto 0;
  border-radius: 24rpx 56rpx 24rpx 24rpx;
  position: relative;
  padding: 32rpx 24rpx 0;
  box-sizing: border-box;
  overflow: hidden;
  .cont_info-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333333;
    line-height: 44rpx;
    margin-bottom: 30rpx;
  }
  .input-box{
    border-top: 1rpx dashed #e1e1e1;
    position: relative;
    .recharge-account{
      position: absolute;
      top: 31rpx;
      left: 40rpx;
      font-size: 28rpx;
      font-weight: 500;
      color: #333333;
      line-height: 40rpx;
      background: #fff;
      padding: 0 10rpx;
      .icon-star {
        color: #FE423D;
      }

    }
    .input-account{
      border: 2rpx solid #666666;
      padding: 26rpx 24rpx 22rpx;
      border-radius: 15rpx;
      margin-top: 53rpx;
      margin-bottom: 30rpx;
    }
  }
}
.u-parse-box {
  margin: 24rpx 24rpx 16rpx;
  border-radius: 12px;
  word-break: break-word;
  .u-parse_title {
    position: relative;
    z-index: 0;
    width: 100%;
    background: #fff1e1;
    border-radius: 24rpx 24rpx 0rpx 0rpx;
    display: flex;
    align-items: center;
    font-size: 32rpx;
    color: #c9813d;
    line-height: 44rpx;
    padding: 10rpx 0 20rpx;
    box-sizing: border-box;
    .remind_icon {
      width: 28rpx;
      height: 26rpx;
      margin: 10rpx 10rpx 10rpx 24rpx;
    }
    .remind_qa {
      position: absolute;
      width: 194rpx;
      height: 58rpx;
      right: 0;
      bottom: 5rpx;
    }
  }
  .u-parse_cont {
    background-color: #ffffff;
    padding: 0rpx 24rpx;
    border-radius: 12px;
    position: relative;
    top: -10rpx;
    overflow: hidden;
  }
}
.pay_btn-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  padding-bottom:  constant(safe-area-inset-bottom); /* 兼容 IOS<11.2 */
	padding-bottom: env(safe-area-inset-bottom); /* 兼容 IOS>11.2 */
  .pay_btn{
    width: 686rpx;
    height: 76rpx;
    line-height: 76rpx;
    background: #f84842;
    border-radius: 38rpx;
    margin: 18rpx auto;
    font-size: 28rpx;
    font-weight: 600;
    text-align: center;
    color: #ffffff;
    .price {
			margin-left: 10rpx;
		}
  }
}
</style>
