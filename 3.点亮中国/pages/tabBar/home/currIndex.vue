<template>
	<view>
		<!-- :style="{paddingTop:navbarData.height+'px'}" -->
		<!-- <scroll-view class="home"  :scroll-y="true" @scroll="scroll"> @down="downCallback"-->
		 <view class="home">
				<mescroll-uni class="home" ref="mescrollRef" :fixed="false"  @init="mescrollInit"
										:down="{use:false}"  :up="{use:false}">
					<!-- 导航 -->
					<view :style="{paddingTop:navbarData.height+'px'}"></view>
					<!-- :class="showMask?'custom-scroll':'custom-top'" -->
					<view class="custom-nav"  :style="{height:navbarData.height+'px',paddingTop:navbarData.paddingTop+'px'}">
						扫码献能量，一起点亮中国
					</view>
					<!-- 占据空间 -->
					<!-- <view v-if="showMask" class="space-occupa" :style="{paddingTop:navbarData.height+'px'}"></view> -->
						<!-- 空间占据者 -->
						<view class="space-occupier">
							<!-- 地图 -->
							<user-map ref="userMap" v-show="[0,1].includes(tabIndex)" @nextCity="nextCity" @loginToast="loginToast"/>
						</view>
						<!-- 个人 勋章与城市  -->
						<user v-show="tabIndex == 0" ref="userModalCity" :TYPE="0" @scan="scan" @showModal="showModal"/>
						<!-- 引導頁 -->
						<guide-model ref="guideModel"/>
				</mescroll-uni>
			</view>
			 <!-- 底部菜单 -->
			<view class="bottom-menu-box">
				<view class="bottom-menu">
					<view class="bottom-menu-btn" @click="goGame">闯关点亮</view>
					<view class="bottom-menu-btn" @click="goHelp">好友助力</view>
				</view>
				<image class="bottom-menu-scan tada" src="../../../static/home/smdl.png" mode="aspectFill" @click="scan"></image>
			</view>
			<!-- 扫码引导 -->
			<scan-tutor ref="scanTutor" @scanCodeType="scanCodeType" @resetScanState="resetScanState"/>
			<!-- 游戏引导 -->
			<game-tutor ref="gameTutor"/>
			<!-- 邀请助力 -->
			<invited-help ref="invitedHelp"/>
			<!-- 助力列表 -->
			<help-list-pop ref="helpListPop" @clearHelpMarker="clearHelpMarker"/>
			<!-- 立即助力 -->
			<immediate-help ref="immediateHelp" @cancelHelp="cancelHelp" @helpSuccess="helpSuccess" @loginToast="loginToast" @showGuide="showGuide"/>
			<!-- 助力关闭 --抢救一下 -->
			<discard-help ref="discardHelp" @showGuide="showGuide"/>
			<!-- 助力成功提示 -->
			<power-success ref="powerSuccess" @goScan="scan" @showGuide="showGuide"/>
			<!-- 勋章弹窗 -->
			<medal-popup ref="medalPopup" @share="medalShare"/>
			<!--扫码点亮城市-->
			<light-city ref="lightCity" @scan="direcTscan"/>
			<!--即將點亮-->
			<soon-light-city ref="soonLightCity" @scan="direcTscan"/>
			<!--重复扫码-->
			<scanned ref="scanned" @scan="direcTscan"/>
			<!--扫码錯誤提示-->
			<scan-error ref="scanError" @scan="direcTscan"/>
	</view>
</template>

