<template>
    <div class="page-box">
        <van-nav-bar
            v-if="!isMiniprogram"
            title=""
            left-text=""
            right-text=""
            :left-arrow="true"
            :fixed="false"
            :safe-area-inset-top="true"
            :placeholder="true"
            @click-left="onClickLeft"
        />
        <div class="content-box" :class="{ 'miniprogramTop': isMiniprogram }">
            <!-- 背景图 -->
            <img
                class="bg_page"
                src="@/assets/img/bill/2023/bg_page_6.png"
                alt=""
            />
            <!-- logo+音频icon -->
            <div class="logo-box">
                <img
                    class="logo_bfyl"
                    src="@/assets/img/bill/2023/logo_bfyl.png"
                    alt=""
                />
                <img
                    class="icon_audio"
                    :class="{ 'rotate-center': isPlay }"
                    :src="isPlay ? icon_audio_play : icon_audio_pause"
                    alt=""
                    @click="audioPlay"
                />
            </div>
            <!-- 第六页 忙碌的这一年 -->
            <img
                class="page_3_title ani"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="1.2s"
                src="@/assets/img/bill/2023/page_6_title.png"
                alt=""
            />
            <div
                class="ani title-1"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="2.2s"
            >
                累计采购订单
            </div>
            <div
                class="ani caigou-num"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="3.2s"
            >
                <span>{{ shopReport.buyOrderQty | formatAmount }}</span>
                <span class="caigou-unit">笔</span>
            </div>
            <!-- 支付金额 -->
            <div
                class="ani pay-box"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="4.2s"
            >
                <span>支付金额</span>
                <span class="pay-num">{{ shopReport.buyPayedAmt | formatAmount }}</span>
                <span>元</span>
                <!-- 如果使用了现金券 -->
                <template v-if="shopReport.buyPayedDiscAmt > 0">
                    <span class="use-coupon">（ 使用现金券</span>
                    <span class="coupon-num">{{ shopReport.buyPayedDiscAmt | formatAmount }}</span>
                    <span>元 ）</span>
                </template>
            </div>
            <!-- 累计采购商品 -->
            <div
                class="ani title-2"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="5.2s"
            >
                累计采购商品
            </div>

            <div
                class="ani buy-goods"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="6s"
            >
                <span>{{ shopReport.buyQty | formatAmount }}</span>
                <span class="buy-unit">箱</span>
            </div>
            <div
                class="ani buy-detail"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="6.5s"
            >
                <span>其中，</span>
                <template v-if="shopReport.buyNd1Qty>0">
                    <span>红牛 </span>
                    <span class="buy-detail-num">{{ shopReport.buyNd1Qty | formatAmount }}</span>
                    <span>箱</span>
                </template>

                <template v-if="shopReport.buyNd2Qty>0">
                    <span>，战马 </span>
                    <span class="buy-detail-num">{{ shopReport.buyNd2Qty | formatAmount }}</span>
                    <span>箱</span>
                </template>
                <template v-if="shopReport.buyOtherQty>0">
                    <span>，其它 </span>
                    <span class="buy-detail-num">{{ shopReport.buyOtherQty | formatAmount }}</span>
                    <span>箱</span>
                </template>
            </div>
            <!-- 最多采购的 -->
            <div
                class="ani more-detail mt-25"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="7.2s"
            >
                <span>采购量最多得</span>
                <span class="color-orange">一个月</span>
                <span>是在</span>
                <span class="color-orange">{{ shopReport.maxBuyMonth }}</span>
                <span>月</span>
            </div>
            <div
                class="ani more-detail"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="8s"
            >
                <span>累计订单</span>
                <span class="color-orange">{{ shopReport.maxMonthOrderQty | formatAmount }}</span>
                <span>笔</span>
            </div>

            <div
                class="ani more-detail"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="8.5s"
            >
                <span>采购商品</span>
                <span class="color-orange">{{ shopReport.maxMonthBuyQty | formatAmount }}</span>
                <span>箱</span>
            </div>

            <div
                class="ani more-detail"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="9s"
            >
                <span>支付金额</span>
                <span class="color-orange">{{ shopReport.maxMonthPayedAmt | formatAmount }}</span>
                <span>元</span>
            </div>

            <!-- 固定箭头 -->
            <img
                class="icon_arrow_up"
                src="@/assets/img/bill/2023/icon_arrow_up.png"
                alt=""
            />
        </div>
    </div>
</template>

<script>
import { closeWebview } from "@/utils/dsBridge";
import { formatAmount } from "@/utils/index";
import { mapGetters } from "vuex";

