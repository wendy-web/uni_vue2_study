<template>
    <div class="app-container">
        <div class="swiper-box">
            <!--主体为swiper标签-->
            <!--属性 :options 绑定的是data中设置的swiper配置项-->
            <!--属性 ref 用于获取该dom元素，在计算属性computed中将被调用-->
            <!--属性 id 为swiper最外层容器设置css样式-->
            <swiper :options="swiperOption" ref="mySwiper" id="mySwiper">
                <!--必须的组件-->
                <!--每页幻灯片使用swiper-slide标签-->
                <!--幻灯片组件生成的标签自带.swiper-slide的类名，但单类名选择器设置的部分css(如宽高)将被覆盖-->
                <swiper-slide
                    class="swiper_slide_item"
                    :class="{ 'swiper-no-swiping': !checked }"
                >
                    <One
                        @swipeToNext="swipeToNext"
                        @changeCheckBox="changeCheckBox"
                        @audioPlay="audioPlay"
                        @stopAudio="stopAudio"
                        :isPlay="isPlay"
                        :swiperLength="swiperLength"
                    />
                </swiper-slide>
                <swiper-slide class="swiper_slide_item">
                    <Two
                        @audioPlay="audioPlay"
                        :isPlay="isPlay"
                        @stopAudio="stopAudio"
                    />
                </swiper-slide>
                <!-- 累计开箱有数据、惠商时候才显示 -->
                <swiper-slide
                    class="swiper_slide_item"
                    v-if="
                        shopReport &&
                        shopReport.openBox > 0 &&
                        shopReport.hsFlag > 0
                    "
                >
                    <Three
                        @audioPlay="audioPlay"
                        :isPlay="isPlay"
                        @stopAudio="stopAudio"
                    />
                </swiper-slide>
                <!-- 累计收益合计存在才显示 -->
                <swiper-slide
                    class="swiper_slide_item"
                    v-if="shopReport && shopReport.totalIncomeAmt > 0"
                >
                    <Four
                        @audioPlay="audioPlay"
                        :isPlay="isPlay"
                        @stopAudio="stopAudio"
                    />
                </swiper-slide>
                <!-- 累计获得奖券数据为0不显示 -->
                <swiper-slide
                    class="swiper_slide_item"
                    v-if="shopReport && shopReport.getRewardTicketQty > 0"
                >
                    <Five
                        @audioPlay="audioPlay"
                        @stopAudio="stopAudio"
                        :isPlay="isPlay"
                        :swiperIndex="activeIndex"
                    />
                </swiper-slide>
                <!-- 惠商系统显示 累计采购订单有数据才显示 -->
                <swiper-slide
                    class="swiper_slide_item"
                    v-if="
                        shopReport &&
                        shopReport.hsFlag > 0 &&
                        shopReport.buyOrderQty > 0
                    "
                >
                    <Six
                        @audioPlay="audioPlay"
                        @stopAudio="stopAudio"
                        :isPlay="isPlay"
                    />
                </swiper-slide>
                <!-- 第七页 付出的一年：兑奖人数为0 不显示 -->
                <swiper-slide class="swiper_slide_item" v-if=" shopReport &&
                        shopReport.exUserQty > 0">
                    <Seven
                        @audioPlay="audioPlay"
                        @stopAudio="stopAudio"
                        :isPlay="isPlay"
                    />
                </swiper-slide>
                <swiper-slide class="swiper_slide_item">
                    <Eight
                        @audioPlay="audioPlay"
                        @stopAudio="stopAudio"
                        :isPlay="isPlay"
                        :swiperIndex="activeIndex"
                        :swiperLength="swiperLength"
                    />
                </swiper-slide>
                <!-- 最后一页 swiper-no-swiping 不可滑动 -->
                <swiper-slide class="swiper_slide_item">
                    <Nine
                        @audioPlay="audioPlay"
                        @stopAudio="stopAudio"
                        @lookAgain="lookAgain"
                        :isPlay="isPlay"
                        :swiperIndex="activeIndex"
                        :swiperLength="swiperLength"
                    />
                </swiper-slide>
                <!-- 可选的控件 -->
                <!--分页器-->
                <!-- <div class="swiper-pagination" slot="pagination"></div> -->
                <!--滚动条-->
                <!-- <div class="swiper-scrollbar" slot="scrollbar"></div> -->
                <!--前进后退按钮-->
                <!-- <div class="swiper-button-prev" slot="button-prev"></div> -->
                <!-- <div class="swiper-button-next" slot="button-next"></div> -->
            </swiper>
        </div>

        <!--配置自定义的页面跳转按钮，to(page)为自定义方法，其内调用了swiper的内置方法-->
        <!-- <button @click="to(1)">点击跳转到Slide 1</button>
        <button @click="to(2)">点击跳转到Slide 2</button>
        <button @click="to(3)">点击跳转到Slide 3</button> -->
        <audio
            id="audio"
            ref="audioRef"
            loop
            autoplay="true"
            hidden
            @ended="audioFinished"
        >
            <!-- <source src="../../../assets/mp3/bill2023.mp3" type="audio/mpeg" /> -->
            <source :src="audioUrl" type="audio/mpeg" />
        </audio>
    </div>
