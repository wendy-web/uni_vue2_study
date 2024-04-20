<template>
	<view class="zm-c-exchange">
		<van-popup :show="isShow" @close="popupClose" custom-style="background-color: transparent;"
			:close-on-click-overlay="false" :z-index="10000">
			<view class="zm-exchange-box">
				<image class="zm-msg-head" src="https://file.y1b.cn/public/hn29th/warHorse/zm_msg_head.png"
					mode="aspectFill"></image>
				<!-- 主标题 -->
				<view class="zm-msg-title">
					核对换购数量
				</view>
				<!-- 副标题 -->
				<view class="zm-msg-small">
					<text>您当前是否换购</text>
					<text class="zm-num">{{checkData.length}}</text>
					<text>罐？</text>
				</view>
				<!-- 背景 -->
				<image class="zm-bg" src="https://file.y1b.cn/public/hn29th/warHorse/zm_bg.png" mode="aspectFill">
				</image>
				<!-- 操作按钮 -->
				<view class="zm-tools">
					<view class="zm-exchange">
						<image class="zm-item-bg" src="https://file.y1b.cn/public/hn29th/warHorse/zm_msg_btn.png">
						</image>
						<button v-if="userInfo.mobile" class="zm-item-btn zm-exchange-text"
							@click="exchange">马上兑换</button>
						<button v-else class="zm-item-btn zm-exchange-text" open-type="getPhoneNumber"
							@getphonenumber="exchangeBefore">马上兑换</button>
					</view>
				</view>
			</view>
			<view class="zm-tips">
				备注：点击按钮扫商家店铺码换购
			</view>
			<image class="close" src="/static/images/toast_close.png" mode="aspectFill" @click="close"></image>
		</van-popup>
	</view>
</template>

<script>
	import {
		mapMutations,
		mapActions,
		mapGetters
	} from 'vuex';
	import {
		setCheckCardVolume
	} from '@/utils/auth.js';
	export default {
		data() {
			return {
				checkData: [],
				isShow: false
			}
		},
		computed: {
			...mapGetters(['userInfo']),
		},
		methods: {
			...mapActions({
				updateUserMobile: 'login/updateUserMobile',
				getUserInfo: 'login/getUserInfo'
			}),
			...mapMutations({
				setCheckCardVolume: 'personal/setCheckCardVolume'
			}),
			show(data) {
				this.checkData = data;
				this.isShow = true;
			},
			close() {
				this.isShow = false;
			},
			//兑换前
			exchangeBefore(e) {

				this.isLoading = true;

				this.updateUserMobile(e).then(() => {
					//开始兑换
					this.exchange();
					//异步更新用户信息
					this.getUserInfo(true);
					//重置状态
					this.isLoading = false;

				}).catch(() => {

					this.isLoading = false;

				});

			},
			exchange() {
				//数据深copy
				let checkData = JSON.parse(JSON.stringify(this.checkData));
				// log.setFilterMsg('卡包换购数据');
				// log.info('卡包换购数据=>' + JSON.stringify(checkData));
				//本地缓存一份
				setCheckCardVolume(checkData);
				this.setCheckCardVolume(checkData);
				this.$go({
					url: '/pages/zm/storesCode/index'
				});
				this.isShow = false;
			}
		}
	}
</script>

<style lang="scss">
	.zm-c-exchange {

		.zm-exchange-box {
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
			font-weight: 400;
			color: #af7700;
			position: absolute;
			z-index: 2;
			left: 50rpx;
			right: 50rpx;
			top: 244rpx;
			text-align: center;

		}

		.zm-msg-small {
			font-size: 44rpx;
			font-weight: 700;
			color: #000000;
			position: absolute;
			z-index: 2;
			top: 320rpx;
			left: 50rpx;
			right: 50rpx;
			text-align: center;
		}

		.zm-num {
			font-size: 48rpx;
			font-weight: 700;
			color: #ff2b00;
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


			& button:after {
				border: none;
			}

			& button {
				background-color: transparent;
				padding: 0;
			}
		}

		.zm-exchange-text {
			font-size: 36rpx;
			font-weight: 700;
			color: #ffff9f;
			text-align: center;
			line-height: 90rpx;
		}

		.zm-tips {
			font-size: 24rpx;
			font-weight: 400;
			text-align: center;
			color: #ffff9f;
			margin-top: 20rpx;
		}

		.close {
			width: 56rpx;
			height: 56rpx;
			display: block;
			margin: 20rpx auto 0;
		}
	}
</style>