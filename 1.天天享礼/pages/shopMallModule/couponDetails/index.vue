<template>
  <view class="coupon-details">
    <view class="icon_box" @click="$leftBack"
      :style="{ height: navBarHeight + 'px', top: topHeight + 'px' }"
    ><image class="icon_box-icon" :src="imgUrl + 'static/images/icon_close.png'" mode="aspectFill"></image>
    </view>
    <view class="content_box">
      <!-- 测试视频号 channel-video-->
      <view class="sph-box">
        <channel-video
          :style="{ width: screenWidth + 'px', height: screenWidth + 'px' }"
          object-fit="contain"
          autoplay
          loop
          :feed-id="config.video_account_id"
          :finder-user-name="config.video_id"
          @error="sphError"
          v-if="config.video_account_id"
        >
          <!-- 商品图片 -->
          <van-image @click="openSph()"
            :width="screenWidth + 'px'" :height="screenWidth + 'px'"
            :src="config.image" use-loading-slot
          ><van-loading slot="loading" type="spinner" size="20" vertical />
          </van-image>
        </channel-video>
        <!-- 商品图片 -->
        <van-image
          v-else
          :width="screenWidth + 'px'" :height="screenWidth + 'px'"
          :src="config.image" use-loading-slot
        ><van-loading slot="loading" type="spinner" size="20" vertical />
        </van-image>
      </view>
      <!-- 分享图标 -->
      <!-- <button v-if="samePlatform" open-type="share" class="share-btn" :style="'top:'+stickTop+'px;'">
				<van-image width="28px" height="28px" :src="imgUrl+'/202303/icon_coupon_share.png'" radius="50%"
					use-loading-slot>
					<van-loading slot="loading" type="spinner" size="20" vertical />
				</van-image>
			</button> -->
      <!-- 关闭返回的icon -->
      <!-- <view class="back_btn" :style="'top:'+ stickTop + 'px;'" @click="$leftBack">
				<image class="back_btn-icon" :src="subImgUrl +'/close_back.png'" mode="aspectFill"></image>
			</view> -->
      <!-- 商品价值 -->
      <!-- 省钱卡的 - 去掉省钱卡的概念 -->
      <!-- <vip-card
        v-if="userInfo.is_vip"
        :config="config"
        :samePlatform="samePlatform"
      /> -->
      <!-- 正常 -->
      <normal-card v-if="cardType === 1"
        :config="config" :samePlatform="samePlatform"/>
      <!-- 秒杀 -->
      <seckill-card v-else-if="cardType === 2"
        :config="config" @finish="init" :samePlatform="samePlatform"/>
      <!-- 秒杀预告 -->
      <preview-seckill-card v-else
        :config="config" @finish="init" :samePlatform="samePlatform"/>
      <!-- 富文本详情 -->
      <view class="u-parse-box">
        <view class="u-parse_title">
          <image class="remind_icon" mode="aspectFill" :src="subImgUrl + '/remind_icon.png'"></image>
          需要注意
          <image class="remind_qa" mode="aspectFill" :src="subImgUrl + '/qa.png'"></image>
        </view>
        <view class="u-parse_cont">
          <u-parse
            :content="config.explain"
            @preview="preview"
            @navigate="navigate"
          ></u-parse>
        </view>
      </view>
      <!-- 价格说明 -->
      <view class="price-desc"
        :style="{ '--padding': stockType === 1 && exchangeCk_id ? '68rpx' : '0rpx' }">
        <view class="price-desc-title"> 价格说明 </view>
        <view class="price-desc-info">
          基础价或划线价，指商品的专柜价、吊牌价、正品零售价、厂商指导价或该商品的曾经展示过的销售价等，并非原价，仅供参考
        </view>
        <view class="price-desc-tips">
          权益数量有限，先到先得，兑完为止，虚拟权益一经兑换不支持退换。
        </view>
      </view>
      <!-- 底部操作按钮 -->
      <view class="bottom-tools-box" v-if="stockType === 1">
        <view class="remind_box" v-if="exchangeCk_id" @click="goMyCouponHandle">
          <image class="bg_img" :src="subImgUrl + '/remind_box-bg.png'" mode="scaleToFill"></image>
          <view class="remind_left">
            <image class="left_icon" mode="aspectFill" :src="subImgUrl + '/remind_left-icon.png'"></image>
            你有该优惠券未使用
          </view>
          <view class="remind_right">去使用<van-icon name="arrow" color="#F84842" size="26rpx" /></view>
        </view>
        <view class="bottom-tools" v-if="samePlatform">
          <!-- 收藏按钮 -->
          <view class="collection-btn"
            :class="{ collect: isCollect }"
            @click="collectHandle"
          >
            <image class="collection-btn-icon" mode="aspectFill"
              :src=" isCollect ? `${subImgUrl}/stat_select.png` : `${subImgUrl}/star01.jpg`"
            ></image>
            <text>{{ isCollect ? "已收藏" : "收藏" }}</text>
          </view>
          <!-- 获取手机号码 -->
          <button
            open-type="getPhoneNumber"
            class="get-phone"
            @getphonenumber="getPhoneNumber"
            v-if="isGetPhone"
          ></button>
          <!-- 立即兑换 -->
          <view :class="['redeem-now',
              redeemClickLoading ? 'redeem-no_active' : '',
              config.zero_credits ? 'vip_active' : ''
            ]"
            @click="getWxMsgId">
            <block v-if="config.zero_credits">
                <image class="coupon_vip" src="https://file.y1b.cn/store/1-0/24514/6642fce9a8839.png" mode="heightFix"></image>
                <view class="redeem-now-left">
                    <view class="rnl-value">0</view>
                    <view class="rnl-label"> 牛金豆 </view>
                </view>
                <view class="icon_middle"></view>
                <view class="redeem-now-right">
                  {{ redeemClickLoading ? "兑换中" : exchangeBtn }}
                </view>
            </block>
            <block v-else-if="config.credits > 0">
                <view class="redeem-now-left">
                    <view class="rnl-value" v-if="cardType === 3">
                        {{ config.is_popover ? 0 : config.credits }}
                    </view>
                    <view class="rnl-value" v-else>
                        {{ config.is_popover ? 0 :(config.seckill_credits || config.credits) }}
                    </view>
                    <view class="rnl-label">牛金豆</view>
                </view>
                <view class="icon_middle"></view>
                <view class="redeem-now-right">
                    {{ redeemClickLoading ? "兑换中" : exchangeBtn }}
                </view>
            </block>
            <view class="redeem-now-txt" v-else>{{ config.btn_word || "去领取"}}</view>
            <!-- 仅限时秒杀可见 -->
            <image v-if="cardType === 2"
              class="rbr-xs-icon" mode="aspectFill"
              :src="subImgUrl + '/xs.png'"></image>
          </view>
        </view>
        <view class="van-submit-bar__safe"></view>
      </view>
      <view class="no-inventory" v-else-if="!isGetWxMsgId">
        抱歉，该优惠券已被抢光
        <image class="no-inventory_icon"
          :src="subImgUrl + '/no-inventory_icon.png'"
          mode="aspectFill"
        ></image>
      </view>
    </view>
    <!-- 兑换成功 -->
    <exchange-success
      ref="exchangeSuccess"
      @exchangeEnd="exchangeEndHandle"
      @openServiceRecharge="openServiceRecharge"
      @openMiniSucc="openMiniSuccHandle"
    />
    <!-- 兑换失败 -->
    <!-- <exchange-failed ref="exchangeFailed" /> -->
    <exchangeFailed
      :isShow="exchangeFailedShow"
      @goTask="goTaskHandle"
      @close="exchangeFailedShow = false"
    >
    </exchangeFailed>
    <!-- 赚取牛金豆 -->
    <serviceCredits
      ref="serviceCredits"
      :isShow="serviceCreditsShow"
      @showAdPlay="showAdPlayHandle"
      @close="closeHandle"
    >
    </serviceCredits>
    <service-recharge ref="serviceRecharge" @close="closeServiceHandle" />
    <!-- 其它成功情况 -->
    <!-- <other-exchange-success ref="otherExchangeSuccess" /> -->
    <!-- 新人用户的更新 -->
    <pointUpgradeDia ref="pointUpgradeDia" @happyGet="getHandle" />
    <!-- 隐私授权 -->
    <privacyOpen ref="privacyOpen"></privacyOpen>
  </view>