</template>
    
<script>
import One from "@/components/swiperItem/one";
import Two from "@/components/swiperItem/two";
import Three from "@/components/swiperItem/three";
import Four from "@/components/swiperItem/Four";
import Five from "@/components/swiperItem/Five";
import Six from "@/components/swiperItem/Six";
import Seven from "@/components/swiperItem/Seven";
import Eight from "@/components/swiperItem/Eight";
import Nine from "@/components/swiperItem/Nine";
import { swiperAnimateCache, swiperAnimate } from "@/utils/animate";
import { mapMutations, mapActions, mapGetters } from "vuex";
import { initTokenBridge } from "@/utils/dsBridge";
var wx = require("weixin-js-sdk");
export default {
    name: "Bill2023",
    components: {
        One,
        Two,
        Three,
        Four,
        Five,
        Six,
        Seven,
        Eight,
        Nine,
    },

    data() {
        return {
            isPlay: false,
            audioUrl: require("@/assets/mp3/bill2023.mp3"),
            //swiperOption：swiper配置项信息，需要绑定在swiper标签的 :option 属性中
            swiperOption: {
                //幻灯片放映方向
                direction: "vertical", //通常不与左右按钮一同使用
                // preventClicksPropagation: true,
                //分页器配置项
                pagination: {
                    el: ".swiper-pagination", //分页器的类名
                    clickable: true, // 点击分页器跳切换到相应的幻灯片
                    // type: "bullets" | "progressbar" | "fraction", //小圆点|进度条|数字页码
                    type: "fraction", //小圆点|进度条|数字页码
                    dynamicBullets: true, //动态小圆点(type:'bullets'时)
                    //自定义分页器，需设置样式
                    renderBullet(index, className) {
                        return `<span class="${className} swiper-pagination-bullet-custom">${
                            index + 1
                        }</span>`;
                    },
                },

                //前进后退按钮
                navigation: {
                    prevEl: ".swiper-button-prev",
                    nextEl: ".swiper-button-next",
                },

                //滚动条：移除此配置 控制台不报错 TypeError: Cannot read property 'removeEventListener' of undefined
                // scrollbar: {
                //     el: ".swiper-scrollbar",
                //     hide: true,
                // },

                //幻灯片播放配置项
                loop: false, //是否循环播放
                speed: 1000, // 发生页面切换动画时，动画的切换速度
                // autoplay: {
                //     delay: 2000, // 幻灯片停留时间
                //     disableOnInteraction: false, // 用户操作swiper之后，是否禁止autoplay
                //     stopOnLastSlide: true, // 切换到最后一个slide时是否停止自动切换。（loop模式下无效）。
                // },
                autoplay: false,
                on: {
                    // slideChangeTransitionEnd: function () {
                    //     // console.log(this.activeIndex); //每次切换结束时，在控制台打印现在是第几个slide
                    //     this.activeIdx = this.activeIndex;
                    // },
                    // 初始化
                    init: () => {
                        // Swiper初始化，需要放在$nextTick()中，否则可能会获取不到元素
                        this.$nextTick(() => {
                            console.log("swiper初始化完成");
                            var mySwiper = this.$refs.mySwiper.$swiper;
                            //隐藏动画元素
                            swiperAnimateCache(mySwiper);
                            //初始化完成开始动画
                            swiperAnimate(mySwiper);
                            this.initSwiperLength();
                        });
                    },

                    // 翻页
                    slideChange: () => {
                        console.log(
                            "slideChange=====>",
                            this.$refs.mySwiper.$swiper.activeIndex
                        );

                        // 记录当前页index
                        this.activeIndex =
                            this.$refs.mySwiper.$swiper.activeIndex;
                        this.initSwiperLength();
                    },

                    slideChangeTransitionStart: () => {
                        //每个slide切换结束时也运行当前slide动画
                        swiperAnimate(this.$refs.mySwiper.$swiper);
                    },
                },
            },
            activeIndex: 0,
            isMounted: false,
            checked: false, // 默认未勾选隐私协议
            swiperLength: 9, // 默认swiper 页数
        };
    },

    //计算属性
    computed: {
        ...mapGetters(["billInfo"]),
        shopReport() {
            if (this.billInfo && this.billInfo.shopReport) {
                return this.billInfo.shopReport;
            }
            return {};
        },
        mySwiper() {
            // this.$nextTick(() => {
            //     let swiper=null;
            //     if ( this.isMounted ) swiper = this.$refs.mySwiper.$swiper;
            //     // swiper = this.$refs.mySwiper.$swiper;
            //     return swiper;
            // })
            // return null;
            let swiper = null;
            if (this.isMounted) swiper = this.$refs.mySwiper.$swiper;
            // swiper = this.$refs.mySwiper.$swiper;
            return swiper;
        },
        hideLoading() {
            let hideLoading = this.$route.params.hideLoading || false;
            return hideLoading;
        },
        // 动态获取 swiper-item 个数
        // swiperLength() {
        //     let children = 0;
        //     if(this.$refs.mySwiper.$children){
        //         children = this.$refs.mySwiper.$children.length;
        //     }
        //     console.log('swiperLength:', children);
        //     return children;
        // },
    },
    created() {
        console.log("page create");
        window["loginH5"] = (token) => {
            this.initToken(token);
        };
        window.showInfoFromJava = (token) => {
            this.initToken(token);
        };
    },
    mounted() {
        console.log("page mounted");
        //获取swiper实例
        this.isMounted;
        this.initRouteParams();
        console.log("wx.miniProgram:", wx.miniProgram);
        wx.miniProgram.getEnv((res) => {
            console.log("wx.miniProgram.getEnv:", res); // true
            if (res.miniprogram) {
                this.setMiniprogram(true);
            }
        });
        this.playAudio();
    },
    activated() {
        //获取swiper实例
        console.log("activated:", this.mySwiper);
    },
    beforeDestroy() {
        this.$refs.audioRef.pause();
    },
    //设置自定义的按钮，点击后将前往目标也页
    methods: {
        ...mapMutations({
            setToken: "login/setToken",
            setMiniprogram: "app/setMiniprogram",
        }),
        ...mapActions({
            getBillInfo: "bill/getBillInfo",
        }),
        initToken(token) {
            console.log("initToken:", token);
            this.setToken(token);
            // 获取用户信息
            this.getBillInfo();
        },
        // 初始化路由参数
        initRouteParams() {
            let query = this.$route.query;
            console.log("query:", query);
            // 路由传参
            if (query.token) {
                this.initToken(query.token);
            }
            // 请求app方法获取token
            initTokenBridge().then((token) => {
                this.initToken(token);
            });
            if (window.launcher) {
                // 判断 launcher 对象是否存在
                // 此处的 launcher 要和 第3步中定义的 launcher 保持一致
                // JS 调用 Android 的方法
                window.launcher.getAppToken();
            }
        },
        to(index) {
            this.swiper.slideTo(index);
        },
        openPage() {
            console.log("openPage:", this.mySwiper);
            // this.$router.push({
            //     name: "About",
            // });
        },
        // 再看一次：跳转到指定index
        lookAgain() {
            const mySwiper = this.$refs.mySwiper.$swiper;

            console.log("再看一次:::::", mySwiper);
            mySwiper.slideTo(0, 0, false);
            swiperAnimateCache(mySwiper);
            //初始化完成开始动画
            swiperAnimate(mySwiper);
        },
        // 音频播放
        audioPlay() {
            let audio = document.getElementById("audio");
            let isPlay = !this.isPlay;
            if (isPlay) {
                audio.play();
                this.isPlay = true;
            } else {
                audio.pause();
                this.isPlay = false;
            }
        },
        audioFinished() {
            // let audio = document.getElementById("audio");
            // audio.play();
            // this.isPlay = true;
        },
        // 播放音频
        playAudio() {
            let audio = document.getElementById("audio");
            audio.play();
            //视频元素可以选择静音后再播放,提示用户打开声音
            audio.muted = true; //打开静音
            audio.play();

            //判断当前是否可以用播放声音
            const ctx = new AudioContext();
            const canAutoPlay = ctx.state === "running"; //能播放声音返回running
            ctx.close();
            console.log("ctx.state:", ctx.state);
            if (canAutoPlay) {
                this.isPlay = !this.isPlay;
                audio.muted = false; //取消静音
            }
            // 单独处理微信内置浏览器自动播放
            document.addEventListener(
                "WeixinJSBridgeReady",
                () => {
                    audio.play();
                    this.isPlay = true;
                    audio.muted = false; //打开静音
                },
                false
            );
        },
        stopAudio() {
            this.isPlay = false;
            this.$refs.audioRef.pause();
        },
        // 监听隐私协议勾选状态
        changeCheckBox(checked) {
            console.log("changeCheckbox:", checked);
            this.checked = checked;
        },
        // 切换至下一页
        swipeToNext() {
            const mySwiper = this.$refs.mySwiper.$swiper;
            let index = this.activeIndex + 1;
            mySwiper.slideTo(index, 1000, false);
            swiperAnimateCache(mySwiper);
            //初始化完成开始动画
            swiperAnimate(mySwiper);
        },
        initSwiperLength() {
            let swiperLength = this.swiperLength;
            if (this.$refs.mySwiper.$children) {
                swiperLength = this.$refs.mySwiper.$children.length;
            }
            this.swiperLength = swiperLength;
        },
    },
    watch: {
        isPlay(playing) {
            let audio = document.getElementById("audio");
            if (playing) {
                audio.play();
            } else {
                audio.pause();
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.app-container {
    box-sizing: border-box;
    // width: 100vw;
    max-width: 750px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 atuo;
    height: 100vh;
    overflow: hidden;
    .swiper-box {
        max-width: 750px;
        min-width: 100%;
        box-sizing: border-box;
        position: relative;
        flex: 1;
        height: 100%;
    }
}
#mySwiper {
    width: 100%;
    height: 100%;
}
.swiper-slide.swiper_slide_item {
    height: 300px;
}
#mySwiper /deep/ .swiper-pagination-bullet-custom.swiper-pagination-bullet {
    width: 15px !important;
    height: 15px !important;
}
</style>

    