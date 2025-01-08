import store from '@/store/index.js';

/**
 *
 * @param assocType 接口返回的assoc_type:number | number[] 
 * @param query 需要判断的值: number | number[]
 * @returns
 */
export function checkAssocType(assocType, query) {
	if (!Array.isArray(assocType) && !Array.isArray(query)) {
		let result = assocType == query ? true : false;
		return result
	}
	if (Array.isArray(query)) {
		return query.some((item) => assocType.includes(item));
	}
	if (assocType.includes(query)) {
		return true;
	} else {
		return false;
	}
}

/**
 * @example 检测是否拥有按钮权限
 * @param {Arrar} sign 权限标识数组
 */
export function hasPerm(sign) {
	let role_id = store.state.user.userInfo?.role_id;
	let perms = store.state.user.perms;
	// console.log("role_id", role_id)
	// console.log("perms", perms)
	// console.log("sign",sign)
	if (role_id == 0) {
		return true;
	} else {
		const isHas = perms?.some((item) => {
			return sign.includes(item);
		});
		return isHas
	}
}
export function checkBtn(signKey, getKey) {
    let mapObj = maintainBtnPermsMap.get(getKey);
    let signValue = mapObj ? mapObj[signKey] : [];
    return hasPerm(signValue);
}

export function setToken(data) {
	setStorage('token', data);
}

export function setUserInfo(data) {
	setStorage('userinfo', data);
}
export function setPerms(data) {
	setStorage('perms', data);
}

export function setMouleType(data) {
	setStorage('moduleType', data);
}

export function getMouleType() {
	return getStorage('moduleType');
}

export function getPerms() {
	let perms = getStorage('perms');
	if (perms) {
		return perms;
	}
	return [];
}

export function getToken() {
	return getStorage('token');
}

export function removeToken() {
	uni.removeStorageSync('token');
}

export function getUserInfo() {
	let userInfo = getStorage('userinfo');
	if (userInfo) {
		return userInfo;
	}
	return {
		id: "",
		name: "",
		openid: "",
		unionid: "",
		head_url: ""
	};
}

export function removeGetUserInfo() {
	uni.removeStorageSync('userinfo');
}

export function removePerms() {
	uni.removeStorageSync("perms")
}

export function setStorage(key, data) {

	try {
		uni.setStorageSync(key, data);
	} catch (e) {
		//TODO handle the exception
	}
}

export function getStorage(key) {
	let cache = null;
	try {
		cache = uni.getStorageSync(key);
	} catch (e) {
		cache = '';
	}
	return cache;
}

/* 获取经纬度 */
export function getLocation() {
    let cache = getStorage('getUserLocation');
    cache = cache && JSON.parse(cache);
    return cache && cache.data;
}

/**  1:采购单号,2:采购退货单号,3:换货单号,4采购入库单号,5退货出库单号,6领料出库单号,7:退料入库单号,8:拆装单单号,9:调拨单单号,10:盘点单单号,11:报废单单号---按钮权限标识  */
export const btnPermsMap = new Map()
// 1采购单
btnPermsMap.set(1, {
	detail: ['buy:order:detail'],
	submit: ['buy:order:submit'],
	void: ['buy:order:void'],
	recall: ['buy:order:recall'],
	del: ['buy:order:del'],
	approve: ['buy:order:approve'],
	reject: ['buy:order:reject']
})

// 2采购退货单
btnPermsMap.set(2, {
	detail: ['buy:refund:detail'],
	submit: ['buy:refund:submit'],
	void: ['buy:refund:void'],
	recall: ['buy:refund:recall'],
	del: ['buy:refund:del'],
	approve: ['buy:refund:approve'],
	reject: ['buy:refund:reject']
})
// 3采购换货单
btnPermsMap.set(3, {
	detail: ['buy:swap:detail'],
	submit: ['buy:swap:submit'],
	void: ['buy:swap:void'],
	recall: ['buy:swap:recall'],
	del: ['buy:swap:del'],
	approve: ['buy:swap:approve'],
	reject: ['buy:swap:reject']
})

// 4采购入库单
btnPermsMap.set(4, {
	detail: ['sto:buyin:detail'],
	submit: ['sto:buyin:submit'],
	void: ['sto:buyin:void'],
	recall: ['sto:buyin:recall'],
	del: ['sto:buyin:del'],
	approve: ['sto:buyin:approve'],
	reject: ['sto:buyin:reject'],
	whapprove: ['sto:buyin:whapprove'],
	whreject: ['sto:buyin:whreject']
})
// 5退货出库单
btnPermsMap.set(5, {
	detail: ['sto:retgoods:detail'],
	submit: ['sto:retgoods:submit'],
	void: ['sto:retgoods:void'],
	recall: ['sto:retgoods:recall'],
	del: ['sto:retgoods:del'],
	approve: ['sto:retgoods:approve'],
	reject: ['sto:retgoods:reject']
})

