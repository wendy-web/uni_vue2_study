const getters = {
	//登录相关
	token: state => state.login.token,
	userInfo: state => state.login.userInfo,
	isAuthorization: state => state.login.isAuthorization,
	isLogin: state => state.login.isLogin,
	//系统相关
	isConnected: state => state.app.isConnected,
	billLoaded: state => state.app.billLoaded, // 账单是否加载过
	isMiniprogram: state => state.app.isMiniprogram, // 是否是小程序环境
	billInfo: state => state.bill.billInfo, // 账单信息
};
export default getters;