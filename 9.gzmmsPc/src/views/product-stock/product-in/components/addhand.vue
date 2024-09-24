<script setup lang="tsx">
import { type FormInstance, FormRules, TableColumnCtx } from "element-plus";
import { getManualEdit, getWsCodeMap } from "@/api/product-stock/product-in";
// import type { ProductInGoodsType } from "@/api/product-stock/product-in/types";
import PdfImgUpload from "@/components/Upload/PdfImgUpload.vue";
import { useAdd } from "./addhand";

const {
  addFormData,
  addColumns,
  addRules,
  getFactoryCodeList,
  getWscodeList,
  wlSelectList,
  getWlData,
  selectProps,
  bindFile,
  inColumns,
  wsCodeList,
  factoryCodeList,
  tableFarm,
  inventoryCodeList,
  site,
} = useAdd();
const editId = ref<any>("");
const props = defineProps(["id"]);
const tableLoading = ref(false);

const PlusFormRef = ref();
/** 表单的ref */
const addFormRef = computed(() => {
  return PlusFormRef.value.formInstance as FormInstance;
});
const choicefindRes = ref<any>({});

/** 添加 */
const addTap = () => {
  // let item = {
  //   barcode: choicefindRes.value.barcode || "", //物料编码
  //   title: choicefindRes.value.title || "", //物料名称
  //   in_num: null, // 入库数量
  //   measure_name: "CAR", // 单位
  //   pro_ph_no: "", // 批次
  //   box_serial_number_start: null, // 箱序列号
  //   box_serial_number_end: null, // 箱序列号
  //   ws_code: "", // 库位编码
  //   ws_code_name: "", // 库位名称
  //   site: site.value, // 库存地
  //   inventoryName: [], // 库位名称列
  // };
  let item = JSON.parse(
    JSON.stringify(tableFarm.value.tableData[tableFarm.value.tableData.length - 1]),
  );
  tableFarm.value.tableData.push(item);
};

const checkChinese = () => {
  addFormData.value.pro_no = addFormData.value.pro_no.replace(/[\u4E00-\u9FA5]/g, "");
};
const changekwbmTap = async (e: string, index: number) => {
  tableFarm.value.tableData[index].inventoryName = [];
  tableFarm.value.tableData[index].ws_code_name = "";
  if (e) {
    let findRes: any = inventoryCodeList.value.find((el: { ws_code: string }) => el.ws_code == e);
    tableFarm.value.tableData[index].ws_code_id = findRes.id;
    const { data } = await getWsCodeMap({
      factory_code: findRes.factory_code,
      ws_code: findRes.ws_code,
    });
    tableFarm.value.tableData[index].inventoryName = data.data;
  }
};
const changekwbmTweTap = async (e: string, index: number) => {
  let findRes: any = tableFarm.value.tableData[index].inventoryName.find((el: { ws_code_name: string }) => el.ws_code_name == e);
  tableFarm.value.tableData[index].ws_code_id = findRes.id;
};

const getEditTap = async (id: any) => {
  tableLoading.value = true;
  await getWscodeList();
  // console.log("编辑", id);
  const { data: resData, code } = await getManualEdit({
    id: id,
  });
  if (code == 1) {
    const {
      delivery_no,
      factory_code,
      file_info,
      goods_id,
      note,
      pro_date,
      pro_no,
      stock_type,
      into_info,
    } = resData;
    addFormData.value.delivery_no = delivery_no;
    addFormData.value.factory_code = factory_code;
    addFormData.value.file_info = JSON.parse(file_info);
    addFormData.value.goods_id = goods_id;
    addFormData.value.note = note;
    addFormData.value.pro_date = pro_date;
    addFormData.value.pro_no = pro_no;
    addFormData.value.stock_type = stock_type;
    let findRes = wlSelectList.value.find((el) => el.id == goods_id);
    const { data } = await getWsCodeMap({ factory_code: factory_code });
    let inventoryCodeLists: any = data.data;
    inventoryCodeList.value = inventoryCodeLists;
    choicefindRes.value = findRes;
    let into_info_index = into_info.length;
    into_info.forEach(async (element: any, index: number) => {
      site.value = element.site; // 设置库存地点
      element.barcode = findRes.barcode;
      element.title = findRes.title;
      element.measure_name = "CAR";
      let findResTwe: any = inventoryCodeLists.find(
        (el: { ws_code: string }) => el.ws_code == element.ws_code,
      );
      const { data } = await getWsCodeMap({
        factory_code: factory_code,
        ws_code: findResTwe.ws_code,
      });
      element.inventoryName = data.data;
      if (index + 1 === into_info_index) {
        tableFarm.value.tableData = into_info;
      }
    });
    tableLoading.value = false;
  }
};

