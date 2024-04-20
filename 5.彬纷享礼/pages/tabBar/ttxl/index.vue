<template>
	<view class="ttxl nav_cont">
		<!-- 背景 -->
		<van-image class="ttxl-bg" width="100%" height="100%" use-loading-slot src="https://file.y1b.cn/public/hn29th/ttxl/ttxl_bg.png">
			<van-loading slot="loading" type="spinner" size="20" vertical />
		</van-image>
		<!-- head -->
		<view class="head">
			<van-image class="ttxl-title" width="280rpx" height="66rpx" use-loading-slot
				src="https://file.y1b.cn/public/hn29th/ttxl/ttxl_title.png">
				<van-loading slot="loading" type="spinner" size="20" vertical />
			</van-image>
			<van-image class="ttxl-star" width="28rpx" height="28rpx" use-loading-slot src="https://file.y1b.cn/public/hn29th/ttxl/ttxl_star.png">
				<van-loading slot="loading" type="spinner" size="20" vertical />
			</van-image>
		</view>
		<!-- 用户信息 -->
		<view class="user-info" v-if="isLogin">
			<van-image width="56rpx" height="56rpx" radius="50px" use-loading-slot :src="userInfo.avatar_url">
				<van-loading slot="loading" type="spinner" size="20" vertical />
			</van-image>
			<text class="user-info-name">{{userInfo.nick_name}}</text>
		</view>
		<view class="user-info" v-else @click="goLogin">
			<van-image width="56rpx" height="56rpx" radius="50px" use-loading-slot src="/static/images/user_icon.png">
				<van-loading slot="loading" type="spinner" size="20" vertical />
			</van-image>
			<text class="user-info-name">登录享受更多精彩服务</text>
		</view>
		<!-- 积分相关 -->
		<view class="ttxl-jf" @click="goShopMall('shop_use')">
			<van-image class="ttxl-jf-bg" width="424rpx" height="58rpx" radius="50px" use-loading-slot
				src="https://file.y1b.cn/public/hn29th/ttxl/ttxl_use.png">
				<van-loading slot="loading" type="spinner" size="20" vertical />
			</van-image>
			<text class="ttxl-jf-label">可用积分</text>
			<text class="ttxl-jf-value" v-if="isLogin">{{creditsData.credits}}</text>
			<text class="ttxl-jf-value" v-else>*</text>
			<!-- 去使用 -->
			<van-image v-if="creditsData.credits>=10" class="ttxl-jf-btn" width="140rpx" height="50rpx" use-loading-slot
				src="https://file.y1b.cn/public/hn29th/ttxl/to_use.png">
				<van-loading slot="loading" type="spinner" size="20" vertical />
			</van-image>
			<!-- 赚积分 -->
			<van-image v-else class="ttxl-jf-btn" width="140rpx" height="50rpx" use-loading-slot
				src="https://file.y1b.cn/public/hn29th/ttxl/earn_points.png">
				<van-loading slot="loading" type="spinner" size="20" vertical />
			</van-image>
		</view>
		<!-- 礼品展示 -->
		<view class="gift-box">
			<van-image class="gift-box-head" width="486rpx" height="284rpx" use-loading-slot
				src="https://file.y1b.cn/public/hn29th/ttxl/ttxl_gift_icon.png">
				<van-loading slot="loading" type="spinner" size="20" vertical />
			</van-image>
			<!-- 礼品列表 -->
			<view class="gift-list">
				<!-- 商品列表 -->
				<!-- 				<view v-for="(item,index) in list" :key="index" class="gift-item" :class="'gift-item-position-'+index">
					<van-image class="gift-item-bg" width="180rpx" height="160rpx" use-loading-slot
						src="https://file.y1b.cn/public/hn29th/ttxl/gift_item_bg.png">
						<van-loading slot="loading" type="spinner" size="20" vertical />
					</van-image>
								<van-image class="gift-item-icon" width="180rpx" height="160rpx" use-loading-slot :src="item.icon">
						<van-loading slot="loading" type="spinner" size="20" vertical />
					</van-image>
				</view> -->
				<!-- 抽奖按钮 -->
				<!-- 				<van-image @click="goShopMall('?awardId=1')" class="ttxl-smoke" width="180rpx" height="160rpx"
					use-loading-slot src="https://file.y1b.cn/public/hn29th/ttxl/ttxl_smoke.png">
					<van-loading slot="loading" type="spinner" size="20" vertical />
				</van-image> -->
				<!-- 背景 -->
				<van-image v-if="jf_jump.img" class="gift-list-bg" width="100%" height="826rpx" use-loading-slot
					:src="jf_jump.img" @click="goShopMall('shop_draw')">
					<van-loading slot="loading" type="spinner" size="20" vertical />
				</van-image>
				<!-- 红包 -->
				<!-- 				<van-image class="red-envelope" width="114rpx" height="76rpx" use-loading-slot
					src="https://file.y1b.cn/public/hn29th/ttxl/red_envelope.png">
					<van-loading slot="loading" type="spinner" size="20" vertical />
				</van-image> -->
				<!-- 金币 -->
				<!-- 				<van-image class="ttxl-species" width="60rpx" height="56rpx" use-loading-slot
					src="https://file.y1b.cn/public/hn29th/ttxl/ttxl_species.png">
					<van-loading slot="loading" type="spinner" size="20" vertical />
				</van-image> -->
				<!-- 券 -->
				<!-- 			<van-image class="ttxl-ticket" width="116rpx" height="144rpx" use-loading-slot
					src="https://file.y1b.cn/public/hn29th/ttxl/ttxl_ticket.png">
					<van-loading slot="loading" type="spinner" size="20" vertical />
				</van-image> -->
			</view>
		</view>
		<!-- 活动说明 -->
		<view class="activity-info" @click="activetyInfo">
			活动说明
		</view>
		<!-- 弹出窗 -->
		<van-dialog id="van-dialog" />
		<!-- 导航栏 -->
		<custom-tab-bar currentIndex="1" />
	</view>
