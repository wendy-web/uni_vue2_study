<template>
	<view class="ask-answer">
		<xh-navbar title="闯关点亮" titleColor="#ffffff" :isHome="true" @leftCallBack="backHome"></xh-navbar>
		<!-- 背景 -->
		<view class="ask-answer-bg">
			<van-image width="100%" height="100%" src="/pages/game/static/ask_answer_bg.png" fit="cover"
				use-loading-slot>
				<van-loading slot="loading" type="spinner" size="20" vertical />
			</van-image>
		</view>
		<!-- 博士天天 -->
		<view class="bs-tt">
			<van-image width="100%" height="100%" src="/pages/game/static/ask_answer_icon.png" fit="cover"
				use-loading-slot>
				<van-loading slot="loading" type="spinner" size="20" vertical />
			</van-image>
		</view>
		<!-- 得分 -->
		<view class="score-all">
			<count-up :num="score" color="#EEF525" width='50' height='86' fontSize='86' />
			<view class="score-unit">分</view>
		</view>
		<!-- 答题统计 -->
		<view class="topic-tool">
			<view class="curr-topic">
				第<text class="num">{{currIndex+1}}</text>题
			</view>
			<view class="topic-all">
				共<text class="num">{{size}}</text>题
			</view>
		</view>
		<!-- 题目 -->
		<view class="topic-box">
			<view class="topic-info">
				{{currData.title}}
			</view>
			<view v-for="item in currData.option" :key="item.id" class="option-item"
				:class="{'option-success':item.isCheck&&item.right,'option-error':item.isCheck&&!item.right}"
				@click="select(item)">
				<text>{{item.option}}</text>
				<image class="state-icon" v-if="item.isCheck&&item.right" src="/pages/game/static/success.png"
					mode="aspectFill"></image>
				<image class="state-icon" v-if="item.isCheck&&!item.right" src="/pages/game/static/error.png"
					mode="aspectFill"></image>
			</view>
		</view>
		<!-- 操作按钮 -->
		<view class="ask-answer-tools" v-if="currData.isCheck">
			<view class="ctb-item">
				<van-button round color="linear-gradient(180deg,#fda80c, #f5882e)" size="normal" block @click="revealed"
					:disabled="awards>=5">看视频揭秘
				</van-button>
				<view class="awards-num">
					每日5次 ({{awards}}/5)
				</view>
			</view>
			<view class="ctb-item">
				<van-button v-if="!lastShow" round color="#F68C28" plain size="normal"
					custom-style="background-color: transparent;color:#fff;" block @click="next">下一关</van-button>
				<van-button v-else round color="#F68C28" plain size="normal"
					custom-style="background-color: transparent;color:#fff;" block @click="initSubmit">查看成绩</van-button>
			</view>
		</view>
		<!-- 失敗彈窗 -->
		<error-toast ref="errorToast" @again="initGame" @periodPopupShow="periodPopupShow" />
		<!-- 成功彈窗 -->
		<success-share ref="successShare" @again="initGame" @periodPopupShow="periodPopupShow" />
		<!-- 其它彈窗 -->
		<success-toast ref="successToast" @again="initGame" @periodPopupShow="periodPopupShow" />
		<!-- 城市分享 -->
		<city-share-card ref="cityShareCard" />
		<!-- 自定义分享 -->
		<van-share-sheet :show="showShare" :options="shareOptions" @select="shareSelect" @close="shareClose"
			:overlay="false" />
		<!-- 分享朋友圈 -->
		<wechat-moments ref="wechatMoments" :isCustomNavbar="true" />
		<!-- 隐私协议的组件 -->
		<privacy ref="privacy"></privacy>
	</view>
</template>

