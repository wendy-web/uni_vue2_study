<script setup lang="tsx">
import type { FormInstance, FormRules } from "element-plus";
import { isArray } from "@pureadmin/utils";
import { useAdd } from "../utils/add";

const props = defineProps([
  "checkTablecolumns",
  "checkFormRules",
  "checkTableForm",
  "formData",
  "checkTableData",
  "formLoading",
  "cellColumns",
  "supplyOptions",
  "suppliersMap",
  "editDisabled",
  "is_submit",
  "tableLableOptions",
]);
const emit = defineEmits(["handleAdd", "handleDelRow", "changeCheckRes"]);
defineOptions({
  name: "MaterialInspectionCansSeamCheckInfo",
});
/** puretable的ref */
const prueTableRef = ref();
const { tableFormRef, validatorCell } = useAdd();
// 从cellColumns中查询是否有启破力
const hasOpen = ref(false);
const submitValue = computed(() => {
  return props.is_submit;
});

/** 检测判断表格每一行的检验结果 */
function checkRowResult(row: any): number {
  if (props.checkTableData.length === 0) return -1;

  let keyList = ["electric"]; //默认电流key

  if (hasOpen.value) {
    keyList.push("open");
  }
  let checkJsonList = row.check_json;
  let contentList: string[] = [];

  if (isArray(checkJsonList)) {
    checkJsonList.forEach((item) => {
      for (const key in item) {
        if (keyList.includes(key)) {
          contentList.push(item[key]);
        }
      }
    });
  }

  // 判断是否有是空字符串的元素, 如果有代表有未检测项目
  let isHaveUndefined = contentList.some((item) => !item);
  if (isHaveUndefined) {
    row.check_ret = -1;
    return -1;
  } else {
    // 创建一个对象来存储每个字段的所有值
    let groupedValues: any = {};
    // 遍历每一个对象
    checkJsonList.forEach((item: any) => {
      // 遍历对象的每一个键值对
      for (const key in item) {
        if (keyList.includes(key)) {
          const value = item[key];
          // 如果groupedValues中还没有这个键，则创建一个新的数组
          if (!groupedValues[key as keyof typeof keyList]) {
            groupedValues[key as keyof typeof keyList] = [];
          }
          // 将值添加到对应的数组中
          groupedValues[key as keyof typeof keyList].push(value);
        }
      }
    });

    let groupedValuesRes: boolean[] = [];

    for (const key in groupedValues) {
      let checkKeyRes = checkKeyValue(key, groupedValues[key]);
      groupedValuesRes.push(...checkKeyRes);
    }

    row.check_ret = groupedValuesRes.includes(false) ? 0 : 1;
    return groupedValuesRes.includes(false) ? 0 : 1;
  }
}

function checkKeyValue(key: string, content: string[]) {
  let standardConfig = props.tableLableOptions[key];
  let checkResList = content.map((item) => {
    return validatorCell(standardConfig, item);
  });
  return checkResList;
}

watch(
  () => props.checkTableData,
  (newVal) => {
    // 默认为3 检验中z
    if (props.checkTableData.length === 0) {
      emit("changeCheckRes", 3);
      return;
    }

    let rowCheckRet = props.checkTableData.map((item: any) => item.check_ret);

    let isUndetected = rowCheckRet.some((item: any) => item === -1);
    if (isUndetected) {
      // 如果包含-1,表示有未检测的,直接赋值3 检验中
      emit("changeCheckRes", 3);
      return;
    }

    let someRes = props.checkTableData.some((item: any) => item.check_ret === 1);
    if (someRes) {
      // 如果存在,表示肯定有至少一项是合格的,设置为 部分合格,
      emit("changeCheckRes", 2);
      let everyRes = props.checkTableData.every((item: any) => item.check_ret === 1);
      if (everyRes) {
        // 如果 全部是合格,设置为合格
        emit("changeCheckRes", 1);
      }
    } else {
      // 如果不存在,表示没有合格的,设置为 不合格
      emit("changeCheckRes", 0);
    }
  },
  { deep: true },
);

