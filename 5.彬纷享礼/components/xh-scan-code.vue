<template>
	<!-- @click="setZoom" -->
	<view class="xh-scan-code">
		<!-- 相机扫码模式 @initdone="initdone"-->
		<camera v-if="isOpen" mode="scanCode" flash="off" @error="error" @scancode="onScancode" @stop="onStop"
			style="width: 100%; height: 100%;"></camera>
		<!-- 扫码动画 -->
		<image v-if="isOpen" class="scan-code-amin scanCodeAmin" mode="widthFix" src="/static/images/scan_anim.png">
		</image>
	</view>
</template>

<script>
	import {
		xhAudio
	} from '@/utils/index.js';
	import {
		fileBaseUrl
	} from '@/api/http/xhHttp.js';
	// import {
	// 	nextRouterPath
	// } from '@/utils/routerIntercept.js';
	//音频控制
	let INNERAUDIOCONTEXT = null;
	export default {
		props: {
			openNow: {
				type: Boolean,
				default: true
			}
		},
		created() {
			//初始化音频
			INNERAUDIOCONTEXT = xhAudio({
				url: fileBaseUrl + '/public/music/scan_music.mp3'
				//,onEnded:function(){
				// 	this.playEnd()
				// }.bind(this)
			});
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
												return uni.showToast({
													title: '您未允许获取摄像头',
													icon: 'none',
													duration: 1500
												});
											}
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
				// console.log('scanCode ----->onScancode', e)
				this.$emit('onScancode', e.detail.result);
			},
			play() { //播放音频
				INNERAUDIOCONTEXT.play();
			},
			close() {
				this.isOpen = false;
			},
			reset() {
				this.isOpen = true;
			}
		},
		beforeDestroy() {
			INNERAUDIOCONTEXT.destroy();
		}
	};
</script>

<style lang="scss">
	.xh-scan-code {
		width: 100%;
		height: 100%;

		.scan-code-amin {
			position: absolute;
			width: 100%;
			top: 10%;
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