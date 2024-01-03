const state = {
	isConnected: true //当前网络状态
};

const mutations = {
	setConnected(state, isConnected) { //网络状态
		state.isConnected = isConnected;
	}
};


const actions = {
	setConnected({commit}, isConnected) { //网络状态
		commit('setConnected',isConnected)
	}
};

export default {
	namespaced: true,
	mutations,
	state,
	actions
};
