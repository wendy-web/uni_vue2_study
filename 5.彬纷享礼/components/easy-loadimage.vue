<template>
	<view class="easy-loadimage" :class="imageClass" @click="imageClick">
		<image v-if="!isLoadError" class="origin-img" :src="imgsrc" :mode="mode"
			:class="{'no-transition':!openTransition,'show-transition':showTransition&&openTransition}"
			@load="handleImgLoad" @error="handleImgError">
		</image>
		<view class="loadfail-img" v-if="isLoadError"></view>
		<view :class="['loading-img',loadingMode]" v-if="loadImg"></view>
	</view>
</template>
<script>
	import {
		mapGetters
	} from 'vuex';
	export default {
		props: {
			imageClass: {
				type: String
			},
			imageSrc: {
				type: String
			},
			mode: {
				type: String,
			},
			loadingMode: {
				type: String,
				default: 'spin-circle'
			},
			openTransition: {
				type: Boolean,
				default: true
			},
			link: {
				type: String,
				default: ''
			},
			index: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				loadImg: true,
				isLoadError: false,
				showTransition: false,
				imgsrc: '',
				imgTime: null
			};
		},
		computed: {
			...mapGetters(['isConnected'])
		},
		mounted() {
			this.imgTime = setTimeout(() => {
				this.imgsrc = this.imageSrc;
			}, this.index % 10 * 300);
		},
		methods: {
			handleImgLoad(e) {
				this.loadImg = false;
				this.isLoadError = false;
				setTimeout(() => {
					this.showTransition = true;
				}, 50);
			},
			handleImgError(e) {
				this.loadImg = false;
				this.isLoadError = true;
			},
			imageClick() {
				if (this.isLoadError) {
					this.isLoadError = false;
					this.loadImg = true;
					if (!this.isConnected) return uni.showToast({
						icon: 'none',
						title: '请先检查网络连接'
					});
					return;
				}
				this.$emit('imageClick', this.link);
			}
		},
		beforeDestroy() {
			clearTimeout(this.imgTime);
		}
	};
</script>

<style lang="scss">
	.easy-loadimage {
		position: relative;

		/* 渐变过渡效果处理 */
		.origin-img {
			width: 100%;
			height: 100%;
			opacity: 0.3;
			will-change: transform;

			&.show-transition {
				transition: opacity 1.2s;
				opacity: 1;
			}

			&.no-transition {
				opacity: 1;
			}
		}



		/* 加载失败、加载中的占位图样式控制 */
		.loadfail-img {
			min-height: 200rpx;
			height: 100%;
			width: 100%;
			background: url('../static/images/loadfail.png') no-repeat center;
			background-size: 50%;
			position: absolute;
			left: 0;
			top: 0;

		}

		.loading-img {
			min-height: 200rpx;
			position: absolute;
			width: 100%;
			height: 100%;
			left: 0;
			top: 0;
		}

		/* 转圈 */
		.spin-circle {
			background: url('../static/images/loading.gif') no-repeat center;
			background-size: 100rpx;
		}

		/* 动态灰色若隐若现 */
		.looming-gray {
			animation: looming-gray 1s infinite linear;
			background-color: #e3e3e3;
		}

	}

	.W-H-fill {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}

	.H-230 {
		height: 290rpx;
		position: relative;
		overflow: hidden;
		border-radius: 5px;
	}

	.news-imageclass {
		height: 186rpx;
		width: 330rpx;
		position: relative;
		overflow: hidden;
		z-index: 1;
		transform: translate3d(0, 0, 0);/*ios圆角兼容*/
		font-size: 0;
		border-radius: 5px;
		margin-right: 20rpx;
	}

	@keyframes looming-gray {
		0% {
			background-color: #e3e3e3aa;
		}

		50% {
			background-color: #e3e3e3;
		}

		100% {
			background-color: #e3e3e3aa;
		}
	}

	/* 骨架屏1 */
	.skeleton-1 {
		background-color: #e3e3e3;
		background-image: linear-gradient(100deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0) 80%);
		background-size: 100rpx 100%;
		background-repeat: repeat-y;
		background-position: 0 0;
		animation: skeleton-1 .6s infinite;
	}

	@keyframes skeleton-1 {
		to {
			background-position: 200% 0;
		}
	}

	/* 骨架屏2 */
	.skeleton-2 {
		background-image: linear-gradient(-90deg, #fefefe 0%, #e6e6e6 50%, #fefefe 100%);
		background-size: 400% 400%;
		background-position: 0 0;
		animation: skeleton-2 1.2s ease-in-out infinite;
	}

	@keyframes skeleton-2 {
		to {
			background-position: -135% 0;
		}
	}
</style>
