<template>
<view class="good_name_box txt_ov_ell2" v-if="good">
  <view class="jd_icon_box" v-if="good.lx_type != 1 && parseInt(good.face_value)"
    :style="{ '--img' : `url(${faceValueBg})`}"
  >
    抵¥{{ parseInt(good.face_value) || 0 }}券
  </view>
  <view :class="['title_tag', !good.titleArr.value ? 'active' : '']" v-if="good.titleArr">
    <image class="title_tag-icon" :src="'/static/tagImgs/title_tag' + good.titleArr.value  + '.png'"
      mode="heightFix" v-if="good.titleArr.value"></image>
    <block v-else>{{ !good.titleArr.value && good.titleArr.label}}</block>
  </view>
  {{ good.title }}
</view>
</template>
<script>
export default {
  props: {
    good: {
      type: Object,
      default: null,
    },
    faceValueBg: {
      type: String,
      default: 'https://file.y1b.cn/store/1-0/24621/6675210e27253.png'
    }
  },
  data() {
    return {};
  },
  methods: {
  },
};
</script>
<style lang="scss" scoped>
.good_name_box {
  font-size: 28rpx;
  color: #333;
  line-height: 40rpx;
  height: 80rpx;
  word-break: break-all;
}
.jd_icon_box {
  padding: 0 10rpx 0 20rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: #ffffff;
  line-height: 34rpx;
  height: 34rpx;
  position: relative;
  z-index: 0;
  margin-right: 8rpx;
  white-space: nowrap;
  display: inline;
  &::before {
    content: "\3000";
    background: var(--img) 0 0 / 100% 100% no-repeat;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
}
.title_tag {
  height: 34rpx;
  margin-right: 8rpx;
  display: inline-flex;
  font-size: 24rpx;
  line-height: 34rpx;
  vertical-align: middle;
  font-weight: bold;
  color: #7F4715;
  overflow: hidden;
  // align-items: center;
  position: relative;
  z-index: 0;
  &::before {
    content: '\3000';
    position: absolute;
  }
  &.active {
    position: relative;
    z-index: 0;
    padding: 0rpx 4rpx;
    display: inline;
    &::before {
      content: "\3000";
      background: #f8cc82;
      border-radius: 6rpx;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
  }
  &-icon {
    height: 32rpx;
    width: 130rpx;
    // margin-top: 4rpx;
    // position: relative;
    // top: 6rpx;
  }
  &-txt {
    padding: 0rpx 4rpx;
  }
}
</style>
