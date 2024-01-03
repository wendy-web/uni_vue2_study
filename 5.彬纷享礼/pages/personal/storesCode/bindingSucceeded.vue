<template>
	<cover-view class="binding-succeeded xh-dialog" :style="{display: isShow?'block':'none'}">
		<cover-view class="xh-dialog-body xhDialog">
			<!-- toast 背景 -->
			<cover-image class="dialog-bg" src="../../../static/images/dialog_bg.png"></cover-image>
			<!-- toast header -->
			<cover-image class="dialog-bg-header-26" src="../../../static/images/dialog_tips_header.png"></cover-image>
			<!-- 主要内容 -->
			<cover-view class="binding-succeeded-body">
				<!-- title -->
				<cover-view class="bs-title">店铺码识别成功</cover-view>
				<!-- 未中奖提示 -->
				<cover-view class="bs-msg">
					<cover-view>下一步请扫</cover-view>
					<cover-view class="bs-msg-bright">【换购品】</cover-view>
					<cover-view>罐底二维码。</cover-view>
				</cover-view>
				<!-- 罐底logo -->
				<!-- 				<cover-view class="sci-b">
				  <cover-image class="stores-code-icon" src="../static/stores-code-icon.png"></cover-image>
				  <cover-view class="jprt">奖品如图</cover-view>
				</cover-view> -->
			</cover-view>
			<!-- 按钮部分 -->
			<cover-view class="xh-dialog-btn">
				<cover-view class="xdb-item" @click="suerScan">
					<cover-view class="xdb-item-text deposit">确认扫罐底码</cover-view>
					<cover-image class="xdb-item-bg" src="../../../static/images/dialog_btn_bg01.png"></cover-image>
				</cover-view>
			</cover-view>
		</cover-view>
		<!-- 关闭按钮 -->
		<cover-image class="xh-dialog-close fadeInOpacity" :style="{display: isShow?'block':'none'}"
			src="../../../static/images/toast_close.png" @click="close" />
		<!-- 黑幕 -->
		<cover-view class="xh-dialog-black" @touchmove.stop></cover-view>
	</cover-view>
</template>

<script>
	export default {
		data() {
			return {
				id: null,
				isShow: false,
				maxBottom: 0
			};
		},
		methods: {
			show(id, maxBottom = 0) {
				this.id = id; //门店id
				this.maxBottom = maxBottom;
				this.isShow = true;
			},
			close() {
				this.isShow = false;
				this.$emit('closeNotice');
			},
			suerScan() {
				this.$reLaunch({
					url: `/pages/personal/tankBottomCode/tankBottomCode?store_id=${this.id}&maxBottom=${this.maxBottom}`
				});
			}
		}
	};
</script>

<style lang="scss">
	.binding-succeeded {

		.binding-succeeded-body {
			position: absolute;
			top: 320rpx;
			left: 50%;
			transform: translateX(-50%);
			width: 450rpx;

			.bs-title {
				font-size: RPX(25);
				color: #fff;
				text-align: center;
				font-weight: bold;
			}

			.bs-msg {
				font-size: 24rpx;
				color: #fff;
				text-align: center;
				margin-top: RPX(10);
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.bs-msg-bright {
				color: #b9fbc0;
				font-size: 30rpx;
				font-weight: bold;
			}

			.sci-b {
				margin: 15rpx;
				text-align: center;
			}

			.stores-code-icon {
				height: 112rpx;
				width: 220rpx;
				display: block;
				margin: 0 auto;
			}

			.jprt {
				font-size: 20rpx;
				text-align: center;
				color: #FFFFFF;
				margin-top: 6rpx;
			}

			.suer-scan {
				margin-bottom: RPX(20);
			}

		}

		.deposit {
			color: #614900;
		}

		.xh-dialog-close {
			bottom: 20%;
		}

	}
</style>