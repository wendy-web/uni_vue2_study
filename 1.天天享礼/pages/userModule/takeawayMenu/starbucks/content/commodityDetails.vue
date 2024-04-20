<template>
<view>
  <van-popup
    :show="isShow"
    @close="popupClose"
    position="bottom"
    custom-style="overflow: inherit;background: transparent;"
    round
    safe-area-inset-bottom
    :catchtouchmove="isCatchtouchmove"
  >
  <view class="detail_box"
    :style="{
      '--height': isCatchtouchmove ? '70vh' : 'auto',
      '--padding': isMaxPadding ? '1rpx' : '0'
    }"
  >
    <image class="close_icon" :src="takeImgUrl + '/close_icon.png'" mode="aspectFill" @click="popupClose"></image>
    <scroll-view
        :scroll-y="true"
        class="detail_cont"
	    :scroll-into-view="scrollTopId"
        :scroll-top="scrollTopValue"
        :scroll-with-animation="isAnimation"
        @scroll="scrollHandle"
        id="scrollDom"
    >
        <image class="star_detail-icon" :src="takeImgUrl +'/star_detail-icon.png'" mode="'scaleToFill'"></image>
        <view class="det_title fl_center" id="scrollTopId">
            <view class="det_img fl_center">
            <image class="widHei" :src="config.defaultImage" mode="widthFix"></image>
            </view>
            <view class="det_txt fl1">
            <view>{{config.name}}</view>
            <view class="price_num">
                <text style="font-size: 24rpx">¥</text>
                {{ totalPrice }}
                <text class="price_num-old">¥{{ originalPrice }}</text>
            </view>
            </view>
        </view>
        <!-- 选择列表 -->
        <view class="det_list" v-if="optionalList.length">
            <view
                v-for="(itemPer, index) in optionalList"
                :key="index"
                class="det_list-item"
            >
                <view class="list_lab">{{itemPer.title}}</view>
                <view class="list_items box_fl">
                    <view class="item_box txt_ov_ell1"
                        v-for="(item, idx) in itemPer.list"
                        :key="idx"
                        :class="{ 'active': itemPer.selectIndex == idx, 'enActive': item.enable }"
                        @click="selItemHandle(index,idx)"
                    >
                    {{item.cupSize}}
                    <!-- <block v-if="item.salesPrice">{{ item.salesPrice }}元</block> -->
                    </view>
                </view>
            </view>
        </view>
    </scroll-view>
    <!-- 加入购物车 -->
    <view class="add_box">
        <!-- scroll Top的导航 -->
        <view class="scroll_box fl_center"
            v-if="isShowScrollBtn && isCatchtouchmove"
            @click="scrollDownHandle"
        >
            <image class="scroll_icon" :src="takeImgUrl +'/scroll_icon.png'" mode="'scaleToFill'"></image>
        </view>
        <view class="add_sel fl_bet">
          <view class="price_num fl_center">
            <text style="font-size: 24rpx;line-height: 32rpx;align-self:flex-end;">¥</text>
            {{totalPrice}}
            <view class="spare_num">
                <image class="bg_img" :src="takeImgUrl + '/spare_num_bg.png'" mode="'scaleToFill'"></image>
                已省¥{{ (originalPrice - totalPrice).toFixed(2) }}
            </view>
          </view>
          <view class="num_box fl_center">
            <image class="num_icon" :src="takeImgUrl + '/star_sub.png'" mode="aspectFill" @click="subHandle"></image>
            <view class="num_txt">{{ currenComNum }}</view>
            <image class="num_icon" :src="takeImgUrl + '/star_add.png'" mode="aspectFill" @click="addHandle"></image>
          </view>
        </view>
        <view class="add_btn-box fl_bet">
          <view class="add_btn btn_buy" @click="buyHandle" v-if="isShowBuyBtn">立即购买</view>
          <view class="add_btn btn_add" @click="addCartHandle">加入购物车</view>
        </view>
      </view>
  </view>
  </van-popup>
</view>
</template>

