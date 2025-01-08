<template>
	<view class="container">
		<uni-nav-bar
			background-color="linear-gradient(to left, #DAE3FF, #ECF4FF, #E1E8FF); "
			status-bar
			:title="adminTitleShow"
			:border="false"
			fixed
			:titleStyle="{
				fontWeight: 'bold',
				fontSize: '16px'
			}"
		/>
		<mescroll-body @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption" :sticky="true">
			<warningVue v-if="checkStockWarning()"></warningVue>
			<view class="backlog">
				<view class="backlog-header">
					<text class="line"></text>
					<text class="backlog-header-text">我的审批</text>
				</view>
				<view class="backlog-list">
					<view class="backlog-item warning" @click="toBacklog(1)">
						<text>待审批</text>
						<text class="backlog-num">{{ wait_approve_total }}</text>
					</view>
					<view class="backlog-item primary" @click="toBacklog(2)">
						<text>待处理</text>
						<text class="backlog-num">{{ wait_handle_total }}</text>
					</view>
					<view class="backlog-item success" @click="toBacklog(3)">
						<text>我发起</text>
						<text class="backlog-num">{{ my_initiate_total }}</text>
					</view>
				</view>
			</view>
			<!-- 设备管理系统 -->
			<view class="backlog" v-if="moduleType == 1">
				<view class="backlog-header">
					<text class="line"></text>
					<text class="backlog-header-text">计划提醒</text>
				</view>
				<view class="backlog-list backlog-list2">
					<view class="backlog-item warning" @click="goToPlanHandle(1)">
						<text>保养计划</text>
						<text class="backlog-num">{{ main_notice_num }}</text>
					</view>
					<view class="backlog-item primary" @click="goToPlanHandle(2)">
						<text>点巡检计划</text>
						<text class="backlog-num">{{ point_notice_num }}</text>
					</view>
				</view>
			</view>
			<view class="gap"></view>
			<view class="news">
				<view class="news-header">
					<view class="news-header-title">
						<text class="line"></text>
						<text class="line-text">我的消息</text>
					</view>
					<view class="news-header-unread" v-if="unread_num > 0">
						<text class="dot"></text>
						<text class="unread-text">未读</text>
						<text>{{ unread_num }}</text>
					</view>
					<view class="news-header-operation" hover-class="icon-hover" @click="handleAllRead">
						<!-- <uv-text prefixIcon="email" iconStyle="font-size: 19px" text="一键已读"></uv-text> -->
						<uv-icon
							custom-prefix="custom-icon"
							name="yidu"
							color="#7898FF"
							size="16"
							label="一键已读"
							space="4"
							hover-class="icon-hover"
						></uv-icon>
					</view>
				</view>
				<view class="news-list">
					<view class="news-item" v-for="item in dataList" :key="item.id" @click="handleOneRead(item)">
						<view class="news-item-left">
							<text class="dot" v-if="!item.is_read"></text>
							<text class="news-item-msg">{{ item.msg_content }}</text>
						</view>
						<text class="news-item-time">{{ formartDate(item.create_time) }}</text>
					</view>
				</view>
			</view>
		</mescroll-body>
		<uv-toast ref="toast"></uv-toast>
	</view>