</template>

<script>
	import {
		mapGetters,
		mapActions,
		mapMutations
	} from "vuex"
	import {
		getTtxlUser
	} from "@/api/homeApi.js"
	import Dialog from '@/wxcomponents/vant/dialog/dialog';
	import customTabBar from '@/components/customTabBar/index.vue';
	export default {
		components: {
			customTabBar
		},
		computed: {
			...mapGetters(['userInfo', 'isTabBarRedDot', 'jf_jump', 'isAuthorization', 'isLogin'])
		},
		data() {
			return {
				// list: [{
				// 	icon: "https://img.yzcdn.cn/vant/cat.jpeg"
				// }, {
				// 	icon: "https://img.yzcdn.cn/vant/cat.jpeg"
				// }, {
				// 	icon: "https://img.yzcdn.cn/vant/cat.jpeg"
				// }, {
				// 	icon: "https://img.yzcdn.cn/vant/cat.jpeg"
				// }, {
				// 	icon: "https://img.yzcdn.cn/vant/cat.jpeg"
				// }, {
				// 	icon: "https://img.yzcdn.cn/vant/cat.jpeg"
				// }, {
				// 	icon: "https://img.yzcdn.cn/vant/cat.jpeg"
				// }, {
				// 	icon: "https://img.yzcdn.cn/vant/cat.jpeg"
				// }],
				creditsData: {
					credits: 0,
					page: "/pages/tabBar/shopMall/index"
				},
				// jf_jump: {
				// 	img: "",
				// 	url: ""
				// }
			}
		},
		onShow() {
			if (!this.userInfo) this.getUserInfo()
			// getConfig().then(res => {
			// 	this.jf_jump = res.data.jf_jump
			// })
			getTtxlUser().then(res => {
				this.creditsData = res.data || {
					credits: 0,
					page: "/pages/tabBar/shopMall/index"
				}
			})
			this.goShopMall('shop_enter')
			if (this.isTabBarRedDot.ttxl) {
				this.setTtxlRedDotStatus(false)
				let expired = new Date()
				this.$setExpiredStorage('ttxlTabDisplayed_fix', true, new Date(
					`${expired.getFullYear()}/${expired.getMonth()+1}/${expired.getDate()+1}`).getTime())
			}

		},
		methods: {
			...mapActions({
				getUserInfo: 'login/getUserInfo'
			}),
			...mapMutations({
				setTtxlRedDotStatus: 'app/setTtxlRedDotStatus',
			}),
			goShopMall(key) {
				this.$ttxlUserPosition(key)
			},
			activetyInfo() {
				Dialog.alert({
					title: '活动说明',
					messageAlign: "left",
					message: `1、所有用户可免费参与抽奖，抽取相关奖品；\n
							  2、点击抽奖后，需跳转至【天天享礼】小程序，点击【去领券】，领取相应奖励，若未跳转至【天天享礼】小程序或未点击【去领券】；则视为放弃本次奖品；\n
							  3、奖品均为商品优惠券，领取后可用券后价购买，具体奖品以实际页面展示为准；\n
							  4、用户参加本活动即视为同意全部活动规则。`,
				}).then(() => {
					// on close
				});
			},
			goLogin() {
				this.$go({
					url: this.isAuthorization ? '/pages/loginInner/loginInner' : '/pages/login/login'
				});
			}
		}
	}
