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
function handleInputChange(event?: any, index?: number) {
  let item = props.checkTableData;
  let {
    pressure_weighing_room_val,
    weighing_room1_val,
    feeding_room2_val,
    formula_storage_room_val,
    sugar_conversion_room_val,
    charge_mixture_room1_val,
    charge_mixture_room2_val,
    pressure_weighing_room_2_val,
    weighing_room1_2_val,
    feeding_room2_2_val,
    formula_storage_room_2_val,
    sugar_conversion_room_2_val,
    charge_mixture_room1_2_val,
    charge_mixture_room2_2_val,
  } = item;
  let a = Number(pressure_weighing_room_val || 0);
  let b = Number(weighing_room1_val || 0);
  let c = Number(feeding_room2_val || 0);
  let d = Number(formula_storage_room_val || 0);
  let e = Number(sugar_conversion_room_val || 0);
  let f = Number(charge_mixture_room1_val || 0);
  let g = Number(charge_mixture_room2_val || 0);
  let h = Number(pressure_weighing_room_2_val || 0);
  let i = Number(weighing_room1_2_val || 0);
  let j = Number(feeding_room2_2_val || 0);
  let k = Number(formula_storage_room_2_val || 0);
  let l = Number(sugar_conversion_room_2_val || 0);
  let m = Number(charge_mixture_room1_2_val || 0);
  let n = Number(charge_mixture_room2_2_val || 0);

  item.avg_val = (a + b + c + d + e + f + g + h + i + j + k + l + m + n) / 14;
  item.avg_val = item.avg_val.toFixed(2);
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
        :model="checkTableData"
        ref="tableFormRef"
        :rules="checkFormRules"
        :disabled="editDisabled"
      >
        <div class="table-box w-[100%] overflow-y-auto">
          <div class="bg-gray-300 font-bold h-[40px] flex items-center justify-center">
            <span>洁净间</span>
          </div>
          <table>
            <thead>
              <tr>
                <th class="w-[80px]" colspan="2">细菌学指标(个/皿)</th>
                <th class="w-[80px]">负压称量室</th>
                <th class="w-[80px]">称量间1</th>
                <th class="w-[80px]">投料间2</th>
                <th class="w-[80px]">配方暂存间</th>
                <th class="w-[80px]">化糖间</th>
                <th class="w-[80px]">配料间1</th>
                <th class="w-[80px]">配料间2</th>
                <th class="w-[80px]">平均数≤10个/皿</th>
                <th class="w-[80px]">空白样</th>
                <th class="w-[80px]">结果</th>
                <th class="w-[80px]">压差(Pa)</th>
                <!-- <th class="w-[80px]">备注</th> -->
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowspan="2" class="w-[80px] text-center">
                  <div>TSA</div>
                </td>
                <td rowspan="2" class="w-[80px] text-center">
                  <div>细菌总数</div>
                </td>
                <td>
                  <el-form-item
                    prop="pressure_weighing_room_val"
                    :rules="checkFormRules.pressure_weighing_room_val"
                  >
                    <el-input
                      v-model="checkTableData.pressure_weighing_room_val"
                      @input="handleInputChange()"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`weighing_room1_val`"
                    :rules="checkFormRules.weighing_room1_val"
                  >
                    <el-input
                      v-model="checkTableData.weighing_room1_val"
                      @input="handleInputChange()"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`feeding_room2_val`"
                    :rules="checkFormRules.feeding_room2_val"
                  >
                    <el-input
                      v-model="checkTableData.feeding_room2_val"
                      @input="handleInputChange()"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`formula_storage_room_val`"
                    :rules="checkFormRules.formula_storage_room_val"
                  >
                    <el-input
                      v-model="checkTableData.formula_storage_room_val"
                      @input="handleInputChange()"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`sugar_conversion_room_val`"
                    :rules="checkFormRules.sugar_conversion_room_val"
                  >
                    <el-input
                      v-model="checkTableData.sugar_conversion_room_val"
                      @input="handleInputChange()"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`charge_mixture_room1_val`"
                    :rules="checkFormRules.charge_mixture_room1_val"
                  >
                    <el-input
                      v-model="checkTableData.charge_mixture_room1_val"
                      @input="handleInputChange()"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`charge_mixture_room2_val`"
                    :rules="checkFormRules.charge_mixture_room2_val"
                  >
                    <el-input
                      v-model="checkTableData.charge_mixture_room2_val"
                      @input="handleInputChange()"
                    />
                  </el-form-item>
                </td>
                <td rowspan="2">
                  <el-form-item :prop="`avg_val`" :rules="checkFormRules.avg_val">
                    <el-input v-model="checkTableData.avg_val" disabled />
                  </el-form-item>
                </td>
                <td rowspan="2">
                  <el-form-item :prop="`blank_sample_val`" :rules="checkFormRules.blank_sample_val">
                    <el-input v-model="checkTableData.blank_sample_val" />
                  </el-form-item>
                </td>

                <td rowspan="2">
                  <el-form-item :prop="`check_res`" :rules="checkFormRules.check_res">
                    <el-select v-model="checkTableData.check_res" placeholder="请选择">
                      <el-option
                        v-for="item in passList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </td>
                <td rowspan="2">
                  <el-form-item
                    :prop="`pressure_diff_val`"
                    :rules="checkFormRules.pressure_diff_val"
                  >
                    <el-input v-model="checkTableData.pressure_diff_val" />
                  </el-form-item>
                </td>
                <!-- <td rowspan="2">
                  <el-form-item>
                    <el-input v-model="checkTableData.note" />
                  </el-form-item>
                </td> -->
              </tr>
              <!-- 细菌总数-->
              <tr>
                <td>
                  <el-form-item
                    prop="pressure_weighing_room_2_val"
                    :rules="checkFormRules.pressure_weighing_room_2_val"
                  >
                    <el-input
                      v-model="checkTableData.pressure_weighing_room_2_val"
                      @input="handleInputChange()"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`weighing_room1_2_val`"
                    :rules="checkFormRules.weighing_room1_2_val"
                  >
                    <el-input
                      v-model="checkTableData.weighing_room1_2_val"
                      @input="handleInputChange()"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`feeding_room2_2_val`"
                    :rules="checkFormRules.feeding_room2_2_val"
                  >
                    <el-input
                      v-model="checkTableData.feeding_room2_2_val"
                      @input="handleInputChange()"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`formula_storage_room_2_val`"
                    :rules="checkFormRules.formula_storage_room_2_val"
                  >
                    <el-input
                      v-model="checkTableData.formula_storage_room_2_val"
                      @input="handleInputChange()"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`sugar_conversion_room_2_val`"
                    :rules="checkFormRules.sugar_conversion_room_2_val"
                  >
                    <el-input
                      v-model="checkTableData.sugar_conversion_room_2_val"
                      @input="handleInputChange()"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`charge_mixture_room1_2_val`"
                    :rules="checkFormRules.charge_mixture_room1_2_val"
                  >
                    <el-input
                      v-model="checkTableData.charge_mixture_room1_2_val"
                      @input="handleInputChange()"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`charge_mixture_room2_2_val`"
                    :rules="checkFormRules.charge_mixture_room2_2_val"
                  >
                    <el-input
                      v-model="checkTableData.charge_mixture_room2_2_val"
                      @input="handleInputChange()"
                    />
                  </el-form-item>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- :model="checkTableForm" -->
        <!-- <PureTable
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
          <template #pressure_weighing_room_val="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.pressure_weighing_room_val`"
              :rules="checkFormRules.pressure_weighing_room_val"
            >
              <el-input
                v-model="row.pressure_weighing_room_val"
                placeholder="请输入内容"
                type="number"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>
          <template #weighing_room1_val="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.weighing_room1_val`"
              :rules="checkFormRules.weighing_room1_val"
            >
              <el-input
                v-model="row.weighing_room1_val"
                placeholder="请输入内容"
                type="number"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>
          <template #feeding_room2_val="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.feeding_room2_val`"
              :rules="checkFormRules.feeding_room2_val"
            >
              <el-input
                v-model="row.feeding_room2_val"
                type="number"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>
          <template #formula_storage_room_val="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.formula_storage_room_val`"
              :rules="checkFormRules.formula_storage_room_val"
            >
              <el-input
                v-model="row.formula_storage_room_val"
                type="number"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>
          <template #sugar_conversion_room_val="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.sugar_conversion_room_val`"
              :rules="checkFormRules.sugar_conversion_room_val"
            >
              <el-input
                v-model="row.sugar_conversion_room_val"
                type="number"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>
          <template #charge_mixture_room1_val="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.charge_mixture_room1_val`"
              :rules="checkFormRules.charge_mixture_room1_val"
            >
              <el-input
                v-model="row.charge_mixture_room1_val"
                type="number"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>
          <template #charge_mixture_room2_val="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.charge_mixture_room2_val`"
              :rules="checkFormRules.charge_mixture_room2_val"
            >
              <el-input
                v-model="row.charge_mixture_room2_val"
                type="number"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>
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
          <template #note="{ row, $index }">
            <el-form-item :prop="`checkTableData.${$index}.note`">
              <el-input v-model="row.note" type="textarea" placeholder="请输入备注" />
            </el-form-item>
          </template>
        </PureTable> -->
      </el-form>
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.pure-table-box .el-form-item--default) {
  margin-top: 18px;
}
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
