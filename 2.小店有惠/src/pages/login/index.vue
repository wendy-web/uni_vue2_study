<template>
<view class="login">
    <xh-navbar
        leftImage="/static/images/left_back.png"
        titleAlign="titleRight"
        :fixed="true"
        :overFlow="true"
        @leftCallBack="$back"
    >
    </xh-navbar>
    <image class="login_bg" mode="widthFix" src="https://file.y1b.cn/store/1-0/231116/6555c62663786.png"></image>
    <view class="logo_cont">
        <image class="logo_icon" mode="widthFix" src="https://file.y1b.cn/store/1-0/24131/65ba38e12f007.png"></image>
        <view>小店有惠</view>
    </view>
    <view class="btn_cont">
        <view class="btn_box" @click="loginHandle">登录</view>
        <view class="agreement_box">
            <van-checkbox checked-color="#F04037" icon-size="12px" style="--checkbox-label-margin:5px;"
                :value="isAgreement" @change="changeHandle">
                <text style="color: #999;">我已阅读并同意</text>
            </van-checkbox>
            <text class="agreement-name" @click="agreementLook('/agreement/privacy-agreement.html')">《个人信息保护政策》</text>
            <text class="agreement-name" @click="agreementLook('/agreement/service-agreement.html')">《平台服务协议》</text>
        </view>
    </view>
    <confirmDia
        :isShow="isShowConfirmDia"
        @close="isShowConfirmDia = false"
        @confirm="confirmExitLoginHandle"
        @diaLook="agreementLook"
    ></confirmDia>
</view>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { getBaseUrl } from "@/utils/auth.js";
import confirmDia from "./confirmDia.vue";
const BASEURL = getBaseUrl();
export default {
    name: "login",
    components: {
        confirmDia
    },
     data() {
        return {
            isAgreement: false,
            isShowConfirmDia: false
        };
    },
    computed: {
        ...mapGetters(['isAutoLogin']),
    },
    methods: {
        ...mapMutations({
            setAutoLogin: 'user/setAutoLogin'
        }),
        changeHandle(event) {
            this.isAgreement = event.detail;
        },
        //查看协议
        agreementLook(link) {
            link = BASEURL + link;
            this.$go(`/pages/webview/index?link=${encodeURIComponent(link)}`);
        },
        async loginHandle() {
            if(!this.isAgreement) return this.isShowConfirmDia = true;
            this.setAutoLogin(true);
            this.$back();
        },
        confirmExitLoginHandle() {
            this.isShowConfirmDia = false;
            this.setAutoLogin(true);
            this.$back();
        }
    },
};
</script>

<style scoped lang="scss">
.login{
    position: relative;
    z-index: 0;
    &::before{
        content: '\3000';
        position: absolute;
        z-index: -1;
        top: 0;
        left: 0;
        width: 100%;
        height: 878rpx;
        background: linear-gradient(180deg,rgba(239,43,32,0.15), rgba(248,86,67,0.00));
    }
}
.login_bg{
    position: absolute;
    width: 100%;
    height: 366rpx;
    top: 0;
}
.logo_cont{
    margin: 0 auto 112rpx;
    font-size: 40rpx;
    font-weight: 600;
    color: #333;
    line-height: 56rpx;
    text-align: center;
    .logo_icon{
        width: 128rpx;
        height: 128rpx;
        display: block;
        margin: 154rpx auto 32rpx;
    }
}
.agreement_box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    white-space: nowrap;
    margin-top: 32rpx;
    font-size: 24rpx;
    color: #999;
    line-height: 34rpx;
}
.agreement-name {
    color: #333;
    padding: 10rpx 0;
}
.btn_cont {
    background: #fff;
    border-radius: 40rpx;
    padding: 40rpx;
    .btn_box{
        height: 92rpx;
        line-height: 92rpx;
        background: #ef2b20;
        border-radius: 16rpx;
        font-size: 32rpx;
        text-align: center;
        color: #fff;
    }
}
</style>
