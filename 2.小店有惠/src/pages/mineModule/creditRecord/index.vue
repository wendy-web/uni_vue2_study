<template>
	<view class="cowpea-record">
		<mescroll-uni :fixed="true" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="stick-box">
				<!-- 日期选择、统计信息 -->
				<view class="count-box">
					<view class="count-left" @click="showDatePicker = true">
						<text class="month">{{selectMonth}}</text>
						<text>月</text>
						<image class="icon-delta" mode="aspectFit" src="@/static/images/mine/icon_delta.png"></image>
					</view>
					<view class="count-right">
						<image class="icon-credit" mode="aspectFit" src="../static/credit/icon_credit.png"></image>
						<text v-if="total_credits>0" class="month">{{active > 0?'-':'+'}}</text>
						<text class="month">{{total_credits}}</text>
						<text class="credit">积分</text>
					</view>
				</view>
				<!-- 导航栏 -->
				<view class="cowpea-record-tabs">
					<van-tabs :active="active" @change="tabChange" line-width="52rpx" line-height="4rpx"
						tab-class="cowpea-tabs">
						<van-tab v-for="(item,index) in tabs" :key="item.id" :title="item.name" :name="index" />
					</van-tabs>
				</view>
			</view>
			<view class="list-box">
				<!-- 列表 -->
				<view class="list-item" v-for="item in goods" :key="item.id">
					<view class="list-item-left">
						<view class="list-item-title">
							{{item.note}}
						</view>
						<!-- <view class="list-item-time">
							{{creditSource[item.status]}}
						</view> -->
					</view>
					<!-- 收支 -->
					<view class="list-item-right">
						<view class="cb-num">
							<image class="icon-credit" mode="aspectFit" src="../static/credit/icon_credit.png"></image>
							<text>{{item.type==1?'+':'-'}}</text>
							<text class="cb-num-change">{{item.amount}}</text>
							<text class="list-item-time">积分</text>
						</view>
						<view class="list-item-time">
							{{item.create_date}}
						</view>
					</view>
				</view>
			</view>
		</mescroll-uni>
		<!-- 月份picker弹窗 -->
		<van-popup :show="showDatePicker" @close="showDatePicker = false" round position="bottom"
			custom-style="width:100%">
			<view class="birth-pop">
				<van-datetime-picker type="year-month" :value="currentDate" :min-date="minDate" :max-date="maxDate"
					@change="dateChange" @confirm="dateConfirm" @cancel="showDatePicker = false" />
			</view>
		</van-popup>
	</view>
</template>
<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import {
		creditsLog
	} from '@/api/modules/mine.js'
	import {
		parseTime
	} from "@/utils/index.js";
	// date传参格式:2023-04
	let _date = parseTime(Date.now(), "{y}-{m}")
	// 积分来源
	let _creditSource = {
		0:'未知',
		1:'新手任务',
		2:'每日任务',
		3:'签到',
		4:'抽奖',
		5:'兑换',
		6:'退返',
		7:'过期'
	}
	export default {
		mixins: [MescrollMixin], // 使用mixin
		computed: {
			total_credits() {
				const activeIndex = this.active;
				return this.tabs[activeIndex].totalCredits;
			},
			// 列表数据
			goods() {
				return this.tabs[this.active].goods;
			}
		},
		data() {
			return {
				active: 0,
				tabs: [
					// {id:0,name:'全部', goods: null, num:1, curPageLen:0, hasNext:true},
					{
						id: 1,
						name: '收入',
						goods: null,
						num: 1,
						curPageLen: 0,
						hasNext: true,
						totalCredits: 0
					},
					{
						id: 2,
						name: '支出',
						goods: null,
						num: 1,
						curPageLen: 0,
						hasNext: true,
						totalCredits: 0
					}
				],
				preIndex: null,
				showDatePicker: false,
				selectMonth: new Date().getMonth() + 1,
				currentDate: new Date().getTime(),
				minDate: new Date("2020/01/01").getTime(),
				maxDate: new Date().getTime(),
				creditSource:_creditSource,//积分来源
			}
		},
		methods: {
			/*下拉刷新的回调 */
			downCallback() {
				// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
				// loadSwiper();
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
				this.tabs.forEach(item => item.goods = null);
				this.mescroll.resetUpScroll();
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				let key = this.tabs[this.active].id;
				//参数
				let params = {
					page: page.num,
					type: key,
					date: _date
				}
				creditsLog(params).then((res) => {
					let list = res.data ? res.data.list : []
					// 需先隐藏加载状态
					this.mescroll.endSuccess(list.length);
					// 当前tab数据
					let curTab = this.tabs[this.active]
					// 设置列表数据
					if (page.num == 1) curTab.goods = []; //如果是第一页需手动制空列表
					curTab.goods = curTab.goods.concat(list); //追加新数据
					curTab.num = page.num; // 页码
					curTab.curPageLen = list.length; // 当前页长
					curTab.hasNext = this.mescroll.optUp.hasNext; // 是否还有下一页
					curTab.totalCredits = res.data.total_credits;
				}, 200)
				//联网失败, 结束加载
				// this.mescroll.endErr();
			},
			// 切换菜单
			tabChange(e) {
				this.active = e.detail.name;
				// 记录切换前滚动条的位置
				if (!this.preIndex) this.preIndex = 0;
				let preTab = this.tabs[this.preIndex];
				preTab.y = this.mescroll.getScrollTop();
				this.preIndex = this.active;
				// 当前菜单的数据
				let curTab = this.tabs[this.active];
				if (!curTab.goods) {
					// 没有初始化,则初始化
					this.mescroll.resetUpScroll()
				} else {
					// 初始化过,则恢复之前的列表数据
					this.mescroll.setPageNum(curTab.num + 1); // 恢复当前页码
					this.mescroll.endSuccess(curTab.curPageLen, curTab.hasNext); // 恢复是否有下一页或显示空布局
					this.$nextTick(() => {
						this.mescroll.scrollTo(curTab.y, 0) // 恢复滚动条的位置
					});
				}
			},
			getData() {
				let size = Math.random() * 10
				let arr = []
				for (let i = 0; i < size; i++) {
					let isFlag = Math.round(Math.random()) > 0
					arr.push({
						id: Math.random() * 10 + '_' + i,
						num: isFlag ? 5 : -5,
						name: '兑换「某优惠券名称」',
						time: '2020-12-06 59:59:59'
					})
				}
				return arr
			},
			// 选择日期
			dateChange(e) {
				let arr = e.detail.getValues();
				this.selectMonth = Number(arr[1])
				let date = arr.join("-");
				_date = date
				console.log(arr, date)
			},
			dateConfirm(e) {
				let {
					detail
				} = e;
				console.log(detail);
				let date = new Date(detail);
				_date = parseTime(detail, "{y}-{m}");
				this.showDatePicker = false;

				// // 防止重复请求
				// if (_request) return (_request = true);
				let params = {
					birthday: parseTime(detail, "{y}-{m}-{d}"),
					page: 1,
					constellation: this.constellation,
				};
				this.downCallback()
				// this.editUserInfo(params);
			},
		}
	}
