<!-- 罐底扫码提示信息 -->
<template>
	<cover-view class="xh-repayments xh-dialog" :style="{display: isShow?'block':'none'}">
		<cover-view class="xh-dialog-body xhDialog">
			<!-- toast 背景 -->
			<cover-image class="dialog-bg" src="../static/images/dialog_bg.png"></cover-image>
			<!-- toast header -->
			<cover-image class="dialog-bg-header-26" src="../../../static/images/dialog_tips_header.png"></cover-image>
			<!-- 主要内容 -->
			<cover-view class="repayments">
				<!-- 提示标题 -->
				<cover-view class="msg">{{msg}}</cover-view>
				<!-- 副消息 -->
				<cover-view class="msg-small" v-if="msgSmall">
					{{msgSmall}}
				</cover-view>
			</cover-view>
			<!-- 按钮部分 -->
			<cover-view class="xh-dialog-btn">
				<cover-view class="xdb-item" @click="$emit('repayments')">
					<cover-view class="xdb-item-text deposit">重新支付</cover-view>
					<cover-image class="xdb-item-bg" src="../../../static/images/dialog_btn_bg01.png"></cover-image>
				</cover-view>
				<cover-view class="xdb-item" v-if="order">
					<button class="xdb-item exchange" @click="queryPlay">已完成支付</button>
					<cover-image class="xdb-item-bg" src="../../../static/images/dialog_btn_bg01.png"></cover-image>
				</cover-view>
			</cover-view>

		</cover-view>
		<!-- 关闭按钮 -->
		<cover-image class="xh-dialog-close fadeInOpacity" :style="{display: isShow?'block':'none'}"
			src="../static/images/toast_close.png" @click="close" />
		<!-- 黑幕 -->
		<cover-view class="xh-dialog-black" @touchmove.stop></cover-view>
	</cover-view>

</template>

<script>
	import {
		getcardqr
	} from '@/api/homeApi.js';

	export default {
		data() {
			return {
				msg: '',
				msgSmall: '',
				isShow: false,
				order: ''
			};
		},
		methods: {
			show(res) {
				this.msg = res.msg;
				if (res.data && res.data.tips) this.msgSmall = '温馨提示：' + res.data.tips;
				this.isShow = true;
				this.order = res.order;
			},
			onlyClose() {
				this.isShow = false;
			},
			close() {
				this.$emit('closeNotice');
			},
			//查詢支付結果
			queryPlay() {
				getcardqr({
					order: this.order
				}).then(res => {
					if (!res.data.pay_time) {
						return wx.showModal({
							title: '支付结果',
							content: '未支付,请重新发起支付',
							showCancel: false
						});
					}
					//支付成功，跳转结果页
					this.$reLaunch({
						url: `/pages/personal/exchangeCode/index?codeData=${this.order}&isplay=1&type=1`
					});
				});
			}
		}
	};
</script>

<style lang="scss">
	.xh-repayments {

		.repayments {
			position: absolute;
			top: 330rpx;
			left: 50%;
			transform: translateX(-50%);
			width: 450rpx;

			.msg {
				font-size: 38rpx;
				color: #FFFFFF;
				font-weight: 700;
				margin-bottom: 40rpx;
				white-space: pre-wrap;
				text-align: center;
			}

			.msg-small {
				font-size: 24rpx;
				color: #FFFFFF;
				white-space: pre-wrap;
				text-align: center;
			}
		}

		.repayments-bottom {
			color: #F5231F;
			background-color: #FFFFFF;
		}

		.xh-dialog-close {
			bottom: 18%;
		}

		.deposit {
			color: #F5231F;
		}

		.exchange {
			color: #614900;
		}

	}
</style>