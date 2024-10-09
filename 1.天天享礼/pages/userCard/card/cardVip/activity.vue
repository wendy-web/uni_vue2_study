<template>
<view class="detail">
    <xh-navbar
        :leftImage="imgUrl+'/static/images/left_back.png'"
        @leftCallBack="$leftBack"
        :fixed="true"
        titleColor="#333"
        :navberColor="isShowNavBerColor ? '#F8F0C4': ''"
    ></xh-navbar>
    <image src="https://file.y1b.cn/store/1-0/24823/66c821e7dfc08.png" :style="{'--margin': navHeight + 'px' }" mode="widthFix" class="nav_bg"></image>
    <view class="detail_title">
        每天限量领<text class="detail_title-num">{{ config.num }}</text>张
    </view>
    <image src="https://file.y1b.cn/store/1-0/24824/66c97dccb9536.png" mode="widthFix" style="width: 100%;height: 350rpx;"></image>
    <view class="detail_cont">
        <view class="detail_cont-title fl_center">会员立享 单单返现金</view>
        <view class="detail_list">
            <view class="list_item box_fl">
                <image src="https://file.y1b.cn/store/1-0/24823/66c8297339acc.png" mode="widthFix" class="item_img"></image>
                <view class="item_right fl_col_sp_ar">
                    <view class="item_right-title">京东商品</view>
                    <view class="item_right-lab">下单最高再返40%</view>
                </view>
            </view>
            <view class="list_item box_fl">
                <image src="https://file.y1b.cn/store/1-0/24823/66c82a0f46b8a.png" mode="widthFix" class="item_img"></image>
                <view class="item_right fl_col_sp_ar">
                    <view class="item_right-title">拼多多商品</view>
                    <view class="item_right-lab">下单最高再返35%</view>
                </view>
            </view>
            <view class="list_item box_fl">
                <image src="https://file.y1b.cn/store/1-0/24823/66c82a2133193.png" mode="widthFix" class="item_img"></image>
                <view class="item_right fl_col_sp_ar">
                    <view class="item_right-title">其他商品</view>
                    <view class="item_right-lab">下单最高再返35%</view>
                </view>
            </view>
        </view>
    </view>
    <view :class="['detail_btn', isActive ? 'active' : '']" @click="getBtnHandle">
        {{ btnText }}
        <view class="gesture_box" v-if="isActive">
            <image src="https://file.y1b.cn/store/1-0/24124/65b0b0bca7769.png"
            mode="widthFix" class="gesture_icon"></image>
        </view>
    </view>
    <activityDia :isShow="isShowDia" @close="isShowDia = false"></activityDia>
