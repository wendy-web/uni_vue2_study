<template>
  <view class="my-collect">
    <mescroll-body
      ref="mescrollRef"
      @init="mescrollInit"
      @down="downCallback"
      @up="upCallback"
      :up="upOption"
      :down="downOption"
    >
      <view class="list-box">
        <van-swipe-cell
          :right-width="70"
          v-for="(item, index) in listData"
          :key="index"
          :data-id="item.id"
          @click="goDetails($event, item)"
        >
          <!-- 主要内容 -->
          <view class="list-item">
            <van-image
              class="list-icon"
              height="184rpx"
              width="184rpx"
              radius="8px"
              :src="item.imgs[0] || item.picList[0] || item.image"
              use-loading-slot
            ><van-loading slot="loading" type="spinner" size="20" vertical />
            </van-image>
            <view>
              <view class="list-item-title">
                <view class="name_icon" v-if="item.face_value && item.is_rebate">
                  <image class="bg_img" mode="scaleToFill"
                    src="https://file.y1b.cn/store/1-0/24131/65ba3900d759c.png"></image>
                  {{ item.face_value}}元券
                </view>
                <view class="name_icon" v-else-if="item.face_value && item.credits">
                  <image class="bg_img" mode="scaleToFill"
                    src="https://file.y1b.cn/store/1-0/24131/65ba3900d759c.png"></image>
                  抵{{ item.face_value}}元{{item.lx_type == 2 ? '券' : ''}}
                </view>
                {{ item.goods_name }}
              </view>
              <view class="fl_bet rebate_cont" v-if="item.is_rebate">
                <view :class="['item_price fl_center', item.face_value ? 'active' : '']">
                    <view v-html="formatItemPrice(item.lowestCouponPrice, 1)"></view>
                    <view class="item_price-lab" v-if="item.face_value">¥{{item.sale_price}}</view>
                </view>
                <view class="item_btn fl_center" @click.stop="spreadHandle(item)">
                    <view v-html="formatItemPrice(item.rebateMoney, 2)"></view>
                </view>
              </view>
              <!-- 价格+积分抵扣 -->
              <view class="price-info" v-else>
                <text class="credit_text">{{ item.deduction_credits || item.credits }}积分</text>
                <!-- <text class="price_text" v-if="item.lx_type == 2">+￥{{ item.price }}</text>
                <text class="price_text" v-else>+￥{{ item.sale_price }}</text> -->
                <!-- <text class="price-prefix">¥</text>
                <text class="price-val">{{ item.sale_price.split(".")[0] }}</text>
                <text class="price-float">.{{ item.sale_price.split(".")[1] }}</text>
                <text class="point-deduc" v-if="item.deduction_credits > 0">+{{ item.deduction_credits }}积分</text> -->
              </view>
            </view>
            <!-- 抵扣价值 -->
            <!-- <view class="deduc-price" v-if="item.deduction_price > 0">¥{{ item._price }}</view> -->
          </view>
          <!-- 侧滑内容 -->
          <view class="right-swipe" slot="right" @click="toggleCollect(item)">删除</view>
        </van-swipe-cell>
      </view>
    </mescroll-body>
    <!-- 背景 -->
    <view class="list-bg"></view>
  </view>
</template>

<script>
import { bysubunionid, toggleCollect } from '@/api/modules/jsShop.js';
import { collectList, doCollect } from "@/api/modules/mine.js";
import { goodsPromotion, toggleCollect as pddToggleCollect, } from '@/api/modules/pddShop.js';
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { lxTypeStatusCheckout } from "@/utils/goDetailCommonFun.js";
import { mapMutations } from 'vuex';
export default {
  mixins: [MescrollMixin],
  data() {
    return {
      listData: [],
      upOption: {
        auto: false,
      },
      downOption: {
        auto: false, // 不自动加载 (mixin已处理第一个tab触发downCallback)
      },
    };
  },
  onShow() {
    let mescrollRef = this.$refs.mescrollRef;
    mescrollRef.mescroll.resetUpScroll();
  },
  methods: {
    ...mapMutations({
      setMiniProgram: "user/setMiniProgram",
    }),
    upCallback(page) {
      let params = {
        size: 10,
        page: page.num,
      };
      collectList(params).then((res) => {
        let list = res.data ? res.data.list : [];
        //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
        this.mescroll.endSuccess(list.length);
        //设置列表数据
        if (page.num == 1) this.listData = []; //如果是第一页需手动制空列表
        this.listData = this.listData.concat(
          list.map((item) => {
            return {
              _price: Number(item.price / 100).toFixed(2),
              sale_price: (Number(item.price - item.deduction_price) / 100).toFixed(2),
              ...item,
            };
          })
        );
      }).catch(() => this.mescroll.endErr());
    },
    async goDetails(event, item) {
      let { detail, currentTarget } = event;
      if (detail == "cell") {
        let { id } = currentTarget.dataset;
        if(item.is_rebate) return this.rebateDetail(item);
        if([2, 3].includes(Number(item.lx_type))) {
          const {
            skuId,
            positionId,
            isJdLink,
            link,
            is_popover = 0,
            lx_type,
            goods_sign
          } = item;
          let api = bysubunionid
				  let params = { skuId, positionId, is_popover};
          isJdLink && (params.link = link);
          // 拼多多
          if(lx_type == 3) {
            params = { goods_sign };
            api = goodsPromotion;
          }
				  const skuItem = await api(params);
          if (skuItem.code != 1) return this.$toast(skuItem.msg);
          const { type_id, jdShareLink, mobile_url } = skuItem.data;
          this.setMiniProgram(lx_type);
          this.$openEmbeddedMiniProgram({
            appId: type_id,
            path: jdShareLink || mobile_url,
          });
          return;
        }
        this.$go("/pages/homeModule/productDetails/index?id=" + id);
      }
    },
    async rebateDetail(item) {
      const res = await lxTypeStatusCheckout(item);
      if (res.code != 1) return;
      const { lx_type, goods_sign, skuId, positionId, rebate } = item;
      this.$go(`/pages/cardModule/spreadDetail/index?lx_type=${lx_type}&goods_sign=${goods_sign || 0}&skuId=${skuId ||0}&queryId=${goods_sign || skuId}&positionId=${positionId}&rebate=${rebate}`);
    },
    async spreadHandle(item) {
      const res = await lxTypeStatusCheckout(item);
      if (res.code != 1) return;
      const {goods_sign, rebate, skuId } = item;
      this.$go(`/pages/cardModule/spreadDetail/saveType?goods_sign=${goods_sign || 0}&skuId=${skuId || 0}&rebate=${rebate}`);
    },
    formatItemPrice(price = 0, type) {
      let dom= '';
      switch(type) {
        case 1:
          dom = `<span style="font-weight:600;font-size: 13px;">¥<span style="font-size: 20px;">${price}</span></span>`;
          break;
        default:
          dom = `<span style="font-weight:600;font-size: 10px;">¥<span style="font-size: 18px;">${price}</span></span>`;
          break;
      }
      return dom;
    },
    async toggleCollect(item) {
      const { id, skuId, lx_type, goods_sign, goods_id, is_rebate } = item;
      let params = { is_rebate};
      let api = doCollect;
      switch(lx_type) {
        case 2:
          params.skuId = skuId;
          api = toggleCollect;
          break;
        case 3:
          params.goods_sign = goods_sign;
          params.goods_id = goods_id;
					api = pddToggleCollect;
          break;
        default:
          params.goods_id = id;
          api = doCollect;
          break;
      }
      const res = await api(params);
      this.$toast(res.msg);
      if (res.code == 1) this.mescroll.resetUpScroll();
    }
  },
};
</script>

