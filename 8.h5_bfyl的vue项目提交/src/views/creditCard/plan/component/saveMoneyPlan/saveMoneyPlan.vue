<template>
	<div class="box">
		<!-- banner图 -->
		<div>
			<img class="banner_save_money" src="@/static/creditCard/banner_save_money.png" mode="aspectFit" />
		</div>
		<!-- 灰色报名按钮 -->
		<div class="sign-box">
			<img class="bg_btn_sign" src="@/static/creditCard/bg_btn_sign.png" mode="aspectFit" />
			<span>立即报名（未启动）</span>
		</div>
		<div class="sing-tips">启动时间请留意APP动态</div>
		<!-- 关于省钱卡 -->
		<div class="intro-box intro-padding">
			<!-- 顶部标题 -->
			<div class="head-box">
				<img class="bg_title_orange" src="@/static/creditCard/bg_title_orange.png" />
				<span>关于省钱卡</span>
			</div>
			<div class="title">什么是省钱卡</div>
			<div class="subtitle">1、省钱卡是团长发放给消费者的一种福利；</div>
			<div class="subtitle">2、省钱范围涵盖吃喝玩乐；</div>
			<div class="subtitle">3、消费者笔笔省钱，团长笔笔赚钱！</div>
			<!-- 两边半圆缺口，中间虚线 -->
			<div class="gap-box">
				<img class="line_dashed" src="@/static/creditCard/line_dashed.png" />
			</div>
			<div class="title">成为省钱卡团长的4大理由</div>
			<div class="block-box">
				<div class="block-item" v-for="(item,index) in blockList" :key="index">
					<img class="line_dashed" :src="item.icon" />
					<div>{{item.name}}</div>
				</div>
			</div>
		</div>
		<!-- 作为团长 -->
		<div class="intro-box explain-box">
			<div class="title">
				<img class="icon_bar_left" src="@/static/creditCard/icon_bar_left.png" mode="aspectFit" />
				<span>作为团长，你需要</span>
				<img class="icon_bar_right" src="@/static/creditCard/icon_bar_right.png" mode="aspectFit" />
			</div>
			<div class="explain-item">
				<div class="num">1</div>
				<div class="explain-title">发放省钱卡</div>
			</div>
			<div class="explain-item">
				<div class="line-box">
					<img class="line_dashed_vertical" src="@/static/creditCard/line_dashed_vertical.png" mode="aspectFit" />
				</div>
				<div class="explain-tips">向消费较高的优质消费者，发放省钱卡</div>
			</div>
			<div class="explain-item">
				<div class="num">2</div>
				<div class="explain-title">坐享收益</div>
			</div>
			<div class="explain-item">
				<div class="line-box">
				</div>
				<div class="explain-tips">消费者下单消费，笔笔有收益</div>
			</div>
			<!-- 更多 -->
			<div class="title ">
				<img class="icon_bar_left" src="@/static/creditCard/icon_bar_left.png" mode="aspectFit" />
				<span>想赚的更多，你能做</span>
				<img class="icon_bar_right" src="@/static/creditCard/icon_bar_right.png" mode="aspectFit" />
			</div>
			<div class="explain-item">
				<div class="num">1</div>
				<div class="explain-title">拓宽用户渠道</div>
			</div>
			<div class="explain-item">
				<div class="line-box">
					<img class="line_dashed_vertical" src="@/static/creditCard/line_dashed_vertical.png" mode="aspectFit" />
				</div>
				<div class="explain-tips">选择不同渠道的优质用户，定向发放省钱卡</div>
			</div>
			<div class="explain-item">
				<div class="num">2</div>
				<div class="explain-title">建立社群</div>
			</div>
			<div class="explain-item">
				<div class="line-box">
				</div>
				<div class="explain-tips">维护社群关系，保证群内活跃</div>
			</div>



		</div>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				blockList: [{
						name: "收益稳定",
						icon: require('@/static/creditCard/icon_money.png')
					},
					{
						name: "海量订单",
						icon: require('@/static/creditCard/icon_order.png')
					},
					{
						name: "发卡特权",
						icon: require('@/static/creditCard/icon_vip.png')

					},
					{
						name: "品牌保障",
						icon: require('@/static/creditCard/icon_brand.png')
					},
				]
			}
		},
		computed: {
			...mapGetters(['token']),
		},
		mounted() {
			this.$nextTick(() => {
				console.log("获取state里面的token:", this.token);
			})
		},
		methods: {

		}
	}
</script>