</template>

<script>
import uParse from "@/components/u-parse/u-parse.vue";
import exchangeSuccess from "./exchangeSuccess.vue";
import normalCard from "./normalCard.vue";
import previewSeckillCard from "./previewSeckillCard.vue";
import seckillCard from "./seckillCard.vue";
import vipCard from "./vipCard.vue";
// import exchangeFailed from './exchangeFailed.vue';
import exchangeFailed from "@/components/serviceCredits/exchangeFailed.vue";
import serviceCredits from "@/components/serviceCredits/index.vue";
import serviceCreditsFun from "@/components/serviceCredits/serviceCreditsFun.js";
import serviceRecharge from "./serviceRecharge.vue";
// import otherExchangeSuccess from './otherExchangeSuccess.vue'
import { wxmsgid } from "@/api/modules/index.js";
import {
  couponDetails,
  creditsDraw,
  exchange,
  exchangeCk,
  seckill
} from "@/api/modules/shopMall.js";
import { toggleCollect } from "@/api/modules/user.js";
import { getNavbarData } from "@/components/xhNavbar/xhNavbar.js";
import { getImgUrl, setStorage } from "@/utils/auth.js";
import { escape2Html, getViewPort, parseTime } from "@/utils/index.js";
import shareMixin from '@/utils/mixin/shareMixin.js'; // 混入分享的混合方法
import { mapActions, mapGetters } from "vuex";
let _coupon_id = null;
//从消息模板进入页面
let _msgTemplateUpdate = false;
export default {
  components: {
    uParse,
    normalCard,
    previewSeckillCard,
    seckillCard,
    exchangeSuccess,
    exchangeFailed,
    serviceRecharge,
    serviceCredits,
    vipCard
    // otherExchangeSuccess
  },
  mixins: [serviceCreditsFun, shareMixin], // 采用混合的模式添加
  data() {
    return {
      isCollect: false, //收藏状态
      stockType: 1, //1正常,2没有库存
      cardType: 1, //1正常，2秒杀，3秒杀预告
      config: {
        collect: 0,
        credits: 0,
        end_time: "",
        exch_user_num: 0,
        explain: "",
        face_value: "",
        image: "",
        seckill_credits: 0,
        start_time: "",
        title: "",
      },
      screenWidth: null, //屏幕宽度
      samePlatform: true,
      imgUrl: getImgUrl(),
      subImgUrl: `${getImgUrl()}static/subPackages/shopMallModule`,
      cardImgUrl:`${getImgUrl()}static/card/`,
      stickTop: "",
      redeemClickLoading: false,
      isPowerStatus: 0,
      isGetWxMsgId: false,
      applyCouponId: 0,
      exchangeId: 0,
      navBarHeight: 0,
      topHeight: 0,
      isShowOpenEmbedded: false,
      exchangeCk_id: 0,
      exchangeBtn: "立即兑换",
      is_popover: 0,
    };
  },
  watch: {
    userInfo(n, o) {
      if (_msgTemplateUpdate) {
        this.init();
      }
    },
  },
  computed: {
    ...mapGetters(["userInfo", 'isAutoLogin']),
    isGetPhone() {
      return !this.userInfo.mobile && (this.config.open_mini_type != 2) && this.isAutoLogin &&  [11, 12].includes(this.config.voucherType);
    }
  },
  onShow() {
    this.$refs.privacyOpen.LifetimesShow();
    // 打开半屏成功 —— 且退出时返回上一页
    if (this.isShowOpenEmbedded) {
			this.$leftBack();
    }
    this.init();
    this.searchExchangeCk();
  },
  onLoad(o) {
    _coupon_id = o.id;
    if (o.is_popover) {
      this.is_popover = Number(o.is_popover);
    }
    // this.init();
    // 获取屏幕宽度
    let system = uni.getSystemInfoSync();
    this.screenWidth = system.screenWidth || 375;
    _msgTemplateUpdate = !this.userInfo.avatar_url;
    let viewPort = getViewPort();
    this.stickTop = viewPort.navHeight + 26;
    if (o.isGetWxMsgId && o.applyCouponId) {
      this.isGetWxMsgId = Boolean(o.isGetWxMsgId);
      this.applyCouponId = Number(o.applyCouponId);
    }
    getNavbarData().then((res) => {
      let { navBarHeight, statusBarHeight } = res;
      this.navBarHeight = navBarHeight;
      this.topHeight = statusBarHeight;
    });
  },
  methods: {
    ...mapActions({
      getUserTotal: "user/getUserTotal",
      updateUserNew: "user/updateUserNew",
    }),
    closeServiceHandle() {
      this.searchExchangeCk();
    },
    async searchExchangeCk() {
      const res = await exchangeCk({ id: _coupon_id});
      if (!res.code) return;
      if (res.data.have) {
        this.exchangeCk_id = res.data.have;
        this.exchangeBtn = "继续兑换";
      }
    },
    // 去使用
    goMyCouponHandle() {
      if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
      this.$go(`/pages/userModule/myCoupon/index?applyCouponId=${this.exchangeCk_id}&alertUsed=1`);
    },
    init() {
      couponDetails({ id: _coupon_id }).then((res) => {
        let {
          id,
          explain,
          image,
          title,
          collect,
          end_time,
          start_time,
          seckill_credits,
          activity_id,
          activity_num,
          activity_enter_num,
          stock_num,
          status,
          act,
          type,
          exch_user_num,
          user_num
        } = res.data;
        let seckillTime = null;
        /*有时间说明是秒杀活动*/
        this.cardType = 1;
        if (start_time && end_time) {
          let currDate = new Date().getTime();
          start_time = new Date(start_time.replace(new RegExp(/-/gm), "/")).getTime();
          end_time = new Date(end_time.replace(new RegExp(/-/gm), "/")).getTime();
          //即将开始
          if (currDate < start_time) {
            this.cardType = 3;
            seckillTime = start_time - currDate;
          } else if (currDate > start_time && currDate < end_time) {
            this.cardType = 2;
            seckillTime = end_time - currDate;
          }
        }
        /*判断库存*/
        let stockType = 1;
        // 活动已参与人数 >= 活动可参与人数
        if (activity_id && activity_enter_num >= activity_num) {
          stockType = 2;
        }
        // 已经兑换人数 >= 发放数量
        if (stock_num <= 0) {
          stockType = 2;
        }
        // 下架按无库存UI显示
        if (status == 0) {
          stockType = 2;
        }
        this.stockType = stockType;
        this.isCollect = Boolean(collect);
        this.config = {
          ...res.data,
          explain: escape2Html(explain),
          end_time,
          start_time,
          seckill_credits,
          seckillTime,
          voucherType: type,
          is_popover: this.is_popover,
        };
        // 混合模式的share变量赋值
        this.getShareCont.share_title = title;
        this.getShareCont.share_img = image;
        this.getShareCont.id = id;
        // 优惠券过来，直接打开兑换_直接点入兑换展示优惠券的内容，无需兑换访问
        if (this.isGetWxMsgId && this.applyCouponId) {
          this.openServiceRecharge(this.applyCouponId);
        }
        this.samePlatform = act == 1 ? true : false;
        //存储最新商品信息
        uni.setStorageSync(
          "couponDetails_update",
          JSON.stringify({
            id,
            exch_user_num,
            user_num,
          })
        );
      });
    },
    preview(src, e) {},
    navigate(href, e) {},
    async exchange() {
      /*牛金豆不足*/
      const { seckill_credits, credits, zero_credits, id, activity_id } = this.config;
      let ConfigCredits = seckill_credits || credits;
      (this.cardType === 3) && (ConfigCredits = credits);
      if (this.userInfo.credits < ConfigCredits && !this.is_popover && !zero_credits) {
        this.exchangeFailedShow = true;
        this.redeemClickLoading = false;
        creditsDraw();
        return;
      }
      // 正常兑换流程
      let API = exchange;
      let params = {
        id,
        is_power: this.isPowerStatus,
        is_popover: this.is_popover,
      };
      /*秒杀活动*/
      if (this.cardType === 2) {
        API = seckill;
        params = {
          id: activity_id,
          is_power: this.isPowerStatus,
          is_popover: this.is_popover,
        };
      }
      const res = await API(params);
      if (res.code != 1) {
        this.$toast(res.msg);
        this.redeemClickLoading = false;
        return;
      }
      let {
        face_value,
        voucherType,
        is_main,
        article_url,
        main_url,
        video_account_id,
        video_id,
        type_id,
        type_sid,
        open_mini_type,
        qz_url,
      } = this.config;
      face_value = Number(face_value).toFixed(1);
      this.exchangeId = res.data;
      // 移动积分的跳转
      if(voucherType == 11) {
        this.redeemClickLoading = false;
        this.$go(`/pages/webview/webview?link=${encodeURIComponent(qz_url)}`);
      } else {
        this.$refs.exchangeSuccess.popupShow({
          ...this.config,
          id: res.data,
          face_value,
          voucherType,
          is_main,
          article_url,
          main_url,
          video_account_id,
          video_id,
          type_id,
          type_sid,
          open_mini_type,
          qz_url,
          credits,
        });
      }
      /* 更新用户以及券信息 */
      this.getUserTotal();
      this.init();
      setStorage("timeSeckillUpdate", true);
    },
    // 兑换完成 - 更改回兑换的内容
    exchangeEndHandle() {
      this.redeemClickLoading = false;
    },
    openServiceRecharge(id) {
      this.$refs.serviceRecharge.popupShow(id, this.config.voucherType);
    },
    // 半屏打开的回调
    openMiniSuccHandle(open_type) {
      this.isShowOpenEmbedded = open_type == 2;
    },
    async collectHandle() {
      if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
      const res = await toggleCollect({ coupon_id: this.config.id })
      if (res.code == 1) this.isCollect = !this.isCollect;
      this.$toast(res.msg);
    },
    // 获取模板id
    async getWxMsgId() {
      const { open_mini_type, type} = this.config;
      if(type == 12) return this.$toast('优惠券已下架');
      if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
      this.$wxReportEvent("immediateexchange");
      // 半屏的模式不做授权及验证
      if (open_mini_type == 2) return this.exchange();
      let local_date = uni.getStorageSync("exchangeWxMsgId");
      let cur_date = parseTime(Date.now(), "{y}-{m}-{d}");
      this.redeemClickLoading = true;
      // 今日授权过一次就不在授权
      if (local_date && cur_date == local_date) return this.exchange();
      const res = await wxmsgid();
      const accuentIds = res.data[2];
      if (accuentIds) {
        uni.requestSubscribeMessage({
          tmplIds: [accuentIds],
          complete: (event) => {
            const resultState = event[accuentIds];
            if (resultState == "accept") {
              this.isPowerStatus = 1;
            } else {
              this.isPowerStatus = 0;
            }
            uni.setStorageSync("exchangeWxMsgId", cur_date);
            this.exchange();
          },
        });
        return;
      }
      this.exchange();
    },
    sphError(err) { },
    openSph() {
      if (this.config.video_account_id && wx.openChannelsActivity) {
        wx.openChannelsActivity({
          finderUserName: this.config.video_id,
          feedId: this.config.video_account_id,
        });
      }
    },
    getPhoneNumber(event) {
      if (event.detail.errMsg !== "getPhoneNumber:ok") return this.getWxMsgId();
      // 获得手机号
      const phoneCode = event.detail.code;
      if (!phoneCode) return this.$toast('微信版本过低，无法获取手机号');
      this.updateUserNew({ code: phoneCode }).then((res) =>  this.getWxMsgId());
    },
  },
};
</script>
<style lang="scss">
@import url("@/components/u-parse/u-parse.css");
page {
  background-color: #f7f7f7;
  overflow: hidden;
}
.coupon-details {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  padding-bottom: 196rpx;
}
.content_box {
  height: 100%;
  overflow: scroll;
  background: #f7f7f7;
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
.nav-left {
  position: absolute;
  left: 10rpx;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
}
.nav-left-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333333;
  margin-left: 12rpx;
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

.price-desc {
  margin: 0 24rpx 40rpx;
  padding: 32rpx 24rpx;
  background-color: #ffffff;
  border-radius: 12px;
  margin-bottom: calc(
    140rpx + var(--padding) + constant(safe-area-inset-bottom)
  ); /* 兼容 IOS<11.2 */
  margin-bottom: calc(
    140rpx + var(--padding) + env(safe-area-inset-bottom)
  ); /* 兼容 IOS>11.2 */
}

.price-desc-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #333333;
}

