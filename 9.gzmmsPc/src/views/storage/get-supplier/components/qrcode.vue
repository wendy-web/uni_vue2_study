<script setup lang="ts">
import { Picture as IconPicture } from "@element-plus/icons-vue";

import { useSettingsStore } from "@/store/modules/settings";

interface Props {
  visible: boolean;
  qrcodeUrl: string;
}
const settingStore = useSettingsStore();

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  qrcodeUrl: "",
});
let emits = defineEmits(["update:visible"]);
const visibleDialog = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emits("update:visible", false);
  },
});

const url = ref(props.qrcodeUrl);

const qrcode_url = computed(() => {
  return settingStore.baseHttp + url.value;
});

watch(
  () => props.qrcodeUrl,
  (newValue, oldValue) => {
    url.value = newValue;
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <el-dialog v-model="visibleDialog" width="40%" draggable top="30vh">
    <div class="flex flex-col items-center">
      <el-image :src="qrcode_url">
        <template #error>
          <div class="image-slot">
            <el-icon><icon-picture /></el-icon>
          </div>
        </template>
      </el-image>
      <p class="font-bold">领取人扫码确认</p>
    </div>

    <template #footer>
      <span class="flex justify-center mt-10">
        <el-button @click="visibleDialog = false" size="large" class="w-[100px]">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
