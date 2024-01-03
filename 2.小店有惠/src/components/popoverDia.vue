<template>
  <view class="dia">
    <van-popup
      :show="isShow"
      @close="close"
      custom-style="background-color: transparent;overflow:visible;"
      :close-on-click-overlay="false"
      :z-index="100"
	    :catchtouchmove="true"
    >
      <!-- 新人专享大礼包 -->
      <view class="dia_con">
        <image class="dia_close" src="@/static/images/close.png" mode="aspectFit" @click="close"></image>
        <!-- 背景 -->
        <image
          class="dia_con-bg"
          :src="diaImage"
          mode="aspectFit"
          @click="openLinkHandle"
        ></image>
        <!-- <image
          class="dia_con-btn"
          src="@/static/images/phone_btn.png"
          mode="aspectFit"
          @click="openLinkHandle"
        ></image> -->
      </view>
    </van-popup>
  </view>
</template>

<script>
import {
  getCredits,
  decCredits,
} from "@/api/modules/home.js";
import goDetailsFun from '@/utils/goDetailsFun';
export default {
  mixins: [goDetailsFun],
  computed: {
  },
  props: {
    isShow: {
        type: Boolean,
        default: false
    },
    diaId: {
      type: Number,
      default: 0
    },
    diaImage: {
      type: String,
      default: ''
    }
	},
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
    // show(id) {
    //   this.diaId = id;
    //   this.isShow = true;
    // },
    close() {
      this.$emit("close");
    },
    async openLinkHandle() {
      // 进行心链链接的跳转;
      this.$emit("openLink");
      this.requestGoodXq_mixins(this.diaId, 1);
    }
  },
};
</script>

<style lang="scss">
.dia {
  position: relative;
  z-index: 99999;
  .dia_con {
    position: relative;
    z-index: 0;
    text-align: center;
    width: 494rpx;
    height: 640rpx;
    .dia_close {
      position: absolute;
      right: -28rpx;
      top: -80rpx;
      width: 56rpx;
      height: 56rpx;
    }
    .dia_con-bg {
      position: absolute;
      z-index: -1;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .dia_con-btn {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 6rpx;
      width: 390rpx;
      height: 130rpx;
    }
  }
}
</style>
