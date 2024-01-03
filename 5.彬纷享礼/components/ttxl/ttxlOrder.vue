<template>
	<view>
		<view id="_drag_button" class="ttxl-order-box" :class="{transition: isDock && !isMove }"
			:style="'left: ' + left + 'px; top:' + top + 'px;'" @touchstart="touchstart"
			@touchmove.stop.prevent="touchmove" @touchend="touchend" @click.stop.prevent="click">
			<image class="ttxl-order" src="/static/ttxl/ttxl_order.png" mode="aspectFill"></image>
			<view>订单</view>
			<view class="ttxl-order-redrot" v-if="redRot"></view>
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
			redRot: {
				type: Boolean,
				default: false
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
				this.top = this.windowHeight * 0.7;
			}).exec();
		},
		methods: {
			click() {
				this.$ttxlUserPosition('my_order')
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
	.ttxl-order-box {
		position: fixed;
		width: 100rpx;
		height: 100rpx;
		background-color: #ffffff;
		border-radius: 50%;
		box-shadow: 0rpx 6rpx 8rpx 0rpx rgba(51, 51, 51, 0.10);
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		font-size: 22rpx;
		color: #333333;
		z-index: 1000;

		.ttxl-order {
			width: 40rpx;
			height: 46rpx;
		}

		.high-light {
			position: absolute;
			height: 100%;
			width: 10rpx;
			top: 0;
			left: -40rpx;
			background-color: #fffde9;
		}

		.ttxl-order-redrot {
			width: 12rpx;
			height: 12rpx;
			background-color: #f22e15;
			border-radius: 50%;
			position: absolute;
			top: 10rpx;
			right: 25rpx;
		}

		&.transition {
			transition: left .3s ease, top .3s ease;
		}
	}
</style>