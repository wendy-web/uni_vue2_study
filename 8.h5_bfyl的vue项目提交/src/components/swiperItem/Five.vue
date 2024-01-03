<template>
    <div class="page-box">
        <!-- 第五页 -->
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
        <div class="content-box" :class="{ miniprogramTop: isMiniprogram }">
            <!-- 背景图 -->
            <img
                class="bg_page"
                src="@/assets/img/bill/2023/bg_page_5.png"
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
            <!-- 充实的一年 -->
            <img
                class="page_5_title ani"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="1.2s"
                src="@/assets/img/bill/2023/page_5_title.png"
                alt=""
            />
            <!-- 累计参与 -->
            <div
                class="ani total-join"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="2.2s"
            >
                <div>
                    累计参与营销活动<span class="join-num">{{
                        shopReport.joinActQty
                    }}</span
                    >档，
                </div>
                <div>
                    累计获得奖券<span class="join-num">{{
                        shopReport.getRewardTicketQty | formatAmount
                    }}</span
                    >张
                </div>
            </div>
            <!-- 参与营销活动的红牛战马都没获得券，就不显示 -->
            <template v-if="shopReport.actRewardNd1Qty>0||shopReport.actRewardNd2Qty>0">
                <div
                    class="ani total-join"
                    swiper-animate-effect="fadeInUp"
                    swiper-animate-duration="1s"
                    swiper-animate-delay="3.2s"
                >
                    <!-- <span class="join-num">7</span>月的  -->
                    <div>
                        还记得吗？{{ shopReport.actBestName
                        }}<span v-if="shopReport.actBestRank">
                            ，您获得了第<span class="join-num">{{
                                shopReport.actBestRank
                            }}</span
                            >名</span
                        >
                    </div>
                </div>
                <div
                    class="ani total-join"
                    swiper-animate-effect="fadeInUp"
                    swiper-animate-duration="1s"
                    swiper-animate-delay="4.2s"
                >
                    <div v-if="shopReport.actRewardNd1Qty > 0">
                        获得红牛卡券<span class="join-num">{{
                            shopReport.actRewardNd1Qty
                        }}</span
                        >张
                    </div>
                    <div v-if="shopReport.actRewardNd2Qty > 0">
                        获得战马卡券<span class="join-num">{{
                            shopReport.actRewardNd2Qty
                        }}</span
                        >张
                    </div>
                </div>
            </template>
            <!-- 累计活动卡券 -->
            <div
                class="ani progress-box mt-30"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="5.2s"
            >
                <div class="total-title">累计获得卡券</div>
                <div class="total-num">
                    {{ shopReport.totalTicketQty | formatAmount
                    }}<span class="total-unit">张</span>
                </div>
                <van-progress
                    class="progress-bar"
                    :percentage="75"
                    stroke-width="6"
                    pivot-text=""
                    color="#a98652  "
                    track-color="#aa3131"
                />
                <div class="progress-title">
                    <div class="progress-count">
                        <span class="progress-name">红牛</span>
                        <span>{{
                            shopReport.nd1TicketQty | formatAmount
                        }}</span>
                        <span class="progress-unit">张</span>
                    </div>
                    <div class="progress-count">
                        <span class="progress-name">战马</span>
                        <span class="color-red">{{
                            shopReport.nd2TicketQty | formatAmount
                        }}</span>
                        <span class="progress-unit">张</span>
                    </div>
                </div>
            </div>
            <!-- 其中已返货 -->
            <div
                class="ani progress-box mt-40"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="6.2s"
            >
                <div class="total-title">其中已返货</div>
                <div class="total-num">
                    {{ shopReport.totalVerifyQty | formatAmount
                    }}<span class="total-unit">罐</span>
                </div>
                <van-progress
                    class="progress-bar"
                    :percentage="75"
                    stroke-width="6"
                    pivot-text=""
                    color="#a98652"
                    track-color="#aa3131"
                />
                <div class="progress-title">
                    <div class="progress-count">
                        <span class="progress-name">红牛</span>
                        <span>{{
                            shopReport.nd1VerifyQty | formatAmount
                        }}</span>
                        <span class="progress-unit">罐</span>
                    </div>
                    <div class="progress-count">
                        <span class="progress-name">战马</span>
                        <span class="color-red">{{
                            shopReport.nd2VerifyQty | formatAmount
                        }}</span>
                        <span class="progress-unit">罐</span>
                    </div>
                </div>
            </div>
            <!-- 商铺背景图 -->
            <img
                class="bg_page_5_inner"
                src="@/assets/img/bill/2023/bg_page_5_inner.png"
                alt=""
            />
            <!-- 老板来了 -->
            <img
                class="page_5_boss"
                src="@/assets/img/bill/2023/page_5_boss.png"
                alt=""
            />
            <!-- 送货小哥来了 -->
            <template
                v-if="
                    shopReport &&
                    shopReport.openBox > 0 &&
                    shopReport.hsFlag > 0
                "
            >
                <img
                    v-if="swiperIndex === 4"
                    class="page_6_bicycle slide-in-right"
                    src="@/assets/img/bill/2023/page_6_bicycle.png"
                    alt=""
                />
            </template>
            <template v-else>
                <img
                    v-if="swiperIndex === 3"
                    class="page_6_bicycle slide-in-right"
                    src="@/assets/img/bill/2023/page_6_bicycle.png"
                    alt=""
                />
            </template>
            <!-- <template v-if="swiperIndex === 4">
                <img
                    class="page_6_bicycle fadeInRight"
                    swiper-animate-effect=""
                    swiper-animate-duration="1s"
                    swiper-animate-delay="3.2s"
                    src="@/assets/img/bill/2023/page_6_bicycle.png"
                    alt=""
                />
            </template> -->

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
    name: "Three",
    props: {
        isPlay: {
            type: Boolean,
            default: false,
        },
        swiperIndex: {
            type: Number,
            default: 0,
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
    }
    .miniprogramTop {
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

    .page_5_title {
        margin-top: 33px;
        width: 258px;
        height: 25px;
        margin-bottom: 10px;
    }
    .total-join {
        font-size: 14px;
        font-family: Source Han Sans SC, Source Han Sans SC-Medium;
        font-weight: 500;
        text-align: left;
        color: #cfcdd3;
        line-height: 25px;
        letter-spacing: 0.42px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        margin-top: 6px;
        z-index: 20;
        .join-num {
            color: #f26d00;
        }
    }

    .progress-box {
        box-sizing: border-box;
        margin-top: 20px;
        z-index: 20;
        .total-title {
            font-size: 16px;
            font-family: Source Han Sans SC, Source Han Sans SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #cfcdd3;
            letter-spacing: 0.48px;
        }
        .total-num {
            margin-top: 12px;
            font-size: 24px;
            font-family: Source Han Sans SC, Source Han Sans SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #f26d00;
            letter-spacing: 0.72px;
            .total-unit {
                font-size: 14px;
                font-family: Source Han Sans SC, Source Han Sans SC-Medium;
                font-weight: 500;
                text-align: left;
                color: #a6a5b5;
                letter-spacing: 0.42px;
            }
        }
        .progress-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 18px;
            font-family: Source Han Sans SC, Source Han Sans SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #cfcdd3;
            letter-spacing: 0.54px;
            margin-top: 6px;

            .progress-count {
                font-size: 18px;
                font-family: Source Han Sans SC, Source Han Sans SC-Medium;
                font-weight: 500;
                text-align: left;
                color: #ffcd81;
                letter-spacing: 0.54px;
                display: flex;
                align-items: center;
                .progress-name {
                    font-size: 14px;
                    font-family: Source Han Sans SC, Source Han Sans SC-Medium;
                    font-weight: 500;
                    text-align: left;
                    color: #cfcdd3;
                    letter-spacing: 0.42px;
                    margin-right: 12px;
                    position: relative;
                }
                .progress-name::after {
                    content: "";
                    position: absolute;
                    right: -6px;
                    top: 0;
                    bottom: 0;
                    margin: auto 0;
                    width: 2px;
                    height: 14px;
                    background: #696679;
                }
                .progress-unit {
                    font-size: 11px;
                    font-family: Source Han Sans SC, Source Han Sans SC-Medium;
                    font-weight: 500;
                    text-align: left;
                    color: #a6a5b5;
                    letter-spacing: 0.33px;
                }
                .color-red {
                    color: #f34545;
                }
            }
        }
        .progress-bar {
            margin-top: 8px;
        }
    }
    .mt-30 {
        margin-top: 30px;
    }
    .mt-40 {
        margin-top: 40px;
    }
    .page_6_bicycle {
        width: 115px;
        height: 108px;
        position: absolute;
        bottom: 20px;
        right: 14%;
        opacity: 0;
        z-index: 20;
        // transform: translateX(215px);
    }
    .page_5_boss{
        width: 72px;
        height: 112px;
        position: absolute;
        bottom: 20px;
        left: 28%;
        z-index: 20;
    }
    .slide-in-right {
        -webkit-animation: slide-in-right 2s 0s forwards;
        animation: slide-in-right 2s 0s forwards;
    }
    .bg_page_5_inner{
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
    }

    .icon_arrow_up {
        width: 12px;
        height: 29px;
        position: absolute;
        bottom: 30px;
        left: 0;
        right: 0;
        z-index: 2;
        margin: 0 auto;
    }
    @keyframes fadeInRight {
        from {
            opacity: 0;
            transform: translateX(125px);
        }

        to {
            opacity: 1;
            transform: translateX(-80%);
        }
    }

    .fadeInRight {
        animation: fadeInRight 2s 2s;
        animation-fill-mode: forwards;
    }
}
</style>