</template>
<script>
import { getBacklogApi, getPlanNoticeDataApi, getWorkMsgApi, setReadMsgApi } from "@/api/modules/home.js";
import myMixin from "@/mixin/index.js";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { hasPerm } from "@/utils/auth.js";
import { formartDate as formartDateFn } from "@/utils/validate.js";
import { mapGetters } from "vuex";
import { documentDetailMap } from "./index.js";
import warningVue from "./warning/index.vue";
export default {
	mixins: [myMixin, MescrollMixin],
	components: {
		warningVue,
	},
	data() {
		return {
			dataList: [],
			/** 未读消息数量  */
			unread_num: 0,
			/** 待审批数量 */
			wait_approve_total: 0,
			/** 待处理数量 */
			wait_handle_total: 0,
			/** 我发起数量 */
			my_initiate_total: 0,
			main_notice_num: 0, // 保养计划提醒数量
			point_notice_num: 0, // 点巡检计划提醒数量
			upOption: {
				page: {
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: 15, // 每页数据的数量
					time: null, // 加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
				},
				noMoreSize: 10, // 如果列表已无数据,可设置列表的总数量要大于等于5条才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
				textLoading: "加载中 ...", // 加载中的提示文本
				textNoMore: "-- 没有更多了 --", // 没有更多数据的提示文本
			},
		};
	},
	computed: {
		...mapGetters(["moduleType"]),
	},
	onLoad(options) {
		console.log('this.userInfo', this.userInfo)
	},
	methods: {
		checkStockWarning(){
		 return	hasPerm(['goods:stock:list']);
		},
		/** 跳转到待办列表页面  */
		toBacklog(stat_type) {
			uni.navigateTo({
				url: `./backlog/backlog?stat_type=${stat_type}`,
			});
		},
		goToPlanHandle(type) {
			let path = '';
			if(type == 1) {
				if(!this.main_notice_num) return;
				path = `/pages/deviceModule/maintain/plan/list`;
			} else {
				if(!this.point_notice_num) return;
				path = '/pages/deviceModule/inspection/plan/list';
			}
			uni.navigateTo({
				url: `${path}?is_advent=1`,
			});
		},

		// 上拉加载
		async upCallback(page) {
			const backParams = { page: 1, size: 10, type: 1 };
			let notionsParams = {
				page: page.num,
				size: page.size,
				type: 1,
			};
			try {
				const backlogRes = await getBacklogApi(backParams);
				this.wait_approve_total = backlogRes.data.wait_approve_total;
				this.wait_handle_total = backlogRes.data.wait_handle_total;
				this.my_initiate_total = backlogRes.data.my_initiate_total;
				if(this.moduleType == 1) {
					const resNotice = await getPlanNoticeDataApi();
					const { main_notice_num, point_notice_num } = resNotice.data;
					this.main_notice_num = main_notice_num;
					this.point_notice_num = point_notice_num;
				}

				const result = await getWorkMsgApi(notionsParams);
				const total = result.data.total;
				// console.log("total", total);
				const res = result.data;
				this.unread_num = res.unread_num;
				// this.unread_num = 0;

				//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
				this.mescroll.endBySize(res.list.length, total); //必传参数(当前页的数据个数, 总数据量)
				//设置列表数据
				if (page.num == 1) this.dataList = []; //如果是第一页需手动制空列表
				this.dataList = this.dataList.concat(res.list); //追加新数据
			} catch (e) {
				console.log("错误", e);
				//TODO handle the exception
				//联网失败, 结束加载
				this.mescroll.endErr();
			}
		},
		formartDate(date) {
			return formartDateFn(date);
		},
		/** 点击一键已读触发的事件 */
		async handleAllRead() {
			if (!this.unread_num) {
				this.showToastRefresh({ msg: "暂无未读消息", type: "default" });
				return;
			}
			const result = await setReadMsgApi({ id: undefined });
			this.toastRefresh("操作成功");
			this.mescroll.scrollTo(0, 0);
		},
		/** 点击消息 */
		async handleOneRead(item) {
			this.handleSubscribe(item);
			let msgTemplateId = this.msgTemplateId;
			console.log("msgTemplateId", msgTemplateId);
			wx.requestSubscribeMessage({
				tmplIds: [msgTemplateId],
				success: (res) => {
					console.log("res", res);
				},
				fail: (err) => {
					console.log("requestSubscribeMessageerr", err);
					// this.handleSubscribe(item);
				},
			});
			// uni.getSetting({
			// 	withSubscriptions: true,
			// 	success: (res) => {
			// 		console.log("getSetting", res);
			// 		let subscriptionsSetting = res.subscriptionsSetting;
			// 		if (subscriptionsSetting[msgTemplateId] == "reject") {
			// 			uni.showModal({
			// 				title: "温馨提示",
			// 				content: "您未允许通知管理的消息未读提醒,是否去打开",
			// 				confirmText: "去打开",
			// 				success: (res) => {
			// 					if (res.confirm) {
			// 						console.log("用户点击确定");
			// 						uni.openSetting({
			// 							withSubscriptions: true,
			// 							success: (res) => {
			// 								// console.log("openSettingres", res);
			// 								this.handleSubscribe(item);
			// 							},
			// 						});
			// 					} else if (res.cancel) {
			// 						console.log("用户点击取消");
			// 						this.handleSubscribe(item);
			// 					}
			// 				},
			// 			});
			// 			return;
			// 		}
			// 	},
			// });
		},

		async handleSubscribe(item) {
			if (!item.is_read) {
				let id = item.id;
				setReadMsgApi({ id });
				item.is_read = 1;
				this.reduceNoticeNum();
			}
			this.handleToTarget(item);
		},

		/** 跳转到目标页面 */
		handleToTarget(item) {
			console.log("item", item);
			const { document_type, status, document_id } = item;
			const link = documentDetailMap.get(document_type);
			// if (document_type === 5) {
			// 	uni.navigateTo({
			// 		url: link + `?order_id=${document_id}`,
			// 	});
			// }else{
			// 	uni.navigateTo({
			// 		url: link + `?id=${document_id}`,
			// 	});
			// }
			uni.navigateTo({
				url: link + `?id=${document_id}&status=${status}`,
			});
		},
		/** 通知消息数量减1 */
		reduceNoticeNum() {
			if (this.unread_num <= 0) return;
			this.unread_num -= 1;
		},
		toastRefresh(msg) {
			this.showToastRefresh(msg, this.mescroll.resetUpScroll(false));
		},
	},
};
</script>

