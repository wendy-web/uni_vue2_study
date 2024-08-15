<template>
<mescroll-body
  :sticky="true"
  ref="mescrollRef"
  @init="mescrollInit"
  @down="downCallback"
  @up="upCallback"
  :up="upOption"
  :down="downOption"
>
<xh-navbar
  :fixedNum="true"
  titleAlign="titleRight"
  :navberColor="isShowNavBerColor ? '#FAF1EC': ''"
  :leftImage="imgUrl+'/static/images/left_back.png'"
  @leftCallBack="$leftBack"
></xh-navbar>
<image src="https://file.y1b.cn/store/1-0/231213/65791e113aa09.png" :style="{'--margin': navHeight + 'px' }" mode="widthFix" class="nav_bg"></image>
    <view class="draw_cont">
        <view class="draw_top">
            <view class="draw_title" @click.stop="ishShowHelpDia = true">我的零钱（元）</view>
            <view class="draw_price">
                <!-- {{ showExpandNum }} -->
                <p-countup
                    :num="parseFloat(profitInfo.packet_amount).toFixed(2)"
                    width="21" height='36' dotWidth="10"
                    color="#333"
                    fontSize="36"
                    fontWeight="600"
                    :isSetTimeAutoNum="1000"
                ></p-countup>
            </view>
            <view class="draw_items fl_bet">
                <view class="draw_item withdraw_box" @click="goToWithdraw">
                    <view class="draw_item_lab add_icon">可提现</view>
                    <view class="draw_item_price">
                        ¥{{parseFloat(profitInfo.balance).toFixed(2)}}
                        <van-icon name="arrow" color="#fff" size="28rpx" />
                    </view>
                </view>
                <view class="draw_item">
                    <view class="draw_item_lab">累计返</view>
                    <view class="draw_item_price">
                        ¥{{parseFloat(profitInfo.total_amount).toFixed(2)}}
                    </view>
                </view>
            </view>
            <view class="draw_lab">* 订单已完成且无退换货，可提现到微信零钱</view>
        </view>
        <view class="record_box" v-if="goods.length">
            <view class="record_title">返现记录</view>
            <view v-for="(item, index) in goods" :key="index"
                @click="profitGetItemHandle(item, index)"
                :class="['record_item fl_bet', recordClass(item, index) && 'active']"
            >
                <view class="record_left">
                    <view class="record_txt">{{ item.title }}</view>
                    <view class="record_lab">{{ item.create_time }}</view>
                </view>
                <view class="record_right">
                    <!-- 待领取 -->
                    <view class="record_txt-wait" v-if="item.profit_status == 0">
                        ¥{{ parseFloat(item.profit).toFixed(2) }}待领<van-icon name="arrow" color="#f85a55" size="28rpx" style="margin-left: 8rpx;" />
                    </view>
                    <view class="record_txt" v-else-if="item.profit_status == 1">
                        +¥{{ parseFloat(item.profit).toFixed(2) }}
                    </view>
                    <view class="record_txt" v-else-if="item.profit_status == 2">
                        -¥{{ parseFloat(item.profit).toFixed(2) }}
                    </view>
                    <view class="record_txt" v-else-if="item.profit_status == 3" style="color: #aaa;">
                        ¥{{ parseFloat(item.profit).toFixed(2) }}已失效
                    </view>
                    <view class="record_lab" v-if="item.note && item.profit_status != 1">{{ item.note }}</view>
                </view>
            </view>
        </view>
    </view>
    <helpConfirmDia
        :isShow="ishShowHelpDia"
        @close="ishShowHelpDia = false"
    ></helpConfirmDia>
</mescroll-body>
</template>

<script>
import { msgTemplate, profitGet, profitList, profitMes } from '@/api/modules/user.js';
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { getImgUrl } from '@/utils/auth.js';
import getViewPort from '@/utils/getViewPort.js';
import { mapActions, mapGetters, mapMutations } from "vuex";
import pCountup from './countUp.vue';
import helpConfirmDia from './helpConfirmDia.vue';

