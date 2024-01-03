<template>
	<view class="gd-scan-result">
		<!-- header -->
		<image class="hn-icon" src="../static/gd_scan_head.png" mode="aspectFill"></image>
		<!-- 扫码次数 -->
		<view class="sr-head">
			<!-- 文字 -->
			<view class="sh-info">
				该编码为第<text class="num">{{info.ScanNum|num}}</text>次查询，如有疑问请致电 
			</view>
			<view class="sh-info">
				红牛维他命饮料有限公司消费者服务中心
			</view>
		</view>
		<view class="query-results">
			查询结果
		</view>
		<view class="list-info">
			<view class="list-info-item">
				<view class="label">
					身份编码
				</view>
				<view class="info">
					{{info.QRCode}}
				</view>
			</view>
			<view class="list-info-item">
				<view class="label">
					产品名称
				</view>
				<view class="info">
					{{info.PName}}
				</view>
			</view>
			<view class="list-info-item">
				<view class="label">
					保质期
				</view>
				<view class="info">
					{{info.StrShelfLife}}
				</view>
			</view>
			<view class="list-info-item">
				<view class="label">
					生产日期
				</view>
				<view class="info">
					{{info.ProducedDate}}
				</view>
			</view>
			<view class="list-info-item">
				<view class="label">
					生产批号
				</view>
				<view class="info">
					{{info.BatchNo}}
				</view>
			</view>
			<view class="list-info-item">
				<view class="label">
					出品商
				</view>
				<view class="info">
					{{info.Producer}}
				</view>
			</view>
			<view class="list-info-item">
				<view class="label">
					地址
				</view>
				<view class="info">
					{{info.ProAddr}}
				</view>
			</view>
			<view class="list-info-item">
				<view class="label">
					生产厂商
				</view>
				<view class="info">
					{{info.Manu}}
				</view>
			</view>
			<view class="list-info-item">
				<view class="label">
					地址
				</view>
				<view class="info">
				 {{info.ManuAddr}}
				</view>
			</view>
			<view class="list-info-item">
				<view class="label">
					邮编
				</view>
				<view class="info">
					{{info.Postcode}}
				</view>
			</view>
			<view class="list-info-item">
				<view class="label">
					服务热线
				</view>
				<view class="info">
					{{info.ServiceTel}}
				</view>
			</view>
		</view>
		<!-- 继续扫码 -->
		<view class="scan-code-btn" @click="scan">
			继续扫码
		</view>
		<!-- 背景 -->
		<view  class="scan-result-bg">
			<image class="bg-icon" src="../static/gd_scan_bg.png"></image>
			<view class="mantle"></view>
		</view> 
	</view>
</template>

<script>
	import {setScanNow} from '@/utils/auth.js'
	export default {
		data() {
			return {
				info: {}
			};
		},
		filters:{
			num(val){
				if(val<10000){
					return val
				}
				return (val/10000).toFixed(1)+'万'
			}
		},
		onLoad(o) {
			this.info = JSON.parse(o.data);
		},
		methods:{
			scan(){
				setScanNow(true)
				wx.reLaunch({
					url:'/pages/originalScan/scan/scan'
				})
			}
		}
		
	};
</script>

<style lang="scss">
	page{
		background-color:rgba(196,18,32,1);
	}
	.gd-scan-result {
		padding-bottom: 150rpx;
        .hn-icon{
			width: 578rpx;
			height: 204rpx;
			display: block;
			margin: 90rpx auto 0;
			position: relative;
			z-index: 1;
		}
				
		.scan-result-bg{
			position: fixed;
			left: 0;
			top: 0;
			bottom: 0;
			width: 100%;
			z-index: 0;
			background-color:rgba(196,18,32,1);
		}	
		.bg-icon{
			position: absolute;
			left: 0;
			top: 138rpx;
			bottom: 0;
			width: 100%;
			height: auto;
			z-index: 0;
		}	
		 .mantle{
			 position: absolute;
			 left: 0;
			 top: 0;
			 bottom: 0;
			 width: 100%;
			 z-index: 1;
			 background-color: rgba(0,0,0,.3);
		 }
		 .sr-head{
			 position: relative;
			 z-index: 1;
			 margin-top: 24rpx;
			 text-align: center;
			 font-family: PingFang SC, PingFang SC-Regular;
			 font-weight: 400;
			 line-height: 52rpx;
		 }
		 .sh-info{
			 font-size: 32rpx;
			 color: #ffffff;
		 }
		 .num{
			 font-size: 52rpx;
			  color: #FFF711;
		 }
		 .query-results{
			 position: relative;
			 z-index: 1;
			 font-size: 32rpx;
			 color: #FFF711;
			 line-height: 52rpx;
			 font-family: PingFang SC, PingFang SC-Regular;
			 font-weight: 400;
			 text-align: center;
			 margin-top: 20rpx;
			 margin-bottom: 20rpx;
		 }
		 .list-info{
			 position: relative;
			 padding: 0 45rpx;
			 z-index: 1;
		 }
		 .list-info-item{
			 border-top:1px solid rgba(255,245,220,.5);
			 padding:12rpx 0;
			 display: flex;
			 font-size: 28rpx;
			 font-family: PingFang SC, PingFang SC-Regular;
			 font-weight: 400;
			 color: #fff5db;
			 line-height: 52rpx;
			 .label{
				 width: 120rpx;
			 }
			 .info{
				 flex: 1;
				 text-align: center;
			 }
			 &:last-child{
				 border-bottom:1px solid rgba(255,245,220,.5);
				 margin-bottom: 50rpx;
			 }
		 }
		 
		 .scan-code-btn{
			 height: 85rpx;
			 width: 280rpx;
			 background-color: #EEC400;
			 border-radius: 30px;
			 position: relative;
			 z-index: 1;
			 text-align: center;
			 line-height: 85rpx;
			 font-size: 35rpx;
			 font-weight: bold;
			 color: #1D2088;
			 margin: 0 auto;
			 border-bottom: 8rpx solid #A48700;
		 }

	}
</style>
