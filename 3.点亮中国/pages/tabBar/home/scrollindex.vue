<template>
	<view class="home">
			<!-- 空间占据者 -->
			<view class="space-occupier">
				<!-- 地图 -->
				<user-map ref="userMap" v-show="[0,1].includes(tabIndex)"  @createTeam="createTeam" @nextCity="nextCity" @loginToast="loginToast" :mapEnable="mapEnable"/>
				<!-- 热力图 -->
				<hot-map ref="hotMap" v-if="tabIndex == 2"/>
			</view>
			<!-- 滑动条 -->
			<view class="slider" :class="{'is-slider-fixed':isFixed}" @touchstart="mapEnable = false" @touchend="mapEnable = true">
				<view class="slider-box"></view>
			</view>
			<!-- sticky -->
			<van-sticky id="vanSticky" :offset-top="80" @scroll="stickyScroll">
				<van-tabs :active="tabIndex" @change="tabChange" color="#4DBBFF" title-active-color="#FFFFFF" title-inactive-color="#C7C7C7">
				  <van-tab title="个人" :name="0"></van-tab>
				  <van-tab title="团队" :name="1"></van-tab>
				  <van-tab title="全民" :name="2"></van-tab>
				</van-tabs>
			</van-sticky>
			<!-- 个人层 -->
			<view class="elevator" id="userElevator"> 
				<!-- 个人 勋章与城市  -->
				<user v-show="tabIndex == 0||isFixed" ref="userModalCity" :TYPE="0" @scan="scan" @showModal="showModal"/>
			</view>
			<!-- 团队层 -->
            <view class="elevator" id="teamElevator">
				<!-- 我的团队 -->
				<team  v-show="tabIndex == 1||isFixed" ref="team" @createTeam="createTeam" @loginToast="loginToast"/>
				<!-- 团队, 勋章与城市 -->
				<user v-show="tabIndex == 1||isFixed" ref="teamModalCity" :TYPE="1" @scan="scan" @showModal="showModal"/>
				<!-- 团队排行 -->
				<team-ranking v-show="tabIndex == 1||isFixed" ref="teamRanking"/>
            </view>
			<!-- 全民层 -->
			 <view class="elevator" id="wholeElevator">
				<!-- 全民排行 -->
				<whole-ranking v-show="tabIndex == 2||isFixed" ref="wholeRanking"/>
			 </view>
	     <!-- 底部菜单 -->
		<view class="bottom-menu-box">
			<view class="bottom-menu">
				<view class="bottom-menu-btn" @click="goGame">闯关点亮</view>
				<view class="bottom-menu-btn" @click="goHelp">好友助力</view>
			</view>
			<image class="bottom-menu-scan tada" src="../../../static/home/smdl.png" mode="aspectFill" @click="scan"></image>
		</view>
		<!-- 創建團隊 -->
		<create-team ref="createTeam"/>
		<!-- 加入团队 -->
		<accept-team ref="acceptTeam"/>
		<!-- 扫码引导 -->
		<scan-tutor ref="scanTutor"/>
		<!-- 游戏引导 -->
		<game-tutor ref="gameTutor"/>
		<!-- 邀请助力 -->
		<invited-help ref="invitedHelp"/>
		<!-- 助力列表 -->
		<help-list-pop ref="helpListPop" @clearHelpMarker="clearHelpMarker"/>
		<!-- 立即助力 -->
		<immediate-help ref="immediateHelp" @cancelHelp="cancelHelp" @helpSuccess="helpSuccess"/>
		<!-- 助力关闭 --抢救一下 -->
		<discard-help ref="discardHelp"/>
		<!-- 助力成功提示 -->
		<power-success ref="powerSuccess" @goScan="scan"/>
		<!-- 勋章弹窗 -->
		<medal-popup ref="medalPopup" @share="medalShare"/>
		<!-- 吸顶遮罩 -->
		<view v-if="isFixed" class="is-fixed"></view>
	</view>
</template>

