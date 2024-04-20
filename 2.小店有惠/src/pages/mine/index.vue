<template>
<view class="mine">
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
      :fixed="true"
      :navbarColor="showTitleBg ? '#fff' : ''"
      :title="showTitleBg ? '我的' : ''"
    ></xhNavbar>
    <image class="mine_top-img" mode="aspectFit" lazy-load
      src="https://file.y1b.cn/store/1-0/231127/6564548377c10.png"
    ></image>
      <view class="userinfo-box pd_w32"
        :class="{ 'userinfo-box-bottom-line': !userInfo }"
        @click="personalInfo"
      >
        <image class="img-avatar" mode="aspectFill" lazy-load
          :src="userInfo.avatar_url || default_url"
        ></image>
        <view class="name-box">
          <view v-if="userInfo && isAutoLogin">
              <view class="name">
              <text class="">{{ userInfo.nick_name || "" }}</text>
              <!-- 团长角标 -->
              <image class="icon-captain" src="/static/images/mine/icon_captain.png" mode="aspectFit" lazy-load v-if="userInfo.is_team"></image>
              </view>
              <view class="user-id">ID: {{ userInfo.id || 0 }}</view>
          </view>
          <view class="fl_bet" v-else>
              <view class="no-login">未登录</view>
              <van-icon name="arrow" color="#333333" size="16" />
          </view>
        </view>
      </view>
    <view class="bg_white">
      <!-- 成为团长 -->
      <view class="apply-box" @click="goToCard"  v-if="!userInfo.is_team">
        <view class="apply-left">
          <view class="apply-title">成为团长</view>
          <view class="apply-tips">0元投入·掌柜尊享·坐享收益</view>
        </view>
        <view class="apply-right">
          <text class="">马上报名</text>
          <van-icon name="arrow" color="#A15619" size="12" />
        </view>
      </view>
      <!-- 累计收益 -->
      <view class="income-box" @click="totalEarn" v-else>
        <view class="check-detail">查看详情</view>
        <view class="ib-head">
          <view class="ib-title" @click.stop="ishShowHelpDia = true">
            累计收益(元)
          <image class="ib_title-help" src="https://file.y1b.cn/store/1-0/24131/65ba37f81a4f3.png" mode="aspectFit"></image>
          </view>
          <view class="ib-content">
            <view v-html="formatPrice(vipObject.total_profit || 0)"></view>
            <view class="ib-tips" v-if="vipObject.read">你有{{vipObject.read}}笔收益到账</view>
          </view>
        </view>
        <view class="ib-bottom">
          <view>今日预估：¥{{ vipObject.day_profit || 0 }}</view>
          <view class="withdrawn">已提现：¥{{vipObject.tx_amount || 0}}</view>
        </view>
      </view>
    </view>
    <!-- 积分订单 -->
    <view class="order-box pd_w32 bd_bm">
      <view class="user-order-head">
        <text class="uoh-title">我的订单</text>
        <view class="order-all" @click="goPages('/pages/mineModule/order/index?activeTab=0')">
          <text style="margin-right: 8rpx">全部</text>
          <van-icon name="arrow" color="#999" size="18rpx" />
        </view>
      </view>
      <view class="order-tab-box">
        <view class="order-item"
          v-for="(item, index) in order" :key="index"
          @click="goPages(item.path)"
        >
          <view class="order-item-head">
            <image class="order-item-icon" mode="aspectFit" lazy-load
              :src="item.icon"
            ></image>
            <!-- 徽标:已完成不显示，数值大于0才显示 -->
            <view class="order-item-dot" v-if="showDot(index, item.key)">
              {{ userInfo[item.key] > 99 ? '99+' : userInfo[item.key] }}
            </view>
          </view>
          <view class="order-item-name">{{ item.name }}</view>
        </view>
      </view>
      <!-- 待付款 - 暂时关闭 -->
      <!-- <view
        class="order-be-paid"
        v-if="expireOrderInfo"
        @click="goToPay(expireOrderInfo)"
      >
        <view class="obp-title">待付款</view>
        <view class="obp-right">
          <image
            class="obp-icon"
            :src="expireOrderInfo.picList[0]"
            mode="aspectFit"
            lazy-load="false"
          ></image>
          <van-count-down
            class="obp-count"
            :time="expireOrderInfo.format_time"
            @finish="getExpireOrder"
          ></van-count-down>
          <view class="obp-pay">
            去支付
            <van-icon
              name="arrow"
              color="#F2554D"
              size="14"
              style="margin-top: 2px"
            />
          </view>
        </view>
      </view> -->
    </view>
    <!-- 其它菜单 -->
    <view class="menu-list pd_w32">
      <view class="menu-item"
        v-for="(item, index) in menu" :key="index"
        @click="goPages(item.path)"
      >
        <image class="mil-icon" mode="aspectFit" lazy-load
          :src="item.icon"
        ></image>
        <view class="mil-name">{{ item.name }}</view>
      </view>
    </view>
    <view v-if="goods.length" class="good_box">
      <good-list :list="goods"></good-list>
    </view>
  </mescroll-body>
  <helpConfirmDia
    :isShow="ishShowHelpDia"
    @close="ishShowHelpDia = false"
  ></helpConfirmDia>
  <navbar :currentIndex="2"></navbar>