/** 删除 */
const detele = (index: number) => {
  if (tableFarm.value.tableData.length == 1) {
    ElMessage.warning("至少需要保留一条数据");
    return;
  }
  let list = [];
  for (let i = 0; i < tableFarm.value.tableData.length; i++) {
    if (index != i) {
      list.push(tableFarm.value.tableData[i]);
    }
  }
  tableFarm.value.tableData = list;
};
const choiceChange = (e: any) => {
  let findRes = wlSelectList.value.find((el) => el.id == e);
  choicefindRes.value = findRes;
  tableFarm.value.tableData.forEach((element: any) => {
    element.barcode = findRes.barcode;
    element.title = findRes.title;
  });
};
const validatorForm = async () => {
  const vaildateRes = await addFormRef.value
    .validate((valid, fields) => {
      for (const keys in fields) {
        if (fields[keys]) {
          // 弹出每个字段的错误提示
          ElMessage.warning(fields[keys][0].message);
          addFormRef.value.scrollToField(keys);
          break;
        }
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
  return vaildateRes;
};

const Tablerules = ref<any>({
  in_num: [
    { required: true, message: "入库数量不能为空", trigger: "blur" },
    {
      type: "number",
      min: 1,
      message: "入库数量必须大于0",
      trigger: "blur",
    },
  ],
  batch_no: [{ required: true, message: "批次不能为空", trigger: "blur" }],
  ws_code: [{ required: true, message: "库位编码不能为空", trigger: "blur" }],
});
const ruleFormRef = ref();

const submitForm = async () => {
  const vaildateRes = await ruleFormRef.value
    .validate((valid: any, fields: any) => {
      for (const keys in fields) {
        if (fields[keys]) {
          let strList: any = keys.split(".")
          let showText = `第${Number(strList[1]) + 1}行：${fields[keys][0].message}`
          // 弹出每个字段的错误提示
          ElMessage.warning(showText);
          ruleFormRef.value.scrollToField(keys);
          break;
        }
      }
    })
    .catch((err: Error) => {
      console.log("err", err);
    });
  return vaildateRes;
};

interface SummaryMethodProps<T = Product> {
  columns: TableColumnCtx<T>[];
  data: T[];
}

interface Product {
  in_num: number;
}

const getSummaries = (param: SummaryMethodProps) => {
  const { columns, data } = param;
  const sums: string[] = [];
  columns.forEach((column, index) => {
    if (index === 0) {
      //如果是第一列，则最后一行展示为“总计”两个字
      sums[index] = "合计";
    } else {
      let propList = ["in_num"];
      if (propList.includes(column.property)) {
        const values = data.map((item) => item[column.property as keyof Product]);
        if (!values.every((value) => Number.isNaN(value))) {
          let totalRes = values.reduce((prev, curr) => {
            const prevValue = Number(prev);
            const value = Number(curr);
            if (!Number.isNaN(value)) {
              return prevValue + value;
            } else {
              return prevValue;
            }
          }, 0);
          sums[index] = totalRes.toFixed(0);
        }
      } else {
        sums[index] = "";
      }
    }
  });
  return sums;
};

defineExpose({
  validatorForm,
  addFormData,
  tableFarm,
  editId,
  submitForm,
});

onMounted(() => {
  getFactoryCodeList();
  getWlData();
  editId.value = props.id || "";
  if (editId.value) {
    getEditTap(editId.value);
    return;
  }
  getWscodeList();
});
</script>
<template>
  <div class="">
    <div class="mb-4">
      <div class="paragraph-content mb-4">
        <p class="paragraph-title">基础信息</p>
      </div>
      <PlusForm ref="PlusFormRef" :rules="addRules" v-model="addFormData" labelWidth="110" label-position="right"
        :columns="addColumns" :row-props="{ gutter: 20 }" :col-props="{ span: 12 }" :hasFooter="false">
        <template #plus-field-pro_no>
          <el-input v-model="addFormData.pro_no" placeholder="请输入生产订单" @input="checkChinese"></el-input>
        </template>
        <template #plus-field-goods_id>
          <el-select-v2 :props="selectProps" v-model="addFormData.goods_id" :options="wlSelectList" filterable
            placeholder="请选择物料信息" size="large" style="width: 100%" value-key="id" @change="choiceChange"></el-select-v2>
        </template>
        <template #plus-field-file_info>
          <PdfImgUpload :file_info="addFormData.file_info" @fileChange="bindFile"></PdfImgUpload>
        </template>
      </PlusForm>
    </div>
    <div>
      <div class="paragraph-content mb-2">
        <p class="paragraph-title">入库信息</p>
      </div>
      <div class="tableBoxOne">
        <el-form ref="ruleFormRef" :model="tableFarm" label-width="auto">
          <pure-table ref="prueTableRef" row-key="id" :data="tableFarm.tableData" :columns="inColumns"
            :loading="tableLoading" border adaptive :adaptiveConfig="{ offsetBottom: 260 }" style="height: 700px;"
            header-cell-class-name="table-gray-header" show-summary :summary-method="getSummaries">
            <template #title_in_num>
              <span>
                <span style="color: red; margin-top: 4px">*</span>
                入库数量
              </span>
            </template>
            <template #title_batch_no>
              <span>
                <span style="color: red; margin-top: 4px">*</span>
                批次
              </span>
            </template>
            <template #title_box_serial_number_start>
              <span>
                <span style="color: red; margin-top: 4px">*</span>
                箱序列号
              </span>
            </template>
            <template #title_ws_code>
              <span>
                <span style="color: red; margin-top: 4px">*</span>
                库位编码
              </span>
            </template>
            <template #barcode="{ row }">
              <span :style="`color: ${row.barcode ? '' : '#aaaaaa'}`">
                {{ row.barcode ? row.barcode : "请选择物料信息" }}
              </span>
            </template>
            <template #title="{ row }">
              <span :style="`color: ${row.title ? '' : '#aaaaaa'}`">
                {{ row.title ? row.title : "请选择物料信息" }}
              </span>
            </template>
            <template #in_num="{ row, $index }">
              <el-form-item :prop="`tableData.${$index}.in_num`" :rules="Tablerules.in_num">
                <el-input-number style="width: 125px" v-model="row.in_num" :precision="0" :step="1" />
              </el-form-item>
            </template>
            <template #batch_no="{ row, $index }">
              <el-form-item :prop="`tableData.${$index}.batch_no`" :rules="Tablerules.batch_no">
                <el-input v-model="row.batch_no" style="width: 140px" placeholder="请输入批次" clearable />
              </el-form-item>
            </template>
            <template #box_serial_number_start="{ row, $index }">
              <div class="boxNumber">
                <el-form-item :prop="`tableData.${$index}.box_serial_number_start`" :rules="[
                  { required: true, message: '开始箱号不能为空', trigger: 'blur' },
                  {
                    type: 'number',
                    min: 1,
                    message: '开始箱号必须大于0',
                    trigger: 'blur',
                  },
                  {
                    type: 'number',
                    min: 1,
                    max: row.box_serial_number_end ? row.box_serial_number_end - 1 : undefined,
                    message: `开始箱号必须小于结束箱号`,
                    trigger: 'blur',
                  },
                ]">
                  <el-input-number style="width: 150px" v-model="row.box_serial_number_start" :precision="0"
                    :step="1" />
                </el-form-item>
                <div style="width: 6px; height: 1px; background: #000; margin: 0px 8px"></div>
                <el-form-item :prop="`tableData.${$index}.box_serial_number_end`" :rules="[
                  { required: true, message: '结束箱号不能为空', trigger: 'blur' },
                  {
                    type: 'number',
                    min: 1,
                    message: '结束箱号必须大于0',
                    trigger: 'blur',
                  },
                  {
                    type: 'number',
                    min: row.box_serial_number_start ? row.box_serial_number_start + 1 : null,
                    message: `结束箱号必须大于开始箱号`,
                    trigger: 'blur',
                  },
                ]">
                  <el-input-number style="width: 150px" v-model="row.box_serial_number_end" :precision="0" :step="1" />
                </el-form-item>
              </div>
            </template>
            <template #ws_code="{ row, $index }">
              <el-form-item :prop="`tableData.${$index}.ws_code`" :rules="Tablerules.ws_code">
                <el-select v-model="row.ws_code" clearable placeholder="请选择库位编码" style="width: 150px"
                  @change="changekwbmTap($event, $index)">
                  <el-option v-for="item in inventoryCodeList" :key="item.ws_code" :label="item.ws_code"
                    :value="item.ws_code"></el-option>
                </el-select>
              </el-form-item>
            </template>
            <template #ws_code_name="{ row, $index }">
              <el-select v-model="row.ws_code_name" clearable placeholder="请选择库位名称" style="width: 150px"
                @change="changekwbmTweTap($event, $index)">
                <el-option v-for="item in row.inventoryName" :key="item.ws_code_name" :label="item.ws_code_name"
                  :value="item.ws_code_name"></el-option>
              </el-select>
            </template>
            <template #site="{ row }">
              <span :style="`color: ${row.site ? '' : '#aaaaaa'}`">
                {{ row.site ? row.site : "暂无数据" }}
              </span>
            </template>
            <template #operation="{ row, $index }">
              <el-button type="primary" link @click="addTap">添加</el-button>
              <el-button type="danger" link @click="detele($index)">删除</el-button>
            </template>
          </pure-table>
        </el-form>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.tableBoxOne {
  width: 100%;

  :deep(.el-form-item--default) {
    margin-bottom: 0px !important;
  }
}

.boxNumber {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>
