<template>
<view :class="['an-notice-box', (isShow && isShowSticky) ? 'active' : '']">
    <view class="an_notice_cont box_fl">
        <van-image class="user-icon" height="52rpx" width="52rpx" :src="config.avatar_url" radius="50%"
            use-loading-slot>
            <van-loading slot="loading" type="spinner" size="20" vertical />
        </van-image>
        <view class="nk-name txt_ov_ell1">
            <text>{{config.nick_name}}</text>
            <text class="nk-tips">{{word}}</text>
        </view>
    </view>
</view>
</template>
<script>
import { exchangeNotice } from '@/api/modules/shopMall.js'
export default {
    props: {
        switchTime: {
            type: Number,
            default: 5000
        }
    },
    data() {
        return {
            isShow: '',
            list: [],
            word: '刚兑换',
            timer: null,
            currentIndex: 0,
            isShowSticky: false,
            config: null,
            listTimer: null
        };
    },
    watch: {
        list: {
            async handler(newVal, oldValue) {
                if(!newVal.length && this.config) {
                    const res = await exchangeNotice();
                    let list = res.data ? res.data : [];
                    this.list = list;
                }
            },
            immediate: true
        },
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
        more() {
            this.isShow = false;
            this.$emit('more');
        },
        close() {
            this.isShowSticky = false;
        },
        clearNoticeTime() {
            this.close();
            this.list = [];
            this.timer = null;
            this.config = null;
            clearTimeout(this.listTimer);
        },
        popupShow() {
            if(!this.list.length) return;
            this.config = this.list.splice(0, 1)[0];
        },
        init() {
            this.isShowSticky = true;
            (!this.list.length)&& this.updateNotice();
        },
        async updateNotice() {
            const res = await exchangeNotice();
            let list = res.data ? res.data : [];
            this.list = list;
            this.word = res.msg;
            this.popupShow();
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
    },
}
</script>
<style lang="scss">
.an-notice-box {
    width: 308rpx;
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
    .an_notice_cont{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }

    .user-icon {
        width: 52rpx;
        height: 52rpx;
        margin-right: 15rpx;
    }
    .nk-name {
        font-size: 22rpx;
    }

    .nk-tips {
        margin-left: 8rpx;
    }
}
</style>
