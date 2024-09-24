<script setup lang="ts">
import { Delete, Plus } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import { dayjs } from "element-plus";
// 引入深克隆
import { cloneDeep, throttle } from "@pureadmin/utils";
import type { ProcureImportType } from "@/api/buy/order/types";
import { getLabelGoodsApi } from "@/api/common/index";
import type { ICateItem, IGoodsItem, IProcureItem, ISupItem } from "@/api/common/types";
// 引入获取采购单详情api
// import { detailBuyInApi } from "@/api/storage/buy-in";
import { detailOtherInApi } from "@/api/storage/other-in";
// 引入类型
import type { IOtherInGoods } from "@/api/storage/other-in/types";
import { formartDate } from "@/utils/validate";
import GoodsBatch from "@/components/BatchSelect/GoodsBatch.vue";
import OrderSelect from "@/components/SelectDrop/OrderSelect.vue";
import ExcelUpload from "@/components/Upload/ExcelUpload.vue";
import { useVxeTable } from "@/hooks/table";
import { VxeTableInstance } from "vxe-table";

export interface API {
  validateForm: () => Boolean;
  getDetail: (id: number) => void;
  getCodeInfo: () => void;
}

interface Props {
  storageList: ICateItem[]; //仓库列表数据
  // goodsList: IGoodsItem[]; //货品列表数据
  supList: ISupItem[];
  procureList: IProcureItem[]; //采购单列表数据
  pageType: number;
  inputBarcode: string;
}
const props = withDefaults(defineProps<Props>(), {
  storageList: () => [] as ICateItem[],
  // goodsList: () => [] as IGoodsItem[],
  supList: () => [] as ISupItem[],
  procureList: () => [] as IProcureItem[],
  pageType: 1,
  inputBarcode: "",
});

const xTable = ref<VxeTableInstance<IOtherInGoods>>();

const state = reactive({
  formData: {
    goods: [] as IOtherInGoods[],
    in_time: dayjs().format("YYYY-MM-DD"), //入库日期
    in_wh_name: "", //仓库名称
    in_wh_id: 0, //仓库id
    type: 0,
    procure_no: "", //采购单号
    procure_id: undefined as FormNumType, //采购单号id
  },
  drawerShow: false, //抽屉弹窗开关
  selectLoading: false, //供应商选择列表加载状态开关
  storage_list: [] as ICateItem[],
  sup_list: [] as ISupItem[],
  uploadShow: false,
});

const { formData, drawerShow, selectLoading, storage_list, sup_list, uploadShow } = toRefs(state);
const { goods } = toRefs(state.formData);
const rules = reactive<FormRules>({
  title: [
    {
      required: true,
      message: "请选择名称",
      trigger: "change",
    },
  ],
  in_wh_name: [
    {
      required: true,
      message: "请选择入库仓库",
      trigger: "change",
    },
  ],
  sup_name: [
    {
      required: true,
      message: "请选择供应商",
      trigger: "change",
    },
  ],
  price: [
    {
      required: true,
      message: "请输入单价",
      trigger: "blur",
    },
  ],
});
const orderSelecteRef = ref<InstanceType<typeof OrderSelect>>();
const batchSelectRef = ref<InstanceType<typeof GoodsBatch>>();

const formRef = ref<FormInstance>();
const selectWarehouseRef = ref();

const { cellClick } = useVxeTable({
  formRef,
  selectChange,
  sup_list,
  selectLoading,
  visibleChange,
  bindInputBlur,
});

const emit = defineEmits<{
  /** 验证满足条件后,传goods给父组件 */
  (e: "sendData", data: {}): void;
  /** 详情接口获取的总备注和文件信息回传给父组件 */
  (e: "sendInfo", data: {}): void;
  /** 通知父组件接口调用完毕,关闭tableLoading */
  (e: "sendLoad"): void;
  (e: "changeWh", data: { in_wh_id: number }): void;
}>();

/** 选择采购单号触发 */
const orderChange = (index: number) => {
  console.log(index);
  let item = props.procureList[index];
  formData.value.procure_no = item.procure_no;
  formData.value.procure_id = item.id;
};

// 选择入库日期时触发
const selectDateChange = (val: string) => {
  let dateString = transformDate(val);
  goods.value.map((item) => (item.ph_no = dateString));
};

/** 去除日期格式的横线 */
function transformDate(dateString: string) {
  return dateString.replace(/-/g, "");
}

