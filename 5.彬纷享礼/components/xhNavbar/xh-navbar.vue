<template>
	<view class="xh-navber-box">
		<!-- 具体导航 -->
		<view class="xh-navber" :class="{'fixed':fixed}"
			:style="{height:statusBarHeight+navBarHeight+'px',backgroundColor:navberColor,backgroundImage:gradient}">
			<!-- 状态栏 -->
			<view class="status-bar" :style="{height:statusBarHeight+'px'}"></view>
			<!-- 导航背景图片 -->
			<image v-if="navbarImage" class="navbar-image" :src="navbarImage" mode="contain"></image>
			<!-- 导航栏 -->
			<view class="xh-navber-nav" :class="titleAlign"
				:style="{height:navBarHeight+'px',color:titleColor,paddingLeft:!leftImage&&titleAlign !== 'titleCenter'?'10px':0}">
				<!-- 右边留白 -->
				<view v-if="leftImage&&titleAlign !== 'titleCenter'" class="left-white"
					:style="{width:navBarHeight/2+'px'}"></view>
				<!-- 默认中间部分 -->
				<view v-if="title" class="title-text">{{title}}</view>
				<!-- 自定义中间部分 -->
				<slot name="title" />
				<!-- 胶囊安全宽度 -->
				<view class="capsule" v-if="titleAlign === 'titleRight'" :style="{width:menuWidth+'px'}"></view>
				<!-- 左边tools -->
				<image v-if="leftImage" @click="leftClick" class="left-tools" :class="{'left-tools-home':isHome}"
					:src="leftImage" :style="{height:navBarHeight/2+'px',width:navBarHeight/2+'px'}" />
			</view>
		</view>
		<!-- 空间占据者 -->
		<view v-if="fixed&&!isNoOccupant" :style="{height:statusBarHeight+navBarHeight+'px'}"></view>
	</view>
</template>

<script>
	import {
		getNavbarData
	} from '@/utils/xhNavbar.js';

	export default {
		props: {
			title: {
				type: String,
				default: ''
			},
			titleColor: {
				type: String,
				default: '#ffffff'
			},
			fixed: {
				type: Boolean,
				default: true
			},
			isHome: {
				type: Boolean,
				default: false
			},
			statusBar: {
				type: Boolean,
				default: true
			},
			navberColor: {
				type: String,
				default: '#ffffff'
			},
			gradient: {
				type: String,
				default: ''
			},
			navbarImage: {
				type: String,
				default: ''
			},
			titleAlign: {
				type: String,
				default: 'titleCenter'
			},
			leftCallBack: {
				type: Boolean
			},
			leftImage: {
				type: String
			},
			isNoOccupant: {
				type: Boolean,
				default: false
			}
		},
		created() {
			getNavbarData().then(data => {
				this.navBarHeight = data.navBarHeight;
				this.statusBarHeight = data.statusBarHeight;
				this.menuWidth = data.menuWidth;
			});
		},
		data() {
			return {
				statusBarHeight: 30,
				navBarHeight: 44,
				menuWidth: 110
			};
		},
		methods: {
			leftClick() {
				if (!this.leftCallBack) {
					return this.$navigateBack({
						fail: (e) => {
							this.$switchTab({
								url: '/pages/tabBar/personal/index'
							});
						}
					});
				}
				//自定义回调 Custom callback
				this.$emit('leftCallBack');
			}
		}
	};
</script>

<style>
	.xh-navber {
		width: 100%;
		position: relative;
	}

	.xh-navber.fixed {
		position: fixed;
		left: 0;
		top: 0;
		z-index: 10000;
	}

	.xh-navber .titleCenter {
		justify-content: center;
	}

	.xh-navber .titleLeft {
		justify-content: flex-start;
	}

	.xh-navber .titleRight {
		justify-content: flex-end;
	}

	.xh-navber .navbar-image {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
	}

	.xh-navber .xh-navber-nav {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: center;
	}

	.xh-navber .left-tools {
		padding: 0 5px;
		position: absolute;
		left: 0;
		top: 50%;
		padding: 8rpx 10rpx 10rpx 10rpx;
		margin-left: 20rpx;
		transform: translateY(-50%);
	}

	.xh-navber .left-tools-home {
		border-radius: 50%;
		border: 1rpx solid #515151;
	}

	.xh-navber .left-white {
		padding: 0 5px;
	}
</style>