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
        <div class="content-box" :class="{ miniprogramTop: isMiniprogram }">
            <!-- 背景图 -->
            <img
                class="bg_page"
                src="@/assets/img/bill/2023/bg_page_8.png"
                alt=""
            />
            <img
                class="bg_page_8_inner"
                src="@/assets/img/bill/2023/bg_page_8_inner.png"
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
            <!-- 第八页 努力的一年 -->
            <img
                class="page_8_title ani"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="1.2s"
                src="@/assets/img/bill/2023/page_8_title.png"
                alt=""
            />
            <!-- 遥遥领先 -->
            <div
                class="ani far-ahead"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="2.2s"
            >
                <span>超过了全市</span>
                <span class="color-orange">{{ shopReport.topPercent }}%</span>
                <span>的店铺</span>
            </div>
            <!-- 累计收益相关····需要判断点击显示隐藏  -->
            <div
                class="ani total-earn-box mt-14"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="3s"
            >
                <div class="total-earn-item">
                    <img
                        class="earn_icon"
                        src="@/assets/img/bill/2023/icon_reward.png"
                        alt=""
                    />
                    <div>
                        <span>累计收益：</span>
                        <span class="earn-num" v-if="eye_ljshouyi">{{
                            ljshouyi | formatAmount
                        }}</span>
                        <span class="earn-num" v-else>{{ ljshouyi_eye }}</span>
                        <span class="earn-unit">元</span>
                        <van-icon
                            :name="eye_ljshouyi ? 'eye-o' : 'closed-eye'"
                            @click="
                                eyeChange({
                                    eye_name: 'eye_ljshouyi',
                                    data_name: 'ljshouyi',
                                })
                            "
                        />
                    </div>
                </div>
                <div class="total-earn-tip">
                    * 累计收益=箱内码活动+消费者促销活动+营销活动<span v-if="shopReport.hsFlag > 0">+惠商活动</span>
                </div>
            </div>
            <div
                class="ani total-earn-box"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="4s"
            >
                <div class="total-earn-item">
                    <img
                        class="earn_icon"
                        src="@/assets/img/bill/2023/icon_exchange.png"
                        alt=""
                    />
                    <div>
                        <span>累计兑奖：</span>
                        <span class="earn-num" v-if="eye_ljexc">{{
                            ljexc | formatAmount
                        }}</span>
                        <span class="earn-num" v-else>{{ ljexc_eye }}</span>
                        <span class="earn-unit">人</span>
                        <van-icon
                            :name="eye_ljexc ? 'eye-o' : 'closed-eye'"
                            @click="
                                eyeChange({
                                    eye_name: 'eye_ljexc',
                                    data_name: 'ljexc',
                                })
                            "
                        />
                    </div>
                </div>
            </div>
            <!-- 累计卡券 -->
            <div
                class="ani total-earn-box"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="5s"
            >
                <div class="total-earn-item">
                    <img
                        class="earn_icon"
                        src="@/assets/img/bill/2023/icon_coupon.png"
                        alt=""
                    />
                    <div>
                        <span>累计卡券：</span>
                        <span class="earn-num" v-if="eye_ljcoupon">{{
                            ljcoupon | formatAmount
                        }}</span>
                        <span class="earn-num" v-else>{{ ljcoupon_eye }}</span>
                        <span class="earn-unit">张</span>
                        <van-icon
                            :name="eye_ljcoupon ? 'eye-o' : 'closed-eye'"
                            @click="
                                eyeChange({
                                    eye_name: 'eye_ljcoupon',
                                    data_name: 'ljcoupon',
                                })
                            "
                        />
                    </div>
                </div>
            </div>
            <!-- 累计返货 -->
            <div
                class="ani total-earn-box"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="6s"
            >
                <div class="total-earn-item">
                    <img
                        class="earn_icon"
                        src="@/assets/img/bill/2023/icon_deliver.png"
                        alt=""
                    />
                    <div>
                        <span>累计返货：</span>
                        <span class="earn-num" v-if="eye_ljfanhuo">{{
                            ljfanhuo | formatAmount
                        }}</span>
                        <span class="earn-num" v-else>{{ ljfanhuo_eye }}</span>
                        <span class="earn-unit">罐</span>
                        <van-icon
                            :name="eye_ljfanhuo ? 'eye-o' : 'closed-eye'"
                            @click="
                                eyeChange({
                                    eye_name: 'eye_ljfanhuo',
                                    data_name: 'ljfanhuo',
                                })
                            "
                        />
                    </div>
                </div>
            </div>
            <!-- 一下内容是惠商专属显示 -->
            <template v-if="shopReport.hsFlag > 0">

                <!-- 采购订单 -->
                <div
                    class="ani total-earn-box"
                    swiper-animate-effect="fadeInUp"
                    swiper-animate-duration="1s"
                    swiper-animate-delay="7s"
                >
                    <div class="total-earn-item">
                        <img
                            class="earn_icon"
                            src="@/assets/img/bill/2023/icon_shop_cart.png"
                            alt=""
                        />
                        <div>
                            <span>采购订单：</span>
                            <span class="earn-num" v-if="eye_cgorder">{{
                                cgorder | formatAmount
                            }}</span>
                            <span class="earn-num" v-else>{{ cgorder_eye }}</span>
                            <span class="earn-unit">笔</span>
                            <van-icon
                                :name="eye_cgorder ? 'eye-o' : 'closed-eye'"
                                @click="
                                    eyeChange({
                                        eye_name: 'eye_cgorder',
                                        data_name: 'cgorder',
                                    })
                                "
                            />
                        </div>
                    </div>
                </div>
                <!-- 采购商品 -->
                <div
                    class="ani total-earn-box"
                    swiper-animate-effect="fadeInUp"
                    swiper-animate-duration="1s"
                    swiper-animate-delay="8s"
                >
                    <div class="total-earn-item">
                        <img
                            class="earn_icon"
                            src="@/assets/img/bill/2023/icon_buy_good.png"
                            alt=""
                        />
                        <div>
                            <span>采购商品：</span>
                            <span class="earn-num" v-if="eye_cggood">{{
                                cggood | formatAmount
                            }}</span>
                            <span class="earn-num" v-else>{{ cggood_eye }}</span>
                            <span class="earn-unit">箱</span>
                            <van-icon
                                :name="eye_cggood ? 'eye-o' : 'closed-eye'"
                                @click="
                                    eyeChange({
                                        eye_name: 'eye_cggood',
                                        data_name: 'cggood',
                                    })
                                "
                            />
                        </div>
                    </div>
                </div>
                <!-- 累计支付 -->
                <div
                    class="ani total-earn-box"
                    swiper-animate-effect="fadeInUp"
                    swiper-animate-duration="1s"
                    swiper-animate-delay="9s"
                >
                    <div class="total-earn-item">
                        <img
                            class="earn_icon"
                            src="@/assets/img/bill/2023/icon_buy_good.png"
                            alt=""
                        />
                        <div>
                            <span>累计支付：</span>
                            <span class="earn-num" v-if="eye_ljpay">{{
                                ljpay | formatAmount
                            }}</span>
                            <span class="earn-num" v-else>{{ ljpay_eye }}</span>
                            <span class="earn-unit">元</span>
                            <van-icon
                                :name="eye_ljpay ? 'eye-o' : 'closed-eye'"
                                @click="
                                    eyeChange({
                                        eye_name: 'eye_ljpay',
                                        data_name: 'ljpay',
                                    })
                                "
                            />
                        </div>
                    </div>
                </div>
            </template>
            <!-- 固定箭头 -->
            <img
                class="icon_arrow_up"
                src="@/assets/img/bill/2023/icon_arrow_up.png"
                alt=""
            />
        </div>
        <!-- 海报内容 start -->
        <div class="posterBox" ref="posterBox">
            <!-- 背景图 -->
            <img
                class="bg_page"
                src="@/assets/img/bill/2023/bg_loading.jpg"
                alt=""
            />
            <img
                class="bg_page_8_inner"
                src="@/assets/img/bill/2023/bg_page_8_inner.png"
                alt=""
            />
            <!-- logo -->
            <div class="logo-box">
                <img
                    class="logo_bfyl"
                    src="@/assets/img/bill/2023/logo_bfyl.png"
                    alt=""
                />
            </div>
            <!-- 努力的一年 -->
            <img
                class="page_8_title"
                src="@/assets/img/bill/2023/page_8_title.png"
                alt=""
            />
            <!-- 遥遥领先 -->
            <div class="far-ahead">
                <span>超过了全市</span>
                <span class="color-orange">{{shopReport.topPercent}}%</span>
                <span>的店铺</span>
            </div>
            <!-- 累计收益相关····需要判断点击显示隐藏  -->
            <div class="total-earn-box mt-14">
                <div class="total-earn-item">
                    <img
                        class="earn_icon"
                        src="@/assets/img/bill/2023/icon_reward.png"
                        alt=""
                    />
                    <div>
                        <span>累计收益：</span>
                        <span class="earn-num" v-if="eye_ljshouyi">{{
                            ljshouyi | formatAmount
                        }}</span>
                        <span class="earn-num" v-else>{{ ljshouyi_eye }}</span>
                        <span class="earn-unit">元</span>
                    </div>
                </div>
                <div class="total-earn-tip-poster">
                    * 累计收益=箱内码活动+消费者促销活动+营销活动<span v-if="shopReport.hsFlag > 0">+惠商活动</span>
                </div>
            </div>
            <div class="total-earn-box">
                <div class="total-earn-item">
                    <img
                        class="earn_icon"
                        src="@/assets/img/bill/2023/icon_exchange.png"
                        alt=""
                    />
                    <div>
                        <span>累计兑奖：</span>
                        <span class="earn-num" v-if="eye_ljexc">{{
                            ljexc | formatAmount
                        }}</span>
                        <span class="earn-num" v-else>{{ ljexc_eye }}</span>
                        <span class="earn-unit">人</span>
                    </div>
                </div>
            </div>
            <!-- 累计卡券 -->
            <div class="total-earn-box">
                <div class="total-earn-item">
                    <img
                        class="earn_icon"
                        src="@/assets/img/bill/2023/icon_coupon.png"
                        alt=""
                    />
                    <div>
                        <span>累计卡券：</span>
                        <span class="earn-num" v-if="eye_ljcoupon">{{
                            ljcoupon | formatAmount
                        }}</span>
                        <span class="earn-num" v-else>{{ ljcoupon_eye }}</span>
                        <span class="earn-unit">张</span>
                    </div>
                </div>
            </div>
            <!-- 累计返货 -->
            <div class="total-earn-box">
                <div class="total-earn-item">
                    <img
                        class="earn_icon"
                        src="@/assets/img/bill/2023/icon_deliver.png"
                        alt=""
                    />
                    <div>
                        <span>累计返货：</span>
                        <span class="earn-num" v-if="eye_ljfanhuo">{{
                            ljfanhuo | formatAmount
                        }}</span>
                        <span class="earn-num" v-else>{{ ljfanhuo_eye }}</span>
                        <span class="earn-unit">罐</span>
                    </div>
                </div>
            </div>
            <template v-if="shopReport.hsFlag > 0">
                <!-- 采购订单 -->
                <div class="total-earn-box">
                    <div class="total-earn-item">
                        <img
                            class="earn_icon"
                            src="@/assets/img/bill/2023/icon_shop_cart.png"
                            alt=""
                        />
                        <div>
                            <span>采购订单：</span>
                            <span class="earn-num" v-if="eye_cgorder">{{
                                cgorder | formatAmount
                            }}</span>
                            <span class="earn-num" v-else>{{ cgorder_eye }}</span>
                            <span class="earn-unit">笔</span>
                        </div>
                    </div>
                </div>
                <!-- 采购商品 -->
                <div class="total-earn-box">
                    <div class="total-earn-item">
                        <img
                            class="earn_icon"
                            src="@/assets/img/bill/2023/icon_buy_good.png"
                            alt=""
                        />
                        <div>
                            <span>采购商品：</span>
                            <span class="earn-num" v-if="eye_cggood">{{
                                cggood | formatAmount
                            }}</span>
                            <span class="earn-num" v-else>{{ cggood_eye }}</span>
                            <span class="earn-unit">箱</span>
                        </div>
                    </div>
                </div>
                <!-- 累计支付 -->
                <div class="total-earn-box">
                    <div class="total-earn-item">
                        <img
                            class="earn_icon"
                            src="@/assets/img/bill/2023/icon_buy_good.png"
                            alt=""
                        />
                        <div>
                            <span>累计支付：</span>
                            <span class="earn-num" v-if="eye_ljpay">{{
                                ljpay | formatAmount
                            }}</span>
                            <span class="earn-num" v-else>{{ ljpay_eye }}</span>
                            <span class="earn-unit">元</span>
                        </div>
                    </div>
                </div>
            </template>
            <!-- 海报底部 -->
            <img
                class="poster_footer"
                src="@/assets/img/bill/2023/poster_footer.png"
                alt=""
            />
        </div>
        <!-- 海报内容 end -->
    </div>
