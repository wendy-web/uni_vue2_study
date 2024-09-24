<script setup lang="tsx">
/* 新建A道(总砷和铅)表格 */
import type { FormInstance } from "element-plus";
import { buildUUID } from "@pureadmin/utils";
import dayjs from "dayjs";
import { getTabelLabelApi } from "@/api/quality/common";
import CommonSelect from "@/components/DeptSelect/CommonSelect.vue";
import { type GetConfigQuery, useAdd } from "../utils/add";

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
  tableData: [] as any[],
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
    unit: "mg/L",
    form: "液态",
    times: "1",
  });
}

function tableDel() {
  tableData.value = tableData.value.filter((item) => {
    return !ids.value.includes(item.id);
  });
}

function setData(list: any[]) {
  tableData.value = list;
}

const emptyConfig = ref(); //空白配置
const strengthConfig = ref(); //强度配置
const concentrationConfig = ref(); //浓度配置
const plastidConfig = ref(); //质体比配置

async function getSettingConfig(queryData: GetConfigQuery) {
  const result = await getTabelLabelApi(queryData);
  concentrationConfig.value = result.data.concentration;
  emptyConfig.value = result.data.emp;
  plastidConfig.value = result.data.plastid;
  strengthConfig.value = result.data.strength;
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
    label: "样品标识",
    prop: "sample_no",
    slot: "sample_no",
  },
  {
    label: "批号",
    prop: "sample_batch_no",
    slot: "sample_batch_no",
  },
  {
    label: "空白",
    prop: "emp",
    slot: "emp",
    headerRenderer: () => (
      <ul>
        <li>空白</li>
        <li>{emptyConfig.value?.initval}</li>
      </ul>
    ),
  },

  {
    label: "强度",
    prop: "strength",
    slot: "strength",
    headerRenderer: () => (
      <ul>
        <li>强度</li>
        <li>{strengthConfig.value?.initval}</li>
      </ul>
    ),
  },

  {
    label: "浓度",
    prop: "concentration",
    slot: "concentration",
    headerRenderer: () => (
      <ul>
        <li>浓度</li>
        <li>{concentrationConfig.value?.initval}</li>
      </ul>
    ),
  },
  {
    label: "单位",
    prop: "unit",
    slot: "unit",
  },
  {
    label: "形态",
    prop: "form",
    slot: "form",
  },
  {
    label: "质体比",
    prop: "plastid",
    slot: "plastid",
    headerRenderer: () => (
      <ul>
        <li>质体比</li>
        <li>{plastidConfig.value?.initval}</li>
      </ul>
    ),
  },
  {
    label: "次数",
    prop: "times",
    slot: "times",
  },
  {
    label: "生产日期",
    prop: "make_date",
    slot: "make_date",
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
      message: "请输入样品标识",
    },
  ],
  sample_batch_no: [
    {
      required: true,
      // message: "请输入样品批号",
      validator: (rule: any, value: string, callback: any) => {
        if (!value) {
          callback(new Error("请输入批号"));
        } else if (value.length < 5) {
          callback(new Error("批号应为5位"));
        } else {
          callback();
        }
      },
    },
  ],
  emp: [
    {
      required: true,
      message: "请输入空白",
    },
  ],
  strength: [
    {
      required: true,
      message: "请输入强度",
    },
  ],
  concentration: [
    {
      required: true,
      message: "请输入浓度",
    },
  ],
  plastid: [
    {
      required: true,
      message: "请输入质体比",
    },
  ],
  times: [
    {
      required: true,
      message: "请输入次数",
    },
  ],
  make_date: [
    {
      required: true,
      message: "请选择生产日期",
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
        <!-- 样品标识 -->
        <template #sample_no="{ row, $index }">
          <el-form-item :prop="`tableData.${$index}.sample_no`" :rules="tableRules.sample_no">
            <el-input v-model="row.sample_no" :disabled="disabled" />
          </el-form-item>
        </template>
        <!-- 批号 -->
        <template #sample_batch_no="{ row, $index }">
          <el-form-item
            :prop="`tableData.${$index}.sample_batch_no`"
            :rules="tableRules.sample_batch_no"
          >
            <el-input v-model="row.sample_batch_no" maxlength="5" :disabled="disabled" />
          </el-form-item>
        </template>
        <!-- 空白 -->
        <template #emp="{ row, $index }">
          <el-form-item :prop="`tableData.${$index}.emp`" :rules="tableRules.emp">
            <el-input v-model="row.emp" :disabled="disabled" />
          </el-form-item>
        </template>
        <!-- 强度 -->
        <template #strength="{ row, $index }">
          <el-form-item :prop="`tableData.${$index}.strength`" :rules="tableRules.strength">
            <el-input v-model="row.strength" :disabled="disabled" />
          </el-form-item>
        </template>
        <!-- 浓度 -->
        <template #concentration="{ row, $index }">
          <el-form-item
            :prop="`tableData.${$index}.concentration`"
            :rules="tableRules.concentration"
          >
            <el-input v-model="row.concentration" :disabled="disabled" />
          </el-form-item>
        </template>
        <!-- 单位 -->
        <template #unit="{ row, $index }">
          <span class="table-span">{{ row.unit }}</span>
        </template>
        <!-- 形态 -->
        <template #form="{ row, $index }">
          <span class="table-span">{{ row.form }}</span>
        </template>
        <!-- 质体比 -->
        <template #plastid="{ row, $index }">
          <el-form-item :prop="`tableData.${$index}.plastid`" :rules="tableRules.plastid">
            <el-input v-model="row.plastid" :disabled="disabled" />
          </el-form-item>
        </template>
        <!-- 次数 -->
        <template #times="{ row, $index }">
          <el-form-item :prop="`tableData.${$index}.times`" :rules="tableRules.times">
            <el-input v-model="row.times" :disabled="disabled" />
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
