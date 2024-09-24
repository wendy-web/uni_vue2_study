<script setup lang="tsx">
import { type TableInstance } from "element-plus";
import { useAdd } from "../utils/add";

const props = defineProps([
  "checkTablecolumns",
  "checkFormRules",
  "checkTableForm",
  "formData",
  "checkTableData",
  "formLoading",
  "editDisabled",
]);

/** puretable的ref */
const prueTableRef = ref();
const passList = [
  {
    name: "合格",
    id: 1,
  },
  {
    name: "不合格",
    id: 0,
  },
];
const { tableFormRef } = useAdd();

// 多选的行
const multipleSelection = ref<unknown[]>([]);
// 表格多选
const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val.map((item) => {
    return item.id || item.unique_id;
  });
};

async function validateForm() {
  if (!tableFormRef.value) return true;
  const vaildateRes = await tableFormRef.value
    .validate((valid, fields) => {
      for (const keys in fields) {
        if (fields[keys]) {
          // 弹出每个字段的错误提示
          ElMessage.warning(fields[keys][0].message);
          tableFormRef.value.scrollToField(keys);
          break;
        }
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
  return vaildateRes;
}
// checkInfo input 表格变化
function handleInputChange(event: any, index: number) {}

const tableRef = computed<TableInstance>(() => {
  return prueTableRef.value?.getTableRef();
});

// 将方法暴露给父组件
defineExpose({
  validateForm,
  tableFormRef,
});
</script>
<template>
  <div class="app-box !p-0 flex-1">
    <div class="pure-table-box">
      <el-form
        :model="checkTableForm"
        ref="tableFormRef"
        :rules="checkFormRules"
        :disabled="editDisabled"
      >
        <PureTable
          ref="prueTableRef"
          row-key="id"
          header-cell-class-name="table-row-header"
          alignWhole="center"
          :data="checkTableData"
          :columns="checkTablecolumns"
          :loading="formLoading"
          border
          @selection-change="handleSelectionChange"
        >
          <template #ct_val="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.ct_val`"
              :rules="checkFormRules.ct_val"
            >
              <el-input
                v-model="row.ct_val"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>
          <template #glove_val="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.glove_val`"
              :rules="checkFormRules.glove_val"
            >
              <el-input
                v-model="row.glove_val"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>
          <template #zipper_val="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.zipper_val`"
              :rules="checkFormRules.zipper_val"
            >
              <el-input
                v-model="row.zipper_val"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>
          <template #cuff_val="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.cuff_val`"
              :rules="checkFormRules.cuff_val"
            >
              <el-input
                v-model="row.cuff_val"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>
        </PureTable>
      </el-form>
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.pure-table-box .el-form-item--default) {
  margin-top: 18px;
}
</style>
