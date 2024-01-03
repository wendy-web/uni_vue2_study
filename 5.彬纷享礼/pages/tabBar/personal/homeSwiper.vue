<template>
	<!--  :indicator-dots="true" indicator-active-color="#ffffff" -->
	<swiper class="home-swiper" @change="swiperChange" :autoplay="true" :interval="5000" :duration="500">
		<swiper-item class="swiper-item" v-for="(item,index) in adData.A1.value" :key="index">
			<easy-loadimage v-if="current >= index" @imageClick="links(item,index)" :link="item.link"
				imageClass="W-H-fill" mode="widthFix" :image-src="item.img"></easy-loadimage>
		</swiper-item>
	</swiper>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	export default {
		computed: {
			...mapGetters(['adData'])
		},
		data() {
			return {
				current: 0
			};
		},
		methods: {
			swiperChange(e) {
				if (this.current < e.detail.current) {
					this.current = e.detail.current;
				}
			},
			links(item, index) {
				if (item.is_link) {
					this.$go({
						url: `/pages/webview/webview?link=${encodeURIComponent(item.link)}`
					});
				} else if (item.link) {
					uni.previewImage({
						urls: [item.link] // 需要预览的图片http链接列表
					});
				}
			}
		}
	};
</script>

<style lang="scss">
	.home-swiper {
		height: 290rpx;

		.swiper-item {
			overflow: hidden;
		}
	}
</style>