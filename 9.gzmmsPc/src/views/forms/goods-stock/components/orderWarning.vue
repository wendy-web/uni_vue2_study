<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import { setOrderWarningApi } from "@/api/forms/index";

type IdsType = number[];
const props = defineProps<{
  ids: IdsType;
}>();
const dialogVisible = defineModel("dialogVisible", { required: true, default: false });
const emits = defineEmits(["update"]);

const inputRef = ref();
const formRef = ref<FormInstance>();
const btnLoading = ref(false);
const fromData = ref({
  num: undefined as undefined | number,
});

function confirm(formEl: FormInstance | undefined) {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      btnLoading.value = true;

      let data = {
        ids: props.ids,
        goods_warning_qty: fromData.value.num as number,
      };
      try {
        const result = await setOrderWarningApi(data);
        btnLoading.value = false;
        ElMessage.success(result.msg);
        emits("update");
      } finally {
        dialogVisible.value = false;
      }
    } else {
      inputRef.value.focus();
      console.log("error submit!");
      return false;
    }
  });
}

watch(dialogVisible, (val) => {
  if (val) {
    nextTick(() => {
      nextTick(() => {
        formRef.value?.resetFields();
        inputRef.value.focus();
      });
    });
  }
});
</script>
<template>
  <el-dialog v-model="dialogVisible" title="订货预警设置" width="500" top="30vh">
    <el-form :model="fromData" ref="formRef" label-width="80px">
      <el-form-item
        label="订货点"
        prop="num"
        :rules="[
          {
            required: true,
            message: `请输入订货点`,
            trigger: 'blur',
          },
        ]"
      >
        <el-input
          v-model.number="fromData.num"
          placeholder="请输入订货点"
          clearable
          size="large"
          ref="inputRef"
          v-inputnum.int
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm(formRef)" :loading="btnLoading">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped></style>
