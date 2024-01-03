<template>
    <div class="box" :style="{ '--navBarHeight': navBarHeight + 'px' }">
        <!-- 放大镜 -->
        <img
            class="icon_amp"
            src="@/static/creditCard/icon_amp.png"
            mode="aspectFit"
        />
        <div class="title">审核中</div>
        <div class="subtitle">预计 1 到 3 个工作日内审核完成，请耐心等待</div>
        <van-button class="btn" @click="refresh">刷新</van-button>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getNavbarData } from "@/utils/xhNavbar.js";
import { getLocalStorage } from "@/utils/index";

export default {
    computed: {
        ...mapGetters(["userInfo"]),
    },
    data() {
        return {
            boxHeight: 0,
            navBarHeight: 0,
        };
    },
    mounted() {
        getNavbarData().then((res) => {
            console.log("getNavbarData:", res);
            console.log(res);
            this.boxHeight = res.screenHeight - res.navBarHeight;
            this.navBarHeight = res.navBarHeight;
        });
        // this.initSignUp();
    },
    methods: {
        refresh() {
            // window.location.reload();
            // uni.showLoading({
            // 	mask: true,
            // 	title: '刷新中···'
            // })
            this.initSignUp();
            // setTimeout(() => {
            // 	uni.hideLoading()
            // }, 1000)
        },
        initSignUp() {
            let signUpTime = getLocalStorage("signUpTime") || 0;
            if (
                (signUpTime && Date.now() - signUpTime > 3000) ||
                this.userInfo.seo_url
            ) {
                // 跳转至邀请页
                // this.$router.push({
                //     name: "ZXInvite",
                // });
                this.$router.replace('/creditCard/ZXInvite');
            }
        },
    },
};
</script>

<style lang="scss">
.box {
    box-sizing: border-box;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: calc(100vh - var(--navBarHeight));
    padding-bottom: var(--navBarHeight);
}

.icon_amp {
    width: 90px;
    height: 90px;
}

.title {
    font-size: 18px;
    font-family: PingFang SC, PingFang SC-Semibold;
    font-weight: 600;
    text-align: center;
    color: #333333;
    margin-top: 0px;
}

.subtitle {
    font-size: 14px;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    text-align: center;
    color: #666666;
}

.btn {
    width: 100px;
    height: 40px;
    background: #f0f3f8;
    border-radius: 10px;
    font-size: 14px;
    font-family: PingFang SC, PingFang SC-Semibold;
    font-weight: 600;
    text-align: center;
    color: #333333;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 30px;
}
</style>
