<template>
<view class="card">
<xh-navbar
  :leftImage="imgUrl+'/static/images/left_back.png'"
  @leftCallBack="$topCallBack"
  :fixed="true"
  title="会员续费"
  titleColor="#333"
  :navberColor="isShowNavBerColor ? '#FADF95': ''"
></xh-navbar>
    <image :src="cardVip_bgImg" :style="{'--margin': navHeight + 'px' }" mode="widthFix" class="nav_bg"></image>
    <view class="card_top box_fl">
        <!-- 头像 -->
        <van-image
            class="avatar-icon"
            height="80rpx"
            width="80rpx"
            radius="50%"
            :src="userInfo.avatar_url || default_avatar"
            use-loading-slot
        >
            <van-loading slot="loading" type="spinner" size="20" vertical />
        </van-image>
        <view class="nick_cont">
            <view class="nick_name">
                <image class="card_icon" :src="cardImgUrl + 'card_icon.png'" mode="aspectFill"></image>
                {{ userInfo.nick_name || "未登录" }}
            </view>
            <view class="nick_lab">当前会员有效期至{{over_time}}(剩余{{have_day}}天)</view>
        </view>
    </view>
    <view class="card_cont">
        <selCardList
            :vipLists="vipLists"
            :isSelectVipIndex="isSelectVipIndex"
            @selClick="selectVipHandle"
        ></selCardList>
        <!-- 每月享 红包的专享 -->
        <openRedPackList :selVipObj="selVipObj"></openRedPackList>
        <!-- 支付 -->
        <view class="pay_btn" @click="buyVipHandle">
            <image src="https://file.y1b.cn/store/1-0/23111/6541f028b09a0.png" mode="scaleToFill" class="pay_lab-img" v-if="selVipObj.reduce"></image>
            <text style="font-size: 28rpx;">￥</text>
            <text style="font-size: 52rpx; margin-right: 5rpx;">{{ selVipObj.buy_price }}</text>
             立即续费
            <text style="font-size: 24rpx;">(原价¥{{ selVipObj.line_price }})</text>
        </view>
        <view class="pay_lab fl_center">
            <image :src="cardImgUrl + 'pay_safe.png'" mode="scaleToFill" class="pay_safe"></image>
            <text>安心保障 · 不自动续费</text>
        </view>
        <view class="pay_agree">
            开通即同意
            <text style="color: #FE9433;" @click="toAgreeLook('/agreement/savings-server.html')">《省钱卡会员服务协议》</text>和
            <text style="color: #FE9433;" @click="toAgreeLook('/agreement/savings-rule.html')">《会员规则》</text>
        </view>
        <!-- 省钱卡特权 -->
        <prerogativeList :isSpread="isSpread" @spread="isSpread = !isSpread"></prerogativeList>
    </view>
<paySuccessDia
    :isShow="isPaySuccessShow"
    :config="payConfig"
    @close="confirmHandle"
    @confirm="confirmHandle"
