<template>
<view>
  <van-popup
    :show="isShow"
    @close="popupClose"
    position="bottom"
    custom-style="overflow: inherit;background: transparent;max-height:75vh;"
    round
    safe-area-inset-bottom
    :catchtouchmove="config.product_choose"
  >
  <view class="detail_box"
    :style="{
      '--height': config.product_choose ? '70vh' : 'auto',
      '--padding': isMaxPadding ? '1rpx' : '0'
    }"
  >
    <image class="close_icon" :src="takeImgUrl + '/close_icon.png'" mode="aspectFill" @click="popupClose"></image>
    <scroll-view
      :scroll-y="true"
      class="detail_cont"
      :style="{ '--padding': isMaxPadding ? '216rpx' : '136rpx' }"
    >
      <view class="det_title fl_center">
        <view class="det_img fl_center">
          <image class="widHei" :src="config.product_img" mode="widthFix"></image>
        </view>
        <view class="det_txt fl1">
          <view>{{config.product_name}}</view>
          <view class="price_num">
            <text style="font-size: 24rpx">¥</text>
            {{config.user_price}}
            <text class="price_num-old" v-if="!ticket_id">¥{{ config.product_price }}</text>
          </view>
        </view>
      </view>
      <!-- 默认列表 -->
      <view class="det_list" v-if="requiredList.length">
          <view class="list_lab">已包含</view>
          <view class="list_items box_fl">
            <view class="item_box fl_col_cen"
              v-for="(item, index) in requiredList"
              :key="index"
            >
              <view class="item_img-box fl_center">
                <image class="item_img" :src="item.product_img" mode="widthFix"></image>
              </view>
              <view class="item_txt txt_ov_ell2">
                {{item.product_name}}
                </view>
            </view>
          </view>
      </view>
      <!-- 选择列表 -->
      <block v-if="optionalList.length">
        <view
          v-for="(item, index) in optionalList"
          :key="index"
        >
        <view class="det_list det_list-sel">
          <view class="list_lab">{{ item.name }}</view>
          <view class="list_items box_fl">
            <view class="item_box fl_col_cen"
              v-for="(skuItem, idx) in item.sku_infos"
              :key="idx"
              :class="{ 'active': skuItem.checked, 'enActive': skuItem.enable }"
              @click="selItemHandle(index, idx)"
            >
              <view class="item_img-box fl_center">
                <image class="md_active" :src="takeImgUrl +'/md_active.png'" mode="widthFix"></image>
                <image class="item_img" :src="skuItem.img" mode="widthFix"></image>
              </view>
              <view class="item_txt txt_ov_ell1">{{skuItem.name}}</view>
              <view class="price_num">
                <text style="font-size: 24rpx">¥</text>
                {{ skuItem.price ||0 }}
              </view>
            </view>
          </view>
        </view>
        </view>
      </block>
    </scroll-view>
    <!-- 加入购物车 -->
    <view class="add_box">
        <view class="add_sel fl_bet">
          <view class="price_num fl_center">
            <text style="font-size: 24rpx;line-height: 32rpx;align-self:flex-end;">¥</text>
            {{ ticket_id ? 0 : totalPrice }}
            <view class="price_num-dis">
              {{ ticket_id ? '兑换券抵' : '已省' }}
              <text class="coupon_price">￥{{ ticket_id ? totalPrice : config.coupon_price }}</text>
            </view>
          </view>
          <view class="num_box fl_center" v-if="!ticket_id">
            <image class="num_icon" :src="takeImgUrl +'/md_sub_icon.png'" mode="aspectFill" @click="subHandle"></image>
            <view class="num_txt">{{ currenComNum }}</view>
            <image class="num_icon" :src="takeImgUrl +'/md_add_icon.png'" mode="aspectFill" @click="addHandle"></image>
          </view>
        </view>
        <view class="add_btn-box fl_bet">
          <view class="add_btn btn_buy" @click="buyHandle" v-if="ticket_id">立即点餐</view>
          <block v-else>
            <view class="add_btn btn_buy" @click="buyHandle" v-if="isShowBuyBtn">立即购买</view>
            <view class="add_btn btn_add" @click="addCartHandle">加入购物车</view>
          </block>
        </view>
      </view>
  </view>
  </van-popup>
</view>
</template>

