<script setup lang="ts">
/* 新建/编辑的抽屉组件 */
import type { FormInstance } from "element-plus";
import { checkConfigSaveApi, getPointInspectTypeApi } from "@/api/quality/environment/check-config";
import { CheckConfigListType } from "@/api/quality/environment/check-config/types";
import addCheckGroupVue from "./addCheckGroup.vue";
import { type AddTableItemType, type AddTableType, useAdd } from "./columns";

interface Props {
  listId: number;
}

const props = withDefaults(defineProps<Props>(), {
  listId: 0,
});

const { baseRules, baseFormData, baseColumns, addTableColumns, tableData, orderTypeList } =
  useAdd();

const emits = defineEmits(["refresh"]);
const model = defineModel("visible", { required: true, default: false });

const addCheckGroupRef = ref<InstanceType<typeof addCheckGroupVue>>();

/** 添加检查组组件的开关 */
const checkGroupShow = ref(false);
/** 确认按钮的loading */
const btnLoading = ref(false);

const plusformRef = ref();
const formRef = computed(() => {
  return plusformRef.value.formInstance as FormInstance;
});

/** 检查组id */
const groupId = ref<number | string>(0);

const drawerTitle = computed(() => {
  return props.listId ? "编辑配置" : "新增配置";
});

/** 点击新增检查组 */
function addCheckGroup() {
  groupId.value = 0;
  checkGroupShow.value = true;
}

/** 监听子组件抽屉,点击确定的事件 */
function addCheckInfo(data: AddTableType) {
  console.log("🚀 ~ addCheckInfo ~ data:", data);
  if (groupId.value) {
    console.log("是确定编辑");
    // 如果存在,表示是编辑
    let index = tableData.value.findIndex((item) => item.id === groupId.value);
    if (index !== -1) {
      tableData.value[index] = data;
    }
  } else {
    tableData.value.push(data);
  }
}

/** 单元格点击修改 */
function cellEdit(row: AddTableType) {
  checkGroupShow.value = true;
  groupId.value = row.id;
  addCheckGroupRef.value?.setData(row);
}

/** 单元格点击删除 */
function cellDel(row: AddTableItemType) {
  tableData.value = tableData.value.filter((item) => item.id !== row.id);
}

/** 点击确认 */
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

  if (tableData.value.length === 0) {
    ElMessage.warning("请添加检测组内容");
    return;
  }

  let data = {
    id: props.listId ? props.listId : undefined,
    ...baseFormData.value,
    group: tableData.value.map((item) => {
      let { id, ...rest } = item;
      let itemObj = {
        ...rest,
      };
      return typeof id === "string" ? itemObj : { ...itemObj, id };
    }),
  };

  const result = await checkConfigSaveApi(data);
  ElMessage.success(result.msg);
  model.value = false;
  emits("refresh");
}

/** 点击取消 */
function clickColse() {
  model.value = false;
}

async function getOrderType() {
  const result = await getPointInspectTypeApi();
  orderTypeList.value = result.data;
}

function setData(data: CheckConfigListType) {
  baseFormData.value.type = data.type;
  baseFormData.value.note = data.note;

  tableData.value = data.group;
}

defineExpose({
  setData,
});

//弹窗关闭的回调
function closeDialog() {
  formRef.value?.resetFields();
  baseFormData.value.type = undefined;
  baseFormData.value.note = "";
  tableData.value = [];
}

onMounted(() => {
  getOrderType();
});
</script>
<template>
  <el-drawer
    v-model="model"
    :title="drawerTitle"
    size="76%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="closeDialog"
  >
    <PlusForm
      ref="plusformRef"
      :rules="baseRules"
      v-model="baseFormData"
      labelWidth="100"
      :columns="baseColumns"
      :row-props="{ gutter: 20 }"
      :col-props="{
        span: 12,
      }"
      :hasFooter="false"
    ></PlusForm>
    <div class="mt-4">
      <div>
        <el-button type="primary" @click="addCheckGroup" class="mb-4">新增检查组</el-button>
      </div>
      <pure-table
        ref="prueTableRef"
        row-key="id"
        stripe
        header-cell-class-name="table-gray-header"
        :data="tableData"
        :columns="addTableColumns"
        adaptive
        :adaptiveConfig="{ offsetBottom: 120 }"
      >
        <template #operation="{ row }">
          <el-button type="primary" link @click="cellEdit(row)">编辑</el-button>
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
          确认配置
        </el-button>
        <el-button type="primary" plain size="large" class="w-[100px]" @click="clickColse">
          取消
        </el-button>
      </div>
    </template>
    <addCheckGroupVue
      v-model:visible="checkGroupShow"
      :groupId="groupId"
      @add-check="addCheckInfo"
      ref="addCheckGroupRef"
    ></addCheckGroupVue>
  </el-drawer>
</template>
<style lang="scss" scoped></style>
