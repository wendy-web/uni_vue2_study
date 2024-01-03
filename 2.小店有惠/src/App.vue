<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import { bfAppid } from "@/utils/auth.js";
import {
    getToken,
    getAutoLogin,
} from "@/utils/auth.js";
export default {
    computed: {
        ...mapGetters(["gift", "diaList"]),
    },
    methods: {
        ...mapActions({
            setConnected: "app/setConnected",
            getVipObject: "user/getVipObject",
        }),
        ...mapMutations({
            setDiaList: "user/setDiaList",
            delCurrentDiaList: "user/delCurrentDiaList",
            setAutoLogin: "user/setAutoLogin",
        })
    },
    watch: {
        // gift(newVal, oldValue) {
        //     if(!newVal) return;
        //     const sourceData = uni.getLaunchOptionsSync();
        //     const { scene, referrerInfo} = sourceData;
        //     if(!referrerInfo || !referrerInfo.appId) return
        //     if( referrerInfo.appId == bfAppid()) {
        //         this.setDiaList('update');
        //         this.$showModal({
        //             title: '温馨提示',
		// 			content: '您需要授权小店有惠使用您的微信头像和昵称？',
        //             confirm:async () => {
        //                 await updateInfo({type: 2});
        //                 this.delCurrentDiaList();
        //             },
        //             cancel:async () => {
        //                 await updateInfo({type: 1});
        //                 this.delCurrentDiaList();
        //             }
        //         })
        //     }
        // },
        'vipObject.card_num': {
            handler:async function (newValue, oldValue) {
                if(newValue) return;
                this.getVipObject();
            },
            deep: true,
            immediate: true
        }
    },
    onLaunch: function () {
        // 检测新版本
        const updateManager = uni.getUpdateManager();
        updateManager.onUpdateReady(function () {
            uni.showModal({
                title: "更新提示",
                content: "新版本已经准备好，是否重启应用？",
                showCancel: false,
                success(res) {
                if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate();
                }
                },
            });
        });
        /**
         * 初次加载判断网络情况
         * 无网络状态下根据实际情况进行调整
         */
        uni.getNetworkType({
            success: (res) => {
                const networkType = res.networkType;
                if (networkType === "none") {
                this.setConnected(false);
                uni.showToast({
                    title: "当前无网络",
                    icon: "loading",
                    duration: 2000,
                });
                return;
                }
                this.setConnected(true);
            },
        });
        /**
         * 监听网络状态变化
         * 可根据业务需求进行调整
         */
        uni.onNetworkStatusChange((res) => {
            if (!res.isConnected) {
                this.setConnected(false);
                uni.showToast({
                title: "网络已断开",
                icon: "loading",
                duration: 2000,
                });
            } else {
                this.setConnected(true);
                uni.hideToast();
            }
        });
        const tokenStorage = getToken();
        const autoLoginStorage = getAutoLogin();
        if(tokenStorage) {
            (autoLoginStorage === '') && this.setAutoLogin(true);
        } else{
            this.setAutoLogin(false)
        }
        if(!autoLoginStorage) {
            const sourceData = uni.getLaunchOptionsSync();
            const { scene, referrerInfo } = sourceData;
            if (!referrerInfo || !referrerInfo.appId) return;
            if (referrerInfo.appId == bfAppid()) {
                this.setAutoLogin(true);
            }
        }
    },
    onShow: function () {
        // if(!this.isAutoLogin) {
        //     const sourceData = uni.getLaunchOptionsSync();
        //     const { scene, referrerInfo } = sourceData;
        //     if (!referrerInfo || !referrerInfo.appId) return;
        //     if (referrerInfo.appId == bfAppid()) {
        //         this.setAutoLogin(true);
        //     }
        // }
    },
    onHide: function () {
        console.log("App Hide");
    },
};
</script>

<style>
/*每个页面公共css */
@import url("@/components/u-parse/u-parse.css");
</style>
