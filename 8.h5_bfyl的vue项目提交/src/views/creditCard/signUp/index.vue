<template>
    <div class="box page-box">
        <van-nav-bar
            :title="title"
            left-text=""
            right-text=""
            :fixed="true"
            :safe-area-inset-top="true"
            :placeholder="true"
            left-arrow
            @click-left="onClickLeft"
        />
        <div class="content-box safe-area">
            <!-- 报名 -->
            <template v-if="signType == 1">
                <sign-item @signSuccess="signSuccess"></sign-item>
            </template>
            <!-- 审核中 -->
            <template v-if="signType == 2">
                <process-item></process-item>
            </template>
        </div>
    </div>
</template>

<script>
import signItem from "./component/signItem/signItem.vue";
import processItem from "./component/processItem/processItem.vue";
import { mapGetters } from "vuex";
import { getLocalStorage } from "@/utils/index.js";
export default {
    name: "ZXSignUp",
    components: {
        signItem,
        processItem,
    },
    computed: {
        ...mapGetters(["userInfo"]),
    },
    data() {
        return {
            title: "专属信用卡赚钱计划",
            signType: 1, // 默认1未报名，2已报名：审核中
        };
    },
    created() {
        this.initTitle();
    },
    methods: {
        initTitle() {
            if (this.userInfo) {
                this.signType = this.userInfo.seo_url ? 2 : 1;
            }

            let title = this.signType == 1 ? "专属信用卡赚钱计划" : "赚钱计划";
            this.title = title;
            console.log("报名组件的title", this.title);
        },
        // 报名成功:初始化标题，显示审核中UI
        signSuccess(event) {
            console.log("报名组件触发了：", event);
            this.initTitle();
            this.signType = 2;
            this.initSignUp();
        },
        initSignUp() {
            let signUpTime = getLocalStorage("signUpTime") || 0;
            if (signUpTime && Date.now() - signUpTime > 3000) {
                console.log("报名超过3秒了");
                // 跳转至邀请页
                // this.$router.push({
                //     name: "ZXInvite",
                // });
                this.$router.replace('/creditCard/ZXInvite');
            }
        },
        onClickLeft() {
            this.$router.go(-1);
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

.box {
    box-sizing: border-box;
    position: relative;
    max-width: 750px;
    margin: 0 auto;
    z-index: 1;
}
</style>
