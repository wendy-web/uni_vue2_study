<template>
	<view class="game-tutor">
		<van-popup :show="show" @close="popupClose" custom-style="background-color: transparent; overflow:visible;"
			:close-on-click-overlay="false" :z-index="10000">
			<view class="game-tutor-box">
				<image class="close" src="/static/images/close.png" mode="aspectFill" @click="popupClose"></image>
				<!-- 背景 -->
				<van-image class="head-bg-icon" width="600rpx" height="838rpx"
					src="https://file.y1b.cn/public/img/dlzg//game_pop.png" fit="cover" use-loading-slot>
					<van-loading slot="loading" type="spinner" size="20" vertical />
				</van-image>
				<view class="game_cont">
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
					<view class="tools-box">
						<view class="again-light" @click="goGame">我要玩</view>
					</view>
				</view>
			</view>
		</van-popup>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				isAuthorization: false,
				scenario_value: 0
			}
		},
		methods: {
			popupShow(isAuthorization, scenario_value = 0) {
				this.show = true
				this.isAuthorization = isAuthorization;
				this.scenario_value = scenario_value
			},
			popupClose() {
				this.show = false;
				wx.reportEvent("click_closegppopup", {
					authorized_or_not: Number(this.isAuthorization),
					scenario_value: this.scenario_value
				});
			},
			goGame() {
				/*闯关点亮【我要玩】 */
				wx.reportEvent("go_play", {
					authorized_or_not: Number(this.isAuthorization),
					scenario_value: this.scenario_value
				});
				this.show = false;
				uni.navigateTo({
					url: `/pages/game/askAnswer/index?scenario_value=${this.scenario_value}`
				});
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
			.close {
				position: absolute;
				width: 56rpx;
				height: 56rpx;
				top: -88rpx;
				right: 0;
			}
		}
		.game_cont {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			.game-info {
				text-align: center;
				margin-top: 240rpx;
			}
			.game-wdtt {
				margin: 108rpx auto 172rpx;
				display: flex;
				justify-content: center;
			}
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
		.tools-box {
			display: flex;
			justify-content: center;
			align-items: center;
			.again-light {
				width: 296rpx;
				height: 80rpx;
				line-height: 80rpx;
				background: #1684fc;
				border-radius: 40rpx;
				font-size: 36rpx;
				font-weight: 700;
				text-align: center;
				color: #ffffff;
			}
		}
	}
</style>