// 导入货品触发的事件
function handleUpload(importData: ProcureImportType[]) {
  // importData.forEach((item) => {
  //   goods.value.push({
  //     goods_id: item.id,
  //     barcode: item.barcode,
  //     title: item.title,
  //     spec: item.spec,
  //     price: item.purchase_price ?? "",
  //     in_num: item.num,
  //     sup_name: "",
  //     delivery_time: "",
  //     contract_no: "",
  //     note: "",
  //     measure_name: item.measure_name,
  //     brand: item.brand,
  //     class_name: item.class_name,
  //     ph_no: transformDate(form.value.in_time),
  //     pro_time: item.pro_time || "",
  //     exp_day: item.exp_day || "",
  //     exp_time: item.exp_time || "",
  //     ws_code: item.ws_code || "",
  //   });
  // });
  let arr = importData.map((item) => {
    return {
      goods_id: item.id,
      barcode: item.barcode,
      title: item.title,
      spec: item.spec,
      price: item.purchase_price ?? "",
      in_num: item.num,
      sup_name: "",
      delivery_time: "",
      contract_no: "",
      note: "",
      measure_name: item.measure_name,
      brand: item.brand,
      class_name: item.class_name,
      ph_no: transformDate(formData.value.in_time),
      pro_time: item.pro_time || "",
      exp_day: item.exp_day || "",
      exp_time: item.exp_time || "",
      ws_code: item.ws_code || "",
    };
  });
  // 阻断 vue 对大数组的监听，避免 vue 绑定大数据造成短暂的卡顿
  const $table = xTable.value;
  if ($table) {
    let data = getVxeTableData();
    let list = data.concat(arr);
    $table.loadData(list);
  }
  // goods.value = getVxeTableData();
}

// 选择入库仓库触发
const selectWarehouse = (val: string) => {
  let val_arr = val.split(",");
  let warehouse_name = val_arr[0];
  let warehouse_id = val_arr[1];
  // form.value.warehouse_name = warehouse_name;
  // form.value.warehouse_id = Number(warehouse_id);
  formData.value.in_wh_name = warehouse_name;
  formData.value.in_wh_id = Number(warehouse_id);
  emit("changeWh", { in_wh_id: formData.value.in_wh_id });
  setTimeout(() => {
    selectWarehouseRef.value?.blur();
  }, 50);
};

// select下拉选择框的选择触发事件
function selectChange(item: IGoodsItem, row: any) {
  row.goods_id = item.id;
  row.title = item.title;
  row.barcode = item.barcode;
  row.spec = item.spec;
  row.measure_name = item.measure_name;
  row.class_name = item.class_name;
  row.brand = item.brand;
  row.exp_day = item.exp_day;
}

// 监听批量添加抽屉弹窗子组件的 change事件 回调,拿到选择的商品
const batchSelectchange = (selectData: IGoodsItem[]) => {
  let dataLength = selectData.length;
  let arr = selectData.map((item) => {
    return {
      goods_id: item.id,
      barcode: item.barcode,
      title: item.title,
      spec: item.spec,
      price: "",
      in_num: "",
      sup_name: "",
      delivery_time: "",
      contract_no: "",
      note: "",
      measure_name: item.measure_name,
      brand: item.brand,
      class_name: item.class_name,
      ph_no: transformDate(formData.value.in_time),
      pro_time: "",
      exp_day: item.exp_day,
      exp_time: "",
      ws_code: "",
    };
  });

  // 阻断 vue 对大数组的监听，避免 vue 绑定大数据造成短暂的卡顿
  const $table = xTable.value;
  if ($table) {
    let data = getVxeTableData();
    let list = data.concat(arr);
    $table.loadData(list);
    nextTick(() => {
      ElMessage.success(`已批量添加${dataLength}条商品`);
    });
  }
  batchSelectRef.value?.setStatus();

  // goods.value = getVxeTableData();
};

// 点击批量添加
const handleBatchAdd = () => {
  drawerShow.value = true;
};

// 选择供应商 触发事件
const supChange = (index: number, row: any) => {
  let item = sup_list.value[index];
  row.sup_name = item.name;
  row.sup_id = item.id;
};

