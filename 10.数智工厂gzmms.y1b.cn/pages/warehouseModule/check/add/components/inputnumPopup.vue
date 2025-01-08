<template>
	<uv-popup ref="popup" mode="center" round="5" :closeOnClickOverlay="false" :safeAreaInsetBottom="false" closeable>
		<view class="inputnum-wrapper">
			<view class="goods-item">
				<view class="item-name">
					<text class="goods-name">{{ itemInfo.title }}</text>
				</view>
				<view class="goods-subitem">
					<text>条码：</text>
					<text>{{ itemInfo.barcode }}</text>
				</view>
				<!-- <view class="item-others">
					<view class="item-others-item">
						<text>UGREEN绿联gfdgjklfdsjgkljk</text>
					</view>
					<view class="item-others-item">
						<text>规格2米gfdgjklfdsjgkljk</text>
					</view>
					<view class="item-others-item">
						<text>单位:罐2米gfdgjklfdsjgkljk</text>
					</view>
				</view> -->
				<view class="goods-subitem">
					<text>规格：</text>
					<text>{{ itemInfo.spec || "-" }}</text>
				</view>
				<view class="goods-subitem">
					<text>单位：</text>
					<text>{{ itemInfo.measure_name }}</text>
				</view>
				<view class="goods-subitem">
					<text>分类：</text>
					<text>{{ itemInfo.class_name }}</text>
				</view>
				<view class="goods-subitem">
					<text>批次/日期：</text>
					<text>{{ itemInfo.ph_no }}</text>
				</view>
				<view class="item-before">
					<text>盘前数量</text>
					<text>{{ itemInfo.in_num }}</text>
				</view>
				<view class="item-input">
					<text class="left-label">盘后数量</text>
					<view class="">
						<uv-number-box
							color="#2979ff"
							iconStyle="color: #2979ff"
							inputWidth="56"
							:min="0"
							integer
							v-model="itemInfo.inv_num"
							@change="invnumChange"
						></uv-number-box>
					</view>
				</view>
				<view class="item-input">
					<text class="left-label">备注</text>
					<uv-input placeholder="请输入内容" border="surround" v-model="itemInfo.note" clearable></uv-input>
				</view>
				<view class="item-btn">
					<view class="btn-item">
						<uv-button text="取消" :customStyle="btnStyle" @click="cancel"></uv-button>
					</view>
					<view>
						<uv-button text="确认" type="primary" :customStyle="btnStyle" @click="confirm"></uv-button>
					</view>
				</view>
			</view>
		</view>
	</uv-popup>
</template>

<script>
export default {
	props: {
		info: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			btnStyle: {
				borderRadius: "10rpx",
				width: "220rpx",
			},
			itemInfo: {},
		};
	},
	methods: {
		// 打开弹窗
		open() {
			this.$refs.popup.open();
		},
		// 取消关闭弹窗
		cancel() {
			this.$refs.popup.close();
		},
		// 点击确认按钮
		confirm() {
			this.cancel();
			this.$emit("confirm",this.itemInfo);
		},
		//监听修改盘后数量
		invnumChange(e) {
			console.log("e", e);
			let inv_num = e.value;
			let in_num = this.itemInfo.in_num;
			this.itemInfo.diff_num = inv_num - in_num;
		},
	},
	watch: {
		info: {
			handler(val) {
				this.itemInfo = val;
			},
		},
	},
};
</script>

<style lang="scss">
.inputnum-wrapper {
	min-height: 500rpx;
	.goods-item {
		width: 600rpx;
		margin: 0 10rpx;
		padding: 30rpx 20rpx 30rpx 30rpx;
		background-color: #fff;
		margin-bottom: 10rpx;
		box-sizing: border-box;
		/* 商品名称样式 */
		.item-name {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 28rpx;
			margin-bottom: 16rpx;

			.goods-name {
				display: block;
				font-weight: bold;
				width: 90%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}

		/* 商品条码样式 */
		.goods-subitem {
			font-size: 24rpx;
			margin-top: 10rpx;
		}
		// .item-barcode {
		// 	font-size: 24rpx;
		// 	color: #a3a2a8;
		// 	margin-bottom: 20rpx;
		// }
		// .item-others {
		// 	display: flex;
		// 	align-items: center;
		// 	margin-bottom: 20rpx;
		// 	&-item {
		// 		background-color: #ecf0ff;
		// 		max-width: 212rpx;
		// 		height: 48rpx;
		// 		overflow: hidden;
		// 		text-overflow: ellipsis;
		// 		white-space: nowrap;
		// 		border-radius: 10rpx;
		// 		line-height: 48rpx;
		// 		text-align: center;
		// 		font-size: 28rpx;
		// 		color: #707072;
		// 		padding: 0 20rpx;
		// 		margin-right: 20rpx;

		// 		&:last-child {
		// 			margin-right: 0;
		// 		}
		// 	}
		// }
		.batch-number {
			font-size: 24rpx;
			color: #a3a2a8;
			margin-bottom: 20rpx;
		}

		/* 盘点前数量样式 */
		.item-before {
			margin: 20rpx 0;
			font-size: 28rpx;
			color: #6f6f6f;
			text {
				&:first-child {
					width: 120rpx;
					display: inline-block;
					margin-right: 10rpx;
				}
				&:last-child {
					padding-left: 20rpx;
				}
			}
		}
		/* 备注样式 */
		.item-input {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;
			.left-label {
				display: inline-block;
				width: 120rpx;
				margin-right: 10rpx;
				font-size: 28rpx;
				color: #6f6f6f;
			}
		}
		.item-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 60rpx;
			.btn-item {
				margin-right: 80rpx;
			}
		}
	}
}
</style>
