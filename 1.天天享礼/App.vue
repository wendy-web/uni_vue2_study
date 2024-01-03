<script>
	import { mapGetters, mapMutations, mapActions } from 'vuex';
	import { bfAppid, getAutoLogin, getToken } from '@/utils/auth.js';
	import { userPosition, doBind } from "@/api/modules/index.js";
    import { logPagePerformance } from '@/utils/index.js';
	export default {
		computed: {
			...mapGetters(['userInfo', 'gift', 'diaList', 'isMiniProgram', 'isAutoLogin', 'token'])
		},
		methods: {
			...mapActions({
				wxlogin: 'user/wxlogin',
				setConnected: 'app/setConnected',
				profitInfoRequest: 'user/profitInfoRequest'
			}),
			...mapMutations({
				setDiaList: "user/setDiaList",
				delCurrentDiaList: "user/delCurrentDiaList",
                setMiniProgram: "user/setMiniProgram",
                setAutoLogin: 'user/setAutoLogin'
			})
		},
		watch: {
			// gift: {
			// 	handler(newVal, oldValue) {
			// 		if (!newVal) return this.delCurrentDiaList('update');
			// 		// 新人
			// 		const sourceData = uni.getLaunchOptionsSync();
			// 		const {
			// 			scene,
			// 			referrerInfo
			// 		} = sourceData;
			// 		if (!referrerInfo || !referrerInfo.appId) return;
			// 		if (referrerInfo.appId == bfAppid()) {
			// 			// this.setDiaList('update');
			// 			this.$showModal({
			// 				title: '温馨提示',
			// 				content: '您需要授权天天享礼使用您的微信头像和昵称？',
			// 				confirm: async () => {
			// 					await updateInfo({
			// 						type: 2
			// 					});
			// 					this.delCurrentDiaList('update');
			// 				},
			// 				cancel: async () => {
			// 					await updateInfo({
			// 						type: 1
			// 					});
			// 					this.delCurrentDiaList('update');
			// 				}
			// 			})
			// 			return;
			// 		}
			// 		this.delCurrentDiaList('update')
			// 	},
			// 	immediate: true
			// }
			isAutoLogin: {
				handler:async function (newValue, oldValue) {
					if(!newValue) return;
					this.profitInfoRequest();
				},
				deep: true,
				immediate: true
			}
		},
		onLaunch: function(event) {
			// logPagePerformance();
			// if(event && event.query) {
			//     const { mlocid, plocid } = event.query;
			//     userPosition({ mlocid, plocid }).then(res => {});
			// }
			/*静默*/
			// 检测新版本
			// if(!this.userInfo.id) {
			// 	this.wxlogin(true).then(res=>{})
			// }
			const updateManager = uni.getUpdateManager();
			updateManager.onUpdateReady(function() {
				uni.showModal({
					title: '更新提示',
					content: '新版本已经准备好，是否重启应用？',
					showCancel: false,
					success(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate();
						}
					}
				});
			})
			/**
			 * 初次加载判断网络情况
			 * 无网络状态下根据实际情况进行调整
			 */
			uni.getNetworkType({
				success: (res) => {
					const networkType = res.networkType;
					if (networkType === 'none') {
						this.setConnected(false);
						uni.showToast({
							title: '当前无网络',
							icon: 'loading',
							duration: 2000
						});
						return
					}
					this.setConnected(true);
				}
			});
			/**
			 * 监听网络状态变化
			 * 可根据业务需求进行调整
			 */
			uni.onNetworkStatusChange((res) => {
				if (!res.isConnected) {
					this.setConnected(false);
					uni.showToast({
						title: '网络已断开',
						icon: 'loading',
						duration: 2000
					});
				} else {
					this.setConnected(true);
					uni.hideToast();
				}
			});
            const tokenStorage = getToken();
            const autoLoginStorage = getAutoLogin();
            if(tokenStorage) {
                (autoLoginStorage === '') && this.setAutoLogin(true);
            } else{
                this.setAutoLogin(false)
            }
            if(!autoLoginStorage) {
                const sourceData = uni.getLaunchOptionsSync();
                const { scene, referrerInfo } = sourceData;
                if (!referrerInfo || !referrerInfo.appId) return;
                if (referrerInfo.appId == bfAppid()) {
                    this.setAutoLogin(true);
                }
            }
		},
		onShow: function(event) {
			if (!this.isMiniProgram || (this.isMiniProgram && event.query.mlocid)) {
				const { mlocid, plocid } = event.query;
				if(!event.query.key) {
					userPosition({ mlocid, plocid});
				}
			}
            // 彬纷
            if(this.isMiniProgram) {
                this.setMiniProgram(0);
            }
			// 与分享绑定的toast
			if(event.query.team_uid) {
				console.log('event.query.team_uid:', event.query.team_uid)
				doBind({team_uid : event.query.team_uid}).then(res => {
					console.log('event.query.team_uid:', event.query.team_uid);
					console.log('res:', res);
				});
			}
		},
		onHide: function() {
			//熄屏上报
			// appHideSendMessage();
		}
	}
</script>
