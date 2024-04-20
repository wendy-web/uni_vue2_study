<template>
	<custom-nav-layout bg-style="#000000">
		<!-- left-image="/static/images/left_arrow.png" -->
		<xh-navbar navber-color="transparent" />
		<view class="tank">
			<!-- 顶部背景 -->
			<image class="top-bg" src="https://file.y1b.cn/public/hn29th/traceability/icon_11.png" mode="aspectFill"></image>
			<!-- 战马icon -->
			<image class="zm-icon" src="https://file.y1b.cn/public/hn29th/traceability/icon_12.png" mode="aspectFill"></image>
			<!-- 查看换购点 -->
			<image class="tank-exchange" src="https://file.y1b.cn/public/hn29th/traceability/icon_13.png" mode="aspectFill"
				@click="goExchange"></image>
			<!-- 活动规则 -->
			<image class="activity-rule" src="https://file.y1b.cn/public/hn29th/traceability/icon_14.png" mode="aspectFill"
				@click="goRules"></image>
			<!-- 扫码记录 -->
			<image class="scan-log" src="https://file.y1b.cn/public/hn29th/traceability/icon_15.png" mode="aspectFill"
				@click="goScanLog"></image>
			<!-- 验证信息 -->
			<view class="auth-info">
				<!-- 背景 -->
				<image class="auth-info-bg" src="https://file.y1b.cn/public/hn29th/traceability/icon_16.png" mode="aspectFill"></image>
				<!-- title -->
				<image class="auth-info-title" src="https://file.y1b.cn/public/hn29th/traceability/icon_18.png" mode="aspectFill">
				</image>
				<!-- 身份编码 -->
				<view class="code-box">
					<text class="code-label">身份编码：</text>
					<text class="code-text">{{config.code_qr}}</text>
					<!-- 背景 -->
					<image class="code-box-bg" src="https://file.y1b.cn/public/hn29th/traceability/icon_17.png" mode="aspectFill">
				</view>
				<!-- scan 统计 -->
				<view class="scan-total">
					<view>
						<view class="scan-num">
							<text>{{config.count_num}}</text>
							<text class="scan-unit">次</text>
						</view>
						<view class="scan-label">
							查询次数
						</view>
					</view>
					<view>
						<view class="scan-num">
							<text>{{config.scan_num}}</text>
							<text class="scan-unit">次</text>
						</view>
						<view class="scan-label">
							当前已被您扫
						</view>
					</view>
				</view>
			</view>
		</view>
		<foot bg-style="#000000" />
	</custom-nav-layout>
</template>

<script>
	import customNavLayout from "../a-layout/customNavLayout.vue";
	import foot from "../a-layout/foot.vue";
	export default {
		components: {
			customNavLayout,
			foot
		},
		data() {
			return {
				config: {
					code_qr: "", //编码
					count_num: 0, //查询次数
					scan_num: 0 //被您扫次数
				}
			}
		},
		onLoad({
			data
		}) {
			this.config = {
				...JSON.parse(decodeURIComponent(data))
			}
		},
		methods: {
			goRules() {
				this.$go({
					url: "/pages/zm/traceability/rules/tank"
				})
			},
			goExchange() {
				this.$go({
					url: "/pages/zm/traceability/exchangePoint/tank"
				})
			},
			goScanLog() {
				this.$go({
					url: "/pages/zm/traceability/record/tank"
				})
			}
		}
	}
</script>

<style>
	.tank {
		position: relative;
		z-index: 1;
		font-size: 0;
	}

	.top-bg {
		position: fixed;
		width: 100%;
		height: 860rpx;
		z-index: -1;
		top: 0;
		left: 0;
	}

	.zm-icon {
		width: 100%;
		height: 680rpx;
	}

	.tank-exchange {
		width: 482rpx;
		height: 110rpx;
		margin: -25rpx auto 0;
		display: block;
		position: relative;
		z-index: 1;
	}

	.auth-info {
		position: relative;
		z-index: 1;
		width: 710rpx;
		height: 430rpx;
		margin: 43rpx auto 0;
		box-sizing: border-box;
		padding-top: 69rpx;
		text-align: center;
	}

	.auth-info-bg {
		width: 710rpx;
		height: 430rpx;
		position: absolute;
		left: 0;
		top: 0;
		z-index: -1;
	}

	.auth-info-title {
		width: 348rpx;
		height: 32rpx;
		/* opacity: 0.78; */
		display: block;
		margin: 0 auto;
	}

	.code-box {
		width: 608rpx;
		height: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		font-weight: 700;
		letter-spacing: 1.23rpx;
		margin-top: 20rpx;
		position: relative;
		z-index: 1;
		margin-left: 56rpx;
	}

	.code-box-bg {
		position: absolute;
		width: 608rpx;
		height: 100rpx;
		left: 0;
		top: 0;
		z-index: -1;
	}

	.code-label {
		color: #9B9595;
	}

	.code-text {
		color: #F6F6F6;
	}

	.scan-total {
		margin-top: 15rpx;
		display: flex;
		justify-content: space-between;
		position: relative;
		padding: 0 95rpx;
	}

	.scan-total::after {
		content: "";
		width: 0rpx;
		height: 72rpx;
		border: 2rpx dashed #c6c3b6;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.scan-num {
		font-size: 56rpx;
		font-weight: 700;
		color: #FFFFFF;
		letter-spacing: 2.46rpx;
	}

	.scan-unit {
		font-size: 24rpx;
		font-weight: 400;
		color: #FFFFFF;
		letter-spacing: 1.06rpx;
		opacity: 0.75;
	}

	.scan-label {
		font-size: 28rpx;
		font-weight: 400;
		color: #FFFFFF;
		letter-spacing: 1.23rpx;
		opacity: 0.59;
	}

	.activity-rule,
	.scan-log {
		position: absolute;
		width: 46rpx;
		height: 160rpx;
		z-index: 3;
	}

	.activity-rule {

		top: 32rpx;
		right: 0;
	}

	.scan-log {
		top: 252rpx;
		right: 0;
	}
</style>