export default {
    mixins: [MescrollMixin], // 使用mixin
    components: {
        helpConfirmDia,
        pCountup
    },
    data() {
        return {
            imgUrl: getImgUrl(),
            isShowNavBerColor: false,
            downOption: {
                auto: false,
                use: false,
                bgColor: "#ffffff",
            },
            upOption: {
                auto: true, // 不自动加载
                use: true,
                noMoreSize: 99999,
            },
            goods: [],
            ishShowHelpDia: false,
            showExpandNum: 0,
            profitId: 0
        }
    },
    computed: {
        ...mapGetters(["profitInfo", "isAutoLogin"]),
        navHeight() {
            let viewPort = getViewPort();
            return viewPort.navHeight;
        }
    },
    watch: {
        'profitInfo.packet_amount': {
            handler:async function (newValue, oldValue) {
                // this.gradualAnimation(newValue);
            },
            deep: true
        }
    },
    // 页面周期函数--监听页面加载
    async onLoad(option) {
        this.profitInfoRequest();
        this.showExpandNum = this.profitInfo.packet_amount;
        if(option.profitId) this.profitId = option.profitId;
    },
    async onShow() { },
    methods: {
        ...mapMutations({
            setAutoLogin: 'user/setAutoLogin',
            setProfitInfo: 'user/setProfitInfo'
        }),
        ...mapActions({
            getUserInfo: "user/getUserInfo",
            profitInfoRequest: 'user/profitInfoRequest'
        }),
        recordClass(item, index) {
            return (item.profit_status == 0) && (index < this.goods.length - 1) && (this.goods[index+1].profit_status != 0)
        },
        autoHandle() {
            this.setProfitInfo({
                ...this.profitInfo,
                packet_amount: this.profitInfo.packet_amount + 0.02
            });
        },
        gradualAnimation(targetValue, duration = 10) {
            let currentValue = this.showExpandNum;
            const totalSteps = targetValue;
            let step = (targetValue - this.showExpandNum) / duration;
            // let intervalDuration = duration / totalSteps * 10;
            let intervalDuration =  100;
            // if(step < 1) intervalDuration = 10;
            const interval = setInterval(() => {
                currentValue = Number(currentValue) + Number(step);
                this.showExpandNum = parseFloat(currentValue).toFixed(2);
                if (currentValue >= targetValue) {
                    this.showExpandNum = parseFloat(targetValue).toFixed(2);
                    clearInterval(interval);
                }
            }, intervalDuration);
        },
        async profitGetItemHandle(item, index) {
            const { id, profit_status } = item;
            if(profit_status) return;
            const res = await msgTemplate();
            if(res.code != 1) return this.profitGetRequest(id, index);
            const { Rewards } = res.data;
            const tmplIds = [Rewards];
            this.$subscribeMessageHandle(tmplIds).then(res => {
                const resultState = res[Rewards];
                const params = { isRewards: 0 };
                if (resultState == "accept") params.isRewards = 1;
                profitMes(params);
                this.profitGetRequest(id, index);
            });
        },
        profitGetRequest(id, index = -1) {
            profitGet({ id, type: 0 }).then(res => {
                if(res.code != 1) return this.$toast(res.msg, 6000);
                this.profitInfoRequest();
                if(index >= 0) return this.goods[index].profit_status = 1;
                this.mescroll.resetUpScroll();
            });
        },
        goToWithdraw() {
            if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
            this.$go('/pages/userCard/withdraw/withdraw');
        },
        async upCallback(page) {
            if(page.num == 1) {
                const res = await profitList({ type: 1 });
                const { list, total_count } = res.data;
                this.goods = [];
                this.goods = this.goods.concat(list); // 追加新数据
            }
            let params = {
                size: 10,
                page: page.num,
            }
            const res = await profitList(params).catch((err) => this.mescroll.endErr());
            if(res.code != 1) return this.mescroll.endSuccess(0);
            const { list, total_count } = res.data;
            // if(page.num == 1) this.goods = [];
            this.goods = this.goods.concat(list); // 追加新数据
            this.mescroll.endBySize(list.length, total_count);
            // 从订单列表中过来
            if(!this.profitId) return;
            setTimeout(() => {
                const goodIndex = this.goods.findIndex((item) => item.id == this.profitId);
                this.profitGetRequest(this.profitId, goodIndex);
                this.profitId = null;
            }, 1000);
        },
        onPageScroll(event) {
            const scrollTop = Math.ceil(event.scrollTop);
            if(scrollTop >= this.navHeight) {
                this.isShowNavBerColor = true;
                return;
            }
            this.isShowNavBerColor = false;
        },
    }
}
</script>

