<template>
    <div class="page-box" id="invite-box">
        <van-nav-bar
            :title="title"
            left-text=""
            right-text=""
            :left-arrow="true"
            :fixed="true"
            :safe-area-inset-top="true"
            :placeholder="false"
            @click-left="onClickLeft"
        />

        <div
            class="content-box safe-area"
            ref="inviteBox"
        >
            <!-- banner图 -->
            <div class="banner-box">
                <img
                    class="banner_invite"
                    src="@/static/creditCard/banner_invite.png"
                    mode="aspectFit"
                />
            </div>
            <!-- 限时邀请 -->
            <div class="flex-row">
                <img
                    class="icon_bar_left"
                    src="@/static/creditCard/invite_bar_left.png"
                    mode="aspectFit"
                />
                <div class="invite-title">限时邀请 扫码办理</div>
                <img
                    class="icon_bar_right"
                    src="@/static/creditCard/invite_bar_right.png"
                    mode="aspectFit"
                />
            </div>
            <div class="invite-box">
                <div class="invite-item">
                    <!-- 背景 -->
                    <img
                        class="bg_invite"
                        src="@/static/creditCard/bg_invite.png"
                        mode="aspectFit"
                    />
                    <div class="qrcode-box">
                        <!-- 二维码 -->
                        <div class="img-qrcode">
                            <vue-qr
                                v-if="qrOptions.code"
                                :correctLevel="3"
                                :autoColor="false"
                                :text="qrOptions.code"
                                :size="qrOptions.size"
                                :margin="0"
                                :logoMargin="3"
                            ></vue-qr>
                            <img
                                class="icon_gift"
                                src="@/static/creditCard/icon_gift.png"
                                mode="aspectFit"
                            />
                        </div>
                        <div class="qrcode-border"></div>
                    </div>
                    <!-- 邀请按钮 -->
                    <div class="btn-invite" @click="showSharePop">邀请好友</div>
                    <div class="flex-row mt-72">
                        <img
                            class="icon_greybar_left"
                            src="@/static/creditCard/icon_greybar_left.png"
                            mode="aspectFit"
                        />
                        <div class="invite-subtitle">邀请步骤</div>
                        <img
                            class="icon_greybar_right"
                            src="@/static/creditCard/icon_greybar_right.png"
                            mode="aspectFit"
                        />
                    </div>
                    <div class="step-box">
                        <div
                            class="step-item"
                            v-for="(item, index) in inviteStep"
                            :key="index"
                        >
                            <!-- <img class="icon_step" :src="'/static/creditCard/'+item.icon+'.png'" mode="aspectFit" /> -->
                            <img
                                class="icon_step"
                                :src="item.icon"
                                mode="aspectFit"
                            />
                            <div>{{ item.name }}</div>
                            <!-- 背景水印 -->
                            <!-- <img class="icon_num" :src="'/static/creditCard/icon_num_'+index+'.png'" mode="aspectFit" /> -->
                            <img
                                class="icon_num"
                                :src="item.icon_num"
                                mode="aspectFit"
                            />

                            <!-- 右边箭头 -->
                            <img
                                class="icon_arrow_right"
                                v-if="index < inviteStep.length - 1"
                                src="@/static/creditCard/icon_arrow_right.png"
                                mode="aspectFit"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <!-- 专属权益、常见问题 -->
            <div class="faq-box">
                <div class="flex-row">
                    <img
                        class="icon_greybar_left"
                        src="@/static/creditCard/icon_greybar_left.png"
                        mode="aspectFit"
                    />
                    <div class="invite-subtitle">专属权益</div>
                    <img
                        class="icon_greybar_right"
                        src="@/static/creditCard/icon_greybar_right.png"
                        mode="aspectFit"
                    />
                </div>
                <div class="flex-row img-park-box">
                    <img
                        class="img_park"
                        src="@/static/creditCard/img_park.png"
                        mode="aspectFit"
                    />
                    <img
                        class="img_park"
                        src="@/static/creditCard/img_teeth_clean.png"
                        mode="aspectFit"
                    />
                </div>
                <div class="flex-row">
                    <img
                        class="icon_greybar_left"
                        src="@/static/creditCard/icon_greybar_left.png"
                        mode="aspectFit"
                    />
                    <div class="invite-subtitle">常见问题</div>
                    <img
                        class="icon_greybar_right"
                        src="@/static/creditCard/icon_greybar_right.png"
                        mode="aspectFit"
                    />
                </div>
                <div class="faq-title">现金券是什么？</div>
                <div class="faq-subtitle">
                    现金券可用在彬纷有礼APP进货时抵扣金额。
                </div>
                <div class="faq-title">现金券何时到账？</div>
                <div class="faq-subtitle">
                    在固定的时间内中信银行核验后，由平台统一发放到账。
                </div>
            </div>
        </div>
        <!-- 报名成功弹窗 -->
        <van-popup v-model="signPopShow" round :close-on-click-overlay="false">
            <div class="pop-box">
                <div class="pop-title">审核通过</div>
                <div class="pop-tips">恭喜您加入专属信用卡赚钱计划</div>
                <div class="btn-iknow" @click="onclosePop">我知道了</div>
            </div>
        </van-popup>
        <!-- 海报弹窗 -->

        <div
            class="pop-poster-box"
            v-if="showShare"
            :style="{
                '--posterHeight': posterHeight + 'px',
                '--shareBoxHeight': shareBoxHeight + 'px',
            }"
        >
            <img class="img_poster" :src="userInfo.qr_url" mode="aspectFit" />
        </div>
        <!-- 邀请面板 -->
        <van-share-sheet
            ref="shareSheet"
            v-model="showShare"
            title="分享到"
            :options="options"
            @select="onSelect"
            class="pop-share-box"
        />
    </div>
