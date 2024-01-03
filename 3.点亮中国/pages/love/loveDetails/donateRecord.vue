<template>
	<view class="donate-record">
		<!-- 我要捐献 -->
		<van-popup :show="show" position="bottom" round closeable safe-area-inset-bottom @close="popupClose">
			<view class="popup-title">
				捐献记录<text>（{{list.length}}次）</text>
			</view>
			<scroll-view :scroll-y="true" style="height: 800rpx;">
			  <view class="dr-item" v-for="item in list" :key="item.id">
				  <view class="dr-head">
					<view class="dr-donor">
						捐献人：{{item.name}}
					</view>
					<view class="dr-love">
						<text class="dr-love-text">捐了{{item.love}}</text>
						<image class="lightning" src="/static/home/lightning.png"></image>
					</view>
				  </view>
				  <view class="dr-time">
				  	{{item.create_time}}
				  </view>
			  </view>
		</scroll-view>
		</van-popup>
	</view>
</template>

<script>
	import {getUserDonate,getTeamDonate} from '@/api/modules/love.js'
	export default {
		data(){
			return {
				show:false,
				list:[],
				total:{}
			}
		},
		methods:{
			showTime({type,com_id}){
			    const Api = type == 0?getUserDonate:getTeamDonate
				Api({com_id}).then(res=>{
					const list = res.data.list||[]
					if(list.length === 0){
						return uni.showToast({
							icon:'none',
							duration:4000,
							title:'暂无捐献记录'
						})
					}
					this.list = list
					this.total = res.data.total
					this.show = true
				})
			},
			popupClose(){
               this.show = false
			}
		}
	}
</script>

<style lang="scss">
	.donate-record{
		.popup-title{
			font-size: 32rpx;
			font-weight: 700;
			color: #000018;
			text-align: center;
			padding-top: 40rpx;
			margin-bottom: 30rpx;
		}
		.dr-item{
			position: relative;
			padding:28rpx 30rpx ;
			&::after{
				content: '';
				position: absolute;
				height: 2rpx;
				background-color: #DCDFE6;
				left: 30rpx;
				right: 30rpx;
				bottom: 0;
			}
		}
		.dr-head{
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		.dr-donor{
			font-size: 28rpx;
			font-weight: 700;
			color: #000018;
		}
		.dr-love{
			font-size: 28rpx;
			font-weight: 400;
			color: #4E4D52;
			display: flex;
			align-items: center;
		}
		.dr-love-text{
			margin-right: 5rpx;
		}
		.dr-time{
			font-size: 22rpx;
			font-weight: 400;
			color: #8e8e91;
			letter-spacing: 0.18px;
			margin-top: 10rpx;
		}
		.lightning{
			width: 32rpx;
			height: 40rpx;
		}
	}

</style>