/**
 * @description: 检测订阅消息是否开启
 * @param key {String} 订阅消息模板KEY[ID]， 可判断是否开启了该订阅消息授权
 */


/** 订阅消息id  */
const msgTemplateId = "QWRWD5b6Wi3rQ_hMYrvQprB-14x_t8_VyJmLKsHzqbk";
export function isOpenSubscribeToNewsAndAuth(key = msgTemplateId) {
	return new Promise((resolve, reject) => {
		wx.getSetting({
			withSubscriptions: true,
			success: (res) => {
				console.log("isOpenSubscribeToNewsAndAuth", res);
				let { subscriptionsSetting = {} } = res;
				let { mainSwitch = false, itemSettings = {} } = subscriptionsSetting;
				if (!subscriptionsSetting) {
					return reject(new Error('无法获取订阅消息对象，可能版本库兼容原因'))
				}
				if (!subscriptionsSetting.mainSwitch) {
					return reject({ msg: "订阅消息未打开", errType: 2 })
				}
				if (!subscriptionsSetting.itemSettings) {
					return reject({ msg: `未有订阅消息列表`, errType: 3 })
				}
				if (subscriptionsSetting.itemSettings && subscriptionsSetting.itemSettings[key] != 'accept') {
					return reject({ msg: `模板消息：${key} 未开启`, errType: 4 })
				}
				resolve(subscriptionsSetting.itemSettings)
			},
			fail: err => reject(err)
		})
	})
}


export function goCollectSet() {
	const SUBSCRIBE_ID = msgTemplateId;
	return new Promise((resolve, reject) => {
		uni.requestSubscribeMessage({
			tmplIds: [SUBSCRIBE_ID],
			success: (res) => {
				console.log("SubscribeMessageRes", res);
				if (res[SUBSCRIBE_ID] === "accept") {
					// 用户点击同意跳转
					resolve({ msg: res[SUBSCRIBE_ID], code: 1 })
				} else if (res[SUBSCRIBE_ID] === "reject") {
					// 用户主动点击拒绝
					wx.getSetting({
						withSubscriptions: true,
						success: async (getSettingRes) => {
							console.log("getSetting", getSettingRes);
							let { subscriptionsSetting = {} } = getSettingRes;
							if (!subscriptionsSetting.itemSettings) {
								// 如果不存在 表示未点击 总是保持以上选择
								resolve({ msg: res[SUBSCRIBE_ID], code: 2 })
							} else {
								// 如果存在 表示点击了 总是保持以上选择
								const openRes = await openDialog(2);
								if (openRes.code === -1) {
									resolve({ msg: `用户点击取消: ${res[SUBSCRIBE_ID]}`, code: 1 })

								} else if (openRes.code === 2) {
									resolve({ msg: `用户未打开: ${res[SUBSCRIBE_ID]},消息开关`, code: 3 })
								} else {
									resolve({ msg: res[SUBSCRIBE_ID], code: 1 })
								}

							}
						},
					})
				} else {
					// uni.showToast({
					// 	title: "授权订阅消息有误",
					// 	icon: "none",
					// });
					reject({ msg: '授权订阅消息有误', code: -2 })
				}
			},
			fail: async (err) => {
				if (err.errCode === 20004) {
					// 20004:用户关闭了主开关，无法进行订阅,引导开启
					const openRes = await openDialog();
					console.log("openRes", openRes);
					if (openRes.code === -1) {
						resolve({ msg: "用户点击取消", code: 1 })
					} else {
						if (!openRes.mainSwitch) {
							resolve({ msg: "用户未打开订阅消息总开关", code: 20004 })
							return
						}
						resolve({ msg: "用户已打开订阅消息总开关", code: 5 })

					}


				} else {
					reject({ msg: err, code: -1 })
				}

			},
		});
	})
}

function openDialog(type = 1, ) {
	const key = msgTemplateId;

	let content = "检测到您未开启订阅消息通知开关，是否去设置？";
	if (type === 2) {
		content = "你已取消订阅该通知消息，只有开启才能正常使用该功能，如果想重新订阅该消息可以点击去设置开启";
	}
	return new Promise((resolve, reject) => {
		uni.showModal({
			title: '提示',
			content,
			confirmText: "去设置",
			success(res) {
				if (res.confirm) {
					uni.openSetting({
						withSubscriptions: true,
						success: (res) => {
							console.log("openSetting", res)
							let { subscriptionsSetting = {} } = res;
							let { mainSwitch = false, itemSettings = {} } = subscriptionsSetting;
							if (type === 1) {
								resolve({ code: 1, mainSwitch })
								return
							}
							if (subscriptionsSetting.itemSettings && subscriptionsSetting.itemSettings[key] !=
								'accept') {
								resolve({ code: 2, msg: subscriptionsSetting.itemSettings[key] })
								return
							}
							resolve({ code: 1 })
						},
						fail: (err) => {
							reject(err)
						}
					})
				} else if (res.cancel) {
					console.log('用户点击取消')
					resolve({ code: -1 })

				}
			}
		})
	})





}