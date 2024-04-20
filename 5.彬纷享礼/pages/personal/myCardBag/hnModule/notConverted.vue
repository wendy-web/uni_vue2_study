<!-- 未兑换 -->
<template>
	<view class="to-convert-item" @click="$emit('setCheckItem',config)">
		<!-- 左边选中 -->
		<xh-check class="to-convert-check" checkedClass="checked-select" :checked="config.isCheck" />
		<!-- 右边详情 -->
		<view class="to-convert-right">
			<!-- 25周年 -->
			<image class="icon-logo" :src="cardNotConverted[config.prizeratetype]" mode="aspectFill"></image>
			<!-- 26周年 -->
			<text class="tcr-top-text">{{CARDTITLES[Number(config.prizeratetype)]}}</text>
			<view class="tcr-bottom">领取时间：{{config.create_time}}</view>
			<!-- 倒计时 -->
			<view class="tcr-bottom" v-if="config.open">有效期：<text
					class="rt-text-color">{{config.remainingTime|remainingTime}}</text></view>
			<!-- 有效时间 -->
			<text class="tcr-bottom" v-else>有效期至：{{config.expire}}</text>
			<view class="tcr-bottom product">产品：红牛维生素功能饮料250ml</view>
			<!-- 去使用  go-dui25-->
			<view class="go-dui-box" v-on:click.stop="directExchange">
				<view class="go-dui" :class="'go-dui'+ config.prizeratetype">
					去使用
				</view>
			</view>
			<!-- 右边背景 -->
			<image class="right-bg" src="/static/images/mcb_bg_white.png"></image>
			<!-- 至28周年期关闭此显示 -->
			<!-- <view class="one_more_day" v-if="config.open">
				<image v-if="config.prizeratetype!=3" class="one_more_day_icon"
					:src="'../static/one_more_day'+(config.prizeratetype+24)+'.png'" mode="aspectFill"></image>
				<view class="one_more_day_text">
					仅剩{{config.remainingTime|leftoverDay}}天
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>
	import {
		CARDTITLES,
		cardNotConverted
	} from '@/utils/configJson.js';
	export default {
		props: {
			config: {
				type: Object
			}
		},
		data() {
			return {
				CARDTITLES,
				cardNotConverted
			};
		},
		filters: {
			leftoverDay(val) {
				if (val <= 0) return 1;
				return Math.ceil(val / (1000 * 60 * 60 * 24));
			},
			remainingTime(mss) {
				let dir = mss <= 0 ? '-' : '';
				mss = Math.abs(mss);

				let d = parseInt(mss / (1000 * 60 * 60 * 24));
				let h = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				let m = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
				let s = parseInt((mss % (1000 * 60)) / 1000);
				d = d === 0 ? '' : (d + '天');
				h = h > 9 ? h : '0' + h;
				m = m > 9 ? m : '0' + m;
				s = s > 9 ? s : '0' + s;

				return dir + d + ' ' + h + ':' + m + ':' + s;
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
	/*未兑换 start*/
	.to-convert-item {
		display: flex;
		align-items: center;
		margin: 50rpx 0;
		padding-right: 34rpx;

		.to-convert-check {
			margin: 0 20rpx 0 38rpx;
		}

		.to-convert-right {
			flex: 1;
			height: 168rpx;
			display: flex;
			padding-left: 185rpx;
			justify-content: center;
			flex-direction: column;
			position: relative;
		}

		.right-bg {
			position: absolute;
			left: 168rpx;
			right: 0;
			width: auto;
			top: 0;
			height: 168rpx;
			z-index: -1;
		}

		.icon-logo {
			position: absolute;
			left: 0;
			top: 0;
			width: 168rpx;
			height: 168rpx;
		}

		.tcr-top-text {
			font-size: 30rpx;
			color: #333;
		}

		.tcr-bottom {
			font-size: 20rpx;
			color: #666;
			display: flex;
			align-items: center;
		}

		.product {
			color: rgba(102, 102, 102, 0.5);
		}

		.rt-text-color {
			color: #FB619A;
			font-size: 28rpx;
		}

		.one_more_day {
			position: absolute;
			right: -18rpx;
			top: -12rpx;
			width: 142rpx;
			height: 142rpx;
		}

		.one_more_day_icon {
			width: 142rpx;
			height: 142rpx;
		}

		.go-dui-box {
			position: absolute;
			height: 44rpx;
			right: -8rpx;
			bottom: 0rpx;
			padding-top: 20rpx;
			padding-bottom: 20rpx;
			padding-right: 26rpx;
			padding-left: 20rpx;
			z-index: 1;
		}


		.go-dui {
			width: 100rpx;
			height: 44rpx;
			text-align: center;
			line-height: 44rpx;
			border-radius: 5px;
			font-size: 20rpx;
			color: #FFFFFF;
		}

		.go-dui1 {
			background-image: linear-gradient(#FE8D7C, #FD413D);
		}

		.go-dui2 {
			background-image: linear-gradient(#FFD57A, #FF8F4B);
		}

		.go-dui3 {
			background-image: linear-gradient(#FE8C7B, #FB5D9D);
		}

		.go-dui6 {
			background-image: linear-gradient(133deg, #ff94a8 10%, #cf0027 97%);
		}

		.go-dui14 {
			background-image: linear-gradient(133deg, #fec461 10%, #f38a0c 97%);
		}

		.one_more_day_text {
			font-size: 22rpx;
			color: #fff;
			position: absolute;
			z-index: 1;
			top: 16.5px;
			right: 6.5px;
			-webkit-transform: rotateY(10deg);
			transform: rotateZ(46deg);
		}
	}

	/*未兑换 end*/
</style>