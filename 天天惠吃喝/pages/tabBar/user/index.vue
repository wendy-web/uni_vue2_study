<template>
<view class="user">
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
    <xh-navbar
      navbarImageMode="widthFix"
      :overFlow="true"
      :fixedNum="9"
      titleAlign="titleRight"
    >
      <view slot="title" class="nav-custom">
        <image class="title_icon" mode="aspectFill"
          src="https://file.y1b.cn/store/1-0/24517/6646be338312e.png"
        ></image>
      </view>
    </xh-navbar>
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
      <view
        v-for="item in menus" :key="item.id"
        class="user-menus-item " @click="menusHandle(item)">
        <view class="umi-name">{{ item.name }}</view>
        <view class="li-right">
          <view class="lir-item">{{ (item.id == 4) ? version : item.lab }}</view>
          <van-icon name="arrow" color="#aaa" size="14" />
        </view>
      </view>
    </view>
  </mescroll-body>
  <custom-tab-bar currentIndex="1" />
</view>
</template>
<script>
import customTabBar from "@/components/customTabBar/index.vue";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { getBaseUrl } from "@/utils/auth.js";
import { mapActions, mapGetters } from "vuex";
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
        noMoreSize: 4,
        empty:{
          use : false,
        	tip: '~ 空空如也 ~', // 提示
        	btnText: '去看看'
        }
      },
      orders: config.orders,
      menus: config.menus,
      default_avatar: `https://file.y1b.cn/public/img/ttxl//static/images/default_avatar_grey.png`,
			version: '',
    };
  },
  computed: {
    ...mapGetters([
      "userInfo",
      "userTotal",
      "isAutoLogin",
    ])
  },
  onLoad() {
    let version = wx.getAccountInfoSync().miniProgram.version;
		this.version = version ? `v${version}` : 'v1.0.0';
  },
  onShow() {
  },
  methods: {
    ...mapActions({
      getUserTotal: "user/getUserTotal",
    }),
    shotOitNum(item) {
      const { id, key } = item;
      return (id < 3) && (this.userTotal[key] > 0);
    },
    goPages(path) {
      if (!this.isAutoLogin) return this.$go("/pages/tabAbout/login/index");
      this.$go(path);
    },
    //查看协议
    agreementLook(link) {
      link = getBaseUrl() + link;
      this.$go(`/pages/webview/webview?link=${link}#ISLOGIN`);
    },
    menusHandle(item) {
      const { id } = item;
      switch(id) {
        case 1:
          this.agreementLook('/agreement/service-agreement.html')
          break;
        case 2:
          this.agreementLook('/agreement/privacy-agreement.html')
          break;
        case 3:
          wx.makePhoneCall({
            phoneNumber: '400-870-7076'
          });
          break;
        case 4:
          this.$toast('已是最新版本');
          break;
      }
    },
    downCallback() {
      /*刷新统计*/
      this.getUserTotal();;
    },
    async upCallback(page) {
      return this.mescroll.endSuccess(0, false);
    },
  }
};
</script>

<style lang="scss">
page {
  background-color: #f7f7f7;
}
.user {
  position: relative;
  z-index: 0;
  &::before {
    content: '\3000';
    background: url("https://file.y1b.cn/store/1-0/24517/6646be03271fb.png") 0 0 / cover;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 492rpx;
    z-index: -1;
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
    width: 82rpx;
    height: 40rpx;
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
  border-radius: 20rpx;
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
  padding: 0 24rpx;
  .user-menus-item {
    margin-top: 20rpx;
    height: 96rpx;
    background: #ffffff;
    border-radius: 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 32rpx;
    font-size: 28rpx;
    color: #333;
  }
  .li-right {
    display: flex;
    color: #aaa;
    align-items: center;
  }
  .lir-item {
    margin-right: 12rpx;
  }
}
</style>
