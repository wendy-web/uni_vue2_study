<template>
<view class="user nav_cont" :class="{'active' : userInfo.is_vip}">
  <xh-navbar
    navbarImageMode="widthFix"
    :overFlow="true"
    :fixedNum="9"
    titleAlign="titleRight"
    navberColor="#F8EDE3"
  >
    <view slot="title" class="nav-custom">
      <image class="title_icon"
        src="https://file.y1b.cn/store/1-0/2368/648173c3f15cf.png"
        mode="aspectFill"
      ></image>
    </view>
  </xh-navbar>
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
    <view class="user-info" @click="goPages('/pages/userInfo/personalInfo/index')">
      <view class="user-avatar">
        <!-- 头像 -->
        <van-image
          class="avatar-icon"
          height="112rpx"
          width="112rpx"
          radius="50%"
          :src="userInfo.avatar_url || default_avatar"
          use-loading-slot
        ><van-loading slot="loading" type="spinner" size="20" vertical />
        </van-image>
      </view>
      <view v-if="isAutoLogin" class="fl1">
        <view :class="['nick-name', userInfo.is_vip ? 'active' : '']">
          {{ userInfo.nick_name || "未登录" }}
        </view>
        <view class="user-id"> ID：{{ userInfo.id || 0 }} </view>
        </view>
      <view v-else class="not_login"> Hi~请登录<van-icon custom-style="font-weight: 600;" name="arrow"/></view>
    </view>
    <!-- 我的订单 -->
    <view class="user-order" id="userOrderId">
      <view class="order-list">
        <view class="order-item" @click="goPages(item.path)"
          v-for="item in orders" :key="item.id">
          <view class="order-item-top">
            <image class="oii-icon" mode="aspectFill" :src="item.icon"></image>
            <view class="oit-num" v-show='shotOitNum(item)'>{{ userTotal[item.key] }}</view>
          </view>
          <view class="order-item-name">{{ item.name }}</view>
        </view>
      </view>
    </view>
    <!-- 菜单 -->
    <view class="user-menus">
      <scroll-view class="bean_list-box"
        scroll-x="true"
        scroll-with-animation
        :scroll-animation-duration="300"
		    @scroll="banScrollHandle"
      >
        <view class="swiper-item box_fl">
          <block v-for="item in menus" :key="item.id">
            <view v-if="item.path != 'share'"
              class="user-menus-item fl_col_cen" @click="goPages(item.path)">
              <image class="umi-icon" :src="item.icon" mode="aspectFill"></image>
              <view class="umi-name">{{ item.name }}</view>
            </view>
            <view v-else-if="!isAutoLogin" class="user-menus-item" @click="goPages(item.path)">
              <view class="menus-item-share-btn fl_col_cen">
                <image class="umi-icon" :src="item.icon" mode="aspectFill"></image>
                <view class="umi-name">{{ item.name }}</view>
              </view>
            </view>
            <view v-else class="user-menus-item">
              <button open-type="share" class="menus-item-share-btn fl_col_cen">
                <image class="umi-icon" :src="item.icon" mode="aspectFill"></image>
                <view class="umi-name">{{ item.name }}</view>
              </button>
            </view>
          </block>
        </view>
      </scroll-view>
      <view class="ban_index-box">
        <view class="ban_index-active" :style="{left: menusLeft + 'px'}"></view>
      </view>
    </view>
  </mescroll-body>
  <custom-tab-bar
    currentIndex="1"
    @domObjHeight="domObjHeightHandle"
    @recommend="recommendUpdate"
  />
</view>
</template>
<script>
import customTabBar from "@/components/customTabBar/index.vue";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { getBaseUrl, getImgUrl } from "@/utils/auth.js";
import getViewPort from "@/utils/getViewPort.js";
import { mapActions, mapGetters, mapMutations } from "vuex";
import config from "./config.js";