<style lang="scss">
page {
	// background: linear-gradient(to left, #dae3ff, #ecf4ff, #e1e8ff);
	// background: linear-gradient(to bottom, #c6d6ff, #eff3fe, #f3f6fe);
}

$primary: #3c9cff;
$warning: #f9ae3d;
$success: #5ac725;
$error: #f56c6c;

.container {
	// padding: 0 20rpx;
}
.line {
	display: inline-block;
	width: 8rpx;
	height: 36rpx;
	background-color: $primary;
	margin-right: 8rpx;
}
.warning {
	background-color: $warning;
}
.primary {
	background-color: $primary;
}
.success {
	background-color: $success;
}
.gap {
	height: 20rpx;
	background: linear-gradient(to bottom, #c6d6ff, #eff3fe, #f3f6fe);
}
.icon-hover {
	position: relative;
	color: #3c9cff;
	&::before {
		content: "";
		display: block;
		position: absolute;
		inset: -10rpx;
		background-color: #f3f6fe;
		border-radius: 4rpx;
		z-index: -1;
	}
}

/* 头部-我的审批样式 */
.backlog {
	background-color: #fff;
	box-shadow: 0rpx 0rpx 12px rgba(0, 0, 0, 0.12);
	border-radius: 10rpx;
	padding: 20rpx;
	// margin-bottom: 20rpx;
	.backlog-header {
		font-weight: bold;
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}
	.backlog-list {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(1, 140rpx);
		grid-column-gap: 40rpx;
		justify-content:center;
		&.backlog-list2 {
			grid-template-columns: repeat(2, 0.33fr);
			justify-self:center;
		}
		.backlog-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			color: #fff;
			border-radius: 8rpx;
			.backlog-num {
				font-weight: bold;
				font-size: 40rpx;
			}
		}
	}
}
/* 我的消息 样式 */
.news {
	background-color: #fff;
	border-radius: 10rpx;
	/* 右侧消息的红点 */
	.dot {
		display: inline-block;
		width: 16rpx;
		height: 16rpx;
		border-radius: 50%;
		background-color: $error;
		flex-shrink: 0;
		vertical-align: middle;
	}
	/* 右侧消息的头部内容样式 */
	.news-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80rpx;
		border-bottom: 2rpx solid #a8abb2;
		padding: 0 20rpx;
		position: sticky;
		top: 170rpx;
		background-color: #fff;
		&-title {
			display: flex;
			align-items: center;
		}
		/* 未读样式 */
		&-unread {
			text-align: center;
			color: $error;
			.unread-text {
				margin-left: 8rpx;
			}
		}
	}
	/* 右侧消息列表 */
	.news-list {
		.news-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 28rpx;
			height: 80rpx;
			border-top: 2rpx solid #e5e5e5;
			padding: 10rpx 20rpx;
			&-left {
				font-size: 28rpx;
				margin-right: 20rpx;
				display: flex;
				align-items: center;
				.news-item-msg {
					margin-left: 8rpx;
					margin-right: 8rpx;
					font-size: 28rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
			}
			&:first-child {
				border-top: none;
			}
			&:last-child {
				border-bottom: 2rpx solid #e5e5e5;
			}
			&-time {
				flex-shrink: 0;
				font-size: 24rpx;
				color: #909399;
			}
		}
	}
}
</style>
