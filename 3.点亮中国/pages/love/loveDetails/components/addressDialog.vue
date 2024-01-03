<template>
	<van-overlay :show="show" z-index="110">
		<view class="address-wrapper">
			<view class="address-content">
				<view class="address-icon" @click="closeAddressDialog">
					<image src="https://file.y1b.cn/public/img/bfzx/20230712/address_close@2x.png" mode=""></image>
				</view>
				<view class="gift-img">
					<image src="https://file.y1b.cn/public/img/bfzx/20230712/address_gift.png" mode=""></image>
				</view>
				<view class="address-title">
					<image src="https://file.y1b.cn/public/img/bfzx/20230712/top_five@2x.png" mode=""></image>
				</view>
				<view class="address-subtitle">
					<image src="https://file.y1b.cn/public/img/bfzx/20230712/address_notice.png" mode=""></image>
					<span class="address-subtitle-text">感谢你的支持，我们将送你一份小礼物</span>
				</view>
				<form @submit="formSubmit">
					<view class="form-hint">请填写收货信息</view>
					<van-cell-group>
						<van-field label="收货人" placeholder="请输入收货人" title-width="76" maxlength="20" name="name" :value="nameValue"
							:error-message="errName" @input="bindNameInput" />
						<van-field label="手机号" type="number" placeholder="请输入手机号" title-width="76" maxlength="20" name="mobile"
							:value="mobile" :error-message="errMobile" @input="bindMobileInput" />
						<picker mode="region" @change="bindRegionChange" :value="region">
							<van-field label="所在地区" title-width="76" placeholder="请选择省市区" :value="region[0] + region[1]+ region[2]"
								readonly right-icon="https://file.y1b.cn/public/img/bfzx/20230712/address_location@2x.png" name="area"
								:error-message="errArea" />
						</picker>
						<van-field label="详细地址" placeholder="请输入详细地址" title-width="76" name="address" :error-message="errAddress"
							:value="address" @input="bindAddressInput" />
					</van-cell-group>
					<view class="btn-area">
						<button type="primary" class="btn" formType="submit">提交</button>
					</view>
				</form>
			</view>
		</view>
	</van-overlay>
</template>

<script>
	export default {
		props: {
			dialogShow: Boolean,
		},
		data() {
			return {
				nameValue: "",
				mobile: "",
				address: "",
				region: ['', '', ''],
				errName: "", //
				errMobile: "", //
				errArea: "", //
				errAddress: "", //
				show: false,
			};
		},
		methods: {
			bindNameInput(e, type) {
				console.log("event.detail", e.detail)
				let value = e.detail.trim();
				this.errName = value.length > 0 ? '' : this.errName
			},
			bindMobileInput(e) {
				let value = e.detail.trim();
				this.errMobile = value.length == 11 ? '' : this.errMobile
			},
			bindAddressInput(e) {
				let value = e.detail.trim();
				this.errAddress = value.length > 0 ? '' : this.errAddress
			},
			bindRegionChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				this.region = e.detail.value
				this.errArea = ''
			},
			//点击关闭填写收货信息弹窗
			closeAddressDialog() {
				this.show = false;
				this.$emit('close', false)
			},
			formSubmit(e) {
				let params = e.detail.value;
				if (params.name.trim().length < 1) {
					this.errName = "请填写收货人"
					return
				} else if (params.mobile.trim().length != 11) {
					this.errMobile = "请输入11位手机号码"
					return
				} else if (!params.area) {
					this.errArea = "请选择省市区"
					return
				} else if (params.address.trim().length < 1) {
					this.errAddress = "请填写详细地址"
					return
				}

				for (let key in params) {
					params[key] = params[key].trim()
				}
				// console.log('form发生了submit事件，携带数据为：', e.detail.value)

				this.$emit('submit', params)
				

			},
		},
		watch: {
			dialogShow: {
				immediate: true,
				handler(value) {
					this.show = value
				}
			}
		}
	}
</script>

<style lang="scss">
	.address-wrapper {
		height: 100%;
		position: relative;
		// position: absolute;
		// left: 0;
		// right: 0;
		// top: 0;
		// bottom: 0;
		// z-index: 110;
		.address-content {
			position: absolute;
			top: 50%;
			transform: translateY(-40%);
			left: 48rpx;
			right: 48rpx;
			// background-color: #ffffff;
			border-radius: 20rpx;
			padding: 48rpx 24rpx;
			background: url("https://file.y1b.cn/public/img/bfzx/20230712/address_bg@2x.png") no-repeat;
			background-size: 100% 100%;
			z-index: 120;
			.gift-img {
				width: 364rpx;
				height: 370rpx;
				position: absolute;
				right: -46rpx;
				top: -180rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.address-icon {
				position: absolute;
				top: -120rpx;
				right: 0rpx;
				z-index: 999;

				image {
					width: 52rpx;
					height: 52rpx;
				}
			}

			.address-title {
				width: 464rpx;
				height: 58rpx;
				margin-bottom: 6rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.address-subtitle {
				position: relative;
				height: 66rpx;
				margin-bottom: 40rpx;

				image {
					width: 580rpx;
					height: 66rpx;
					position: absolute;
					top: 0;
					left: 0;
				}

				.address-subtitle-text {
					font-size: 28rpx;
					position: absolute;
					top: 50%;
					left: 72rpx;
					transform: translateY(-50%);
					color: #B8060A;

				}
			}

			.form-hint {
				padding-left: 26rpx;
				margin-bottom: 24rpx;
				font-size: 32rpx;
				font-weight: 700;
			}

			.van-cell {
				background-color: #fff;
				border-radius: 16rpx;
				margin-bottom: 32rpx;
				height: 80rpx;

				.van-cell__title {
					color: #333333;
					font-size: 28rpx;
					border-right: 2rpx solid #e1e1e1;

				}

				.van-cell__value {
					overflow: visible !important;

					.van-field__error-message {
						margin-top: 10rpx;
					}
				}
			}

			.btn-area {
				margin-top: 60rpx;

				.btn {
					height: 82rpx;
					background: linear-gradient(315deg, #fe4700, #fc750c);
					border-radius: 40rpx;

				}
			}
		}
	}
</style>