
<template>
<view class="ser_credits">
<van-popup
	:show="isShow"
	position="bottom"
	custom-style="overflow: inherit;background: #fff;height:1044rpx"
	round
	z-index="100"
	safe-area-inset-bottom
	@close="popupClose"
	lock-scroll="true"
	:catchtouchmove="true"
>
<image class="service_light" @click="popupClose"  src="https://file.y1b.cn/store/1-0/2369/6482d17300947.png" mode="scaleToFill"></image>
<view class="cont_box">
	<image class="service_bg" src="https://file.y1b.cn/store/1-0/2369/6482d10d546c0.png" mode="scaleToFill"></image>
	<view class="cont_title">
		<view class="cont_title-left">
			<view class="service_title_left"></view>
			<view class="my_beans">
				<p-countup :num="userInfo.credits || 0" width="11" height='18' color="#FE9B22" fontSize="18" fontWeight="600">
				</p-countup>
			</view>
		</view>
		<image class="close_box-icon" :src="imgUrl+'/static/component/close.png'" mode="scaleToFill" @click="popupClose"></image>
	</view>
	<swiper
		class="swiper_box"
		@change="swiperChange"
		:autoplay="false"
		:interval="5000"
		:duration="500"
		:current="currIndex"
	>
		<swiper-item class="swiper-item">
			<!-- 看视频奖励 -->
			<videoReward
				v-if="taskReward['WATCH_VIDEO'].isShow"
				ref="videoReward"
				:taskReward="taskReward['WATCH_VIDEO']"
				@showAd="showAdHandle">
			</videoReward>
		</swiper-item>
		<swiper-item class="swiper-item">
			<machine
				v-if="taskReward['WATCH_VIDEO'].isShow"
				ref="machine"
				:taskReward="taskReward['CREDITS_DOUBLE']"
				@showAwardModel="startAnimHandle"
			></machine>
		</swiper-item>
	</swiper>
	<view class="spot-box">
		<view :class="['spot_item', currIndex==index? 'active' : '']"
			v-for="(item,index) in spotLength" :key="index"
		></view>
	</view>
</view>
</van-popup>
<!-- 开心收豆 -->
<happy-harvest ref="happyHarvest" @startAnim="showCowpeaAnim"/>
<!-- 牛金豆翻倍 -->
<cowpea-double ref="cowpeaDouble" @startAnim="showCowpeaAnim"/>
</view>
</template>

<script>
import machine from './machine.vue';
import videoReward from './videoReward.vue';
import happyHarvest from './popup/happyHarvest.vue';
import cowpeaDouble from './popup/cowpeaDouble.vue';
import {getImgUrl} from '@/utils/auth.js';
import { mapGetters, mapActions } from 'vuex';
import pCountup from '@/components/p-countUp/countUp.vue';
import {
	taskReward,
	videoAward
} from '@/api/modules/task.js'
// 观看视频签名
let _verify = null;
export default {
	props: {
		isShow: {
			type: Boolean,
			default: false
		}
	},
	components: {
		machine,
		videoReward,
		happyHarvest,
		cowpeaDouble,
		pCountup
	},
	watch: {
		isShow(newValue, oldValue) {
			if(!newValue || this.taskReward) return;
			this.init();
		}
	},
	data(){
		return {
			imgUrl: getImgUrl(),
			currIndex: 0,
			taskReward: null,
			showList: ['CREDITS_DOUBLE','WATCH_VIDEO'],
			spotLength: 0,
		}
	},
	computed: {
		...mapGetters(['userInfo']),
	},
	mounted() {
		// this.init();
	},
	methods:{
		...mapActions({
			getUserInfo: 'user/getUserInfo',
		}),
		popupClose() {
			this.$emit('close');
		},
		swiperChange(e){
			this.currIndex = e.detail.current;
		},
		setSwiperNum(num) {
			this.currIndex = num || 0;
		},
		showCowpeaAnim(){
			this.getUserInfo();
		},
		init() {
			taskReward().then(res => {
				let o = {}
				res.data.forEach(item => {
					o[item.tag] = {
						cost: item.cost,
						credits: item.credits,
						isShow: Boolean(item.status),
						title: item.title,
						subtitle: item.subtitle,
						article_url: item.article_url || '',
						image: item.image || ''
					}
				})
				this.taskReward = o;
				// 更新拉环组件数据
				this.initCommon();
			});
		},
		initCommon(){
			wx.nextTick(() => {
				Object.keys(this.$refs).forEach((key) => {
					if (this.$refs[key].init) {
						this.$refs[key].init();
					}
				});
				let spotLength = 0;
				Object.keys(this.taskReward).forEach(key => {
					// 包括并且打开的情况下
					if(this.showList.includes(key) && this.taskReward[key].isShow){
						spotLength ++;
					}
				});
				this.spotLength= spotLength;
			});
		},
		// 视频播放的事件
		showAdHandle(){
			videoAward({ type: 1 }).then(res => {
				_verify = res.data;
				this.$emit('showAdPlay');
			});
		},
		// 视频播放完成
		finishAdPlay(){
			videoAward({
				type: 2,
				verify: _verify
			}).then(res => {
				if (res.data > 0) {
					// 启用动画
					this.$refs.happyHarvest.show({
						title: '恭喜您',
						reward: res.data
					});
				}
			});
		},
		startAnimHandle(key, data) {
			switch (key) {
				case 'CREDITS_DOUBLE':
					this.$refs.cowpeaDouble.popupShow(data);
					break;
			}
		},
	}
}
</script>

