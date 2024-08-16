<template>
<view class="myCredit">
<mescroll-uni
	:fixed="true"
	ref="mescrollRef"
	@init="mescrollInit"
	@down="downCallback"
	@up="upCallback"
    :up="upOption"
>
	<!-- 背景与导航栏 -->
	<xh-navbar
		navbarImage="https://file.y1b.cn/store/1-0/231116/6555c5f2c8874.png"
		:fixed="true"
		navbarImageMode="widthFix"
  		:overFlow="true"
		titleColor="#fff"
		leftImage="/static/images/back_01.png"
		fixedNum="true"
		title="赚积分"
		@leftCallBack="$leftBack"
	></xh-navbar>
	<!-- 顶部背景 -->
	<image class="my_credit_nav" src="https://file.y1b.cn/store/1-0/231116/6555c5f2c8874.png" mode="aspectFill">
	</image>
	<view class="my_credit-box">
		<view class="my_credit">
			<image class="my_credit_icon" src="../static/credit/my_credit_icon.png" mode="aspectFill"></image>
			我的积分
		</view>
		<view class="my_credit_num"  @click="goCreditRecord">
			{{userInfo.credits}}
			<van-icon name="arrow" color="#fff" size="12" />
		</view>
	</view>
	<view class="sign_box" @click="doSignHandle">
		<image class="sign_icon" src="../static/credit/sign_icon.png" mode="aspectFill"></image>
		<view class="sign_title">
			已连续签到<text class="sign_title-num">{{ signDay }}</text>天
		</view>
		<view class="sign_day">
			<view class="day_item" v-for="(item, index) in signListArray" :key="index">
				<view :class="['day_box', item.cur ? 'day-active' : '']">
					<image class="day_icon" src="../static/credit/day_icon.png" mode="aspectFill"></image>
					{{ item.credits }}
				</view>
				<view class="day_txt">
					{{ item.cur ? '已签' : `${index+1}天` }}
				</view>
			</view>
		</view>
		<view :class="['sign_btn', is_sign ? 'btn-active' : '']" >
			{{ is_sign ? '已签到' : '立即签到'}}
		</view>
	</view>
	<view class="play_title pd_32">
		<view class="play_title-left">玩赚积分</view>
		<!-- <view class="play_title-right">每天0点更新</view> -->
	</view>
	<view class="play_box">
		<view class="play_item"
			v-for="(item, index) in taskListArray" :key="index"
			@click="taskHandle(item)"
		>
			<view class="play_item-left">
				<view class="play_left-img">
					<image class="play_img-icon" src="../static/credit/play_icon.png" mode="aspectFill"></image>
				</view>
				<view class="play_txt">
					<view class="play_txt-title">{{ item.title }}</view>
					<!-- <view class="play_txt-rem" v-if="item.style == 3 && item.reward">有机会拿{{item.reward}}积分哦</view> -->
					<view class="play_txt-rem" v-if="item.style == 2 && item.reward">
						<view class="concern_num">
							<image class="concern_icon" src="../static/credit/my_credit_icon.png" mode="aspectFill"></image>
							+{{ item.reward }}
						</view>
						积分
					</view>
					<view class="play_txt-rem" v-else>{{item.intro}}</view>
				</view>
			</view>
			<view :class="['play_btn', item.use ? 'active' : '']">
				{{item.btn_name}}
			</view>
		</view>
	</view>
	<!-- 猜你喜欢的优惠券列表 -->
	<view class="you_like pd_32">
		<view class="like-title">
			<view class="like-left">为你推荐</view>
			<view class="like-right" @click="$switchTab('/pages/home/index')">
				查看更多<van-icon name="arrow" color="#999" size="14" />
			</view>
		</view>
		<good-list :list="tabGoodList" />
	</view>
	<!-- 弹窗管理 -->
	<configurationDia
        ref="configurationDia"
        :isShow="isShowConfig"
        @close="closeShowConfig"
        :config="config"
        @popoverRember="requestPopoverRember"
        :remainTime="remainTime"
    ></configurationDia>
	<!-- 幸运大转盘 -->
	<lucky-wheel :isShow="isShowLucky" @close="closeLuckyHandle" />
	<attention-code :isShow="isAttentionCode" @close="closeLuckyHandle" />
