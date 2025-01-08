<template>
<van-popup
  :show="isShow"
  custom-style="overflow: visible;background: transparent;"
  round
  :z-index="100"
  :safe-area-inset-bottom="false"
  :catchtouchmove="true"
  @close="popupClose"
>
	<view class="cont_dia">
    <view class="cont_box">
      <view class="cont_box-title">免豆特权1年</view>
      <view class="cont_text">
        兑换商品优惠权益时，无需牛金豆
      </view>
      <image class="close_icon" mode="scaleToFill"
        src="https://file.y1b.cn/store/1-0/23118/654b29f0188a0.png"
        @click="popupClose"
      ></image>
    </view>
	</view>
</van-popup>
</template>

<script>
export default {
    props: {
      isShow: {
        type: Boolean,
        default: false
      }
    },
	data() {
		return {
      showExpandNum: 0,
      isShowBack: false
		}
	},
  watch: {
  },
  mounted() {
  },
	methods: {
		popupClose() {
			this.$emit("close");
		},
	}
}
</script>

<style scoped lang="scss">
@import '@/static/css/mixin.scss';
.cont_dia {
  display: flex;
  justify-content: center;
  width: 622rpx;
  color: #333;
  position: relative;
  text-align: center;
  background: #FFFAE9;
  border-radius: 32rpx;
  .cont_box {
    width: 100%;
    z-index: 2;
    padding: 32rpx;
    .cont_box-title {
      font-size: 40rpx;
      line-height: 56rpx;
      font-weight: bold;
    }
    .cont_text {
      margin: 56rpx 0 10rpx;
    }
  }
}
.close_icon {
  width: 60rpx;
  height: 60rpx;
  position: absolute;
  bottom: -120rpx;
  left: 50%;
  transform: translateX(-50%);
}

</style>
