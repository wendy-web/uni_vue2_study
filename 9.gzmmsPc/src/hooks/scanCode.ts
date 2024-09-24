import { scanCode, clearScanCode } from "@/utils/scanCode";

/**
 * @param callback 页面传入处理扫码后的事件
 * @returns input_barcode 获取扫描后的条码变量
 *
 */
export default function (callback: () => void) {
  const input_barcode = ref("");

  onActivated(() => {
    //  页面加载时启动监听扫描枪扫描事件
    scanCode(input_barcode, callback);
  });

  onDeactivated(() => {
    //  离开页面时, 卸载页面扫描枪键盘监听
    clearScanCode();
  });

  return {
    input_barcode,
  };
}
