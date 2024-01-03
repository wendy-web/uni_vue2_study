<template>
<view class="myCredit">
<mescroll-uni
	:fixed="true"
	ref="mescrollRef"
	@init="mescrollInit"
	@down="downCallback"
	@up="upCallback"
>
	<!-- 背景与导航栏 -->
	<xh-navbar
		navbarImage="https://file.y1b.cn/store/1-0/231116/6555c5f2c8874.png"
		:fixed="true"
		navbarImageMode="widthFix"
  		:overFlow="true"
		titleColor="#fff"
		leftImage="/static/images/back_01.png"
		fixedNum="true"
		title="赚积分"
		@leftCallBack="$back"
	></xh-navbar>
	<!-- 顶部背景 -->
	<image class="my_credit_nav" src="https://file.y1b.cn/store/1-0/231116/6555c5f2c8874.png" mode="aspectFill">
	</image>
	<view class="my_credit-box">
		<view class="my_credit">
			<image class="my_credit_icon" src="../static/credit/my_credit_icon.png" mode="aspectFill"></image>
			我的积分
		</view>
		<view class="my_credit_num"  @click="goCreditRecord">
			{{userInfo.credits}}
			<van-icon name="arrow" color="#fff" size="12" />
		</view>
	</view>
	<view class="sign_box" @click="doSignHandle">
		<image class="sign_icon" src="../static/credit/sign_icon.png" mode="aspectFill"></image>
		<view class="sign_title">
			已连续签到<text class="sign_title-num">{{ signDay }}</text>天
		</view>
		<view class="sign_day">
			<view class="day_item" v-for="(item, index) in signListArray" :key="index">
				<view :class="['day_box', item.cur ? 'day-active' : '']">
					<image class="day_icon" src="../static/credit/day_icon.png" mode="aspectFill"></image>
					{{ item.credits }}
				</view>
				<view class="day_txt">
					{{ item.cur ? '已签' : `${index+1}天` }}
				</view>
			</view>
		</view>
		<view :class="['sign_btn', is_sign ? 'btn-active': '']" >
			{{ is_sign ? '已签到' : '立即签到'}}
		</view>
	</view>
	<view class="play_title pd_32">
		<view class="play_title-left">玩赚积分</view>
		<!-- <view class="play_title-right">每天0点更新</view> -->
	</view>
	<view class="play_box">
		<view
			class="play_item"
			v-for="(item, index) in taskListArray"
			:key="index"
			@click="taskHandle(item)"
		>
			<view class="play_item-left">
				<view class="play_left-img">
					<image class="play_img-icon" src="../static/credit/play_icon.png" mode="aspectFill"></image>
				</view>
				<view class="play_txt">
					<view class="play_txt-title">{{ item.title }}</view>
					<!-- <view class="play_txt-rem" v-if="item.style == 3 && item.reward">有机会拿{{item.reward}}积分哦</view> -->
					<view class="play_txt-rem" v-if="item.style == 2 && item.reward">
						<view class="concern_num">
							<image class="concern_icon" src="../static/credit/my_credit_icon.png" mode="aspectFill"></image>
							+{{ item.reward }}
						</view>
						积分
					</view>
					<view class="play_txt-rem" v-else>{{item.intro}}</view>
				</view>
			</view>
			<view :class="['play_btn', item.use ? 'active' : '']">
				{{item.btn_name}}
			</view>
		</view>
	</view>
	<!-- 猜你喜欢的优惠券列表 -->
	<you-like-good-list />
	<!-- 幸运大转盘 -->
	<lucky-wheel :isShow="isShowLucky" @close="closeLuckyHandle" />
	<attention-code :isShow="isAttentionCode" @close="closeLuckyHandle" />
