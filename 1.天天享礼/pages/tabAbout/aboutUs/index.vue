<template>
<view class="about-us">
	<view class="about_cont">
		<view class="about-us-header">
			<image class="about-us-icon" :src="imgUrl+'static/images/logo.jpg'" mode="widthFix"></image>
			<view class="about_title">天天享礼{{version}}</view>
			<view class="about_txt">生活省钱小帮手</view>
		</view>
		<van-cell title="服务协议" @click="agreementLook('/agreement/service-agreement.html')" is-link />
		<van-cell title="隐私政策" @click="agreementLook('/agreement/privacy-agreement.html')" is-link />
		<van-cell v-if="userInfo.is_vip" title="会员协议" @click="agreementLook('/agreement/savings-server.html')" is-link />
		<van-cell title="服务热线" @click="hotLine" :value="phoneNumber" is-link />
		<van-cell title="服务时间" value="工作日 8:30 - 17:30" value-class="right_txt"/>
	</view>
	<view class="cont_remind">
		<view class="company_name">亿兴云科技（广东）有限公司</view>
		<view class="company_pho">服务热线 {{ phoneNumber }}</view>
	</view>
</view>
</template>

<script>
import { getBaseUrl, getImgUrl } from '@/utils/auth.js';
import { mapGetters } from 'vuex';
export default {
	onLoad() {
		let version = wx.getAccountInfoSync().miniProgram.version;
		this.version = version ? `v${version}` : 'v1.0.0';
	},
	data(){
		return {
			imgUrl: getImgUrl(),
			version: '',
			phoneNumber: '400-870-7076'
		}
	},
	computed: {
		...mapGetters(["userInfo"]),
	},
	methods: {
		agreementLook(link) {
			link = getBaseUrl() + link;
			this.$go(`/pages/webview/webview?link=${encodeURIComponent(link)}`);
		},
		hotLine() {
			wx.makePhoneCall({
				phoneNumber: this.phoneNumber
			});
		}
	}
};
</script>

<style lang="scss">
page{
	background-color: #f7f7f7;
}
.about-us {
	position: fixed;
	top: 0;
	bottom:0;
	left: 0;
	width: 100%;
	border-radius: 12px 12px 0px 0px;
	overflow: hidden;
	.about_cont {
		background: #fff;
	}
	.about-us-header {
		padding: 70rpx 0 72rpx;
		position: relative;
	}
	.about_title {
		font-size: 30rpx;
		text-align: center;
		color: #666666;
		line-height: 42rpx;
		margin: 32rpx auto 16rpx;
	}
	.about_txt {
		font-size: 24rpx;
		text-align: center;
		color: #aaaaaa;
		line-height: 34rpx;
	}
	.about-us-icon {
		width: 136rpx;
		height: 136rpx;
		background: #d8d8d8;
		border-radius: 36rpx;
		display: block;
		margin: 0 auto;
	}
}
.right_txt {
	color: #AAAAAA!important;;
}
.cont_remind {
	position: absolute;
	width: 100%;
	text-align: center;
	bottom: 32rpx;
	left: 0;
	padding-bottom: constant(safe-area-inset-bottom);
    /* 兼容 IOS<11.2 */
    padding-bottom:  env(safe-area-inset-bottom);
    /* 兼容 IOS>11.2 */
	.company_name {
		font-size: 26rpx;
		font-weight: 600;
		color: #8c8c8c;
		line-height: 36rpx;
	}
	.company_pho {
		font-size: 24rpx;
		font-weight: 400;
		color: #aaaaaa;
		line-height: 34rpx;
		margin-top: 12rpx;
	}
}
</style>
