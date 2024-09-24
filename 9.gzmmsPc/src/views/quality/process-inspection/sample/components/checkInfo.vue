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
  "checkUserOptions",
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
  console.log("tableFormRef.value::", tableFormRef.value.validate);
  if (tableFormRef.value) {
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
    if (!vaildateRes) return;
    emit("handleAdd");
    return;
  }
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
  let { color, scent, look, impurity, Brix, pH, delta } = item;
  // if (props.tableLableOptions) {
  //   let brix_ok = validatorCell(props.tableLableOptions["Brix"], Brix);
  //   let ph_ok = validatorCell(props.tableLableOptions["pH"], pH);
  //   let delta_ok = validatorCell(props.tableLableOptions["delta"], delta);
  //   console.log("color:", color, "scent:", scent, "look:", look, "impurity:", impurity);
  //   console.log("brix_ok:", brix_ok, "ph_ok:", ph_ok, "delta_ok:", delta_ok);
  //   if (color && scent && look && impurity && brix_ok && ph_ok && delta_ok) {
  //     item.check_ret = 1;
  //   } else {
  //     item.check_ret = 0;
  //   }
  // }
}
// 检查单元格是否符合标准值 自定义class
function checkCellClass(value: any, key: string) {
  let className = "";
  if (!props.tableLableOptions || !value) return className;
  let ok = validatorCell(props.tableLableOptions[key], value);
  className = ok ? "" : "warn-text";
  return className;
}
const hasSameBatch = ref(false);
// 检查批号是否重复 自定义class
function checkBatchClass(value: any) {
  let className = "";
  if (!props.checkTableData || !value) return className;
  let data = props.checkTableData;
  let count = data.filter((item: any) => item.batch_num === value);
  let repeat = count.length >= 2 ? true : false;
  hasSameBatch.value = repeat;
  className = repeat ? "warn-text" : "";
  return className;
}
async function checkSameBatch() {
  return hasSameBatch.value;
}
const tableRef = computed<TableInstance>(() => {
  return prueTableRef.value?.getTableRef();
});

