<template>
	<view class="custom-nav-layout">
		<!-- 自定义页面内容 -->
		<slot></slot>
		<!-- 自定义背景 -->
		<image class="custom-nav-layout-bg" v-if="bgImageUrl" :src="bgImageUrl" mode="aspectFill"></image>
		<!-- 背景颜色 -->
		<view class="custom-nav-layout-bg" v-if="bgStyle" :style="{background:bgStyle}"></view>
		<service />
	</view>
</template>

<script>
	import service from "./service.vue"
	export default {
		components: {
			service
		},
		props: {
			bgImageUrl: {
				type: String,
				default: ""
			},
			bgStyle: {
				type: String,
				default: ""
			}
		}
	}
</script>

<style>
	.custom-nav-layout {
		padding-bottom: 178rpx;
	}

	.custom-nav-layout-bg {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
	}
</style>