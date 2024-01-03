<template>
<view class="on_valid">
<mescroll-uni
    :fixed="false"
    ref="mescrollRef"
    @init="mescrollInit"
    @down="downCallback"
    @up="upCallback"
    :up="upOption"
>
    <view class="valid_day"
        v-for="(item, index) in oldPacketList"
        :key="index"
    >
        <view class="noValid_title">{{item.date}}</view>
        <view class="red_item-box">
            <view class="red_item"
                v-for="(packItem, idx) in item.packetList"
                :key="idx"
            >
                <image class="bg_img" :src="cardImgUrl + 'red_toUse.png'" mode="aspectFill" v-if="packItem.status == 0"></image>
                <image class="bg_img" :src="cardImgUrl + 'red_toUse1.png'" mode="aspectFill" v-if="packItem.status == 1"></image>
                <image class="bg_img" :src="cardImgUrl + 'red_toUse3.png'" mode="aspectFill" v-if="packItem.status == 3"></image>
                <view class="red_item-price">
                    <text style="font-size: 24rpx;">￥</text>
                    {{ packItem.money }}
                </view>
            </view>
        </view>
    </view>
</mescroll-uni>
</view>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import getViewPort from '@/utils/getViewPort.js';
import { getImgUrl } from '@/utils/auth.js';
import { mapGetters, mapActions, mapMutations } from "vuex";
import { oldPacket } from "@/api/modules/packet.js";
export default {
    mixins: [MescrollMixin], // 使用mixin
    components: {
    },
    data() {
        return {
            imgUrl: getImgUrl(),
            cardImgUrl:`${getImgUrl()}static/card/`,
			tabIndex: 0, // 当前菜单下标
            downOption: {
            },
            upOption: {
				auto: false,
            },
            oldPacketList: []
        }
    },
    computed: {
        ...mapGetters([]),
    },
    // 页面周期函数--监听页面加载
    async onLoad(option) {
    },
    methods: {
        async upCallback(page) {
            let params = {
                size: 10,
                page: page.num,
            }
            oldPacket(params).then((res) => {
                if(res.code != 1) return;
                const { list , total_count } = res.data;
                if(page.num == 1) this.oldPacketList = []; //如果是第一页需手动制空列表
                this.oldPacketList = this.oldPacketList.concat(list); //追加新数据
                this.mescroll.endBySize(list.length, total_count);
            }).catch((err) => {
				this.mescroll.endErr();
            });
        },
    }
}
</script>

<style lang="scss">
page {
    background: #F5F6FA;
}
.on_valid{
    height: 100vh;
    background: #ffffff;
    border-radius: 32rpx;
    padding: 32rpx 0;
}
.noValid_title{
    font-size: 30rpx;
    font-weight: 600;
    color: #333333;
    line-height: 42rpx;
    padding: 0 32rpx;
    margin-bottom: 32rpx;
}
.valid_day{
    &:not(:last-child) {
        margin-bottom: 48rpx;
    }
}
.red_item-box {
    display: flex;
    flex-wrap: wrap;
    padding: 0 52rpx;
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
</style>