<script>
	import userMap from './components/userMap.vue'
	import user from './content/user.vue'
	import scanTutor from './business/scanTutor.vue'
	import gameTutor from './business/gameTutor.vue'
	import invitedHelp from './business/invitedHelp.vue'
	import helpListPop from './business/helpListPop.vue'
	import immediateHelp from './business/immediateHelp.vue'
	import discardHelp from './business/discardHelp.vue'
	import powerSuccess from './business/powerSuccess.vue'
	import medalPopup from '@/components/popupWindow/medalPopup.vue'
	import lightCity from './scanBusiness/lightCity.vue'
	import soonLightCity from './scanBusiness/soonLightCity.vue'
	import scanned from './scanBusiness/scanned.vue'
	import scanError from './scanBusiness/scanError.vue'
	import guideModel from './business/guideModel.vue'
    import {mapGetters,mapActions} from 'vuex'
	import {getShareUrl} from '@/api/modules/help.js'
	import {geRealtUserMedal,getRealTeamMedal} from '@/api/modules/home.js'
	import {getAppLaunchNum,setUserGuide,getUserGuide} from '@/utils/auth.js'
	import {getNavbarData} from '@/components/xhNavbar/xhNavbar.js'
	import {getUserLocation} from '@/utils/getUserLocation.js'
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	//页面参数
	let _PAGEPARMAS;
	//邀请数据
	let inviteData;
	//nextCity
	let _nextCity={user:'',team:''};
	//是否在当前页
	let _isCurrPage = true;
	//是否在处理扫码弹窗
	let isScanTutor = false
	export default {
		mixins: [MescrollMixin],
		components:{
			userMap,user,
			scanTutor,gameTutor,invitedHelp,helpListPop,
			immediateHelp,discardHelp,powerSuccess,medalPopup,
			lightCity,soonLightCity,scanned,scanError,
			guideModel
		},
		data(){
			return {
				// downOption: {
				// 	auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				// },
				tabIndex:0,
				navbarData:{
					height: 88,
					paddingTop:28
				},
				showMask:false
			}
		},
		watch:{
			userInfo(){
				if(_isCurrPage){
					//默认请求
					setTimeout(()=>{
						//默认请求
						if(this.$refs.userModalCity)this.$refs.userModalCity.initMedal(this.tabIndex)
					},0)
					//未授权
					if(!this.isAuthorization){
							if(_PAGEPARMAS&&_PAGEPARMAS.type){
								this.initLoadParmas()
								return;
							}
							//授权登录确认
							this.loginToast()
						return
					}
					//处理外部分享或其它方式带参进入页面
					this.initLoadParmas()
					//初始化用户信息
					this.tabChange({
						detail:{
							name:this.tabIndex
						}
					})
				}
		  }
		},
		onLoad(o) {
			//邀请数据
			inviteData = null
			//nextCity
			_nextCity={user:'',team:''}
			//是否在当前页
			_isCurrPage = true;
			//是否在处理扫码弹窗
			isScanTutor = false
			//保存参数
			_PAGEPARMAS = o
			//自定义导航栏需要
			getNavbarData().then(res=>{
				let {navBarHeight,statusBarHeight} = res
				this.navbarData = {
					height: navBarHeight+statusBarHeight,
					paddingTop:statusBarHeight
				}
			})
		},
		onShow() {
			//当前页
			_isCurrPage = true
			//避免当前页多次触发onshow
			if(isScanTutor)return
			//刷新用户信息
			if(this.isAuthorization){
				this.getUserInfo()
			}else if(getAppLaunchNum()>0&&!this.isAuthorization&&this.userInfo){
				this.initLoadParmas()
			}
			//回到顶部
			this.mescroll.scrollTo( 0, 0 );
		},
		onHide() {
			_isCurrPage = false
		},
		onShareAppMessage(data) {
			let share = {
				title: '点亮全中国，一起攒能量',
				path: '/pages/tabBar/home/index',
				imageUrl:'https://file.y1b.cn/public/img/dlzg/zl_share.png'
			}
			if(data.from == 'button'){
				share.title = '好友们都在为我助力，点击参与！'
			    share.path = '/pages/tabBar/home/index?type=inviteHelp&' + inviteData
			}
			return share;
		},
		computed:{
			...mapGetters(['userInfo','isAuthorization','new_user'])
		},
		methods:{
			...mapActions({
				getUserInfo: 'user/getUserInfo'
			}),
			/*下拉刷新的回调 */
			downCallback() {
				//初始化用户信息
				this.tabChange({
					detail:{
						name:this.tabIndex
					}
				})
			},
			scroll(e) {
				let {scrollTop} = e.detail
				this.showMask = scrollTop>50
			},
			//展示引导页
			showGuide(){
				//没有出现过引导页并且没有授权过
				if(!getUserGuide()&&this.new_user!=0){
                    this.$refs.guideModel.showGuide()
					setUserGuide()
				}
			},
			//处理外部分享或其它方式带参进入页面
			initLoadParmas(){
				/*没有参数则不处理*/
				if(!_PAGEPARMAS||!_PAGEPARMAS.type){
					this.showGuide()
					return
				}
				setTimeout(()=>{
					//加入团队链接处理
					if(_PAGEPARMAS.type == 'teamInvite'&&!this.userInfo.team_id){
							this.$refs.acceptTeam.popupShow({
								..._PAGEPARMAS
							})
						//防止自己给自己助力
					}else if(_PAGEPARMAS.type == 'inviteHelp'&&this.userInfo.id != _PAGEPARMAS.uid){//立即助力
							this.$refs.immediateHelp.popupShow({
								..._PAGEPARMAS
							})
					}
					//清除参数
					_PAGEPARMAS = {}
				},0)
			},
			//用户关闭助力
			cancelHelp(){
				//显示是否放弃助力，抢救下
				this.$refs.discardHelp.popupShow(_PAGEPARMAS)
				//置空避免重复处理
				_PAGEPARMAS = {}
			},
			//显示助力成功弹窗
			helpSuccess(data){
				this.$refs.powerSuccess.popupShow(data)
			},
			//扫一扫点亮
			nextCity(data){
				if(data.type == 0){
					_nextCity.user = data.city
				}else{
					_nextCity.team = data.city
				}
			},
			scan(){
				//未授权用户信息
				if(!this.isAuthorization){
					//前往授权
					this.loginToast()
					return
				}
				//扫一扫点亮
				isScanTutor = true
				this.$refs.scanTutor.popupShow(this.tabIndex == 1?_nextCity.team:_nextCity.user)
			},
			//直接扫一扫
			direcTscan(){
				//扫一扫点亮
				isScanTutor = true
				this.$refs.scanTutor.wxScan()
			},
			resetScanState(flag){
				isScanTutor = false
				if(flag)this.getUserInfo()
			},
			scanCodeType(data){
				switch(data.type){
					//點亮了城市
					case 1:
					this.$refs.lightCity.showTime(data)
					break
					case 2:
					this.$refs.soonLightCity.popupShow(data)
					break
					case 3:
					this.$refs.scanned.popupShow()
					break
					case 4:
					this.$refs.scanError.popupShow(data.msg)
					break
				}
			},
			//游戏点亮
			goGame(){
				//未授权用户信息
				if(!this.isAuthorization){
					//前往授权
					this.loginToast()
					return;
				}
				//扫一扫点亮
				this.$refs.gameTutor.popupShow()
			},
			goHelp(){
				//未授权用户信息
				if(!this.isAuthorization){
					//前往授权
					this.loginToast()
					return;
				}
				/*助力时需要*/
				getUserLocation().then(res=>{
					let {longitude,latitude} = res.data
					getShareUrl().then(res=>{
						inviteData = res.data.url.split('?')[1]+'&longitude='+longitude+'&latitude='+latitude
						this.$refs.invitedHelp.popupShow()
					})
				})
			},
			// 切换菜单
			tabChange (e) {
				this.tabIndex = e.detail.name;
				setTimeout(()=>{
					switch (this.tabIndex){
						case 0:
						this.initUser()
						break;
						// case 1:
						// this.initTeam()
						// break;
						// case 2:
						// this.initWhole()
						// break;
					}
				},0)
			},
			//个人
		    initUser(flag){
					//个人地图数据
				   if(this.$refs.userMap)this.$refs.userMap.initData(this.tabIndex)
				   //个人点亮城市
				   if(this.$refs.userModalCity)this.$refs.userModalCity.initCity(this.tabIndex)
				   //个人勋章
				   // if(this.$refs.userModalCity)this.$refs.userModalCity.initMedal(this.tabIndex)
					//刷新助力相关
				   if(!flag)this.initHelp()
			},
			initHelp(){
				if(['teamInvite','inviteHelp'].indexOf(_PAGEPARMAS.type)==-1){
					//助理記錄
					this.$refs.helpListPop.init()
					//獲取助力鏈接
					/*助力时需要*/
					getUserLocation().then(res=>{
						let {longitude,latitude} = res.data
						getShareUrl().then(res=>{
							inviteData = res.data.url.split('?')[1]+'&longitude='+longitude+'&latitude='+latitude
						})
					})
				}
			},
			//清除助力列表标记
			clearHelpMarker(){
				_PAGEPARMAS = {}
				//最新获取的勋章展示
				this.getNewModal()
			},
			/*实时勋章弹窗*/
			getNewModal(){
				const Api = this.tabIndex == 0?geRealtUserMedal:getRealTeamMedal
				Api(true).then(res=>{
					if(res.data){
						const {province,image,create_time,love,reward_love,city_num,user_prop,id,credits} = res.data
						this.showModal({
							medalImage:image,
							isLightUp:true,
							province:province,
							create_time:create_time,
							type:this.tabIndex,
							love,
							reward_love,
							city_num,
							user_prop,
							id,
							credits
						})
					}
				})
			},
			//显示弹窗
			showModal(data){
				this.$refs.lightCity.popupClose();
				console.log("currIndex.vue传递")
				this.$refs.medalPopup.showTime(data);
			},
			/*实时勋章弹窗 分享*/
			medalShare(data){
				const {cityAllNum,date,medalIcon,nextTarge,province,rate} = data

				this.$router.navigateTo({
						url:`/pages/user/medal/index?type=${this.tabIndex}&cityAllNum=${cityAllNum}&date=${date}&medalIcon=${medalIcon}&nextTarge=${nextTarge}&province=${province}&rate=${rate}`
					})
			},
			//授权登录确认
			loginToast(){
				uni.showModal({
					title:'温馨提示',
					content:'您还未授权，是否前往授权？',
					success:(res)=>{
						if(res.confirm){
							uni.navigateTo({
								url:'/pages/tabBar/login/index'
							})
							return
						}
						//展示引导页
						this.showGuide()
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F7F6F2;
	}
 .home{
	 position: fixed;
	 top: 0;
	 bottom: 138rpx;
	 left: 0;
	 width: 100%;
	 box-sizing: border-box;
	 .space-occupier{
	 	height: 370px;
		position: relative;
	 }
	 .van-tabs__scroll,.van-tabs__wrap{
		 background-color: rgb(39, 55, 96);
	 }
	 .van-tabs__nav{
		 background-color: #2E3C59;
		 border-radius: 20px 20px 0 0;
	 }
	 .van-tabs__line{
		 bottom: 20rpx;
	 }
	 
 }
 
 .bottom-menu-box{
 		padding: 30rpx 30rpx 30rpx;
 		background-color: #FFF5E8;
 		position: fixed;
 		width: 100%;
 		bottom: 0;
 		left: 0;
 		box-sizing: border-box;
 		z-index: 1000;
 		box-shadow: 0 2px 12px 0 rgba(0, 0, 0,.1);
 }
 .bottom-menu{
 		 display: flex;
 		 justify-content: space-between;
 
 		 .bottom-menu-btn{
 			width: 220rpx;
 			height: 76rpx;
 			box-sizing: border-box;
 			background-color: #ffe0b9;
 			border: 2rpx solid #ffb676;
 			border-radius: 40px;
 			color: #99673D;
 			font-size: 28rpx;
 			display: flex;
 			align-items: center;
 			justify-content: center;
 		 }
 }
 .bottom-menu-scan{
 		width: 214rpx;
 		height: 138rpx;
 		position: absolute;
 		top: -40rpx;
 		left: 50%;
 		margin-left: -107rpx;
 		z-index: 100;
 }
 
 .custom-nav{
 		 box-sizing: border-box;
 		 font-size: 28rpx;
 		 font-weight: 400;
 		 color: #000018;
 		 display: flex;
 		 align-items: center;
 		 padding-left: 20px;
 		 position: fixed;
 		 left: 0;
 		 top: 0;
 		 width: 100%;
 		 z-index: 12;
		 background-image: linear-gradient(180deg,#2cb8b8,#ffffff);
		 box-shadow: 0 2px 12px 0 rgba(0, 0, 0,.1);
 }
 
 .custom-top{
 		 background-image: linear-gradient(180deg,#2cb8b8 3%, rgba(144,204,204,0.00));
 }
 
 .custom-scroll{
 	 background-color: transparent;
 }
 
 .space-occupa{
 		 // height: 130rpx;
 		 position: fixed;
 		 z-index: 11;
 		 width: 100%;
 		 top: 0;
 		 left: 0;
 		 background-image: linear-gradient(180deg,#2cb8b8,#ffffff);
 		 box-shadow: 0 2px 12px 0 rgba(0, 0, 0,.1);
 }
 
</style>
