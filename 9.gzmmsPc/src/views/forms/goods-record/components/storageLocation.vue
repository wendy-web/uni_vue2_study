<script setup lang="ts">
import { setWsCodeApi } from "@/api/forms/goods-record";

type IdsType = number[];

const props = defineProps<{
  ids: IdsType;
}>();

const title = defineModel("title", { required: true, default: "" });
const dialogVisible = defineModel("dialogVisible", { required: true, default: false });
const emits = defineEmits(["update"]);

const inputRef = ref();
const btnLoading = ref(false);

async function confirm() {
  btnLoading.value = true;
  let data = {
    ids: props.ids,
    ws_code: title.value,
  };
  try {
    const result = await setWsCodeApi(data);
    btnLoading.value = false;
    ElMessage.success(result.msg);
    emits("update");
  } finally {
    dialogVisible.value = false;
  }
}

watch(dialogVisible, (val) => {
  if (val) {
    nextTick(() => {
      nextTick(() => {
        inputRef.value.focus();
      });
    });
  }
});
</script>
<template>
  <el-dialog v-model="dialogVisible" title="设置库位" width="500" top="30vh">
    <div class="storage-location">
      <el-input
        v-model="title"
        placeholder="请输入库位"
        clearable
        size="large"
        ref="inputRef"
      ></el-input>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm" :loading="btnLoading">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped></style>
