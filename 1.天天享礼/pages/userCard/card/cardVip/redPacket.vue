<template>
<view class="red_packet">
    <view class="red_packet-box">
        <view class="red_packet-title">
            可用 {{ packetCount }} 张
            <text class="title_lab">有效期至{{overTime}}(剩余{{haveDay}}天)</text>
        </view>
        <view class="red_cont">
            <view class="red_item-box">
                <view class="red_item"
                    v-for="(item, index) in packetList"
                    :key="index"
                >
                    <image class="bg_img" :src="cardImgUrl + 'red_num-bg.png'" mode="aspectFill" v-if="item.status == 0"></image>
                    <image class="bg_img" :src="cardImgUrl + 'red_toUse1.png'" mode="aspectFill" v-if="item.status == 1"></image>
                    <view class="red_item-price">
                        <text style="font-size: 24rpx;">￥</text>
                        {{ item.money }}
                    </view>
                    <view class="red_item-day" v-if="item.status == 0">
                        {{ item.word }}
                    </view>
                </view>
            </view>
            <block v-if="oldPacketList.length">
                <view class="noValid_title fl_bet">
                    <view>无效红包</view>
                    <view class="noValid_lab" @click="goNoValidRedPacketHandle">
                        查看<van-icon custom-style="margin-left: 5rpx" color="#aaa" size="28rpx" name="arrow"/>
                    </view>
                </view>
                <view class="red_item-box">
                    <view class="red_item"
                        v-for="(item, index) in oldPacketList"
                        :key="index"
                    >
                        <image class="bg_img" :src="cardImgUrl + 'red_toUse.png'" mode="aspectFill" v-if="item.status == 0"></image>
                        <image class="bg_img" :src="cardImgUrl + 'red_toUse1.png'" mode="aspectFill" v-if="item.status == 1"></image>
                        <image class="bg_img" :src="cardImgUrl + 'red_toUse3.png'" mode="aspectFill" v-if="item.status == 3"></image>
                        <view class="red_item-price">
                            <text style="font-size: 24rpx;">￥</text>
                            {{ item.money }}
                        </view>
                    </view>
                </view>
            </block>
        </view>
    </view>
    <view class="red_remind" v-if="nextArr.count">
        <view class="red_remind-txt">待生效会员卡×{{ nextArr.count }}张</view>
        <view class="red_remind-txt">待发放红包
            <text style="color: #FE423D;">{{ nextArr.packet_num }}</text>
            张，随会员卡生效周期发放
        </view>
        <view class="red_remind-txt">
            会员红包将在
            <text style="color: #FE423D;">{{ nextArr.over_time }}</text>
            日后发放
        </view>
    </view>
</view>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import getViewPort from '@/utils/getViewPort.js';
import { getImgUrl } from '@/utils/auth.js';
import { mapGetters, mapActions, mapMutations } from "vuex";
import { nowSavings } from "@/api/modules/packet.js";
export default {
    mixins: [MescrollMixin], // 使用mixin
    components: {
    },
    data() {
        return {
            imgUrl: getImgUrl(),
            cardImgUrl:`${getImgUrl()}static/card/`,
			tabIndex: 0, // 当前菜单下标
            packetCount: 0,
            overTime: 0,
            haveDay: 0,
            packetList: [],
            oldPacketList: [],
            nextArr: []
        }
    },
    computed: {
        ...mapGetters([]),
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
        this.initNowSavings();
    },
    methods: {
        async initNowSavings(){
            const res = await nowSavings();
            if(res.code != 1 || !res.data) return;
            const { packetCount, over_time, have_day, packetList, old_packetList, nextArr } = res.data;
            this.packetCount = packetCount;
            this.overTime = over_time;
            this.haveDay = have_day;
            this.packetList = packetList;
            this.oldPacketList = old_packetList;
            this.nextArr =nextArr;
        },
        async upCallback(page) {
			this.mescroll.endSuccess(0);
        },
        goNoValidRedPacketHandle(){
            this.$go('/pages/userCard/card/cardVip/noValidRedPacket');
        },
    }
}
</script>

<style lang="scss">
page {
    background: #F5F6FA;
}
.red_packet{
    height: 100vh;
    background: #ffffff;
    border-radius: 32rpx;
    padding: 24rpx 28rpx;
}
.red_packet-box {
    background: #fceab3;
    border-radius: 32rpx;
    .red_packet-title {
        font-size: 32rpx;
        font-weight: 600;
        color: #333333;
        line-height: 44rpx;
        padding: 24rpx;
    }
}
.title_lab {
    font-size: 26rpx;
    font-weight: 400;
    color: #666;
    line-height: 36rpx;
    margin-left: 16rpx;
}
.red_cont{
    border-radius: 24rpx;
    background: #FBF9F3;
    padding: 24rpx 24rpx 0;
}
.red_item-box {
    display: flex;
    flex-wrap: wrap;
    .red_item {
        width: 194rpx;
        flex: 0 0 194rpx;
        height: 166rpx;
        position: relative;
        z-index: 0;
        text-align: center;
        margin-bottom: 24rpx;
        &:not(:nth-child(3n)) {
            margin-right: 32rpx;
        }
    }
    .red_item-price {
        font-size: 44rpx;
        font-weight: 500;
        color: #fe423d;
        line-height: 60rpx;
        margin: 38rpx auto 0;
    }
    .red_item-day {
        position: absolute;
        width: 100%;
        left: 50%;
        transform: translateX(-50%);
        bottom: 13rpx;
        font-size: 28rpx;
        text-align: center;
        color: #fff;
        line-height: 32rpx;
        text-shadow: 2rpx 2rpx 4rpx 0rpx rgba(89,4,0,0.26);
    }
    .red_item-time{
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 13rpx;
        font-size: 28rpx;
        color: #ffffff;
        line-height: 32rpx;
        text-shadow: 2rpx 2rpx 4rpx 0rpx rgba(89,4,0,0.26);
    }
}
.noValid_title{
    font-size: 30rpx;
    font-weight: 500;
    color: #333;
    line-height: 42rpx;
    margin-bottom: 32rpx;
    .noValid_lab{
        font-size: 26rpx;
        font-weight: 400;
        color: #999;
        line-height: 36rpx;
    }
}
.red_remind{
    margin-top: 24rpx;
    background: #f5f6fa;
    border-radius: 24rpx;
    padding: 24rpx;
    .red_remind-txt{
        font-size: 28rpx;
        color: #333333;
        line-height: 40rpx;
        &:not(:last-child) {
            margin-bottom: 16rpx;
        }
    }
}
</style>