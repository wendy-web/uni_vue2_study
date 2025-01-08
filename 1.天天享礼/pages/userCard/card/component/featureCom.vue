<template>
<view class="feature_list">
    <view class="feature_title fl_center">
        <image src="https://file.y1b.cn/store/1-0/23112/65433d09c004c.png" mode="scaleToFill" class="feature_icon" ></image>
        可用于以下大牌折扣
        <image src="https://file.y1b.cn/store/1-0/23112/65433d09c004c.png" mode="scaleToFill" class="feature_icon" ></image>
    </view>
    <image src="https://file.y1b.cn/store/1-0/23112/6543405bccd85.png" mode="scaleToFill" class="fea_cont" ></image>
    <image src="https://file.y1b.cn/store/1-0/23113/6544a68cd539e.png" mode="scaleToFill" class="fea_icon" ></image>
</view>
</template>
<script>
export default {
    props: {
    },
    computed: {
    },
    data() {
        return { };
    },
    methods: {
    },
};
</script>

<style scoped lang="scss">
@import "@/static/css/mixin.scss";
.feature_list {
    margin-top: 54rpx;
    position: relative;
    .feature_title {
        font-size: 28rpx;
        font-weight: 600;
        color: #68360a;
        line-height: 40rpx;
        .feature_icon{
            width: 136rpx;
            height: 8rpx;
            margin: 0 16rpx;
            &:first-child {
                transform: rotate(180deg);
            }
        }
    }
    .fea_cont{
        width: 750rpx;
        height: 136rpx;
        margin-top: 32rpx;
    }
}
.fea_icon{
    width: 74rpx;
    height: 152rpx;
    position: absolute;
    z-index: 1;
    right: 22rpx;
    bottom: 15rpx;
}
</style>