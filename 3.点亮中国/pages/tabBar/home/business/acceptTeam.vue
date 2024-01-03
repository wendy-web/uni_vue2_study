<template>
	<view class="accept-team">
		<van-popup :show="show"   custom-style="background-color: transparent;" :close-on-click-overlay="false" :z-index="10000">
			<view class="accept-team-box">
				<!-- 背景 -->
               <van-image class="head-bg-icon" width="626rpx" height="690rpx" src="https://file.y1b.cn/public/img/dlzg/join_team_bg.png" fit="cover" radius="10px 10px 0 0"  use-loading-slot>
                	<van-loading slot="loading" type="spinner" size="20" vertical />
               </van-image>
			   <!-- 相关信息 -->
			   <view class="accept-team-info">
			   	   <view class="accept-team-title">
			   	     	组队邀请
			   	   </view>
				   <van-image class="head-bg-icon" width="100rpx" height="100rpx" :src="config.avatar_url" fit="cover" radius="50px"  use-loading-slot>
				    	<van-loading slot="loading" type="spinner" size="20" vertical />
				   </van-image>
				   <view class="accept-team-name">
				   	  {{config.nick_name}}
				   </view>
				   <view class="accept-team-tips">
				   	  邀你组队一起点亮中国
				   </view>
			   </view>
			   <!-- 立即加入 -->
			   <view class="create-team-btn">
			     	<van-button round type="info" size="normal" block :loading="loading" @click="joinTeam">立即加入</van-button>
			   </view>
			</view>
			<image class="close" src="/static/images/close.png" mode="aspectFill" @click="popupClose"></image>
		</van-popup>
	</view>
</template>

<script>
	import {getJoinUser,joinTeam} from '@/api/modules/team.js'
	import {mapGetters} from 'vuex'
	//加入团队的参数
	let _parmas;
	export default {
		data(){
			return {
				show:false,
				config:{
					nick_name:'',
					avatar_url:''
				},
				loading:false
			}
		},
		computed:{
			...mapGetters(['isAuthorization'])
		},
		methods:{
			popupShow(data){
				_parmas = data
				getJoinUser({
					uid:_parmas.uid
				}).then(res=>{
					if(res.code == 1){
						this.config = res.data
						this.show = true
						return
					}
					uni.showToast({
						icon:'none',
						title:res.msg
					})
				})
			},
			popupClose(){
				this.show = false
				this.loading = false
				this.$emit('showGuide')
			},
			//加入团队
			joinTeam(){
				if(!this.isAuthorization){
					this.$emit('loginToast')
					return
				}
				this.loading = true
				const {tid,uid,sign} = _parmas
				joinTeam({
					tid,uid,sign
				}).then(res=>{
					if(res.code == 1){
						this.show = false
						uni.showToast({
							icon:"none",
							title:'加入成功',
							mask:true
						})
						setTimeout(()=>{
							uni.navigateTo({
								url:'/pages/user/myTeam/index'
							})
						},1000)
						return
					}
					uni.showToast({
						icon:'none',
						title:res.msg
					})
					this.loading = false
				}).catch(()=>{
					this.loading = false
				})
			}
		}
	}
</script>

<style lang="scss">
	.accept-team{
		.accept-team-box{
			position: relative;
			width: 626rpx;
			height: 830rpx;
			background-color: #ffffff;
			border-radius: 10px;
			font-size: 0;
		}
		.accept-team-info{
			position: absolute;
			top: 30rpx;
			left: 0;
			width: 100%;
			text-align: center;
		}
		.accept-team-title{
			font-size: 36rpx;
			font-weight: 700;
			color: #000000;
			margin-bottom: 16rpx;
		}
		.accept-team-name{
			font-size: 32rpx;
			font-weight: 700;
			color: #ff7409;
			margin:5rpx 0;
		}
		.accept-team-tips{
			font-size: 28rpx;
			font-weight: 700;
			color: #000018;
		}
		.create-team-btn{
			width: 340rpx;
			margin: 25rpx auto 0;
		}
		.close{
			width: 56rpx;
			height: 56rpx;
			display: block;
			margin: 60rpx auto 0;
		}
	}


</style>