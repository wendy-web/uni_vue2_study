<script setup lang="tsx">
import {
  type FormInstance,
  type FormRules,
  type TableColumnCtx,
  type TableInstance,
  dayjs,
} from "element-plus";
// 引入excel导入组件
import ExcelUpload from "../../../components/Upload/ExcelUpload.vue";
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
const emit = defineEmits(["handleAdd", "handleDelRow", "updateGroupData", "getExcelData"]);

/** puretable的ref */
const prueTableRef = ref();

const { tableFormRef, validatorCell, passList } = useAdd();
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
  multipleSelection.value = val;
};
// 删除选中的表格
const handleDelete = () => {
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
  if (!value || !props.tableLableOptions) {
    return className;
  }
  let ok = validatorCell(props.tableLableOptions[key], value);
  className = ok ? "" : "warn-text";
  return className;
}
const tableRef = computed<TableInstance>(() => {
  return prueTableRef.value?.getTableRef();
});
// 子组件更新数据
function updateGroupData(index: any, key: string, value: any) {
  emit("updateGroupData", index, key, value);
}
// 合并行数
interface tableItem {
  batch_number: string;
  check_time: string;
  pro_date: number;
  weight_val: number;
  hook_length_val: number;
  cover_hook_length_val: number;
  overlapping_length_val: number;
  thickness_val: number;
  cover_hook_top_gap_val: number;
  can_hook_top_gap_val: number;
  corrugation_val: number;
  compactness_val: number;
  check_res: number;
  note: string;
  [key: string]: any;
}

