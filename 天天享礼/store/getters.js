const getters = {
    //登录相关
    token: state => state.user.token,
    isAutoLogin: state => state.user.isAutoLogin,
    isAutoPrivacy: state => state.user.isAutoPrivacy,
    isSelRedPacket: state => state.user.isSelRedPacket,
    isSelNewPacket: state => state.user.isSelNewPacket,
    isAlreadyShowLight: state => state.user.isAlreadyShowLight,
    uid: state => state.user.uid,
    gift: state => state.user.gift,
    diaList: state => state.user.diaList,
    location: state => state.user.location,
    isConnected: state => state.app.isConnected,
    isCardNewShow: state => state.user.isCardNewShow,
    isMiniProgram: state => state.user.isMiniProgram, // 打开其他的小程序
    cartComList: state => state.cart.cartComList, // 购物车列表
    resultList: state => state.cart.resultList,
    brand_id: state => state.cart.brand_id,
    restaurant_id: state => state.cart.restaurant_id,
    storeCode: state => state.cart.storeCode, // 千猪的门店code; 肯德基与星巴克共用
    city_lat: state => state.cart.city_lat,
    city_lon: state => state.cart.city_lon,
    city_name: state => state.cart.city_name,
    province_name: state => state.cart.province_name,
    profitInfo: (state, getters) => {
        const isAutoLogin = getters.isAutoLogin;
        return isAutoLogin ? state.user.profitInfo : {
            packet_amount: 0,
            total_num: 0
        }
    },
    userInfo: (state, getters) => {
        const isAutoLogin = getters.isAutoLogin;
        return isAutoLogin ? state.user.userInfo : {
            credits: 0
        }
    },
    userTotal: (state, getters) => {
        const isAutoLogin = getters.isAutoLogin;
        return isAutoLogin ? state.user.userTotal : {
            credits: 0
        }
    },
    // 购物车的总数量
    cartNum: (state, getters) => {
        let num = 0;
        if (!getters.cartComList) return num;
        switch (getters.brand_id) {
            // 瑞幸的购物车添加
            case 13:
                getters.resultList.forEach(resultNum => {
                    const currentItem = getters.cartComList.find(res => res.id == resultNum);
                    if (currentItem) num += currentItem.amount;
                });
                break;
                // 麦当劳的无选中态
            case 5:
                getters.cartComList.forEach(res => {
                    num += res.amount;
                });
                break;
            case 97:
                getters.cartComList.forEach(res => {
                    num += res.amount;
                });
                break;
            case 99:
                getters.resultList.forEach(resultNum => {
                    const currentItem = getters.cartComList.find(res => res.id == resultNum);
                    if (currentItem) num += currentItem.amount;
                });
                break;
        }
        return num;
    },
    // 总价格
    total_price: (state, getters) => {
        let price = 0;
        if (!getters.cartComList) return price;
        switch (getters.brand_id) {
            // 瑞幸的购物车添加
            case 13:
                getters.resultList.forEach(resultNum => {
                    const currentItem = getters.cartComList.find(res => res.id == resultNum);
                    if (currentItem) price += Number(currentItem.amount * currentItem.user_price);
                });
                break;
            case 5:
                getters.cartComList.forEach(res => price += Number(res.amount * res.user_price));
                break;
            case 97:
                getters.cartComList.forEach(res => price += Number(res.amount * res.price));
                break;
            case 99:
                getters.resultList.forEach(resultNum => {
                    const currentItem = getters.cartComList.find(res => res.id == resultNum);
                    if (currentItem) price += Number(currentItem.amount * currentItem.price);
                });
                break;
        }
        return price.toFixed(2);
    },
    // 总优惠价格
    total_coupon_price: (state, getters) => {
        let price = 0;
        if (!getters.cartComList) return price;
        switch (getters.brand_id) {
            // 瑞幸的购物车添加
            case 13:
                getters.resultList.forEach(resultNum => {
                    const currentItem = getters.cartComList.find(res => res.id == resultNum);
                    if (currentItem) price += Number(currentItem.amount * (currentItem.product_price - currentItem.user_price));
                });
                break;
            case 5:
                getters.cartComList.forEach(res => price += Number(res.amount * (res.product_price - res.user_price)));
                break;
            case 97:
                getters.cartComList.forEach(res => price += Number(res.amount * (res.originalPrice - res.price)));
                break;
            case 99:
                getters.resultList.forEach(resultNum => {
                    const currentItem = getters.cartComList.find(res => res.id == resultNum);
                    if (currentItem) price += Number(currentItem.amount * (currentItem.originalPrice - currentItem.price));
                });
                break;
        }
        return price.toFixed(2);
    },
    // 去结算生成的列表
    submitList: (state, getters) => {
        let list = [];
        if (getters.cartComList) {
            switch (getters.brand_id) {
                // 瑞幸的购物车添加
                case 13:
                    getters.resultList.forEach(resultNum => {
                        const currentItem = getters.cartComList.find(res => res.id == resultNum);
                        // 瑞幸的列表添加 - 提交选中的模块
                        if (currentItem) {
                            list.push({
                                product_id: currentItem.product_id,
                                amount: currentItem.amount,
                                sku_code: currentItem.product_details[0].sku_code
                            });
                        }
                    });
                    break;
                    // 麦当劳的购物车的添加
                case 5:
                    getters.cartComList.forEach(res => {
                        list.push({
                            product_id: res.product_id,
                            amount: res.amount,
                            skuArr: res.product_details
                        });
                    });
                    break;
                case 97:
                    // 肯德基
                    getters.cartComList.forEach(res => {
                        list.push({
                            product_id: res.product_id,
                            amount: res.amount,
                        });
                    });
                    break;
                case 99:
                    // 星巴克
                    getters.resultList.forEach(resultNum => {
                        const currentItem = getters.cartComList.find(res => res.id == resultNum);
                        // 瑞幸的列表添加 - 提交选中的模块
                        if (currentItem) {
                            list.push({
                                ...currentItem.product_details[0],
                                productId: currentItem.product_id,
                                num: currentItem.amount
                            });
                        }
                    });
                    break;
            }
        }
        return list;
    },
    // 选中的列表
    selSubList: (state, getters) => {
        let list = [];
        if (!getters.cartComList) return list;
        getters.resultList.forEach(resultNum => {
            const currentItem = getters.cartComList.find(res => res.id == resultNum);
            if (currentItem) list.push(currentItem);
        });
        return list;
    }
};
export default getters;
