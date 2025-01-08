import {
    enterPage,
    freeEnterPage,
    getLog
} from '@/api/modules/cash.js';

const state = {
    enterPageStatus: 0,
    enterArr: {},
    cashRecodeList: [],
    freeEnterPageStatus: 0,
    freeEnterArr: {},
    freeOrderArr: [],
};
const mutations = {
    setFreeEnterPageStatus(state, status) {
        state.freeEnterPageStatus = status;
        // state.freeEnterPageStatus = 4;
    },
    setFreeEnterArr(state, freeEnterArr) {
        state.freeEnterArr = freeEnterArr;
    },
    setFreeOrderArr(state, freeOrderArr) {
        state.freeOrderArr = freeOrderArr;
        // state.freeOrderArr = [{
        //         goods_image: 'https://file.y1b.cn/store/1-0/24124/65b0663a3acaa.png',
        //         num: 1,
        //         goods_name: 'jfewhgfk',
        //         pay_amount: 65.2,
        //         status_desc: '已完成',
        //         status: 4
        //     },
        //     {
        //         goods_image: 'https://file.y1b.cn/store/1-0/24124/65b0663a3acaa.png',
        //         num: 1,
        //         goods_name: 'jfewhgfk',
        //         pay_amount: 65.2,
        //         status_desc: '已完成',
        //         status: 4
        //     }
        // ]
    },
    // 单选操作
    setEnterPageStatus(state, status) {
        state.enterPageStatus = status;
        // state.enterPageStatus = 4;
    },
    setEnterArr(state, enterArr) {
        state.enterArr = enterArr;
    },
    setCashRecodeList(state, list) {
        state.cashRecodeList = list;
    }
}
const actions = {
    initFreeEnterPage({ commit, dispatch, state }, is_close = 0) {
        return new Promise(async(resolve, reject) => {
            const res = await freeEnterPage({ is_close });
            if (!res.code || !res.data) return resolve(res);
            const { status, enterArr, firstArr, orderArr } = res.data;
            commit('setFreeEnterPageStatus', status);
            commit('setFreeEnterArr', enterArr);
            commit('setFreeOrderArr', orderArr);
            resolve(res.data);
        });
    },
    initEnterPage({ commit, dispatch, state }, is_close = 0) {
        return new Promise(async(resolve, reject) => {
            const res = await enterPage({ is_close });
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
