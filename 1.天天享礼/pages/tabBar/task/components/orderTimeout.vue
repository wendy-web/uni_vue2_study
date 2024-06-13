<template>
<!-- 订单超时 -->
<view class="box" v-if="orderInfo&&time" @click="myOrder">
    <view class="title">订单即将超时</view>
    <view class="content">
        <!-- 背景白板 -->
        <van-image class="bg-order-timeout" use-loading-slot lazy-load width="702rpx" height="392rpx"
            :src="imgUrl+'/task/bg_order_timeout.png'">
            <van-loading slot="loading" type="spinner" size="20" vertical />
        </van-image>
        <!-- 背景图 -->
        <van-image class="img-order-timeout" use-loading-slot lazy-load width="674rpx" height="286rpx"
            :src="imgUrl+'/task/img_order_timeout.png'">
            <van-loading slot="loading" type="spinner" size="20" vertical />
        </van-image>
        <!-- 倒计时 -->
        <view class="count-down">
            <van-count-down :use-slot="true" :time="time" @change="onChange" @finish="init" millisecond
                format="HH:mm:ss:SS">
                <view class="flex-row-between">
                    <text class="item">{{ timeData.hours }}</text>
                    <text class="colon">:</text>
                    <text class="item">{{ timeData.minutes }}</text>
                    <text class="colon">:</text>
                    <text class="item">{{ timeData.seconds }}</text>
                    <text class="colon">:</text>
                    <text class="item-active">{{ timeData.milliseconds }}</text>
                </view>
            </van-count-down>
        </view>
        <!-- 内容 -->
        <view class="name">优惠可能随时结束，建议尽快支付</view>
        <view class="btn">去支付</view>
    </view>
</view>
</template>
<script>
	import { expireOrder } from '@/api/modules/task.js';
import { getImgUrl } from '@/utils/auth.js';
import { mapGetters } from 'vuex';
	let _request = false;
	export default {
		data() {
			return {
				time: 0,
				timeData: {},
				orderInfo: null,
				imgUrl:getImgUrl()
			}
		},
        computed: {
			...mapGetters(['isAutoLogin'])
		},
		methods: {
			onChange(e) {
				let {
					days,
					hours,
					minutes,
					seconds,
					milliseconds
				} = e.detail;
				hours = hours < 10 ? '0' + hours : hours
				minutes = minutes < 10 ? '0' + minutes : minutes
				seconds = seconds < 10 ? '0' + seconds : seconds
				milliseconds = String(milliseconds).slice(0, 2)
				this.timeData = {
					hours,
					minutes,
					seconds,
					milliseconds
				}
			},
			init() {
				if (_request) return _request = true;
				expireOrder().then(res => {
					let {
						code,
						data
					} = res;
					_request = false;
					if (code == 1 && data) {
						this.orderInfo = data;
						let {
							expire_time
						} = data;
						expire_time = new Date(expire_time.replace(new RegExp(/-/gm), '/')).getTime();
						let cur_time = new Date().getTime();
						let remain_time = expire_time - cur_time;
						this.time = remain_time > 0 ? remain_time : 0;
						this.time = remain_time > 0 ? remain_time : 0;
					} else {
						this.orderInfo = null
					}
				})
			},
			myOrder() {
                if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
				this.$wxReportEvent('pendingorder');
                this.$go('/pages/userModule/order/index?activeTab=1');
			}
		}
	}
</script>

<style lang="scss">
	.box {
		box-sizing: border-box;
		padding: 10rpx 24rpx;
		margin-bottom: 64rpx;
	}

	.content {
		position: relative;
		width: 702rpx;
		height: 392rpx;
		box-sizing: border-box;
		margin-top: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
	}

	.bg-order-timeout {
		width: 702rpx;
		height: 392rpx;
		position: absolute;
		top: 0;
		left: 0;
		margin: auto;
		z-index: -1;
	}

	.img-order-timeout {
		width: 674rpx;
		height: 296rpx;
		position: absolute;
		bottom: 20rpx;
		left: 14rpx;
		right: 14rpx;
		z-index: 1;
	}

	.count-down {
		z-index: 2;
		width: 225rpx;
		height: 55rpx;
		position: absolute;
		right: 0;
		top: 10rpx;
		display: flex;
		align-items: center;
	}

	.item {
		display: inline-block;
		width: 38rpx;
		height: 38rpx;
		box-sizing: border-box;
		background: #f3f3f3;
		border-radius: 4rpx;
		font-size: 26rpx;
		font-weight: 500;
		text-align: center;
		color: #333333;
	}

	.item-active {
		display: inline-block;
		width: 38rpx;
		height: 38rpx;
		font-size: 26rpx;
		padding-left: 2rpx;
		box-sizing: border-box;
		border: 2rpx solid #e1e1e1;
		border-radius: 4rpx;
		overflow: hidden;
	}

	.colon {
		width: 6rpx;
		height: 28rpx;
		line-height: 28rpx;
		font-size: 20rpx;
		font-weight: 400;
		text-align: center;
		color: #333333;
		margin: 0 4rpx;
	}

	.name {
		font-size: 28rpx;
		text-align: center;
		color: #333333;
		line-height: 40px;
		letter-spacing: 0.62px;
		z-index: 2;
	}

	.btn {
		width: 352rpx;
		height: 68rpx;
		line-height: 68rpx;
		background: linear-gradient(135deg, #f58079, #f2554d);
		border-radius: 16rpx;
		font-size: 26rpx;
		font-weight: 500;
		color: #ffffff;
		letter-spacing: 0.58px;
		margin-top: 60rpx;
		margin-bottom: 56rpx;
		z-index: 2;
		text-align: center;

	}
</style>
