<template>
	<view class="war-horse-win">
		<van-popup :show="show" @close="popupClose" custom-style="background-color: transparent;"
			:close-on-click-overlay="false" :z-index="10000">
			<view class="war-horse-win-box">
				<image class="zm-win-head" src="https://file.y1b.cn/public/hn29th/warHorse/zm_win_head.png" mode="aspectFill"></image>
				<!-- card -->
				<view class="zm-card">
					<image class="zm-card-left" src="https://file.y1b.cn/public/hn29th/warHorse/zm_card_left.png" mode="aspectFill"></image>
					<image class="zm-card-right" src="https://file.y1b.cn/public/hn29th/warHorse/zm_card_right.png" mode="aspectFill"></image>
					<view class="zm-card-title">
						1元乐享战马换购券
					</view>
					<view class="zm-card-time">
						领取时间：{{time}}
					</view>
				</view>
				<!-- 背景 -->
				<image class="zm-bg" src="https://file.y1b.cn/public/hn29th/warHorse/zm_bg.png" mode="aspectFill"></image>
				<!-- 操作按钮 -->
				<view class="zm-tools">
					<image class="zm-crkb" src="https://file.y1b.cn/public/hn29th/warHorse/zm_crkb.png" mode="aspectFill" @click="goCardBag">
					</image>
					<view class="zm-exchange">
						<image class="zm-item-bg" src="https://file.y1b.cn/public/hn29th/warHorse/zm_msdh.png"></image>
						<button v-if="userInfo.mobile" class="zm-item-btn" @click="exchange"></button>
						<button v-else class="zm-item-btn" open-type="getPhoneNumber"
							@getphonenumber="exchangeBefore"></button>
					</view>
				</view>
			</view>
			<image class="close" src="/static/images/toast_close.png" mode="aspectFill" @click="popupClose"></image>
		</van-popup>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations,
		mapActions
	} from 'vuex';
	import {
		parseTime
	} from '@/utils';
	import {
		setCheckCardVolume
	} from '@/utils/auth.js';
	import {
		addpush
	} from "@/api/homeApi.js"

	export default {
		data() {
			return {
				show: false,
				parmas: null, //劵参数
				time: "",
				expire: ""
			}
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		methods: {
			...mapMutations({
				setCheckCardVolume: 'personal/setCheckCardVolume'
			}),
			...mapActions({
				updateUserMobile: 'login/updateUserMobile',
				getUserInfo: 'login/getUserInfo',
				getCardTopCount: 'personal/getCardTopCount'
			}),
			popupShow(data) {
				let {
					pid,
					pull_qr,
					expire
				} = data;
				this.expire = expire || ""
				this.parmas = {
					pid,
					pull_qr
				};
				this.time = parseTime(new Date())
				this.show = true
				//中奖了更新顶部信息
				this.getCardTopCount();
			},
			popupClose() {
				this.show = false
				this.$emit('closeNotice');
			},
			goCardBag() {
				this.isShow = false;
				wx.requestSubscribeMessage({
					tmplIds: ['2OWPAcsIVmynILZkWX2u5uaZhU7rT6FNHnJgfwV-Eyo'],
					complete: (e) => {
						addpush({
							...e,
							expire: this.expire
						}).then(() => {})
						this.$redirectTo({
							url: '/pages/personal/myCardBag/index?type=1'
						});
					}
				})
			},
			exchangeBefore(e) {
				this.updateUserMobile(e).then(res => {
					//开始兑换
					this.exchange();
					//异步更新用户信息
					this.getUserInfo(true);
				});
			},
			exchange() {
				//深copy
				let parmas = JSON.parse(JSON.stringify(this.parmas));
				//本地缓存一份
				setCheckCardVolume([parmas]);
				this.setCheckCardVolume([parmas]); //当前兑换卷
				this.$redirectTo({
					url: '/pages/zm/storesCode/index'
				});
				this.isShow = false;
			}
		}
	}
</script>

<style lang="scss">
	.war-horse-win {

		.war-horse-win-box {
			position: relative;
			width: 648rpx;
			height: 1068rpx;
			font-size: 0;
			box-sizing: border-box;
			padding-top: 122rpx;
		}

		.zm-win-head {
			width: 622rpx;
			height: 172rpx;
			position: absolute;
			top: 0;
			left: 50%;
			transform: translateX(-50%);
		}

		.zm-card {
			width: 508rpx;
			height: 152rpx;
			position: absolute;
			z-index: 2;
			top: 260rpx;
			left: 50%;
			transform: translateX(-50%);
			display: flex;
		}

		.zm-card-left {
			width: 120rpx;
			height: 152rpx;
		}

		.zm-card-right {
			width: 388rpx;
			height: 152rpx;
		}

		.zm-card-title {
			white-space: nowrap;
			position: absolute;
			left: 154rpx;
			top: 42rpx;
			font-size: 28rpx;
			font-weight: 400;
			color: #000000;
		}

		.zm-card-time {
			white-space: nowrap;
			position: absolute;
			left: 154rpx;
			bottom: 42rpx;
			font-size: 18rpx;
			font-weight: 400;
			color: #666666;
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
			display: flex;
		}

		.zm-crkb {
			width: 264rpx;
			height: 90rpx;
			margin-right: 70rpx;
		}

		.zm-exchange {
			width: 264rpx;
			height: 90rpx;
			position: relative;

			.zm-item-bg {
				width: 264rpx;
				height: 90rpx;
				position: absolute;
				left: 0;
				top: 0;
				z-index: -1;
			}

			.zm-item-btn {
				width: 264rpx;
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

		.close {
			width: 56rpx;
			height: 56rpx;
			display: block;
			margin: 20rpx auto 0;
		}
	}
</style>