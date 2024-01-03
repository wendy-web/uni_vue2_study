<template>
	<mescroll-uni ref="mescrollRef" height="100%" @init="mescrollInit" :auto="false" :up="upOption" :down="downOption"
		@down="downCallback" @up="upCallback" @emptyclick="emptyClick">

		<template v-for="(item,index) in dataList">
			<!-- 新闻 -->
			<view class="news-item" hover-class="news-item-hover" :key="index">
				<easy-loadimage :link="item.url" :index="index" imageClass="news-imageclass" mode="aspectFill"
					@imageClick="newsDetail" :image-src="item.cover"></easy-loadimage>
				<view class="news-item-info" @click="newsDetail(item.url)">
					<!-- 时间 -->
					<view class="news-time">{{item.posts_time}}</view>
					<!-- 主标题 -->
					<view class="news-item-title">
						{{item.title|charsForm}}
					</view>
					<!-- 副标题 -->
					<view class="news-item-small">
						{{item.digest|charsForm}}
					</view>
				</view>
				<!-- tools -->
				<view class="tools" @click.stop>
					<!-- 浏览次数 -->
					<view class="tools-browse">
						<text class="iconfont icon-browse-eye"></text>
						<text class="nums-text-01">{{item.pv|nums}}</text>
					</view>
					<!-- 点赞次数 -->
					<view class="tools-fabulous" @click="fabulous(item)">
						<text v-if="item.is_give == 1&&item.isAnim" class="iconfont icon-fabulous"></text>
						<text v-else class="iconfont"
							:class="item.isAnim?'icon-fabulous fabulousAnim':'icon-fabulous-default'"></text>
						<text class="nums-text-02">{{item.give|nums}}</text>
					</view>
				</view>
			</view>
			<!-- index等于1的时候插一个 -->
			<xh-banner-ads v-if="isShowAd&&index === 1" :key="index+'ad'" unit-id="adunit-0d36dffa4601cbf4" />
			<!-- 广告 -->
			<xh-banner-ads v-else-if="isShowAd&&bannerPosition&&(index-1)%bannerPosition === 0" :key="index+'ad'"
				unit-id="adunit-0d36dffa4601cbf4" />
		</template>
	</mescroll-uni>
