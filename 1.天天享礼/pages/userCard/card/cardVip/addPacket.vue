<template>
<view class="add_packet">
    <view class="add_card">
        <image class="bg_img" :src="cardImgUrl + 'add_packet.png'" mode="scaleToFill"></image>
        <view>可用加量包</view>
        <view class="add_num">
            <text style="font-size: 48rpx;margin-right: 10rpx;">2</text>个
        </view>
        <view class="add_card-lab">请在会员有效期(剩余29天)内购买和使用</view>
    </view>
    <view class="add_box">
        <view class="item_list fl_bet">
            <view class="item_list-left box_fl">
                <view class="red_item">
                    <image class="bg_img" :src="cardImgUrl + 'red_num-bg.png'" mode="scaleToFill"></image>
                    <view class="red_item-price">
                        <text style="font-size: 20rpx;">￥</text>
                        55
                    </view>
                    <view class="red_item-time">5张</view>
                </view>
                <view class="fl_col_sp_bt">
                    <view>5元加量包</view>
                    <view class="box_fl">
                        <view class="item_price" v-html="formatPrice(55, 1)"></view>
                        <text class="item_lab">¥5.0</text>
                    </view>
                </view>
            </view>
            <view class="item_list-right">购买</view>
        </view>
    </view>
</view>
</template>
<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { formatPrice, getImgUrl } from '@/utils/auth.js';
import getViewPort from '@/utils/getViewPort.js';
import { mapGetters } from "vuex";
export default {
    mixins: [MescrollMixin], // 使用mixin
    components: {
    },
    data() {
        return {
            imgUrl: getImgUrl(),
            cardImgUrl:`${getImgUrl()}static/card/`,
			tabIndex: 0, // 当前菜单下标
        }
    },
    computed: {
        ...mapGetters([
            "isCar"
        ]),
        navHeight() {
            let viewPort = getViewPort();
            return viewPort.navHeight;
        },
        mescrollHeight() {
            let viewPort = getViewPort();
            let mescrollHeight =  viewPort.windowHeight - uni.upx2px(84);
            return mescrollHeight + 'px';
        },
    },
    // 页面周期函数--监听页面加载
    async onLoad(option) {
    },
    methods: {
        formatPrice,
        async upCallback(page) {
			this.mescroll.endSuccess(0);
        },
        copyHandle(str) {
            uni.setClipboardData({
                data: str,
                success: () => this.$toast('复制成功')
            })
        },
        goNoValidRedPacketHandle(){
            this.$go('/pages/userCard/card/cardVip/noValidRedPacket');
        }
    }
}
</script>
<style lang="scss">
page {
    background: #F5F6FA;
}
.add_packet {
    padding: 0 24rpx;
}
.add_card {
    position: relative;
    z-index: 0;
    padding: 32rpx 32rpx 28rpx;
    box-sizing: border-box;
    margin-top: 28rpx;
    overflow: hidden;
    font-size: 32rpx;
    color: #fff;
    line-height: 44rpx;
    .add_num{
        margin: 16rpx 0 24rpx;
    }
    .add_card-lab {
        font-size: 26rpx;
        text-align: left;
        line-height: 36rpx;
        padding-top: 23rpx;
        border-top: 2rpx solid rgba(255,255,255,0.60);
    }
}
.add_box {
    background: #fff;
    border-radius: 24rpx;
    margin-top: 24rpx;
    padding: 0 32rpx;
}
.item_list{
    padding: 32rpx 0;
    font-size: 28rpx;
    color: #333;
    &:not(:last-child) {
        border-bottom: 1rpx solid #e9e9e9;
    }
    .item_price{
        font-size: 26rpx;
        font-weight: 400;
        color: #FE423D;
        font-weight: 500;
    }
    .item_lab {
        font-size: 26rpx;
        text-decoration:  line-through;
        color: #aaa;
    }
    .item_list-right{
        width: 108rpx;
        height: 56rpx;
        line-height: 56rpx;
        color: #fff;
        text-align: center;
        background: linear-gradient(170deg,#ff6300 0%, #fe423d 92%);
        border-radius: 8rpx;
    }
}
.red_item {
    flex: 0 0 140rpx;
    width: 140rpx;
    height: 120rpx;
    margin-right: 25rpx;
    position: relative;
    z-index: 0;
    text-align: center;
    &:not(:last-child) {
        margin-right: 24rpx;
    }
}
.red_item-price {
    font-size: 34rpx;
    font-weight: 500;
    color: #fe423d;
    margin: 28rpx auto 0;
}
.red_item-time{
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 4rpx;
    font-size: 26rpx;
    color: #ffffff;
    line-height: 32rpx;
    text-shadow: 2rpx 2rpx 4rpx 0rpx rgba(89,4,0,0.26);
}
</style>
