const getters = {
    token: state => state.user.token,
    isAuthorization: state => state.user.isAuthorization,
    isAutoLogin: state => state.user.isAutoLogin,
    isAutoPrivacy: state => state.user.isAutoPrivacy,
    uid: state => state.user.uid,
    isMiniProgram: state => state.user.isMiniProgram, // 打开其他的小程序
    gift: state => state.user.gift,
    unionid: state => state.user.unionid,
    location: state => state.user.location,
    isConnected: state => state.app.isConnected,
    isCardNewShow: state => state.user.isCardNewShow,
    diaList: state => state.user.diaList,
    userInfo: (state, getters) => {
        const isAutoLogin = getters.isAutoLogin;
        return isAutoLogin ? state.user.userInfo : {
            credits: 0
        }
    },
    vipObject: state => state.user.vipObject,
};
export default getters;
