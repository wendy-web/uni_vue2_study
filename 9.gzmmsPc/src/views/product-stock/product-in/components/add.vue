<script setup lang="tsx">
import { type FormInstance } from "element-plus";
import PdfImgUpload from "@/components/Upload/PdfImgUpload.vue";
import { useAdd } from "./add";

const {
  addFormData,
  addColumns,
  addRules,
  getFactoryCodeList,
  getWscodeList,
  wlSelectList,
  getWlData,
  selectProps,
  bindFile,
} = useAdd();

const PlusFormRef = ref();
/** 表单的ref */
const addFormRef = computed(() => {
  return PlusFormRef.value.formInstance as FormInstance;
});
const checkChinese = () => {
  addFormData.value.pro_no = addFormData.value.pro_no.replace(/[\u4E00-\u9FA5]/g, "");
};
const validatorForm = async () => {
  const vaildateRes = await addFormRef.value
    .validate((valid, fields) => {
      for (const keys in fields) {
        if (fields[keys]) {
          // 弹出每个字段的错误提示
          ElMessage.warning(fields[keys][0].message);
          addFormRef.value.scrollToField(keys);
          break;
        }
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
  return vaildateRes;
};

defineExpose({
  validatorForm,
  addFormData,
});

onMounted(() => {
  getWscodeList();
  getFactoryCodeList();
  getWlData();
});
</script>
<template>
  <div class="pb-20">
    <PlusForm
      ref="PlusFormRef"
      :rules="addRules"
      v-model="addFormData"
      labelWidth="110"
      label-position="right"
      :columns="addColumns"
      :row-props="{ gutter: 20 }"
      :col-props="{ span: 12 }"
      :hasFooter="false"
    >
      <template #plus-field-pro_no>
        <el-input
          v-model="addFormData.pro_no"
          placeholder="请输入生产订单"
          @input="checkChinese"
        ></el-input>
      </template>
      <template #plus-field-goods_id>
        <el-select-v2
          :props="selectProps"
          v-model="addFormData.goods_id"
          :options="wlSelectList"
          filterable
          placeholder="请选择物料信息"
          size="large"
          style="width: 100%"
        ></el-select-v2>
      </template>
      <template #plus-field-file_info>
        <PdfImgUpload :file_info="addFormData.file_info" @fileChange="bindFile"></PdfImgUpload>
      </template>
    </PlusForm>
  </div>
</template>
<style lang="scss" scoped></style>