</view>
</template>
<script>
import { userPosition } from "@/api/modules/index.js";
import { getActive, getSavings } from "@/api/modules/packet.js";
import { getImgUrl } from '@/utils/auth.js';
import getViewPort from '@/utils/getViewPort.js';
import activityDia from '../component/activityDia.vue';
export default {
    components: {
        activityDia
    },
    data() {
        return {
            imgUrl: getImgUrl(),
            isShowDia: false,
            activeId: 0,
            config: null,
            isBtnClick: true,
            plocid: 0,
            mlocid: 0
        }
    },
    computed: {
        navHeight() {
            let viewPort = getViewPort();
            return viewPort.navHeight;
        },
        isActive() {
            if(!this.config) return;
            const { is_vip, active_status } = this.config;
            return (active_status == 1);
        },
        btnText() {
            if(!this.config) return;
            const { is_vip, active_status, start_date } = this.config;
            // if(is_vip) return '您已经是会员了';
            // 活动状态-1：已结束；0：未开始；1：进行中；2：被抢光了
            if(active_status == 0) return `${start_date}开抢`
            return ['已结束', '活动未开始', '立即0元领取', '已抢完'][active_status + 1] || '立即0元领取'
        }
    },
    onShareAppMessage() {
        const { share_title, share_img } = this.config;
        const share = {
            title: share_title,
            imageUrl: share_img,
            path: `/pages/userCard/card/cardVip/activity?activeId=${this.activeId}&plocid=${this.plocid}&mlocid=${this.mlocid}`
        };
        return share;
    },
    // 页面周期函数--监听页面加载
    async onLoad(option) {
        if(option.activeId) {
            this.activeId = option.activeId;
            const res = await getActive({ activeId : option.activeId})
            if(!res.code) return this.$toast(res.msg);
            this.config = res.data
        }
        if(option.plocid || option.mlocid){
            this.plocid =  option.plocid;
            this.mlocid = option.mlocid;
            userPosition({ mlocid: this.mlocid, plocid: this.plocid});
        }
    },
    methods: {
        async getBtnHandle() {
            if(!this.isBtnClick || !this.isActive) return;
            if(this.config.is_vip) return this.$toast('您已经是会员啦');
            this.isBtnClick = false;
            const res = await getSavings({ activeId: this.activeId });
            if(res.code != 1) return this.$toast(res.msg);
            this.isBtnClick = true;
            this.isShowDia = true
        }
    }
}
</script>
<style scoped lang="scss">
.detail{
    position: relative;
    z-index: 0;
    color: #333;
    box-sizing: border-box;
    background:#fff;
    .nav_bg {
        width: 100%;
        position: absolute;
        z-index: -1;
        margin-top: calc(0px - var(--margin));
    }
}
.detail_title{
    font-size: 40rpx;
    font-weight: bold;
    text-align: center;
    line-height: 56rpx;
    &-num {
        color: #F84842;
        position: relative;
        padding: 0 10rpx;
    }
}
.detail_cont {
    padding: 0 40rpx;
    margin-top: -10rpx;
    &-title {
        font-size: 36rpx;
        text-align: center;
        color: #333;
        line-height: 50rpx;
        font-weight: bold;
        &::before,&::after {
            content: '\3000';
            background: url("https://file.y1b.cn/store/1-0/24823/66c8256c005f9.png") 0 0 / 100% 100%;
            display: block;
            width: 56rpx;
            height: 20rpx;
            margin: 0 16rpx;
        }
        &::after {
            transform: rotate(180deg);
        }
    }
}
.detail_list {
    margin-top: 46rpx;
    .list_item {
        margin-bottom: 64rpx;
    }
    .item_img {
        width: 112rpx;
        height: 112rpx;
        margin-right: 32rpx;
    }
    .item_right {
        flex: 1;
        align-self: stretch;
        &-title {
            font-size: 32rpx;
            font-weight: bold;
        }
        &-lab {
            color: #666;
            font-size: 28rpx;
        }
    }
}
.detail_btn {
    line-height: 88rpx;
    border-radius: 200rpx;
    font-size: 36rpx;
    font-weight: bold;
    text-align: center;
    position: relative;
    margin: 138rpx 40rpx 0;
    color: #999;
    background: #E5E5EA;
    &.active {
        color: #fff;
        background: linear-gradient(135deg,#fe423d, #ff6300);
    }
}
.gesture_box{
    position: absolute;
    z-index: 0;
    right: 0;
    bottom: -40rpx;
    width: 102rpx;
    height: 100rpx;
    &::before {
        content: "\3000";
        position: absolute;
        z-index: -1;
        width: 40rpx;
        height: 40rpx;
        top: 0;
        left: 0;
        border-radius: 50%;
        opacity: 0;
        animation: rippleAnimation 1s linear infinite;
        box-shadow: 0 0 8px rgba(255, 255, 255, 1) inset;
    }
    &::after {
        content: "\3000";
        position: absolute;
        z-index: -1;
        width: 30rpx;
        height: 30rpx;
        top: 5rpx;
        left: 5rpx;
        border-radius: 50%;
        opacity: 0;
        animation: rippleCenterAnimation 1s linear infinite;
        box-shadow: 0 0 8px rgba(255, 255, 255, 1) inset;
    }
    .gesture_icon {
        width: 58rpx;
        height: 66rpx;
        position: relative;
        transform: translate(5rpx, 16rpx);
        animation: gestureAnimation1 1s linear infinite;
    }
}
@keyframes gestureAnimation1 {
	0% {
        transform: translate(40rpx, 30rpx);
	}
	30% {
        transform: translate(5rpx, 16rpx);
	}
    80% {
        transform: translate(5rpx, 16rpx);
	}
	100% {
        transform: translate(40rpx, 30rpx);
	}
}
</style>