></paySuccessDia>
</view>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import getViewPort from '@/utils/getViewPort.js';
import { getImgUrl, formatPrice, toAgreeLook } from '@/utils/auth.js';
import paySuccessDia from '../component/paySuccessDia.vue';
import swiperListCom from '../component/swiperListCom.vue';
import selCardList from '../component/selCardList.vue';
import openRedPackList from '../component/openRedPackList.vue';
import { mapGetters, mapActions } from "vuex";
import { getLists, buy, orderPay } from "@/api/modules/packet.js";
import prerogativeList from '../component/prerogativeList.vue';
export default {
    mixins: [MescrollMixin], // 使用mixin
    components: {
        paySuccessDia,
        swiperListCom,
        openRedPackList,
        prerogativeList,
        selCardList
    },
    data() {
        return {
            imgUrl: getImgUrl(),
            cardImgUrl:`${getImgUrl()}static/card/`,
            default_avatar: `${getImgUrl()}/static/images/default_avatar_grey.png`,
            isShowNavBerColor: false,
            isPaySuccessShow: false,
            upOption: {
                textNoMore: '',
                empty: {
                use: false
                }
            },
            downOption: {
            },
            over_time: 0,
            have_day: 0,
            vipLists: [],
            isSelectVipIndex: 1,
            paymentParams: null,
            payConfig: null,
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
            let url = 'cardVip_bg2.png';
            return `${this.cardImgUrl}${url}`
        },
        selVipObj(){
            return this.vipLists[this.isSelectVipIndex];
        }
    },
    // 页面周期函数--监听页面加载
    async onLoad(option) {
        if(option.goods_id) {
            this.over_time = option.over_time;
            this.have_day = option.have_day;
        }
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
        onPageScroll(event) {
            const scrollTop = Math.ceil(event.scrollTop);
            // console.log('scrollTop :>> ', scrollTop);
            if(scrollTop >= this.navHeight) {
                this.isShowNavBerColor = true;
                return;
            }
            this.isShowNavBerColor = false;
        },
        selectVipHandle(index) {
            this.isSelectVipIndex = index;
            this.paymentParams = null;
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
            const { day, start_time, over_time} = this.paymentParams;
            this.payConfig = {
                day,
                start_time,
                over_time
            }
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
                    console.log('支付成功', res);
                    this.getUserInfo();
                    this.isPaySuccessShow = true;
                },
				fail: (err) => {
                    console.log('支付失败', err);
                }
            });
        },
        confirmHandle() {
            this.isPaySuccessShow = false;
            this.$topCallBack();
        }
    }
}
</script>

<style lang="scss">
.card{
    position: relative;
    z-index: 0;
    box-sizing: border-box;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    background: linear-gradient(180deg,#ffffff, #f5f6fa 21%);
    .nav_bg {
        width: 100%;
        position: absolute;
        z-index: -1;
        margin-top: calc(0px - var(--margin));
    }
}
.card_top{
    position: relative;
    z-index: 0;
    font-size: 0;
    padding: 32rpx 28rpx 32rpx;
    .bg_img1{
        position: absolute;
        width: 750rpx;
        height: 36rpx;
        z-index: -1;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
    }
}
.red_item-box {
    display: flex;
    flex-wrap: nowrap;
    .red_item {
        width: 194rpx;
        flex: 0 0 194rpx;
        height: 166rpx;
        position: relative;
        z-index: 0;
        text-align: center;
        &:not(:last-child) {
            margin-right: 24rpx;
        }
    }
    .red_item-price {
        font-size: 44rpx;
        font-weight: 500;
        color: #fe423d;
        line-height: 60rpx;
        margin: 38rpx auto 0;
    }
    .red_item-time{
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 13rpx;
        font-size: 28rpx;
        color: #ffffff;
        line-height: 32rpx;
        text-shadow: 2rpx 2rpx 4rpx 0rpx rgba(89,4,0,0.26);
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
    .nick_name {
        color: #B75A30;
    }
    .nick_lab{
        font-size: 24rpx;
        font-weight: 400;
        color: #666;
        line-height: 34rpx;
    }
}
.card_cont{
    padding: 52rpx 24rpx 0;
    background: linear-gradient(180deg,#ffffff, #f5f6fa 21%);
    border-radius: 40rpx;
}
.pay_btn{
    width: 702rpx;
    height: 104rpx;
    position: relative;
    margin-top: 36rpx;
    z-index: 0;
    font-weight: 500;
    text-align: center;
    color: #fff;
    background: linear-gradient(135deg,#ff6300, #fe423d);
    font-size: 32rpx;
    font-weight: 500;
    border-radius: 200rpx;
    line-height: 104rpx;
    .pay_lab-img{
        position: absolute;
        width: 278rpx;
        height: 50rpx;
        top: -14rpx;
        right: 0;
    }
}
.pay_lab{
    font-size: 26rpx;
    color: #333;
    line-height: 36rpx;
    margin-top: 20rpx;
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
.card_icon {
  width: 28rpx;
  height: 26rpx;
  margin-right: 4rpx;
}
</style>