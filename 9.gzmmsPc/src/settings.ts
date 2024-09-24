import { version } from "../package.json";

interface DefaultSettings {
  title: string;
  showSettings: boolean;
  tagsView: boolean;
  fixedHeader: boolean;
  sidebarLogo: boolean;
  errorLog: string;
  layout: string;
  theme: string;
  /** 项目名称 */
  adminTitle: string;
  /** 图片头部地址 */
  baseHttp: string;
  /** 版本号 */
  version: string;
  /** 货品二维码前缀链接 */
  scanCodeUrl: string;
  /** 设备二维码需要添加的链接前缀 */
  deviceScanCodeUrl:string;
}
let httpUrl = import.meta.env.VITE_APP_BASE_API;
/** 货品二维码需要添加的链接前缀 */
let scanCodeUrl = import.meta.env.VITE_SCAN_CODE_URL;
/** 设备二维码需要添加的链接前缀 */
let deviceScanCodeUrl = import.meta.env.VITE_SCAN_CODE_URL_DEVICE;

const defaultSettings: DefaultSettings = {
  title: "vue3-element-admin",
  showSettings: true,
  tagsView: true,
  fixedHeader: true,
  sidebarLogo: true,
  errorLog: "production",
  layout: "left",
  theme: "auto",
  // adminTitle: "物料管理系统",
  adminTitle: "数智工厂",
  // adminTitle: "天兴诚ERP",
  baseHttp: httpUrl,
  version: version,
  scanCodeUrl: scanCodeUrl,
  deviceScanCodeUrl: deviceScanCodeUrl,
};

export default defaultSettings;
