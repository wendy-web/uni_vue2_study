<template>
<view v-if="isShow" class="boot-module" :style="{top:top,right:right}">
    <span>添加到我的小程序，使用更方便</span>
    <van-icon class="tips-icon" name="cross" color="#AAAAAA" size="35rpx" @click="close" />
</view>
</template>
<script>
import { getNavbarData } from '@/components/xhNavbar/xhNavbar.js';
import { getStorage, setStorage } from '@/utils/auth.js';
export default {
	props: {
		isCustomNavbar: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			isShow: false,
			navBarConfig: {
				navBarHeight: 0,
				statusBarHeight: 0, //状态栏高度
				menuWidth: 0
			},
			countDown: null
		}
	},
	computed: {
		top() {
			if (this.isCustomNavbar) {
				const {
					statusBarHeight,
					navBarHeight
				} = this.navBarConfig
				return statusBarHeight + navBarHeight + 'px';
			}
			return 0;
		},
		right() {
			return this.navBarConfig.menuWidth / 2 + 'px';
		}
	},
	mounted() {
		// 获取导航栏数据
		getNavbarData().then(res => {
			this.navBarConfig = res;
		});
		this.show();
	},
	methods: {
		show() {
			clearTimeout(this.countDown);
			let isShow = Boolean(getStorage('bootModule'));
			if (isShow) return;
			this.isShow = true;
			this.countDown = setTimeout(() => this.close(), 15000);
		},
		close() {
			this.isShow = false;
			clearTimeout(this.countDown);
			setStorage('bootModule', true);
		}
	},
	beforeDestroy() {
		this.close();
	}
}
</script>
<style>
.boot-module {
	position: fixed;
	z-index: 9;
	height: 60rpx;
	width: 440rpx;
	background-color: rgba(0, 0, 0, .6);
	font-size: 26rpx;
	font-weight: 400;
	color: #ffffff;
	border-radius: 5px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 15rpx;
}

.boot-module .tips-icon {
	margin-left: 16rpx;
	margin-top: 3rpx;
}

.boot-module::after {
	content: '';
	position: absolute;
	width: 0;
	height: 0;
	border-width: 15rpx;
	border-style: solid;
	border-color: transparent transparent rgba(0, 0, 0, .6) transparent;
	top: -28rpx;
	right: 30rpx;
}
</style>
