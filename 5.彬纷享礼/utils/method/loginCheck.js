import store from '@/store';

export function hasLogin() {
	//登录校验
	let isLogin = store.getters.isLogin
	let isAuthorization = store.getters.isAuthorization

	//未授权
	if (!isAuthorization) {
		uni.navigateTo({
			url: '/pages/login/login'
		});
		return false;
	}
	//未登录
	if (!isLogin) {
		uni.navigateTo({
			url: '/pages/loginInner/loginInner'
		});
		return false;
	}

	return true

}