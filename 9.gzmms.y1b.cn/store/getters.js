const getters = {
    //登录相关
    token: state => state.user.token,
    userInfo: state => state.user.userInfo,
    moduleType: state => state.user.moduleType,
    isConnected: state => state.app.isConnected,
    adminTitleShow: (state, getters) => {
        const moduleType = state.user.moduleType;
        let title = 'GZHN云物料';
        switch (moduleType) {
            case 0:
                title = '物料管理'
                break;
            case 1:
                title = '设备管理'
                break;
            case 2:
                title = '物料管理'
                break;
        }
        return title;
    },
    envVersion: state => state.app.envVersion,
    SDKVersion: state => state.app.SDKVersion
};
export default getters;