</mescroll-uni>
</view>
</template>
<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { mapGetters, mapActions } from 'vuex';
import {
	signList,
	doSign,
	taskIndex,
	doTask
} from "@/api/modules/myCredit.js";
import createRewardVideoAd from "@/utils/createRewardVideoAd.js";
import adunitId from "@/static/js/adunitId.js"
import youLikeGoodList from '@/components/youLikeGoodList.vue';
import luckyWheel from './luckyWheel.vue';
import attentionCode from './attentionCode.vue';
	export default {
		mixins: [MescrollMixin], // 使用mixin
		components: {
			youLikeGoodList,
			luckyWheel,
			attentionCode
		},
		computed: {
			...mapGetters(["userInfo", 'isAutoLogin']),
		},
		data() {
			return {
				_RewardedVideoAd: null,
				isShowLucky: false,
				isAttentionCode: false,
				signListArray: [],
				taskListArray: [],
				signDay: 0,
				is_sign: 0, // 今日是否签到
				task_id: 0, // 签到接口任务的id
				is_power: 0, // 任务授权id
				adUnitId: adunitId.myCreditId, // 视频初始化的Id
				doTaskId: 0
			}
		},
		onLoad() {
			this.initRewardedVideoAd();
		},
		onUnload() {
			this._RewardedVideoAd.videoAdDestroy();
		},
		methods: {
			...mapActions({
				getUserInfo: 'user/getUserInfo',
			}),
			closeLuckyHandle(){
				this.isShowLucky = false;
			},
			async initRewardedVideoAd() {
				this._RewardedVideoAd = createRewardVideoAd(
					this.adUnitId,
					(status) => {
						this.finishPlay();
					}
				);
				this._RewardedVideoAd.videoAdCreate();
			},
			finishPlay() {
				// 视频播放完后执行的事件
				doTask({
					task_id: this.doTaskId
				}).then(res => {
					if(res.code == 1) {
						uni.showToast({
							title: res.msg,
							icon: 'none',
							duration: 2000
						});
						this.getTaskList();
						this.getUserInfo(); //获取用户信息
						this.mescroll.resetUpScroll();
					}
				});
			},
			// 执行任务列表
			taskHandle(item) {
                if(!this.isAutoLogin) return this.$go('/pages/login/index');
				const {
					id,
					use,
					style
				} = item;
				this.doTaskId = id;
				if(!use) return;
				switch(style) {
					case 0:
						// 幸运大转盘
						// this.isShowLucky = true;
						break;
					case 2:
						// 关注公众号
						break;
					case 3:
						// 视频播放
						this._RewardedVideoAd.videoPlay();
						break;
				}
			},
			// 下拉刷新
			downCallback() {
      			// this.mescroll.resetUpScroll();
				Promise.all([
					this.getSignList(),
					this.getTaskList()
				]).then(res => {
					this.mescroll.endSuccess();
				}).catch(error => {
					this.mescroll.endErr();
				});
			},
			// 得到签到列表
			async getSignList() {
				const result = await signList();
				if(!result.code) return;
				const { data } = result;
				this.signListArray = data.list;
				this.signDay = data.day;
				this.is_sign = data.is_sign;
				this.task_id = data.task_id;
				return true;
			},
			// 得到任务列表
			async getTaskList() {
				const result = await taskIndex();
				if(!result.code) return;
				this.taskListArray = result.data;
				return true;
			},
			doSignHandle() {
                if(!this.isAutoLogin) return this.$go('/pages/login/index');
				if(this.is_sign) return; // 今日已签到
				// uni.requestSubscribeMessage({
				// 	tmplIds:[accuentIds],
				// 	complete:(event)=>{
				// 		const resultState = event[accuentIds];
				// 		if(resultState == 'accept') {
				// 			this.is_power = 1;
				// 		} else {
				// 			this.is_power = 0;
				// 		}
				// 	}
				// });
				doSign({
					task_id: this.task_id,
					is_power: this.is_power
				}).then(res => {
					console.log('res :>> ', res);
					if(!Number(res.code)) return;
					this.getSignList();
					this.getUserInfo(); //获取用户信息
					uni.showToast({
						icon:'none',
						title:'签到成功'
					});
				});
			},
			goCreditRecord() {
                if(!this.isAutoLogin) return this.$go('/pages/login/index');
				uni.navigateTo({
					url: "/pages/mineModule/creditRecord/index",
				});
			},
			navBack() {
				uni.navigateBack({
					fail() {
						uni.reLaunch({ url: "/pages/home/index" });
					},
				});
			},
		}
	}
</script>

