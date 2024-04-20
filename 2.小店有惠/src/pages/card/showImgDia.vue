<template>
<van-popup
  :show="isShow"
  round
  custom-style="background: transparent;overflow:visible;"
  :root-portal="true"
  z-index="100"
  :lock-scroll="true"
  :catchtouchmove="true"
  @close="closeHandle"
>
  <view class="dia_box ani_active">
    <view class="dia_title">添加小店智囊团，带你赚钱</view>
    <view class="dia_code">
      <van-image
        width="100%" height="100%"
        src="https://test-file.y1b.cn/store/1-0/24228/65dea1b5981eb.png"
        use-loading-slot radius="14px"
        :show-menu-by-longpress="true"
      ><van-loading slot="loading" type="spinner" size="20" vertical />
      </van-image>
    </view>
    <image class="dia_close" src="https://file.y1b.cn/store/1-0/24131/65ba395cf1ec7.png" mode="aspectFit" @click="closeHandle"></image>
  </view>
</van-popup>
</template>
<script>
export default {
  props:{
    isShow: {
			type: Boolean,
			default: false
		}
  },
  methods: {
    closeHandle() {
      this.$emit("close");
    }
  },
}
</script>

<style scoped lang="scss">
.dia_box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  .dia_title{
    font-size: 42rpx;
    font-weight: 600;
    line-height: 44rpx;
    color: #fff;
  }
  .dia_code{
    width: 640rpx;
    height: 640rpx;
    background: #fafafa;
    border-radius: 15rpx;
    margin: 45rpx auto 60rpx;
    padding: 40rpx;
    box-sizing: border-box;
  }
  .dia_close{
    width: 56rpx;
    height: 56rpx;
    margin: 0 auto;
  }
}
.ani_active {
  transform: scale(0);
  animation: openAni .3s linear 0s forwards;
}
</style>
