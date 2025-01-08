<template>
<view :class="['pre_box', isSpread ? 'active' : '']">
    <view :class="['pre_title', (titleStyle == 'center') ? 'center_active' : '']">省钱卡特权</view>
    <!-- <image mode="scaleToFill" class="pre_img01" src="https://file.y1b.cn/store/1-0/231129/656702611abb2.png"></image> -->
    <image mode="scaleToFill" class="pre_img02" src="https://file.y1b.cn/store/1-0/231129/656702f041a80.png"></image>
    <view class="spread_imgs">
        <image mode="scaleToFill" class="pre_img03" src="https://file.y1b.cn/store/1-0/24513/6641c8524263b.png"></image>
    </view>
    <view class="pre_icon" @click="spreadHandle">
        {{ isSpread ? '收起' : '展开'}}
        <van-icon custom-style="margin-left: 5rpx" color="#666" size="28rpx" name="arrow-down" class="arrow_close" />
    </view>
</view>
</template>
<script>
export default {
    props: {
        titleStyle: {
            type: String,
            default: '',
        },
        isSpread: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            isSelSpread: true
        };
    },
    methods: {
        spreadHandle() {
            this.$emit('spread');
        }
    },
};
</script>
<style scoped lang="scss">
.pre_box {
    .spread_imgs {
        height: 0rpx;
        transition: all .3s;
        overflow: hidden;
    }
    .arrow_close{
        transform: rotate(0deg);
        transition: all .3s;
    }
    &.active {
        .spread_imgs {
            height: 358rpx;
        }
        .arrow_close{
            transform: rotate(180deg);
        }
    }
}
.pre_icon{
    font-size: 26rpx;
    text-align: center;
    color: #666;
    line-height: 36rpx;
    margin-top: 23rpx;
    margin-bottom: 23rpx;
}
.pre_title{
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    line-height: 44rpx;
    margin-top: 64rpx;
    margin-bottom: 24rpx;
    &.center_active{
        text-align: center;
        font-size: 28rpx;
        color: #68360a;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 54rpx;
        &::before {
            content: '\3000';
            background: url("https://file.y1b.cn/store/1-0/23112/65433d09c004c.png") 0 0 / cover;
            width: 136rpx;
            height: 8rpx;
            margin: 0 16rpx;
            transform: rotate(180deg);
        }
        &::after {
            content: '\3000';
            background: url("https://file.y1b.cn/store/1-0/23112/65433d09c004c.png") 0 0 / cover;
            width: 136rpx;
            height: 8rpx;
            margin: 0 16rpx;
        }
    }
}
.pre_img01{
    width: 702rpx;
    height: 270rpx;
    display: block;
    margin: 0 auto;
}
.pre_img02{
    width: 702rpx;
    height: 410rpx;
    display: block;
    margin: 32rpx auto 0;
}
.pre_img03 {
    width: 702rpx;
    height: 356rpx;
    display: block;
    margin: 22rpx auto 0;
}
</style>
