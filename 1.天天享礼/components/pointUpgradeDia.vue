<template>
  <view class="point-upgrade">
    <van-popup
      :show="isShow"
      @close="close"
      custom-style="background-color: transparent;overflow:visible;"
      :z-index="100"
      :catchtouchmove="true"
    >
      <!-- 新人专享大礼包 -->
      <view class="upgrade_box ani_active" v-if="shoType == 'gift'">
        <image class="new_light" src="https://file.y1b.cn/store/1-0/23415/643a628847111.png" />
        <!-- 背景 -->
        <van-image width="750rpx" height="1088rpx"
          src="https://file.y1b.cn/store/1-0/2418/659ba113a1bff.png"
          fit="cover" use-loading-slot
        ><van-loading slot="loading" type="spinner" size="20" vertical />
        </van-image>
        <view class="get_btn" @click="close">开心收下</view>
      </view>
      <!-- 积分已成功升级为牛金豆 -->
      <view class="point-upgrade-box ani_active" v-else-if="shoType == 'point'">
        <!-- 关闭按钮 -->
        <van-icon class="point-u-close" name="cross"
          color="#AAAAAA" size="50rpx" @click="close"/>
        <!-- 背景 -->
        <van-image width="718rpx" height="592rpx"
          src="https://file.y1b.cn/store/1-0/23714/64b0a0b40804f.png"
          fit="cover" use-loading-slot
        ><van-loading slot="loading" type="spinner" size="20" vertical />
        </van-image>
        <!-- icon -->
        <van-image class="point-u-icon" width="362rpx"  height="220rpx"
          :src="imgUrl + '/point_uicon.png'"
          fit="cover" use-loading-slot
        ><van-loading slot="loading" type="spinner" size="20" vertical />
        </van-image>
        <!-- title -->
        <view class="point-u-title"> 积分已成功升级为牛金豆 </view>
        <!-- title -->
        <view class="point-u-num"> {{ num }}牛金豆 </view>
        <!-- 前往兑换 -->
        <view class="go-exchange" @click="close"> 前往兑换 </view>
      </view>
      <!-- 升级专享大礼包 -->
      <view class="upgrade_box ani_active" v-else-if="shoType == 'upgrade'">
        <image class="new_light" src="https://file.y1b.cn/store/1-0/23415/643a628847111.png" />
        <image class="new_icon up_icon" :src="imgUrl + '/new_Upicon.png'" />
        <!-- 背景 -->
        <van-image width="750rpx" height="1088rpx"
          src="https://file.y1b.cn/store/1-0/23415/643a6236c10ca.png"
          fit="cover" use-loading-slot
        ><van-loading slot="loading" type="spinner" size="20" vertical />
        </van-image>
        <view class="new_num-box">
          <image class="new_numBg" src="https://file.y1b.cn/store/1-0/23714/64b0a0e6d40b1.png"/>
          <view class="new_num-left">
            <view class="num_left">{{ num }}</view>
            <view>积分</view>
          </view>
          <view class="new_num-right">
            <view class="num_right">{{ num * 3 }}</view>
            <view>牛金豆</view>
          </view>
        </view>
        <view class="all_num-box">
          <view class="all_num">{{ num * 3 + 188 }}</view>
          <view class="all_num-text">（积分升级+新人专享）</view>
        </view>
        <view class="get_btn" @click="close">开心收下</view>
      </view>
    </van-popup>
  </view>
</template>

<script>
import { decCredits, getCredits } from "@/api/modules/task.js";
import { getDiaType, getImgUrl, setDiaType } from '@/utils/auth.js';
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  computed: {
    ...mapGetters(["gift", "userInfo", "diaList"]),
  },
  data() {
    return {
      isShow: false,
      num: 0,
      titleIcon: "/static/network/new_icon.png",
      shoType: "",
      currentPage: '',
      noShowList: ['pages/tabBar/discounts/index'], // 不展示弹窗的类别
			imgUrl: getImgUrl() + 'static/network',
    };
  },
  watch: {
    diaList(newValue, oldValue) {
        if(newValue.length && (newValue[0] == this.shoType)) {
          this.showGift();
          // this.delCurrentDiaList();
        }
    }
  },
  mounted() {
    const pageList = getCurrentPages();
    const currentPageObj = pageList[pageList.length - 1];
    this.currentPage = currentPageObj.route;
    this.upgrade();
  },
  methods: {
    ...mapActions({
        getUserInfo: 'user/getUserInfo',
    }),
    ...mapMutations({
        setGiftInfo: 'user/setGiftInfo',
        setDiaList: "user/setDiaList",
        delCurrentDiaList: "user/delCurrentDiaList",
    }),
    show() {
      this.isShow = true;
    },
    close() {
      this.isShow = false;
      setDiaType('gift');
      this.setGiftInfo(0); // 弹窗过 即不是新人的信息存储
      this.delCurrentDiaList();
      this.$emit("happyGet");
      if(this.currentPage != 'pages/tabBar/shopMall/index') {
        this.getUserInfo(); // 获取用户信息
      }
    },
    async upgrade() {
      let diaType = getDiaType();
      if(diaType) return;
      this.shoType = "";
      try {
        let { data } = await getCredits();
        if (data && data.bfxl.credits > 0) {
          let param = {
            source: 'bfxl',
            num: data.bfxl.credits
          }
          let res = await decCredits(param);
          if (res.code == "1") {
            this.num = res.data.num;
            if (this.gift) {
              this.shoType = "upgrade";
            } else {
              this.shoType = "point"; // 积分已成功升级为牛金豆
            }
          }
        }
      } catch (e) {
      } finally {
        if(this.shoType == '' && this.gift == 1) {
          this.shoType = "gift";
        }
        // this.shoType = "point";
        if (!this.shoType) {
          setDiaType('gift');
          return;
        };
        const isNowShow = this.noShowList.includes(this.currentPage);
        // 直接不展示弹窗 - 更新用户信息
        if(isNowShow) {
          setDiaType('gift');
          this.getUserInfo(); // 获取用户信息
          return;
        }
        if(diaType != 'gift') {
          if(this.diaList.length) {
            this.setDiaList(this.shoType);
          } else {
            this.showGift();
          }
        }
      }
    },
    showGift() {
      setDiaType();
      this.show();
    }
  },
};
</script>

