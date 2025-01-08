<template>
	<view class="machine">
		<view class="flex-row-between machine-padding">
			<view class="title">{{taskReward.title}}</view>
			<view class="flex-row-between">
				<image class="icon-beans" :src="imgUrl+'/task/icon_beans.png'" mode="aspectFit" lazy-load></image>
				<view class="subtitle">{{taskReward.subtitle}}</view>
			</view>
		</view>
		<view class="machine-box">
			<!-- 标题 -->
			<view class="machine-box-title">{{ isAutoLogin ? todayEarned : 0}}牛金豆</view>
			<!-- 背景 -->
			<image class="machine-bg" src="https://file.y1b.cn/store/1-0/23713/64afec64727fe.png" mode="aspectFill"></image>
			<!-- 抽奖区块 -->
			<view class="machine-body">
				<!-- 底部背景 -->
				<image class="machine-body-bg" src="https://file.y1b.cn/store/1-0/23713/64afec9201366.png" mode="aspectFill">
				</image>
				<!-- 中讲小方块 -->
				<view v-for="item in machines" :key="item.id" class="machine-block" :class="'mbi-position'+item.id">
					<!-- 中间块 -->
					<view class="machine-block-item" v-if="item.id!==0">
						<!-- 背景 -->
						<image class="mbi-bg" :src="item.bg" mode="aspectFill"></image>
						<!-- icon -->
						<van-image class="mbi-icon" height="66rpx" width="66rpx" :src="item.icon" use-loading-slot
							fit="cover">
							<van-loading slot="loading" type="spinner" size="20" vertical />
						</van-image>
						<!-- name -->
						<view class="mni-name">
							{{item.text}}
						</view>
						<!-- 选中色块 -->
						<image class="select-box" v-show="selectIndex == item.id"
							:src="imgUrl +'/static/images/machine/machine_icon02.png'" mode="aspectFill"></image>
					</view>
					<!-- 抽奖按钮 -->
					<image v-else @click="game" class="luck-draw" :src="item.bg" mode="aspectFill"></image>
				</view>
				<!-- 戳戳戳 -->
				<image class="stamp-icon" @click="game" :class="{'open':!isLoading&&!isNoCount}"
				:src="imgUrl + 'static/network/stamp_icon.png'" mode="aspectFill"></image>
			</view>
			<!-- 滚动 -->
			<view class="win-list">
				<an-notice-bar class="win-list-box" :list="noticeList" />
			</view>
		</view>
	</view>
</template>

