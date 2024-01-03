<template>
	<view class="volunteer-card">
		<!-- 顶部背景 -->
		<image class="head-bg" src="/pages/user/static/bg_volunteerCard_index.png" mode="aspectFill"></image>
		<xh-navbar :title="navTitle" titleColor="#000018" titleAlign="titleCenter" leftImage="/static/images/back.png"
			@leftCallBack="backHome" />
		<view class="my-volunteer-head">
			<!-- volunteer tabs -->
			<view class="volunteer-tabs">
				<view class="tabs-item">

					<view class="tabs-num">
						{{total.com_cert_num}}
					</view>
					<view class="tabs-title">
						捐献次数
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
			<!-- <image class="volunteer-icon" src="../static/v_card_icon.png" mode="aspectFill"></image> -->
		</view>
		<view class="volunteer-card-box">
			<mescroll-uni ref="mescrollRef" :fixed="false" @init="mescrollInit" :down="downOption" @down="downCallback"
				:up="upOption" @up="upCallback" safearea>
				<list-item v-for="item in listData" :key="item.id" :config="item" @lookCard="lookCard" />
			</mescroll-uni>
		</view>
		<!-- 单个证书 -->
		<honor-card ref="honorCard" />
	</view>
</template>

<script>
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	import {
		getUserCertList,
		getTeamCertList,
		getCert
	} from '@/api/modules/love.js'
	import listItem from './listItem.vue'
	import honorCard from '@/components/honorCard/honorCard.vue'
	//分页
	let NEXT = 0;
	export default {
		mixins: [MescrollMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components: {
			listItem,
			honorCard
		},
		data() {
			return {
				downOption: {
					auto: true, // 不自动加载 (mixin已处理第一个tab触发downCallback)
					textColor: '#fff'
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
					textNoMore: '~ 暂无更多信息 ~'
				},
				//列表数据
				listData: [],
				total: {
					com_cert_num: 0,
					com_num: 0
				},
				type: 0,
				navTitle: '我的公益证书', //页面标题
			}
		},
		onLoad(o) {
			// this.type = o.type
			this.type = 0
			// uni.setNavigationBarTitle({
			// 	title:this.type == 0?'我的公益证书':'团队公益证书'
			// })
			this.navTitle = this.type == 0 ? '我的公益证书' : '团队公益证书'
		},
		onShareAppMessage() {
			return {
				title: `快来看看${this.type == 0?'我':'我们'}的能量证书！`,
				path: '/pages/tabBar/home/index',
				imageUrl: this.$refs.honorCard.getImageUrl()
			};
		},
		methods: {
			//查看單個證書
			lookCard(data) {
				getCert(data).then(res => {
					const {
						cert_content,
						cert_date,
						user,
						team
					} = res.data
					const image = team ? team.image : user.avatar_url
					const name = team ? team.name : user.nick_name
					this.$refs.honorCard.showTime({
						image,
						name,
						cert_content,
						time: cert_date
					})
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
				const API = this.type == 0 ? getUserCertList : getTeamCertList

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

					//设置列表数据
					if (NEXT == 0) {
						this.listData = []; //如果是第一页需手动制空列表
						this.total = total
					}
					NEXT = next
					//填充数据
					if (total.com_cert_num == 0) {
						//联网成功的回调,隐藏下拉刷新和上拉加载的状态
						this.mescroll.endSuccess(0);
						return
					}
					this.listData = this.listData.concat(data.list);
					this.mescroll.endSuccess(data.list.length);

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
		background-color: #f6f5f4;
	}

	.xh-navber .left-tools {
		filter: brightness(0);
	}

	.volunteer-card {
		.head-bg {
			width: 100%;
			height: 460rpx;
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
		}

		.my-volunteer-head {
			height: 426rpx;
			position: relative;
		}

		.volunteer-icon {
			width: 278rpx;
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
			font-weight: 400;
			color: #2B2B2B;
			margin-top: 20rpx;
		}

		.tabs-num {
			font-size: 72rpx;
			font-weight: 700;
			color: #FF7507;
			margin-top: 22rpx;
		}

		.volunteer-card-box {
			position: absolute;
			top: 430rpx;
			bottom: 0;
			left: 0;
			right: 0;
		}

	}
</style>
