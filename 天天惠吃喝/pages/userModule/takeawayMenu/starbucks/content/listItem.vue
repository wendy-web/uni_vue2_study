<template>
<view>
<view class="list_item fl_center"
  v-for="(item, index) in list"
  :key="index"
   @click="selComHandle(item, index)"
>
  <view class="com_img-box fl_center">
      <image class="com_img" :src="item.defaultImage" mode="widthFix"></image>
  </view>
  <view class="list_txt fl_col_sp_bt">
      <view class="item_title txt_ov_ell2">{{item.name}}</view>
	  <view>
		<view class="price_num">
			<text style="font-size: 26rpx">¥</text>
			{{item.salesPrice}}
			<text class="price_num-old">¥{{ item.marketPrice }}</text>
		</view>
		<view class="spare_num">
            <image class="bg_img" :src="takeImgUrl + '/spare_num_bg.png'" mode="'scaleToFill'"></image>
            已省¥{{ (item.marketPrice - item.salesPrice).toFixed(2) }}
		</view>
	  </view>
  </view>
  <view class="list_right">
		<view class="num_add" v-if="item.car_num">{{ item.car_num }}</view>
        <image class="bg_img" :src="takeImgUrl + '/star_add.png'" mode="aspectFill"></image>
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
@import '@/static/css/mixin.scss';
.list_item {
	position: relative;
	z-index: 0;
    padding-left: 16rpx;
	.com_img-box {
		width: 180rpx;
		height: 180rpx;
		margin-right: 24rpx;
		position: relative;
		flex: 0 0 180rpx;
		z-index: 0;
		.com_img{
			width: 100%;
			height: 100%;
		}
	}
	.list_right {
		font-size: 0;
		position: absolute;
        bottom: 32rpx;
		right: 32rpx;
		z-index: 0;
        width: 44rpx;
	    height: 44rpx;
		.num_add{
			height: 28rpx;
			min-width: 28rpx;
			padding: 0 5rpx;
			font-weight: 600;
			text-align: center;
			color: #fff;
			line-height: 1;
			background: #c2a379;
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
		width: calc(100% - 204rpx);
        height: 180rpx;
		color: #333;
        padding: 32rpx 16rpx 32rpx 0;
        border-bottom: 2rpx solid #f1f1f1;
		.item_title{
			margin-bottom: 4rpx;
			font-size: 28rpx;
			font-weight: 600;
			line-height: 40rpx;
		}
		.price_num{
			font-size: 32rpx;
			font-weight: 600;
			line-height: 34rpx;
			color: #333;
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
		}
	}
}
.num_icon{
	width: 44rpx;
	height: 44rpx;
}
.right_txt{
	background: $starbucksColor;
	border-radius: 8rpx;
	line-height: 46rpx;
	font-size: 24rpx;
	font-weight: 600;
	text-align: center;
	line-height: 46rpx;
	padding: 0 13rpx;
    color: #fff;
}
</style>