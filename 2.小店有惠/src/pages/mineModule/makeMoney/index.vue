<template>
<view class="make_money">
	<view class="make_tab">
		<view class="tab_item fl_center" @click="gotoShowImg">赚钱图解</view>
		<view class="tab_item fl_center" @click="isShowImg = true">添加赚钱军师</view>
	</view>
	<!-- 关于团长 -->
	<view class="about">
		<view class="about_title">
			<image
				class="about_title-bg"
				src="https://file.y1b.cn/store/1-0/24131/65ba37b77b9ad.png"
				mode="aspectFill"
			></image>
			<text>关于团长</text>
		</view>
		<view class="cont_title">{{textList[0].title}}</view>
		<view class="cont_txt"
			v-for="(item, index) in textList[0].content" :key="index"
		>{{item}}</view>
		<!-- 分割线 -->
		<view class="about_division">
			<view class="about_division-bg"></view>
		</view>
		<view class="cont_title">成为团长的{{reasonList.length}}大理由</view>
		<view class="about_reason">
			<view class="about_reason-item" v-for="item in reasonList" :key="item.id">
				<image
					class="about_reason-icon"
					:src="item.icon"
					mode="aspectFill"
				></image>
				<text>{{item.text}}</text>
			</view>
		</view>
	</view>
	<!-- 作为团长 -->
	<view class="leader">
		<view class="cont_title">{{textList[1].title}}</view>
		<view class="cont_txtList">
			<view class="cont_txtList-item"
				v-for="(item, index) in textList[1].content" :key="index"
			>{{item}}</view>
		</view>
		<view class="leader_title">
			<text class="headline_text">想赚的更多，你能做</text>
		</view>
		<view class="leader_cont">
			<view class="leader_cont-item">
				<view class="leader_cont-title">拓宽用户渠道</view>
				<view class="leader_cont-text">选择不同渠道的优质用户，定向邀请顾客</view>
			</view>
			<view class="leader_cont-item">
				<view class="leader_cont-title">建立社群</view>
				<view class="leader_cont-text">维护社群关系，保证群内活跃</view>
			</view>
		</view>
	</view>
	<view class="leader">
		<view class="cont_title">{{text2List.htitle}}</view>
		<view class="cont_txtList">
			<block v-for="(item, index) in text2List.contents" :key="index">
				<view class="cont_txtList-item"> {{item.title}} </view>
				<view class="cont_txtList-lab"> {{item.content}} </view>
			</block>
		</view>
	</view>
	<showImg-dia
		:isShow="isShowImg"
		@close="isShowImg = false"
	></showImg-dia>
</view>
</template>

<script>
import { wordConfig } from "@/api/modules/card.js";
import showImgDia from '@/components/showImgDia.vue';

export default {
	components: {
        showImgDia
    },
	data(){
		return {
            isShowImg: false,
			reasonList:[
                {
                    id: 0,
                    icon: 'https://file.y1b.cn/store/1-0/24131/65ba3cedf3991.png',
                    text: '收益高'
                },
                {
                    id: 1,
                    icon: 'https://file.y1b.cn/store/1-0/24131/65ba3d03ae567.png',
                    text: '长久生意'
                },
                {
                    id: 2,
                    icon: 'https://file.y1b.cn/store/1-0/24131/65ba3d22bfa62.png',
                    text: '拥有副业'
                }
            ],
            textList: [],
            text2List: [],

		}
	},
	onLoad() {
		this.wordConfigInit();
	},
	
	methods: {
		gotoShowImg() {
			this.$go('/pages/mineModule/makeMoney/showImg');
		},
		async wordConfigInit() {
			const res = await wordConfig();
            if(res.code != 1) return;
            const { text, text2 } = res.data;
            this.textList = text;
            this.text2List = text2;
		}
	}
};
</script>