<script>
	import userMap from './components/userMap.vue'
    import hotMap from './components/hotMap.vue'
	import user from './content/user.vue'
	import team from './content/team.vue'
	import teamRanking from './content/teamRanking.vue'
	import wholeRanking from './content/wholeRanking.vue'
	import createTeam from './business/createTeam.vue'
	import acceptTeam from './business/acceptTeam.vue'
	import scanTutor from './business/scanTutor.vue'
	import gameTutor from './business/gameTutor.vue'
	import invitedHelp from './business/invitedHelp.vue'
	import helpListPop from './business/helpListPop.vue'
	import immediateHelp from './business/immediateHelp.vue'
	import discardHelp from './business/discardHelp.vue'
	import powerSuccess from './business/powerSuccess.vue'
	import medalPopup from '@/components/popupWindow/medalPopup.vue'
    import {mapGetters,mapActions} from 'vuex'
	import {getShareUrl} from '@/api/modules/help.js'
	import {geRealtUserMedal,getRealTeamMedal} from '@/api/modules/home.js'
	import {debounce} from '@/utils/index.js'
	//页面参数
	let _PAGEPARMAS;
	//邀请数据
	let inviteData;
	//nextCity
	let _nextCity={user:'',team:''};
	//是否在当前页
	let _isCurrPage = true;
	//是否页面在滚动
	let _isPageScroll = false
	//是否tab在切换滚动
	let _isTabScroll = false
	//第一次置顶
	let _isStickyOneScoll = {
		num:-1,
		flag:false
	}
	export default {
		components:{
			userMap,hotMap,user,team,teamRanking,
			wholeRanking,createTeam,acceptTeam,
			scanTutor,gameTutor,invitedHelp,helpListPop,
			immediateHelp,discardHelp,powerSuccess,medalPopup
		},
		data(){
			return {
				upOption: {
					auto: false,
					empty: {
						tip: '~ 空空如也 ~', // 提示
						btnText: '刷新试试'
					},
					toTop: {
						src: ''
					},
					isLock: true
				},
				isFixed:false,
				tabIndex:0,
				mapEnable:true
			}
		},
		watch:{
			userInfo(){
				//在当前页才处理
				if(_isCurrPage){
					//未授权
					if(!this.isAuthorization){
						//授权登录确认
						this.loginToast()
						return
					}
					//处理外部分享或其它方式带参进入页面
					this.initLoadParmas()
					//初始化页面信息
					this.initAll();
				}
		  }
		},
		onLoad(o) {
			//保存参数
			_PAGEPARMAS = o
		},
		onShow(o) {
			//当前页状态
			_isCurrPage = true
			//是否页面在滚动
			let _isPageScroll = false
			//是否tab在切换滚动
			let _isTabScroll = false
			//第一次置顶
			let _isStickyOneScoll = {
				num:-1,
				flag:false
			}
			//刷新用户信息
			if(this.isAuthorization)this.getUserInfo()
		},
		onHide() {
			_isCurrPage = false
			//清空参数
			_PAGEPARMAS = {}
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
			...mapGetters(['userInfo','isAuthorization'])
		},
		methods:{
			...mapActions({
				updateUserNew: 'user/updateUserNew',
				getUserInfo: 'user/getUserInfo'
			}),
			stickyScroll(e){
				const {isFixed} = e.detail
				if(isFixed){
					this.isFixed = true
					//确保是第一次
					if(!_isStickyOneScoll.flag||_isStickyOneScoll.num > 0){
						_isStickyOneScoll.flag = true;
						_isStickyOneScoll.num++;
					}
				}else{
					this.isFixed = false
					_isStickyOneScoll = {
						num:-1,
						flag:false
					}
				}
			},
			//处理外部分享或其它方式带参进入页面
			initLoadParmas(){
				//加入团队链接处理
				// if(_PAGEPARMAS.type == 'teamInvite'&&!this.userInfo.team_id){
					if(_PAGEPARMAS.type == 'teamInvite'){
					setTimeout(()=>{
						this.$refs.acceptTeam.popupShow({
							..._PAGEPARMAS
						})
						// //置空避免重复处理
						// _PAGEPARMAS = {}
					},0)
					//防止自己给自己助力
				}else if(_PAGEPARMAS.type == 'inviteHelp'&&this.userInfo.id != _PAGEPARMAS.uid){//立即助力
				    if(!this.isAuthorization){
						//前往授权
						this.loginToast()
						return
					}
					setTimeout(()=>{
						this.$refs.immediateHelp.popupShow({
							..._PAGEPARMAS
						})
						// //置空避免重复处理
						// _PAGEPARMAS = {}
					},0)
				}else{
					//置空避免重复处理
					_PAGEPARMAS = {}
				}
				//延时清空
				setTimeout(()=>{
					_PAGEPARMAS = {}
				},100)
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
			//创建团队
			createTeam(){
				this.$refs.createTeam.popupShow()
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
				// if(this.tabIndex == 1&&!this.userInfo.team_id){
				// 	this.$refs.createTeam.popupShow()
				// 	return
				// }
				//扫一扫点亮
				this.$refs.scanTutor.popupShow(this.tabIndex == 1?_nextCity.team:_nextCity.user)
			},
			//游戏点亮
			goGame(){
				//未授权用户信息
				if(!this.isAuthorization){
					//前往授权
					this.loginToast()
					return
				}
				//扫一扫点亮
				this.$refs.gameTutor.popupShow()
			},
			goHelp(){
				//未授权用户信息
				if(!this.isAuthorization){
					//前往授权
					this.loginToast()
					return
				}
				getShareUrl().then(res=>{
					inviteData = res.data.url.split('?')[1]
					this.$refs.invitedHelp.popupShow()
				})
			},
			// 切换菜单
			tabChange (e) {
				// if(_isScroll)return
				this.tabIndex = e.detail.name
				switch (this.tabIndex){
					case 0:
					this.initUser()
					break;
					case 1:
					this.initTeam()
					break;
					case 2:
					this.initWhole()
					break;
				}
				//处理滚动
				console.log('tabChange _isPageScroll=',_isPageScroll)
				this.scrollContent()
			},
			initAll(){
				//个人地图数据
				this.$refs.userMap.initData(this.tabIndex)
				//个人点亮城市
				this.$refs.userModalCity.initCity(this.tabIndex)
				//个人勋章
				this.$refs.userModalCity.initMedal(this.tabIndex)
				//团队成员
				this.$refs.team.initData()
				//个人地图数据
				this.$refs.userMap.initData(this.tabIndex)
				//个人点亮城市
				this.$refs.teamModalCity.initCity(this.tabIndex)
				//个人勋章
				this.$refs.teamModalCity.initMedal(this.tabIndex)
				//团队排行
				this.$refs.teamRanking.initData()
				//团队排行
				this.$refs.wholeRanking.initData()
				//刷新助力相关
				this.initHelp()
			},
			//个人
		    initUser(){
				setTimeout(()=>{
					//个人地图数据
				   this.$refs.userMap.initData(this.tabIndex)
				   //个人点亮城市
					this.$refs.userModalCity.initCity(this.tabIndex)
				   //个人勋章
					this.$refs.userModalCity.initMedal(this.tabIndex)
					//刷新助力相关
					this.initHelp()
				 },0)
			},
			//团队
			initTeam(){
				setTimeout(()=>{
					//团队成员
					this.$refs.team.initData()
					//个人地图数据
					this.$refs.userMap.initData(this.tabIndex)
					//个人点亮城市
					this.$refs.teamModalCity.initCity(this.tabIndex)
					//个人勋章
					this.$refs.teamModalCity.initMedal(this.tabIndex)
					//团队排行
					this.$refs.teamRanking.initData()
					//刷新助力相关
					this.initHelp()
				},0)
			},
			//全民
			initWhole(){
				setTimeout(()=>{
					//热力图
					if(this.$refs.hotMap)this.$refs.hotMap.initData()
					//团队排行
					this.$refs.wholeRanking.initData()
					//刷新助力相关
					this.initHelp()
				},0)
			},
			initHelp(){
				if(['teamInvite','inviteHelp'].indexOf(_PAGEPARMAS.type)==-1){
					//助理記錄
					this.$refs.helpListPop.init()
					//獲取助力鏈接
					getShareUrl().then(res=>{
						if(res.data.url)inviteData = res.data.url.split('?')[1]
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
						const {province,image,create_time} = res.data
						this.showModal({
							medalImage:image,
							isLightUp:true,
							province:province,
							create_time:create_time,
							type:this.tabIndex
						})
					}
				})
			},
			//显示弹窗
			showModal(data){
				this.$refs.medalPopup.showTime(data)
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
					title: '温馨提示',
					content: '点亮中国提醒您，点击“确定”授权用户信息后，为您开启更多服务',
					success:  (res) => {
							if (res.confirm) {
								this.userEmpower()
							}
						}
				});
			},
			//登录授权
			userEmpower() {
				//获取用户加密信息
				wx.getUserProfile({
					lang: 'zh_CN',
					desc: '登录', //不写不弹提示框
					success: (user) => {
						let {encryptedData,iv} = user
						if (!encryptedData||!iv) {
							//仅提示用户
							uni.showModal({
								title: '用户信息获取失败',
								content: '请点击登录按钮，重新尝试',
								showCancel: false
							});
							return;
						}
						this.updateUserNew({encryptedData,iv}).then(res=>{})
					},
					fail: (err) => {
						//仅提示用户
						uni.showModal({
							title: '温馨提示',
							content: '请先授权用户信息，可以开放更多功能哟',
							showCancel: false
						});
					}
				});
			},
			scrollContent(){
				console.log('scrollContent',!this.isFixed||_isPageScroll)
				//如果沒吸頂不處理
				if(!this.isFixed||_isPageScroll)return
				//設置滾動狀態
				_isTabScroll = true
				//当前选项位置
				let currIndex = this.tabIndex
				//拿到节点筛选器
				let query = uni.createSelectorQuery().in(this)
				//拿到tab节点
				query.select('#vanSticky').boundingClientRect()
				query.selectAll('.elevator').boundingClientRect()
				query.selectViewport().scrollOffset()
				query.exec(function(res){
				 //tab以上高度减去tab距离窗口的距离
				  const base = 350
				  let vanSticky = res[0]
				  let [userElevator,teamElevator,wholeElevator] = res[1]
				  let viewPort = res[2]
				  let scrollTop = 0
				  //个人
				  if(currIndex == 0){
					scrollTop = 350
				  }else if(currIndex == 1){//团队
				    scrollTop = userElevator.height +  350
				  }else{//全民
					scrollTop = userElevator.height + teamElevator.height +  350
				  }
				  //滾動到指定位置
				  uni.pageScrollTo({
					duration:0,
				  	scrollTop
				  })
				  //延迟处理
				  setTimeout(()=>{
					  _isTabScroll = false
					  //第一次处理完毕
					  if(_isStickyOneScoll.num == 0){
					  	_isStickyOneScoll.num++
					  }
				  },300)
				})
			}
		},
		onPageScroll(e){
			//如果是第一次置顶需要并且不是第一个人则不在这里处理
			if(_isStickyOneScoll.flag&&_isStickyOneScoll.num == 0&&this.tabIndex != 0){
				console.log('onPageScroll执行了')
				this.scrollContent()
				return
			}
			//如果没有吸顶或者在滾動則不處理
			if(!this.isFixed||_isTabScroll){
				console.log('未吸顶不处理')
				return
			}
			console.log(_isTabScroll,'onPageScroll')
			//设置处理状态
			_isPageScroll = true
			//拿到节点筛选器
			let query = uni.createSelectorQuery().in(this)
			//顶部死基数
			const base = 124
			//处理滚动数据
			query.selectAll(".elevator").boundingClientRect().exec((res)=>{
				        //取出对应数据
						let [userElevator,teamElevator,wholeElevator] = res[0]
						let tabIndex = 0
						//个人
						if(userElevator.top>0||userElevator.top+(userElevator.height-base)>0){
							tabIndex = 0
						}else if(teamElevator.top>0||teamElevator.top+(teamElevator.height-base)>0){
							tabIndex = 1
						}else if(wholeElevator.top>0||wholeElevator.top+(wholeElevator.height-base)>0){
							tabIndex = 2
						}
						console.log('tabIndex = ',tabIndex)
						this.tabIndex = tabIndex
						setTimeout(()=>{
							_isPageScroll = false
						},300)
				  })
		}
		/*onPageScroll:debounce(function(e){
			//如果是第一次置顶需要并且不是第一个人则不在这里处理
			if(_isStickyOneScoll.flag&&_isStickyOneScoll.num == 0&&this.tabIndex != 0){
				console.log('onPageScroll执行了')
				this.scrollContent()
				return
			}
			//如果没有吸顶或者在滾動則不處理
			if(!this.isFixed||_isTabScroll){
				console.log('未吸顶不处理')
				return
			}
			console.log(_isTabScroll,'onPageScroll')
			//设置处理状态
			_isPageScroll = true
			//拿到节点筛选器
			let query = uni.createSelectorQuery().in(this)
			//顶部死基数
			const base = 124
            //处理滚动数据
			query.selectAll(".elevator").boundingClientRect().exec((res)=>{
				        //取出对应数据
						let [userElevator,teamElevator,wholeElevator] = res[0]
						//个人
						if(userElevator.top>0||userElevator.top+(userElevator.height-base)>0){
							this.tabIndex = 0
						}else if(teamElevator.top>0||teamElevator.top+(teamElevator.height-base)>0){
							this.tabIndex = 1
						}else if(wholeElevator.top>0||wholeElevator.top+(wholeElevator.height-base)>0){
							this.tabIndex = 2
						}
						setTimeout(()=>{
							_isPageScroll = false
							console.log('_isPageScroll = false')
						},300)
				  })
		},100)*/
	}
