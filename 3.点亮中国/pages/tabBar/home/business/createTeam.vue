<template>
	<view class="create-team">
		<van-popup :show="show"    @close="popupClose" custom-style="background-color: transparent;" :close-on-click-overlay="false"  :z-index="10000">
			<view class="create-team-box">
                <!-- head -->
				<view class="head">
					<van-image   width="604rpx" height="484rpx" :src="static.headBg" fit="cover" radius="10px"  use-loading-slot>
						<van-loading slot="loading" type="spinner" size="20" vertical />
					</van-image>
					<van-image class="head-bg-icon" width="314rpx" height="360rpx" :src="static.icon" fit="cover" radius="10px 10px 0 0"  use-loading-slot>
						<van-loading slot="loading" type="spinner" size="20" vertical />
					</van-image>
				</view>
				<!-- 团队名称 -->
				  <van-field
				    :value="team.teamName"
				    placeholder="取个喜欢的名字吧"
					size="large"
					maxlength="8"
				    border
					@change="inputChange">
				   <text class="team-name" slot="label">团队名称</text>
				  </van-field>
				  <!-- 邀请权限 -->
				  <view class="invite-set">
				  	  <view class="invite-set-top">
						  <text class="team-name">允许成员邀请</text>
				  	  	  <van-switch :checked="team.invite" size="24px" @change="inviteChange" active-color="#36E68E" inactive-color="#DCDCDC"/>
				  	  </view>
					  <view class="invite-tips">
					  	启用后，其他成员可邀请他人加入
					  </view>
				  </view>
				  <!-- 创建团队 -->
				  <view class="create-team-btn">
				    	<van-button round type="info" size="normal" block @click="create" :loading="loading">创建团队</van-button>
				  </view>
			</view>
			<image class="close" src="/static/images/close.png" mode="aspectFill" @click="show = false"></image>
		</van-popup>
	</view>
</template>

<script>
	import {create} from '@/api/modules/team.js'
	export default {
		data(){
			return {
				show:false,
				loading:false,
				teamName:'',
				team:{
					teamName:'',
					invite:true
				},
				static:{
					headBg:'https://file.y1b.cn/public/img/dlzg/create_team_bg.png',
					icon:'https://file.y1b.cn/public/img/dlzg/create_team_icon.png'
				}
			}
		}, 
		methods:{
			popupShow(){
				this.show = true
			},
			popupClose(){
				this.show = false
				this.team = {
					teamName:'',
					invite:true
				}
				this.loading = false
			},
			inviteChange(e){
				this.team.invite = e.detail
			},
			inputChange(e){
				this.team.teamName = e.detail
			},
			create(){
				let {teamName,invite} = this.team
				
				teamName = teamName.replace(/\s/g,'')
				
				if(!teamName){
					return uni.showToast({
						icon:"none",
						title:'团队名称不能为空'
					})
				}
				if(teamName.length<2&&teamName.length>8){
					return uni.showToast({
						icon:"none",
						title:'团队名称长度在4~8个字符'
					})
				}
				if(!/^[\u4E00-\u9FA5a-zA-Z0-9_-]{2,8}$/.test(teamName)){
					return uni.showToast({
						icon:"none",
						title:'团队名称不符合规范，请重新输入'
					})
				}
				
				this.loading = true
				
				create({
					name:teamName,
					invite:Boolean(invite)
				}).then(res=>{
					if(res.code == 1){
						this.show = false
						uni.showToast({
							icon:"none",
							title:'创建成功',
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
						icon:"none",
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
	.create-team{
		
		.create-team-box{
			position: relative;
			width: 604rpx;
			height: 824rpx;
			background-color: #ffffff;
			border-radius: 10px;
		}
		.head{
			position: relative;
			font-size: 0;
			&::after{
				content: '';
				position: absolute;
				left: 0;
				top: 0;
				bottom: 0;
				width: 100%;
				background-color: rgba(0, 0,0,.6);
				z-index: 0;
			}
		}
		.head-bg-icon{
			position: absolute;
			left: 66rpx;
			top: 114rpx;
			z-index: 1;
		}
		
		.close{
			width: 56rpx;
			height: 56rpx;
			display: block;
			margin: 60rpx auto 0;
		}
		.team-name{
			font-size: 32rpx;
			font-weight: 700;
			color: #000018;
		}
		.invite-set-top{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 12px 16px 0;
		}
		.invite-tips{
			font-size: 24rpx;
			font-weight: 400;
			color: #b1b1b2;
			padding: 0 16px;
		}
		.create-team-btn{
			width: 340rpx;
			margin: 20rpx auto 0;
		}
		
	}


</style>