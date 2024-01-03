<template>
<view class="box" v-if="actInfo" @click="getWxMsgId">
    <view class="flex-row-between">
        <view class="title">{{actInfo.title || '限时领券'}}</view>
    </view>
    <view class="content">
        <van-image class="img-mt-coupon" use-loading-slot lazy-load width="702rpx" height="240rpx"
            :src="actInfo.image|| imgUrl+'/task/img_mt_coupon.png'">
            <van-loading slot="loading" type="spinner" size="20" vertical />
        </van-image>
        <!-- <view class="progress-bar flex-row-between">
            <view class="progress-box">
                <van-progress :show-pivot="false" color="#8A4A1E" :percentage="progress" stroke-width="10"
                    track-color="#FFE5AA" />
            </view>
            <view class="progress-num">{{progress}}%</view>
        </view> -->
    </view>
</view>
</template>
<script>
	import {
		scheduleActivity,
		xseckill
	} from '@/api/modules/task.js';
	import {
		wxmsgid
	} from '@/api/modules/index.js'
	import {
		parseTime
	} from '@/utils/index.js';
	import {getImgUrl} from '@/utils/auth.js';
	import { mapGetters } from 'vuex';

	export default {
		data() {
			return {
				actInfo: null,
				progress: 0,
				imgUrl: getImgUrl(),
				isPowerStatus: 0
			}
		},
        computed: {
			...mapGetters(['isAutoLogin'])
		},
		methods: {
			init() {
				scheduleActivity().then(res => {
					let {
						code,
						data
					} = res;
					if (code == 1 && data) {
						this.actInfo = data;
						let progress = Number(data.enter_num / data.num) * 100;
						if (progress > 100) progress = 100;
						progress = progress.toFixed(2);
						this.progress = progress;
					}
				})
			},
			// 领红包：先判断是否在活动时间内
			getRedPacket() {
				let result = this.checkActTime();
				console.log("结果：", result);
			},
			// 活动时间
			checkActTime() {
				let {
					mode,
					start_time,
					end_time,
					id
				} = this.actInfo
				let now = Date.now();
				const params = {
					id,
					is_power: this.isPowerStatus
				}
				xseckill(params).then(res => console.log('res', res));
				let today = parseTime(now, '{y}/{m}/{d} {h}:{i}:{s}')
				//每天
				if (mode == 2) {
					start_time = new Date(`${today.slice(0,10)} ${start_time}`)
					end_time = new Date(`${today.slice(0,10)} ${end_time}`)
				} else {
					start_time = new Date(start_time.replace(new RegExp(/-/gm), '/'))
					end_time = new Date(end_time.replace(new RegExp(/-/gm), '/'))
				}
				// 当前时间大于开始 小于结束
				if (now >= start_time.getTime() && now < end_time.getTime()) {
					let { app_id, path } = this.actInfo;
					if (app_id && path) {
						this.$openEmbeddedMiniProgram({
							appId: app_id,
							path
						});
						return;
					}
					uni.showToast({
						icon: 'none',
						title: 'appId和path不能为空'
					});
				} else if (now < start_time) {
					uni.showToast({
						icon: 'none',
						title: '活动还未开始'
					});
					return false;
				} else {
					uni.showToast({
						icon: 'none',
						title: '活动已结束'
					});
					return false;
				}
				return true;
			},
			// 获取模板id
			getWxMsgId() {
                if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
				this.$wxReportEvent('dailyredenvelope');
				this.checkActTime();
				// 暂时关闭消息模板
				return;
				let local_date = uni.getStorageSync('limitCouponWxMsgId');
				let cur_date = parseTime(Date.now(), "{y}-{m}-{d}");
				console.log("cur_date:", cur_date)
				// 今日授权过一次就不在授权
				if (local_date && cur_date == local_date) {
					this.checkActTime();
					return;
				}
				wxmsgid().then(res => {
					console.log(res)
					const accuentIds = res.data[1];
					if (accuentIds) {
						uni.requestSubscribeMessage({
							tmplIds: [accuentIds],
							complete: (event) => {
								uni.setStorageSync('limitCouponWxMsgId', cur_date);
								const resultState = event[accuentIds];
								if(resultState == 'accept') {
									this.isPowerStatus = 1;
								} else {
									this.isPowerStatus = 0;
								}
								console.log("requestSubscribeMessage", event)
								this.checkActTime()
							}
						})
						return
					}
					this.checkActTime()
				})
			}
		}
	}
</script>

<style lang="scss">
	.box {
		box-sizing: border-box;
		margin: 40rpx 24rpx 64rpx 24rpx;
	}

	.content {
		position: relative;
		box-sizing: border-box;
		height: 240rpx;
		margin-top: 32rpx;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.img-mt-coupon {
		width: 702rpx;
		height: 240rpx;
		position: absolute;
		left: 0;
		right: 0;
		margin: 0 auto;
		z-index: -1;
	}

	.progress-bar {
		width: 189rpx;
		margin-right: 170rpx;
		box-sizing: border-box;
		z-index: 1;
	}

	.progress-box {
		width: 100%;
		flex-shrink: 0;
	}

	.progress-num {
		font-size: 24rpx;
		font-weight: 400;
		color: #8a4a1e;
		margin-left: 20rpx;
	}
</style>
