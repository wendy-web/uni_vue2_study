const state = {
	isConnected: true, //当前网络状态
	isTabBarRedDot: {
		home: false,
		ttxl: false,
		user: false,
		service: false
	}
};

const mutations = {
	setConnected(state, isConnected) { //网络状态
		state.isConnected = isConnected;
	},
	setTtxlRedDotStatus(state, isShow) {
		state.isTabBarRedDot.ttxl = isShow
	}
};

const actions = {};

export default {
	namespaced: true,
	state,
	mutations,
	actions
};