.price-desc-title::after {
  content: "*";
  color: #ef2b20;
  font-size: 30rpx;
  font-weight: bold;
}

.price-desc-info {
  font-size: 26rpx;
  font-weight: 400;
  color: #666666;
  margin-top: 16rpx;
}

.price-desc-tips {
  font-size: 24rpx;
  font-family: PingFang SC, PingFang SC-5;
  font-weight: 400;
  text-align: left;
  color: #999999;
  background-color: #f7f8fa;
  border-radius: 8px;
  padding: 16rpx 15rpx;
  margin-top: 24rpx;
}

.bottom-tools-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  .remind_box {
    padding: 0 40rpx;
    height: 68rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 0;
    font-size: 26rpx;
    color: #f84842;
    line-height: 36rpx;
    .remind_left {
      display: flex;
      align-items: center;
      .left_icon {
        width: 36rpx;
        height: 36rpx;
        margin-right: 10rpx;
      }
    }
    .remind_right {
      font-weight: 600;
    }
  }
}

.bottom-tools {
  width: 100%;
  background-color: #ffffff;
  padding: 32rpx 32rpx 0;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  position: relative;
  border-top: 2rpx solid #e9e9e9;
}

.collection-btn {
  width: 246rpx;
  height: 88rpx;
  border: 2rpx solid #d9d9d9;
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-family: PingFang SC, PingFang SC-5;
  font-weight: 400;
  color: #333333;
}

