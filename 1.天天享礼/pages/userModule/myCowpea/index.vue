<template>
<view class="my-cowpea">
	<xh-navbar
		navbarImage="https://file.y1b.cn/store/1-0/23713/64afe3863c266.png"
		navberColor="#fff"
		navbarImageMode="widthFix"
		:overFlow="true"
		:fixedNum="9"
		titleAlign="titleRight"
	>
		<view slot="title" class="nav-custom fl_bet">
			<van-icon name="arrow-left" color="#333333" size="24" @click="$leftBack" />
			<swiperSearch
				:textList="textList"
				:isSwiperTxt="showTitleBg"
				:class="['swiper_search', (textList.length && this.showTitleBg) ? 'ani_flex-in' : 'ani_flex-out',]"
			></swiperSearch>
		</view>
	</xh-navbar>
	<mescroll-body
		ref="mescrollRef"
		@init="mescrollInit"
		@down="downCallback"
		@up="upCallback"
		:down="downOption"
		:up="upOption"
	>
		<!-- 我的牛金豆 -->
		<view class="my-cowpea-head">
			<view class="mch-title">我的牛金豆</view>
			<view class="mch-num" @click="goPage('/pages/userInfo/cowpeaRecord/index')">
				<view id="taskTitle" class="countup-num">
					<text v-if="countupComplete">{{creditsnumber || 0}}</text>
					<text v-else>{{userTotal.credits || 0}}</text>
				</view>
			</view>
		</view>
		<!-- 签到 -->
		<sign-module @showAwardModel="startAnim" ref="signModule" />
		<!-- 优惠推荐 -->
		<view class="discount-put-box" id="discountId">
			<text class="discount-put-title">优惠兑换</text>
			<view class="discount_right fl_center"  @click="toolsChange()">
				<text class="dis_txt">赚牛金豆</text>
				<van-icon name="arrow" color="#D6752C" custom-style="font-weight: 600;" size="24rpx" />
			</view>
		</view>
		<good-list
			:list="goods"
			:isBolCredits="true"
			:isJdLink="true"
			:isShowProfit="true"
			@notEnoughCredits="notEnoughCreditsHandle"
		></good-list>
	</mescroll-body>
	<!-- 任务完成 -->
	<task-complete ref="taskComplete" @startAnim="showCowpeaAnim" />
	<!-- 动画 -->
	<cowpea-anim ref="cowpeaAnim" @animEnd="getUserTotal" />
	<!-- 牛金豆不足的情况 -->
	<exchangeFailed
		:isShow="exchangeFailedShow"
		@goTask="goTaskHandle"
		@close="exchangeFailedShow=false"
	></exchangeFailed>
	<!-- 赚取牛金豆 -->
	<serviceCredits
		ref="serviceCredits"
		:isShow="serviceCreditsShow"
		@showAdPlay="showAdPlayHandle"
		@close="closeHandle"
	></serviceCredits>
</view>
</template>

<script>
	import { keywordList } from '@/api/modules/jsShop.js';