interface SpanMethodProps {
  row: tableItem;
  column: TableColumnCtx<tableItem>;
  rowIndex: any;
  columnIndex: any;
}
function tableSpanMethod({ rowIndex, columnIndex }: any): any {
  if ([0, 1, 2, 3, 4, 5, 14, 15, 16].includes(columnIndex)) {
    if (rowIndex % 3 === 0) {
      return {
        rowspan: 3,
        colspan: 1,
      };
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      };
    }
  }
}
const getDisplayIndex = (index: any) => {
  return Math.floor(index / 3) + 1;
};
// 上传文件弹窗显示
const uploadShow = ref(false);
// 点击下载模板
function downloadTemp() {
  const downloadUrl: string = "/static/卷封检验信息导入模板.xlsx";
  console.log("downloadUrl", downloadUrl);
  let subIndex = downloadUrl.lastIndexOf("/");
  let _fileName = downloadUrl.substring(subIndex + 1);
  const x = new window.XMLHttpRequest();
  x.open("GET", downloadUrl, true);
  x.responseType = "blob";
  x.onload = () => {
    const url = window.URL.createObjectURL(x.response);
    const a = document.createElement("a");
    a.href = url;
    a.download = _fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  x.send();
}
function getExcelData(data: any) {
  emit("getExcelData", data);
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
        <el-button type="success" @click="uploadShow = true">
          <template #icon>
            <i-ep-Upload></i-ep-Upload>
          </template>
          导入模板
        </el-button>
        <el-button type="primary" @click="downloadTemp">导出模板</el-button>
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
          :span-method="tableSpanMethod"
          border
          @selection-change="handleSelectionChange"
          height="800"
        >
          <!-- 序号 -->
          <!-- <template #index="{ $index }">{{ getDisplayIndex($index) }}</template> -->
          <!-- <template #index="{ $index }">{{ getDisplayIndex($index) }}</template> -->
          <!-- 生产日期 -->
          <template #pro_date="{ row, $index }">
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
                @change="updateGroupData($index, 'pro_date', $event)"
              />
            </el-form-item>
          </template>
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
                @change="updateGroupData($index, 'check_time', $event)"
              />
            </el-form-item>
          </template>
          <!-- 批次 -->
          <!-- <template #batch_no="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.batch_no`"
              :rules="checkFormRules.batch_no"
            >
              <el-input
                v-model="row.batch_no"
                maxlength="8"
                placeholder="请输入批次"
                :formatter="formatter"
                disabled
              ></el-input>
            </el-form-item>
          </template> -->
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
                @input="updateGroupData($index, 'batch_number', $event)"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 宽度 -->
          <template #weight="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.weight_val`"
              :rules="checkFormRules.weight"
              :class="checkCellClass(row.weight_val, 'weight')"
            >
              <el-input v-model="row.weight_val" type="number" placeholder="请输入内容"></el-input>
            </el-form-item>
          </template>
          <!-- 身钩长度 -->
          <template #hook_length="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.hook_length_val`"
              :rules="checkFormRules.hook_length"
              :class="checkCellClass(row.hook_length_val, 'hook_length')"
            >
              <el-input
                v-model="row.hook_length_val"
                type="number"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 盖钩长度 -->
          <template #cover_hook_length="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.cover_hook_length_val`"
              :rules="checkFormRules.cover_hook_length"
              :class="checkCellClass(row.cover_hook_length_val, 'cover_hook_length')"
            >
              <el-input
                v-model="row.cover_hook_length_val"
                type="number"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 迭接长度 -->
          <template #overlapping_length="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.overlapping_length_val`"
              :rules="checkFormRules.overlapping_length"
              :class="checkCellClass(row.overlapping_length_val, 'overlapping_length')"
            >
              <el-input
                v-model="row.overlapping_length_val"
                type="number"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 迭接率 -->
          <template #overlap_rate="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.overlap_rate_val`"
              :rules="checkFormRules.overlap_rate"
              :class="checkCellClass(row.overlap_rate_val, 'overlap_rate')"
            >
              <el-input
                v-model="row.overlap_rate_val"
                type="number"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 厚度 -->
          <template #thickness="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.thickness_val`"
              :rules="checkFormRules.thickness"
              :class="checkCellClass(row.thickness_val, 'thickness')"
            >
              <el-input
                v-model="row.thickness_val"
                type="number"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 盖钩顶隙 -->
          <template #cover_hook_top_gap="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.cover_hook_top_gap_val`"
              :rules="checkFormRules.cover_hook_top_gap"
              :class="checkCellClass(row.cover_hook_top_gap_val, 'cover_hook_top_gap')"
            >
              <el-input
                v-model="row.cover_hook_top_gap_val"
                type="number"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 罐钩顶隙 -->
          <template #can_hook_top_gap="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.can_hook_top_gap_val`"
              :rules="checkFormRules.can_hook_top_gap"
              :class="checkCellClass(row.can_hook_top_gap_val, 'can_hook_top_gap')"
            >
              <el-input
                v-model="row.can_hook_top_gap_val"
                type="number"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 皱纹度 -->
          <template #corrugation="{ row, $index }">
            <div class="flex justify-center items-center">
              <el-form-item
                :prop="`checkTableData.${$index}.corrugation_val`"
                :rules="checkFormRules.corrugation"
                :class="checkCellClass(row.corrugation_val, 'corrugation')"
              >
                <el-input
                  v-model="row.corrugation_val"
                  @input="updateGroupData($index, 'corrugation_val', $event)"
                  type="number"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
              <span class="ml-[5px]">%</span>
            </div>
          </template>
          <!-- 紧密度 -->
          <template #compactness="{ row, $index }">
            <div class="flex justify-center items-center">
              <el-form-item
                :prop="`checkTableData.${$index}.compactness_val`"
                :rules="checkFormRules.compactness"
                :class="checkCellClass(row.compactness_val, 'compactness')"
              >
                <el-input
                  v-model="row.compactness_val"
                  type="number"
                  placeholder="请输入内容"
                  @input="updateGroupData($index, 'compactness_val', $event)"
                ></el-input>
              </el-form-item>
              <span class="ml-[5px]">%</span>
            </div>
          </template>

          <!-- 检验结果 -->
          <template #check_res="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.check_res`"
              :rules="checkFormRules.check_res"
            >
              <el-select
                v-model="row.check_res"
                placeholder="请选择"
                filterable
                @change="updateGroupData($index, 'check_res', $event)"
              >
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
    <ExcelUpload v-model:visible="uploadShow" @upload="getExcelData"></ExcelUpload>
  </div>
</template>
<style lang="scss" scoped>
:deep(.pure-table-box .el-form-item--default) {
  margin-top: 18px;
}
</style>
