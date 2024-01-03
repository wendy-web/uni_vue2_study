<template>
	<view class="welfare-list">
		<!-- 公益项目list -->
		<view class="welfare-item">
			<view class="welfare-head">
				捐能量，助力公益
				<view class="head-more" @click="goBenefitPlanHandle()">
					查看更多<image class="right-arrow" src="/static/home/right_arrow.png" mode="aspectFill"></image>
				</view>
			</view>
			<image class="lightning-max" src="/static/home/lightning_max.png" mode="aspectFill"></image>
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
					<van-button
						round block size="small"
						color="linear-gradient(90deg,#FFB301 16%, #FF7408 92%)"
						class="donate-btn"
					>
						{{ ((item.num/item.plan_num >= 1 ) ||  item.status) ? '查看详情' : '捐能量'}}
					</van-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getUserLove } from '@/api/modules/love.js'
	import AnNoticeBar from '@/components/an-notice-bar/an-notice-bar.vue'
	import { mapGetters } from 'vuex'
	export default {
		components: {
			AnNoticeBar
		},
		data() {
			return {
				loveConfig: {},
				list: []
			}
		},
		computed: {
			...mapGetters(['userInfo', 'isAuthorization', 'isAutoLogin'])
		},
		// mounted() {
		// 	this.initData()
		// },
		methods: {
			goDetails(id) {
				/*点击项目卡片 */
				wx.reportEvent("click_projectcard", {
					authorized_or_not: Number(this.isAuthorization)
				})
				// //前往授权
				// if(!this.isAuthorization){
				// 	this.$emit('loginToast')
				// 	return
				// }
				if (!this.isAutoLogin) return this.$emit("loginToast", true);
				this.$go(`/pages/love/loveDetails/index?com_id=${id}&type=${0}`);
			},
			initData(temp) {
				// 温暖包活动
				getUserLove(temp).then(res => {
					if (res.code == 1) {
						const {
							list,
							user
						} = res.data;
						list.forEach(item => {
							item.intro = this.formatText(item.intro);
						});
						this.list = list;
						this.loveConfig = user
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
			goBenefitPlanHandle() {
				if (!this.isAutoLogin) return this.$emit("loginToast", true);
				this.$go('/pages/user/benefitPlan/index');
			}
		}
	}
</script>

<style lang="scss">
	.welfare-list {
		border-radius: 20rpx;
		background-color: #FFEFDB;
		.welfare-item {
			width: 100%;
			box-sizing: border-box;
			border-radius: 10px;
			padding-bottom: 40rpx;
			position: relative;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
		}

		.welfare-head {
			font-size: 28rpx;
			font-weight: 700;
			color: #000018;
			padding: 30rpx;
			position: relative;
			z-index: 1;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.head-more {
			font-size: 24rpx;
			align-self: center;
			display: flex;
			align-items: center;
			padding: 10rpx 0;
			color: #FF4907;
			font-weight: 400;
		}
		.right-arrow {
			width: 32rpx;
			height: 32rpx;
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
	}
</style>
