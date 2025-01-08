/*获取 Navbar navBarHeight statusBarHeight menuWidth*/
/*
    wx.getEnterOptionsSync()； 获取本次小程序启动时的参数
    enterOptions.apiCategory区分小程序打开的模式：embedded为半屏；default是正常打开的情况
*/
export function getNavbarData() {
    return new Promise(function(resolve, reject) {
        /*从本地获取navbar 信息*/
        let data = wx.getStorageSync('xh-navbar-system');
        const enterOptions = wx.getEnterOptionsSync();
        const apiCategory = enterOptions.apiCategory;
        //有缓存直接返回
        if (data && data.apiCategory == apiCategory) return resolve(JSON.parse(data));
        /* 从系统获取 */
        wx.getSystemInfo({
            success: (res) => {
                let {
                    statusBarHeight,
                    system
                } = res;
                let menuButton = null;
                try {
                    menuButton = wx.getMenuButtonBoundingClientRect();
                } catch (e) {
                    //TODO handle the exception
                }
                menuButton = menuButton || {
                    left: 110,
                    top: 44
                };
                // 导航栏高度 android = 48 ios = 44
                let navBarHeight = /ios/.test(system.toLocaleLowerCase()) ? 44 : 48;
                //胶囊宽度
                let menuWidth = res.windowWidth - 110 + 10;
                if (menuButton) {
                    // 导航栏高度
                    navBarHeight = (menuButton.top - res.statusBarHeight) * 2 + menuButton.height //计算得出导航栏高度
                        // 胶囊宽度
                    menuWidth = res.windowWidth - menuButton.left + 10;
                }
                resolve({
                    navBarHeight,
                    statusBarHeight, //状态栏高度
                    menuWidth,
                    top: menuButton.top
                });
                //存储到本地
                wx.setStorageSync('xh-navbar-system', JSON.stringify({
                    navBarHeight,
                    statusBarHeight,
                    menuWidth,
                    top: menuButton.top,
                    apiCategory
                }));
            }
        });

    });
}