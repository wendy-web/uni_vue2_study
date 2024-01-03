<template>
	<view class="immediate-help">
		<van-popup :show="show"   custom-style="background-color: transparent;" :close-on-click-overlay="false"  :z-index="10000">
			<view class="immediate-help-box">
				<!-- 背景 -->
               <van-image  width="604rpx" height="724rpx" src="https://file.y1b.cn/public/img/dlzg/ljzl_bg.png" fit="cover" use-loading-slot>
                	<van-loading slot="loading" type="spinner" size="20" vertical />
               </van-image>
			   <!-- info -->
               <view class="immediate-help-info">
               	  <view class="immediate-user image-round">
               	  	  <image class="user-icon" :src="user.avatar_url" mode="aspectFill"></image>
					  <text class="user-name">{{user.nick_name||'获取失败'}}</text>
               	  </view>
				  <view class="immediate-msg">
				  	感谢相助，还差一步就大功告成了！
				  </view>
               </view>
			   <!-- 创建团队 -->
			   <view class="create-team-btn">
			     	<van-button round color="linear-gradient(180deg,#fda80c, #f5882e)" type="info" size="normal" block @click="immediateHelp" :loading="loading">立即助力</van-button>
			   </view>
			</view>
			<image class="close" src="/static/images/close.png" mode="aspectFill" @click="cancel"></image>
		</van-popup>
		
	</view>
</template>

<script>
	import {getBeHelpUserCity,lit} from '@/api/modules/help.js'
	// import {getUserLocation} from '@/utils/getUserLocation.js'
	import {mapGetters} from 'vuex'
	//請求參數
    let _parmas;
	export default {
		data(){
			return {
				show:false,
				user:{
					avatar_url:'',
					nick_name:'',
					loading:false
				}
			}
		}, 
		computed:{
			...mapGetters(['isAuthorization'])
		},
		methods:{
			popupShow(config){
				_parmas = config
				//初始化数据
				getBeHelpUserCity({uid:_parmas.uid,sign:_parmas.sign}).then(res=>{
						const {user,list} = res.data
						this.user = user
						this.show = true
				})
			},
			popupClose(){
				this.show = false
				this.loading = false
			},
			immediateHelp(){
				if(!this.isAuthorization){
					this.$emit('loginToast')
					return
				}
				this.loading = true
				// getUserLocation().then(res=>{
					let {longitude,latitude,uid} = _parmas
					lit({
						longitude,latitude,uid
					}).then(res=>{
						if(res.code == 1){
							this.popupClose()
							this.$emit('helpSuccess',res.data)
							return
						}
						uni.showToast({
							icon:'none',
							title:res.msg
						})
					})
				// })
			},
			cancel(){
				this.popupClose()
				
				if(!this.isAuthorization){
					//引导页
					this.$emit('showGuide')
					return
				}
				this.$emit('cancelHelp',_parmas)
			}
		}
	}
</script>

<style lang="scss">
	.immediate-help{
		
		.immediate-help-box{
			position: relative;
			width: 604rpx;
			height: 724rpx;
			font-size: 0;
		}
		
		.immediate-help-info{
			position: absolute;
			top: 50rpx;
			left: 0;
			right: 0;
			text-align: center;
		}
		
		.immediate-user{
			display: flex;
			justify-content: center;
			align-items: center;
		}
		
		.user-icon{
			width: 64rpx;
			height: 64rpx;
			margin-right: 20rpx;
		}
		.user-name{
			font-size: 28rpx;
			font-weight: 700;
			color: #000018;
		}
		
		.immediate-msg{
			font-size: 28rpx;
			font-weight: 400;
			color: #000018;
			padding-top: 32rpx;
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