// 将方法暴露给父组件
defineExpose({
  validateForm,
  tableFormRef,
  checkSameBatch,
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
        <div>
          不合格数:
          <span class="text-red-800">{{ formData.abnormal }}</span>
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
          <!-- 批号：唯一值（不可重复）==>重复提示，可提交 -->
          <template #batch_num="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.batch_num`"
              :rules="checkFormRules.batch_num"
              :class="checkBatchClass(row.batch_num)"
            >
              <el-input v-model="row.batch_num" maxlength="5" placeholder="请输入批号"></el-input>
            </el-form-item>
          </template>
          <!-- Brix标准值 -->
          <template #Brix="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.Brix`"
              :rules="checkFormRules.Brix"
              :class="checkCellClass(row.Brix, 'Brix')"
            >
              <el-input
                v-model="row.Brix"
                type="number"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>
          <!-- pH -->
          <template #pH="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.pH`"
              :rules="checkFormRules.pH"
              :class="checkCellClass(row.pH, 'pH')"
            >
              <el-input
                v-model="row.pH"
                type="number"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 液位 -->
          <template #net="{ row, $index }">
            <el-form-item :prop="`checkTableData.${$index}.net`" :rules="checkFormRules.net">
              <el-input v-model="row.net" type="number" placeholder="请输入内容"></el-input>
            </el-form-item>
          </template>
          <!-- 内压 -->
          <template #pressure="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.pressure`"
              :rules="checkFormRules.pressure"
              :class="checkCellClass(row.pressure, 'pressure')"
            >
              <el-input
                v-model="row.pressure"
                type="number"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 温度 -->
          <template #temperature="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.temperature`"
              :rules="checkFormRules.temperature"
            >
              <el-input v-model="row.temperature" type="number" placeholder="请输入内容"></el-input>
            </el-form-item>
          </template>
          <!-- 色泽 -->
          <template #color="{ row, $index }">
            <el-form-item :prop="`checkTableData.${$index}.color`" :rules="checkFormRules.color">
              <el-select v-model="row.color" placeholder="请选择" filterable>
                <el-option
                  v-for="item in passList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
          <!-- 气味 -->
          <template #scent="{ row, $index }">
            <el-form-item :prop="`checkTableData.${$index}.scent`" :rules="checkFormRules.scent">
              <el-select v-model="row.scent" placeholder="请选择" filterable>
                <el-option
                  v-for="item in passList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
          <!-- 组织状态 -->
          <template #group_status="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.group_status`"
              :rules="checkFormRules.group_status"
            >
              <el-select v-model="row.group_status" placeholder="请选择" filterable>
                <el-option
                  v-for="item in passList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
          <!-- 杂质 -->
          <template #impurity="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.impurity`"
              :rules="checkFormRules.impurity"
            >
              <el-select v-model="row.impurity" placeholder="请选择" filterable>
                <el-option
                  v-for="item in passList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
          <!-- 味道 -->
          <template #taste="{ row, $index }">
            <el-form-item :prop="`checkTableData.${$index}.taste`" :rules="checkFormRules.taste">
              <el-select v-model="row.taste" placeholder="请选择" filterable>
                <el-option
                  v-for="item in passList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
          <!-- 纯净度 -->
          <template #purity="{ row, $index }">
            <el-form-item :prop="`checkTableData.${$index}.purity`" :rules="checkFormRules.purity">
              <el-select v-model="row.purity" placeholder="请选择" filterable>
                <el-option
                  v-for="item in passList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
          <!-- 迭接长度 -->
          <template #overlap="{ row, $index }">
            <div v-for="(item, index) in row.check_json" :key="index">
              <el-form-item
                :prop="`checkTableData.${$index}.check_json[${index}]['overlap']`"
                :rules="checkFormRules.overlap"
                :class="checkCellClass(item['overlap'], 'overlap')"
              >
                <el-input
                  v-model="item['overlap']"
                  type="number"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </div>
          </template>
          <!-- 迭接率 -->
          <template #overlap_rate="{ row, $index }">
            <div v-for="(item, index) in row.check_json" :key="index">
              <el-form-item
                :prop="`checkTableData.${$index}.check_json[${index}]['overlap_rate']`"
                :rules="checkFormRules.overlap_rate"
                :class="checkCellClass(item['overlap_rate'], 'overlap_rate')"
              >
                <el-input
                  v-model="item['overlap_rate']"
                  type="number"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </div>
          </template>
          <!-- 盖钩顶隙 -->
          <template #end_hook_clearance="{ row, $index }">
            <div v-for="(item, index) in row.check_json" :key="index">
              <el-form-item
                :prop="`checkTableData.${$index}.check_json[${index}]['end_hook_clearance']`"
                :rules="checkFormRules.end_hook_clearance"
                :class="checkCellClass(item['end_hook_clearance'], 'end_hook_clearance')"
              >
                <el-input
                  v-model="item['end_hook_clearance']"
                  type="number"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </div>
          </template>
          <!-- 罐钩顶隙 -->
          <template #body_hook_clearance="{ row, $index }">
            <div v-for="(item, index) in row.check_json" :key="index">
              <el-form-item
                :prop="`checkTableData.${$index}.check_json[${index}]['body_hook_clearance']`"
                :rules="checkFormRules.body_hook_clearance"
                :class="checkCellClass(item['body_hook_clearance'], 'body_hook_clearance')"
              >
                <el-input
                  v-model="item['body_hook_clearance']"
                  type="number"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </div>
          </template>
          <!-- 紧密度 -->
          <template #density="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.density`"
              :rules="checkFormRules.density"
              :class="checkCellClass(row.density, 'density')"
            >
              <el-input
                v-model="row.density"
                type="number"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 皱纹度 -->
          <template #wrinkle="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.wrinkle`"
              :rules="checkFormRules.wrinkle"
              :class="checkCellClass(row.wrinkle, 'wrinkle')"
            >
              <el-input
                v-model="row.wrinkle"
                type="number"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 检验结果 -->
          <template #check_ret="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.check_ret`"
              :rules="checkFormRules.check_ret"
            >
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
      </el-form>
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.pure-table-box .el-form-item--default) {
  margin-top: 18px;
}
</style>
