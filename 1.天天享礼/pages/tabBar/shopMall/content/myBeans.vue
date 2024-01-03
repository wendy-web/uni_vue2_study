<template>
<view class="my_beans" v-if="(isShowCowpeaNav && !userInfo.is_vip) || !isShowCowpeaNav">
    <view
        class="my-beans ani_head"
        :class="isShowCowpeaNav ? 'ani_head-in' : 'ani_head-out'"
        v-if="isShowCowpeaNav && !userInfo.is_vip"
    >
        <p-countup
            :num="userInfo.credits"
            width="11"
            height="18"
            color="#FE9B22"
            fontSize="18"
            fontWeight="600"
        ></p-countup>
    </view>
    <image
        :class="['bg-loveRecord ani_head',
        !isShowCowpeaNav ? 'ani_head-in' : 'ani_head-out']"
        :src="imgUrl + 'static/shopMall/nav_icon.png'"
        mode="aspectFill" v-if="!isShowCowpeaNav"
      ></image>
</view>

</template>
<script>
import pCountup from "@/components/p-countUp/countUp.vue";
import { mapGetters } from "vuex";
import { getImgUrl } from "@/utils/auth.js";
export default {
    props: {
        isShowCowpeaNav: {
            type: Boolean,
            default: false
        }
    },
    components: {
        pCountup,
    },
    computed: {
        ...mapGetters(["userInfo"])
    },
    data() {
        return {
            imgUrl: getImgUrl(),
        };
    },
    methods: {
        animationfinishHandle(event) {
            this.$emit('animaFinish', event.detail.current);
        },
    }
}
</script>
<style lang="scss" scope>
.my_beans{
    margin-right: 20rpx;
}
.my-beans {
    display: flex;
    align-items: center;
    transition: opacity 0.5s;
    min-width: 198rpx;
    box-sizing: border-box;
    padding-left: 20rpx;
    padding-right: 32rpx;
    height: 64rpx;
    font-size: 36rpx;
    font-weight: 600;
    text-align: center;
    color: #fe9b22;
    background: rgba(255, 255, 255, 0.5);
    border: 2rpx solid rgba(255, 255, 255, 0.35);
    border-radius: 34rpx;
    position: relative;
    z-index: 0;
    &::after {
        content: "";
        position: absolute;
        width: 100%;
        height: 8rpx;
        background: linear-gradient(180deg, #f9e8d8, #ea8b2e);
        border-radius: 50%;
        filter: blur(4rpx);
        bottom: -8rpx;
        left: 50%;
        transform: translateX(-50%);
        z-index: -1;
    }
    &::before {
        content: "\3000";
        background: url("https://file.y1b.cn/public/img/ttxl/static/shopMall/beans-icon.png") center / contain no-repeat;
		display: inline-block;
        width: 66rpx;
        height: 62rpx;
        margin-top: 5rpx;
    }
}
.bg-loveRecord {
  width: 198rpx;
  height: 40rpx;
}
</style>
