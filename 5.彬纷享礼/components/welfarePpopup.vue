<template>
	<view class="welfare-ppopup">
		<view class="wp-custom" v-if="isCustom&&isCompatible && homeIcon" @click="play">
			<easy-loadimage imageClass="W-H-fill" mode="widthFix"
				:image-src="homeIcon"></easy-loadimage>
		</view>
		<!-- 		<ad-custom unit-id="adunit-129955926e79e855" type="welfare" :is-welfare-show="welfareAdShow" @load="onadload"
			@error="onaderror" @close="onWelfareClose"></ad-custom> -->
	</view>
</template>

<script>
	import { compareVersion } from '@/utils/index.js';
	import { mapGetters } from 'vuex';
	export default {
		name: 'welfarePpopup',
		props: {
			isAutoPlay: {
				type: Boolean,
				default: false
			},
			isCustom: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				isCompatible: false,
				welfareAdShow: false,
				isLoadSuccess: false,
				autoPlay: false,
				// aiGpt: null
			};
		},
		created() {
			const version = this.$getSystemInfo().SDKVersion;
			this.isCompatible = compareVersion(version, '2.19.6') >= 0;
			this.autoPlay = this.isAutoPlay;
		},
		computed: {
			...mapGetters(['homeIcon']),
		},
		methods: {
			play() {
				//彬纷享礼小程序浮窗--天天有福利--- 点击跳转到---天天享礼小程序--任务中心
				this.$ttxlUserPosition('home_benefits')
				/*人工智能*/
				// if (this.aiGpt) {
				// 	this.$go({
				// 		url: `/pages/webview/webview?link=${encodeURIComponent(this.aiGpt.url)}`
				// 	});
				// 	return
				// }
				/*人工智能*/
				// if (!this.isCompatible) return; //不兼容不展示
				// if (this.isLoadSuccess) {
				// 	this.welfareAdShow = true;
				// } else {
				// 	//调用play时组件还未初始化完成，就设置让初始化完成后弹出
				// 	this.autoPlay = true;
				// }
			},
			close() {
				this.welfareAdShow = false;
			},
			onaderror() {},
			onWelfareClose() {
				this.close();
			},
			onadload() {
				if (!this.isCompatible) return; //不兼容不展示   
				this.isLoadSuccess = true;
				if (this.autoPlay) this.welfareAdShow = true;
			}
		},
	};
</script>

<style lang="scss">
	.welfare-ppopup {
		.wp-custom {
			position: fixed;
			right: 0;
			top: 900rpx;
			width: 200rpx;
		}
	}
</style>
