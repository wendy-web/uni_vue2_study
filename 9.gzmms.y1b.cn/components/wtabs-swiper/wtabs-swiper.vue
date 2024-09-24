<template>
	<view class="tabs-wrapper">
		<!-- tabs菜单栏 -->
		<v-tabs
			v-model="current"
			:tabs="tabs"
			@change="changeTab"
			:scroll="false"
			lineHeight="6rpx"
			:lineScale="0.2"
			bgColor="linear-gradient(to left, #DAE3FF, #ECF4FF, #E1E8FF);"
			fixed
		></v-tabs>
		<view class="tabs-main">
			<swiper id="tabs-swiper" class="tabs-swiper" style="height: 100%" :current="swiperCurrent" @animationfinish="animationFinished">
				<swiper-item class="tabs-swiper-item" style="height: 100%">
					<!-- 单据详情内容 具名插槽 -->
					<!-- <scroll-view scroll-y class="scrollView"> -->
					<view class="scroll-view-box">
						<slot name="detail"></slot>
					</view>
					<!-- </scroll-view> -->
				</swiper-item>
				<swiper-item class="swiper-item">
					<!-- 单据日志内容 具名插槽 -->
					<!-- <scroll-view scroll-y class="scrollView"> -->
					<view class="scroll-view-box">
						<slot name="log"></slot>
					</view>
					<!-- </scroll-view> -->
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
/**
 * 本组件是封装的滑动切换tabs组件
 * @property {Arrar,Object} tabs 内容数组 默认["单据详情", "单据日志"];
 */
export default {
	name: "wtabs-swiper",
	props: {
		tabs: {
			type: [Array, Object],
			// 对象或数组默认值必须从一个工厂函数获取
			default: function () {
				return ["单据详情", "单据日志"];
			},
		},
	},
	data() {
		return {
			current: 0,
			swiperCurrent: 0,
			backgroundColor: "linear-gradient(to left, #DAE3FF, #ECF4FF, #E1E8FF)",
		};
	},
	// 计算属性
	computed: {},
	mounted() {},
	// 方法集合
	methods: {
		changeTab(index) {
			console.log("当前选中的项：" + index);
			// this.current = index;
			this.swiperCurrent = index;
		},
		animationFinished(e) {
			this.current = e.detail.current;
			this.swiperCurrent = e.detail.current;
		},
	},
};
</script>

<style lang="scss">
.tabs-wrapper {
	.tabs-main {
		/* 高度100vh - 自定义导航栏88rpx - tabs菜单栏70rx - 状态栏statusBarHeight - 底部按钮高度 */
		height: calc(100vh - 88rpx - 70rpx - var(--status-bar-height) - 100rpx - env(safe-area-inset-bottom));
		.scroll-view-box {
			height: calc(100% - 50rpx);
			overflow-y: auto;
		}
	}
}
</style>
