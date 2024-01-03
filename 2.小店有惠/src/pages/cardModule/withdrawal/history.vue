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
    navbarColor="#fff"
    title="提现记录"
    titleColor="#333"
    leftImage="/static/images/back_02.png"
    @leftCallBack="$back"
    titleAlign="titleLeft"
  ></xhNavbar>
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
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { withdrawLog } from "@/api/modules/card.js";

export default {
    mixins: [MescrollMixin],
    data() {
      return {
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
          if (page.num == 1) {
            this.list = [];
          }
          this.list = this.list.concat(list); // 追加新数据
          this.mescroll.endBySize(list.length, total_count);
        }).catch(() => this.mescroll.endErr());
      },
    },
  }
</script>
<style lang="scss">
  .cont_list{
    color: #333;
    border-top: 14rpx solid #F5F6FA;
    padding: 0 32rpx;
    .list_item{
      font-size: 28rpx;
      padding: 32rpx 0;
      border-bottom: 2rpx solid #D8D8D8;
      .list_lab{
        color: #ccc;
      }
    }
  }
</style>