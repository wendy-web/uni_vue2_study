<template>
	<view class="online-service nav_cont">
		<!-- 头部 -->
		<view class="os-header">
			<image class="os-header-logo" mode="widthFix" src="../../../static/images/kefu.png"></image>
			<text class="osh-tips">水果技术客服</text>
			<text class="osh-tips-small">(点击你喜欢的水果，一对一解答)</text>
		</view>
		<!-- 水果客户列表 -->
		<van-row>
			<van-col span="8" v-for="(item,index) in fruitList" :key="item.src" custom-class="fruit-box">
				<button v-if="!serverTimeData" open-type="contact" :session-from="sessionFrom">
					<easy-loadimage v-if="fileBaseUrl" :index="index" imageClass="fruit" mode="widthFix"
						:image-src="fileBaseUrl+'/images/'+item.src">
					</easy-loadimage>
				</button>
				<button v-else @click="showCustomModal">
					<easy-loadimage v-if="fileBaseUrl" :index="index" imageClass="fruit" mode="widthFix"
						:image-src="fileBaseUrl+'/images/'+item.src">
					</easy-loadimage>
				</button>
				<view class="fruit-name">{{item.name}}</view>
			</van-col>
		</van-row>
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
		<image @click="hotLine" style="width: 150rpx;margin: 40rpx" :src="fileBaseUrl+'/public/img/Tian/hotline.png'"
			mode="widthFix"></image>
		<!-- 导航栏 -->
		<custom-tab-bar currentIndex="3" />
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	import {
		fileBaseUrl
	} from '@/api/http/xhHttp.js';
	import {
		isServiceTime
	} from './isServiceTime.js';
	import customTabBar from '@/components/customTabBar/index.vue';
	export default {
		components: {
			customTabBar
		},
		data() {
			return {
				fileBaseUrl: fileBaseUrl,
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
			...mapGetters(['wxUserInfo', 'userInfo', 'uid'])
		},
		onLoad() {
			this.sessionFrom = this.setSessionFrom();
			this.serverTimeData = isServiceTime();
		},
		onTabItemTap() {
			this.sessionFrom = this.setSessionFrom();
			this.serverTimeData = isServiceTime();
		},
		methods: {
			setSessionFrom() {
				let wxUserInfo = this.wxUserInfo || {};
				let userInfo = this.userInfo || {};
				let nickName = (wxUserInfo.nickName || userInfo.nick_name || '') + '(cid:' + (userInfo.id || this.uid ||
					'') + ')';
				return `nickName=${nickName}|avatarUrl=${wxUserInfo.avatarUrl||userInfo.avatar_url||''}|gender=${wxUserInfo.gender||userInfo.gender||''}|country=${wxUserInfo.country||''}|province=${wxUserInfo.province||''}|city=${wxUserInfo.city||''}`;
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
		.os-header {
			padding-left: RPX(30);
			display: flex;
			align-items: center;
			margin-bottom: RPX(30);
		}

		.os-header-logo {
			width: RPX(30);
			height: RPX(40);
			margin-right: RPX(5);
		}

		.osh-tips {
			font-size: RPX(16);
			color: #333;
		}

		.osh-tips-small {
			font-size: RPX(12);
			color: #999;
		}

		.fruit {
			width: RPX(80);
			height: RPX(80);
		}

		.fruit-box {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-bottom: RPX(10);
		}

		.fruit-name {
			font-size: RPX(14);
			color: #333;
			margin-top: RPX(5);
		}

		.tips-msg {
			color: #F5A741;
			font-size: RPX(16);
			text-align: right;
			margin-right: RPX(40);
		}

		.tips-01 {
			padding-right: 1em;
		}

		.fruit-box button {
			padding-left: 0;
			padding-right: 0;
			background-color: #FFFFFF;
			font-size: 0;

		}

		.fruit-box button:after {
			border: none;
		}

		.hot-line {
			position: fixed;
			bottom: 30rpx;
			left: 30rpx;
			width: 150rpx;

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
				this.$go({url:'/pages/service/onlineService/index'})
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