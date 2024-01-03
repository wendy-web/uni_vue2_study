<template>
<van-popup
    :show="isShow"
    @close="popupClose"
    position="bottom"
    custom-style="overflow: inherit;background: transparent;max-height:75vh;"
    round
    safe-area-inset-bottom
  >
  <view class="detail_box" :style="{ '--padding': isMaxPadding ? '1rpx' : '0' }">
    <image class="close_icon" :src="takeImgUrl + '/close_icon.png'" mode="aspectFill" @click="popupClose"></image>
    <view class="detail_cont" :style="{ '--padding': isMaxPadding ? '216rpx' : '136rpx' }">
      <view class="det_title fl_center">
        <image class="det_img" :src="config.product_img" mode="aspectFill"></image>
        <view class="det_txt fl1">
          <view>{{config.product_name}}</view>
          <view class="price_num">
              <text style="font-size: 24rpx">¥</text>
              {{config.user_price}}
              <text class="price_num-old">¥{{ config.product_price }}</text>
            </view>
        </view>
      </view>
      <!-- 选择列表 -->
      <view class="det_list">
        <block
          v-for="(item, index) in specifications"
          :key="index"
        >
          <view class="list_lab">{{ item.name }} </view>
          <view class="list_items box_fl">
            <view
              v-for="(itemL, idx) in item.ingredients"
              :key="idx"
              :class="['item_box', itemL.checked ? 'active' : '', itemL.disable ? 'dia_active' : '']"
              @click="selHandle(itemL, index, idx)"
            >
              {{itemL.name}} <block v-if="itemL.price">{{ itemL.price }}元</block>
            </view>
          </view>
        </block>
      </view>
      <view class="add_box">
        <view class="add_sel fl_bet">
          <view class="price_num fl_center">
            <text style="font-size: 24rpx;line-height: 32rpx;align-self:flex-end;">¥</text>
            {{totalPrice}}
            <view class="price_num-dis coupon_price">
              <image class="bg_img" :src="takeImgUrl +'/cart_dis_bg1.png'" mode="scaleToFill"></image>
              <text>已省</text>
              <text class="coupon_price">￥{{config.coupon_price}}</text>
            </view>
          </view>
          <view class="num_box fl_center">
            <image class="num_icon" :src="takeImgUrl + '/sub_icon.png'" mode="aspectFill" @click="subHandle"></image>
            <view class="num_txt">{{ currenComNum }}</view>
            <image class="num_icon" :src="takeImgUrl + '/add_icon.png'" mode="aspectFill" @click="addHandle"></image>
          </view>
        </view>
        <view class="add_btn-box fl_bet">
          <view class="add_btn btn_buy" @click="buyHandle" v-if="isShowBuyBtn">立即购买</view>
          <view class="add_btn btn_add" @click="addCartHandle">加入购物车</view>
        </view>
      </view>
    </view>
  </view>
</van-popup>
</template>

