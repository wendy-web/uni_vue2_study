import {
	bill2023Api,
} from '@/api/billApi.js';
const state = {
	billInfo: {
		shopReport:null
	}, //用户信息
};

const mutations = {
	setBillInfo(state, billInfo) { //账单信息
		state.billInfo = billInfo;
	},
	
};

const actions = {
	
	//获取账单信息
	getBillInfo({
		commit
	}) {
		bill2023Api().then(res => {
			if (res.code == 1) {
				commit('setBillInfo', res.data);
			}
		}).catch(err=>{
			console.log('getBillInfo catch',err)
		});
	},
	
};

export default {
	namespaced: true,
	state,
	mutations,
	actions
};