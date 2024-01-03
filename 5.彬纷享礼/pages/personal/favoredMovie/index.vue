<template>
	<view class="favored-movie">
		<!-- 头部 -->
		<easy-loadimage imageClass="favored-movie-title" :image-src="fileUrl+'/202201/bfxn_favored_movie_title_03.png'"
			mode="widthFix"></easy-loadimage>
		<!-- movie -->
		<view class="favored-center-movie" @click="goPages(1)">
			<easy-loadimage imageClass="fcm-img" :image-src="fileUrl+'/202201/bfxn_favored_movie.png'"
				mode="widthFix"></easy-loadimage>
		</view>
		<!-- tools -->
		<view class="favored-center-tools" @click="goPages(0)">
			<easy-loadimage imageClass="fct-img" :image-src="fileUrl+'/202201/bfxn_favored_tools_new2.png'"
				mode="widthFix"></easy-loadimage>
		</view>
		<!-- 底部 -->
		<view class="favored-movie-bottom">
			<easy-loadimage imageClass="fmb-img" :image-src="fileUrl+'/202101/bfxn_favored_movie_bottom.png'"
				mode="widthFix"></easy-loadimage>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	import {
		fileBaseUrl
	} from '@/api/http/xhHttp.js';
	export default {
		computed: {
			...mapGetters(['adData'])
		},
		data() {
			return {
				fileUrl: fileBaseUrl + '/public/img/bfxn'
			};
		},
		methods: {
			goPages(index) {

				if (index === 1) {
					let data = this.adData.A2.value[index];
					this.$go({
						url: '/pages/personal/xhVideo/index?url=' + data.src
					});
				} else {
					let data = this.adData.A1.value[0];
					uni.previewImage({
						urls: [data.link] // 需要预览的图片http链接列表
					});
				}
			}
		}
	};
</script>

<style lang="scss">
	.favored-movie {
		position: fixed;
		top: 0;
		bottom: 0;
		width: 100%;
		background-color: #d7253b;
	}

	.favored-movie-title {
		width: 100%;
	}

	.favored-center-movie,
	.favored-center-tools {
		position: absolute;
		width: 100%;
	}

	.fcm-img,
	.fct-img {
		width: 100%;
		box-sizing: border-box;
		padding: 0 RPX(50) 0 RPX(35);
	}

	.favored-center-movie {
		top: RPX(175);
	}

	.favored-center-tools {
		top: 595rpx;
	}

	.favored-movie-bottom {
		width: 100%;
		position: absolute;
		bottom: 0;
	}

	.fmb-img {
		width: 100%;
	}

	@media screen and(min-height:700px) {
		.favored-center-movie {
			top: 345rpx;
		}

		.favored-center-tools {
			top: 700rpx;
		}

		.fcm-img,
		.fct-img {
			padding: 0 RPX(15) 0 0;
		}
	}
</style>