import { hiprint } from "vue-plugin-hiprint";
import { removeDashes } from "@/utils/index";
import deviceQrcode from "./deviceQrcode.json";
import { useSettingsStore } from "@/store/modules/settings";


export function usePrint() {
  const settingsStore = useSettingsStore();
  /** 将二维码内容 转换成带链接的 */
  function getContent(info: { content?: string; asset_no: string }) {
    console.log("🚀 ~ getContent ~ info:", info);
    let url = settingsStore.deviceScanCodeUrl;
    // 有content则设置二维码内容为content,无则设置为条码
    let content = info.content || info.asset_no;
    // 返回加了链接的 内容做条码
    console.log("url + content", url + content);
    return url + content;
    // return content;
  }

  /** 多个条码打印 */
  function multiPrint(multiList: any[]) {
    let list = multiList.map((item) => {
      return {
        qrcode: getContent(item),
        open_date: item.open_date ? `启用日期:${removeDashes(item.open_date)}` : "",
        use_dept_text: `使用部门:${item.use_dept_text}`,
        use_duty_user_text: `负责人:${item.use_duty_user_text}`,
        asset_no: item.asset_no,
        bar_title: item.bar_title,
      };
    });
    let printData = list;

    toPrint(printData);
  }

  function toPrint(printData: [] | {}) {
    let hiprintTemplate = new hiprint.PrintTemplate({ template: deviceQrcode });
    // 打印
    hiprintTemplate.print(
      printData,
      {},
      {
        callback: () => {
          console.log("浏览器打印窗口已打开");
          let iframe_el = document.querySelector("#hiwprint_iframe") as HTMLIFrameElement;
          if (iframe_el && iframe_el.contentWindow) {
            iframe_el.contentWindow.onafterprint = function () {
              console.log("打印窗口关闭了");
            };
          }
        },
      },
    );
  }

  return {
    /** 多个条码打印 */
    multiPrint,
  };
}
