<template>
	<view class="grand-prize-list">
		<view class="tb" v-if="list.length>0">
			<view class="tb-h">
				<view class="tb-h-item">
					序号
				</view>
				<view class="tb-h-item">
					微信昵称
				</view>
				<view class="tb-h-item">
					手机号
				</view>
				<view class="tb-h-item">
					所属地
				</view>
			</view>
			<view class="tb-r" v-for="(item,index) in list" :key="item.id">
				<view class="tb-c-item text-overflow">
					{{index+1}}
				</view>
				<view class="tb-c-item text-overflow">
					{{item.nick_name}}
				</view>
				<view class="tb-c-item text-overflow">
					{{item.mobile}}
				</view>
				<view class="tb-c-item flex-vh">
					<view style="position: relative;">
						{{item.city}}
						<!-- 获奖时间 -->
						<view class="time">
							获奖时间：{{item.create_time}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 空 -->
		<view class="empty" v-if="list.length===0">
			暂无获奖记录~
		</view>
	</view>
</template>
<script>
	import {
		awardList
	} from '@/api/homeApi.js'
	export default {
		data() {
			return {
				list: []
			};
		},
		onLoad() {
			this.init()
		},
		methods: {
			async init() {
				let {
					data
				} = await awardList({
					prizeratetype: 14
				})
				this.list = data
			}
		}
	}
</script>

<style>
	page {
		background-color: #fff;
	}

	.grand-prize-list {
		border-top: 10rpx solid #F3F3F3;
	}

	.tb-h,
	.tb-r {
		display: flex;
		padding: 30rpx 0;
		position: relative;
	}

	.tb-r {
		padding-bottom: 82rpx;
	}

	.tb-h::after,
	.tb-r::after {
		content: '';
		position: absolute;
		left: 40rpx;
		right: 40rpx;
		bottom: 0;
		border-bottom: 1rpx solid #e2e2e2;
	}


	.tb-h-item,
	.tb-c-item {
		width: 25%;
		text-align: center;
	}

	.text-overflow {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.flex-vh {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.tb-h-item {
		font-size: 28rpx;
		font-weight: 400;
		color: #6e6e6e;
		letter-spacing: -1.04rpx;
	}

	.tb-c-item {
		font-size: 28rpx;
		font-weight: 400;
		color: #000018;
		letter-spacing: -1.26rpx;
	}

	.time {
		font-size: 24rpx;
		font-weight: 400;
		color: #6e6e6e;
		position: absolute;
		bottom: -55rpx;
		right: 0;
		white-space: nowrap;
	}

	.empty {
		font-size: 28rpx;
		color: #6e6e6e;
		position: absolute;
		top: 300rpx;
		left: 50%;
		transform: translateX(-50%);
	}
</style>