.collect {
  background-color: #ffc654;
  color: #ffffff;
  border-color: transparent;
}

.collection-btn-icon {
  width: 36rpx;
  height: 34rpx;
  margin-right: 4rpx;
}
.get-phone {
  width: 408rpx;
  height: 88rpx;
  position: absolute;
  right: 32rpx;
  top: 32rpx;
  z-index: 1;
  opacity: 0;
}
.redeem-now {
  width: 408rpx;
  height: 88rpx;
  padding: 0 40rpx;
  box-sizing: border-box;
  background: #f84842;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  color: #ffffff;
  &.redeem-no_active {
    background: #fba3a0;
  }
  &.vip_active{
    background: #333333;
    .coupon_vip {
        width: 136rpx;
        height: 46rpx;
        position: absolute;
        right: 0;
        top: -16rpx;
    }
  }
  .redeem-now-txt {
    flex: 1;
    text-align: center;
  }
}
.redeem-now-left {
  display: flex;
  align-items: baseline;
}
.icon_middle {
  width: 2rpx;
  height: 20rpx;
  background: #ffffff;
  border-radius: 2rpx;
}

.rnl-value {
  font-size: 40rpx;
  font-family: PingFang SC, PingFang SC-6;
  font-weight: 600;
  text-align: left;
}

