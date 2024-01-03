<template>
	<view class="scan-result">
		<!-- icon -->
		<image class="hn-icon" src="/pages/originalScan/static/hn-icon.png" mode="aspectFill"></image>
		<view class="sr-head">
			<!-- 文字 -->
			<view class="sh-info">
				该编码为第<text class="num">{{info.ScanNum|num}}</text>次查询，如有疑问请致电 
			</view>
			<view class="sh-info-2">
				红牛维他命饮料有限公司消费者服务中心
			</view>
			<!-- 背景 -->
			<image class="sr-head-bg" src="/pages/originalScan/static/cm-head.png"  mode="aspectFill"></image>
		</view>
		<!-- 信息内容 -->
		<view class="sh-details">
			<view class="sh-details-header">
				 查询结果
			</view>
			<view class="sh-details-item">
				身份编码：{{info.QRCode}}
			</view>
			<view class="sh-details-item">
				产品名称：{{info.PName}}
			</view>
			<view class="sh-details-item">
				保质期至：{{info.StrExpireTime}}
			</view>
			<view class="sh-details-item">
				生产批号：见罐底
			</view>
			<view class="sh-details-item">
				生产日期：见罐底
			</view>
			<view class="sh-details-item">
				出品商：{{info.Producer}}
			</view>
			<view class="sh-details-item">
				地址：{{info.ProAddr}}
			</view>
			<view class="sh-details-item">
				生产厂家：{{info.Manu}}
			</view>
			<view class="sh-details-item">
				地址：{{info.ManuAddr}}
			</view>
			<view class="sh-details-item">
				邮编：{{info.Postcode}}
			</view>
			<view class="sh-details-item">
				服务热线：{{info.ServiceTel}}
			</view>
		</view>
		<!-- 背景 -->
		<view class="scan-result-bg"></view>
		<!-- 隐私协议的组件 -->
		<privacy ref="privacy"></privacy>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: {
					Manu: "",
					ManuAddr: "",
					PName: "",
					Postcode: "",
					ProAddr: "",
					Producer: "",
					QRCode: "",
					ScanNum: 0,
					ServiceTel: "",
					StrExpireTime: ""
				}
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
		onShow() {
			this.$refs.privacy.LifetimesShow();
		}
	};
</script>

<style lang="scss">
	.scan-result {
		
		.hn-icon{
			width: 161rpx;
			height: 61rpx;
			margin-left: 19rpx;
			margin-top: 35rpx;
		}
		
		.scan-result-bg {
			position: fixed;
			width: 100%;
			top: 0;
			bottom: 0;
			z-index: -1;
			background-color: #E70014;
		}
        
		.sr-head{
			width: 730rpx;
			height: 324rpx;
			margin: 60rpx auto 0;
			position: relative;
			z-index: 1;
		}
		.sr-head-bg{
			width: 730rpx;
			height: 324rpx;
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
		}
		.sh-info{
			padding-top: 185rpx;
		}
		.sh-info,.sh-info-2{
			font-size: 25rpx;
			color: #fff;
			text-align: center;
		}
		.sh-info-2{
			margin-top: 10rpx;
		}
		.num{
			color: #FCD003;
			font-size: 34rpx;
			font-weight: bold;
			margin: 0 6rpx;
		}
		.sh-details{
			width: 640rpx;
			height: 850rpx;
			margin: -50rpx auto 0;
			background: #fafafa;
			border-radius: 20px;
			box-sizing: border-box;
			padding: 0 35rpx;
			margin-bottom: 50rpx;
		}
		.sh-details-header{
			padding-top: 70rpx;
			padding-bottom: 30rpx;
			text-align: center;
			font-size: 25rpx;
			color: #000000;
		}
		.sh-details-item{
			font-size: 20rpx;
			color: #000000;
			padding-bottom: 5rpx;
			border-bottom: 1px solid #FF0000;
			margin-bottom: 28rpx;
		}
	}
</style>
