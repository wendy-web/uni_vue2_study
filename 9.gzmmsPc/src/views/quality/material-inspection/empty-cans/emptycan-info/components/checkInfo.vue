<script setup lang="tsx">
import {
  type TableInstance,
  dayjs,
} from "element-plus";
import { useAdd } from "../utils/add";

const props = defineProps([
  "checkTablecolumns",
  "checkFormRules",
  "checkTableForm",
  "formData",
  "checkTableData",
  "formLoading",
  "editDisabled",
  "tableLableOptions",
  "checkUserOptions",
  "supplyOptions",
  "suppliersMap",
]);
const emit = defineEmits(["handleAdd", "handleDelRow"]);

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
const { tableFormRef, validatorCell } = useAdd();
const handleAdd = async () => {
  // console.log("tableFormRef.value::", tableFormRef.value);
  emit("handleAdd");
};
// 多选的行
const multipleSelection = ref<unknown[]>([]);
// 表格多选
const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val.map((item) => {
    return item.id || item.unique_id;
  });
};
// 删除选中的表格
const handleDelete = () => {
  if (!multipleSelection.value.length) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }
  emit("handleDelRow", multipleSelection.value);
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

const tableRef = computed<TableInstance>(() => {
  return prueTableRef.value?.getTableRef();
});
const changePrint = (row: any, index: number) => {
  console.log("changePrint:", row, index);
  props.checkTableData[index].print_factor = props.suppliersMap[row.print_factor_id];
};
// 将方法暴露给父组件
defineExpose({
  validateForm,
  tableFormRef,
});
</script>
<template>
  <div class="app-box !p-0 flex-1">
    <div class="flex justify-between mb-[10px]">
      <div v-if="!editDisabled">
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button type="primary" @click="handleDelete">删除</el-button>
        <!-- <el-button type="primary" @click="">导入</el-button>
        <el-button type="primary" @click="">导出模板</el-button> -->
      </div>
      <div class="flex justify-end flex-1">
        <div class="mr-[10px]">
          总样品数:
          <span class="text-green-800">{{ formData.total }}</span>
        </div>
      </div>
    </div>
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
          height="800"
        >
          <!-- 生产批号：唯一值（不可重复） -->
          <!-- <template #batch_no="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.batch_no`"
              :rules="checkFormRules.batch_no"
            >
              <el-input v-model="row.batch_no" maxlength="5" placeholder="请输入批号"></el-input>
            </el-form-item>
          </template> -->
          <!-- 包号：唯一值（不可重复） -->
          <template #pack_no="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.pack_no`"
              :rules="checkFormRules.pack_no"
            >
              <el-input v-model="row.pack_no" maxlength="5" placeholder="请输入包号"></el-input>
            </el-form-item>
          </template>
          <!-- 彩印铁厂家 -->
          <template #print_factor_id="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.print_factor_id`"
              :rules="checkFormRules.print_factor_id"
            >
              <el-select
                v-model="row.print_factor_id"
                placeholder="请选择"
                filterable
                @change="changePrint(row, $index)"
              >
                <el-option
                  v-for="item in supplyOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
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
