<template>
  <view class="good-list">
    <view class="good-list-item"
      :style="{ 'height': (isSearchItem || isHeightAutoItem) && 'auto' }"
      v-for="(good, index) in list" :key="index"
      :data-type="item.lx_type"
    >
      <view class="item_cont" v-if="good.type == 4">
        <!-- 视频组件 -->
        <channel-video
          class="channel_video" object-fit="cover"
          autoplay loop :muted="true"
          :feed-id="good.video_account_id"
          :finder-user-name="good.video_id"
          @error="sphError"
        >
          <!-- 商品图片 -->
          <van-image @click="openSph(good.video_account_id, good.video_id)"
            width="100%" height="100%"
            use-loading-slot :src="good.image"
          ><van-loading slot="loading" type="spinner" size="20" vertical />
          </van-image>
        </channel-video>
      </view>
      <!-- 内容 -->
      <view class="item_cont" v-else @click="goDetails(good, index)">
        <image class="is_banner_img" v-if="good.is_banner" :src="good.imgs[0] || good.picList[0] || good.image"></image>
        <view class="good-img">
          <van-image
            height="362rpx" width="100%"
            radius="8px 8px 0 0" use-loading-slot
            :src="good.imgs[0] || good.picList[0] || good.image"
          ><van-loading slot="loading" type="spinner" size="20" vertical />
          </van-image>
        </view>
        <!-- 商品名称 -->
        <view class="good-name">
          <view class="name_icon" v-if="good.face_value && good.credits ">
            <image class="bg_img" mode="scaleToFill" src="https://file.y1b.cn/store/1-0/24131/65ba3900d759c.png" ></image>
            抵{{ good.face_value}}元{{good.lx_type == 2 ? '券' : ''}}
          </view>
          {{ good.goods_name || good.title }}
        </view>
        <view class="use_cont box_fl" v-if="!isRebate">
          <view class="use_cont-left" v-if="good.after_pay">先用后付</view>
          <view class="search_credit_text" v-if="isSearchItem && good.lx_type != 1">
            {{ good.deduction_credits || good.credits || 0 }}积分
          </view>
        </view>
        <!-- 推广赚钱的品 -->
        <view class="search_item-box rebate_box" v-if="isRebate">
          <!-- <view class="credit_text">{{ good.deduction_credits || good.credits || 0 }}积分</view> -->
          <view class="box_fl">
            <view class="price_text">
              <block v-if="good.face_value">券后</block>
              <text class="good_credits">
                <text style="font-size: 24rpx">￥</text>
                {{ good.lowestCouponPrice||0 }}
              </text>
            </view>
            <view class="sale_price" v-if="Number(good.sale_price)">￥{{ good.sale_price }}</view>
          </view>
          <view class="good_lab-box">
            <view class="good_lab" v-if="(good.lx_type == 2) && good.inOrderCount30Days">月售{{ good.inOrderCount30Days}}</view>
            <view class="good_lab" v-if="(good.lx_type == 3) && good.sales_tip">已售{{ good.sales_tip }}</view>
          </view>
          <view class="spread_btn" @click.stop="spreadHandle(good)">
            <view v-html="formatItemPrice(good.rebateMoney, 1)"></view>
          </view>
        </view>
        <view class="search_item-box box_fl" v-else-if="isSearchItem">
          <view class="search_credit_text" v-if="good.lx_type == 1">
            {{ good.deduction_credits || good.credits || 0 }}积分
          </view>
          <view class="price_text" v-else>
            券后
            <text class="good_credits">
              <text style="font-size: 24rpx">￥</text>
              {{good.lowestCouponPrice||0}}
            </text>
          </view>
          <view class="good_lab" v-if="(good.lx_type == 2) && good.inOrderCount30Days">月售{{ good.inOrderCount30Days}}</view>
          <view class="good_lab" v-if="(good.lx_type == 3) && good.sales_tip">已售{{ good.sales_tip }}</view>
        </view>
        <!-- 价格+积分 -->
        <view class="good-price-box" v-else>
          <view class="credit_text">{{ good.credits || 0 }}积分</view>
          <view class="good_lab" v-if="(good.lx_type == 2) && good.inOrderCount30Days">月售{{ good.inOrderCount30Days }}</view>
          <view class="good_lab" v-if="(good.lx_type == 3) && good.sales_tip">已售{{ good.sales_tip }}</view>
        </view>
      </view>
    </view>
    <!-- 牛金豆不足 -->
    <confirmDia
      :isShow="confirmDiaShow"
      @close="confirmDiaShow = false"
      @confirm="confirmHandle"
    ></confirmDia>
  </view>
</template>

