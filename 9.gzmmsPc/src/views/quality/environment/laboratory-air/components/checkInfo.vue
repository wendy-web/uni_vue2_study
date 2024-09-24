<script setup lang="tsx">
import {
  type FormInstance,
  type FormRules,
  type TableColumnCtx,
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
const { tableFormRef, validatorCell } = useAdd();

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
function handleInputChange(event: any, index: number) {
  let item = props.checkTableData[index];
  let {
    room1_val,
    room2_val,
    room3_val,
    room4_val,
    room5_val,
    tower1_val,
    tower2_val,
  } = item;
  let a = Number(room1_val || 0);
  let b = Number(room2_val || 0);
  let c = Number(room3_val || 0);
  let d = Number(room4_val || 0);
  let e = Number(room5_val || 0);
  let f = Number(tower1_val || 0);
  let g = Number(tower2_val || 0);
  item.room_avg_val = (a + b + c + d + e ) / 5;
  item.tower_avg_val = (f + g ) / 2;
  item.room_avg_val = item.room_avg_val.toFixed(2);
  item.tower_avg_val = item.tower_avg_val.toFixed(2);
}
// 检查单元格是否符合标准值 自定义class
function checkCellClass(value: any, key: string) {
  let className = "";
  if (!props.tableLableOptions || !value) return className;
  let ok = validatorCell(props.tableLableOptions[key], value);
  className = ok ? "" : "warn-text";
  return className;
}
const tableRef = computed<TableInstance>(() => {
  return prueTableRef.value?.getTableRef();
});
function headerStyle({ row, column, rowIndex, columnIndex }: any) {
  if (rowIndex === 0 && columnIndex === 0) {
    nextTick(() => {
      document.getElementsByClassName(column.id)[0].setAttribute("colSpan", "2");
    }); //  一定要写在加载完毕后，nextTick 更新的最晚，才能获取到dom节点。
  }
  if (rowIndex === 0 && columnIndex === 1) {
    return { display: "none" };
  }
}
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
          :header-cell-style="headerStyle"
          alignWhole="center"
          :data="checkTableData"
          :columns="checkTablecolumns"
          :loading="formLoading"
          border
          @selection-change="handleSelectionChange"
        >
          <template #title="{ row, $index }">
            <span>{{ row.title }}</span>
          </template>
          <template #subtitle="{ row, $index }">
            <span>{{ row.subtitle }}</span>
          </template>
          <template #room1_val="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.room1_val`"
              :rules="checkFormRules.room1_val"
            >
              <el-input
                v-model="row.room1_val"
                placeholder="请输入内容"
                type="number"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>
          <template #room2_val="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.room2_val`"
              :rules="checkFormRules.room2_val"
            >
              <el-input
                v-model="row.room2_val"
                placeholder="请输入内容"
                type="number"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>
          <template #room3_val="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.room3_val`"
              :rules="checkFormRules.room3_val"
            >
              <el-input
                v-model="row.room3_val"
                type="number"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>
          <template #room4_val="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.room4_val`"
              :rules="checkFormRules.room4_val"
            >
              <el-input
                v-model="row.room4_val"
                type="number"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 化糖间 -->
          <template #room5_val="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.room5_val`"
              :rules="checkFormRules.room5_val"
            >
              <el-input
                v-model="row.room5_val"
                type="number"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>
          <template #tower1_val="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.tower1_val`"
              :rules="checkFormRules.tower1_val"
            >
              <el-input
                v-model="row.tower1_val"
                type="number"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>
          <template #tower2_val="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.tower2_val`"
              :rules="checkFormRules.tower2_val"
            >
              <el-input
                v-model="row.tower2_val"
                type="number"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 空白样 -->
          <template #blank_sample_val="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.blank_sample_val`"
              :rules="checkFormRules.blank_sample_val"
            >
              <el-input
                v-model="row.blank_sample_val"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 结果 -->
          <template #check_res="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.check_res`"
              :rules="checkFormRules.check_res"
            >
              <el-select v-model="row.check_res" placeholder="请选择">
                <el-option
                  v-for="item in passList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
          <!-- 压差(Pa) -->
          <template #pressure_diff_val="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.pressure_diff_val`"
              :rules="checkFormRules.pressure_diff_val"
            >
              <el-input
                v-model="row.pressure_diff_val"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>

          <!-- 备注 -->
          <template #note="{ row, $index }">
            <el-form-item :prop="`checkTableData.${$index}.note`">
              <el-input v-model="row.note" type="textarea" placeholder="请输入备注" />
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
