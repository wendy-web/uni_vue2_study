<script setup lang="ts">
/* 内涂膜实测值弹窗 */
import type { FormInstance } from "element-plus";

type InnerCoatingTableType = {
  pro_package_number?: number; //生产包号
  actual_value: string; //实测值
  standard_text: string; //标准值
};

type ListType = Omit<InnerCoatingTableType, "standard_text">;

interface Props {
  /** 顶部信息通用数据 */
  descriptionsData: {
    batch_no: string; //生产批号
    group_no: number; //组别
    max_num: number; //最大样品数
  };
  /** 标准值文本 */
  standardText: string;
  list: ListType[];
  unit: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  descriptionsData: () => ({ batch_no: "", group_no: 1, max_num: 8 }),
  config: () => ({ type: 0, unit: "", lower_limit_val: "", upper_limit_val: "" }),
  disabled: false,
});

const tableFormRef = ref<FormInstance>();
const tableForm = reactive({
  tableData: [] as InnerCoatingTableType[],
});

const { tableData } = toRefs(tableForm);
const tableRules = reactive({
  pro_package_number: [{ validator: valiProPackageNumber, trigger: "blur" }],
  actual_value: [
    {
      required: true,
      trigger: "blur",
      message: "请输入实测值",
    },
  ],
});

function valiProPackageNumber(rule: any, value: any, callback: any) {
  let find_num = 0;
  if (!value) {
    return callback(new Error("请输入包号"));
  } else {
    tableData.value.forEach((item) => {
      if (value && item.pro_package_number == value) {
        find_num++;
      }
    });
    if (find_num > 1) {
      callback(new Error("该包号重复录入"));
    } else {
      callback();
    }
  }
}

function clickAdd() {
  if (tableData.value.length === 8) return;
  console.log("standardText", props.standardText);
  tableData.value.push({
    actual_value: "",
    standard_text: props.standardText,
  });
}
function tableDel(row: InnerCoatingTableType, index: number) {
  tableData.value.splice(index, 1);
}

async function vailFormData() {
  let vaildateRes = await tableFormRef.value!.validate((valid, fields) => {
    for (const keys in fields) {
      if (fields[keys]) {
        // 弹出每个字段的错误提示
        ElMessage.warning(fields[keys][0].message);
        break;
      }
    }
  });
  return vaildateRes;
}

defineExpose({
  tableData,
  vailFormData,
});
watch(
  () => props.list,
  (newVal) => {
    tableData.value = newVal.map((item) => {
      return {
        standard_text: props.standardText,
        ...item,
      };
    });
  },
  {
    immediate: true,
  },
);

const infoColumns: PlusColumnList = [
  {
    label: "生产批号",
    prop: "batch_no",
  },
  {
    label: "最大样品数",
    prop: "max_num",
  },
  {
    label: "组别",
    prop: "group_no",
  },
];

const tableColumns: TableColumnList = [
  {
    label: "操作",
    slot: "operation",
    width: 80,
    hide: () => props.disabled,
  },
  {
    label: "样品数",
    type: "index",
    width: 70,
  },
  {
    label: "包号",
    prop: "pro_package_number",
    slot: "pro_package_number",
  },
  {
    label: "标准值",
    prop: "standard_text",
  },
  {
    label: "实测值",
    prop: "actual_value",
    slot: "actual_value",
  },
];
</script>
<template>
  <div class="measured-wrapper">
    <PlusDescriptions
      :column="3"
      :columns="infoColumns"
      :data="descriptionsData"
      class="mb-2"
    ></PlusDescriptions>
    <ul class="flex justify-between items-center pr-4 mb-2">
      <li>
        <el-button type="primary" @click="clickAdd" v-if="!disabled">新增</el-button>
        <!-- <el-button @click="clickDel">删除</el-button> -->
      </li>
      <li class="font-bold">单位:({{ unit }})</li>
    </ul>
    <el-form :model="tableForm" ref="tableFormRef" :rules="tableRules">
      <PureTable border :columns="tableColumns" :data="tableData">
        <template #operation="{ row, $index }">
          <el-button type="primary" link @click="tableDel(row, $index)">移除</el-button>
        </template>
        <template #pro_package_number="{ row, $index }">
          <el-form-item
            :prop="`tableData.${$index}.pro_package_number`"
            :rules="tableRules.pro_package_number"
          >
            <el-input
              v-model="row.pro_package_number"
              placeholder="请输入"
              :disabled="disabled"
              v-inputnum.intp
            ></el-input>
          </el-form-item>
        </template>
        <template #actual_value="{ row, $index }">
          <el-form-item :prop="`tableData.${$index}.actual_value`" :rules="tableRules.actual_value">
            <el-input
              v-model="row.actual_value"
              placeholder="请输入"
              :disabled="disabled"
              v-inputnum.num_point="4"
            ></el-input>
          </el-form-item>
        </template>
      </PureTable>
    </el-form>
  </div>
</template>
<style lang="scss" scoped></style>
