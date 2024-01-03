<template>
	<view class="my-team">
		<mescroll-uni ref="mescrollRef" @init="mescrollInit" @down="downCallback" :down="downOption" :up="{use: false}">
			<!-- 顶部背景 -->
		<view class="head-bg" ></view>
		<!-- head -->
		<view class="my-team-box" >
			<view class="team-head-top">
				<image class="team-icon" :src="team.image" mode="aspectFill"></image>
				<view class="team-name">
					{{team.name}}
				</view>
				<!-- 团队公益 -->
				<view class="team-welfare" @click="goPage('/pages/user/volunteer/index?type=1')">
					团队公益
				</view>
			</view>
			<!-- 统计 -->
			<view class="team-total">
				<view class="team-total-item" @click="goPage('/pages/user/lightRecord/index?type=1')">
					 <view class="total-num">
					 	{{team.city_num}}
					 </view>
					 <view class="total-label">
					 	点亮城市
					 </view>
				</view>
				<view class="team-total-item" @click="goPage('/pages/tabBar/love/index?type=1')">
					 <view class="total-num">
					 	{{team.love}}
					 </view>
					 <view class="total-label">
					 	团队能量
					 </view>
				</view>
				<view class="team-total-item" @click="goPage('/pages/user/medal/index?type=1')">
					 <view class="total-num">
					 	{{team.medal_num}}
					 </view>
					 <view class="total-label">
					 	团队勋章
					 </view>
				</view>
				<view class="team-total-item" @click="goPage('/pages/user/volunteerCard/index?type=1')">
					 <view class="total-num">
					 	{{team.com_cert_num}}
					 </view>
					 <view class="total-label">
					 	公益证书
					 </view>
				</view>
			</view>
			<!-- 我的小伙伴 -->
			<view class="team-list">
				<view class="team-list-head">
					<view class="tlh-title">
						我的小伙伴
					</view>
					<view class="tlh-right" @click="goPage('/pages/user/teamMange/index')">
						团队管理<van-icon name="arrow" />
					</view>
				</view>
				<!-- 团队展示 -->
				<view class="team-show">
					<!-- 背景 -->
					<image class="round-waves" src="../static/round_waves.png"  mode="aspectFill"></image>
					<!-- 團隊 -->
					<view  v-for="(item,i) in list" class="team-member" :class="'team-member-location0'+(i+1)" :key="item.id">
						<!-- 头像 -->
						<image class="member-icon image-round" :src="item.avatar_url" mode="aspectFill"></image>
						<!-- 点亮次数 -->
						<view class="dl-num" :class="{'member-me':userInfo.id == item.id}">
							点亮{{item.city_num}}座
						</view>
						<view class="member-name" v-if="item.condition == 1">
							<text class="nc-name">{{userInfo.id == item.id?'自己':item.nick_name}}</text><text>(队长)</text>
						</view>
						<view class="member-name" v-else>
							{{userInfo.id == item.id?'自己':item.nick_name}}
						</view>
						<!-- 隊長身份 -->
						<image v-if="item.condition == 1" class="crown" src="../static/crown.png" mode="aspectFill"></image>
					</view>
					<!-- 添加成員 -->
					<image v-for="item in unList" :key="item.id" class="add-member image-round" :class="'team-member-location0'+item.index" src="../static/add_member.png" mode="aspectFill" @click="invite"></image>
				     <!-- 能量 -->
					 <view class="love-box">
					 	<image class="love-icon" src="../static/love_icon.png" mode="aspectFill"></image>
						<view class="team-love-num">
							{{team.city_num}}
						</view>
						<view class="team-love-label">
							已点亮(座)
						</view>
					 </view>
				</view>
				<!-- 发起邀请按钮 -->
				<view class="invite-btn">
					<van-button color="linear-gradient(to right, #55A7FF, #0067D6)" round block @click="invite" :disabled="isInvite">邀请好友加入</van-button>
				</view>
			</view>
		</view>
		</mescroll-uni>
		<!-- 海报 -->
		<team-card ref="teamCard" @close="shareClose"/>
		<!-- 自定义分享 -->
		<van-share-sheet
		  :show="showShare"
		  :options="shareOptions"
		  @select="shareSelect"
		  @close="shareClose"
		  :overlay="false"/>
		<!-- 分享朋友圈 -->
		<wechat-moments ref="wechatMoments" :isCustomNavbar="true"/>
	</view>
