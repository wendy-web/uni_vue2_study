<template>
<mescroll-body
  id="mescrollBody"
  :sticky="true"
  ref="mescrollRef"
  @init="mescrollInit"
  @down="downCallback"
  :down="downOption"
  :up="upOption"
  @up="upCallback"
>
  <xhNavbar
    :navbarColor="navbarColor"
    :title="title"
    :titleColor="titleColor"
    :leftImage="leftImage"
    @leftCallBack="$back"
    titleAlign="titleLeft"
  ></xhNavbar>
  <!-- 可提现 -->
  <view class="available-withdrawal-box">
    <view class="aw-left">
      <view class="aw-title">可提现(元)</view>
      <view class="aw-amount" v-html="formatPrice(vipObject.balance || 0)"></view>
    </view>
    <view class="btn-withdrawal" @click="goPage('/pages/cardModule/withdrawal/index')">提现</view>
  </view>
    <!-- 累计收益 -->
    <view class="total-earn">
      <view class="te-item">
        <view class="width-140">
          <view class="te-title">今日预估(元)</view>
          <view class="te-num">{{vipObject.day_profit || 0}}</view>
        </view>
      </view>
      <view class="te-item te-pseudo-line">
        <view class="width-140">
          <view class="te-title">累计收益(元)</view>
          <view class="te-num">{{vipObject.total_profit || 0}}</view>
        </view>
      </view>
      <view class="te-item" @click="goPage('/pages/cardModule/withdrawal/history')" >
        <view class="width-140">
          <view class="te-title">已提现(元)</view>
          <view class="te-num">
            <text class="">{{vipObject.tx_amount || 0}}</text>
            <van-icon name="arrow" color="#999999" size="14" />
          </view>
        </view>
      </view>
    </view>

    <!-- 收益走势 -->
    <view class="income-title">
      <view class="it-pseudo-line">收益走势</view>
      <view class="week-month-tab">
        <view
          class="wm-item"
          :class="{'wm-active': wmIndex == index}"
          v-for="(item, index) in weekMonthTab" :key="index"
          @click="profitChartRequest(index)"
        >{{ item.name }}
        </view>
      </view>
    </view>
    <!-- 折线图 -->
    <view class="echart-box">
      <uni-ec-canvas
        class="uni-ec-canvas"
        id="line-chart"
        canvas-id="multi-charts-line"
        :ec="ec"
      ></uni-ec-canvas>
    </view>

    <!-- 收益明细 -->
    <view class="stick-box" id="sticky-view" :style="'top:' + topHeight + 'px;'" >
      <view class="income-title" style="margin-top: 0;">
        <view class="it-pseudo-line">收益明细</view>
      </view>
      <!-- 本月收益 -->
      <view class="current-income-box" @click="showDatePicker = true">
        <view class="ci-left">
          <text class="">本月收益：</text>
          <text class="ci-money">¥{{total_profit}}</text>
        </view>
        <view class="ci-right">
          <image
            class="icon-date"
            src="/static/images/mine/icon_date.png"
            mode="aspectFit"
            lazy-load
          ></image>
          <text class="ci-date">{{ selectDate }}</text>
          <image
            class="icon-delta"
            src="/static/images/mine/icon_delta.png"
            mode="aspectFit"
            lazy-load
          ></image>
        </view>
      </view>
    </view>
    <!-- 收益列表 -->
    <view class="income-list-box">
      <view class="income-list-item" v-for="(item, index) in list" :key="index">
        <view class="order_top fl_bet">
          <view class="order_left">
            <view class="order_copy" @click="copyHandle(item.third_order_id)">订单号：{{item.third_order_id}}</view>
            <view style="margin-top: 12rpx;">下单时间：{{item.create_time}}</view>
          </view>
          <view v-if="!item.order_status">订单退款</view>
        </view>
        <view class="order_cont" v-if="item.order_info">
          <van-image
            :src="productImg(item)"
            use-loading-slot
            width="172rpx" height="172rpx"
            radius="8px"
            use-error-slot
            :show-menu-by-longpress="true"
            fit="aspectFit"
            class="order_cont-img"
          >
            <van-loading slot="loading" type="spinner" size="20" vertical />
            <van-icon slot="error" color="#edeef1" size="20" name="photo-fail" />
          </van-image>
          <view class="ili-info fl_col_sp_bt">
            <view class="ili-info-name txt_ov_ell1">{{ item.order_info.goods_sku_name }}</view>
            <view class="price_box">
              <view class="price_item">
                <view class="price_num" style="color: #333;">{{ item.order_info.pay_amount }}</view>
                订单金额
              </view>
              <view class="line"></view>
              <view class="price_item">
                <view :class="['price_num', !item.order_status ? 'active' : '']">{{item.income}}</view>
                预估收益
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  <!-- 日期弹窗 -->
  <datetimePopup
    :isShow="showDatePicker"
    @close="showDatePicker = false"
    @confirm="confirmDate"
  ></datetimePopup>
