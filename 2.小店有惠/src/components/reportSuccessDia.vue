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
  <view class="dia_box">
    <view class="dia_cont">
        <view class="dia_title">{{ title }}</view>
        <view class="dia_lab">{{ label }}</view>
        <view class="dia_lab2">{{ remLab }}</view>
        <view class="dia_code">
          <!-- 商品图片 -->
          <van-image
            width="100%"
            height="100%"
            src="https://file.y1b.cn/store/1-0/231120/655b25138bf58.jpg"
            use-loading-slot
            radius="14px"
            :show-menu-by-longpress="true"
          >
            <van-loading slot="loading" type="spinner" size="20" vertical />
          </van-image>
        </view>
        <view class="dia_code-title">长按关注</view>
    </view>
    <view class="back_btn" @click="closeHandle">我知道了</view>
  </view>
</van-popup>
</template>
<script>
export default {
  props:{
    isShow: {
			type: Boolean,
			default: false
		},
    title: {
      type: String,
      default: '报名成功'
    },
    label: {
      type: String,
      default: '平台将在1-3个工作日内处理'
    },
    remLab: {
      type: String,
      default: '不错过任何一笔收益提醒'
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
  .dia_cont {
    text-align: center;
    padding: 40rpx 0 54rpx;
    font-size: 28rpx;
    line-height: 40rpx;
    .dia_title{
      font-size: 32rpx;
      font-weight: 500;
      color: #ef2b20;
      line-height: 44rpx;
      margin-bottom: 16rpx;
    }
    .dia_lab{
      color: #999999;
      margin-bottom: 40rpx;
    }
    .dia_lab2 {
      color: #999999;
      padding-top: 53rpx;
      border-top: 1px solid #e1e1e1;
    }
    .dia_code-title{
      color: #333333;
      // padding-bottom: 54rpx;
    }
    .dia_code{
      width: 200rpx;
      height: 200rpx;
      background: #fafafa;
      border-radius: 28rpx;
      margin: 24rpx auto;
    }
  }
  .back_btn{
    width: 176rpx;
    line-height: 64rpx;
    background: rgba(255,255,255,0.15);
    border: 2rpx solid #ffffff;
    border-radius: 16rpx;
    font-size: 28rpx;
    font-weight: 400;
    text-align: center;
    color: #ffffff;
    margin: 40rpx auto 0;
  }
}

</style>