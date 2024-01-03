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
        <div class="content-box" :class="{ 'miniprogramTop': isMiniprogram }">
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
            <!-- 收获的一年 -->
            <img
                class="page_4_title ani"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="1.2s"
                src="@/assets/img/bill/2023/page_4_title.png"
                alt=""
            />
            <div
                class="ani total-earn"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="2.2s"
            >
                累计收益合计
            </div>

            <div
                class="ani mt-5"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="3.2s"
            >
                <span class="total-earn-num">{{ shopReport.totalIncomeAmt | formatAmount }}</span>
                <span class="total-earn-unit">元</span>
            </div>
            <!-- 饼图 -->
            <div
                class="ani pie-box"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="4.2s"
            >
                <canvas
                    id="pieContainer"
                    style="width: 100%; height: 100%"
                ></canvas>
            </div>
            <!-- 商品奖励 -->
            <div
                class="ani reward-tips"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="5.2s"
            >
                *商品奖励收益=1元换购+兑换券+活动券+折扣券
            </div>
            <!-- 收入最多的月份 -->
            <div
                class="ani reward-max"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="6.2s"
            >
                <span>收益最多的是</span>
                <span class="month">{{ shopReport.maxIncomeMonth }}</span>
                <span>月份，累计获得收益</span>
            </div>

            <div
                class="ani mt-5"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="7.2s"
            >
                <span class="total-earn-num">{{ shopReport.maxMonthIncome | formatAmount }}</span>
                <span class="total-earn-unit">元</span>
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
import { lottieFourData } from "@/assets/lottie/four/index.js";
import F2 from "@antv/f2/lib/index-all";
import { mapGetters } from "vuex";
export default {
    name: "Four",
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
            return null
        }
    },
    data() {
        return {
            lottieHeight: "100vh",
            lottieWidth: "100vw",
            anim: {},
            defaultOptions: { animationData: lottieFourData },
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
    mounted() {
        this.$nextTick(() => {
            console.log('饼图的数据：', this.shopReport);
            this.f2Pie();
        });
    },
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
        f2Pie() {
            let {redpacketIncomeAmt,cashticketIncomeAmt,warerewardIncomeAmt} = this.shopReport;
            const data = [
                {
                    const: "const",
                    type: "商品奖励收益",
                    money: warerewardIncomeAmt,
                },
                {
                    const: "const",
                    type: "现金券收益",
                    money: cashticketIncomeAmt,
                },
                {
                    const: "const",
                    type: "红包收益",
                    money: redpacketIncomeAmt,
                },
            ];
            const chart = new F2.Chart({
                id: "pieContainer",
                pixelRatio: window.devicePixelRatio,
            });
            chart.source(data);
            chart.coord("polar", {
                transposed: true,
                radius: 0.6,
                innerRadius: 0.7,
            });
            chart.axis(false);
            chart.legend(false);
            chart.tooltip(false);
            chart.guide().html({
                position: ["50%", "50%"],
                html: '<div style="text-align: center;width:150px;height: 50px;">\n      <p style="font-size: 12px;color: #999;margin: 10px 0 0 0" id="title"></p>\n      <p style="font-size: 18px;color: #343434;margin: 0;font-weight: bold;" id="money"></p>\n      </div>',
            });
            chart
                .interval()
                .position("const*money")
                .adjust("stack")
                .color("type", ["#987344", "#295877", "#a61919"]);
            chart.pieLabel({
                sidePadding: 10,
                activeShape: true,
                skipOverlapLabels: false, // 是否不展示重叠的文本
                // inflectionOffset:10, // 拐点的偏移量
                label1OffsetY:-4, // label1 与连接线在垂直方向的偏移量
                label2OffsetY:4, // label2 与连接线在垂直方向的偏移量
                label1: function label1(data, color) {
                    return {
                        // text: "￥" + data.money,
                        text:
                            String(Math.floor(data.money * 100) / 100).replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                ","
                            ) +
                            "元",
                        // fill: "#5B95BC",
                        fill: color,
                        fontWeight: "",
                    };
                },
                label2: function label2(data) {
                    return {
                        text: data.type,
                        fill: "#CFCDD3",
                    };
                },
                onClick: function onClick(ev) {
                    const data = ev.data;
                    console.log(data);
                },
            });
            chart.render();
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
        bottom: 0;
        left: 0;
        right: 0;
        width: 100vw;
        height: 100vh;
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
        .total-earn {
            font-size: 26px;
            font-family: Source Han Sans SC, Source Han Sans SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #cfcdd3;
            letter-spacing: 0.78px;
            margin-top: 10px;
        }
        .total-earn-num {
            font-size: 30px;
            font-family: Source Han Sans SC, Source Han Sans SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #f26d00;
            letter-spacing: 0.9px;
        }
        .total-earn-unit {
            font-size: 17px;
            font-family: Source Han Sans SC, Source Han Sans SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #a6a5b5;
            letter-spacing: 0.51px;
        }
        .pie-box {
            width: 100%;
            height: 220px;
            // height: auto;
            box-sizing: border-box;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        .reward-tips {
            font-size: 11px;
            font-family: Source Han Sans SC, Source Han Sans SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #a6a5b5;
            letter-spacing: 0.33px;
        }
        .reward-max {
            font-size: 18px;
            font-family: Source Han Sans SC, Source Han Sans SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #cfcdd3;
            letter-spacing: 0.54px;
            margin-top: 14px;
            .month {
                color: #f26d00;
            }
        }
    }
    .miniprogramTop{
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
.mt-5 {
    margin-top: 5px;
}
</style>
