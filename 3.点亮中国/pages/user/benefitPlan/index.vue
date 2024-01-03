<template>
	<view class="volunteer-plan">
		<!-- 顶部背景 -->
		<image class="head-bg" src="/pages/user/static/bg_volunteer_index.png" mode="aspectFill"></image>
		<xh-navbar title="公益计划" titleColor="#000018" titleAlign="titleCenter" leftImage="/static/images/back.png"
			@leftCallBack="backHome" />
		<view class="plan_box">
			<view class="plan_box-item">
				<view class="plan-num">{{userInfo.donated_love}}</view>
				<view>已捐献能量</view>
			</view>
			<view class="plan_box-item">
				<view class="plan-num">{{userInfo.com_num}}</view>
				<view>已助力公益</view>
			</view>
		</view>
		<scroll-view
			class="welfare-list"
			scroll-y
			@scrolltolower="scrolltolowerUpdate "
		>
			<view class="welfare-content"
				v-for="item in list"
				:key="item.id"
				@click="goDetails(item.id)"
			>
				<view class="welfare-content-top">
					<image class="welfare-img" :src="item.image" mode="aspectFill"></image>
					<image
						class="welfare-logo"
						src="/static/home/yjj.png"
						mode="aspectFill"
						v-if="!item.status"
					></image>
					<!-- 温暖包是否完成 -->
					<image
						v-else
						class="welfare-finish_icon"
						src="/static/images/finish_icon.png" mode="aspectFill"
					></image>

					<view class="ad-text">
						{{item.title}}
					</view>
					<!-- 通知 -->
					<an-notice-bar class="position"
						:list="item.donate"
						v-if="(item.donate && item.donate.length && (item.num/item.plan_num) < 1) && !item.status"
					>
					</an-notice-bar>
				</view>
				<view class="welfare-content-bottom">
					<view class="welfare-content_left">
						<view class="welfare-tips">
							<text class="welfare-tips_text" v-for="(_item,index) in item.intro" :key="index"
								:style="{color:_item.color}">{{_item.text}}</text>
						</view>
						<view class="progress-box">
							<view class="progress" :style="{width:item.num/item.plan_num*100+'%'}"></view>
						</view>
						<view class="progress-text" v-if="!item.status">
							目标帮助{{item.plan_num}}名儿童，还有{{item.plan_num-item.num}}人待帮助
						</view>
						<view class="progress-text" v-else>
							已达成帮助{{item.plan_num}}名儿童的目标
						</view>
					</view>
					<!-- 我要捐贈 -->
					<van-button round block size="small" color="linear-gradient(90deg,#FFB301 16%, #FF7408 92%)"
						class="donate-btn">
							{{ ((item.num/item.plan_num >= 1 ) ||  item.status) ? '查看详情' : '捐能量'}}
					</van-button>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	import {
		getUserLove
	} from '@/api/modules/love.js';
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	import AnNoticeBar from '@/components/an-notice-bar/an-notice-bar.vue';
	//分页
	let NEXT = 0;
	export default {
		mixins: [MescrollMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components: {
			AnNoticeBar
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		data() {
			return {
				list: [],
				nextIndex: 0,
				isUpdate: false
			}
		},
		onLoad() {
			this.nextIndex = 1;
			this.initData();
		},
		onShareAppMessage() {
			return {
				title: `快来看看我的能量证书！`,
				path: '/pages/tabBar/home/index'
			};
		},
		methods: {
			goDetails(id) {
				uni.navigateTo({
					url: `/pages/love/loveDetails/index?com_id=${id}&type=${0}`
				});
			},
			initData(next = this.nextIndex, limit = 5) {
				// 温暖包活动
				getUserLove(null, {
					limit,
					next,
				}).then(res => {
					if (res.code == 1) {
						const {
							list,
							user,
							next
						} = res.data;
						list.forEach(item => item.intro = this.formatText(item.intro));
						this.list = this.list.concat(list);
						this.loveConfig = user;
						this.nextIndex = next;
						if(list.length && list.length >= 1) {
							return this.isUpdate = true;
						}
						this.isUpdate = false;
					}
				});
			},
			formatText(text){
				return text.split('|').map(item => {
					let color = '#000018'
					if (/:color/.test(item)) {
						color = '#FF6F00'
					}
					return {
						color,
						text: item.replace(':color', '')
					}
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
			// 触底更新
			scrolltolowerUpdate()  {
				if(!this.isUpdate) return;
				this.initData();
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FFF9EC;
	}
	.xh-navber .left-tools {
		filter: brightness(0);
	}
	.volunteer-plan {
		.head-bg {
			width: 100%;
			height: 460rpx;
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
		}
	}
	.plan_box {
		display: flex;
		justify-content: space-around;
		align-items: center;
		font-size: 32rpx;
		text-align: center;
		color: #2b2b2b;
		line-height: 52rpx;
		.plan-num {
			font-size: 72rpx;
			font-weight: 700;
			text-align: center;
			line-height: 100rpx;
			color: #ff7507;
			margin: 44rpx 0 10rpx;
		}
	}
	.welfare-list {
		border-radius: 20rpx;
		padding: 20rpx;
		background-color: #FFEFDB;
		box-sizing: border-box;
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: calc(100vh - 400rpx);
	}
	.welfare-item {
		width: 100%;
		box-sizing: border-box;
		border-radius: 10px;
		padding: 30rpx 0rpx 40rpx;
		position: relative;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
	}

	.welfare-head {
		font-size: 28rpx;
		font-weight: 700;
		color: #000018;
		padding-top: 10rpx;
		padding-bottom: 30rpx;
		padding-left: 40rpx;
		position: relative;
		z-index: 1;
	}

	.lightning-max {
		position: absolute;
		top: 0;
		left: 190rpx;
		width: 94rpx;
		height: 100rpx;
	}
	.welfare-content{
		margin-bottom: 40rpx;
	}

	.welfare-content-top {
		position: relative;
		font-size: 0
	}

	.welfare-img {
		width: 100%;
		height: 480rpx;
		border-radius: 8px;
	}

	.welfare-logo {
		width: 200rpx;
		height: 32rpx;
		position: absolute;
		top: 15rpx;
		right: 15rpx;
	}
	.welfare-finish_icon{
		width: 158rpx;
		height: 158rpx;
		position: absolute;
		top: 208rpx;
		right: 7rpx;
	}

	.ad-text {
		font-size: 32rpx;
		font-weight: 700;
		color: #ffffff;
		position: absolute;
		left: 20rpx;
		bottom: 126rpx;
	}

	.position {
		position: absolute;
		left: 20rpx;
		top: 20rpx;
	}

	.welfare-content-bottom {
		width: 100%;
		height: 160rpx;
		background: #ffffff;
		border-radius: 8px;
		margin-top: -106rpx;
		position: relative;
		z-index: 1;
		box-sizing: border-box;
		padding-top: 20rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		overflow: hidden;
		.welfare-content_left {
			flex: 1;
		}
	}

	.welfare-tips {
		width: 500rpx;
		font-size: 24rpx;
		font-weight: 400;
		letter-spacing: 0.19px;
		white-space:nowrap;
		overflow: hidden;
		text-overflow:ellipsis;
		.welfare-tips_text {
			vertical-align: baseline;
		}
	}

	.progress-box {
		width: 460rpx;
		height: 18rpx;
		background-color: #dadada;
		border-radius: 10px;
		position: relative;
		margin-top: 16rpx;
		overflow: hidden;
	}

	.progress {
		height: 18rpx;
		background: linear-gradient(90deg, #ec6536 16%, #f0984c 92%);
		border-radius: 10px;
		position: absolute;
		left: 0;
		top: 0;
	}

	.progress-text {
		font-size: 22rpx;
		font-weight: 400;
		color: #8e8e91;
		letter-spacing: 0.18px;
		margin-top: 10rpx;
	}

	.donate-btn {
		width: 176rpx;
	}
</style>
