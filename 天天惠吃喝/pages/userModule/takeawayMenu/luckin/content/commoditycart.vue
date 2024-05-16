<template>
<view>
  <van-popup
    :show="isShow"
    @close="popupClose"
    position="bottom"
    custom-style="overflow: inherit;background: transparent;max-height:75vh;"
    round
    safe-area-inset-bottom
  >
  <view class="cart_box" :style="{ '--padding': isMaxPadding ? '1rpx' : '0' }">
    <image class="close_icon" :src="takeImgUrl + '/close_icon.png'" mode="scaleToFill" @click="popupClose"></image>
    <view class="cart_con">
      <view class="cart_title fl_bet">
        <van-checkbox
          :value="checkAllFlag"
          @change="checkAllHandle"
          checked-color="#C2A379"
        >已选购商品（{{cartNum}}件）</van-checkbox>
        <view class="del_cart fl_center" @click="clearCartHandle">
          <image class="del_icon" :src="takeImgUrl+'/del_icon.png'"  mode="aspectFill" ></image>
          清空购物车
        </view>
      </view>
      <view class="cart_list">
        <van-checkbox-group :value="resultList" @change="changeHandle">
          <van-checkbox
            v-for="(item, index) in cartComList"
            :key="item.id"
            :name="item.id"
            checked-color="#C2A379"
            custom-class="list_cont-check"
          >
            <view class="list_cont fl_al_end">
              <view class="com_img">
                <image class="bg_img" :src="item.product_img" mode="aspectFill"></image>
              </view>
              <view class="list_txt fl_col_sp_bt">
                <view>
                  <view class="item_title">{{item.product_name}}</view>
                  <view class="item_lab">{{ item.sku_str }}</view>
                </view>
                <view class="price_num">
                    <text style="font-size: 26rpx">¥</text>
                    {{ item.user_price }}
                    <text class="price_num-old">¥{{ item.product_price }}</text>
                </view>
              </view>
              <view class="num_box fl_center">
                <image class="num_icon" :src="takeImgUrl + '/sub_icon.png'" mode="aspectFill"
                  @click.stop="subHandle(item, index)">
                </image>
                <view class="num_txt">{{ item.amount }}</view>
                <image class="num_icon" :src="takeImgUrl +'/add_icon.png'" mode="aspectFill"
                @click.stop="addHandle(item, index)"></image>
              </view>
            </view>
          </van-checkbox>
        </van-checkbox-group>
      </view>
    </view>
  </view>
  </van-popup>
