<template>
  <view class="feed">
    <!-- 纵向滑动 -->
    <swiper
      class="item_box"
      vertical
      :interval="interval"
      :duration="duration"
      @animationfinish="animationfinish"
      @change="changeHandle"
      @transition="transitionHandle"
      :current="current"
      :next-margin="nextMargin"
      @touchstart="startHandle"
      @touchend="endHandle"
    >
      <swiper-item class="item_list" v-for="(item, index) in feedList" :key="index">
        <view class="coupon-details" :id="'item_list' + index">
          <view class="icon_box" @click="navBack"
            :style="{ height: navBarHeight + 'px', top: topHeight + 'px' }">
            <image class="icon_box-icon"
              :src="imgUrl + 'static/images/icon_close.png'"
              mode="aspectFill" v-if="index == current"></image>
          </view>
          <view class="content_box">
            <view class="sph-box" :style="{
              height: item.contHeight + 'px',
              minHeight: screenWidth + 'px',
            }">
              <swiper class="swiper_banner" @change="bannerSwiperChange"
                :autoplay="current == index" :circular="true"
                :interval="3000" :duration="500">
                <swiper-item class="swiper_item" v-for="(item33, idx) in item.imageList" :key="idx">
                  <image class="banner_img-bg" :src="item33.url" mode="aspectFill"></image>
                  <van-image :width="screenWidth + 'px'" :height="screenWidth + 'px'"
                    :src="item33.url" use-loading-slot radius="32rpx 32rpx 0 0"
                    class="banner_img" @click="getBtnHandle(item)"
                  ><van-loading slot="loading" type="spinner" size="20" vertical/>
                  </van-image>
                </swiper-item>
              </swiper>
              <view class="swiper_banner-num" v-if="item.imageList && item.imageList.length > 1">
                {{ item.bannerCurrIndex + 1 }}/{{ item.imageList.length }}
              </view>
            </view>
            <view class="cont_bottom">
              <view class="cont_box" @click="getBtnHandle(item)">
                <view class="cont_no-credits" v-if="!item.credits">
                    <text style="font-size: 36rpx;">￥</text>{{item.price}}
                </view>
                <view class="cont_vip box_fl" v-else-if="item.zero_credits">
                  <view>{{ item.credits }}牛金豆</view>
                  <image class="price_vip" src="../static/zero_credits.png" mode="heightFix" ></image>
                </view>
                <view class="cont_price" v-else>
                    <view class="cont_price-left">
                        <view class="price_left-cr">{{ item.credits }}</view>
                        牛金豆
                        <view class="mer_price">
                            <image class="price_icon" src="../static/price_icon.png" mode="scaleToFill" ></image>
                            {{ item.face_value }}元券
                        </view>
                    </view>
                    <view class="cont_price-right" v-if="item.inOrderCount30Days > 0">
                        月售{{ item.inOrderCount30Days }}
                    </view>
                </view>
                <view class="cont_txt">
                  <view class="box_fl">
                      <view class="mer_price" v-if="item.zero_credits && item.credits">
                          <image class="price_icon" src="../static/price_icon.png" mode="scaleToFill" ></image>
                          {{ item.face_value }}元券
                      </view>
                      <view class="txt_ov_ell1">
                        {{ item.title }}
                      </view>
                  </view>
                  <van-icon class="cont_txt-icon" name="arrow" size="28rpx" color="#999" />
                </view>
                <!-- 关闭标签的展示 -->
                <view class="cont_remind txt_ov_ell1" v-if="item.labelName && false" >
                  <block v-for="(labelItem, idx) in item.labelName" :key="idx">
                    <text :class="{ reactive: !idx }">{{ labelItem }}</text>
                    <text class="label_point" v-if="idx < item.labelName.length - 1">·</text>
                  </block>
                </view>
              </view>
              <!-- 底部操作按钮 -->
              <view class="bottom-tools">
                <view class="bottom-tools-left">
                  <view class="collection-btn">
                    <button open-type="share" class="share_btn" :data-item="item" ></button>
                    <image class="collection-btn-icon" :src="subImgUrl + '/002.png'" mode="widthFix"></image>
                    <text>分享</text>
                  </view>
                  <!-- 收藏按钮 -->
                  <view  class="collection-btn" @click="collectHandle(item, index)" >
                    <image class="collection-btn-icon" mode="widthFix"
                      :src=" item.collect ? `${subImgUrl}/002_active.jpg` : `${subImgUrl}/001.png`"></image>
                    <text>{{ item.collect ? "已收藏" : "收藏" }}</text>
                  </view>
                </view>
                <view class="bottom_btn fl_col_cen" @click="getBtnHandle(item)">
                  <block v-if="!item.credits">立即购买</block>
                  <block v-else>
                    去领取
                    <view class="bottom_btn-price" v-if="!index">
                      券后¥{{ item.lowestCouponPrice || item.price }}
                    </view>
                  </block>
                </view>
              </view>
            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>
