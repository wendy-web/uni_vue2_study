/*获取 Navbar navBarHeight statusBarHeight menuWidth*/
export function getNavbarData() {
    return new Promise(function(resolve, reject) {
        /*从本地获取navbar 信息*/
        let data = wx.getStorageSync('xh-navbar-system');
        //有缓存直接返回
        if (data) return resolve(JSON.parse(data));
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
                //导航栏高度 android = 48 ios = 44
                let navBarHeight = /ios/.test(system.toLocaleLowerCase()) ? 44 : 48;
                //胶囊宽度
                let menuWidth = res.windowWidth - 110 + 10;
                if (menuButton) {
                    //导航栏高度
                    navBarHeight = (menuButton.top - res.statusBarHeight) * 2 + menuButton.height //计算得出导航栏高度
                        //胶囊宽度
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
                    platform: res.platform
                }));
            }
        });

    });
}