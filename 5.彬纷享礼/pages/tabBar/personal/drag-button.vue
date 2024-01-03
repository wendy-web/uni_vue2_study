<template>
	<view>
		<view id="_drag_button" class="ai-gpt-box" :class="{transition: isDock && !isMove }"
			:style="'left: ' + left + 'px; top:' + top + 'px;'" @touchstart="touchstart"
			@touchmove.stop.prevent="touchmove" @touchend="touchend" @click.stop.prevent="click">
			<image class="ai-gpt" :src="config.img" mode="aspectFill"></image>
			<view class="high-light highLight"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'drag-button',
		props: {
			isDock: {
				type: Boolean,
				default: false
			},
			config: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		data() {
			return {
				top: 0,
				left: 0,
				width: 0,
				height: 0,
				offsetWidth: 0,
				offsetHeight: 0,
				windowWidth: 0,
				windowHeight: 0,
				isMove: true,
				edge: 10
			}
		},
		mounted() {
			const sys = this.$getSystemInfo();

			this.windowWidth = sys.windowWidth;
			this.windowHeight = sys.windowHeight;

			if (sys.windowTop) {
				this.windowHeight += sys.windowTop;
			}
			console.log(sys)

			const query = uni.createSelectorQuery().in(this);
			query.select('#_drag_button').boundingClientRect(data => {
				this.width = data.width;
				this.height = data.height;
				this.offsetWidth = data.width / 2;
				this.offsetHeight = data.height / 2;
				this.left = this.windowWidth - this.width - this.edge;
				this.top = this.windowHeight * 0.6;
			}).exec();
		},
		methods: {
			click() {
				this.$go({
					url: `/pages/webview/webview?link=${encodeURIComponent(this.config.url)}`
				});
				this.$emit('btnClick');
				//chatGPT
			},
			touchstart(e) {
				this.$emit('btnTouchstart');
			},
			touchmove(e) {
				// 单指触摸
				if (e.touches.length !== 1) {
					return false;
				}

				this.isMove = true;

				let clienX = e.touches[0].clientX - this.offsetWidth;

				let clientY = e.touches[0].clientY - this.offsetHeight;

				let edgeBottom = this.windowHeight - this.height - this.edge;

				// 上下触及边界
				if (clientY < this.edge) {
					this.top = this.edge;
				} else if (clientY > edgeBottom) {
					this.top = edgeBottom;
				} else {
					this.top = clientY
				}

				// 左右触及边界
				if (clienX < this.edge) {
					this.left = this.edge;
				} else if (clienX > this.windowWidth - this.width - this.edge) {
					this.left = this.windowWidth - this.width - this.edge;
				} else {
					this.left = clienX
				}


			},
			touchend(e) {
				if (this.isDock) {
					let edgeRigth = this.windowWidth - this.width - this.edge;

					if (this.left < this.windowWidth / 2 - this.offsetWidth) {
						this.left = this.edge;
					} else {
						this.left = edgeRigth;
					}

				}

				this.isMove = false;

				this.$emit('btnTouchend');
			},
		}
	}
</script>

<style lang="scss">
	.ai-gpt-box {
		position: fixed;
		width: 126rpx;
		height: 112rpx;
		overflow: hidden;

		.ai-gpt {
			width: 126rpx;
			height: 112rpx;
		}

		.high-light {
			position: absolute;
			height: 100%;
			width: 10rpx;
			top: 0;
			left: -40rpx;
			background-color: #fffde9;
		}

		&.transition {
			transition: left .3s ease, top .3s ease;
		}
	}
</style>