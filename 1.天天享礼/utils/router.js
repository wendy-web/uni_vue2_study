import { getAutoLogin } from './auth.js';
// 路由白名单
const whiteList = ['/pages/tabBar/user/index', '/pages/tabBar/home/index', '/pages/user/strategy/index', '/pages/user/medal/index'];

//路由函数
export let router = {
    navigateTo(config) {
        routeDetection(config).then(e => {
            uni.navigateTo(config);
        });
    },
    redirectTo(config) {
        routeDetection(config).then(e => {
            uni.redirectTo(config);
        });
    },
    reLaunch(config) {
        routeDetection(config).then(e => {
            uni.reLaunch(config);
        });
    },
    switchTab(config) {
        routeDetection(config).then(e => {
            uni.switchTab(config);
        });
    },
    navigateBack(config) {
        routeDetection(config).then(e => {
            uni.navigateBack(config);
        });
    }
};
//上一个页面的path
export let nextRouterPath = '';
//保存登录成功后重定向页面
export let redirect = '';
//清空重定向记录
export function clearRedirect() {
    redirect = '';
}

// 路由拦截 用于需登录界面,重定向问题
function routeDetection(config) {
    return new Promise((resolve, reject) => {
        //登录校验
        let accredit = Boolean(getAutoLogin());
        nextRouterPath = config.url;
        //没在白名单里就跳转登录
        if (whiteList.findIndex(item => item === config.url.replace(/\?.+/, '')) == -1) {
            //保存登录成功后跳转页
            redirect = config.url;
            //是否登录
            if (!accredit) {
                uni.navigateTo({
                    url: '/pages/tabAbout/login/index'
                });
                return;
            }
            //继续访问
            return resolve();
        }
        redirect = ''; //其它就设置为空
        //正常访问
        resolve();
    });
}