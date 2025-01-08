<template>
<view class="con">
	<view class="stage"
		@touchstart="updateStart"
		@touchmove="updateMove"
		@touchend="updateEnd"
	>
		<view class="box"
			:style="{ transform:'rotateY('+ ss +'deg)' }"
			:class="[ vtouch && touching ? '' : 'slow']">
			<view v-for="(img,index) in imagesList" :key="index"
				:style="{transform: 'rotateY('+(index*de)+'deg) translateZ('+ wi +')'}"
				:class="['box_active',index == leIndex ? 'active' : '']"
			>
				<image :src="img.src" mode="" @tap="tranHandle(index)"
				:class="['item_image', index == leIndex ? 'active' : '']"
				></image>
			</view>
		</view>
	</view>
	<!-- <view class="trans_ss">ss:{{ ss }}</view> -->
</view>
</template>
<script>
	export default {
		name: "hj3-display-images",
		props: {
			imagesList: {
				type: Array,
			},
			vtouch: {
				type: Boolean,
				default: true
			},
			autoplay: {
				type: Boolean,
				default: false
			},
			interval: {
				type: Number,
				default: 3000
			},
			clockwise: {
				type: Boolean,
				default: false
			},
			titleBottom: {
				type: Boolean,
				default: false
			},
			backcolor: {
				type: String,
				default: 'rgba(0,0,0,0.2)'
			},
			fontcolor: {
				type: String,
				default: 'black'
			},
			background: String,
			speakNum: {
				type: Number,
				default: 1
			}
		},
		watch: {
			speakNum: {
				handler(newVal, oldVal) {
					// if(newVal !== 100) return;
					if(this.timer) {
						this.timer = null;
						clearTimeout(this.timer);
					}
					this.leIndex = -1;
					this.autoPlayHandle();
				},
				immediate: false,
			}
		},
		computed: {
			de: function() {
				return 360 / this.imagesList.length;
			},
			wi: function() {
				return uni.upx2px(460) + 'px';
			},
		},
		data() {
			return {
				current: 0,
				ss: 0,
				start: null,
				last: null,
				touching: false,
				temp: 0,
				timer: null,
				leIndex: -1,
				deDiffValue: 0
			}
		},
		methods: {
			tranHandle(index) {
				return;
				let old = this.current
				this.current = index;
				let c = (index - old) * this.de
				if (Math.abs(c) > 180) {
					if (c > 0) c = Math.abs(c) - 360
					else c = 360 - Math.abs(c)
				}
				this.ss += -c;
				this.$emit('itap', index);
			},
			updateStart: function(e) {
				if (this.vtouch) {
					this.touching = true;
					this.start = this.ss;
					this.last = e.touches[0].pageX;
				}
			},
			updateMove: function(e) {
				if (this.vtouch) {
					let np = e.touches[0].pageX;
					let tc = np - this.last;
					this.last = np;
					this.ss += tc;
				}
			},
			updateEnd: function(e) {
				if (this.vtouch) {
					this.touching = false;
					let fc = this.ss - this.start;
					let c = Math.round(fc / this.de);
					let index = (this.current - c) % 8;
					this.current = index > 0 ? index : (8 + index)
					this.ss = this.start + c * this.de;
					const endTans = -Math.ceil(this.ss / this.de);
					let leIndex = endTans % this.imagesList.length;
					leIndex = (leIndex >= 0) ? leIndex : (leIndex + this.imagesList.length);
					this.start = null;
				}
			},
			autoPlayHandle() {
				let diffScroll = 0;
				let halfValue = 0;
				let diffValue = 0;
				this.timer = setTimeout(() => {
					if (this.start === null) {
						if (this.clockwise) {
							this.ss -= (this.speakNum/100);
						} else {
							this.ss += (this.speakNum/100);
						}
					}
					if(this.speakNum >= 10) {
						this.autoPlayHandle();
					} else {
						this.deDiffValue = this.de + (this.ss % this.de) - 4;
						this.endPlayHandle();
						return;
						this.ss -= deDiff;
						this.ss += 4;
						// this.timer = null;
						// clearTimeout(this.timer);
						diffScroll = -(this.ss % this.de);
						halfValue = this.de / 2;
						diffValue = (diffScroll - halfValue);
						// if(diffScroll > halfValue) {
						// 	// this.ss -= (halfValue + diffScroll);
						// 	this.ss += deDiff;
						// } else {
						// 	// this.ss -= (halfValue + diffScroll);
						// 	this.ss -= deDiff;
						// }
						const endTans = - (this.ss / this.de);
						let leIndex = Math.ceil(endTans % this.imagesList.length);
						leIndex = (leIndex >= this.imagesList.length) ? 0 : leIndex;
						this.$emit('current', leIndex);
						this.leIndex =leIndex;
					}
				}, 10);
			},
			endPlayHandle() {
				if(this.deDiffValue > 0) {
					this.ss -= (this.speakNum/100);
					this.deDiffValue -= (this.speakNum/100);
					return setTimeout(() => this.endPlayHandle(), 10);
				}
				const endTans = - (this.ss / this.de);
				let leIndex = Math.ceil(endTans % this.imagesList.length);
				leIndex = (leIndex >= this.imagesList.length) ? 0 : leIndex;
				this.$emit('current', leIndex);
				this.leIndex = leIndex;
			}
		},
		created: function() {
			if (this.autoplay) this.autoPlayHandle();
		}
	}
</script>

<style scoped="" lang="scss">
.con {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 460rpx;
    height: 286rpx;
	.stage {
		display: block;
		position: absolute;
		perspective: 1900rpx;
		background-color: #2A2026;
		width: 460rpx;
    	height: 286rpx;
	}

	.back {
		position: absolute;
		width: 100%;
	}
	.box {
		transform-style: preserve-3d;
		position: relative;
		width: 210rpx;
		height: 286rpx;
		.item_image {
			width: 210rpx;
			height: 286rpx;
			z-index: 0;
			position: absolute;
			box-shadow: -3rpx 5rpx 3rpx rgba(0, 0, 0, 0.3);
			transition: all .3s;
		}
		.active {
			box-shadow: 0 0 25rpx #fff;
			// transform: scale(1);
			// animation: aniIndex .1s linear;
			// animation-fill-mode: forwards;
			.item_image {
				animation: aniIndex .1s linear;
				animation-fill-mode: forwards;
			}
		}
	}
	.slow {
		// transition-duration: .1s;
	}
}
.trans_ss{
	position: absolute;
	color: #fff;
}
@keyframes aniIndex {
    0% {
		transform: scale(1);
		box-shadow: 0;
    }
    100% {
        transform: scale(1.1) translate(0, 0);
		box-shadow: 0 0 25rpx #fff;
    }
}
</style>
