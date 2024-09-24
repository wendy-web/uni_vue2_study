<script setup lang="ts">
import type { FormInstance } from "element-plus";
import { buildUUID } from "@pureadmin/utils";
import type { FieldValues } from "plus-pro-components";
import AddValueVue from "./addValue.vue";
import { type AddTableItemType, type AddTableType, useAddGroup } from "./columns";

interface Props {
  groupId: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  groupId: 0,
});

const {
  formData,
  fromRules,
  formColumns,
  tableList,
  tableColumns,
  popupVisible,
  popupForm,
  popupColumns,
  popupRules,
} = useAddGroup();

const emits = defineEmits(["addCheck", "editCheck"]);
const model = defineModel("visible", { required: true, default: false });

const normalValueRef = ref<InstanceType<typeof AddValueVue>>();
const abnormalValueRef = ref<InstanceType<typeof AddValueVue>>();

const btnLoading = ref(false);

const plusformRef = ref();
const formRef = computed(() => {
  return plusformRef.value.formInstance as FormInstance;
});

const plusDialogFormRef = ref();
const dialogFormRef = computed(() => {
  return plusDialogFormRef.value.formInstance as FormInstance;
});

/** 记录表格内容点击编辑时的单元格id */
const editId = ref<number| string>("");

const drawerTitle = computed(() => {
  return props.groupId ? "编辑检查组信息" : "新增检查组信息";
});

/** 点击新增检查项 */
function addCheckItem() {
  editId.value = "";
  popupVisible.value = true;
  resetDialog();
  nextTick(() => {
    nextTick(() => {
      dialogFormRef.value.clearValidate("item_content");
    });
  });
}

function resetDialog() {
  normalValueRef.value?.resetTag();
  abnormalValueRef.value?.resetTag();
  popupForm.value.item_content = "";
  popupForm.value.method = "";
  popupForm.value.std_explain = "";
  popupForm.value.record_method = 0;
  popupForm.value.normal_val = [];
  popupForm.value.abnormal_val = [];
  popupForm.value.upper_limit_val = "";
  popupForm.value.lower_limit_val = "";
}

/** 监听正常值输入的变化 */
function onNormalChange(tagList: string[]) {
  // console.log("🚀 ~ onNormalChange ~ tagList:", tagList);
  popupForm.value.normal_val = tagList;
}

/** 监听异常值输入的变化 */
function onAbnoramlChange(tagList: string[]) {
  // console.log("🚀 ~ onAbnoramlChange ~ tagList:", tagList);
  popupForm.value.abnormal_val = tagList;
}

/** 监听添加检查内容弹窗点击确定的事件 */
function onConfirm(values: FieldValues) {
  popupVisible.value = false;
  // console.log("🚀 ~ onConfirm ~ values:", values);
  let { normal_val, abnormal_val, ...rest } = popupForm.value;
  let normalValue: string = normal_val.join("/");
  let abnormalValue: string = abnormal_val.join("/");
  if (editId.value) {
    let findRes = tableList.value.find((item) => item.id === editId.value);
    if (findRes) {
      findRes.item_content = popupForm.value.item_content;
      findRes.method = popupForm.value.method;
      findRes.std_explain = popupForm.value.std_explain;
      findRes.record_method = popupForm.value.record_method;
      findRes.normal_val = popupForm.value.normal_val.join("/");
      findRes.abnormal_val = popupForm.value.abnormal_val.join("/");
      findRes.upper_limit_val = popupForm.value.upper_limit_val;
      findRes.lower_limit_val = popupForm.value.lower_limit_val;
    }
  } else {
    tableList.value.push({
      id: buildUUID(),
      normal_val: normalValue,
      abnormal_val: abnormalValue,
      ...rest,
    });
  }

  console.log("🚀 ~ onConfirm ~ tableList.value:", tableList.value);
}

/** 单元格点击修改 */
function cellEdit(row: AddTableItemType) {
  editId.value = row.id;
  popupForm.value.item_content = row.item_content;
  popupForm.value.method = row.method;
  popupForm.value.std_explain = row.std_explain;
  popupForm.value.record_method = row.record_method;
  popupForm.value.normal_val = row.normal_val.split("/");
  popupForm.value.abnormal_val = row.abnormal_val.split("/");
  popupForm.value.upper_limit_val = row.upper_limit_val;
  popupForm.value.lower_limit_val = row.lower_limit_val;
  popupVisible.value = true;
  console.log("popupForm.value", popupForm.value);
}

/** 单元格点击删除 */
function cellDel(row: AddTableItemType) {
  tableList.value = tableList.value.filter((item) => item.id !== row.id);
}

