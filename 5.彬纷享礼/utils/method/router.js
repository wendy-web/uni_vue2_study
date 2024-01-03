import store from '@/store';

//无需授权，无需登录的页面
const whiteList = [
	'/pages/tabBar/service/service',
	'/pages/tabBar/personal/index',
	'/pages/tabBar/ttxl/index',
	'/pages/tabBar/home/index',
	'/pages/login/login',
	'/pages/loginInner/loginInner',
	'/pages/webview/webview',
	'/pages/noLocation/noLocation',
	'/pages/scan/sweepRingCode/sweepRingCode'
];

export function go(config) {
	routeDetection(config).then(e => {
		uni.navigateTo(config);
	});
}

export function redirectTo(config) {
	routeDetection(config).then(e => {
		uni.redirectTo(config);
	});
}

export function reLaunch(config) {
	routeDetection(config).then(e => {
		uni.reLaunch(config);
	});
}

export function switchTab(config) {
	routeDetection(config).then(e => {
		uni.switchTab(config);
	});
}

export function navigateBack(config) {
	// routeDetection(config).then(e => {
	uni.navigateBack(config);
	// });
}



//路由拦截 用于需登录界面,重定向问题
function routeDetection(config) {
	return new Promise((resolve, reject) => {
		//登录校验
		let isLogin = store.getters.isLogin
		let isAuthorization = store.getters.isAuthorization
		//没在白名单里就跳转登录
		if (!whiteList.includes(config.url.replace(/\?.+/, ''))) {
			//未授权
			if (!isAuthorization) {
				uni.navigateTo({
					url: '/pages/login/login'
				});
				return;
			}
			//未登录
			if (!isLogin) {
				uni.navigateTo({
					url: '/pages/loginInner/loginInner'
				});
				return;
			}
			//继续访问
			return resolve();
		}
		//正常访问
		resolve();
	});
}