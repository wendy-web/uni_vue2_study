<template>
<view class="content">
    <xhNavbar
        :fixedNum="true"
        :isFloat="true"
        leftImage="/static/images/back_01.png"
        @leftCallBack="$back"
    ></xhNavbar>
    <view class="cont_top">
        <view :class="['invite_notice', isShowPeopleNum ? 'active' : '']"
        :style="{ top: stickyTop }"> 刚刚成功邀请 {{ peopleNum }} 位顾客</view>
        <view class="code_img fl_center">
            <van-loading
                size="36px" color="#ccc" vertical
                class="add_cont-load"
                v-if="isLoadingCode"
                ></van-loading>
            <uQrcode :size="112" ref="uQrcodeRef" @drawFinish="isLoadingCode = false"></uQrcode>
        </view>
    </view>
    <view class="invite_box">
        <view class="red_title"></view>
        <view class="cont_box">
            <view class="tex_item">话费充值<text class="red_txt">96</text>折</view>
            <view class="tex_item">肯德基麦当劳 <text class="red_txt">38</text>折</view>
            <view class="tex_item">看电影 <text class="red_txt">8</text>折</view>
            <view class="tex_item">腾讯爱奇艺会员 <text class="red_txt">96</text>折</view>
        </view>
        <view class="invite_title"></view>
        <view class="wechat_icon" @click="weiXinPainterHandle"></view>
    </view>
    <painterImg
        :isShow="isShowPainterImg"
        :codeUrl="codeUrl"
        @close="isShowPainterImg = false"
    ></painterImg>
</view>
</template>
<script>
import { inviteXq } from "@/api/modules/card.js";
import getViewPort from '@/utils/getViewPort.js';
import { mapActions, mapGetters } from "vuex";
import painterImg from './painterImg/index.vue';
import uQrcode from './uQrcode/index.vue';
export default {
    components: {
        uQrcode,
        painterImg
    },
    computed: {
        ...mapGetters(["vipObject", 'userInfo', 'diaList']),
        stickyTop() {
            let viewPort = getViewPort();
            return viewPort.navHeight + 'px';
        },
    },
    data() {
		return {
            isLoadingCode: false,
            isShowPainterImg: false,
            codeUrl: '',
            peopleNum: 0,
            isShowPeopleNum: false,
            timer: null
        }
    },
    watch: {
        'vipObject.share_url': {
            handler: async function (newValue, oldValue) {
                if(!newValue) return;
                this.initCodeRef();
            },
            deep: true,
            immediate: true
        },
    },
    onShow() {
        this.inviteXqUpdate();
    },
    onUnload() {
        this.timer = null;
        clearTimeout(this.timer);
    },
	methods: {
        ...mapActions({
            getUserInfo: "user/getUserInfo",
            getVipObject: "user/getVipObject",
            updateMobile: "user/updateMobile",
        }),
        async inviteXqUpdate() {
            const res = await inviteXq();
            if(res.code != 1) return;
            const { peopleNum } = res.data;
            this.peopleNum = peopleNum;
            this.isShowPeopleNum = (this.peopleNum > 0);
            setTimeout(() =>this.isShowPeopleNum = false, 2000);
            this.timer = setTimeout(async () => {
                this.inviteXqUpdate();
            }, 5000);
        },
        initCodeRef() {
            this.isLoadingCode = true;
            this.$nextTick(() => {
                this.$refs.uQrcodeRef && this.$refs.uQrcodeRef.createCode(this.vipObject.share_url);
            });
        },
        weiXinPainterHandle() {
            this.codeUrl = this.vipObject.share_url;
            this.isShowPainterImg = true;
        }
    }
}
</script>
<style lang="scss">
page {
    background: #FFE7D1;
}
.content {
    padding-bottom: calc(10rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(10rpx + env(safe-area-inset-bottom));
}
.cont_top{
    position: relative;
    z-index: 0;
    background: #FFE7D1;
    &::before {
        content: '\3000';
        background: #FFE7D1 url("https://file.y1b.cn/store/1-0/231227/658bd09be20f9.png") no-repeat 0 -15rpx / 100% 100%;
        width: 100%;
        height: 1000rpx;
        z-index: 0;
        display: block;
    }
    .invite_notice {
        width: 100%;
        height: 64rpx;
        background: rgba(255,255,255,0.24);
        position: absolute;
        left: 0;
        text-align: center;
        font-size: 28rpx;
        color: #fff;
        line-height: 64rpx;
        opacity: 0;
        transition: all 1s;
        &::before {
            content: '\3000';
            background: url("https://file.y1b.cn/store/1-0/231228/658cedeacfc1d.png") 0 0 / 100% 100%;
            width: 32rpx;
            height: 28rpx;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            margin-left: -45rpx;
        }
        &.active {
            opacity: 1;
        }
    }
}
.code_img{
    border-radius: 8rpx;
    position: absolute;
    width: 248rpx;
    height: 248rpx;
    left: 50%;
    transform: translateX(-50%);
    top: 476rpx;
    .add_cont-load {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 1;
        transform: translate(-50%, -50%);
    }
}
.invite_box {
    margin: -145rpx 24rpx;
    position: relative;
    z-index: 0;
    padding: 24rpx 22rpx 32rpx;
    backdrop-filter: blur(5px);
    &::before {
        content: '\3000';
        background: url("https://file.y1b.cn/store/1-0/231227/658be123b5dcb.png") 0 0 / 100% 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 105%;
        height: 105%;
        z-index: -1;
        display: block;
    }
    .red_title {
        width: 188rpx;
        height: 76rpx;
        margin: 0 auto;
        background: url("https://file.y1b.cn/store/1-0/231227/658be295009ae.png") 0 0 / 100% 100%;
    }
    .invite_title{
        width: 188rpx;
        height: 76rpx;
        margin: 48rpx auto 0;
        background: url("https://file.y1b.cn/store/1-0/231227/658be33206829.png") 0 0 / 100% 100%;
    }
    .wechat_icon {
        width: 96rpx;
        height: 96rpx;
        margin: 22rpx auto 0;
        background: url("https://file.y1b.cn/store/1-0/231227/658be487da202.png") 0 0 / 100% 100%;
    }
    .cont_box {
        padding: 0 24rpx 24rpx;
        font-size: 30rpx;
        color: #333;
        display: flex;
        flex-wrap: wrap;
        background: rgba(255,255,255,0.40);
        border-radius: 24rpx;
        font-weight: 600;
        margin: 20rpx 22rpx 0;
        .tex_item {
            min-width: 45%;
            white-space: nowrap;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            margin-top: 24rpx;
            &::before {
                content: '\3000';
                width: 10rpx;
                height: 10rpx;
                display: inline-block;
                border-radius: 50%;
                background: #EC5F54;
                margin-right: 10rpx;
            }

        }
        .red_txt {
            color: #EC5F54;
            margin: 0 5rpx;
        }
    }
}
</style>
