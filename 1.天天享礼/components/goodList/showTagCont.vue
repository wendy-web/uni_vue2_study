<template>
<view class="use_tag">
  <block v-for="item in good.shopArr" :key="item.value" >
    <view :class="['tag_right tag_label', item.value == 8 ? 'shop_tag-label' : 'shop_tag-label2']" v-if="[8, 15, 16].includes(item.value)">
      {{ item.label }}
    </view>
    <view :class="['tag_right tag_label-icon']" v-else-if="[0,1].includes(item.value)">
      {{ item.label }}
    </view>
    <image v-else class="shop_tag-icon tag_right" :src="shopImgSrc(item.value)"
    mode="heightFix"></image>
  </block>
  <view class="use_cont-right tag_right" v-if="good.zero_credits">免豆特权</view>
</view>
</template>

<script>
import { getPlatform } from "@/utils/auth.js";
export default {
  props: {
    good: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      platform: getPlatform()
    };
  },
  methods: {
    shopImgSrc(value) {
      let src = '/static/tagImgs/shop_tag';
      return src + value  + '.png';
    }
  }
};
</script>
<style lang="scss" scoped>
.use_tag {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  height: 34rpx;
  margin-top: 10rpx;
  vertical-align: middle;
  flex-wrap: wrap;
  overflow: hidden;
}
.use_cont-right {
  color: #999;
  position: relative;
}
.shop_tag-icon {
  height: 30rpx;
  width: 240rpx;
}
.tag_label {
  margin-top: 4rpx;
  line-height: 30rpx;
}
.shop_tag-label {
  color: #F84842;
}
.tag_label-icon {
  @extend .tag_label;
  @extend .shop_tag-label;
  padding-left: 30rpx;
  position: relative;
  &::before {
    content: "\3000";
    background: url(/static/tagImgs/icon.png) 0 0 / 100% 100% no-repeat;
    position: absolute;
    left: 0;
    top: 0;
    // top: 50%;
    // transform: translateY(-50%);
    width: 26rpx;
    height: 26rpx;
    z-index: -1;
  }
}

.shop_tag-label2 {
  color: #999;
}
.shop_tag-icon  {
  margin: 2rpx 0;
}
.tag_right {
  // line-height: 30rpx;
  // vertical-align: middle;
  &:not(:last-child) {
    margin-right: 12rpx;
  }
}
</style>