<style lang="scss">
page {
    background: #f7f7f7;
}
.withdraw{
    position: relative;
    z-index: 0;
    color: #333;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
}
.nav_bg {
    width: 100%;
    position: absolute;
    z-index: -1;
    margin-top: calc(0px - var(--margin));
}
.nav-custom {
	flex: 1;
    .custom_left{
        font-weight: 600;
        color: #333;
        &::before {
            content: '\3000';
            background: url("https://file.y1b.cn/public/img/ttxl/static/images/left_back.png") 0 0 / cover;
            width: 40rpx;
            height: 40rpx;
            margin-right: 10rpx;
            display: block;
        }
    }
}

.draw_cont{
    padding: 20rpx;
}
.draw_top {
    position: relative;
    z-index: 0;
    overflow: hidden;
    &::before {
        content: '\3000';
        background: url("https://file.y1b.cn/store/1-0/231213/657923385742f.png") 0 0 / 100% 100%;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
    }
    .draw_title {
        font-size: 26rpx;
        color: #555;
        margin: 44rpx 52rpx 0;
        line-height: 1;
        &::after {
            content: '\3000';
            background: url("https://file.y1b.cn/store/1-0/231215/657bf8174653e.png") 0 0 / 100% 100%;
            width: 30rpx;
            height: 30rpx;
            display: inline-block;
        }
    }
    .draw_price {
        margin: 10rpx 52rpx 0;
        font-size: 72rpx;
        display: flex;
    }
    .draw_items{
        background: #fafafa;
        border-radius: 20rpx;
        margin: 22rpx 34rpx 0;
        padding: 24rpx 0;
        .draw_item{
            width: 50%;
            text-align: center;
            position: relative;
            &.withdraw_box {
                .draw_item_lab {
display: flex;
                    justify-content: center;
                    align-items: center;
                    &::before {
                        content: '\3000';
                        background: url("https://file.y1b.cn/store/1-0/2463/665d338d09823.png") 0 0 / 100% 100%;
                        width: 26rpx;
                        height: 26rpx;
                        display: inline-block;
                        margin-right: 4rpx;
                    }
                }
                .draw_item_price {
                    display: inline-block;
                    background: url("https://file.y1b.cn/store/1-0/2463/665d56a7c55c8.png") 0 0 / 100% 100%;
                    color: #fff;
                    padding: 4rpx 12rpx;
                    margin-top: 4rpx;
                }
            }
            .draw_item_lab {
                font-size: 26rpx;
                color: #999;
            }
            .draw_item_price {
                font-size: 30rpx;
                margin-top: 8rpx;
                font-weight: 600;
            }
            &:not(:last-child)::before {
                content: "";
                position: absolute;
                width: 2rpx;
                height: 56rpx;
                background-color: #E1E1E1;
                top: 50%;
                right: 0;
                transform: translateY(-50%);
            }
        }
    }
    .draw_lab {
        font-size: 24rpx;
        color: #666;
        margin: 20rpx 34rpx 32rpx;
    }
}
.record_box{
    background: #fff;
    border-radius: 24rpx;
    padding: 0 24rpx;
    margin-top: 16rpx;
    margin-bottom: calc(20rpx + constant(safe-area-inset-bottom));
    margin-bottom: calc(20rpx + env(safe-area-inset-bottom));
    .record_title {
        font-size: 32rpx;
        color: #333;
        padding-top: 32rpx;
        font-weight: 600;
        margin-bottom: 8rpx;
    }
    .active {
        border-bottom: 2rpx solid #E9E9E9;
    }
    .record_item {
        // margin-top: 25rpx;
        padding: 24rpx 0;
        .record_txt-wait{
            height: 40rpx;
            // background: #f84842;
            border-radius: 20rpx;
            line-height: 40rpx;
            padding: 0 12rpx;
            font-size: 28rpx;
            color: #F85A55;
            display: inline-block;
            font-weight: 600;
            border: 1rpx solid #f85a55;
        }
        .record_txt{
            font-size: 28rpx;
            font-weight: 600;
        }
        .record_lab{
            font-size: 24rpx;
            color: #aaa;
            margin-top: 4rpx;
        }
        .record_right{
            text-align: right;
        }
    }
}
</style>
