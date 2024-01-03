<template>
	<view class="light-city-popup">
		<van-popup :show="show" @close="popupClose" custom-style="background-color: transparent;"
			:close-on-click-overlay="false" :z-index="10000">
			<view class="light-city-popup-box">
				<!--fa guang beijing-->
				<image class="aperture aperturerRotate" src="https://file.y1b.cn/public/img/dlzg/aperture.png"
					mode="aspectFill"></image>
				<!--shang ban bufen-->
				<view class="lcpb-top">
					<image class="close_icon" src="/static/images/icon_close.png" mode="aspectFill" @click="popupClose" ></image>
					<!-- <van-icon name="cross" class="close_icon" @click="show = false" /> -->
					<!--title-->
					<!-- 					<view class="lcpb-top-title">
						<image class="lcpb-top-title-icon" src="/static/scan/home_scan_title.png" mode="scaleToFill">
						</image>
					 <view class="lcpb-top-title-text">
							{{lightCityTitle}}
						</view>
					</view> -->
					<!--city-->
					<view class="light-city">
						<!-- <text>{{userInfo.city_num == 1?'点亮':''}}</text><text class="city-name">{{config.city}}</text> -->
						<text v-if="isShowRefresh">成功点亮</text>
						<text v-else>本次扫码成功点亮</text>
						<!-- <text class="city-name">{{config.city}}</text> -->
					</view>
					<view class="light-city_text">
						{{config.city}}
					</view>
					<!--love-->
					<view class="love">
						<view class="love-num">
							能量
							<image class="van-icon" src="/static/images/thunder_num_icon.png" mode="aspectFill"></image>
							+1
						</view>
						<view class="text_arrow_icon" style="color: #FFAD08;" @click="goLove">
							<text>去捐献</text>
							<van-icon name="arrow" size="18"/>
						</view>
					</view>
					<!-- <view class="province-tips">
						捐能量，平台出资助力公益
					</view> -->
					<!--省-->
					<!-- 			  <view class="province-tips" v-if="config.province">
					  	点亮{{config.province}}所有城市即可获得勋章哦！
					  </view> -->
				</view>
				<!--xia ban bufen-->
				<view class="city-icon">
					<van-image width="604rpx" height="380rpx" :src="config.image" fit="cover" radius="10px"
						use-loading-slot>
						<van-loading slot="loading" type="spinner" size="20" vertical />
					</van-image>
				</view>
				<!--lian jie lagou-->
				<view class="hook-list">
					<image class="hook-icon" src="/static/scan/home_scan_hook.png" mode="aspectFill"></image>
					<image class="hook-icon" src="/static/scan/home_scan_hook.png" mode="aspectFill"></image>
				</view>
			</view>
			<!-- tools -->
			<template v-if="isShowRefresh">
				<view class="tools-box" >
					<image class="again-light heartBeat" src="/static/home/again_light.png" mode="aspectFill" @click="closeRefresh">
					</image>
				</view>
				<view class="share_btn" @click="shareData">
					<image class="share_btn-bg" src="../../static/images/cardShare2.png" mode="aspectFill"></image>
					<button open-type="share" data-name="shareCity">分享好友</button>
				</view>
			</template>
			<template v-else-if="!isQuicken&& donated_love>0">
				<!-- 已授权的状态 -->
				<view class="tools-box" >
					<image class="again-light heartBeat" src="/static/home/again_light.png" mode="aspectFill" @click="proceed" >
					</image>
				</view>
				<view class="share_btn" @click="shareData">
					<image class="share_btn-bg" src="../../static/images/cardShare2.png" mode="aspectFill"></image>
					<button open-type="share" data-name="shareCity">分享好友</button>
				</view>
			</template>
			<view class="tools-box" v-else-if="!isQuicken">
				<image class="again-light heartBeat" src="/static/home/donate_energy.png" mode="aspectFill"
					@click="goLove">
				</image>
			</view>
		</van-popup>
		<!-- 城市分享 -->
		<city-share-card ref="cityShareCard" />
	</view>
</template>

