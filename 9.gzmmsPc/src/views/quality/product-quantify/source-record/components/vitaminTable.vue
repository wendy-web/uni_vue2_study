<script setup lang="tsx">
/* 新建VB12测定记录的表格 */
import type { FormInstance } from "element-plus";
import { buildUUID } from "@pureadmin/utils";
import dayjs from "dayjs";
import { getTabelLabelApi } from "@/api/quality/common";
import CommonSelect from "@/components/DeptSelect/CommonSelect.vue";
import { type GetConfigQuery, useAdd } from "../utils/add";

type VitaminTableType = {
  id: string | number;
  sample_no?: string;
  make_date?: string;
  sample_batch_no?: string;
  dilute?: string;
  content?: string;
  content_x?: string;
  diff_coe?: string;
  check_ret?: number;
};

interface Props {
  disabled?: boolean;
  baseFormRef?: FormInstance;
}

const { passList } = useAdd();
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

/** 表格表单的ref */
const tableFormRef = ref<FormInstance>();
const tableForm = reactive({
  tableData: [] as VitaminTableType[],
});

const { tableData } = toRefs(tableForm);

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

/** 勾选的id数组 */
const ids = ref<unknown[]>([]);

/** 表格勾选触发事件 */
function changeSelect(selection: VitaminTableType[]) {
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
  });
}

function tableDel() {
  tableData.value = tableData.value.filter((item) => {
    return !ids.value.includes(item.id);
  });
}

function setData(list: VitaminTableType[]) {
  tableData.value = list;
}

const diluteConfig = ref(); //稀释倍数
const contentConfig = ref(); //矫正含量
const contentXConfig = ref(); // 含量x
const diffcoeConfig = ref(); //差异系数CV

async function getSettingConfig(queryData: GetConfigQuery) {
  const result = await getTabelLabelApi(queryData);
  contentConfig.value = result.data.content;
  contentXConfig.value = result.data.content_x;
  diffcoeConfig.value = result.data.diff_coe;
  diluteConfig.value = result.data.dilute;
}

function getCriterionText() {
  // console.log("contentXConfig.value", contentXConfig.value);
  let text = contentXConfig.value?.initval;
  return text;
}

function handleBlur(row: VitaminTableType) {
  // console.log("🚀 ~ handleBlur ~ row:", row);
  if (row.dilute && row.content) {
    // 含量x =  稀释倍数*校正含量*10
    row.content_x = (Number(row.dilute) * Number(row.content) * 10).toFixed(2);
  } else {
    row.content_x = "";
  }
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
    label: "稀释倍数",
    prop: "dilute",
    slot: "dilute",
    headerRenderer: () => (
      <ul>
        <li>稀释倍数{diluteConfig.value?.unit ? diluteConfig.value?.unit : ""}</li>
        <li>{diluteConfig.value?.initval}</li>
      </ul>
    ),
  },
  {
    label: "校正含量x（μg/100g）",
    prop: "content",
    slot: "content",
    headerRenderer: () => (
      <ul>
        <li>校正含量x({contentConfig.value?.unit ? contentConfig.value?.unit : "μg/100g"})</li>
        <li>{contentConfig.value?.initval}</li>
      </ul>
    ),
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
    label: "差异系数CV（%)",
    prop: "diff_coe",
    slot: "diff_coe",
    headerRenderer: () => (
      <ul>
        <li>差异系数CV({diffcoeConfig.value?.unit ? diffcoeConfig.value?.unit : "%"})</li>
        <li>{diffcoeConfig.value?.initval}</li>
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
  dilute: [
    {
      required: true,
      message: "请输入稀释倍数",
    },
  ],
  content: [
    {
      required: true,
      message: "请输入校正含量",
    },
  ],
  content_x: [
    {
      required: true,
      message: "请输入含量",
    },
  ],
  diff_coe: [
    {
      required: true,
      message: "请输入差异系数",
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
        <!-- 稀释倍数 -->
        <template #dilute="{ row, $index }">
          <el-form-item :prop="`tableData.${$index}.dilute`" :rules="tableRules.dilute">
            <el-input v-model="row.dilute" @blur="handleBlur(row)" :disabled="disabled" />
          </el-form-item>
        </template>
        <!-- 校正含量 -->
        <template #content="{ row, $index }">
          <el-form-item :prop="`tableData.${$index}.content`" :rules="tableRules.content">
            <el-input v-model="row.content" @blur="handleBlur(row)" :disabled="disabled" />
          </el-form-item>
        </template>
        <!-- 含量 -->
        <template #content_x="{ row, $index }" :rules="tableRules.content_x">
          <el-form-item :prop="`tableData.${$index}.content_x`">
            <el-input v-model="row.content_x" placeholder="自动计算" disabled />
          </el-form-item>
        </template>
        <!-- 差异系数CV -->
        <template #diff_coe="{ row, $index }">
          <el-form-item :prop="`tableData.${$index}.diff_coe`" :rules="tableRules.diff_coe">
            <el-input v-model="row.diff_coe" :disabled="disabled" />
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
    </el-form>
  </div>
</template>
<style lang="scss" scoped></style>
