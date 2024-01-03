import {
	setToken,
	getToken,
	getUserInfo,
	removeGetUserInfo,
	removeToken,
	setAuthorization,
	getAuthorization,
	setLoginState,
	getLoginState
} from '@/utils/auth.js';

import {
	getUserApi,
	citicqrApi
} from '@/api/cardApi.js';
const state = {
	userInfo: getUserInfo(), //用户信息
	token: getToken() || '', //token
	uid: '',
	isAuthorization: Boolean(getAuthorization()),
	isLogin: getLoginState() || false //授权后的登录控制
};

const mutations = {
	logout(state) { //退出登录
		state.token = '';
		// state.userInfo = null;
		removeGetUserInfo();
		removeToken();
	},
	setToken(state, token) { //token
		state.token = token;
		setToken(token);
	},
	setUserInfo(state, userInfo) { //用户信息
		state.userInfo = userInfo;
	},
	setUid(state, data) {
		state.uid = data;
	},
	setAuthorization(state, flag) {
		if (!state.isAuthorization) state.isAuthorization = flag
		setAuthorization(flag)
	},
	setLoginState(state, flag) {
		state.isLogin = flag
		setLoginState(flag)
	}
};

const actions = {
	
	//获取用户信息
	getUserInfo({
		commit
	}) {
		getUserApi().then(res => {
			if (res.code == 1) {
				commit('setUserInfo', res.data);
			}
		}).catch(err=>{
			console.log('getUserApi catch',err)
		});
	},
	
	// 获取app的token以后，获取用户信息
	getAppToken({
		commit,
	}) {

		return new Promise((resolve, reject) => {
			getUserApi().then(res => {
				resolve(res)
				if (res.code == 1) {
					commit('setUserInfo', res.data);
				}
			}).catch(function() {
				reject();
			});
		});
	},
	// 创建分享二维码
	createQr({
		commit,
	}) {
		return new Promise((resolve, reject) => {
			citicqrApi().then(res => {
				resolve(res)
				if (res.code == 1) {
					commit('setUserInfo', res.data);
				}
			}).catch(function() {
				reject();
			});
		});
	}
};

export default {
	namespaced: true,
	state,
	mutations,
	actions
};