<script>
import {
  menuDetails,
  orderCar
} from '@/api/modules/takeawayMenu/luckin.js';
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
      currenComNum: 1,
      isShow: false,
      config: {},
      sku_infos: [],
      specifications: [],
      checkedList: [],
      product_id: 0,
      tabIndex: 0,
      currentIndex: 0,
    }
  },
  computed: {
    ...mapGetters(['brand_id', 'resultList', 'restaurant_id']),
    isMaxPadding() {
      if(this.specifications.length >= 4) return true;
      return false;
    },
    // 选择列表中的code值
    sku_code() {
      const sku_infosObj = this.sku_infos.find(res => {
        return res.values.every((item, index) => res.values[index].spec_name == this.checkedList[index]);
      });
      return sku_infosObj && sku_infosObj.code;
    },
    totalPrice() {
      let user_price = this.config.user_price;
      this.specifications.map(item => {
        const checkedItem =  item.ingredients.find(res => res.checked);
        user_price += checkedItem.price;
      });
      return Number(user_price).toFixed(2);
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
    async popupShow(item, tabIndex, index) {
      const { product_id, isReturn } = item;
      this.product_id = product_id;
      this.tabIndex = tabIndex;
      this.currentIndex = index;
      const res = await menuDetails({
        brand_id: this.brand_id,
        restaurant_id: this.restaurant_id,
        product_id
      });
      if(res.code == 1) {
        this.config = res.data;
        this.currenComNum = this.config.car_num || 1;
        this.sku_infos = res.data.details.sku_infos;
        this.specifications = res.data.details.specifications;
        this.specifications.forEach(res => {
          res.ingredients.forEach(itemRes => {
            itemRes.disable = false;
          });
        });
        const checkedList = this.specifications.map(item => {
          const checkedItem =  item.ingredients.find(res => res.checked);
          return checkedItem.name;
        });
        this.checkedList = checkedList;
        this.isShow = true;
        return;
      }
      // 产品详情错误
      !isReturn && this.$emit('showError');
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
    buyHandle(){
      const products = [{
        amount: this.currenComNum,
        product_id: this.product_id,
        sku_code: this.sku_code
      }];
      this.$emit('imBuy', products);
      this.isShow = false;
    },
    addCartHandle() {
      const params = {
        brand_id: this.brand_id,
        restaurant_id: this.restaurant_id,
        product_id: this.product_id,
        amount: this.currenComNum,
        product_details: [
          {sku_code: this.sku_code}
        ]
      };
      orderCar(params).then(res=> {
        if(res.code == 1) {
          this.requestCarList({
            brand_id: this.brand_id,
            restaurant_id: this.restaurant_id,
          });
          this.$emit('addCart', {
            tabIndex: this.tabIndex,
            ItemIndex: this.currentIndex,
            currenComNum: this.currenComNum
          });
          this.isShow = false;
        }
      });
    }
  },
}
</script>

<style scoped lang="scss">
@import '@/static/css/mixin.scss';
.detail_box {
  position: relative;
  max-height: 75vh;
  display: flex;
	flex-direction: column;
  padding-bottom: calc(var(--padding) + constant(safe-area-inset-bottom));
  padding-bottom: calc(var(--padding) + env(safe-area-inset-bottom));
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
  overflow: scroll;
  flex: 1;
  padding: 0 32rpx 216rpx;
  padding-bottom: 236rpx;
  /* 兼容 IOS<11.2 */
  // padding-bottom: calc(216rpx +  env(safe-area-inset-bottom));
  // padding-bottom: calc(var(--padding) + constant(safe-area-inset-bottom));
  // /* 兼容 IOS<11.2 */
  // padding-bottom: calc(var(--padding) + env(safe-area-inset-bottom));
}
.det_title {
  padding-top: 48rpx;
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
  color: #f95731;
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
.det_list{
  margin-top: 56rpx;
  .list_lab{
    font-size: 26rpx;
    color: #aaaaaa;
    line-height: 36rpx;
    margin-bottom: 16rpx;
  }
  .list_items{
    margin-bottom: 40rpx;
    .item_box{
      min-width: 128rpx;
      padding: 0 10rpx;
      white-space: nowrap;
      height: 62rpx;
      background: #f7f7f7;
      border-radius: 4rpx;
      font-size: 26rpx;
      text-align: center;
      line-height: 62rpx;
      color: #666666;
      &:not(:last-child) {
        margin-right: 20rpx;
      }
      &.dia_active{
        background: #efefef;
        color: #aaa;
      }
      &.active {
        background: #eaeeff;
        color: $luckyColor;
      }
    }
  }
}
.add_box {
  position: fixed;
  width: 100%;
  background: #ffffff;
  box-shadow: 0rpx -6rpx 16rpx 0rpx rgba(0,0,0,0.06);
  left: 0;
  bottom: 0;
  padding: 0 40rpx 20rpx;
  box-sizing: border-box;
  padding-bottom:calc(20rpx +  constant(safe-area-inset-bottom));
  /* 兼容 IOS<11.2 */
  padding-bottom: calc(20rpx +  env(safe-area-inset-bottom));
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
    // width: 320rpx;
    height: 88rpx;
    line-height: 88rpx;
    border-radius: 44rpx;
    text-align: center;
    font-size: 28rpx;
    font-weight: 600;
    color: #ffffff;
    flex: 1;
    &.btn_buy{
      border: 2rpx solid #c2a379;
      color: #c2a379;
      margin-right: 30rpx;
    }
    &.btn_add{
      background: $luckyColor;
    }
  }
}
</style>