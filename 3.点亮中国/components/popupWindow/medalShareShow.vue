<template>
	<view v-show="show">
		<view class="medal-popup">
			<!-- 頂部光束-你還相信光嗎？ -->
			<image class="medal-popup-topbg" src="/static/images/medal_popup_topbg.png" mode="aspectFill"></image>
			<!-- 標題 -->
			<view class="medal-popup-title">
				解锁勋章
			</view>
			<view class="mp-box">
				<!-- 光圈 -->
				<image class="aperture aperturerRotate" src="https://file.y1b.cn/public/img/dlzg/aperture.png" mode="aspectFill"></image>
				<!-- 星星 -->
				<image class="stars medalBounce" src="https://file.y1b.cn/public/img/dlzg/stars.png" mode="aspectFill"></image>
				<!-- 勛章 -->
				<image class="medal-icon medalBounce" :src="config.medalImage || config.medalIcon" mode="aspectFill"></image>
			</view>
			<!-- 首页的分享 -->
			<view class="avatar_head">
				<image class="avatar_img" :src="config.avatar"  mode="aspectFill"></image>
				<text class="avatar_name">{{config.name}}</text>
				{{config.date}} 获得
			</view>
			<view class="share_con_box">
				<view>Ta已点亮【{{config.province}}】全部{{config.cityAllNum}}座城市</view>
				<view>超越了<text>{{config.next_num || config.rate}}</text>的{{config.province}}用户</view>
			</view>
			<view class="share-btn" @click="popupClose">
				我也要参加
			</view>
			<!-- 关闭按钮 -->
			<image class="close" src="/static/images/close.png" mode="aspectFill" @click="popupClose"></image>
		</view>
	</view>
</template>

<script>
	import {getNextUserMedal,getNextTeamMedal} from '@/api/modules/home.js';
	import {getCurrMedal} from '@/utils/auth.js';
	import {mapGetters} from 'vuex';
	//分享数据
	let shareData;
	export default {
		data(){
			return {
				show:false,
				config:{
					medalImage:'',
					isLightUp:true,
					province:'',
					type:0,
					love:0,
					reward_love:0,
					city_num:0,
					user_prop:0,
					next_num: 0
				},
				type: '',
			}
		},
		computed:{
			...mapGetters(['soonMedalId', 'isAuthorization'])
		},
		methods:{
			showTime(data, type){
				shareData = null
				this.config = data
				this.show = true;
				this.type = type || '';
			},
			popupClose(){
				this.show = false;
				this.$emit('close')
			},
			unlockNow() {
				wx.reportEvent("click_punlockmedal", {
					authorized_or_not: Number(this.isAuthorization)
				});

				let soonMedalId = this.soonMedalId||this.config.id
				uni.navigateTo({
					url:'/pages/user/currentlyLit/index?medal_id='+ soonMedalId
				})
				this.show = false
			},
		}
	}