<style lang="scss">
page {
	background: #F5F5F5;
}
.myCredit {
	font-size: 28rpx;
	color: #333;
}
.my_credit_nav {
	width: 100%;
	height: 418rpx;
	position: absolute;
	top: 0;
	left: 0;
	z-index: -1;
}
.nav-left {
	font-size: 36rpx;
	font-family: PingFang SC, PingFang SC-Medium;
	font-weight: 500;
	color: #ffffff;
	display: flex;
	align-items: center;
}
.my_credit-box {
	padding: 42rpx 32rpx 22rpx;
	.my_credit{
		font-size: 32rpx;
		color: #ffffff;
		line-height: 44rpx;
		display: flex;
		align-items: center;
	}
	.my_credit_icon {
		width: 44rpx;
		height: 44rpx;
		margin-right: 8rpx;
	}
	.my_credit_num{
		margin-left: 52rpx;
		font-size: 68rpx;
		font-weight: 500;
		color: #ffffff;
		line-height: 82rpx;
		display: flex;
		align-items: center;
		margin-top: 10rpx;
		view {
			margin-left: 8rpx;
		}
	}
}
.sign_box,
.play_box {
	width: 686rpx;
	background: #ffffff;
	border-radius: 16rpx;
	position: relative;
	margin: 0 auto;
}
.sign_box{
	padding-bottom: 32rpx;
}
.sign_icon{
	width: 286rpx;
	height: 228rpx;
	position: absolute;
	right: 4rpx;
	top: -160rpx;
}
.sign_title{
	background-color: #FEF7DA;
	line-height: 82rpx;
	padding: 0 32rpx;
	border-radius: 16rpx 16rpx 0 0;
	font-size: 30rpx;
	.sign_title-num{
		margin: 0 10rpx;
		color:#EF2B20;
	}
}
.sign_day {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 26rpx;
	margin-top: 40rpx;
	.day_box{
		width: 80rpx;
		height: 80rpx;
		position: relative;
		z-index: 0;
		line-height: 65rpx;
		text-align: center;
		font-size: 32rpx;
		font-weight: 500;
		color: #f34d14;
		&.day-active {
			opacity: .5;
		}
		.day_icon{
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
			width: 100%;
			height: 100%;
		}
	}
	.day_txt{
		font-size: 26rpx;
		text-align: center;
		color: #666666;
		line-height: 36rpx;
	}
}
.sign_btn {
	width: 432rpx;
	line-height: 84rpx;
	background: #ef2b20;
	border-radius: 42rpx;
	font-size: 32rpx;
	font-weight: 500;
	text-align: center;
	color: #ffffff;
	margin: 58rpx auto 0;
	&.btn-active {
		opacity: 0.5;
	}
}
.pd_32{
	padding: 0 32rpx;
}
.play_title{
	margin: 60rpx auto 24rpx;
	font-size: 32rpx;
	font-weight: 500;
	color: #333333;
	line-height: 44rpx;
	display: flex;
	justify-content: space-between;
	.play_title-right {
		font-size: 26rpx;
		font-weight: 400;
		color: #999999;
		line-height: 36rpx;
	}
}
.play_box{
	padding: 0 28rpx 0 24rpx;
	box-sizing: border-box;
	.play_item{
		padding: 32rpx 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		&:not(:last-child) {
			border-bottom: 2rpx solid #F5F5F5;
		}
		.play_item-left{
			display: flex;
			align-items: center;
			.play_left-img {
				width: 96rpx;
				height: 96rpx;
				background: linear-gradient(180deg,#fff7da, #ffebb3);
				border-radius: 16rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 16rpx;
				.play_img-icon{
					width: 72rpx;
					height: 80rpx;
				}
			}
			.play_txt {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-self: stretch;
				.play_txt-title {
					font-size: 28rpx;
					font-weight: 500;
					color: #333333;
					line-height: 40rpx;
				}
				.play_txt-rem {
					font-size: 26rpx;
					color: #aaaaaa;
					line-height: 36rpx;
					display: flex;
					align-items: center;
					@include line-clamp;
					.concern_num {
						display: flex;
						align-items: center;
						color: #666666;
						margin-right: 8rpx;
						.concern_icon{
							width: 40rpx;
							height: 40rpx;
							margin-right: 8rpx;
						}

					}
				}
			}
		}
		.play_btn {
			min-width: 88rpx;
			line-height: 56rpx;
			border: 2rpx solid #f5f5f5;
			border-radius: 32rpx;
			font-size: 32rpx;
			text-align: center;
			padding: 0 24rpx;
			background: #f5f5f5;
			color: #BBBBBB;
			white-space: nowrap;
			&.active {
				border: 2rpx solid #f34d14;
				color: #f34d14;
				background: transparent;
			}
		}
	}
}

.discount-put {
	margin-top: 32rpx;
}

.discount-put-box {
	padding: 0 24rpx;
	margin-bottom: 8rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.discount-put-title {
	font-size: 32rpx;
	font-family: PingFang SC, PingFang SC-6;
	font-weight: 600;
	color: #333333;

}

.discount-put-more {
	font-size: 24rpx;
	font-family: PingFang SC, PingFang SC-Regular;
	font-weight: 400;
	color: #999999;
}
</style>