import goodList from '@/components/goodList.vue';
import exchangeFailed from '@/components/serviceCredits/exchangeFailed.vue';
import serviceCredits from '@/components/serviceCredits/index.vue';
import serviceCreditsFun from '@/components/serviceCredits/serviceCreditsFun.js';
import swiperSearch from '@/components/swiperSearch.vue';
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import WxCountUp from '@/utils/WxCountUp.js';
import { getImgUrl, warpRectDom } from '@/utils/auth.js';
import getViewPort from '@/utils/getViewPort.js';
import groupRecommendMixin from '@/utils/mixin/groupRecommendMixin.js'; // 混入推荐商品列表的方法
import { mapActions, mapGetters } from 'vuex';
import cowpeaAnim from './cowpeaAnim.vue';
import signModule from './signModule.vue';
import taskComplete from './taskComplete.vue';
	let _options = {
		separator: '',
		duration: 1,
	}
	let _firstload = 0;
	export default {
		mixins: [MescrollMixin, serviceCreditsFun, groupRecommendMixin], // 使用mixin
		components: {
			signModule,
			goodList,
			taskComplete,
			cowpeaAnim,
			exchangeFailed,
			serviceCredits,
			swiperSearch
		},
		data() {
			return {
		        imgUrl: getImgUrl(),
                myCowpea: getImgUrl() + '/static/subPackages/userModule/myCowpea',
				downOption: {
					textColor: '#fff',
					auto: false,
					empty: {
						use: false
					}
				},
				upOption: {
					use: true,
					auto: true,
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 1 // 每页数据的数量
					},
					empty: {
						use: false
					}
				},
				tools: [{
						id: 1,
						name: '看一看拿奖',
						info: '看视频得牛金豆',
						icon: 'https://file.y1b.cn/store/1-0/23713/64afe3285be53.png'
					},
					{
						id: 2,
						name: '趣味闯关',
						info: '闯关赢牛金豆',
						icon: 'https://file.y1b.cn/store/1-0/23713/64afe3417c064.png'
					},
					{
						id: 3,
						name: '试一试手气',
						info: '扫码赚更多牛金豆',
						icon: 'https://file.y1b.cn/store/1-0/23713/64afe358058d7.png'
					}
				],
				creditsnumber: 0,
				countupComplete: false,
				showTitleBg: false,
				textList: [],
				discount_Top: 0
			}
		},
		computed: {
			...mapGetters(['userTotal', 'isAutoLogin']),
			// 吸顶的的top值
			stickyTop() {
				let viewPort = getViewPort();
				return viewPort.navHeight;
			},
		},
		watch: {
			userTotal: {
				handler(newVal, oldVal) {
					if (newVal) {
						this.$nextTick(() => {
							this.updateWxCountUp(newVal.credits)
						})
					}
				},
				immediate: true,
				deep: true
			}
		},
		onLoad() {
			_firstload = 0
			this.countUp = new WxCountUp('creditsnumber', 0, _options, this);
			this.countUp.start((complete) => {
				this.countupComplete = true
			});
			this.initTextList();
			// this.toolsChange();
		},
		onShow() {
			this.updateGood();
		},
		onUnload() {
			_firstload = 0
		},
		methods: {
			...mapActions({
				getUserTotal: 'user/getUserTotal'
			}),
			warpRectDom,
			async initTextList () {
				const discountIdRes = await this.warpRectDom('discountId');
          		this.discount_Top = discountIdRes.height;
				const res = await keywordList();
				if (res.code == 1 && res.data) {
					this.textList = res.data;
				}
			},
			// 页面的滚动事件
			onPageScroll(e) {
				const scrollTop = Math.ceil(e.scrollTop);
				if(scrollTop >= this.discount_Top) {
					this.showTitleBg = true;
				} else {
					this.showTitleBg = false;
				}
			},
			toSearchHandle() {
				if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
				this.$go(`/pages/userModule/productList/search`);
			},
			upCallback(page) {
				this.requestGoodList(page);
			},
			// 牛金豆不足的情况
			notEnoughCreditsHandle() {
				this.exchangeFailedShow = true;
			},
			downCallback() {
				this.mescroll.endSuccess(0, false);
				/*刷新统计*/
				this.getUserTotal();
				_firstload++
			},
			updateGood() {
				if (uni.getStorageSync('couponDetails_update')) {
					let data = JSON.parse(uni.getStorageSync('couponDetails_update'))
					let index = this.goods.findIndex(item => item.id == data.id)
					if (index > -1) {
						let item = this.goods[index]
						this.goods.splice(index, 1, {
							...item,
							...data
						});
					}
					uni.removeStorageSync('couponDetails_update');
				}
			},
			toolsChange() {
				this.goTaskHandle();
			},
			startAnim(data) {
				this.$refs.taskComplete.show(data)
			},
			showCowpeaAnim() {
				let query = uni.createSelectorQuery().in(this)
				query.select('#taskTitle').boundingClientRect()
				query.exec((res) => {
					let {
						left,
						top,
						width,
						height
					} = res[0]
					this.$refs.cowpeaAnim.show({
						left: left + width / 2,
						top: top + height / 2
					})
				})
			},
			initCommon() {
				wx.nextTick(() => {
					Object.keys(this.$refs).forEach((key) => {
						if (this.$refs[key].init) {
							this.$refs[key].init()
						}
					})
				})
			},
			goPage(url) {
				this.$go(url);
			},
			updateWxCountUp(num) {
				this.countUp.update(+num);
			},
			testAdd() {
				this.userTotal.credits++
			}
		}
	}
</script>

