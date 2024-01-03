<template>
	<view class="donation-record">
		<view class="record-item-head">
			<view class="record-title">
				{{config.title}}
			</view>
			<view class="record-right-info" v-if="config.isHarvest">
				<text class="text-red">+{{config.love}}</text>
				<image class="lightning" src="/static/home/lightning.png"></image>
			</view>	
			<view class="record-right-info" v-else>
				<text>捐了{{config.love}}</text>
				<image class="lightning" src="/static/home/lightning.png"></image>
			</view>
		</view>
		<view class="record-time">
			{{config.create_time}}
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			config:{
				type:Object,
				default(){
					return {}
				}
			}
		}
	}
</script>

<style lang="scss">
	.donation-record{
		padding: 40rpx 50rpx 28rpx;
		position: relative;
		&::after{
			content: '';
			position: absolute;
			bottom: 0;
			left: 50rpx;
			right: 50rpx;
			background-color: #707070;
			opacity: 0.22;
			height: 2rpx;
		}
		.record-item-head{
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.record-title{
			font-size: 28rpx;
			font-weight: 700;
			color: #000018;
		}
		.record-right-info{
			font-size: 28rpx;
			font-weight: 400;
			color: #4e4d52;
			display: flex;
			align-items: center;
		}
		.lightning{
			width: 32rpx;
			height: 40rpx;
		}
		.text-red{
			color: #E5404F;
		}
		.record-time{
			font-size: 22rpx;
			font-weight: 400;
			color: #8e8e91;
			letter-spacing: 0.18px;
			margin-top: 10rpx;
		}
	}
</style>