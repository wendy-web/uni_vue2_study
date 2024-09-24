<script setup lang="tsx">
/* 定量测定原始记录(其他项目)表格 */
import type { FormInstance } from "element-plus";
import { buildUUID } from "@pureadmin/utils";
import dayjs from "dayjs";
import { getTabelLabelApi } from "@/api/quality/common";
import CommonSelect from "@/components/DeptSelect/CommonSelect.vue";
import type { fieldConfigType } from "@/hooks/quality/index";
import { type GetConfigQuery, useAdd } from "../utils/add";

type OtherTableType = {
  id: string | number;
  sample_no?: string;
  make_date?: string;
  sample_batch_no?: string;
  check_json?: CheckJsonType[];
  content_x_avg?: string;
  content_x_diff_avg?: string;
  check_ret?: number;
};
type CheckJsonType = {
  amount?: string;
  volume?: string;
  area?: string;
  content_x?: string;
};

const { passList } = useAdd();

interface Props {
  disabled?: boolean;
  formula?: string;
  baseFormRef?: FormInstance;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  formula: "",
});

/** 表格表单的ref */
const tableFormRef = ref<FormInstance>();
const tableForm = reactive({
  tableData: [] as OtherTableType[],
});

const { tableData } = toRefs(tableForm);
/** 勾选的id数组 */
const ids = ref<unknown[]>([]);

// 情况一：项目=牛磺酸、赖氨酸、肌醇、烟酰胺、咖啡因、维生素B6时，默认文本框内输入：X=C×V2/V1；
// 情况二：项目=柠檬黄、胭脂红、诱惑红、苯甲酸时，默认文本框内输入：X=（C×V2/V1）/1000；
/** 公式的value */
// const formulaValue = ref("X=C×V2/V1");

/** 曲线的value */
const curveValue = ref("");

/** 总样品数 */
const totalNum = computed(() => {
  return tableData.value.length;
});
const abnormalNum = computed(() => {
  let count = 0;
  // 只检查检验结果是否为0
  tableData.value.forEach((item) => {
    if (item.check_ret === 0) {
      count++;
    }
  });

  return count;
});

const amountConfig = ref<fieldConfigType>(); //取样量配置
const volumeConfig = ref<fieldConfigType>(); //定容体积v2皮遏制
const areaConfig = ref<fieldConfigType>(); //峰面积配置
const contentXConfig = ref<fieldConfigType>(); //含量x配置
const avgConfig = ref<fieldConfigType>(); //平均值配置
const diffAvgConfig = ref<fieldConfigType>(); //绝对差值配置
/** 获取标准配置 */
async function getSettingConfig(queryData: GetConfigQuery) {
  const result = await getTabelLabelApi(queryData);
  amountConfig.value = getFieldConfig("amount", result.data);
  volumeConfig.value = getFieldConfig("volume", result.data);
  areaConfig.value = getFieldConfig("area", result.data);
  contentXConfig.value = getFieldConfig("content_x", result.data);
  avgConfig.value = getFieldConfig("content_x_avg", result.data);
  diffAvgConfig.value = getFieldConfig("content_x_diff_avg", result.data);
}

/** 根据字段来获取标准配置 */
function getFieldConfig(field: string, data: any) {
  let { type, unit, lower_limit_val, upper_limit_val, default_val, initval, error_limit_val } =
    data[field];
  return { type, unit, lower_limit_val, upper_limit_val, default_val, initval, error_limit_val };
}

function getCriterionText() {
  // console.log("contentXConfig.value", contentXConfig.value);
  let text = contentXConfig.value?.initval;
  return text;
}

/** 表格勾选触发事件 */
function changeSelect(selection: any[]) {
  ids.value = selection.map((item) => {
    return item.id;
  });
}

