<template>
	<view class="scan-index">
		<image class="scan-bg" src="/pages/originalScan/static/scan-bg.png" mode="aspectFill"></image>
		<view class="scan-btn">
			<van-button round type="info" @tap="scan" :loading="loading" block>继续扫码</van-button>
		</view>
		<!-- 消息提示 -->
		<xh-notify ref="xhNotify" />
		<!-- 隐私协议的组件 -->
		<privacy ref="privacy"></privacy>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapActions
	} from 'vuex'
	import {getUserLocation} from '@/utils/getUserLocation.js'
	import {
		qrCode
	} from '@/api/original/originalLogin.js';
	import {setScanNow,getScanNow} from '@/utils/auth.js'
	let _WxScanQrCode = ""
	export default {
		computed: {
			...mapGetters(['userInfo','isAuthorization'])
		},
		watch:{
			userInfo(){
                if(_WxScanQrCode){
					this.scan(true)
				}
			}
		},
		onLoad(o) {
			if (o && o.q) {
				_WxScanQrCode = decodeURIComponent(o.q);
				// if(this.isAuthorization){
				// 	this.scan()
				// }
				// return
			}
			// if(getScanNow()){
			// 	setScanNow(false)
			// 	this.scan(true)
			// }
			this.getUserInfo();
		},
		data(){
			return {
				loading:false
			}
		},
		onShow() {
			this.loading = false;
			this.$refs.privacy.LifetimesShow();
		},
		methods: {
			...mapActions({
				updateUserNew: 'user/updateUserNew',
				getUserInfo: 'user/getUserInfo'
			}),
			scan(isWxScan) {
				if(this.loading) return
				  this.loading = true
				if (!this.isAuthorization) {
					//先授权用户信息
					if(isWxScan){
						uni.showModal({
							title: '温馨提示',
							content: '第一次使用需要您点击“确定”后授权',
							showCancel: false,
							success:  (res) => {
								if (res.confirm) {
									this.userEmpower()
								}
							}
						});
						return;
					}
					this.userEmpower()
					return
				}
				//先获取定位
                getUserLocation().then(res=>{
					//解构经纬度字段
					let {longitude,latitude} = res.data
					//如果有值说明是微信扫一扫进来的
					if(_WxScanQrCode){
						this.handleCode({
							code:_WxScanQrCode,
							longitude,
							latitude
						})
						_WxScanQrCode = ''
						return;
					}
					//调取微信扫一扫
					wx.scanCode({
						success: (res) => {
							this.handleCode({
								code:res.result,
								longitude,
								latitude
							})
						},
						fail:(err)=>{
							this.loading = false
						}
					});
				}).catch(err=>{
					this.loading = false
				})
			},
			handleCode(parmas){
				 qrCode(parmas).then(res=>{
				 	//跳转至结果页
				 	if(res.code == 0){
				 	  	wx.navigateTo({
				 			url:`/pages/originalScan/scanError/scanError?msg=${res.msg}`
				 		});
				 	  return;
				 	}
					//具体跳转
					if(res.data.CodeType === 1){
						uni.navigateTo({
							url:`/pages/originalScan/cmScanResult/scanResult?data=${JSON.stringify(res.data)}`
						})
					}else{
						uni.navigateTo({
							url:`/pages/originalScan/gdScanResult/scanResult?data=${JSON.stringify(res.data)}`
						})
					}
				 }).catch(err=>{
					 this.loading = false
				 })
			},
			userEmpower() {
				//获取用户加密信息
				wx.getUserProfile({
					lang: 'zh_CN',
					desc: '登录', //不写不弹提示框
					success: (user) => {
						let {avatarUrl,nickName} = user.userInfo
						if (!nickName||!avatarUrl) {
							//仅提示用户
							uni.showModal({
								title: '用户信息获取失败',
								content: '请点击登录按钮，重新尝试',
								showCancel: false
							});
							return;
						}
						this.updateUserNew({
							nick_name: nickName,
							avatar_url: avatarUrl
						}).then(res=>{
							//提示成功
							this.$refs.xhNotify.show({
								type: 'success',
								message: '恭喜您，授权成功',
								duration: 1500
							});
						}).catch(err=>{
							this.loading = false
						})
					},
					fail: (err) => {
						//仅提示用户
						uni.showModal({
							title: '温馨提示',
							content: '请先授权用户信息，可以开放更多功能哟',
							showCancel: false
						});
						this.loading = false
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	page {
		&::after {
			content: '';
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 2rpx;
			box-shadow: 0px -1px 7px 0px rgba(192, 196, 204, 1);
			z-index: 9999;
		}
	}

	.scan-index {

		.scan-bg {
			width: 428rpx;
			height: 428rpx;
			display: block;
			margin: 152rpx auto 60rpx;
		}

		.scan-btn {
			width: 320rpx;
			margin: 0 auto;
		}

	}
</style>
