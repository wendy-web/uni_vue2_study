<template>
<van-popup
  :show="isShow"
  @close="closeHandle"
  custom-style="background-color: transparent;overflow:visible;"
  :z-index="100"
  :catchtouchmove="true"
>
    <view class="cont_box">
      <view class="cont_title">你太幸运了</view>
      <image src="https://test-file.y1b.cn/store/1-0/24222/65d6aea763724.png" mode="widthFix" class="cash_bg"></image>
    </view>
    <view class="cont_free_list">
      <image :src="showTopImg" mode="widthFix" class="free_top"></image>
      <view class="list_cont">
        <view class="list_item-box"
          v-for="(item, index) in getGiftList" :key="index"
          @click="chooseGiftHandle(index)"
        >
          <view class="list_item fl_bet">
            <image :src="item.img" mode="scaleToFill" class="list_iem-left"></image>
            <view class="item_cont">
              <view class="item_cont-txt txt_ov_ell1">{{ item.title }}</view>
              <view class="item_cont-price">价值 {{ item.price }} 元</view>
            </view>
            <view class="item_right">包邮</view>
          </view>
        </view>
      </view>
    </view>
  </van-popup>
</template>

<script>
import { chooseGift, giftList } from '@/api/modules/cash.js';
import { mapGetters, mapMutations } from "vuex";
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    freeActiveId: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapGetters([]),
    showTopImg() {
      return (this.getGiftList.length > 1) ?
      'https://test-file.y1b.cn/store/1-0/24222/65d6af75de533.png' :
      'https://test-file.y1b.cn/store/1-0/24222/65d6e9a15855c.png'
    }
  },
  data() {
    return {
      getGiftList: [],
      timer: null
    };
  },
  watch: {
    isShow(newValue) {
      if(!newValue) {
        clearTimeout(this.timer);
        this.timer = null;
        return;
      };
      this.init();
    }
  },
  async mounted() {
  },
  methods: {
    ...mapMutations({
      setGiftInfo: 'user/setGiftInfo',
      setDiaList: "user/setDiaList",
      delCurrentDiaList: "user/delCurrentDiaList",
    }),
    async init() {
      const res = await giftList();
      if(res.code != 1) return;
      this.getGiftList = res.data;
      if(this.getGiftList.length <= 1) {
        this.timer = setTimeout(() => {
          this.chooseGiftHandle();
        }, 5000);
      }
    },
    async chooseGiftHandle(index = 0) {
      const { id } = this.getGiftList[index]
      await chooseGift({
        gift_id: id,
        active_id: this.freeActiveId
      });
      this.$emit('choose');
    },
    closeHandle() {
      if(this.getGiftList.length > 1) return;
      this.chooseGiftHandle();
      // this.$emit('close');
    }
  },
};
</script>

