<template>
	<view class="user">
		<!-- 蓝色阴影 -->
		<view class="blue-shadow"
			@touchstart ="touchstartHandle"
			@touchend ="touchendHandle"
		>
			<view class="blue-shadow-pull"></view>
		</view>
		<!-- 点亮城市区域 -->
		<view class="wrap">
			<!-- head -->
			<view class="city-box-head">
				<view class="head-left">
					<!-- <text class="province-num">{{total.prov_num}}</text>个省份， -->
					<text class="city-num">{{total.city_num}}</text>座城市已点亮
				</view>
				<view class="head-more" @click="goPage('/pages/user/lightRecord/index')">
					查看更多<image class="right-arrow" src="/static/home/right_arrow.png" mode="aspectFill"></image>
				</view>
				<!-- 背景 -->
				<image class="home-city-nav" src="/static/home/home_city_nav.png" mode="aspectFill"></image>
			</view>
			<view class="city-box" v-if="showCityList.length >0 && isAutoLogin">
				<!-- citylist -->
				<view class="city-card-list">
					<view v-for="item in showCityList" :key="item.id"
						:class="{'city-card-item': true, 'city_card_next': item.isLightUp}"
						@click="cityItemClick(item)">
						<view class="city-card-head">
							<text class="city-name">{{item.city}}</text>
							<text class="time"
								v-if="!item.isLightUp">
								{{!item.isLightUp && item.lit_time.slice(0,10)}}
							</text>
						</view>
						<view class="city-card-icon">
							<van-image width="100%" height="194rpx" :src="item.image" fit="cover" lazy-load
								use-loading-slot>
								<van-loading slot="loading" type="spinner" size="20" vertical />
							</van-image>
						</view>
					</view>
				</view>
			</view>
			<!-- no--data -->
			<view class="no-data" v-else>
				<view class="no-data-logo">
					<image class="img" src="/static/home/no_data.png" mode="aspectFill"></image>
				</view>
				<view class="no-data-tips">
					点亮一座城市，贡献一能量
				</view>
				<view class="no-data-btn" @click="scan">
					立即行动
				</view>
			</view>
		</view>
		<!-- 我的勋章 -->
		<view class="wrap-medal">
			<view class="medal-head">
				<view><text class="city-num">{{userInfo.medal_num || 0}}</text>个勋章已解锁</view>
				<view class="head-more" @click="goMedal()">
					查看更多<image class="right-arrow" src="/static/home/right_arrow.png" mode="aspectFill"></image>
				</view>
				<!-- icon -->
				<image class="home-medal-icon" src="/static/home/home_medal_icon.png" mode="aspectFill"></image>
			</view>
			<view class="medal-list">
				<!-- :class="{'unlock':item.status === 0}" -->
				<view class="medal-item"
					v-for="item in medalList"
					:key="item.id"
					@click="showMedal(item)"
				>
					<view class="medal-item-box" :class="item.status === 0 ? 'mib-unlock' : 'mib-lock'">
						<van-image width="158rpx" height="158rpx" :src="item.image" use-loading-slot>
							<van-loading slot="loading" type="spinner" size="20" vertical />
						</van-image>
						<!-- 水波纹 -->
						<image class="water" src="/static/home/water_black.png"
							:style="{ bottom:isAutoLogin ? item.propRate : 0 }"
							v-if="item.status === 0 "
						></image>
					</view>
					<!-- 解锁进度 -->
					<view class="unlock-progress"
						v-if="item.status === 0&&(item.prop>0||item.id==soonMedalId) && isAutoLogin"
					>
						{{item.propRate}}
					</view>
					<!-- 待解锁 -->
					<view class="stay-unlock" v-if="(item.prop === 0&&item.id!=soonMedalId) || !isAutoLogin">
						<image class="stay-unlock-icon" src="/static/home/lock.png" mode="aspectFill"></image>待解锁
					</view>
				</view>
				<view class="medal-loading" v-if="medalList.length === 0">
					<van-loading />
				</view>
			</view>
		</view>
		<!-- 硅胶填充 -->
		<view class="silica-gel" v-if="(TYPE == 0)">
		</view>
	</view>
</template>

