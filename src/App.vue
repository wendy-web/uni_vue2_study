<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
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
			});

			/**
			 * 初次加载判断网络情况
			 * 无网络状态下根据实际情况进行调整
			 */
			//  uni.getNetworkType({
			// 	success: (res) => {
			// 		const networkType = res.networkType;
			// 		if (networkType === 'none') {
			// 			this.setConnected(false);
			// 			uni.showToast({
			// 				title: '当前无网络',
			// 				icon: 'loading',
			// 				duration: 2000
			// 			});
			// 			return
			// 		}
			// 		this.setConnected(true);
			// 	}
			// });
			/**
			 * 监听网络状态变化
			 * 可根据业务需求进行调整
			 */
			//  uni.onNetworkStatusChange((res) => {
			// 	if (!res.isConnected) {
			// 		this.setConnected(false);
			// 		uni.showToast({
			// 			title: '网络已断开',
			// 			icon: 'loading',
			// 			duration: 2000
			// 		});
			// 	} else {
			// 		this.setConnected(true);
			// 		uni.hideToast();
			// 	}
			// });
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style scoped lang="scss">
</style>
