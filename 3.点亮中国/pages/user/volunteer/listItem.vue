<template>
	<view class="donation-record">
		<view class="record-item-head">
			<view class="record-title">
				{{config.title}}
			</view>
			<view class="record-right-info" v-if="config.isHarvest">
				<text class="text-red">+{{config.love}}</text><image class="lightning" src="/static/home/lightning.png"></image>
			</view>
			<view class="record-right-info" v-else>
				<text>捐了{{config.love}}</text><image class="lightning" src="/static/home/lightning.png"></image>
			</view>
		</view>
		<view class="record-time">
			<view class="time">
				{{config.create_time}}
			</view>
			<view class="look" @click="goLoveDetails">
				查看详情<van-icon name="arrow" />
			</view>
		</view>
	</view>
</template>

<script>
	import {mapGetters} from 'vuex'
	export default {
		props:{
			config:{
				type:Object,
				default(){
					return {}
				}
			},
			love:{
				type:Number,
				default:0
			},
			type:{
				type:Number,
				default:0
			}
		},
		computed:{
		   ...mapGetters(['userInfo'])
		},
		methods:{
			goLoveDetails(){
				uni.navigateTo({
					url:`/pages/love/loveDetails/index?com_id=${this.config.com_id}&type=${this.type}&love=${this.love}&teamId=${this.userInfo.team_id}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.donation-record{
		padding: 32rpx 50rpx 8rpx;
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
			display: flex;
			justify-content: space-between;
			align-items: center;
			.time{
				font-size: 22rpx;
				font-weight: 400;
				color: #8e8e91;
				letter-spacing: 0.18px;
			}
			.look{
				font-size: 24rpx;
				font-weight: 400;
				color: #3e8de2;
				padding-bottom: 20rpx;
				padding-top: 20rpx;
			}
		}
		
	}
</style>