// 供应商下拉框 显示和隐藏时触发
function visibleChange(val: Boolean, row: any) {
  if (val) {
    /*
      val为true的时候表示为显示,显示的时候需要知道当前条码的供应商哪些已经被选择
    */
    selectLoading.value = true;
    let barcode = row.barcode;
    // 1. 拿到当前行的barcode,拿到goods列表中相同barcode的数据
    let arr = goods.value.filter((item) => {
      return item.barcode == barcode;
    });
    // 2. 拿到相同barcode数据中的所有供应商id,sup_id
    let supIds = arr.map((item) => {
      return item.sup_id;
    });
    // 3. 遍历供应商列表,如果包含这些供应商id则设置disable为true
    sup_list.value.forEach((item) => {
      if (supIds.includes(item.id)) {
        item.disable = true;
      }
    });
    selectLoading.value = false;
  } else {
    // 下拉框 隐藏时,则将所有设为true的disable该为false,重置
    selectLoading.value = false;
    sup_list.value.forEach((item) => {
      if (item.disable) item.disable = false;
    });
  }
}

// 点击添加
const handleAdd = () => {
  console.log("点击了添加");
  formRef.value?.validate((valid, fields) => {
    if (valid) {
      console.log("add!");

      let tableData = getVxeTableData();
      tableData.push({
        goods_id: 0,
        barcode: "",
        title: "",
        spec: "",
        price: "",
        in_num: "",
        sup_name: "",
        delivery_time: "",
        contract_no: "",
        note: "",
        measure_name: "",
        brand: "",
        class_name: "",
        ph_no: transformDate(formData.value.in_time),
        pro_time: "",
        exp_day: "",
        exp_time: "",
        ws_code: "",
      });
      xTable.value?.loadData(tableData);
      // goods.value = getVxeTableData();
      // goods.value.push({
      //   goods_id: 0,
      //   barcode: "",
      //   title: "",
      //   spec: "",
      //   price: "",
      //   in_num: "",
      //   sup_name: "",
      //   delivery_time: "",
      //   contract_no: "",
      //   note: "",
      //   measure_name: "",
      //   brand: "",
      //   class_name: "",
      //   ph_no: transformDate(form.value.in_time),
      //   pro_time: "",
      //   exp_day: "",
      //   exp_time: "",
      //   ws_code: "",
      // });
    } else {
      console.log("error add!", fields);
      return false;
    }
  });
};

const handledel = (row: any, index: number) => {
  // let item = goods.value.splice(index, 1);

  // goods.value = goods.value.filter((item, i) => i !== index);
  // const $table = xTable.value;
  // $table?.loadData(goods.value);

  // goods.value.splice(index, 1);
  const $table = xTable.value;
  if ($table) {
    $table.remove(row);
  }
  formRef.value?.clearValidate();
  // goods.value = getVxeTableData();
};

const handleDelete: any = throttle((first, second) => {
  handledel(first, second);
}, 500);

function getVxeTableData() {
  const $table = xTable.value;
  return $table ? $table.getTableData().tableData : [];
}

const getDetail = async (id: number) => {
  try {
    const result = await detailOtherInApi({ id });
    let note = result.data.note;
    let file_info = result.data.file_info;
    formData.value.in_time = formartDate(result.data.in_time);
    formData.value.in_wh_id = result.data.in_wh_id;
    formData.value.in_wh_name = result.data.in_wh_name;
    formData.value.type = result.data.type;
    formData.value.procure_id = result.data.procure_id;
    formData.value.procure_no = result.data.procure_no;
    emit("changeWh", { in_wh_id: formData.value.in_wh_id });
    emit("sendInfo", { file_info, note });
    xTable.value?.loadData(result.data.goods);
    // goods.value = result.data.goods;
    // goods.value = result.data.goods.map((item) => {
    //   return {
    //     ...item,
    //   };
    // });
  } finally {
    emit("sendLoad");
  }
};

// 验证是否满足规则
const validateForm = () => {
  if (goods.value.length < 1) {
    ElMessage.warning("请您先添加数据");
    return false;
  }
  formRef.value?.validate((valid, fields) => {
    if (valid) {
      emit("sendData", {
        ...formData.value,
      });
      return true;
    } else {
      if (!formData.value.in_wh_id) {
        ElMessage.warning("请您先选择入库仓库");
        return false;
      }
      ElMessage.warning("加*列表项请填写完整");
      return false;
    }
  });
};