<script>
import { orderCar } from '@/api/modules/takeawayMenu/kfc.js';
import { getImgUrl } from '@/utils/auth.js';
import { mapActions, mapGetters } from 'vuex';
export default {
  props: {
    isShowBuyBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      takeImgUrl: getImgUrl() + '/static/subPackages/userModule/takeawayMenu',
      currenComNum: 1, // 当前数量
      isShow: false,
      config: {},
      sku_infos: [],
      specifications: [],
      checkedList: [],
      tabIndex: 0,
      currentIndex: 0,
      requiredList: [], // 已选中的商品
      optionalList: [], // 可选的商品列表
      scrollTopId: '',
      scrollTopValue: 0,
      scrollDomHeight: 0,
      scroll_top: 0,
      isAnimation: true
    }
  },
  computed: {
    ...mapGetters(['brand_id']),
    isMaxPadding() {
      if(this.optionalList.length >= 3) return true;
      return false;
    },
    totalPrice() {
      let user_price = this.config.salesPrice;
      if(this.optionalList.length) {
        const { selectIndex, list } = this.optionalList.find(res => res.tag == 'cupSize')
        user_price = list[selectIndex].salesPrice;
      }
      return Number(user_price).toFixed(2);
    },
    originalPrice() {
      let user_price = this.config.marketPrice;
      if(this.optionalList.length) {
        const { selectIndex, list } = this.optionalList.find(res => res.tag == 'cupSize')
        user_price = list[selectIndex].marketPrice;
      }
      return Number(user_price).toFixed(2);
    },
    product_id() {
      return this.config.id;
    },
    isShowScrollBtn() {
        let isShow = this.optionalList.length;
        if(this.scroll_top && (this.scroll_height - this.scroll_top <= (this.scrollDomHeight + 20))) {
            isShow = false;
        }
        return isShow;
    },
    isCatchtouchmove() {
        let isScroll = this.optionalList.length>=4;
        const findItem = this.optionalList.findIndex(res => res.list.length > 3);
        if(this.optionalList.length==3 && findItem >= 0){
            isScroll = true;
        }
        return isScroll
    },
    currentSelObj() {
        const currentSelObj = {}
        this.optionalList.forEach(res => {
            const { tag, list, selectIndex } = res;
            currentSelObj[tag] = list[selectIndex].cupSize
        })
        return currentSelObj
    }
  },
  methods: {
    ...mapActions({
      requestCarList: 'cart/requestCarList',
    }),
    updateIndex(tabIndex, index) {
      this.tabIndex = tabIndex;
      this.currentIndex = index;
    },
    async popupShow(item,tabIndex =0, index=0) {
        this.requiredList = [];
        this.optionalList = [];
        this.scrollTopId = 'scrollTopId';
        this.isAnimation = true;
        this.config = item;
        const { itemGroups, cupSizeArr } = item;
        this.requiredList = itemGroups || [];
        this.optionalList = cupSizeArr.map(res => ({
            ...res,
            selectIndex: 0
        }))
        this.tabIndex = tabIndex;
        this.currentIndex = index;
        this.isShow = true;
        setTimeout(async () => {
            const scrollDom = await this.warpRectDom('scrollDom');
            this.scrollDomHeight = scrollDom.height;
        }, 2000);
    },
    selItemHandle(index, idx) {
      this.optionalList[index].selectIndex = idx;
    },
    selHandle(itemList, index, idx) {
      if(itemList.disable) return;
      const typeList =  this.specifications[index].ingredients;
      const selName = typeList[idx].name;
      typeList.forEach((res, itemIndex) => {
        if(idx == itemIndex) {
          res.checked = true;
          return;
        }
        res.checked = false;
      });
      const notList =[];
      this.sku_infos.map(res => {
        res.values.forEach((item, index) => {
          if(item.spec_name != selName ) {
            notList.push(item)
          }
        });
      });
      const checkedList = this.specifications.map((item,index) => {
        const checkedItem =  item.ingredients.find(res => {
          return res.checked;
        });
        return checkedItem.name;
      });
      this.checkedList = checkedList;

      this.specifications.forEach(res => {
        res.ingredients.forEach(itemRes => {
          itemRes.disable = !notList.some(res => res.spec_name == itemRes.name);
        });
      });
    },
    popupClose() {
        this.isAnimation = false;
        this.scrollDomHeight = 0;
        this.scrollTopValue = 1;
        this.isShow = false;
        this.$emit('close');
    },
    subHandle() {
      if(this.currenComNum == 1) return;
      this.currenComNum -= 1;
    },
    addHandle() {
      this.currenComNum += 1
    },
    buyHandle() {
      const currentObj = {
        num: this.currenComNum,
        productId: this.config.id,
      }
      this.optionalList.forEach(res => {
        const { tag, list, selectIndex } = res;
        currentObj[tag] = list[selectIndex].cupSize
      })
      let products = [currentObj];
      this.$emit('imBuy', products);
      this.isShow = false;
    },
    // 加入购物车
    addCartHandle() {
      const params = {
        brand_id: this.brand_id,
        product_id: this.product_id,
        amount: this.currenComNum,
        is_car: 1,
        product_details: [this.currentSelObj]
      };
      this.addOrderCar(params);
      this.$emit('editCart', {
        tabIndex: this.tabIndex,
        ItemIndex: this.currentIndex,
        currenComNum: this.currenComNum
      });
    },
    // 编辑订单的接口访问
    async addOrderCar(params) {
      const res = await orderCar(params);
      if(res.code != 1) return this.$toast(res.msg);
      this.requestCarList({ brand_id: this.brand_id });
      this.isShow = false;
    },
    async editOrderCar({
      product_id,
      amount
    }, editCart) {
      const params = {
        brand_id: this.brand_id,
        product_id,
        amount
      };
      this.addOrderCar(params);
      const { tabIndex, index, currenComNum } = editCart;
      this.$emit('editCart', {
        tabIndex,
        ItemIndex: index,
        currenComNum
      });
    },
    scrollHandle(event) {
        const { scrollTop, scrollHeight } = event.detail;
        this.scroll_top = scrollTop;
        this.scroll_height = scrollHeight;
    },
    scrollDownHandle() {
        this.scrollTopValue = this.scroll_top +  this.scrollDomHeight;
    },
    warpRectDom(idName) {
        return new Promise(resolve => {
            setTimeout(() => { // 延时确保dom已渲染, 不使用$nextclick
                let query = uni.createSelectorQuery();
                // #ifndef MP-ALIPAY
                query = query.in(this) // 支付宝小程序不支持in(this),而字节跳动小程序必须写in(this), 否则都取不到值
                    // #endif
                query.select('#'+idName).boundingClientRect(data => {
                    resolve(data)
                }).exec();
            }, 20)
        })
    },
  },
}
</script>