<style lang="scss" scoped>
@import '../static/animation.scss';
.cont_box {
  width: 100%;
  position: absolute;
  z-index: 0;
  &::before {
    content: '\3000';
    background: url("https://file.y1b.cn/store/1-0/24123/65af90425e5c4.png") 0 0 / cover;
    position: absolute;
    top: 50%;
    left: 0;
    width: 750rpx;
    height: 758rpx;
    transform: translateY(-50%);
  }
  &::after {
    content: '\3000';
    background: url("https://file.y1b.cn/store/1-0/24123/65af90d5ebfa9.png") 0 0 / cover;
    position: absolute;
    top: 50%;
    left: 0;
    width: 726rpx;
    height: 506rpx;
    transform: translateY(-50%);
  }
  &.free_active::after {
    width: 720rpx;
    height: 448rpx;
    background-image: url("https://test-file.y1b.cn/store/1-0/24222/65d6ad3f51fac.png");
  }
}
.cash_bg{
  width: 750rpx;
  height: 538rpx;
}
.cont_title{
  font-size: 40rpx;
  text-align: center;
  color: #fff8e1;
  line-height: 56rpx;
  text-shadow: 2rpx 2rpx 8rpx #fff;
  text-align: center;
  font-weight: 600;
  width: 750rpx;
  box-sizing: border-box;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding: 0 72rpx;
  top: -20rpx;
  .cont_img {
    position: absolute;
    width: 112rpx;
    height: 112rpx;
    top: -120rpx;
    left: 50%;
    transform: translateX(-50%);
  }
  .txt_ov_ell1 {
    position: relative;
    &.active::after {
      content: '”';
      position: absolute;
      top: 0;
      right: -20rpx;
    }
  }
}
.cont_free_list {
  width: 750rpx;
  position: relative;
  z-index: 0;
  font-size: 0;
  .free_top {
    width: 100%;
  }
  .list_cont{
    width: 640rpx;
    position: relative;
    margin: -2rpx auto 0;
    background-image: url("https://test-file.y1b.cn/store/1-0/24222/65d6eb709be3b.png");
    padding-bottom: 32rpx;
    border-radius: 0 0 28rpx 28rpx;
    // &::after {
    //   content: '\3000';
    //   background: url("https://test-file.y1b.cn/store/1-0/24222/65d6e81c1d6e9.png") 0 0 / cover;
    //   position: absolute;
    //   left: 50%;
    //   bottom: -32rpx;
    //   width: 100%;
    //   height: 34rpx;
    //   transform: translateX(-50%);
    // }
    .list_item-box {
      margin: 0 24rpx;
      width: 590rpx;
      padding: 16rpx;
      border-radius: 28rpx;
      background: rgba(255,255,255,0.40);
      border: 2rpx solid rgba(255,255,255,0.50);
      box-sizing: border-box;
      &:not(:last-child) {
        margin-bottom: 16rpx;
      }
    }
    .list_item {
      width: 100%;
      border-radius: 22rpx;
      position: relative;
      background: #fff;
      font-size: 26rpx;
      .list_iem-left {
        width: 172rpx;
        height: 172rpx;
        border-radius: 22rpx;
        margin-right: 24rpx;
      }
      .item_cont{
        flex: 1;
        width: 0;
        .item_cont-txt {
          font-size: 36rpx;
          color: #333;
          line-height: 50rpx;
          margin-bottom: 20rpx;
          font-weight: bold;
        }
        .item_cont-price {
          font-size: 28rpx;
          line-height: 40rpx;
          padding:  2rpx 0 8rpx;
          text-align: left;
          color: #83502c;
          position: relative;
          font-weight: bold;
          background: url("https://test-file.y1b.cn/store/1-0/24222/65d6f5f7a1e96.png") 0 0 / cover;
          &::before {
            content: '\3000';
            background: url("https://test-file.y1b.cn/store/1-0/24222/65d6f678cb627.png") 0 0 / cover;
            width: 18rpx;
            height: 14rpx;
            display: inline-block;
            margin-right: 8rpx;
            position: relative;
            top: -6rpx;
          }
          &::after {
            content: '\3000';
            background: url("https://test-file.y1b.cn/store/1-0/24222/65d6f7e773d2a.png") 0 0 / cover;
            width: 18rpx;
            height: 14rpx;
            position: absolute;
            bottom: 4rpx;
            margin-left: 6rpx;
          }

        }
      }
      .item_right{
        font-size: 26rpx;
        color: #fe7666;
        line-height: 36rpx;
        margin: 0 32rpx 0 20rpx;
      }
    }
  }
}
.cont_title {
  transform: translate(-50%, 0) scale(0);
  opacity: 0;
  animation: titleScale .5s linear .3s forwards;
}
.cash_bg {
  transform: translateX(-110%);
  opacity: 0;
  animation: titleLate .2s linear .6s forwards;
}
.cont_box {
  animation: opacityCloseAni .2s linear 2s forwards;
}
.cont_free_list{
  opacity: 0;
  animation: opacityOpenAni .2s linear 2.1s forwards;
}
@keyframes titleScale {
  0% {
    -webkit-transform: translate(-50%,0) scale(0);
    transform: translate(-50%,0) scale(0);
    opacity: 0;
  }
  100% {
    -webkit-transform: translate(-50%, 0) scale(1);
    transform: translate(-50%, 0) scale(1);
    opacity: 1;
  }
}
@keyframes titleLate {
  0% {
    transform: translateX(-110%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