<script>
	import {
lottery,
lotteryOption,
lotteryToday,
showWinningInfo
} from '@/api/modules/index.js';
import anNoticeBar from '@/components/serviceCredits/an-notice-bar.vue';
import { getImgUrl } from '@/utils/auth.js';
import { mapGetters } from 'vuex';
	let speed = 100;
	let myset = null;
	let times = 0; // 轮循的次数
	let isGoing = 0; // 判断是否正在轮循，默认 否。
	let startEndTimes = 10; // 开头和结束的缓冲次数
	let startTimes = times - startEndTimes; // 开头, 轮循环次数
	let endTimes = startEndTimes; // 结束, 轮循环次数
	let pathArr = [];
	let reward = null;
	export default {
		props: {
			taskReward: {
				type: Object,
				default: () => {}
			}
		},
		components: {
			anNoticeBar
		},
        computed: {
			...mapGetters(['isAutoLogin'])
		},
		data() {
			return {
				machines: [{
						id: 1,
						text: '',
						icon: `${getImgUrl()}/static/images/machine/machine_test_icon02.png`,
						bg: `${getImgUrl()}/static/images/machine/machine_icon03.png`
					},
					{
						id: 2,
						text: '',
						icon: `${getImgUrl()}/static/images/machine/machine_test_icon02.png`,
						bg: `${getImgUrl()}/static/images/machine/machine_icon04.png`
					},
					{
						id: 3,
						text: '',
						icon: `${getImgUrl()}/static/images/machine/machine_test_icon02.png`,
						bg: `${getImgUrl()}/static/images/machine/machine_icon03.png`
					},
					{
						id: 4,
						text: '',
						icon: `${getImgUrl()}/static/images/machine/machine_test_icon02.png`,
						bg: `${getImgUrl()}/static/images/machine/machine_icon04.png`
					},
					{
						id: 0,
						bg: `${getImgUrl()}/static/images/machine/machine_icon01.png`
					},
					{
						id: 5,
						text: '',
						icon: `${getImgUrl()}/static/images/machine/machine_test_icon02.png`,
						bg: `${getImgUrl()}/static/images/machine/machine_icon03.png`
					},
					{
						id: 6,
						text: '',
						icon: `${getImgUrl()}/static/images/machine/machine_test_icon02.png`,
						bg: `${getImgUrl()}/static/images/machine/machine_icon04.png`
					},
					{
						id: 7,
						text: '',
						icon: `${getImgUrl()}/static/images/machine/machine_test_icon02.png`,
						bg: `${getImgUrl()}/static/images/machine/machine_icon03.png`
					},
					{
						id: 8,
						text: '',
						icon: `${getImgUrl()}/static/images/machine/machine_test_icon02.png`,
						bg: `${getImgUrl()}/static/images/machine/machine_icon04.png`
					}
				],
				selectIndex: 0,
				isNoCount: false,
				todayEarned: 0,
				noticeList: null,
				isLoading: false,
				imgUrl: getImgUrl()
			}
		},
		methods: {
			init() {
				if (this.isLoading) return
				this.isLoading = true
				this.isNoCount = false
				lotteryOption({
					type: 1
				}).then(res => {


					let list = res.data

					let machines = this.machines.map(function(item) {

						if (item.id !== 0) {
							let data = list[item.id - 1]

							return {
								...item,
								credits: data.credits,
								text: data.title,
								icon: data.image || item.icon
							}
						}

						return item

					})

					this.machines = machines

					this.isLoading = false

				}).catch(err => {
					this.isLoading = false
				})
				// 今日收益
				this.updateTodayEarned()
				// 中奖公告
				showWinningInfo().then(res => {
					if (res.code == 1) {
						this.noticeList = res.data;
					}
				})
			},
			game() {
                if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
				this.$wxReportEvent('dailylottery');
				if (this.isLoading) {
					return
				}
				this.isLoading = true
				lottery({
					type: 1
				}).then(res => {
					speed = 100;
					if (res.code == 1) {
						// 取任务配置：reward.cost
						this.$emit('deductBeans', this.taskReward.cost);
						reward = res.data

						pathArr = this.getPath(reward.position, 5)

						this.selectIndex = pathArr[0]

						this.startFun()

						return
					}

					uni.showToast({
						icon: 'none',
						title: res.msg
					})
					this.isLoading = false
					this.isNoCount = true
				}).catch(err => {
					this.isLoading = false
				})

			},
			startFun() {
				if (isGoing) { // 判断是否正在轮循, 是，就终止函数。
					return; // 防止重复点击
				}
				isGoing = 1;
				times = pathArr.length;
				startTimes = times - startEndTimes; // 开头, 轮循环次数
				endTimes = startEndTimes; // 结束, 轮循环次数
				myset = setTimeout(() => {
					this.goFun()
				}, speed);
			},
			goFun() {

				this.selectIndex = pathArr[pathArr.length - times]

				times--;

				if (times >= startTimes) { // 开始阶段，speed 加速，减少值
					speed -= 1;
				}
				if (times <= endTimes) { // 结束阶段，speed 减速，增加值
					speed += 55
				}
				if (times <= 0) { // 次数完毕，结束轮循
					isGoing = 0;
					clearTimeout(myset); // 停止计时器，释放资源
					this.showReward()
					this.resetGame()
					return false; // 终止函数运行，结束循环。
				}
				myset = setTimeout(() => {
					this.goFun()
				}, speed);
			},
			resetGame() {
				clearTimeout(myset);
				speed = 250;
				myset = null;
				times = 0; // 轮循的次数
				isGoing = 0; // 判断是否正在轮循，默认 否。
				startEndTimes = 10; // 开头和结束的缓冲次数
				startTimes = times - startEndTimes; // 开头, 轮循环次数
				endTimes = startEndTimes; // 结束, 轮循环次数
				pathArr = []
				reward = null
			},
			showReward() {

				if (!reward.credits && !reward.coupon_id) {
					this.$emit('refresh')
				}

				let type = 3

				let btnText = '我知道了'

				if (reward.credits && reward.type == 1) {
					type = 1
					// btnText = reward.times > 0 ? '继续抽奖' : '我知道了'
					btnText = '开心收下';
				}

				if (reward.coupon_id && reward.type == 2) {
					type = 2
					btnText = '开心收下'
				}
				this.isLoading = false
				this.init();
				this.$emit('showAwardModel', 'CREDITS_DOUBLE', {
					type,
					coupon_id: reward.coupon_id,
					coupon_title: reward.coupon_title,
					title: type < 3 ? '恭喜中奖啦' : '别灰心',
					tips: '剩余抽奖次数：' + reward.times,
					btnText,
					reward: reward.credits,
					failMsg: '哎呀，就差那么一点点~'
				})
				// this.$emit('showAwardModel','CREDITS_DOUBLE',{
				// 	type:reward.credits?1:2,
				// 	title:reward.credits?'恭喜中奖啦':'别灰心',
				// 	tips:'剩余抽奖次数：'+reward.times,
				// 	btnText:reward.times>0?'继续抽奖':'我知道了',
				// 	reward:reward.credits,
				// 	failMsg:'哎呀，就差那么一点点~'
				// })

			},
			/*跑马灯*/
			getPath(curr, circle = 4) {

				let arr = []

				for (let i = 0; i < circle; i++) {
					arr = arr.concat([1, 2, 3, 4, 5, 6, 7, 8])
				}

				for (let i = 1; i <= curr; i++) {
					arr.push(i)
				}

				return arr
			},
			// 更新今日收益
			updateTodayEarned() {
				// 今日收益
				lotteryToday().then(res => {
					if (res.code == 1) {
						this.todayEarned = res.data;
					}
				})
			}
		},
		beforeDestroy() {
			clearTimeout(myset)
		}
	}