const handleAdd = async () => {
  // 表格有数据的时候验证包号
  // if (props.checkTableData.length) {
  //   let data = props.checkTableData;
  //   for (let i = 0; i < data.length; i++) {
  //     let checkPackNo = await tableFormRef.value?.validateField(`checkTableData.${i}.pack_no`);
  //     console.log("checkPackNo::", checkPackNo);
  //   }
  // }
  // tableFormRef.value?.resetFields();
  console.log("hasOpen:", hasOpen);
  emit("handleAdd");
};
// 多选的行
const multipleSelection = ref([]);
// 表格多选
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val;
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
const changePrint = (row: any, index: number) => {
  console.log("changePrint:", row, index);
  props.checkTableData[index].print_factor = props.suppliersMap[row.print_factor_id];
};
// 检查单元格是否符合标准值 自定义class 异常标红显示
function checkCellClass(value: any, key: string) {
  let className = "";
  if (!props.tableLableOptions) return className;
  let ok = validatorCell(props.tableLableOptions[key], value);
  className = ok ? "" : "warn-text";
  return className;
}
watch(
  () => props.cellColumns,
  (newValue) => {
    let findOpen = props.cellColumns.findIndex((item: any) => {
      return item.prop === "open";
    });
    hasOpen.value = findOpen !== -1 ? true : false;
  },
);
onMounted(() => {});
// 将方法暴露给父组件
defineExpose({
  validateForm,
  tableFormRef,
});

