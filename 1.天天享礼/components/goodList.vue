<template>
<view class="good-list">
    <!-- loading模块 -->
    <block v-if="!list.length">
      <view class="loading_item" :style="{ '--height': '576rpx'}"
        v-for="(item, idx) in loadingLength" :key="idx"
      >
        <view class="loading_img"></view>
        <view class="good_cont">
          <view class="good_name_box"></view>
          <view class="use_cont"></view>
          <view class="good_remind"></view>
        </view>
      </view>
    </block>
    <view :style="{ '--height': (!isShowProfitBtn) ? '576rpx' : '656rpx'}"
      v-for="(good, index) in list" :key="index"
      :class="[
        (isSearchJdModel || isJdCenter) ? 'autoHeight' : '',
        good.type == 9 ? 'swiper_list' : 'good-list-item',
        good.is_light && !isAlreadyShowLight ? 'lightShow' : ''
      ]"
      :data-id="good.id || good.groupId"
    >
    <!-- good.type == 9:是单横排的使用 -->
      <image class="light_head anima_head" mode="scaleToFill"
        v-if="good.is_light && !isAlreadyShowLight"
        src="https://file.y1b.cn/store/1-0/231123/655f26327de6e.png"></image>
      <!-- 没有牛金豆的京东商品配置呈现 -->
      <notCreditsList
        ref="notCreditsList"
        :title="good.title"
        :jdList="good.jdList"
        :positionId="good.positionId"
        v-if="good.type == 9"
      ></notCreditsList>
      <block v-else>
        <!-- 视频组件 -->
        <channelVideo :good="good" v-if="good.type == 7" class="item_cont"></channelVideo>
        <!-- 内容重新 -->
        <view class="item_cont" v-else
          @click.native.stop="goDetails(good, { listIndex: index })">
          <!-- 是否展示广告位 - 直接覆盖到整个 -->
          <image class="is_banner_img" v-if="isShowBanner && good.is_banner" :src="bannerImg(good)"></image>
          <block v-if="(isSearchJdModel || isJdCenter) || !(isShowBanner && good.is_banner)">
          <showImg :good="good" :isSwiper="isSwiper" :index="index"></showImg>
          <slot name="cont" v-if="isSlot"></slot>
          <!-- 搜索模块 -->
          <view class="good_cont js_search_box" v-else-if="isSearchJdModel">
              <view class="good_name_box txt_ov_ell2">
                <view class="ty_store" v-if="good.type == 12"></view><!-- 到店吃 -->
                <view class="jd_icon_box" v-else-if="good.lx_type != 1 && parseInt(good.face_value)">
                  抵¥{{ parseInt(good.face_value) || 0 }}券
                </view>
                <view class="show_type" v-if="userInfo.show_shopType && (good.lx_type > 1)">
                  {{ (good.lx_type == 2) ? '京东' : '拼多多' }}
                </view>
                {{ good.title }}
              </view>
              <view class="use_cont">
                <view class="use_cont-left" v-if="good.after_pay"></view>
                <view class="use_cont-right" v-if="good.zero_credits">免豆特权</view>
                <view v-else-if="good.lx_type != 1" class="js_search_credits">
                  {{ good.credits || 0 }}牛金豆
                </view>
              </view>
              <!-- 乐刷的商品 -->
              <view class="good_remind txt_ov_ell1" v-if="good.lx_type == 1">
                  <text :class="['good_remind-left', good.zero_credits ? 'vip_line' : '' ]"
                    v-if="good.credits"
                  >
                    <text class="good_credits">{{ good.credits || 0 }}</text>
                    <text>牛金豆</text>
                  </text>
                  <text class="good_total2">{{ Number(good.exch_user_num) + Number(good.user_num) }}人兑换</text>
              </view>
              <view class="good_remind txt_ov_ell1" v-else>
                <text v-if="parseInt(good.face_value)">券后</text>
                <text class="good_credits">
                    <text style="font-size: 24rpx">￥</text>
                    {{ good.lowestCouponPrice || 0 }}
                </text>
                <text class="good_total" v-if="good.inOrderCount30Days" >月售{{ good.inOrderCount30Days }}</text>
                <text class="good_total" v-if="good.sales_tip">已售{{ good.sales_tip }}</text>
              </view>
          </view>
          <!-- 其他猜你喜欢模块 -->
          <view class="good_cont js_box" v-else-if="isJdModel">
            <view class="good_name_box txt_ov_ell2">
              <view class="jd_icon_box" v-if="parseInt(good.face_value)">
                抵¥{{ parseInt(good.face_value) || 0 }}券
              </view>
              <view class="show_type" v-if="userInfo.show_shopType && (good.lx_type > 1)">
                {{ (good.lx_type == 2) ? '京东' : '拼多多' }}
              </view>
              {{ good.title }}
            </view>
            <view class="use_cont">
              <view class="use_cont-left" v-if="good.after_pay"></view>
              <view class="use_cont-right" v-if="good.zero_credits">免豆特权</view>
            </view>
            <view class="good_remind txt_ov_ell1">
              <text :class="['good_remind-left', good.zero_credits ? 'vip_line' : '']"
                v-if="good.credits">
                  <text class="good_credits">{{ good.credits || 0 }}</text>
                  <text>牛金豆</text>
              </text>
              <text class="good_total2" v-if="good.inOrderCount30Days">月售{{ good.inOrderCount30Days }}</text>
              <text class="good_total2" v-if="good.sales_tip">已售{{ good.sales_tip }}</text>
            </view>
          </view>
          <!-- 专属中心的模块 -->
          <view class="good_cont js_center" v-else-if="isJdCenter">
              <view class="good_name_box txt_ov_ell2">
                <view class="ty_store" v-if="good.type == 12"></view><!-- 到店吃 -->
                <view class="jd_icon_box" v-else-if="good.lx_type != 1 && parseInt(good.face_value)">
                  抵¥{{ parseInt(good.face_value) || 0 }}券
                </view>
                <view class="show_type" v-if="userInfo.show_shopType && (good.lx_type > 1)">
                  {{ (good.lx_type == 2) ? '京东' : '拼多多' }}
                </view>
                {{ good.title }}
              </view>
              <view class="use_cont">
                <view class="use_cont-left" v-if="good.after_pay"></view>
                <view v-if="show_lowestCouponPrice && good.credits && good.lowestCouponPrice" class="js_search_credits">
                  {{ good.credits || 0 }}牛金豆
                </view>
                <view class="use_cont-right" v-else-if="good.zero_credits">免豆特权</view>
              </view>
              <view class="good_remind txt_ov_ell1">
                <block v-if="show_lowestCouponPrice && good.lowestCouponPrice">
                  <text v-if="parseInt(good.face_value)">券后</text>
                  <text class="good_credits" style="margin-right: 8rpx;">
                      <text style="font-size: 24rpx">￥</text>
                      {{ good.lowestCouponPrice || 0 }}
                  </text>
                </block>
                <text class="good_remind-left" v-else-if="good.credits">
                  <text :class="['good_credits', good.zero_credits ? 'active' : '']">{{ good.credits || 0 }}</text>
                  <text>牛金豆</text>
                </text>
                <text class="good_total2" v-if="good.inOrderCount30Days">月售{{ good.inOrderCount30Days }}</text>
                <text class="good_total2" v-if="good.sales_tip">已售{{ good.sales_tip }}</text>
              </view>
              <view class="jd_face_value" v-if="parseInt(good.face_value) && !isShowProfitBtn">
                使用{{parseInt(good.face_value) || 0}}元券购买
              </view>
          </view>
          <!-- 首页呈现 -->
          <view class="good_cont home_cont" v-else>
            <view class="good-name txt_ov_ell2">
              <view class="ty_store" v-if="good.type == 12"></view><!-- 到店吃 -->
              <view class="jd_icon_box" v-else-if="good.lx_type != 1 && parseInt(good.face_value)">
                抵¥{{ parseInt(good.face_value) || 0 }}券
              </view>
              <view class="show_type" v-if="userInfo.show_shopType&& (good.lx_type > 1)">
              {{ (good.lx_type == 2) ? '京东' : '拼多多' }}
              </view>
              {{ good.title }}
            </view>
            <view class="use_cont hide_time" v-if="good.hide_time">
              <!-- <view >{{ good.diffTime }}</view> -->
              <view class="hide_text" v-if="good.isFinishDiffTime"> 活动已结束 </view>
              <van-count-down use-slot millisecond :time="good.diffTime" @change="onChangeHandle($event, index)" @finish="finishHandle(index)" class="hide_text" v-else>
                <!-- <text class="item" style="margin-right: 4rpx;">{{ good.timeData.days }}天</text> -->
                 <view class="item_box">
                    <text class="item">{{ good.timeData.hours }}</text>:
                    <text class="item">{{ good.timeData.minutes }}</text>:
                    <text class="item">{{ good.timeData.seconds }}</text>.
                    <text class="item">{{ good.timeData.milliseconds }}</text>
                 </view>
              </van-count-down>
            </view>
            <view class="use_cont" v-else>
              <view class="use_cont-left" v-if="good.after_pay"></view>
              <view class="use_cont-right" v-if="good.zero_credits">免豆特权</view>
            </view>
            <view class="good_remind txt_ov_ell1">
              <text class="good_remind-left" v-if="good.credits || ( good.lx_type == 1 && !good.credits)">
                <text :class="['good_credits', good.zero_credits ? 'active' : '']">{{ good.credits || 0 }}</text>牛金豆
              </text>
              <text class="good_remind-price" v-else> {{ good.price || 0 }}</text>
              <!-- 首页呈现兑换人数 / 其他的呈现月售 -->
              <text class="good_total2" v-if="isHome">{{ Number(good.exch_user_num) + Number(good.user_num) }}人兑换</text>
              <block v-else>
                <text class="good_total2" v-if="good.inOrderCount30Days">月售{{ good.inOrderCount30Days }}</text>
                <text class="good_total" v-if="good.sales_tip">已售{{ good.sales_tip }}</text>
              </block>
            </view>
          </view>
          <view class="vip_btn fl_center" v-if="isShowProfitBtn">
            <block v-if="good.vip_profit || showProfitBtnTxt">
              会员再返<text class="vip_btn-price">{{ showProfitBtnTxt || good.vip_profit }}</text>
            </block>
            <block v-else>
              立即查看
              <van-icon name="arrow" color="#fff" size="26rpx" custom-style=""/>
            </block>
          </view>
          </block>
        </view>
      </block>
    </view>
