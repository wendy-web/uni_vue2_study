<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import { setStockWarningApi } from "@/api/forms/index";

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
  num: 0, // 库存下限
  up_num: 0, //库存上限
});

async function confirm(formEl: FormInstance | undefined) {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      // btnLoading.value = true;
      let data = {
        ids: props.ids,
        stock_warning_qty: fromData.value.num as number,
        stock_upper_qty: fromData.value.up_num as number,
      };
      try {
        const result = await setStockWarningApi(data);
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
//  :rules="[
// {
//             required: true,
//             message: `请输入库存下限`,
//             trigger: 'blur',
//           },
//           { type: 'number', min: 0, max: fromData.up_num, message: `库存下限应小于等于库存上限` },
//         ]"
</script>
<template>
  <el-dialog v-model="dialogVisible" title="库存预警设置" width="500" top="30vh">
    <el-form :model="fromData" ref="formRef" label-width="80px">
      <el-form-item
        prop="num"
        label="库存下限"
        :rules="[
          {
            required: true,
            message: `请输入库存下限`,
            trigger: 'blur',
          },
        ]"
      >
        <el-input
          v-model.number="fromData.num"
          placeholder="请输入库存下限"
          clearable
          size="large"
          ref="inputRef"
          v-inputnum.int
        ></el-input>
        <!-- </div> -->
      </el-form-item>
      <el-form-item
        prop="up_num"
        label="库存上限"
        :rules="[
          {
            required: true,
            message: `请输入库存上限`,
            trigger: 'blur',
          },
        ]"
      >
        <el-input
          v-model.number="fromData.up_num"
          placeholder="请输入库存上限"
          clearable
          size="large"
          ref="inputRef"
          v-inputnum.int
        ></el-input>
        <!-- </div> -->
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
