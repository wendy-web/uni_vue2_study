<script setup lang="tsx">
import { type FormInstance } from "element-plus";
import { WsCodeDropListType } from "@/api/product-stock/common";
import type { GoodsDetailType } from "@/api/product-stock/product-in/types";
import { useProcuctStock } from "../../hooks";
import { useList } from "../utils/hook";

type WsCodeInfoType = {
  ws_code_name: string; //ws_code_name
  ws_code: string; //库位编码
  id: number; //库位id
};

type BatchDataType = {
  stack_no: number; //垛号
  in_num: number; //入库数量
  measure_name: string; //单位
  box_serial_number_start: number; //箱序列号头
  box_serial_number_end: number; // 箱序列号尾
  pro_ph_no: string; //pro_ph_no
  batch_no: string; //成品批次
  ws_code_name: string; //ws_code_name
  ws_code: string; //库位编码
  ws_code_id: number; //库位id
  site: string; //库存地点
  stock_type: number; //库存类型
  // ws_code_info: WsCodeInfoType;
};

const { getStockTypeName } = useList();
// const { wsCodeList, getWscodeList } = useProcuctStock();

interface Props {
  list: GoodsDetailType[];
  codeList: WsCodeDropListType[];
}
const props = withDefaults(defineProps<Props>(), {
  list: () => [],
  codeList: () => [],
});

const formRef = ref<FormInstance>();
const formData = reactive({
  batchData: [] as BatchDataType[],
});
const { batchData } = toRefs(formData);

const tableRules = {
  box_serial_number_start: [
    {
      required: true,
      message: "请输入",
      trigger: "blur",
    },
  ],
  box_serial_number_end: [
    {
      required: true,
      message: "请输入",
      trigger: "blur",
    },
  ],
  batch_no: [
    {
      required: true,
      message: "请输入成品批次",
      trigger: "blur",
    },
  ],
  ws_code_id: [
    {
      required: true,
      message: "请选择库位名称",
    },
  ],
};

function wscodeChange(val: number, row: BatchDataType) {
  console.log("🚀 ~ wscodeChange ~ row:", row);
  console.log("🚀 ~ wscodeChange ~ val:", val);
  let value = props.codeList.find((item) => item.id === val);
  console.log("🚀 ~ wscodeChange ~ value:", value)
  if (value) {
    row.ws_code_name = value.ws_code_name;
    row.ws_code = value.ws_code;
    row.ws_code_id = value.id;
  }
}

const validatorForm = async () => {
  const vaildateRes = await formRef
    .value!.validate((valid, fields) => {
      for (const keys in fields) {
        if (fields[keys]) {
          // 弹出每个字段的错误提示
          ElMessage.warning(fields[keys][0].message);
          break;
        }
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
  return vaildateRes;
};

defineExpose({
  validatorForm,
  batchData,
});

/** 点击删除 */
function cellDelBatch(row: any, index: number) {
  batchData.value.splice(index, 1);
}

onMounted(() => {
  batchData.value = props.list;
  // batchData.value = props.list.map((item) => {
  //   return {
  //     ...item,
  //     ws_code_info: {
  //       ws_code_name: item.ws_code_name, //ws_code_name
  //       ws_code: item.ws_code, //库位编码
  //       id: item.ws_code_id, //库位id
  //     },
  //   };
  // });
  // console.log("🚀 ~ batchData.value=props.list.map ~ batchData.value :", batchData.value);
  // getWscodeList();
});

const columns: TableColumnList = [
  {
    label: "序号",
    type: "index",
    width: 60,
    align: "center",
  },
  {
    label: "操作",
    slot: "operation",
    align: "center",
  },
  {
    label: "垛号",
    prop: "stack_no",
    width: 70,
    align: "center",
  },
  {
    label: "入库数量",
    prop: "in_num",
    width: 100,
    align: "center",
  },
  {
    label: "单位",
    prop: "measure_name",
    align: "center",
  },
  {
    label: "箱序列号",
    prop: "box_serial_number",
    align: "center",
    headerRenderer: () => {
      return (
        <>
          <span class="text-red-500">*</span>
          <span>箱序列号</span>
        </>
      );
    },
    minWidth: 160,
    slot: "box_serial_number",
  },
  {
    label: "生产批次",
    prop: "pro_ph_no",
    align: "center",
  },
  {
    label: "成品批次",
    prop: "batch_no",
    align: "center",
    minWidth: 130,
    headerRenderer: () => {
      return (
        <>
          <span class="text-red-500">*</span>
          <span>成品批次</span>
        </>
      );
    },
    slot: "batch_no",
  },
  {
    label: "库位名称",
    prop: "ws_code_name",
    align: "center",
    headerRenderer: () => {
      return (
        <>
          <span class="text-red-500">*</span>
          <span>库位名称</span>
        </>
      );
    },
    width: 130,
    slot: "ws_code_name",
  },
  {
    label: "库位编码",
    prop: "ws_code",
    align: "center",
  },
  {
    label: "库存地点",
    prop: "site",
    align: "center",
  },
  {
    label: "库存类型",
    prop: "stock_type",
    align: "center",
    cellRenderer: ({ row }) => {
      return getStockTypeName(row.stock_type);
    },
  },
];
</script>
<template>
  <el-form ref="formRef" :model="formData">
    <pure-table
      ref="prueTableRef"
      :data="batchData"
      :columns="columns"
      border
      adaptive
      :adaptiveConfig="{ offsetBottom: 240 }"
      header-cell-class-name="table-gray-header"
    >
      <template #operation="{ row, $index }">
        <el-button type="primary" link @click="cellDelBatch(row, $index)">删除</el-button>
      </template>
      <template #box_serial_number="{ row, $index }">
        <div class="flex">
          <el-form-item
            :prop="`batchData.${$index}.box_serial_number_start`"
            :rules="tableRules.box_serial_number_start"
          >
            <el-input v-model="row.box_serial_number_start"></el-input>
          </el-form-item>
          <span>－</span>
          <el-form-item
            :prop="`batchData.${$index}.box_serial_number_end`"
            :rules="tableRules.box_serial_number_end"
          >
            <el-input v-model="row.box_serial_number_end"></el-input>
          </el-form-item>
        </div>
      </template>
      <!-- 成品批次 -->
      <template #batch_no="{ row, $index }">
        <el-form-item :prop="`batchData.${$index}.batch_no`" :rules="tableRules.batch_no">
          <el-input v-model="row.batch_no"></el-input>
        </el-form-item>
      </template>
      <!-- 库位名称 -->
      <template #ws_code_name="{ row, $index }">
        <el-form-item :prop="`batchData.${$index}.ws_code_id`" :rules="tableRules.ws_code_id">
          <el-select v-model="row.ws_code_id" value-key="id" @change="wscodeChange($event, row)">
            <el-option
              v-for="item in codeList"
              :key="item.id"
              :label="item.ws_code_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </template>
    </pure-table>
  </el-form>
</template>
<style lang="scss" scoped></style>
