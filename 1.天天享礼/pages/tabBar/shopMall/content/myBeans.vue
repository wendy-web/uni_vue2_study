<template>
<view class="my_beans ani_head"
    :class="!isShowCowpeaNav ? 'ani_head-in' : 'ani_head-out'"
    v-if="!isShowCowpeaNav"
>
    <view class="my-beans" @click="goToTask">
        <text v-if="isShowCredits >= 1000000">1百万+</text>
        <p-countup v-else
            :num="isShowCredits" width="8" height="14"
            color="#804815" fontSize="14" fontWeight="600"
        ></p-countup>
        <image class="login_right" mode="widthFix"
            src="https://file.y1b.cn/store/1-0/24513/6641dbdf4f586.png"
        ></image>
    </view>
    <view class="bg-loveRecord ">
        <image class="login_bg" mode="widthFix" src="https://file.y1b.cn/store/1-0/24724/66a075cb245f1.png"></image>
    </view>
</view>

</template>
<script>
import pCountup from "@/components/p-countUp/countUp.vue";
import { mapGetters } from "vuex";
export default {
    props: {
        isShowCowpeaNav: {
            type: Boolean,
            default: false
        }
    },
    components: {
        pCountup,
    },
    computed: {
        ...mapGetters(["userInfo", "isAutoLogin"])
    },
    data() {
        return {
            isShowCredits: 0
        };
    },
    watch: {
        'userInfo.credits': {
            handler: function (newValue, oldValue) {
                this.isShowCredits = newValue;
            },
            deep: true,
            immediate: true
        },
    },
    methods: {
        goToTask() {
            if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
			this.$emit('goTask');
		},
        animationfinishHandle(event) {
            this.$emit('animaFinish', event.detail.current);
        },
    }
}
</script>
<style lang="scss" scope>
.my-beans {
    display: flex;
    align-items: center;
    transition: opacity 0.5s;
    box-sizing: border-box;
    padding-left: 72rpx;
    padding-right: 24rpx;
    height: 56rpx;
    font-size: 28rpx;
    font-weight: 600;
    text-align: center;
    color: #804815;
    // background: rgba(255, 255, 255, 0.5);
    // border: 2rpx solid rgba(255, 255, 255, 0.35);
    border-radius: 34rpx;
    position: relative;
    z-index: 0;
    &::before {
        content: "\3000";
        position: absolute;
        z-index: -1;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: url("https://file.y1b.cn/store/1-0/24513/6641d9c87906a.png") 0 0 / 100% 100% no-repeat;
    }
    .login_right {
        width: 10rpx;
        height: 18rpx;
        margin-left: 10rpx;
    }
}
.bg-loveRecord {
    position: absolute;
    width: 100vw;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: -1;
    .login_bg{
        width: 242rpx;
        height: 62rpx;
        display: block;
        margin: 0 auto;
    }
}
</style>
