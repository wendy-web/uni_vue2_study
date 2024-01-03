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
                class="bg_page_2"
                src="@/assets/img/bill/2023/bg_page_2.png"
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
            <!-- 还记得么 -->
            <img
                class="title_rurember ani"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="1.2s"
                src="@/assets/img/bill/2023/title_rurember.png"
                alt=""
            />
            <!-- 相遇 -->
            <div
                class="ani meet-day"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="2.2s"
            >
                我们第一次相遇的日子
            </div>
            <!-- 年月日 -->
            <div
                class="ani meet-date-box"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="3.2s"
            >
                <span class="meet-date">{{ shopReport.createYear }}</span>
                <span class="meet-year">年</span>
                <span class="meet-date">{{ shopReport.createMonth }}</span>
                <span class="meet-year">月</span>
                <span class="meet-date">{{ shopReport.createDay }}</span>
                <span class="meet-year">日</span>
            </div>
            <div
                class="ani wink-eye"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="4.2s"
            >
                转眼间我们已相伴了
            </div>
            <div
                class="ani meet-date-box many-days"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="5.2s"
            >
                <span class="meet-date">{{ shopReport.createDays | formatAmount }}</span>
                <span class="meet-year">天</span>
            </div>
            <!-- 店员需要判断有无数据 -->
            <div
                v-if="shopReport.clerkNum > 0"
                class="ani meet-date-box many-days"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="6.2s"
            >
                <span class="meet-date">{{ shopReport.clerkNum }}</span>
                <span class="meet-year">名</span>
                <span class="shop-crew">店员与您，相互陪伴！</span>
            </div>
            <!-- 加油 -->
            <img
                class="come_on ani"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="7.2s"
                src="@/assets/img/bill/2023/come_on_2024.png"
                alt=""
            />
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
    name: "Two",
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
            manyDay: "8000",
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
        onChange() {},
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

    .bg_page_2 {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }

    .title_rurember {
        margin-top: 33px;
        width: 120px;
        height: 24px;
    }
    .meet-day {
        height: 38px;
        font-size: 26px;
        font-family: Source Han Sans SC, Source Han Sans SC-Medium;
        font-weight: 500;
        text-align: left;
        color: #cfcdd3;
        letter-spacing: 0.78px;
        margin-top: 14px;
    }
    .meet-date-box {
        display: flex;
        align-items: baseline;
        margin-top: 4px;
        .meet-date {
            font-size: 30px;
            font-family: Source Han Sans SC, Source Han Sans SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #f26d00;
            letter-spacing: 0.9px;
        }
        .meet-year {
            font-size: 17px;
            font-family: Source Han Sans SC, Source Han Sans SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #a6a5b5;
            letter-spacing: 0.51px;
        }
    }
    .wink-eye {
        margin-top: 35px;
        font-size: 21px;
        font-family: Source Han Sans SC, Source Han Sans SC-Medium;
        font-weight: 500;
        text-align: left;
        color: #cfcdd3;
        letter-spacing: 0.63px;
    }
    .many-days {
        font-size: 26px;
        font-family: Source Han Sans SC, Source Han Sans SC-Medium;
        font-weight: 500;
        text-align: left;
        color: #f26d00;
        letter-spacing: 0.78px;
        margin-top: 10px;
    }
    .shop-crew {
        font-size: 21px;
        font-family: Source Han Sans SC, Source Han Sans SC-Medium;
        font-weight: 500;
        text-align: left;
        color: #cfcdd3;
        letter-spacing: 0.63px;
        margin-top: 30px;
    }
    .come_on {
        margin-top: 37px;
        width: 191px;
        height: 18px;
        opacity: 0.78;
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
