<script setup lang="tsx">
import { type FormInstance } from "element-plus";
import { getEqipmentListApi } from "@/api/energy/common/index";
import TreeSelectVue from "@/components/DeptSelect/TreeSelect.vue";
import { useColumns } from "./columns";

interface Props {
  orderType?: number;
  relId?: number;
}

const props = withDefaults(defineProps<Props>(), {
  orderType: 1,
  relId: 0,
});

const {
  getTypeList,
  treeData,
  addFormData,
  addColumns,
  columns,
  tableData,
  addRules,
  tableLoading,
  getRelData,
  relList,
  rel_id,
} = useColumns();

const PlusFormRef = ref();
/** 表单的ref */
const addFormRef = computed(() => {
  return PlusFormRef.value.formInstance as FormInstance;
});

function tagClose() {
  addFormData.value.eq_name = "";
  addFormData.value.eq_id = undefined;
}

function cellSelect(row: any) {
  addFormData.value.eq_name = row.bar_title;
  addFormData.value.eq_id = row.id;
}

function handleTypeChange(val: number) {
  console.log("🚀 ~ handleTypeChange ~ val:", val);
  if (!val) {
    addFormData.value.eq_type = undefined;
    tableData.value = [];
    addFormRef.value.clearValidate("eq_name");
    return;
  }
  getEquipmentList();
}

async function getEquipmentList() {
  let data = {
    equipment_type: addFormData.value.eq_type,
    type: props.orderType
  };
  tableLoading.value = true;
  const result = await getEqipmentListApi(data);
  tableLoading.value = false;
  tableData.value = result.data.list;
}

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

function setFormData(data: typeof addFormData.value) {
  addFormData.value = data;
  if (addFormData.value.eq_type) {
    getEquipmentList();
  }
}

defineExpose({
  validatorForm,
  addFormData,
  setFormData,
});

onMounted(() => {
  rel_id.value = props.relId;
  console.log("rel_id.value", rel_id.value);
  getRelData(props.orderType);
  getTypeList();
});
</script>
<template>
  <div class="config-wrapper">
    <PlusForm
      ref="PlusFormRef"
      :rules="addRules"
      v-model="addFormData"
      labelWidth="110"
      label-position="right"
      :columns="addColumns"
      :row-props="{ gutter: 20 }"
      :hasFooter="false"
    >
      <template #plus-field-eq_type>
        <TreeSelectVue
          :list="treeData"
          v-model="addFormData.eq_type"
          @change="handleTypeChange"
        ></TreeSelectVue>
      </template>

      <template #plus-field-eq_name>
        <el-input v-model="addFormData.eq_name" v-show="false"></el-input>
        <span v-if="!addFormData.eq_type" class="text-slate-400">请先选择仪表类型</span>
        <span v-else-if="!addFormData.eq_name" class="text-slate-400">请选择下方设备列表</span>
        <el-tag closable class="mr-2 mb-2" @close="tagClose" size="large" v-else>
          {{ addFormData.eq_name }}
        </el-tag>
      </template>
    </PlusForm>
    <pure-table
      ref="prueTableRef"
      header-cell-class-name="table-gray-header"
      row-key="id"
      :data="tableData"
      :columns="columns"
      :loading="tableLoading"
      adaptive
      :adaptiveConfig="{ offsetBottom: 240 }"
    >
      <template #operation="{ row }">
        <el-button type="primary" link @click="cellSelect(row)">选择此设备</el-button>
      </template>
    </pure-table>
  </div>
</template>
<style lang="scss" scoped></style>
