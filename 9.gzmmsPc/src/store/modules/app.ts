import { getSidebarStatus, setSidebarStatus, getSize, setSize } from "@/utils/localStorage";
import { defineStore } from "pinia";
import { computed, ref, reactive } from "vue";
import { useStorage } from "@vueuse/core";

export enum DeviceType {
  mobile,
  desktop,
}

export enum SizeType {
  default,
  large,
  small,
}

// setup
export const useAppStore = defineStore("app", () => {
  // state
  const device = useStorage<string>("device", "desktop");
  const size = ref(getSize() || "default");
  const sidebar = reactive({
    opened: getSidebarStatus() !== "closed",
    withoutAnimation: false,
  });

  // actions
  function toggleSidebar(withoutAnimation: boolean) {
    sidebar.opened = !sidebar.opened;
    sidebar.withoutAnimation = withoutAnimation;
    if (sidebar.opened) {
      setSidebarStatus("opened");
    } else {
      setSidebarStatus("closed");
    }
  }

  function closeSideBar(withoutAnimation: boolean) {
    sidebar.opened = false;
    sidebar.withoutAnimation = withoutAnimation;
    setSidebarStatus("closed");
  }

  function openSideBar(withoutAnimation: boolean) {
    sidebar.opened = true;
    sidebar.withoutAnimation = withoutAnimation;
    setSidebarStatus("opened");
  }

  function toggleDevice(val: string) {
    device.value = val;
  }

  function changeSize(val: string) {
    size.value = val;
    setSize(val);
  }

  return {
    device,
    sidebar,
    size,
    toggleDevice,
    changeSize,
    toggleSidebar,
    closeSideBar,
    openSideBar,
  };
});
