<template>
	<view class="my-volunteer">
		<!-- 顶部背景 -->
		<image class="head-bg" src="/pages/user/static/bg_volunteer_index.png" mode="aspectFill"></image>
		<xh-navbar :title="navTitle" titleColor="#000018" titleAlign="titleCenter" leftImage="/static/images/back.png"
			@leftCallBack="backHome" />
		<view class="my-volunteer-head">
			<!-- volunteer tabs -->
			<view class="volunteer-tabs">
				<view class="tabs-item">
					<view class="tabs-num">
						{{total.donated_love}}
					</view>
					<view class="tabs-title">
						{{type==0?'我':'团队'}}已捐献能量
					</view>
				</view>
				<view class="tabs-item">
					<view class="tabs-num">
						{{total.com_num}}
					</view>
					<view class="tabs-title">
						已助力公益
					</view>
				</view>
			</view>
			<!-- icon -->
			<!-- <image class="volunteer-icon" src="../static/volunteer_icon.png" mode="aspectFill"></image> -->
			<!-- 波浪 -->
			<!-- <image class="waves" src="../static/waves.png" mode="aspectFill"></image> -->
		</view>
		<!-- list -->
		<view class="my-volunteer-box">
			<!-- 			  <view class="volunteer-box-head">
			  	  <view class="box-head-title">
			  	  	已捐献项目
			  	  </view>
				  <view class="box-head-right" @click="goLove">
				  	 <text>更多公益项目</text><van-icon name="arrow" />
				  </view>
			  </view> -->
			<view class="volunteer-box-list">
				<mescroll-uni ref="mescrollRef" :fixed="false" @init="mescrollInit" :down="downOption"
					@down="downCallback" :up="upOption" @up="upCallback">
					<list-item v-for="item in listData" :key="item.id" :config="item" :love="total.love" :type="type">
					</list-item>
				</mescroll-uni>
			</view>

		</view>
	</view>
</template>

<script>
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	import {
		getUserDonateList,
		getTeamDonateList
	} from '@/api/modules/love.js'
	import listItem from './listItem.vue'
	//分页
	let NEXT = 0;
	export default {
		components: {
			listItem
		},
		mixins: [MescrollMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		data() {
			return {
				downOption: {
					auto: true // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption: {
					auto: false, // 不自动加载
					noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					// empty: {
					// 	tip: '~ 空空如也 ~', // 提示
					// 	btnText: '去新闻页'
					// },
					toTop: {
						src: ''
					},
			 	textNoMore: '----- 没有更多了 -----'
				},
				//列表数据
				listData: [],
				total: {
					donated_num: 0,
					donated_love: 0
				},
				type: 0,
				navTitle: '我的公益',
			}
		},
		onLoad(o) {
			NEXT = 0
			// this.type = o.type
			this.type = 0
			// uni.setNavigationBarTitle({
			// 	title:this.type == 0?'我的公益':'团队公益'
			// })
			this.navTitle = this.type == 0 ? '我的公益' : '团队公益'
		},
		methods: {
			goLove() {
				uni.navigateTo({
					url: '/pages/tabBar/love/index?type=' + this.type
				})
			},
			/*下拉刷新的回调 */
			downCallback() {
				NEXT = 0
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
				this.mescroll.resetUpScroll();
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				const API = this.type == 0 ? getUserDonateList : getTeamDonateList

				let parmas = {
					limit: 10
				}

				if (NEXT != 0) parmas.next = NEXT

				//获取数据next:NEXT,
				API(parmas).then(res => {

					const {
						total,
						list,
						next
					} = res.data

					let data = {
						list: list || []
					};

					//联网成功的回调,隐藏下拉刷新和上拉加载的状态
					this.mescroll.endSuccess(data.list.length);
					//设置列表数据
					if (NEXT == 0) {
						this.listData = []; //如果是第一页需手动制空列表
						this.total = total
					}
					NEXT = next
					//填充数据
					this.listData = this.listData.concat(data.list);

				}).catch(err => {
					//联网失败, 结束加载
					this.mescroll.endErr();
				});

			},
			backHome() {
				uni.navigateBack({
					fail(e) {
						uni.reLaunch({
							url: '/pages/tabBar/home/index'
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff2d9;
	}

	.xh-navber .left-tools {
		filter: brightness(0);
	}

	.my-volunteer {
		.head-bg {
			width: 100%;
			height: 460rpx;
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
		}

		.my-volunteer-head {
			// background-color: #3E8DE2;
			position: relative;
			margin-bottom: 46rpx;
		}

		.waves {
			position: absolute;
			width: 100%;
			height: 134rpx;
			left: 0;
			bottom: 0;
		}

		.volunteer-icon {
			width: 208rpx;
			height: 284rpx;
			position: absolute;
			left: 0;
			top: 0;
		}

		.volunteer-tabs {
			display: flex;
			position: relative;
			z-index: 1;
			padding-top: 20rpx;
		}

		.tabs-item {
			flex: 1;
			text-align: center;
		}

		.tabs-title {
			font-size: 32rpx;
			color: #2B2B2B;
			margin-top: 20rpx;
		}

		.tabs-num {
			font-size: 72rpx;
			font-weight: 700;
			color: #ffbc1e;
			margin-top: 22rpx;
		}

		.my-volunteer-box {
			position: absolute;
			top: 430rpx;
			bottom: 30rpx;
			left: 20rpx;
			right: 20rpx;
			background-color: #ffffff;
			border-radius: 20px 20px 0px 0px;
		}

		.volunteer-box-head {
			height: 132rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-left: 40rpx;
			position: relative;

			&::after {
				content: '';
				position: absolute;
				left: 35rpx;
				right: 35rpx;
				bottom: 10rpx;
				height: 2rpx;
				background-color: #707070;
				opacity: 0.22;
			}
		}

		.box-head-title {
			font-size: 32rpx;
			font-weight: 700;
			color: #000018;
		}

		.box-head-right {
			font-size: 28rpx;
			font-weight: 400;
			color: #FF6F00;
			padding: 20rpx;
		}

		.volunteer-box-list {
			position: absolute;
			// top: 132rpx;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
		}

		.donation-record .record-time .look {
			color: #8E8E91;
		}
	}
</style>
