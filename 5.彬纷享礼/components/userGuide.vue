<template>
	<view class="user-guide" v-if="isShow">
		<view class="user-guide-black"></view>
		<view class="user-guide-body userGuide">
			<!-- 			<image class="user-guide-close" @click="close(false)" src="../../../static/images/toast_close.png"
				mode="aspectFill"></image> -->
			<easy-loadimage imageClass="user-guide-img" :image-src="toastImg" mode="widthFix"></easy-loadimage>
			<image class="user-guide-close" @click="close(false)" mode="aspectFill"
				src="../../../static/images/new_toast_close.png"></image>
			<view class="user-click-area" @click="imageClick"></view>
		</view>
	</view>
</template>

<script>
	import {
		VALID_CACHE
	} from '@/utils/index';
	import {
		setStorage,
		getStorage
	} from '@/utils/auth.js';
	import {
		mapGetters
	} from 'vuex';
	export default {
		computed: {
			...mapGetters(['adData'])
		},
		data() {
			return {
				isShow: false,
				toastImg: ''
			};
		},
		props: {
			isReLaunch: {
				type: Boolean,
				default: true
			},
			ids: {
				type: String,
				default: ''
			},
			isNoJump: { //用户引导
				type: Boolean,
				default: false
			}
		},
		created() {
			this.initData();
		},
		watch: {
			adData: function(newdata, olddata) {
				if (!this.toastImg) {
					this.initData();
				}
			}
		},
		methods: {
			initData() {
				if (this.isNoJump) {
					let toastImg = '';
					let A8 = this.adData.A8;
					if (A8 && A8.value.length > 0) {
						toastImg = A8.value[0].img;
					}
					return this.toastImg = toastImg;
				}
				this.getRandomUrl();
			},
			show() {
				if (this.toastImg) {
					let cache = getStorage(this.ids + 'userGuide');
					if (cache) {
						if (!VALID_CACHE(5 * 60, cache)) {
							this.isShow = true;
						}
						return;
					}
					this.isShow = true;
				}
			},
			close(flag) {
				if (flag) return this.isShow = false;
				this.isShow = false;
				this.$emit('closeBack');
				setStorage(this.ids + 'userGuide', Date.now());
			},
			getRandomUrl() { //广告随机弹
				let A7 = this.adData.A7;
				if (A7 && A7.value.length > 0) {
					let data = A7.value[Math.floor(Math.random() * A7.value.length)];
					this.toastImg = data.img;
				}
			},
			imageClick() {
				//关闭弹窗
				this.close();
				//跳转详情页
				if (this.isNoJump && this.adData.A8.value.length > 0) {
					uni.previewImage({
						urls: [this.adData.A8.value[0].link] // 需要预览的图片http链接列表
					});
				}
				//链接新闻页
				if (this.isReLaunch) {
					return this.$reLaunch({
						url: '/pages/tabBar/home/index'
					});
				}
				this.$switchTab({
					url: '/pages/tabBar/home/index'
				});
			}
		},
		beforeDestroy() {
			if (this.isShow) {
				setStorage(this.ids + 'userGuide', Date.now());
			}
		}
	};
</script>

<style lang="scss">
	.user-guide {
		.user-guide-black {
			position: fixed;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			background-color: rgba(0, 0, 0, 0.8);
			z-index: 1;
		}

		.user-guide-body {
			position: fixed;
			width: 80%;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			font-size: 0;
			text-align: right;
			z-index: 1;
			text-align: center;
		}

		// .user-guide-close {
		// 	width: 70rpx;
		// 	height: 70rpx;
		// 	margin-bottom: 15rpx;
		// }

		.user-guide-close {
			width: 55rpx;
			height: 117rpx;
		}

		.user-guide-img {
			width: 100%;
		}

		.user-click-area {
			position: absolute;
			left: 0;
			right: 0;
			bottom: 117rpx;
			height: 20%;
			z-index: 1;
		}

	}

	/*自定义弹窗*/
	.userGuide {
		-webkit-animation-name: userGuide;
		animation-name: userGuide;
		-webkit-animation-duration: 0.5s;
		-webkit-animation-fill-mode: both;
		animation-duration: 0.5s;
		animation-fill-mode: both;
	}

	@-webkit-keyframes userGuide {
		0% {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}
</style>