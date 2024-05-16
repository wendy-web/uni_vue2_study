<template>
	<!-- 卡券的二维码、条形码信息 -->
	<view class="coupon-qr-box">
		<view class="qr-code-title">核销二维码</view>
		<view class="qr-box">
			<image class="bg-qr-code" src="https://file.y1b.cn/store/1-0/23118/654b2cbaebbd2.png" mode="aspectFit"></image>
			<!-- <w-qrcode v-if="qrOptions.code" :options="qrOptions"></w-qrcode> -->
			<image class="qr-code" mode="aspectFit" :src="orderInfo.card_qr_link"></image>
		</view>
		<view class="qr-tips">到店出示券码给工作人员</view>
		<view class="bar-box">
			<image class="bg-bar-code" src="https://file.y1b.cn/store/1-0/23118/654b2cead1af4.png" mode="aspectFit"></image>
			<!-- <w-barcode v-if="barOptions.code" :options="barOptions"></w-barcode> -->
			<image class="bar-code" mode="aspectFit" :src="orderInfo.card_code_link"></image>
		</view>
		<!-- 显示卡券过期时间 -->
		<view class="coupon-expire-box" v-if="orderInfo.card_deadline&&showExpireTime">

			<view class="head">卡券信息</view>

			<view class="table-row">
				<view class="title">过期时间：</view>
				<view class="content">{{orderInfo.card_deadline}}</view>
			</view>
			<!-- 使用状态 -->
			<view class="use-status-box" v-if="showMarker">
				<view class="use-title">
					<view>使用状态</view>
					<view class="sub-title" v-if="orderInfo.status == 3">用完标记一下</view>
					<view class="sub-title" v-if="orderInfo.status == 4">使用时间：{{orderInfo.complete_time}}</view>
				</view>
				<view>
					<van-switch :checked="checked" :disabled="checked" active-color="#ef2b20" inactive-color="#d1d1d1"
						@change="onChange" size="44rpx" />
				</view>
			</view>
		</view>
		<!-- 标记使用的 确认弹窗 -->
		<van-popup :show="show" @close="onClose" position="bottom" round>
			<view class="pop-box">
				<view class="pop-title">确定标记为已使用？</view>
				<view class="btn-box">
					<view class="btn-cancel" @click="onClose">取消</view>
					<view class="btn-confirm" @click="confirm">确定</view>
				</view>
			</view>
		</van-popup>
	</view>
</template>

