<template>
	<view class="online-service">
		<!-- 头部 -->
		<view class="os-header">
			<image class="os-header-logo" mode="widthFix" src="/static/images/kefu.png"></image>
			<text class="osh-tips">水果技术客服</text>
			<text class="osh-tips-small">(点击你喜欢的水果，一对一解答)</text>
		</view>
		<!-- 水果客户列表 -->
		<view class="fruit-box-list">
			<view :span="8" v-for="(item,index) in fruitList" :key="item.src" class="fruit-box-item">
				<button v-if="!serverTimeData" open-type="contact" :session-from="sessionFrom">
					<van-image   width="144.8rpx" height="144.8rpx" :src="fileBaseUrl+'/images/'+item.src" fit="cover" radius="10px"  use-loading-slot>
						<van-loading slot="loading" type="spinner" size="20" vertical />
					</van-image>
				</button>
				<button v-else @click="showCustomModal">
					<van-image   width="144.8rpx" height="144.8rpx" :src="fileBaseUrl+'/images/'+item.src" fit="cover" radius="10px"  use-loading-slot>
						<van-loading slot="loading" type="spinner" size="20" vertical />
					</van-image>
				</button>
				<view class="fruit-name">{{item.name}}</view>
			</view>
		</view>
		<!-- 温馨提示 -->
		<view class="tips-msg">服务时间：周一至周五 8:30-17:30</view>
		<view class="tips-msg">周六至周日 10:00-19:00</view>
		<view class="tips-msg">（法定节假日除外）</view>
		<!-- 弹窗 -->
		<van-dialog title="温馨提示" :show="showServerModel" :message="serverTimeData" show-confirm-button
			show-cancel-button confirm-button-text="前往留言" confirm-button-open-type="contact" :session-from="sessionFrom"
			@close="showServerModel = false" @confirm="showServerModel = false">
		</van-dialog>
		<!-- 客服热线 -->
		<van-image class="hot-line"  width="150rpx"  :src="fileBaseUrl+'/public/img/Tian/hotline.png'" fit="widthFix" use-loading-slot @click="hotLine">
			<van-loading slot="loading" type="spinner" size="20" vertical />
		</van-image>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	import {
		isServiceTime
	} from './isServiceTime.js';
	export default {
		data() {
			return {
				fileBaseUrl: 'https://file.y1b.cn',
				showServerModel: false,
				serverTimeData: '',
				sessionFrom: '',
				fruitList: [{
						name: '榴莲',
						src: 'll.png'
					}, {
						name: '橙子',
						src: 'chenz.png'
					}, {
						name: '山竹',
						src: 'sz.png'
					}, {
						name: '释迦',
						src: 'sj.png'
					}, {
						name: '蓝莓',
						src: 'lm.png'
					},
					{
						name: '猕猴桃',
						src: 'mht.png'
					}, {
						name: '香蕉',
						src: 'xj.png'
					}, {
						name: '无花果',
						src: 'whg.png'
					}, {
						name: '青枣',
						src: 'qz.png'
					}, {
						name: '火龙果',
						src: 'hlg.png'
					}, {
						name: '西瓜',
						src: 'xg.png'
					}, {
						name: '苹果',
						src: 'pg.png'
					}
				]
			};
		},
		computed: {
			...mapGetters(['userInfo', 'uid'])
		},
		onLoad() {
			this.sessionFrom = this.setSessionFrom();
			this.serverTimeData = isServiceTime();
			console.log('this.serverTimeData', this.serverTimeData)
		},
		onTabItemTap() {
			this.sessionFrom = this.setSessionFrom();
			this.serverTimeData = isServiceTime();
		},
		methods: {
			setSessionFrom() {
				let userInfo = this.userInfo || {};
				let nickName = (userInfo.nick_name || '') + '(cid:' + (userInfo.id || this.uid ||'') + ')';
				return `nickName=${nickName}|avatarUrl=${userInfo.avatar_url||''}|gender=${userInfo.gender||''}`;
			},
			showCustomModal() {
				this.showServerModel = true;
			},
			hotLine() {
				wx.makePhoneCall({
					phoneNumber: '400-870-7076'
				});
			}
		}
	};
</script>

