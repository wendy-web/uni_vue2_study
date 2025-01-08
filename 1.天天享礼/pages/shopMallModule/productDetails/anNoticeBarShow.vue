<template>
<view :class="['an-notice-box', isShow ? 'active' : '']">
    <view class="an_notice_cont box_fl">
        <van-image class="user-icon" height="52rpx" width="52rpx" :src="config.avatar_url" radius="50%"
            use-loading-slot><van-loading slot="loading" type="spinner" size="20" vertical />
        </van-image>
        <view class="nk-name txt_ov_ell1">
            <text>{{config.nick_name}}</text>
            <text class="nk-tips">刚刚购买了该商品</text>
        </view>
    </view>
</view>
</template>
<script>
export default {
    props: {
    },
    data() {
        return {
            myIndex: 0,
            config: null,
            isShow: false,
            list: [],
            listTimer: null,
            switchTime: 2000
        };
    },
    watch: {
        config(newVal) {
            clearTimeout(this.listTimer);
            if(newVal) {
                this.isShow = true;
                this.listTimer = setTimeout(() => {
                    this.isShow = false;
                    setTimeout(() => {
                        this.config = null;
                        this.timerFun();
                    }, 1000);
                }, this.switchTime);
                return
            }
            this.isShow = false;
        }
    },
    methods: {
        init(list) {
            this.list = list;
            this.popupShow();
        },
        popupShow() {
            if(!this.list.length) return;
            this.config = this.list.splice(0, 1)[0];
        },
        timerFun() {
            this.timer = null;
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.popupShow();
            }, 5000);
        },
    },
    beforeDestroy() {
        this.timer = null;
        clearTimeout(this.timer);
    }
}
</script>
<style lang="scss">
.an-notice-box {
    width: 350rpx;
    height: 52rpx;
    overflow: hidden;
    border-radius: 36px;
    position: relative;
    z-index: 0;
    color: #fff;
    opacity: 0;
    transition: all 1s;
    &.active {
        opacity: 1;
    }
    &::before {
        content: '\3000';
        position: absolute;
        width: 100%;
        height: 52rpx;
        background: rgba(0,0,0,0.55);
    }
    .user-icon {
        width: 52rpx;
        height: 52rpx;
        margin-right: 15rpx;
        opacity: 0.6;
    }
    .nk-name {
        font-size: 22rpx;
    }

    .nk-tips {
        margin-left: 8rpx;
    }
}
.an_notice_cont {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}
</style>
