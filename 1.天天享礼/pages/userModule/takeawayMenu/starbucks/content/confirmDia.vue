<template>
	<van-popup
    :show="isShow"
    custom-style="overflow: visible;background: transparent;"
    round
    :z-index="100"
	  :safe-area-inset-bottom="false"
	  :catchtouchmove="true"
  >
	<view class="cont_box">
      <view class="cont_text">
        <view class="cont_remind">{{remindText}}</view>
      </view>
      <view class="btns_box fl_bet">
        <view class="pop_btn pop_btn-cancel" @click="onClose" v-if="!isInform">{{cancelText}}</view>
        <view
          class="pop_btn pop_btn-confirm"
          :class="{ 'fl1': isInform}"
          @click="onConfirm"
        >
          {{confirmText}}
        </view>
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
      },
	    remindText: {
        type: String,
        default: '确定删除搜索历史？'
      },
      cancelText: {
        type: String,
        default: '取消'
      },
      confirmText: {
        type: String,
        default: '确定'
      },
      isInform: {
        type: Boolean,
        default: false
      }
    },
	data() {
		return {
		}
	},
	methods: {
		onClose() {
			this.$emit("close");
		},
    onConfirm() {
			this.$emit("confirm");
    }
	}
}
</script>

<style scoped lang="scss">
@import '@/static/css/mixin.scss';
.cont_box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 622rpx;
  background: #ffffff;
  border-radius: 40rpx;
}
.cont_remind {
	margin: 110rpx auto;
  font-weight: 600;
  text-align: center;
  color: #333333;
  line-height: 40rpx;
}
.btns_box {
	width: 100%;
  margin-bottom: 40rpx;
  padding: 0 76rpx;
  box-sizing: border-box;
}
.pop_btn {
  min-width: 212rpx;
  height: 80rpx;
  line-height: 80rpx;
  background: #f1f1f1;
  border-radius: 40rpx;
  font-size: 28rpx;
  font-weight: 600;
  text-align: center;
  color: #666666;
  padding: 0 50rpx;
  box-sizing: border-box;
}

.pop_btn-confirm {
  color: #fff;
  background: $starbucksColor;
}
</style>