<style lang="scss">
$bgColor: #F4F5F9;
page {
	background-color: $bgColor;
}
.make_money{
	padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
}
.make_tab {
	margin: 40rpx 24rpx;
	display: flex;
	justify-content: space-between;
	.tab_item {
		width: 338rpx;
		height: 96rpx;
		background: #fff;
		border-radius: 16rpx;
		position: relative;
		&::before {
			content: '\3000';
			display: block;
			width: 40rpx;
			height: 40rpx;
			background: url("https://file.y1b.cn/store/1-0/2465/6660178fc31cd.png") 0 0 / 100% 100%;
			margin-right: 8rpx;
		}
		&:last-child::before {
			width: 40rpx;
			height: 30rpx;
			background: url("https://file.y1b.cn/store/1-0/2465/6660180355359.png") 0 0 / 100% 100%;
		}
	}
}
.cont_title {
	height: 56rpx;
	font-size: 40rpx;
	font-weight: 600;
	text-align: center;
	color: #bb0000;
	line-height: 56rpx;
	margin-top: 16rpx;
}
.about {
	margin: 48rpx 24rpx 0;
	position: relative;
	background: #fff;
	border-radius: 16rpx;
	.about_title {
		position: relative;
		width: 302rpx;
		height: 55rpx;
		top: -14rpx;
		z-index: 0;
		margin: 0 auto;
		font-size: 28rpx;
		font-weight: 500;
		text-align: center;
		color: #ffffff;
		line-height: 55rpx;
		.about_title-bg {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: -1;
		}

	}
	.about_division {
		position: relative;
		height: 40rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 20rpx 0;
		&::before,
		&::after {
			content: '\3000';
			position: absolute;
			width: 40rpx;
			height: 40rpx;
			background: $bgColor;
			top: 0;
			border-radius: 50%;
		}
		&::before {
			left: -20rpx;
		}
		&::after {
			right: -20rpx;
		}
		.about_division-bg{
			width: 634rpx;
			border-bottom: 2rpx dashed rgba(255,21,10,0.50);
		}
	}
	.about_reason {
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding:24rpx 20rpx 40rpx;
		.about_reason-item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 28rpx;
			font-weight: 400;
			color: #980000;
			line-height: 40rpx;
			.about_reason-icon {
				width: 88rpx;
				height: 88rpx;
				margin-bottom: 12rpx;
			}
		}
	}
}
.leader {
	background: #fff;
	border-radius: 16rpx;
	margin: 32rpx 24rpx 0;
	overflow: hidden;
	.cont_title {
		margin-top: 40rpx;
	}
	.cont_txtList {
		margin: 24rpx 32rpx 0rpx;
		.cont_txtList-item {
			font-size: 28rpx;
			color: #333;
			line-height: 40rpx;
			margin-bottom: 8rpx;
		}
		.cont_txtList-lab {
			font-size: 28rpx;
			color: #999;
			margin-bottom: 28rpx;
		}
	}
	.leader_cont {
		margin: 0 32rpx;
		counter-reset: leaderNum;
		.leader_cont-item {
			font-weight: 500;
			color: #bb0000;
			padding-left: 51rpx;
			position: relative;
			&::before {
				content: counter(leaderNum);
				counter-increment: leaderNum;
				position: absolute;
				top: 8rpx;
				left: 0rpx;
				width: 34rpx;
				height: 34rpx;
				line-height: 34rpx;
				background: #ffd2d5;
				border-radius: 4rpx;
				font-size: 26rpx;
				text-align: center;
			}
			&:not(:last-child)::after {
				content: '\3000';
				position: absolute;
				top: 50%;
				left: 16rpx;
				width: 2rpx;
				height: 80%;
				background: linear-gradient(to bottom,transparent 0%,transparent 50%,#FFD2D5 50%,#FFD2D5 100%);
				background-size: 2rpx 4rpx;
				background-repeat: repeat-y;
			}
			.leader_cont-title {
				font-size: 36rpx;
				line-height: 50rpx;
				font-weight: bold;
			}

			.leader_cont-text {
				font-size: 28rpx;
				font-weight: 400;
				color: #333333;
				line-height: 40rpx;
				margin: 10rpx 0 40rpx;
			}
		}
	}
}
.leader_title {
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 32rpx 0;
	font-size: 40rpx;
	text-align: center;
	color: #bb0000;
	font-weight: bold;
}
.headline_text {
	margin: 40rpx 0 32rpx;
	position: relative;
	display: inline-block;
	margin: auto;
	&::before,
	&::after {
		content: '\3000';
		position: absolute;
		top: 50%;
		margin-top: -4rpx;
		width: 82rpx;
		height: 8rpx;
	}
	&::before{
		background: linear-gradient(to left, #b31717,#fff);
		left: 0;
		margin-left: -98rpx;
	}
	&::after{
		background: linear-gradient(to right, #b31717,#fff);
		right: 0;
		margin-right: -98rpx;
	}
}
.cont_txt {
	margin: 24rpx 38rpx 34rpx;
	font-size: 28rpx;
	color: #333;
	line-height: 40rpx;
}
</style>
