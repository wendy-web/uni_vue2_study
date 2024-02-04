<template>
<view class="card" >
    <xh-navbar
        :leftImage="imgUrl+'/static/images/left_back.png'"
        @leftCallBack="$topCallBack"
        :fixed="true"
        title="省钱卡会员"
        titleColor="#333"
        :navberColor="isShowNavBerColor ? '#FFECBD': ''"
    ></xh-navbar>
    <image :src="cardVip_bgImg" :style="{'--margin': navHeight + 'px' }" mode="widthFix" class="nav_bg"></image>
    <view class="card_top fl_bet">
        <view class="box_fl">
            <!-- 头像 -->
            <van-image
                class="avatar-icon"
                height="80rpx"
                width="80rpx"
                radius="50%"
                :src="userInfo.avatar_url || default_avatar"
                use-loading-slot
            ><van-loading slot="loading" type="spinner" size="20" vertical />
            </van-image>
            <view class="nick_cont">
                <view class="nick_name">{{ userInfo.nick_name || "未登录" }}</view>
                <view class="nick_lab">您还未开通省钱卡会员</view>
            </view>
        </view>
        <image mode="scaleToFill" class="card_top-btn"
            :src="cardImgUrl + 'card_top-btn.png'"
            @click="buyVipHandle"
        ></image>
    </view>
    <view class="card_cont">
        <selCardList
            :vipLists="vipLists"
            :isSelectVipIndex="isSelectVipIndex"
            @selClick="selectVipHandle"
        ></selCardList>
        <!-- 每月享 红包的专享 -->
        <openRedPackList :selVipObj="selVipObj" :selVipIndex="isSelectVipIndex"></openRedPackList>
        <!-- 省钱卡特权 -->
        <prerogativeList :isSpread="isSpread" @spread="isSpread = !isSpread"></prerogativeList>
    </view>
<!-- 支付 -->
<view class="pay_bottom">
    <view class="pay_btn fl_bet" @click="buyVipHandle">
        <image src="https://file.y1b.cn/store/1-0/23111/6541ef6407e7a.png" mode="scaleToFill" class="pay_lab-img" v-if="selVipObj.reduce"></image>
        <view class="pay_left">日常价{{selVipObj.line_price}}元</view>
        <view class="pay_right">
            开通会员
            <text style="font-size: 20rpx;" space="nbsp"> ￥</text>
            <text style="font-size: 42rpx;">{{ selVipObj.buy_price }}</text>
        </view>
    </view>
    <view class="pay_lab fl_center">安心保障 · 不自动续费</view>
    <view class="pay_agree">开通即同意
        <text style="color: #FE9433;" @click="toAgreeLook('/agreement/savings-server.html')">《省钱卡会员服务协议》</text> 和
        <text style="color: #FE9433;" @click="toAgreeLook('/agreement/savings-rule.html')">《会员规则》</text>
    </view>
</view>
</view>
</template>