export default {
  mixins: [MescrollMixin], // 使用mixin
  components: {
    customTabBar
  },
  data() {
    return {
      downOption: {
        auto: false,
        use: false,
        bgColor: "#ffffff",
      },
      upOption: {
        auto: true, // 不自动加载
        use: true,
        page: {
          num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
          size: 1, // 每页数据的数量
        },
        noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
        // empty:{
        // 	tip: '~ 空空如也 ~', // 提示
        // 	btnText: '去看看'
        // }
      },
      /*订单*/
      orders: config.orders,
      /*菜单*/
      menus: config.menus,
      default_avatar: `${getImgUrl()}/static/images/default_avatar_grey.png`,
      cardImgUrl:`${getImgUrl()}static/card/`,
      imgUrl: getImgUrl(),
      scrollTopNum: 0,
      showCowpeaNavTop: 0,
      tabHeightValue: 0,
      isRecommendRequest: false,
      isStickyActiveScroll: false,
      goods: [],
      pageNum: 1,
      menusLeft: 0,
      showExpandNum: 0,
      cashStorageKey: `${getBaseUrl()}_useRedDot_cashDay`,
      isShowRed: true
    };
  },
  watch: {
    goods(newValue) {
      if (newValue.length <= 4) {
        this.mescroll.triggerUpScroll();
      }
    }
  },
  computed: {
    ...mapGetters([
      "userInfo",
      "userTotal",
      "isCardNewShow",
      "isAutoLogin",
      "profitInfo"
    ]),
    mescrollHeight() {
      let viewPort = getViewPort();
      let mescrollHeight =
        viewPort.windowHeight -
        viewPort.navHeight -
        uni.upx2px(84) -
        this.tabHeightValue;
      return mescrollHeight + "px";
    }
  },
  onLoad() {
  },
  onShow() {
  },
  methods: {
    ...mapActions({
      getUserTotal: "user/getUserTotal",
    }),
    ...mapMutations({
      setCardNewShow: "user/setCardNewShow",
    }),
    shotOitNum(item) {
      const { id, key } = item;
      return (id < 3) && (this.userTotal[key] > 0);
    },
    goPages(path, isCean) {
      if (!this.isAutoLogin) return this.$go("/pages/tabAbout/login/index");
      if (path === "share") return;
      if (isCean) this.setCardNewShow(false);
      this.$go(path);
    },
    downCallback() {
      /*刷新统计*/
      this.getUserTotal();;
    },
    async upCallback(page) {
    },
    // 页面的滚动事件
    onPageScroll(e) {
      const scrollTop = Math.ceil(e.scrollTop);
      this.scrollTopNum = scrollTop;
      this.isStickyActiveScroll = false;
    },
    // menusLeft的左右滑动
    banScrollHandle(event) {
      const { scrollLeft } = event.detail;
      let menusLeft = scrollLeft * (16 / 87);
      menusLeft = menusLeft <= 0 ? 0 : menusLeft;
      menusLeft = menusLeft >= 16 ? 16 : menusLeft;
      this.menusLeft = menusLeft;
    },
  }
};
</script>

<style lang="scss">
page {
  background-color: #f7f7f7;
}
.swiper_search{
  flex: 1;
  transition: all .5s;
  &.ani_flex-in {
    flex: 1;
  }
  &.ani_flex-out {
    flex: 0;
  }
}
.user {
  position: relative;
  z-index: 0;
  &::before {
    content: '\3000';
    background: url("https://file.y1b.cn/store/1-0/231213/657927fa4f20f.png") 0 0 / cover;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 492rpx;
    z-index: -1;
  }
  &.active::before {
    background-image: url("https://file.y1b.cn/store/1-0/231114/65534aca37eff.png");
  }
}
.sticky_box {
  margin-top: 56rpx;
}
.user {
  position: relative;
  z-index: 0;
}
button::after {
  border: none;
  padding: unset;
}

.nav-custom {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .title_icon {
    width: 84rpx;
    height: 46rpx;
    margin-right: 20rpx;
    position: absolute;
    left: 20rpx;
  }
}
.my_user {
  display: flex;
  align-items: center;
  position: absolute;
  left: 28rpx;
  top: 50%;
  transform: translateY(-50%);
  .my_user-avatar {
    width: 48rpx;
    height: 48rpx;
    background: #d8d8d8;
    border: 3rpx solid #ffffff;
    box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(51, 51, 51, 0.1);
    margin-right: 20rpx;
    border-radius: 50%;
  }
  .my_user-nickName {
    font-size: 30rpx;
    font-weight: 600;
    text-align: left;
    color: #333;
    line-height: 1;
    &.active::after {
      content: '\3000';
      background: url("https://file.y1b.cn/public/img/ttxl/static/card/card_icon.png") 0 0 / 100% 100%;
      width: 28rpx;
      height: 26rpx;
      margin-left: 10rpx;
      display: inline-block;
    }
  }
}
.ani_head {
  opacity: 0;
  transition: opacity 0.5s;
}
.ani_head-in {
  opacity: 1;
}
.ani_head-out {
  opacity: 0;
}

.user-info {
  padding-left: 18rpx;
  padding-top: 30rpx;
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 136rpx;
  height: 136rpx;
  position: relative;
  margin-right: 20rpx;
  z-index: 0;
  &::before {
    content: '\3000';
    background: url("https://file.y1b.cn/public/img/ttxl//static/user/user_border.png") 0 0 / 100% 100%;
    position: absolute;
    left: 0;
    top: 0;
    width: 136rpx;
    height: 136rpx;
    z-index: -1;
  }
}
.not_login {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  line-height: 42rpx;
}

.nick-name {
  font-size: 30rpx;
  font-weight: 500;
  color: #333333;
  margin-bottom: 20rpx;
  line-height: 1;
  &.active {
    color: #b75a30;
    &::after{
      content: '\3000';
      background: url("https://file.y1b.cn/public/img/ttxl/static/card/card_icon.png") 0 0 / 100% 100%;
      width: 28rpx;
      height: 26rpx;
      margin-left: 10rpx;
      display: inline-block;
    }
  }
}

.avatar-icon {
  position: absolute;
  top: 8rpx;
  left: 50%;
  transform: translateX(-50%);
}

