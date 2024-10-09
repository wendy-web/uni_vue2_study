<template>
<van-popup
  :show="isShow"
  @close="popupClose"
  position="bottom"
  custom-style="overflow: inherit;background: transparent;border-radius: 40rpx;height: 85vh;"
  round
  safe-area-inset-bottom
  :catchtouchmove="true"
>
  <view class="detail_box">
    <view class="det_title">
      选择品牌
      <image class="close_icon" src="https://file.y1b.cn/store/1-0/23118/654b3018c3c74.png" mode="aspectFill" @click="popupClose"></image>
    </view>
    <scroll-view :scroll-y="true" class="detail_cont">
      <view class="tab_box" v-for="(itemL, idx) in list" :key="idx">
        <block v-if="itemL.child.length">
          <view class="cont_lab">{{itemL.name}}</view>
          <view class="cont_list box_fl">
            <view class="cont_list-item fl_col_cen" v-for="(item, index) in itemL.child" :key="index"
              @click="itemHandle(item.id)">
              <view class="item_img-box fl_center">
                <image class="item_img" :src="item.img" mode="widthFix"></image>
              </view>
              <view class="item_txt">{{item.name}}</view>
            </view>
          </view>
        </block>
      </view>
    </scroll-view>
  </view>
</van-popup>
</template>

<script>
import { categoryList } from '@/api/modules/allowance.js';
import getViewPort from '@/utils/getViewPort.js';
export default {
  data() {
    return {
      isShow: false,
      list: []
    }
  },
  computed: {
    mescrollHeight() {
      let viewPort = getViewPort();
      let mescrollHeight =  viewPort.windowHeight - viewPort.navHeight - uni.upx2px(62);
      return mescrollHeight + 'px';
    },
  },
  methods: {
    async popupShow() {
      categoryList().then(res => {
        if(res.code != 1) return;
        this.list = res.data;
        this.isShow = true;
      });
    },
    popupClose() {
      this.isShow = false;
      this.$emit('close');
    },
    itemHandle(id){
      this.$emit('change', id);
      this.isShow = false;
    }
  },
}
</script>

<style scoped lang="scss">
@import '@/static/css/mixin.scss';
.detail_box {
  position: relative;
  height: 85vh;
  background: #fff;
  box-sizing: border-box;
  border-radius: 40rpx 40rpx 0 0;
  .det_title {
    text-align: center;
    font-size: 36rpx;
    font-weight: 900;
    color: #333333;
    line-height: 48rpx;
    position: absolute;
    top: 0;
    width: 100%;
    left: 0;
    z-index: 1;
    border-radius: 40rpx 40rpx 0 0;
    padding-top: 42rpx;
    background: #fff;
    .close_icon {
      width: 52rpx;
      height: 52rpx;
      padding: 16rpx;
      position: absolute;
      right: 16rpx;
      top: 18rpx;
    }
  }
}
.detail_cont {
  height: 100%;
  box-sizing: border-box;
  background: #fff;
  border-radius: 32rpx 32rpx 0rpx 0rpx;
  position: relative;
  overflow: scroll;
  padding-top: 130rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.detail_cont {
  position: relative;
  .tab_box:not(:first-child) {
    margin-top: 64rpx;
  }
  .cont_lab{
    font-size: 30rpx;
    font-weight: 600;
    color: #333333;
    line-height: 42rpx;
    margin-left: 24rpx;
    margin-bottom: 32rpx;
  }
  .cont_list{
    flex-wrap: wrap;
    .cont_list-item{
      width: 20%;
      flex:  0 0 20%;
      &:nth-child(n+6){
        margin-top: 48rpx;
      }
      .item_img-box{
        width: 72rpx;
        height: 72rpx;
        border-radius: 16rpx;
        overflow: hidden;
        .item_img{
          width: 100%;
          height: 100%;
        }
      }
      .item_txt{
        font-size: 26rpx;
        color: #333333;
        line-height: 36rpx;
        text-align: center;
        margin-top: 12rpx;
      }
    }
  }
}

</style>
