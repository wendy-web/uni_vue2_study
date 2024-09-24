import { useRoute } from "vue-router";
import { useTagsViewStore } from "@/store/modules/tagsView";

export function useEditHooks() {
  const tagsViewStore = useTagsViewStore();
  const route = useRoute();

  const isReqDetail = computed(() => {
    let currentPageCount = tagsViewStore.editPageData.find((el) => el.fullPath === route.fullPath);
    let currentRes = currentPageCount?.first ?? true;
    // console.log("🚀 ~ isReqDetail ~ currentRes:", currentRes);
    return currentRes;
  });

  return {
    isReqDetail,
  };
}
