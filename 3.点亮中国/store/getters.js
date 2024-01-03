const getters = {
    //登录相关
    token: state => state.user.token,
    new_user: state => state.user.new_user,
    isAutoLogin: state => state.user.isAutoLogin,
    userInfo: (state, getters) => {
        const isAutoLogin = getters.isAutoLogin;
        const { avatar_url, nick_name } = state.user.userInfo;
        return isAutoLogin ? state.user.userInfo : {
            credits: 0,
            oldAvaUrl: avatar_url,
            oldNickName: nick_name
        }
    },
    isAuthorization: state => state.user.isAuthorization,
    uid: state => state.user.uid,
    location: state => state.user.location,
    isConnected: state => state.app.isConnected,
    soonMedalId: state => state.user.soonMedalId,
    //业务相关
    lightModeList: state => state.business.lightModeList,
    lightModePower: state => state.business.lightModePower,
    nextCity: state => state.business.nextCity,
    operaType: state => state.business.operaType,
    helpInviteData: state => state.business.helpInviteData
};
export default getters;