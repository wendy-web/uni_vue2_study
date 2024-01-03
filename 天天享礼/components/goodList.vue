<template>
<view class="good-list">
    <view
      :style="{
        '--height': userInfo.is_vip ? '605rpx' : '546rpx'
      }"
      v-for="(good, index) in list" :key="index"
      :class="[
        (isSearchJdModel || isJdCenter)? 'autoHeight' : '',
        good.type == 9 ? 'swiper_list' : 'good-list-item',
        good.is_light && !isAlreadyShowLight ? 'lightShow' : ''
      ]"
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
          @click.native.stop="goDetails(good, { listIndex: index })"
        >
          <!-- 是否展示广告位 - 直接覆盖到整个 -->
          <image class="is_banner_img" v-if="isShowBanner && good.is_banner" :src="good.image"></image>
          <showImg :good="good" :isSwiper="isSwiper" :index="index"></showImg>
          <slot name="cont" v-if="isSlot"></slot>
          <!-- 搜索模块 -->
          <view class="good_cont js_search_box" v-else-if="isSearchJdModel">
              <view class="good_name_box txt_ov_ell2">
                <view class="jd_icon_box" v-if="good.lx_type != 1 && parseInt(good.face_value)">
                  抵¥{{ parseInt(good.face_value) || 0 }}券
                </view>
                {{ good.title }}
              </view>
              <view :class="['js_search_credits', good.lx_type != 1 ? 'opacity_active' : 'opacity_non']"
                v-if="!userInfo.is_vip">{{ good.credits || 0 }}
              牛金豆</view>
              <!-- 乐刷的商品 -->
              <view class="good_remind txt_ov_ell1" v-if="good.lx_type == 1">
                  <text :class="['good_remind-left' ,userInfo.is_vip ? 'vip_line' : '' ]"
                    v-if="(userInfo.is_vip && good.credits) || !userInfo.is_vip"
                  >
                    <text class="good_credits">{{ good.credits || 0 }}</text>
                    <text>牛金豆</text>
                  </text>
                  <text class="good_total2">{{ Number(good.exch_user_num) + Number(good.user_num) }}人兑换</text>
              </view>
              <view class="good_remind txt_ov_ell1" v-else>
                  <text>券后</text>
                  <text class="good_credits">
                      <text style="font-size: 24rpx">￥</text>
                      {{ good.lowestCouponPrice || 0 }}
                  </text>
                  <text class="good_total" v-if="good.inOrderCount30Days" >月售{{ good.inOrderCount30Days }}</text>
                  <text class="good_total" v-if="good.sales_tip">已售{{ good.sales_tip }}</text>
              </view>
              <block v-if="userInfo.is_vip">
                <view class="vip_cont fl_bet" v-if="good.lx_type == 1">
                  <view><text style="font-size: 36rpx;margin-right: 4rpx;">0</text>豆特权</view>
                </view>
                <view class="vip_cont-box" v-else>{{ good.credits || 0 }}牛金豆</view>
              </block>
          </view>
          <!-- 其他猜你喜欢模块 -->
          <view class="good_cont js_box" v-else-if="isJdModel">
              <view class="good_name_box txt_ov_ell2">
                  <view class="jd_icon_box" v-if="parseInt(good.face_value)">
                    抵¥{{ parseInt(good.face_value) || 0 }}券
                  </view>
                  {{ good.title }}
              </view>
              <view class="good_remind txt_ov_ell1">
                  <text :class="['good_remind-left', userInfo.is_vip ? 'vip_line' : '']"
                    v-if="good.credits">
                      <text class="good_credits">{{ good.credits || 0 }}</text>
                      <text>牛金豆</text>
                  </text>
                  <text class="good_total2" v-if="good.inOrderCount30Days">月售{{ good.inOrderCount30Days }}</text>
                  <text class="good_total2" v-if="good.sales_tip">已售{{ good.sales_tip }}</text>
              </view>
              <view class="vip_cont fl_bet" v-if="userInfo.is_vip">
                  <view><text style="font-size: 36rpx;margin-right: 4rpx;">0</text>豆特权</view>
              </view>
          </view>
          <!-- 专属中心的模块 -->
          <view class="good_cont js_center" v-else-if="isJdCenter">
              <view class="good_name_box txt_ov_ell2"> {{ good.title }}</view>
              <view class="vip_credits" v-if="userInfo.is_vip">{{ good.credits || 0 }}牛金豆</view>
              <view class="good_remind txt_ov_ell1" v-if="!userInfo.is_vip">
                <text class="good_remind-left" v-if="good.credits">
                    <text class="good_credits">{{ good.credits || 0 }}</text>
                    <text>牛金豆</text>
                </text>
                <text class="good_total2" v-if="good.inOrderCount30Days">月售{{ good.inOrderCount30Days }}</text>
                <text class="good_total2" v-if="good.sales_tip">已售{{ good.sales_tip }}</text>
              </view>
              <view class="vip_cont box_fl" v-else>
                <view><text style="font-size: 36rpx;margin-right: 4rpx;">0</text>豆特权</view>
                <text class="good_total2" v-if="good.inOrderCount30Days">月售{{ good.inOrderCount30Days }}</text>
                <text class="good_total2" v-if="good.sales_tip">已售{{ good.sales_tip }}</text>
              </view>
              <view class="jd_face_value" v-if="parseInt(good.face_value)">领{{parseInt(good.face_value) || 0}}元券</view>
          </view>
          <!-- 首页呈现 -->
          <view class="good_cont" v-else>
            <view class="good-name txt_ov_ell2">
                <view class="jd_icon_box" v-if="good.lx_type != 1 && parseInt(good.face_value)">
                  抵¥{{ parseInt(good.face_value) || 0 }}券
                </view>
                {{ good.title }}
            </view>
            <!-- 省钱卡会员 -->
            <block v-if="userInfo.is_vip">
              <view class="vip_credits" v-if="good.credits">{{ good.credits || 0 }}牛金豆</view>
              <block v-else>
                <view class="vip_credits0" v-if="good.lx_type == 1"></view>
                <view class="good_remind txt_ov_ell1" v-else>
                  <text class="good_remind-price"> {{ good.price || 0 }}</text>
                  <!-- <text class="good_total2" v-if="good.inOrderCount30Days">月售{{ good.inOrderCount30Days }}</text> -->
                </view>
              </block>
              <view class="vip_cont box_fl noAfter">
                <view><text style="font-size: 36rpx;margin-right: 4rpx;">0</text>豆特权</view>
                <!-- 首页呈现兑换人数 / 其他的呈现月售 -->
                <text class="good_total2" v-if="isHome" >{{ Number(good.exch_user_num) + Number(good.user_num) }}人兑换</text>
                <text class="good_total2" v-else-if="good.inOrderCount30Days">月售{{ good.inOrderCount30Days }}</text>
              </view>
            </block>
            <!-- 非省钱卡 -->
            <view class="good_remind txt_ov_ell1" v-else>
              <text class="good_remind-left">
                <text class="good_credits">{{ good.credits || 0 }}</text>
                <text>牛金豆</text>
              </text>
              <!-- 首页呈现兑换人数 / 其他的呈现月售 -->
              <text class="good_total2" v-if="isHome">{{ Number(good.exch_user_num) + Number(good.user_num) }}人兑换</text>
              <text class="good_total2" v-else-if="good.inOrderCount30Days">月售{{ good.inOrderCount30Days }}</text>
            </view>
          </view>
        </view>
      </block>
    </view>
