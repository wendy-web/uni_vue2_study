<template>
	<view class="list-item">
		  <!-- <view class="list-item-title">
		  	{{config.title}}
		  </view> -->
		  <!-- 海報 -->
		  <view class="posters">
		  	  <!-- <image class="posters-icon" src="https://file.y1b.cn/api3/litchina/commonweal/item_1/cover.png" mode="aspectFill"></image> -->
		  	  <image class="posters-icon" :src="config.image" mode="aspectFill"></image>
			  <image class="posters-watermark" src="../../../static/home/yjj.png" mode="aspectFill"></image>
			  <view class="posters_title">
					{{config.title}}
				</view>
			  <!-- 底部操作 -->
			  <view class="posters-bottom">
			  	 <view class="posters-title">
			  	 	<text class="text-l">共捐献{{config.donate_love}}能量</text>
			  	 </view>
				 <view class="posters-share" @click="lookAllCard">
				 	分享证书<van-icon name="arrow" color="#FF6F00" />
				 </view>
			  </view>
		  </view>
		  <!-- 捐獻記錄 -->
             <view class="xh-time-line">
             	   <view class="time-line-item" v-for="item in list" :key="item.id">
             	   	  <view class="label">
             	   	  	{{item.create_time}}
             	   	  </view>
					  <view class="value">
					  	<text class="text-l">捐了{{item.love}}</text>
						<image class="lightning" src="/static/home/lightning.png"></image>
					  </view>
					  <!-- 查看证书 -->
					  <!-- <view class="look-card" @click="lookCard(item)">
					  	查看证书
					  </view> -->
					  <!-- icon -->
					  <image class="time-line-icon" src="../static/circle.png" mode="aspectFill"></image>
             	   </view>
				   <!-- 點擊展開 -->
				   <view class="spread" v-if="config.donate_list.length>3" @click="setSpread">
				   	    {{isSpread?'收起':'展开'}}
						<van-icon name="arrow-down" class="more_btn_icon" size="14" />
				   </view>
             </view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex';
	export default{
		props:{
			config:{
				type:Object,
				default(){
					return null
				}
			}
		},
		mounted() {
			this.setSpread()
		},
		computed:{
			...mapGetters(['userInfo'])
		},
		data(){
			return {
				list:[],
				isSpread:true
			}
		},
		methods:{
			lookCard(item){
				let params = {
					com_id: item.com_id,
					donate_id: item.id
				}
				this.$emit('lookCard', params);
			},
			lookAllCard(){
				let params = {
					com_id: this.config.id
				}
				if(this.list.length === 0){
					return uni.showToast({
						icon:'none',
						title:'您的团队，暂无任何捐献记录'
					})
				}
				this.$emit('lookCard', params, this.config.type);
				console.log('this.con :>> ', this.config, this.config.status);
			},
			setSpread(){
				this.isSpread = !this.isSpread
				const {donate_list} = this.config
				if(this.isSpread){
					this.list = donate_list
				}else{
					this.list = donate_list.slice(0,3)
				}
			}
		}
	}
</script>

<style lang="scss">
	.posters_title{
		position: absolute;
		top: 270rpx;
		left: 20rpx;
		height: 44rpx;
		font-size: 32rpx;
		font-weight: 700;
		color: #ffffff;
		line-height: 52rpx;
	}

	.list-item{
		background-color: #ffffff;
		border-radius: 10px;
		padding: 50rpx 40rpx 0;
		margin-bottom: 30rpx;
		border-radius: 20rpx;
		.list-item-title{
			font-size: 32rpx;
			font-weight: 700;
			color: #000018;
			margin-bottom: 40rpx;
		}
		.posters{
			position: relative;
			width: 668rpx;
			height: 422rpx;
			overflow: hidden;
			font-size: 0;
			border-radius: 10px;
			box-shadow: 0px 6px 12px 0px rgba(0,0,0,0.16);
		}
		.posters-icon{
			width: 668rpx;
			height: 422rpx;
			border-radius: 10px;
		}
		.posters-watermark{
			width: 200rpx;
			height: 32rpx;
			position: absolute;
			top: 20rpx;
			right: 20rpx;
		}
		.posters-bottom{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-left: 40rpx;
			background-color: #fff;
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 1;
		}
		.posters-title{
			font-size: 28rpx;
			font-weight: 700;
			color: #000018;
		}
		.posters-share{
			font-size: 28rpx;
			font-weight: 400;
			color: #FF6F00;
			padding: 20rpx;
		}
		.xh-time-line{
			padding: 50rpx 40rpx 0;
		}
		.text-l{
			margin-right: 5rpx;
		}
		.time-line-item{
			position: relative;
			padding-left: 40rpx;
			padding-bottom: 40rpx;
			.label{
				font-size: 22rpx;
				font-weight: 400;
				color: #8e8e91;
				margin-bottom: 10rpx;
			}
			.value{
				font-size: 28rpx;
				font-weight: 700;
				color: #000018;
				display: flex;
				align-items: center;
			}
			.lightning{
				width: 32rpx;
				height: 40rpx;
			}
			.look-card{
				width: 128rpx;
				height: 50rpx;
				box-sizing: border-box;
				line-height: 46rpx;
				background: #ffe0b5;
				border: 2rpx solid ffe0b5;
				border-radius: 28px;
				text-align: center;
				position: absolute;
				bottom: 38rpx;
				right: 0;
				font-size: 24rpx;
				font-weight: 400;
				color: #FF6F00;
			}
			.time-line-icon{
				width: 20rpx;
				height: 20rpx;
				position: absolute;
				top: 5rpx;
				left: 0;
				z-index: 1;
				background-color: #f0f8ff;
			}
		}
		.time-line-item+.time-line-item{
			&::after{
				content: '';
				position: absolute;
				top: 1px;
				bottom: 20rpx;
				left: 10rpx;
				border-left: 4rpx dashed #DBDBDB;
				border-left-color: rgb(219, 219, 219);
				transform: translate(-2rpx,-100%);
			}
		}
		.spread{
			width: 120rpx;
			margin: 0 auto;
			font-size: 28rpx;
			font-weight: 400;
			color: #8E8E91;
			text-align: center;
			padding-bottom:30rpx;
			padding-top: 18rpx;
		}
	}
</style>