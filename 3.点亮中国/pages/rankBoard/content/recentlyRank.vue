<template>
	<view class="container">
		<mescroll-uni ref="mescrollRef" :fixed="false" @init="mescrollInit" :down="downOption" @down="downCallback"
			:up="upOption" @up="upCallback">
			<!-- 吸顶：我的排名信息 -->
			<view class="stick-box">
				<view class="list-head">

					<image class="avatar" mode="aspectFit"
						:src="meTeam.avatar_url||'/static/images/avatar_default.png'"></image>
					<view class="rank-info-box">
						<view>
							<view class="my-name">{{meTeam.nick_name}}</view>
							<view class="light-box">
								<text>点亮</text>
								<text class="light-num">{{meTeam.city_num}}</text>
								<text>座城市</text>
							</view>
						</view>
						<view>
							<text class="light-num">{{meTeam.like_num}}</text>
							<van-icon color="#e3001b" size="24" name="good-job" />
						</view>
					</view>
				</view>
			</view>
			<!-- 列表 -->
			<view class="list-content" v-for="(item,index) in listData" :key="index">
				<view class="list-item">
					<image class="item-avatar" mode="aspectFit"
						:src="item.avatar_url||'/static/images/avatar_default.png'"></image>
					<text>{{item.nick_name}}</text>
				</view>
				<view class="list-item">
					<view class="item-name">
						<view>刚刚点亮</view>
						<view class="light-city">{{item.city}}</view>
					</view>
					<view>
						<view class="light-num">{{item.like_num}}</view>
						<van-icon v-if="item.like_status==1" color="#e3001b" size="24" name="good-job"
							@click="like(item.id)" />
						<van-icon v-else color="#e3001b" size="24" name="good-job-o" @click='like(item.id)' />
					</view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	import {
		getLitCityLog,
		like
	} from '@/api/modules/home.js';
	//分页
	let NEXT = 0;
	export default {

		mixins: [MescrollMixin],
		data() {
			return {
				downOption: {
					use:false,
					isLock:true,
					auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption: {
					use:false,
					// isLock:true,
					auto: false, // 不自动加载
					noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					// empty: {
					// 	tip: '~ 空空如也 ~', // 提示
					// 	btnText: '去新闻页'
					// },
					toTop: {
						src: ''
					},
					textNoMore: '~ 暂无更多信息 ~'
				},
				//列表数据
				listData: [],
				meTeam: {
					nick_name: '',
					rank: '',
					city_num: 0
				},
			}
		},
		mounted() {
			NEXT = 0
			this.initData()
		},
		methods: {

			/*下拉刷新的回调 */
			downCallback() {
				NEXT = 0
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
				this.upCallback();
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				const API = getLitCityLog

				let parmas = {
					// limit: 10
					limit: 20
				}

				if (NEXT != 0) parmas.next = NEXT

				//获取数据next:NEXT,
				API(parmas).then(res => {
					const {
						list,
						next,
						total
					} = res.data
					this.meTeam = total

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
			like(id) {
				like({
					id
				}).then(res => {
					console.log(res);
					let {
						code
					} = res;
					this.initData()
				})
			},
			initData(){
				NEXT = 0;
				this.downCallback()
			},
		}

	}
</script>

<style lang="scss">
	.container {
		background-color: #fffefb;
		padding: 0 8rpx;
		margin: 0 8rpx;
		box-sizing: border-box;
		height: calc(100vh - 170rpx);
		.stick-box {
			background-color: #fffefb;
			// position: sticky;
			// top: 80px;
			box-sizing: border-box;
			z-index: 999;

			.list-head {
				height: 160rpx;
				background-color: #fff4e1;
				border-radius: 20rpx;
				box-sizing: border-box;
				padding: 0 24rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}

			.avatar {
				border-radius: 50%;
				width: 100rpx;
				height: 100rpx;
				flex-shrink: 0;
				margin-right: 16rpx;
			}

			.rank-info-box {
				font-size: 28rpx;
				text-align: left;
				color: #000018;
				display: flex;
				flex: 1;
				align-items: center;
				justify-content: space-between;

				.my-name {
					font-size: 32rpx;
					font-weight: 700;
					text-align: left;
					color: #000018;
				}

				.light-num {
					color: #F7304D;
				}
			}
		}

		.list-content {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 138rpx;
			border-bottom: 1rpx solid #fdebcf;
			box-sizing: border-box;
			padding-left: 40rpx;
			padding-right: 24rpx;

			.list-item {
				display: flex;
				align-items: center;
				font-size: 28rpx;
				text-align: center;

				.item-avatar {
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
					margin-right: 36rpx;
				}

				.item-name {
					font-size: 24rpx;
					text-align: center;
					margin-right: 40rpx;
					box-sizing: border-box;
				}

				.light-city {
					color: #9A3510;
				}

				.light-num {
					color: #E3001B;
				}
			}

		}
	}
</style>