<style lang="scss">

	.box {
		max-width: 750px;
		box-sizing: border-box;
		padding-bottom: 40px;
		background-color: #FDF7DA;
	}

	.banner_save_money {
		width: 100%;
		height: 302px;
	}

	.sign-box {
		box-sizing: border-box;
		position: relative;
		z-index: 1;
		width: 304px;
		height: 49px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;

		font-size: 18px;
		font-family: PingFang SC, PingFang SC-Medium;
		font-weight: 500;
		text-align: center;
		color: #999999;

		.bg_btn_sign {
			width: 304px;
			height: 49px;
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
		}
	}

	.sing-tips {
		font-size: 12px;
		font-family: PingFang SC, PingFang SC-Regular;
		font-weight: 400;
		text-align: center;
		color: rgba(102, 102, 102, 0.85);
		margin-top: 13px;
	}

	.intro-padding {
		padding-top: 35px;
	}

	.intro-box {
		margin: 30px 12px 0 12px;
		background-color: #ffffff;
		box-sizing: border-box;
		border-radius: 10px;
		min-height: 150px;
		position: relative;
		z-index: 1;

		.head-box {
			box-sizing: border-box;
			width: 151px;
			height: 28px;
			position: absolute;
			top: -7px;
			left: 0;
			right: 0;
			margin: 0 auto;
			font-size: 14px;
			font-family: PingFang SC, PingFang SC-Medium;
			font-weight: 500;
			text-align: center;
			color: #ffffff;
			display: flex;
			align-items: center;
			justify-content: center;

			.bg_title_orange {
				position: absolute;
				left: 0;
				top: 0;
				width: 151px;
				height: 28px;
				z-index: -1;
			}
		}

		.title {
			font-size: 20px;
			font-family: PingFang SC, PingFang SC-Semibold;
			font-weight: 600;
			text-align: center;
			color: #bb0000;
			margin-bottom: 11px;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.subtitle {
			font-size: 14px;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			text-align: left;
			color: #333333;
			margin-bottom: 4px;
			padding: 0 16px;
			box-sizing: border-box;
		}

		.gap-box {
			background-color: #ffffff;
			box-sizing: border-box;
			position: relative;
			z-index: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			min-height: 15px;
			margin-top: 9px;
			margin-bottom: 10px;

			.line_dashed {
				height: 1px;
				width: 315px;
				margin: auto;
			}
		}

		.gap-box::before {
			content: '';
			width: 13px;
			height: 15px;
			background-color: #fdf7da;
			border-right: 0.5px solid #fdf7da;
			border-left: unset;
			border-radius: 23px;
			position: absolute;
			left: -5px;
			top: 0;
			bottom: 0;
			margin: auto;
		}

		.gap-box::after {
			content: '';
			width: 13px;
			height: 15px;
			background-color: #fdf7da;
			border-left: 0.5px solid #fdf7da;
			border-radius: 23px;
			position: absolute;
			right: -5px;
			top: 0;
			bottom: 0;
			margin: auto;
		}

		.block-box {
			box-sizing: border-box;
			padding: 0px 24px 20px 24px;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.block-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				font-size: 14px;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 400;
				text-align: left;
				color: #980000;
			}

			.block-item img {
				width: 44px;
				height: 44px;
			}
		}

		.icon_bar_left {
			width: 41px;
			height: 4px;
			margin-right: 8px;
		}

		.icon_bar_right {
			width: 41px;
			height: 4px;
			margin-left: 8px;
		}

	}

	.explain-box {
		box-sizing: border-box;
		padding-top: 20px;
		padding-bottom: 20px;
		margin: 16px 12px 0 12px;
		background-color: #ffffff;
		box-sizing: border-box;
		border-radius: 10px;
		min-height: 150px;
		position: relative;

		z-index: 1;

		.explain-item {
			box-sizing: border-box;
			display: flex;
			align-items: flex-start;
			justify-content: flex-start;
			padding-left: 22px;

			.num {
				width: 20px;
				height: 20px;
				background: #ffd2d5;
				border-radius: 2px;
				color: #BB0000;
				font-size: 15px;
				font-weight: 600;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 9px;
			}

			.explain-title {
				font-size: 18px;
				font-family: PingFang SC, PingFang SC-Medium;
				font-weight: 600;
				text-align: center;
				color: #bb0000;
			}

			.line-box {
				width: 20px;
				height: 46px;
				margin-right: 9px;
				text-align: center;
			}

			.line_dashed_vertical {
				width: 1px;
				height: 46px;
			}

			.explain-tips {
				font-size: 14px;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 400;
				text-align: center;
				color: #333333;
				margin-top: 5px;
			}
		}
	}
</style>