<script>
import {
  bysubunionid,
  goodsQuery,
  toggleCollect,
} from "@/api/modules/jsShop.js";
import {
  goodsDetail,
  goodsPromotion,
  goodsSearch,
  toggleCollect as pddToggleCollect
} from '@/api/modules/pddShop.js';
import { getNavbarData } from "@/components/xhNavbar/xhNavbar.js";
import { getImgUrl } from "@/utils/auth.js";
import shareMixin from '@/utils/mixin/shareMixin.js'; // 混入分享的混合方法
import { mapGetters } from "vuex";
let timer = null;
export default {
    mixins: [shareMixin], // 使用mixin
    data() {
      return {
        imgUrl: getImgUrl(),
        feedList: [],
        current: 0,
        autoplay: false, // 不自动播放
        interval: 2000, // 自动切换时间间隔
        duration: 500, // 滑动动画时长
        screenWidth: 375,
        screenHeight: 812,
        navBarHeight: 0,
        topHeight: 0,
        skuId: 0,
        params: {
            page: 1,
        },
        goods_sign:'',
        goods_id:'',
        shop_type: 2,
        total_count: 0,
        isTouch: false,
        nextMargin: 0,
        sourceUrl: "", // 来源url
        is_popover: 0, // 弹窗推广位ID
        positionId: 0, // 首页推广位ID
        subImgUrl: `${getImgUrl()}static/subPackages/shopMallModule`,
        has_coupon: 0
      };
    },
    computed: {
      ...mapGetters([
          "userInfo"
      ]),
    },
    onLoad(options) {
        // 获取屏幕宽度
        let system = uni.getSystemInfoSync();
        this.screenWidth = system.screenWidth || 375;
        this.screenHeight = system.screenHeight || 812;
        if (options.cid1) {
          this.params.cid1 = options.cid1;
          this.params.cid3 = options.cid3;
          this.params.size = 3;
        }
        if (options.skuId) {
          this.skuId = options.skuId;
        }
        if (options.sourceUrl) {
          this.sourceUrl = options.sourceUrl;
        }
        if (options.is_popover) {
          this.is_popover = options.is_popover;
        }
        if (options.positionId) {
          this.positionId = options.positionId;
        }
        if(options.has_coupon) {
          this.has_coupon = Number(options.has_coupon);
        }
        // 拼多多商品
        if (options.goods_sign) {
        this.goods_sign = options.goods_sign;
        this.params.positionId = options.positionId;
        this.params.size = 10;
        this.shop_type = 3
        }
        getNavbarData().then((res) => {
        let { navBarHeight, statusBarHeight } = res;
        this.navBarHeight = navBarHeight;
        this.topHeight = statusBarHeight;
        });
        this.$nextTick(() => {
          this.getNextMargin(0, 1000);
        });
    },
    async mounted() {
        // 京东的skuId
        if (this.skuId) {
          const res = await goodsQuery({
              ...this.params,
              skuIds: this.skuId,
              is_popover: this.is_popover,
              positionId: this.positionId,
              has_coupon: this.has_coupon
          });
          this.feedList = res.data.list;
        }
        if (this.goods_sign) {
            const detRes = await goodsDetail({ goods_sign: this.goods_sign });
            this.params.cat_id = detRes.data.cat_id;
            if(detRes.code == 1 && detRes.data) {
              this.feedList.push(detRes.data);
              this.goods_id = detRes.data.goods_id;
            }
        }
        this.getFeedList();
    },
  methods: {
    getNextMargin(index = 0, time = 0) {
      const contDomHeight = 504 + uni.upx2px(278) + 16;
      this.nextMargin = this.screenHeight - contDomHeight;
    },
    getFeedList() {
        if (this.total_count) {
          this.params.page += 1;
          if (this.feedList.length > this.total_count && this.params.page > 2)
          return;
        }
        // 拼多多列表
        if(this.shop_type == 3)  return this.requestPddFun();
        this.requestJdFun();
    },
    async requestPddFun() {
        const res = await goodsSearch(this.params);
        if (res.code != 1) return;
        let { list, total_count} = res.data;
        // 排除首个相同的数据
        list = list.filter((res) =>  res.goods_id != this.goods_id);
        this.feedList = this.feedList.concat(list).map((res) => {
          return {
            ...res,
            contHeight: this.screenWidth,
            bannerCurrIndex: 0,
          };
        });
        this.total_count = total_count;
        this.feedList[this.current].contHeight = 504; // 盒子的高度
        if (this.feedList.length <= 2) this.getFeedList();

    },
    async requestJdFun() {
        const res = await goodsQuery(this.params)
        if (res.code != 1) return;
        let list = res.data.list || [];
        let total_count = res.data.total_count;
        if (list.length < this.params.size) {
            this.params.cid3 = null;
            const resItem = await goodsQuery(this.params);
            list = resItem.data.list || [];
            total_count = resItem.data.total_count;
        }
        // 排除首个相同的数据
        list = list.filter((res) => res.skuId != this.skuId);
        this.feedList = this.feedList.concat(list).map((res) => {
            return {
            ...res,
            contHeight: this.screenWidth,
            bannerCurrIndex: 0,
            };
        });
        this.total_count = total_count;
        this.feedList[this.current].contHeight = 504; // 盒子的高度
        if (this.feedList.length <= 2) this.getFeedList();
    },
    bannerSwiperChange(event) {
      const current = this.current;
      this.feedList[current].bannerCurrIndex = event.detail.current;
    },
    startHandle() {
      this.isTouch = true;
    },
    endHandle() {},
    animationfinish(event) {
      this.current = event.detail.current;
      this.feedList.forEach((ele, index) => {
        if (index <= this.current) {
          ele.contHeight = 504; // 盒子的高度
        } else {
          ele.contHeight = this.screenWidth; // 盒子的高度
        }
      });
      if (this.current >= this.feedList.length - 2) {
        this.getFeedList();
      }
    },
    transitionHandle(event) {
      if (!this.isTouch) return;
      const screenHeight = event.detail.dy;
      const currentIndex = this.current + 1;
      const hightS = screenHeight / currentIndex;
      let contHeight = parseInt(this.screenWidth + hightS * 12);
      contHeight = contHeight > 504 ? 504 : contHeight;
      if (screenHeight < 0) return;
      if (currentIndex >= this.feedList.length) return;
      if (timer) return;
      this.feedList[currentIndex].contHeight = contHeight;
      clearTimeout(timer);
      timer = null;
    },
    async collectHandle(item, index) {
        const { skuId, goods_sign, goods_id} = item;
        let api = toggleCollect
        let params = { skuId };
        if(this.shop_type == 3) {
            params = { goods_sign, goods_id };
            api = pddToggleCollect;
        }
        const res = await api(params);
        this.feedList[index].collect = !this.feedList[index].collect;
        this.$toast(res.msg);
    },
    startCounting(startNum, targetNum) {
      if (startNum == targetNum) return;
      this.isTouch = false;
      var targetNumber = targetNum;
      var currentNumber = startNum;
      var step = (targetNumber - currentNumber) / 20; // 设定步长
      var interval = setInterval(() => {
        currentNumber += step;
        this.nextMargin = currentNumber;
        if (currentNumber.toFixed(2) === targetNumber.toFixed(2)) {
          clearInterval(interval);
        }
      }, 10);
    },
    changeHandle(event) {},
    // 去领取
    async getBtnHandle(item) {
        const { skuId, positionId, goods_sign,lx_type, is_flow } = item;
        let api = bysubunionid
        let params = { skuId, positionId }
        // 拼多多
        if(this.shop_type == 3) {
          params = { goods_sign };
          api = goodsPromotion;
        }
        const skuItem = await api(params);
        if (skuItem.code != 1) return this.$toast(skuItem.msg);
        // 中转详情页
        if (is_flow == 2) {
          this.$go(`/pages/shopMallModule/productDetails/index?lx_type=${lx_type}&queryId=${goods_sign || skuId}&positionId=${positionId}`);
          return;
        }
        const { type_id, jdShareLink, mobile_url } = skuItem.data;
        this.$openEmbeddedMiniProgram({
            appId: type_id,
            path: jdShareLink || mobile_url,
        });
    },
    navBack() {
      const sourceUrl = this.sourceUrl;
      this.$leftBack( 1, sourceUrl || "/pages/tabBar/shopMall/index");
    },
  },
};
</script>

