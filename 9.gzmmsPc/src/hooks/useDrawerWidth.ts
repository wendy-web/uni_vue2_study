import { useDebounceFn } from "@vueuse/core";
import { onUnmounted, ref } from "vue";

/**
 * @description
 * */
export const useDrawerWidth = () => {
  const drawerWidth = ref(window.innerWidth - 210 + "px");

  /**窗口变化动态改变窗口大小 */
  const listeningWindow = useDebounceFn(() => {
    drawerWidth.value = window.innerWidth - 210 + "px";
  }, 100);

  window.addEventListener("resize", listeningWindow, false);
  onUnmounted(() => {
    window.removeEventListener("resize", listeningWindow);
  });
  return { drawerWidth };
};
