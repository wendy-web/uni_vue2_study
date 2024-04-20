<template>
<view>
	<view class="cont_item cont_empty" v-for="(item, index) in 2" :key="index">
		<view class="item_add">
			<view class="add_cont fl_bet">
				<image class="item_add-icon box_gray"></image>
				<view class="item_add-text box_gray"></view>
			</view>
			<view class="add_cont-rem box_gray"></view>
			</view>
			<view class="item_list-box fl_bet">
			<view class="item_list" v-for="(itemDel, idx) in 3" :key="idx" >
				<view class="item_list-img box_gray"></view>
				<view class="item_list-txt box_gray"></view>
				<view class="price_num box_gray"></view>
				<view class="spare_num box_gray"></view>
			</view>
		</view>
	</view>
</view>
</template>
<script>
export default {
	data() {
		return {
		}
	},
	methods: {
	}
}
</script>
<style lang="scss">
.cont_item{
  margin: 0 24rpx 24rpx;
  background: #ffffff;
  border-radius: 24rpx;
  padding: 24rpx;
  .item_add {
    .add_cont-shop{
      font-size: 30rpx;
      font-weight: 500;
      color: #333333;
      line-height: 42rpx;
    }
    .add_cont-dis {
      font-size: 26rpx;
      color: #333333;
      line-height: 36rpx;
      margin-left: 10rpx;
    }
    .add_cont-rem{
      height: 36rpx;
      font-size: 26rpx;
      color: #999;
      line-height: 36rpx;
    }
  }
  .item_add-icon{
    width: 36rpx;
    height: 36rpx;
    margin-right: 8rpx;
    flex-shrink: 0;
  }
  .item_add-text{
    font-size: 30rpx;
    font-weight: 500;
    color: #333333;
    line-height: 42rpx;
  }
  .item_list-box{
    margin-top: 32rpx;
    .item_list{
      width: 202rpx;
      .item_list-txt{
        width: 100%;
        margin-top: 16rpx;
        font-size: 28rpx;
        color: #333333;
        line-height: 40rpx;
      }
    }
  }
  .item_list-img{
    width: 202rpx;
    height: 152rpx;
    border: 1rpx solid #e9e9e9;
    border-radius: 16rpx;
    overflow: hidden;
  }
  .price_num{
    font-size: 32rpx;
    font-weight: 600;
    line-height: 34rpx;
    height: 34rpx;
    margin-top: 4rpx;
    color: #F84842;
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
    width: 112rpx;
    text-align: center;
    line-height: 32rpx;
    white-space: nowrap;
    width: 128rpx;
    height: 32rpx;
    border: 1rpx solid #F84842;
    border-radius: 8rpx;
    font-size: 22rpx;
    color: #F84842;
    margin-top: 8rpx;
  }
}
// 空加载的
.cont_empty{
  .item_add-text{
    flex: 1;
    height: 36rpx;
    margin-bottom: 6rpx;
  }
  .box_gray {
    border-radius: 16rpx;
    border: none;
    background: linear-gradient(270deg,#f6f8fb 80%, #eaeef6);
    animation: backAni 1.5s infinite;
  }
  .item_add-icon{
    border-radius: 4rpx;
  }
}
@keyframes backAni {
  0% {
    background: linear-gradient(270deg,#f6f8fb 80%, #eaeef6);
  }
  50% {
    background: linear-gradient(270deg,#f6f8fb 60%, #eaeef6);
  }
  100% {
    background: linear-gradient(270deg,#f6f8fb 30%, #eaeef6);
  }
}
</style>
