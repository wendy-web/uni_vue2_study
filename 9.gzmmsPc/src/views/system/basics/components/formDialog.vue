<script setup lang="ts">
import type { FormInstance } from "element-plus";
enum EFirstLabel {
  "上级部门：" = 1,
  "上级地点：" = 2,
}

enum EInputLabel {
  "部门名称：" = 1,
  "地点名称：" = 2,
}
enum EplaceHint {
  "请输入部门名称" = 1,
  "请输入地点名称" = 2,
}
enum ETile {
  "新增部门" = 1,
  "编辑部门",
  "新增子部门",
  "新增地点",
  "编辑地点",
  "新增子地点",
}

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  titleType: {
    type: Number,
    default: 1,
  },
  type: {
    type: Number,
    default: 2,
  },
});

const dialogBtnLoading = ref(false);
const departmentFrom = ref({
  name: "", //部门input的modelValue
  pid: 0, //部门父级id
  id: 0, //部门id
  topName: "", // 上级部门
});
const dialogInputRef = ref<HTMLInputElement | null>();
const dialogForm = ref<FormInstance>();

const emits = defineEmits(["update:visible", "confirm"]);
const visibleDialog = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emits("update:visible", false);
  },
});

const title = computed(() => {
  return ETile[props.titleType];
});

const firstLabel = computed(() => {
  return EFirstLabel[props.type];
});
const inputLabel = computed(() => {
  return EInputLabel[props.type];
});

const placeHint = computed(() => {
  return EplaceHint[props.type];
});

// dialog弹窗打开后的回调事件, 给input自动获取焦点
function dialogOpenCallback() {
  nextTick(() => {
    dialogInputRef.value?.focus();
  });
}
// dialog弹窗关闭后的回调事件
function closeDialog() {
  dialogForm.value!.resetFields();
  dialogForm.value!.clearValidate();
  departmentFrom.value.pid = 0;
  departmentFrom.value.id = 0;
  departmentFrom.value.topName = "";
}

// 弹窗点击确认按钮
function dialogConfirm() {
  console.log("弹窗确认点击");
  emits("confirm");
}

defineExpose({
  departmentFrom,
  dialogBtnLoading,
});
</script>
<template>
  <el-dialog
    v-model="visibleDialog"
    :title="title"
    align-center
    width="30%"
    @open="dialogOpenCallback"
    :destory-on-close="true"
    @close="closeDialog"
  >
    <el-form
      :model="departmentFrom"
      :inline="false"
      ref="dialogForm"
      label-width="100"
      @submit.native.prevent
    >
      <el-form-item
        :label="firstLabel"
        prop="topName"
        v-if="titleType == 3 || titleType == 6"
        class="pl-[14px]"
      >
        <span>{{ departmentFrom.topName }}</span>
      </el-form-item>
      <el-form-item
        :label="inputLabel"
        prop="name"
        :rules="[
          {
            required: true,
            message: placeHint,
            trigger: 'blur',
          },
        ]"
      >
        <el-input
          v-model.trim="departmentFrom.name"
          :placeholder="placeHint"
          ref="dialogInputRef"
          @keyup.enter.native="dialogConfirm"
          style="width: 80%"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visibleDialog = false" class="w-[80px]">取消</el-button>
        <el-button
          type="primary"
          @click="dialogConfirm"
          class="w-[80px]"
          :loading="dialogBtnLoading"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped></style>