<style scoped lang="scss">
@import '@/static/css/mixin.scss';
.detail_box {
  position: relative;
  height: var(--height);
  display: flex;
	flex-direction: column;
  // padding-bottom: constant(safe-area-inset-bottom);
  // padding-bottom: env(safe-area-inset-bottom);
  // padding-bottom: calc(var(--padding) + constant(safe-area-inset-bottom));
  // /* 兼容 IOS<11.2 */
  // padding-bottom: calc(var(--padding) + env(safe-area-inset-bottom));
  box-sizing: border-box;
  .close_icon {
    width: 52rpx;
    height: 52rpx;
    flex: 0 0 52rpx;
    padding: 16rpx;
    margin: 0 24rpx 4rpx auto;
    display: block;
  }
}
.detail_cont {
  background: #fff;
  border-radius: 32rpx 32rpx 0rpx 0rpx;
  position: relative;
  z-index: 0;
  // height: 100%;
  flex: 1;
  overflow: scroll;
  padding: 0 32rpx;
  box-sizing: border-box;
  .star_detail-icon{
    width: 318rpx;
    height: 220rpx;
    position: absolute;
    top: 0;
    right: -32rpx;
    z-index: -1;
  }
}
.det_title {
  padding-top: 48rpx;
  margin-bottom: 64rpx;
  .det_img {
    width: 144rpx;
    height: 144rpx;
    margin-right: 24rpx;
  }
  .det_txt{
    align-self: stretch;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}
.price_num{
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  line-height: 34rpx;
  .price_num-old{
    text-decoration:line-through;
    font-size: 26rpx;
    font-weight: 400;
    text-align: left;
    color: #aaaaaa;
    line-height: 36rpx;
    margin-left: 16rpx;
  }
  .price_num-dis {
    height: 36rpx;
    line-height: 36rpx;
    padding: 0 8rpx;
    position: relative;
    z-index: 0;
    font-size: 22rpx;
    color: #F95731;
    margin-left: 16rpx;
    .coupon_price {
      margin-left: 20rpx;
      min-width: 56rpx;
      display: inline-block;
      color: #fff;
      text-align: center;
    }
  }
}
.det_list {
//   margin-bottom: 40rpx;
  color: #333;
  .det_list-item {
    padding-bottom: 40rpx;
  }
  .list_items {
    flex-wrap: wrap;
  }
  .list_lab{
    font-size: 36rpx;
    line-height: 50rpx;
    margin-bottom: 28rpx;
  }
  .item_box {
    box-sizing: border-box;
    margin-right: 15rpx;
    width: 218rpx;
    height: 88rpx;
    border-radius: 16rpx;
    font-size: 28rpx;
    line-height: 88rpx;
    color: #999;
    text-align: center;
    &:nth-child(3n) {
      margin-right: 0;
    }
    // &:nth-child(-n+3) {
    //   margin-bottom: 40rpx;
    // }
    &.active {
        color: #333;
        background: #f2f2f2;
        transition: all .3s;
    }
    .price_num {
      margin: 8rpx 0 24rpx;
      width: 100%;
      padding: 0 30rpx;
      box-sizing: border-box;
    }
    .item_img-box{
      width: 100%;
      height: 160rpx;
      position: relative;
      background: #fff;
      border-radius: 8rpx;
      .item_img {
        width: 100%;
        height: 100%;
      }
    }
    .item_txt{
      width: 100%;
      margin-top: 16rpx;
      font-size: 26rpx;
      font-weight: 500;
      color: #333;
      line-height: 36rpx;
      text-align: center;
      min-height: 72rpx;
    }
  }
}
.add_box {
  width: 100%;
  background: #ffffff;
  box-shadow: 0rpx -6rpx 16rpx 0rpx rgba(0,0,0,0.06);
  padding: 0 40rpx 20rpx;
  box-sizing: border-box;
  position: relative;
  z-index: 0;
  &::after {
    content: '\3000';
    position: absolute;
    bottom: -128rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 100vw;
    height: 128rpx;
    background: #fff;
    z-index: -1;
  }
  .add_sel {
    .num_box {
      padding: 36rpx 0;
      .num_icon{
        width: 44rpx;
        height: 44rpx;
      }
      .num_txt{
        font-size: 30rpx;
        font-weight: 600;
        text-align: center;
        color: #333333;
        line-height: 42rpx;
        margin: 0 25rpx;
      }
    }
  }
}
.add_btn-box{
  .add_btn{
    height: 88rpx;
    line-height: 88rpx;
    border-radius: 44rpx;
    text-align: center;
    font-size: 28rpx;
    font-weight: 600;
    flex: 1;
    &.btn_buy{
      border: 2rpx solid;
      margin-right: 30rpx;
      color: $starbucksColor;
    }
    &.btn_add{
      color: #fff;
      background: $starbucksColor;
    }
  }
}

.spare_num {
    position: relative;
    z-index: 0;
    white-space: nowrap;
    height: 32rpx;
    border-radius: 8rpx;
    margin-top: 8rpx;
    font-weight: 600;
    box-sizing: border-box;
    height: 28rpx;
    font-size: 20rpx;
    color: #c2a762;
    line-height: 28rpx;
    padding: 0 14rpx 0 12rpx;
    display: inline-block;
    margin-left: 16rpx;
}
.scroll_box{
    width: 160rpx;
    height: 48rpx;
    background: #ffffff;
    border-radius: 28rpx;
    box-shadow: 0rpx 0rpx 8rpx 2rpx rgba(0,0,0,0.08);
    position: absolute;
    top: -64rpx;
    left: 50%;
    transform: translateX(-50%);
    .scroll_icon{
        width: 34rpx;
        height: 24rpx;
    }
}
</style>
