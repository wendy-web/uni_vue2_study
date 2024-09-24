<script setup lang="ts">
import { useSettingsStoreHook } from "@/store/modules/settings";

const useSetting = useSettingsStoreHook();
const props = defineProps({
  src: String,
});

const model = defineModel({ required: true, default: false });

const closeModal = () => {
  model.value = false;
};

const officeUrl = (url: string) => {
  console.log("🚀 ~ officeUrl ~ url:", url);
  return `https://view.officeapps.live.com/op/view.aspx?src=${url}`;
};
</script>

<template>
  <teleport to="body">
    <div v-if="model">
      <div class="modal-overlay" @click="closeModal">
        <div class="modal-content">
          <iframe
            :src="officeUrl(useSetting.baseHttp + src)"
            frameborder="0"
            width="100%"
            height="700px"
          ></iframe>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  margin-left: 210px;
  background-color: white;
  width: 60%;
  padding: 20px;
  border-radius: 5px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
