import {getLocalStorage, setLocalStorage} from '@/utils/index'
function getStatusBarHeight() {
	let statusBarHeight = 0;
  
	if (window.visualViewport) {
		statusBarHeight = window.visualViewport.offsetTop;
	}
  
	return statusBarHeight;
  }
  

  
/*获取 Navbar navBarHeight statusBarHeight menuWidth*/
export function getNavbarData() {

	return new Promise(function(resolve) {
		/*从本地获取navbar 信息*/
		let data = getLocalStorage('xh-navbar-system');
		//有缓存直接返回
		if (data) return resolve(data);
		const navBarHeight = getStatusBarHeight();
		let screenHeight = window.innerHeight;
		let res = {
			screenHeight,
			navBarHeight
		}
		resolve(res);
		setLocalStorage('xh-navbar-system', res)
	});
}