</template>

<script>
import { wxShareBridge } from "@/utils/dsBridge.js";
import { getNavbarData } from "@/utils/xhNavbar.js";
import { mapGetters, mapActions } from "vuex";
import { Dialog } from "vant";
import VueQr from "vue-qr";
export default {
    name: "ZXInvite",
    computed: {
        ...mapGetters(["userInfo"]),
        qrOptions() {
            let obj = {
                code: this.userInfo?.seo_url,
                size: 160,
            };
            return obj;
        },
    },
    data() {
        return {
            title: "VIP专属信用卡",
            inviteStep: [
                {
                    name: "点击邀请好友",
                    icon: require("@/static/creditCard/icon_link.png"),
                    icon_num: require("@/static/creditCard/icon_num_0.png"),
                },
                {
                    name: "分享到微信好友",
                    icon: require("@/static/creditCard/icon_wechat.png"),
                    icon_num: require("@/static/creditCard/icon_num_1.png"),
                },
                {
                    name: "好友长按办理",
                    icon: require("@/static/creditCard/icon_check.png"),
                    icon_num: require("@/static/creditCard/icon_num_2.png"),
                },
            ],
            signPopShow: false, //报名成功弹窗
            showShare: false, // 邀请面板
            options: [
                {
                    id: 1,
                    name: "微信",
                    icon: require("@/static/creditCard/icon_share_wechat.png"),
                },
                {
                    id: 2,
                    name: "朋友圈",
                    icon: require("@/static/creditCard/icon_wechat_circle.png"),
                },
                {
                    id: 3,
                    name: "保存图片",
                    icon: require("@/static/creditCard/icon_download.png"),
                },
            ],
            screenHeight: 0, //屏幕高度
            posterHeight: 0, //海报的高度
            shareBoxHeight: 0, //分享弹窗的高度
            isScroll: false,
            navHeight: 0,
        };
    },
    components: {
        VueQr,
    },
    created() {
        /*导航栏高度*/
        getNavbarData().then((res) => {
            console.log("导航栏高度：", res);
            let { screenHeight, navBarHeight } = res;
            this.screenHeight = screenHeight - navBarHeight;
            this.navHeight = navBarHeight;
        });
        // 初始化邀请码
        this.initQr();
    },
    mounted() {
        // 监听滚动
        // this.box = this.$refs.inviteBox;
        // this.box.addEventListener("scroll", ()=> {
        //     // 在这里编写需要执行的代码
        //     if (this.isScroll) return;
        //     this.isScroll = true;
        // });
    },
    methods: {
        ...mapActions({
            createQr: "login/createQr",
        }),
        onClickLeft() {
            // this.$router.replace('/creditCard');
            this.$router.go(-1);
        },
        onClickRight() {
            this.$router.push({
                name: "ZXInviteDetail",
            });
        },
        signUp() {
            this.signPopShow = true;
        },
        onclosePop() {
            this.signPopShow = false;
        },
        // 显示分享弹窗
        showSharePop() {
            this.showShare = true;
            this.$nextTick(() => {
                this.getNodeInfo();
            });
        },
        // 分享面板选中
        onSelect(option) {
            let { qr_url = "" } = this.userInfo;
            let params = {
                type: option.id,
                imgUrl: qr_url,
            };
            console.log("传参：", params);
            let str = JSON.stringify(params);

            this.showShare = false;
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
        },
        getNodeInfo() {
            let shareSheet = this.$refs.shareSheet;
            console.log("shareSheet", shareSheet.offsetHeight);
            console.log(
                "shareSheet1:",
                document.querySelector(".pop-share-box").offsetHeight
            );
            let shareBoxHeight =
                document.querySelector(".pop-share-box").offsetHeight;
            this.posterHeight = this.screenHeight - shareBoxHeight;
            this.shareBoxHeight = shareBoxHeight + 10;
        },
        initQr() {
            // 分享二维码不存在的时候，才能创建
            if (!this.userInfo.qr_url) {
                this.createQr((res) => {
                    console.log("创建二维码结果:", res);
                    let { code, msg, data } = res;
                    if (code == 1) {
                        this.userInfo = data;
                        return;
                    }
                    Dialog({ message: msg });
                });
            }
        },
    },
};
</script>

