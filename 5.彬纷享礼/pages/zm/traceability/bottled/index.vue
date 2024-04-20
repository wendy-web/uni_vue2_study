<template>
	<custom-nav-layout bg-style="#F5DA2B">
		<!-- head left-image="/static/images/left_arrow.png"-->
		<xh-navbar navber-color="transparent">
			<image slot="title" class="nav-icon" src="https://file.y1b.cn/public/hn29th/traceability/icon_01.png"
				mode="aspectFill" />
		</xh-navbar>
		<!-- 罐装 -->
		<view class="bottled">
			<!-- 大背景 -->
			<image class="bottled-bg" src="https://file.y1b.cn/public/hn29th/rules/icon_06.png" mode="aspectFill">
			</image>
			<!-- 活动规则 -->
			<image class="activity-rule" src="https://file.y1b.cn/public/hn29th/traceability/icon_03.png"
				mode="aspectFill" @click="goRules"></image>
			<!-- 扫码记录 -->
			<image class="scan-log" src="https://file.y1b.cn/public/hn29th/traceability/icon_04.png" mode="aspectFill"
				@click="goScanLog"></image>
			<!-- 查看换购点 -->
			<image class="bottled-exchange" src="https://file.y1b.cn/public/hn29th/traceability/icon_05.png"
				mode="aspectFill" @click="goExchange"></image>
			<!-- 验证信息 -->
			<view class="auth-info">
				<!-- 背景 -->
				<image class="auth-info-bg" src="https://file.y1b.cn/public/hn29th/traceability/icon_06.png"
					mode="aspectFill"></image>
				<!-- title -->
				<view class="auth-info-title">
					一物一码身份验证结果
				</view>
				<!-- 身份编码 -->
				<view class="code-box">
					<text class="code-label">身份编码：</text>
					<text class="code-text">{{config.code_qr}}</text>
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
		<foot bg-style="#181818" />
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
					url: "/pages/zm/traceability/rules/bottled"
				})
			},
			goExchange() {
				this.$go({
					url: "/pages/zm/traceability/exchangePoint/bottled"
				})
			},
			goScanLog() {
				this.$go({
					url: "/pages/zm/traceability/record/bottled"
				})
			}
		}
	}
</script>

<style>
	.nav-icon {
		width: 148rpx;
		height: 80rpx;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		z-index: -1;
	}

	.bottled {
		font-size: 0;
		position: relative;
	}

	.bottled-bg {
		width: 100%;
		height: 670rpx;
	}

	.bottled-exchange {
		width: 456rpx;
		height: 100rpx;
		display: block;
		margin: 0 auto;
	}

	.auth-info {
		position: relative;
		z-index: 1;
		width: 722rpx;
		height: 400rpx;
		margin: 36rpx auto 0;
		box-sizing: border-box;
		padding: 69rpx 66rpx 0;
		text-align: center;
	}

	.auth-info-bg {
		width: 722rpx;
		height: 400rpx;
		position: absolute;
		left: 0;
		top: 0;
		z-index: -1;
	}

	.auth-info-title {
		font-size: 40rpx;
		color: #181818;
		font-weight: 700;
	}

	.code-box {
		width: 590rpx;
		height: 70rpx;
		border: 2rpx solid #707070;
		border-radius: 6rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		font-weight: 700;
		letter-spacing: 1.23rpx;
		margin-top: 20rpx;
	}

	.code-label {
		color: #636266;
	}

	.code-text {
		color: #181818;
	}

	.scan-total {
		margin-top: 15rpx;
		display: flex;
		justify-content: space-between;
		position: relative;
		padding: 0 35rpx;
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
		color: #000018;
		letter-spacing: 2.46rpx;
	}

	.scan-unit {
		font-size: 24rpx;
		font-weight: 400;
		color: #636266;
		letter-spacing: 1.06rpx;
	}

	.scan-label {
		font-size: 28rpx;
		font-weight: 400;
		color: #636266;
		letter-spacing: 1.23rpx;
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