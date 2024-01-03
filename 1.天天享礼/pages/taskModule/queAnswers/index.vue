<template>
	<view class="que-answers">
		<!-- 背景与导航栏 -->
		<xh-navbar>
			<view slot="title" class="nav-left" @click="navBack">
				<van-icon name="arrow-left" color="#ffffff" size="24" />
			</view>
		</xh-navbar>
		<!-- 背景 -->
		<image class="que-answers-bg" src="../static/que_answers_bg.png" mode="aspectFill"></image>
		<!-- icon -->
		<image class="que-card" src="../static/que_card.png" mode="aspectFill"></image>
		<!-- que-list -->
		<view class="que-box">
			<!-- 背景 -->
			<image class="que-box-bg" src="../static/que_answers_card.png" mode="aspectFill"></image>
			<!-- head -->
			<view class="que-box-head">
				<!-- 头部 -->
				<view class="qbh-top">
					<view class="qbh-top-left">
						<text class="qtl-label">闯关进度</text>
						<text class="qtl-curr-num">{{currIndex+1}}/</text>
						<text class="qtl-all-num">{{size}}</text>
					</view>
					<view class="qbh-top-right">
						<text class="qtr-label">已获得牛金豆：</text>
						<text class="qtr-num">{{cowpea}}</text>
					</view>
				</view>
				<!-- 进度 -->
				<view class="progress-box">
					<view class="progress" :style="{width:(currIndex+1)/size*100+'%'}"></view>
				</view>
			</view>
			<!-- 题目 -->
			<view class="topic-info">
				{{currData.title}}
			</view>
			<!-- 选项 -->
			<view class="option-item" v-for="(item,index) in currData.options" :key="item.id" @click="select(item)">
				<!-- 正确背景 -->
				<view class="oi-right-bg" v-if="item.isCheck&&item.right">
					<!-- bg -->
					<image class="bg" src="../static/que_selcet_ok.png" mode="aspectFill"></image>
					<!-- icon -->
					<image class="icon" src="../static/que_answers_icon01.png" mode="aspectFill"></image>
					<!-- 选项 -->
					<text class="option-item-text">{{prefix[index]}}{{item.option}}</text>
					<!-- 豆子 -->
					<view class="cowpea">
						<image v-if="currCowpea>0" class="cowpea-icon" src="../static/que_answers_icon02.png"
							mode="aspectFill"></image>
						<text v-if="currCowpea>0" class="cowpea-num">+{{currCowpea}}</text>
					</view>
				</view>
				<!-- 错误背景 -->
				<view class="oi-err-bg" v-else-if="item.isCheck&&!item.right">
					<van-icon class="err-icon" name="cross" color="#ffffff" />
					<text class="option-item-text">{{prefix[index]}}{{item.option}}</text>
				</view>
				<!-- 正常背景 -->
				<view class="oi-bg" v-else>
					<text class="option-item-text">{{prefix[index]}}{{item.option}}</text>
				</view>
			</view>
			<!-- 结果展示 -->
			<view class="que-result" v-if="isLookResult">
				<!-- 背景 -->
				<image class="que-result-bg" src="../static/sucess_bg.png" mode="aspectFill"></image>
				<!-- 全对 -->
				<view class="que-result-box" v-if="rightNum === size">
					<view class="qrb-title">
						<text>哇塞，太厉害了</text>
						<image class="all-pairs-icon" src="../static/que_answers_icon04.png" mode="aspectFill"></image>
					</view>
					<view class="all-pairs-cowpea">
						<image class="apc-icon" src="../static/que_answers_cowpea01.png" mode="aspectFill"></image>
					</view>
					<view class="qrb-tips">
						你已经击败了99%的人
					</view>
				</view>
				<!-- 一题未对 -->
				<view class="que-result-box" v-else-if="rightNum === 0">
					<view class="qrb-title">
						<text>挑战失败</text>
					</view>
					<view class="pairs-empty">
						<image class="apc-empty-icon" :src="imgUrl+'/static/images/img_no_data.png'" mode="aspectFill"></image>
					</view>
					<view class="qrb-tips">
						不要气馁，明天再来
					</view>
				</view>
				<!-- 答对部分 -->
				<view class="que-result-box" v-else>
					<view class="qrb-title">
						<text>挺厉害呀</text>
					</view>
					<view class="pairs-cowpea">
						<image class="pairs-cowpea-icon" src="../static/que_answers_cowpea02.png" mode="aspectFill">
						</image>
					</view>
					<view class="qrb-tips">
						共答对{{rightNum}}题，获得{{cowpea}}牛金豆
					</view>
				</view>
			</view>
		</view>
		<!-- 操作按钮 -->
		<view class="topic-tools" v-if="currData.isCheck">
			<view class="revealed-btn" v-if="!currData.isRight&&!isLookResult&&awards>0" @click="revealed">
				<image class="revealed-bg" src="../static/revealed.png" mode="aspectFill"></image>
				<image class="revealed-icon" src="../static/revealed_icon.png" mode="aspectFill"></image>
				<text>偷偷看提示</text>
			</view>
			<view class="next_que" @click="next" v-if="currIndex<size-1">
				<!-- 背景 -->
				<image class="next-que-bg" src="../static/next_que.png" mode="aspectFill"></image>
				<text>下一关</text>
			</view>
			<view class="next_que" v-else-if="currIndex===size-1&&!isLookResult" @click="lookResult">
				<!-- 背景 -->
				<image class="next-que-bg" src="../static/next_que.png" mode="aspectFill"></image>
				<text>查看战绩</text>
			</view>
			<view class="next_que" v-else @click="goTask">
				<!-- 背景 -->
				<image class="next-que-bg" src="../static/next_que.png" mode="aspectFill"></image>
				<text>继续拿奖</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		quiz,
		quizAnswer,
		revealTimes,
		quizReveal
	} from '@/api/modules/index.js';
	import RewardedVideoAd from '@/utils/rewardVideoAd.js';
	import {getImgUrl} from '@/utils/auth.js';
	//总题数
	let _topicList = [];
	//已答題記錄
	let _answer = [];
	//正在處理
	let _isLoading = false
	//激励视频实例
	let _RewardedVideoAd = null
	//自动下一题
	let _nextAuto = null
	//今日已达次数
	let answered = 0
	export default {
		data() {
			return {
				imgUrl: getImgUrl(),
				cowpea: 0, //已获得牛金豆
				size: 0, //题目数
				rightNum: 0,
				currIndex: 0, //当前题下标
				currCowpea: 0,
				currData: { //当前题目
					id: 1,
					title: "",
					isCheck: true,
					options: []
				},
				prefix: ['A.', 'B.', 'C.', 'D.'],
				isLookResult: false,
				awards: 0 //解密次数
			}
		},
		onLoad(o) {
			answered = +o.answered
			//初始化游戲
			this.initGame()
			/*初始化激励视频*/
			this.initRewardedVideoAd()
			//獲取獎勵次數
			revealTimes().then(res => {
				if (res.code == 1) this.awards = res.data
			})
		},
		methods: {
			initGame() {
				//數據重置
				this.cowpea = 0
				this.size = 0
				this.currIndex = 0
				this.isLookResult = false
				this.currData = {
					id: 1,
					title: '',
					isCheck: false,
					isRight: false,
					options: []
				}
				_isLoading = false
				_answer = []
				_topicList = []
				//獲取需要答的題目
				quiz().then(res => {

					let list = res.data ? res.data.quiz : []

					_topicList = list.map(function(item) {
						return {
							...item,
							isCheck: false,
							isRight: false
						}
					})

					this.size = _topicList.length

					this.currIndex = answered || 0

					if (this.size > 0) this.goMame()

				})
			},
			goMame() {
				let data = _topicList[this.currIndex]

				data.options = data.options.map(item => {

					return {
						...item,
						isCheck: false
					}
				})

				data.isCheck = false

				this.currData = data
			},
			next() {
				/*防止用户手速过快*/
				clearTimeout(_nextAuto)
				//判断是否还有下一题
				if (this.currIndex < this.size - 1) {
					this.currIndex++
					this.goMame()
					_isLoading = false
					return
				}
			},
			select(item) {
				//處理完才能點
				if (_isLoading) return

				//處理中狀態
				_isLoading = true

				quizAnswer({
					quiz_id: item.quiz_id,
					option_id: item.id
				}).then(res => {
					if (res.code == 1) {
						let {
							right,
							award
						} = res.data
						item.isCheck = true
						item.right = right === 1
						this.cowpea += award
						this.currCowpea = award
						this.currData.isRight = item.right
						this.currData.isCheck = true
						if (item.right) this.rightNum++
						return
					}

					uni.showToast({
						icon: 'none',
						title: res.msg
					})

				})
			},
			lookResult() {
				console.log('this.rightNum=', this.rightNum)
				this.isLookResult = true

			},
			revealed() {
				_RewardedVideoAd.show()
			},
			/*揭秘*/
			initRewardedVideoAd() {
				_RewardedVideoAd = RewardedVideoAd('adunit-d707d3a2c5959b56', (res) => {
					if (res) {
						this.currData.options = this.currData.options.map(function(item) {
							if (item.right) {
								return {
									...item,
									isCheck: true
								}
							}
							return {
								...item
							}
						})
						/*更新次数*/
						quizReveal().then(res => {})
						this.awards++
					}
				})
				_RewardedVideoAd.init({
					errMsg: '视频跑丢了，请稍后再试~'
				})
			},
			navBack() {
				uni.navigateBack({
					fail() {
						uni.switchTab({
							url: '/pages/tabBar/shopMall/index'
						})
					}
				})
			},
			goTask() {
				uni.reLaunch({
					url: '/pages/tabBar/task/index'
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		font-family: PingFang SC, PingFang SC-5;
	}

	.que-answers-bg {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		height: auto;
		width: 100%;
		z-index: -1;
	}

	.nav-left {
		position: absolute;
		left: 0;
		padding: 0 24rpx;
		top: 50%;
		transform: translateY(-50%);
	}

	.que-card {
		width: 732rpx;
		height: 404rpx;
		position: relative;
		left: 4rpx;
		top: 30rpx;
	}

	.que-box {
		width: 650rpx;
		height: 812rpx;
		position: relative;
		left: 64rpx;
		z-index: 1;
		margin-top: -105rpx;
	}

	.que-box-bg,
	.que-result,
	.que-result-bg {
		width: 650rpx;
		height: 812rpx;
		position: absolute;
		left: 0;
		top: 0;
		z-index: -1;
	}

	.que-result {
		z-index: 2;
	}

	.que-box-head {
		padding-top: 38rpx;
		padding-left: 66rpx;
		padding-right: 100rpx;
	}

	.qbh-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.qtl-label,
	.qtl-curr-num {
		font-size: 30rpx;
		font-weight: 400;
		color: #8268fd;
		letter-spacing: 0.66rpx;
	}

	.qtl-all-num {
		font-size: 24rpx;
		color: #999999;
	}

	.qtr-label {
		font-size: 24rpx;
		font-weight: 400;
		color: #999999;
		letter-spacing: 0.52rpx;
	}

	.qtr-num {
		font-size: 40rpx;
		font-weight: 500;
		color: #333333;
		letter-spacing: 0.88rpx;
	}

	.progress-box {
		height: 16rpx;
		background-color: #e6e1ff;
		border-radius: 4px;
		margin-top: 8rpx;
	}

	.progress {
		height: 16rpx;
		width: 50%;
		background-color: #8268FD;
		border-radius: 4px;
	}

	.topic-info {
		font-size: 32rpx;
		font-weight: 500;
		color: #333333;
		margin: 48rpx 70rpx 32rpx;
	}

	.option-item {
		margin-left: 70rpx;
		margin-right: 100rpx;
		margin-bottom: 32rpx;
		height: 88rpx;
		border-radius: 4px 16px 4px 16px;
		line-height: 88rpx;
		text-align: center;
		position: relative;
		overflow: hidden;
	}

	.option-item-text {
		font-size: 28rpx;
		font-weight: 400;
		position: relative;
		z-index: 1;
	}

	.oi-bg,
	.oi-err-bg,
	.oi-right-bg {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}

	.oi-bg {
		background-color: #edf3ff;
		color: #333333;
	}

	.oi-err-bg {
		background-color: #EF2B20;
		color: #fff;

		.err-icon {
			position: absolute;
			left: 32rpx;
			top: 50%;
			transform: translateY(-50%);
		}
	}

	.oi-right-bg {
		color: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		line-height: 1;
		box-shadow: 0 1rpx 5rpx #a897ff;

		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
		}

		.icon {
			width: 36rpx;
			height: 36rpx;
			position: relative;
			z-index: 1;
			margin-left: 26rpx;
		}

		.cowpea {
			position: relative;
			z-index: 1;
			margin-right: 24rpx;
			font-size: 0;
			display: flex;
		}

		.cowpea-icon {
			width: 30rpx;
			height: 30rpx;
		}

		.cowpea-num {
			font-size: 28rpx;
			font-weight: 400;
			color: #ffffff;
			margin-left: 6rpx;
		}

	}

	.topic-tools {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 38rpx 74rpx 0 52rpx;
		padding-bottom: 100rpx;
	}

	.revealed-btn {
		width: 306rpx;
		height: 112rpx;
		box-sizing: border-box;
		padding-top: 38rpx;
		position: relative;
		display: flex;
		justify-content: center;
		font-size: 28rpx;
		font-weight: 400;
		color: #ffffff;
		letter-spacing: 0.62rpx;
		line-height: 1;
		margin-right: 30rpx;
		z-index: 0;
	}

	.revealed-icon {
		width: 34rpx;
		height: 30rpx;
		margin-right: 12rpx;
	}

	.revealed-bg {
		width: 306rpx;
		height: 112rpx;
		position: absolute;
		left: 0;
		top: 0;
		z-index: -1;
	}

	.next_que {
		width: 282rpx;
		height: 88rpx;
		position: relative;
		font-size: 28rpx;
		font-weight: 400;
		color: #333333;
		letter-spacing: 0.62rpx;
		text-align: center;
		line-height: 88rpx;
		z-index: 0;
	}

	.next-que-bg {
		width: 282rpx;
		height: 88rpx;
		position: absolute;
		left: 0;
		top: 0;
		z-index: -1;
	}

	.que-result-box {
		padding-top: 182rpx;
	}

	.qrb-title {
		font-size: 32rpx;
		font-weight: 500;
		color: #333333;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.all-pairs-icon {
		width: 36rpx;
		height: 36rpx;
	}

	.all-pairs-cowpea {
		text-align: center;
		font-size: 0;
		margin-top: 54rpx;
	}

	.pairs-empty {
		text-align: center;
		font-size: 0;
		margin-top: 34rpx;
	}

	.pairs-cowpea {
		text-align: center;
		font-size: 0;
		margin-top: 40rpx;
	}

	.apc-icon {
		width: 170rpx;
		height: 174rpx;
		margin-left: 8rpx;
	}

	.apc-empty-icon {
		width: 200rpx;
		height: 172rpx;
	}

	.pairs-cowpea-icon {
		width: 170rpx;
		height: 188rpx;
	}

	.qrb-tips {
		width: 366rpx;
		height: 66rpx;
		background-color: rgba(255, 255, 255, 0.80);
		border: 2rpx solid #ffffff;
		border-radius: 4px 16px 4px 16px;
		margin: 22rpx auto 0;
		text-align: center;
		line-height: 66rpx;
		font-size: 24rpx;
		font-weight: 400;
		color: #666666;
		letter-spacing: 0.52rpx;
	}
</style>