<style lang="scss" scoped>
/deep/ .title-text {
    font-size: 32px;
    font-family: PingFang SC, PingFang SC-Semibold;
    font-weight: 600;
    text-align: center;
    color: #333333;
}
/deep/ .van-nav-bar {
    // background-color: transparent;
    z-index: 999;

    .van-icon {
        color: #333333;
    }

    .van-icon-arrow-left {
        font-size: 24px;
    }

    .van-nav-bar__text {
        color: #333333;
    }
}

.navbar-bg-color {
    background-color: #ffffff;
}

/deep/.van-share-sheet__options {
    justify-content: center;
}

.page-box {
    box-sizing: border-box;
    // background-color: #f5f7fa;
    max-width: 750px;
    margin: 0 auto;
    position: relative;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding-top: var(--window-top);
    z-index: 1;

}
.content-box {
    position: relative;
    flex: 1;
    flex-shrink: 0;
    overflow: scroll;
}
.banner-box {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    position: relative;
    top: 0;
    .banner_invite {
        width: 375px;
        height: 358px;
    }
}

.flex-row {
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon_bar_left {
    width: 94px;
    height: 16px;
    margin-right: 8px;
}

.invite-title {
    font-size: 16px;
    font-family: PingFang SC, PingFang SC-Semibold;
    font-weight: 600;
    text-align: center;
    color: #6f0203;
}

.icon_bar_right {
    width: 94px;
    height: 16px;
    margin-left: 8px;
}

.invite-box {
    box-sizing: border-box;
    margin: 16px;

    .invite-item {
        position: relative;
        z-index: 1;
        padding: 20px 12px;
        display: flex;
        flex-direction: column;
        align-items: center;

        .qrcode-box {
            margin: 0 auto;
            box-sizing: border-box;
            position: relative;
            z-index: 1;

            .img-qrcode {
                box-sizing: border-box;
                width: 150px;
                height: 150px;
                border: 0.5px solid #e1e1e1;
                // background-color: tan;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;

                .icon_gift {
                    width: 30px;
                    height: 30px;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    margin: auto;
                }
            }

            .qrcode-border {
                width: 144px;
                height: 152px;
                opacity: 0.5;
                border: 0.5px solid #e3ae8b;
                position: absolute;
                z-index: -1;
                bottom: -10px;
                right: -10px;
            }
        }

        // 背景
        .bg_invite {
            width: 100%;
            height: 389px;
            position: absolute;
            top: 0;
            left: 0;
            z-index: -1;
        }

        .btn-invite {
            width: 198px;
            height: 45px;
            background: #f3242a;
            border-radius: 26px;
            font-size: 16px;
            font-family: HONOR Sans CN, HONOR Sans CN-Black;
            font-weight: 900;
            text-align: center;
            color: #ffffff;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 34px;
        }
    }
}

.invite-subtitle {
    font-size: 16px;
    font-family: PingFang SC, PingFang SC-Semibold;
    font-weight: 600;
    text-align: center;
    color: #333333;
}

.mt-72 {
    margin-top: 36px;
}

.icon_greybar_left {
    width: 86px;
    height: 10px;
    margin-right: 8px;
}

.icon_greybar_right {
    width: 86px;
    height: 10px;
    margin-left: 8px;
}

.step-box {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-top: 10px;

    .step-item {
        position: relative;
        z-index: 1;
        font-size: 13px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        text-align: center;
        color: #333333;

        .icon_step {
            width: 20px;
            height: 20px;
            margin-bottom: 8px;
        }

        .icon_num {
            width: 40px;
            height: 42px;
            // opacity: 0.04;
            position: absolute;
            z-index: -1;
            top: 5px;
            right: 0px;
        }

        .icon_arrow_right {
            width: 11px;
            height: 11px;
            position: absolute;
            top: 5px;
            right: -18px;
        }
    }
}

.faq-box {
    background: #ffffff;
    border-radius: 12px;
    box-sizing: border-box;
    padding: 20px 13px;
    margin: 0 16px;

    .img-park-box {
        margin-top: 16px;
        margin-bottom: 23px;
        justify-content: space-between;
    }

    .img_park {
        width: 151px;
        height: 72px;
    }

    .faq-title {
        position: relative;
        z-index: 1;
        font-size: 16px;
        font-family: PingFang SC, PingFang SC-Semibold;
        font-weight: 600;
        text-align: left;
        color: #333333;
        margin: 22px 0 8px 10px;
    }

    .faq-title::before {
        content: "";
        width: 3px;
        height: 15px;
        background: #f3242a;
        border-radius: 2px;
        position: absolute;
        left: -9px;
        top: 0;
        bottom: 0;
        margin: auto 0;
    }

    .faq-subtitle {
        font-size: 14px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        text-align: left;
        color: #666666;
    }
}

// 报名成功弹窗 start
.pop-box {
    box-sizing: border-box;
    width: 311px;
    min-height: 190px;
    background: #ffffff;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    .pop-title {
        font-size: 18px;
        font-family: PingFang SC, PingFang SC-Semibold;
        font-weight: 600;
        text-align: center;
        color: #333333;
        margin-top: 37px;
    }

    .pop-tips {
        font-size: 14px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        text-align: center;
        color: #333333;
        margin-top: 10px;
    }

    .btn-iknow {
        width: 236px;
        height: 40px;
        background: #f3242a;
        border-radius: 20px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-family: PingFang SC, PingFang SC-Semibold;
        font-weight: 600;
        text-align: center;
        color: #ffffff;
        margin-top: 38px;
    }
}

// 报名弹窗 end

// 海报图片弹窗 start
.pop-poster-box {
    z-index: 999999;
    box-sizing: border-box;
    max-height: var(--posterHeight);
    position: fixed;
    bottom: var(--shareBoxHeight);
    left: 29px;
    right: 29px;
    margin: auto;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;

    .img_poster {
        height: var(--posterHeight);
    }
}

// 海报图片弹窗 end

// 分享面板 start
.pop-share-box {
    max-width: 750px;
    left: 0;
    right: 0;
    margin: 0 auto;
}

// 分享面板 end
</style>
