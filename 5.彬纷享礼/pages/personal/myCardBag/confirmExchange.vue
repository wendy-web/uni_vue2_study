<!-- 确定兑换 -->
<template>
	<view class="confirm-exchange xh-dialog" :style="{display: isShow?'block':'none'}">
		<view class="xh-dialog-body animated bounceInUp">
			<!-- toast 背景 -->
			<image class="dialog-bg" src="/static/images/dialog_bg.png"></image>
			<!-- toast header -->
			<image class="dialog-bg-header" src="/static/images/dialog_tips_header.png"></image>
			<!-- 主要内容 -->
			<view class="confirm-exchange-body">
				<!-- title -->
				<view class="ce-title">核对换购数量</view>
				<!-- msg -->
				<view class="ce-msg">您当前是否换购<text class="num">{{checkData.length}}</text>罐？</view>
				<!-- 认准 -->
				<view class="rz-zghn">
					<image class="rz-bg" src="/pages/personal/static/rz_bg.png" mode="aspectFill"></image>
					<view class="rz-zghn-title">
						换购饮料请认准
					</view>
					<view class="rz-zghn-tips">
						【红牛维生素功能饮料】
					</view>
				</view>
				<!-- 备注 -->
				<view class="remarks">备注：点击按钮扫<view class="stress">商家店铺码</view>换购</view>
			</view>
			<view class="xh-dialog-btn animated rubberBand delay-1s">
				<view class="xdb-item">
					<button v-if="userInfo.mobile" class="xdb-item exchange" @click="exchange">马上换购</button>
					<button v-else class="xdb-item exchange" open-type="getPhoneNumber"
						@getphonenumber="exchangeBefore">马上换购</button>
					<image class="xdb-item-bg" src="/static/images/dialog_btn_bg01.png"></image>
				</view>
			</view>
		</view>
		<!-- 关闭按钮 -->
		<image class="xh-dialog-close fadeInOpacity" :style="{display: isShow?'block':'none'}"
			src="/static/images/toast_close.png" @click="close" />
		<!-- 黑幕 -->
		<view class="xh-dialog-black" @touchmove.stop></view>
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
	// import log from '@/utils/log.js';
	export default {
		data() {
			return {
				checkData: [],
				isShow: false
			};
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
					url: '/pages/personal/storesCode/index'
				});
				this.isShow = false;
			}
		}
	};
</script>


</script>

<style lang="scss">
	.confirm-exchange {
		.xh-dialog-body {
			top: 350rpx;
		}

		.xh-dialog-btn {
			top: 665rpx;
		}

		.exchange {
			color: #614A00;
		}

		.xh-dialog-close {
			top: 1160rpx;
		}

		.dialog-bg {
			width: 646rpx;
			height: 674rpx;
		}

		.dialog-bg-header {
			position: absolute;
			width: 468rpx;
			height: 260rpx;
			top: 36rpx;
			left: 50%;
			-webkit-transform: translateX(-50%);
			transform: translateX(-50%);
		}

		.rz-zghn {
			width: 576rpx;
			height: 150rpx;
			position: relative;
			left: 6rpx;
			margin: 22rpx auto;
			z-index: 1;
			text-align: center;
			box-sizing: border-box;
			padding-top: 10rpx;
		}

		.rz-bg {
			position: absolute;
			width: 576rpx;
			height: 150rpx;
			top: 0;
			left: 0;
			z-index: -1;
		}

		.rz-zghn-title {
			font-size: 44rpx;
			font-weight: 700;
			color: #ffffff;
		}

		.rz-zghn-tips {
			font-size: 48rpx;
			font-weight: 700;
			color: #FFF100;
		}
	}

	.confirm-exchange-body {
		position: absolute;
		top: 305rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;



		.ce-title {
			font-size: 48rpx;
			font-weight: 700;
			color: #ffffff;
			letter-spacing: 4.8rpx;
		}

		.change-now {
			margin-bottom: 0;
			margin-top: 0;
		}

		.ce-msg {
			font-size: 32rpx;
			color: #FFF100;
			margin-top: 24rpx 0 22rpx;
			letter-spacing: 3.2rpx;
		}

		.num {
			font-size: 40rpx;
			color: #fff;
			font-weight: bold;
		}

		.remarks {
			font-size: 20rpx;
			color: #FFFFFF;
			text-align: center;
			display: flex;
			align-items: center;
			letter-spacing: 2rpx;
		}

		.stress {
			color: #F6E2B3;
		}
	}
</style>