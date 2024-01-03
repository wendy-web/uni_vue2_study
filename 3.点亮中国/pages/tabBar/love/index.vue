<template>
	<view class="love-index">
		<mescroll-uni ref="mescrollRef" :fixed="false" @init="mescrollInit" :down="downOption" @down="downCallback"
			:up="upOption" @up="upCallback">
			<!-- 能量值显示 -->
<!-- 			<view class="love-value">
				<view class="love-num">
					<image class="icon-avatar" :src="userInfo.avatar_url"></image>
					<image class="icon-love-wings" src="/static/home/large_love.png"></image>
					<view class="love-v">{{loveConfig.love}}</view>
				</view>
				<view class="love-text">{{type===0?'我的能量':'团队能量'}}</view>
			</view> -->
			<!-- 记录 -->
			<view class="record" @click="goLoveRecord">
				记录
			</view>
			<view class="welfare-list">
				<!-- 公益项目list -->
				<view class="welfare-item" v-for="item in list" :key="item.id">
					<view class="welfare-head">
						捐能量，助力公益
					</view>
					<view class="welfare-content" @tap="goDetails(item.id)">
						<view class="welfare-content-top">
							<image class="welfare-img" :src="item.image" mode="aspectFill"></image>
							<image class="welfare-logo" src="../../../static/home/yjj.png" mode="aspectFill"></image>
							<view class="ad-text">
								{{item.title}}
							</view>
							<!-- 通知 -->
							<an-notice-bar class="position" :list="item.donate"></an-notice-bar>
						</view>
						<view class="welfare-content-bottom">
							<view class="welfare-tips">
								<text v-for="(_item,index) in item.intro" :key="index"
									:style="{color:_item.color}">{{_item.text}}</text>
							</view>
							<view class="progress-box">
								<view class="progress" :style="{width:item.num/item.plan_num*100+'%'}"></view>
							</view>
							<view class="progress-text">
								目标帮助{{item.plan_num}}名儿童，还有{{item.plan_num-item.num}}人待帮助
							</view>
						</view>
					</view>
					<!-- 我要捐贈 -->
					<van-button round block color="linear-gradient(90deg,#ec6536 16%, #f0984c 92%)" class="donate-btn"
						@click="goDetails(item.id)">
						捐能量
					</van-button>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import {
		getUserLove,
		getTeamLove
	} from '@/api/modules/love.js'
	import AnNoticeBar from '@/components/an-notice-bar/an-notice-bar.vue'
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import {
		mapGetters
	} from 'vuex'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		components: {
			AnNoticeBar
		},
		data() {
			return {
				downOption: {
					auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption: {
					true: false,
					empty: {
						use: false
					}
				},
				loveConfig: {},
				type: 1,
				list: []
			}
		},
		computed:{
			...mapGetters(['userInfo'])
		},
		onLoad(o) {
			// this.type = +o.type
			this.type = 0
			uni.setNavigationBarTitle({
				title: o.type == 0 ? '我的能量' : '团队能量'
			})
		},
		onShow() {
			this.mescroll.resetUpScroll();
		},
		onShareAppMessage() {
			return {
				title: '点亮全中国，一起攒能量',
				path: '/pages/tabBar/home/index'
			};
		},
		methods: {
			goLoveRecord() {
				uni.navigateTo({
					url: `/pages/love/loveRecord/index?type=${this.type}&image=${this.loveConfig.image||this.loveConfig.avatar_url}`
				})
			},
			goDetails(id) {
				uni.navigateTo({
					url: `/pages/love/loveDetails/index?com_id=${id}&type=${this.type}`
				})
			},
			downCallback() {
				this.mescroll.resetUpScroll();
			},
			upCallback(page) {

				const Api = this.type === 0 ? getUserLove : getTeamLove

				Api().then(res => {
					if (res.code == 1) {

						const {
							list,
							user,
							team
						} = res.data

						list.forEach(item => {
							item.intro = item.intro.split('|').map(item => {
								let color = '#000018'
								if (/:color/.test(item)) {
									color = '#FF6F00'
								}
								return {
									color,
									text: item.replace(':color', '')
								}
							})
						})
						this.list = list

						this.loveConfig = team || user
						this.mescroll.endSuccess(list.length);
					}
				})

			}
		}
	}
</script>

<style lang="scss">
	.love-index {
		position: fixed;
		width: 100%;
		top: 0;
		bottom: 0;
		height: auto;
		overflow: hidden;
		z-index: 0;
		background-color: #ffffff;

		.love-value {
			position: absolute;
			z-index: 1;
			left: 0;
			top: 60rpx;
			height: 66rpx;
			border-radius: 0px 28px 28px 0px;
			overflow: visible;
			color: #f7304d;
			font-size: 24rpx;
			white-space: nowrap;
			display: flex;
			padding: 4rpx 16rpx;
			align-items: center;
			background-color: #ffeedb;
			border: 1rpx solid #ffc393;

			.love-text {
				text-align: right;
				line-height: 54rpx;
				margin-left: 5rpx;
			}
		}

		.love-num {
			position: relative;
			width: 115rpx;
			height: 65rpx;
			color: #FFFFFF;
			font-size: 24rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.love-icon {
			height: 62rpx;
			width: 68rpx;
			position: absolute;
			left: 50%;
			top: -5rpx;
			margin-left: -34rpx;
			z-index: 1;
		}

		.angel-wings {
			width: 122rpx;
			height: 42rpx;
			position: absolute;
			left: 0;
			top: 0;
		}

		.icon-avatar {
			width:80rpx;
			height:80rpx;
			border-radius: 50%;
			border: 1rpx solid #ff7507;
			position: absolute;
			top: -60rpx;
			left: 0;
			right: 0;
			margin: 0 auto;
		}

		.icon-love-wings {
			width: 115rpx;
			height: 65rpx;
			position: absolute;
			left: 0;
			top: 0;
		}

		.love-v {
			position: relative;
			z-index: 1;
			text-align: center;
			line-height: 40rpx;
		}

		.record {
			position: fixed;
			top: 58rpx;
			right: 0;
			width: 108rpx;
			height: 54rpx;
			line-height: 54rpx;
			background-color: #feebd2;
			border-radius: 28px 0 0 28px;
			font-size: 24rpx;
			font-weight: 400;
			text-align: center;
			color: #f7304d;
		}

		.welfare-list {
			padding-top: 178rpx;
		}

		.welfare-item {
			width: 100%;
			height: 800rpx;
			box-sizing: border-box;
			background-color: #ffeac2;
			border-radius: 10px;
			padding: 30rpx 20rpx 40rpx;
			position: relative;
		}

		.welfare-head {
			font-size: 32rpx;
			font-weight: 700;
			color: #000018;
			margin-bottom: 20rpx;
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
		}

		.welfare-tips {
			font-size: 24rpx;
			font-weight: 400;
			letter-spacing: 0.19px;
		}

		.progress-box {
			width: 80%;
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
			width: 464rpx;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: 45rpx;
		}
	}
</style>
