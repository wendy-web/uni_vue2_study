import {
    setToken,
    getToken,
    setGift,
    setAutoLogin,
    getAutoLogin,
    setAutoPrivacy,
    getAutoPrivacy,
    setUnionId,
    getUnionId,
    getGift,
    getUserInfo,
    removeGetUserInfo,
    removeToken,
    getLocation,
    setAuthorization,
    getAuthorization,
} from "@/utils/auth.js";
import { teamInfo } from "@/api/modules/card.js";
import log from "@/utils/log.js";
import { wxLogin, getUser, userprofile, saveMobile } from "@/api/modules/login.js";

const state = {
    userInfo: getUserInfo(), //用户信息
    token: getToken() || "", //token
    uid: "",
    gift: getGift() || 0, // 0 非新用户 1 新用户
    unionid: getUnionId() || 0, // 用户的id
    location: getLocation() || null,
    isAuthorization: Boolean(getAuthorization()),
    diaList: ['privacy'],
    isAutoLogin: getAutoLogin(), // 1 自动登录；
    isAutoPrivacy: Boolean(getAutoPrivacy()), // 是否已经弹出授权的页面
    vipObject: {}, // 团长信息
};

const mutations = {
    setAutoPrivacy(state, isAuto) {
        state.isAutoPrivacy = isAuto;
        setAutoPrivacy(isAuto);
    },
    setAutoLogin(state, isAuto) {
        setAutoLogin(isAuto);
        state.isAutoLogin = isAuto;
    },
    setLoginInfo(state, { token, uid, gift, unionid }) {
        state.token = token;
        state.uid = uid;
        state.gift = gift;
        state.unionid = unionid;
    },
    setGiftInfo(state, gift) {
        setGift(gift);
        state.gift = gift;
    },
    setDiaList(state, daiName) {
        state.diaList.push(daiName)
    },
    delCurrentDiaList(state, daiName) {
        if (daiName) {
            const filterList = state.diaList.filter(res => res != daiName);
            state.diaList = filterList;
            return;
        }
        state.diaList.shift();
    },
    loginout(state) {
        // state.uid = ''
        // removeGetUserInfo()
        // state.userInfo = ''
        state.token = "";
        removeToken();
    },
    setUserInfo(state, userInfo) {
        state.userInfo = userInfo;
        // state.userInfo = {
        //     ...userInfo,
        //     is_team: 0
        // };

    },
    setVipObject(state, vipObject) {
        state.vipObject = vipObject;
        // state.vipObject = {
        //     ...vipObject,
        //     card_num: 0
        // };
    },
    setLocation(state, location) {
        state.location = location;
    },
    setAuthorization(state, flag) {
        if (!state.isAuthorization) state.isAuthorization = flag;
        setAuthorization(flag);
    },
    setUserTotal(state, data) {
        state.userTotal = data;
    },
};

const actions = {
    /*用户登录*/
    wxlogin({ commit, state }) {
        return new Promise((resolve, reject) => {
            //存在token不刷新，让程序自动去刷新
            if (state.token) {
                return resolve();
            }
            //微信登录
            uni.login({
                provider: "weixin",
                success: ({ code }) => {
                    //传给后端
                    wxLogin({ code })
                        .then((res) => {
                            if (res.code == 1) {
                                let { token, uid, gift, unionid } = res.data;
                                // gift = 1;
                                commit("setLoginInfo", { token, uid, gift, unionid });
                                setToken(token);
                                setGift(gift);
                                setUnionId(unionid);
                                resolve();
                                // 记录用户日志
                                log.setFilterMsg("userToken");
                                log.info("token:", token);
                                console.log("token:", token);
                                return;
                            }
                            reject({
                                code: 0,
                                msg: res.msg,
                            });
                        })
                        .catch((err) => {
                            reject({
                                code: -1,
                                msg: JSON.stringify(err),
                            });
                        });
                },
                fail: function(err) {
                    reject({
                        code: -1,
                        msg: JSON.stringify(err),
                    });
                },
            });
        });
    },
    /*用户登录*/
    wxloginSmall({ commit }) {
        return new Promise((resolve, reject) => {
            //微信登录
            uni.login({
                provider: "weixin",
                success: ({ code }) => {
                    //传给后端
                    wxLogin({
                            code: code,
                        })
                        .then((res) => {
                            if (res.code == 1) {
                                let { token, uid, new_user, unionid } = res.data;
                                commit("setLoginInfo", { token, uid, new_user, unionid });
                                setToken(token);
                                resolve();
                                return;
                            }
                            reject({
                                code: 0,
                                msg: res.msg,
                            });
                        })
                        .catch((err) => {
                            reject({
                                code: -1,
                                msg: JSON.stringify(err),
                            });
                        });
                },
                fail: function(err) {
                    reject({
                        code: -1,
                        msg: JSON.stringify(err),
                    });
                },
            });
        });
    },
    //获取用户信息
    getUserInfo({ commit }) {
        getUser().then((res) => {
            if (res.code != 1) return;
            const { data } = res;
            commit("setUserInfo", data);
            commit("setAuthorization", Boolean(data.avatar_url));
        });
    },
    async getVipObject({ commit }, type = 0) {
        const res = await teamInfo({ type });
        if (res.code != 1 || !res.data) return;
        commit("setVipObject", res.data);
    },
    //新用户更新
    updateUserNew({ dispatch, commit }, parmas) {
        return new Promise((resolve, reject) => {
            //传给后端
            userprofile(parmas)
                .then((res) => {
                    if (res.code == 1) {
                        //重新获取用户信息
                        dispatch("getUserInfo", false);
                        commit("setAuthorization", true);
                        return resolve();
                    }
                    //异常情况
                    uni.showModal({
                        title: "温馨提示",
                        content: res.msg,
                    });
                    reject();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    //新用户更新
    updateMobile({ dispatch }, parmas) {
        const { code, hideModel } = parmas;
        const params = { code }
        return new Promise((resolve, reject) => {
            //传给后端
            saveMobile(params)
                .then((res) => {
                    if (res.code == 1) {
                        //重新获取用户信息
                        dispatch("getUserInfo");
                        return resolve();
                    }
                    // 异常情况
                    !hideModel && uni.showModal({
                        title: "温馨提示",
                        content: res.msg,
                    });
                    reject();
                })
                .catch(() => {
                    reject();
                });
        });
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
