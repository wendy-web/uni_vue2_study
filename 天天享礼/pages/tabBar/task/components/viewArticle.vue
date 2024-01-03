<template>
	<!-- 看文拿奖 -->
	<view class="box" @click="openArticle" v-if="articleInfo">
		<view class="flex-row-between">
			<view class="title">{{taskReward.title}}</view>
			<view class="flex-row-between">
				<image class="icon-beans" :src="imgUrl+'/task/icon_beans.png'" mode="aspectFit" lazy-load></image>
				<view class="subtitle">{{taskReward.subtitle}}</view>
			</view>
		</view>
		<view class="content ">
			<!-- 背景图 -->
			<van-image
				class="bg-view-article"
				use-loading-slot
				lazy-load
				width="702rpx"
				fit="widthFix"
				:src="articleInfo.image">
				<van-loading slot="loading" type="spinner" size="20" vertical />
			</van-image>
			<!-- <view class="name">{{articleInfo.title}}</view>
			<view class="sub-name">{{articleInfo.digest}}</view>
			<view class="btn">
				<text>阅读全文</text>
				<van-icon name="arrow" color="#B28C23" custom-class="icon-arrow" />
			</view> -->
		</view>
	</view>
</template>

<script>
	import { articleList } from '@/api/modules/task.js';
	import {getImgUrl} from '@/utils/auth.js';
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
				articleInfo: null,
				imgUrl:getImgUrl()
			}
		},
		mounted() {
			// this.init();
		},
        computed: {
			...mapGetters(['isAutoLogin'])
		},
		methods: {
			openArticle() {
                if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
				this.$wxReportEvent('readingpassage');
				let articleInfo = this.articleInfo
				let item = articleInfo;
				let link = encodeURIComponent(item.link);
				uni.navigateTo({
					url: `/pages/webview/webview?title=${item.title}&link=${link}&isButton=true`
				});

			},
			init() {
				articleList().then(res => {
					let {
						code,
						data
					} = res;
					if (code == 1) {
						this.articleInfo = data;
						return
					}
					this.articleInfo = null
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.box {
		margin: 0rpx 24rpx 64rpx 24rpx;
		box-sizing: border-box;
	}
	.content {
		box-sizing: border-box;
		margin-top: 32rpx;
		width: 702rpx;
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.name {
		font-size: 28rpx;
		font-weight: 500;
		color: #333333;
		line-height: 40rpx;
		letter-spacing: 0.62px;
		margin-top: 15rpx;
	}

	.sub-name {
		font-size: 24rpx;
		font-weight: 400;
		color: #999999;
		line-height: 34rpx;
		letter-spacing: 0.52px;
		margin-top: 20rpx;
	}

	.btn {
		margin-top: 44rpx;
		font-size: 26rpx;
		font-weight: 500;
		color: #b28c23;
		line-height: 36rpx;
		letter-spacing: 0.58px;
	}

	.icon-arrow {
		margin-left: 2rpx;
	}
</style>