.user-id {
  height: 42rpx;
  box-sizing: border-box;
  padding: 0 16rpx;
  background: linear-gradient(135deg, #fbfbfb, #f5f5f5);
  border: 1rpx solid #fff;
  border-radius: 22rpx;
  font-size: 24rpx;
  font-weight: 400;
  color: #666;
  display: inline-block;
}

.user-assets {
  background: #ffffff;
  border-radius: 24rpx;
  margin: 24rpx 24rpx 0;
  padding: 24rpx 0;
  overflow: hidden;
  color: #333;
  .user-assets-title {
    font-size: 32rpx;
    font-weight: 600;
    margin: 0 24rpx 16rpx;
  }
  .user_assets_list {
    text-align: center;
    .uab_item{
      width: 33.3%;
      position: relative;
      &:not(:last-child) {
        &::before {
          content: "";
          position: absolute;
          width: 2rpx;
          height:42rpx;
          background-color: #F7F7F7;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
        }
      }
      .uab_item-cont {
        font-size: 40rpx;
        margin-bottom: 4rpx;
        display: inline-block;
        position: relative;
        font-weight: 600;
        .uab_item-lab {
          margin-left: 4rpx;
        }
        .uab_item-price{
          display: flex;
          align-items: baseline;
          &::before {
            content: '￥';
            font-size: 24rpx;
            font-weight: 400;
          }
        }
      }
      .uab_item-lab {
        font-size: 24rpx;
        font-weight: 400;
      }
    }
  }
}

.card-new-show::after {
  content: "";
  position: absolute;
  width: 12rpx;
  height: 12rpx;
  background-color: #EF2B20;
  border-radius: 50%;
  right: -10rpx;
  top: 0;
}

.uab-item-arrow {
  position: absolute;
  right: 22rpx;
  top: 50%;
  transform: translateY(-50%);
}

.cowpea-upgrade {
  margin: 0 22rpx;
  padding-left: 34rpx;
  padding-right: 22rpx;
  height: 75.6rpx;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cowpea-upgrade-bg {
  width: 100%;
  height: 112rpx;
  position: absolute;
  left: 0;
  top: 0;
}

.cowpea-upgrade-title {
  font-size: 24rpx;
  font-weight: 500;
  color: #a95824;
  position: relative;
  z-index: 1;
}
.user-order {
  margin: 24rpx 24rpx 0;
  border-radius: 24rpx;
  background: #fff;
  overflow: hidden;
  padding: 32rpx 0;
  color: #333;
  position: relative;
  .order-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .order-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .order-item-top {
      width: 48rpx;
      height: 48rpx;
      font-size: 0;
      margin: 0 auto 8rpx;
      position: relative;
    }
    .oii-icon {
      width: 48rpx;
      height: 48rpx;
    }

    .order-item-name {
      font-size: 26rpx;
      font-weight: 400;
    }
  }
  .return_cash {
    font-size: 28rpx;
    line-height: 40rpx;
    height: 92rpx;
    background: #F9F9F9;
    border-radius: 16rpx;
    padding: 26rpx 20rpx;
    margin: 24rpx 24rpx 0;
    box-sizing: border-box;
    .rc_left {
      color: #666;
      &::before {
        content: '\3000';
        background: url("https://file.y1b.cn/store/1-0/231212/6578168403ed1.png") 0 0 / cover;
        display: block;
        width: 32rpx;
        height: 38rpx;
        z-index: 0;
        margin-right: 12rpx;
      }
    }
    .rc_right{
      width: 136rpx;
      height: 56rpx;
      background: #f84842;
      border-radius: 16rpx;
      font-size: 26rpx;
      color: #fff;
      line-height: 56rpx;
      text-align: center;
    }
  }
}

.oit-num {
  height: 28rpx;
  background-color: #ef2b20;
  border: 2rpx solid #ffffff;
  border-radius: .625rem;
  padding: 0 9rpx;
  font-size: 20rpx;
  font-weight: 500;
  color: #ffffff;
  line-height: 28rpx;
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
}

.user-menus {
  background-color: #ffffff;
  border-radius: 16rpx;
  margin: 24rpx 24rpx 8rpx;
  padding: 28rpx 0;
  box-sizing: border-box;
  .user-menus-item {
    position: relative;
    width: 25%;
    flex: 0 0 25%;
  }
  .ban_index-box {
    width: 48rpx;
    height: 6rpx;
    background: #e1e1e1;
    border-radius: 6rpx;
    margin: 20rpx auto 0;
    .ban_index-active {
      width: 32rpx;
      height: 100%;
      background: #F84842;
      border-radius: 6rpx;
      position: relative;
    }
}
}
.menus-item-share-btn {
  position: relative;
  background-color: #ffffff;
  padding: 0;
}

.umi-icon {
  width: 72rpx;
  height: 72rpx;
}

.umi-name {
  line-height: 1;
  margin-top: 8rpx;
  font-size: 26rpx;
  color: #333;
  line-height: 36rpx;
}
</style>