async function getCodeInfo() {
  let code = props.inputBarcode;
  let data = {
    content: code,
    document_type: 3, //其他入库单 3
  };
  const result = await getLabelGoodsApi(data);
  ElMessage.success("扫描成功");
  const findList = result.data.list;
  let dataLength = findList.length;

  let arr = findList.map((item) => {
    return {
      goods_id: item.id,
      barcode: item.barcode,
      title: item.title,
      spec: item.spec,
      price: "",
      in_num: "",
      sup_name: "",
      delivery_time: "",
      contract_no: "",
      note: "",
      measure_name: item.measure_name,
      brand: item.brand,
      class_name: item.class_name,
      ph_no: transformDate(formData.value.in_time),
      pro_time: "",
      exp_day: item.exp_day,
      exp_time: "",
      ws_code: "",
    };
  });
  let tableData = getVxeTableData();
  let list = tableData.concat(arr);
  xTable.value?.loadData(list);
  // findList.forEach((item) => {
  //   goods.value.push({
  //     goods_id: item.id,
  //     barcode: item.barcode,
  //     title: item.title,
  //     spec: item.spec,
  //     price: "",
  //     in_num: "",
  //     sup_name: "",
  //     delivery_time: "",
  //     contract_no: "",
  //     note: "",
  //     measure_name: item.measure_name,
  //     brand: item.brand,
  //     class_name: item.class_name,
  //     ph_no: transformDate(form.value.in_time),
  //     pro_time: "",
  //     exp_day: "",
  //     exp_time: "",
  //     ws_code: "",
  //   });
  // });
  ElMessage.info(`成功添加${dataLength}条商品`);
}

// 处理扫描的条码
// function getCodeInfo() {
//   if (selectData.value.length == 0) {
//     ElMessage.warning("当前没有可添加的商品数据");
//     return;
//   }
//   let findInfo = selectData.value.find((item) => {
//     return item.barcode == props.inputBarcode;
//   });

//   if (findInfo) {
//     goods.value.push({
//       goods_id: findInfo.id,
//       barcode: findInfo.barcode,
//       title: findInfo.title,
//       spec: findInfo.spec,
//       price: "",
//       in_num: "",
//       sup_name: "",
//       delivery_time: "",
//       contract_no: "",
//       note: "",
//       measure_name: findInfo.measure_name,
//       brand: findInfo.brand,
//       class_name: findInfo.class_name,
//       ph_no: transformDate(form.value.in_time),
//       pro_time: "",
//       exp_day: "",
//       exp_time: "",
//       ws_code: "",
//     });
//   } else {
//     ElMessage.warning(`扫描的条码${props.inputBarcode}商品不在货品列表范围内`);
//     return;
//   }
// }

function bindInputBlur(row: IOtherInGoods) {
  let exp_day = Number(row.exp_day);
  let pro_time = row.pro_time;
  if (exp_day && pro_time) {
    let exp_time = dayjs(pro_time).add(exp_day, "day").format("YYYY-MM-DD");
    row.exp_time = exp_time;
  }
}

defineExpose({
  validateForm: validateForm,
  getDetail: getDetail,
  getCodeInfo: getCodeInfo,
});

watchEffect(() => {
  storage_list.value = cloneDeep(props.storageList);
  sup_list.value = cloneDeep(props.supList);
});
watchEffect(() => {
  goods.value = xTable.value?.getTableData().tableData || [];
});

