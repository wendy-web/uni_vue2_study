<template>
<view class="login">
    <xh-navbar
        :leftImage="imgUrl+'/202303/icon_arrow_left.png'"
        @leftCallBack="$leftBack"
    ></xh-navbar>
    <image class="nav_bg" src="https://file.y1b.cn/store/1-0/231017/652e6badf421f.png" mode="aspectFill"></image>
    <view class="head-box">
        <van-image class="head-title" width="316rpx" height="64rpx" radius="0" fit="contain"
            :src="imgUrl+'/202303/nav_icon.png'" />
        <view class="head-tips">生活省钱小帮手</view>
    </view>
    <view class="login_btn" @click="loginHandle">登录</view>
    <!-- 协议 -->
    <view class="agreement">
        <van-checkbox checked-color="#F04037" icon-size="12px" style="--checkbox-label-margin:5px;"
            :value="isAgreement" @change="changeHandle">
            <text style="color: #999;">我已阅读并同意</text>
        </van-checkbox>
        <text class="agreement-name" @click="agreementLook('/agreement/privacy-agreement.html')">《个人信息保护政策》</text>
        <text class="agreement-name" @click="agreementLook('/agreement/service-agreement.html')">《平台服务协议》</text>
    </view>
	<image class="bottom_bg" src="https://file.y1b.cn/store/1-0/231017/652e7157d8153.png" mode="aspectFill"></image>
    <confirmDia
        :isShow="isShowConfirmDia"
        @close="isShowConfirmDia = false"
        @confirm="confirmExitLoginHandle"
        @diaLook="agreementLook"
    ></confirmDia>
</view>
</template>

<script>
import {
    mapActions,
    mapGetters,
    mapMutations
} from 'vuex';
import confirmDia from "./confirmDia.vue";
import {
    getBaseUrl,
    getImgUrl
} from '@/utils/auth';
export default {
    components: {
        confirmDia
    },
    data() {
        return {
            isAgreement: false,
            imgUrl: getImgUrl(), //获取COS路径
            isShowConfirmDia: false
        };
    },
    onLoad(option) {
        //是否同意了协议
        if (option.isAgreement) {
            this.isAgreement = true;
        }
    },
    computed: {
        ...mapGetters(['token'])
    },
    methods: {
        ...mapActions({
            updateUserNew: 'user/updateUserNew',
            wxloginSmall: 'user/wxloginSmall'
        }),
        ...mapMutations({
            setAutoLogin: 'user/setAutoLogin'
        }),
        //协议勾选
        agreement(flag) {
            this.isAgreement = flag;
        },
        //查看协议
        agreementLook(link) {
            link = getBaseUrl() + link;
            this.$go(`/pages/webview/webview?link=${link}#ISLOGIN`);
        },
        changeHandle(event) {
            this.isAgreement = event.detail;
        },
        async loginHandle() {
            if(!this.isAgreement) return this.isShowConfirmDia = true;
            this.setAutoLogin(true);
            this.$leftBack();
        },
        confirmExitLoginHandle() {
            this.isShowConfirmDia = false;
            this.setAutoLogin(true);
            this.$leftBack();
        }
    }
};
</script>
<style scoped lang="scss">
	.login {
		box-sizing: border-box;
		height: 100vh;
        .login_btn {
            height: 92rpx;
            background: linear-gradient(135deg,#f2554d, #f04037);
            border-radius: 46rpx;
            margin: 202rpx 48rpx 30rpx;
            font-size: 32rpx;
            text-align: center;
            color: #ffffff;
            line-height: 92rpx;
        }
		.agreement {
			display: flex;
			justify-content: center;
			align-items: center;
            flex-wrap: nowrap;
            white-space: nowrap;
            margin: 0 48rpx;
            font-size: 24rpx;
            color: #999;
            line-height: 34rpx;
		}
		.agreement-name {
			color: #333;
			padding: 10rpx 0;
		}
		.van-cell {
			padding: 0;
		}
		.van-cell:after {
			border-bottom-color: #BFBFBF;
			border-bottom: unset;
		}
	}

	.head-box {
		display: flex;
		flex-direction: column;
        align-items: center;
		box-sizing: border-box;
        padding-top: 112rpx;
		.head-tips {
			font-size: 28rpx;
			font-weight: 400;
			color: #666;
			margin-top: 32rpx;
            text-align: center;
		}
	}
    .nav_bg {
		width: 750rpx;
		height: 486rpx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
		background: #ffffff;
	}
    .bottom_bg{
        width: 750rpx;
        height: 282rpx;
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: -1;
		background: #ffffff;
    }
</style>
