<template>
	<view :class="['exchange-code', type===1 ? 'active' : '']">
		<xh-navbar :title="type===1 ? '换购成功' : '订单详情'" titleColor="#000000" titleAlign="titleCenter"
			:leftImage="type===1?'../../static/images/home.png':'../../static/images/left_black_arrow.png'"
			:isHome="type===1" />
		<!-- 主体  -->
		<view class="exchange-body" :style="{'padding-top': type === 1 ? '130rpx' :' 0rpx', top: navbarHeight+'px'}">
			<!-- header -->
			<view class="eb-header">
				<!-- 店铺名 -->
				<view class="eb-h-shopname">
					<text class="eb-h-s-title">换购店铺：</text>
					<view class="eb-h-s-name">{{jsonData.shop_name||""}}</view>
					<!-- 					<van-rate value="2" allow-half :size="12" :count="3" void-icon="star" color="#FB7A06" void-color="#AFAEAE"
					 readonly /> -->
				</view>
				<!-- 店铺ID -->
				<view class="eb-h-shopid">
					店铺ID：{{jsonData.sid || ""}}
				</view>
				<!-- 纸质码ID -->
				<view class="eb-h-paperid" v-if="jsonData.alias_id">
					纸质码ID：{{jsonData.alias_id||""}}
				</view>
				<!-- 店铺头像 -->
				<view class="shop-logo" @click="lookSigns">
					<image class="shop-image" :src="jsonData.signs_url"></image>
					<!-- vip店铺 -->
					<image class="shop-vip" v-if="jsonData.bottom_num != -1" src="../static/vip_shop.png"></image>
				</view>

			</view>
			<!-- 支付成功 -->
			<view class="pay-success">
				<image class="pay-logo" src="../static/tickets_success.png"></image>
				<view class="pay-text">
					换购支付成功
				</view>
				<view class="pay-money">
					￥{{jsonData.pay_money}}
				</view>
			</view>
			<!-- 换购额外信息 -->
			<view class="ticket-tank-number">
				<view class="ttn-title">换购罐数：</view>
				<view class="line"></view>
				<view class="ttn-value">{{jsonData.card_count}}罐</view>
			</view>
			<!-- 支付时间 -->
			<view class="pay-time">
				<view class="pt-title">支付时间：</view>
				<view class="line"></view>
				<view class="pt-value">{{jsonData.pay_time}}</view>
			</view>
			<!-- 换购人 -->
			<view class="pay-time" v-if="type === 1">
				<view class="pt-title">换购人：</view>
				<view class="line"></view>
				<view class="pt-value">{{userInfo.nick_name}}(CID:{{userInfo.id}})</view>
			</view>
			<!-- 商户确认区域 -->
			<view class="merchants-confirm" v-if="type === 1">
				<!-- 二维码 -->
				<image class="qrcode" :src="jsonData.qr"></image>
				<view class="mc-title">
					请出示给商户确认
				</view>
				<view class="mc-vice-title">
					店铺扫码可查看到转账记录
				</view>
				<view class="mc-tips-title">
					商家查看路径
				</view>
				<view class="mc-tips-text">
					【我的-可用卡劵】查看中国红牛换购劵
				</view>
				<view class="mc-tips-text">
					【我的-收益累计】查看换购支付金额
				</view>
			</view>
			<!-- 订单详情二维码区域 -->
			<view class="merchants-confirm" v-if="type === 2">
				<!-- 二维码 -->
				<image v-if="!jsonData.check_uid" class="qrcode" :src="jsonData.qr"></image>
				<image v-else class="qrcode" src="../static/shyscan.png"></image>
			</view>
			<!-- 跳转进入到天天的使用 -->
			<view class="advertising_box" v-if="type === 1 && tradeJump" @click="onTradeHandle">
				<image class="advertising_Img" :src="tradeJump" mode="widthFix"></image>
			</view>
			<!-- 关注公众号 -->
			<xh-official-account eventName="followwoa_3" v-if="!tradeJump"></xh-official-account>
		</view>
		<!-- 二维码核销进度 -->
		<view class="hx-progress" v-if="type === 2&&jsonData.check_uid">
			<view class="hx-p-item">
				<text class="hxp-i-title">扫码人员:</text>
				<text class="hxp-i-value">{{jsonData.check_user.nick_name}}(BID:{{jsonData.check_uid}})</text>
			</view>
			<view class="hx-p-item">
				<text class="hxp-i-title">扫码时间:</text>
				<text class="hxp-i-value">{{jsonData.call_time}}</text>
			</view>
		</view>
		<view class="hx-p-no" v-if="type === 2&&!jsonData.check_uid">
			请出示该二维码给商户确认换购记录
		</view>
		<!-- 换购明细 -->
		<view class="evd-body" v-if="type === 2">
			<!-- 使用换购卷明细 -->
			<scroll-view scroll-y="true" class="evd-list">
				<view class="evd-title">
					使用换购劵明细
				</view>
				<view class="evd-labels">
					<text>换购劵</text>
					<text>领取时间</text>
				</view>
				<view class="evd-list-item" v-for="(item,i) in jsonData.list" :key="i">
					<text>{{CARDTITLES[Number(item.prizeratetype)]}}</text>
					<text>{{item.create_time}}</text>
				</view>
			</scroll-view>
		</view>
		<!-- 错误提示 -->
		<xh-msg-dialog ref="xhMsgDialog" buttonText="重试" @drawQrcode="drawQrcode" />
		<!-- 消息提示 -->
		<xh-notify ref="xhNotify" :isCustom="true" />
		<!-- 进度 -->
		<xh-steps :steps="3" v-if="type===1" :top="navbarHeight" />
	</view>
