<template>
  <view class="modify-name-box">
    <view class="name-item">
      <van-field
        :value="nickName"
        type="nickname"
        :maxlength="15"
        placeholder="请输入新的昵称"
        placeholder-style="font-size:28rpx;color:#999999;"
        :border="false"
        custom-style="font-size:28rpx;--field-input-text-color:#333333;background-color: #ffffff;"
        :focus="focus"
        @change="change"
        @clickIcon="clickIcon"
        :clearable="true"
      ></van-field>
      <view class="tips">20个字符，可由中文、英文、数字、-和_组成</view>
      <view :class="['btn-save', isChange ? 'active': '']" @click="updateUserHandle">确认</view>
    </view>
    <privacyOpen ref="privacyOpen"></privacyOpen>
  </view>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  components: {
  },
  data() {
    return {
      currentName: '',
      nickName: "微信默认昵称",
      isChange: false,
      focus: false,
    };
  },
  onLoad(options) {
    if(options.nickName) {
      this.nickName = options.nickName;
      this.currentName = options.nickName;
    }
  },
  onShow() {
    this.$refs.privacyOpen.LifetimesShow();
    setTimeout(() => {
      this.handleTouchInput();
    }, 1000);
  },
  methods: {
    ...mapActions({
      editUpdateUser: 'user/editUpdateUser',
    }),
    clickIcon() {
      this.nickName = "";
    },
    handleTouchInput() {
      if (wx.requirePrivacyAuthorize) {
        wx.requirePrivacyAuthorize({
          success: res => {
            console.log('用户同意了隐私协议 或 无需用户同意隐私协议')
            // 用户同意隐私协议后给昵称input聚焦
            this.focus = true;
          },
          fail: res => {
            console.log('用户拒绝了隐私协议')
          }
        })
      } else {
        this.focus = true;
      }
    },
    change({ detail }) {
      console.log('detail', detail);
      if(detail == '' || detail == this.currentName) {
        this.isChange = false;
      } else {
        this.isChange = true;
      }
      this.nickName = detail;
    },
    updateUserHandle() {
      if(!this.isChange) return;
      this.editUpdateUser({
        nick_name: this.nickName
      }).then(result => {
        console.log('result', result);
        uni.showToast({
          title: '更新成功',
          icon: 'none'
        });
        uni.navigateBack({
          fail(e) {
            uni.switchTab({
              url: '/pages/tabBar/shopMall/index'
            })
          }
        });
      });
    }
  },
};
</script>

<style lang="scss">
page {
  background: #F7F7F7;
}
.name-item {
  box-sizing: border-box;
}

.tips {
  margin-top: 16rpx;
  font-size: 24rpx;
  font-weight: 400;
  color: #999;
  line-height: 34rpx;
  padding: 0rpx 32rpx;
}

.btn-save {
  width: 432rpx;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  box-sizing: border-box;
  margin: 72rpx auto 0 auto;
  font-size: 32rpx;
  font-weight: 400;
  color: #ffffff;
  width: 630rpx;
  height: 88rpx;
  border-radius: 16rpx;
  background: #999;
  &.active {
    background: linear-gradient(135deg,#f2554d, #f04037);
  }
}
</style>