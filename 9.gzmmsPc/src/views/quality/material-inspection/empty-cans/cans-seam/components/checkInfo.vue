<script setup lang="tsx">
import type { FormInstance, FormRules } from "element-plus";
import { isArray } from "@pureadmin/utils";
// 引入excel导入组件
import ExcelUpload from "../../../../components/Upload/ExcelUpload.vue";
import { useAdd } from "../utils/add";

type groupedValuesType = {
  body_high: string[];
  lange_width: string[];
  inner: string[];
  w_standard: string[];
  body_hook_length: string[];
  end_hook_length: string[];
  overlap: string[];
  overlap_rate: string[];
  t_standard: string[];
  end_hook_clearance: string[];
  body_hook_clearance: string[];
};

const props = defineProps([
  "checkTablecolumns",
  "checkFormRules",
  "checkTableForm",
  "formData",
  "checkTableData",
  "formLoading",
  "editDisabled",
  "is_submit",
  "abnormalNum",
  "tableLableOptions",
]);
const emit = defineEmits(["handleAdd", "handleDelRow", "getExcelData", "changeCheckRes"]);
defineOptions({
  name: "MaterialInspectionCansSeamCheckInfo",
});
/** puretable的ref */
const prueTableRef = ref();

const { passList, tableFormRef, validatorCell } = useAdd();

const submitValue = computed(() => {
  return props.is_submit;
});