</template>

<script>
import { getcardqr } from '@/api/homeApi.js';
import { fileBaseUrl } from '@/api/http/xhHttp.js';
import xhOfficialAccount from '@/components/xh-official-account.vue';
import {
CARDTITLES
} from '@/utils/configJson.js';
import {
PLAQUEADVERTISING,
xhAudio
} from '@/utils/index.js';
import {
getNavbarData
} from '@/utils/xhNavbar.js';
import { mapActions, mapGetters } from 'vuex';
	let _codeData = ''; //訂單號
	//音频管理
	let payment_audio = null;
	//插屏广告
	let _PLAQUEADVERTISING = null
	export default {
		components: {
			xhOfficialAccount
		},
		onLoad(option) {
			_codeData = option.codeData;
			//生成二维码
			this.drawQrcode();
			// 跳转类型
			this.type = Number(option.type);
			getNavbarData().then(res => {
				this.navbarHeight = res.statusBarHeight + res.navBarHeight;
			});
			// 是否播放支付成功
			if (option.isplay == 1) {
				// 消息轻提示
				this.$refs.xhNotify.show({
					type: 'success',
					message: '支付成功',
					duration: 1500
				});
				// 语音提示
				payment_audio = xhAudio({
					url: fileBaseUrl + '/public/img/to2/cmp3/02/BFXN_MUSIC_12.mp3'
				});
				payment_audio.play();
			}
			//初始化插屏广告
			_PLAQUEADVERTISING = PLAQUEADVERTISING({
				isAutoPlay: true
			});
			_PLAQUEADVERTISING.init('adunit-d51fac0e5bc82688');
		},
		computed: {
			...mapGetters(['userInfo', 'tradeJump'])
		},
		methods: {
			...mapActions({
				getConfig: 'config/getConfig',
			}),
			onTradeHandle() {
				this.$ttxlUserPosition('trade_banner');
			},
			drawQrcode() { //生成二维码
				//向后端拿取图片
				getcardqr({
					order: _codeData
				}).then(res => {
					if (res.code == 1) {

						//表示未支付
						if (!res.data.pay_time || res.data.pay_time == 'null') {

							uni.showModal({
								title: '温馨提示',
								content: '抱歉，您当前支付状态为“未支付”，点击“确认按钮”返回“我的卡包”,重新尝试兑换',
								success: (res) => {
									if (res.confirm) {
										//跳转
										this.$reLaunch({
											url: '/pages/personal/myCardBag/index?currTabs=0'
										});
									}
								}
							});

							return
						}

						//将25周年劵统一设置为 prizeratetype = 1
						res.data.list.forEach(function(item) {
							if ([null, 0].indexOf(item.prizeratetype) > -1) item.prizeratetype = 1
						})
						//正常情况
						this.jsonData = res.data;
						return;
					}
					//异常情况
					this.$refs.xhMsgDialog.show(res, 'drawQrcode');
				}).catch(err => {
					//异常情况
					this.$refs.xhMsgDialog.show({
						msg: '网络异常，请重试'
					}, 'drawQrcode');
				});
			},
			lookSigns() {
				if (!this.jsonData.signs_url) return;
				uni.previewImage({
					urls: [this.jsonData.signs_url] // 需要预览的图片http链接列表
				});
			}
		},
		data() {
			return {
				navbarHeight: null,
				type: 1, //1是支付跳转 2 是详情跳转
				jsonData: {
					qr: '',
					sid: '',
					alias_id: '',
					shop_name: '',
					signs_url: '',
					card_count: '',
					pay_money: '',
					pay_time: ''
				},
				CARDTITLES: CARDTITLES
			};
		},
		onUnload() {
			console.log('onUnload', )
			this.getConfig();
			if (payment_audio) payment_audio.destroy();
			// _PLAQUEADVERTISING.destroy();
		}
	};
</script>

