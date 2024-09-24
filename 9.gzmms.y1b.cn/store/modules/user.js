import {
    getLocation,
    getMouleType,
    getPerms,
    getToken,
    getUserInfo,
    removeGetUserInfo,
    removePerms,
    removeToken,
    setMouleType,
    setPerms,
    setToken,
    setUserInfo
} from '@/utils/auth.js';

import log from '@/utils/log.js';

import { getMenuListApi } from "@/api/modules/home.js";
import { mobileBindApi, wxLogin, wxMobileLoginApi } from '@/api/modules/login.js';

const state = {
    userInfo: getUserInfo(), //用户信息
    token: getToken() || '', //token
    uid: '',
    perms: getPerms() || [], //按钮权限数组
    moduleType: getMouleType() || 0, //模块标识
    location: getLocation() || null,
};
let is_request = false;
const mutations = {
    // 设置token
    SETTOKEN(state, token) {
        state.token = token;
        setToken(token)
    },
    // 设置userinfo
    SETUSERINFO(state, userInfo) {
        state.userInfo = userInfo;
        setUserInfo(userInfo)
    },
    LOGINOUT(state) {
        state.userInfo = ''
        state.token = ''
        state.perms = []
        removeGetUserInfo()
        removeToken();
        removePerms()
    },
    /** 设置btnAuths */
    SETBTNAUTHS(state, perms) {
        state.perms = perms;
        setPerms(perms)
    },
    /** 设置moduleType */
    SETMODULETYPE(state, moduleType) {
        state.moduleType = moduleType;
        setMouleType(moduleType)
    },
    setLocation(state, location) {
        state.location = location
    }
}

const actions = {
    /*用户登录*/
    wxlogin({ dispatch, commit, state }, isAppLaunch) {
        console.log("执行用户登录")
        return new Promise((resolve, reject) => {
            //存在token不刷新，让程序自动去刷新
            if (state.token) {
                return resolve({
                    code: 1,
                    msg: "state has token"
                })
            }
            //微信登录
            uni.login({
                provider: 'weixin',
                success: ({ code }) => {
                    console.log("code", code)
                        //传给后端
                    wxLogin({
                        code: code
                    }).then(res => {
                        console.log("loginRes", res)
                        if (res.code == 1) {
                            let { token, user } = res.data
                            commit("SETTOKEN", token)
                            commit("SETUSERINFO", user)
                            resolve(res)
                            dispatch("getPermsList")
                                // 记录用户日志
                            log.setFilterMsg('userToken');
                            log.info("token:", token)
                            console.log("token:", token)
                            return
                        } else if (res.code == 3 || res.code == 2) {
                            resolve({
                                code: res.code,
                                msg: res.msg
                            })
                            return
                        }
                        reject({
                            code: res.code,
                            msg: res.msg
                        });
                    }).catch((err) => {
                        reject({
                            code: -1,
                            msg: JSON.stringify(err)
                        });
                    });
                },
                fail: function(err) {

                    reject({
                        code: -1,
                        msg: JSON.stringify(err)
                    });
                }
            });
        })
    },



    /* 用户登录-需要传入账户、密码 */
    wxloginUser({ dispatch, commit, state }, { username, password }) {
        return new Promise((resolve, reject) => {
            //微信登录
            uni.login({
                provider: 'weixin',
                success: ({
                    code
                }) => {
                    //传给后端
                    wxLogin({ code: code, username, password }).then(res => {
                        if (res.code == 1) {
                            let { token, user } = res.data;
                            commit("SETTOKEN", token)
                            commit("SETUSERINFO", user)
                            resolve(res)
                            dispatch("getPermsList")
                            return
                        }
                        reject({
                            code: 0,
                            msg: res.msg
                        });
                    }).catch((err) => {
                        reject({
                            code: -1,
                            msg: JSON.stringify(err)
                        });
                    });
                },
                fail: function(err) {
                    reject({
                        code: -1,
                        msg: JSON.stringify(err)
                    });
                }
            });
        })
    },
    /* 手机号登录-需要mobile_code */
    wxloginMobile({ dispatch, commit, state }, mobile_code) {
        return new Promise((resolve, reject) => {
            wxMobileLoginApi({ mobile_code }).then(res => {
                if (res.code == 1) {
                    let { token, user } = res.data;
                    commit("SETTOKEN", token)
                    commit("SETUSERINFO", user)
                    resolve(res)
                    dispatch("getPermsList")
                    dispatch("mobileBindWx")
                    return
                } else if (res.code == 2) {
                    uni.redirectTo({
                        url: "/pages/ipHint/ipHint",
                    });
                }
                reject({
                    code: 0,
                    msg: res.msg
                });
            }).catch((err) => {
                reject({
                    code: -1,
                    msg: JSON.stringify(err)
                });
            });

        })
    },

    /** 获取按钮权限数组 */
    getPermsList({ dispatch, commit, state }) {
        return new Promise((resolve, reject) => {
            getMenuListApi().then(res => {
                if (res.code == 1) {
                    let { hide } = res.data;
                    commit("SETBTNAUTHS", hide)
                }
            }).catch((err) => {
                reject({
                    code: -1,
                    msg: JSON.stringify(err)
                });
            })
        })
    },

    /** 手机号登录的需要静默绑定微信  */
    mobileBindWx({ dispatch, commit, state }) {
        return new Promise((resolve, reject) => {
            uni.login({
                provider: 'weixin',
                success: ({
                    code
                }) => {
                    //传给后端
                    mobileBindApi({ code }).then(res => {
                        if (res.code == 1) {}
                    }).catch((err) => {
                        reject({
                            code: -1,
                            msg: JSON.stringify(err)
                        });
                    })
                },
                fail: function(err) {
                    reject({
                        code: -1,
                        msg: JSON.stringify(err)
                    });
                }
            });


        })
    },

}




export default {
    namespaced: true,
    state,
    mutations,
    actions
}