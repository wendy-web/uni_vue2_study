<template>
	<view class="no-location">
		<privacy-popup></privacy-popup>
		<view class="icon">
			<image class="icon-img" :src="baseUrl+'/public/img/bfxn/202101/bfxn_loction_error.png'" mode="widthFix">
			</image>
		</view>
		<view class="tips-title">
			未获取到定位
		</view>
		<view class="tips-msg">
			{{tipsMsg}}
		</view>
		<view class="again">
			<button class="mini-btn" @click="again" type="primary" size="mini">重试</button>
			<!--  v-if="clickCount<6" <button class="animated tada mini-btn" v-else @click="manualPosition" type="warn" size="mini">手动定位</button> -->
		</view>
		<!-- login error -->
		<view class="login-warn">
			<icon type="info" size="18" color="#e8a010" />
			<text class="login-warn-tips">定位遇到问题请</text>
			<text class="link-service" @click="linkService">联系客服</text>
		</view>
	</view>
</template>

<script>
	import {
		getUserLocation
	} from '@/utils/getUserLocation.js';
	import {
		mapMutations
	} from 'vuex';
	import {
		fileBaseUrl
	} from '@/api/http/xhHttp.js';
	import {
		ctoolsIshide
	} from '@/api/homeApi.js';
	import {
		setStorage
	} from '@/utils/auth.js';
	export default {
		data() {
			return {
				baseUrl: fileBaseUrl,
				tipsMsg: '请检查网络获定位权限'
			};
		},
		onShow() {
			let res = this.$getSystemInfo()

			if (/IOS/g.test(res.system.toUpperCase())) {
				this.tipsMsg = '请打开手机 \'设置\' > \'隐私\' > \'定位服务\'，并允许微信访问位置，以提供优质服务^_^';
			} else {
				this.tipsMsg = '请打开手机 \'设置\' > \'应用与权限\' > \'权限管理\' 中更改权限配置，以提供优质服务^_^';
			}

		},
		methods: {
			...mapMutations({
				setUserLocation: 'login/setUserLocation'
			}),
			again() {
				uni.showLoading({
					title: '定位中，请稍后···',
					mask: true
				});
				//如果登录过，刷新下经纬度
				getUserLocation(true).then(data => {
					//关闭loading
					uni.hideLoading();
					//更新用户定位信息
					this.setUserLocation(data.data);
					//缓存本地
					setStorage('getUserLocation', JSON.stringify({
						lastModified: Date.now(),
						data: data.data
					}));
					this.$reLaunch({
						url: '/pages/tabBar/personal/index'
					});
				}).catch(err => {
					//关闭loading
					uni.hideLoading();
					try {
						const res = wx.getSystemInfoSync();
						if (!res.locationEnabled) {
							return setTimeout(() => {
								uni.showToast({
									icon: 'none',
									title: '请开启手机系统定位后重试'
								});
							}, 200);
						}
						if (!res.locationAuthorized) {
							return setTimeout(() => {
								uni.showToast({
									icon: 'none',
									title: '请开启微信app定位后重试'
								});
							}, 200);
						}
						//调取ip定位
						this.ipLocation(err.errText);
					} catch (e) {
						setTimeout(() => {
							uni.showToast({
								icon: 'none',
								title: err.errText
							});
						}, 200);
					}
				});
			},
			ipLocation(errText) {
				ctoolsIshide().then(res => {
					//获取IP定位信息
					let {
						lat,
						city,
						lng,
						province
					} = res.data || {};
					//判断是否有值
					if (lat && lng && province === '广东省') {
						//更新用户定位信息
						this.setUserLocation({
							longitude: lng,
							latitude: lat
						});
						//缓存本地
						setStorage('getUserLocation', JSON.stringify({
							lastModified: Date.now(),
							prescription: 600,
							data: {
								longitude: lng,
								latitude: lat
							}
						}));
						//跳转 
						this.$reLaunch({
							url: '/pages/tabBar/personal/index'
						});
						return;
					}
					//消息提示
					setTimeout(() => {
						uni.showToast({
							icon: 'none',
							title: errText
						});
					}, 200);
				});
			},
			//跳转客服
			linkService() {
				uni.switchTab({
					url: '/pages/tabBar/service/service'
				});
			}
			// ,
			// manualPosition(){
			//  wx.chooseLocation({
			//   success:(res)=>{
			//    let {latitude,longitude} = res;
			//    //存储到本地
			//    setStorage('getUserLocation', JSON.stringify({
			//    	lastModified: Date.now(),
			//    	data: {
			// 		latitude,
			// 		longitude
			// 	},
			// 	prescription:10*60//十分钟
			//    }));
			//    //存储到vuex
			//    this.setUserLocation({latitude,longitude});
			//    //自动跳转
			//    this.$reLaunch({
			//    	url:'/pages/tabBar/personal/index'
			//    });
			//   }
			//  });
			// }
		}
	};
</script>

<style lang="scss">
	.no-location {
		.icon {
			width: 300rpx;
			margin: 140rpx auto 0;
		}

		.icon-img {
			width: 300rpx;
		}

		.tips-title {
			font-size: 30rpx;
			color: #333;
			text-align: center;
			margin-top: 15rpx;
		}

		.tips-msg {
			font-size: 28rpx;
			color: #999;
			text-align: center;
			margin-top: 15rpx;
			padding: 0 100rpx;
		}

		.again {
			margin-top: 15rpx;
			text-align: center;
		}

		.login-warn {
			margin-top: 130rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28rpx;

			&>.login-warn-tips {
				color: #99abb4;
				margin-left: 10rpx;
			}

			&>.link-service {
				color: #5ea8f2;
				text-decoration: underline;
				margin-left: 5rpx;
				padding: 10rpx 0;
			}
		}
	}
</style>