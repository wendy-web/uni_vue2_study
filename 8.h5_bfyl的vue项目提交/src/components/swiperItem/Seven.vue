<template>
    <div class="page-box">
        <div class="lottie-box">
            <lottie
                :options="defaultOptions"
                :height="lottieHeight"
                :width="lottieWidth"
                @animCreated="handleAnimation"
            />
        </div>
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
            <!-- 第七页：付出的一年 -->
            <img
                class="page_4_title ani"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="1s"
                src="@/assets/img/bill/2023/page_7_title.png"
                alt=""
            />
            <div
                class="ani total-service"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="2s"
            >
                累计为
            </div>

            <div
                class="ani mt-15 normal-title"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="3s"
            >
                <span class="total-service-num">{{
                    shopReport.exUserQty | formatAmount
                }}</span>
                <span class="total-service-unit">人</span>
                <span>提供兑奖服务</span>
            </div>

            <div
                class="ani mt-30 normal-title"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="4.2s"
            >
                <template v-if="shopReport.maxDayExUser > 5">
                    <span>服务用户最多的一天是</span>
                    <span class="font-26 color-orange">{{
                        shopReport.maxExDayMonth
                    }}</span>
                    <span>月</span>
                    <span class="font-26 color-orange">{{
                        shopReport.maxExDayDay
                    }}</span>
                    <span>日</span>
                </template>
                <!-- 单日大于5显示到日，否则显示到月 -->
                <template v-else>
                    <span>服务用户最多的一个月是</span>
                    <span class="font-26 color-orange">{{
                        shopReport.maxExMonth
                    }}</span>
                    <span>月</span>
                </template>
                
            </div>

            <div
                class="ani mt-15 normal-title"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="5s"
            >
                <span>累计兑奖</span>
                <!-- 单日大于5显示到日，否则显示到月 -->
                <template v-if="shopReport.maxDayExUser > 5">
                    <span class="font-26 color-orange">{{
                        shopReport.maxDayExUser
                    }}</span>
                </template>
                <template v-else>
                    <span class="font-26 color-orange">{{
                        shopReport.maxMonthExUser
                    }}</span>
                </template>
                <span class="total-service-unit">人</span>
            </div>

            <div
                class="ani mt-15 last-tips"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="6s"
            >
                <span>最晚的一次是在</span>
                <span class="color-orange">{{ shopReport.latestExTime }}</span>
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
import { lottieSevenData } from "@/assets/lottie/seven/index.js";
import { mapGetters } from "vuex";
export default {
    name: "Seven",
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
            lottieHeight: "100vh",
            lottieWidth: "100vw",
            anim: {},
            defaultOptions: { animationData: lottieSevenData },
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
        handleAnimation: function (anim) {
            this.anim = anim;
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
    .lottie-box {
        position: absolute;
        z-index: -2;
        top: 0;
        left: 0;
        right: 0;
        // width: 100vw;
        width: 100%;
        // height: 100%;
    }
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
        .page_4_title {
            margin-top: 35px;
            width: 284px;
            height: 25px;
        }
        .total-service {
            margin-top: 20px;
            font-size: 26px;
            font-family: Source Han Sans SC, Source Han Sans SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #cfcdd3;
            letter-spacing: 0.78px;
        }
        .total-service-num {
            font-size: 30px;
            font-family: Source Han Sans SC, Source Han Sans SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #f26d00;
            letter-spacing: 0.9px;
        }
        .total-service-unit {
            font-size: 17px;
            font-family: Source Han Sans SC, Source Han Sans SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #a6a5b5;
            letter-spacing: 0.51px;
            margin: 0 2px;
        }
        .normal-title {
            font-size: 21px;
            font-family: Source Han Sans SC, Source Han Sans SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #cfcdd3;
            letter-spacing: 0.63px;
            box-sizing: border-box;
            display: flex;
            align-items: baseline;
        }
        .font-26 {
            font-size: 26px;
        }
        .color-orange {
            color: #f26d00;
        }
        .last-tips {
            font-size: 16px;
            font-family: Source Han Sans SC, Source Han Sans SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #cfcdd3;
            letter-spacing: 0.48px;
        }
    }
    .miniprogramTop {
        padding-top: 20px;
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
.mt-15 {
    margin-top: 15px;
}
.mt-30 {
    margin-top: 30px;
}
</style>
