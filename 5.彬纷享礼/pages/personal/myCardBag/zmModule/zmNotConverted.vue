<!-- 未用 -->
<template>
	<view class="zm-not-converted" @click="$emit('setCheckItem',config)">
	      <!-- 左边选中 -->
	      <xh-check class="to-convert-check" checkedClass="checked-select-zm" :checked="config.isCheck" />
		  <!-- card -->
		  <view class="zm-card">
		  	<!-- 背景 -->
			<image class="zm-card-head" src="/pages/personal/static/warHorse/zm_card_head.png" mode="aspectFill"></image>
			<image class="zm-card-body" src="/pages/personal/static/warHorse/zm_card_body.png" mode="aspectFill"></image>
			<!-- 卡券名称 -->
			<view class="card-title">
				1元乐享战马换购券
			</view>
			<!-- 领取时间 -->
			<view class="card-create-time">
				领取时间：{{config.create_time}}
			</view>
			<!-- 倒计时 -->
			<view class="card-expire" v-if="config.open">有效期：<text class="rt-text-color">{{config.remainingTime|remainingTime}}</text></view>
			<!-- 有效期 -->
			<view class="card-expire" v-else>
				有效期至：<text class="card-expire-text">{{expire}}</text>
			</view>
			<!-- 去使用 -->
			<view class="to-use" v-on:click.stop="directExchange">
				去使用
			</view>
		  </view>
	</view>
</template>

<script>
	import {
		parseTime
	} from '@/utils';
	export default {
		props: {
			config: {
				type: Object
			}
		},
		computed:{
			expire(val){
				if(!this.config)return ''
				return  parseTime(this.config.expire,'{y}年{m}月{d}日')
			}
		},
		filters: {
			remainingTime(mss) {
				let dir = mss <= 0 ? '-' : ''; 
				mss = Math.abs(mss);
				
				let d = parseInt(mss / (1000 * 60 * 60 * 24));
				let h = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				let m = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
				let s = parseInt((mss % (1000 * 60)) / 1000);
				d = d===0?'':(d+'天');
				h = h > 9 ? h : '0' + h;
				m = m > 9 ? m : '0' + m;
				s = s > 9 ? s : '0' + s;
				
				return dir + d +' ' + h + ':' + m + ':' + s;
			}
		},
		methods: {
			directExchange() {
				this.$emit('directExchange', this.config);
			}
		}
	};
</script>

<style lang="scss">
	.zm-not-converted{
		display: flex;
		align-items: center;
		margin: 40rpx 0;
		
		.to-convert-check {
			margin: 0 15rpx 0 25rpx;
		}
		
		.zm-card{
			width: 644rpx;
			height: 160rpx;
			position: relative;
			box-sizing: border-box;
			padding-left: 164rpx;
		}
		
		.zm-card::after{
			content: '';
			position: absolute;
			height: 128rpx;
			border-right: 1px dashed #707070;
			right: 102rpx;
			top: 50%;
			transform: translateY(-50%);
		}
		
		.zm-card-head{
			width: 142rpx;
			height: 160rpx;
			position: absolute;
			left: 0;
			top: 0;
			z-index: -1;
		}
		
		.zm-card-body{
			width: 502rpx;
			height: 160rpx;
			position: absolute;
			right: 0;
			top: 0;
			z-index: -1;
		}
		
		.card-title{
			position: relative;
			z-index: 1;
			font-size: 28rpx;
			font-weight: 400;
			color: #000000;
			margin-top: 22rpx;
		}
		.card-create-time,.card-expire{
			font-size: 20rpx;
			font-weight: 400;
			color: rgba(102,102,102,0.95);
		}
		.card-create-time{
			margin-top: 12rpx;
			margin-bottom: 4rpx;
		}
		.card-expire-text{
			font-size: 28rpx;
			color: #E30027;
		}
		.to-use{
			padding: 30rpx;
			width: 26rpx;
			font-size: 24rpx;
			font-weight: 700;
			color: #ff711f;
			text-align: center;
			position: absolute;
			right: 10rpx;
			top: 50%;
			transform: translateY(-50%);
		}
		.rt-text-color{
			color: #E30027;
		}
	}
</style>
