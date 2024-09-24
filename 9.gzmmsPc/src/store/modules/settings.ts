import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref } from "vue";
import { localStorage } from "@/utils/localStorage";
import { getBaseUrl } from "@/utils/request";
import { store } from "@/store";
import defaultSettings from "../../settings";

/**
 * 主题类型
 */
export enum ThemeType {
  light,
  dark,
}

/**
 * 布局类型
 */
export enum LayoutType {
  left,
  top,
  mix,
}

const titleList = [
  "物料管理系统",
  "设备管理系统",
  "安全管理系统",
  "质量管理系统",
  "生产管理系统",
  "能源管理系统",
];

export const useSettingsStore = defineStore("setting", () => {
  // state
  const scanCodeUrl = defaultSettings.scanCodeUrl;
  const deviceScanCodeUrl = defaultSettings.deviceScanCodeUrl;
  const originalTitle = document.title;
  const adminTitle = ref(defaultSettings.adminTitle);
  console.log("adminTitle", adminTitle);
  // document.title = adminTitle.value;

  const showSettings = ref<boolean>(defaultSettings.showSettings);
  const tagsView = useStorage<boolean>("tagsView", defaultSettings.tagsView);
  const fixedHeader = ref<boolean>(defaultSettings.fixedHeader);
  const sidebarLogo = ref<boolean>(defaultSettings.sidebarLogo);

  const layout = useStorage<string>("layout", defaultSettings.layout);

  const baseHttp = getBaseUrl();

  const version = defaultSettings.version;

  function setAdminTitle(module_type: number | undefined) {
    // adminTitle.value =
    //   typeof module_type === "number" && module_type >= 0
    //     ? titleList[module_type]
    //     : defaultSettings.adminTitle;

    if (typeof module_type === "number" && module_type >= 0) {
      adminTitle.value = titleList[module_type];
      document.title = adminTitle.value;
    }else{
      document.title = originalTitle;
    }



    // document.title = adminTitle.value;
  }

  // actions
  /** 设置页面标题 */
  function changeSetting(param: { key: string; value: any }) {
    const { key, value } = param;
    switch (key) {
      case "showSettings":
        showSettings.value = value;
        break;
      case "fixedHeader":
        fixedHeader.value = value;
        break;
      case "tagsView":
        tagsView.value = value;
        break;
      case "sidevarLogo":
        sidebarLogo.value = value;
        break;
      case "layout":
        layout.value = value;
        break;
      default:
        break;
    }
  }

  function resetSetting() {
    showSettings.value = defaultSettings.showSettings;
    tagsView.value = defaultSettings.tagsView;
    fixedHeader.value = defaultSettings.fixedHeader;
    sidebarLogo.value = defaultSettings.sidebarLogo;
    layout.value = defaultSettings.layout;
  }

  return {
    showSettings,
    tagsView,
    fixedHeader,
    sidebarLogo,
    layout,
    changeSetting,
    adminTitle,
    baseHttp,
    resetSetting,
    version,
    scanCodeUrl,
    deviceScanCodeUrl,
    setAdminTitle,
    originalTitle,
  };
});

// 非setup
export function useSettingsStoreHook() {
  return useSettingsStore(store);
}