<style lang="scss">
.point-upgrade {
  position: relative;
  .new_light {
    width: 750rpx;
    height: 1442rpx;
    position: absolute;
    bottom: -92rpx;
    left: 0;
  }
  .new_icon {
    width: 438rpx;
    height: 56rpx;
    margin: auto;
    display: block;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    &.up_icon {
      width: 436rpx;
    }
  }
  .upgrade_box {
    position: relative;
    text-align: center;
    width: 750rpx;
    height: 1088rpx;
    .get_btn {
      position: absolute;
      width: 430rpx;
      height: 100rpx;
      background: gray;
      border-radius: 50rpx;
      bottom: 240rpx;
      left: 50%;
      transform: translateX(-50%);
      opacity: 0;
    }
    .new_num-box {
      position: absolute;
      width: 490rpx;
      height: 322rpx;
      top: 216rpx;
      left: 50%;
      transform: translateX(-50%);
      z-index: 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .new_numBg {
        position: absolute;
        z-index: -1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .new_num-left {
        color: #98a6ad;
        font-size: 32rpx;
        line-height: 40rpx;
        margin-left: -10rpx;
        .num_left {
          font-size: 40rpx;
          font-weight: 600;
          font-weight: 400;
        }
      }
      .new_num-right {
        color: #db241a;
        font-size: 28rpx;
        .num_right {
          font-size: 56rpx;
          line-height: 56rpx;
          font-weight: 600;
        }
      }
    }
    .all_num-box {
      position: absolute;
      width: 100%;
      top: 556rpx;
      left: 0;
      text-align: center;
      color: #db241a;
      .all_num {
        font-size: 96rpx;
        font-family: DingTalk JinBuTi, DingTalk JinBuTi-Regular;
        font-weight: 400;
        line-height: 1;
        position: relative;
        margin: 10rpx 0 5rpx;
        &::after {
          content: "牛金豆";
          font-size: 28rpx;
          line-height: 1.5;
          position: absolute;
          bottom: 0;
        }
      }
      .all_num-text {
        opacity: 0.6;
        font-size: 26rpx;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        text-align: center;
        color: #db241a;
        line-height: 36rpx;
      }
    }
  }

  .point-upgrade-box {
    position: relative;
    width: 718rpx;
    height: 592rpx;
    font-size: 0;
    text-align: center;
  }

  .point-u-icon {
    position: absolute;
    left: 50%;
    top: 46rpx;
    transform: translateX(-50%);
  }

  .point-u-title {
    position: absolute;
    left: 0;
    top: 298rpx;
    width: 100%;
    font-size: 36rpx;
    font-weight: 500;
    text-align: center;
    color: #333333;
  }

  .point-u-num {
    position: absolute;
    left: 0;
    top: 366rpx;
    width: 100%;
    font-size: 32rpx;
    font-weight: 400;
    text-align: center;
    color: #ffc654;
  }

  .go-exchange {
    position: absolute;
    left: 50%;
    bottom: 48rpx;
    transform: translateX(-50%);
    width: 574rpx;
    height: 90rpx;
    background: linear-gradient(135deg, #f97f02, #ef2b20);
    border-image: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.3),
        rgba(255, 255, 255, 0)
      )
      1 1;
    border-radius: 12px;
    box-shadow: 0 4rpx 12rpx 2rpx rgba(238, 81, 73, 0.5);
    font-size: 36rpx;
    font-weight: 600;
    text-align: center;
    color: #ffffff;
    line-height: 90rpx;
    letter-spacing: 2rpx;
  }

  .point-u-close {
    position: absolute;
    right: 35rpx;
    top: 35rpx;
    z-index: 1;
  }
}
</style>
