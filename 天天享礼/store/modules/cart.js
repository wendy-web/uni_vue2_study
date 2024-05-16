import {
    carList as kfcCarList,
    clearCar as kfcClearCar,
    orderCar as kfcOrderCar
} from '@/api/modules/takeawayMenu/kfc.js';
import {
    carList,
    clearCar,
    orderCar
} from '@/api/modules/takeawayMenu/luckin.js';
const state = {
    cartComList: [],
    resultList: [],
    brand_id: 0, // 5：麦当劳 13：瑞幸 97：肯德基 99: 星巴克
    restaurant_id: 0,
    city_name: '',
    province_name: '',
    city_lat: 0,
    city_lon: 0,
    storeCode: '', // 门店编号
};
const mutations = {
    setBrandId(state, brand_id) {
        state.brand_id = Number(brand_id);
        state.restaurant_id = 0;
        state.cartComList = [];
        // state.city_name = '';
        // state.province_name = '';
    },
    setCityName(state, city_name) {
        state.city_name = city_name;
    },
    setProvinceName(state, province_name) {
        state.province_name = province_name;
    },
    setCityLat(state, city_lat) {
        state.city_lat = city_lat;
    },
    setCityLon(state, city_lon) {
        state.city_lon = city_lon;
    },
    // 设置肯定门店编码
    setStoreCode(state, storeCode) {
        state.storeCode = storeCode;
    },
    setRestaurantId(state, restaurant_id) {
        state.restaurant_id = Number(restaurant_id);
    },
    getCartList(state, cartData) {
        state.cartComList = cartData;
    },
    getResultList(state, cartData) {
        const resultList = [];
        cartData.forEach(res => {
            if (res.checked) {
                resultList.push(res.id.toString());
            }
        });
        state.resultList = resultList;
    },
    // 单选操作
    changeRadio(state, eventList) {
        state.resultList = eventList;
    },
    checkAllRadio(state, isCheckAll) {
        const resultList = [];
        if (isCheckAll) {
            state.cartComList.forEach(res => {
                resultList.push(res.id.toString());
            });
        }
        state.resultList = resultList;
    },
}
const actions = {
    subCount({ commit, dispatch, state }, item) {
        return new Promise((resolve, reject) => {
            const params = {
                ...item,
                brand_id: state.brand_id,
                amount: 0
            }
            delete params._index;
            const { _index } = item;
            let api = [97, 99].includes(state.brand_id) ? kfcOrderCar : orderCar;
            if (state.cartComList[_index].amount == 1) {
                uni.showModal({
                    content: '确定不要了吗？',
                    success: function(res) {
                        if (res.confirm) {
                            state.cartComList.splice(_index, 1);
                            commit('getResultList', state.cartComList);
                            api(params).then(res => {
                                resolve({
                                    ...res,
                                    amount: params.amount
                                })
                            });
                        }
                    }
                });
                return;
            }
            state.cartComList[_index].amount -= 1;
            params.amount = state.cartComList[_index].amount;
            api(params).then(res => {
                resolve({
                    ...res,
                    amount: params.amount
                })
            });
        });
    },
    addCount({ commit, dispatch, state }, item) {
        return new Promise((resolve, reject) => {
            let api = [97, 99].includes(state.brand_id) ? kfcOrderCar : orderCar;
            const { _index } = item;
            state.cartComList[_index].amount += 1;
            const params = {
                ...item,
                brand_id: state.brand_id,
                amount: state.cartComList[_index].amount
            }
            delete params._index;
            api(params).then(res => {
                resolve({
                    ...res,
                    amount: params.amount
                })
            });
        });
    },
    // 请求购物车列表
    requestCarList({ commit, dispatch, state }) {
        return new Promise((resolve, reject) => {
            let api = '';
            const params = { brand_id: state.brand_id }
                // 根据品牌访问的接口及传递的参数
            switch (state.brand_id) {
                case 5:
                case 13:
                    api = carList;
                    params.restaurant_id = state.restaurant_id;
                    break;
                case 97:
                case 99:
                    api = kfcCarList;
                    params.storeCode = state.storeCode
                    break;
            }
            api(params).then(res => {
                if (res.code != 1) return;
                const cartList = res.data;
                commit('getCartList', cartList);
                commit('getResultList', cartList);
                resolve(res);
            });
        });
    },
    clearCart({ commit, dispatch, state }) {
        return new Promise((resolve, reject) => {
            let api = [97, 99].includes(state.brand_id) ? kfcClearCar : clearCar;
            const params = { brand_id: state.brand_id };
            api(params).then(res => {
                if (res.code == 1) {
                    commit('getCartList', []);
                    commit('getResultList', []);
                    resolve(res);
                }
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