<style lang="scss">
	page::after {
		content: '';
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 2rpx;
		box-shadow: 0px -1px 7px 0px rgba(192, 196, 204, 1);
		z-index: 9999;
	}

	.online-service {
		padding-top: 20rpx;
		.os-header {
			padding-left: 30*1.81rpx;
			display: flex;
			align-items: center;
			margin-bottom: 30*1.81rpx;
		}

		.os-header-logo {
			width: 30*1.81rpx;
			height: 40*1.81rpx;
			margin-right: 5*1.81rpx;
		}

		.osh-tips {
			font-size: 16*1.81rpx;
			color: #333;
		}

		.osh-tips-small {
			font-size: 12*1.81rpx;
			color: #999;
		}

		.fruit {
			width: 80*1.81rpx;
			height: 80*1.81rpx;
		}
		.fruit-box-list{
			display: flex;
			flex-wrap: wrap;
		}

		.fruit-box-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			margin-bottom: 10*1.81rpx;
			width: 33.33%;
		}

		.fruit-name {
			font-size: 14*1.81rpx;
			color: #333;
			margin-top: 5*1.81rpx;
		}

		.tips-msg {
			color: #F5A741;
			font-size: 16*1.81rpx;
			text-align: right;
			margin-right: 40*1.81rpx;
		}

		.tips-01 {
			padding-right: 1em;
		}

		.fruit-box-item button {
			padding-left: 0;
			padding-right: 0;
			background-color: #FFFFFF;
			font-size: 0;

		}

		.fruit-box-item button:after {
			border: none;
		}

		.hot-line {
			position: fixed;
			bottom: 100rpx;
			left: 30rpx;
		}

	}
</style>



<!-- <template>
	<view class="service-center">
		 猜你想问 
		<view class="suppose-wan-ask">
			<text class="title">猜你想问</text>
			<view class="refresh">
				<image class="refresh-icon" src="../../../static/images/refresh.png" />换一组 </view>
		</view>
		 问题列表 
		<van-collapse accordion :value="activeName" @change="onChange">
			<van-collapse-item v-for="(item,index) in msgList" :key="index" :title="item.title" :name="index+1">
				{{item.answer}}
			</van-collapse-item>
		</van-collapse>
		 在线客服 
		<image class="hotline" src="../../../static/images/hotline.png" @click="callHotline" />
		 热线客服 
		<image class="online" src="../../../static/images/online.png" @click="goOnline"/>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeName: 1,
				msgList: [{
					"title": "一个掌柜可以添加几个店员？",
					"answer": "目前是一个掌柜可以添加两个店员。"
				}, {
					"title": "一天最多提现几次?",
					"answer": "一天最多提现5次。"
				}, {
					"title": "为什么我注册会失败?",
					"answer": "1.用户首次进入小程序后需用户微信授权及地理位置授权，授权后才能进入小程序。\r\n2.微信缓存引起，您可以删除”彬纷有礼“小程序，微信重新扫码即可。"
				}, {
					"title": "为什么注册的时候一直在显示授权中?",
					"answer": "这个可能由于网络的原因，确保您的手机处于正常的联网状态。同时注册人数较多时也可能存在这种情况。"
				}, {
					"title": "提现失败，显示“未实名认证”该怎么解决?",
					"answer": "提现失败的金额会自动同步至您的“我的余额”，完成实名验证后，重新提现即可。"
				}]
			}
		},
		methods: {
			onChange(event) {
				this.activeName = event.detail
			},
			callHotline() {
				uni.makePhoneCall({
					phoneNumber: '075528710605', //电话号码应当请求后台，方便修改
					success: (res) => {
						console.log("成功：", res)
					},
					fail: (res) => {
						console.log("失败：", res)
					}
				})
			},
			goOnline(){
				this.$router.navigateTo({url:'/pages/service/onlineService/index'})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f5f5;
	}

	page::after {
		content: '';
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 2rpx;
		box-shadow: 0px -1px 7px 0px rgba(192, 196, 204, 1);
		z-index: 9999;
	}

	.service-center {
		padding: RPX(20);

		.suppose-wan-ask {
			height: RPX(50);
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 RPX(15);
			background-color: #fff;

			.title {
				color: #999;
				font-size: RPX(14);
			}

			.refresh-icon {
				width: RPX(14);
				height: RPX(14);
				margin-right: RPX(4);
			}

			.refresh {
				font-size: RPX(14);
				color: #e02020;
				display: flex;
				align-items: center;
			}
		}

		.online,
		.hotline {
			width: RPX(100);
			height: RPX(60);
		}

		.online {
			position: fixed;
			bottom: RPX(120);
			left: RPX(30);
		}

		.hotline {
			position: fixed;
			bottom: RPX(30);
			left: RPX(30);
		}

	}
</style>
 -->
