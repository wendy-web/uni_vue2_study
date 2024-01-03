import {
	ctoolsIshide,
	getConfig
} from "@/api/homeApi.js"

const state = {
	isShowAd: true,
	zm_show_num: 1, //战马拉环扫码广告控制
	ad_jump_url: "", //扫码异常信息广告
	ad_jump_url_img: "", //图片
	user_tt_word: "",
	jf_jump: {
		img: "",
		url: ""
	},
	ttxlJumpConfig: {},
	scanResult: {
		btn_word: "前往换购",
		suspend_word: "福利待领取"
	},
	newUser: 0, // 新人标识
	losingIcon: '', // 新人翻转配置图片
	homeIcon: ''
	
};

const mutations = {
	setPositionUrl(state, data = {}) { //网络状态
		state.positionUrl = data;
	},
	setIsShowAd(state, data) {
		state.isShowAd = data;
	},
	setZmShowNum(state, data) {
		state.zm_show_num = data;
	},
	setAdJumpUrlImg(state, data) {
		state.ad_jump_url_img = data;
	},
	setAdJumpUrl(state, data) {
		state.ad_jump_url = data;
	},
	setUserWord(state, text) {
		state.user_tt_word = text
	},
	setJf_jump(state, data = {}) {
		state.jf_jump = data
	},
	setTtxlJumpConfig(state, data = {}) {
		state.ttxlJumpConfig = data
	},
	setScanResult(state, data) {
		if (data) state.scanResult = data
	},
	setNewUser(state, data) {
		if (data) state.newUser = data
	},
	setLosingIcon(state, data) {
		if (data) state.losingIcon = data
	},
	sethomeIconIcon(state, data) {
		if (data) state.homeIcon = data
	},
};

const actions = {
	//获取用户信息
	async getConfig({
		commit
	}) {
		let ctoolsData = await ctoolsIshide()
		let configData = await getConfig()
		commit('setIsShowAd', Boolean(ctoolsData.data?.ad_show));
		commit('setZmShowNum', configData.data?.zm_show_num);
		commit('setAdJumpUrlImg', configData.data?.ad_jump?.img);
		commit('setAdJumpUrl', configData.data?.ad_jump?.url);
		commit('setUserWord', configData.data?.word);
		commit('setJf_jump', configData.data?.jf_jump);
		commit('setScanResult', configData.data?.ad1);
		commit('setNewUser', configData.data?.new_user);
		commit('setLosingIcon', configData.data?.losing_icon);
		commit('sethomeIconIcon', configData.data?.home_icon);
		/*处理跳转天天享礼配置*/
		let bfxl = configData.data?.positionUrl?.bfxl,
			ttxlJumpConfig = {}

		if (Object.prototype.toString.call(bfxl) === "[object Object]") {

			Object.keys(bfxl).forEach(i => {

				Object.keys(bfxl[i]).forEach(j => {

					ttxlJumpConfig[i + '_' + j] = bfxl[i][j]

				})

			})

			commit('setTtxlJumpConfig', ttxlJumpConfig);

		}

	},
};

export default {
	namespaced: true,
	state,
	mutations,
	actions
};