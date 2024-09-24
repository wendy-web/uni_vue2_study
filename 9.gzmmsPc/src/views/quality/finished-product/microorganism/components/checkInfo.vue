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
const formatter = (value: any) => {
  return value.replace(/[^a-zA-Z0-9]/g, "");
};
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
  emit("handleDelRow", multipleSelection.value);
};
async function validateForm() {
  if (!tableFormRef.value) return;
  const vaildateRes = await tableFormRef.value
    .validate((valid, fields) => {
      console.log("checkInfo 验证数据:",valid, fields);
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
  let { soluble_solid_val, ph_val } = item;
  if (soluble_solid_val && ph_val) {
    let soluble_ok = validatorCell(props.tableLableOptions["soluble_solid"], soluble_solid_val);
    let ph_ok = validatorCell(props.tableLableOptions["ph"], ph_val);
    if (soluble_ok && ph_ok) {
      item.check_res = 1;
    } else {
      item.check_res = 0;
    }
  }
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
interface SummaryMethodProps<T = any> {
  columns: TableColumnCtx<T>[];
  data: T[];
}
// 表尾合计行
function getSummaries(param: SummaryMethodProps) {
  const { columns, data } = param;
  const sums: string[] = [];
  let phys_weight_val = 0; // 重量
  let phys_net_val = 0; // 净含量
  let phys_internal_pressure_val = 0; // 内压
  // 根据净含量标准值，统计产品液位小于标准值的占比
  let standardVal =
    (props.tableLableOptions?.phys_net && props.tableLableOptions["phys_net"]["lower_limit_val"]) ||
    0;
  let lowerStandar = 0;
  data.forEach((item) => {
    if (item.phys_weight_val) {
      phys_weight_val += Number(item.phys_weight_val);
    }
    if (item.phys_net_val) {
      phys_net_val += Number(item.phys_net_val);
    }
    if (item.phys_internal_pressure_val) {
      phys_internal_pressure_val += Number(item.phys_internal_pressure_val);
    }
    if (item.phys_net_val < Number(standardVal)) {
      lowerStandar++;
    }
  });
  let percentage = (lowerStandar / data.length) * 100;

  const average_phys_weight = phys_weight_val / data.length;
  const average_phys_net = phys_net_val / data.length;
  const average_phys_internal_pressure = phys_internal_pressure_val / data.length;

  columns.forEach((column, index) => {
    if (index === 1) {
      sums[index] = "平均值";
      nextTick(() => {
        if (tableRef.value.$el) {
          let current = tableRef.value.$el
            .querySelector(".el-table__footer-wrapper")
            .querySelector(".el-table__footer");
          let cell = current.rows[0].cells;
          cell[1].style.textAlign = "center"; // 合计行第一列字段居中显示。
          cell[1].colSpan = "3"; // 合并单元格
          cell[2].style.display = "none";
          cell[3].style.display = "none";
        }
      });
    } else if (index === 5) {
      sums[index] = `${average_phys_weight.toFixed(2)}`;
    } else if (index === 6) {
      sums[index] = `${average_phys_net.toFixed(2)}`;
      // 净含量平均值检验结果：大于等于标准值合格
      props.formData.net_check_res = average_phys_net < Number(standardVal) ? 0 : 1;
    } else if (index === 7) {
      sums[index] = `${average_phys_internal_pressure.toFixed(2)}`;
    } else if (index === 8) {
      // 合并，隐藏9-11列
      sums[index] = `产品液位小于${standardVal}ml的占比率：${percentage.toFixed(2)}%`;
      // 液体占比检验结果：小于等于 30% 合格
      props.formData.liquid_level_check_res = percentage > 30 ? 0 : 1;
      nextTick(() => {
        if (tableRef.value.$el) {
          let current = tableRef.value.$el
            .querySelector(".el-table__footer-wrapper")
            .querySelector(".el-table__footer");
          let cell = current.rows[0].cells;
          cell[8].style.textAlign = "center"; // 合计行第一列字段居中显示。
          cell[8].colSpan = "4"; // 合并单元格
          cell[9].style.display = "none";
          cell[10].style.display = "none";
          cell[11].style.display = "none";
        }
      });
    } else {
      sums[index] = "";
    }
  });

  return sums;
}
onMounted(() => {});
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
      <div class="flex">
        <div class="mr-[10px]">
          总样品数:
          <span class="text-green-800">{{ formData.total_samples }}</span>
        </div>
        <div>
          不合格数:
          <span class="text-red-800">{{ formData.total_abnormal }}</span>
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
          :summary-method="getSummaries"
          show-summary
          height="800"
        >
          <!-- 生产日期 -->
          <!-- <template #pro_date="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.pro_date`"
              :rules="checkFormRules.pro_date"
            >
              <el-date-picker
                style="width: 100%"
                v-model="row.pro_date"
                type="date"
                placeholder="请选择"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                :disabled-date="(date:string) => {
                  return dayjs().isBefore(date);
                }"
              />
            </el-form-item>
          </template> -->
          <!-- 检验时间 -->
          <template #check_time="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.check_time`"
              :rules="checkFormRules.check_time"
            >
              <el-time-select
                v-model="row.check_time"
                start="00:00"
                step="00:01"
                end="23:59"
                placeholder="请选择时间"
              />
            </el-form-item>
          </template>
          <!-- 批号：唯一值（不可重复） -->
          <template #batch_number="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.batch_number`"
              :rules="checkFormRules.batch_number"
            >
              <el-input
                v-model="row.batch_number"
                maxlength="5"
                placeholder="请输入批号"
                :formatter="formatter"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 理化-重量 -->
          <template #phys_weight_val="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.phys_weight_val`"
              :rules="checkFormRules.phys_weight_val"
              :class="checkCellClass(row.phys_weight_val, 'phys_weight')"
            >
              <el-input
                v-model="row.phys_weight_val"
                type="number"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 理化-净含量 -->
          <template #phys_net_val="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.phys_net_val`"
              :rules="checkFormRules.phys_net_val"
              :class="checkCellClass(row.phys_net_val, 'phys_net')"
            >
              <el-input
                v-model="row.phys_net_val"
                type="number"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 理化-内压 -->
          <template #phys_internal_pressure_val="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.phys_internal_pressure_val`"
              :rules="checkFormRules.phys_internal_pressure_val"
              :class="checkCellClass(row.phys_internal_pressure_val, 'phys_internal_pressure')"
            >
              <el-input
                v-model="row.phys_internal_pressure_val"
                type="number"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 感官-色泽 -->
          <template #sense_color_res="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.sense_color_res`"
              :rules="checkFormRules.sense_color_res"
            >
              <el-select v-model="row.sense_color_res" placeholder="请选择" filterable>
                <el-option
                  v-for="item in passList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
          <!-- 感官-滋味和气味 -->
          <template #sense_smell_res="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.sense_smell_res`"
              :rules="checkFormRules.sense_smell_res"
            >
              <el-select v-model="row.sense_smell_res" placeholder="请选择" filterable>
                <el-option
                  v-for="item in passList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
          <!-- 感官- 外观 -->
          <template #sense_appearance_res="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.sense_appearance_res`"
              :rules="checkFormRules.sense_appearance_res"
            >
              <el-select v-model="row.sense_appearance_res" placeholder="请选择" filterable>
                <el-option
                  v-for="item in passList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
          <!-- 感官- 杂质 -->
          <template #sense_impurity_res="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.sense_impurity_res`"
              :rules="checkFormRules.sense_impurity_res"
            >
              <el-select v-model="row.sense_impurity_res" placeholder="请选择" filterable>
                <el-option
                  v-for="item in passList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
          <!-- 微生物-大肠杆菌 -->
          <template #microbe_coliform_bacteria_val="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.microbe_coliform_bacteria_val`"
              :rules="checkFormRules.microbe_coliform_bacteria_val"
              :class="
                checkCellClass(row.microbe_coliform_bacteria_val, 'microbe_coliform_bacteria')
              "
            >
              <el-input
                v-model="row.microbe_coliform_bacteria_val"
                type="number"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 微生物-细菌总数 -->
          <template #microbe_bacterial_val="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.microbe_bacterial_val`"
              :rules="checkFormRules.microbe_bacterial_val"
              :class="checkCellClass(row.microbe_bacterial_val, 'microbe_bacterial')"
            >
              <el-input
                v-model="row.microbe_bacterial_val"
                type="number"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 微生物-酵母菌 -->
          <template #microbe_saccharomyces_val="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.microbe_saccharomyces_val`"
              :rules="checkFormRules.microbe_saccharomyces_val"
              :class="checkCellClass(row.microbe_saccharomyces_val, 'microbe_saccharomyces')"
            >
              <el-input
                v-model="row.microbe_saccharomyces_val"
                type="number"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 微生物-霉菌 -->
          <template #microbe_mold_val="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.microbe_mold_val`"
              :rules="checkFormRules.microbe_mold_val"
              :class="checkCellClass(row.microbe_mold_val, 'microbe_mold')"
            >
              <el-input
                v-model="row.microbe_mold_val"
                type="number"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>

          <!-- 检验结果 -->
          <template #check_res="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.check_res`"
              :rules="checkFormRules.check_res"
            >
              <el-select v-model="row.check_res" placeholder="请选择" filterable>
                <el-option
                  v-for="item in passList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
        </PureTable>
      </el-form>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