<style lang="scss">
page {
  font-family: PingFang SC, PingFang SC-5;
  background-color: #f7f7f7;
}

.my-collect {
  .list-box {
    border-top: 14rpx solid #f5f6fa;
  }

  .right-swipe {
    width: 70px;
    background-color: #ef2b20;
    height: 100%;
    font-size: 24rpx;
    font-weight: 400;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .list-item {
    height: 184rpx;
    position: relative;
    // padding: 20rpx 24rpx 0 232rpx;
    display: flex;
    align-items: center;
    padding: 20rpx 24rpx;
  }
  .van-swipe-cell {
    border-bottom: 14rpx solid #f5f6fa;
  }

  .list-icon {
    margin-right: 20rpx;
  }

  .list-item-title {
    font-size: 26rpx;
    font-weight: 400;
    color: #333333;
    height: 72rpx;
    margin-top: 5rpx;
    display: -webkit-box;
    /* 将对象作为弹性伸缩盒子模型显示 */
    -webkit-box-orient: vertical;
    /* 设置或检索伸缩盒对象的子元素的排列方式 */
    -webkit-line-clamp: 2;
    /* 2行，只有 webkit内核支持 */
    word-break: break-all;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-bottom: 20rpx;
    .name_icon{
      display: inline-block;
      line-height: 40rpx;
      position: relative;
      z-index: 0;
      padding: 0 8rpx;
      color: #fff;
      font-size: 24rpx;
      margin-right: 10rpx;
    }
  }
  .credit_text {
    font-size: 32rpx;
    font-weight: 400;
    text-align: left;
    color: #ef2b20;
    line-height: 38rpx;
  }
  .price_text {
    width: 120rpx;
    height: 40rpx;
    font-size: 28rpx;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 500;
    text-align: left;
    color: #333333;
    line-height: 40rpx;
  }

  .price-prefix,
  .price-float {
    font-size: 28rpx;
    color: #ef2b20;
  }
  .price-val {
    font-size: 36rpx;
    color: #ef2b20;
  }
  .point-deduc {
    font-size: 26rpx;
    color: #333333;
    margin-left: 4rpx;
  }
  .deduc-price {
    font-size: 26rpx;
    font-weight: 400;
    text-decoration: line-through;
    color: #aaaaaa;
    margin-top: 10rpx;
  }

  .list-bg {
    background-color: #ffffff;
    border-radius: 12px 12px 0 0;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
}
.rebate_cont {
  margin-top: 34rpx;
}
.item_price{
  font-size: 26rpx;
  text-align: center;
  color: #e7331b;
  line-height: 50rpx;
  font-weight: bold;
  position: relative;
  z-index: 0;
  align-self: stretch;
  &.active::before {
    content: '券后';
    font-size: 26rpx;
    margin-right: 8rpx;
    font-weight: normal;
  }
  .item_price-lab {
    margin-left: 8rpx;
    opacity: 0.45;
    font-size: 26rpx;
    text-decoration:  line-through;
  }
  &::after {
    content: '\3000';
    width: 412rpx;
    height: 100%;
    background: linear-gradient(90deg,rgba(255,242,242,0.00), #fde1e0 90%);
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
}
.item_btn {
  padding: 0 12rpx;
  height: 64rpx;
  background: #EF2B20;
  border-radius: 12rpx;
  color: #fff;
  position: relative;
  &::before {
      content: '赚';
      font-size: 26rpx;
      margin-right: 10rpx;
  }
}
</style>