</view>
</template>
<script>
import { toggleCollect } from "@/api/modules/jsShop.js";
import { getImgUrl } from "@/utils/auth.js";
import goDetailsFun from "@/utils/goDetailsFun";
import { mapGetters } from "vuex";
import notCreditsList from "./notCreditsList.vue";
import channelVideo from '@/components/goodList/channelVideo.vue';
import showImg from '@/components/goodList/showImg.vue';
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
    }
  },
  data() {
    return {
      pageHeight: 0,
      imgUrl: getImgUrl(),
    };
  },
  computed: {
    ...mapGetters([ "userInfo", 'isAlreadyShowLight']),
  },
  methods: {
    openSph(video_account_id, video_id) {
      if (video_account_id && wx.openChannelsActivity) {
        wx.openChannelsActivity({
          finderUserName: video_id,
          feedId: video_account_id,
          complete(res) {
            console.log(res);
          },
        });
      }
    },
    async goDetails(item, { listIndex }) {
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
        this.list,
        this.isBolCredits
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
    shareHandle() {
      console.log("分享 :>> 防止事件冒泡");
    },
  },
};
</script>
<style lang="scss">
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
    color: #999999;
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
      margin-bottom: 40rpx;
      line-height: 40rpx;
      height: 80rpx;
    }
    .good_remind {
      font-size: 26rpx;
      color: #e7331b;
      line-height: 36rpx;
      // display: flex;
      // align-items: flex-end;
      white-space: nowrap;
      width: 100%;
      .good_credits {
        font-size: 36rpx;
        // line-height: 48rpx;
        margin-right: 4rpx;
        font-weight: 500;
      }
      .vip_line{
        text-decoration:  line-through;
        .good_credits{
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
      .good_remind-price{
        font-size: 34rpx;
        font-weight: 600;
        text-align: center;
        color: #e7331b;
        line-height: 32rpx;
        margin-right: 13rpx;
        &::before {
          content: '￥';
          font-size: 24rpx;
        }
      }
    }
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
  display: inline-block;
  &::before {
    content: "\3000";
    background: url("https://file.y1b.cn/store/1-0/23810/64d44dc19f327.png") 0 0 / 100% 100% no-repeat;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
}

.vip_cont{
  font-size: 24rpx;
  color: #e7331b;
  line-height: 34rpx;
  margin-top: 18rpx;
  &.noAfter {
    &::after {
	    display: none;
    }
    .good_total2 {
      margin-left: 10rpx;
    }
  }
  &::after {
    content: "\3000";
    background: url("https://file.y1b.cn/store/1-0/231031/6540d03065d34.png") 0 0 / 100% 100% no-repeat;
    width: 136rpx;
    height: 38rpx;
    margin-right: -16rpx;
    display: inline-block;
  }
  &.vip_cont-xs {
    &::after {
      width: 134rpx;
      height: 32rpx;
      margin:0;
      background-image: url("https://file.y1b.cn/store/1-0/23119/654c56d866fbb.png");
    }
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
  // line-height: 34rpx;
  .collection-btn {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-top: 28rpx;
    line-height: 34rpx;
    &:first-child {
      // line-height: 26rpx;
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
  }
  .good_credits {
    margin-left: 8rpx;
  }
}
.vip_cont-box {
  position: relative;
  z-index: 0;
  height: 32rpx;
  font-size: 22rpx;
  text-decoration:  line-through;
  text-align: center;
  color: #c16e15;
  line-height: 32rpx;
  padding: 0 10rpx 0 126rpx;
  display: inline-block;
  margin-top: 6rpx;
  &::before {
    content: "\3000";
    background: url("https://file.y1b.cn/store/1-0/23118/654b6b29d20c3.png") 0 0 / 100% 100% no-repeat;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
}
.js_search_credits {
  font-size: 26rpx;
  text-align: center;
  color: #f97f02;
  line-height: 36rpx;
  display: flex;
  align-items: center;
  margin-top: 8rpx;
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
    margin-top: 28rpx;
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
    &::after {
      display: none;
    }
    .good_total2{
      margin-left: 13rpx;
    }
  }
}
.vip_credits0 {
  position: relative;
  z-index: 0;
  display: inline-block;
  width: 106rpx;
  height: 32rpx;
  line-height: 32rpx;
  &::before {
    content: "\3000";
    background: url("https://file.y1b.cn/store/1-0/231212/6577ce322713f.png") 0 0 / 100% 100% no-repeat;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
}
.vip_credits{
  font-size: 22rpx;
  text-decoration:  line-through;
  text-align: center;
  color: #c16e15;
  line-height: 32rpx;
  padding: 0 16rpx 0 122rpx;
  position: relative;
  z-index: 0;
  display: inline-block;
  &::before {
    content: "\3000";
    background: url("https://file.y1b.cn/store/1-0/23128/65727fb16a4d3.png") 0 0 / 100% 100% no-repeat;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
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

</style>