</template>

<script>
import { closeWebview } from "@/utils/dsBridge";
import { formatAmount } from "@/utils/index";
import html2canvas from "html2canvas";
import { setLocalStorage } from "@/utils/index";
import { mapGetters } from "vuex";

export default {
    name: "Eight",
    props: {
        isPlay: {
            type: Boolean,
            default: false,
        },
        swiperIndex: {
            type: Number,
            default: 0,
        },
        swiperLength: {
            type: Number,
            default: 0,
        }

    },
    watch: {
        swiperIndex() {
            if (this.swiperIndex == (this.swiperLength - 1)) {
                // 缓存海报
                this.$nextTick(() => {
                    this.initPoster();
                });
            }
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
        ljshouyi() {
            let ljshouyi = 0;
            if (this.shopReport.totalAmt) {
                ljshouyi = this.shopReport.totalAmt;
            }
            return ljshouyi;
        },
        ljexc() {
            let ljexc = 0;
            if (this.shopReport.totalExUser) {
                ljexc = this.shopReport.totalExUser;
            }
            return ljexc;
        },
        ljcoupon() {
            let ljcoupon = 0;
            if (this.shopReport.totalTicketNum) {
                ljcoupon = this.shopReport.totalTicketNum;
            }
            return ljcoupon;
        },
        ljfanhuo() {
            let ljfanhuo = 0;
            if (this.shopReport.totalVerifyNum) {
                ljfanhuo = this.shopReport.totalVerifyNum;
            }
            return ljfanhuo;
        },
        cgorder() {
            let cgorder = 0;
            if (this.shopReport.totalOrderQty) {
                cgorder = this.shopReport.totalOrderQty;
            }
            return cgorder;
        },
        cggood() {
            let cggood = 0;
            if (this.shopReport.totalBuyQty) {
                cggood = this.shopReport.totalBuyQty;
            }
            return cggood;
        },
        ljpay() {
            let ljpay = 0;
            if (this.shopReport.totalPayAmt) {
                ljpay = this.shopReport.totalPayAmt;
            }
            return ljpay;
        }
    },
    data() {
        return {
            manyDay: "8000",
            icon_audio_play: require("@/assets/img/bill/2023/img_audio_play.png"),
            icon_audio_pause: require("@/assets/img/bill/2023/img_audio_pause.png"),
            ljshouyi_eye: "",
            ljexc_eye: "",
            ljcoupon_eye: "",
            ljfanhuo_eye: "",
            cgorder_eye: "",
            cggood_eye: "",
            ljpay_eye: "",
            eye_ljshouyi: true, // 累计收益的显示隐藏
            eye_ljexc: true, // 累计兑奖的显示隐藏
            eye_ljcoupon: true, // 累计卡券的显示隐藏
            eye_ljfanhuo: true, // 累计返货的显示隐藏
            eye_cgorder: true, // 采购订单的显示隐藏
            eye_cggood: true, // 采购商品的显示隐藏
            eye_ljpay: true, // 累计支付的显示隐藏
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
        eyeChange({ eye_name, data_name }) {
            //监听登录的密码输入框，将密文显示为*
            this[eye_name] = !this[eye_name];
            let data_name_eye = data_name + "_eye";
            this[data_name_eye] = String(this[data_name]).replace(/./g, "*");
            
            // this.$nextTick(() => {
            //     this.initPoster();
            // })
        },
        onClickLeft() {
            this.$emit("stopAudio");
            window.close();
            // 调用ios方法返回
            closeWebview();
        },
        audioPlay() {
            this.$emit("audioPlay");
        },
        initPoster() {
            //为避免出现位置偏移的情况，将滚动条置顶
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            html2canvas(this.$refs.posterBox, { scrollY: 0 }).then((canvas) => {
                let dataURL = canvas.toDataURL("image/png");
                console.log("图片信息：", dataURL);
                setLocalStorage("bill_poster_base64", dataURL);
            });
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
    .miniprogramTop {
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
        z-index: -2;
    }
    .bg_page_8_inner {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        width: 375px;
        height: 305px;
        z-index: -1;
    }
    .page_8_title {
        margin-top: 33px;
        width: 258px;
        height: 25px;
    }
    .far-ahead {
        font-size: 26px;
        font-family: Source Han Sans SC, Source Han Sans SC-Medium;
        font-weight: 500;
        text-align: left;
        color: #cfcdd3;
        letter-spacing: 0.78px;
        margin-top: 14px;
    }
    .total-earn-box {
        box-sizing: border-box;
        font-size: 17px;
        font-family: Source Han Sans SC, Source Han Sans SC-Medium;
        font-weight: 500;
        text-align: left;
        color: #cfcdd3;
        letter-spacing: 0.51px;
        .total-earn-item {
            display: flex;
            align-items: center;
        }
        .total-earn-tip {
            display: flex;
            align-items: flex-start;
            box-sizing: border-box;
            opacity: 0.39;
            font-size: 6px;
            font-family: Source Han Sans SC, Source Han Sans SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #ffffff;
        }
        .earn_icon {
            width: 24px;
            height: 24px;
            margin-right: 10px;
        }
        .earn-num {
            font-size: 17px;
            font-family: Source Han Sans SC, Source Han Sans SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #f26d00;
            line-height: 42px;
            letter-spacing: 0.51px;
        }
        .earn-unit {
            font-size: 14px;
            font-family: Source Han Sans SC, Source Han Sans SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #a6a5b5;
            letter-spacing: 0.42px;
            margin-left: 4px;
            margin-right: 8px;
        }
    }
    .mt-14 {
        margin-top: 14px;
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
    .color-orange {
        color: #f26d00;
    }
    .posterBox {
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: 0;
        width: 190px;
        height: auto;
        z-index: -999;
        // z-index: 999;
        padding-top: 50px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .page_8_title {
            margin-left: 10px;
            margin-top: 15px;
            width: 130px;
            height: 13px;
        }
        .logo-box,
        .total-earn-item,
        .far-ahead {
            padding: 0 10px;
        }
        .far-ahead {
            font-size: 13px;
            font-family: Source Han Sans SC, Source Han Sans SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #cfcdd3;
            letter-spacing: 0.78px;
            margin-top: 7px;
        }
        .total-earn-box {
            box-sizing: border-box;
            font-family: Source Han Sans SC, Source Han Sans SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #cfcdd3;
            letter-spacing: 0.51px;
            .total-earn-item {
                font-size: 8px;
                display: flex;
                align-items: center;
            }
            .total-earn-tip-poster {
                opacity: 0.39;
                font-size: 4px;
                font-family: Source Han Sans SC, Source Han Sans SC-Medium;
                font-weight: 500;
                text-align: left;
                color: #ffffff;
                padding-left: 10px;
                // transform: scale(0.1);
            }
            .earn_icon {
                width: 12px;
                height: 12px;
                margin-right: 5px;
            }
            .earn-num {
                font-size: 8px;
                font-family: Source Han Sans SC, Source Han Sans SC-Medium;
                font-weight: 500;
                text-align: left;
                color: #f26d00;
                line-height: 21px;
                letter-spacing: 0.51px;
            }
            .earn-unit {
                font-size: 7px;
                font-family: Source Han Sans SC, Source Han Sans SC-Medium;
                font-weight: 500;
                text-align: left;
                color: #a6a5b5;
                letter-spacing: 0.42px;
                margin-left: 2px;
                margin-right: 4px;
            }
        }

        .poster_footer {
            width: 190px;
            height: 150px;
        }
    }
}
</style>
