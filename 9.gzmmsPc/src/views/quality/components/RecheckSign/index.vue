<script setup lang="ts">
import type { FormInstance } from "element-plus";
import SignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useSettingsStoreHook } from "@/store/modules/settings";

interface Props {
  /** 弹窗标题-非必填 */
  title?: string;
}
const useSetting = useSettingsStoreHook();
const props = withDefaults(defineProps<Props>(), {
  title: "签字复核",
});
const emit = defineEmits(["confirm"]);
const model = defineModel({ required: true, default: false });

const plusDialogFormRef = ref();
/** 文件上传表单实例 */
const fileFromRef = computed(() => {
  return plusDialogFormRef.value?.formInstance as FormInstance;
});
/** 复核签字表单数据 */
const signValues = ref({
  file_url: "",
  note: "",
  status: 1,
});

/** 监听文件上传表单点击确定 */
function fileConfirm() {
  console.log("🚀 ~ fileConfirm ~ values:", signValues.value);
  emit("confirm", signValues.value);
  model.value = false;
}

// 签名提交
const dialogOptions = {
  width: "60%",
  btnClass: "w-[80px]",
  draggable: true,
  closeOnClickModal: false,
  closeOnPressEscape: false,
  btnLoading: false,
  showClose: false,
};

const signDialogRef = ref();
// 签名复核
const handleSign = () => {
  addDialog({
    ...dialogOptions,
    title: "签名",
    contentRenderer: () =>
      h(SignDialog, {
        ref: signDialogRef,
      }),
    beforeCancel: (done, { options, index }) => {
      done();
    },
    beforeSure: async (done, { options, index }) => {
      updateDialog(true, "btnLoading");
      const result = await signDialogRef.value.handleGenerate();
      console.log("result", result);
      signValues.value.file_url = result;
      // 更新签名地址
      updateDialog(false, "btnLoading");
      done();
    },
  });
};
// 驳回
const handleReject = () => {
  signValues.value.status = 3;
  emit("confirm", signValues.value);
  model.value = false;
}
// 复核通过：必须有签名
const handlePass = () => {
  signValues.value.status = 2;
  if(!signValues.value.file_url){
    ElMessage.warning("请先签字~");
    return
  }
  emit("confirm", signValues.value);
  model.value = false;
}
/** 签字复核弹窗表单的columns */
const columns: PlusColumnList = [
  {
    label: "复核人签字",
    prop: "recheck_sign",
  },
  {
    label: "备注",
    prop: "note",
    fieldProps: {
      placeholder: "请输入备注",
    },
  },
];
// 重置数据
function resetValues() {
  signValues.value = {
    file_url: "",
    note: "",
    status: 1,
  };
  console.log("resetValues:", signValues.value);
}
defineExpose({
  resetValues,
});

</script>
<template>
  <PlusDialogForm
    ref="plusDialogFormRef"
    v-model:visible="model"
    v-model="signValues"
    :form="{
      columns: columns,
      labelWidth: '90',
      labelPosition: 'right',
    }"
    draggable
    :title="title"
  >
    <template #plus-field-recheck_sign>
      <el-image
        :src="useSetting.baseHttp + signValues.file_url"
        :zoom-rate="1.2"
        :max-scale="7"
        :min-scale="0.2"
        :initial-index="4"
        fit="contain"
        @click="handleSign"
      >
        <template #error>
          <el-button @click="handleSign">点击签名</el-button>
        </template>
      </el-image>
    </template>
    <template #plus-field-note>
      <el-input v-model="signValues.note" type="textarea" placeholder="请输入备注" />
    </template>
    <template #dialog-footer="{ handleConfirm, handleCancel }">
      <el-button type="danger" @click="handleReject">驳回</el-button>
      <el-button type="primary" @click="handlePass">复核通过</el-button>
    </template>
  </PlusDialogForm>
</template>
<style lang="scss" scoped></style>
