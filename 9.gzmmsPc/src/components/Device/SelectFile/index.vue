<script setup lang="ts">
import type { FormInstance } from "element-plus";
import dayjs from "dayjs";
import { IdNameType } from "@/api/device/common/types";
import CommonSelect from "@/components/DeptSelect/CommonSelect.vue";
import FileUpload from "@/components/Upload/FileUpload.vue";

interface Props {
  /** 弹窗标题-非必填 */
  title?: string;
  /** 文件分类的列表数据 */
  list: IdNameType[];
}

const props = withDefaults(defineProps<Props>(), {
  title: "上传附件",
  list: () => [],
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
  type: undefined as FormNumType,
  file_url: "",
  file_name: "",
  create_time: dayjs().format("YYYY-MM-DD"),
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
  if (fileUploadRef.value?.btnLoding) {
    return ElMessage.warning("文件上传中,请稍等~");
  }
  if (!fileValues.value.file_name) {
    return ElMessage.warning("请上传文件~");
  }
  emit("confirm", fileValues.value);
  model.value = false;
}

function clear() {
  fileValues.value.type = undefined;
  fileValues.value.file_url = "";
  fileValues.value.create_time = dayjs().format("YYYY-MM-DD");
  fileValues.value.note = "";
  fileUploadRef.value?.clearFiles();

  fileInfo.value = {
    fileUrl: "",
    fileName: "",
  };
  nextTick(() => {
    nextTick(() => {
      fileFromRef.value.clearValidate("type");
    });
  });
}
function setFileValues(data: {
  type: number;
  file_url: string;
  file_name: string;
  create_time: string;
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
    label: "文件分类",
    prop: "type",
  },
  {
    label: "上传文件",
    prop: "file_name",
  },
  {
    label: "上传时间",
    prop: "create_time",
    valueType: "date-picker",
    fieldProps: {
      placeholder: "请选择上传时间",
    },
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
  type: [
    {
      required: true,
      message: "请选择文件分类",
    },
  ],
  // file_name: [
  //   {
  //     required: true,
  //     message: "请上传文件",
  //   },
  // ],
};

// const fileTypeList = [
//   {
//     id: 1,
//     name: "设备图片",
//   },
//   {
//     id: 2,
//     name: "设备文档",
//   },
//   {
//     id: 3,
//     name: "图纸",
//   },
//   {
//     id: 4,
//     name: "课件",
//   },
//   {
//     id: 5,
//     name: "停机报告",
//   },
//   {
//     id: 6,
//     name: "经验分享报告",
//   },
// ];
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
    <template #plus-field-type>
      <CommonSelect :list="list" v-model="fileValues.type"></CommonSelect>
    </template>
  </PlusDialogForm>
</template>
<style lang="scss" scoped></style>
