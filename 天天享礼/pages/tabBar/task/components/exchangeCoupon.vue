<template>
	<!-- 换购券即将过期 -->
	<view class="box" @click="openMiniProgram" v-if="info">
		<view class="flex-row-between">
			<view class="title">{{taskReward.title}}</view>
		</view>
		<view class="content">
			<van-image class="img-exchange-coupon" use-loading-slot lazy-load width="702rpx" height="210rpx"
				:src="taskReward.image">
				<van-loading slot="loading" type="spinner" size="20" vertical />
			</van-image>
		</view>
	</view>
</template>

<script>
	import { expireRedeemableCoupon } from '@/api/modules/task.js';
	import { getImgUrl } from '@/utils/auth.js';
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
				info: '',
				imgUrl: getImgUrl()
			}
		},
        computed: {
			...mapGetters(['isAutoLogin'])
		},
		methods: {
			openMiniProgram() {
                if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
				let bfxlPage = '/pages/personal/myCardBag/index';
				this.$openEmbeddedMiniProgram({
					appId: 'wxbb29c5aec6891525',
					// envVersion:'trial',
					path: bfxlPage
				})
			},
			init() {
				expireRedeemableCoupon().then(res => {
					let {
						code,
						data
					} = res;
					if (code == 1) {
						this.info = data
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.box {
		box-sizing: border-box;
		padding: 0 24rpx;
		margin-bottom: 65rpx;
	}

	.content {
		text-align: center;
		margin-top: 40rpx;
	}

	.img-exchange-coupon {
		width: 702rpx;
		height: 210rpx;
	}
</style>
