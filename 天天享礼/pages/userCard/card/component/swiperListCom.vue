<template>
<swiper
    class="swiper_box"
    :autoplay="true"
    interval="3000"
    :duration="300"
    :circular="true"
    :vertical="true"
    :disable-touch="false"
    v-if="swiperList.length"
>
    <swiper-item
        v-for="(item, index) in swiperList"
        :key="index"
        catchtouchmove="onTouchMove"
    >
        <view class="red_lab box_fl">
            <image :src="item.avatar_url" mode="scaleToFill" class="red_av"></image>
            <view class="txt_ov_ell1"> {{ item.nick_name }} {{ word }} </view>
        </view>
    </swiper-item>
</swiper>
</template>
<script>
import { savingsSwiper } from "@/api/modules/packet.js";
export default {
    data() {
        return {
            swiperList: [],
            word: ''
        };
    },
    mounted() {
        this.initSwiper();
    },
    methods: {
        async initSwiper() {
            const res = await savingsSwiper();
            if(res.code != 1 || !res.data) return;
            this.word = res.data.word;
            this.swiperList = res.data.list;
        },
    },
};
</script>

<style scoped lang="scss">
.swiper_box{
    height: 36rpx;
    margin: 25rpx 0 0;
    font-size: 0;
    padding: 0 24rpx;
}
.red_lab {
    font-size: 26rpx;
    color: #999;
    .red_av {
        width: 32rpx;
        height: 32rpx;
        border-radius: 50%;
        margin-right: 8rpx;
    }
}
</style>