<script>
	import countUp from '@/components/p-countUp/countUp.vue'
	import {
		getQuestion,
		answers,
		getWatchNum,
		updateWatchNum
	} from '@/api/modules/game.js'
	import {
		getUserLocation
	} from '@/utils/getUserLocation.js'
	import errorToast from './errorToast.vue'
	import successShare from './successShare.vue'
	import successToast from './successToast.vue'
	import cityShareCard from '@/components/popupWindow/cityShareCard/index.vue'
	import wechatMoments from '@/components/wechatMoments.vue'
	import {
		mapGetters,
		mapActions
	} from 'vuex'
	import {
		parseTime,
		RewardedVideoAd
	} from '@/utils/index.js'
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
	export default {
		components: {
			countUp,
			errorToast,
			successShare,
			successToast,
			cityShareCard,
			wechatMoments
		},
		onLoad(opacity) {
			this.scenario_value = Number(opacity.scenario_value) || 0;
			//初始化游戲
			this.initGame()
			//獲取定位
			if (this.userInfo.city_num == 0) {
				getUserLocation().then(res => {}).catch(e => {
					this.backHome()
				})
			}
			/*初始化激励视频*/
			this.initRewardedVideoAd()
			//獲取獎勵次數
			getWatchNum().then(res => {
				if (res.code == 1) this.awards = res.data.num
			});
		},
		onShow() {
			// 隐私协议判断
			this.$refs.privacy.LifetimesShow();
		},
		onShareAppMessage(data) {
			let share = {
				title: '点亮全中国，一起攒能量'
			}
			share.path = '/pages/tabBar/home/index'
			if (data.from == 'button') {
				share.title = '我发现了个好地方，你一定喜欢！'
				share.imageUrl = this.$refs.cityShareCard.getImageUrl()
			}

			return share;
		},
		onShareTimeline(data) {
			let share = {
				title: '点亮全中国，一起攒能量',
				path: '/pages/tabBar/home/index'
			}
			const shareImgData = JSON.stringify(this.$refs.cityShareCard.getShareImgData());
			const imageUrl = this.$refs.cityShareCard.getImageUrl()
			if (imageUrl) {
				share.title = '我发现了个好地方，你一定喜欢！';
				share.imageUrl = imageUrl;
				share.path = `/pages/tabBar/home/index?type=cityShare&shareImgData=${shareImgData}`;
			}
			return share;
		},
		data() {
			return {
				score: 0,
				size: 0,
				currIndex: 0,
				currData: {
					id: 1,
					title: "",
					isCheck: false,
					option: []
				},
				showShare: false,
				shareOptions: [{
						name: '微信',
						icon: 'wechat',
						openType: 'share'
					},
					{
						name: '朋友圈',
						icon: 'wechat-moments'
					},
					{
						name: '保存图片',
						icon: 'https://file.y1b.cn/public/img/dlzg/downImage.png'
					}
				],
				awards: 0,
				lastShow: false,
				adErrortext: '',
				adunitId: this.common.adunitId.askAnswer,
				scenario_value: 0
			}
		},
		computed: {
			...mapGetters(['userInfo', 'isAuthorization'])
		},
		methods: {
			...mapActions({
				updateLightModeList: 'business/updateLightModeList'
			}),
			share(data) {
				let avatar = this.userInfo.avatar_url
				let name = this.userInfo.nick_name
				this.$refs.cityShareCard.showTime({
					avatar,
					name,
					cityImage: data.image,
					date: parseTime(Date.now(), '{y}-{m}-{d}'),
					cityName: data.city
				})
				this.showShare = true
			},
			shareSelect(e) {
				//保存图片
				if (e.detail.name == "保存图片") {
					this.$refs.cityShareCard.save()
				} else if (e.detail.icon == "wechat-moments") {
					//朋友圈
					this.shareClose()
					this.$refs.wechatMoments.show()
				}
			},
			shareClose(flag) {
				this.showShare = false
				this.$refs.cityShareCard.popupClose()
				if (flag) {
					this.backHome()
				}
			},
			initGame() {
				//數據重置
				this.score = 0
				this.size = 0
				this.currIndex = 0
				this.lastShow = false
				this.currData = {
					id: 1,
					title: '',
					isCheck: false,
					option: []
				}
				_isLoading = false
				_answer = []
				_topicList = []
				//獲取需要答的題目
				getQuestion().then(res => {
					_topicList = res.data.list || [];
					this.size = _topicList.length;
					if (this.size > 0) this.goMame();
				});
			},
			goMame() {
				let data = _topicList[this.currIndex];
				data.option = data.option.map(item => {
					item.option = item.option.replace(/\s/, '')
					return {
						...item,
						isCheck: false
					};
				});
				data.isCheck = false;
				this.currData = data;
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
			submit(parmas) {
				//处理结果
				answers(parmas).then(response => {
					this.updateLightModeList().then(() => {
						// 失敗情況
						if (this.score < 60) {
							this.updateLightModeList().then(() => {
								this.$refs.errorToast.popupShow(this.score, this.scenario_value);
							});
							return;
						}
						//成功情況
						if (this.score >= 60 && response.data) {
							let {
								city
							} = response.data

							city ? this.$refs.successShare.popupShow(this.score, response.data) : this.$refs.successToast.popupShow(this.score);
							return;
						}
						//其它情況
						this.$refs.successToast.popupShow(this.score)
					});
				});
			},
			select(item) {
				//處理完才能點
				if (_isLoading) return
				//當前選擇設置選擇狀態
				item.isCheck = true
				//是否加分
				if (item.right) {
					this.score += 20
				}
				//處理中狀態
				_isLoading = true
				//存儲當前已答題目
				_answer.push({
					...item
				})
				//是否已经答完
				if (this.currIndex >= this.size - 1 && item.right) {
					this.initSubmit();
					return
				}
				if (item.right) {
					_nextAuto = setTimeout(() => {
						this.next()

					}, 1000);
					return;
				}
				//显示按钮
				this.currData.isCheck = true
				//显示解密按钮
				if (this.currIndex >= this.size - 1) this.lastShow = true
			},
			initSubmit() {
				//配置参数
				let parmas = {
					option_id: _answer.map(item => item.id)
				};
				//如果是第一次
				if (this.userInfo.city_num == 0) {
					getUserLocation().then(res => {
						let {
							longitude,
							latitude
						} = res.data
						parmas.longitude = longitude
						parmas.latitude = latitude;
						//处理结果
						this.submit(parmas);
					})
					return;
				};

				//处理结果
				this.submit(parmas)
			},
			/*揭秘*/
			initRewardedVideoAd() {
				_RewardedVideoAd = RewardedVideoAd(this.adunitId, (res) => {

					if (res) {
						this.currData.option = this.currData.option.map(function(item) {
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
						updateWatchNum().then(res => {})
						this.awards++
					}
				})
				_RewardedVideoAd.init({
					errMsg: '视频跑丢了，下次再来'
				})
			},
			revealed() {
				/*闯关点亮【看视频揭秘】 */
				wx.reportEvent("click_video2decrypt", {
					authorized_or_not: Number(this.isAuthorization),
					scenario_value: this.scenario_value
				})
				_RewardedVideoAd.show();
			},
			//没次数跳转至首页
			periodPopupShow() {
				uni.reLaunch({
					url: '/pages/tabBar/home/index?type=showLightMode&page=askAnswer'
				});
			},
			backHome() {
				uni.reLaunch({
					url: '/pages/tabBar/home/index'
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
.ask-answer {
	position: relative;
	.ask-answer-bg {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		font-size: 0;
		z-index: -1;
	}

	.bs-tt {
		font-size: 0;
		padding: 78rpx 48rpx 0;
		height: 344rpx;
	}

	.score-all {
		display: flex;
		justify-content: center;
		align-items: flex-end;
		margin-bottom: 10rpx;
		font-size: 36rpx;
		font-weight: 400;
		color: #eef525;
		margin-top: -30rpx;
	}

	.topic-tool {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		font-weight: 700;
		color: #dfe4ff;
	}

	.curr-topic {
		margin-right: 20rpx;
	}

	.num {
		font-size: 36rpx;
		color: #EEF525;
	}

	.topic-box {
		width: 518rpx;
		margin: 0 auto;
		padding-top: 60rpx;
	}

	.topic-info {
		font-size: 32rpx;
		font-weight: 700;
		color: #ffffff;
		margin-bottom: 36rpx;
	}

	.option-item {
		width: 100%;
		height: 80rpx;
		background: #dfe4ff;
		border-radius: 10px;
		text-align: center;
		line-height: 80rpx;
		position: relative;
	}

	.option-item+.option-item {
		margin-top: 36rpx;
	}

	.option-success {
		background-color: #20C293;
		color: #fff;
	}

	.option-error {
		background-color: #E03134;
		color: #fff;
	}

	.score-unit {
		padding-bottom: 4rpx;
		margin-left: 15rpx;
	}

	.state-icon {
		width: 72rpx;
		height: 72rpx;
		position: absolute;
		right: -15rpx;
		top: 50%;
		transform: translateY(-50%);
	}

	.ask-answer-tools {
		padding: 70rpx 60rpx 108rpx;
		display: flex;
		justify-content: space-between;
	}

	.ctb-item {
		width: 282rpx;
		position: relative;
	}

	.awards-num {
		position: absolute;
		white-space: nowrap;
		left: 50%;
		transform: translate(-50%, 100%);
		bottom: -20rpx;
		font-size: 28rpx;
		font-weight: 400;
		color: #e9e9e9;
	}
}
</style>
