<template>
<view class="red_box">
    <view class="lab_title">无门槛红包<text style="color: #FE423D;margin-left: 10rpx;">5元×{{selVipObj.num}}张</text>
    </view>
    <view class="red_cont-box">
        <scroll-view class="red_list" scroll-x="true">
            <view class="red_item">
                <image
                    class="red_item-img"
                    src="https://file.y1b.cn/store/1-0/23113/6544a7bfd0c08.png"
                    mode="aspectFill"
                    v-for="(item, index) in selVipObj.num"
                    :key="item.coupon_id"
                ></image>
            </view>
        </scroll-view>
        <swiperListCom></swiperListCom>
    </view>
</view>
</template>

<script>
import swiperListCom from './swiperListCom.vue';
import { getImgUrl } from '@/utils/auth.js';
export default {
    components: {
        swiperListCom,
    },
    props: {
        selVipObj: {
            type: Object,
            default: {},
        },
    },
    data() {
        return {
            imgUrl: getImgUrl(),
            cardImgUrl:`${getImgUrl()}static/card/`,
        };
    },
    methods: {
    },
};
</script>

<style scoped lang="scss">
.lab_title{
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    line-height: 44rpx;
    margin-bottom: 24rpx;
}
.red_box{
    position: relative;
    overflow: hidden;
    z-index: 1;
    margin-top: 54rpx;
    .lab_title{
        font-size: 28rpx;
        padding: 0 24rpx;
    }
}
.red_list{
    .red_item {
        height: 136rpx;
        display: flex;
        flex-wrap: nowrap;
    }
    .red_item-img {
        width: 160rpx;
        height: 136rpx;
        flex: 0 0 160rpx;
        margin-right: 16rpx;
        &:first-child {
            margin-left: 24rpx;
        }
        &:not(:last-child) {
            margin-right: 24rpx;
        }
    }
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