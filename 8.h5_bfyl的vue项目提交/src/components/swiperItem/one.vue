<template>
    <div class="page-box">
        <div class="loading-box" v-if="!billLoaded">
            <!-- loading 背景 -->
            <img
                class="bg_loading"
                src="@/assets/img/bill/2023/bg_loading.jpg"
                alt=""
            />
            <!-- 进度条 -->
            <div class="loading-bar">
                <!-- 天天logo -->
                <div class="icon_tt_box">
                    <img
                        class="icon_tt slide-from-left"
                        :style="{ left: `${progress*0.84}%` }"
                        src="@/assets/img/bill/2023/icon_tt.png"
                        alt=""
                    />
                </div>
                <div class="progress-bar-item">
                    <progress-bar
                        :val="progress"
                        bg-color="#393855"
                        bar-color="#8b50ff"
                        :bar-border-radius="8"
                        :size="10"
                    ></progress-bar>
                </div>
                <div class="progress-num">{{ progress }}%</div>
            </div>
        </div>

        <div class="lottie-box">
            <lottie
                :options="defaultOptions"
                :height="lottieHeight"
                :width="lottieWidth"
                @animCreated="handleAnimation"
            />
        </div>
        <!-- 进度条已加载并且 非 小程序环境 -->
        <van-nav-bar
            v-if="progress >= 100 && !isMiniprogram"
            title=""
            left-text=""
            right-text=""
            :left-arrow="true"
            :fixed="true"
            :safe-area-inset-top="true"
            :placeholder="true"
            @click-left="onClickLeft"
        />
        <!-- 顶部音乐播放暂停 -->
        <img
            v-if="progress >= 100"
            class="icon_audios"
            :class="{ 'rotate-center': isPlay }"
            :src="isPlay ? icon_audio_play : icon_audio_pause"
            alt=""
            @click="audioPlay"
        />

        <van-button
            type="default"
            @click="checkBox"
            class="btn_start"
            :class="{ 'pulsate-bck': btnAnimated && progress >= 100 }"
            @animationend="btnAnimated = false"
        >
            <img
                class="btn_start"
                src="@/assets/img/bill/2023/btn_start.png"
                alt=""
            />
        </van-button>
        <div
            class="ani check-box"
            swiper-animate-effect=""
            swiper-animate-duration="0.5s"
            swiper-animate-delay="0s"
            :class="{ pulse: isAnimated }"
            @animationend="isAnimated = false"
        >
            <!-- 我已阅读并同意《2023年度账单用户服务协议》 -->
            <van-checkbox
                @change="changeCheckBox"
                v-model="checked"
                checked-color="#a6a5b5"
                shape="square"
                icon-size="14"
                >我已阅读并同意</van-checkbox
            >
            <div @click="viewService">《2023年度账单用户服务协议》</div>
        </div>
    </div>
</template>

