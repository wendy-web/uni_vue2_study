<template>
  <view class="modify-name-box">
    <view class="name-item">
      <van-field
        :value="nick_name"
        :right-icon="nick_name ? 'cross' : ''"
        :maxlength="15"
        type="nickname"
        placeholder="请输入新的昵称"
        placeholder-style="font-size:28rpx;color:#999999;"
        custom-style="font-size:28rpx;--field-input-text-color:#333333;"
        :focus="focus"
        @change="change"
        @clickIcon="clickIcon"
      ></van-field>

      <view class="tips">20个字符，可由中文、英文、数字、-和_组成</view>
      <view  :class="['btn-save', isChange ? 'active': '']" @click="save">保存</view>
    </view>
    <privacy ref="privacy"></privacy>
  </view>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      nick_name: "微信默认昵称",
      currentName: '',
      isChange: false,
      focus: false
    };
  },
  onLoad(options) {
    if(options.value) {
      this.nick_name = options.value;
      this.currentName = options.value;
    }
    setTimeout(() => {
      this.handleTouchInput();
    }, 1000);
  },
  methods: {
    ...mapActions({
      updateUserNew: "user/updateUserNew",
    }),
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
    clickIcon(e) {
      this.nick_name = "";
    },
    change({ detail }) {
      this.nick_name = detail;
      if(detail == '' || detail == this.currentName) {
        return this.isChange = false;
      }
      this.isChange = true;
    },
    save() {
      if(!this.isChange) return;
      let nick_name = this.nick_name.replace(/\s/g, "");
      if (!nick_name) {
        return uni.showToast({
          title: "昵称输入不能为空",
          icon: "none",
        });
      }

      this.editUserInfo({
        nick_name,
      });
    },
    editUserInfo(params) {
      this.updateUserNew(params).then((res) => {
        this.$leftBack();
      });
    },
  },
};
</script>

<style lang="scss">
.modify-name-box {
  background-color: #ffffff;
}

.name-item {
  box-sizing: border-box;
  border-top: 14rpx solid #f5f6fa;
}

.tips {
  margin-top: 16rpx;
  font-size: 24rpx;
  font-weight: 400;
  color: #cccccc;
  padding: 0rpx 32rpx;
}

.van-cell:after {
  border-bottom-color: #e1e1e1 !important;
  border-bottom: 1px solid #e1e1e1 !important;
}

.btn-save {
  width: 432rpx;
  height: 84rpx;
  line-height: 84rpx;
  text-align: center;
  box-sizing: border-box;
  border-radius: 8rpx;
  margin: 50rpx auto 0 auto;
  font-size: 32rpx;
  font-weight: 400;
  color: #ffffff;
  background: #999;
  &.active {
    background: linear-gradient(135deg,#f2554d, #f04037);
  }
}
</style>
