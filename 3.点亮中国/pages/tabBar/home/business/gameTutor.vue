<template>
	<view class="game-tutor">
		<van-popup :show="show" @close="popupClose" custom-style="background-color: transparent;"
			:close-on-click-overlay="false" :z-index="10000">
			<view class="game-tutor-box">
				<!-- 背景 -->
				<van-image class="head-bg-icon" width="600rpx" height="838rpx"
					src="https://file.y1b.cn/public/img/dlzg//game_pop.png" fit="cover" use-loading-slot>
					<van-loading slot="loading" type="spinner" size="20" vertical />
				</van-image>
				<view class="game-info">
					<!-- <view class="game-tips-01">答对3题，点亮1座城市</view>
			             <view class="game-tips-02">每天只有<text class="red">首次通关</text>可点亮哦</view> -->
					<view class="game-tips-01">
						通关即可点亮一座城市
					</view>
				</view>
				<view class="game-wdtt">
					<van-image class="head-bg-icon" width="452rpx" height="136rpx"
						src="https://file.y1b.cn/public/img/dlzg//game_wdtt.png" fit="cover" use-loading-slot>
						<van-loading slot="loading" type="spinner" size="20" vertical />
					</van-image>
				</view>
				<!-- 创建团队 -->
				<view class="create-team-btn">
					<van-button round type="info" size="normal" block @click="goGame">我要玩</van-button>
				</view>
			</view>
			<image class="close" src="/static/images/close.png" mode="aspectFill" @click="show = false"></image>
		</van-popup>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				isAuthorization: false
			}
		},
		methods: {
			popupShow(isAuthorization) {
				this.show = true
				this.isAuthorization = isAuthorization
			},
			popupClose() {
				this.show = false
			},
			goGame() {
				/*闯关点亮【我要玩】 */
				wx.reportEvent("go_play", {
					authorized_or_not: Number(this.isAuthorization)
				})
				this.show = false
				uni.navigateTo({
					url: '/pages/game/askAnswer/index'
				})
			}
		}
	}
</script>

<style lang="scss">
	.game-tutor {

		.game-tutor-box {
			position: relative;
			width: 600rpx;
			height: 838rpx;
			font-size: 0;
		}

		.game-info {
			position: absolute;
			text-align: center;
			top: 240rpx;
			left: 0;
			right: 0;
			z-index: 1;
		}

		.game-tips-01 {
			font-size: 36rpx;
			font-weight: 700;
			color: #E3001B;
		}

		.game-tips-02 {
			font-size: 36rpx;
			font-weight: 700;
			color: #111d6c;
			margin-top: 16rpx;

			.red {
				color: #e3001b;
			}
		}

		.game-wdtt {
			position: absolute;
			top: 400rpx;
			left: 50%;
			transform: translateX(-50%);
		}

		.close {
			width: 56rpx;
			height: 56rpx;
			display: block;
			margin: 60rpx auto 0;
		}

		.create-team-btn {
			position: absolute;
			bottom: 50rpx;
			width: 296rpx;
			left: 50%;
			transform: translateX(-50%);
		}


	}
</style>