<script>
import { Toast } from "vant";
import { homeData } from "@/assets/lottie/home/index.js"; //小飞机json资源文件,为什么是js文件，下面详解
import { closeWebview } from "@/utils/dsBridge";
import ProgressBar from "vue-simple-progress";
var timer = null;
import { mapGetters, mapMutations } from "vuex";
export default {
    name: "One",
    props: {
        isPlay: {
            type: Boolean,
            default: false,
        },
        swiperLength: {
            type: Number,
            default: 0,
        },
        
    },
    components: {
        ProgressBar,
    },
    computed: {
       ...mapGetters(["billLoaded", "isMiniprogram","billInfo"]),
    },
    data() {
        return {
            lottieHeight:'100vh',
            lottieWidth:'100vw',
            progress: 0,
            checked: false, // 勾选隐私协议
            isAnimated: false, // 执行动画
            btnAnimated: true,
            defaultOptions: { animationData: homeData },
            anim: {},
            icon_audio_play: require("@/assets/img/bill/2023/img_audio_play.png"),
            icon_audio_pause: require("@/assets/img/bill/2023/img_audio_pause.png"),
        };
    },
    created() {
        console.log("one created");
    },
    activated() {
        console.log("one activated");

    },
    mounted() {
        console.log("one mounted billInfo：",this.billInfo);

        timer = setInterval(this.increaseProgress, 100);
    },
    deactivated() {},
    beforeDestroy() {
        clearInterval(timer);
    },
    methods: {
        ...mapMutations({
            setBillLoaded: "app/setBillLoaded",
        }),
        onClickLeft() {
            this.$emit("stopAudio");
            window.close();
            // 调用ios方法返回
            closeWebview();
        },
        // 检查是否勾选隐私协议
        checkBox() {
            if (this.checked) {
                console.log("勾选了隐私协议，触发下一页");
                this.$emit("swipeToNext");
            } else {
                Toast("请勾选相关隐私协议");
                console.log("未勾选隐私协议");
                this.isAnimated = true;
            }
            console.log("one swiperLength：",this.swiperLength);
        },
        viewService(){
            this.$router.push({
                name: 'Service'
            })
        },
        changeCheckBox(event) {
            this.$emit("changeCheckBox", event);
        },
        handleAnimation: function (anim) {
            this.anim = anim;
        },
        audioPlay() {
            this.$emit("audioPlay");
        },
        increaseProgress() {
            if (this.progress < 100) {
                // let random = Math.floor(Math.random() * 10);
                // let count = this.progress + random;
                let count = this.progress + 4;
                if (count >= 100) {
                    this.progress = 100;
                    this.setBillLoaded(true)
                } else {
                    this.progress = count;
                }
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.page-box {
    box-sizing: border-box;
    height: 100%;
    font-size: 22px;
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    overflow: hidden;
    .loading-bar {
        margin: 0 30px;
        .icon_tt_box {
            width: 100%;
            height: 100px;
            position: relative;
            overflow: hidden;
            z-index: 999;
        }
        .icon_tt {
            width: 41px;
            height: 43px;
            position: absolute;
            left: 0;
            bottom: 0;
            transform: translateX(0px);
        }
        .progress-bar-item {
            z-index: 2;
        }
        .progress-num {
            margin-top: 20px;
            font-size: 18px;
            font-family: Source Han Sans SC, Source Han Sans SC-Medium;
            font-weight: 500;
            color: #cfcdd3;
            letter-spacing: 0.54px;
            text-align: center;
        }

        @keyframes slide-from-left {
            from {
                transform: translateX(0px);
            }

            to {
                transform: translateX(100%);
            }
        }
        /* ----------------------------------------------
 * Generated by Animista on 2023-12-20 19:7:11
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info. 
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

        /**
 * ----------------------------------------
 * animation shake-vertical
 * ----------------------------------------
 */
        @-webkit-keyframes shake-vertical {
            0%,
            100% {
                -webkit-transform: translateY(0);
                transform: translateY(0);
            }
            10%,
            30%,
            50%,
            70% {
                -webkit-transform: translateY(-8px);
                transform: translateY(-8px);
            }
            20%,
            40%,
            60% {
                -webkit-transform: translateY(8px);
                transform: translateY(8px);
            }
            80% {
                -webkit-transform: translateY(6.4px);
                transform: translateY(6.4px);
            }
            90% {
                -webkit-transform: translateY(-6.4px);
                transform: translateY(-6.4px);
            }
        }
        @keyframes shake-vertical {
            0%,
            100% {
                -webkit-transform: translateY(0);
                transform: translateY(0);
            }
            10%,
            30%,
            50%,
            70% {
                -webkit-transform: translateY(-8px);
                transform: translateY(-8px);
            }
            20%,
            40%,
            60% {
                -webkit-transform: translateY(8px);
                transform: translateY(8px);
            }
            80% {
                -webkit-transform: translateY(6.4px);
                transform: translateY(6.4px);
            }
            90% {
                -webkit-transform: translateY(-6.4px);
                transform: translateY(-6.4px);
            }
        }

        .slide-from-left {
            animation: shake-vertical 5s cubic-bezier(0.455, 0.03, 0.515, 0.955)
                infinite both;
        }
    }
    .icon_audios {
        position: absolute;
        right: 22px;
        top: 30px;
        width: 25px;
        height: 25px;
        z-index: 999;
    }
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
    .check-box {
        box-sizing: border-box;
        margin-top: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-family: Source Han Sans SC, Source Han Sans SC-Medium;
        font-weight: 500;
        text-align: left;
        color: #a6a5b5;
        letter-spacing: 0.33px;
        padding-bottom: 30px;
        ::v-deep .van-checkbox {
            flex-shrink: 0;
            align-self: stretch;
            .van-checkbox__label {
                flex: 1;
                line-height: auto;
                font-size: 11px;
                font-family: Source Han Sans SC, Source Han Sans SC-Medium;
                font-weight: 500;
                text-align: left;
                color: #a6a5b5;
                letter-spacing: 0.33px;
            }
        }
    }
    .btn_start {
        width: 225px;
        height: 57px;
        background-color: transparent;
        border: none;
        margin: 0 auto;
    }
}
/deep/ .van-checkbox__icon .van-icon {
    border: 1px solid #a6a5b5;
    border-radius: 2px;
}

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
</style>
