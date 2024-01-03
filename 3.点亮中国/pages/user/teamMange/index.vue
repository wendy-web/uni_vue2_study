<template>
	<view class="my-team">
		<!-- 顶部背景 -->
		<image class="head-bg" src="../static/team_bg.png" mode="aspectFill"></image>
		<xh-navbar title="团队管理" titleColor="#ffffff"  titleAlign="titleCenter" leftImage="/static/images/back.png"
			@leftCallBack="backHome"/>
		<!-- head -->
		<view class="my-team-box" :style="{'padding-top':navBarConfig.navBarHeight+navBarConfig.statusBarHeight+'px'}">
			<view class="team-name-title">
				团队名称
				<view class="team-name">
					{{team.name}}
				</view>
			</view>
			<!-- 邀请配置 -->
			<view class="invite-tool" v-if="userInfo.condition == 1">
				<view class="invite-tool-top">
					<view class="invite-title">
						允许成员邀请
					</view>
					<van-switch :checked="team.invite" size="24px" @change="inviteChange" active-color="#36E68E" inactive-color="#DCDCDC"/>
				</view>
				<view class="invite-tool-info">
					启用后，其他成员可邀请他人加入
				</view>
			</view>
			<!-- 团队列表 -->
			<view class="team-list">
				<view class="team-list-head">
					团队成员（{{list.length}}）
				</view>
				<!-- list - item -->
				<template v-if="userInfo.condition == 1">
					<view class="list-item" v-for="(item,index) in list" :key="item.id">
						<view class="rank-index">
							<image class="rank-index-icon" v-if="index<=2" :src="'/pages/user/static/rank0'+(index+1)+'.png'" mode="aspectFill"></image>
							<text class="rank-index-text" v-else>{{index+1}}</text>
						</view>
						<!-- 用户头像 -->
						<image class="team-item-avatar image-round" :src="item.avatar_url" mode="aspectFill"></image>
						<view class="team-item-left">
							<view class="team-item-name">
								{{item.nick_name}}
							</view>
							<view class="team-city-num">
								点亮<text class="yellow">{{item.city_num}}</text>
							</view>
						</view>
						<view class="remove-team" v-if="userInfo.id != item.id" @click="removeTeamUser(item)">
							移除
						</view>
						</view>
				</template>
				<template v-else>
					<view class="list-item" v-for="(item,index) in list" :key="item.id">
							<view class="rank-index">
								<image class="rank-index-icon" v-if="index<=2" :src="'/pages/user/static/rank0'+(index+1)+'.png'" mode="aspectFill"></image>
								<text class="rank-index-text" v-else>{{index+1}}</text>
							</view>
							<!-- 用户头像 -->
							<image class="team-item-avatar image-round" :src="item.avatar_url" mode="aspectFill"></image>
							<view class="team-item-name">
								{{item.nick_name}}
							</view>
							<view class="team-city-num">
								点亮<text class="yellow">{{item.city_num}}</text>
							</view>
						</view>
				</template>
				<!-- asd  -->
				<view class="invite-btn" v-if="userInfo.condition == 2">
					<van-button color="linear-gradient(to right, #55A7FF, #0067D6)" round block @click="invite" :disabled="list.length>=5||!team.invite">邀请好友加入</van-button>
					<view class="exit-team" @click="exitTeam">
						退出团队
					</view>
				</view>
			</view>

		</view>
		<!-- 海报 -->
		<team-card ref="teamCard" @close="shareClose"/>
		<!-- //確認窗 -->
        <van-dialog id="van-dialog" />
		<!-- 消息通知 -->
		<van-toast id="van-toast" />
		<!-- 自定义分享 -->
		<van-share-sheet
		  :show="showShare"
		  :options="shareOptions"
		  @select="shareSelect"
		  @close="shareClose"
		  :overlay="false"
		/>
		<!-- 分享朋友圈 -->
		<wechat-moments ref="wechatMoments" :isCustomNavbar="true"/>
	</view>
</template>