<style lang="scss">
@import url("@/components/u-parse/u-parse.css");
page {
  background-color: #222222;
  overflow: hidden;
}
.item_box {
  position: relative;
  width: 100%;
  height: 100vh;
}
.coupon-details {
  width: 100vw;
  min-height: 50vh;
  overflow: hidden;
  border-radius: 0rpx 0rpx 32rpx 32rpx;
}
.item_list {
  height: 80%;
}
.icon_box {
  position: fixed;
  left: 25rpx;
  display: flex;
  align-items: center;
  z-index: 9;
  .icon_box-icon {
    width: 56rpx;
    height: 56rpx;
  }
}

.remind_box {
  padding: 0 40rpx;
  height: 68rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 0;
  font-size: 26rpx;
  color: #f84842;
  line-height: 36rpx;
  .remind_left {
    display: flex;
    align-items: center;
    .left_icon {
      width: 36rpx;
      height: 36rpx;
      margin-right: 10rpx;
    }
  }
  .remind_right {
    font-weight: 600;
  }
}
.bottom-tools {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  position: relative;
  border-top: 2rpx solid #e9e9e9;
  padding: 13rpx 0 24rpx;
  .bottom-tools-left {
    display: flex;
    height: 80rpx;
  }
  .bottom_btn {
    width: 208rpx;
    height: 80rpx;
    background: linear-gradient(135deg, #f97f02, #f04037);
    border-radius: 40rpx;
    font-size: 28rpx;
    font-weight: 600;
    text-align: center;
    color: #ffffff;
    .bottom_btn-price {
      font-size: 24rpx;
      line-height: 34rpx;
      font-weight: 400;
    }
  }
}

.collection-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  text-align: center;
  color: #666666;
  line-height: 36rpx;
  margin-right: 22rpx;
  position: relative;
  min-width: 80rpx;
  .share_btn {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}

.collect {
  background-color: #ffc654;
  color: #ffffff;
  border-color: transparent;
}

.collection-btn-icon {
  flex: 0 0 46rpx;
  width: 46rpx;
  height: 46rpx;
  margin-bottom: 4rpx;
}
.get-phone {
  width: 408rpx;
  height: 88rpx;
  position: absolute;
  right: 32rpx;
  top: 32rpx;
  z-index: 1;
  opacity: 0;
}
.redeem-now {
  width: 408rpx;
  height: 88rpx;
  padding: 0 40rpx;
  box-sizing: border-box;
  background: #f84842;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  color: #ffffff;
  &.redeem-no_active {
    background: #fba3a0;
  }
  .redeem-now-txt {
    flex: 1;
    text-align: center;
  }
}
.redeem-now-left {
  display: flex;
  align-items: baseline;
}
.icon_middle {
  width: 2rpx;
  height: 20rpx;
  background: #ffffff;
  border-radius: 2rpx;
}

.rnl-value {
  font-size: 40rpx;
  font-family: PingFang SC, PingFang SC-6;
  font-weight: 600;
  text-align: left;
}

.rnl-label {
  font-size: 24rpx;
  font-weight: 500;
  font-family: PingFang SC, PingFang SC-6;
}

.redeem-now-right {
  font-size: 28rpx;
  font-family: PingFang SC, PingFang SC-6;
  font-weight: 600;
  color: #ffffff;
}

.sph-box {
  width: 100%;
  max-height: 504px;
  transition: all 0.3s;
  font-size: 0;
  position: relative;
  .sph-item {
    width: 100%;
  }
  .swiper_banner {
    position: relative;
    height: 100%;
    width: 100%;
    z-index: 0;
    .swiper_item {
      transform: all 2s;
      border-radius: 32rpx 32rpx 0 0;
      overflow: hidden;
    }
    .banner_img-bg {
      width: 100%;
      height: 362rpx;
      position: absolute;
      top: 0;
      right: 0;
      z-index: -1;
      background: rgba(0, 0, 0, 0.14);
      filter: blur(16px) contrast(0.8);
      border-radius: 32rpx;
    }
    .banner_img {
      position: absolute;
      bottom: 0;
    }
  }
  .swiper_banner-num {
    position: absolute;
    bottom: 32rpx;
    right: 0;
    width: 88rpx;
    line-height: 44rpx;
    background: rgba(0, 0, 0, 0.35);
    border-radius: 30rpx 0rpx 0rpx 30rpx;
    font-size: 26rpx;
    text-align: center;
    color: #ffffff;
  }
}
.cont_box {
  padding: 32rpx 0 16rpx;
  .cont_vip{
    font-size: 32rpx;
    font-weight: 600;
    text-decoration: line-through;
    color: #e7331b;
    .price_vip{
        width: 218rpx;
        height: 40rpx;
        margin-left: 16rpx;
        margin-top: -8rpx;
    }
  }
  .cont_no-credits {
    font-size: 48rpx;
    font-weight: 600;
    color: #e7331b;
  }
  .cont_price {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .cont_price-right {
      font-size: 26rpx;
      color: #999999;
      line-height: 36rpx;
    }
  }
  .cont_price-left {
    display: flex;
    align-items: flex-end;
    color: #ea3e34;
    font-size: 28rpx;
    line-height: 40rpx;
    .price_left-cr {
      font-size: 48rpx;
      font-weight: 500;
      color: #ea3e34;
      line-height: 55rpx;
      margin-right: 4rpx;
    }
  }
  .mer_price {
    padding: 0 22rpx;
    font-size: 26rpx;
    line-height: 44rpx;
    margin-left: 14rpx;
    position: relative;
    z-index: 0;
    font-weight: 600;
    text-align: center;
    color: #ffffff;
    box-sizing: border-box;
    .price_icon {
      height: 44rpx;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
    }
  }
  .cont_txt {
    font-size: 32rpx;
    font-weight: 600;
    color: #333333;
    line-height: 44rpx;
    margin-top: 14rpx;
    position: relative;
    display: flex;
    justify-content: space-between;
    .box_fl{
      width: 100%;
      .mer_price{
        white-space: nowrap;
        margin: 0 16rpx 0 0;
      }
    }
  }
}
.cont_remind {
  font-size: 24rpx;
  text-align: left;
  color: #999999;
  line-height: 34rpx;
  margin-top: 16rpx;
  .reactive {
    color: #ea3e34;
  }
  .label_point {
    padding: 0 5rpx;
  }
}
.cont_bottom {
  padding: 0 32rpx;
  background: #fff;
}
</style>