</mescroll-uni>
</view>
</template>
<script>
import { goodsGroup, goodsList } from "@/api/modules/home.js";
import { goodsQuery, jingfen, material } from '@/api/modules/jsShop.js';
import {
	doSign,
	doTask,
	signList,
	taskIndex
} from "@/api/modules/myCredit.js";
import { goodsRecommend, goodsSearch } from '@/api/modules/pddShop.js';
import configurationFun from '@/components/configurationDia/configurationFun.js';
import configurationDia from '@/components/configurationDia/index.vue';
import goodList from '@/components/goodList.vue';
import adunitId from "@/static/js/adunitId.js";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import createRewardVideoAd from "@/utils/createRewardVideoAd.js";
import { mapActions, mapGetters } from 'vuex';
import attentionCode from './attentionCode.vue';
import luckyWheel from './luckyWheel.vue';
	export default {
		mixins: [MescrollMixin, configurationFun], // 使用mixin
		components: {
			luckyWheel,
			attentionCode,
			goodList,
			configurationDia
		},
		computed: {
			...mapGetters(["userInfo", 'isAutoLogin']),
		},
		data() {
			return {
				_RewardedVideoAd: null,
				isShowLucky: false,
				isAttentionCode: false,
				signListArray: [],
				taskListArray: [],
				signDay: 0,
				is_sign: 0, // 今日是否签到
				task_id: 0, // 签到接口任务的id
				is_power: 0, // 任务授权id
				adUnitId: adunitId.myCreditId, // 视频初始化的Id
				doTaskId: 0,
				tabs: [],
				tabIndex: 0,
				tabGoodList: [],
				goodPageNum: 1,
				groupId_index: 0,
				upOption: {
					auto: false, // 不自动加载
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 1
					}
				},
				is_rebate: 2
			}
		},
		onLoad() {
			this.initRewardedVideoAd();
		},
		onUnload() {
			this._RewardedVideoAd.videoAdDestroy();
		},
		methods: {
			...mapActions({
				getUserInfo: 'user/getUserInfo',
			}),
			closeLuckyHandle(){
				this.isShowLucky = false;
			},
			async initRewardedVideoAd() {
				this._RewardedVideoAd = createRewardVideoAd(
					this.adUnitId,
					(status) => {
						this.finishPlay();
					}
				);
				this._RewardedVideoAd.videoAdCreate();
			},
			async finishPlay() {
				// 视频播放完后执行的事件
				const res = await doTask({ task_id: this.doTaskId });
				if(res.code != 1) return;
				this.$toast(res.msg);
				this.getTaskList();
				this.getUserInfo(); //获取用户信息
				this.mescroll.resetUpScroll();
			},
			// 执行任务列表
			taskHandle(item) {
                if(!this.isAutoLogin) return this.$go('/pages/login/index');
				const { id, use, style } = item;
				this.doTaskId = id;
				if(!use) return;
				switch(style) {
					case 0:
						// 幸运大转盘
						// this.isShowLucky = true;
						break;
					case 2:
						// 关注公众号
						break;
					case 3:
						// 视频播放
						this._RewardedVideoAd.videoPlay();
						break;
				}
			},
			// 下拉刷新
			downCallback() {
				this.tabIndex = 0;
				this.goodPageNum = 1;
				this.tabs = [];
				this.tabGoodList = []
				Promise.all([
					this.getSignList(),
					this.getTaskList()
				]).then(res => {
					// this.mescroll.endSuccess();
				}).catch(error => {
					this.mescroll.endErr();
				});
				this.mescroll.resetUpScroll();
			},
			async upCallback(page) {
				if (!this.tabs.length) {
					let res = await goodsGroup({ is_rebate: this.is_rebate });
					if(res.code != 1) return this.mescroll.endSuccess();
					this.tabs = res.data.map((item) => {
						return {
							...item,
							goods: []
						};
					});
				}
				if(!this.tabs.length) return this.mescroll.endSuccess(0);
				const itemTab = this.tabs[this.tabIndex];
				if([2, 3].includes(Number(itemTab.lx_type))) return this.requestRem(page);
				const params = {
					page: this.goodPageNum,
					size: 10,
					id: this.tabs[this.tabIndex].id,
					is_rebate: this.is_rebate
				}
				goodsList(params).then((res) => {
					const {list, total_count} = res.data;
					if(page.num == 1) this.tabGoodList = []; // 如果是第一页需手动制空列表
					this.tabGoodList = this.tabGoodList.concat(list);
					// 更改商品列表的下拉触底的加载
					this.mescroll.endBySize(list.length, total_count);
					const isNextPage = (this.goodPageNum * params.size) < total_count;
					this.goodPageNum += 1;
					// 没有下一页
					if(!isNextPage && (this.tabIndex < this.tabs.length - 1)) {
						this.tabIndex += 1;
						this.goodPageNum = 1;
						this.mescroll.triggerUpScroll();
					}
					if(isNextPage && !list.length) {
						this.mescroll.triggerUpScroll();
					}
				}).catch(() =>  this.mescroll.endErr());
			},
			async requestRem(page) {
				const curTab = this.tabs[this.tabIndex];
				const {
					id,
					cid,
					cid2,
					cid3,
					eliteId,
					groupId,
					type,
					positionId,
					lx_type
				} = curTab;
				let params = {
					id,
					positionId,
					page: this.goodPageNum,
					size: 10,
					is_rebate: this.is_rebate
				}
				let queryApi = goodsQuery;
				// type 1-猜你喜欢 2-京东精选 3-关键词查询, 4 选品库组合
				switch(type) {
					case 1:
						// 拼多多接口的访问
						if (lx_type == 3) {
							queryApi = goodsRecommend;
							params.positionId = positionId;
						} else {
							queryApi = material;
							params.eliteId = eliteId;
							params.groupId = groupId;
							params.size = 10;
						}
						break;
					case 2:
						if (lx_type == 3) {
							queryApi = goodsSearch;
							params.positionId = positionId;
						} else {
							queryApi = jingfen;
							params.eliteId = eliteId;
							params.groupId = groupId;
							params.size = 20;
						}
						break;
					case 3:
						queryApi = goodsQuery;
						params.cid1 = cid;
						params.cid2 = cid2;
						params.cid3 = cid3;
						break;
					case 4:
						queryApi = jingfen;
						params.eliteId = eliteId;
						params.groupId = groupId[this.groupId_index];
						params.size = 20;
						break;
				};
				queryApi(params).then(res=>{
					const { list, total_count } = res.data;
					if( page.num == 1 ) this.tabGoodList = [];
					// 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					let isNextPage = (this.goodPageNum * params.size) < total_count;
					this.goodPageNum += 1;
					this.tabGoodList = this.tabGoodList.concat(list); // 追加新数据

					if(!isNextPage && type == 4 && this.groupId_index < (groupId.length - 1)) {
						// 无下一页
						this.groupId_index += 1;
						this.mescroll.endSuccess(total_count, true);
						this.goodPageNum = 1;
					} else {
						this.mescroll.endSuccess(list.length || total_count, isNextPage);
					}
					if((list.length == 0) && isNextPage){
						this.mescroll.triggerUpScroll();
					}
					if(!isNextPage && (this.tabIndex < this.tabs.length - 1)) {
						this.tabIndex += 1;
						this.goodPageNum = 1;
						this.groupId_index = 0;
						this.mescroll.triggerUpScroll();
					}
				}).catch(() => this.mescroll.endErr());
			},
			// 得到签到列表
			async getSignList() {
				const result = await signList();
				if(!result.code) return;
				const { data } = result;
				this.signListArray = data.list;
				this.signDay = data.day;
				this.is_sign = data.is_sign;
				this.task_id = data.task_id;
				return true;
			},
			// 得到任务列表
			async getTaskList() {
				const result = await taskIndex();
				if(!result.code) return;
				this.taskListArray = result.data;
				return true;
			},
			async doSignHandle() {
                if(!this.isAutoLogin) return this.$go('/pages/login/index');
				if(this.is_sign) return; // 今日已签到
				const res = await doSign({
					task_id: this.task_id,
					is_power: this.is_power
				})
				if(!Number(res.code)) return;
				this.getSignList();
				this.getUserInfo(); // 获取用户信息
				this.$toast('签到成功');
			},
			goCreditRecord() {
                if(!this.isAutoLogin) return this.$go('/pages/login/index');
				this.$go("/pages/mineModule/creditRecord/index");
			}
		}
	}