// 6领料单页面自行处理了
btnPermsMap.set(6, {
	detail: ["sto:getsup:detail"],
})

// 7退料入库单
btnPermsMap.set(7, {
	detail: ['sto:retsupin:detail'],
	submit: ['sto:retsupin:submit'],
	void: ['sto:retsupin:void'],
	recall: ['sto:retsupin:recall'],
	del: ['sto:retsupin:del'],
	approve: ['sto:retsupin:approve'],
	reject: ['sto:retsupin:reject'],
	whapprove: ['sto:retsupin:whapprove'],
	whreject: ['sto:retsupin:whreject'],
})

// 8拆装单
btnPermsMap.set(8, {
	detail: ['buy:split:detail'],
	submit: ['buy:split:submit'],
	void: ['buy:split:void'],
	recall: ['buy:split:recall'],
	del: ['buy:split:del'],
	approve: ['buy:split:approve'],
	reject: ['buy:split:reject']
})
// 9调拨单
btnPermsMap.set(9, {
	detail: ['sto:allot:detail'],
	submit: ['sto:allot:submit'],
	void: ['sto:allot:void'],
	recall: ['sto:allot:recall'],
	del: ['sto:allot:del'],
	approve: ['sto:allot:approve'],
	reject: ['sto:allot:reject'],
	whapprove: ['sto:allot:whapprove'],
	whreject: ['sto:allot:whreject']
})

// 10盘点单
btnPermsMap.set(10, {
	add: ['sto:check:add'],
	edit: ['sto:check:edit'],
	detail: ['sto:check:detail'],
	submit: ['sto:check:submit'],
	void: ['sto:check:void'],
	recall: ['sto:check:recall'],
	del: ['sto:check:del'],
	approve: ['sto:check:approve'],
	reject: ['sto:check:reject']
})

// 11报废单
btnPermsMap.set(11, {
	detail: ['sto:scrap:detail'],
	submit: ['sto:scrap:submit'],
	void: ['sto:scrap:void'],
	recall: ['sto:scrap:recall'],
	del: ['sto:scrap:del'],
	approve: ['sto:scrap:approve'],
	reject: ['sto:scrap:reject']
})

// 12其他入库单
btnPermsMap.set(12, {
	detail: ['sto:otherin:detail'],
	submit: ['sto:otherin:submit'],
	void: ['sto:otherin:void'],
	recall: ['sto:otherin:recall'],
	del: ['sto:otherin:del'],
	approve: ['sto:otherin:approve'],
	reject: ['sto:otherin:reject'],
	whapprove: ['sto:otherin:whapprove'],
	whreject: ['sto:otherin:whreject']
})


export const deviceBtnPermsMap = new Map()
// 1点巡检记录, 点巡检执行计划按钮/整改按钮 使用edit的'inspection:record:addedit'权限;
deviceBtnPermsMap.set(1, {
	edit: ['inspection:record:addedit'],
	detail: ['inspection:record:detail'],
	submit: ['inspection:record:submit'],
	recall: ['inspection:record:recall'],
	approve: ['inspection:record:approve'],
	reject: ['inspection:record:reject'],
})
// 点巡检计划
deviceBtnPermsMap.set(2, {
	edit: ['inspection:record:addedit'],
	detail: ['inspection:plan:detail'],
})

export const maintainBtnPermsMap = new Map()
// 1 - 设备维修单
maintainBtnPermsMap.set(1, {
	addedit: ['maintain:repair:addedit'],
	detail: ['maintain:repair:detail'],
	submit: ['maintain:repair:submit'],
	recall: ['maintain:repair:recall'],
	void: ['maintain:repair:void'],
	approve: ['maintain:repair:approve'], // 验收通过
	reject: ['maintain:repair:reject'],
	del: ['maintain:repair:del'],
})
// 2 - 保养计划
maintainBtnPermsMap.set(2, {
    add: ['maintain:plan:add'],
    detail: ['maintain:plan:detail'],
	edit: ['maintain:plan:edit'],
	del: ['maintain:plan:del'],
	enable: ['maintain:plan:enable'],
})
// 3 - 保养工单
maintainBtnPermsMap.set(3, {
    add: ['maintain:workorder:add'],
    detail: ['maintain:workorder:detail'],
    edit: ['maintain:workorder:edit'],
    submit: ['maintain:workorder:submit'],
    recall: ['maintain:workorder:recall'],
    approve: ['maintain:workorder:approve'],
    reject: ['maintain:workorder:reject'],
})