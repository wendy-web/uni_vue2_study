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
  "standardInfo",
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
        <div class="table-box w-[100%] overflow-y-auto">
          <table>
            <thead>
              <!-- 第一行表头 -->
              <tr>
                <th rowspan="2" class="w-[80px] align-bottom">采样次数</th>
                <th rowspan="2" class="w-[80px] align-bottom">采样粒子</th>
                <th :colspan="checkTableData.length" class="header-main">采样点粒子浓度(粒/m³)</th>
                <th rowspan="2" class="w-[120px]">备注</th>
              </tr>
              <tr>
                <th v-for="item in checkTableData" class="w-[80px]">
                  {{ item.sampling_point_name }}
                </th>
              </tr>
            </thead>
            <tbody>
              <!-- 第一次 -->
              <tr>
                <td rowspan="2" class="w-[80px] text-center">
                  <div>第一次</div>
                </td>
                <td class="w-[80px] text-center">
                  <div>≥0.5um</div>
                </td>

                <td v-for="(item, index) in checkTableData" class="w-[80px] text-center">
                  <el-form-item
                    :prop="`checkTableData.${index}.one05_val`"
                    :rules="checkFormRules.one05_val"
                  >
                    <el-input v-model="item.one05_val" />
                    <!-- <el-input v-model="checkTableData[index]['one05_val']" /> -->
                  </el-form-item>
                </td>
                <td v-if="checkTableData.length==0"></td>
                <td rowspan="4">
                  <!-- <el-form-item
                    :prop="`room2_colony_count_val`"
                    :rules="checkFormRules.room2_colony_count_val"
                  >
                    <el-input v-model="checkTableData.room2_colony_count_val" />
                  </el-form-item> -->
                </td>
               
              </tr>
              <tr>
                <td class="w-[80px] text-center">
                  <div>≥5um</div>
                </td>
                <td v-for="(item, index) in checkTableData" class="w-[80px] text-center">
                  <el-form-item
                    :prop="`checkTableData.${index}.one5_val`"
                    :rules="checkFormRules.one5_val"
                  >
                    <el-input v-model="item.one5_val" />
                  </el-form-item>
                </td>
                <td v-if="checkTableData.length==0"></td>
              </tr>
              <!-- 第二次 -->
              <tr>
                <td rowspan="2" class="w-[80px] text-center">
                  <div>第二次</div>
                </td>
                <td class="w-[80px] text-center">
                  <div>≥0.5um</div>
                </td>
                <td v-for="(item, index) in checkTableData" class="w-[80px] text-center">
                  <el-form-item
                    :prop="`checkTableData.${index}.two05_val`"
                    :rules="checkFormRules.two05_val"
                  >
                    <el-input v-model="item.two05_val" />
                  </el-form-item>
                </td>
                <td v-if="checkTableData.length==0"></td>
                <!-- <td colspan="2">
                  <el-form-item
                    :prop="`room3_avg_density_val`"
                    :rules="checkFormRules.room3_avg_density_val"
                  >
                    <el-input v-model="checkTableData.room3_avg_density_val" />
                  </el-form-item>
                </td> -->
              </tr>
              <tr>
                <td class="w-[80px] text-center">
                  <div>≥5um</div>
                </td>
                <td v-for="(item, index) in checkTableData" class="w-[80px] text-center">
                  <el-form-item
                    :prop="`checkTableData.${index}.two5_val`"
                    :rules="checkFormRules.two5_val"
                  >
                    <el-input v-model="item.two5_val" />
                  </el-form-item>
                </td>
                <td v-if="checkTableData.length==0"></td>

              </tr>
              <!-- 结果判定 -->
              <tr class="bg-[#ECF5FF] font-bold">
                <td :colspan="2 + checkTableData.length" class="text-center">结果判定</td>
                <td class="text-center">标准粒子浓度(粒/m³)</td>
              </tr>
              <tr>
                <td rowspan="2" class="w-[80px] text-center">
                  <div>各点平均粒子浓度(粒/m³)</div>
                </td>
                <td class="w-[80px] text-center">
                  <div>≥5um</div>
                </td>
                <td v-for="(item, index) in checkTableData" class="w-[80px] text-center">
                  <el-form-item
                    :prop="`checkTableData.${index}.avg5_val`"
                    :rules="checkFormRules.avg5_val"
                  >
                    <el-input v-model="item.avg5_val" />
                  </el-form-item>
                </td>
                <td v-if="checkTableData.length==0"></td>

                <td class="w-[80px] text-center">
                  <div>{{ standardInfo['all']['5standard_val'] || '' }}</div>
                </td>
              </tr>
              <tr>
                <td class="w-[80px] text-center">
                  <div>≥0.5um</div>
                </td>
                <td v-for="(item, index) in checkTableData" class="w-[80px] text-center">
                  <el-form-item
                    :prop="`checkTableData.${index}.avg05_val`"
                    :rules="checkFormRules.avg05_val"
                  >
                    <el-input v-model="item.avg05_val" />
                  </el-form-item>
                </td>
                <td v-if="checkTableData.length==0"></td>

                <td class="w-[80px] text-center">
                  <div>{{ standardInfo['all']['05standard_val'] || ''}}</div>
                </td>
              </tr>
              <tr>
                <td rowspan="2" class="w-[80px] text-center">
                  <div>UCL(粒/m³)</div>
                </td>
                <td class="w-[80px] text-center">
                  <div>≥5um</div>
                </td>

                <td :colspan="checkTableData.length">
                  <el-form-item
                    :prop="`ucl5_val`"
                    :rules="checkFormRules.ucl5_val"
                  >
                    <el-input v-model="formData.ucl5_val" />
                  </el-form-item>
                </td>
                <td class="w-[80px] text-center">
                  <div>{{ standardInfo['ucl']['5standard_val'] || '' }}</div>
                </td>
              </tr>
              <tr>
                <td class="w-[80px] text-center">
                  <div>≥0.5um</div>
                </td>
                <td :colspan="checkTableData.length">
                  <el-form-item
                    :prop="`ucl05_val`"
                    :rules="checkFormRules.ucl05_val"
                  >
                    <el-input v-model="formData.ucl05_val" />
                  </el-form-item>
                </td>
                <td class="w-[80px] text-center">
                  <div>{{ standardInfo['ucl']['05standard_val'] || '' }}</div>
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