<script>
	import {
		getUserCity,
		getUserMedal2, // 个人
		getTeamCity,
		getTeamMedal // 团队
	} from '@/api/modules/home.js';
	import {
		mapGetters
	} from 'vuex';
	import {
		debounce
	} from '@/utils/index.js'

	export default {
		props: {
			TYPE: {
				type: Number,
				default: 0
			},
		},
		data() {
			return {
				cityList: [],
				medalList: [],
				total: {
					city_num: 0,
					prov_num: 0
				}
			}
		},
		computed: {
			...mapGetters(['userInfo', 'soonMedalId', 'isAuthorization', 'nextCity', 'isAutoLogin']),
			showCityList: function() {
				let list = [];
				if (this.nextCity && (this.cityList.length > 0)) {
					const {
						city,
						image
					} = this.nextCity;
					let item1 = this.cityList[0]
					list.push({
						...item1,
						isLightUp: false
					});
					list.push({
						id: 1,
						city,
						image,
						isLightUp: true
					})
				} else {
					list = this.cityList
				}

				return list;
			}
		},
		// mounted() {
		// 	this.initMedal()
		// },
		methods: {
			touchstartHandle() {
				this.$emit('touchstart');
			},
			touchendHandle() {
				this.$emit('touchend');
			},
			scan() {
				this.$emit('scan')
			},
			initCity() {
				this.cityList = []
				this.total = {
					city_num: 0,
					prov_num: 0
				}
				const API = this.TYPE === 0 ? getUserCity : getTeamCity
				API({
					limit: 2
				}, true).then(res => {
					if (res.code == 1) {
						const {
							list,
							total
						} = res.data;
						this.cityList = list;
						this.total = total;
					}
				})
			},
			initMedal() {
				this.medalList = []
				const API = this.TYPE === 0 ? getUserMedal2 : getTeamMedal
				API({
					limit: 3
				}, true).then(res => {
					if (res.code == 1) {
						this.medalList = res.data.list.map(function(item) {
							return {
								...item,
								propRate: (item.prop * 100).toFixed(0) + '%'
							}
						})
					}
				})
			},
			showMedal(item) {
				//前往授权
				if (!this.isAuthorization) {
					this.$emit('loginToast');
					return
				}
				if (!this.isAutoLogin) return this.$emit('loginToast', true);
				const {
					province,
					image,
					status,
					create_time,
					love,
					reward_love,
					city_num,
					user_prop,
					prop,
					id
				} = item;
				if (status == 0 && (prop > 0 || id == this.soonMedalId)) {
					wx.reportEvent("click_unlockingmedal", {
						authorized_or_not: Number(this.isAuthorization)
					});
					uni.navigateTo({
						url: '/pages/user/currentlyLit/index?medal_id=' + id
					})
					return;
				}
				if(status === 0 && prop == 0) {
					wx.reportEvent("click_unlockmedal", {
						authorized_or_not: Number(this.isAuthorization)
					});
				}
				this.$emit('showModal', {
					medalImage: image.split('?')[0],
					isLightUp: Boolean(+status),
					province: province,
					create_time: create_time,
					type: this.TYPE,
					love,
					reward_love,
					city_num,
					user_prop,
					id
				})
			},
			cityItemClick(item) {
				if (!this.isAuthorization) {
					this.$emit('loginToast');
					return;
				}
				if (!this.isAutoLogin) return this.$emit('loginToast', true);
				const {
					city,
					image,
					lit_time,
					isLightUp,
					share_title
				} = item;
				if (isLightUp) {
					wx.reportEvent("click_lcity", {
						authorized_or_not: Number(this.isAuthorization)
					});
					return this.$emit('goLightUp', 4);
				}
				this.$router.navigateTo({
					url: `/pages/user/lightRecord/index?type=${this.TYPE}&image=${image}&city=${city}&lit_time=${lit_time.slice(0,10)}&share_title=${share_title}`
				});
			},
			goMedal() {
				//前往授权
				if (!this.isAuthorization) {
					this.$emit('loginToast')
					return
				};
				if (!this.isAutoLogin) return this.$emit('loginToast', true);
				this.$router.navigateTo({
					url: '/pages/user/medal/index'
				});
			},
			goLightUpClick() {
				this.$emit('goLightUp');
			},
			goPage(url) {
				if (!this.isAuthorization) {
					this.$emit('loginToast');
					return;
				}
				if (!this.isAutoLogin) return this.$emit('loginToast', true);
				this.$router.navigateTo({
					url: url + '?type=' + this.TYPE
				});
			}
		}
	}
</script>

