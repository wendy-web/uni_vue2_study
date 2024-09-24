<script setup lang="tsx">
import type { FormInstance, FormRules } from "element-plus";
import { isArray } from "@pureadmin/utils";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useAdd } from "../utils/add";
import SizeCheck from "./sizeCheck.vue";

const props = defineProps([
  "checkTablecolumns",
  "checkFormRules",
  "checkTableForm",
  "formData",
  "checkTableData",
  "formLoading",
  "supplyOptions",
  "suppliersMap",
  "tableLableOptions",
  "editDisabled",
]);
const emit = defineEmits(["handleAdd", "handleDelRow", "changeCheckRes"]);
defineOptions({
  name: "MaterialInspectionCansSeamCheckInfo",
});
const brandMap: any = {
  ND1: "红牛",
  ND2: "战马",
};
/** puretable的ref */
const prueTableRef = ref();
const { tableFormRef, passList, validatorCell } = useAdd();

/** 检测判断表格每一行的检验结果 */
function checkRowResult(row: any): number {
  if (props.checkTableData.length === 0) return -1;

  let contentList: string[] = [];
  contentList = [
    ...row.electric, //缺陷电流
    ...row.dry_film, //干膜重量
    ...row.open, //启破力
    ...row.allopen, //全开力
    row.emergence, //羽化检测
    row.exterior, //外观检测
  ];

  let checkSizeObj = row.size;
  for (const key in checkSizeObj) {
    checkSizeObj[key].forEach((item: { x: string }) => {
      let value = item["x"];
      contentList.push(value);
    });
  }

  // console.log("contentList", contentList);

  // 判断是否有是空字符串的元素, 如果有代表有未检测项目 typeof item !== "number" 过滤不合格为0的
  let isHaveUndefined = contentList.some((item) => typeof item !== "number" && !item);
  if (isHaveUndefined) {
    row.check_ret = -1;
    return -1;
  } else {
    // 羽化检测的结果
    let emergenceRes = row.emergence == 1;
    //外观检测的结果
    let exteriorRes = row.exterior == 1;
    // 缺陷电流的结果
    let electricResList = row.electric.map((item: string) =>
      validatorCell(props.tableLableOptions["electric"], item),
    );

    // 干膜重量的结果
    let dry_film_list = row.dry_film.map((item: string) =>
      validatorCell(props.tableLableOptions["dry_film"], item),
    );
    // 启破力的结果
    let openResList = row.open.map((item: string) =>
      validatorCell(props.tableLableOptions["open"], item),
    );
    // 全开力的结果
    let allopenResList = row.allopen.map((item: string) =>
      validatorCell(props.tableLableOptions["allopen"], item),
    );

    // 创建一个对象来存储每个字段的所有值
    let groupedValues: any = {};

    // 遍历对象的每一个键值对
    for (const key in checkSizeObj) {
      const value = checkSizeObj[key];
      // 如果groupedValues中还没有这个键，则创建一个新的数组
      if (!groupedValues[key]) {
        groupedValues[key] = [];
      }
      // 将值添加到对应的数组中
      groupedValues[key] = value;
    }

    // console.log("groupedValues", groupedValues);

    let groupedValuesRes: boolean[] = [];

    for (const key in groupedValues) {
      let checkKeyRes = checkKeyValue(key, groupedValues[key]);
      groupedValuesRes.push(...checkKeyRes);
    }

    // console.log("groupedValuesRes", groupedValuesRes);

    let resList = [
      emergenceRes,
      exteriorRes,
      ...electricResList,
      ...dry_film_list,
      ...openResList,
      ...allopenResList,
      ...groupedValuesRes,
    ];
    // console.log("🚀 ~ checkRowResult ~ resList:", resList);

    row.check_ret = resList.includes(false) ? 0 : 1;
    return resList.includes(false) ? 0 : 1;
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
    // 默认为3 检验中
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
  // console.log("tableFormRef.value::", tableFormRef.value);
  if (!tableFormRef.value) return false;
  const vaildateRes = await tableFormRef.value
    .validate((valid, fields) => {
      for (const keys in fields) {
        console.log(fields);
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

// 表格数据长度
const tableLen = computed(() => {
  return props.checkTableData.length;
});
const currentIndex = ref(-1);
// 实测值弹窗组件ref
const SizeCheckRef = ref();
// 尺寸检测数据
const sizeData = ref();
// 尺寸检测标准值
const standardSize = computed(() => {
  return props.tableLableOptions?.size;
});
// 点击实测值弹窗
const openSizeCheck = (row: any, index: number) => {
  sizeData.value = row.size;
  currentIndex.value = index;

  const descriptionsData = {
    batch_no: row.batch_no,
  };
  let brand_name = brandMap[props.formData.brand] || "";
  addDialog({
    width: "60%",
    btnClass: "w-[80px]",
    draggable: true,
    closeOnClickModal: false,
    btnLoading: false,
    title: `${brand_name}尺寸实测值录入`,
    // title: "尺寸实测值录入",
    contentRenderer: () =>
      h(SizeCheck, {
        ref: SizeCheckRef,
        descriptionsData,
        SizeMap: sizeData,
        tableLen: tableLen.value,
        tableIndex: currentIndex.value,
        standardValue: standardSize.value,
        editDisabled: props.editDisabled,
        standardSize: standardSize.value,
        onTriggerNext: () => {
          /* 点击下一个触发事件 */
          // 记录当前索引的row数据
          let currentRow = props.checkTableData[currentIndex.value];
          setTableSize(currentRow);
          // 记录完成之后currentIndex+1
          currentIndex.value = currentIndex.value + 1;
          let nextRow = props.checkTableData[currentIndex.value];
          sizeData.value = nextRow?.size;
          console.log("🚀 next sizeData.value:", sizeData.value);
        },
        onTriggerPrev: () => {
          /* 点击上一个触发事件 */
          // 记录当前索引的row数据
          let currentRow = props.checkTableData[currentIndex.value];
          setTableSize(currentRow);
          currentIndex.value = currentIndex.value - 1;
          let prevRow = props.checkTableData[currentIndex.value];
          sizeData.value = prevRow?.size;
        },
      }),
    beforeCancel: (done, { options, index }) => {
      done();
    },
    beforeSure: async (done, { options, index }) => {
      let currentRow = props.checkTableData[currentIndex.value];
      setTableSize(currentRow);
      console.log("props.checkTableData:", props.checkTableData);
      done();
    },
  });
};
/** 将弹窗的表格数据保存到列表中 */
function setTableSize(row: any) {
  // SizeCheckRef.value.sizeData
  console.log("setTableSize::", SizeCheckRef.value.sizeData);
}
// 实测值统计
function countSize({ size: data }: any) {
  let totalFilledValues = 0;
  if (!data) return totalFilledValues;
  for (let key in data) {
    for (let group of data[key]) {
      if (group["1"] && group["2"] && group["3"]) {
        totalFilledValues++;
      }
    }
  }
  return totalFilledValues;
}
// 实测值检验是否异常
function countInvalidValues({ size: data }: any) {
  let invalidCount = 0;
  const rules = standardSize.value.child;
  for (const [key, valueArray] of Object.entries(data)) {
    const rule = rules[key];
    (valueArray as any[]).forEach((row: any) => {
      Object.values(row).forEach((cell: any) => {
        if (cell !== "" && !validatorCell(rule, cell)) {
          invalidCount++;
        }
      });
    });
  }

  return invalidCount;
}
// 检查单元格是否符合标准值 自定义class 异常标红显示
function checkCellClass(value: any, key: string) {
  let className = "";
  if (!props.tableLableOptions) return className;
  let ok = validatorCell(props.tableLableOptions[key], value);
  className = ok ? "" : "warn-text";
  return className;
}
onMounted(() => {});
// 将方法暴露给父组件
defineExpose({
  validateForm,
  tableFormRef,
});
</script>
<template>
  <div class="app-container !p-0">
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
          max-height="800"
        >
          <!-- 生产日期 -->
          <template #make_date="{ row, $index }">
            <el-form-item :prop="`checkTableData.${$index}.make_date`">
              <el-date-picker v-model="row.make_date" type="date" placeholder="请选择生产日期" />
            </el-form-item>
          </template>
          <!-- 生产包号 -->
          <template #pack_no="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.pack_no`"
              :rules="checkFormRules.pack_no"
            >
              <el-input
                v-model.number="row.pack_no"
                placeholder="请输入内容"
                v-inputnum.intp
              ></el-input>
            </el-form-item>
          </template>
          <!-- 羽化检测 -->
          <template #emergence="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.emergence`"
              :rules="checkFormRules.emergence"
            >
              <el-select v-model="row.emergence" placeholder="请选择" filterable>
                <el-option
                  v-for="item in passList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
          <!-- 外观检测 -->
          <template #exterior="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.exterior`"
              :rules="checkFormRules.exterior"
            >
              <el-select v-model="row.exterior" placeholder="请选择" filterable>
                <el-option
                  v-for="item in passList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
          <!-- 尺寸检测 -->
          <template #size="{ row, $index }">
            <div
              class="flex flex-col cursor-pointer"
              :class="countInvalidValues(row) === 0 ? 'text-blue-500' : 'text-red-500'"
              @click="openSizeCheck(row, $index)"
            >
              <div>实测值</div>
              <!-- 战马 -->
              <div v-if="formData.brand === 'ND2'">({{ countSize(row) }}/16)</div>
              <!-- 红牛 -->
              <div v-if="formData.brand === 'ND1'">({{ countSize(row) }}/9)</div>
            </div>
          </template>

          <!-- 缺陷电流 -->
          <template #electric="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.electric[0]`"
              :rules="checkFormRules.electric"
              :class="checkCellClass(row.electric[0], 'electric')"
            >
              <el-input
                v-model="row.electric[0]"
                v-inputnum.num_point="4"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item
              :prop="`checkTableData.${$index}.electric[1]`"
              :rules="checkFormRules.electric"
              :class="checkCellClass(row.electric[1], 'electric')"
            >
              <el-input
                v-model="row.electric[1]"
                v-inputnum.num_point="4"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item
              :prop="`checkTableData.${$index}.electric[2]`"
              :rules="checkFormRules.electric"
              :class="checkCellClass(row.electric[2], 'electric')"
            >
              <el-input
                v-model="row.electric[2]"
                v-inputnum.num_point="4"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 干膜重量 -->
          <template #dry_film="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.dry_film[0]`"
              :rules="checkFormRules.dry_film"
              :class="checkCellClass(row.dry_film[0], 'dry_film')"
            >
              <el-input
                v-model="row.dry_film[0]"
                v-inputnum.num_point="4"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item
              :prop="`checkTableData.${$index}.dry_film[1]`"
              :rules="checkFormRules.dry_film"
              :class="checkCellClass(row.dry_film[1], 'dry_film')"
            >
              <el-input
                v-model="row.dry_film[1]"
                v-inputnum.num_point="4"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item
              :prop="`checkTableData.${$index}.dry_film[2]`"
              :rules="checkFormRules.dry_film"
              :class="checkCellClass(row.dry_film[2], 'dry_film')"
            >
              <el-input
                v-model="row.dry_film[2]"
                v-inputnum.num_point="4"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 启破力 -->
          <template #open="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.open[0]`"
              :rules="checkFormRules.open"
              :class="checkCellClass(row.open[0], 'open')"
            >
              <el-input
                v-model="row.open[0]"
                v-inputnum.num_point="4"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>

            <el-form-item
              :prop="`checkTableData.${$index}.open[1]`"
              :rules="checkFormRules.open"
              :class="checkCellClass(row.open[1], 'open')"
            >
              <el-input
                v-model="row.open[1]"
                v-inputnum.num_point="4"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item
              :prop="`checkTableData.${$index}.open[2]`"
              :rules="checkFormRules.open"
              :class="checkCellClass(row.open[2], 'open')"
            >
              <el-input
                v-model="row.open[2]"
                v-inputnum.num_point="4"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 全开力 -->
          <template #allopen="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.allopen[0]`"
              :rules="checkFormRules.allopen"
              :class="checkCellClass(row.allopen[0], 'allopen')"
            >
              <el-input
                v-model="row.allopen[0]"
                v-inputnum.num_point="4"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item
              :prop="`checkTableData.${$index}.allopen[1]`"
              :rules="checkFormRules.allopen"
              :class="checkCellClass(row.allopen[1], 'allopen')"
            >
              <el-input
                v-model="row.allopen[1]"
                v-inputnum.num_point="4"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item
              :prop="`checkTableData.${$index}.allopen[2]`"
              :rules="checkFormRules.allopen"
              :class="checkCellClass(row.allopen[2], 'allopen')"
            >
              <el-input
                v-model="row.allopen[2]"
                v-inputnum.num_point="4"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 检验结果 -->
          <!-- <template #check_ret="{ row, $index }">
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
          </template> -->
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
<style lang="scss" scoped>
:deep(.table-input-center .el-input__wrapper .el-input__inner) {
  text-align: center;
}

:deep(.table-input-danger .el-input__inner) {
  // .table-input-danger .el-input__inner{
  color: red;
  font-weight: bold;
}
</style>
