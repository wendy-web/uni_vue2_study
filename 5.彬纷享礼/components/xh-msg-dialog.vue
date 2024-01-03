<!-- 消息处理提示 -->
<template>
	<view class="xh-dialog xh-msg-dialog" :style="{display: isShow?'block':'none'}">
		<view class="xh-dialog-body xhDialog">
			<!-- toast 背景 -->
			<image class="dialog-bg" src="../static/images/dialog_bg.png"></image>
			<!-- toast header -->
			<image class="dialog-bg-header-26" src="../../../static/images/dialog_tips_header.png"></image>
			<!-- 主要内容 -->
			<view class="xh-msg-dialog-content">
				<!-- 未中奖提示 -->
				<view class="msg">{{msg}}</view>
				<!-- 温馨提示 -->
				<view v-if="!isShowAd&&msgSmall" class="msg-tips-header">温馨提示</view>
				<!-- 副消息 -->
				<view class="msg-small" v-if="msgSmall">
					{{msgSmall}}
				</view>
				<image v-if="isShowAd" :src="ad_jump_url_img" class="ad-jump-url" mode="heightFix" @click="goTTxl">
				</image>
			</view>
			<!-- 按钮部分 -->
			<view class="xh-dialog-btn">
				<!-- 马上换购 -->
				<view class="xdb-item" @click="callBack">
					<view class="xdb-item-text suer-btn">{{buttonText}}</view>
					<image class="xdb-item-bg" src="../../../static/images/dialog_btn_bg01.png"></image>
				</view>
			</view>

		</view>
		<!-- 关闭按钮 -->
		<image class="xh-dialog-close fadeInOpacity" :style="{display: isShow?'block':'none'}"
			src="../static/images/toast_close.png" @click="close" />
		<!-- 黑幕 -->
		<view class="xh-dialog-black" @touchmove.stop></view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	//回调函数名
	let _method = '';
	export default {
		props: {
			buttonText: {
				type: String,
				default: '确认'
			}
		},
		data() {
			return {
				msg: '',
				msgSmall: '',
				isShow: false
			};
		},
		computed: {
			...mapGetters(['ad_jump_url_img']),
			isShowAd() {
				if (this.msgSmall) {
					return this.msg.length < 13 && this.ad_jump_url_img
				}
				return this.msg.length < 16 && this.ad_jump_url_img
			}
		},
		methods: {
			close() {
				//关闭弹窗
				this.isShow = false;
				this.$emit('closeNotice');
			},
			show(res, method) { //{msg,msgSmall,method}
				//消息主标题
				this.msg = res.msg.replace('（异常）', '');
				//副标题
				if (res.data && res.data.tips) {
					this.msgSmall = res.data.tips.replace('（异常）', '');
				} else {
					this.msgSmall = '';
				}
				//回调函数名
				_method = method;
				//特殊情况
				if (this.msg == '无效二维码' || this.msg == '亲，请扫红牛拉环二维码') {
					this.msg = '亲，请扫正确的促销拉环二维码';
					this.msgSmall = ''
				}
				//显示弹窗
				this.isShow = true;
			},
			callBack() {
				if (!_method) {
					this.close();
				} else if (_method === 'again') {
					this.isShow = false;
					this.$emit('again');
				} else if (_method) {
					this.$emit(_method);
					this.close();
				}
			},
			goTTxl() {
				this.$ttxlUserPosition('code_abnormal')
			}
		}
	};
</script>

<style lang="scss">
	.xh-msg-dialog {

		.xh-dialog-body {
			height: 774rpx;
		}

		.xh-dialog-btn {
			top: 650rpx;
		}


		.xh-msg-dialog-content {
			position: absolute;
			top: 310rpx;
			left: 50%;
			transform: translateX(-50%);
			width: 100%;
			padding: 0 16rpx 0 30rpx;
			box-sizing: border-box;
			z-index: 1;
			text-align: center;

			.msg {
				font-size: 48rpx;
				color: #FFFFFF;
				font-weight: 700;
				// white-space: pre-wrap;
				text-align: center;
			}

			.msg-small {
				font-size: 28rpx;
				color: #FFFFFF;
				// white-space: pre-wrap;
				text-align: center;
				margin-top: 18rpx;
			}

			.msg-tips-header {
				color: #FFF33D;
				font-size: 32rpx;
				text-align: center;
				margin: 30rpx 0;
			}

			.ad-jump-url {
				height: 145rpx;
				margin: 15rpx auto;

			}
		}

		.suer-btn {
			color: #614900;
		}

		.xh-dialog-close {
			bottom: 12%;
		}

	}
</style>