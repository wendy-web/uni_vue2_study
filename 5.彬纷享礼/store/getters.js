const getters = {
	//登录相关
	token: state => state.login.token,
	userLocation: state => state.login.userLocation,
	userInfo: state => state.login.userInfo,
	wxUserInfo: state => state.login.wxUserInfo,
	uid: state => state.login.uid,
	isAuthorization: state => state.login.isAuthorization,
	isLogin: state => state.login.isLogin,
	//系统相关
	isConnected: state => state.app.isConnected,
	//tabber小红点显示控制
	isTabBarRedDot: state => state.app.isTabBarRedDot,
	// 一元轻松享相关
	checkCardVolume: state => state.personal.checkCardVolume,
	statistics: state => state.personal.statistics,
	welfareTop: state => state.personal.welfareTop,
	adData: state => state.personal.adData,
	//基础配置相关
	isShowAd: state => state.config.isShowAd,
	zm_show_num: state => state.config.zm_show_num,
	ad_jump_url: state => state.config.ad_jump_url,
	ad_jump_url_img: state => state.config.ad_jump_url_img,
	user_tt_word: state => state.config.user_tt_word,
	jf_jump: state => state.config.jf_jump,
	ttxlJumpConfig: state => state.config.ttxlJumpConfig,
	scanResult: state => state.config.scanResult,
	newUser: state => state.config.newUser,
	newPeople: state => state.config.newPeople,
	losingIcon: state => state.config.losingIcon,
	homeIcon: state => state.config.homeIcon,
	tradeJump: state => state.config.tradeJump,
};
export default getters;