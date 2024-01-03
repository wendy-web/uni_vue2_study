<template>
	<view class="box" v-if="bfxl.credits>0">
		<view class="flex-row-between head" @click="showPop">
			<view class="title">{{taskReward.title}}</view>
			<view class="flex-row-between">
				<view class="subtitle">{{taskReward.subtitle}}</view>

			</view>
		</view>
		<van-image @click="showPop" custom-class="img-points-upgrade" use-loading-slot lazy-load width="562rpx"
			height="338rpx" :src="imgUrl+'/task/img_points_upgrade.png'">
			<van-loading slot="loading" type="spinner" size="20" vertical />
		</van-image>
		<button class="btn flex-row-center" @click="showPop">升级享福利</button>
		<van-popup :show="show" @close="onClose" round>
			<view class="pop-box flex-col-between">
				<view>
					<view>您目前尚有{{bfxl.credits}}积分，</view>
					<view>升级为牛金豆将享受更多福利</view>
				</view>
				<view class="btn-box flex-row-between">
					<view class="btn-cancel" @click="onClose">放弃福利</view>
					<view class="btn-confirm" @click="confirm">立即升级</view>
				</view>
			</view>
		</van-popup>

	</view>
</template>

<script>
	import {
		getCredits,
		decCredits
	} from '@/api/modules/task.js';
	import empower from '@/utils/empower.js'
	import {getImgUrl} from '@/utils/auth.js'
	import {
		mapActions,
	} from 'vuex';
	export default {
		props: {
			taskReward: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				show: false, //显示升级弹窗
				bfxl: null,
				imgUrl:getImgUrl()
			}
		},
		// beforeMount() {
		// 	this.getMyCredit()
		// },
		methods: {
			...mapActions({
				getUserTotal: 'user/getUserTotal',
			}),
			onClose() {
				this.show = false;
			},
			showPop() {
				this.show = true;
			},
			init() {
				this.getMyCredit()
			},
			confirm() {
				let param = {
					source: 'bfxl',
					num: this.bfxl.credits
				}
				decCredits(param).then(res => {
					let {
						code,
						data,
						msg
					} = res;
					this.show = false;
					if (code == 1) {
						this.$emit("updateSuccess")
						this.getMyCredit()
						return
					} else {
						uni.showToast({
							icon: "none",
							duration: 2000,
							title: msg
						})
					}
				})
			},
			getMyCredit() {
				getCredits().then(res => {
					let {
						code,
						data
					} = res;
					if (code == 1) {
						let {
							bfxl
						} = data;
						this.bfxl = bfxl;
						if (bfxl.credits > 0) {
							this.autoUpdate(bfxl.credits)
						}
					}
				})
			},
			autoUpdate(num) {
				let param = {
					source: 'bfxl',
					num
				}
				decCredits(param).then(res => {
					let {
						code,
						data,
						msg
					} = res;
					this.show = false;
					if (code == 1) {
						this.getMyCredit()
						this.getUserTotal();
						return
					} else {
						uni.showToast({
							icon: "none",
							duration: 2000,
							title: msg
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.box {
		text-align: center;
		box-sizing: border-box;
		padding: 10rpx 24rpx;
		margin-bottom: 30rpx;

		.head {
			height: 90rpx;
		}
	}

	.img-points-upgrade {
		width: 562rpx;
		height: 338rpx;
		margin-top: 40rpx;
	}

	.btn {
		width: 420rpx;
		height: 76rpx;
		line-height: 76rpx;
		box-sizing: border-box;
		background: #333333;
		border: 2rpx solid #ffffff;
		border-radius: 40rpx;
		box-shadow: 0px 4px 10px 0px rgba(92, 1, 5, 0.18), 2px 2px 8px 0px rgba(255, 255, 255, 0.20) inset;
		font-size: 32rpx;
		font-weight: 500;
		text-align: center;
		color: #ffffff;
		letter-spacing: 0.7px;
		text-shadow: 0px 4px 10px 0px rgba(92, 1, 5, 0.18);
		margin-top: 18rpx;
	}

	.pop-box {
		width: 530rpx;
		height: 328rpx;
		background: #ffffff;
		border-radius: 24rpx;
		font-size: 28rpx;
		font-weight: 400;
		text-align: center;
		color: #333333;
		line-height: 40rpx;
		box-sizing: border-box;
		padding: 40rpx;
	}

	.btn-box {
		width: 100%;
	}

	.btn-cancel {
		width: 192rpx;
		height: 88rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2rpx solid #f14530;
		border-radius: 16rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #f14530;
	}

	.btn-confirm {
		width: 192rpx;
		height: 88rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #f96a02, #f04037);
		border-radius: 16rpx;
		box-shadow: 0px 4rpx 16rpx 2rpx rgba(238, 81, 73, 0.45);
		font-size: 28rpx;
		font-weight: 500;
		color: #ffffff;
	}
</style>
