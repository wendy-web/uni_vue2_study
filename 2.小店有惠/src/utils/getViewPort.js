import log from '@/utils/log.js'
export default function() {
    let res = uni.getSystemInfoSync()
    log.addFilterMsg('systeminfo')
    log.info(res)
        //导航栏高度
    let custom = wx.getMenuButtonBoundingClientRect() //胶囊按钮位置信息
    let navBarHeight = (custom.top - res.statusBarHeight) * 2 + custom.height //计算得出导航栏高度
    return {
        navHeight: res.statusBarHeight + navBarHeight,
        windowHeight: res.windowHeight
    }
}