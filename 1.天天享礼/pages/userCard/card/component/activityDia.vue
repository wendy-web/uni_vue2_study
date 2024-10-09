<template>
<van-popup
    :show="isShow"
    round
    :z-index="100"
    custom-style="background-color: transparent;overflow:visible;"
    :safe-area-inset-bottom="false"
    :catchtouchmove="true"
    @close="onClose"
    overlay-style="background: rgba(0, 0, 0, 0.8);"
>
    <view class="cont_box">
        <view class="cont_title" @click="onClose">领取成功</view>
        <image src="https://file.y1b.cn/store/1-0/24823/66c82e9c47e46.png" mode="heightFix" class="dia_img" @click="$leftBack"></image>
        <view class="btn_box" @click="$leftBack">立即体验</view>
    </view>
</van-popup>
</template>
<script>
    export default {
        props: {
          isShow: {
            type: Boolean,
            default: false
          }
        },
        data() {
            return {
            }
        },
        methods: {
            onClose() {
                this.$emit("close");
            }
        }
    }
</script>
<style scoped lang="scss">
.cont_box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 622rpx;
    border-radius: 40rpx;
    text-align: center;
    position: relative;
    z-index: 0;
    background: #fff;
    &::before{
        content: '\3000';
        background: url("https://file.y1b.cn/store/1-0/24823/66c82f87da4a3.png") 0 0 / 100% 100%;
        position: absolute;
        width: 662rpx;
        height: 190rpx;
        top: -54rpx;
        left: 50%;
        transform: translateX(-50%);
    }
    .cont_title {
        font-size: 36rpx;
        text-align: center;
        color: #333;
        line-height: 50rpx;
        font-weight: bold;
        margin: 48rpx 0;
    }
    .dia_img {
        width: 510rpx;
        height: 236rpx;
        margin: 0 52rpx;
    }
}
.btn_box {
    margin-bottom: 40rpx;
    height: 88rpx;
    line-height: 88rpx;
    border-radius: 32rpx;
    font-size: 28rpx;
    text-align: center;
    color: #FFF;
    background: #FE423D;
    margin: 0 32rpx 32rpx;
    align-self: stretch;
}
</style>
