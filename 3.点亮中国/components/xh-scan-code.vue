<template>
	<view class="xh-scan-code">
		<!-- 相机扫码模式 @initdone="initdone"-->
		<camera
			v-if="isOpen" mode="scanCode" flash="off" @error="error" @scancode="onScancode" @stop="onStop"
			style="width: 100%; height: 100%;"
		></camera>
		<!-- 扫码动画 -->
		<!-- <cover-view class="scan_anim">
			<image v-if="isOpen" class="scan-code-amin scanCodeAmin" mode="widthFix"
			src="./static/images/scan_anim.png"></image>
		</cover-view> -->
	</view>
</template>

<script>
	export default {
		props: {
			openNow: {
				type: Boolean,
				default: true
			}
		},
		created() {
			this.isOpen = this.openNow;
		},
		data() {
			return {
				isOpen: false
			};
		},
		methods: {
			error(e) {
				uni.showModal({
					title: '温馨提示',
					content: '扫一扫功能需要您授权摄像头',
					success: (res) => {
						wx.getSetting({
							complete: (res) => {
								if (res.authSetting && !res.authSetting['scope.camera']) {
									uni.openSetting({
										success: (res) => {
											if (!res.authSetting['scope.camera']) {
												uni.showToast({
													title: '您未允许获取摄像头',
													icon: 'none',
													duration: 1500
												});
												return uni.navigateBack();
											}
											console.log('已打开_返回上一页');
											uni.navigateBack();
										}
									});
								}
							}
						});
					}
				});
				// console.log('scanCode ----->onError', e)
			},
			onStop(e) {
				// console.log('scanCode ----->onStop', e)
			},
			onScancode(e) { //扫码识别成功
				console.log('scanCode ----->onScancode', e);
				let result = null;
				if(e.detail) {
					result = e.detail.result
				} else {
					result = 'fail';
				}
				this.$emit('onScancode', result);
			},
			play() {
			},
			close() {
				this.isOpen = false;
			},
			reset() {
				this.isOpen = true;
			}
		},
		beforeDestroy() {
		}
	};
</script>

<style lang="scss">
	.xh-scan-code {
		width: 100%;
		height: 100%;
		.scan_anim {
			position: absolute;
			width: 100%;
			top: 10%;
		}

		.scan-code-amin {
			position: relative;
			width: 100%;
		}
	}

	@keyframes scanCodeAmin {
		0% {
			top: 10%;
		}

		50% {
			top: 50%;
		}

		100% {
			top: 10%;
		}
	}

	.scanCodeAmin {
		animation: scanCodeAmin linear 1.5s infinite;
	}
</style>
