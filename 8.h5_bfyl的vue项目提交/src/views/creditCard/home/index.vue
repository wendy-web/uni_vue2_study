<template>
    <div class="content">
        <img
            class="bg_page"
            src="@/static/creditCard/bg_page.png"
            mode="aspectFit"
        />
        <!-- 主体内容 -->
        <!--滑动区域 ref='mescroll'不能删, 目的是路由切换时可通过ref调用mescroll-vue组件的beforeRouteEnter方法-->
        <van-nav-bar
            :title="title"
            left-text=""
            right-text=""
            :left-arrow="true"
            :fixed="true"
            :safe-area-inset-top="true"
            :placeholder="true"
            @click-left="onClickLeft"
        />
        <!-- <mescroll-vue
            ref="mescroll"
            :up="mescrollUp"
            :down="mescrollDown"
            @init="mescrollInit"
            class="mescroll-body"
        > -->
        <div  class="mescroll-body safe-area">
            <!-- 专属信用卡 -->
            <div
                class="credit-card-box"
                :style="{ paddingTop: navHeight + 'px' }"
            >
                <img
                    class="img_card_join"
                    src="@/static/creditCard/img_card_join.png"
                    mode="aspectFit"
                />
                <div class="btn-box" v-if="btnType != 3" @click="viewSignUp">
                    <img
                        class="bg_btn_join"
                        src="@/static/creditCard/bg_btn_join.png"
                        mode="aspectFit"
                    />
                    <!-- 立即加入 -->
                    <div v-if="btnType == 0">
                        <div class="btn-name">立即加入</div>
                        <div class="btn-tips" v-if="userInfo">
                            已有{{ userInfo.join_num }}人加入
                        </div>
                        <!-- 点击加入手势 -->
                        <img
                            class="icon_finger"
                            src="@/static/creditCard/icon_finger.png"
                            mode="aspectFit"
                        />
                    </div>
                    <div v-if="btnType == 1">
                        <div class="btn-name">查看</div>
                        <div class="btn-tips" v-if="userInfo">
                            已有{{ userInfo.join_num }}人加入
                        </div>
                    </div>
                    <div v-if="btnType == 2">
                        <div class="btn-name">去赚钱</div>
                        <!-- 已加入 -->
                        <img
                            class="icon_joined"
                            src="@/static/creditCard/icon_joined.png"
                            mode="aspectFit"
                        />
                    </div>
                </div>
                <div v-else class="btn-box">
                    <text class="sign-end" v-if="userInfo">报名已结束</text>
                </div>
            </div>

            <!-- 未启动计划 -->
            <div class="not-started-plan">
                <div class="name">未启动计划</div>
                <div @click="viewPlan(1)" data-type="1">
                    <div class="plan-head-box">
                        <img
                            class="bg_title"
                            src="@/static/creditCard/bg_title.png"
                        />
                        <div>小店有惠</div>
                    </div>
                    <div class="plan-item">
                        <div class="item-intro">
                            <div class="title">「省钱卡」赚钱计划</div>
                            <div>0投入·收益稳·长期赚</div>
                        </div>
                        <div class="btn-detail">立即了解</div>
                        <!-- 右下角水印 -->
                        <div class="water-mark">省钱卡</div>
                    </div>
                </div>
                <div @click="viewPlan(2)" data-type="2">
                    <div class="plan-head-box mt-24">
                        <img
                            class="bg_title"
                            src="@/static/creditCard/bg_title.png"
                        />
                        <div>移动·联通·电信</div>
                    </div>
                    <div class="plan-item">
                        <div class="item-intro">
                            <div class="title">「话费折扣」赚钱计划</div>
                            <div>0投入·转化高·刚需项目</div>
                        </div>
                        <div class="btn-detail">立即了解</div>
                        <!-- 右下角水印 -->
                        <div class="water-mark">话费折扣</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- </mescroll-vue> -->
    </div>
</template>

<script>
// 引入mescroll的vue组件
// import MescrollVue from "mescroll.js/mescroll.vue";
import MescrollMixin from "@/utils/MescrollMixins.js";
import { getNavbarData } from "@/utils/xhNavbar.js";
import { mapGetters, mapMutations, mapActions } from "vuex";
import { closeWebview } from "@/utils/dsBridge";
// import { closeWebview, initTokenBridge } from "@/utils/dsBridge";
import { Dialog } from "vant";

