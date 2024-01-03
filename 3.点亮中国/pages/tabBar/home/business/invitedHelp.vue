<template>
	<view class="invited-popup">
		<van-popup :show="show"   @close="popupClose" custom-style="background-color: transparent;" :close-on-click-overlay="false"  :z-index="10000">
			<view class="invited-popup-box">
				<!-- 背景 -->
               <van-image  width="604rpx" height="724rpx" src="https://file.y1b.cn/public/img/dlzg/yqzl_bg.png" fit="cover" use-loading-slot>
                	<van-loading slot="loading" type="spinner" size="20" vertical />
               </van-image>
			   <view class="create-team-btn">
			     	<van-button round color="linear-gradient(180deg,#fda80c, #f5882e)" type="info" open-type="share" size="normal" block @click="invite">邀请好友</van-button>
			   </view>
			</view>
			<image class="close" src="/static/images/close.png" mode="aspectFill" @click="popupClose"></image>
		</van-popup>
	</view>
</template>

<script>

	export default {
		data(){
			return {
				show:false
			}
		},
		methods:{
			popupShow(){
				this.show = true
			},
			popupClose(){
				this.show = false
			},
			invite(){
				/*好友助力【邀请好友】 */
				wx.reportEvent("click_invitefriends", {
				    authorized_or_not:Number(this.isAuthorization)
				})
				this.show = false
			}
		}
	}
</script>

<style lang="scss">
	.invited-popup{
		.invited-popup-box{
			position: relative;
			width: 604rpx;
			height: 724rpx;
			font-size: 0;
		}
		.close{
			width: 56rpx;
			height: 56rpx;
			display: block;
			margin: 60rpx auto 0;
		}
		.create-team-btn{
			position: absolute;
			bottom: 50rpx;
			width: 296rpx;
			left: 50%;
			transform: translateX(-50%);
		}
	}


</style>