/** 检测判断表格每一行的检验结果 */
function checkRowResult(row: any): number {
  if (props.checkTableData.length === 0) return -1;

  let checkJsonList = row.check_json;
  let contentList = [
    row.wrinkle_rate, //蓝点尺寸
    row.bule_dots, // 皱纹度
  ];

  if (isArray(checkJsonList)) {
    checkJsonList.forEach((item) => {
      for (const key in item) {
        contentList.push(item[key]);
      }
    });
  }

  // 判断是否有是空字符串的元素, 如果有代表有未检测项目
  let isHaveUndefined = contentList.some((item) => typeof item !== "number" && !item);

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
        if (item.hasOwnProperty(key)) {
          const value = item[key];
          // 如果groupedValues中还没有这个键，则创建一个新的数组
          if (!groupedValues[key as keyof groupedValuesType]) {
            groupedValues[key as keyof groupedValuesType] = [];
          }
          // 将值添加到对应的数组中
          groupedValues[key as keyof groupedValuesType].push(value);
        }
      }
    });

    let groupedValuesRes: boolean[] = [];

    for (const key in groupedValues) {
      let checkKeyRes = checkKeyValue(key, groupedValues[key]);
      groupedValuesRes.push(...checkKeyRes);
    }

    let wrinkle_rate_res = validatorCell(props.tableLableOptions["wrinkle_rate"], row.wrinkle_rate);
    let buledots_res = row.bule_dots == 1 ? true : false;

    groupedValuesRes.push(wrinkle_rate_res, buledots_res);
    // console.log("groupedValuesRes", groupedValuesRes);
    row.check_ret =  groupedValuesRes.includes(false) ? 0 : 1
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
    console.log("🚀 ~ rowCheckRet:", rowCheckRet);
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
  if (props.checkTableData.length) {
    let data = props.checkTableData;
    for (let i = 0; i < data.length; i++) {
      let checkPackNo = await tableFormRef.value?.validateField(`checkTableData.${i}.pack_no`);
      console.log("checkPackNo::", checkPackNo);
    }
  }
  // console.log("tableFormRef.value::", tableFormRef.value);
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
  // tableFormRef.value.validate(async (valid) => {
  //   if (valid) {
  //     console.log("submit!valid:", valid);
  //   } else {
  //     console.log("error submit!");
  //   }
  // });
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
          let count = data.filter((item: any) => item.pack_no === value);
          if (count.length >= 2) {
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
  body_high: [
    {
      required: submitValue,
      message: "请输入罐体高度",
    },
  ],
  inner: [
    {
      required: submitValue,
      message: "请输入罐内径",
    },
  ],
  lange_width: [
    {
      required: submitValue,
      message: "请输入翻边尺寸",
    },
  ],
  w_standard: [
    {
      required: submitValue,
      message: "请输入宽度",
    },
  ],
  body_hook_length: [
    {
      required: submitValue,
      message: "请输入身钩长度",
    },
  ],
  end_hook_length: [
    {
      required: submitValue,
      message: "请输入盖钩长度",
    },
  ],
  overlap: [
    {
      required: submitValue,
      message: "请输入迭接长度",
    },
  ],
  overlap_rate: [
    {
      required: submitValue,
      message: "请输入迭接率",
    },
  ],
  t_standard: [
    {
      required: submitValue,
      message: "请输入厚度",
    },
  ],
  end_hook_clearance: [
    {
      required: submitValue,
      message: "请输入盖钩顶隙",
    },
  ],
  body_hook_clearance: [
    {
      required: submitValue,
      message: "请输入罐钩顶隙",
    },
  ],
  wrinkle_rate: [
    {
      required: submitValue,
      message: "请输入皱纹度",
    },
  ],
  bule_dots: [
    {
      required: submitValue,
      message: "请输入蓝点尺寸",
    },
  ],
});
// 检查单元格是否符合标准值 自定义class 异常标红显示
function checkCellClass(value: any, key: string) {
  let className = "";
  if (!props.tableLableOptions) return className;
  let ok = validatorCell(props.tableLableOptions[key], value);
  className = ok ? "" : "warn-text";
  return className;
}
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
        <!-- <el-button type="primary" @click="downloadTemp">导出模板</el-button> -->
      </div>
      <div class="flex flex-1 justify-end">
        <div class="mr-[10px]">
          总样品数:
          <span class="text-green-800">{{ formData.total }}</span>
        </div>
        <div>
          总异常数:
          <span class="text-red-800">{{ formData.abnormal }}</span>
          <!-- 总异常数:
          <span class="text-red-800">{{ abnormalNum }}</span> -->
        </div>
      </div>
    </div>
    <div class="">
      <el-form
        :model="checkTableForm"
        ref="tableFormRef"
        :rules="tableRules"
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
              :prop="`checkTableData.${$index}.check_time`"
              :rules="checkFormRules.check_time"
            >
              <el-time-select
                v-model="row.check_time"
                start="00:00"
                step="00:01"
                end="23:59"
                :min-time="row.check_time"
                placeholder="请选择检验时间"
                :clearable="false"
              />
            </el-form-item>
          </template>
          <!-- 生产包号 -->
          <template #pack_no="{ row, $index }">
            <!-- :prop="`checkTableData.${$index}.pack_no`" -->
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
          <!-- 罐体高度 -->
          <template #body_high="{ row, $index }">
            <div v-for="(item, index) in row.check_json" :key="index">
              <el-form-item
                :prop="`checkTableData.${$index}.check_json[${index}]['body_high']`"
                :rules="checkFormRules.body_high"
                :class="checkCellClass(item['body_high'], 'body_high')"
              >
                <el-input
                  v-model="item['body_high']"
                  placeholder="请输入内容"
                  v-inputnum.num_point="4"
                ></el-input>
              </el-form-item>
            </div>
          </template>
          <!-- 罐内径 -->
          <template #inner="{ row, $index }">
            <div v-for="(item, index) in row.check_json" :key="index">
              <el-form-item
                :prop="`checkTableData.${$index}.check_json[${index}]['inner']`"
                :rules="checkFormRules.inner"
                :class="checkCellClass(item['inner'], 'inner')"
              >
                <el-input
                  v-model="item['inner']"
                  v-inputnum.num_point="4"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </div>
          </template>
          <!-- 翻边尺寸 -->
          <template #lange_width="{ row, $index }">
            <div v-for="(item, index) in row.check_json" :key="index">
              <el-form-item
                :prop="`checkTableData.${$index}.check_json[${index}]['lange_width']`"
                :rules="checkFormRules.lange_width"
                :class="checkCellClass(item['lange_width'], 'lange_width')"
              >
                <el-input
                  v-model="item['lange_width']"
                  v-inputnum.num_point="4"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </div>
          </template>
          <!-- 宽度 -->
          <template #w_standard="{ row, $index }">
            <div v-for="(item, index) in row.check_json" :key="index">
              <el-form-item
                :prop="`checkTableData.${$index}.check_json[${index}]['w_standard']`"
                :rules="checkFormRules.w_standard"
                :class="checkCellClass(item['w_standard'], 'w_standard')"
              >
                <el-input
                  v-model="item['w_standard']"
                  v-inputnum.num_point="4"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </div>
          </template>
          <!-- 身钩长度 -->
          <template #body_hook_length="{ row, $index }">
            <div v-for="(item, index) in row.check_json" :key="index">
              <el-form-item
                :prop="`checkTableData.${$index}.check_json[${index}]['body_hook_length']`"
                :rules="checkFormRules.body_hook_length"
                :class="checkCellClass(item['body_hook_length'], 'body_hook_length')"
              >
                <el-input
                  v-model="item['body_hook_length']"
                  v-inputnum.num_point="4"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </div>
          </template>
          <!-- 盖钩长度 -->
          <template #end_hook_length="{ row, $index }">
            <div v-for="(item, index) in row.check_json" :key="index">
              <el-form-item
                :prop="`checkTableData.${$index}.check_json[${index}]['end_hook_length']`"
                :rules="checkFormRules.end_hook_length"
                :class="checkCellClass(item['end_hook_length'], 'end_hook_length')"
              >
                <el-input
                  v-model="item['end_hook_length']"
                  v-inputnum.num_point="4"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </div>
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
                  v-inputnum.num_point="4"
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
                  v-inputnum.num_point="4"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </div>
          </template>
          <!-- 厚度 -->
          <template #t_standard="{ row, $index }">
            <div v-for="(item, index) in row.check_json" :key="index">
              <el-form-item
                :prop="`checkTableData.${$index}.check_json[${index}]['t_standard']`"
                :rules="checkFormRules.t_standard"
                :class="checkCellClass(item['t_standard'], 't_standard')"
              >
                <el-input
                  v-model="item['t_standard']"
                  v-inputnum.num_point="4"
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
                  v-inputnum.num_point="4"
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
                  v-inputnum.num_point="4"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </div>
          </template>
          <!-- 皱纹度 -->
          <template #wrinkle_rate="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.wrinkle_rate`"
              :rules="checkFormRules.wrinkle_rate"
              :class="checkCellClass(row.wrinkle_rate, 'wrinkle_rate')"
            >
              <el-input
                v-model="row.wrinkle_rate"
                v-inputnum.num_point="4"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </template>
          <!-- 蓝点尺寸 -->
          <template #bule_dots="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.bule_dots`"
              :rules="checkFormRules.bule_dots"
            >
              <el-select v-model="row.bule_dots" placeholder="请选择" filterable>
                <el-option
                  v-for="item in passList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
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
    <ExcelUpload v-model:visible="uploadShow" @upload="getExcelData"></ExcelUpload>
  </div>
</template>
<style lang="scss" scoped></style>
