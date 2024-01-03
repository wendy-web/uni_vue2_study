<template>
  <view class="order-info">
    <!--待付款订单关闭倒计时 -->
    <view class="countdown" v-if="orderInfo.downTime">
      距离订单关闭仅剩
      <text class="countdown-num">{{ orderInfo.downTime }}</text>
    </view>
    <!-- 待使用 -->
    <view class="count-down" v-if="pastCountTime">
      <view class="cd_title">
        <image class="cd_title-icon" src="../static/order/close_icon.png" mode="aspectFit"></image>
        请在24小时内使用
      </view>
      <view class="cd_txt">
        <view>剩余：</view>
        <van-count-down
          @finish="countFinished"
          :time="pastCountTime"
          millisecond
          format="HH小时mm分"
          style="--count-down-text-color:#333333;--count-down-font-size:26rpx;"
        />
      </view>
    </view>
    <!-- 无卡券信息 -->
    <view class="un-shipped" v-if="isUnShipped">商家正在处理中，请稍后…</view>
    <!-- 商品信息 -->
    <goods-info :config="orderInfo" />
    <!-- 核销码相关 -->
    <xh-info :config="orderInfo" />
    <!-- 卡券信息 -->
    <card-info :config="orderInfo" @stateChange="stateChange" />
    <!-- 退款信息 -->
    <refundInfo :config="orderInfo" />
    <!-- 使用说明 -->
    <purchase-notes :config="orderInfo" />
    <!-- 订单信息 -->
    <order-basic :config="orderInfo" @refresh="init" />
    <!-- 取消订单 -->
    <view
      class="cancel-order"
      @click="cancelOrder"
      v-if="orderInfo.navTitle === '待付款'"
    >
      取消订单
    </view>
    <!-- 底部菜单 -->
    <bottom-tools :config="orderInfo" />
    <!-- 弹窗 -->
    <cancel-confirm ref="cancelConfirm" @cancelSuccess="init" />
    <!-- 使用确认 -->
    <useConfirm ref="useConfirm" @confirm="init" />
    <!-- 支付成功 -->
    <paySuccessDia
			:isShow="isShowPaySucDia"
			@close="closeHandleDia"
			:payment="pay_amount"
		></paySuccessDia>
  </view>
</template>