</script>

<style lang="scss">
	page{
		background-color: #232839;
	}
 .home{
	 background-color: #232839;
	 padding-bottom: 136rpx;
	 .space-occupier{
		 height: 370px;
	 }
	 .home-scroll-view{
		 position: fixed;
		 top: 0;
		 left: 0;
		 right: 0;
		 bottom: 0;
	 }
	 .van-tabs__scroll,.van-tabs__wrap{
		 background-color: #232839;
	 }
	 .van-tabs__nav{
		 background-color: #2E3C59;
		 border-radius: 20px 20px 0 0;
	 }
	 .van-tabs__line{
		 bottom: 20rpx;
	 }
	 .bottom-menu-box{
		padding: 30rpx 30rpx 30rpx;
		background-color: #394A6D;
		position: fixed;
		width: 100%;
		bottom: 0;
		left: 0;
		box-sizing: border-box;
		z-index: 1000;
	 }
	 .bottom-menu{
		 display: flex;
		 justify-content: space-between;

		 .bottom-menu-btn{
			 width: 220rpx;
			 height: 76rpx;
			 box-sizing: border-box;
			 background-color: #0081E4;
			 border: 2rpx solid #1684fc;
			 border-radius: 40px;
			 color: #ffffff;
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
	 .is-fixed{
		 height: 80px;
		 position: fixed;
		 z-index: 999;
		 left: 0;
		 right: 0;
		 top: 0;
		 width: 100%;
		 background-color: #232839;
	 }
	 .slider{
	 	position: relative;
	 	width: 52px;
	 	height: 8px;
		margin: -24px auto 0;
		padding: 8px 0;
		z-index: 1000;
		.slider-box{
			width: 52px;
			height: 8px;
			background-color: #4F6784;
			border-radius: 30px;
		}
	 }
	 .is-slider-fixed{
		 position: fixed;
		 margin:0;
		 top: 50px;
		 left: 50%;
		 transform: translateX(-50%);
	 }
 }
</style>
