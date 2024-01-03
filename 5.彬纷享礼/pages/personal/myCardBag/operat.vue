<template>
	<view class="operat-instructions-dialog" v-if="isShow">
		<view class="oid-black"></view>
		<view class="oid-body">
			<!-- header -->
			<image class="oid-header" src="../static/operatID/oid-header.png" mode="widthFix"></image>
			<!-- card -->
			<image class="oid-card" src="../static/operatID/oid-card.png" mode="widthFix"></image>
			<!-- content -->
			<view class="oid-content">
				<!-- 主要内容 -->
				<view class="dashed-border">
					<view class="oid-text">
						1.该卡券仅限红牛维生素功能饮料 250ml（1元换购）使用；
					</view>
					<view class="oid-text">
						2.该卡券有效使用期为自领取之日 起7天内；
					</view>
					<view class="oid-text">
						3.该卡券不可折现，不找零、不设 挂失；
					</view>
					<view class="oid-text">
						4.该卡券仅限广东省范围内使用。
					</view>
				</view>
			</view>
			<!-- button -->
			<image class="oid-btn" @click="close" src="../static/operatID/oid-button.png" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShow: false
			};
		},
		methods: {
			show() {
				this.isShow = true;
			},
			close() {
				this.isShow = false;
			}
		}
	};
</script>

<style lang="scss">
	.operat-instructions-dialog {
		.oid-black {
			position: fixed;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			background-color: rgba(0, 0, 0, 0.8);
			z-index: 100;
		}

		.oid-body {
			position: fixed;
			width: 630rpx;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			font-size: 0;
			text-align: right;
			z-index: 101;
			text-align: center;
		}

		.oid-header {
			width: 552.97rpx;
			margin-bottom: 34rpx;
		}

		.oid-card {
			width: 568.45rpx;
			margin-bottom: 40rpx;
			z-index: 1;
		}

		.oid-content {
			width: 630rpx;
			height: 526rpx;
			background: linear-gradient(88deg, #d15050 3%, #c60e0e 99%);
			border-radius: 14px;
			margin-bottom: 60rpx;
			padding: 30rpx;
			box-sizing: border-box;
			position: relative;

			&::after {
				content: '';
				position: absolute;
				height: 40rpx;
				top: -40rpx;
				left: 110rpx;
				width: 4rpx;
				background-color: #CF4343;
			}

			&::before {
				content: '';
				position: absolute;
				height: 40rpx;
				right: 110rpx;
				;
				top: -40rpx;
				width: 4rpx;
				background-color: #CF4343;
			}
		}

		.dashed-border {
			border: 2px dashed #f99696;
			border-radius: 14px;
			width: 570rpx;
			height: 468rpx;
			padding: 30rpx 48rpx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}

		.oid-text {
			color: #FFFFFF;
			font-size: 32rpx;
			text-align: left;
			text-indent: -0.9em;
			padding-left: 1em;
		}

		.oid-btn {
			width: 274rpx;
		}
	}
</style>