<script>
import confirmDia from "@/components/confirmDia.vue";
import goDetailsFun from '@/utils/goDetailsFun';
export default {
  mixins: [goDetailsFun],
  components: {
    confirmDia
  },
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    navTop: {
      type: Number,
      default: 0,
    },
    categoryIndex: {
      type: Number,
      default: 0,
    },
    isSearchItem: {
      type: Boolean,
      default: false,
    },
    isHeightAutoItem: {
      type: Boolean,
      default: false,
    },
    isRebate: {
      type: [Boolean,String],
      default: false
    }
  },
  data() {
    return {
      pageHeight: 0,
      confirmDiaShow: false
    };
  },
  methods: {
    formatItemPrice(price = 0, type) {
      let dom= '';
      switch(type) {
        case 1:
          dom = `<span style="font-weight:600;font-size: 13px;">¥<span style="font-size: 18px;">${price}</span></span>`;
          break;
        default:
          dom = `<span style="font-weight:600;font-size: 10px;">¥<span style="font-size: 14px;">${price}</span></span>`;
          break;
      }
      return dom;
    },
    goDetails(item, index) {
      this.detailsFun_mixins(
        item,
        index,
        this.list
      );
    },
    confirmHandle() {
      this.confirmDiaShow = false;
      this.$go("/pages/mineModule/myCredit/index");
    }
  }
};
</script>
<style lang="scss">
.good-list {
  position: relative;
  overflow: hidden;
  display: flex;
  // align-items: center;
  // justify-content: space-between;
  flex-wrap: wrap;
  .good-list-item {
    width: 49%;
    flex: 0 0 49%;
    break-inside: avoid;
    height: 558rpx;
    background-color: #fff;
    border-radius: 8px;
    position: relative;
    margin-bottom: 16rpx;
    .item_cont{
      position: relative;
      width: 100%;
      height: 100%;
      z-index: 0;
      .is_banner_img {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 1;
        border-radius: 8px;
      }
    }
    .channel_video{
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 1;
      border-radius: 8px;
    }
  }
  .good-list-item:nth-child(odd) {
    margin-right: 2%;
  }
  .good-img {
    width: 100%;
    height: 360rpx;
    font-size: 0;
  }
  .good-name {
    display: -webkit-box;
    /* 将对象作为弹性伸缩盒子模型显示 */
    -webkit-box-orient: vertical;
    /* 设置或检索伸缩盒对象的子元素的排列方式 */
    -webkit-line-clamp: 2;
    /* 2行，只有 webkit内核支持 */
    word-break: break-all;
    /* 纯英文换行 */
    overflow: hidden;
    font-size: 28rpx;
    font-weight: 400;
    color: #333;
    padding: 0 16rpx;
    margin-top: 10rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 40rpx;
    height: 80rpx;
    .name_icon{
      display: inline;
      line-height: 40rpx;
      position: relative;
      padding: 0 8rpx;
      color: #fff;
      font-size: 24rpx;
      margin-right: 10rpx;
    }
  }
  .good-price-box {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    margin: 10rpx 16rpx 12rpx;
    white-space: nowrap;
    position: relative;
    .good-credit {
      font-size: 26rpx;
      color: #c1c1c1;
    }
    .price-symbol {
      font-size: 28rpx;
      font-weight: 400;
      color: #ef2b20;
    }
    .price-val {
      font-size: 36rpx;
      color: #ef2b20;
    }
    .price-float {
      font-size: 28rpx;
      color: #ef2b20;
    }
  }
}
.search_credit_text {
  font-size: 26rpx;
  text-align: center;
  color: #f97f02;
  line-height: 36rpx;
  display: flex;
  align-items: center;
}
.search_item-box{
  padding: 0 16rpx 16rpx;
  box-sizing: border-box;
  margin-top: 8rpx;

  .good_credits{
    font-size: 36rpx;
    margin-right: 4rpx;
    font-weight: 500;
  }
  .price_text{
    color: #ef2b20;
  }
  .sale_price {
    font-size: 26rpx;
    text-decoration:  line-through;
    color: #e7331b;
    margin-left: 8rpx;
    opacity: .55;
  }
}
.rebate_box {
  .good_credits {
    font-size: 40rpx;
    font-weight: bold;
  }
  .good_lab-box {
    width: 100%;
    height: 34rpx;
    line-height: 34rpx;
  }
  .good_lab {
    font-size: 24rpx;
    margin: 0;
  }
}
.credit_text {
  font-size: 32rpx;
  font-weight: 600;
  text-align: left;
  color: #ef2b20;
  line-height: 38rpx;
}
.good_lab{
  font-size: 28rpx;
  color: #aaa;
  margin-left: 5rpx;
}
.price_text {
  font-size: 26rpx;
  color: #333;
  line-height: 36rpx;
  white-space: nowrap;
}
.sph-item {
  width: 344rpx;
  height: 344rpx;
}
.use_cont {
  padding-left: 12rpx;
  height: 34rpx;
  line-height: 34rpx;
  font-size: 24rpx;
  margin-top: 10rpx;
}
.use_cont-left {
  color: #32a666;
  margin-right: 12rpx;
  display: flex;
  align-items: center;
  position: relative;
  &::before {
    content: "\3000";
    width: 26rpx;
    height: 26rpx;
    background: url("https://file.y1b.cn/store/1-0/24619/6672526bc195c.png")  0 0 / 100% 100% no-repeat;
    margin-right: 5rpx;
  }
}

.spread_btn {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 64rpx;
    background: #ef2b20;
    border-radius: 12rpx;
    color: #fff;
    margin-top: 12rpx;
    &::before {
      content: '每件赚';
      margin-right: 6rpx;
      font-size: 28rpx;
    }
  }
</style>
