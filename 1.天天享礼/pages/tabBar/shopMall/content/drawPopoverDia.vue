<template>
<van-popup
    :show="isShow"
    custom-style="background-color: transparent;overflow:visible;"
    :z-index="100"
    :catchtouchmove="true"
    @close="popupClose"
>
    <view class="dia_cont ani_active">
        <image class="close_icon" mode="scaleToFill"
            src="https://test-file.y1b.cn/store/1-0/24314/65f2ac09a0204.png"
            @click="popupClose"></image>
        <van-image width="262rpx" height="304rpx" class="dia_image"
            :src="config.image" fit="widthFix" use-loading-slot
        ><van-loading slot="loading" type="spinner" size="20" vertical />
        </van-image>
        <view class="cont_title">{{ config.name }}</view>
        <view class="cont_btn" @click="drawHandle"></view>
    </view>
</van-popup>
</template>
<script>
export default {
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        config: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
        }
    },
    methods: {
        popupClose() {
            this.$emit('close');
        },
        async drawHandle() {
            this.$emit('getDraw', this.config);
        },
    },
};
</script>
<style lang="scss">
.dia_cont{
    position: relative;
    width: 750rpx;
    height: 764rpx;
    z-index: 0;
    padding-top: 208rpx;
    box-sizing: border-box;
    &::before {
        content: '\3000';
        background: url("https://test-file.y1b.cn/store/1-0/24314/65f2abcd99a51.png") 0 0 / 100% 100%;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }
}
.close_icon {
    width: 48rpx;
    height: 48rpx;
    position: absolute;
    top: -88rpx;
    right: 48rpx;
}
.dia_image{
    width: 262rpx;
    height: 304rpx;
    display: block;
    margin: 0 auto;
}
.cont_title {
    text-align: center;
    margin: 34rpx auto 0;
    font-size: 32rpx;
    color: #fffbec;
    font-weight: bold;
}
.cont_btn{
    width: 382rpx;
    height: 122rpx;
    position: relative;
    z-index: 0;
    margin: 48rpx auto 0;
    &::before {
        content: '\3000';
        background: url("https://test-file.y1b.cn/store/1-0/24314/65f2ae30ca09b.png") 0 0 / 100% 100%;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }
}
</style>