const barcodeArr = computed(() => {
  return goods.value.map((item) => {
    return item.barcode;
  });
});
</script>
<template>
  <div>
    <el-form ref="formRef" :model="formData">
      <div class="flex">
        <el-button type="primary" class="mr-[20px]" @click="uploadShow = true">
          <template #icon>
            <i-ep-Upload></i-ep-Upload>
          </template>
          导入货品
        </el-button>
        <el-form-item label="入库类型" prop="type" class="mr-4">
          <el-radio-group v-model="formData.type" :disabled="pageType == 2">
            <el-radio :label="0" class="!mr-[14px]">其他入库</el-radio>
            <el-radio :label="1">冲销入库</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="采购单号"
          prop="procure_no"
          class="mr-4"
          v-if="formData.type === 1"
          :rules="[
            {
              required: true,
              message: '请选择采购单号',
              trigger: 'change',
            },
          ]"
        >
          <order-select
            :order-num="formData.procure_no"
            @change="orderChange"
            :list="procureList"
            :isDisabled="pageType == 2"
            ref="orderSelecteRef"
          ></order-select>
        </el-form-item>

        <el-form-item label="入库仓库" prop="in_wh_name" :rules="rules.in_wh_name">
          <el-select
            v-model="formData.in_wh_name"
            placeholder="请选择入库仓库"
            clearable
            filterable
            default-first-option
            @change="selectWarehouse"
            ref="selectWarehouseRef"
          >
            <el-option
              v-for="item in storageList"
              :key="item.id"
              :label="item.name"
              :value="item.name + ',' + item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库日期" class="ml-[20px]">
          <el-date-picker
            style="width: 100%"
            v-model="formData.in_time"
            type="date"
            placeholder="请选择入库日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :clearable="false"
            @change="selectDateChange"
          />
        </el-form-item>
      </div>

      <vxe-table
        border
        keep-source
        ref="xTable"
        height="700"
        :column-config="{ resizable: true }"
        :scroll-y="{ enabled: true }"
        :scroll-x="{ enabled: true, gt: 80 }"
        @cell-click="cellClick"
      >
        <vxe-column type="seq" width="40"></vxe-column>
        <vxe-column field="barcode" title="条码" width="160">
          <template #default="scope">
            <span>{{ scope.row.barcode || "-" }}</span>
          </template>
        </vxe-column>
        <vxe-column field="title" title="名称" width="260" :params="{ type: 'selectTitle' }">
          <template #header>
            <span class="text-red-500">*</span>
            <span>名称</span>
          </template>
          <template #default="scope">
            <el-form-item
              :prop="`goods.${scope.$rowIndex}.title`"
              :rules="rules.title"
              style="width: 100%"
            >
              <div class="ownInput" :default-placeholder="scope.row.title ? '' : '请选择'">
                {{ scope.row.title }}
              </div>
            </el-form-item>
          </template>
        </vxe-column>
        <vxe-column field="spec" title="规格型号" width="100">
          <template #default="scope">
            <span class="block pb-4">
              {{ scope.row.spec || "-" }}
            </span>
          </template>
        </vxe-column>
        <vxe-column field="brand" title="品牌" width="90">
          <template #default="scope">
            <span class="block pb-4">{{ scope.row.brand || "-" }}</span>
          </template>
        </vxe-column>
        <vxe-column field="in_num" title="入库数量" width="120" :params="{ type: 'input' }">
          <template #header>
            <span class="text-red-500">*</span>
            <span>入库数量</span>
          </template>
          <template #default="scope">
            <el-form-item
              :prop="`goods.${scope.$rowIndex}.in_num`"
              :rules="[
                {
                  required: true,
                  message: '请输入入库数量',
                  trigger: 'blur',
                },
                // {
                //   type: 'number',
                //   min: 1,
                //   max: scope.row.old_in_num,
                //   message: `应在1~${scope.row.old_in_num}范围内`,
                //   trigger: 'blur',
                // },
              ]"
            >
              <div class="ownInput" :default-placeholder="scope.row.in_num ? '' : '请输入'">
                {{ scope.row.in_num }}
              </div>
            </el-form-item>
          </template>
        </vxe-column>
        <vxe-column field="sup_name" title="供应商" width="160" :params="{ type: 'selectSup' }">
          <template #header>
            <span class="text-red-500">*</span>
            <span>供应商</span>
          </template>
          <template #default="scope">
            <el-form-item :prop="`goods.${scope.$rowIndex}.sup_name`" :rules="rules.sup_name">
              <div class="ownInput" :default-placeholder="scope.row.sup_name ? '' : '请选择'">
                {{ scope.row.sup_name }}
              </div>
            </el-form-item>
          </template>
        </vxe-column>
        <vxe-column field="measure_name" title="单位" min-width="90">
          <template #default="scope">
            <span class="block pb-4">{{ scope.row.measure_name || "-" }}</span>
          </template>
        </vxe-column>
        <vxe-column
          field="price"
          title="单价(元)"
          width="100"
          :params="{ type: 'input', inputType: 2 }"
        >
          <template #header>
            <span class="text-red-500">*</span>
            <span>单价(元)</span>
          </template>
          <template #default="scope">
            <el-form-item :prop="`goods.${scope.$rowIndex}.price`" :rules="rules.price">
              <div class="ownInput" :default-placeholder="scope.row.price ? '' : '请输入'">
                {{ scope.row.price }}
              </div>
            </el-form-item>
          </template>
        </vxe-column>
        <vxe-column field="class_name" title="分类" min-width="90">
          <template #default="scope">
            <span class="block pb-4">{{ scope.row.class_name || "-" }}</span>
          </template>
        </vxe-column>
        <vxe-column field="ph_no" title="批次/日期" width="160" :params="{ type: 'input' }">
          <template #default="scope">
            <el-form-item>
              <div class="ownInput" :default-placeholder="scope.row.ph_no ? '' : '请输入'">
                {{ scope.row.ph_no }}
              </div>
            </el-form-item>
          </template>
        </vxe-column>
        <vxe-column field="ws_code" title="库位" width="120" :params="{ type: 'input' }">
          <template #default="scope">
            <el-form-item>
              <div class="ownInput" :default-placeholder="scope.row.ws_code ? '' : '请输入'">
                {{ scope.row.ws_code }}
              </div>
            </el-form-item>
          </template>
        </vxe-column>
        <vxe-column
          field="pro_time"
          title="生产日期"
          width="160"
          :params="{ type: 'selectDate', dateType: 1 }"
        >
          <template #default="scope">
            <el-form-item>
              <div
                class="ownInput"
                :default-placeholder="scope.row.pro_time ? '' : '请选择生产日期'"
              >
                {{ scope.row.pro_time }}
              </div>
            </el-form-item>
          </template>
        </vxe-column>
        <!--  :params="{ type: 'input', inputType: 5 }" -->
        <vxe-column field="exp_day" title="保质期(天)" width="160">
          <!-- <template #default="scope">
            <el-form-item>
              <div
                class="ownInput"
                :default-placeholder="scope.row.exp_day ? '' : '请输入保质期(天)'"
              >
                {{ scope.row.exp_day }}
              </div>
            </el-form-item>
          </template> -->
          <template #default="scope">
            <span class="block pb-4">{{ scope.row.exp_day || "-" }}</span>
          </template>
        </vxe-column>
        <vxe-column
          field="exp_time"
          title="到期日期"
          width="160"
          :params="{ type: 'selectDate', dateType: 2 }"
        >
          <template #default="scope">
            <el-form-item>
              <div
                class="ownInput"
                :default-placeholder="scope.row.exp_time ? '' : '请选择到期日期'"
              >
                {{ scope.row.exp_time }}
              </div>
            </el-form-item>
          </template>
        </vxe-column>
        <vxe-column
          field="note"
          title="备注"
          min-width="90"
          :params="{ type: 'input', inputType: 6 }"
        >
          <template #default="scope">
            <el-form-item>
              <div class="ownInput" :default-placeholder="scope.row.note ? '' : '请输入'">
                {{ scope.row.note }}
              </div>
            </el-form-item>
          </template>
        </vxe-column>
        <vxe-column title="操作" fixed="right" width="80">
          <template #default="scope">
            <el-button
              class="w-[60px]"
              type="danger"
              :icon="Delete"
              @click="handleDelete(scope.row, scope.$rowIndex)"
            >
              删除
            </el-button>
          </template>
        </vxe-column>
      </vxe-table>
    </el-form>
    <div class="flex justify-center mt-[20px] relative">
      <slot name="note"></slot>
      <el-button type="success" :icon="Plus" @click="handleAdd" class="w-[100px]">添加</el-button>
      <el-button type="primary" :icon="Plus" @click="handleBatchAdd" class="w-[100px]">
        批量添加
      </el-button>
    </div>
    <GoodsBatch
      v-model="drawerShow"
      @change="batchSelectchange"
      :barcode-list="barcodeArr"
      ref="batchSelectRef"
    ></GoodsBatch>
    <excel-upload
      v-model:visible="uploadShow"
      :download-type="3"
      @upload="handleUpload"
    ></excel-upload>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-radio__input.is-disabled.is-checked .el-radio__inner::after) {
  background-color: var(--el-color-primary);
  width: 8px;
  height: 8px;
}
.text-omit {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
// -webkit-user-modify: read-write-plaintext-only !important;
.ownInput {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-width: 1px;
  border-style: solid;
  border-color: #e5e7eb;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  width: 100%;
  padding: 0 8px;
  box-sizing: border-box;

  &::before {
    content: attr(default-placeholder);
    color: var(--el-input-text-color, var(--el-text-color-placeholder));

    cursor: pointer;
  }
}
</style>