</template>

<script>
	import {getTeamAll} from '@/api/modules/home.js'
	import {getJoinUrl} from '@/api/modules/team.js'
	import {mapGetters,mapActions} from 'vuex'
	import teamCard from '@/components/teamCard/teamCard.vue'
	import wechatMoments from '@/components/wechatMoments.vue'
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	//邀请数据
	let inviteData;
	export default {
		mixins: [MescrollMixin], // 使用mixin
		components:{
			teamCard,
			wechatMoments
		},
		data(){
			return {
				downOption: {
					textColor: '#fff',
					auto: false
				},
				showShare:false,
				list:[],
				unList:[],
				team:{
					city_num: 0,
					com_cert_num: 0,
					image: "",
					love: 0,
					medal_num: 0,
					name: "可园团队",
					invite:0
				},
				shareOptions:[
					{ name: '微信', icon: 'wechat', openType: 'share' },
					{ name: '朋友圈', icon: 'wechat-moments'},
					{ name: '保存图片', icon: 'https://file.y1b.cn/public/img/dlzg/downImage.png' }
				]
			}
		},
		computed:{
			...mapGetters(['userInfo']),
			isInvite(){
				if(this.list.length>=5)return true
				if(!this.team.invite&&this.userInfo.condition==2)return true	
				return false
			}
		},
		onShareAppMessage(data) {
			let share = {
				title: '点亮全中国，一起攒能量',
				path: '/pages/tabBar/home/index'
			}
			if(data.from == 'button'){
				share.title = this.userInfo.nick_name+'邀请你一起领略大好河山'
			    share.path = '/pages/tabBar/home/index?type=teamInvite&' + inviteData
				share.imageUrl = this.$refs.teamCard.getImageUrl()
			}
			console.log(share)
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
		onLoad(o) {
			this.getUserInfo()
		},
		onShow() {
			//清空数据
			inviteData = null
			this.downCallback()
		},
		methods:{
			...mapActions({
				getUserInfo: 'user/getUserInfo'
			}),
			/*下拉刷新的回调 */
			downCallback() {
				// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
				// loadSwiper();
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
				this.list = []
				getTeamAll().then(res=>{
					const {team,list} = res.data
					team.invite = Boolean(team.invite)
					this.team = team
					this.list = list
					let unList = []
					let idBase = Date.now()
					let size = list.length
					for (let i = 1;i<=5-size;i++) {
						unList.push({id:idBase+'_un'+i,index:size+i})
					}
					this.unList = unList
					
					this.mescroll.endSuccess()
				})
			},
			//发起邀请
			invite(){
				//没有邀请权限
				if(this.isInvite)return
				
				const {avatar_url,nick_name} = this.userInfo

				//拉取邀请人参数
				getJoinUrl().then(res=>{
					if(res.code == 1){
						inviteData = res.data.url.split('?')[1]
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
			goPage(url){
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #3e8de2;
	}
	.my-team{
		.head-bg{
			width: 100%;
			height: 500rpx;
			background: linear-gradient(180deg,#3e8de2 8%, #3e8de2 100%);
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
		}
		.my-team-box{
			box-sizing: border-box;
			text-align: center;
			padding-bottom: 40rpx;
		}
		.team-head-top{
			position: relative;
			padding-top: 40rpx;
		}
		.team-icon{
			width: 100rpx;
			height: 100rpx;
			margin:0 auto 16rpx;
			border-radius: 10px;
		}
		.team-name{
			font-size: 32rpx;
			font-weight: 700;
			color: #ffffff;
		}
		.team-welfare{
			position: absolute;
			width: 136rpx;
			height: 54rpx;
			background: #2b74c2;
			border-radius: 28px 0px 0px 28px;
			right: 0;
			top: 40rpx;
			font-size: 24rpx;
			font-weight: 400;
			color: #ffffff;
			text-align: center;
			line-height: 54rpx;
		}
		.team-total{
			display: flex;
			padding: 32rpx 0;
			background: rgba(255,255,255,0.2);
			border-radius:10px;
			margin: 40rpx 10rpx 36rpx;
		}
		.team-total-item{
			flex:1;
			text-align: center;
		}
		.total-num{
			font-size: 36rpx;
			font-weight: 700;
			color: #fff45b;
		}
		.total-label{
			font-size: 28rpx;
			font-weight: 400;
			color: #f3f3f3;
		}
		.team-list{
			background: #ffffff;
			border-radius: 10rpx;
			margin: 20rpx 20rpx 0;
		}
		.team-list-head{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-left: 46rpx;
			padding-top: 26rpx;
			padding-bottom: 36rpx;
		}
		.tlh-title{
			font-size: 32rpx;
			font-weight: 700;
			color: #000018;
		}
		.tlh-right{
			font-size: 28rpx;
			font-weight: 400;
			color: #1777fe;
			padding: 20rpx;
		}
		.team-show{
			width: 600rpx;
			height: 600rpx;
			padding: 20rpx;
			position: relative;
			margin: 0 auto 80rpx;
		}
		.round-waves{
			display: block;
			width: 600rpx;
			height: 600rpx;
		}
		.team-member{
			position: absolute;
		}
		.member-icon{
			width: 100rpx;
			height: 100rpx;
			position: relative;
			z-index: 1;
		}
		.dl-num{
			width: 128rpx;
			height: 46rpx;
			background: #3694f9;
			border: 2rpx solid #ffcc91;
			border-radius: 26px;
			position: relative;
			z-index: 1;
			font-size: 24rpx;
			font-weight: 400;
			color: #f3f3f3;
			line-height: 46rpx;
			margin: -20rpx auto 0;
		}
		.member-me{
			background-color: #FF7408;
		}
		.member-name{
			white-space: nowrap;
			font-size: 20rpx;
			font-weight: 400;
			color: #4e4d52;
			margin-top: 5rpx;
			max-width: 120rpx;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			text-align: center;
		}
		
		.nc-name{
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			max-width: 80rpx;
		}
		
		.team-member-location01{
			top: 35rpx;
			left: 70rpx;
		}
		.team-member-location02{
			top: 35rpx;
			right: 70rpx;
		}
		.team-member-location03{
			top: 300rpx;
			left: 0rpx;
		}
		.team-member-location04{
			top: 300rpx;
			right: 0rpx;
		}
		
		.team-member-location05{
			left: 50%;
			transform: translateX(-50%);
			bottom: 0;
		}
		
		.add-member{
			position: absolute;
			width: 114rpx;
			height: 114rpx;
		}
		.crown{
			width: 68rpx;
			height: 60rpx;
			position: absolute;
			top: -30rpx;
			left: 50%;
			transform: translateX(-50%);
		}
		.love-box{
			width: 180rpx;
			height: 168rpx;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
		}
		.love-icon{
			position: absolute;
			z-index: 0;
			width: 180rpx;
			height: 168rpx;
			left: 0;
			top: 0;
		}
		.team-love-num,.team-love-label{
			position: relative;
			z-index: 2;
		}
		.team-love-num{
			padding-top: 20rpx;
			font-size: 48rpx;
			font-weight: 700;
			color: #ffffff;
		}
		.team-love-label{
			font-size: 24rpx;
			font-weight: 400;
			color: #ffffff;
		}
		.invite-btn{
			width: 540rpx;
			margin: 0 auto;
			padding-bottom: 100rpx;
		}
		
		
		
	}

</style>