</view>
</template>
<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { mapGetters, mapActions } from "vuex";
import config from "./config.js";
import goodList from "@/components/goodList.vue";
import { getNavbarData } from "@/components/xhNavbar/xhNavbar.js";
import { formatAmount } from "@/utils/index.js";
import { expireOrder, orderPay } from "@/api/modules/order.js";
import helpConfirmDia from './helpConfirmDia.vue';
import { msgTemplate, isSend } from "@/api/modules/card.js";
import {
  material,
  jingfen,
  goodsQuery,
  groupRecommend,
} from "@/api/modules/jsShop.js";
export default {
    name: "mine",
    mixins: [MescrollMixin], // 使用mixin
    components: {
      goodList,
      helpConfirmDia
    },
    data() {
      return {
        default_url: "https://file.y1b.cn/store/1-0/24131/65ba392989ede.png",
        topHeight: 0,
        order: config.orders,
        menu: config.menus,
        downOption: {
          auto: false,
          bgColor: "#ffffff",
        },
        upOption: {
            auto: false, // 不自动加载
            use: true,
            page: {
            num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
            size: 2, // 每页数据的数量
            },
            noMoreSize: 4,
            empty: {
            use: false,
            },
            textNoMore: "",
        },
        expireOrderInfo: null, //过期订单信息
        paymentParams: null, //支付信息：支付完成 || 无expireOrderInfo清除掉
        pay_order_id: "", //订单支付id
        goods: [],
        pageNum: 1,
        groupId_index: 0,
        lastOddItem: null,
        showTitleBg: false,
        ishShowHelpDia: false,
      };
    },
    computed: {
      ...mapGetters(["userInfo", "isAuthorization", 'isAutoLogin', 'vipObject']),
    },
    watch: {
    },
    onLoad() {
      getNavbarData().then((res) => {
        let { navBarHeight, statusBarHeight } = res;
        this.topHeight = navBarHeight + statusBarHeight + "px";
      });
    },
    onShow() {
        this.downCallback();
    },
  methods: {
    ...mapActions({
      getUserInfo: "user/getUserInfo",
      getVipObject: "user/getVipObject",
    }),
    showDot(index,key) {
      return index < 2 && (this.userInfo[key]> 0);
    },
    /*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
    downCallback() {
      /*刷新用户信息*/
      this.getVipObject();
      this.getUserInfo();
      this.getExpireOrder();
      this.pageNum = 1;
      this.groupId_index = 0;
      this.lastOddItem = null;
      this.mescroll.resetUpScroll();
    },
    async upCallback(page) {
      this.requestRem(page);
    },
    async requestRem(page) {
      if (!this.groupRecommendData) {
        const recRes = await groupRecommend({ page: 2 });
        if (recRes.code != 1 || !recRes.data)
          return this.mescroll.endSuccess(0);
        this.groupRecommendData = recRes.data;
      }
      const { id, cid, cid2, cid3, eliteId, groupId, type } =
        this.groupRecommendData;
      let pageNum = this.pageNum;
      // const pageNum = page.num;
      let params = {
        id,
        page: pageNum,
        size: 10,
      };
      let queryApi = goodsQuery;
      // type 1-猜你喜欢 2-京东精选 3-关键词查询, 4 选品库组合
      switch (type) {
        case 1:
          queryApi = material;
          params.eliteId = eliteId;
          params.groupId = groupId;
          params.size = 10;
          break;
        case 2:
          queryApi = jingfen;
          params.eliteId = eliteId;
          params.groupId = groupId;
          params.size = 20;
          break;
        case 3:
          queryApi = goodsQuery;
          params.cid1 = cid;
          params.cid2 = cid2;
          params.cid3 = cid3;
          break;
        case 4:
          queryApi = jingfen;
          const groupId_index = this.groupId_index;
          params.eliteId = eliteId;
          params.groupId = groupId[groupId_index];
          params.size = 20;
          break;
      }
      queryApi(params).then((res) => {
        const { list, total_count } = res.data;
        // 设置列表数据
        if (page.num == 1) {
          this.goods = [];
          this.pageNum = 1;
          this.lastOddItem = null;
        }
        // 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
        let isNextPage = pageNum * params.size < total_count;
        if (!isNextPage && type == 4 && this.groupId_index < groupId.length - 1) {
          // 无下一页
          this.groupId_index += 1;
          this.mescroll.endSuccess(total_count, true);
          this.pageNum = 0;
        } else {
          this.mescroll.endSuccess(list.length || total_count, isNextPage);
        }
        if (this.lastOddItem) {
          this.goods.push(this.lastOddItem);
          this.lastOddItem = null;
        }
        this.pageNum += 1;
        this.goods = this.goods.concat(list); // 追加新数据
        const goodLength = this.goods.length;
        if (goodLength % 2 && goodLength > 6) {
          this.lastOddItem = this.goods.pop();
        }
        if (((list.length <= 0 ) || (this.goods.length <= 4)) && isNextPage ) {
          this.mescroll.triggerUpScroll();
        }
      }).catch(() => this.mescroll.endErr());
    },
    // 页面的滚动事件
    onPageScroll(e) {
      if (Math.ceil(e.scrollTop) > 0) {
        return this.showTitleBg = true;
      }
      this.showTitleBg = false;
    },
    personalInfo() {
      if(!this.isAutoLogin) return this.$go('/pages/login/index');
      this.$go("/pages/mineModule/personalInfo/index");
    },
    formatPrice(price) {
      price = Number(price).toFixed(2);
      let splitPrice = price.split(".");
      let amount = formatAmount(splitPrice[0]);
      //2.重新赋值
      return `<span style="font-weight:500;font-size: 28px">${amount}.<span style="font-size: 18px;">${splitPrice[1]}</span></span>`;
    },
    async totalEarn() {
      if(!this.isAutoLogin) return this.$go('/pages/login/index');
      const msgRes = await msgTemplate();
      if(msgRes.code == 1 && msgRes.data) {
        const { settle, events, invite } = msgRes.data;
        let tmplIds = [invite];
        (!this.vipObject.is_send && settle) && tmplIds.push(settle);
        (!this.vipObject.is_events && events) && tmplIds.push(events);
        tmplIds = tmplIds.filter(item => !!item);
        const subRes = await this.$subscribeMessageHandle(tmplIds);
        const settleResult = subRes[settle];
        const eventsResult = subRes[events];
        const inviteResult = subRes[invite];
        const params = {
          is_send: 0,
          is_events: 0,
          is_invite: 0
        }
        if(settleResult == 'accept') params.is_send = 1;
        if(eventsResult == 'accept') params.is_events = 1;
        if(inviteResult == 'accept') params.is_invite = 1;
        isSend(params);
      }
      this.$go("/pages/cardModule/cardEarnings/index");
    },
    goPages(path) {
      if(!this.isAutoLogin) return this.$go('/pages/login/index');
      if (path === "share") return;
      this.$go(path);
    },
    goToCard() {
      if(!this.isAutoLogin) return this.$go('/pages/login/index');
      this.$switchTab('/pages/card/index');
    },
    getExpireOrder() {
      expireOrder().then((res) => {
        let { code, data } = res;
        if (code == 1 && data) {
          //剩余时间
          let remainder =
            new Date(
              data.expire_time.replace(new RegExp(/-/gm), "/")
            ).getTime() - Date.now();
          // 订单状态不为待付款|支付时间已过则不显示
          if (remainder <= 0 || data.status !== 0) {
            this.expireOrderInfo = null;
            return;
          }
          //设置待支付订单信息
          this.expireOrderInfo = {
            ...data,
            format_time: remainder,
          };
          return;
        }
        this.paymentParams = null;
      });
    },
    // 去支付：创建订单，发起支付，支付成功跳转至订单，（直充）已完成，（卡券）待使用
    goToPay(item) {
      let params = { id: item.id };
      if (!this.paymentParams) {
        orderPay(params).then((res) => {
          let { code, data, msg } = res;
          if (code == 1) {
            this.paymentParams = JSON.parse(data.jspay_info);
            this.pay_order_id = data.order_id;
            this.createPayment(this.paymentParams);
            return;
          }
          this.$toast(msg);
        });
        return;
      }
      this.createPayment(this.paymentParams);
    },
    //发起支付
    createPayment(obj) {
      uni.requestPayment({
        nonceStr: obj.nonceStr,
        package: obj.package,
        paySign: obj.paySign,
        signType: obj.signType,
        timeStamp: obj.timeStamp,
        success: (res) => {
          //跳转支付详情
          uni.navigateTo({
            url: "/pages/payStatus/index?order_id=" + this.pay_order_id,
          });
        },
        fail: (err) => {
          if (err.errMsg == "requestPayment:fail cancel") {
            uni.showToast({ icon: "none", title: "您取消了支付操作" });
            return;
          }
          uni.showToast({ icon: "none", title: err.errMsg });
        },
      });
    },
  },
};
</script>
<style scoped lang="scss">
.pd_w32 {
  padding: 0 32rpx;
}
.bd_bm {
  background: #fff;
  margin-bottom: 10rpx;
  // border-bottom: 10rpx solid #f5f6fa;
}
.bg_white{
  background: #fff;
}
.good_box{
  // background: #f5f6fa;
  margin-top: 15rpx;
}
.mine_top-img{
  background: #fff url("https://file.y1b.cn/store/1-0/231127/6564548377c10.png") 0 0 / cover;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 275rpx;
    z-index: -1;
    overflow: visible;
    &::before {
      content: '\3000';
      background: #fff ;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 375rpx;
      z-index: -1;
    }
}
.mine {
  background-color: #f5f6fa;
  box-sizing: border-box;
  // padding: 28rpx 32rpx;
  position: relative;
  z-index: 0;
  padding-bottom: calc(125rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(125rpx + env(safe-area-inset-bottom));
  .userinfo-box {
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 40rpx;
    padding-top: 32rpx;
      .img-avatar {
        width: 112rpx;
        height: 112rpx;
        flex: 0 0 112rpx;
        background: #e9e9e9;
        border-radius: 50%;
      }

      .name-box {
        margin-left: 24rpx;
        flex: 1;
        .name {
          display: flex;
          align-items: center;
          font-size: 38rpx;
          font-weight: 600;
          color: #272e40;

          .icon-captain {
            width: 82rpx;
            height: 38rpx;
            margin-left: 14rpx;
          }
        }

        .user-id {
          font-size: 28rpx;
          font-weight: 400;
          color: #cccccc;
          margin-top: 12rpx;
        }

        .no-login {
            font-size: 38rpx;
            font-weight: 500;
            color: #272e40;
            line-height: 52rpx;
        }
    }
  }
  .userinfo-box-bottom-line {
    border-bottom: 2rpx solid #f1f1f1;
  }
  .apply-box {
    position: relative;
    height: 132rpx;
    box-sizing: border-box;
    padding: 18rpx 34rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1;
    margin: 0 32rpx;
    &::before {
      content: '\3000';
      background: url("https://file.y1b.cn/store/1-0/231127/6564549e4b4e5.png") 0 0 / cover;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }
    .apply-left {
      font-size: 26rpx;
      font-weight: 400;
      color: #a15619;

      .apply-title {
        font-size: 30rpx;
        font-weight: 500;
        color: #a15619;
      }

      .apply-tips {
        margin-top: 8rpx;
      }
    }

    .apply-right {
      width: 152rpx;
      height: 52rpx;
      line-height: 52rpx;
      box-sizing: border-box;
      padding-left: 4rpx;
      background: #ffffff;
      border-radius: 30rpx;
      text-align: center;
      font-size: 26rpx;
      color: #a15619;
      text-align: center;
    }
  }
  .order-box {
    padding: 32rpx;
    .order-title {
      font-size: 32rpx;
      font-weight: 500;
      color: #333333;
    }
    .order-tab-box {
      margin-top: 14rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24rpx 50rpx 0 50rpx;
      .order-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        .order-item-head {
          position: relative;

          .order-item-icon {
            width: 80rpx;
            height: 80rpx;
          }

          .order-item-dot {
            position: absolute;
            right: 0;
            top: 0;
            width: 40rpx;
            height: 40rpx;
            line-height: 40rpx;
            background: #ef2b20;
            border-radius: 50%;
            font-size: 20rpx;
            font-weight: 400;
            text-align: center;
            color: #ffffff;
            transform: translate(50%, -50%);
          }
        }

        .order-item-name {
          font-size: 24rpx;
          font-weight: 400;
          text-align: center;
          color: #333333;
        }
      }
    }

    .order-be-paid {
      margin-top: 28rpx;
      width: 686rpx;
      height: 82rpx;
      box-sizing: border-box;
      background: #f7f7f7;
      border-radius: 4rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24rpx;

      .obp-title {
        font-size: 30rpx;
        color: #333333;
      }

      .obp-right {
        display: flex;
        align-items: center;

        .obp-icon {
          width: 52rpx;
          height: 52rpx;
          background: #d8d8d8;
          border-radius: 8rpx;
        }

        .obp-count {
          margin-left: 12rpx;
          margin-right: 28rpx;
        }

        .obp-pay {
          font-size: 28rpx;
          font-weight: 500;
          color: #f2554d;
          width: 152rpx;
          height: 56rpx;
          box-sizing: border-box;
          padding-left: 10rpx;
          background: #ffebea;
          border-radius: 28rpx;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }

  .credit-box {
    margin-top: 32rpx;
    height: 128rpx;
    box-lines: border-box;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 32rpx;
    font-weight: 500;
    color: #333333;

    .credit {
      font-size: 28rpx;
      color: #999999;
    }
  }

  .credit-box::before {
    content: "";
    position: absolute;
    top: 0;
    left: -32rpx;
    right: -32rpx;
    height: 10rpx;
    background-color: #f5f6fa;
  }

  .credit-box::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: -32rpx;
    right: -32rpx;
    height: 10rpx;
    background-color: #f5f6fa;
  }

  .menu-list {
    display: flex;
    padding: 28rpx 40rpx;
    background: #fff;
    margin-bottom: 10rpx;
    // border-bottom: 10rpx solid #F5F6FA;
    .menu-item {
      box-sizing: border-box;
      &:not(:last-child) {
        margin-right: 64rpx;
      }
      .mil-icon {
        width: 52rpx;
        height: 52rpx;
        display: block;
        margin: 0 auto 12rpx;
      }

      .mil-name {
        font-size: 28rpx;
        font-weight: 400;
        color: #333333;
      }
    }
  }
  .income-box {
    position: relative;
    height: 284rpx;
    box-sizing: border-box;
    z-index: 1;
    padding: 40rpx 40rpx 10rpx 40rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 0 32rpx;
    background: linear-gradient(45deg,#f04037, #f06437);
    border-radius: 16rpx;
    color: #fff;
    &::before {
      content: '\3000';
      background: url("https://file.y1b.cn/store/1-0/231127/6564540a89b24.png") 0 0 / cover;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }
    .income-box-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }

    .check-detail {
      width: 136rpx;
      height: 52rpx;
      line-height: 52rpx;
      text-align: center;
      box-sizing: border-box;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.78),
        rgba(255, 255, 255, 0.9)
      );
      border-radius: 12rpx 0px 0px 12rpx;
      position: absolute;
      right: 0;
      top: 48rpx;
      font-size: 26rpx;
      font-weight: 400;
      color: #f1534b;
    }

    .ib-head {
      z-index: 1;
      .ib-title {
        font-size: 28rpx;
        position: relative;
        display: inline-block;
        .ib_title-help{
          position: absolute;
          top: 50%;
          right: -40rpx;
          transform: translateY(-50%);
          width: 30rpx;
          height: 30rpx;
        }
      }

      .ib-content {
        position: relative;
        display: flex;
        margin-top: 8rpx;

        .ib-num {
          font-size: 56rpx;
          font-weight: 500;
        }

        .ib-tips {
          height: 36rpx;
          font-size: 20rpx;
          font-weight: 500;
          background: rgba(255, 198, 84, 0.85);
          border-radius: 18rpx 24rpx 24rpx 0px;
          padding: 0rpx 12rpx;
          display: flex;
          align-items: center;
          margin-left: 4rpx;
        }
      }
    }

    .ib-bottom {
      z-index: 1;
      display: flex;
      opacity: 0.85;
      font-size: 30rpx;

      .withdrawn {
        margin-left: 24rpx;
        padding-left: 24rpx;
        position: relative;
        // border-left: 2rpx solid #ffffff;
      }

      .withdrawn::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(50%, -50%);
        width: 2rpx;
        height: 20rpx;
        background: #ffffff;
      }
    }
  }
}
.user-order-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.uoh-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}
.order-all {
  font-size: 24rpx;
  font-weight: 400;
  color: #999999;
  display: flex;
  align-items: center;
}
</style>
