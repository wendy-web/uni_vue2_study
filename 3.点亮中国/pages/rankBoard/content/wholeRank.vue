<template>
	<view class="container">
		<mescroll-uni ref="mescrollRef" :fixed="false" @init="mescrollInit" :down="downOption" @down="downCallback"
			:up="upOption" @up="upCallback">
			<!-- sticky 吸顶部分 -->
			<view class="sticky-box">
				<!-- 我的排名 -->
				<!-- <view class="my-info-box">
					<image class="avatar" mode="aspectFit"
						:src="meTeam.avatar_url || '/static/images/avatar_default.png'"></image>
					<view class="rank-info-box">
						<view>
							<view class="my-name">{{meTeam.nick_name}}</view>
							<view class="my-rank-num" v-if="meTeam.rank<=20">NO.{{meTeam.rank}}</view>
							<view class="my-rank-num" v-else>未上榜</view>
						</view>
						<view>
							<text>点亮</text>
							<text class="lignt-num">{{meTeam.city_num}}</text>
							<text>次</text>
						</view>
					</view>
				</view> -->
				<!-- 列表表头 -->
				<!-- <view class="list-head">
					<view class="item-left">Top20</view>
					<view class="item-middle">昵称</view>
					<view class="item-right">点亮次数</view>
				</view> -->
				<view class="top-three">
					<template v-for="(item, index) in listData">
						<view class="top-three-item" :class="[index == 0 ? 'three-item-one' : '',index == 2 ? 'three-item-three' : '']" v-if="index < 3" :key="index">
							<view class="rank-img">
								<image src="/pages/rankBoard/static/rank01.png" mode="aspectFill" v-if="index == 0" />
								<image src="/pages/rankBoard/static/rank02.png" mode="aspectFill"
									v-else-if="index == 1" />
								<image src="/pages/rankBoard/static/rank03.png" mode="aspectFill" v-else />
							</view>
							<view class="top-three-content"
								:class="[index == 0 ? 'rank-one' : '',index == 1 ? 'rank-two' : '',index == 2 ? 'rank-three' : '']">
								<image class="content-avatar" mode="aspectFit" :src="item.avatar_url"></image>
								<text v-if="item.uid == meTeam.id" class="content-name">{{ meTeam.nick_name }}</text>
								<text class="content-name" v-else>{{item.nick_name}}</text>
								<text class="content-city-num">{{ item.city_num }}</text>
								<text class="content-hint">点亮城市</text>
							</view>
						</view>
					</template>
				</view>
			</view>
			<!-- 列表内容 -->
			<template v-for="(item, index) in listData">
				<view class="list-content" :class="[item.uid == meTeam.id ? 'is-me' : '']" :key="index"
					v-if="index >= 3">
					<view class="item-left item-rank-num">
						<!-- <image
            class="rank-icon"
            v-if="index <= 2"
            :src="'/pages/rankBoard/static/rank0' + (index + 1) + '.png'"
            mode="aspectFill"
          ></image> -->
						<!-- <text v-else>{{ index + 1 }}</text> -->
						<text>{{ index + 1}}</text>
					</view>
					<view class="item-middle item-info">
						<image class="item-avatar" mode="aspectFit" :src="item.avatar_url"></image>
						<text v-if="item.uid == meTeam.id">{{ meTeam.nick_name }}</text>
						<text v-else>{{ item.nick_name }}</text>
					</view>
					<view class="item-right ">
						<text class="light-num">{{ item.city_num }}</text>
						<text class="light-hint">点亮城市</text>
					</view>
				</view>
			</template>
		</mescroll-uni>
	</view>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import {
		getAllRank,
		getAllWeekRank
	} from "@/api/modules/home.js";
	//分页
	let NEXT = 0;
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				downOption: {
					use: false,
					isLock: true,
					auto: false, // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption: {
					use: false,
					// isLock:true,
					auto: true, // 不自动加载
					noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					// empty: {
					// 	tip: '~ 空空如也 ~', // 提示
					// 	btnText: '去新闻页'
					// },
					toTop: {
						src: "",
					},
					textNoMore: "~ 暂无更多信息 ~",
				},
				//列表数据
				listData: [],
				meTeam: {
					nick_name: "",
					rank: "",
					city_num: 0,
				},
			};
		},
		mounted() {
			this.initData();
		},
		methods: {
			/*下拉刷新的回调 */
			downCallback() {
				NEXT = 0;
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
				this.mescroll.resetUpScroll();
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				// const API = getAllRank;
				const API = getAllWeekRank; // 全民周榜
				let parmas = {
					limit: 20,
				};

				if (NEXT != 0) parmas.next = NEXT;

				//获取数据next:NEXT,
				API(parmas)
					.then((res) => {
						const {
							list,
							next,
							total
						} = res.data;
						this.meTeam = total;

						let data = {
							list: list || [],
						};

						//设置列表数据
						if (NEXT == 0) {
							this.listData = []; //如果是第一页需手动制空列表
						}
						NEXT = next;
						//填充数据
						this.listData = this.listData.concat(data.list);
						//联网成功的回调,隐藏下拉刷新和上拉加载的状态
						this.mescroll.endSuccess(data.list.length);
					})
					.catch((err) => {
						//联网失败, 结束加载
						this.mescroll.endErr();
					});
			},
			initData() {
				NEXT = 0;
				this.upCallback(1);
			},
		},
	};