<style lang="scss">
page {
	background-color: #F4F4F4;
}
.advertising_box {
	margin: 20rpx 0;
	.advertising_Img {
		width: 100%;
		height: 200rpx;
	}
}
	.exchange-code {
		&.active {
			.exchange-body {
				padding-bottom: 25rpx;
			}
			.eb-header {
				padding: 20rpx 0 20rpx 60rpx;
			}
			.pay-logo{
				width: 80rpx;
				height: 80rpx;
			}
			.pay-text {
				margin-top: 8rpx;
			}
			.merchants-confirm {
				margin-top: 20rpx;
			}
			.qrcode {
				width: 270rpx;
				height: 270rpx;
			}
			.mc-title {
				font-size: 38rpx;
			}
			.mc-tips-title{
				padding-top: 20rpx;
			}
		}

		.exchange-body {
			background-color: #FFFFFF;
			border-radius: 10px 10px 0 0;
			box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
			padding-bottom: 65rpx;
			margin: 25rpx;
		}

		.evd-body {
			background-color: #FFFFFF;
			border-radius: 0 0 10px 10px;
			box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
			padding-bottom: 65rpx;
			margin: 25rpx;
		}

		.eb-header {
			padding: 40rpx 0 30rpx 60rpx;
			position: relative;

			&::before {
				content: '';
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
				width: 80%;
				border-bottom: 1px dashed #e9e9e9;
			}
		}

		.eb-h-shopname {
			display: flex;
			align-items: center;
			font-size: 40rpx;
			font-weight: 700;
			margin-bottom: 15rpx;
		}

		.eb-h-s-title {
			color: #000000;
			font-size: 32rpx;
		}

		.eb-h-s-name {
			color: #FF0000;
			max-width: 300rpx;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}

		.eb-h-shopid,
		.eb-h-paperid {
			font-size: 28rpx;
			color: #666666;
			margin-top: 5rpx;
		}

		.shop-logo {
			position: absolute;
			width: 108rpx;
			height: 162rpx;
			bottom: 0;
			right: 0;
		}

		.shop-image {
			position: absolute;
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			top: 40rpx;
			left: -30rpx;
		}

		.shop-vip {
			position: absolute;
			width: 108rpx;
			height: 162rpx;
			left: 0;
			top: 0;
		}

		.pay-success {
			margin-top: 20rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		.pay-logo {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
		}

		.pay-text {
			font-size: 32rpx;
			color: #666666;
			font-weight: 500;
			margin-top: 20rpx;
		}

		.pay-money {
			color: #000000;
			font-size: 48rpx;
			margin-top: 10rpx;
		}

		.ticket-tank-number,
		.pay-time {
			display: flex;
			padding: 0 60rpx;
			align-items: flex-end;
			justify-content: space-between;
		}

		.ticket-tank-number {
			margin-top: 21rpx;
			margin-bottom: 15rpx;
		}

		.line {
			flex: 1;
			border-bottom: 1px dashed #e9e9e9;
			height: 1px;
		}

		.ttn-title,
		.pt-title {
			font-size: 28rpx;
			color: #666666;
			padding-right: 15rpx;
			white-space: nowrap;
		}

		.ttn-value,
		.pt-value {
			font-size: 35rpx;
			color: #FF0000;
			padding-left: 15rpx;
			font-weight: 600;
		}

		.merchants-confirm {
			margin-top: 40rpx;
			padding-top: 20rpx;
			text-align: center;
			position: relative;
			&::before {
				content: '';
				position: absolute;
				top: 0;
				left: 50%;
				transform: translateX(-50%);
				width: 80%;
				border-bottom: 1px dashed #e9e9e9;
			}
		}

		.mc-title {
			color: #139547;
			font-size: 48rpx;
			font-weight: 700;
		}

		.mc-vice-title {
			font-size: 32rpx;
			color: #A2A2A2;
			margin-top: 10rpx;
		}

		.qrcode {
			width: 320rpx;
			height: 320rpx;
		}



		.evd-title {
			color: #333;
			font-size: 32rpx;
			font-weight: 700;
			padding-left: 55rpx;
			padding-top: 20rpx;
			position: relative;
		}

		.evd-labels {
			display: flex;
			justify-content: space-between;
			padding: 20rpx 55rpx 0;
			font-size: 24rpx;
			color: #333;
		}

		.evd-list {
			height: 600rpx;
			margin-top: 40rpx;
		}

		.evd-list-item {
			display: flex;
			justify-content: space-between;
			font-size: 20rpx;
			padding: 20rpx 55rpx 0;
			color: #999;
		}

		.mc-tips-title {
			color: #999;
			font-size: 25rpx;
			text-align: left;
			padding-left: 80rpx;
			padding-top: 60rpx;
		}

		.mc-tips-text {
			color: #999;
			font-size: 25rpx;
			text-align: left;
			padding-left: 100rpx;
			padding-top: 10rpx;
		}

		.hx-progress {
			padding: 20rpx 80rpx;
		}

		.hx-p-item {
			display: flex;
			justify-content: space-between;
		}

		.hxp-i-title {
			font-size: 28rpx;
			color: #666666;
		}

		.hxp-i-value {
			font-size: 35rpx;
			color: #FF0000;
			font-weight: 600;
		}

		.hx-p-no {
			padding: 15rpx 0 0 0;
			color: #1E9A50;
			text-align: center;
			font-size: 28rpx;
		}
	}
</style>
