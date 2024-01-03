<template>
	<view class="box" @click="checkAuth">
		<view class="onePx-box"></view>
		<view class="head">
			<view class="title">{{taskReward.title}}</view>
			<view class="flex-row-between">
				<image class="icon-beans" :src="imgUrl+'/task/icon_beans.png'" mode="aspectFit" lazy-load></image>
				<view class="subtitle">{{taskReward.subtitle}}</view>
			</view>
		</view>
		<view class="body">
			<van-image class="bg-pullringQr" use-loading-slot lazy-load width="702rpx" height="238rpx"
				:src="imgUrl+'/task/bg_pullringQr.png'">
				<van-loading slot="loading" type="spinner" size="20" vertical />
			</van-image>
			<view class="content">
				<view class="tips">剩余<text class="num">{{remainTimes}}</text>次扫码</view>
				<view class="step-box">
					<view class="step-item" :class="[times>=item ?'step-item-active' :'']"
						v-for="(item,index) in [1,2,3]" :key="index"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { scanTask } from '@/api/modules/task.js'
    import { mapGetters } from 'vuex';
	import { getImgUrl } from '@/utils/auth.js'
	export default {
		props: {
			taskReward: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				times: 0, //已扫次数
				num: 0, //获得奖励的扫码次数
				credits: 0, //奖励的积分
				imgUrl: getImgUrl()
			}
		},
		computed: {
			...mapGetters(['isAutoLogin']),
			//剩余扫码次数
			remainTimes() {
				let times = Number(this.times);
				let result = 3 - times;
				if (result < 0) return 0;
				return result;
			}
		},
		methods: {
			init() {
				scanTask({
					type: 0
				}).then(res => {
					let {
						code,
						data,
						msg
					} = res;
					if (code == 1) {
						this.times = data.times;
						this.num = Number(data.num);
						this.credits = data.credits;
						/*达到领取扫码奖励的条件*/

						if (data.status == 0 && this.times >= this.num) {
							if (this.times > 0) {
								this.getAward()
							}
						}
						return
					}
					uni.showToast({
						title: msg,
						icon: 'none'
					})
				})
			},
			getAward() {
				scanTask({
					type: 1
				}).then(res => {
					if (res.code == 1) {
						this.$emit('showAwardModel', 'SCAN_PULL', {
							reward: res.data.credits
						})
					}
				})
			},
			checkAuth() {
                if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
				this.$wxReportEvent('scanpullrcode');
				let bfxlPage = '/pages/tabBar/personal/index';
				this.$openEmbeddedMiniProgram({
					appId: 'wxbb29c5aec6891525',
					envVersion:'trial',
					path: bfxlPage
				});
			}
		}
	}
</script>

<style lang="scss">
	.box {
		position: relative;
		box-sizing: border-box;
		padding: 0 24rpx 0;
		margin-bottom: 65rpx;
	}

	.head {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.body {
		position: relative;
		box-sizing: border-box;
		height: 238rpx;
		margin-top: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
	}

	.bg-pullringQr {
		width: 702rpx;
		height: 238rpx;
		position: absolute;
		left: 0;
		right: 0;
		margin: 0 auto;
		z-index: 0;
	}

	.content {
		margin-bottom: 26rpx;
		z-index: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		height: 58rpx;
	}

	.tips {
		width: 152rpx;
		height: 32rpx;
		font-size: 22rpx;
		text-align: center;
		color: #fae9e3;
		letter-spacing: 0.48px;
		box-sizing: border-box;
	}

	.num {
		margin: 0 5px;
	}

	.step-box {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 246rpx;
		box-sizing: border-box;
	}

	.step-item {
		display: inline-block;
		position: relative;
		z-index: 0;
		width: 56rpx;
		height: 12rpx;
		// width: 110rpx;
		// height: 24rpx;
	}

	.step-item:nth-child(2) {
		margin: 0 10rpx;
	}

	.step-item::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: #f3f3f3;
		box-shadow: inset 1rpx 0px 3rpx 2rpx rgba(184, 184, 184, 0.58);
		transform: skewX(-5deg);
		z-index: -1;
	}

	.step-item-active::before {
		background-color: #c10429;
	}
</style>