<script>
import {
menuDetails,
orderCar
} from '@/api/modules/takeawayMenu/luckin.js';
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
      product_id: 0,
      tabIndex: 0,
      currentIndex: 0,
      requiredList: [], // 已选中的商品
      optionalList: [], // 可选的商品列表
      ticket_id: 0
    }
  },
  computed: {
    ...mapGetters(['brand_id', 'restaurant_id']),
    isMaxPadding() {
      if(this.requiredList.length >= 4 || this.optionalList.length >= 4 || (this.optionalList.length && this.optionalList.length )) return true;
      return false;
    },
    totalPrice() {
      let user_price = this.config.user_price;
      if(this.optionalList.length) {
        this.optionalList.forEach(res => {
          const itemCheck = res.sku_infos.find(skuRes => skuRes.checked);
          if(itemCheck && itemCheck.price){
            user_price += itemCheck.price;
          }
        });
      }
      return Number(user_price).toFixed(2);
    },
    product_details() {
      const detail = [];
      this.optionalList.forEach(res => {
        const skuFindItem = res.sku_infos.find(skuRes => skuRes.checked);
        if(skuFindItem) {
          const itemObj = {
            specification_id: res.id,
            sku_id: skuFindItem.id
          }
          detail.push(itemObj);
        }
      });
      return detail;
    }
  },
  watch: {
    isShow(newVal) {
      if(newVal) return;
      setTimeout(() => this.ticket_id = false, 500);
    }
  },
  methods: {
    ...mapActions({
      requestCarList: 'cart/requestCarList',
    }),
    updateIndex(tabIndex, index) {
      this.tabIndex = tabIndex;
      this.currentIndex = index;
      if(this.ticket_id) this.isShow = true;
    },
    async popupShow(item, tabIndex = 0, index = 0,) {
      this.requiredList = [];
      this.optionalList = [];
      const { product_id, isReturn, ticket_id } = item;
      this.ticket_id = ticket_id;
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
        if(res.data.details) {
          const { required, optional } = res.data.details;
          this.requiredList = required;
          this.optionalList = optional;
        }
        if(!this.ticket_id) this.isShow = true;
        return;
      }
      ticket_id && this.$emit('noTicket');
      this.ticket_id = 0;
      // 产品详情错误
      !isReturn && this.$emit('showError');
    },
    selItemHandle(index, idx) {
      this.optionalList[index].sku_infos.forEach(skuRes => skuRes.checked = false);
      this.optionalList[index].sku_infos[idx].checked = true;
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
      if(this.product_details.length) {
        products[0].skuArr = this.product_details;
      }
      this.$emit('imBuy', products, this.ticket_id);
      this.isShow = false;
    },
    addCartHandle() {
      const params = {
        brand_id: this.brand_id,
        restaurant_id: this.restaurant_id,
        product_id: this.product_id,
        amount: this.currenComNum,
        is_car: 1
      };
      if(this.product_details.length) {
        params.product_details = this.product_details;
      }
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
      if(res.code != 1) return;
      this.requestCarList({
        brand_id: this.brand_id,
        restaurant_id: this.restaurant_id,
      });
      this.isShow = false;
    },
    async editOrderCar({
      product_id,
      amount
    }, editCart) {
      const params = {
        brand_id: this.brand_id,
        restaurant_id: this.restaurant_id,
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
    padding-left: 8rpx;
    font-size: 22rpx;
    color: #F95731;
    margin-left: 16rpx;
    background: #FEF5F3;
    border-radius: 8rpx;
    overflow: hidden;
    .coupon_price {
      min-width: 56rpx;
      display: inline-block;
      color: #fff;
      text-align: center;
      position: relative;
      z-index: 0;
      padding: 0 8rpx 0 20rpx;
      background: #FEF5F3;
      &::after {
        content: '\3000';
        font-size: 0;
        position: absolute;
        width: 100%;
        height: 36rpx;
        top: 0;
        right: 0;
        background: url("https://test-file.y1b.cn/store/1-0/24411/66174f8b5e68e.png") 0 0 / 100% 100%;
        z-index: -1;
      }
    }
  }
}
.det_list{
  // margin-top: 56rpx;
  .list_lab {
    font-size: 26rpx;
    color: #aaa;
    line-height: 36rpx;
    margin-bottom: 24rpx;
  }
  .list_items {
    flex-wrap: wrap;
    margin-bottom: 40rpx;
    .item_box {
      width: 33.3%;
      box-sizing: border-box;
      border: 2rpx solid transparent;
      &:nth-child(-n+3) {
        margin-bottom: 40rpx;
      }
      &.active {
        background: #fffdf8;
        border-color: $mcDonaldColor;
        border-radius: 12rpx;
        transition: all .3s;
        .md_active {
          opacity: 1;
        }
      }
      .price_num {
        margin: 8rpx 0 24rpx;
      }
      .md_active{
        position: absolute;
        width: 32rpx;
        height: 32rpx;
        top: -16rpx;
        right: -16rpx;
        opacity: 0;
      }
      .item_img-box{
        width: 160rpx;
        height: 160rpx;
        position: relative;
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
}
.det_list-sel {
  .item_img-box{
    margin-top: 24rpx;
  }
  .list_items{
    margin-bottom: 34rpx;
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
    padding: 36rpx 0;
    .num_box {
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
    color: #000;
    flex: 1;
    &.btn_buy{
      border: 2rpx solid #333;
      color: #333;
      margin-right: 30rpx;
    }
    &.btn_add{
      background: $mcDonaldColor;
    }
  }
}
</style>
