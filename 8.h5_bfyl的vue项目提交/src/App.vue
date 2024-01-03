<template>
    <div id="app">
        <!-- 路由匹配到的组件将显示在这里 -->
        <router-view> </router-view>
    </div>
</template>

<script>
import { initTokenBridge } from "@/utils/dsBridge";
import { mapMutations, mapActions } from "vuex";
export default {
    name: "App",
    created() {
        console.log("App created");
        window["loginH5"] = (token) => {
            this.initToken(token);
        };
        window.showInfoFromJava = (token) => {
            this.initToken(token);
        };
    },
    mounted() {
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
    },
};
</script>
<style lang="scss" scoped>
@import url('./static/common.scss')

</style>
