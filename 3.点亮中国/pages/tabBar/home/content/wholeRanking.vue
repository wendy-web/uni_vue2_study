<template>
	<view class="whole-ranking">
		<view class="whole-ranking-box">
			   <!-- head -->
				<view class="head">
					<view class="head-top">
						<view class="head-title">
							{{active === 1?'我的排行':'点亮榜单'}}
						</view>
						<view class="head-tab">
							<view class="head-tab-item" :class="{'active':active === 1}" @tap="tabChange(1)">
								全民排行榜
							</view>
							<view class="head-tab-item" :class="{'active':active === 2}" @tap="tabChange(2)">
								城市排行榜
							</view>
						</view>
					</view>
					<view class="head-bottom" v-if="active === 1&&meTeam.avatar_url">
						<view class="head-bottom-me">
							<image class="me-icon" :src="meTeam.avatar_url" mode="aspectFill"></image>
							<view class="head-bottom-me-nc">
								{{meTeam.nick_name||''}}
							</view>
							<view class="head-bottom-me-ph">
								NO.{{meTeam.rank}}
							</view>
						</view>
						<view class="dl-city">
							点亮<text class="dl-city-num">{{meTeam.city_num}}</text>座
						</view>
					</view>
				</view>
				<!-- 全民排行 -->
				<view class="ranking-table"  v-if="active===1">
					<view class="ranking-row ranking-row-th">
						<view class="ranking-cell01">排名</view>
						<view class="ranking-cell02">昵称</view>
						<view class="ranking-cell03">点亮城市(座)</view>
					</view>
					<view class="ranking-row  ranking-row-tr" v-for="(item,index) in list" :key="item.id">
						<view class="ranking-cell01">
							<image class="rank-index-icon" v-if="index==0" src="/static/images/rank01.png" mode="aspectFill"></image>
							<image class="rank-index-icon" v-else-if="index==1" src="/static/images/rank02.png" mode="aspectFill"></image>
							<image class="rank-index-icon"  v-else-if="index==2" src="/static/images/rank03.png" mode="aspectFill"></image>
							<view class="rank-index-text" v-else>{{index+1}}</view>
						</view>
						<view class="ranking-cell02">
							<image class="team-icon" :src="item.avatar_url" mode="aspectFill"></image>
						    <view class="team-name">{{item.nick_name||'-'}}</view>
						</view>
						<view class="ranking-cell03">
							<view class="ranking-num">{{item.city_num}}</view>
						</view>
					</view>
				</view>
			   <!-- 城市排行榜 -->
			   <view class="ranking-table"  v-else>
					<view class="ranking-row ranking-row-th">
						<view class="ranking-cell01">排名</view>
						<view class="ranking-cell04">城市</view>
						<view class="ranking-cell03">点亮次数</view>
					</view>
					<view class="ranking-row  ranking-row-tr" v-for="(item,index) in list" :key="item.id">
						<view class="ranking-cell01">
							<image class="rank-index-icon" v-if="index==0" src="/static/images/rank01.png" mode="aspectFill"></image>
							<image class="rank-index-icon" v-else-if="index==1" src="/static/images/rank02.png" mode="aspectFill"></image>
							<image class="rank-index-icon"  v-else-if="index==2" src="/static/images/rank03.png" mode="aspectFill"></image>
							<view class="rank-index-text" v-else>{{index+1}}</view>
						</view>
						<view class="ranking-cell04">
							<view class="team-name">{{item.city||'-'}}</view>
						</view>
						<view class="ranking-cell03">
							<view class="ranking-num">{{item.lit_num||0}}</view>
						</view>
					</view>
			   </view>
		   </view>
		   <!-- 查看更多 -->
		   <view class="look-more" @click="lookMore">
		   	查看更多<van-icon name="arrow" />
		   </view>
	</view>
</template>
<script>
	import {getAllRank,getCityRank} from '@/api/modules/home.js'
	export default {
		data(){
			return {
				active:1,
				meTeam:{nick_name:'',rank:'',city_num:0},
				list:[]
			}
		},
		methods:{
			tabChange(type){
				this.active = type
				this.initData()
			},
			initData(){
				const API = this.active === 1?getAllRank:getCityRank
				API().then(res=>{
					const {total,list} = res.data
					this.meTeam = total
					this.list = list
				})
			},
			lookMore(){
				this.$router.navigateTo({
					url:'/pages/user/rankingList/index?active='+this.active
				})
			}
		}
	}
</script>

<style lang="scss">
	.whole-ranking{
		.whole-ranking-box{
			border-radius: 0 0 10px 10px;
			background-color: #2E3C59;
			padding-bottom: 30rpx;
		}
		.head{
			padding: 30rpx 40rpx;
			background-color: #394E7B;
		}
		.head-top{
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		.head-title{
			font-size: 32rpx;
			font-weight: 700;
			color: #ffffff;
		}
		.head-tab{
			display: flex;
			border: 2rpx solid #579dff;
			border-radius: 26px;
		}
		.head-tab-item{
			width: 164rpx;
			height: 52rpx;
			box-sizing: border-box;
			border-radius: 26px;
			font-size: 28rpx;
			font-weight: 400;
			color: #c5c5c5;
			text-align: center;
			line-height: 52rpx;
			background-color: #394E7B;
			position: relative;
			z-index: 0;
			transition: 0.3s;
		}
		.head-tab-item.active{
			background-color: #1777FE;
			color: #fff;
			z-index: 2;
			font-weight: 700;
		}
		.head-bottom{
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 40rpx;
		}
		.head-bottom-me{
			padding-left: 116rpx;
			height: 100rpx;
			position: relative;
		}
		.me-icon{
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			transform: translate3d(0, 0, 0);/*ios圆角兼容*/
			position: absolute;
			left: 0;
			top: 0;
		}
		.head-bottom-me-nc{
			font-size: 32rpx;
			font-weight: 700;
			color: #ffffff;
			padding-top: 10rpx;
		}
		.head-bottom-me-ph{
			font-size: 28rpx;
			font-weight: 400;
			color: #ffd000;
		}
		.dl-city{
			font-size: 28rpx;
			font-weight: 400;
			color: #ffffff;
		}
		.dl-city-num{
			font-size: 36rpx;
			font-weight: 700;
			color: #FFD000;
		}
		.look-more{
			text-align: center;
			padding: 40rpx 0;
			font-size: 28rpx;
			font-weight: 400;
			color: #4dbbff;
		}
	}
</style>