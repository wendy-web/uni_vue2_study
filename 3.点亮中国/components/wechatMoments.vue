<template>
	<view>
		<view class="wechat-moments" v-if="isShow" @click="isShow = false">
			<image 
			class="wm-icon" 
			src="/static/images/wechat_moments.png" 
			mode="aspectFill" 
			:style="{top:top,right:right}"></image>
		</view>
	</view>
</template>

<script>
	import {getNavbarData} from '@/components/xhNavbar/xhNavbar.js'
	
	export default {
		props:{
			isCustomNavbar:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return {
				isShow:false,
				navBarConfig: {
					navBarHeight: 0,
					statusBarHeight: 0, //状态栏高度
					menuWidth: 0
				}
			}
		},
		computed:{
			top(){
				if(this.isCustomNavbar){
					const {statusBarHeight,navBarHeight} = this.navBarConfig
					return statusBarHeight+navBarHeight+'px'
				}
				return 0
			},
			right(){
				return this.navBarConfig.menuWidth/2+'px'
			}
		},
		mounted() {
			//获取导航栏数据
			getNavbarData().then(res => {
				this.navBarConfig = res
			})
		},
		methods:{
			show(){
				this.isShow = true
			}
		}
	}
</script>

<style lang="scss">
	.wechat-moments{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, .6);
		z-index: 10000;
		.wm-icon{
			width: 568rpx;
			height: 220rpx;
			position: absolute;
		}
	}
</style>