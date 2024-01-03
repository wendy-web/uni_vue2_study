<template>
	<view class="index">
		<xh-navbar  titleColor="#ffffff" :isHome="true" @leftCallBack="back"></xh-navbar>
		<!-- 紅牛icon-head -->
<!-- 		<view class="head" :style="{'height':navBarConfig.navBarHeight+'px'}">
			<image class="back" src="../static/back.png" mode="aspectFill" ></image>
			<view class="back" @click="back">
				<van-icon name="wap-home-o" color="#ffffff" size="25"/>
			</view>
			<image class="head-icon" src="../static/head.png" mode="heightFix"></image>
		</view> -->
		<!-- 回到首页 -->
		<scroll-view class="index-scroll" :scroll-y="true" :show-scrollbar="false" :enhanced="true" :style="{top:(navBarConfig.statusBarHeight+navBarConfig.navBarHeight)+'px'}">
			<!-- title -->
			<image class="title" src="../static/title.png" mode="aspectFill"></image>
			<!-- 扫码次数 -->
			<view class="idcode">
				<text>身份编码:</text>
				<text class="right">{{qr_info.QRCode|empty}}</text>
			</view>
			<view class="scan-num">
				<text>查询次数:</text>
				<text class="right">{{qr_info.ScanNum|empty}}次</text>
			</view>
			<!-- 地圖背景 -->
			<view class="map">
				<image class="map-icon" src="../static/map.png" mode="aspectFill"></image>
			</view>
			<!-- 贴心语气 -->
			<view class="tx-tips">
				{{lit_msg|empty}}
			</view>
			<!-- 扫码进度 -->
			<view class="progress-tips" v-if="lit_city">
				<!-- 已点亮 -->
				<view v-if="lit_city.scan_num==0">
					感谢参与！本次扫码已点亮：<text class="city">{{lit_city.city}}</text>
				</view>
				<!-- 还未点亮 -->
				<view v-else>
					感谢参与！即将点亮<text class="city">{{lit_city.city}}</text>
					<!-- 感谢参与！再扫<text class="num">{{lit_city.scan_num|empty}}</text>罐即可点亮<text class="city">{{lit_city.city}}</text> -->
				</view>
			</view>
			<!-- 壹基金 -->
            <view :class="{'dl-btn-top':Boolean(!lit_city)}">
				<view class="yjj">
					<image class="yjj-icon" src="../static/yjj.png" mode="aspectFill"></image>
				</view>
            	<!-- 點亮更多 -->
            	<view class="dl-btn heartBeat"  @click="back">
            		<text>点亮更多城市</text>
            		<image class="dl-btn-bg" src="../static/btn.png" mode="aspectFill"></image>
            	</view>
            </view>
			<view class="dl-tips">
				{{heat_msg}}
			</view>
			<!-- 更多信息 -->
			<view class="more-info" @click="goMore">
				更多信息
			</view>
		</scroll-view>
		<!-- 背景 -->
		<image class="index-bg" src="../static/bg.png"  mode="aspectFill"></image>
		<!-- 隐私协议的组件 -->
		<privacy ref="privacy"></privacy>
	</view>
</template>

