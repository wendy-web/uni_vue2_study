<template>
    <div class="page-box">
        <div class="lottie-box">
            <lottie
                :options="defaultOptions"
                :height="lottieHeight"
                :width="lottieWidth"
                v-on:animCreated="handleAnimation"
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
            <!-- 感恩相遇 -->
            <img
                class="ani page_title"
                swiper-animate-effect="fadeInUp"
                swiper-animate-duration="1s"
                swiper-animate-delay="1s"
                src="@/assets/img/bill/2023/page_9_title.png"
                alt=""
            />
            <!-- 结束语 -->
            <img
                class="ani page_end"
                swiper-animate-effect="fadeIn"
                swiper-animate-duration="1s"
                swiper-animate-delay="2s"
                src="@/assets/img/bill/2023/page_9_end.png"
                alt=""
            />
        </div>
        <!-- 动画结束以后显示的内容 -->
        <div
            class="ani lottie-end-box"
            swiper-animate-effect="fadeIn"
            swiper-animate-duration="1s"
            swiper-animate-delay="2s"
        >
            <img
                class="bg_page_9"
                src="@/assets/img/bill/2023/bg_page_9.png"
                alt=""
            />
            <img
                class="bg_page_9_inner"
                src="@/assets/img/bill/2023/bg_page_9_inner.png"
                alt=""
            />
        </div>
        <div
            class="ani footer-box safe-area"
            swiper-animate-effect="fadeIn"
            swiper-animate-duration="1s"
            swiper-animate-delay="2s"
        >
            <div @click="downImg" class="btn-save">保存账单</div>
            <div @click="lookAgain" class="btn-look">
                <span>再看一次</span>
                <van-icon class="arrow-right" name="arrow" color="#e6e6e6" />
            </div>
            <img :src="dataURL" alt="" v-show="!firstFlag" />
        </div>
    </div>
</template>

<script>
import { closeWebview } from "@/utils/dsBridge";
import { lottieNineData } from "@/assets/lottie/nine/index.js";
import { getLocalStorage } from "@/utils/index";
import { wxShareBridge } from "@/utils/dsBridge.js";
import { mapGetters } from "vuex";
var wx = require("weixin-js-sdk");

export default {
    name: "Nine",
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
        },
    },
    watch: {
        swiperIndex() {
            if (this.swiperIndex < this.swiperLength - 1) return;
            this.lottiePlay();
        },
    },
    computed: {
        ...mapGetters(["isMiniprogram"]),
    },
    data() {
        return {
            lottieHeight: "100vh",
            lottieWidth: "100vw",
            imageUrl: "https://www.baidu.com/img/flexible/logo/pc/result@2.png",
            firstFlag: true,
            dataURL: "",
            anim: {},
            defaultOptions: {
                animationData: lottieNineData,
                loop: false,
                autoplay: false,
            },
            icon_audio_play: require("@/assets/img/bill/2023/img_audio_play.png"),
            icon_audio_pause: require("@/assets/img/bill/2023/img_audio_pause.png"),
        };
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
        handleAnimation(anim) {
            this.anim = anim;
        },
        lottiePlay() {
            // 先暂停再播放
            this.anim.stop();
            setTimeout(() => {
                this.anim.play();
            }, 1000);
        },
        audioPlay() {
            this.$emit("audioPlay");
        },
        lookAgain() {
            console.log("再看一次");
            this.$emit("lookAgain");
        },
        downImg() {
            let bill_poster_base64 = getLocalStorage("bill_poster_base64");
            console.log("取本地缓存图片:", bill_poster_base64);
            if (bill_poster_base64) {
                let obj = {
                    type: 4,
                    imgUrl: bill_poster_base64.slice(22),
                };
                const str = JSON.stringify(obj);
                console.log("app 传参:", bill_poster_base64.slice(22));

                wxShareBridge(str);
                // dsBridge.call("getWXShare", str, function(res) {
                // 	console.log(res)
                // })
                if (window.launcher) {
                    // 判断 launcher 对象是否存在
                    // 此处的 launcher 要和 第3步中定义的 launcher 保持一致
                    // JS 调用 Android 的方法
                    window.launcher.getWXShare(str);
                }
                // 微信小程序
                wx.miniProgram.postMessage({
                    data: {
                        imgData: bill_poster_base64, // 刚才拿到的base64 数据
                    },
                });
                // 返回页面才能触发小程序接受参数
                wx.miniProgram.navigateBack();
            }
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
    padding-bottom: 28px;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .lottie-box {
        position: absolute;
        z-index: -20;
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
        position: relative;
        z-index: 1;
        flex: 1;
        .page_title {
            margin-top: 35px;
            width: 169px;
            height: 26px;
        }
        .page_end {
            margin-top: 35px;
            width: 169px;
            height: 181px;
        }
    }
    .miniprogramTop {
        padding-top: 20px;
    }
    .footer-box {
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 14px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        text-align: center;
        color: #ffffff;
        line-height: 18px;
        .btn-save {
            width: 270px;
            height: 48px;
            background: linear-gradient(0deg, #eb0000, #fc3c3c 50%, #f17259);
            border: 1px solid #fbcfa0;
            border-radius: 25px;
            box-shadow: 0px 2px 10px 0px #ffffff inset;
            display: flex;
            align-items: center;
            justify-content: center;

            font-size: 20px;
            font-family: PingFang SC, PingFang SC-Medium;
            font-weight: 500;
            color: #ffffff;
        }
        .btn-look {
            margin-top: 10px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            .arrow-right {
                margin-left: 2px;
            }
        }
    }
    .lottie-end-box {
        position: absolute;
        z-index: -2;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        .bg_page_9 {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -3;
        }
        .bg_page_9_inner {
            width: 375px;
            height: 402px;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            margin: 0 auto;
            z-index: -2;
        }
    }
}
</style>