<style lang="scss">
page {
	background-color: #f7f7f7;
}
.swiper_search{
  transition: all 0.5s;
  flex: 1;
  &.ani_flex-in {
    flex: 1;
  }
  &.ani_flex-out {
    flex: 0;
  }
}
.my-cowpea {
	position: relative;
	z-index: 0;
	&::before {
		content: '\3000';
		background: url("https://file.y1b.cn/store/1-0/23713/64afe3863c266.png") 0 0 / cover;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 584rpx;
		z-index: 0;
	}
}
	.nav-custom{
		flex: 1;
	}
	.search_icon {
		flex: 0 0 64rpx;
		box-sizing: border-box;
		width: 64rpx;
		height: 64rpx;
	}
	.my-cowpea-head {
		margin-top: 46rpx;
		position: relative;
	}
	.mch-title {
		display: flex;
		align-items: center;
		font-size: 30rpx;
		position: relative;
		color: #333;
		&::before {
			content: '\3000';
			background: url("https://file.y1b.cn/public/img/ttxl//static/subPackages/userModule/myCowpea/cowpea_icon.png") 0 0 / cover;
			width: 52rpx;
			height: 52rpx;
			margin-right: 4rpx;
			margin-left: 16rpx;
			display: block;
		}
		&::after {
			content: 'R';
			width: 22rpx;
			height: 22rpx;
			border: 2rpx solid #333333;
			border-radius: 50%;
			position: absolute;
			top: -6rpx;
			right: -30rpx;
			font-size: 16rpx;
			font-weight: 400;
			color: #333333;
			text-align: center;
			line-height: 22rpx;
		}
	}
	.cowpea-icons {
		width: 52rpx;
		height: 52rpx;
		margin-right: 4rpx;
		margin-left: 16rpx;
	}

	.mch-num {
		font-weight: 700;
		margin-left: 24rpx;
		display: flex;
		align-items: baseline;
		&::after {
			content: '\3000';
			background: url("https://file.y1b.cn/public/img/ttxl//static/subPackages/userModule/myCowpea/cowpea_arrow.png") 0 0 / cover;
			width: 20rpx;
			height: 26rpx;
			position: relative;
			// top: -10rpx;
			margin-left: 16rpx;
		}
	}
	.play-cowpeas {
		position: relative;
		border-radius: 16px 16px 0px 0px;
		overflow: hidden;
		margin-top: 26rpx;

		&::after {
			content: '';
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 156rpx;
			background-image: linear-gradient(180deg, #ffffff, #f7f7f7 85%);
			border-radius: 16px 16px 0px 0px;
			z-index: -1;
		}
	}

	.play-cowpeas-title {
		font-size: 32rpx;
		font-family: PingFang SC, PingFang SC-6;
		font-weight: 600;
		color: #333333;
		padding: 32rpx 24rpx 24rpx;
	}

	.play-cowpeas-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 24rpx;
	}

	.pci-icon {
		width: 80rpx;
		height: 80rpx;
		margin-top: 20rpx;
	}

	.play-cowpea-item {
		width: 224rpx;
		background-color: #ffffff;
		border-radius: 12px;
		text-align: center;
	}

	.pci-title {
		font-size: 26rpx;
		color: #333333;
		margin: 16rpx auto 24rpx;
	}

	.pci-info {
		font-size: 22rpx;
		color: #999;
	}
	.discount-put-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
        padding: 24rpx;
        &::after {
			content: '';
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 156rpx;
			background-image: linear-gradient(180deg, #ffffff, #f7f7f7 85%);
			border-radius: 16px 16px 0px 0px;
			z-index: -1;
		}
        .discount_right{
            background: rgba(225,225,225,0.28);
            border-radius: 20rpx;
            padding: 6rpx 16rpx;
            font-size: 26rpx;
            line-height: 36rpx;
            font-weight: 500;
            color: #d6752c;
			&::before {
				content: '\3000';
				background: url("https://file.y1b.cn/store/1-0/23713/64afe3417c064.png") 0 0 / cover;
				width: 48rpx;
                height: 48rpx;
				display: block;
			}
            .dis_icon {
                width: 48rpx;
                height: 48rpx;
            }
            .dis_txt{
                margin: 0 6rpx;
            }

        }
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

	.i-count-up {
		font-size: 12em;
		margin: 0;
		color: #4d63bc;
	}

	.countup-num {
		font-size: 72rpx;
		font-weight: 700;
		text-align: center;
		color: #824600;
	}
</style>
