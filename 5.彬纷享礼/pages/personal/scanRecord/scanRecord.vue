<template>
	<!-- 注: 本示例仅演示mescroll-body写在一层子组件的情况, 其实同样适用mescroll-body写在子子..子组件的情况, 只需每一层都要写上第一步和第二步的代码即可 -->
	<view class="scan-record">
		<view class="sr-date-select">
			<view class="sr-date-btn" @click="showCalendar">
				<image class="sr-date-logo" src="../static/date_select.png" mode="widthFix"></image>
				<view class="notice">日期筛选</view>
				<image class="sr-date-icon" :class="{'open':isOpen}" src="../static/date_select_icon.png"
					mode="widthFix">
				</image>
			</view>
			<view class="sr-date-btn-text" v-if="select_time.length>0">
				<view class="select-date-text">
					{{select_time[0]}}~{{select_time[1]}}
				</view>
				<image @click="reset" class="reset-icon" src="../static/close.png"></image>
			</view>
		</view>
		<!-- 第一步: 给mescroll-body的组件添加: ref="mescrollItem" (固定的,不可改,与mescroll-comp.js对应)-->
		<!-- 当mescroll-body写在子组件时,父页面需引入mescroll-comp.js的mixins -->
		<mescroll-body ref="mescrollRef" top="100" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<!-- 数据列表 -->
			<view class="sr-scan-item" v-for="(item,index) in listData" :key="index">
				<view class="sr-scan-item-header">
					<text>{{item.title}}</text>
					<text>{{item.message}}</text>
				</view>
				<view class="sr-scan-item-tiem">
					{{item.create_time}}
				</view>
			</view>
		</mescroll-body>
		<!-- 时间范围 -->
		<van-calendar :show="isOpen" type="range" allow-same-day :default-date="[Date.now(),Date.now()]"
			@close="onClose" confirm-disabled-text="请选择结束时间" :min-date="minDate" :max-date="maxDate"
			@confirm="onConfirm" />
	</view>
</template>

<script>
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	import {
		parseTime
	} from '@/utils/index.js';
	import {
		scanlog
	} from '@/api/homeApi.js';
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				isOpen: false,
				listData: [],
				select_time: [],
				minDate: new Date().getTime(),
				maxDate: new Date().getTime(),
			};
		},
		methods: {
			upCallback(page) {
				let parmas = {
					next: page.num
				};
				//配置查询参数
				if (this.select_time && this.select_time.length > 0) {
					parmas.start_time = this.select_time[0];
					parmas.end_time = this.select_time[1];
				}
				//联网加载数据
				scanlog(parmas).then(res => {
					let data = res.data || {
						list: []
					};
					//    //处理显示
					//    data.list.forEach(function(item){

					// 	 if(item.code==0){
					// 		 if(item.prizeratetype == 2)item.title = '26周年1元享红牛拉环扫码';
					// 		 else if(item.prizeratetype == 3)item.title = '27周年1元乐享拉环扫码';
					// 		 else if([null,0,1].indexOf(item.prizeratetype)>-1)item.title = '25周年1元轻松享拉环扫码';
					// 		 else if(item.prizeratetype == 4)item.title = '战马1元乐享拉环扫码'
					// 	 }else{
					// 		 item.title = '拉环扫码'
					// 	 }

					// });

					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					this.mescroll.endSuccess(data.list.length);
					//设置列表数据
					if (page.num == 1) this.listData = []; //如果是第一页需手动制空列表
					this.listData = this.listData.concat(data.list); //追加新数据
				}).catch(() => {
					//联网失败, 结束加载
					this.mescroll.endErr();
				});
			},
			showCalendar() {
				this.minDate = new Date(2020, 7, 1).getTime();
				this.maxDate = new Date().getTime();
				this.isOpen = true;
			},
			onClose() {
				this.isOpen = false;
			},
			reset() {
				this.select_time = [];
				this.mescroll.resetUpScroll();
			},
			onConfirm(event) {
				this.isOpen = false;
				this.select_time = [parseTime(event.detail[0], '{y}-{m}-{d}'), parseTime(event.detail[1],
					'{y}-{m}-{d}')];
				this.mescroll.resetUpScroll();
			}
		}
	};
</script>

<style lang="scss">
	.scan-record {
		.sr-date-select {
			display: flex;
			align-items: center;
			padding-left: 40rpx;
			position: fixed;
			width: 100%;
			height: 100rpx;
			left: 0;
			top: 0;
			z-index: 1;
			background-color: #FFFFFF;
		}

		.sr-date-btn,
		.sr-date-btn-text {
			display: flex;
			align-items: center;
		}

		.sr-date-logo {
			width: 30rpx;
			height: 30rpx;
			margin-right: 10rpx;
		}

		.sr-date-icon {
			height: 8rpx;
			width: 16rpx;
			margin-left: 10rpx;
		}

		.open {
			transform: rotate(-180deg);
			transition: 0.2s;
		}

		.select-date-text {
			font-size: 25rpx;
			color: #999;
			margin-left: 10rpx;
		}

		.reset-icon {
			width: 40rpx;
			height: 40rpx;
			margin-left: 8rpx;
		}

		.sr-scan-item {
			padding: 40rpx;
			position: relative;

			&::after {
				content: '';
				position: absolute;
				bottom: 0;
				left: 50%;
				width: 80%;
				transform: translateX(-50%);
				border-bottom: 2rpx dashed #e2e2e2;
			}

			.sr-scan-item-header {
				display: flex;
				justify-content: space-between;
				font-size: 28rpx;
				color: #333333;
				font-weight: 700;
			}

			.sr-scan-item-tiem {
				margin-top: 10rpx;
				color: #999;
				font-size: 24rpx;
			}
		}
	}
</style>