<style lang="scss" scoped>
.my_beans {
	display: flex;
	align-items: center;
	transition: opacity .5s;
	min-width: 200rpx;
	box-sizing: border-box;
	padding-left: 20rpx;
	padding-right: 32rpx;
	height: 64rpx;
	font-size: 36rpx;
	font-weight: 600;
	text-align: center;
	color: #fe9b22;
	background: rgba(255,255,255,0.50);
	border: 2rpx solid  rgba(255,255,255,0.35);
	border-radius: 34rpx;
	position: relative;
	margin-top: 20rpx;
	margin-left: 40rpx;
	&::before {
		content: '\3000';
		width: 66rpx;
		height: 62rpx;
		margin-top: 5rpx;
		background: url("https://file.y1b.cn/public/img/ttxl/static/shopMall/beans-icon.png") center / contain no-repeat;
	}
	&::after {
		content: '';
		position: absolute;
		width: 100%;
		height: 6rpx;
		// background: linear-gradient(180deg,#f9e8d8, #ea8b2e);
		background: rgba(255,255,255,0.40);
		border-radius: 50%;
		filter: blur(2rpx);
		bottom: -6rpx;
		left: 50%;
		transform: translateX(-50%);
	}
	.my_beans-icon {
		width: 66rpx;
		height: 62rpx;
		margin-top: 5rpx;
	}
}
.spot-icon{
	width: 20rpx;
	height: 10rpx;
}
.ser_credits{
	position: fixed;
	top: 0;
	left: 0;
	z-index: 99999999;
}
.cont_title {
	position: relative;
	z-index: 1;
	display: flex;
	justify-content: space-between;
	.cont_title-left {
		display: flex;
		align-items: flex-start;
		.service_title_left{
			display: flex;
			&::before {
				content: '\3000';
				background: url("https://file.y1b.cn/store/1-0/23714/64b0a45bd2e93.png") center / contain no-repeat;
				display: block;
				width: 194rpx;
				height: 208rpx;
				margin-top: -76rpx;
			}
			&::after {
				content: '\3000';
				background: url("https://file.y1b.cn/store/1-0/23714/64b0a46b43526.png") center / contain no-repeat;
				display: block;
				width: 186rpx;
				height: 44rpx;
				margin-top: 34rpx;
			}
		}
	}
	.close_box-icon {
		width: 30rpx;
		height: 32rpx;
		padding: 32rpx 40rpx 0 0;
	}
}
.swiper_box{
	width: 100%;
	height: 770rpx;
}
.cont_box {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	position: relative;
	z-index: 0;
	.service_bg {
		position: absolute;
		z-index: -1;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}
}
.service_light{
	width: 1388rpx;
	height: 1218rpx;
	position: absolute;
	left: 50%;
	top: -50%;
	transform: translateX(-50%);
}
.service_title {
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 28rpx;
	color: #ffffff;
	line-height: 40rpx;
	margin-top: 34rpx;
	.service_title-icon {
		width: 28rpx;
		height: 36rpx;
		margin-right: 12rpx;
	}
}
.spot-box {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 32rpx;
	.spot_item {
		width: 22rpx;
		height: 12rpx;
		background: #e1e1e1;
		border-radius: 8rpx 4rpx;
		margin: 0 4rpx;
		&.active {
			width: 40rpx;
			background: #f1423a;
		}
	}
}

</style>