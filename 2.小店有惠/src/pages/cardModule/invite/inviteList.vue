<template>
<mescroll-body
  id="mescrollBody"
  :sticky="true"
  ref="mescrollRef"
  @init="mescrollInit"
  @down="downCallback"
  :down="downOption"
  :up="upOption"
  @up="upCallback"
>
  <xhNavbar
    title="邀请记录"
    titleColor="#333"
    navbarColor="#fff"
    leftImage="/static/images/back_02.png"
    @leftCallBack="$leftBack"
  ></xhNavbar>
  <view class="card_list">
      <view class="card_list-item" v-for="(item, index) in list" :key="index">
          <view class="card_list-left">
              <image
                class="card_list-ava"
                :src="item.avatar_url"
                mode="aspectFill"
              ></image>
              {{ item.nick_name }}
          </view>
          <view class="card_list-right">
            {{ item.create_time }}
          </view>
      </view>
  </view>
</mescroll-body>
</template>
<script>
import { cardGrant } from "@/api/modules/card.js";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
export default {
  mixins: [MescrollMixin], // 使用mixin
  data() {
    return {
      list: [],
      downOption: {
        bgColor: "#ffffff",
      },
      upOption: {
        use: true,
      },
    }
  },
  methods: {
    downCallback() {
      this.mescroll.resetUpScroll();
    },
    async upCallback(page) {
      let params = {
        page: page.num,
        size: 10,
      };
      cardGrant(params).then(res => {
        if(res.code != 1) return this.mescroll.endSuccess();
        const { list, result, total_count } = res.data;
        if (page.num == 1) {
          this.list = [];
          this.result = result;
        }
        this.list = this.list.concat(list); // 追加新数据
        this.mescroll.endBySize(list.length, total_count);
      }).catch(() => this.mescroll.endErr());
    },
  }
}
</script>
<style scoped lang="scss">
.card_record{
  margin-top: 14rpx;
  background: #fff;
  .record_more{
    padding: 32rpx 22rpx 32rpx 36rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2rpx solid #e9e9e9;
    .record_more-left {
      font-size: 32rpx;
      color: #333333;
      line-height: 44rpx;
      position: relative;
      &::before {
        content: '\3000';
        position: absolute;
        left: -12rpx;
        top: 50%;
        transform: translateY(-50%);
        width: 4rpx;
        height: 26rpx;
        background: #ef2b20;
        border-radius: 2rpx;
      }
    }
    .text_arrow_icon{
      font-size: 28rpx;
      color: #999999;;
    }
  }
}
.card_list {
  padding-left: 24rpx;
  margin-top: 10rpx;
  border-top: 16rpx solid #F4F5F9;
  &::after {
    content: '\3000';
    display: block;
    width: 100%;
  }
  .card_list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40rpx;
    font-size: 28rpx;
    line-height: 40rpx;
    padding: 27rpx 20rpx 27rpx 0;
    &:not(:last-child) {
      border-bottom: 2rpx solid #f1f1f1;
    }
    .card_list-left {
      display: flex;
      align-items: center;
      .card_list-ava{
        width: 48rpx;
        height: 48rpx;
        background: #d8d8d8;
        border-radius: 50%;
        margin-right: 16rpx;
      }
    }
    .card_list-right{
      color: #CCCCCC;
    }
  }
}
</style>