async function clickSubmit() {
  const validateRes = await formRef.value.validate((valid, fields) => {
    for (const keys in fields) {
      if (fields[keys]) {
        // 弹出每个字段的错误提示
        ElMessage.warning(fields[keys][0].message);
        formRef.value.scrollToField(keys);
        break;
      }
    }
  });

  if (!validateRes) return;
  if (tableList.value.length === 0) {
    ElMessage.warning("请添加检查内容");
    return;
  }

  let data = {
    id: props.groupId ? props.groupId : buildUUID(),
    ...formData.value,
    item: tableList.value.map((item) => {
      let { normal_val, abnormal_val, id, ...rest } = item;
      let itemObj = {
        normal_val: normal_val.split("/").join(","),
        abnormal_val: abnormal_val.split("/").join(","),
        ...rest,
      };

      return typeof id === "string" ? itemObj : { ...itemObj, id };
    }),
  };
  console.log("🚀 ~ clickSubmit ~ data:", data);
  model.value = false;
  emits("addCheck", data);
}
function clickColse() {
  model.value = false;
}

function setData(data: AddTableType) {
  formData.value.name = data.name;
  formData.value.std_explain = data.std_explain;
  formData.value.note = data.note;

  tableList.value = data.item;
}

defineExpose({
  setData,
});

//弹窗关闭的回调
function closeDialog() {
  formRef.value?.resetFields();
  formData.value.name = "";
  formData.value.std_explain = "";
  formData.value.note = "";
  tableList.value = [];
}
</script>
<template>
  <div>
    <el-drawer v-model="model" :title="drawerTitle" size="76%" @close="closeDialog">
      <PlusForm
        ref="plusformRef"
        :rules="fromRules"
        v-model="formData"
        :columns="formColumns"
        :colProps="{ span: 12 }"
        :rowProps="{ gutter: 20 }"
        labelWidth="110"
        labelPosition="right"
        :hasFooter="false"
      ></PlusForm>

      <div class="mt-4">
        <div>
          <el-button type="primary" @click="addCheckItem" class="mb-4">新增检查项</el-button>
        </div>
        <pure-table
          ref="prueTableRef"
          row-key="id"
          stripe
          header-cell-class-name="table-gray-header"
          :data="tableList"
          :columns="tableColumns"
          adaptive
          :adaptiveConfig="{ offsetBottom: 120 }"
        >
          <template #select="{ row }">
            <div>
              <ul>
                <li v-if="row.normal_val">
                  <span>正常值：</span>
                  <span>{{ row.normal_val }}</span>
                </li>
                <li v-if="row.abnormal_val">
                  <span>异常值：</span>
                  <span>{{ row.abnormal_val }}</span>
                </li>
              </ul>
            </div>
          </template>
          <template #operation="{ row }">
            <el-button type="primary" link @click="cellEdit(row)">修改</el-button>
            <el-button type="info" link @click="cellDel(row)">删除</el-button>
          </template>
        </pure-table>
      </div>

      <template #footer>
        <div class="flex items-start">
          <el-button
            size="large"
            type="primary"
            class="w-[100px]"
            @click="clickSubmit"
            :loading="btnLoading"
          >
            确定
          </el-button>
          <el-button type="primary" plain size="large" class="w-[100px]" @click="clickColse">
            取消
          </el-button>
        </div>
      </template>
    </el-drawer>
    <PlusDialogForm
      ref="plusDialogFormRef"
      v-model:visible="popupVisible"
      v-model="popupForm"
      :form="{
        columns: popupColumns,
        rules: popupRules,
        labelWidth: '100px',
        labelPosition: 'right',
      }"
      :dialog="{
        title: '添加检查内容',
        draggable: true,
        cancelText: '取消',
        confirmText: '确定',
        top: '20vh',
      }"
      @confirm="onConfirm"
    >
      <template #plus-field-record_method>
        <el-radio-group v-model="popupForm.record_method" size="large">
          <el-radio-button :label="0">单选</el-radio-button>
          <el-radio-button :label="1">多选</el-radio-button>
          <el-radio-button :label="2">数值</el-radio-button>
          <el-radio-button :label="3">长文本</el-radio-button>
        </el-radio-group>
      </template>
      <template #plus-field-normal_val>
        <AddValueVue
          :list="popupForm.normal_val"
          @change="onNormalChange"
          ref="normalValueRef"
        ></AddValueVue>
      </template>
      <template #plus-field-abnormal_val>
        <AddValueVue
          :list="popupForm.abnormal_val"
          @change="onAbnoramlChange"
          btn-title="添加异常值"
          ref="abnormalValueRef"
        ></AddValueVue>
      </template>
    </PlusDialogForm>
  </div>
</template>
<style lang="scss" scoped></style>