async function tableAdd() {
  if (props.baseFormRef) {
    const vaildateRes = await props.baseFormRef
      ?.validate((valid, fields) => {
        for (const keys in fields) {
          if (fields[keys]) {
            // 弹出每个字段的错误提示
            ElMessage.warning(fields[keys][0].message);
            props.baseFormRef?.scrollToField(keys);
            break;
          }
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
    if (!vaildateRes) return;
  }

  tableData.value.push({
    id: buildUUID(),
    check_json: [
      {
        amount: "",
        volume: "",
        area: "",
        content_x: "",
      },
      {
        amount: "",
        volume: "",
        area: "",
        content_x: "",
      },
    ],
  });
}

function tableDel() {
  tableData.value = tableData.value.filter((item) => {
    return !ids.value.includes(item.id);
  });
}

function setData(list: OtherTableType[], curve: string) {
  tableData.value = list;
  curveValue.value = curve;
}

async function vaildateTable() {
  const vaildateRes = await tableFormRef
    .value!.validate((valid, fields) => {
      for (const keys in fields) {
        if (fields[keys]) {
          // 弹出每个字段的错误提示
          ElMessage.warning(fields[keys][0].message);
          tableFormRef.value!.scrollToField(keys);
          break;
        }
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
  console.log("vaildateRes", vaildateRes);
  return vaildateRes;
}

defineExpose({
  tableData,
  curveValue,
  setData,
  getSettingConfig,
  getCriterionText,
  vaildateTable,
});

const tableColumns: TableColumnList = [
  {
    label: "勾选列",
    type: "selection",
    hide: () => props.disabled,
  },
  {
    label: "#",
    type: "index",
  },
  {
    label: "样品编号",
    prop: "sample_no",
    slot: "sample_no",
  },
  {
    label: "生产日期",
    prop: "make_date",
    slot: "make_date",
  },
  {
    label: "样品批号",
    prop: "sample_batch_no",
    slot: "sample_batch_no",
  },
  {
    label: "取样量v1(ml)",
    prop: "amount",
    slot: "amount",
    headerRenderer: () => (
      <ul>
        <li>取样量v1({amountConfig.value?.unit ? amountConfig.value?.unit : "ml"})</li>
        <li>{amountConfig.value?.initval}</li>
      </ul>
    ),
  },
  {
    label: "测定数据记录",
    align: "center",
    children: [
      {
        label: "定容体积v2(ml)",
        prop: "volume",
        slot: "volume",
        headerRenderer: () => (
          <ul>
            <li>定容体积v2({volumeConfig.value?.unit ? volumeConfig.value?.unit : "ml"})</li>
            <li>{volumeConfig.value?.initval}</li>
          </ul>
        ),
      },
      {
        label: "峰面积(ml)",
        prop: "area",
        slot: "area",
        headerRenderer: () => (
          <ul>
            <li>峰面积({areaConfig.value?.unit ? areaConfig.value?.unit : "ml"})</li>
            <li>{areaConfig.value?.initval}</li>
          </ul>
        ),
      },
    ],
  },
  {
    label: "含量x(mg/L)",
    prop: "content_x",
    slot: "content_x",
    headerRenderer: () => (
      <ul>
        <li>含量x({contentXConfig.value?.unit ? contentXConfig.value?.unit : "mg/L"})</li>
        <li>{contentXConfig.value?.initval}</li>
      </ul>
    ),
  },
  {
    label: "平均值(mg/L)",
    prop: "content_x_avg",
    slot: "content_x_avg",
    headerRenderer: () => (
      <ul>
        <li>平均值({avgConfig.value?.unit ? avgConfig.value?.unit : "mg/L"})</li>
        <li>{avgConfig.value?.initval}</li>
      </ul>
    ),
  },
  {
    label: "绝对差值/平均值",
    prop: "content_x_diff_avg",
    slot: "content_x_diff_avg",
    width: 180,
    headerRenderer: () => (
      <ul>
        <li>绝对差值/平均值x100%</li>
        <li>{diffAvgConfig.value?.initval}</li>
      </ul>
    ),
  },
  {
    label: "检验结果",
    prop: "check_ret",
    slot: "check_ret",
  },
];
const tableRules = reactive({
  sample_no: [
    {
      required: true,
      message: "请输入样品编号",
    },
  ],
  make_date: [
    {
      required: true,
      message: "请选择生产日期",
    },
  ],
  sample_batch_no: [
    {
      required: true,
      // message: "请输入样品批号",
      validator: (rule: any, value: string, callback: any) => {
        if (!value) {
          callback(new Error("请输入样品批号"));
        } else if (value.length < 5) {
          callback(new Error("样品批号应为5位"));
        } else {
          callback();
        }
      },
    },
  ],
  amount: [
    {
      required: true,
      message: "请输入取样量v1",
    },
  ],
  volume: [
    {
      required: true,
      message: "请输入定容体积v2",
    },
  ],
  area: [
    {
      required: true,
      message: "请输入峰面积",
    },
  ],
  content_x: [
    {
      required: true,
      message: "请输入含量x",
    },
  ],
  content_x_avg: [
    {
      required: true,
      message: "请输入平均值",
    },
  ],
  content_x_diff_avg: [
    {
      required: true,
      message: "请输入绝对差值/平均值",
    },
  ],

  check_ret: [
    {
      required: true,
      message: "请选择检验结果",
    },
  ],
});
</script>
<template>
  <div class="px-8">
    <ul class="flex items-center justify-between mb-2">
      <li>
        <template v-if="!disabled">
          <el-button type="primary" @click="tableAdd">新增</el-button>
          <el-button @click="tableDel">删除</el-button>
        </template>
      </li>
      <li class="text-blue-500">
        <span class="inline-block mr-4">总样品数:{{ totalNum }}</span>
        <span>总异常数:{{ abnormalNum }}</span>
      </li>
    </ul>
    <el-form :model="tableForm" ref="tableFormRef">
      <PureTable
        ref="prueTableRef"
        row-key="id"
        border
        :columns="tableColumns"
        :data="tableData"
        height="800"
        @selection-change="changeSelect"
      >
        <!-- 编号 -->
        <template #sample_no="{ row, $index }">
          <el-form-item :prop="`tableData.${$index}.sample_no`" :rules="tableRules.sample_no">
            <el-input v-model="row.sample_no" :disabled="disabled" />
          </el-form-item>
        </template>
        <!-- 生产日期 -->
        <template #make_date="{ row, $index }">
          <el-form-item :prop="`tableData.${$index}.make_date`" :rules="tableRules.make_date">
            <el-date-picker
              v-model="row.make_date"
              type="date"
              placeholder="生产日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :disabled="disabled"
              :disabled-date="(date:string) => {
                  return dayjs().isBefore(date);
                }"
            />
          </el-form-item>
        </template>
        <!-- 样品批号 -->
        <template #sample_batch_no="{ row, $index }">
          <el-form-item
            :prop="`tableData.${$index}.sample_batch_no`"
            :rules="tableRules.sample_batch_no"
          >
            <el-input v-model="row.sample_batch_no" maxlength="5" :disabled="disabled" />
          </el-form-item>
        </template>
        <!-- 取样量v1 -->
        <template #amount="{ row, $index }">
          <el-form-item
            :prop="`tableData.${$index}.check_json.${index}.amount`"
            :rules="tableRules.amount"
            v-for="(item, index) in row.check_json"
            :key="index"
          >
            <el-input v-model="item.amount" :disabled="disabled" />
          </el-form-item>
        </template>
        <!-- 定容体积v2 -->
        <template #volume="{ row, $index }">
          <el-form-item
            :prop="`tableData.${$index}.check_json.${index}.volume`"
            :rules="tableRules.volume"
            v-for="(item, index) in row.check_json"
            :key="index"
          >
            <el-input v-model="item.volume" :disabled="disabled" />
          </el-form-item>
        </template>
        <!-- 峰面积 -->
        <template #area="{ row, $index }">
          <el-form-item
            :prop="`tableData.${$index}.check_json.${index}.area`"
            :rules="tableRules.area"
            v-for="(item, index) in row.check_json"
            :key="index"
          >
            <el-input v-model="item.area" :disabled="disabled" />
          </el-form-item>
        </template>
        <!-- 含量 -->
        <template #content_x="{ row, $index }">
          <el-form-item
            :prop="`tableData.${$index}.check_json.${index}.content_x`"
            :rules="tableRules.content_x"
            v-for="(item, index) in row.check_json"
            :key="index"
          >
            <el-input v-model="item.content_x" :disabled="disabled" />
          </el-form-item>
        </template>
        <!-- 平均值 -->
        <template #content_x_avg="{ row, $index }">
          <el-form-item
            :prop="`tableData.${$index}.content_x_avg`"
            :rules="tableRules.content_x_avg"
          >
            <el-input v-model="row.content_x_avg" :disabled="disabled" />
          </el-form-item>
        </template>
        <!-- 绝对差值/平均值 -->
        <template #content_x_diff_avg="{ row, $index }">
          <el-form-item
            :prop="`tableData.${$index}.content_x_diff_avg`"
            :rules="tableRules.content_x_diff_avg"
          >
            <el-input v-model="row.content_x_diff_avg" :disabled="disabled" />
          </el-form-item>
        </template>
        <!-- 检验结果 -->
        <template #check_ret="{ row, $index }">
          <el-form-item :prop="`tableData.${$index}.check_ret`" :rules="tableRules.check_ret">
            <CommonSelect
              v-model="row.check_ret"
              :list="passList"
              :disabled="disabled"
              :isWarning="row.check_ret === 0"
            ></CommonSelect>
          </el-form-item>
        </template>
      </PureTable>
      <table>
        <tr>
          <td>计算公式：</td>
          <td>
            <span>{{ formula }}</span>
          </td>
          <td>标准曲线：</td>
          <td colspan="2">
            <el-input v-model="curveValue" placeholder="曲线" :disabled="disabled"></el-input>
          </td>
        </tr>
      </table>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
table {
  font-size: 14px;
  border-collapse: collapse;
  color: #454545;
  table-layout: fixed;
  width: 100%;
  text-align: center;
  border: 0.5px solid #e5e7eb;
  td {
    border: 1px solid #e5e5e5;
    padding: 0 4px;
    height: 40px;
  }
}
</style>
