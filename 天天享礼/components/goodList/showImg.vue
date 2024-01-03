<template>
<view>
  <swiper
    class="good-img"
    :autoplay="true"
    :interval="2000"
    :duration="500"
    :circular="true"
    v-if="isSwiper && good.lx_type == 2 && !(index%7)"
  >
    <swiper-item
      class="good-img"
      v-for="(item33, idx) in good.imageList"
      :key="idx"
    >
      <van-image
        width="352rpx"
        height="352rpx"
        :src="item33.url"
        use-loading-slot
        class="banner_img"
        radius="8px 8px 0 0"
      >
        <van-loading slot="loading" type="spinner" size="20" vertical />
      </van-image>
    </swiper-item>
  </swiper>
  <view class="good-img" v-else>
    <van-image
      height="352rpx"
      width="352rpx"
      radius="8px 8px 0 0"
      :src="good.image"
      use-loading-slot
    >
      <van-loading slot="loading" type="spinner" size="20" vertical />
    </van-image>
  </view>
</view>
</template>

<script>
export default {
  props: {
    good: {
      type: Object,
      default: {},
    },
    isSwiper: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {};
  },
  methods: {
    sphError(err) {
      console.log("视频号err：", err);
    },
  },
};
</script>
<style lang="scss">
.good-img {
  width: 352rpx;
  height: 352rpx;
  font-size: 0;
  position: relative;
}

</style>
