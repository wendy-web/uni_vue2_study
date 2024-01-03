import {
	createcardpay,
	getcardcount,
	adGet,
	getCount
} from '@/api/homeApi.js';

import log from '@/utils/log.js';

import {
	cacheAdData
} from '@/utils/auth.js';

const state = {
	checkCardVolume: [], //当前选中待兑换数据
	adData: cacheAdData(), //广告数据
	statistics: {}, //卡劵顶部统计
	welfareTop: {} //其它福利顶部统计
};

const mutations = {
	setCheckCardVolume(state, data) { //选中的待兑换卷
		state.checkCardVolume = data;
	},
	setStatistics(state, data) { //首页与卡包统计
		state.statistics = data;
	},
	setAdData(state, data) { //广告数据
		state.adData = data;
	},
	welfareTop(state, data) { //其它福利顶部统计
		state.welfareTop = data;
	},
};

const actions = {
	wxplay({
		commit
	}, parmas) {

		return new Promise((resolve, reject) => {

			createcardpay(parmas).then(res => {

				if (res.code == 0) {

					return reject(res);
				}

				let data = res.data || {};

				resolve(data);

			});

		});

	},
	//原来微信支付
	// wxplay({
	// 	commit
	// }, parmas) {

	// 	return new Promise((resolve, reject) => {

	// 		createcardpay(parmas).then(res => {

	// 			if (res.code == 0) {

	// 				return reject(res)
	// 			}

	// 			let data = res.data || {}

	// 			uni.requestPayment({
	// 				"nonceStr": data.nonceStr,
	// 				"package": data.package,
	// 				"paySign": data.paySign,
	// 				"signType": data.signType,
	// 				"timeStamp": data.timeStamp,
	// 				success(res) {
	// 					resolve(data.qr_code)
	// 					//打印日志
	// 					log.setFilterMsg('微信支付 requestPayment')
	// 					log.info("requestPayment success==>" + JSON.stringify(res))
	// 				},
	// 				fail(err) {
	// 					reject(err)
	// 					//打印日志
	// 					log.setFilterMsg('微信支付 requestPayment')
	// 					log.error("requestPayment fail==>" + JSON.stringify(err))
	// 				}
	// 			})
	// 		})

	// 	})

	// },
	//获取顶部统计 
	getCardTopCount({
		commit
	}) {
		//C卡包顶部统计
		getcardcount().then(res => {
			if (res.code == 1) {

				let data = res.data;
				//合并数据
				data.three_and_one = data.used + data.expired + data.ongoing;

				return commit('setStatistics', data);
			}
			uni.showModal({
				title: '温馨提示',
				content: res.msg
			});
		});
	},
	//获取顶部统计
	getWelfareTop({
		commit
	}) {
		//C卡包顶部统计
		getCount().then(res => {
			if (res.code == 1) {

				let data = res.data;

				return commit('welfareTop', data);
			}
			uni.showModal({
				title: '温馨提示',
				content: res.msg
			});
		});
	},
	//获取广告数据
	getAdData({
		commit
	}, isCache = false) {

		return new Promise((resolve, reject) => {
			adGet(isCache).then(res => {
				let data = res.data;
				if (res.code == 1 && data) {
					commit('setAdData', data);
					return resolve(data);
				}
				uni.showModal({
					title: '温馨提示',
					content: res.msg
				});
				reject();
			}).catch(e => {
				reject();
			});
		});
	}
};

export default {
	namespaced: true,
	state,
	mutations,
	actions
};
