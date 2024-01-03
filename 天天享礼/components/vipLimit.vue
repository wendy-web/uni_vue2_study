<template>
<view class="dia_box">
<van-popup
    :show="isShow"
    position="bottom"
    custom-style="background-color: transparent;overflow:visible;"
    :z-index="100"
    :catchtouchmove="true"
>
    <view class="dia_cont">
        <image
            class="close_icon"
            src="https://file.y1b.cn/store/1-0/23118/654b29f0188a0.png"
            mode="scaleToFill"
            @click="popupClose"
        ></image>
        <view class="cont_title fl_center">
            <text>限时立减¥14.1</text>
            <van-count-down
                @finish="countFinished"
                :time="remainTime"
                millisecond
                use-slot
                format="mm:ss"
                @change="onChangeHandle"
                class="cd_time-con"
            >
                <text class="item">{{ timeData.minutes }}:</text>
                <text class="item">{{ timeData.seconds }}:</text>
                <text class="item">{{ timeData.milliseconds }}</text>
            </van-count-down>
        </view>
        <view :class="['cont_box', isHW ? 'active' : '']">
            <view class="go_open" @click="openVipHandle">立即开通</view>
        </view>
    </view>
</van-popup>
</view>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {getImgUrl} from '@/utils/auth.js';
import { getLists, buy, orderPay } from "@/api/modules/packet.js";
export default {
    computed: {
        ...mapGetters(["gift", "userInfo"]),
    },
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        isHW: {
            type: Boolean,
            default: false
        },
        config: {
            type: Object,
            default: {}
        },
    },
    data() {
        return {
            imgUrl: getImgUrl(),
            timeData: {},
            isFinShed: false,
            cardImgUrl:`${getImgUrl()}static/card/`,
            remainTime: 60*1000,
            paymentParams: null
        };
    },
    watch: {
        isShow(newValue, oldValue) {
            if(!newValue) return;
            this.resetTime();
        }
    },
    methods: {
        ...mapActions({
            getUserInfo: 'user/getUserInfo',
        }),
        resetTime() {
            // 时间重置
            const countDown = this.selectComponent('.cd_time-con');
            countDown && countDown.reset();
            this.isFinShed = true;
        },
        onChangeHandle(event) {
            let {
                hours,
                minutes,
                seconds,
                milliseconds,
                days
            } = event.detail;
            hours = hours < 10 ? '0' + hours : hours
            minutes = minutes < 10 ? '0' + minutes : minutes
            seconds = seconds < 10 ? '0' + seconds : seconds
            milliseconds = Math.floor(milliseconds/10);
            milliseconds = milliseconds < 10 ? '0' + milliseconds : milliseconds;
            this.timeData = {
                hours,
                minutes,
                seconds,
                milliseconds,
                days
            }
        },
        countFinished() {
            this.popupClose();
        },
        popupClose() {
            this.$emit('close');
        },
        async openVipHandle() {
            const res = await buy({
                goods_id: 2,
                reduce: 1
            });
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
                    this.$toast('开通成功');
                    this.getUserInfo();
                    this.popupClose();
                },
				fail: (err) => {
                    console.log('支付失败', err);
                    // this.$toast('开通失败');
                    // this.popupClose();
                }
            });
        }
    },
};
</script>
<style lang="scss">
.dia_cont{
    position: absolute;
    bottom: 0;
    overflow: hidden;
}
.close_icon {
    position: absolute;
    width: 60rpx;
    height: 60rpx;
    right: 40rpx;
    top: 0;
    z-index: 1;
}
.cont_title{
    width: 396rpx;
    height: 74rpx;
    font-size: 28rpx;
    font-weight: 600;
    color: #fff8ec;
    line-height: 74rpx;
    position: relative;
    z-index: 0;
    margin: 83rpx auto 8rpx;
    &::before {
        content: '\3000';
        background: url("https://file.y1b.cn/public/img/ttxl/static/card/limit_timer.png") 0 0 / 100% 100%;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
    }
}
.cd_time-con{
    margin-left: 32rpx;
    min-width: 125rpx;
}
.item {
    font-size: 28rpx;
    color: #fff8ec;
    line-height: 40rpx;
}
.cont_box{
    width: 750rpx;
    height: 842rpx;
    position: relative;
    z-index: 0;
    &::before {
        content: '\3000';
        background: url("https://file.y1b.cn/store/1-0/231030/653f721f627ba.png") 0 0 / 100% 100%;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
    }
    &.active::before {
        background-image: url("https://file.y1b.cn/store/1-0/23121/65695188d5466.png");
    }
    .go_open{
        width: 668rpx;
        box-sizing: border-box;
        height: 92rpx;
        background: #ffc654;
        border-radius: 70rpx;
        font-size: 32rpx;
        font-weight: 600;
        text-align: center;
        color: #333333;
        line-height: 92rpx;
        position: absolute;
        bottom: calc(32rpx + constant(safe-area-inset-bottom));
        bottom: calc(32rpx + env(safe-area-inset-bottom));
        left: 50%;
        transform: translateX(-50%);
    }
}
</style>
