<template>
<view>
  <van-popup
    :show="isShow"
    @close="popupClose"
    position="bottom"
    custom-style="overflow: inherit;background: transparent;max-height:75vh;"
    round
    safe-area-inset-bottom
    :catchtouchmove="(optionalList.length>=4)"
  >
  <view class="detail_box"
    :style="{
      '--height': (optionalList.length>=4) ? '70vh' : 'auto',
      '--padding': isMaxPadding ? '1rpx' : '0'
    }"
  >
    <image class="close_icon" :src="takeImgUrl + '/close_icon.png'" mode="aspectFill" @click="popupClose"></image>
    <scroll-view
      :scroll-y="true"
      class="detail_cont"
      :style="{ '--padding': isMaxPadding ? '216rpx' : '136rpx' }"
		  :scroll-into-view="scrollTopId"
    >
      <view class="det_title fl_center" id="scrollTopId">
        <view class="det_img fl_center">
          <image class="widHei" :src="selProductImageUrl" mode="widthFix"></image>
        </view>
        <view class="det_txt fl1">
          <view>{{config.productName}}</view>
          <view class="price_num">
            <text style="font-size: 24rpx">¥</text>
            {{ totalPrice }}
            <text class="price_num-old">¥{{ originalPrice }}</text>
          </view>
        </view>
      </view>
      <!-- 选择列表 -->
      <view class="list_items box_fl" v-if="optionalList.length">
        <view class="item_box fl_col_cen"
          v-for="(item, index) in optionalList"
          :key="index"
          :class="{ 'active': selIndex == index, 'enActive': item.enable }"
          @click="selItemHandle(index)"
        >
          <image class="md_active" :src="takeImgUrl + '/kfc_active.png'" mode="widthFix"></image>
          <view class="item_img-box fl_center">
            <image class="item_img" :src="item.productImageUrl" mode="widthFix"></image>
          </view>
          <view class="item_txt txt_ov_ell2">{{item.productName}}</view>
          <view class="price_num">
            <text style="font-size: 24rpx">¥</text>
            {{ item.price || 0 }}
          </view>
        </view>
      </view>
    </scroll-view>
    <!-- 加入购物车 -->
    <view class="add_box">
        <view class="add_sel fl_bet">
          <view class="price_num fl_center">
            <text style="font-size: 24rpx;line-height: 32rpx;align-self:flex-end;">¥</text>
            {{totalPrice}}
            <view class="spare_num box_fl">
              <text class="spare_num-txt">已省</text>
              <text class="spare_num-price">¥{{ (originalPrice - totalPrice).toFixed(2) }}</text>
            </view>
          </view>
          <view class="num_box fl_center">
            <image class="num_icon" :src="takeImgUrl + '/md_sub_icon.png'" mode="aspectFill" @click="subHandle"></image>
            <view class="num_txt">{{ currenComNum }}</view>
            <image class="num_icon" :src="takeImgUrl + '/kfc_add.png'" mode="aspectFill" @click="addHandle"></image>
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
import { mapActions, mapGetters } from 'vuex';
import { getImgUrl } from '@/utils/auth.js';
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
      selIndex: 0,
      tabIndex: 0,
      currentIndex: 0,
      requiredList: [], // 已选中的商品
      optionalList: [], // 可选的商品列表
      scrollTopId: ''
    }
  },
  computed: {
    ...mapGetters(['brand_id']),
    isMaxPadding() {
      if(this.optionalList.length >= 4) return true;
      return false;
    },
    selProductImageUrl() {
      let imgUrl = this.config.productImageUrl;
      if(this.optionalList.length) {
        imgUrl = this.optionalList[this.selIndex].productImageUrl
      }
      return imgUrl;
    },
    totalPrice() {
      let user_price = this.config.price;
      if(this.optionalList.length) {
        user_price = this.optionalList[this.selIndex].price;
      }
      return Number(user_price).toFixed(2);
    },
    originalPrice() {
      let user_price = this.config.originalPrice;
      if(this.optionalList.length) {
        user_price = this.optionalList[this.selIndex].originalPrice;
      }
      return Number(user_price).toFixed(2);
    },
    product_id() {
      let product_id = this.config.productId;
      if(this.optionalList.length) {
        product_id = this.optionalList[this.selIndex].productId;
      }
      return product_id;
    },
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
      this.selIndex = 0;
      this.scrollTopId = 'scrollTopId';
      this.config = item;
      const { itemGroups, specGroups } = item;
      this.requiredList = itemGroups || [];
      this.optionalList = specGroups || [];
      this.tabIndex = tabIndex;
      this.currentIndex = index;
      this.isShow = true;
    },
    selItemHandle(index) {
      this.selIndex = index;
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
      let products = [{
        amount: this.currenComNum,
        product_id: this.product_id,
      }];
      this.$emit('imBuy', products);
      this.isShow = false;
    },
    // 加入购物车
    addCartHandle() {
      const params = {
        brand_id: this.brand_id,
        product_id: this.product_id,
        amount: this.currenComNum,
        is_car: 1
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
    }
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
  // height: 100%;
  flex: 1;
  overflow: scroll;
  padding: 0 32rpx;
  box-sizing: border-box;
}
.det_title {
  padding-top: 48rpx;
  margin-bottom: 56rpx;
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
.list_items {
  flex-wrap: wrap;
  margin-bottom: 40rpx;
  .item_box {
    width: 210rpx;
    box-sizing: border-box;
    border: 4rpx solid #f2f2f2;
    background: #f2f2f2;
    border-radius: 12rpx;
    margin-right: 20rpx;
    position: relative;
    margin-bottom: 40rpx;
    &:nth-child(3n) {
      margin-right: 0;
    }
    // &:nth-child(-n+3) {
    //   margin-bottom: 40rpx;
    // }
    &.active {
      background: #ffff;
      border-color: $kfcColor;
      border-radius: 12rpx;
      transition: all .3s;
      .md_active {
        opacity: 1;
      }
    }
    .price_num {
      margin: 8rpx 0 24rpx;
      width: 100%;
      padding: 0 30rpx;
      box-sizing: border-box;
    }
    .md_active{
      position: absolute;
      width: 32rpx;
      height: 32rpx;
      bottom: 26rpx;
      right: 20rpx;
      opacity: 0;
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
    border-radius: 20rpx;
    text-align: center;
    font-size: 28rpx;
    font-weight: 600;
    flex: 1;
    &.btn_buy{
      border: 2rpx solid #333;
      margin-right: 30rpx;
    }
    &.btn_add{
      color: #fff;
      background: $kfcColor;
    }
  }
}

.spare_num {
  min-width: 134rpx;
  line-height: 1;
  position: relative;
  z-index: 0;
  white-space: nowrap;
  width: 128rpx;
  // height: 32rpx;
  border: 1rpx solid #E40030;
  border-radius: 4rpx;
  font-size: 20rpx;
  font-weight: 600;
  color: #db0007;
  margin-left: 16rpx;
  box-sizing: border-box;
  padding: 1rpx;
  .spare_num-txt {
    display: inline-block;
    width: 54rpx;
    background: #e40030;
    border: 1rpx solid #fff;
    border-radius: 2rpx;
    text-align: center;
    color: #fff;
    box-sizing: border-box;
    height: 100%;
    line-height: 30rpx;
    border-radius: 2rpx;
  }
  .spare_num-price{
    flex: 1;
    text-align: center;
  }
}
</style>