<script>
import { orderDetail } from "@/api/modules/order.js";
import refundInfo from "./components/refundInfo.vue";
import goodsInfo from "./components/goodsInfo.vue";
import orderBasic from "./components/orderBasic.vue";
import xhInfo from "./components/xhInfo.vue";
import cardInfo from "./components/cardInfo.vue";
import purchaseNotes from "./components/purchaseNotes.vue";
import bottomTools from "./components/bottomTools.vue";
import paySuccessDia from "./components/paySuccessDia.vue";
import cancelConfirm from "./popup/cancelConfirm.vue";
import useConfirm from "./popup/useConfirm.vue";
import { query } from "@/api/modules/order.js";
let _options = null;
let _countdownInter = null;
export default {
  components: {
    refundInfo,
    goodsInfo,
    orderBasic,
    xhInfo,
    cardInfo,
    purchaseNotes,
    bottomTools,
    paySuccessDia,
    useConfirm,
    cancelConfirm,
  },
  onLoad(options) {
    _options = options;
    if(_options.payStatus){
      this.initQuery();
    }
  },
  onShow() {
    this.init();
  },
  data() {
    return {
      orderInfo: { pay_price: "0.00", price: "0.00", _deduction_price: "0.00" },
      isShowPaySucDia: false,
      pay_amount: 0.00, // 支付成功的金额
      pastCountTime: 0
    };
  },
  computed: {
    isUnShipped() {
      let { card, navTitle } = this.orderInfo; // 卡 type 选择器中的值或名称。例如，"un"或"未知
      return (card instanceof Array || !card) && navTitle === "待使用";
    },
  },
  methods: {
    // 支付成功跳转 - 请求订单
    initQuery() {
      query({ id: _options.id }).then((res) => {
        let { status, pay_amount } = res.data;
        this.status = status;
        this.pay_amount = Number(pay_amount / 100).toFixed(2);
			  this.isShowPaySucDia = true;
      });
    },
    closeHandleDia() {
			this.isShowPaySucDia = false;
			this.init();
    },
    init() {
      clearInterval(_countdownInter);
      orderDetail({ id: _options.id }).then((res) => {
        let {
          price,
          deduction_price,
          pay_price,
          card_expire_date,
          create_time,
          refund_price,
          status,
        } = res.data;
        // 导航栏名称
        let navTitle = "";
        // 根据状态处理相关业务
        switch (status) {
          case 0:
            navTitle = "待付款";
            break;
          case 1:
            navTitle = "已支付";
            break;
          case 2:
          case 3:
            navTitle = "已完成";
            break;
          case 4:
          case 5:
            navTitle = "已取消";
            break;
          case 8:
            navTitle = "已过期";
            break;
          case 7:
            navTitle = "待使用";
            break;
          default:
            navTitle = "已退款";
            break;
        }
        // 卡券已过期
        const deadLineTime = new Date(card_expire_date.replace(new RegExp(/-/gm), "/")).getTime();
				const createTime = new Date(create_time.replace(new RegExp(/-/gm), '/')).getTime();
				const curTime = new Date().getTime();
        if (card_expire_date && (deadLineTime - curTime <=0)) {
          navTitle = "已过期";
        }
        // 待使用展示倒计时
        if(status == 7 && deadLineTime > curTime) {
          this.pastCountTime = deadLineTime - curTime;
        }
        console.log('card_expire_date :>> ', card_expire_date);
        console.log('create_time :>> ', create_time);
        //赋值订单信息
        this.orderInfo = {
          ...res.data,
          price: (price / 100).toFixed(2),
          _deduction_price: (deduction_price / 100).toFixed(2),
          pay_price: (pay_price / 100).toFixed(2),
          _refund_price: (refund_price / 100).toFixed(2),
          downTime: null,
          isDown: false,
          navTitle,
        };

        if (navTitle === "待付款") {
          this.interCountDown();
          this.countDown();
        }

        uni.setNavigationBarTitle({
          title: navTitle,
        });
      });
    },
    //待付款倒计时
    interCountDown() {
      clearInterval(this.countdownInter);
      _countdownInter = setInterval(() => {
        this.countDown();
      }, 1000);
    },
    // 倒计时完成
    countFinished() {
      this.pastCountTime = null;
    },
    countDown() {
      let currDate = Date.now();
      let { pay_expire_date } = this.orderInfo;

      if (!pay_expire_date) return;

      let expire = new Date(
        pay_expire_date.replace(new RegExp(/-/gm), "/")
      ).getTime();

      let difference = expire - currDate;
      if (difference > 0) {
        let m = parseInt((difference % (1000 * 60 * 60)) / (1000 * 60));
        let s = parseInt((difference % (1000 * 60)) / 1000);
        m = m > 9 ? m : "0" + m;
        s = s > 9 ? s : "0" + s;
        this.orderInfo.downTime = `${m}:${s}`;
        //标记为可倒计时
        this.orderInfo.isDown = true;
      } else {
        this.orderInfo.downTime = null;
        //该订单开启过倒计时 则刷新订单详情
        if (this.orderInfo.isDown) {
          this.init();
        }
        clearInterval(_countdownInter);
      }
    },
    //取消订单
    cancelOrder() {
      this.$refs.cancelConfirm.show({ id: this.orderInfo.id });
    },
    stateChange() {
      this.$refs.useConfirm.show({ id: this.orderInfo.id });
    },
  },
  onUnload() {
    clearInterval(_countdownInter);
  },
};
</script>

<style lang="scss">
page {
  background-color: #f5f6fa;
}
.countdown {
  padding: 32rpx 24rpx;
  font-size: 32rpx;
  font-weight: 500;
  color: #333333;
  background-color: #ffffff;
}
.countdown-num {
  color: #ef2b20;
  margin-left: 8rpx;
}
.un-shipped {
  height: 72rpx;
  background: #ffeecd;
  line-height: 72rpx;
  padding-left: 32rpx;
  font-size: 28rpx;
  color: #ea7600;
}
.cancel-order {
  padding: 20rpx;
  text-align: center;
  font-size: 28rpx;
  color: #333333;
  margin-top: 14rpx;
  background-color: #ffffff;
}
.cd_title {
	display: flex;
	align-items: center;
	justify-content: center ;
  font-size: 32rpx;
  font-weight: 500;
  color: #ef2b20;
  line-height: 44rpx;
	.cd_title-icon{
		width: 32rpx;
		height: 32rpx;
		margin-right: 10rpx;
	}
}
.count-down {
  background: #ffffff;
  font-size: 32rpx;
  line-height: 44rpx;
  padding: 40rpx 0 24rpx;
	.cd_txt {
		font-size: 26rpx;
		color: #333333;
		line-height: 36rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 20rpx;
		.item{
			font-size: 26rpx;
		}
		.item_mil{
			font-size: 20rpx;
			margin-left: 4rpx;
		}
		.cd_time-con {
			min-width: 100rpx;
		}
	}
}
</style>
