<template>
	<view class="box" @click="openDlzg">
		<view class="flex-row-between">
			<view class="title">{{config.title}}</view>
		</view>
		<view class="content">
			<van-image class="bg-lightup" use-loading-slot lazy-load width="702rpx" height="330rpx" :src="config.image">
				<van-loading slot="loading" type="spinner" size="20" vertical />
			</van-image>
			<view class="btn" v-if="config.subtitle">{{config.subtitle}}</view>
		</view>
	</view>
</template>

<script>
	import { lightTask } from '@/api/modules/task.js';
	import { getImgUrl } from '@/utils/auth.js';
    import { mapGetters } from 'vuex';
	export default {
		data() {
			return {
				config: {
					title: '点亮中国，助力公益',
					image: getImgUrl()+'/task/bg_lightup.png',
					subtitle: '立即前往',
					app_id: 'wx98a1cc9f6a76fdf3',
					path: '/pages/tabBar/home/index'
				}
			}
		},
        computed: {
			...mapGetters(['isAutoLogin'])
		},
		methods: {
			init() {
				lightTask().then(res => {
					if (res.code == 1) {
						let {
							reward_rules,
							name,
							subtitle,
							title,
							image
						} = res.data

						let {
							app_id,
							path
						} = JSON.parse(reward_rules)

						this.config = {
							name,
							subtitle,
							title,
							image,
							app_id,
							path
						}

					}
				})
			},
			// 打开点亮中国小程序
			openDlzg() {
                if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
				this.$wxReportEvent('lightcity');
				let dlzgPage = '/pages/tabBar/home/index';
				this.$openEmbeddedMiniProgram({
					appId: 'wx98a1cc9f6a76fdf3',
					// envVersion:'trial',
					path: dlzgPage
				})
			}
		}
	}
</script>

<style lang="scss">
	.box {
		box-sizing: border-box;
		padding: 0rpx 24rpx 48rpx 24rpx;
	}

	.content {
		position: relative;
		box-sizing: border-box;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding-bottom: 15rpx;
		width: 702rpx;
		height: 330rpx;
		z-index: 1;
		margin-top: 32rpx;
	}

	.bg-lightup {
		width: 702rpx;
		height: 330rpx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
	}

	.btn {
		height: 36rpx;
		line-height: 36rpx;
		font-size: 26rpx;
		font-weight: 600;
		text-align: center;
		color: #c36e1d;
		letter-spacing: 0.58px;
		text-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.25) inset;
	}
</style>