</script>

<style lang="scss">
	.container {
		background-color: #fffefb;
		padding: 0rpx 8rpx;
		margin: 0 8rpx;
		box-sizing: border-box;
		height: calc(100vh - 170rpx);

		.sticky-box {
			z-index: 990;
			position: sticky;
			top: 0px;
			background-color: #fffefb;
			box-sizing: border-box;

			.top-three {
				display: flex;
				align-items: center;
				padding-bottom: 20rpx;

				.top-three-item {
					margin-right: 16rpx;
			
					&.three-item-one{
						order: 1;
					}
					&.three-item-three{
						order: 2;
					}
					&:last-child {
						margin-right: 0;
					}

					.rank-img {
						width: 100%;
						text-align: center;
						margin-bottom: 44rpx;

						image {
							width: 46rpx;
							height: 54rpx;
						}
					}

					.top-three-content {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						position: relative;
						padding-top: 60rpx;
						box-sizing: border-box;

						&.rank-one {
							width: 248rpx;
							height: 356rpx;
							background: url("https://file.y1b.cn/public/img/bfzx/no_1@2x.png") no-repeat;
							background-size: 100% 100%;
						}

						&.rank-two {
							width: 218rpx;
							height: 286rpx;
							background: url("https://file.y1b.cn/public/img/bfzx/no_2@2x.png") no-repeat;
							background-size: 100% 100%;
						}

						&.rank-three {
							width: 218rpx;
							height: 286rpx;
							background: url("https://file.y1b.cn/public/img/bfzx/no_3@2x.png") no-repeat;
							background-size: 100% 100%;
						}

						.content-avatar {
							width: 96rpx;
							height: 96rpx;
							border-radius: 50%;
							position: absolute;
							top: -20rpx;
							left: 50%;
							transform: translateX(-50%);
						}

						.content-name {
							display: block;
							font-size: 36rpx;
							color: #333333;
							margin-bottom: 30rpx;
						}

						.content-city-num {
							font-size: 36rpx;
							color: #333333;
						}

						.content-hint {
							font-size: 26rpx;
							color: #666666;
						}
					}
				}
			}

			// .my-info-box {
			// 	display: flex;
			// 	align-items: center;
			// 	justify-content: space-between;
			// 	height: 160rpx;
			// 	background-color: #fff4e1;
			// 	border-radius: 20rpx;
			// 	box-sizing: border-box;
			// 	padding: 0 24rpx;

			// 	.avatar {
			// 		border-radius: 50%;
			// 		width: 100rpx;
			// 		height: 100rpx;
			// 		flex-shrink: 0;
			// 		margin-right: 16rpx;
			// 	}

			// 	.rank-info-box {
			// 		display: flex;
			// 		flex: 1;
			// 		align-items: center;
			// 		justify-content: space-between;
			// 		font-size: 28rpx;
			// 		color: #000018;

			// 		.my-name {
			// 			font-size: 32rpx;
			// 			font-weight: 700;
			// 			text-align: left;
			// 			color: #000018;
			// 		}

			// 		.my-rank-num {
			// 			font-weight: 400;
			// 			text-align: left;
			// 			color: #e3001b;
			// 		}

			// 		.lignt-num {
			// 			color: #e3001b;
			// 		}
			// 	}
			// }

			.list-head {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 100rpx;
				border-bottom: 1rpx solid #fdebcf;
				padding-left: 16rpx;
			}
		}

		.item-left {
			// min-width: 80rpx;
			min-width: 60rpx;
			display: inline-block;
			// text-align: center;
			text-align: left;
		}

		.item-middle {
			flex: 0.5;
			flex-shrink: 0;
			text-align: center;
		}

		.item-right {
			min-width: 200rpx;
			display: inline-block;
			// text-align: center;
			text-align: right;
			font-size: 24rpx;

		}

		.list-content {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 124rpx;
			// border-bottom: 1rpx solid #fdebcf;
			// padding-left: 16rpx;
			padding: 0 16rpx;

			&:last-child {
				padding-bottom: 50rpx;
			}

			&.is-me {
				background-color: #FFF4E1;
			}

			.rank-icon {
				width: 46rpx;
				height: 54rpx;
			}

			.light-num {
				// color: #ff4907;
				font-size: 32rpx;
			}

			.light-hint {
				display: block;
				font-size: 26rpx;
				color: #AAAAAA;
			}

			.item-info {
				flex: 1;
				display: flex;
				align-items: center;
				// padding-left: 140rpx;
				// font-size: 24rpx;
				font-size: 36rpx;

				.item-avatar {
					margin-right: 10rpx;
					// width: 60rpx;
					// height: 60rpx;
					width: 76rpx;
					height: 76rpx;
					border-radius: 50%;
				}
			}
		}
	}
</style>