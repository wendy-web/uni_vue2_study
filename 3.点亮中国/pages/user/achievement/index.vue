<template>
	<view class="volunteer-plan">
		<!-- 顶部背景 -->
		<image class="head-bg" :src="tabList[tabIndex].bgSrc" mode="aspectFill"></image>
		<xh-navbar
			title="我的成就"
			:titleColor="tabList[tabIndex].textColor"
			titleAlign="titleCenter"
			:leftImage="tabList[tabIndex].blackIcon"
			@leftCallBack="backHome"
		/>
		<view class="tab_box">
			<view
				v-for="(item, index) in tabList"
				:key="item.id"
				:class="['tab_item', tabIndex === index ? 'active' : '']"
				@click="tabChangeHandle(index)"
			>
				{{item.text}}
			</view>
		</view>
		<!-- 公益证书 -->
		<volunteerCard ref="volunteerCard" v-if="tabIndex === 0"></volunteerCard>
		<!-- 省份勋章 -->
		<medal
			ref="medal"
			v-if="tabIndex === 1"
			@shareMedal="shareMedalHandle"
		></medal>
		<!-- 隐私协议的组件 -->
		<privacy ref="privacy"></privacy>
	</view>
</template>

<script>
	import medal from './medal.vue';
	import volunteerCard from './volunteerCard.vue';
	export default {
		components: {
			medal,
			volunteerCard
		},
		data() {
			return {
				tabIndex: 0,
				shareMedal: {},
				tabList: [
					{
						id: 1,
						text: '公益证书',
						bgSrc: '../static/bg_volunteer_index.png',
						textColor: '#000',
						blackIcon:'/static/images/black_back.png'
					},
					{
						id: 0,
						text: '省份勋章',
						bgSrc: '../static/medal_bg.png',
						textColor: '#EAF0F4',
						blackIcon:'/static/images/back.png'
					}
				],
			}
		},
		onShow() {
			// 隐私协议判断
			this.$refs.privacy.LifetimesShow();
		},
		onShareAppMessage(data) {
			let share = {
				title: '点亮全中国，一起攒能量',
				path: '/pages/tabBar/home/index'
			}
			if (data.from == 'button') {
				if(data.target.dataset) {
					const { name } = data.target.dataset;
					// 分享证书
					if(name === 'honorCard') {
						const shareImg = this.$refs.volunteerCard.getShareImg();
						const shareImgData = JSON.stringify(this.$refs.volunteerCard.getShareImgData());
						share.title = '快来看看我的能量证书！',
						share.imageUrl = shareImg;
						share.path =`/pages/tabBar/home/index?type=shareImg&shareImgData=${shareImgData}`;
					}
				}
			}
			// 勋章的分享
			if(this.shareMedal.weChat) {
				const getShareImgData =  this.$refs.medal.getShareImgData();
				console.log('this.shareMedal.share_title', this.shareMedal.share_title)
				share.imageUrl = this.$refs.medal.getShareImg();
				share.title = this.shareMedal.share_title || getShareImgData.share_title;
				console.log('getShareImgData---', getShareImgData);
				const shareImgData = JSON.stringify(getShareImgData);
				share.path =`/pages/tabBar/home/index?type=medalShare&shareImgData=${shareImgData}`;
			}
			return share;
		},
		onShareTimeline(data) {
			let share = {
				title: '点亮全中国，一起攒能量',
				path: '/pages/tabBar/home/index'
			}
			const imageUrl = this.$refs.medal.getShareImg()
			if (imageUrl) {
				share.title = '点亮中国集勋章，快看我新得的勋章！'
				share.imageUrl = imageUrl
			}
			return share;
		},
		methods: {
			// 微信的分享勋章
			shareMedalHandle(event) {
				this.shareMedal = event;
				console.log('shareMedalHandle', event)
			},
			tabChangeHandle(index) {
				this.tabIndex = index;
			},
			backHome() {
				uni.navigateBack({
					fail(e) {
						uni.reLaunch({
							url: '/pages/tabBar/home/index'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FFF9EC;
	}
	.volunteer-plan {
		.head-bg {
			width: 100%;
			height: 516rpx;
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
		}
	}
	.tab_box {
		color: #fff;
		z-index: 100;
		width: 292rpx;
		height: 66rpx;
		background: gray;
		border-radius: 20rpx;
		padding: 6rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 20rpx;
		margin: auto;
		.tab_item {
			width: 120rpx;
			line-height: 54rpx;
			padding: 0 10rpx;
			opacity: 0.9;
			font-size: 30rpx;
			text-align: left;
			color: #ffffff;
			border-radius: 14rpx;
			&:first-child {
				margin-right: 10rpx;
			}
			&.active{
				color: #FFA258;
				background: #fff;

			}
		}
	}
</style>