</template>
<script>
	// 引入mescroll-mixins.js
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	import {
		mapGetters
	} from 'vuex';
	import {
		filterAdData
	} from '@/utils/index.js';
	import {
		getArticle,
		givelike
	} from '@/api/homeApi.js';
	import {
		cacheArticle
	} from '@/utils/auth.js';

	//只操作一次
	let operate_once = false;

	export default {
		mixins: [MescrollMixin], // 使用mixin
		props: {
			isShowAd: Boolean,
			default: false
		},
		data() {
			return {
				mescroll: null, // mescroll实例对象 (此行可删,mixins已默认)
				// 列表数据
				dataList: [], //cacheArticle()
				bannerPosition: 6,
				downOption: {
					auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption: {
					auto: false,
					empty: {
						tip: '~ 空空如也 ~', // 提示
						btnText: '刷新试试'
					},
					textNoMore: '———————— 没有更多了 ————————'
				}
			};
		},
		computed: {
			...mapGetters(['adData', 'token'])
		},
		filters: {
			charsForm(val) {
				return val.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
			},
			nums(val) {
				if (!val) return 0;
				if (val <= 9999) return val;
				return (val / 10000).toFixed(1) + '万+';
			}
		},
		mounted() {
			//重置
			operate_once = false;
			//广告位
			if (this.adData.A6.value.length > 0) {
				this.bannerPosition = this.adData.A6.value[0].position;
			}
			//第一次刷新
			if (this.token) {
				operate_once = true;
				this.getData(1, true);
				this.mescroll.setPageNum(2);
			}
		},
		watch: {
			token: function(newdata, olddata) {
				if (!operate_once && this.dataList.length === 0) {
					this.getData(1, true);
					this.mescroll.setPageNum(2);
				}
			}
		},
		methods: {
			//点赞与取消点赞
			fabulous(item) {

				givelike({
					cid: item.c_id
				}).then(res => {
					if (res.code == 1) {
						//接口调用成功处理
						item.isAnim = !item.isAnim;
						item.give = res.data.count;
						setTimeout(() => {
							if (!item.isAnim) item.is_give = 0;
						}, 0);
					}
				});
			},
			//查看详情
			newsDetail(link) {
				// 第2种: 下拉刷新和上拉加载调同样的接口, 那么不用第1种方式, 直接mescroll.resetUpScroll()即可
				this.$go({
					url: `/pages/webview/webview?link=${encodeURIComponent(link+'&app=1')}`
				});
			},
			/*mescroll组件初始化的回调,可获取到mescroll对象 (此处可删,mixins已默认)*/
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			/*下拉刷新的回调, 有三种处理方式:*/
			downCallback() {
				this.mescroll.resetUpScroll();
			},
			/*空布局回调*/
			emptyClick() {
				this.mescroll.resetUpScroll();
			},
			/*上拉加载的回调*/
			upCallback(page) {
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默认每页10条
				this.getData(page.num);
			},
			getData(num, flag = false) { //flag代表是否取缓存
				//设置列表数据
				if (num === 1) this.dataList = [];
				getArticle({
					next: num
				}, flag).then(res => {

					let list = res.data.list || []

					let curPageLen = list.length;
					this.mescroll.endSuccess(curPageLen);
					//处理数据
					list.forEach(function(item) {
						item.isAnim = Boolean(item.is_give - 0);
					});
					//设置列表数据
					if (num === 1) return this.dataList = list;
					//追加新数据	
					return this.dataList = this.dataList.concat(list);

				}).catch(err => {
					//请求失败,隐藏加载状态
					this.mescroll.endErr();
				});
			}
		}
	};
</script>

<style lang="scss">
	.news-item {
		background-color: #FFFFFF;
		border-radius: 5px;
		position: relative;
		overflow: hidden;
		z-index: 1;
		transform: translate3d(0, 0, 0);
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
		transition: box-shadow 0.3s;
		padding: 20rpx;
		margin: 25rpx 25rpx;
		display: flex;
	}

	.news-item-info {
		display: flex;
		flex-direction: column;
		padding-bottom: 52rpx;
		justify-content: space-between;
	}

	.news-item-hover {
		box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
	}

	.news-item-title {
		font-size: 24rpx;
		color: #333;
		margin: 5rpx 0;
		-webkit-line-clamp: 2;
		/*文本占的行数,如果要设置2行加...则设置为2*/
	}

	.news-item-small {
		font-size: 20rpx;
		color: #999;
		-webkit-line-clamp: 1;
		/*文本占的行数,如果要设置2行加...则设置为2*/
	}

	.news-item-title,
	.news-item-small {
		overflow: hidden;
		/*超出隐藏*/
		text-overflow: ellipsis;
		/*文本溢出时显示省略标记*/
		display: -webkit-box;
		/*设置弹性盒模型*/
		-webkit-box-orient: vertical;
		/*子代元素垂直显示*/
	}

	.news-time {
		font-size: 20rpx;
		color: #939393;
	}

	.tools {
		background-color: #f0f0f0;
		position: absolute;
		bottom: 20rpx;
		right: 20rpx;
		left: 370rpx;
		height: 48rpx;
		display: flex;
	}

	.tools-browse,
	.tools-fabulous {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.nums-text-01,
	.nums-text-02 {
		font-size: 20rpx;
		align-self: flex-end;
	}

	.nums-text-01 {
		margin-bottom: 10rpx;
	}

	.nums-text-02 {
		margin-bottom: 8rpx;
	}

	.icon-fabulous,
	.icon-browse-eye,
	.icon-fabulous-default {
		margin-right: 6rpx;
	}

	.icon-browse-eye,
	.icon-fabulous-default {
		color: #727272;
	}

	/*底部提交tools end*/
	.its-the-end {
		text-align: center;
		font-size: RPX(12);
		color: #999;
		line-height: RPX(30);
		margin-top: -25rpx;
	}


	.fabulousAnim {
		animation-name: fabulousAnim;
		-webkit-animation-duration: 1s;
		-webkit-animation-fill-mode: both;
		animation-duration: 1s;
		animation-fill-mode: both
	}


	@keyframes fabulousAnim {
		0% {
			-webkit-transform: scaleX(1) translateY(0);
			transform: scaleX(1) translateY(0)
		}

		10%,
		20% {
			-webkit-transform: scale3d(.9, .9, .9) rotate(-3deg) translateY(-20%);
			transform: scale3d(.9, .9, .9) rotate(-3deg) translateY(-20%)
		}

		30%,
		50%,
		70%,
		90% {
			-webkit-transform: scale3d(1.4, 1.4, 1.4) rotate(3deg);
			transform: scale3d(1.4, 1.4, 1.4) rotate(3deg) translateY(-20%)
		}

		40%,
		60%,
		80% {
			-webkit-transform: scale3d(1.4, 1.4, 1.4) rotate(-3deg);
			transform: scale3d(1.4, 1.4, 1.4) rotate(-3deg) translateY(-20%)
		}

		to {
			-webkit-transform: scaleX(1) translateY(0);
			transform: scaleX(1) translateY(0)
		}
	}
</style>