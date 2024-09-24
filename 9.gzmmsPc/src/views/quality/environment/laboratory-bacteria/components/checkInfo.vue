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
        :model="checkTableData"
        ref="tableFormRef"
        :rules="checkFormRules"
        :disabled="editDisabled"
      >
        <div class="table-box w-[100%] overflow-y-auto">
          <table>
            <thead>
              <tr>
                <th class="w-[80px]">检测点</th>
                <th class="w-[80px]">无菌室1</th>
                <th class="w-[80px]">无菌室2</th>
                <th class="w-[80px]">超净台1</th>
                <th class="w-[80px]">超净台2</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="w-[80px] text-center">
                  <div>菌落数(个)</div>
                </td>

                <td>
                  <el-form-item
                    prop="room1_colony_count_val"
                    :rules="checkFormRules.room1_colony_count_val"
                  >
                    <el-input v-model="checkTableData.room1_colony_count_val" />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`room2_colony_count_val`"
                    :rules="checkFormRules.room2_colony_count_val"
                  >
                    <el-input v-model="checkTableData.room2_colony_count_val" />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`room3_colony_count_val`"
                    :rules="checkFormRules.room3_colony_count_val"
                  >
                    <el-input v-model="checkTableData.room3_colony_count_val" />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`room4_colony_count_val`"
                    :rules="checkFormRules.room4_colony_count_val"
                  >
                    <el-input v-model="checkTableData.room4_colony_count_val" />
                  </el-form-item>
                </td>
              </tr>
              <!-- 平均菌落数 -->
              <!-- <tr>
                <td class="w-[80px] text-center">
                  <div>平均菌落数(个)</div>
                </td>

                <td>
                  <el-form-item
                    :prop="`room1_avg_colony_count_val`"
                    :rules="checkFormRules.room1_avg_colony_count_val"
                  >
                    <el-input v-model="checkTableData.room1_avg_colony_count_val" />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`room2_avg_colony_count_val`"
                    :rules="checkFormRules.room2_avg_colony_count_val"
                  >
                    <el-input v-model="checkTableData.room2_avg_colony_count_val" />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`room3_avg_colony_count_val`"
                    :rules="checkFormRules.room3_avg_colony_count_val"
                  >
                    <el-input v-model="checkTableData.room3_avg_colony_count_val" />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`room4_avg_colony_count_val`"
                    :rules="checkFormRules.room4_avg_colony_count_val"
                  >
                    <el-input v-model="checkTableData.room4_avg_colony_count_val" />
                  </el-form-item>
                </td>
              </tr> -->
              <!-- 平均浓度 -->
              <tr>
                <td class="w-[80px] text-center">
                  <div>平均浓度(个/m³)</div>
                  <div>≤500/m³</div>
                </td>

                <td colspan="2">
                  <el-form-item
                    :prop="`room1_avg_density_val`"
                    :rules="checkFormRules.room1_avg_density_val"
                  >
                    <el-input v-model="checkTableData.room1_avg_density_val" />
                  </el-form-item>
                </td>
                <td colspan="2">
                  <el-form-item
                    :prop="`room3_avg_density_val`"
                    :rules="checkFormRules.room3_avg_density_val"
                  >
                    <el-input v-model="checkTableData.room3_avg_density_val" />
                  </el-form-item>
                </td>
              </tr>
              <!-- 结果判定 -->
              <tr>
                <td class="w-[80px] text-center">
                  <div>结果判定</div>
                </td>
                <td colspan="2">
                  <el-form-item :prop="`room1_check_res`" :rules="checkFormRules.room1_check_res">
                    <el-select
                      v-model="checkTableData.room1_check_res"
                      placeholder="请选择"
                      filterable
                    >
                      <el-option
                        v-for="item in passList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </td>
                <td colspan="2">
                  <el-form-item :prop="`room3_check_res`" :rules="checkFormRules.room3_check_res">
                    <el-select
                      v-model="checkTableData.room3_check_res"
                      placeholder="请选择"
                      filterable
                    >
                      <el-option
                        v-for="item in passList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-form>
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.warn-text .el-input__inner) {
  color: var(--el-color-danger);
}
:deep(.warn-text .el-input__wrapper) {
  font-weight: bold;
  box-shadow: 0 0 0 1px var(--el-color-danger) inset;
}
.table-box {
  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: auto;
  }
  th,
  td {
    border: 1px solid #ebeef5;
    padding: 8px;
  }
  th {
    background-color: #ecf5ff !important;
  }
  /* 设置单元格的高度和宽度 */
  .fixed-width {
    width: 100px; /* 设置单元格宽度 */
  }
  .fixed-height {
    height: 50px; /* 设置单元格高度 */
  }
  /* 固定第一列 */
  .fixed-column {
    position: sticky;
    left: 0;
    background-color: white; /* 确保固定列的背景颜色 */
    z-index: 100;
  }
}
:deep(.sign-cell .el-form-item__content) {
  justify-content: center;
}
</style>
