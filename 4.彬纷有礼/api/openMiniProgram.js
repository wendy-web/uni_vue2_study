// 打开其它小程序
module.exports = {
  // 小店优惠小程序
  // 2023年8月9日 新增打开半屏小程序：区分积分商城页  和 扫码落地页
  xdyhMini({
    path = '/pages/home/index',
    appId = 'wx90c41e1f393af0ff',
    halfScreen = ''
  } = {}) {
    var openMiniprogram = wx.navigateToMiniProgram;
    if (wx.canIUse('openEmbeddedMiniProgram') && halfScreen == 1) {
     
      openMiniprogram = wx.openEmbeddedMiniProgram;
    }
    openMiniprogram({
      appId,
      path,
      envVersion:'trial',
      fail(err) {
        console.log(err)
      },
      success(res) {
        console.log(res)
      }
    })

  },
  // 彬纷有礼+ 小程序
  bfylPlus(path = 'pages/tabBar/activity/index', appId = 'wxfeae7ff917675ffe') {
    wx.navigateToMiniProgram({
      appId,
      path
    })
  },
  // 事件埋点上报 
  reportEvent(name, data){
    if (wx.canIUse('reportEvent')) {
      wx.reportEvent(name, data)
    }
  }
}