<script setup lang="ts">
import type { FormInstance } from "element-plus";
import FileUpload from "@/components/Upload/FileUpload.vue";

interface Props {
  /** 弹窗标题-非必填 */
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "上传附件",
});
const emit = defineEmits(["confirm"]);
const model = defineModel({ required: true, default: false });

const fileUploadRef = ref<InstanceType<typeof FileUpload>>();

const plusDialogFormRef = ref();
/** 文件上传表单实例 */
const fileFromRef = computed(() => {
  return plusDialogFormRef.value?.formInstance as FormInstance;
});
/** 上传附件表单数据 */
const fileValues = ref({
  file_url: "",
  file_name: "",
  note: "",
});

const fileInfo = ref({
  fileUrl: "",
  fileName: "",
});

/** 监听文件上传改变 */
function fileChange(fileData: { name: string; src: string }) {
  fileValues.value.file_url = fileData.src;
  fileValues.value.file_name = fileData.name;
}

/** 监听文件上传表单点击确定 */
function fileConfirm() {
  console.log("🚀 ~ fileConfirm ~ values:", fileValues.value);
  emit("confirm", fileValues.value);
  model.value = false;
}

function clear() {
  fileValues.value.file_url = "";
  fileValues.value.note = "";
  fileUploadRef.value?.clearFiles();

  fileInfo.value = {
    fileUrl: "",
    fileName: "",
  };
  nextTick(() => {
    nextTick(() => {
      fileFromRef.value.clearValidate("file_name");
    });
  });
}
function setFileValues(data: {
  file_name: string;
  file_url: string;
  note: string;
}) {
  fileValues.value = data;
  fileInfo.value.fileName = data.file_name;
  fileInfo.value.fileUrl = data.file_url;
}

defineExpose({
  clear,
  setFileValues,
});

/** 上传附件弹窗表单的columns */
const fileUplodColumns: PlusColumnList = [
  {
    label: "上传文件",
    prop: "file_name",
  },
  {
    label: "备注",
    prop: "note",
    fieldProps: {
      placeholder: "请输入备注",
    },
  },
];

const fileUplodRules = {
  file_name: [
    {
      required: true,
      message: "请上传文件",
    },
  ],
};
</script>
<template>
  <PlusDialogForm
    ref="plusDialogFormRef"
    v-model:visible="model"
    v-model="fileValues"
    :form="{
      columns: fileUplodColumns,
      rules: fileUplodRules,
      labelWidth: '90',
      labelPosition: 'right',
    }"
    draggable
    :title="title"
    cancel-text="取消"
    confirm-text="确定"
    @confirm="fileConfirm"
  >
    <template #plus-field-file_name>
      <FileUpload
        @fileChange="fileChange"
        ref="fileUploadRef"
        :editSrc="fileInfo.fileUrl"
        :editName="fileInfo.fileName"
      ></FileUpload>
    </template>
    <template #plus-field-note>
      <el-input v-model="fileValues.note" type="textarea" placeholder="请输入备注" />
    </template>
  </PlusDialogForm>
</template>
<style lang="scss" scoped></style>
