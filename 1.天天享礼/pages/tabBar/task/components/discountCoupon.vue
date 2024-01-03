<template>
<!-- 优惠券即将过期 -->
<view class="box" v-if="isShow" @click="myCoupon">
    <view class="flex-row-between">
        <view class="title">{{taskReward.title}}</view>
    </view>
    <view class="content flex-row-center">
        <van-image v-if="couponInfo.image" class="bg-discount-coupon" use-loading-slot lazy-load width="702rpx"
            height="318rpx" :src="couponInfo.image">
            <van-loading slot="loading" type="spinner" size="20" vertical />
        </van-image>
    </view>
</view>
</template>

<script>
	import { expireCoupon } from '@/api/modules/task.js';
    import { mapGetters } from 'vuex';
	export default {
		props: {
			taskReward: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				couponInfo: {
					image: ''
				},
				isShow: false
			}
		},
        computed: {
			...mapGetters(['isAutoLogin'])
		},
		methods: {
			init() {
				expireCoupon().then(res => {
					let {
						code,
						data
					} = res;
					if (code == 1 && data) {
						this.couponInfo = data
						this.isShow = true
						return
					}
					this.isShow = false
				})
			},
			myCoupon() {
                if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
				this.$wxReportEvent('couponexpired');
				this.$go('/pages/userModule/myCoupon/index');
			}
		}
	}
</script>
<style lang="scss">
	.box {
		box-sizing: border-box;
		padding: 0 24rpx 64rpx;
	}

	.content {
		margin-top: 32rpx;
		position: relative;
		width: 702rpx;
		height: 296rpx;
		box-sizing: border-box;
	}

	.bg-discount-coupon {
		width: 702rpx;
		height: 296rpx;
		position: absolute;
		left: 0;
		right: 0;
		margin: 0 auto;
		z-index: -1;
	}

	.img-discount-coupon {
		width: 642rpx;
		height: 242rpx;
		z-index: 1;
		margin-bottom: 20rpx;
	}
</style>
