<template>
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
        <image class="stat_car-icon" :src="takeImgUrl + '/stat_car-icon.png'" mode="'scaleToFill'"></image>
        <!-- <view class="cart_title-txt">已选购商品（2件）</view> -->
        <van-checkbox
          :value="checkAllFlag"
          @change="checkAllHandle"
          :checked-color="checkColor"
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
                :checked-color="checkColor"
                custom-class="list_cont-check"
            >
            <view class="list_cont fl_al_end">
                <view class="com_img fl_center">
                    <image class="widHei" :src="item.productImageUrl" mode="widthFix"></image>
                </view>
                <view class="list_txt fl_col_sp_bt">
                    <view>
                    <view class="item_title">{{item.productName}}</view>
                    <view class="item_lab">{{ item.sku_str }}</view>
                    </view>
                    <view class="comp_box fl_bet">
                        <view class="price_num">
                            <text style="font-size: 26rpx">¥</text>
                            {{ item.price }}
                            <text class="price_num-old">¥{{ item.originalPrice }}</text>
                        </view>
                        <!-- 购物车增减 -->
                        <view class="num_box fl_center">
                            <image class="num_icon" :src="takeImgUrl + '/star_sub.png'" mode="aspectFill"
                            @click.stop="subHandle(item, index)">
                            </image>
                            <view class="num_txt">{{ item.amount }}</view>
                            <image class="num_icon" :src="takeImgUrl +'/star_add.png'" mode="aspectFill"
                            @click.stop="addHandle(item, index)"></image>
                        </view>
                    </view>
                </view>
            </view>
          </van-checkbox>
        </van-checkbox-group>
      </view>
    </view>
  </view>
</van-popup>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import { carChecked } from '@/api/modules/takeawayMenu/starbucks.js';
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
      comList: [],
      checkAllFlag: false,
      checkColor: '#006241'
    }
  },
  computed: {
    ...mapGetters(['cartComList', 'cartNum', 'brand_id', 'resultList' ]),
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
    popupShow() {
      this.isShow = true;
    },
    popupClose(isUpdateCartList = true) {
      this.isShow = false;
      this.$emit('close');
      if(!this.cartComList.length || !isUpdateCartList) return;
      carChecked({
        brand_id: this.brand_id,
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
        car_id: id,
        product_id,
        product_details
      }).then(res => {
        this.$emit('updateAmount', {
          product_id,
          amount: -1
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
        car_id: id,
        product_id,
        product_details
      }).then(res  => {
        this.$emit('updateAmount', {
          product_id,
          amount: 1
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

<style lang="scss" scoped>
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
  position: relative;
  overflow: scroll;
  flex: 1;
  padding-bottom: 120rpx;
  /* 兼容 IOS<11.2 */
  // padding-bottom: calc(var(--padding) + env(safe-area-inset-bottom));
}
.cart_title{
  padding: 20rpx 32rpx;
  border-bottom: 2rpx solid #ececec;
  position: fixed;
  z-index: 1;
  width: 100%;
  box-sizing: border-box;
  z-index: 1;
  background: #fff;
  .stat_car-icon{
    position: absolute;
    top: 0;
    right: 0;
    width: 350rpx;
    height: 92rpx;
    z-index: -1;
  }

  .cart_title-txt{
    font-size: 28rpx;
    font-weight: 600;
    text-align: left;
    color: #333333;
    line-height: 40rpx;
  }
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
  padding: 0 32rpx;
  margin-top: 92rpx;
}
.list_cont {
  padding-bottom: 24rpx;
  padding-top: 24rpx;
  flex: 1;
  position: relative;
  &:not(:last-child){
    border-bottom: 2rpx solid #F1F1F1;
  }
	.com_img {
		width: 210rpx;
		height: 160rpx;
		margin-right: 24rpx;
		position: relative;
	}
	.list_txt {
		flex: 1;
		align-self:stretch;
    .comp_box{
      margin-top: 4rpx;
    }
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