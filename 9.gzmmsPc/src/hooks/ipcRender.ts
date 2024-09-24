import { ElMessageBox } from "element-plus";
type infoType = {
  releaseNotes: string;
  version: string;
};
export function useUpdate() {
  const { ipcRenderer } = require("electron");

  /* 疑问?: 不先发送一下消息建立连接, 下面的on监听不生效 */
  ipcRenderer.send("checkForUpdate");

  // 2、渲染进程监听消息
  ipcRenderer.on("updateDownloaded", (event: any, info: infoType) => {
    console.log("🚀 ~ file: ipcRender.ts:14 ~ ipcRenderer.on ~ info:", info);
    let { version } = info;
    let msgContent = `发现<strong>新版本${version}</strong>，是否立即更新?`;
    ElMessageBox.confirm(msgContent, "应用更新", {
      confirmButtonText: "立即更新",
      cancelButtonText: "取消",
      type: "warning",
      closeOnClickModal: false,
      showClose: false,
      dangerouslyUseHTMLString: true,
    })
      .then(() => {
        console.log("点击了 确定");
        // 3、渲染进程发送消息
        ipcRenderer.send("isUpdateNow");
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

// export function useCheckUpdate() {
//   const { ipcRenderer } = require("electron");
//   const percent = ref(0);

//   ipcRenderer.send("checkForUpdate");

//   ipcRenderer.on("message", (event: any, text: string) => {
//     console.log(arguments);
//     console.log("message的text", text);
//     // this.tips = text;
//   });

//   ipcRenderer.on("newUpdate", (event: any, info: infoType) => {
//     console.log("info,------", info);
//     const { releaseNotes, version } = info;
//     // releaseNotes 是以;隔开的字符串
//     let notesList = releaseNotes.split(";", 3);
//     console.log("notesList", notesList);

//     let msgTitle = `发现新版本${version}`;
//     let msgContent = `更新内容:<br/>`;

//     notesList.forEach((item) => {
//       msgContent += `${item}<br/>`;
//     });

//     ElMessageBox.confirm(msgContent, msgTitle, {
//       confirmButtonText: "立即更新",
//       cancelButtonText: "取消",
//       type: "warning",
//       closeOnClickModal: false,
//       showClose: false,
//       dangerouslyUseHTMLString: true,
//     })
//       .then(() => {
//         console.log("点击了 确定");
//         // 3、渲染进程发送消息
//         ipcRenderer.send("comfirmUpdate");
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//     // this.tips = text;
//   });

//   //注意：“downloadProgress”事件可能存在无法触发的问题，只需要限制一下下载网速就好了
//   ipcRenderer.on("downloadProgress", (event: any, progressObj: any) => {
//     console.log("downloadProgress", progressObj);
//     // let percent111 = 0;
//     // let timeID = setInterval(() => {
//     //   percent111 += 10;
//     //   percent.value = percent111;
//     // }, 3000);

//     percent.value = progressObj.percent || 0;

//     ElMessageBox({
//       title: "正在下载新版本",
//       showConfirmButton: false,
//       showClose: false,
//       closeOnClickModal: false,
//       // Should pass a function if VNode contains dynamic props
//       message: () =>
//         h(ElProgress, {
//           textInside: true,
//           strokeWidth: 26,
//           percentage: percent.value,
//         }),
//     });
//     // this.downloadPercent = progressObj.percent || 0;
//   });
//   ipcRenderer.on("isUpdateNow", () => {
//     ipcRenderer.send("isUpdateNow");
//   });
// }
