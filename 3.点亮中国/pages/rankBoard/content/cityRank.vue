<template>
	<view class="container">

		<view class="mescroll-box">

			<!-- 榜单列表 -->
			<mescroll-uni ref="mescrollRef" :fixed="false" @init="mescrollInit" :down="downOption" @down="downCallback"
				:up="upOption" @up="upCallback">
				<!-- 热力图 -->
				<hot-map ref="hotMap" />
				<!-- 背景颜色 -->
				<view class="bg-color"></view>
				<view class="cover-box">
					<!-- 标题 -->
					<view class="list-head">
						<view class="list-item">排名</view>
						<view class="list-middle">城市</view>
						<view class="list-item text-right">热力值</view>
					</view>
					<!-- 列表 -->
					<view class="list-content" v-for="(item, index) in listData" :key="index">
						<view class="list-item">
							<image class="rank-icon" v-if="index<=2"
								:src="'/pages/rankBoard/static/rank0'+(index+1)+'.png'" mode="aspectFill"></image>
							<view class="rank-num" v-else>{{index+1}}</view>
						</view>
						<view class="list-middle">{{item.city}}</view>
						<view class="list-item light-num">{{item.lit_num}}</view>

					</view>
				</view>
			</mescroll-uni>
		</view>
	</view>
</template>

<script>
	import hotMap from '../components/hotMap.vue';
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	import {
		getAllRank,
		getCityRank
	} from '@/api/modules/home.js';
	//分页
	let NEXT = 0;
	export default {
		components: {
			hotMap
		},
		mixins: [MescrollMixin],
		data() {
			return {
				downOption: {
					isLock: true,
					use: false,
					auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption: {
					// isLock: true,
					// use: false,
					auto: true, // 不自动加载
					noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					// empty: {
					// 	tip: '~ 空空如也 ~', // 提示
					// 	btnText: '去新闻页'
					// },
					toTop: {
						src: ''
					},
					textNoMore: '~ 暂无更多信息 ~',
					offset: 500
				},
				//列表数据
				listData: [],
			}
		},
		created() {
			NEXT = 0
		},
		methods: {
			initHotMap() {
				if (this.$refs.hotMap) this.$refs.hotMap.initData()
			},
			/*下拉刷新的回调 */
			downCallback() {
				NEXT = 0
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
				this.mescroll.resetUpScroll();
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				const API = getCityRank

				let parmas = {
					limit: 10
				}

				if (NEXT != 0) parmas.next = NEXT

				//获取数据next:NEXT,
				API(parmas).then(res => {
					const {
						list,
						next
					} = res.data

					let data = {
						list: list || []
					};

					//设置列表数据
					if (NEXT == 0) {
						this.listData = []; //如果是第一页需手动制空列表
					}
					NEXT = next
					//填充数据
					this.listData = this.listData.concat(data.list);

					//联网成功的回调,隐藏下拉刷新和上拉加载的状态
					this.mescroll.endSuccess(data.list.length);

				}).catch(err => {
					//联网失败, 结束加载
					this.mescroll.endErr();
				});

			},
			initData() {
				NEXT = 0;
				this.upCallback(1)
			},
		}

	}
</script>

<style lang="scss">
	.container {
		background-color: #efefef;
		position: relative;
		box-sizing: border-box;
		height: calc(100vh - 170rpx);

		.mescroll-box {
			box-sizing: border-box;
			background: #fffefb;
			// margin: 0 8rpx;
			height: calc(100vh - 170rpx);
		}

		.bg-color {
			background-color: #90cccc;
			position: absolute;
			top: 0;
			right: 0;
			left: 0;
			height: 50rpx;
			z-index: 0;
		}

		.cover-box {
			padding: 0rpx 30rpx;
			background: #fffefb;
			border-radius: 20rpx 20rpx 0;
			position: relative;
			z-index: 1;

			.list-head {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 24rpx;
				font-weight: 700;
				height: 100rpx;
				border-bottom: 1rpx solid #fdebcf;
				// position: sticky;
				// top: 80px;
				background-color: #fffefb;
			}

			.list-content {
				font-size: 24rpx;
				color: #000018;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 10rpx;
				height: 100rpx;
				border-bottom: 1rpx solid #fdebcf;

				.light-num {
					color: #FF4907;
					text-align: right;
				}
			}

			.list-item {
				flex: 1;
			}

			.list-middle {
				flex-shrink: 0;
				width: 100rpx;
				text-align: center;

			}

			.text-right {
				text-align: right;
			}

			.rank-icon {
				width: 46rpx;
				height: 54rpx;
			}

			.rank-num {
				min-width: 46rpx;
				display: inline-block;
				text-align: center;
				font-size: 32rpx;
			}
		}
	}
</style>