</script>

<style>
	.ttxl-bg {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: auto;
		z-index: -1;
	}

	.head {
		width: 280rpx;
		height: 66rpx;
		position: relative;
		padding-top: 142rpx;
		margin: 0 auto;
		font-size: 0;
	}

	.ttxl-star {
		position: absolute;
		left: -28rpx;
		top: 115rpx;
	}

	.user-info {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 50rpx;
		font-size: 0;
	}

	.user-info-name {
		font-size: 30rpx;
		font-weight: 600;
		color: #ffffff;
		margin-left: 12rpx;
	}

	.ttxl-jf {
		position: relative;
		z-index: 1;
		width: 424rpx;
		height: 58rpx;
		font-size: 0;
		margin: 16rpx auto 0;
		display: flex;
		align-items: center;
	}

	.ttxl-jf-btn {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		right: 4rpx;
	}

	.ttxl-jf-bg {
		position: absolute;
		left: 0;
		top: 0;
		z-index: -1;
	}

	.ttxl-jf-label {
		font-size: 28rpx;
		font-weight: 900;
		color: #ad3938;
		margin-left: 20rpx;
	}

	.ttxl-jf-value {
		font-size: 28rpx;
		font-weight: 900;
		color: #ff5533;
		margin-left: 12rpx;
	}

	.gift-box {
		margin-top: 60rpx;
	}

	.gift-box-head {
		display: block;
		width: 486rpx;
		height: 284rpx;
		margin: 0 auto;
	}

	.gift-list {
		position: relative;
		z-index: 1;
		margin-top: -130rpx;
		height: 826rpx;
	}

	.gift-list-bg {
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
		width: 100%;
	}

	.activity-info {
		width: 136rpx;
		height: 52rpx;
		background: rgba(255, 255, 255, 0.32);
		border-radius: 30px 0 0 30px;
		position: absolute;
		top: 214rpx;
		right: 0;
		font-size: 26rpx;
		font-weight: 600;
		color: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* 
	.red-envelope {
		position: absolute;
		left: 192rpx;
		top: -38rpx;
	}

	.ttxl-species {
		position: absolute;
		left: 22rpx;
		top: 316rpx;
	}

	.ttxl-ticket {
		position: absolute;
		right: 0;
		top: 524rpx;
	} */

	/* 	.ttxl-smoke {
		position: absolute;
		top: 250rpx;
		left: 286rpx;
	}

	.gift-item {
		position: absolute;
		width: 180rpx;
		height: 160rpx;
	}

	.gift-item-bg {
		position: absolute;
		left: 0;
		top: 0;
	}

	.gift-item-position-0 {
		top: 70rpx;
		left: 86rpx;
	}

	.gift-item-position-1 {
		top: 70rpx;
		left: 286rpx;
	}

	.gift-item-position-2 {
		top: 70rpx;
		left: 486rpx;
	}

	.gift-item-position-3 {
		top: 250rpx;
		left: 486rpx;
	}

	.gift-item-position-4 {
		top: 430rpx;
		left: 486rpx;
	}

	.gift-item-position-5 {
		top: 430rpx;
		left: 286rpx;
	}

	.gift-item-position-6 {
		top: 430rpx;
		left: 86rpx;
	}

	.gift-item-position-7 {
		top: 250rpx;
		left: 86rpx;
	} */
</style>