export default {
    name: "Home",
    mixins: [MescrollMixin],
    components: {
        // MescrollVue, // 注册mescroll组件
    },
    computed: {
        ...mapGetters(["userInfo"]),
        btnType() {
            let type = 3;
            if (this.userInfo) {
                let { rem_num = 0, seo_url = "" } = this.userInfo;
                // 剩余可加入数量
                if (rem_num > 0) {
                    type = 0;
                }
                // 是否已参与活动
                if (seo_url) {
                    type = 2;
                }
            }
            return type;
        },
    },
    data() {
        return {
            mescrollDown: {
                //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
                use: false,
            },
            mescroll: null,
            mescrollUp: {
                use: false,
                callback: this.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page, mescroll) { getListData(page); }
                page: {
                    num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
                    size: 10, // 每页数据的数量
                },
                noMoreSize: 5, // 如果列表已无数据,可设置列表的总数量要大于等于5条才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
                toTop: {
                    src: "./static/mescroll/mescroll-totop.png", // 回到顶部按钮的图片路径,支持网络图
                },
                empty: {
                    // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才生效;
                    warpId: "dataList", // 父布局的id;
                    icon: "./static/mescroll/mescroll-empty.png", // 图标,支持网络图
                    tip: "暂无相关数据~", // 提示
                    btntext: "去逛逛 >", // 按钮,默认""
                    btnClick() {
                        // 点击按钮的回调,默认null
                        alert("点击了按钮,具体逻辑自行实现");
                    },
                },
                lazyLoad: {
                    use: true, // 是否开启懒加载,默认false
                },
            },
            title: "小店赚钱中心",
            dataList: [], //测试列表加载更多
            navHeight: 0, //自定义导航栏高度
            // btnType: 0, // 按钮类型默认 0立即加入，1查看，2已加入，3已结束
        };
    },
    created() {
        // window["loginH5"] = (token) => {
        //     this.initToken(token);
        // };
        // window.showInfoFromJava = (token) => {
        //     this.initToken(token);
        // };
        /*导航栏高度*/
        getNavbarData().then((res) => {
            let { navBarHeight } = res;
            this.navHeight = navBarHeight;
        });
    },
    mounted() {
        // initTokenBridge().then((token) => {
        //     this.initToken(token);
        // });
        // if (window.launcher) {
        //     window.launcher.getAppToken();
        // }
    },
    methods: {
        ...mapMutations({
            setToken: "login/setToken",
        }),
        ...mapActions({
            getUserInfo: "login/getUserInfo",
        }),
        initToken(token) {
            console.log("initToken:", token);
            this.setToken(token);
            // 获取用户信息
            this.getUserInfo();
        },
        // mescroll组件初始化的回调,可获取到mescroll对象
        mescrollInit(mescroll) {
            this.mescroll = mescroll;
        },
        /*上拉加载的回调*/
        upCallback() {},
        // 查看计划:type-1省钱卡计划，2折扣计划
        viewPlan(type) {
            console.log(type);

            // 跳转至计划详情页面
            this.$router.push({
                name: "ZXPlan",
                query: {
                    type,
                },
            });
        },
        // 打开报名页：仅限深圳地区的掌柜，l_city:深圳市，condition:1
        viewSignUp() {
            console.log("用户信息：", this.userInfo);
            let { l_city, condition, seo_url } = this.userInfo;
            if (l_city && l_city === "深圳市" && condition === 1) {
                // 跳转至报名页
                // this.$router.push({
                //     name: "ZXSignup",
                // });
                const pushName = seo_url ? 'ZXInvite' : 'ZXSign';
                this.$router.push(pushName);
                return;
            }
            // 限制深圳
            Dialog({ message: "仅限深圳地区掌柜可加入" });
        },
        onClickLeft() {
            this.$router.go(-1);
            window.close();
            // 调用ios方法返回
            closeWebview();
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
    background-color: transparent;
    z-index: 999;

    .van-icon-arrow-left {
        font-size: 24px;
    }

    .van-icon {
        color: #333333;
    }

    .van-nav-bar__text {
        color: #333333;
    }
}

.content {
    box-sizing: border-box;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    max-width: 750px;
    margin: 0 auto;
    background-color: #f5f7fa;
    padding-top: var(--window-top);
    height: 100vh;
    overflow: hidden;
}

.bg_page {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 533px;
}

.mescroll-body {
    flex: 1;
    flex-shrink: 0;
    overflow: scroll;
    .credit-card-box {
        box-sizing: border-box;
        position: relative;
        z-index: 1;
        margin: 20px 16px 0 16px;
        min-height: 242px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        padding-bottom: 28px;

        .img_card_join {
            position: absolute;
            top: 0;
            width: 100%;
            min-height: 242px;
            z-index: -1;
        }

        .btn-box {
            position: relative;
            z-index: 1;
            width: 205px;
            height: 46px;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .bg_btn_join {
                width: 205px;
                height: 46px;
                position: absolute;
                top: 0;
                left: 0;
                z-index: -1;
            }

            .btn-name {
                font-size: 16px;
                font-family: PingFang SC, PingFang SC-Semibold;
                font-weight: 600;
                text-align: center;
                color: #ffffff;
            }

            .btn-tips {
                opacity: 0.6;
                font-size: 12px;
                font-family: PingFang SC, PingFang SC-Regular;
                font-weight: 400;
                text-align: center;
                color: #ffffff;
            }

            .sign-end {
                font-size: 16px;
                font-family: PingFang SC, PingFang SC-Semibold;
                font-weight: 600;
                text-align: center;
                color: #333333;
            }

            .icon_finger {
                width: 46px;
                height: 52px;
                position: absolute;
                bottom: -30px;
                right: -25px;
            }

            .icon_joined {
                width: 59px;
                height: 25px;
                position: absolute;
                top: -10px;
                right: 8px;
            }
        }
    }

    .not-started-plan {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        margin: 36px 16px 0 16px;

        .name {
            font-size: 16px;
            font-family: PingFang SC, PingFang SC-Semibold;
            font-weight: 600;
            text-align: left;
            color: #333333;
            margin-bottom: 16px;
        }

        .plan-head-box {
            box-sizing: border-box;
            min-height: 44px;
            position: relative;
            z-index: 1;
            font-size: 14px;
            font-family: PingFang SC, PingFang SC-Semibold;
            font-weight: 600;
            text-align: left;
            color: #333333;
            letter-spacing: 0.04px;
            padding-left: 16px;
            display: flex;
            align-items: center;
            justify-content: flex-start;

            .bg_title {
                width: 100%;
                height: 44px;
                position: absolute;
                top: 0;
                left: 0;
                z-index: -1;
            }
        }

        .mt-24 {
            margin-top: 12px;
        }

        .plan-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 12px;
            box-sizing: border-box;
            height: 100px;
            background: #ffffff;
            border-radius: 8px;
            position: relative;
            z-index: 1;

            .item-intro {
                font-size: 14px;
                font-family: PingFang SC, PingFang SC-Regular;
                font-weight: 400;
                text-align: center;
                color: #999999;
                letter-spacing: 0.04px;

                .title {
                    font-size: 20px;
                    font-family: Alimama ShuHeiTi, Alimama ShuHeiTi-Bold;
                    font-weight: 700;
                    text-align: center;
                    color: #333333;
                    margin-bottom: 12px;
                }
            }

            .btn-detail {
                box-sizing: border-box;
                width: 76px;
                height: 30px;
                border: 1px solid #e1e1e1;
                border-radius: 17px;
                font-size: 13px;
                font-family: PingFang SC, PingFang SC-Semibold;
                font-weight: 600;
                color: #333333;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .water-mark {
                min-width: 90px;
                height: 39px;
                font-size: 30px;
                font-family: HONOR Sans CN, HONOR Sans CN-Black;
                font-weight: 900;
                text-align: center;
                color: rgba(51, 51, 51, 0.03);
                line-height: 39px;
                position: absolute;
                bottom: 0px;
                right: 8px;
                z-index: -1;
            }
        }
    }
}
</style>
