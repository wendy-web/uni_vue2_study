import {
    getAutoLogin,
    getAutoPrivacy,
    getGift,
    getLocation,
    getToken,
    getUserInfo,
    removeGetUserInfo,
    removeToken,
    setAutoLogin,
    setAutoPrivacy,
    setCardNewShow,
    setGift,
    setToken
} from '@/utils/auth.js';

import {
    getUser,
    updateUser,
    userprofile,
    wxLogin
} from '@/api/modules/login.js';
import {
    profile,
    profit,
} from '@/api/modules/user.js';
import log from '@/utils/log.js';
const state = {
    userInfo: getUserInfo(), //用户信息
    token: getToken() || '', //token
    uid: '',
    gift: getGift() || 0, // 0 非新用户 1 新用户
    location: getLocation() || null,
    userTotal: {},
    diaList: ['privacy'], // 弹起列表 - 用户更新弹窗的配置
    isAutoPrivacy: Boolean(getAutoPrivacy()),
    isMiniProgram: 0, // 未进入；1 已进入
    isAutoLogin: Boolean(getAutoLogin()), // 1 自动登录；
    isSelRedPacket: false,
    isSelNewPacket: false,
    isAlreadyShowLight: false, // 是否已经展示过天天带入的商品
    profitInfo: {
        packet_amount: 0
    }, // 账户余额查询
    lightArr: null, // 图片的icon的高亮
    iconFindLightIndex: -1, // icon高亮的index
};

const mutations = {
    setProfitInfo(state, data) {
        state.profitInfo = data;
        // state.profitInfo = {
        //     ...data,
        //     packet_amount: 10.00
        // };
    },
    setSelRedPacket(state, sel) {
        state.isSelRedPacket = sel;
    },
    setLightArr(state, data) {
        state.lightArr = data;
    },
    setIconFindLightIndex(state, index) {
        state.iconFindLightIndex = index;
    },
    setSelNewPacket(state, sel) {
        state.isSelNewPacket = sel;
    },
    setAlreadyShowLight(state, value = true) {
        state.isAlreadyShowLight = value;
    },
    setAutoPrivacy(state, isAuto) {
        state.isAutoPrivacy = isAuto;
        setAutoPrivacy(isAuto);
    },
    setAutoLogin(state, isAuto) {
        setAutoLogin(isAuto);
        state.isAutoLogin = isAuto;
    },
    setDiaList(state, daiName) {
        const filterIndex = state.diaList.findIndex(res => res == daiName);
        if (filterIndex < 0) state.diaList.push(daiName);
    },
    setMiniProgram(state, status) {
        state.isMiniProgram = status;
    },
    delCurrentDiaList(state, daiName) {
        if (daiName) {
            const filterList = state.diaList.filter(res => res != daiName);
            state.diaList = filterList;
            return;
        }
        state.diaList.shift();
    },
    setLoginInfo(state, { token, uid, gift }) {
        state.token = token;
        state.uid = uid;
        state.gift = gift;

    },
    setGiftInfo(state, gift) {
        setGift(gift)
        state.gift = gift;
    },
    loginout(state) {
        removeGetUserInfo();
        state.userInfo = ''
        state.token = '';
        removeToken();
    },
    setUserInfo(state, userInfo) {
        state.userInfo = userInfo
            // state.userInfo = {
            //     ...userInfo,
            //     is_vip: 0,
            //     buy_vip: 1
            // }
    },
    setLocation(state, location) {
        state.location = location
    },
    setUserTotal(state, data) {
        state.userTotal = data
    },
    setCardNewShow(state, flag) {
        state.isCardNewShow = flag
        setCardNewShow(flag)
    }
}

const actions = {
    /* 用户登录 */
    wxlogin({ dispatch, commit, state }, isAppLaunch) {
        return new Promise((resolve, reject) => {
            //存在token不刷新，让程序自动去刷新
            if (state.token) {
                // dispatch('getUserInfo')
                return resolve()
            }
            //微信登录
            uni.login({
                provider: 'weixin',
                success: ({ code }) => {
                    //传给后端
                    wxLogin({
                        code: code
                    }).then(res => {
                        if (res.code == 1) {
                            let { token, uid, gift } = res.data;
                            // gift = 1;
                            commit('setLoginInfo', { token, uid, gift });
                            setToken(token);
                            setGift(gift)
                            dispatch('getUserTotal', isAppLaunch)
                            resolve()
                                // 记录用户日志
                            log.setFilterMsg('userToken');
                            log.info("token:", token)
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
    wxloginSmall({ dispatch, commit, state }) {
        return new Promise((resolve, reject) => {
            //微信登录
            uni.login({
                provider: 'weixin',
                success: ({ code }) => {
                    //传给后端
                    wxLogin({
                        code: code
                    }).then(res => {
                        if (res.code == 1) {
                            let { token, uid, new_user, gift } = res.data;
                            // gift = 1;
                            commit('setLoginInfo', { token, uid, new_user, gift })
                            setToken(token);
                            setGift(gift);
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
    getUserInfo({ commit, dispatch, state }, isAppLaunch) {
        getUser().then(res => {
            if (res.code != 1) return;
            const { data } = res;
            commit('setUserInfo', data);
        });
    },
    getUserTotal({ commit, dispatch, state }) {
        profile().then(res => {
            /*是否新增了卡券*/
            if (state.userTotal && res.data.coupon > state.userTotal.coupon) {
                commit('setCardNewShow', true)
            }
            commit('setUserTotal', res.data || {});
        });
        dispatch('getUserInfo');
    },
    // 新用户更新
    updateUserNew({ dispatch, commit }, parmas) {
        return new Promise((resolve, reject) => {
            // 微信登录
            // uni.login({
            // provider: 'weixin',
            // success: (res) => {
            //传给后端
            userprofile(parmas).then(res => {
                if (res.code == 1) {
                    // 重新获取用户信息
                    dispatch('getUserInfo', false);
                    return resolve(res);
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
            //}})
        })
    },
    // 编辑更新用户信息
    editUpdateUser({ dispatch, commit }, parmas) {
        return new Promise((resolve, reject) => {
            updateUser(parmas).then(res => {
                if (res.code == 1) {
                    //重新获取用户信息
                    dispatch('getUserInfo', false);
                    return resolve(res);
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
        })
    },
    profitInfoRequest({ dispatch, commit }) {
        return new Promise((resolve, reject) => {
            profit().then(res => {
                if (res.code == 1) {
                    commit('setProfitInfo', res.data);
                    return resolve(res.data);
                }
            }).catch((err) => {
                reject();
            });
        });

    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}
