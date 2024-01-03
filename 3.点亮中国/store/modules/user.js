import {
    setToken,
    getToken,
    getUserInfo,
    removeGetUserInfo,
    removeToken,
    getLocation,
    getAutoLogin,
    setAutoLogin,
    setAuthorization,
    getAuthorization,
    setAppLaunchNum
} from '@/utils/auth.js';

import log from '@/utils/log.js';
import {
    wxLogin,
    getUser,
    userprofile
} from '@/api/modules/login.js';
import {
    getH5UserInfo
} from '@/utils/auth.js'
const state = {
    userInfo: getUserInfo(), //用户信息
    token: getToken() || '', //token
    uid: '',
    new_user: 0,
    location: getLocation() || null,
    isAuthorization: Boolean(getAuthorization()),
    soonMedalId: null, //即将点亮的勋章id
    isAutoLogin: Boolean(getAutoLogin()), // 1 自动登录；
};
const mutations = {
    setLoginInfo(state, {
        token,
        uid,
        new_user
    }) {
        state.token = token
        state.uid = uid
        state.new_user = new_user
    },
    loginout(state) {
        // state.uid = ''
        // removeGetUserInfo()
        // state.userInfo = ''
        state.token = ''
        removeToken()
    },
    setAutoLogin(state, isAuto) {
        setAutoLogin(isAuto);
        state.isAutoLogin = isAuto;
    },
    setUserInfo(state, userInfo) {
        state.userInfo = userInfo
    },
    setLocation(state, location) {
        state.location = location
    },
    setAuthorization(state, flag) {
        if (!state.isAuthorization) state.isAuthorization = flag
        setAuthorization(flag)
    },
    resetAuthorization() {
        state.isAuthorization = false
        setAuthorization(false)
        setAppLaunchNum(true)
    },
    setSoonMedalId(state, id) {
        state.soonMedalId = id
    }
}

const actions = {
    /*用户登录*/
    wxlogin({
        dispatch,
        commit,
        state
    }, isAppLaunch) {
        return new Promise((resolve, reject) => {
            //存在token不刷新，让程序自动去刷新
            if (state.token) {
                // dispatch('getUserInfo')
                return resolve()
            }
            //微信登录
            uni.login({
                provider: 'weixin',
                success: ({
                    code
                }) => {
                    //传给后端
                    wxLogin({
                        code: code
                    }).then(res => {
                        if (res.code == 1) {
                            let {
                                token,
                                uid,
                                new_user
                            } = res.data
                            commit('setLoginInfo', {
                                token,
                                uid,
                                new_user
                            })
                            setToken(token)
                                // dispatch('getUserInfo', isAppLaunch)
                            resolve()
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
    /*用户登录*/
    wxloginSmall({
        dispatch,
        commit,
        state
    }) {
        return new Promise((resolve, reject) => {
            //微信登录
            uni.login({
                provider: 'weixin',
                success: ({
                    code
                }) => {
                    //传给后端
                    wxLogin({
                        code: code
                    }).then(res => {
                        if (res.code == 1) {
                            let {
                                token,
                                uid,
                                new_user
                            } = res.data
                            commit('setLoginInfo', {
                                token,
                                uid,
                                new_user
                            })
                            setToken(token)
                            resolve()
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
    //获取用户信息
    getUserInfo({
        dispatch,
        commit
    }, isAppLaunch) {
        getUser().then(res => {
            if (res.code == 1) {
                commit('setUserInfo', res.data);
                commit('setAuthorization', Boolean(res.data.avatar_url))
                dispatch('business/getNextCity', {}, {
                    root: true
                })
                if (!Boolean(res.data.avatar_url)) commit('resetAuthorization')
                if (isAppLaunch) setAppLaunchNum()
            }
        });
    },
    //新用户更新
    updateUserNew({
        dispatch,
        commit
    }, parmas) {
        return new Promise((resolve, reject) => {
            //微信登录
            // uni.login({
            // 	provider: 'weixin',
            // 	success: (res) => {
            //传给后端
            userprofile({
                ...parmas
            }).then(res => {
                if (res.code == 1) {
                    //重新获取用户信息
                    // dispatch('getUserInfo',false)
                    commit('setAuthorization', true);
                    commit('setAutoLogin', true);
                    return resolve();
                }
                //异常情况
                uni.showModal({
                    title: '温馨提示',
                    content: res.msg
                });
                reject();
            }).catch((err) => {
                reject();
            });
            // }})
        })

    },
    // 用户授权事件
    isLoginFinish({
        dispatch,
        commit,
        state
    }, fun) {
        return new Promise((resolve, reject) => {
            // 未授权
            if (!state.isAuthorization) {
                let h5UserInfo = getH5UserInfo();
                if (h5UserInfo) {
                    uni.showModal({
                        title: '温馨提示',
                        content: '您需要授权彬纷在线使用您的微信头像和昵称？',
                        success: (res) => {
                            if (res.confirm) {
                                dispatch('updateUserNew', {
                                    nick_name: h5UserInfo.NickName,
                                    avatar_url: h5UserInfo.HeadPic,
                                }).then(() => {
                                    dispatch('getUserInfo')
                                });
                                wx.reportEvent("click_confirm_0", {
                                    authorized_or_not: Number(state.isAuthorization)
                                });
                            } else if (res.cancel) {
                                wx.reportEvent("click_cancel_0", {
                                    authorized_or_not: Number(state.isAuthorization)
                                });
                                if (fun && fun instanceof Function) fun();
                            }

                        }
                    });
                } else {
                    /*直接跳登录授权页*/
                    uni.navigateTo({
                        url: '/pages/tabBar/login/index'
                    });
                }
                return;
            }
            resolve();
        });
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}