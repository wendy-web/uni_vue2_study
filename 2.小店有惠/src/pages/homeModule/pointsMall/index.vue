<template>
<mescroll-body
    id="mescrollBody"
    :sticky="true"
    ref="mescrollRef"
    @init="mescrollInit"
    @down="downCallback"
    :down="downOption"
    :up="upOption"
    @up="upCallback"
>
    <xh-navbar
        navbarImageMode="widthFix"
        :overFlow="true"
        :navbarColor="showTitleBg ? '#fff' : ''"
    >
        <view :class="['point_title', showTitleBg && 'active']" slot="title">
            <view class="point_left fl_center" @click="$leftBack">
                <image class="left_icon" :src="showTitleBg ? '../static/back_left.png' : '../static/white_left.png'" mode="heightFix"></image>
            </view>
            积分商城
        </view>
    </xh-navbar>
    <image :src="bgImg" :style="{'--margin': navHeight + 'px' }" mode="widthFix"
        class="nav_bg" @click="goToMyCreditHandle"></image>
    <view class="cont_list">
        <view class="code_cont fl_bet" :style="{top: navHeight +'px'}" @click="goToMyCreditHandle">
            <view class="box_fl">
                <image src="../static/code.png" :style="{'--margin': navHeight + 'px' }" mode="widthFix" class="code_icon"></image>
                我的积分
                <view class="code_value">{{ userInfo.credits }}</view>
            </view>
            <view class="code_btn">赚积分</view>
        </view>
        <good-list :list="tabGoodList"></good-list>
    </view>
</mescroll-body>
</template>
<script>
import { pointsMall } from '@/api/modules/jsShop.js';
import goodList from '@/components/goodList.vue';
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import getViewPort from '@/utils/getViewPort.js';
import listMixins from '@/utils/mixin/listMixins.js';
import { mapActions, mapGetters } from 'vuex';
export default {
    mixins: [MescrollMixin, listMixins], // 使用mixin
    components: {
        goodList
    },
    data() {
        return {
            showTitleBg: false,
            upOption: {
                page: {
                    num : 0 ,
                    size : 1,
                    time : null
                },
            },
            bgImg: '',
            is_rebate: 3
        };
    },
    computed:{
        ...mapGetters(['userInfo']),
        mescrollHeight(){
            let viewPort = getViewPort();
            let mescrollHeight =  viewPort.windowHeight - viewPort.navHeight;
            return mescrollHeight + 'px';
        },
        navHeight() {
            let viewPort = getViewPort();
            return viewPort.navHeight;
        },
    },
    watch: {
        tabGoodList(newValue, oldValue) {
            if((oldValue.length == newValue.length) || !newValue.length) return;
            if(newValue.length <= 6) {
                this.mescroll.triggerUpScroll();
            }
        },
    },
    onShareAppMessage(data) {
        let share = {
            title: '积分商城'
        }
        return share;
    },
    onLoad(option) {
        this.initPointMall();
    },
    methods: {
        ...mapActions({
            getUserInfo: 'user/getUserInfo',
        }),
        // 页面的滚动事件
        onPageScroll(e) {
            this.showTitleBg = Math.ceil(e.scrollTop) > 0;
        },
        async initPointMall() {
            const res = await pointsMall().catch(() => { });
            if(res.code != 1 || !res.data) return this.$toast(res.msg);
            let { bgImg } = res.data;
            (!this.bgImg) && (this.bgImg = bgImg);
        },
        goToMyCreditHandle() {
            this.$go('/pages/mineModule/myCredit/index');
        }
    }
};
</script>
<style lang="scss">
page {
    background: #f4f5f9;
}
.nav_bg {
    width: 100%;
    height: 310rpx;
    // z-index: 1;
    margin-top: calc(0px - var(--margin));
}
.point_title {
    flex: 1;
    color: #fff;
    height: 64rpx;
    font-weight: bold;
    position: relative;
    font-size: 36rpx;
    line-height: 64rpx;
    text-align: center;
    &.active {
        color: #333;
    }
    .point_left {
        position: absolute;
        left: 32rpx;
        top: 50%;
        transform: translateY(-50%);
        font-size: 0;
        .left_icon {
            width: 24rpx;
            height: 36rpx;
        }
    }
}
.code_cont {
    padding: 24rpx 22rpx 24rpx 14rpx;
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
	position: sticky;
	z-index: 99;
    background: #f4f5f9;
    .code_icon {
        width: 30rpx;
        height: 28rpx;
        margin-right: 4rpx;
    }
    .code_value {
        font-size: 44rpx;
        font-weight: bold;
        color: #ea3424;
        margin-left: 16rpx;
    }
    .code_btn {
        width: 158rpx;
        height: 64rpx;
        line-height: 64rpx;
        background: linear-gradient(152deg,#ffecd0, #f4c682 84%);
        border-radius: 24rpx;
        text-align: center;
        font-size: 26rpx;
        font-weight: bold;
        color: #503a1d;
    }
}
.cont_list {
    background: #f4f5f9;
    border-radius: 12rpx 12rpx 0 0;
    margin-top: -26rpx;
    position: relative;
    padding: 0 10rpx;
}
.list_lab {
    font-size: 26rpx;
    margin: 28rpx 0;
    color: #999;
    text-align: center;
}
</style>
