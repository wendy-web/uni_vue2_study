const getAccountInfo = wx.getAccountInfoSync();
module.exports = {
  //获取小程序版本号
  getVersion(){
    let envVersion = getAccountInfo.miniProgram.envVersion || 'release';
    // console.log("获取小程序版本号：",getAccountInfo);
    let dev = envVersion == 'release'? true : false;//正式、测试
    return dev
  }
}