<script>
import { buy, getLists, orderPay } from "@/api/modules/packet.js";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { formatPrice, getImgUrl, toAgreeLook } from '@/utils/auth.js';
import getViewPort from '@/utils/getViewPort.js';
import { mapActions, mapGetters } from "vuex";
import openRedPackList from '../component/openRedPackList.vue';
import prerogativeList from '../component/prerogativeList.vue';
import selCardList from '../component/selCardList.vue';
import swiperListCom from '../component/swiperListCom.vue';
export default {
    mixins: [MescrollMixin], // 使用mixin
    components: {
        swiperListCom,
        prerogativeList,
        selCardList,
        openRedPackList
    },
    data() {
        return {
            imgUrl: getImgUrl(),
            cardImgUrl:`${getImgUrl()}static/card/`,
            default_avatar: `${getImgUrl()}/static/images/default_avatar_grey.png`,
            isShowNavBerColor: false,
            vipLists: [],
            isSelectVipIndex: 1,
            paymentParams: null,
            isSpread: true
        }
    },
    computed: {
        ...mapGetters(["userInfo"]),
        navHeight() {
            let viewPort = getViewPort();
            return viewPort.navHeight;
        },
        cardVip_bgImg() {
            let url = 'cardVip_bg0.png';
            return `${this.cardImgUrl}${url}`
        },
        selVipObj(){
            return this.vipLists[this.isSelectVipIndex];
        },
    },
    async onLoad(option) {
        this.init();
    },
    methods: {
        ...mapActions({
            getUserInfo: 'user/getUserInfo',
        }),
        formatPrice,
        toAgreeLook,
        async init() {
            const res = await getLists();
            if(res.code != 1 || !res.data) return;
            this.vipLists = res.data;
        },
        selectVipHandle(index) {
            this.isSelectVipIndex = index;
            this.paymentParams = null;
        },
        onPageScroll(event) {
            const scrollTop = Math.ceil(event.scrollTop)
            if(scrollTop >= this.navHeight) return this.isShowNavBerColor = true;
            this.isShowNavBerColor = false;
        },
        async buyVipHandle() {
            if(this.paymentParams) return this.createPayment();
            const goods_id = this.vipLists[this.isSelectVipIndex].id;
            const res = await buy({goods_id});
            if(res.code != 1 || !res.data) return;
            const { oid } = res.data;
            this.orderPayFun(oid);
        },
        async orderPayFun(oid){
            const res = await orderPay({oid});
            if(res.code != 1 || !res.data) return;
            this.paymentParams = res.data;
            this.createPayment();
        },
        createPayment() {
            const obj = this.paymentParams;
            uni.requestPayment({
                'nonceStr': obj.nonceStr,
                'package': obj.package,
                'paySign': obj.paySign,
                'signType': obj.signType,
                'timeStamp': obj.timeStamp,
				success: (res) => {
                    console.log('支付成功', res)
                    this.$toast('开通省钱卡');
                    this.getUserInfo();
                    this.$redirectTo('/pages/userCard/card/cardVip/index?isOpenVip=true');
                    // this.$topCallBack();
                },
				fail: (err) => {
                    console.log('支付失败', err)
                }
            });
        }
    }
}
</script>
<style scoped lang="scss">
page {
    background: #f5f6fa;
}
.card{
    position: relative;
    z-index: 0;
    box-sizing: border-box;
    /* 兼容 IOS<11.2 */
    padding-bottom: 300rpx;
    .nav_bg {
        width: 100%;
        position: absolute;
        z-index: -1;
        margin-top: calc(0px - var(--margin));
    }
}
.card_top{
    margin: 58rpx 16rpx 0;
    position: relative;
    z-index: 0;
    font-size: 0;
    padding: 32rpx 32rpx 36rpx;
    &::before {
        content: '\3000';
        background: url("https://file.y1b.cn/public/img/ttxl/static/card/card_top-bg1.png") 0 0 / 100% 100%;
        position: absolute;
        width: 750rpx;
        height: 36rpx;
        z-index: -1;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
    }
    &::after {
        content: '\3000';
        background: url("https://file.y1b.cn/public/img/ttxl/static/card/card_top-bg.png") 0 0 / 100% 100%;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }
}
.card_top-btn{
    width: 140rpx;
    height: 60rpx;
}
.nick_cont{
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
    line-height: 40rpx;
    margin-left: 20rpx;
    .nick_lab{
        font-size: 24rpx;
        font-weight: 400;
        color: #666;
        line-height: 34rpx;
    }
}
.card_cont{
    padding: 72rpx 24rpx 0;
    margin-top: -18rpx;
    background: linear-gradient(180deg,#ffffff, #f5f6fa 19%);
    overflow: hidden;
}
.red_lab {
    font-size: 26rpx;
    color: #999;
    .red_av {
        width: 32rpx;
        height: 32rpx;
        flex: 0 0 32rpx;
        border-radius: 50%;
        margin-right: 8rpx;
    }
}
.pay_bottom{
    position: fixed;
    z-index: 9;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 300rpx;
    box-sizing: border-box;
    padding: 0 24rpx;
    overflow: hidden;
    padding-bottom: calc(0 + constant(safe-area-inset-bottom));
    /* 兼容 IOS<11.2 */
    padding-bottom: calc(0 + env(safe-area-inset-bottom));
    &::before {
        content: '\3000';
        position: absolute;
        width: 100%;
        height: 100%;
        background: #ffffff;
        filter: blur(30rpx);
        left: 0;
        z-index: -1;
    }
    .pay_btn{
        width: 702rpx;
        height: 104rpx;
        position: relative;
        z-index: 0;
        font-weight: 500;
        text-align: center;
        color: #fff;
        margin: 36rpx auto 0;
        &::before {
            content: '\3000';
            background: url("https://file.y1b.cn/public/img/ttxl/static/card/pay_btn.png") 0 0 / 100% 100%;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }
        .pay_lab-img{
            position: absolute;
            width: 278rpx;
            height: 50rpx;
            top: -25rpx;
            right: 144rpx;
        }
    }
    .pay_left{
        width: 40%;
        font-size: 28rpx;
        margin-top: 10rpx;
        color: #b75a30;
    }
    .pay_right{
        width: 60%;
        font-size: 32rpx;
    }
    .pay_lab{
        font-size: 26rpx;
        color: #333;
        line-height: 36rpx;
        margin-top: 20rpx;
        &::before {
            content: '\3000';
            background: url("https://file.y1b.cn/public/img/ttxl/static/card/pay_safe.png") 0 0 / 100% 100%;
            width: 20rpx;
            height: 26rpx;
            margin-right: 10rpx;
            display: block;
        }
        .pay_safe{
            width: 20rpx;
            height: 26rpx;
            margin-right: 10rpx;
        }
    }
    .pay_agree{
        font-size: 26rpx;
        text-align: center;
        color: #aaaaaa;
        line-height: 36rpx;
        margin-top: 16rpx;
    }
}
</style>