<script>

	import {
		getNavbarData
	} from '@/components/xhNavbar/xhNavbar.js'
	import {mapGetters,mapActions} from 'vuex'
	import {getTeamAll} from '@/api/modules/home.js'
	import {removeTeamUser,getJoinUrl,create,quitTeam} from '@/api/modules/team.js'
	import Dialog from '@/wxcomponents/vant/dialog/dialog';
	import Toast from '@/wxcomponents/vant/toast/toast';
	import teamCard from '@/components/teamCard/teamCard.vue'
	import wechatMoments from '@/components/wechatMoments.vue'
	let inviteData;
	//邀请数据
	export default {
		components:{
			teamCard,
			wechatMoments
		},
		data(){
			return {
				showShare:false,
				navBarConfig: {
					navBarHeight: 0,
					statusBarHeight: 0, //状态栏高度
					menuWidth: 0
				},
				team:{name:'',invite:0},
				list:[],
				shareOptions:[
					{ name: '微信', icon: 'wechat', openType: 'share' },
					{ name: '朋友圈', icon: 'wechat-moments'},
					{ name: '保存图片', icon: 'https://file.y1b.cn/public/img/dlzg/downImage.png' }
				]
			}
		},
		computed:{
			...mapGetters(['userInfo'])
		},
		onShareAppMessage(data) {
			
			let share = {
				title: '点亮全中国，一起攒能量'
			}
			
			share.path = '/pages/tabBar/home/index'
			
			if(data.from == 'button'){
				
				share.title = this.userInfo.nick_name+'邀请你一起领略大好河山'
				
				share.path = '/pages/tabBar/home/index?type=teamInvite&'+inviteData
				
				share.imageUrl = this.$refs.teamCard.getImageUrl()
				
			}
			
			return share;
		},
		onShareTimeline(data){
			let share = {
				title: '点亮全中国，一起攒能量'
			}
			
			share.path = '/pages/tabBar/home/index'
			
			if(inviteData){
				
				share.title = this.userInfo.nick_name+'邀请你一起领略大好河山'
				
				share.path = '/pages/tabBar/home/index?type=teamInvite&' + inviteData
			}
			
			const imageUrl = this.$refs.teamCard.getImageUrl()
			
			if(imageUrl)share.imageUrl = imageUrl
			
			return share;
		},
		onLoad() {
			//清空数据
			inviteData = null
			//获取导航栏数据
			getNavbarData().then(res => {
				this.navBarConfig = res
			})
            this.getTeamAll()
		},
		methods:{
			...mapActions({
				  getUserInfo: 'user/getUserInfo'
			}),
			backHome(){
			   uni.navigateBack({
				   fail(e) {
				   	uni.reLaunch({
				   		url:'/pages/user/myTeam/index'
				   	})
				   }
			   })
			},
			//发起邀请
			invite(){
				const {avatar_url,nick_name} = this.userInfo
				this.$refs.teamCard.showTime({
					avatar_url,
					nick_name,
					team_bg:'/pages/user/static/team_fq.png',
					program_icon:'/pages/user/static/program_icon.png'
				})
				//拉取邀请人参数
				getJoinUrl().then(res=>{
					if(res.code == 1){
						inviteData =  res.data.url.split('?')[1]
						this.$refs.teamCard.showTime({
							avatar_url,
							nick_name,
							team_bg:'/pages/user/static/team_fq.png',
							program_icon:'data:image/png;base64,'+res.data.buffer
						})
						this.showShare = true
						return
					}
					uni.showToast({
						icon:'none',
						title:res.msg
					})
				})
			},
			shareSelect(e){
				//保存图片
				if(e.detail.name == "保存图片"){
					this.$refs.teamCard.save()
				}else if(e.detail.icon == "wechat-moments"){
					//朋友圈
					this.shareClose()
					this.$refs.wechatMoments.show()
				}
			},
			shareClose(){
				this.showShare = false
				this.$refs.teamCard.popupClose()
			},
			//开启
			inviteChange(){
				const message = !this.team.invite?'开启':'关闭'
				Dialog.confirm({
				  title: '温馨提示',
				  message: `您确认${message}队员邀请功能吗？`,
				}).then(() => {
				  create({name:this.team.name,invite:!this.team.invite}).then(res=>{
					  if(res.code == 1){
						  Toast({
							  type:'success',
							  position:'bottom',
							  message:message+'成功',
							  duration:'3500'
						   });
						  this.getTeamAll()
						  return
					  }
					  //其它提示
					 Toast({
						  type:'fail',
						  position:'bottom',
						  message:res.msg,
						  duration:'3500'
					 });
				  })
				}).catch(() => {});
			},
			removeTeamUser(item){
				Dialog.confirm({
				  title: '温馨提示',
				  message: `您确认移除(${item.nick_name})吗？`,
				}).then(() => {
				  removeTeamUser({uid:item.id}).then(res=>{
					  if(res.code == 1){
						 Toast({
							  type:'success',
							  position:'bottom',
							  message:'移除成功',
							  duration:'3500'
						  });
						  this.getTeamAll()
						  return
					  }
					  //其它提示
					  Toast({
						  type:'fail',
						  position:'bottom',
						  message:res.msg,
						  duration:'3500'
					  });
				  })
				}).catch(() => {});
			},
			exitTeam(){
				Dialog.confirm({
				  title: '温馨提示',
				  message: `您确认要退出(${this.team.name})团队吗？`,
				}).then(() => {
				  quitTeam().then(res=>{
					  if(res.code == 1){
						  this.getUserInfo()
						  Toast({
							  type:'success',
							  position:'bottom',
							  message:'退出成功',
							  duration:'3500'
						  });
						  uni.reLaunch({
						  	url:'/pages/tabBar/home/index'
						  })
						  return
					  }
					  //其它提示
						  Toast({
							  type:'fail',
							  position:'bottom',
							  message:res.msg,
							  duration:'3500'
						  });
				  }).catch(() => {});
				});
			},
			getTeamAll(){
				getTeamAll().then(res=>{
					const {team,list} = res.data
					team.invite = Boolean(team.invite)
					this.team = team
					//排序
					this.list = list.sort(function(a,b){
						return b.city_num - a.city_num 
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #ECECEC;
	}
	.my-team{
		.head-bg{
			width: 100%;
            height: 652rpx;
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
		}
		.my-team-box{
			width: 100%;
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			box-sizing: border-box;
		}
		.team-name-title{
			font-size: 32rpx;
			font-weight: 700;
			color: #ffffff;
		}
		.team-name-title{
			font-size: 32rpx;
			font-weight: 700;
			color: #ffffff;
			padding: 40rpx 60rpx 24rpx;
		}
		.team-name{
			font-size: 28rpx;
			font-weight: 400;
			color: #eeeeee;
			margin-top: 10rpx;
		}
		.invite-tool{
			padding: 36rpx 60rpx 40rpx;
			position: relative;
			&::after{
				content: '';
				position: absolute;
				left: 60rpx;
				right: 60rpx;
				height: 2rpx;
				background-color: rgba(255, 255, 255, 0.5);
				top: 0;
			}
		}
		.invite-tool-top{
			display: flex;
			justify-content: space-between;
		}
		.invite-title{
			font-size: 32rpx;
			font-weight: 700;
			color: #ffffff;
		}
		.invite-tool-info{
			font-size: 28rpx;
			font-weight: 400;
			color: #eeeeee;
		}
		
		.team-list{
			background: #ffffff;
			border-radius: 10px;
			box-shadow: 0px 0px 12px 0px rgba(0,0,0,0.16); 
			margin: 20rpx;
			padding: 40rpx;
		}
		.team-list-head{
			font-size: 32rpx;
			font-weight: 700;
			color: #000018;
		}
		.list-item{
			position: relative;
			padding-left: 136rpx;
			display: flex;
			justify-content: space-between;
			padding-top: 30rpx;
			padding-bottom: 30rpx;
		}
		.list-item+.list-item{
			&::after{
				content: '';
				position: absolute;
				left: 0;
				right: 0;
				height: 2rpx;
				background-color: rgba(0, 0, 0, 0.1);
				top: 0;
			}
		}
		.rank-index{
			position: absolute;
			width: 46rpx;
			height: 54rpx;
			font-size: 0;
			left: 0;
			top: 50%;
			transform: translateY(-50%);
		}
		.rank-index-icon{
			width: 46rpx;
			height: 54rpx;
		}
		.team-item-avatar{
			width: 64rpx;
			height: 64rpx;
			position: absolute;
			left: 66rpx;
			top: 50%;
			transform: translateY(-50%);
		}
		.team-item-name{
			font-size: 28rpx;
			font-weight: 700;
			color: #4e4d52;
			margin-bottom: 4rpx;
		}
		.team-city-num{
			font-size: 24rpx;
			font-weight: 400;
			color: #929292;
			.yellow{
				color: #FF7409;
			}
		}
		.remove-team{
			width: 128rpx;
			height: 52rpx;
			background: #ffffff;
			border: 2rpx solid #4699f2;
			border-radius: 28px;
			text-align: center;
			line-height: 52rpx;
			font-size: 28rpx;
			font-weight: 400;
			color: #4699f2;
		}
		.invite-btn{
			width: 540rpx;
			margin: 0 auto;
			padding: 50rpx 0 20rpx;
		}
		.exit-team{
			width: 128rpx;
			height: 44rpx;
			font-size: 32rpx;
			font-weight: 700;
			text-align: center;
			color: #4e4d52;
			margin: 20rpx auto 0;
			padding: 15rpx 0 15rpx;
			position: relative;
			&::after{
				content: '';
				position: absolute;
				width: 80%;
				left: 50%;
				transform: translateX(-50%);
				bottom: 10rpx;
				height: 2rpx;
				background-color: #4e4d52;
			}
		}
		
	}

</style>