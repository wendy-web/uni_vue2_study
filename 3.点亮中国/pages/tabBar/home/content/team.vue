<template>
	<view class="team-box">
		<view class="team" @click="invite">
			<view class="team-head">
				我的团队
			</view>
			<view class="team-list">
				<view class="team-item team-user" v-for="item in list" :key="item.id">
					<image class="team-user-icon" :src="item.avatar_url" mode="aspectFill"></image>
					<view class="identity">
						<text v-if="uid == item.id">我</text>
						<text v-else>{{item.condition===1?'队长':'队友'}}</text>
					</view>
				</view>
				<view class="team-item team-user" v-for="item in (5-list.length)" :key="item">
					<image class="team-user-icon" src="../../../../static/home/add.png" mode="aspectFill"></image>
					<view class="identity">
                          <text class="invite">邀请</text>						
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapGetters} from  'vuex'
	import {
		getTeamAll
	} from '@/api/modules/home.js'
	export default {
		computed:{
			...mapGetters(['uid','userInfo','isAuthorization'])
		},
		data(){
		   return {
			   list:[]
		   }	 
		},
		methods:{
			invite(){
				//未授权用户信息
				if(!this.isAuthorization){
					this.$emit('loginToast')
					//前往授权
					return 
				}
				//暂无团队是否创建团队？
				if(!this.userInfo.team_id){
					this.$emit('createTeam')
					return
				}
				this.$router.navigateTo({
					url:'/pages/user/myTeam/index'
				})
			},
			initData(){
				getTeamAll(true).then(res=>{
					if(res.code == 1)this.list = res.data.list
				})
			}
		}
	}
</script>

<style lang="scss">
	.team-box{
		background-color: #2E3C59;
		padding: 40rpx 12rpx 40rpx;
		.team{
			background-color: #1C2436;
			padding: 40rpx 0 34rpx;
			border-radius: 10rpx;
		}
		.team-head{
			padding-left: 28rpx;
			color: #fff;
			font-size: 32rpx;
			font-weight: 700;
			margin-bottom: 16rpx;
		}
		.team-list{
			padding: 0 40rpx;
			display: flex;
		}
		.team-item {
			position: relative;
			text-align: center;
			font-size: 0;
		}
		.team-item+.team-item{
			margin-left: 42rpx;
		}
		.team-user-icon{
			width: 96rpx;
			height: 96rpx;
			border-radius: 50%;
			transform: translate3d(0, 0, 0);/*ios圆角兼容*/
		}
		.identity{
			width: 90rpx;
			height: 38rpx;
			background-color: #1777FE;
			border-radius: 20px;
			margin-top: -20rpx;
			position: relative;
			z-index: 1;
			font-size: 26rpx;
			font-weight: 700;
			color: #000000;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.invite{
			color: #fff;
		}
	}
</style>