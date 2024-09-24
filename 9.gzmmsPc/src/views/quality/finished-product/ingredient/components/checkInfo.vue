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

const { tableFormRef, validatorCell, passList, isWithinRange } = useAdd();
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
  // abs 和 nm 有特殊的校验: 根据表格数据第一条 (如果有值的话),abs 浮动0.015,nm 必须相等
  if (["abs", "nm"].includes(key)) {
    let firstItem = props.checkTableData[0];
    if (firstItem) {
      let { abs_val, nm_val } = firstItem;
      if (key === "abs") {
        className = isWithinRange(abs_val, value) ? "" : "warn-text";
        return className;
      }
      if (key === "nm") {
        className = Number(value) === Number(nm_val) ? "" : "warn-text";
        return className;
      }
    }
    return className;
  }
  let ok = validatorCell(props.tableLableOptions[key], value);
  className = ok ? "" : "warn-text";
  return className;
}
const tableRef = computed<TableInstance>(() => {
  return prueTableRef.value?.getTableRef();
});

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
          height="800"
        >
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
              />
            </el-form-item>
          </template>
          <!-- 批次：第一行才可以编辑，其他行取formData批次 -->
          <template #batch_no="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.batch_no`"
              :rules="checkFormRules.batch_no"
            >
              <el-input
                v-model="row.batch_no"
                maxlength="8"
                placeholder="请输入批次"
                :formatter="formatter"
                :disabled="$index > 0"
              ></el-input>
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
          <!-- 可溶性固形物 -->
          <template #soluble_solid="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.soluble_solid_val`"
              :rules="checkFormRules.soluble_solid"
              :class="checkCellClass(row.soluble_solid_val, 'soluble_solid')"
            >
              <el-input
                v-model="row.soluble_solid_val"
                type="number"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </template>
          <!-- pH -->
          <template #ph="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.ph_val`"
              :rules="checkFormRules.ph"
              :class="checkCellClass(row.ph_val, 'ph')"
            >
              <el-input v-model="row.ph_val" type="number" placeholder="请输入内容"></el-input>
            </el-form-item>
          </template>
          <!-- 牛磺酸 -->
          <template #taurine="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.taurine_val`"
              :rules="checkFormRules.taurine"
              :class="checkCellClass(row.taurine_val, 'taurine')"
            >
              <el-input v-model="row.taurine_val" type="number" placeholder="请输入内容"></el-input>
            </el-form-item>
          </template>
          <!-- 咖啡因 -->
          <template #caffeine="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.caffeine_val`"
              :rules="checkFormRules.caffeine"
              :class="checkCellClass(row.caffeine_val, 'caffeine')"
            >
              <el-input
                v-model="row.caffeine_val"
                type="number"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </template>
          <!-- ABS -->
          <template #abs="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.abs_val`"
              :rules="checkFormRules.abs"
              :class="checkCellClass(row.abs_val, 'abs')"
            >
              <el-input v-model="row.abs_val" type="number" placeholder="请输入内容"></el-input>
            </el-form-item>
          </template>
          <!-- nm -->
          <template #nm="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.nm_val`"
              :rules="checkFormRules.nm"
              :class="checkCellClass(row.nm_val, 'nm')"
            >
              <el-input v-model="row.nm_val" type="number" placeholder="请输入内容"></el-input>
            </el-form-item>
          </template>

          <!-- 检验结果 -->
          <template #check_res="{ row, $index }">
            <el-form-item :prop="`checkTableData.${$index}.check_res`" :rules="checkFormRules.check_res">
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
          <!-- 备注 -->
          <template #note="{ row, $index }">
            <el-form-item :prop="`checkTableData.${$index}.note`">
              <el-input v-model="row.note" type="textarea" placeholder=""></el-input>
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
