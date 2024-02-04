<template>
<scroll-view class="red_list" scroll-x="true">
    <view class="red_item-box">
        <view class="red_item" v-for="(item, index) in packNum" :key="index">
            <image class="bg_img" mode="aspectFill"
                :src="cardImgUrl + 'red_num-bg.png'"></image>
            <view class="red_item-price">5</view>
            <view class="red_item-time">{{validityDayTxt}}</view>
        </view>
    </view>
</scroll-view>
</template>

<script>
import { getImgUrl } from '@/utils/auth.js';
export default {
    props: {
        packNum: {
            type: Number,
            default: 0,
        },
        selVipIndex: {
            type: Number,
            default: 0
        }
    },
    computed: {
        validityDayTxt() {
            let validDay = 31;
            switch(this.selVipIndex) {
                case 0:
                    validDay = 31;
                    break;
                case 1:
                    validDay = 93;
                    break;
                case 2:
                    validDay = 366;
                    break;
            }
            return `${validDay}天内有效`
        }
    },
    data() {
        return {
            imgUrl: getImgUrl(),
            cardImgUrl:`${getImgUrl()}static/card/`,
        };
    },
    methods: {},
};
</script>
<style scoped lang="scss">
.red_item-box{
    display: flex;
    flex-wrap: nowrap;
}
.red_item {
    width: 160rpx;
    height: 136rpx;
    flex: 0 0 160rpx;
    position: relative;
    z-index: 0;
    text-align: center;
    margin-right: 24rpx;
    &:first-child {
        margin-left: 24rpx;
    }
    &:not(:last-child) {
        margin-right: 24rpx;
    }
}
.red_item-price {
    font-size: 40rpx;
    font-weight: 500;
    color: #fe423d;
    line-height: 60rpx;
    margin: 30rpx auto 0;
    &::before {
        content: '￥';
        font-size: 24rpx;
    }
}
.red_item-time{
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 6rpx;
    font-size: 22rpx;
    color: #ffffff;
    line-height: 32rpx;
    text-shadow: 2rpx 2rpx 4rpx 0rpx rgba(89,4,0,0.26);
}
.red_cont-box{
    position: relative;
    padding: 24rpx 0;
    z-index: 0;
    &::before {
        content: '\3000';
        background: url("https://file.y1b.cn/store/1-0/231129/6566f8ba2151c.png") 0 0 / 100% 100%;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }
}
</style>
