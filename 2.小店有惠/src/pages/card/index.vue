<template>
<view>
<mescroll-body
    :sticky="true"
    ref="mescrollRef"
    @init="mescrollInit"
    @down="downCallback"
    @up="upCallback"
    :up="upOption"
    :down="downOption"
>
    <xhNavbar
        :fixedNum="true"
        :fixed="true"
        :navbarColor="showNavbarColors"
        :title="showNavTitle"
        :isFloat="userInfo.is_team"
    ></xhNavbar>
    <!-- 非团长信息 -->
    <view class="content_card" v-if="!userInfo.is_team">
        <view class="entry_btn-box heartBeat">
            <view class="entry_btn" @click="applyRequest">
                {{ !isApplyStatus ? '立即报名成为团长' : '审核中' }}
                <text class="entry_icon">钱多！事少！收益稳!</text>
            </view>
            <!-- 暂时关闭手机号的验收 -->
            <van-button type="danger"
                open-type="getPhoneNumber"
                @getphonenumber="applyHandle"
                :custom-style="btnStyle"
                class="btn_phone" block
                color="transparent"
                custom-style="height:134rpx;opacity:0"
                v-if="!isApplyStatus"
            ></van-button>
        </view>
        <view class="agree_text">
            报名即表示阅读并同意
            <text style="color:#FF4F3E" @click="$agreementLookHandle('/agreement/team-agreement.html')">
            《团长服务协议》</text>
        </view>
        <!-- 关于团长 -->
        <view class="about">
            <view class="about_title">
                <image
                    class="about_title-bg"
                    src="/static/images/card/about_title-bg.png"
                    mode="aspectFill"
                ></image>
                <text>关于团长</text>
            </view>
            <view class="cont_title">{{textList[0].title}}</view>
            <view class="cont_txt"
                v-for="(item, index) in textList[0].content" :key="index"
            >{{item}}</view>
            <!-- 分割线 -->
            <view class="about_division">
                <view class="about_division-bg"></view>
            </view>
            <view class="cont_title">成为团长的{{reasonList.length}}大理由</view>
            <view class="about_reason">
                <view class="about_reason-item" v-for="item in reasonList" :key="item.id">
                    <image
                        class="about_reason-icon"
                        :src="item.icon"
                        mode="aspectFill"
                    ></image>
                    <text>{{item.text}}</text>
                </view>
            </view>
        </view>
        <!-- 作为团长 -->
        <view class="leader">
            <view class="cont_title">{{textList[1].title}}</view>
            <view class="cont_txtList">
                <view class="cont_txtList-item"
                    v-for="(item, index) in textList[1].content" :key="index"
                >
                {{item}}
                </view>
            </view>
            <view class="leader_title">
                <text class="headline_text">想赚的更多，你能做</text>
            </view>
            <view class="leader_cont">
                <view class="leader_cont-item">
                    <view class="leader_cont-title">拓宽用户渠道</view>
                    <view class="leader_cont-text">选择不同渠道的优质用户，定向发放省钱卡</view>
                </view>
                <view class="leader_cont-item">
                    <view class="leader_cont-title">建立社群</view>
                    <view class="leader_cont-text">维护社群关系，保证群内活跃</view>
                </view>
            </view>
        </view>
    </view>
    <view class="content_team" v-else>
        <view class="cont_top">
            <view class="top_title" @click="inviteListHandle">
                成功邀请：{{peopleNums}}人<van-icon name="arrow" color="#fff" size="28rpx" style="margin-left: 10rpx;" />
            </view>
            <view class="top_btn heartBeat" @click="inviteHandle"></view>
            <view class="top_earn" @click="goToCardEarnings"></view>
        </view>
        <view class="cont_box">
            <view class="leader_intro fl_bet" @click="openLeadDiaHandle">
                <view>赚钱指引</view>
                <view class="intro_right">立即了解<van-icon name="arrow" color="#aaa" size="28rpx" style="margin-left: 10rpx;" /></view>
            </view>
            <block v-for="(item, index) in textList" :key="index">
                <view class="intro_title">
                    <text class="intro_title-txt">{{ item.title }}</text>
                </view>
                <view class="vip_cont">
                    <view class="vip_list"
                        v-for="(listItem, index) in item.content" :key="index"
                    >{{listItem}}</view>
                </view>
            </block>
            <view class="intro_title">
                <text class="intro_title-txt">{{text2List.htitle}}</text>
            </view>
            <view class="vip_cont">
                <view class="vip_list"
                    v-for="(item, index) in text2List.contents" :key="index"
                >
                    <view class="vip_list-title">{{ item.title }}</view>
                    <view class="vip_list-cont">{{ item.content }}</view>
                </view>
            </view>
        </view>
    </view>