<style lang="scss">
	.user {
		margin-top: -220rpx;
		position: relative;
		z-index: 1;

		.blue-shadow {
			height: 164rpx;
			background: linear-gradient(180deg, rgba(69, 174, 174, 0.00) 4%, #008484);
			position: relative;
		}

		.blue-shadow-pull {
			width: 76rpx;
			height: 10rpx;
			opacity: 0.6;
			background: #333;
			border-radius: 4px;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: 50rpx;
		}

		.wrap {
			min-height: 465rpx;
			margin-top: -40rpx;
		}

		.city-box-head {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 28rpx;
			position: relative;
			height: 194rpx;
		}

		.home-city-nav {
			position: absolute;
			top: 0;
			left: 0;
			height: 194rpx;
			width: 100%;
		}

		.head-left {
			position: relative;
			z-index: 1;
			font-size: 28rpx;
			font-weight: 700;
			color: #000018;
			padding-left: 40rpx;
			padding-bottom: 30rpx;
		}

		.province-num {
			font-size: 40rpx;
			color: #e3001b;
		}

		.city-num {
			font-size: 40rpx;
			color: #F55B21;
		}

		.head-more {
			font-size: 24rpx;
			align-self: center;
			display: flex;
			align-items: center;
			position: relative;
			color: #FF4907;
			z-index: 1;
			padding-right: 32rpx;
			padding-bottom: 30rpx;
		}

		.right-arrow {
			width: 32rpx;
			height: 32rpx;
		}

		.city-box {

			.city-card-list {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				padding: 44rpx 30rpx 10rpx;
				margin-top: -50rpx;
				position: relative;
				z-index: 1;
				background-color: #ffffff;
				border-radius: 15px;
				box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
			}

			.city-card-item {
				width: 316rpx;
				height: 262rpx;
				border-radius: 10px;
				position: relative;
				overflow: hidden;
				margin-bottom: 30rpx;
				box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
				border: 1px solid #ebeef5;

				&.city_card_next::before {
					content: '';
					z-index: 1;
					position: absolute;
					top: 0;
					left: 0;
					bottom: 0;
					right: 0;
					background: rgba(0, 0, 0, 0.40);
				}

				&.city_card_next::after {
					content: '去点亮';
					font-size: 24rpx;
					color: #fff;
					z-index: 1;
					position: absolute;
					top: 0;
					left: 0;
					bottom: 0;
					right: 0;
					width: 112rpx;
					height: 50rpx;
					line-height: 50rpx;
					text-align: center;
					margin: auto;
					background: rgba(255, 255, 255, 0.20);
					border: 1rpx solid rgba(255, 255, 255, 0.20);
					border-radius: 27rpx;
				}
			}


			.city-card-head {
				height: 68rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-left: 26rpx;
				padding-right: 26rpx;
				background-color: rgba(255, 255, 255, 1);
				font-size: 25rpx;

				.city-name {
					color: #000000;
				}

				.time {
					color: #4E4D52;
				}
			}

			.city-card-icon {
				display: block;
				height: 194rpx;
				width: 100%;
				border-radius: 0 0 10rpx 10rpx;
			}
		}

		.wrap-medal {
			border-radius: 15px;
			background-color: #ffffff;
			margin-top: 30rpx;
			overflow: hidden;
			padding-bottom: 50rpx;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

			.medal-head {
				display: flex;
				justify-content: space-between;
				align-items: center;
				background-color: #FFF5E8;
				padding: 30rpx;
				position: relative;
				font-size: 28rpx;
				font-weight: 700;
				color: #000018;
			}

			.home-medal-icon {
				position: absolute;
				left: 160rpx;
				top: 50%;
				transform: translateY(-50%);
				width: 126rpx;
				height: 96rpx;
			}

			.head-more {
				font-size: 24rpx;
				align-self: center;
				display: flex;
				align-items: center;
				padding: 10rpx 0;
				color: #FF4907;
				font-weight: 400;
			}

			.right-arrow {
				width: 32rpx;
				height: 32rpx;
			}

			.medal-list {
				display: flex;
				flex-wrap: wrap;
				padding-top: 30rpx;
				// min-height: 188rpx;
			}

			.medal-item {
				width: 33.33%;
				padding-top: 30rpx;
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.medal-item-box {
				position: relative;
				width: 158rpx;
				height: 158rpx;
				padding: 6rpx;
				border-radius: 50%;
				overflow: hidden;
				-webkit-backface-visibility: hidden;
				-webkit-transform: translate3d(0, 0, 0);
			}

			.mib-lock {
				background-image: linear-gradient(180deg, #FFD690, #FF8902);
			}

			.mib-unlock {
				background-color: #939393;
			}

			.unlock-progress {
				width: 76rpx;
				height: 36rpx;
				background: #ff7507;
				border-radius: 18px;
				position: absolute;
				right: 30rpx;
				top: 30rpx;
				font-size: 24rpx;
				font-weight: 700;
				text-align: center;
				color: #ffffff;
				line-height: 36rpx;
			}

			.stay-unlock {
				width: 128rpx;
				height: 38rpx;
				background-color: #ffffff;
				border: 2rpx solid #a3a2a8;
				border-radius: 22px;
				font-size: 20rpx;
				font-weight: 400;
				color: #4e4d52;
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translateX(-50%);
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.stay-unlock-icon {
				width: 24rpx;
				height: 24rpx;
				margin-right: 2rpx;
			}

			.water {
				position: absolute;
				height: 180rpx;
				bottom: 0%;
				left: 100%;
				transform: translateX(-100%);
				animation: waterAnim 5s infinite linear alternate;
			}
		}

		.no-data {
			background-color: #FFFFFF;
			height: 498rpx;
			box-sizing: border-box;
			border-radius: 15px;
			padding-top: 48rpx;
			padding-bottom: 50rpx;
			margin-top: -140rpx;
			position: relative;
			z-index: 2;
		}

		.no-data-logo {
			text-align: center;
			padding-top: 20rpx;

			.img {
				width: 312rpx;
				height: 246rpx;
			}
		}

		.no-data-tips {
			font-size: 28rpx;
			font-weight: 400;
			color: #848484;
			text-align: center;
			margin: 20rpx;
		}

		.no-data-btn {
			width: 208rpx;
			height: 60rpx;
			background-image: linear-gradient(180deg, #fe9534, #fe6333);
			border-radius: 30px;
			margin: 0 auto;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 32rpx;
			font-weight: 400;
			color: #ffffff;
		}

		.silica-gel {
			height: 60rpx;
		}

		.medal-loading {
			flex: 1;
			height: 200rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