<script>
	import {getNavbarData} from '@/components/xhNavbar/xhNavbar.js'
	import {getUserLocation} from '@/utils/getUserLocation.js'
	import {qrCode} from '@/api/modules/index.js'
	import {mapGetters,mapActions} from 'vuex'
	//扫码进来的参数
	let _scanCode = ''
	export default {
		data(){
		  return {
			  navBarConfig:{
				  navBarHeight:0,
				  statusBarHeight:0, //状态栏高度
				  menuWidth:0,
				  top:0
			  },
			  lit_city:null,
			  lit_msg:'',
			  heat_msg:'',
			  qr_info:{}
		  }
		},
		onLoad(o) {
			//扫码进来的参数
			_scanCode = o&&o.q;
			this.getLocation();
			if(this.isAuthorization&&_scanCode){
				// 获取定位
				this.getLocation();
			}
			//获取导航栏数据
			getNavbarData().then(res=>{
			   this.navBarConfig = res
			})
		},
		onShow() {
			// 隐私协议判断
			this.$refs.privacy.LifetimesShow();
		},
		filters:{
		  empty(val){
			  if(val===undefined||val===null||val===''){
				  return '-'
			  }
			  return val
		  }
		},
		computed:{
			...mapGetters(['isAuthorization'])
		},
		watch:{
			isAuthorization(){
				if(this.isAuthorization&&_scanCode){
					//获取定位
					this.getLocation();
				}else if(!this.isAuthorization){
					uni.showModal({
						title: '温馨提示',
						content: '点亮中国提醒您，点击“确定”后授权用户信息',
						success:  (res) => {
						        if (res.confirm) {
						            this.userEmpower()
						        }
						    }
					});
				}
			}
		},
		methods:{
			...mapActions({
				updateUserNew: 'user/updateUserNew'
			}),
			//回到首页
			back(){
				  uni.reLaunch({
					  url:'/pages/tabBar/home/index'
				  })
			},
			//查看详情
			goMore(){
				uni.navigateTo({
					url:`/pages/scanModular/details/index?data=${JSON.stringify(this.qr_info)}`
				})
			},
			// //点亮更多城市
			// lightCity(){
			// 	//没有授权先授权
			// 	if(!this.isAuthorization){
			// 		this.userEmpower(true)
			// 		return
			// 	}
   //              uni.scanCode({
   //              	scanType:'qrCode',
			// 		success:(e)=>{
			// 			_scanCode = e.result
			// 			this.getLocation()
			// 		}
   //              })
			// },
			//登录授权
			userEmpower(isFlag) {
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
								content: '请点击按钮，重新尝试',
								showCancel: false
							});
							return;
						}
						this.updateUserNew({encryptedData,iv}).then(res=>{
								//处理二维码
								if(_scanCode){
									this.getLocation()
									return
								}
								//点击点亮更多城市
								if(isFlag){
									uni.navigateTo({
										url:'/pages/tabBar/home/index'
									})
									return
								}
						})
					},
					fail: (err) => {
						//仅提示用户
						uni.showModal({
							title: '微信绑定授权',
							content: '请允许获取个人信息后重新进入绑定页面',
							showCancel: false
						});
					}
				});
			},
			getLocation(){
				//获取定位
				getUserLocation().then(res=>{
					let {longitude,latitude} = res.data
					qrCode({
						code:_scanCode,
						longitude,
						latitude
					}).then(res=>{
						//正常码
						if(res.code == 1){
							let {lit_city,lit_msg,heat_msg,qr_info} = res.data
							this.lit_city = lit_city
							this.lit_msg = lit_msg
							this.heat_msg = heat_msg
							this.qr_info = qr_info
							return
						}
						//异常码
						uni.showModal({
							title:'温馨提示',
							content:res.msg
						})
						if(res.data.Data)this.qr_info = res.data.Data
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.index::-webkit-scrollbar {
	  width: 0;
	  height: 0;
	  color: transparent;
	}

	.index{
		.index-scroll{
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			z-index: 1;
		}
		.index-bg{
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			bottom: 0;
			height: 100%;
			z-index: -1;
		}
		.head{
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			.head-icon{
				width: 294rpx;
				height: 52rpx;
			}
			.back{
				position: absolute;
				width: 50rpx;
				height: 50rpx;
				top: 50%;
				transform: translateY(-50%);
				left:30rpx;
				padding: 10rpx;
				background-color: #b0b0b0;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
		.title{
			width:406rpx;
			height: 78rpx;
			display: block;
			margin: 40rpx auto 40rpx;
		}
		.idcode,.scan-num{
			font-size: 36rpx;
			color: #231815;
			text-align: center;
			line-height: 1;
			.right{
				margin-left: 15rpx;
			}
		}
		.idcode{
			margin-top: 15rpx;
		}
		.scan-num{
			margin-top: 30rpx;
		}
		.hn-icon{
			width: 212rpx;
			height: 210rpx;
			display: block;
			margin: 32rpx auto 0;
		}
		.map{
			display: flex;
			justify-content: center;
			padding-top: 50rpx;
			.map-icon{
				width: 690rpx;
				height: 371rpx;
			}
		}
		.tx-tips{
			padding: 90rpx 70rpx 0;
			color: #FFF8E2;
			font-size: 32rpx;
			line-height: 1.8em;
		}
		.progress-tips{
			font-size: 32rpx;
			font-weight: 400;
			color: #f2edb4;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 80rpx;
			margin-bottom: 80rpx;
			.num{
				color: #FE4200;
				font-size: 46rpx;
				font-weight: 700;
			}
			.city{
				color: #EEFE00;
				font-size: 40rpx;
				margin-left: 5rpx; 
			}
		}
		.dl-btn{
			width: 492rpx;
			height: 112rpx;
			position: relative;
			margin: 24rpx auto 12rpx;
			text-align: center;
			line-height: 112rpx;
			font-size: 36rpx;
			font-weight: 700;
			color: #fffae9;
			position: relative;
			z-index: 1;
			.dl-btn-bg{
				position: absolute;
				left: 0;
				top: 0;
				width: 492rpx;
				height: 112rpx;
				z-index: -1;
			}
		}
		.dl-btn-top{
			margin-top: 200rpx;
		}
		.dl-tips{
			color: #F7D99C;
			font-size: 24rpx;
			text-align: center;
		}
		.yjj{
			text-align: center;
			padding-right: 28rpx;
			font-size: 0;
			padding-bottom: 38rpx;
			.yjj-icon{
				width: 126rpx;
				height: 38rpx;
			}
		}
		.more-info{
			padding: 20rpx 14rpx;
			width: 50rpx;
			height: 152rpx;
			box-sizing: border-box;
			background-color: #fff1c6;
			border-radius: 10px 0px 0px 10px;
			position: absolute;
			right: 0;
			top: 150rpx;
			font-size: 24rpx;
			font-weight: 400;
			color: #f36022;
			line-height:1.2;
		}
		.back-home{
			width: 35px;
			height: 35px;
			position: fixed;
			top: 0;
			left: 0;
			background-color: azure;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
			left: 20px;
			z-index: 11;
		}
	}
</style>