.rnl-label {
  font-size: 24rpx;
  font-weight: 500;
  font-family: PingFang SC, PingFang SC-6;
}

.redeem-now-right {
  font-size: 28rpx;
  font-family: PingFang SC, PingFang SC-6;
  font-weight: 600;
  color: #ffffff;
}

.no-inventory {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 196rpx;
  box-sizing: border-box;
  background: rgba(51, 51, 51, 0.95);
  font-size: 32rpx;
  font-family: PingFang SC, PingFang SC-5;
  font-weight: 400;
  color: #ffffff;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: constant(safe-area-inset-bottom); /* 兼容 IOS<11.2 */
  padding-bottom: env(safe-area-inset-bottom); /* 兼容 IOS>11.2 */
  .no-inventory_icon {
    width: 56rpx;
    height: 20rpx;
    margin-left: 12rpx;
  }
}

.rbr-xs-icon {
  width: 74rpx;
  height: 30rpx;
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(8rpx, -8rpx);
}

.van-submit-bar__safe {
  padding-bottom: 32rpx;
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
  background-color: #ffffff;
  box-sizing: border-box;
}

.sph-box {
  width: 100%;
  font-size: 0;
  .sph-item {
    width: 100%;
  }
}

.share-btn {
  position: fixed;
  right: 20px;
  background-color: unset;
  width: 32px;
  height: 32px;
  padding: 0;
  line-height: unset;
  z-index: 10;
}
.back_btn {
  position: fixed;
  right: 20px;
  background-color: unset;
  width: 64rpx;
  height: 64rpx;
  padding: 0;
  line-height: unset;
  z-index: 10;
  .back_btn-icon {
    width: 100%;
    height: 100%;
  }
}

.share-btn::after {
  border: none;
}
.filter_bg {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  z-index: -1;
  filter: blur(16px) contrast(0.8);
  // filter: blur(16px);
}
</style>
