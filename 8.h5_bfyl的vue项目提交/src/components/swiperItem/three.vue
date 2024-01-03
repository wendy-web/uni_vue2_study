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
                src="@/assets/img/bill/2023/bg_page_3.png"
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
            <!-- 这一年 -->
            <img
                class="page_3_title ani"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="1.2s"
                src="@/assets/img/bill/2023/page_3_title.png"
                alt=""
            />
            <!-- 感谢 -->
            <div
                class="ani thank-for"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="2.2s"
            >
                感谢您为
            </div>
            <div
                class="ani thank-for"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="3.2s"
            >
                中国红牛贡献了
            </div>

            <div
                class="ani meet-date-box"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="4.2s"
            >
                <span class="box-num">{{ shopReport.openBox | formatAmount }}</span>
                <span class="box-unit">箱</span>
            </div>
            <!-- 进度条：红牛战马 -->
            <div
                class="ani progress-box"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="5.2s"
            >
                <div class="progress-title">
                    <div>红牛</div>
                    <div class="progress-count">
                        <span>{{ shopReport.openBoxNd1 | formatAmount }}</span>
                        <span class="progress-unit">箱</span>
                    </div>
                </div>
                <van-progress
                    class="progress-bar"
                    :percentage="(shopReport.openBoxNd1/shopReport.openBox)*100"
                    stroke-width="6"
                    pivot-text=""
                    color="#a98652"
                    track-color="#402924"
                />
            </div>
            <div
                v-if="shopReport.openBoxNd2 > 0"
                class="ani progress-box mt-30"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="6.2s"
            >
                <div class="progress-title">
                    <div>战马</div>
                    <div class="progress-count">
                        <span>{{ shopReport.openBoxNd2 | formatAmount }}</span>
                        <span class="progress-unit">箱</span>
                    </div>
                </div>
                <van-progress
                    class="progress-bar"
                    :percentage="(shopReport.openBoxNd2/shopReport.openBox)*100"
                    stroke-width="6"
                    pivot-text=""
                    color="#aa3131  "
                    track-color="#432619"
                />
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
    name: "Three",
    props: {
        isPlay: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
       ...mapGetters(["isMiniprogram","billInfo"]),
       shopReport(){
            if(this.billInfo.shopReport){
                return this.billInfo.shopReport
            }
            return {}
        }
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
    
    .content-box {
        padding: 0 21px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        width: 100%;
    }
    .miniprogramTop{
        padding-top: 20px;
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
    .thank-for {
        font-size: 26px;
        font-family: Source Han Sans SC, Source Han Sans SC-Medium;
        font-weight: 500;
        text-align: left;
        color: #cfcdd3;
        line-height: 42px;
        letter-spacing: 0.78px;
        margin-top: 14px;
    }
    .meet-date-box {
        display: flex;
        align-items: baseline;
        margin-top: 4px;
        .box-num {
            font-size: 30px;
            font-family: Source Han Sans SC, Source Han Sans SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #f26d00;
            letter-spacing: 0.9px;
        }
        .box-unit {
            font-size: 17px;
            font-family: Source Han Sans SC, Source Han Sans SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #a6a5b5;
            letter-spacing: 0.51px;
        }
    }
    .progress-box {
        box-sizing: border-box;
        margin-top: 20px;
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
            .progress-count {
                font-size: 20px;
                font-family: Source Han Sans SC, Source Han Sans SC-Medium;
                font-weight: 500;
                text-align: left;
                color: #ffcd81;
                letter-spacing: 0.6px;
                .progress-unit {
                    font-size: 11px;
                    font-family: Source Han Sans SC, Source Han Sans SC-Medium;
                    font-weight: 500;
                    text-align: left;
                    color: #a6a5b5;
                    letter-spacing: 0.33px;
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
