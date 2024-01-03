import API, {
	baseUrl
} from './http/xhHttp.js';

//C发起支付
export function createcardpay(data) {

	return API.request({
		url: '/api2/ccard/createcardpay',
		method: 'post',
		data
	});

}
//用户拉环码 
export function cscanQr(data) {

	return API.request({
		url: '/api2/cscan/qr',
		method: 'post',
		data
	});

}

//我的卡包 
export function getcardlog(data) {

	return API.request({
		url: '/api2/ccard/getcardlog2',
		data,
		method: 'post',
		isNoLoading: true
	});

}

//卡包顶部统计
export function getcardcount() {
	return API.request({
		url: '/api2/ccard/getcardcount',
		method: 'post'
	});
}

//C用户校验店铺
// export function checkshopsid(data) {

// 	return API.request.post({
// 		url: '/api2/ccard/checkshopsid',
// 		data
// 	});

// }
//C我的卡包-已用
export function getcardpack(data) {

	return API.request({
		url: '/api2/ccard/getcardpack',
		method: 'post',
		data,
		isNoLoading: true
	});

}

//C用户扫罐底码 
export function cscanBotqr(data) {
	return API.request({
		url: '/api2/cscan/botqr',
		method: 'post',
		data,
		isNoLoading: true
	});

}

//C扫核销码轮询 /api2/ccard/poll
export function cscanPoll(data) {
	return API.request({
		url: '/api2/ccard/poll',
		method: 'post',
		data,
		isNoLoading: true
	});

}
//地区判断
export function ctoolsIshide() {
	return API.request({
		url: '/api2/ctools/ishide',
		method: 'post',
		isNoLoading: true
		// ,
		// _delaySecond: 3
	});

}
//获取广告地址
export function adGet(isCache = false) {
	return API.request({
		url: '/api/ad/get',
		method: 'post',
		data: {
			app: 1
		},
		isCache,
		type: 'cache',
		isNoLoading: true
	});

}
//卡包过期回调
export function ccardExpirepage(data) {
	return API.request({
		url: '/api2/ccard/expirepage',
		method: 'post',
		data,
		isNoLoading: true
	});

}
//设置卡券过期
export function setexpire(data) {
	return API.request({
		url: '/api2/ccard/setexpire',
		method: 'post',
		data,
		isNoLoading: true
	});

}

//根据订单号生成二维码 
export function getcardqr(data) {
	return API.request({
		url: '/api2/ctools/getcardqr2',
		method: 'post',
		data
	});

}
//获取新闻列表 
export function getArticle(data, flag = false) {
	return API.request({
		url: '/api2/ctools/article',
		method: 'post',
		data,
		isNoLoading: true
		// ,
		// isCache:flag,//flag = true 取缓存
		// type: data.next === 1 ? 'cache' : ''//只缓存第一页
	});

}

//文章点赞 
export function givelike(data) {
	return API.request({
		url: '/api2/ctools/givelike',
		method: 'post',
		data
	});
}

//获取附近商铺
export function getnearby(data) {
	return API.request({
		url: '/api2/ctools/getnearby',
		method: 'post',
		data,
		// type: 'cache',
		// cacheMaxAge: 60,
		// isCache: !noCache
	});
}

//经纬度换地址
export function getpoints(data) {
	return API.request({
		url: '/api2/ctools/getpoints',
		method: 'post',
		data
	});
}

//店铺白名单
export function shopwhite(data) {
	return API.request({
		url: '/api2/ctools/shopwhite',
		method: 'post',
		data
	});
}

//积分记录
export function getcreditslog(data) {
	return API.request({
		url: '/api2/cuser/getcreditslog',
		method: 'post',
		data
	});
}
//扫码记录 
export function scanlog(data) {
	return API.request({
		url: '/api2/cscan/scanlog',
		method: 'post',
		data
	});
}
//福利列表
export function getgifts(data) {
	return API.request({
		url: '/api2/Cgift/getgifts',
		method: 'post',
		data
	});
}
//过期回调
export function expiregifts(data) {
	return API.request({
		url: '/api2/Cgift/expiregifts',
		method: 'post',
		isNoLoading: true,
		data
	});
}
//去使用回调
export function togifts(data) {
	return API.request({
		url: '/api2/Cgift/togifts',
		method: 'post',
		data
	});
}
//福利顶部统计
export function getCount(data) {
	return API.request({
		url: '/api2/Cgift/getCount',
		method: 'post',
		data
	});
}
//视频翻倍
export function videofb(data) {
	return API.request({
		url: '/api2/cgift/videofb',
		method: 'post',
		data
	});
}

//是否或大奖
export function cactGetInfo() {
	return API.request({
		url: '/api2/cact/getInfo',
		method: 'post'
	});
}

export function updateInfo(data) {
	return API.request({
		url: '/api2/cact/updateInfo',
		method: 'post',
		data
	});
}

//是否显示人工智障
export function gpt() {
	return API.request({
		url: '/api/get/gpt',
		method: 'post'
	});
}

//其它功能
export function getConfig() {
	return API.request({
		url: '/api2/cget/getConfig',
		method: 'post'
	});
}

//天天享礼积分

export function getTtxlUser() {
	return API.request({
		url: '/api2/cuser/getTtxlUser',
		method: 'post'
	});
}




//上传图片
export function imgupload() {
	return baseUrl + '/api2/Ctools/imgupload'
}

export function addpush(data) {
	return API.request({
		url: '/api2/cpush/addpush',
		method: 'post',
		data
	});
}

// //临时支付
//  export function pay(data) {
// 	return API.request({
// 		url: '/api2/temp/pay',
//method: 'post',
// 		data
// 	});
// }


// return pay().then(res=>{
//  let data = res.data
//   uni.requestPayment({
//   	"nonceStr": data.nonceStr,
//   	"package": data.package,
//   	"paySign": data.paySign,
//   	"signType": data.signType,
//   	"timeStamp": data.timeStamp,
//   	success(res) {

//   	},
//   	fail(err) {

//   	}
//   })
//  })