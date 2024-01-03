<template>
<view class="box">
	<web-view v-if="link&&!fromArticle" :webview-styles="webviewStyles" :src="link"></web-view>
	<image v-if="fromArticle" mode="widthFix" lazy-load="true" class="img" :src="link"></image>
</view>
</template>

<script>
let _isReward = false;
import { articleAward } from '@/api/modules/task.js'
export default {
	data() {
		return {
			link: '',
			webviewStyles: {
				progress: {
					color: '#FF3333'
				}
			},
			fromArticle: false, //来自看文拿奖
			isButton: false
		};
	},
	onLoad(option) {
		console.log(option);
		this.link = decodeURIComponent(option.link);
		console.log('this.link:', this.link)
		// 看文有奖传参
		if (option.fromArticle) {
			this.fromArticle = option.fromArticle
		}
		if(option.isButton) {
			this.isButton = option.isButton;
			this.getAward();
		}
		// 设置标题：webview情况下不生效
		if (option.title) {
			this.title = option.title
			uni.setNavigationBarTitle({
				title: option.title
			});
		}
		if(option.bgColor) {
			let frontColor = '#ffffff';
			if(option.bgColor == '#fff' || option.bgColor == '#ffffff') frontColor = '#000000'
			uni.setNavigationBarColor({
				frontColor,
				backgroundColor: option.bgColor
			});
		}
	},
	onReachBottom() {
		if (this.fromArticle && !_isReward) {
			this.getAward()
		}
	},
	onUnload() {
		_isReward = false
	},
	methods: {
		// 看文回调
		async getAward() {
			const res = await articleAward()
			if (res.code != 1) return;
			_isReward = true
			uni.setStorageSync('READ_ARTICLE', res.data);
		}
	}
};
</script>
<style lang="scss">
.box {
	height: 100vh;
	.img {
		width: 100%;
	}
}
</style>
