import {
	getLitWay,
	getUserNextLitCity
} from '@/api/modules/home.js';

import {
	getUserLocation
} from '@/utils/getUserLocation.js'
import {
	getShareUrl
} from '@/api/modules/help.js'
const state = {
	operaType: 0, // 区分个人或团队
	nextCity: null, // 下一座点亮的城市
	lightModeList: [], // 点亮模式集合
	helpInviteData: null, // 好友助力相关
	lightModePower: { // 点亮模式权限
		SCAN: true,
		WATCH: true,
		QUIZ: true,
		HELP: true
	},
	isNextQrAd: false //是否即将调整扫码广告页
};

const mutations = {
	setLightModeList(state, data) {
		state.lightModeList = data
	},
	setOperaType(state, data) {
		state.operaType = data
	},
	setNextCity(state, data) {
		state.nextCity = data
	},
	setHelpInviteData(state, data) {
		state.helpInviteData = data
	},
	setLightModePower(state, data) {
		state.lightModePower = data
	},
	setIsNextQrAd(state, data) {
		state.isNextQrAd = data
	}
};

const actions = {
	updateLightModeList({
		commit
	}) {

		return new Promise((resolve, reject) => {

			getLitWay().then(res => {
				let list = res.data ? res.data.list : [];
				let lightModePower = {}
				commit('setLightModeList', list.map(item => {
					item.num = Number(item.num)
					item.used_num = Number(item.used_num)
					item.surplus_num = Number(item.surplus_num)
					item.disabled = item.tag !== 'HELP' && item.surplus_num <= 0
					lightModePower[item.tag] = item.tag === 'HELP' || item.surplus_num >
						0
					return {
						...item
					}
				}))
				commit('setLightModePower', lightModePower)
				resolve()
			});

		})

	},
	getHelpInviteData({
		commit
	}) {
		return new Promise((resolve, reject) => {
			getUserLocation().then(res => {
				let {
					longitude,
					latitude
				} = res.data
				getShareUrl().then(res => {

					commit('setHelpInviteData',
						`${res.data.url.split('?')[1]}&longitude=${longitude}&latitude=${latitude}`
					)

					resolve()

				})
			})
		})
	},
	getNextCity({
		commit
	}) {
		return new Promise((resolve, reject) => {
			//如果是第一次
			if (this.getters.userInfo.city_num == 0) {
				getUserLocation().then(res => {
					let {
						longitude,
						latitude
					} = res.data
					getUserNextLitCity({
						longitude,
						latitude
					}).then(res => {
						if (res.code == 1) {
							commit('setNextCity', res.data)
						}
						resolve()
					})
				})
				return
			};
			getUserNextLitCity().then(res => {
				if (res.code == 1) {
					commit('setNextCity', res.data)
				}
				resolve()
			})
		})
	}
};

export default {
	namespaced: true,
	mutations,
	state,
	actions
};
