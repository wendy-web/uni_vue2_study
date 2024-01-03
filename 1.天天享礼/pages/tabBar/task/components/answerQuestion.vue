<template>
	<view class="box" @click="openPage">
		<view class="name">{{taskReward.title}}</view>
		<!-- 背景图 -->
		<van-image class="bg-answer-question" use-loading-slot lazy-load width="702rpx" height="568rpx"
			:src="imgUrl+'/task/bg_answer_question.png'">
			<van-loading slot="loading" type="spinner" size="20" vertical />
		</van-image>
		<!-- 左上角tips -->
		<view class="tips">最高赢{{config.reward||''}}牛金豆</view>
		<view class="question">{{config.title}}</view>
		<view class="answer">A.{{config.option}}</view>
		<van-image class="btn-answer" use-loading-slot lazy-load width="448rpx" height="88rpx"
			:src="imgUrl+'/task/btn_answer.png'">
			<van-loading slot="loading" type="spinner" size="20" vertical />
		</van-image>
	</view>
</template>

<script>
	import {
		canQuizAnswer,
		quiz
	} from '@/api/modules/index.js'
	import { getImgUrl } from '@/utils/auth.js';
    import { mapGetters } from 'vuex';
	let _isLoading = false;
	export default {
		props: {
			taskReward: {
				type: Object,
				default: () => {}
			}
		},
        computed: {
			...mapGetters(['isAutoLogin'])
		},
		mounted() {
			_isLoading = false
			// this.init()
		},
		data() {
			return {
				config: {},
				imgUrl:getImgUrl()
			}
		},
		methods: {
			init() {
				if (_isLoading) return
				_isLoading = true
				quiz().then(res => {

					let {
						quiz,
						reward
					} = res.data

					this.config = {
						reward,
						title: quiz[0].title,
						option: quiz[0].options[0].option
					}

					_isLoading = false

				})
			},
			openPage() {
                if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
				this.$wxReportEvent('question_answer');
				canQuizAnswer().then(res => {
					if (res.code == 1) {
						let {
							answered,
							num
						} = res.data
						if (+answered === +num) {
							return uni.showToast({
								icon: 'none',
								title: '次数已用完，明天等你哟',
								duration: 3000
							})
						}
						uni.navigateTo({
							url: '/pages/taskModule/queAnswers/index?answered=' + answered
						})
					} else {
						uni.showToast({
							icon: 'none',
							title: res.msg,
							duration: 3000
						})
					}

				})
			}
		}
	}
</script>

<style lang="scss">
	.box {
		box-sizing: border-box;
		margin: 0rpx 24rpx 64rpx 24rpx;
		width: 704rpx;
		height: 568rpx;
		position: relative;

	}

	.name {
		font-size: 32rpx;
		font-weight: 600;
		color: #333333;
		line-height: 44rpx;
		letter-spacing: 0.7px;
	}

	.bg-answer-question {
		width: 702rpx;
		height: 568rpx;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: -1;
	}

	.tips {
		font-size: 24rpx;
		font-weight: 400;
		text-align: left;
		color: #672a0a;
		line-height: 34rpx;
		position: absolute;
		top: 84rpx;
		left: 34rpx;
	}

	.question {
		width: 524rpx;
		height: 34rpx;
		font-size: 24rpx;
		font-weight: 500;
		color: #333333;
		line-height: 34rpx;
		position: absolute;
		top: 178rpx;
		left: 0;
		right: 0;
		margin: 0 auto;
		z-index: 1;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		text-align: center;
	}

	.answer {
		font-size: 32rpx;
		font-weight: 500;
		text-align: center;
		line-height: 44rpx;
		position: absolute;
		bottom: 142rpx;
		left: 0;
		right: 0;
		margin: 0 auto;
		z-index: 1;
	}

	.btn-answer {
		width: 448rpx;
		height: 88rpx;
		position: absolute;
		bottom: 10rpx;
		left: 0;
		right: 0;
		margin: 0 auto;
		z-index: 1;
	}
</style>
