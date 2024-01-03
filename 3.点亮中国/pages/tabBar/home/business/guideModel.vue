<template>
	<view class="guide-model" v-if="isShow">
		<view class="guide-01-box" v-show="step === 1">
			<view class="guide-01">
				<van-image class="guide-model-icon01" width="670rpx" height="490rpx" src="https://file.y1b.cn/public/img/dlzg/guide_01.png" fit="cover"  use-loading-slot>
					<van-loading slot="loading" type="spinner" size="20" vertical />
				</van-image>
				<!-- 下一步 -->
				<view class="guide-01-btn" @click="steps">
					下一步
				</view>
			</view>
		</view>
		<!-- 步驟二 -->
		<view v-show="step === 2" class="guide-02-box" :style="{'padding-top':navbarData.height + 'px'}">
				  <van-image class="guide-model-icon02"  width="608rpx" height="674rpx" src="https://file.y1b.cn/public/img/dlzg/guide_02.png" fit="cover"  use-loading-slot>
				  	<van-loading slot="loading" type="spinner" size="20" vertical />
				  </van-image>
				  <van-image class="guide-model-icon03" width="690rpx" height="502rpx" src="https://file.y1b.cn/public/img/dlzg/guide03.png" fit="cover"  use-loading-slot>
				  	<van-loading slot="loading" type="spinner" size="20" vertical />
				  </van-image>
		</view>
		<!-- 跳過 -->
		<view class="guide-model-skip" v-if="step>1" @click="skip"  :style="{top:navbarData.height + 'px'}">
			跳过
		</view>
	</view>
</template>

<script>
	import {getNavbarData} from '@/components/xhNavbar/xhNavbar.js'
	export default {
		data(){
			return {
				isShow:false,
				step:1,
				navbarData:{
					height: 88,
					paddingTop:28
				}
			}
		},
		mounted() {
			//自定义导航栏需要
			getNavbarData().then(res=>{
				let {navBarHeight,statusBarHeight} = res
				this.navbarData = {
					height: navBarHeight+statusBarHeight,
					paddingTop:statusBarHeight
				}
			})
		},
		methods:{
			showGuide(){
				this.step = 1
				this.isShow = true
			},
			skip(){
				this.isShow = false
			},
			steps(){
				this.step++
			}
		}
	}
</script>

<style lang="scss">
	.guide-model-skip{
		position: fixed;
		z-index: 1002;
		right: 30rpx;
		width: 160rpx;
		height: 60rpx;
		border: 1px solid #ffffff;
		border-radius: 30px;
		text-align: center;
		line-height: 60rpx;
		font-size: 28rpx;
		font-weight: 400;
		color: #ffffff;
		margin-top: 20rpx;
	}
	.guide-02-box{
		position: fixed;
		top:0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		padding-top: 32rpx;
		box-sizing: border-box;
		background-color: rgba(0, 0, 0, .9);
		.guide-model-icon02{
			position: relative;
			margin-left: -30rpx;
			z-index: 1;
			top: -50rpx;
		}
		.guide-model-icon03{
			position: absolute;
			bottom: 180rpx;
			left: 50%;
			transform: translateX(-50%);
			z-index: 1;
		}
	}
	.guide-01-box{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		box-sizing: border-box;
		background-color: rgba(0, 0, 0, .9);
		z-index: 1001;
		
		.guide-01{
			position: absolute;
			width: 670rpx;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: flex-end;
			
		}
		.guide-01-btn{
			margin-top: 65rpx;
			width: 254rpx;
			height: 70rpx;
			border: 1px solid #fce97d;
			border-radius: 30px;
            text-align: center;
			line-height: 70rpx;
			font-size: 28rpx;
			font-weight: 400;
			color: #fcea84;
		}

	}
</style>