</script>
<style lang="scss" scoped>
	.medal-popup{
		position: fixed;
		z-index: 10000;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #000;
		.medal-popup-topbg{
			width: 100%;
			height: 524rpx;
			opacity: 0.52;
			position: absolute;
			top: 0;
			left: 0;
		}
		.medal-popup-title{
			position: relative;
			z-index: 1;
			padding-top: 222rpx;
			text-align: center;
			font-size: 48rpx;
			font-weight: 400;
			color: #feefbe;
		}
		.mp-box{
			position: relative;
			height: 480rpx;
		}
		.aperture{
			position: absolute;
			top: 0;
			width: 480rpx;
			height: 480rpx;
			left: 50%;
			margin-left: -240rpx;
		}
		.stars{
			position: absolute;
			width: 372rpx;
			height: 272rpx;
			left: 50%;
			top: 50%;
			margin-left: -186rpx;
			margin-top: -186rpx;
		}
		.medal-icon{
			position: absolute;
			width: 291rpx;
			height: 291rpx;
			top: 50%;
			left: 50%;
			margin-left: -145.5rpx;
			margin-top: -145.5rpx;
			border: 5rpx solid #FEE27E;
			border-radius: 50%;
			box-sizing: border-box;
		}

		.mp-lighting-province{
			font-size: 28rpx;
			font-weight: 400;
			text-align: center;
			color: #ffffff;
			margin-top: -40rpx;
			.province{
				color: #F9CA23;
			}
		}
		.mp-reward-details{
			font-size: 28rpx;
			font-weight: 400;
			text-align: center;
			color: #ffffff;
			margin-top: 60rpx;
		}
		.mp-rd-list{
			padding: 40rpx 50rpx 58rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.mprd-item{
			text-align: center;
		}
		.mprd-item-icon{
			width: 56rpx;
			height: 56rpx;
		}
		.mprd-item-icon02{
			width: 44rpx;
			height: 56rpx;
		}
		.mprd-item-info{
			font-size: 24rpx;
			font-weight: 700;
			color: #ffffff;
			display: flex;
            align-items: center;
			.value{
				font-size: 36rpx;
				font-weight: 700;
				color: #ffef08;
				margin-left: 6rpx;
			}
		}
		.have-medal-rate{
			font-size: 24rpx;
			font-weight: 500;
			text-align: center;
			color: #faf6dd;
		}
		.share-btn{
			width: 340rpx;
			height: 80rpx;
			border: 4rpx solid #fedbce;
			border-radius: 44px;
			background-color: #FB9D18;
			font-size: 32rpx;
			font-weight: 700;
			text-align: center;
			color: #ffffff;
			line-height: 80rpx;
			margin: 10rpx auto 50rpx;
		}
		.close{
			width: 56rpx;
			height: 56rpx;
			display: block;
			margin: 0 auto;
		}
		.aperturerRotate{
			animation: aperturerRotate 2s linear infinite;
			animation-delay: 0.5s;
		}
		.medalBounce{
			animation: medalBounce 0.5s ease-out both;
		}
		@keyframes medalBounce{
			0%{
				transform: scale(0.2);
			}
			50%{
				transform: scale(1.6);
			}
			100%{
				transform: scale(1);
			}
		}
		@keyframes aperturerRotate{
			form{
				transform:rotate(0);
			}
			to{
				transform:rotate(180deg);
			}
		}
	}
	.un-medal-popup{
		position: fixed;
		z-index: 10001;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0,0,0,.8);
		text-align: center;
		color: #fff;
		.un-medal-box{
			width: 256rpx;
			height: 256rpx;
			padding-top: 436rpx;
			margin: 0 auto;
			position: relative;
		}
		.un-medal-icon{
			width: 256rpx;
			height: 256rpx;
			border-radius: 50%;
			filter: contrast(0.5);
		}
		.stay-unlock{
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
		.stay-unlock-icon{
			width: 24rpx;
			height: 24rpx;
			margin-right: 2rpx;
		}
		.un-medal-province{
			font-size: 28rpx;
			font-weight: 400;
			text-align: center;
			color: #ffffff;
			margin-top: 30rpx;
			margin-bottom: 30rpx;
		}
		.un-medal-tips{
			font-size: 32rpx;
			font-weight: 400;
			text-align: center;
			color: #ffffff;
			margin-bottom: 50rpx;
			margin-top: 30rpx;
		}
		.un-medal-btn{
			width: 340rpx;
			height: 80rpx;
			border: 4rpx solid #fedbce;
			border-radius: 44px;
			background-color: #FB9D18;
			font-size: 32rpx;
			font-weight: 700;
			text-align: center;
			color: #ffffff;
			line-height: 80rpx;
			margin: 10rpx auto 50rpx;
		}
		.close{
			width: 56rpx;
			height: 56rpx;
			display: block;
			margin: 0 auto;
		}
}
	.avatar_head {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		color: #fff;
		.avatar_img {
			width: 48rpx;
			height: 48rpx;
			border: 2rpx solid #ffe0b9;
			border-radius: 50%;
		}
		.avatar_name {
			margin: 0 16rpx;
		}
	}
	.share_con_box {
		width: 510rpx;
		border-radius: 20rpx;
		font-size: 24rpx;
		font-weight: 500;
		text-align: center;
		color: #FAF6DD;
		padding: 15rpx 0;
		line-height: 1.5;
		margin: 34rpx auto 162rpx;
		background: #525252;
		text{
			color: #F9CA23;
		}
	}
	.share-btn {
		width: 436rpx;
	}
</style>