export default {
    name: "Six",
    props: {
        isPlay: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
       ...mapGetters(["isMiniprogram", "billInfo"]),
       shopReport() {
            if (this.billInfo.shopReport) {
                return this.billInfo.shopReport;
            }
            return null;
        },
    },
    data() {
        return {
            manyDay: "2222",
            icon_audio_play: require("@/assets/img/bill/2023/img_audio_play.png"),
            icon_audio_pause: require("@/assets/img/bill/2023/img_audio_pause.png"),
        };
    },
    filters: {
        formatAmount,
    },
    created() {},
    activated() {},
    mounted() {},
    deactivated() {},
    beforeDestroy() {},
    methods: {
        onClickLeft() {
            this.$emit("stopAudio");
            window.close();
            // 调用ios方法返回
            closeWebview();
        },
        audioPlay() {
            this.$emit("audioPlay");
        },
    },
};
</script>

<style lang="scss" scoped>
/deep/ .van-nav-bar {
    background-color: transparent;
    z-index: 999;
    .van-icon-arrow-left {
        font-size: 24px;
    }
    .van-icon {
        color: #cecde0;
    }
    .van-nav-bar__text {
        color: #cecde0;
    }
}
/deep/.van-hairline--bottom::after {
    border-bottom: unset;
}
.page-box {
    box-sizing: border-box;
    height: 100%;
    position: relative;
    z-index: 1;
    .logo-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .logo_bfyl {
            width: 110px;
            height: 31px;
        }
        .icon_audio {
            width: 25px;
            height: 25px;
        }
    }
    
    .content-box {
        padding: 0 21px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        width: 100%;
        .title-1 {
            font-size: 26px;
            font-family: Source Han Sans SC, Source Han Sans SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #cfcdd3;
            letter-spacing: 0.78px;
            margin-top: 20px;
        }
        .caigou-num {
            font-size: 30px;
            font-family: Source Han Sans SC, Source Han Sans SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #f26d00;
            letter-spacing: 0.9px;
            margin-top: 20px;
            box-sizing: border-box;
            display: flex;
            align-items: baseline;
            .caigou-unit {
                font-size: 17px;
                font-family: Source Han Sans SC, Source Han Sans SC-Medium;
                font-weight: 500;
                text-align: left;
                color: #a6a5b5;
                letter-spacing: 0.51px;
                margin-left: 4px;
            }
        }

        .pay-box {
            margin-top: 4px;
            font-size: 14px;
            font-family: Source Han Sans SC, Source Han Sans SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #cfcdd3;
            line-height: 25px;
            letter-spacing: 0.42px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            .pay-num {
                font-size: 18px;
                font-family: Source Han Sans SC, Source Han Sans SC-Medium;
                font-weight: 500;
                text-align: left;
                color: #f26d00;
                line-height: 25px;
                letter-spacing: 0.42px;
            }
            .use-coupon {
                font-size: 14px;
                font-family: Source Han Sans SC, Source Han Sans SC-Medium;
                font-weight: 500;
                text-align: left;
                color: #cfcdd3;
                line-height: 25px;
                letter-spacing: 0.42px;
            }
            .coupon-num {
                font-size: 16px;
                font-family: Source Han Sans SC, Source Han Sans SC-Medium;
                font-weight: 500;
                text-align: left;
                color: #f26d00;
                line-height: 25px;
                letter-spacing: 0.42px;
            }
        }
        .title-2 {
            margin-top: 20px;
            font-size: 21px;
            font-family: Source Han Sans SC, Source Han Sans SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #cfcdd3;
            letter-spacing: 0.63px;
        }
        .buy-goods {
            margin-top: 4px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            font-size: 26px;
            font-family: Source Han Sans SC, Source Han Sans SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #f26d00;
            letter-spacing: 0.78px;
            .buy-unit {
                font-size: 17px;
                font-family: Source Han Sans SC, Source Han Sans SC-Medium;
                font-weight: 500;
                text-align: left;
                color: #a6a5b5;
                letter-spacing: 0.51px;
            }
        }
        .buy-detail {
            margin-top: 2px;
            font-size: 14px;
            font-family: Source Han Sans SC, Source Han Sans SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #a6a5b5;
            line-height: 25px;
            letter-spacing: 0.42px;
            .buy-detail-num {
                color: #f26d00;
            }
        }
        .more-detail {
            box-sizing: border-box;
            font-size: 12px;
            font-family: Source Han Sans SC, Source Han Sans SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #a6a5b5;
            line-height: 25px;
            letter-spacing: 0.36px;
            .color-orange {
                color: #f26d00;
            }
        }
        .mt-25 {
            margin-top: 25px;
        }
    }
    .miniprogramTop{
        padding-top: 20px;
    }
    .bg_page {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }

    .page_3_title {
        margin-top: 33px;
        width: 258px;
        height: 25px;
    }
    .icon_arrow_up {
        width: 12px;
        height: 29px;
        position: absolute;
        bottom: 30px;
        left: 0;
        right: 0;
        margin: 0 auto;
    }
}
</style>