</view>
</template>
<script>
import { toggleCollect } from "@/api/modules/jsShop.js";
import channelVideo from '@/components/goodList/channelVideo.vue';
import showImg from '@/components/goodList/showImg.vue';
import { getImgUrl } from "@/utils/auth.js";
import goDetailsFun from "@/utils/goDetailsFun";
import { mapGetters } from "vuex";
import notCreditsList from "./notCreditsList.vue";
export default {
  mixins: [goDetailsFun],
  components: {
    notCreditsList,
    channelVideo,
    showImg
  },
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    loadingLength: {
      type: [Number, String],
      default: 6
    },
    navTop: {
      type: Number,
      default: 0,
    },
    categoryIndex: {
      type: Number,
      default: 0,
    },
    isJdModel: {
      type: Boolean,
      default: false,
    },
    // 领券中心
    isJdCenter: {
      type: Boolean,
      default: false,
    },
    // 搜索商品
    isSearchJdModel: {
      type: Boolean,
      default: false,
    },
    isBolCredits: {
      type: Boolean,
      default: false,
    },
    isJdLink: {
      type: Boolean,
      default: false,
    },
    isShowBanner: {
      type: Boolean,
      default: false,
    },
    // 是否展示轮播
    isSwiper: {
      type: Boolean,
      default: false
    },
    isSlot: {
      type: Boolean,
      default:false
    },
    // 是否首页
    isHome: {
      type: Boolean,
      default:false
    },
    // vip展示返现的使用
    isShowProfit: {
      type: Boolean,
      default: false
    },
    showProfitBtnTxt: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      pageHeight: 0,
      imgUrl: getImgUrl(),
    };
  },
  computed: {
    ...mapGetters([ "userInfo", 'isAlreadyShowLight', 'show_lowestCouponPrice']),
    isShowProfitBtn () {
      return (this.isShowProfit && this.userInfo.is_vip) || this.showProfitBtnTxt;
    }
  },
  methods: {
    bannerImg(item) {
      const { image, image2 } = item;
      let banner_image = image;
      if(this.userInfo.is_vip && image2) banner_image = image2;
      return banner_image;
    },
    onChangeHandle(event, index) {
      // this.list[index].isFinishDiffTime = true;
      // return;
      let {
        hours,
        minutes,
        seconds,
        milliseconds,
        days
      } = event.detail;
      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      milliseconds = Math.floor(milliseconds / 100);
      this.list[index].timeData = {
        hours,
        minutes,
        seconds,
        milliseconds,
        days
      }
      // console.log('this.list', this.list)
      // console.log('this.list[index].timeData', this.list[index].timeData)
    },
    finishHandle(index) {
      this.list[index].isFinishDiffTime = true;
    },
    openSph(video_account_id, video_id) {
      if (video_account_id && wx.openChannelsActivity) {
        wx.openChannelsActivity({
          finderUserName: video_id,
          feedId: video_account_id,
          complete(res) { },
        });
      }
    },
    async goDetails(item, { listIndex }) {
      if(this.showProfitBtnTxt) {
        return this.$toast('开通会员，立享返现');
      }
      // 彬纷进入时 - 高亮商品的呈现样式
      if(item.is_light && !this.isAlreadyShowLight) this.$emit('setShowLight');
      const eventId = `coupongrouping_${this.categoryIndex + 1}_${listIndex + 1}`;
      this.$wxReportEvent(eventId);
      this.$emit("goodListClick");
      // 采用混合模式的事件
      this.detailsFun_mixins(
        {
          ...item,
          isJdLink: this.isJdLink
        },
        { listIndex },
        this.isBolCredits,
        this.isSearchJdModel
      );
    },
    collectHandle(skuId, index) {
      toggleCollect({ skuId }).then((res) => {
        this.list[index].collect = !this.list[index].collect;
        uni.showToast({
          icon: "none",
          title: res.msg,
          duration: 3000,
        });
      });
    },
    strLength(str, num = 10) {
      let realLength = 0,
        len = str.length,
        charCode = -1,
        spliceStr = "";
      for (let i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
        spliceStr += str[i];
        if (realLength >= num) return spliceStr;
      }
      return spliceStr;
    },
    shareHandle() {},
  },
};
</script>
<style lang="scss">
.loading_item {
  width: 352rpx;
  height: var(--height);
  border-radius: 8px;
  margin-right: 14rpx;
  margin-bottom: 16rpx;
  background: #fff;
  overflow: hidden;
  .loading_img {
    width: 352rpx;
    height: 352rpx;
    font-size: 0;
    background: linear-gradient(270deg,#f6f8fb 80%, #eaeef6);
    animation: backAni 1s infinite;
  }
  .good_name_box,
  .use_cont,
  .good_remind {
    background: linear-gradient(270deg,#f6f8fb 80%, #eaeef6);
    animation: backAni 1s infinite;
  }
  .good_remind {
    height: 36rpx;
    margin-top: 18rpx;
  }
}
.good-list {
  position: relative;
  overflow: hidden;
  padding: 16rpx 0 16rpx 16rpx;
  display: flex;
  flex-wrap: wrap;
  .good-list-item {
    width: 352rpx;
    height: var(--height);
    background-color: #ffffff;
    border-radius: 8px;
    margin-bottom: 16rpx;
    margin-right: 14rpx;
    &.autoHeight {
      height: auto;
    }
    .item_cont {
      position: relative;
      width: 100%;
      height: 100%;
      z-index: 0;
    }
    .is_banner_img {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 1;
      border-radius: 8px;
    }
  }
  .swiper_list {
    width: 718rpx;
  }
  .total {
    font-size: 20rpx;
    font-weight: 400;
    text-align: right;
    color: #999;
  }

  .special {
    font-size: 20rpx;
    font-weight: 400;
    color: #f97f02;
  }
  .good_cont {
    padding: 20rpx 20rpx 24rpx;
    .good_name_box {
      font-size: 28rpx;
      color: #333;
      line-height: 40rpx;
      height: 80rpx;
    }
    .good-name {
      color: #333;
      font-size: 28rpx;
      line-height: 40rpx;
      height: 80rpx;
    }
    .good_remind {
      font-size: 26rpx;
      color: #e7331b;
      line-height: 36rpx;
      white-space: nowrap;
      width: 100%;
      .good_credits {
        font-size: 36rpx;
        margin-right: 4rpx;
        font-weight: bold;
        position: relative;
        &.active::before {
          content: '\3000';
          position: absolute;
          width: 110%;
          height: 4rpx;
          background: currentColor;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) rotate(0deg);
        }
      }
      .vip_line{
        text-decoration:  line-through;
        font-weight: bold;
        .good_credits {
         font-size: 26rpx;
        }
      }
      .good_total {
        font-size: 26rpx;
        color: #aaaaaa;
        line-height: 36rpx;
        margin-left: 13rpx;
      }
      .good_remind-left{
        margin-right: 13rpx;
      }
    }
  }
}
.home_cont {
  .good_remind {
    margin-top: 18rpx;
  }
}
.good_remind-price{
  font-size: 36rpx;
  font-weight: 600;
  text-align: center;
  color: #e7331b;
  // line-height: 48rpx;
  margin-right: 13rpx;
  &::before {
    content: '￥';
    font-size: 24rpx;
  }
}
.jd_icon_box {
  padding: 0 10rpx 0 20rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: #ffffff;
  line-height: 34rpx;
  position: relative;
  z-index: 0;
  margin-right: 8rpx;
  white-space: nowrap;
  display: inline;
  &::before {
    content: "\3000";
    background: url("https://file.y1b.cn/store/1-0/24621/6675210e27253.png") 0 0 / 100% 100% no-repeat;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
}
.show_type {
  padding: 0 4rpx;
  height: 34rpx;
  background: #f8cc82;
  border-radius: 6rpx;
  font-size: 24rpx;
  color: #7f4715;
  line-height: 34rpx;
  font-weight: bold;
  display: inline;
  margin-right: 8rpx;
}

.ty_store {
  width: 118rpx;
  height: 34rpx;
  background: url("https://test-file.y1b.cn/store/1-0/24412/6619090ba6bf5.png") 0 0 / 100% 100% no-repeat;
  margin-right: 8rpx;
  transform: translateY(8rpx);
  display: inline-block;
}

.vip_cont{
  font-size: 24rpx;
  color: #e7331b;
  line-height: 34rpx;
  margin-top: 18rpx;
  .good_total2 {
    margin-left: 10rpx;
  }
}
.good_total2 {
  font-size: 26rpx;
  color: #aaa;
  line-height: 36rpx;
}
.vip_icon {
  width: 136rpx;
  height: 38rpx;
  margin-right: -16rpx;
}
.vip_icon-xs {
  width: 134rpx;
  height: 32rpx;
}
.sph-item {
  width: 344rpx;
  height: 344rpx;
}
.bottom-tools {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #999;
  .collection-btn {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-top: 28rpx;
    line-height: 34rpx;
    &:first-child {
      &::after {
        content: "\3000";
        position: absolute;
        width: 2rpx;
        height: 22rpx;
        background: #e9e9e9;
        top: 50%;
        transform: translateY(-50%);
        right: -1rpx;
      }
    }
    .share_btn {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
    .collection-btn-icon {
      width: 28rpx;
      height: 28rpx;
    }
    .start_btn-icon {
      width: 26rpx;
      height: 26rpx;
      margin: -4rpx 2rpx 0 0;
    }
  }
}
.js_search_box {
  .good_remind {
    margin-top: 12rpx;
    line-height: 48rpx;
  }
  .good_credits {
    margin-left: 8rpx;
  }
}
.js_search_credits {
  font-size: 26rpx;
  text-align: center;
  color: #f97f02;
  line-height: 36rpx;
  display: flex;
  align-items: center;
  &::before {
    content: "\3000";
    background: url("https://file.y1b.cn/public/img/ttxl/static/shopMall/js_search_icon.png") 0 0 / cover no-repeat;
    width: 30rpx;
    height: 30rpx;
    margin-right: 4rpx;
    display: inline-block;
  }
}

.js_box {
  .good_remind {
    margin-top: 18rpx;
  }
}
// 领券中心
.js_center {
  .good_remind {
    margin-top: 20rpx;
  }
  .jd_face_value{
    width: 320rpx;
    height: 64rpx;
    font-size: 28rpx;
    text-align: center;
    color: #fff;
    line-height: 64rpx;
    position: relative;
    z-index: 0;
    margin-top: 20rpx;
    &::before {
      content: "\3000";
      background: url("https://file.y1b.cn/store/1-0/23128/65727b6f2fbdf.png") 0 0 / 100% 100% no-repeat;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
  }
  .vip_cont{
    .good_total2{
      margin-left: 13rpx;
    }
  }
}
.lightShow {
  position: relative;
  z-index: 9;
  &::before {
    content: '\3000';
    position: absolute;
    z-index: -1;
    top: -8rpx;
    left: -8rpx;
    width: 100%;
    height: 100%;
    border: 8rpx solid rgba(255,255,255,0.24);
    border-radius: 20rpx;
  }
  .light_head{
    position: absolute;
    width: 102rpx;
    height: 100rpx;
    bottom: -50rpx;
    right: -50rpx;
  }
}
.use_cont {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  height: 34rpx;
  margin-top: 10rpx;
  vertical-align: middle;
  &.hide_time {
    position: relative;
    font-size: 24rpx;
    text-align: right;
    justify-content: flex-end;
    .hide_text {
      min-width: 160rpx;
      text-align: center;
      display: inline-block;
      text-align: center;
    }
    .item_box {
      font-size: 24rpx;
      color: #F84842;
    }
    .item {
      display: inline-block;
      min-width: 34rpx;
      text-align: center
    }
    &::before {
      content: "\3000";
      z-index: -1;
      position: absolute;
      top: -2rpx;
      left: 0;
      width: 100%;
      height: 36rpx;
      background: url("https://file.y1b.cn/store/1-0/24712/6690fe445802d.png")  0 0 / 100% 100% no-repeat;
    }
  }
  .use_cont-left {
    height: 34rpx;
    width: 143rpx;
    background: url("https://file.y1b.cn/store/1-0/24629/667f84504856c.png")  0 0 / 100% 100% no-repeat;
    margin-right: 18rpx;
    position: relative;
  }
  .use_cont-right {
    color: #999;
    position: relative;
    // padding-left: 32rpx;
    // &::before {
    //   content: "\3000";
    //   position: absolute;
    //   top: 4rpx;
    //   left: 0;
    //   width: 26rpx;
    //   height: 26rpx;
    //   background: url("https://test-file.y1b.cn/store/1-0/24312/65f024b3cdd36.png")  0 0 / 100% 100% no-repeat;
    // }
  }
}
@keyframes backAni {
  0% {
    background: linear-gradient(270deg,#f6f8fb 80%, #eaeef6);
  }
  50% {
    background: linear-gradient(270deg,#f6f8fb 60%, #eaeef6);
  }
  100% {
    background: linear-gradient(270deg,#f6f8fb 30%, #eaeef6);
  }
}
.vip_btn {
  margin: 0 16rpx 16rpx;
  text-align: center;
  height: 64rpx;
  position: relative;
  z-index: 0;
  font-size: 28rpx;
  color: #fff;
  &::before {
    content: "\3000";
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("https://file.y1b.cn/store/1-0/24629/667fc7806131f.png")  0 0 / 100% 100% no-repeat;
  }
  &-price {
    font-size: 30rpx;
    margin-left: 8rpx;
    &::before {
      content: '¥';
      font-size: 22rpx;
    }
  }
}
</style>