</view>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import { carChecked } from '@/api/modules/takeawayMenu/luckin.js';
import { getImgUrl } from '@/utils/auth.js';
export default {
  props: {
    comNum: {
      type: Number,
      default:1
    }
  },
  data() {
    return {
      takeImgUrl: getImgUrl() + '/static/subPackages/userModule/takeawayMenu',
      isShow: false,
      checkAllFlag: true,
      comList: [],
    }
  },
  computed: {
    ...mapGetters(['cartComList', 'resultList', 'cartNum', 'brand_id', 'restaurant_id' ]),
    isMaxPadding() {
      if(this.cartComList.length > 4) return true;
      return false;
    }
  },
  watch: {
    cartComList: function(newValue, oldValue) {
      if(newValue.length) return;
      this.popupClose();
    },
    resultList(newValue) {
      if(this.cartComList.length == newValue.length) {
        this.checkAllFlag = true;
        return;
      }
      this.checkAllFlag = false;
    }
  },
  methods: {
    ...mapActions({
      requestCarList: 'cart/requestCarList',
      addCount: 'cart/addCount',
      subCount: 'cart/subCount',
    }),
    ...mapMutations({
      changeRadio: 'cart/changeRadio',
      checkAllRadio: 'cart/checkAllRadio',
    }),
    async updateCarList() {
      const res = await this.requestCarList();
      if(res.data && res.data.length) {
        this.isShow = true;
      }
    },
    popupShow(params) {
      this.isShow = true;
    },
    popupClose(isUpdateCartList = true) {
      this.isShow = false;
      this.$emit('close');
      if(!this.cartComList.length || !isUpdateCartList) return;
      // 用于存储选中的购物车选项
      carChecked({
        brand_id: this.brand_id,
        restaurant_id: this.restaurant_id,
        car_id: this.resultList
      });
    },
    clearCartHandle(){
      this.$emit('clearCart');
    },
    subHandle(item, index) {
      const {
        id,
        product_id,
        product_details
      } = item;
      this.subCount({
        _index: index,
        restaurant_id: this.restaurant_id,
        car_id: id,
        product_id,
        product_details
      }).then(res => {
        this.$emit('updateAmount', {
          product_id,
          amount: res.amount
        });
      })
    },
    addHandle(item, index) {
      const {
        id,
        product_id,
        product_details
      } = item;
      this.addCount({
        _index: index,
        restaurant_id: this.restaurant_id,
        car_id: id,
        product_id,
        product_details
      }).then(res  => {
        this.$emit('updateAmount', {
          product_id,
          amount: res.amount
        });
      })
    },
    changeHandle(event) {
      this.changeRadio(event.detail);
    },
    checkAllHandle(event){
      this.checkAllFlag = event.detail;
      this.checkAllRadio(this.checkAllFlag);
    }
  },
}
</script>

<style lang="scss">
@import '@/static/css/mixin.scss';
.cart_box {
  position: relative;
  max-height: 75vh;
  display: flex;
	flex-direction: column;
  // padding-bottom: env(safe-area-inset-bottom);
  // padding-bottom: constant(safe-area-inset-bottom); /* 兼容 IOS<11.2 */
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
.cart_con {
  background: #fff;
  border-radius: 32rpx 32rpx 0rpx 0rpx;
  position: relative;
  overflow: scroll;
  flex: 1;
  padding-bottom: 120rpx;
  /* 兼容 IOS<11.2 */
  // padding-bottom: calc(var(--padding) + env(safe-area-inset-bottom));
}
.cart_title{
  padding: 22rpx 32rpx;
  border-bottom: 2rpx solid #ececec;
  position: fixed;
  z-index: 1;
  width: 100%;
  background: #fff;
  box-sizing: border-box;
  border-radius: 32rpx 32rpx 0rpx 0rpx;
  .del_cart {
    font-size: 26rpx;
    color: #aaa;
    line-height: 36rpx;
    .del_icon{
      width: 48rpx;
      height: 48rpx;
      margin-right: 8rpx;
    }
  }
}
.cart_list{
  padding: 22rpx 32rpx 0;
  margin-top: 96rpx;
}
.list_cont {
    margin-bottom: 40rpx;
    flex: 1;
    // &:last-child {
    //   margin-bottom: 0;
    // }
	.com_img {
		width: 144rpx;
		height: 144rpx;
		margin-right: 24rpx;
		position: relative;
		z-index: 0;
		.sell_out{
			width: 144rpx;
			height: 56rpx;
			background: rgba(0,0,0,0.30);
			position: absolute;
			bottom: 0;
			left: 0;
			font-size: 26rpx;
			font-weight: 500;
			text-align: center;
			color: #ffffff;
			line-height: 56rpx;
		}
	}
	.list_right {
		font-size: 0;
		.sell_out-txt{
			height: 40rpx;
			font-size: 28rpx;
			color: #aaa;
			line-height: 40rpx;
		}
	}
	.list_txt {
		flex: 1;
		align-self:stretch;
		.item_title{
			font-size: 28rpx;
			font-weight: 600;
			color: #333;
			line-height: 40rpx;
		}
    .item_lab{
      font-size: 24rpx;
      color: #aaaaaa;
      line-height: 34rpx;
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
		}
	}
}
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
</style>