<script>
	import {
		parseTime
	} from '@/utils/index.js';
	import {
		mapGetters,
		mapActions
	} from "vuex";
	import cityShareCard from '@/components/popupWindow/cityShareCard/index.vue';
	import {
		lightShareTitle
	} from '@/api/modules/home.js';
	export default {
		data() {
			return {
				show: false,
				config: {
					image: '',
					city: '',
					province: '',
					isH5: false,
				},
				isQuicken: false,
				isShowRefresh: false,
				donated_love: 0,
				share_title: '',
				shareImgData: ''
			}
		},
		components: {
			cityShareCard
		},
		computed: {
			...mapGetters(['lightModePower', 'isAuthorization', 'userInfo'])
		},
		methods: {
			...mapActions({
				getUserInfo: 'user/getUserInfo',
			}),
			showTime(data) {
				// console.log('data', data);
				this.config = data;
				this.show = true;
				this.isQuicken = false;
				this.isShowRefresh = false;
				this.donated_love = data.donated_love || 0;
				// 分享的title
				this.getLightShareTitle(data);
			},
			// 分享需要的data
			shareData() {
				const shareImg = this.$refs.cityShareCard.getImageUrl();
				const shareDataObject = {
					shareImgData: this.shareImgData,
					share_title: this.share_title,
					shareImg
				}
				console.log('shareDataObject---', shareDataObject)
				this.$emit('shareDataObj', shareDataObject)
				return shareDataObject;
			},
			quickenShow(data) {
				this.config = data;
				this.isQuicken = true;
				this.show = true;
				this.isShowRefresh = false;
				setTimeout(() => {
					this.popupClose();
				}, 4000);
				this.getLightShareTitle(data);
			},
			popupShow(data) {
				this.config = data;
				this.show = true;
				this.isShowRefresh = true;
				this.getLightShareTitle(data);
			},
			getLightShareTitle(data) {
				let avatar = this.userInfo.avatar_url;
				let name = this.userInfo.nick_name;
				const shareImgData = {
					avatar,
					name,
					cityImage: data.image,
					date: parseTime(Date.now(), '{y}-{m}-{d}'),
					cityName: data.city
				};
				this.$refs.cityShareCard.createImg(shareImgData);
				this.shareImgData = shareImgData;
				if(data.city) {
					lightShareTitle({
						city: data.city
					}).then(res => {
						this.share_title = res.data.share_title;
						// this.shareData();
					});
				}
			},
			closeRefresh() {
				this.popupClose();
				this.$emit('closeRefresh');
			},
			popupClose() {
				this.$emit('close');
				this.getUserInfo();
				this.show = false;
				const isH5 = this.config.isH5 && Number(this.config.isH5);
				if(isH5) {
					wx.reportEvent("click_closepopup", {
						authorized_or_not: Number(this.isAuthorization),
						scenario_value : isH5
					});
				}
			},
			goLove() {
				const isH5 = this.config.isH5 && Number(this.config.isH5);
				//点击弹窗【捐能量】
				wx.reportEvent("click_popupcontributeenergy", {
					authorized_or_not: Number(this.isAuthorization),
					scenario_value : isH5
				});
				this.show = false;
				//直接跳详情
				uni.navigateTo({
					url: `/pages/love/loveDetails/index?com_id=0&type=0&isH5=${isH5}`
				});
			},
			proceed() {
				if (this.lightModePower['SCAN']) {
					this.show = false
					this.$emit('scan')
					return
				}
				// uni.showModal({
				// 	title: '温馨提示',
				// 	content: '亲，您今天的扫码次数已用完，试试其它方式吧'
				// });
				this.$emit('scanEndDialogShow');
				this.show = false;
			},
			share() {
				this.show = false
				let today = parseTime(Date.now(), '{y}-{m}-{d}')
				uni.navigateTo({
					url: `/pages/user/lightRecord/index?type=0&cityImage=${this.config.image}&cityName=${this.config.city}&lightDate=${today}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.light-city-popup {
		.light-city-popup-box {
			position: relative;
			padding-top: 152rpx;
		}

		.lcpb-top {
			position: relative;
			width: 604rpx;
			background-color: #ffffff;
			border-radius: 10px;
			box-sizing: border-box;
			padding: 50rpx 24rpx;
			.close_icon{
				position: absolute;
				width: 21rpx;
				height: 21rpx;
				top:24rpx;
				right: 24rpx;
				top: 14rpx;
				right: 14rpx;
				color: #ccc;
				padding: 10rpx;
			}
		}

		.lcpb-top-title {
			position: absolute;
			width: 534rpx;
			height: 88rpx;
			left: 50%;
			top: -15.6rpx;
			transform: translateX(-50%);
			font-size: 48rpx;
			font-weight: 700;
			color: #ffffff;
			text-align: center;
			line-height: 75rpx;
		}

		.lcpb-top-title-icon {
			position: absolute;
			width: 534rpx;
			height: 80rpx;
			left: 0;
			top: 0;
		}

		.lcpb-top-title-text {
			position: relative;
			z-index: 1;
		}

		.light-city {
			font-weight: 700;
			color: #000018;
			font-size: 32rpx;
		}
		.light-city_text {
			height: 66rpx;
			font-size: 48rpx;
			font-weight: 700;
			color: #017bff;
			margin: 16rpx 0 32rpx;
		}

		.aperture {
			position: absolute;
			top: -50rpx;
			left: -50rpx;
			width: 700rpx;
			height: 700rpx;
		}

		.city-name {
			color: #017BFF;
			margin-left: 20rpx;
		}

		.love {
			display: flex;
			padding: 20rpx 25rpx 20rpx;
			justify-content: space-between;
			align-items: center;
			width: 556rpx;
			height: 84rpx;
			background: #f4f6f8;
			border-radius: 16rpx;
			box-sizing: border-box;
		}

		.love-num {
			font-size: 36rpx;
			font-weight: 400;
			color: #37373a;
			display: flex;
			align-items: center;

			.van-icon {
				margin-left: 8rpx;
				width: 32rpx;
				height: 52rpx;
			}
		}
		.text_arrow_icon {
			line-height: 44rpx;
			font-size: 32rpx;
			font-weight: 700;
			display: flex;
			align-items: center;
			.close_icon {
				margin-left: 6rpx;
				line-height: 20rpx;
			}
		}

		.love-btn {
			width: 144rpx;
			height: 56rpx;
			border: 2rpx solid #ff7f48;
			border-radius: 15px;
			font-size: 28rpx;
			font-weight: 400;
			text-align: center;
			color: #ff7f48;
			line-height: 56rpx;
		}

		.province-tips {
			font-size: 28rpx;
			font-weight: 400;
			color: #8b8b8b;
			padding-left: 30rpx;
			padding-top: 24rpx;
			border-top: 1rpx solid rgba(255, 127, 72, .15);
		}

		.hook-list {
			position: absolute;
			top: 470rpx;
			left: 0;
			right: 0;
			padding: 0 86rpx;
			display: flex;
			justify-content: space-between;
			font-size: 0;
		}

		.hook-icon {
			width: 14rpx;
			height: 66rpx;
		}

		.city-icon {
			margin-top: 20rpx;
			font-size: 0;
		}

		.tools-box {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 40rpx;
		}

		.again-light {
			width: 348rpx;
			height: 80rpx;
		}

		.tools-btn {
			width: 280rpx;
			height: 80rpx;
			border-radius: 22px;
			text-align: center;
			line-height: 80rpx;
			font-size: 32rpx;
			font-weight: 700;
			color: #ffffff;
		}

		.tools-btn-donate {
			flex: 1;
			border-radius: 22px;
			text-align: center;
			line-height: 80rpx;
			font-size: 32rpx;
			font-weight: 700;
			color: #ffffff;
		}

		.first-child {
			background-color: #3891f1;
			border: 4rpx solid #a1ceff;
		}

		.last-child {
			background-color: #ff7f48;
			border: 4rpx solid #ffd0bc;
		}

		.close {
			width: 56rpx;
			height: 56rpx;
			display: block;
			margin: 50rpx auto 0;
		}

	}

	.aperturerRotate {
		animation: aperturerRotate 2s linear infinite;
		animation-delay: 0.5s;
	}


	@keyframes aperturerRotate {
		form {
			transform: rotate(0);
		}

		to {
			transform: rotate(180deg);
		}
	}
	.share_btn{
		position: relative;
		margin: 32rpx auto 0;
		z-index: 0;
		width: 140rpx;
		height: 40rpx;
		.share_btn-bg {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			z-index: -1;
		}
		>button {
			opacity: 0;
		}
	}
</style>
