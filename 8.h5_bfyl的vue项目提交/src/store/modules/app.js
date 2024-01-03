const state = {
	isConnected: true, //当前网络状态
	billLoaded:false, //是否加载过账单	
	isMiniprogram:false, //是否是小程序环境
};

const mutations = {
	setConnected(state, isConnected) { //网络状态
		state.isConnected = isConnected;
	},
	setBillLoaded(state, billLoaded) { //是否加载过账单
		state.billLoaded = billLoaded;
	},
	setMiniprogram(state, isMiniprogram) { //是否小程序环境
		state.isMiniprogram = isMiniprogram;
	},

};

const actions = {
};

export default {
	namespaced: true,
	state,
	mutations,
	actions
};