</mescroll-body>
<navbar
    :currentIndex="1"
    @domObjHeight="domObjHeightHandle"
    @current="currentHandle"
></navbar>
<leadDia
    :isShow="isShowLeadDia"
    :currIndex="currIndex"
    @setIndex="setIndexHandle"
    @close="isShowLeadDia = false"
></leadDia>
<confirmDia
    :isShow="isShowResult"
    @close="isShowResult = false"
    @confirm="confirmHandle"
></confirmDia>
<!-- 报名成功 -->
<report-success-dia
    :isShow="isShowSuccess"
    title="已报名，正在审核中"
    label="1-3个工作日内审核完毕"
    @close="closeSuccessHandle"
></report-success-dia>
</view>
</template>
<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import reportSuccessDia from '@/components/reportSuccessDia.vue';
import leadDia from './leadDia.vue';
import confirmDia from './confirmDia.vue';
import { getNavbarData } from "@/components/xhNavbar/xhNavbar.js";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { getShowLeadStep } from "@/utils/auth.js";
import { apply, applyInfo, msgTemplate, wordConfig, inviteXq, isSend } from "@/api/modules/card.js";
export default {
    mixins: [MescrollMixin], // 使用mixin
    components: {
        reportSuccessDia,
        leadDia,
        confirmDia,
    },
    data() {
        return {
            loading: false,
            finished: false,
            list: [1, 2, 23],
            downOption: {
                auto: false,
                bgColor: "#ffffff",
            },
            upOption: {
                auto: false, // 不自动加载
                use: false,
            },
            tabHeightValue: 0,
            stickyTopHeight: 0,
            isShowLeadDia: false,
            currIndex: 0,
            showLeadStep: null,
            reasonList:[
                {
                    id: 0,
                    icon: '/static/images/card/icon0.png',
                    text: '收益高'
                },
                {
                    id: 1,
                    icon: '/static/images/card/icon1.png',
                    text: '长久生意'
                },
                {
                    id: 2,
                    icon: '/static/images/card/icon3.png',
                    text: '拥有副业'
                }
            ],
            isApplyStatus: 0,
            isShowResult: false,
            isShowSuccess: false,
            textList: [],
            text2List: [],
            peopleNums: 0,
            showTitleBg: false
        }
    },
    watch: {
        showLeadStep: {
            handler: function (newValue, oldValue){
                if(newValue || !this.userInfo.is_team) return;
                if(this.diaList.length) {
                    this.setDiaList('leadDia');
                    return;
                }
                this.isShowLeadDia = true;
            },
        },
        diaList(newValue, oldValue) {
            if(newValue.length && (newValue[0] == 'leadDia')) {
                this.isShowLeadDia = true;
                this.delCurrentDiaList();
            }
        }
    },
    computed: {
        ...mapGetters(["vipObject", 'userInfo', 'diaList', 'isAutoLogin']),
        coneHeight() {
            let minHeight = (uni.getSystemInfoSync().windowHeight - this.tabHeightValue - this.stickyTopHeight + 50) + 'px';
            return minHeight;
        },
        showNavbarColors() {
            if(this.userInfo.is_team) {
                return !this.showTitleBg ? 'transparent' : '#fff';
            }
            return '#fff';
        },
        showNavTitle() {
            if(this.userInfo.is_team) {
                return !this.showTitleBg ? '' : '赚钱中心';
            }
            return '报名团长';
        }
    },
    async onLoad() {
        this.wordConfigInit();
        this.initStatus();
        const res = await getNavbarData();
        let { navBarHeight, statusBarHeight } = res;
        this.stickyTopHeight = navBarHeight + statusBarHeight;
    },
    async onShow() {
        // 获取存储的引导弹窗的
        this.showLeadStep = getShowLeadStep();
        const res = await inviteXq();
        if(res.code != 1) return;
        const { peopleNums } = res.data;
        this.peopleNums = peopleNums;

    },
    // 页面的滚动事件
    onPageScroll(e) {
      if (Math.ceil(e.scrollTop) > 0) {
        return this.showTitleBg = true;
      }
      this.showTitleBg = false;
    },
    methods: {
        ...mapActions({
            getUserInfo: "user/getUserInfo",
            getVipObject: "user/getVipObject",
            updateMobile: "user/updateMobile",
        }),
        ...mapMutations({
            setDiaList: "user/setDiaList",
            delCurrentDiaList: "user/delCurrentDiaList",
        }),
        currentHandle() {
            this.mescroll.scrollTo(0, 0);
        },
        setIndexHandle(index) {
            this.currIndex = index;
        },
        openLeadDiaHandle() {
            this.currIndex = 0;
            this.isShowLeadDia = true;
        },
        async wordConfigInit() {
            const res = await wordConfig();
            if(res.code != 1) return;
            const { text, text2 } = res.data;
            this.textList = text;
            this.text2List = text2;

        },
        async initStatus() {
            this.getUserInfo();
            this.getVipObject();
            if(this.userInfo.is_team || !this.isAutoLogin) return;
            this.applyInfoRequest();
        },
        async applyInfoRequest(showToast = false) {
            const res = await applyInfo();
            if(res.code!= 1) return;
            this.isApplyStatus = res.data;
            if(this.isApplyStatus == 2) {
                return this.isShowResult = true;
            }
            if(this.isApplyStatus && showToast) {
                this.$toast('报名审核中');
            }
        },
        domObjHeightHandle(height) {
            this.tabHeightValue = height;
        },
        async goToCardEarnings() {
            if(!this.isAutoLogin) return this.$go('/pages/login/index');
            // 是否需要发送协议通知
            if(!this.vipObject.is_send || !this.vipObject.is_events) {
                const msgRes = await msgTemplate();
                if(msgRes.code != 1) return this.$toast(msgRes.msg);
                const { settle, events } = msgRes.data;
                let tmplIds = [];
                (!this.vipObject.is_send) && tmplIds.push(settle);
                (!this.vipObject.is_events) && tmplIds.push(events);
                const subRes = await this.$subscribeMessageHandle(tmplIds);
                const settleResult = subRes[settle];
                const eventsResult = subRes[events];
                const params = {
                    is_send: 0,
                    is_events: 0
                }
                if(settleResult == 'accept') params.is_send = 1;
                if(eventsResult == 'accept') params.is_events = 1;
                isSend(params);
            }
            this.$go('/pages/cardModule/cardEarnings/index');
        },
        inviteHandle() {
            if(!this.isAutoLogin) return this.$go('/pages/login/index');
            this.$go('/pages/cardModule/invite/index');
        },
        inviteListHandle() {
            if(!this.isAutoLogin) return this.$go('/pages/login/index');
            this.$go('/pages/cardModule/invite/inviteList');
        },
        async applyHandle(event) {
            this.$wxReportEvent('amaster'); // 报名团长 - 进行埋点的添加
			if(event.detail.errMsg !== 'getPhoneNumber:ok') return this.$toast('报名团长需要你授权手机号');
            const phoneCode = event.detail.code;
            if(phoneCode) {
                this.applyRequest();
                this.updateMobile({
                    code: phoneCode,
                    hideModel: true
                });
                return;
            }
            this.applyRequest();
            // this.$toast('报名团长需要你授权手机号');
        },
        async applyRequest() {
            // 已提交审核 - 审核中
            if(this.isApplyStatus) return this.applyInfoRequest(true);
            const res = await apply();
            if(res.code!= 1) return this.$toast(res.msg, 4000);
            // this.$toast('报名成功');
            this.isShowSuccess = true;
            this.isApplyStatus = 1;
        },
        confirmHandle() {
            this.getUserInfo();
            this.getVipObject();
            this.isShowResult = false;
        },
        async closeSuccessHandle(){
            const msgRes = await msgTemplate();
            if(msgRes.code != 1) return this.$toast(msgRes.msg);
            const { team_apply, settle, events } = msgRes.data;
            // 收益、审核、活动
            const tmplIds = [ team_apply, settle, events];
            this.$subscribeMessageHandle(tmplIds).then((result) => {
                this.isShowSuccess = false;
            }); // 消息订阅的通知
        }
    }
}
</script>
<style lang="scss">
$bgColor: #FDF7DA;
.content_card {
    background: $bgColor;
    padding-bottom: calc(125rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(125rpx + env(safe-area-inset-bottom));
    position: relative;
    z-index: 0;
    &::before {
        content: '\3000';
        background: url("https://file.y1b.cn/store/1-0/231227/658b997bb8200.png") 0 0 / 100% 100%;
        width: 100%;
        height: 660rpx;
        z-index: 0;
        display: block;
    }
    .card_banner {
        width: 750rpx;
        height: 660rpx;
    }
    .entry_btn-box{
        position: relative;
        width: 644rpx;
        height: 134rpx;
        line-height: 134rpx;
        z-index: 0;
        margin: auto;
        font-size: 36rpx;
        font-weight: 600;
        text-align: center;
        color: #bb0000;
        margin-top: -20rpx;
        &::before {
            content: '\3000';
            background: url("https://file.y1b.cn/store/1-0/231116/6555d9415011b.png") 0 0 / 100% 100%;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }
        .btn_phone{
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }
        .entry_icon {
            position: absolute;
            right: 18rpx;
            width: 220rpx;
            height: 28rpx;
            background: #fb3c0d;
            border-radius: 25rpx 20rpx 20rpx 0rpx;
            font-size: 20rpx;
            font-weight: 400;
            color: #ffffff;
            line-height: 28rpx;
        }
    }
    .agree_text {
        font-size: 24rpx;
        font-weight: 400;
        text-align: center;
        color: rgba(102,102,102,0.85);
        line-height: 34rpx;
        margin-top: -4rpx;
    }
    .cont_title {
        height: 56rpx;
        font-size: 40rpx;
        font-weight: 600;
        text-align: center;
        color: #bb0000;
        line-height: 56rpx;
        margin-top: 16rpx;
    }
    .cont_txt {
        margin: 24rpx 38rpx 34rpx;
        font-size: 28rpx;
        color: #333;
        line-height: 40rpx;
    }
    .about {
        margin: 48rpx 24rpx 0;
        position: relative;
        background: #fff;
        border-radius: 16rpx;
        .about_title {
            position: relative;
            width: 302rpx;
            height: 55rpx;
            top: -14rpx;
            z-index: 0;
            margin: 0 auto;
            font-size: 28rpx;
            font-weight: 500;
            text-align: center;
            color: #ffffff;
            line-height: 55rpx;
            .about_title-bg {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
            }

        }
        .about_division {
            position: relative;
            height: 40rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 20rpx 0;
            &::before,
            &::after {
                content: '\3000';
                position: absolute;
                width: 40rpx;
                height: 40rpx;
                background: $bgColor;
                top: 0;
                border-radius: 50%;
            }
            &::before {
                left: -20rpx;
            }
            &::after {
                right: -20rpx;
            }
            .about_division-bg{
                width: 634rpx;
                border-bottom: 2rpx dashed rgba(255,21,10,0.50);
            }
        }
        .about_reason {
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding:24rpx 20rpx 40rpx;
            .about_reason-item {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-size: 28rpx;
                font-weight: 400;
                color: #980000;
                line-height: 40rpx;
                .about_reason-icon {
                    width: 88rpx;
                    height: 88rpx;
                    margin-bottom: 12rpx;
                }
            }
        }
    }
    .leader {
        background: #ffffff;
        border-radius: 16rpx;
        margin: 32rpx 24rpx 0;
        overflow: hidden;
        .cont_title {
            margin-top: 40rpx;
        }
        .cont_txtList {
            margin: 24rpx 32rpx 0rpx;
            .cont_txtList-item {
                font-size: 28rpx;
                font-weight: 400;
                color: #333333;
                line-height: 40rpx;
                margin-bottom: 8rpx;
            }
        }
        .leader_cont {
            margin: 0 32rpx;
            counter-reset: leaderNum;
            .leader_cont-item {
                font-weight: 500;
                color: #bb0000;
                padding-left: 51rpx;
                position: relative;
                &::before {
                    content: counter(leaderNum);
                    counter-increment: leaderNum;
                    position: absolute;
                    top: 8rpx;
                    left: 0rpx;
                    width: 34rpx;
                    height: 34rpx;
                    line-height: 34rpx;
                    background: #ffd2d5;
                    border-radius: 4rpx;
                    font-size: 26rpx;
                    text-align: center;
                }
                &:not(:last-child)::after {
                    content: '\3000';
                    position: absolute;
                    top: 50%;
                    left: 16rpx;
                    width: 2rpx;
                    height: 80%;
                    background: linear-gradient(to bottom,transparent 0%,transparent 50%,#FFD2D5 50%,#FFD2D5 100%);
                    background-size: 2rpx 4rpx;
                    background-repeat: repeat-y;
                }
                .leader_cont-title {
                    font-size: 36rpx;
                    line-height: 50rpx;
                    font-weight: bold;
                }

                .leader_cont-text {
                    font-size: 28rpx;
                    font-weight: 400;
                    color: #333333;
                    line-height: 40rpx;
                    margin: 10rpx 0 40rpx;
                }
            }
        }
    }
}
.nav_custom {
    flex: 1;
    font-size: 36rpx;
    line-height: 50rpx;
    color: #333;
    display: inline-block;
    text-align: center;
}
.content_team {
    background: #FFE7D1;
    overflow: hidden;
}
.cont_top{
    position: relative;
    z-index: 0;
    overflow: hidden;
    &::before {
        content: '\3000';
        background: url("https://file.y1b.cn/store/1-0/231229/658e4db3cab7f.png") 0 0 / 100% 100%;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 938rpx;
        z-index: -1;
    }
    .top_title{
        width: 462rpx;
        height: 74rpx;
        line-height: 74rpx;
        font-size: 32rpx;
        color: #fff;
        text-align: center;
        position: relative;
        z-index: 0;
        margin: 360rpx auto 0;
        &::before {
            content: '\3000';
            background: url("https://file.y1b.cn/store/1-0/231227/658bb8730a1ba.png") 0 0 / 100% 100%;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }
    }
    .top_btn {
        position: relative;
        z-index: 0;
        width: 454rpx;
        height: 152rpx;
        margin: 406rpx auto 0;
        background: url("https://file.y1b.cn/store/1-0/231227/658bb9590d47b.png") 0 0 / 100% 100%;
        &::before {
            content: '\3000';
            background: url("https://file.y1b.cn/store/1-0/231227/658bb9df911c3.png") 0 0 / 100% 100%;
            position: absolute;
            right: 30rpx;
            top: 0;
            width: 228rpx;
            height: 32rpx;
        }
    }
    .top_earn{
        background: url("https://file.y1b.cn/store/1-0/231229/658e68b52e0e9.png") 0 0 / 100% 100%;
        width: 130rpx;
        height: 110rpx;
        position: absolute;
        left: 0;
        bottom: 28rpx;
    }
}
.top_price{
    font-size: 72rpx;
    line-height: 60rpx;
    color: #3D2100;
    font-weight: 600;
    margin-top: 12rpx;
}
.top_price_lab{
    font-size: 28rpx;
    line-height: 40rpx;
    color: rgba(61,33,0,0.50);
}
.cont_box{
    position: relative;
    z-index: 0;
    background: #FFF5ED;
    margin: 34rpx 16rpx 0;
    margin-bottom: calc(155rpx + constant(safe-area-inset-bottom));
    margin-bottom: calc(155rpx + env(safe-area-inset-bottom));
    border-radius: 32rpx;
    overflow: hidden;
    .intro_title {
        line-height: 44rpx;
        font-size: 32rpx;
        text-align: center;
        color: #333;
        margin: 64rpx 0 32rpx;
        font-weight: bold;
        .intro_title-txt{
            position: relative;
            z-index: 0;
            &::before {
                content: '\3000';
                background: url("https://file.y1b.cn/store/1-0/231229/658e6681bcb2c.png") 0 0 / 100% 100%;
                position: absolute;
                left: -20rpx;
                top: -10rpx;
                width: 94rpx;
                height: 48rpx;
                z-index: -1;
            }
            &::after {
                content: '\3000';
                background: url("https://file.y1b.cn/store/1-0/231229/658e66999e7be.png") 0 0 / 100% 100%;
                position: absolute;
                width: 56rpx;
                height: 28rpx;
                right: -20rpx;
                bottom: -2rpx;
                z-index: -1;
            }
        }

    }
}
.leader_box{
    padding-bottom: calc(125rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(125rpx + env(safe-area-inset-bottom));
}
.leader_intro{
    margin: 32rpx 24rpx 0;
    height: 88rpx;
    line-height: 88rpx;
    background: rgba(255,255,255,0.50);
    border-radius: 16rpx;
    padding: 0 20rpx;
    font-weight: bold;
    color: #333;
    .intro_right{
        font-size: 28rpx;
        color: #aaa;
    }
}
.vip_cont{
    margin: 0 40rpx 74rpx;
    font-size: 28rpx;
    color: #666;
    line-height: 40rpx;
    &:last-child {
        margin-bottom: 0;
    }
    .vip_list {
        margin-bottom: 8rpx;
        .vip_list-title{
            margin-bottom: 8rpx;
            font-weight: bold;
        }
        .vip_list-cont {
            margin-bottom: 20rpx;
        }
    }
}
.leader {
    border-radius: 24rpx;
    margin: 24rpx 24rpx 0;
    overflow: hidden;
    color: #666;
    position: relative;
    z-index: 0;
    &:last-child {
        margin-bottom: 28rpx;
    }
    .leader_title {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 32rpx 0;
        font-size: 40rpx;
        text-align: center;
        color: #bb0000;
        font-weight: bold;
    }
    .headline_text {
        margin: 40rpx 0 32rpx;
        position: relative;
        display: inline-block;
        margin: auto;
        &::before,
        &::after {
            content: '\3000';
            position: absolute;
            top: 50%;
            margin-top: -4rpx;
            width: 82rpx;
            height: 8rpx;
        }
        &::before{
            background: linear-gradient(to left, #b31717,#fff);
            left: 0;
            margin-left: -98rpx;
        }
        &::after{
            background: linear-gradient(to right, #b31717,#fff);
            right: 0;
            margin-right: -98rpx;
        }
    }
    .leader_cont {
        margin: 0 32rpx;
        counter-reset: leaderNum;
        .leader_cont-item {
            font-weight: 500;
            padding-left: 51rpx;
            position: relative;
            &::before {
                content: counter(leaderNum);
                counter-increment: leaderNum;
                position: absolute;
                top: 8rpx;
                left: 0rpx;
                width: 34rpx;
                height: 34rpx;
                line-height: 34rpx;
                background: rgba(255,255,255,0.30);
                border-radius: 4rpx;
                font-size: 26rpx;
                text-align: center;
            }
            &:not(:last-child)::after {
                content: '\3000';
                position: absolute;
                top: 50%;
                left: 16rpx;
                width: 2rpx;
                height: 80%;
                background: linear-gradient(to bottom,transparent 0%,transparent 50%, #fff 50%,#fff 100%);
                background-size: 2rpx 4rpx;
                background-repeat: repeat-y;
            }
            .leader_cont-title {
                font-size: 36rpx;
                line-height: 50rpx;
            }

            .leader_cont-text {
                font-size: 28rpx;
                font-weight: 400;
                line-height: 40rpx;
                margin: 10rpx 0 40rpx;
                opacity: 0.6;
            }
        }
    }
}
</style>
