<template>
	<view class="coupon-info-box">
		<view class="head">卡券信息</view>
		<view class="table-row" v-if="orderInfo.card_number">
			<view class="title">卡号：</view>
			<view class="content">{{orderInfo.card_number}}</view>
			<view class="operate" @click="copy(orderInfo.card_number)">复制</view>
			<!-- <view class="operate" @click="copy('#小程序://彬纷在线/dtWX5yN1AzAC70l')">复制</view> -->
		</view>
		<view class="table-row" v-if="orderInfo.card_pwd">
			<view class="title">券码(卡密)：</view>
			<view class="content">{{orderInfo.card_pwd}}</view>
			<view class="operate" @click="copy(orderInfo.card_pwd)">复制</view>
		</view>
		<view class="table-row" v-if="orderInfo.card_deadline">
			<view class="title">过期时间：</view>
			<view class="content">{{orderInfo.card_deadline}}</view>
		</view>
		<!-- 使用状态 -->
		<view class="use-status-box-item" v-if="orderInfo.card_status !=2">
			<view class="use-title">
				<view>使用状态</view>
				<view class="sub-title" v-if="orderInfo.status==3">用完标记一下</view>
				<view class="sub-title" v-if="orderInfo.status == 4">使用时间：{{orderInfo.complete_time}}</view>
			</view>
			<view>
				<van-switch :checked="checked" :disabled="checked" active-color="#ef2b20" inactive-color="#d1d1d1"
					@change="onChange" size="44rpx" />
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
        <privacyOpen ref="privacyOpen"></privacyOpen>
	</view>
</template>

<script>
	import {
		verifyOrder
	} from '@/api/modules/order.js'
	export default {
		props: {
			orderInfo: {
				type: Object,
				default: null
			}
		},
		data() {
			return {
				checked: false,
				show: false,
			}
		},

		watch: {
			orderInfo: {
				handler(newVal, oldVal) {
					console.log("watch:", newVal)
					if (newVal) {
						let {
							status
						} = this.orderInfo;
						this.checked = status == 4 ? true : false;
					}
				},
				immediate: true,
				deep: true
			}
		},
		mounted() {

		},
		methods: {
			copy(str) {
				uni.setClipboardData({
					data: str,
					success: () => this.$toast('复制成功')
				})
			},
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
						let {
							status
						} = this.orderInfo;
						status = status == 3 ? 4 : 3;
						let check = status == 4 ? true : false;
						let orderInfo = this.orderInfo;
						orderInfo.status = status;
						this.orderInfo = orderInfo;
						this.checked = check;
						console.log("verifyOrder：", this.orderInfo);
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
	.coupon-info-box {
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

			// justify-content: flex-start;
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

			.operate {
				width: 72rpx;
				height: 44rpx;
				line-height: 44rpx;
				border: 1rpx solid #e1e1e1;
				border-radius: 8rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #666666;
				text-align: center;
				position: absolute;
				right: 0;
				margin: auto;
			}
		}

		.use-status-box-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 26rpx;
			font-weight: 400;
			color: #333333;
			line-height: 36rpx;
			margin-top: 24rpx;
			padding-top: 24rpx;
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
	}
</style>
