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
  <xh-navbar
    title="提现记录"
    titleColor="#333"
    :leftImage="imgUrl+'/static/images/left_back.png'"
    @leftCallBack="$leftBack"
  ></xh-navbar>
  <view class="cont_list">
    <view class="list_item fl_bet"
      v-for="(item, index) in list"
      :key="index"
    >
      <view class="list_item-left">
        {{item.status_desc}}
        <view class="list_lab">{{item.create_time}}</view>
      </view>
      <view class="list_item-right">¥{{ item.withdraw_money }}</view>
    </view>
  </view>
</mescroll-body>
</template>
<script>
import { withdrawLog } from '@/api/modules/user.js';
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { getImgUrl } from '@/utils/auth.js';
export default {
    mixins: [MescrollMixin],
    data() {
      return {
        imgUrl: getImgUrl(),
        downOption: {
          auto: false,
          bgColor: "#ffffff",
        },
        upOption: {
          auto: true,
          use: true,
          empty: {
            tip: '暂无记录' // 空提示
          },
          noMoreSize: 10,
        },
        list: []
      };
    },
    methods: {
      downCallback() {
        this.mescroll.resetUpScroll();
      },
      upCallback(page) {
        let params = {
          page: page.num,
          size: 10,
        };
        withdrawLog(params).then(res => {
          if(res.code != 1) return this.mescroll.endSuccess(0);
          const { list, total_count } = res.data;
          if (page.num == 1) this.list = [];
          this.list = this.list.concat(list); // 追加新数据
          this.mescroll.endBySize(list.length, total_count);
        }).catch(() => this.mescroll.endErr());
      },
    },
  }
</script>
<style lang="scss">
page {
  background: #F7F7F7;
}
.cont_list {
  color: #333;
  padding: 0 24rpx;
  margin: 40rpx 24rpx;
  background: #ffffff;
  border-radius: 24rpx;
  overflow: hidden;
  .list_item {
    font-size: 28rpx;
    margin: 40rpx 0;
    .list_lab {
      color: #ccc;
    }
    .list_item-right {
      font-size: 22rpx;
      color: #f84842;
    }
  }
}
</style>
