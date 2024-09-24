<script setup lang="ts">
/** 签字复核弹窗表单的columns */
interface Props {
  /** 弹窗标题-非必填 */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  title: "复核审批",
});

const emit = defineEmits(["confirm"]);
const model = defineModel({ required: true, default: false });

const columns: PlusColumnList = [
  {
    label: "备注",
    prop: "note",
    fieldProps: {
      type: "textarea",
      rows: 4,
    },
  },
];

const formData = ref({
  note: "", //
  status: 1,
});
function handleReject() {
  formData.value.status = 3;
  emit("confirm", formData.value);
  model.value = false;
}

function handlePass() {
  formData.value.status = 2;
  emit("confirm", formData.value);
  model.value = false;
}

function handleCancel() {
  model.value = false;
}

// 重置数据
function resetValues() {
  formData.value = {
    note: "",
    status: 1,
  };
}
defineExpose({
  resetValues,
});
</script>
<template>
  <PlusDialogForm
    ref="plusDialogFormRef"
    v-model:visible="model"
    v-model="formData"
    :form="{
      columns: columns,
      labelWidth: '90',
      labelPosition: 'right',
      hasFooter: true,
    }"
    :dialog="{
      title: title,
      draggable: true,
      hasFooter: false,
    }"
  >
    <template #form-footer="{ handleSubmit }">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="danger" @click="handleReject">驳回</el-button>
      <el-button type="primary" @click="handlePass">复核通过</el-button>
    </template>
  </PlusDialogForm>
</template>
<style lang="scss" scoped></style>
