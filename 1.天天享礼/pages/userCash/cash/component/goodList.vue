<template>
<view class="good-list">
  <view class="good-list-item" v-for="(good, index) in list" :key="index">
    <view class="item_cont" @click.native.stop="goDetails(good)">
      <van-image
        width="352rpx"
        height="352rpx"
        :src="good.image"
        use-loading-slot
        class="banner_img"
        radius="8px 8px 0 0"
      ><van-loading slot="loading" type="spinner" size="20" vertical />
      </van-image>
      <view class="good_cont js_center" >
          <view class="good_name_box txt_ov_ell2">
            <view class="jd_icon_box" v-if="parseInt(good.face_value)">
              {{ parseInt(good.face_value) || 0 }}元券
            </view>
            {{ good.title }}
          </view>
          <view class="good_remind txt_ov_ell1">
            <!-- <block v-if="!subIndex || (subIndex && ![1, 2, 3, 4].includes(enterPageStatus))">
              <text v-if="parseInt(good.face_value)">券后</text>
              <text class="good_remind-price"> {{ good.price || 0 }}</text>
            </block> -->
            <text class="good_total2" v-if="good.inOrderCount30Days">月售{{ good.inOrderCount30Days }}</text>
          </view>
          <view class="jd_face_value" v-if="subIndex && [1, 2, 3, 4].includes(enterPageStatus)">
          下单约{{ (enterPageStatus == 4) ? `翻${parseFloat(good.double || 0)}倍` : `开出${parseFloat(good.profit) || 0}元` }}</view>
      </view>
    </view>
  </view>
</view>
</template>
<script>
import { bysubunionid } from '@/api/modules/jsShop.js';
import { goodsPromotion } from '@/api/modules/pddShop.js';
import { mapMutations } from "vuex";
import cashMixin from '../static/cashMixin.js'; // 混入分享的混合方法
export default {
  mixins: [cashMixin], // 使用mixin
  props: {
    list: {
      type: Array,
      default:[],
    },
    subIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return { };
  },
  methods: {
    ...mapMutations({
      setMiniProgram: "user/setMiniProgram",
    }),
    async goDetails(item) {
      const {
        lx_type,
        skuId,
        positionId,
        goods_sign,
        active_id,
        tag,
        is_flow
      } = item;
      const params = { positionId, active_id, tag };
      let requestAPI = '';
      if (lx_type == 3) {
        requestAPI = goodsPromotion;
        params.goods_sign = goods_sign;
      } else {
        requestAPI = bysubunionid;
        params.skuId = skuId;
      }
      const skuRes = await requestAPI(params);
      if (skuRes.code == 0) return this.$toast(skuRes.msg);
      if (is_flow == 2) {
        this.$go(`/pages/shopMallModule/productDetails/index?lx_type=${lx_type}&queryId=${goods_sign || skuId}`);
        return;
      }
      const {
        type_id,
        jdShareLink,
        mobile_url
      } = skuRes.data;
      this.setMiniProgram(lx_type);
      this.$openEmbeddedMiniProgram({
          appId: type_id,
          path: jdShareLink || mobile_url
      });

    },
  }
};
</script>
<style lang="scss">
.good-list {
  position: relative;
  overflow: hidden;
  padding: 16rpx 0 16rpx 16rpx;
  display: flex;
  flex-wrap: wrap;
  .good-list-item {
    width: 352rpx;
    background-color: #ffffff;
    border-radius: 8px;
    margin-bottom: 16rpx;
    margin-right: 14rpx;
    .item_cont {
      position: relative;
      width: 100%;
      height: 100%;
      z-index: 0;
    }
  }
  .good_cont {
    padding: 20rpx 20rpx 24rpx;
    .good_name_box {
        font-size: 28rpx;
        color: #333;
        line-height: 40rpx;
        height: 80rpx;
    }
    .good-name {
      color: #333;
      font-size: 28rpx;
      margin-bottom: 40rpx;
      line-height: 40rpx;
      height: 80rpx;
    }
    .good_remind {
      font-size: 26rpx;
      color: #e7331b;
      height: 36rpx;
      line-height: 36rpx;
      white-space: nowrap;
      width: 100%;
      .good_remind-price{
        font-size: 34rpx;
        font-weight: 600;
        text-align: center;
        color: #e7331b;
        line-height: 32rpx;
        margin-right: 13rpx;
        &::before {
          content: '￥';
          font-size: 24rpx;
        }
      }
    }
  }
}
.jd_icon_box {
  padding: 0 10rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: #ffffff;
  line-height: 34rpx;
  position: relative;
  z-index: 0;
  margin-right: 8rpx;
  white-space: nowrap;
  display: inline-block;
  &::before {
    content: "\3000";
    background: url("https://file.y1b.cn/store/1-0/24123/65af5c24137ce.png") 0 0 / 100% 100% no-repeat;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
}

.good_total2 {
  font-size: 26rpx;
  color: #aaa;
  line-height: 36rpx;
}
// 领券中心
.js_center {
  .good_remind {
    margin-top: 20rpx;
  }
  .jd_face_value{
    width: 320rpx;
    height: 64rpx;
    font-size: 28rpx;
    text-align: center;
    color: #fff;
    line-height: 64rpx;
    position: relative;
    z-index: 0;
    margin-top: 20rpx;
    &::before {
      content: "\3000";
      background: url("https://file.y1b.cn/store/1-0/23128/65727b6f2fbdf.png") 0 0 / 100% 100% no-repeat;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
  }
}
</style>
