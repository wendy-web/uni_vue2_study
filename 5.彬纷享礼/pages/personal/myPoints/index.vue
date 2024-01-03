<template>
	<view class="my-points">
		<!-- 顶部信息 -->
		<view class="my-points-header">
			<!-- 左边信息 -->
			<view class="mph-left">
				<image class="my-points-icon" src="../static/my_points_icon.png" mode="aspectFill"></image>
				<view class="mph-l-label">
					当前积分
				</view>
				<view class="point-num">{{userInfo.credits}}</view>
			</view>
			<!-- 右边信息 -->
			<view class="mph-right" @click="goShopMall">
				<text>赚积分,兑好礼</text>
				<image class="right-arrow" src="../../../static/images/left_arrow.png" mode="aspectFill"></image>
			</view>
			<!-- 背景 -->
			<image class="my-points-bg" src="../static/my_points_bg.png" mode="aspectFill"></image>
			<!-- 积分规则 -->
			<view class="jf-details" @click="goAgreementLook">
				<text class="jf-details-text">积分规则</text>
				<image class="jf-details-icon" src="../static/tips_red.png"></image>
			</view>
		</view>
		<!-- header -->
		<view class="mp-detailed">
			积分明细
		</view>
		<!-- 第一步: 给mescroll-body的组件添加: ref="mescrollItem" (固定的,不可改,与mescroll-comp.js对应)-->
		<mescroll-item ref="mescrollItem"></mescroll-item>
	</view>
</template>

<script>
	import MescrollItem from './mescroll-item.vue'; // 一个mescroll-body写在子组件的情况
	// 第二步: 引入mescroll-comp.js
	import MescrollCompMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mixins/mescroll-comp.js';
	import {
		mapGetters,
		mapActions
	} from 'vuex';
	import {
		baseUrl
	} from '@/api/http/xhHttp.js';
	export default {
		mixins: [MescrollCompMixin],
		components: {
			MescrollItem
		},
		onLoad() {
			this.getUserInfo(); //更新用户信息获取积分
		},
		computed: {
			...mapGetters(['userInfo', 'token'])
		},
		methods: {
			...mapActions({
				getUserInfo: 'login/getUserInfo'
			}),
			goShopMall() {
				// this.$go({
				// 	url:'/pages/webview/webview?link=' + encodeURIComponent(baseUrl+'/api/txjifen/txlogin?way=2&token='+this.token+'&random='+Date.now())
				// });
				let {
					id,
					nick_name,
					avatar_url
				} = this.userInfo

				this.$navigateToMiniProgram({
					appId: 'wx6deb62d876c03d85',
					path: '/pages/tabBar/shopMall/index?type=bfxl&data=' + encodeURIComponent(JSON.stringify({
						id,
						nick_name,
						avatar_url
					}))
				})
			},
			goAgreementLook() {
				this.$go({
					url: '/pages/webview/webview?link=' + encodeURIComponent(
						'https://txc.y1b.cn/index/index/creditsrule.html')
				});
			}
		}
	};
</script>

<style lang="scss">
	.my-points {
		.my-points-header {
			height: 344rpx;
			width: 100%;
			position: fixed;
			display: flex;
			padding: 80rpx 60rpx 0;
			box-sizing: border-box;
			top: 0;
			left: 0;
			z-index: 1;
			background-color: #FFFFFF;

		}

		.my-points-bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 344rpx;
			z-index: -1;
		}

		.mph-left {
			flex: 1;
		}

		.my-points-icon {
			width: 130rpx;
			height: 130rpx;
			float: left;
			margin-right: 22rpx;
		}

		.right-arrow {
			width: 21rpx;
			height: 37rpx;
		}

		.mph-l-label {
			color: #FFFFFF;
			font-size: 32rpx;
			margin-top: 12rpx;
		}

		.point-num {
			color: #FFFFFF;
			font-size: 52rpx;
			font-weight: bold;
		}

		.mph-right {
			color: #FFFFFF;
			font-size: 32rpx;
			margin-top: 35rpx;
			opacity: 0.95;
		}

		.right-arrow {
			transform: rotate(-180deg) translateY(-8rpx);
			margin-left: 19rpx;
		}

		.mp-detailed {
			font-size: 36rpx;
			height: 128rpx;
			color: #333;
			padding-left: 40rpx;
			position: fixed;
			top: 344rpx;
			left: 0;
			width: 100%;
			font-weight: 700;
			line-height: 128rpx;
			background-color: #FFFFFF;
			z-index: 1;
		}

		.jf-details {
			width: 168rpx;
			height: 50rpx;
			padding-left: 24rpx;
			padding-right: 10rpx;
			box-sizing: border-box;
			background-color: #FFE4E1;
			position: absolute;
			top: 30rpx;
			right: 0;
			border-radius: 15px 0 0 15px;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.jf-details-text {
			font-size: 24rpx;
			color: #FE2821;
		}

		.jf-details-icon {
			width: 28rpx;
			height: 28rpx;
			margin-left: 10rpx;
		}

	}
</style>