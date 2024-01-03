<template>
	<view class="team-ranking">
	     	<view class="head">
	     		点亮城市排行榜(TOP10)
	     	</view>
			<!-- 本团队展示 -->
			<view class="me-team" v-if="meTeam">
				<view class="me-team-info">
					<text class="ranking">{{meTeam.rank}}</text>
					<image class="team-icon" :src="meTeam.image" mode="aspectFill"></image>
					<text class="team-name">{{meTeam.name||'-'}}</text>
				</view>
				<view class="me-team-num">
					{{meTeam.city_num}}
				</view>
			</view>
			<!-- 暂无团队 -->
			<view class="me-team" v-else>
					<view class="no-team">
						暂无团队
					</view>
			</view>
			<!-- title -->
			<view class="ranking-table">
				<view class="ranking-row ranking-row-th">
					<view class="ranking-cell01">排名</view>
					<view class="ranking-cell02">团队昵称</view>
					<view class="ranking-cell03">点亮城市</view>
				</view>
				<view class="ranking-row  ranking-row-tr" v-for="(item,index) in list" :key="item.id">
					<view class="ranking-cell01">
						<image class="rank-index-icon" v-if="index<=2" :src="'/static/images/rank0'+(index+1)+'.png'" mode="aspectFill"></image>
						<view class="rank-index-text" v-else>{{index+1}}</view>
					</view>
					<view class="ranking-cell02">
						<image class="team-icon" :src="item.image" mode="aspectFill"></image>
					    <view class="team-name">{{item.name||'-'}}</view>
					</view>
					<view class="ranking-cell03">
						<view class="ranking-num">{{item.city_num}}</view>
					</view>
				</view>
			</view>
	</view>
</template>

<script>
	import {getTeamRank} from '@/api/modules/home.js'
	export default {
		data(){
			return {
				meTeam:null,
				list:[]
			}
		},
		mounted() {
		   // this.initData()
		},
		methods:{
			initData(){
				getTeamRank(true).then(res=>{
					const {total,list} = res.data
					this.meTeam = total
					this.list = list
				})
			}
		}
	}
</script>

<style lang="scss">
	.team-ranking{
		border-radius: 10px;
		background-color: #2E3C59;
		padding: 40rpx 0 30rpx;
		margin-bottom: 30rpx;
		.head{
			padding-left: 40rpx;
			padding-bottom: 20rpx;
			font-size: 32rpx;
			font-weight: 700;
			color: #ffffff;
		}
		.me-team{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 28rpx 68rpx 28rpx 48rpx;
			background-color: #394E7B;
			.me-team-info{
				display: flex;
				align-items: center;
			}
			.ranking{
				font-size: 28rpx;
				font-weight: 700;
				color: #ffd000;
			}
			.team-icon{
				width: 92rpx;
				height: 92rpx;
				border-radius: 10px;
				transform: translate3d(0, 0, 0);/*ios圆角兼容*/
				margin: 0 20rpx;
			}
			.team-name{
				font-size: 32rpx;
				font-weight: 700;
				color: #ffd000;
			}
			.me-team-num{
				font-size: 32rpx;
				font-weight: 700;
				color: #ffd000;
			}
			.no-team{
				font-size: 32rpx;
				font-weight: 700;
				color: #ababab;
				text-align: center;
				padding: 24rpx 0;
				flex: 1;
				position: relative;
				&::after,&::before{
					content: '';
					position: absolute;
					width: 30rpx;
					height: 4rpx;
					background-color: #ABABAB;
					top: 50%;
					transform: translateY(-50%);
				}
				&::after{
					left: 10rpx;
				}
				&::before{
					right: 10rpx;
				}
			}
		}
		
	}
</style>