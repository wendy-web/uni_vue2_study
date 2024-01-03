<template>
<view class="detail">
    <view class="detail_top">
        <view class="detail_title fl_bet" v-if="false">
            <view class="detail_title-left">
                <image :src="cardImgUrl + 'detail_icon.png'" mode="scaleToFill" class="detail_icon"></image>
                会员加量包(5元×2张)
            </view>
            <view class="detail_title-right">已过期</view>
        </view>
        <view
            :class="['detail_title fl_bet', (detailObj.is_effect == 1) ? 'active' : '']">
            <image :src="cardImgUrl + 'valid_bg.png'" mode="scaleToFill" class="valid_bg" v-if="detailObj.is_effect == 1"></image>
            <view class="detail_title-left">
                <image :src="cardImgUrl + 'card_icon.png'" mode="scaleToFill" class="card_icon"></image>
                {{detailObj.title}}
            </view>
            <view class="detail_title-right">{{detailObj.status_desc}}</view>
        </view>
        <view class="item_lab fl_bet">
            <view style="color: #999;">原价</view>
            <view>¥{{ detailObj.old_price }}</view>
        </view>
        <view class="item_lab fl_bet" v-if="detailObj.pay_amount">
            <view style="color: #999;">支付金额</view>
            <view v-html="formatPrice(detailObj.pay_amount, 2)"></view>
        </view>
    </view>
    <view class="detail_cont">
        <view class="item_lab fl_bet">
            <view style="color: #999;">购买时间</view>
            <view>{{detailObj.pay_time}}</view>
        </view>
        <view class="item_lab fl_bet">
            <view style="color: #999;">有效期</view>
            <view>{{detailObj.date}}</view>
        </view>
        <view class="item_lab fl_bet">
            <view style="color: #999;">订单编号</view>
            <view @click="copyHandle(detailObj.trade_no)">{{detailObj.trade_no}}</view>
        </view>
    </view>
</view>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { getImgUrl, formatPrice } from '@/utils/auth.js';
import { mapGetters, mapActions, mapMutations } from "vuex";
import { detailSavings } from "@/api/modules/packet.js";
export default {
    mixins: [MescrollMixin], // 使用mixin
    data() {
        return {
            imgUrl: getImgUrl(),
            cardImgUrl:`${getImgUrl()}static/card/`,
            detailObj: null
        }
    },
    computed: {
        ...mapGetters([]),
    },
    // 页面周期函数--监听页面加载
    async onLoad(option) {
        if(option.id) {
            this.init(option.id);
        }
    },
    methods: {
        formatPrice,
        async init(id) {
            const res = await detailSavings({id});
            if(res.code != 1) return;
            this.detailObj = res.data;
        },
        copyHandle(str) {
            uni.setClipboardData({
                data: str,
                success: () => this.$toast('复制成功')
            })
        }
    }
}
</script>
<style lang="scss">
.detail {
    box-shadow: 0rpx -4rpx 10rpx 0rpx rgba(0,0,0,0.06);;
    .detail_top{
        padding: 15rpx 32rpx 0;
        margin-top: 5rpx;
        border-bottom: 16rpx solid #f5f6fa;
        .detail_title {
            font-size: 32rpx;
            font-weight: 500;
            color: #333;
            line-height: 44rpx;
            padding: 32rpx 0;
            border-bottom: 1rpx dashed #e1e1e1;
            &.active{
                position: relative;
                z-index: 0;
                border-bottom:0;
                .detail_title-right{
                    color: #FE423D;
                    font-weight: 600;
                }
                .valid_bg{
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 750rpx;
                    height: 116rpx;
                    z-index: -1;
                }
            }
        }
        .detail_icon{
            width: 34rpx;
            height: 26rpx;
            margin-right: 10rpx;
        }
        .card_icon{
            width: 24rpx;
            height: 22rpx;
            margin-right: 10rpx;
        }
        .detail_title-right{
            font-size: 28rpx;
            color: #999;
        }
    }
    .item_lab{
        padding: 24rpx 0;
        font-size: 26rpx;
        color: #333;
        line-height: 36rpx;
        &:not(:last-child) {
            border-bottom: 1rpx solid #e1e1e1;
        }
    }
    .detail_cont{
        padding: 0 32rpx;
    }
}
</style>