import { hiprint } from "vue-plugin-hiprint";
import { formartDate } from "@/utils/validate";
import { useSettingsStore } from "@/store/modules/settings";
import qrcodeMoban from "./print-json/qrcode.json";
import refundMoban from "./print-json/refund.json";
import retGoodsMoban from "./print-json/ret-goods.json";
import retSupMoban from "./print-json/ret-supplier.json";
import scrapMoban from "./print-json/scrap.json";
import splitMoban from "./print-json/split.json";
import swapMoban from "./print-json/swap.json";
import { removeDashes } from "@/utils/index";

const settingsStore = useSettingsStore();

hiprint.init();

type QrcodeInfoType = {
  content?: string;
  barcode: string;
  title: string;
  spec: string;
};

export function usePrint() {
  /** 将二维码内容 转换成带链接的 */
  function getContent(info: { content?: string; barcode: string }) {
    let url = settingsStore.scanCodeUrl;
    // 有content则设置二维码内容为content,无则设置为条码, 货品库存明细打印的时候传值会有content
    let content = info.content || info.barcode;
    // 返回加了链接的 内容做条码
    console.log("url + content", url + content);
    return url + content;
  }

  /** 打印单个条码 */
  function onePrint(info: QrcodeInfoType) {
    let printData = {
      qrcode: getContent(info),
      barcode: info.barcode,
      title: info.title,
      spec: info.spec,
    };

    toPrint(printData);
  }

  /** 多个条码打印 */
  function multiPrint(multiList: any[]) {
    let list = multiList.map((item) => {
      return {
        qrcode: getContent(item),
        barcode: item.barcode,
        title: item.title,
        spec: item.spec,
      };
    });
    let printData = list;

    toPrint(printData);
  }

  /**
   * @example 单元格打印单个条码,采购入库,其他入库,库存明细三个单据需要传入入库日期
   * @param row必传: any 列表数据
   * @param in_date可选: string 入库日期
   */
  function cellOnePrint(row: any, in_date?: string) {
    let { barcode, title, print_num, spec, content, code } = row;
    let num = print_num ?? 1;
    let arr = [];
    for (let index = 0; index < num; index++) {
      arr.push({
        qrcode: getContent({ content, barcode }),
        barcode: barcode,
        title: title,
        spec: spec,
        in_wh_date: in_date ? `入库日期:${removeDashes(formartDate(in_date))}` : "",
        unique_code: code ? code : "",
      });
    }
    let printData = arr;
    toPrint(printData);
  }

  /** 打印表格全部条码 */
  function allPrint(tableData: any[], in_date?: string) {
    let list = tableData.map((item: any) => {
      let arr = Array(item.print_num ?? 1);
      arr.fill({
        qrcode: getContent(item),
        barcode: item.barcode,
        title: item.title,
        spec: item.spec,
        in_wh_date: in_date ? `入库日期:${removeDashes(formartDate(in_date))}` : "",
      });
      return arr;
    });

    let newList = list.flat();
    let printData = newList;
    toPrint(printData);
  }

  function toPrint(printData: [] | {}) {
    let hiprintTemplate = new hiprint.PrintTemplate({ template: qrcodeMoban });
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

  function printDetail(printData = {}, order_type: string) {
    let hiprintTemplate: any;
    if (order_type === "refund") {
      hiprintTemplate = new hiprint.PrintTemplate({ template: refundMoban });
    } else if (order_type === "swap") {
      hiprintTemplate = new hiprint.PrintTemplate({ template: swapMoban });
    } else if (order_type === "scrap") {
      hiprintTemplate = new hiprint.PrintTemplate({ template: scrapMoban });
    } else if (order_type === "retGoods") {
      hiprintTemplate = new hiprint.PrintTemplate({ template: retGoodsMoban });
    } else if (order_type === "retSup") {
      hiprintTemplate = new hiprint.PrintTemplate({ template: retSupMoban });
    } else if (order_type === "split") {
      hiprintTemplate = new hiprint.PrintTemplate({ template: splitMoban });
    }

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
    /** 打印多个条码 */
    multiPrint,
    /** 打印单个条码 */
    onePrint,
    /** 单元格打印单个条码,采购入库单,其他入库单,库存明细报表三个单据需要传入入库日期 */
    cellOnePrint,
    /** 打印表格全部条码 */
    allPrint,
    /** 打印单据详情 */
    printDetail,
  };
}
