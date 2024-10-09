<template>
	<!-- 关注微信公众号 -->
	<view class="box" @click="openLink">
		<view class="flex-row-between">
			<view class="title">{{taskReward.title}}</view>
			<view class="flex-row-between">
				<view class="subtitle">{{taskReward.subtitle}}</view>
			</view>
		</view>
		<view class="mgt32">
			<van-image
				class="img-focus-wx"
				use-loading-slot
				lazy-load
				width="100%"
				fit="widthFix"
				:src="taskReward.image"
			><van-loading slot="loading" type="spinner" size="20" vertical />
			</van-image>
		</view>
	</view>
</template>
<script>
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
				imgUrl: getImgUrl()
			}
		},
        computed: {
			...mapGetters(['isAutoLogin'])
		},
		methods: {
			openLink() {
                if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
				// 打开公众号文章链接 关注公众号
				this.$wxReportEvent('followwoa');
				this.$go(`/pages/webview/webview?link=${encodeURIComponent(this.taskReward.article_url)}`);
			}
		}
	}
</script>

<style lang="scss">
	.subtitle {
		font-size: 24rpx;
		font-weight: 400;
		color: #999;
		letter-spacing: 0.26px;
	}
	.box {
		box-sizing: border-box;
		padding: 0rpx 24rpx;
		margin-bottom: 64rpx;
	}

	.img-focus-wx {
		width: 100%;
	}

	.icon-category {
		width: 52rpx;
		height: 52rpx;
	}

	.name {
		font-size: 20rpx;
		color: #666666;
		letter-spacing: 0.44px;
		margin-top: 8rpx;
	}

	.category-box {
		background-color: #fffefc;
		border-radius: 24rpx 24rpx 0 0;
		height: 164rpx;
		width: 342rpx;
		box-sizing: border-box;
		padding: 0 20rpx;
	}

	.btn-box {
		background-color: #fffefc;
		border-radius: 0 0 24rpx 24rpx;
		border-top: 1px solid #e9e9e9;
		height: 88rpx;
		width: 342rpx;
		box-sizing: border-box;
	}

	.btn {
		width: 322rpx;
		height: 58rpx;
		line-height: 58rpx;
		opacity: 0.8;
		background: linear-gradient(135deg, #ffdd6b, #f6a80b);
		border-radius: 16rpx;
		box-shadow: 0px 2px 12px 2px rgba(248, 187, 63, 0.30);
		font-size: 26rpx;
		font-weight: 500;
		color: #ffffff;
		letter-spacing: 0.58px;
	}
</style>
