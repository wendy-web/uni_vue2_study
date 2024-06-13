<template>
<view>
<view class="list_item fl_al_end"
  v-for="(item, index) in list"
  :key="index"
   @click="selComHandle(item, index)"
>
  <view class="com_img-box fl_center">
      <image class="com_img" :src="item.productImageUrl" mode="widthFix"></image>
  </view>
  <view class="list_txt fl_col_sp_bt">
      <view class="item_title txt_ov_ell2">{{item.productName}}</view>
	  <view>
		<view class="price_num">
			<text style="font-size: 26rpx">¥</text>
			{{item.price}}
			<text class="price_num-old">¥{{ item.originalPrice }}</text>
		</view>
		<view class="spare_num box_fl">
			<text class="spare_num-txt">已省</text>
			<text class="spare_num-price">¥{{ (item.originalPrice - item.price).toFixed(2) }}</text>
		</view>
	  </view>
  </view>
  <view class="list_right">
	<block v-if="item.specGroups.length">
		<view class="right_txt">选规格</view>
		<view class="num_add" v-if="item.car_num">{{ item.car_num }}</view>
	</block>
	<view class="num_box fl_center" v-else>
		<view class="minus_box fl_center" v-if="item.car_num">
			<view class="num_icon-box fl_center" @click.stop="subHandle(item, index)">
				<van-icon name="minus" size="16px" color="#fff"/>
			</view>
			<view class="num_txt">{{ item.car_num }}</view>
		</view>
		<view class="num_icon-box fl_center" @click.stop="addHandle(item, index)">
			<van-icon name="plus" size="16px" color="#fff"/>
		</view>
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
@import '@/static/css/mixin.scss';
.list_item {
	margin-top: 24rpx;
	position: relative;
	z-index: 0;
	background: #ffffff;
	border: 2rpx solid #e9e9e9;
	border-radius: 8rpx;
	padding: 16rpx;
	.com_img-box {
		width: 210rpx;
		height: 160rpx;
		margin-right: 24rpx;
		position: relative;
		flex: 0 0 210rpx;
		z-index: 0;
		.com_img{
			width: 100%;
			height: 100%;
		}
	}
	.list_right {
		font-size: 0;
		position: absolute;
		right: 0;
		z-index: 0;
		color: #fff;
		.num_add{
			height: 28rpx;
			min-width: 28rpx;
			padding: 0 5rpx;
			font-weight: 600;
			text-align: center;
			color: #fff;
			line-height: 1;
			background: $kfcColor;
			border: 2rpx solid #ffffff;
			border-radius: 50%;
			font-size: 24rpx;
			position: absolute;
			top: 0;
			left: -24rpx;
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
			min-width: 134rpx;
			line-height: 1;
			height: 32rpx;
			position: relative;
			z-index: 0;
            white-space: nowrap;
			width: 128rpx;
			height: 32rpx;
			border: 2rpx solid #E40030;
			border-radius: 8rpx;
			margin-top: 8rpx;
			font-size: 20rpx;
			font-weight: 600;
			color: #db0007;
			box-sizing: border-box;
			padding: 1rpx;
			.spare_num-txt{
				display: inline-block;
				width: 54rpx;
				background: #e40030;
				border-radius: 2rpx;
				text-align: center;
				color: #fff;
				box-sizing: border-box;
				height: 100%;
				border-radius: 8rpx;
				line-height: 30rpx;
			}
			.spare_num-price{
				flex: 1;
				text-align: center;
			}
		}
	}
}
.num_box{
	height: 50rpx;
	background: #e40030;
	border-radius: 8rpx 0 0 8rpx;
	.minus_box .num_icon-box{
		background: transparent;
	}
}
.num_icon-box{
	width: 48rpx;
	height: 50rpx;
	background: #cc002b;
	border-radius: 6rpx 0 0 6rpx;
	text-align: center;
	.num_icon{
		width: 22rpx;
		height: 20rpx;
	}
}
.right_txt{
	background: $kfcColor;
	border-radius: 8rpx 0 0 8rpx;
	line-height: 46rpx;
	font-size: 24rpx;
	font-weight: 600;
	text-align: center;
	line-height: 46rpx;
	padding: 0 13rpx;
}
.num_txt{
	font-size: 30rpx;
	font-weight: 600;
	text-align: center;
	line-height: 42rpx;
	margin: 0 10rpx;
}
</style>
