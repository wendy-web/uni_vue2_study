<template>
<view class="red_box">
    <view class="lab_title">无门槛红包<text style="color: #FE423D;margin-left: 10rpx;">5元×{{selVipObj.num}}张</text>
    </view>
    <view class="red_cont-box">
        <redPackList :packNum="selVipObj.num" :selVipIndex="selVipIndex"></redPackList>
        <swiperListCom></swiperListCom>
    </view>
</view>
</template>

<script>
import swiperListCom from '@/components/cardOpen/swiperListCom.vue';
import { getImgUrl } from '@/utils/auth.js';
import redPackList from './redPackList.vue';
export default {
    components: {
        swiperListCom,
        redPackList
    },
    props: {
        selVipObj: {
            type: Object,
            default: {},
        },
        selVipIndex: {
            type: Number,
            default: 0
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
.lab_title{
    font-weight: 600;
    color: #333;
    line-height: 44rpx;
    margin-bottom: 24rpx;
    font-size: 28rpx;
    padding: 0 24rpx;
}
.red_box{
    position: relative;
    overflow: hidden;
    z-index: 1;
    margin-top: 54rpx;
}
.red_item-box{
    display: flex;
    flex-wrap: nowrap;
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