const tableRules = reactive({
  check_time: [
    {
      required: submitValue,
      message: "请选择检验时间",
    },
  ],
  pack_no: [
    {
      required: submitValue,
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          // 判断列表里的包号是否重复
          let data = props.checkTableData;
          let total = 0;
          data.forEach((item: any) => {
            item.check_json.forEach((itm: any) => {
              if (itm.pack_no === value) {
                total += 1;
              }
            });
          });
          if (total >= 2) {
            callback(new Error("包号重复"));
          }
          callback();
        } else {
          if (submitValue.value) {
            callback(new Error("请输入包号"));
          } else {
            callback();
          }
        }
      },
    },
  ],
  electric: [
    {
      required: submitValue,
      message: "请输入电流",
    },
  ],
  open: [
    {
      required: submitValue,
      message: "请输入启破力",
    },
  ],

  print_factor_id: [
    {
      required: submitValue,
      message: "请选择彩印铁厂家",
    },
  ],
});
</script>
<template>
  <div class="app-container !p-0">
    <div class="flex justify-between mb-[10px]">
      <div v-if="!editDisabled">
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button type="primary" @click="handleDelete">删除</el-button>
        <!-- <el-button type="primary" @click="">导入</el-button>
        <el-button type="primary" @click="">导出模板</el-button>
        <el-button type="primary" @click="">批量填充</el-button> -->
      </div>
      <div class="flex flex-1 justify-end">
        <div class="mr-[10px]">
          总样品数:
          <span class="text-green-800">{{ formData.total }}</span>
        </div>
        <div>
          总异常数:
          <span class="text-red-800">{{ formData.abnormal }}</span>
        </div>
      </div>
    </div>
    <div>
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
          max-height="700"
        >
          <!-- 检验日期 -->
          <template #check_time="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}['check_time']`"
              :rules="checkFormRules.check_time"
            >
              <el-time-select
                v-model="row.check_time"
                start="00:00"
                step="00:01"
                end="23:59"
                :min-time="row.check_time"
                placeholder="请选择检验日期"
              />
            </el-form-item>
          </template>
          <!-- 单元号 -->
          <template #cell_column="{ row, $index }">
            <div v-for="(item, index) in cellColumns" :key="index">
              <el-form-item v-if="item.prop === 'open' && hasOpen">
                {{ item.label }}
                ({{ item.initval }})
                {{ item.unit }}
              </el-form-item>
              <el-form-item v-else>
                {{ item.label }}
                <template v-if="item.initval">({{ item.initval }})</template>
                <template v-if="item.unit">
                  {{ item.unit }}
                </template>
              </el-form-item>
            </div>
          </template>
          <!-- 1号检验 -->
          <template #value_1="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.check_json[0]['pack_no']`"
              :rules="checkFormRules.pack_no"
            >
              <el-input
                v-model="row.check_json[0]['pack_no']"
                placeholder="请输入内容"
                v-inputnum.intp
              ></el-input>
            </el-form-item>
            <el-form-item
              :prop="`checkTableData.${$index}.check_json[0]['electric']`"
              :rules="checkFormRules.electric"
              :class="checkCellClass(row.check_json[0]['electric'], 'electric')"
            >
              <el-input
                v-model="row.check_json[0]['electric']"
                v-inputnum.num_point="4"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-if="hasOpen"
              :prop="`checkTableData.${$index}.check_json[0]['open']`"
              :rules="checkFormRules.open"
              :class="checkCellClass(row.check_json[0]['open'], 'open')"
            >
              <el-input
                v-model="row.check_json[0]['open']"
                v-inputnum.num_point="4"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 2号检验 -->
          <template #value_2="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.check_json[1]['pack_no']`"
              :rules="checkFormRules.pack_no"
            >
              <el-input
                v-model="row.check_json[1]['pack_no']"
                v-inputnum.intp
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item
              :prop="`checkTableData.${$index}.check_json[1]['electric']`"
              :rules="checkFormRules.electric"
              :class="checkCellClass(row.check_json[1]['electric'], 'electric')"
            >
              <el-input
                v-model="row.check_json[1]['electric']"
                v-inputnum.num_point="4"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-if="hasOpen"
              :prop="`checkTableData.${$index}.check_json[1]['open']`"
              :rules="checkFormRules.open"
              :class="checkCellClass(row.check_json[1]['open'], 'open')"
            >
              <el-input
                v-model="row.check_json[1]['open']"
                v-inputnum.num_point="4"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 3号检验 -->
          <template #value_3="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.check_json[2]['pack_no']`"
              :rules="checkFormRules.pack_no"
            >
              <el-input
                v-model="row.check_json[2]['pack_no']"
                v-inputnum.intp
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item
              :prop="`checkTableData.${$index}.check_json[2]['electric']`"
              :rules="checkFormRules.electric"
              :class="checkCellClass(row.check_json[2]['electric'], 'electric')"
            >
              <el-input
                v-model="row.check_json[2]['electric']"
                v-inputnum.num_point="4"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-if="hasOpen"
              :prop="`checkTableData.${$index}.check_json[2]['open']`"
              :rules="checkFormRules.open"
              :class="checkCellClass(row.check_json[2]['open'], 'open')"
            >
              <el-input
                v-model="row.check_json[2]['open']"
                v-inputnum.num_point="4"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 4号检验 -->
          <template #value_4="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.check_json[3]['pack_no']`"
              :rules="checkFormRules.pack_no"
            >
              <el-input
                v-model="row.check_json[3]['pack_no']"
                v-inputnum.intp
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item
              :prop="`checkTableData.${$index}.check_json[3]['electric']`"
              :rules="checkFormRules.electric"
              :class="checkCellClass(row.check_json[3]['electric'], 'electric')"
            >
              <el-input
                v-model="row.check_json[3]['electric']"
                v-inputnum.num_point="4"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-if="hasOpen"
              :prop="`checkTableData.${$index}.check_json[3]['open']`"
              :rules="checkFormRules.open"
              :class="checkCellClass(row.check_json[3]['open'], 'open')"
            >
              <el-input
                v-model="row.check_json[3]['open']"
                v-inputnum.num_point="4"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 5号检验 -->
          <template #value_5="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.check_json[4]['pack_no']`"
              :rules="checkFormRules.pack_no"
            >
              <el-input
                v-model="row.check_json[4]['pack_no']"
                v-inputnum.intp
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item
              :prop="`checkTableData.${$index}.check_json[4]['electric']`"
              :rules="checkFormRules.electric"
              :class="checkCellClass(row.check_json[4]['electric'], 'electric')"
            >
              <el-input
                v-model="row.check_json[4]['electric']"
                v-inputnum.num_point="4"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-if="hasOpen"
              :prop="`checkTableData.${$index}.check_json[4]['open']`"
              :rules="checkFormRules.open"
              :class="checkCellClass(row.check_json[4]['open'], 'open')"
            >
              <el-input
                v-model="row.check_json[4]['open']"
                v-inputnum.num_point="4"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 6号检验 -->
          <template #value_6="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.check_json[5]['pack_no']`"
              :rules="checkFormRules.pack_no"
            >
              <el-input
                v-model="row.check_json[5]['pack_no']"
                v-inputnum.intp
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item
              :prop="`checkTableData.${$index}.check_json[5]['electric']`"
              :rules="checkFormRules.electric"
              :class="checkCellClass(row.check_json[5]['electric'], 'electric')"
            >
              <el-input
                v-model="row.check_json[5]['electric']"
                v-inputnum.num_point="4"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-if="hasOpen"
              :prop="`checkTableData.${$index}.check_json[5]['open']`"
              :rules="checkFormRules.open"
              :class="checkCellClass(row.check_json[5]['open'], 'open')"
            >
              <el-input
                v-model="row.check_json[5]['open']"
                v-inputnum.num_point="4"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 7号检验 -->
          <template #value_7="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.check_json[6]['pack_no']`"
              :rules="checkFormRules.pack_no"
            >
              <el-input
                v-model="row.check_json[6]['pack_no']"
                v-inputnum.intp
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item
              :prop="`checkTableData.${$index}.check_json[6]['electric']`"
              :rules="checkFormRules.electric"
              :class="checkCellClass(row.check_json[6]['electric'], 'electric')"
            >
              <el-input
                v-model="row.check_json[6]['electric']"
                v-inputnum.num_point="4"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-if="hasOpen"
              :prop="`checkTableData.${$index}.check_json[6]['open']`"
              :rules="checkFormRules.open"
              :class="checkCellClass(row.check_json[6]['open'], 'open')"
            >
              <el-input
                v-model="row.check_json[6]['open']"
                v-inputnum.num_point="4"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 8号检验 -->
          <template #value_8="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.check_json[7]['pack_no']`"
              :rules="checkFormRules.pack_no"
            >
              <el-input
                v-model="row.check_json[7]['pack_no']"
                v-inputnum.intp
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item
              :prop="`checkTableData.${$index}.check_json[7]['electric']`"
              :rules="checkFormRules.electric"
              :class="checkCellClass(row.check_json[7]['electric'], 'electric')"
            >
              <el-input
                v-model="row.check_json[7]['electric']"
                v-inputnum.num_point="4"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-if="hasOpen"
              :prop="`checkTableData.${$index}.check_json[7]['open']`"
              :rules="checkFormRules.open"
              :class="checkCellClass(row.check_json[7]['open'], 'open')"
            >
              <el-input
                v-model="row.check_json[7]['open']"
                v-inputnum.num_point="4"
                placeholder="请输入内容"
              ></el-input>
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
          <!-- 检验结果 -->
          <template #check_ret="{ row, $index }">
            <span v-if="checkRowResult(row) == 1">合格</span>
            <span v-else-if="checkRowResult(row) == 0" class="text-orange-500">不合格</span>
            <span v-else>--</span>
          </template>
        </PureTable>
      </el-form>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
