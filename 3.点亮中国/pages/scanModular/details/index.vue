<template>
	<view class="details" :style="{'padding-top':navBarConfig.statusBarHeight+'px'}">
		<!-- 紅牛icon-head -->
		<view class="head" :style="{'height':navBarConfig.navBarHeight+'px'}">
			<image class="back" src="../static/back.png" mode="aspectFill" @click="back"></image>
			<!-- <image class="head-icon" src="../static/head.png" mode="aspectFill"></image> -->
		</view>
		<scroll-view class="details-scroll" :scroll-y="true" :show-scrollbar="false" :enhanced="true"
			:style="{top:(navBarConfig.statusBarHeight+navBarConfig.navBarHeight)+'px'}">
			<!-- title -->
			<image class="title" src="../static/title.png" mode="heightFix"></image>
			<!-- 详情 -->
			<view class="details-box">
			<!-- 扫码次数 -->
				<view class="sr-head">
					<!-- 文字 -->
					<view class="sh-info">
						该编码为第<text class="num">{{info.ScanNum}}</text>次查询，如有疑问请致电
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
							{{info.QRCode|empty}}
						</view>
					</view>
					<view class="list-info-item">
						<view class="label">
							产品名称
						</view>
						<view class="info">
							{{info.PName|empty}}
						</view>
					</view>
					<view class="list-info-item">
						<view class="label">
							保质期
						</view>
						<view class="info">
							{{info.StrShelfLife|empty}}
						</view>
					</view>
					<view class="list-info-item">
						<view class="label">
							生产日期
						</view>
						<view class="info">
							{{info.ProducedDate|empty}}
						</view>
					</view>
					<view class="list-info-item">
						<view class="label">
							生产批号
						</view>
						<view class="info">
							{{info.BatchNo|empty}}
						</view>
					</view>
					<view class="list-info-item">
						<view class="label">
							出品商
						</view>
						<view class="info">
							{{info.Producer|empty}}
						</view>
					</view>
					<view class="list-info-item">
						<view class="label">
							地址
						</view>
						<view class="info">
							{{info.ProAddr|empty}}
						</view>
					</view>
					<view class="list-info-item">
						<view class="label">
							生产厂商
						</view>
						<view class="info">
							{{info.Manu|empty}}
						</view>
					</view>
					<view class="list-info-item">
						<view class="label">
							地址
						</view>
						<view class="info">
							{{info.ManuAddr|empty}}
						</view>
					</view>
					<view class="list-info-item">
						<view class="label">
							邮编
						</view>
						<view class="info">
							{{info.Postcode|empty}}
						</view>
					</view>
					<view class="list-info-item">
						<view class="label">
							服务热线
						</view>
						<view class="info">
							{{info.ServiceTel|empty}}
						</view>
					</view>
					<view class="list-info-item">
						<view class="label">
							域名来源
						</view>
						<view class="info" v-if="showCodeDomain">
							{{info.CodeDomain|empty}}
						</view>
						<view class="info look" v-else @click="showCodeDomain = true">
							点击查看
						</view>
					</view>
				</view>
			</view>
			<!-- 點亮更多 -->
			<view class="dl-btn"  @click="more">
				<text>更多精彩</text>
				<image class="dl-btn-bg" src="../static/btn.png" mode="aspectFill"></image>
			</view>
		</scroll-view>
		<!-- 背景 -->
		<image class="details-bg" src="../static/bg.png" mode="aspectFill"></image>
		<!-- 隐私协议的组件 -->
		<privacy ref="privacy"></privacy>
	</view>
</template>

<script>
	import {
		getNavbarData
	} from '@/components/xhNavbar/xhNavbar.js'
	export default {
		data() {
			return {
				navBarConfig: {
					navBarHeight: 0,
					statusBarHeight: 0, //状态栏高度
					menuWidth: 0
				},
				info: {},
				showCodeDomain:false
			}
		},
		onLoad(o) {
			this.info = JSON.parse(o.data)
			//获取导航栏数据
			getNavbarData().then(res => {
				this.navBarConfig = res
			})
		},
		onShow() {
			// 隐私协议判断
			this.$refs.privacy.LifetimesShow();
		},
		filters: {
			empty(val) {
			 if (val === undefined || val === null || val === '') {
					return '-'
				}
				return val
			}
		},
		methods:{
			back(){
				uni.navigateBack({
					   fail(e) {
						uni.reLaunch({
							url:'/pages/scanModular/index/index'
						})
					   }
				})
			},
			more(){
				uni.reLaunch({
					url:'/pages/tabBar/home/index'
				})
			}
		}
	}
</script>

<style lang="scss">
	.details::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	.details {
		.details-scroll {
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			z-index: 1;
		}

		.details-bg {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			bottom: 0;
			height: 100%;
			z-index: -1;
		}

		.head {
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;

			.head-icon {
				width: 294rpx;
				height: 52rpx;
			}
			.back{
				position: absolute;
				width: 60rpx;
				height: 60rpx;
				top: 50%;
				transform: translateY(-50%);
				left: 0;
				padding: 10rpx;
			}
		}

		.title {
			height: 118rpx;
			display: block;
			margin: 20rpx auto 0;
			position: relative;
			z-index: 1;
		}
		
		.details-box{
			background-color: #FFF8E3;
			border-radius: 20px;
			border: 2px solid #ffde82;
			padding-top: 92rpx;
			margin: -72rpx 30rpx 0;
		}

		.sr-head {
			position: relative;
			z-index: 1;
			margin-top: 24rpx;
			text-align: center;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			line-height: 52rpx;
		}

		.sh-info {
			font-size: 30rpx;
			color: #231815;
		}

		.num {
			font-size: 52rpx;
			color: #BF182A;
		}

		.query-results {
			position: relative;
			z-index: 1;
			font-size: 36rpx;
			color: #BF182A;
			line-height: 52rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			text-align: center;
			margin-top: 20rpx;
			margin-bottom: 20rpx;
		}

		.list-info {
			position: relative;
			padding: 0 45rpx;
			z-index: 1;
		}

		.list-info-item {
			border-top: 1px solid #A99F82;
			padding: 12rpx 0;
			display: flex;
			font-size: 28rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			color: #231815;
			line-height: 52rpx;

			.label {
				width: 150rpx;
			}

			.info {
				flex: 1;
				// text-align: center;
			}

			&:last-child {
				border-bottom: 1px solid #A99F82;
				margin-bottom: 50rpx;
			}
		}
		
		.dl-btn{
			width: 492rpx;
			height: 112rpx;
			position: relative;
			margin: 24rpx auto 0;
			padding-bottom: 60rpx;
			text-align: center;
			line-height: 112rpx;
			font-size: 36rpx;
			font-weight: 700;
			color: #fffae9;
			position: relative;
			z-index: 1;
			.dl-btn-bg{
				position: absolute;
				left: 0;
				top: 0;
				width: 492rpx;
				height: 112rpx;
				z-index: -1;
			}
		}
		
		.look{
			color: #F47F2B;
		}

	}
</style>
