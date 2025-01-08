import { departmentListApi, departmentScanListApi, getEqBaseSelect, getScanEqBaseSelect } from "@/api/modules/common.js";
const state = {
    productLineOptions: null, // 生产产线的下拉可选列表 - Array
    eqipmentTypeOptions: null, // 资产类型
    deptlistOptions: null, // 用户列表可选
    userListOptions: null, // 负责人
    eqipmentStatus: null, // 资产档案的使用状态
};

const mutations = {
    setOptions(state, dataOption) {
        const { product_line, eqipment_type, eqipment_status, user_list } = dataOption;
        state.productLineOptions = product_line;
        state.eqipmentTypeOptions = eqipment_type;
        state.eqipmentStatus = eqipment_status;
        state.userListOptions = user_list;
    },
    setDeptOptions(state, list) {
        state.deptlistOptions = list;
    }
};


const actions = {
    async initGetEqBaseSelect({ commit }, noValidationLogin = false) {
        const requestApi = noValidationLogin ? getScanEqBaseSelect : getEqBaseSelect;
        const res = await requestApi();
        if (res.code != 1 || !res.data) return;
        commit('setOptions', res.data);
    },

    async initDepartmentList({ commit }, noValidationLogin = false) {
        const requestApi = noValidationLogin ? departmentScanListApi : departmentListApi;
        const res = await requestApi();
        if (res.code != 1 || !res.data) return;
        commit('setDeptOptions', res.data.list);
    },
};

export default {
    namespaced: true,
    mutations,
    state,
    actions
};
