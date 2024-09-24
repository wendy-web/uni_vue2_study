// 控制应用生命周期和创建原生浏览器窗口的模组
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");

// Object.defineProperty(app, "isPackaged", {
//   get() {
//     return true;
//   },
// });

function createWindow() {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 1500,
    height: 800,
    icon: path.join(__dirname, "logo001.png"),
    webPreferences: {
      // 书写渲染进程中的配置
      nodeIntegration: true, //开启true这一步很重要,目的是为了vue文件中可以引入node和electron相关的API
      contextIsolation: false, // 可以使用require方法
      enableRemoteModule: true, // 可以使用remote方法
    },
  });

  console.log("app.isPackaged", app.isPackaged);

  let env = app.isPackaged; //如果应用已经打包返回true, 否则false

  // 配置热更新

  if (!env) {
    console.log("当前是development模式");
    // const elePath = path.join(__dirname, "../node_modules/electron");
    // require("electron-reload")("../", {
    //   electron: require(elePath),
    // });
    // 热更新监听窗口
    mainWindow.loadURL("http://localhost:3103");
    // 打开开发工具
    mainWindow.webContents.openDevTools();
  } else {
    console.log("我是生产环境production");
    // 生产环境中要加载文件，打包的版本
    Menu.setApplicationMenu(null); //去掉菜单栏
    // 加载 index.html
    mainWindow.loadFile(path.resolve(__dirname, "../dist/index.html")); // 新增
    // 打开开发工具
    // mainWindow.webContents.openDevTools();
  }

  // console.log("当前是development模式");
  // // 热更新监听窗口
  // mainWindow.loadURL("http://localhost:3103");
  // // 打开开发工具
  // mainWindow.webContents.openDevTools();

  updateHandle(mainWindow)
}
// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
    // 打开的窗口，那么程序会重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});


// const uploadUrl = "https://203.195.203.96:803/update";
const uploadUrl = "https://gzmms.y1b.cn/update";
// const uploadUrl = "http://127.0.0.1:9005/win32"


// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
function updateHandle(mainWindow) {

  // checking-for-update：正在检查更新。
  // update-available：有可用的更新。
  // update-not-available：没有可用的更新。
  // error：更新过程中出现错误。
  // download-progress：更新包下载进度。
  // update-downloaded：更新包已下载完毕。

  console.log("我执行了")
  let message = {
    error: '检查更新出错',
    checking: '正在检查更新...',
    updateAva: '检测到新版本',
    updateNotAva: '现在使用的就是最新版本，不用更新',
  };
  // 不自动下载
  // autoUpdater.autoDownload = false

  // 不区分macOS和window
  autoUpdater.setFeedURL(uploadUrl);
  // 检测更新
  // autoUpdater.checkForUpdates();



  // 监听'error'事件
  autoUpdater.on('error', function (error) {
    console.log("autoUpdater.error", error)
    // sendUpdateMessage(mainWindow, message.error)
  });

  // 监听 正在检查更新 
  autoUpdater.on('checking-for-update', function () {
    console.log("checking-for-update", '正在检查更新')
    // sendUpdateMessage(mainWindow, message.checking)
  });

  //监听'update-available'事件，发现有新版本时触发
  autoUpdater.on('update-available', function (info) {
    console.log("update-available的info", info)
    // sendUpdateMessage(mainWindow, message.updateAva)
    // mainWindow.webContents.send('newUpdate', info) // 有新版本时,告知渲染进程有新的版本
  });
  // 没有更新时候才会触发;
  autoUpdater.on('update-not-available', function (info) {
    console.log("update-not-available", info)
    // sendUpdateMessage(mainWindow, message.updateNotAva)
  });

  // 更新下载进度事件 监听’download-progress’事件，下载进度改变时触发;
  autoUpdater.on('download-progress', function (progressObj) {
    console.log("download-progress的progressObj", progressObj)
    // mainWindow.webContents.send('downloadProgress', progressObj)
  })

  //监听'update-downloaded'事件，新版本下载完成时触发
  autoUpdater.on('update-downloaded', function (info) {
    mainWindow.webContents.send('updateDownloaded', info)
    console.log("update-downloaded触发了", info)

  });

  //监听 渲染进程 触发'isUpdateNow',就退出程序，安装新版本
  ipcMain.on('isUpdateNow', (e, arg) => {
    console.log("开始安装新版本");
    //some code here to handle event
    autoUpdater.quitAndInstall();
    app.quit();
  });

  // 监听 渲染进程触发"checkForUpdate"
  ipcMain.on("checkForUpdate", () => {
    console.log("触发了检测更新")
    //执行自动更新检查
    autoUpdater.checkForUpdates();
  })

  // 确认更新提示，执行下载
  // ipcMain.on('comfirmUpdate', () => {
  //   autoUpdater.downloadUpdate()
  // })

}