</mescroll-body>
</template>
<script>
import { profitChart, profitDetail } from "@/api/modules/card.js";
import { getNavbarData } from "@/components/xhNavbar/xhNavbar";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { formatAmount } from "@/utils/index";
import { mapActions, mapGetters } from "vuex";
import datetimePopup from "../components/datetimePopup.vue";
import uniEcCanvas from "../components/uni-ec-canvas/uni-ec-canvas";
import chartOption from "./chartOption.js";
import { haiWeiObj } from './config';

export default {
  name: "cardEarnings",
  mixins: [MescrollMixin],
  components: {
    uniEcCanvas,
    datetimePopup
  },
  data() {
    return {
      downOption: {
        bgColor: "#ffffff",
      },
      upOption: {
        use: true,
      },
      leftImage: "/static/images/back_01.png",
      navbarColor: "linear-gradient(45deg,#f04037,#f05b37)",
      titleColor: "#FFFFFF",
      title: "团长收益",

      weekMonthTab: [
        {
          name: "近7天",
          type: "week",
          value: 7,
          interval: 0
        },
        {
          name: "近30天",
          type: "month",
          value: 30,
          interval: 3
        },
      ],
      wmIndex: 0, // 默认选中近7天
      ec: {
        option: chartOption.option
      },
      selectDate: "",
      showDatePicker: false, // 日期组件弹窗
      timestamp: 0, // 选中的日期时间戳
      list: [], // 收益列表
      topHeight: "", // 自定义导航栏高度
      total_profit: 0, // 本月收益
    };
  },
  computed: {
    ...mapGetters(['vipObject']),
  },
  onShow() {
    this.getVipObject(1);
  },
  methods: {
    ...mapActions({
        getVipObject: "user/getVipObject",
    }),
    productImg(item) {
      const { goods_imgs, pay_way } = item.order_info;
      if(goods_imgs) return goods_imgs;
			return (haiWeiObj[pay_way] && haiWeiObj[pay_way].product_img) || '122';
		},
    copyHandle(copyCont) {
      uni.setClipboardData({
        data: copyCont,
        complete:(complete) => {
          this.$toast('复制成功');
        }
      });
    },
    formatPrice(price) {
      price = Number(price).toFixed(2);
      let splitPrice = price.split(".");
      let amount = formatAmount(splitPrice[0]);
      //2.重新赋值
      return `<span style="font-weight: 600;font-size: 28px">${amount}.<span style="font-size: 18px;">${splitPrice[1]}</span></span>`;
    },
    getCurrentDay() {
      const date = new Date();
      // date.setDate(date.getDate() - 1);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      return (year + "-" + month);
    },
    confirmDate(event) {
      const { detail, date } = event;
      this.timestamp = detail;
      this.selectDate = date;
      this.showDatePicker = false;
      this.mescroll.resetUpScroll();
    },
    async upCallback(page) {
      this.profitDetailRequest(page);
    },
    /*下拉刷新的回调 */
    downCallback() {
      this.selectDate = this.getCurrentDay();
      this.profitChartRequest();
      this.mescroll.resetUpScroll();
    },
    async profitChartRequest(index) {
      this.wmIndex = index || 0;
      const params = { date: this.weekMonthTab[this.wmIndex].value };
      const res = await profitChart(params);
      if(res.code != 1) return;
      const { xArr, yArr } = res.data;
      this.ec.option.xAxis.data = xArr;
      this.ec.option.xAxis.axisLabel.interval = this.weekMonthTab[this.wmIndex].interval;
      this.ec.option.series[0].data = yArr;
    },
    profitDetailRequest(page) {
      const params = {
        page: page.num,
        size: 10,
        date: this.selectDate
      };
      profitDetail(params).then(res => {
        if(res.code != 1) return;
        if (page.num == 1) this.list = [];
        const { list, total_profit, total_count } = res.data;
        this.total_profit = total_profit;
        this.list = this.list.concat(list); // 追加新数据

        this.mescroll.endBySize(list.length, total_count);
      }).catch(() => this.mescroll.endErr());
    },
    goPage(url){
      this.$go(url);
    }
  },
  onLoad() {
    getNavbarData().then((res) => {
      let { navBarHeight, statusBarHeight } = res;
      this.topHeight = navBarHeight + statusBarHeight;
    });
  },
};
</script>
<style lang="scss">
::v-deep {
  page {
    width: auto;
    height: auto;
    overflow: scroll;
    background: #F5F6FA;
    // background: unset;
    > view {
      height: auto;
      overflow: auto;
    }
  }
}
  .available-withdrawal-box {
    height: 170rpx;
    box-sizing: border-box;
    background: linear-gradient(45deg, #f04037, #f05b37);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32rpx;
    .aw-left {
      color: #ffffff;
      .aw-title {
        font-size: 28rpx;
      }
      .aw-amount {
        margin-top: 8rpx;
      }
    }
    .btn-withdrawal {
      width: 120rpx;
      height: 56rpx;
      line-height: 56rpx;
      text-align: center;
      background: #ffffff;
      border-radius: 8rpx;
      font-size: 28rpx;
      color: #ef2b20;
    }
  }
  .total-earn {
    display: flex;
    align-items: center;
    justify-content: space-around;
    box-sizing: border-box;
    padding: 0 32rpx;
    height: 160rpx;
    background: #fff;
    .te-item {
      text-align: center;
      position: relative;
      width: 230rpx;
      box-sizing: border-box;
      .width-140 {
        display: inline-block;
        min-width: 140rpx;
        text-align: left;
      }
      .te-title {
        font-size: 24rpx;
        color: #999999;
      }
      .te-num {
        margin-top: 10rpx;
        font-size: 36rpx;
        font-weight: 600;
        color: #333;
      }
    }
    .te-pseudo-line::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      width: 2rpx;
      height: 76rpx;
      background: #e1e1e1;
    }
    .te-pseudo-line::after {
      content: "";
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      width: 2rpx;
      height: 76rpx;
      background: #e1e1e1;
    }
  }
  .income-title {
    box-sizing: border-box;
    padding: 32rpx;
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 14rpx;
    background: #fff;
    .it-pseudo-line {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
      position: relative;
      padding-left: 14rpx;
    }
    .it-pseudo-line::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      width: 4rpx;
      height: 26rpx;
      background: #ef2b20;
    }
    .week-month-tab {
      display: flex;
      align-items: center;
      .wm-item {
        font-size: 26rpx;
        color: #333;
        margin-left: 14rpx;
        padding: 6rpx 18rpx;
        box-sizing: border-box;
      }
      .wm-active {
        background: #f4f4f4;
        border-radius: 24rpx;
      }
    }
  }
  .stick-box {
    position: sticky;
    padding-bottom: 28rpx;
    background: #fff;
    z-index: 1;
  }
  .echart-box {
    box-sizing: border-box;
    height: 300rpx;
    width: 100%;
    padding: 0 20rpx;
    position: relative;
    z-index: 0;
    background: #fff;
  }
  .current-income-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32rpx;
    margin: 0 32rpx;
    height: 104rpx;
    background: #f7f7f7;
    border-radius: 8rpx;
    box-sizing: border-box;
    .ci-left {
      font-size: 28rpx;
      color: #333;
      .ci-money {
        font-size: 40rpx;
        font-weight: 600;
      }
    }
    .ci-right {
      display: flex;
      align-items: center;
      font-size: 28rpx;
      font-weight: 400;
      color: #333333;
      .icon-date {
        width: 24rpx;
        height: 24rpx;
      }
      .ci-date {
        margin: 0 4rpx;
      }
      .icon-delta {
        width: 20rpx;
        height: 12rpx;
      }
    }
  }
  .income-list-box {
    box-sizing: border-box;
    padding: 20rpx 32rpx;
    background: #F5F6FA;
    // padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
    // padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    .income-list-item {
      padding: 20rpx;
      background: #fff;
      border-radius: 16rpx;
      margin-bottom: 20rpx;
      .order_top {
        font-size: 26rpx;
        color: #999;
        padding-bottom: 20rpx;
        border-bottom: 2rpx solid #f5f4f4e6;
        .order_left {
          color: #aaa;
        }
      }
      .order_cont {
        display: flex;
        margin-top: 20rpx;
        .order_cont-img {
          width: 172rpx;
          height: 172rpx;
        }
        .ili-info {
          margin-left: 20rpx;
          width: 0;
          flex: 1;
          .ili-info-name {
            font-size: 32rpx;
            color: #333;
          }
          .price_box {
            background: #f6f6f6;
            border-radius: 8rpx;
            display: flex;
            align-items: center;
            padding: 16rpx 0;
            .price_item {
              width: 50%;
              text-align: center;
              color: #999;
              font-size: 26rpx;
              .price_num {
                font-size: 32rpx;
                font-weight: bold;
                color: #EF2B20;
                &.active {
                  color: #999;
                }
                &::before {
                  content: '￥';
                  font-size: 24rpx;
                }
              }
            }
            .line {
              width: 2rpx;
              height: 52rpx;
              background: #e1e1e1;
            }
          }
        }
      }
    }
  }
// 适配底部的导航条
.mescroll-body.mescorll-sticky {
  padding-bottom: calc(20rpx + constant(safe-area-inset-bottom)) !important;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom)) !important;
  box-sizing: border-box;
}
.order_copy {
  &::after {
    content: '';
    width: 24rpx;
    height: 24rpx;
    background: url("https://file.y1b.cn/store/1-0/24530/66583e2a99bb5.png")  0 0 / 100% 100% no-repeat;
    display: inline-block;
    margin-left: 18rpx;
  }
}
</style>
