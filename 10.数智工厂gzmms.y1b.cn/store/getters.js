const typeList = ['仓储管理WMS', '设备管理EMS', '安全管理ANDON', '生产管理PMC', '质量管理QMS', '能源管理EMIS'];
const getters = {
    //登录相关
    token: state => state.user.token,
    userInfo: state => state.user.userInfo,
    moduleType: state => state.user.moduleType,
    isConnected: state => state.app.isConnected,
    adminTitleShow: (state, getters) => {
        const moduleType = state.user.moduleType;
        return typeList[moduleType];
    },
    envVersion: state => state.app.envVersion,
    SDKVersion: state => state.app.SDKVersion,
    productLineOptions: state => state.device.productLineOptions,
    eqipmentTypeOptions: state => state.device.eqipmentTypeOptions,
    deptlistOptions: state => state.device.deptlistOptions,
    userListOptions: state => state.device.userListOptions,
    eqipmentStatus: state => state.device.eqipmentStatus,
};
export default getters;