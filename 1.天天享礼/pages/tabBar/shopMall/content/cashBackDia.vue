<template>
<van-popup
  :show="isShow"
  @close="closeHandle"
  custom-style="background-color: transparent;overflow:visible;"
  :z-index="100"
  :catchtouchmove="true"
>
  <view class="cont_box ani_active" @click="goToCashHandle">
    <view class="cont_title" v-if="cashStatus == 3">
      <image :src="cashInfo.goods_image" mode="widthFix" class="cont_img" v-if="cashInfo.goods_image"></image>
      <!-- 恭喜你成为今日幸运用户 -->
      <view class="txt_ov_ell1">{{ cashInfo.goods_name }}</view>
    </view>
    <image :src="cashBgImg" mode="widthFix" class="cash_bg"></image>
    <image :src="cashBtnImg" mode="widthFix" class="cash_ban"></image>
  </view>
</van-popup>
</template>

<script>
import { orderTrace } from '@/api/modules/cash.js';
import { mapGetters, mapMutations } from "vuex";
export default {
  computed: {
    ...mapGetters(["diaList", "isAutoLogin"]),
    cashBgImg() {
      return (this.cashStatus == 3) ? 'https://test-file.y1b.cn/store/1-0/24125/65b1ffef9534e.png' : 'https://test-file.y1b.cn/store/1-0/24125/65b2026e335a4.png';
    },
    cashBtnImg() {
      return (this.cashStatus == 3) ? 'https://test-file.y1b.cn/store/1-0/24125/65b200d6debd5.png' : 'https://test-file.y1b.cn/store/1-0/24125/65b202c5268c3.png';
    }
  },
  data() {
    return {
      isShow: false,
      cashStatus: 0,
      cashInfo: {}
    };
  },
  watch: {
    diaList(newValue, oldValue) {
      if(newValue.length && (newValue[0] == 'cashBack') && this.isAutoLogin) {
        this.isShow = true;
      }
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
      this.isShow = false;
      const res = await orderTrace();
      if(res.code != 1) return this.closeHandle();
      const { status, info } = res.data;
      if(!status) return this.closeHandle();
      this.cashStatus = status;
      this.cashInfo = info;
      if(this.diaList.length || !this.isAutoLogin) {
        return this.setDiaList('cashBack');
      }
      this.isShow = true;
    },
    closeHandle(isClick = true) {
      this.isShow = false;
      if(isClick) {
        this.delCurrentDiaList('cashBack');
        this.$emit('close');
        return;
      }
    },
    goToCashHandle() {
      this.closeHandle(false);
      this.$go('/pages/userCash/cash/index');
    }
  },
};
</script>

<style lang="scss">
.cont_box {
  width: 100%;
  position: relative;
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
}
.cash_bg{
  width: 750rpx;
  height: 538rpx;
}
.cash_ban{
  width: 402rpx;
  height: 122rpx;
  position: absolute;
  left: 50%;
  bottom: -62rpx;
  transform: translateX(-50%);
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
.ani_active {
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
  .cash_ban {
    opacity: 0;
    transform: translateX(-50%) scale(0);
    animation: titleScale .2s linear .7s forwards;
  }
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
</style>
