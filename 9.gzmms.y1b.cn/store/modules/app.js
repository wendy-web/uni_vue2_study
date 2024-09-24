//获取小程序版本号
const getAccountInfo = uni.getAccountInfoSync();
// envVersion: develop开发版,trial	体验版,release	正式版
const envVersion = getAccountInfo.miniProgram.envVersion || 'release';
const getSystemInfo = uni.getSystemInfoSync();
const SDKVersion = getSystemInfo.SDKVersion;
const statusBarHeight = getSystemInfo.statusBarHeight;
/** 订阅消息id  */
const msgTemplateId = "QWRWD5b6Wi3rQ_hMYrvQprB-14x_t8_VyJmLKsHzqbk";
const state = {
    isConnected: true, //当前网络状态
    envVersion, //当前环境
    SDKVersion, //客户端基础库版本
    statusBarHeight, //状态栏高度
    adminTitle: 'GZHN云物料', //小程序名称
    /** 订阅消息id  */
    msgTemplateId,
};

const mutations = {
    setConnected(state, isConnected) { //网络状态
        state.isConnected = isConnected;
    },
    setAdminTitle(state, ) {

        state.adminTitle = isConnected;
    },
};


const actions = {
    setConnected({
        commit
    }, isConnected) { //网络状态
        commit('setConnected', isConnected)
    }
};

export default {
    namespaced: true,
    mutations,
    state,
    actions
};