</script>

<style lang="scss">
	::v-deep {
		page {
			width: auto;
			height: auto;
			overflow: scroll;
			background: unset;

			>view {
				height: auto;
				overflow: auto;
			}
		}

	}
	.stick-box{
		position:sticky;
		top: 0;
		background-color: #ffffff;
		z-index: 2;
	}
	.count-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		background-color: #f4f5f9;
		height: 128rpx;
		font-size: 28rpx;
		font-weight: 400;
		color: #333333;
		padding: 0 32rpx;

		.count-left {
			display: flex;
			align-items: baseline;
			min-width: 200rpx;
			padding: 20rpx 0;
			box-sizing: border-box;
		}

		.month {
			font-size: 48rpx;
			font-weight: 500;
			color: #333333;
		}

		.icon-delta {
			width: 16rpx;
			height: 12rpx;
			margin-left: 10rpx;
			padding-bottom: 2rpx;
		}

		.count-right {
			display: flex;
			align-items: baseline;
			position: relative;
			padding-left: 45rpx;

			.credit {
				margin-left: 4rpx;
			}

			.icon-credit {
				width: 44rpx;
				height: 44rpx;
				position: absolute;
				left: 0;
				top: 58%;
				transform: translateY(-50%);
			}
		}

	}

	.van-tabs__scroll {
		background-color: #f7f7f7 !important;
	}

	.cowpea-record-tabs {
		margin: 0 140rpx;

		.cowpea-tabs {
			background-color: #ffffff;
		}
	}

	.list-box {
		// position: absolute;
		// top: 48px;
		// bottom: 0;
		// left: 0;
		width: 100%;
		height: auto;
		background-color: #ffffff;
		border-radius: 16px 16px 0px 0px;
	}

	.list-item {
		padding: 0 32rpx;
		height: 152rpx;
		position: relative;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-top: 1rpx solid #F1F1F1;
	}

	.list-item:last-child {
		border-bottom: 1rpx solid #F1F1F1;
	}

	.list-item-title {
		font-size: 26rpx;
		font-weight: 400;
		color: #333333;
		margin-bottom: 8rpx;
	}

	.list-item-time {
		font-size: 26rpx;
		font-weight: 400;
		color: #cccccc;
	}

	.list-item-right {
		white-space: nowrap;

		display: flex;
		flex-direction: column;
		align-items: flex-end;

		.icon-credit {
			width: 32rpx;
			height: 32rpx;
			// position: absolute;
			// left: 0;
			// top: 58%;
			// transform: translateY(-50%);
		}
	}

	.cb-num {
		font-weight: 500;
		color: #fec927;
		margin-bottom: 8rpx;
		display: flex;
		align-items: center;
		font-size: 26rpx;
		font-weight: 400;
		text-align: left;
		color: #333333;

		.cb-num-change {
			font-weight: 400;
		}
	}

	.van-tab .van-ellipsis {
		font-size: 28rpx;
	}

	.van-tab.van-tab--active .van-ellipsis {
		font-weight: 600;
	}
</style>