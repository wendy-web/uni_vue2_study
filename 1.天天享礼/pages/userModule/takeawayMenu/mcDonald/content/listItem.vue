<template>
<view>
<view class="list_item fl_al_end"
  v-for="(item, index) in list"
  :key="index"
   @click="selComHandle(item, index)"
>
  <view class="com_img-box fl_center">
      <image class="com_img" :src="item.product_img" mode="widthFix"></image>
  </view>
  <view class="list_txt fl_col_sp_bt">
      <view class="item_title txt_ov_ell2">{{item.product_name}}</view>
	  <view>
		<view class="price_num">
			<text style="font-size: 26rpx">¥</text>
			{{item.user_price}}
			<text class="price_num-old">¥{{ item.product_price }}</text>
		</view>
		<view class="spare_num">
			已省¥{{ (item.product_price - item.user_price).toFixed(2) }}
		</view>
	  </view>
  </view>
  <view class="list_right">
	<block v-if="item.product_choose">
		<view class="right_txt" >选规格</view>
		<view class="num_add" v-if="item.car_num">{{ item.car_num }}</view>
	</block>
	<view class="num_box fl_center" v-else>
		<block v-if="item.car_num">
			<image class="num_icon" :src="takeImgUrl + '/md_sub_icon.png'" mode="aspectFill"
			@click.stop="subHandle(item, index)"></image>
			<view class="num_txt">{{ item.car_num }}</view>
		</block>
		<image class="num_icon" :src="takeImgUrl + '/md_add_icon.png'" mode="aspectFill"
		@click.stop="addHandle(item, index)"></image>
	</view>
  </view>
</view>
</view>
</template>

<script>
import { getImgUrl } from '@/utils/auth.js';
export default {
  props: {
    list: {
      type: Array,
      default: []
    },
	tabIndex: {
		type: Number,
		default: 0
	}
  },
  data() {
    return {
		takeImgUrl: getImgUrl() + '/static/subPackages/userModule/takeawayMenu',
	}
  },
  methods: {
    selComHandle(item, index) {
		// if(!item.product_choose) return;
      	this.$emit('selCom', item, this.tabIndex, index);
    },
	addHandle(item, index){
		this.$emit('selAddCom', item, this.tabIndex, index);
	},
	subHandle(item, index){
		this.$emit('selSubCom', item, this.tabIndex, index);
	}
  },
}
</script>

<style scoped lang="scss">
.list_item {
	padding-top: 32rpx;
	padding-bottom: 32rpx;
	position: relative;
	z-index: 0;
    &:not(:last-child) {
        border-bottom: 2rpx solid #F1F1F1;
    }
	.com_img-box {
		width: 240rpx;
		height: 180rpx;
		margin-right: 24rpx;
		position: relative;
		flex: 0 0 240rpx;
		z-index: 0;
		.com_img{
			width: 100%;
			height: 100%;
		}
	}
	.list_right {
		font-size: 0;
		position: absolute;
		right: 14rpx;
		z-index: 0;
		.num_icon {
			width: 44rpx;
			height: 44rpx;
		}
		.num_add{
			height: 28rpx;
			min-width: 28rpx;
			padding: 0 5rpx;
			font-weight: 600;
			text-align: center;
			color: #fff;
			line-height: 1;
			background: #DB0007;
			border: 2rpx solid #ffffff;
			border-radius: 50%;
			font-size: 24rpx;
			position: absolute;
			top: 0;
			right: 0;
			box-sizing: border-box;
			transform: translate(50%, -50%);
		}
	}
	.list_txt {
		align-self: stretch;
		width: calc(100% - 234rpx);
		color: #333;
		.item_title{
			margin-bottom: 4rpx;
			font-size: 28rpx;
			font-weight: 600;
			line-height: 40rpx;
		}
		.price_num{
			font-size: 36rpx;
			font-weight: 600;
			line-height: 34rpx;
			.price_num-old{
				text-decoration:line-through;
				font-size: 26rpx;
				font-weight: 400;
				text-align: left;
				color: #aaa;
				line-height: 36rpx;
				margin-left: 16rpx;
			}
		}
		.spare_num {
			width: 112rpx;
			text-align: center;
			line-height: 32rpx;
			position: relative;
			z-index: 0;
            white-space: nowrap;
			width: 128rpx;
			height: 32rpx;
			border: 2rpx solid #db0007;
			border-radius: 8rpx;
			font-size: 22rpx;
			color: #db0007;
		}
	}
}

.right_txt{
	background: #ffb800;
	border-radius: 24rpx;
	line-height: 46rpx;
	font-size: 24rpx;
	font-weight: 600;
	text-align: center;
	color: #333;
	line-height: 46rpx;
	padding: 0 12rpx;
}
.num_txt{
	font-size: 30rpx;
	font-weight: 600;
	text-align: center;
	color: #333333;
	line-height: 42rpx;
	margin: 0 25rpx;
}
</style>
