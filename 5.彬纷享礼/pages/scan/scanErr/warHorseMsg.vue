<template>
	<view class="war-horse-msg">
		<van-popup :show="show" @close="popupClose" custom-style="background-color: transparent;"
			:close-on-click-overlay="false" :z-index="10000">
			<view class="war-horse-msg-box">
				<image class="zm-msg-head" src="https://file.y1b.cn/public/hn29th/warHorse/zm_msg_head.png"
					mode="aspectFill"></image>
				<!-- 主标题 -->
				<view class="zm-msg-title">
					{{msg}}
				</view>
				<!-- 副标题 -->
				<view class="zm-msg-small">
					{{msgSmall}}
				</view>
				<!-- 背景 -->
				<image class="zm-bg" src="https://file.y1b.cn/public/hn29th/warHorse/zm_bg.png" mode="aspectFill">
				</image>
				<!-- 操作按钮 -->
				<view class="zm-tools">
					<view class="zm-exchange" @click="again">
						<image class="zm-item-btn" src="https://file.y1b.cn/public/hn29th/warHorse/zm_msg_btn.png">
						</image>
						<view class="zm-item-btn zm-exchange-text">继续扫码</view>
					</view>
				</view>
			</view>
			<image class="close" src="/static/images/toast_close.png" mode="aspectFill" @click="popupClose"></image>
		</van-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				msg: '',
				msgSmall: ''
			}
		},
		methods: {
			popupShow(res) {
				// 消息主标题
				res.msg && (this.msg = res.msg.replace('（异常）', ''));
				//副标题
				if (res.data && res.data.tips) {
					this.msgSmall = res.data.tips.replace('（异常）', '');
				} else {
					this.msgSmall = '';
				}
				//特殊情况
				if (this.msg == '无效二维码' || this.msg == '亲，请扫红牛拉环二维码') {
					this.msgSmall = ''
				}
				this.show = true;
			},
			popupClose() {
				this.show = false
				this.$emit('closeNotice');
			},
			again() {
				this.show = false
				this.$emit('again');
			}
		}
	}
</script>

<style lang="scss">
	.war-horse-msg {

		.war-horse-msg-box {
			position: relative;
			width: 648rpx;
			height: 1025rpx;
			font-size: 0;
			box-sizing: border-box;
			padding-top: 80rpx;
		}


		.zm-msg-head {
			width: 400rpx;
			height: 230rpx;
			position: absolute;
			z-index: 2;
			top: 0;
			left: 50%;
			transform: translateX(-50%);
		}

		.zm-msg-title {
			font-size: 48rpx;
			font-weight: 700;
			color: #e42a04;
			position: absolute;
			z-index: 2;
			left: 50rpx;
			right: 50rpx;
			top: 260rpx;
			text-align: center;
		}

		.zm-msg-small {
			font-size: 24rpx;
			font-weight: 400;
			color: #434343;
			position: absolute;
			z-index: 2;
			top: 342rpx;
			left: 50rpx;
			right: 50rpx;
			text-align: center;
		}

		.zm-bg {
			width: 648rpx;
			height: 904rpx;
			position: relative;
			z-index: 1;
		}

		.zm-tools {
			position: absolute;
			left: 50%;
			bottom: 0;
			z-index: 2;
			transform: translateX(-50%);
			height: 90rpx;
		}

		.zm-exchange {
			width: 404rpx;
			height: 90rpx;
			position: relative;

			.zm-item-bg {
				width: 404rpx;
				height: 90rpx;
				position: absolute;
				left: 0;
				top: 0;
				z-index: -1;
			}

			.zm-item-btn {
				width: 404rpx;
				height: 90rpx;
				position: absolute;
				left: 0;
				top: 0;
				z-index: 1;
			}
		}

		.zm-exchange-text {
			font-size: 36rpx;
			font-weight: 700;
			color: #ffff9f;
			text-align: center;
			line-height: 90rpx;
		}

		.close {
			width: 56rpx;
			height: 56rpx;
			display: block;
			margin: 20rpx auto 0;
		}
	}
</style>
