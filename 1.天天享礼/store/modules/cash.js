import { enterPage, getLog } from '@/api/modules/cash.js';

const state = {
    enterPageStatus: 0,
    enterArr: {},
    cashRecodeList: []
};
const mutations = {
    // 单选操作
    setEnterPageStatus(state, status) {
        state.enterPageStatus = status;
        // state.enterPageStatus = 5;
    },
    setEnterArr(state, enterArr) {
        state.enterArr = enterArr;
    },
    setCashRecodeList(state, list) {
        state.cashRecodeList = list;
    }
}
const actions = {
    initEnterPage({ commit, dispatch, state }) {
        return new Promise(async(resolve, reject) => {
            const res = await enterPage();
            if (!res.code || !res.data) return resolve(res);
            const { status, enterArr } = res.data;
            commit('setEnterPageStatus', status);
            commit('setEnterArr', enterArr);
            resolve(status);
        });
    },
    async requestGetLog({ commit, dispatch, state }) {
        const res = await getLog();
        if (res.code != 1) return;
        commit('setCashRecodeList', res.data);
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}