</script>

<style lang="scss">
	.machine {
		padding: 0 12rpx;
		margin-bottom: 64rpx;
	}

	.machine-padding {
		padding: 4rpx 12rpx 0;
	}

	.machine-box-title {
		font-size: 24rpx;
		font-family: Barlow, Barlow-5;
		font-weight: 400;
		color: #85462e;
		line-height: 28rpx;
		letter-spacing: 0.52px;
		position: absolute;
		top: 22rpx;
		right: 132rpx;
		z-index: 1;
	}

	.machine-box {
		margin-top: 22rpx;
		width: 726rpx;
		height: 770rpx;
		position: relative;

		.machine-bg {
			width: 726rpx;
			height: 770rpx;
			position: absolute;
			left: 0;
			top: 0;
		}

		.machine-body {
			position: absolute;
			width: 552rpx;
			height: 482rpx;
			top: 182rpx;
			left: 88rpx;
			right: 86rpx;
		}

		.machine-body-bg {
			position: absolute;
			width: 552rpx;
			height: 482rpx;
			top: 0;
			left: 0;
		}

		.machine-block {
			width: 160rpx;
			height: 132rpx;
			position: absolute;
		}

		.machine-block-item {
			width: 160rpx;
			height: 132rpx;
			position: relative;
		}

		.mbi-bg,
		.luck-draw {
			width: 160rpx;
			height: 132rpx;
			position: absolute;
			top: 0;
			left: 0;
		}

		.mbi-position1 {
			top: 28rpx;
			left: 25rpx;
		}

		.mbi-position2 {
			top: 28rpx;
			left: 197rpx;
		}

		.mbi-position3 {
			top: 28rpx;
			left: 369rpx;
		}

		.mbi-position4 {
			top: 172rpx;
			left: 369rpx;
		}

		.mbi-position5 {
			top: 316rpx;
			left: 369rpx;
		}

		.mbi-position6 {
			top: 316rpx;
			left: 197rpx;
		}

		.mbi-position7 {
			top: 316rpx;
			left: 25rpx;
		}

		.mbi-position8 {
			top: 172rpx;
			left: 25rpx;
		}

		.mbi-position0 {
			top: 172rpx;
			left: 197rpx;
		}

		.select-box {
			width: 160rpx;
			height: 132rpx;
			position: absolute;
			z-index: 1;
			transition: all 0.2s;
		}

		.mbi-icon {
			position: absolute;
			top: 8rpx;
			left: 50%;
			transform: translateX(-50%);
			z-index: 1;
		}

		.mni-name {
			width: 100%;
			font-size: 24rpx;
			font-weight: 500;
			color: #c05c08;
			line-height: 34rpx;
			letter-spacing: 0.52px;
			position: absolute;
			bottom: 4rpx;
			left: 50%;
			transform: translateX(-50%);
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			text-align: center;
		}

		.win-list {
			position: absolute;
			top: 100rpx;
			left: 160rpx;
			width: 410rpx;
			overflow: hidden;
			display: flex;
			justify-content: center;
		}

		.win-list-box {
			flex: 1;
		}

		.stamp-icon {
			position: absolute;
			width: 66rpx;
			height: 68rpx;
			right: 170rpx;
			bottom: 160rpx;
			animation: stampAnim 1s ease-in 0s infinite backwards;
			transition: opacity 0.3s;
			opacity: 0;
		}

		.stamp-icon.open {
			opacity: 1;
		}

		@keyframes stampAnim {
			0% {
				transform: translate(0, 0);
			}

			20% {
				transform: translate(-30rpx, -30rpx);
			}

			40% {
				transform: translate(0, 0);
			}

			60% {
				transform: translate(-30rpx, -30rpx);
			}

			80% {
				transform: translate(0, 0);
			}

			// 100% {
			// 	transform: translate(-30rpx, -30rpx);
			// }
		}
	}
</style>