</script>

<style lang="scss">
page {
	background: #F5F5F5;
}
.myCredit {
	font-size: 28rpx;
	color: #333;
}
.my_credit_nav {
	width: 100%;
	height: 418rpx;
	position: absolute;
	top: 0;
	left: 0;
	z-index: -1;
}
.nav-left {
	font-size: 36rpx;
	font-family: PingFang SC, PingFang SC-Medium;
	font-weight: 500;
	color: #ffffff;
	display: flex;
	align-items: center;
}
.my_credit-box {
	padding: 42rpx 32rpx 22rpx;
	.my_credit{
		font-size: 32rpx;
		color: #ffffff;
		line-height: 44rpx;
		display: flex;
		align-items: center;
	}
	.my_credit_icon {
		width: 44rpx;
		height: 44rpx;
		margin-right: 8rpx;
	}
	.my_credit_num{
		margin-left: 52rpx;
		font-size: 68rpx;
		font-weight: 500;
		color: #ffffff;
		line-height: 82rpx;
		display: flex;
		align-items: center;
		margin-top: 10rpx;
		view {
			margin-left: 8rpx;
		}
	}
}
.sign_box,
.play_box {
	width: 686rpx;
	background: #ffffff;
	border-radius: 16rpx;
	position: relative;
	margin: 0 auto;
}
.sign_box{
	padding-bottom: 32rpx;
}
.sign_icon{
	width: 286rpx;
	height: 228rpx;
	position: absolute;
	right: 4rpx;
	top: -160rpx;
}
.sign_title{
	background-color: #FEF7DA;
	line-height: 82rpx;
	padding: 0 32rpx;
	border-radius: 16rpx 16rpx 0 0;
	font-size: 30rpx;
	.sign_title-num{
		margin: 0 10rpx;
		color:#EF2B20;
	}
}
.sign_day {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 26rpx;
	margin-top: 40rpx;
	.day_box{
		width: 80rpx;
		height: 80rpx;
		position: relative;
		z-index: 0;
		line-height: 65rpx;
		text-align: center;
		font-size: 32rpx;
		font-weight: 500;
		color: #f34d14;
		&.day-active {
			opacity: .5;
		}
		.day_icon{
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
			width: 100%;
			height: 100%;
		}
	}
	.day_txt{
		font-size: 26rpx;
		text-align: center;
		color: #666666;
		line-height: 36rpx;
	}
}
.sign_btn {
	width: 432rpx;
	line-height: 84rpx;
	background: #ef2b20;
	border-radius: 42rpx;
	font-size: 32rpx;
	font-weight: 500;
	text-align: center;
	color: #ffffff;
	margin: 58rpx auto 0;
	&.btn-active {
		opacity: 0.5;
	}
}
.pd_32{
	padding: 0 32rpx;
}
.play_title{
	margin: 60rpx auto 24rpx;
	font-size: 32rpx;
	font-weight: 500;
	color: #333333;
	line-height: 44rpx;
	display: flex;
	justify-content: space-between;
	.play_title-right {
		font-size: 26rpx;
		font-weight: 400;
		color: #999999;
		line-height: 36rpx;
	}
}
.play_box{
	padding: 0 28rpx 0 24rpx;
	box-sizing: border-box;
	.play_item{
		padding: 32rpx 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		&:not(:last-child) {
			border-bottom: 2rpx solid #F5F5F5;
		}
		.play_item-left{
			display: flex;
			align-items: center;
			.play_left-img {
				width: 96rpx;
				height: 96rpx;
				background: linear-gradient(180deg,#fff7da, #ffebb3);
				border-radius: 16rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 16rpx;
				.play_img-icon{
					width: 72rpx;
					height: 80rpx;
				}
			}
			.play_txt {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-self: stretch;
				.play_txt-title {
					font-size: 28rpx;
					font-weight: 500;
					color: #333333;
					line-height: 40rpx;
				}
				.play_txt-rem {
					font-size: 26rpx;
					color: #aaaaaa;
					line-height: 36rpx;
					display: flex;
					align-items: center;
					@include line-clamp;
					.concern_num {
						display: flex;
						align-items: center;
						color: #666666;
						margin-right: 8rpx;
						.concern_icon{
							width: 40rpx;
							height: 40rpx;
							margin-right: 8rpx;
						}

					}
				}
			}
		}
		.play_btn {
			min-width: 88rpx;
			line-height: 56rpx;
			border: 2rpx solid #f5f5f5;
			border-radius: 32rpx;
			font-size: 32rpx;
			text-align: center;
			padding: 0 24rpx;
			background: #f5f5f5;
			color: #BBBBBB;
			white-space: nowrap;
			&.active {
				border: 2rpx solid #f34d14;
				color: #f34d14;
				background: transparent;
			}
		}
	}
}

.discount-put {
	margin-top: 32rpx;
}

.discount-put-box {
	padding: 0 24rpx;
	margin-bottom: 8rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
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
.pd_32 {
	padding: 0 32rpx;
}
.like-title {
	margin: 60rpx auto 24rpx;
	display: flex;
	justify-content: space-between;
	.like-left{
		font-size: 32rpx;
		font-weight: 500;
		color: #333333;
		line-height: 44rpx;
	}
	.like-right{
		font-size: 28rpx;
		color: #999999;
		line-height: 40rpx;
	}
}
</style>
