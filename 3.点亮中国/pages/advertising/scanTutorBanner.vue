<template>
	<view class="ad">
		<view>
			<view class="light-city-popup-box">
				<image class="aperture aperturerRotate" src="https://file.y1b.cn/public/img/dlzg/aperture.png"
					mode="aspectFill"></image>
				<view class="lcpb-top">
					<image class="close_icon" src="/static/images/icon_close.png" mode="aspectFill"  @click="goToHomeLight(false)" ></image>
					<view class="light-city">
						<text>本次扫码成功点亮</text>
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
				</view>
				<view class="city-icon">
					<van-image width="604rpx" height="380rpx" :src="config.image" fit="cover" radius="10px"
						use-loading-slot>
						<van-loading slot="loading" type="spinner" size="20" vertical />
					</van-image>
				</view>
				<view class="hook-list">
					<image class="hook-icon" src="/static/scan/home_scan_hook.png" mode="aspectFill"></image>
					<image class="hook-icon" src="/static/scan/home_scan_hook.png" mode="aspectFill"></image>
				</view>
			</view>
			<image v-if="config.donated_love>0" class="again-light heartBeat" src="/static/home/again_light.png" mode="aspectFill" @click="goToHomeLight(true)" />
			<image v-else class="again-light heartBeat" src="/static/home/donate_energy.png" mode="aspectFill" @click="goLove" />
			<view class="share_btn">
				<image class="share_btn-bg" src="../../static/images/cardShare2.png" mode="aspectFill"></image>
				<button open-type="share" data-name="shareCity">分享好友</button>
			</view>
		</view>
		<view class="banner">
			<ad :unit-id="adunitId"></ad>
		</view>
		<medal-popup ref="medalPopup" @share="medalShare" />
		<!-- 城市分享 -->
		<city-share-card ref="cityShareCard" />
	</view>
</template>

<script>
import {
		mapActions,
		mapGetters
	} from 'vuex'
	import medalPopup from '@/components/popupWindow/medalPopup.vue';
	import cityShareCard from '@/components/popupWindow/cityShareCard/index.vue';
	import {
		geRealtUserMedal,
		lightShareTitle
	} from '@/api/modules/home.js';
	import {
		parseTime
	} from '@/utils/index.js'
	export default {
		components: {
			medalPopup,
			cityShareCard
		},
		data() {
			return {
				config: null,
				adunitId: this.common.adunitId.scanTutorBanner,
				share_title: '',
				shareImgData: ''
			}
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		onLoad(option) {
			this.config = option;
			this.geRealtUserMedal();
			console.log('option', option);
			// 分享的title
			lightShareTitle({
				city: option.city
			}).then(res => {
				this.share_title = res.data.share_title
			});
			let avatar = this.userInfo.avatar_url
			let name = this.userInfo.nick_name
			const shareImgData = {
				avatar,
				name,
				cityImage: option.image,
				date: parseTime(Date.now(), '{y}-{m}-{d}'),
				cityName: option.city
			};
			this.shareImgData = shareImgData;
			this.$refs.cityShareCard.createImg(shareImgData);

		},
		onShareAppMessage(data) {
			// city=%E6%A2%85%E5%B7%9E&image=https%3A%2F%2Ffile.y1b.cn%2Fapi3%2Flitchina%2Fcity%2Fguangdong%2Fmeizhou.png&province=%E5%B9%BF%E4%B8%9C&need_scan_num=1&scan_num=0&donated_love=0&isH5=false
			let share = {
				title: '点亮全中国，一起攒能量',
				path: '/pages/tabBar/home/index',
			}
			if (data.from == 'button') {
				if(data.target.dataset && (data.target.dataset.name === 'shareCity')){
					// 分享城市
					const shareImg = this.$refs.cityShareCard.getImageUrl();
					const shareImgData = JSON.stringify(this.shareImgData);
					share.title = this.share_title;
					share.imageUrl = shareImg;
					share.path = '/pages/tabBar/home/index?type=cityShare&shareImgData=' + shareImgData;
				} else {
					// const shareImg = this.$refs.honorCard.getImageUrl();
					// const shareImgData = JSON.stringify(this.shareImgData);
					// share.title = `快来看看我的能量证书！`;
					// share.path =`/pages/tabBar/home/index?type=shareImg&shareImgData=${shareImgData}`;
					// share.imageUrl = shareImg;
				}
			}
			return share;
		},
		methods: {
			...mapActions({
				updateLightModeList: 'business/updateLightModeList',
			}),
			goToHomeLight(isLight) {
				let type = isLight ? 'continueLight' : 'showLightMode';
				this.updateLightModeList().then(() => {});
				uni.reLaunch({
					url: `/pages/tabBar/home/index?type=${type}`
				});
			},
			goLove() {
				const isH5 = this.config.isH5 && Number(this.config.isH5);
				// 点击弹窗【捐能量】
				wx.reportEvent("click_popupcontributeenergy", {
					authorized_or_not: Number(this.isAuthorization),
					scenario_value : isH5
				});
				// 直接跳详情
				uni.navigateTo({
					url: `/pages/love/loveDetails/index?com_id=0&type=0&isH5=${isH5}`
				});
			},
			geRealtUserMedal() {
				geRealtUserMedal().then(res => {
					if (res.data) {
						const {
							province,
							image,
							create_time,
							love,
							reward_love,
							city_num,
							user_prop,
							id,
							credits
						} = res.data;
						this.showModal({
							medalImage: image,
							isLightUp: true,
							province: province,
							create_time: create_time,
							type: 0,
							love,
							reward_love,
							city_num,
							user_prop,
							id,
							credits
						});
					}
				});
			},
			//显示弹窗
			showModal(data) {
				console.log("scanTutorBanner.vue传递")
				this.$refs.medalPopup.showTime(data);
			},
			/*实时勋章弹窗 分享*/
			medalShare(data) {
				const {
					cityAllNum,
					date,
					medalIcon,
					nextTarge,
					province,
					rate
				} = data;
				this.$router.redirectTo({
					url: `/pages/user/medal/index?type=${this.tabIndex}&cityAllNum=${cityAllNum}&date=${date}&medalIcon=${medalIcon}&nextTarge=${nextTarge}&province=${province}&rate=${rate}`
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		width: 100%;
		height: 100%;
		background: #000;
		.ad {
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
		}
		.banner {
			width: 100%;
		}
	}
	.banner {
		margin-top: 50rpx;
	}
	.light-city-popup-box {
		position: relative;
		padding-top: 152rpx;
	}
	.lcpb-top {
		position: relative;
		left: 50%;
		transform: translateX(-50%);
		width: 604rpx;
		background-color: #ffffff;
		border-radius: 10px;
		box-sizing: border-box;
		padding: 50rpx 24rpx;

		.close_icon {
			position: absolute;
			width: 21rpx;
			height: 21rpx;
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
		padding: 20rpx 30rpx 26rpx;
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
		top: 472rpx;
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
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.again-light {
		width: 348rpx;
		height: 80rpx;
		margin: auto;
		display: block;
		margin-top: 48rpx;
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
