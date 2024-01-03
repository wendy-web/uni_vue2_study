<template>
<view class="sel_list fl_bet">
    <view
        v-for="(item, index) in vipLists"
        :key="index"
        :class="['sel_item', isSelectVipIndex == index ? 'active' : '']"
        @click="selectVipHandle(index)"
    >
        <!-- 最多人的选择 -->
        <image src="https://file.y1b.cn/store/1-0/23113/6544b3ca2c471.png" mode="scaleToFill" class="bg_img" v-if="isSelectVipIndex == index"></image>
        <image src="https://file.y1b.cn/store/1-0/23113/6544b3f626857.png" mode="scaleToFill" class="bg_img" v-else></image>
        <image :src="cardImgUrl + 'sel_item-active.png'" mode="scaleToFill" class="sel_item-active" v-if="index== 1"></image>
        <view v-html="formatPrice(item.buy_price, 5)" class="item_price"></view>
        <view class="price_line">￥{{ item.line_price }}/月</view>
        <view class="price_value">{{item.market_price}}元红包</view>
    </view>
</view>
</template>

<script>
import { getImgUrl, formatPrice } from '@/utils/auth.js';
export default {
    props: {
        vipLists: {
            type: Array,
            default: [],
        },
        isSelectVipIndex: {
            type: Number,
            default: 1
        },
    },
    data() {
        return {
            mgUrl: getImgUrl(),
            cardImgUrl:`${getImgUrl()}static/card/`,
        };
    },
    methods: {
        formatPrice,
        selectVipHandle(index) {
            this.$emit("selClick", index);
        },
    },
};
</script>

<style scoped lang="scss">
.sel_item{
    position: relative;
    z-index: 0;
    width: 222rpx;
    height: 266rpx;
    font-size: 28rpx;
    text-align: center;
    color: #333;
    .item_price {
        margin-top: 58rpx;
    }
    .sel_item-active{
        width: 136rpx;
        height: 66rpx;
        position: absolute;
        left: 0;
        top: -10rpx;
    }
    &.active {
        .item_price {
            color: #F84842;
        }
        .price_value{
            color: #F84842;
            font-weight: 600;
        }
    }
    .item_time{
        margin: 54rpx auto 10rpx;
        font-weight: 600;
        line-height: 40rpx;
    }
    .price_line {
        font-size: 26rpx;
        text-decoration:  line-through;
        color: #A17B6A;
        line-height: 36rpx;
    }
    .price_value{
        position: absolute;
        bottom: 8rpx;
        width: 100%;
        text-align: center;
        left: 0;
        font-weight: 400;
    }
}
</style>