<script>
	import {
	verifyOrder
} from '@/api/modules/order.js';
	export default {
		props: {
			orderInfo: {
				type: Object
			}
		},
		data() {
			return {
				qrOptions: {
					code: '',
					size: 248
				},
				barOptions: {
					code: '',
					width: 584,
					height: 130
				},
				checked: false,
				show: false,
			}
		},
		computed: {
			showMarker() {
				let show_marker = false;
				let orderInfo = this.orderInfo;
				// 显示标记：未过期，无卡密
				if (orderInfo.card_status != 2 && !orderInfo.card_pwd && !orderInfo.card_number) {
					show_marker = true
				}
				return show_marker
			},
			showExpireTime() {
				let showExpireTime = false;
				let orderInfo = this.orderInfo;
				// 显示标记：未过期，无卡密
				if (!orderInfo.card_pwd && !orderInfo.card_number) {
					showExpireTime = true
				}
				return showExpireTime
			}
		},
		watch: {
			orderInfo: {
				handler(newVal, oldVal) {
					if (!newVal) return;
					let { status } = this.orderInfo;
					this.checked = status == 4 ? true : false;
				},
				immediate: true,
				deep: true
			}
		},
		mounted() {},
		methods: {
			onChange() {
				// this.checked = !this.checked;
				this.show = true;
			},
			onClose() {
				this.show = false;
			},
			confirm() {
				// this.checked = true;
				let params = {
					id: this.orderInfo.id
				}
				verifyOrder(params).then(res => {
					let {
						code,
						msg
					} = res;
					if (code == 1) {
						this.$emit('updateOrderInfo')
						let { status } = this.orderInfo;
						status = status == 3 ? 4 : 3;
						let check = status == 4 ? true : false;
						let orderInfo = this.orderInfo;
						orderInfo.status = status;
						this.orderInfo = orderInfo;
						this.checked = check;
						this.show = false;
						return
					}
					uni.showToast({
						icon: 'none',
						title: msg
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.coupon-qr-box {
		box-sizing: border-box;
		padding-top: 40rpx;
	}

	.qr-code-title {
		font-size: 26rpx;
		font-weight: 400;
		color: #999999;
		line-height: 36rpx;
		text-align: center;
		margin-bottom: 20rpx;
	}

	.qr-box {
		width: 316rpx;
		height: 316rpx;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto;

		.bg-qr-code {
			width: 316rpx;
			height: 316rpx;
			position: absolute;
			top: 0;
			left: 0;
		}

		.qr-code {
			width: 248rpx;
			height: 248rpx;
			position: relative;
			z-index: 1;
		}


	}

	.qr-tips {
		width: 316rpx;
		height: 50rpx;
		line-height: 50rpx;
		background: #ffffff;
		border: 1rpx solid #e1e1e1;
		border-radius: 26rpx;
		text-align: center;

		font-size: 24rpx;
		font-weight: 400;
		color: #333333;
		margin: 24rpx auto;
	}

	.bar-box {
		width: 632rpx;
		height: 176rpx;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto;

		.bg-bar-code {
			width: 632rpx;
			height: 176rpx;
			position: absolute;
			top: 0;
			left: 0;
		}

		.bar-code {
			width: 584rpx;
			height: 130rpx;
			position: relative;
			z-index: 1;
		}
	}

	.use-status-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 26rpx;
		font-weight: 400;
		color: #333333;
		line-height: 36rpx;

		box-sizing: border-box;
		margin-top: 24rpx;
		padding-top: 24rpx;
		background: #ffffff;
		border-top: 2rpx solid #f1f1f1;

		.sub-title {
			font-size: 24rpx;
			font-weight: 400;
			color: #999999;
			line-height: 34rpx;
			margin-top: 12rpx;
		}

		.vant-switch {
			width: 76rpx;
			height: 40rpx;
		}
	}

	.pop-box {
		height: 324rpx;
		background: #ffffff;
		border-radius: 24rpx 24rpx 0px 0px;
		padding: 40rpx 24rpx;
		box-sizing: border-box;
	}

	.pop-title {
		font-size: 30rpx;
		font-weight: 500;
		text-align: center;
		color: #333333;
		line-height: 42rpx;
	}

	.btn-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 56rpx;
	}

	.btn-cancel {
		width: 328rpx;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		line-height: 88rpx;
		text-align: center;
		background: #f8f8f8;
		border-radius: 16rpx;
		font-size: 28rpx;
		font-weight: 400;
	}

	.btn-confirm {
		width: 328rpx;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		background: linear-gradient(135deg, #f96a02, #ef2b20);
		border-radius: 16rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #ffffff;
	}

	.coupon-expire-box {
		box-sizing: border-box;
		padding: 32rpx 24rpx;
		width: 702rpx;
		background: #ffffff;
		border-radius: 24rpx;
		margin-top: 40rpx;

		.head {
			font-size: 30rpx;
			font-weight: 500;
			text-align: left;
			color: #333333;
			line-height: 42rpx;
			padding-left: 14rpx;
			position: relative;
		}

		.head::before {
			content: '';
			width: 4rpx;
			height: 26rpx;
			background: #ef2b20;
			border-radius: 2rpx;
			position: absolute;
			left: 0;
			top: 50%;
			transform: translateY(-50%);
		}

		.table-row {
			display: flex;
			align-items: center;
			position: relative;
			height: 66rpx;

			.title {
				flex-shrink: 0;
				width: 148rpx;
				height: 36rpx;
				font-size: 26rpx;
				font-weight: 400;
				color: #999999;
				line-height: 36rpx;
			}

			.content {
				margin-left: 8rpx;
				font-size: 26rpx;
				font-weight: 400;
				color: #EF2B20;
				line-height: 36rpx;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
				padding-right: 76rpx;
				box-sizing: border-box;
			}


		}
	}
</style>
