<template>
<van-popup
    :show="isShow"
    position="bottom"
    custom-style="background-color: transparent;overflow:visible;"
    :z-index="100"
    :catchtouchmove="true"
    @close="popupClose"
>
    <view class="dia_cont ani_bottom_active">
        <image class="close_icon" mode="scaleToFill"
            src="https://file.y1b.cn/store/1-0/23118/654b29f0188a0.png"
            @click="popupClose"
        ></image>
        <view class="cont_title">你有 {{ totalNum }} 笔订单返现待领取</view>
        <view class="cont_box" @click="drawHandle">
            <view class="cont_price">{{ totalProfit }}</view>
        </view>
    </view>
</van-popup>
</template>

<script>
import { setDrawShowDiaStorage } from "@/utils/auth.js";
import { mapGetters } from "vuex";
export default {
    computed: {
        ...mapGetters(["profitInfo"]),
    },
    props: {
        isShow: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            totalNum: 0,
            totalProfit: 0,
        }
    },
    watch: {
        isShow(newValue) {
            if(!newValue) return;
            this.totalNum = this.profitInfo.total_num;
            this.totalProfit = this.profitInfo.total_profit;
        }
    },
    methods: {
        popupClose() {
            setDrawShowDiaStorage();
            this.$emit('close');
        },
        async drawHandle() {
            setDrawShowDiaStorage();
            this.$emit('getDraw');
            setTimeout(() => this.$go('/pages/userCard/withdraw/index'), 300);
        },
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
    width: 72rpx;
    height: 72rpx;
    display: block;
    margin: 0 32rpx 0 auto;
    z-index: 1;
}
.cont_title {
    font-size: 40rpx;
    text-align: center;
    color: #fff8de;
    line-height: 56rpx;
    margin: 40rpx auto 36rpx;
}
.cont_box{
    width: 750rpx;
    height: 784rpx;
    position: relative;
    z-index: 0;
    overflow: hidden;
    &::before {
        content: '\3000';
        background: url("https://file.y1b.cn/store/1-0/231222/6584f290a61db.png") 0 0 / 100% 100%;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }
    .cont_price {
        font-size: 100rpx;
        text-align: center;
        color: #ff003b;
        line-height: 140rpx;
        margin-top: 112rpx;
        &::after {
            content: '元';
            font-size: 32rpx;
            color: #333;
        }
    }
    .go_open{
        width: 600rpx;
        height: 120rpx;
        position: absolute;
        bottom: calc(60rpx + constant(safe-area-inset-bottom));
        bottom: calc(60rpx + env(safe-area-inset-bottom));
        left: 50%;
        transform: translateX(-50%);
        opacity: 0;
    }
}
</style>
