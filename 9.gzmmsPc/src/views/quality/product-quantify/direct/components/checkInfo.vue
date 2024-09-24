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
    <div class="flex justify-end mb-[10px]">
      <div class="flex">
        <div>
          不合格数:
          <span class="text-red-800">{{ formData.total_abnormal || 0 }}</span>
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
          <!-- 测定值 -->
          <template #test_val="{ row, $index, column }">
            <el-form-item
              :prop="`checkTableData.${$index}.test_val`"
              :rules="checkFormRules.test_val"
            >
              <el-input
                v-if="['铅', '总砷'].includes(row.pro_name)"
                v-model="row.test_val"
                placeholder="请输入内容"
              />
              <el-input
                v-else
                v-model="row.test_val"
                disabled
                type="number"
                placeholder="请输入内容"
              />
            </el-form-item>
          </template>
          <!-- 判定结果 -->
          <template #check_ret="{ row, $index }">
            <el-form-item :prop="`checkTableData.${$index}.check_ret`">
              <el-select v-model="row.check_ret" placeholder="请选择" filterable>
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
        <el-form-item label="检验结论" class="mt-4">
          <el-input
            v-model="formData.note"
            placeholder="请输入检验结论"
            :disabled="editDisabled"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.pure-table-box .el-form-item--default) {
  margin-top: 18px;
}
</style>
