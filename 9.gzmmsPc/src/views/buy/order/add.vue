<script setup lang="ts">
import { Delete, Plus } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import { dayjs } from "element-plus";
import { debounce } from "@pureadmin/utils";
import type { FieldValues, PlusColumn } from "plus-pro-components";
// 引入获取采购单详情api
import { orderDetailApi } from "@/api/buy/order/index";
//引入表格类型和emit类型
import type { IAddEmit, IOrderAddTable, ProcureImportType } from "@/api/buy/order/types";
// 引入获取货品列表API,供应商列表API
import { getLabelGoodsApi, getSupListApi } from "@/api/common/index";
// 引入类型
import type { IGoodsItem, ISupItem } from "@/api/common/types";
import { localStorage } from "@/utils/localStorage";
import { formartDate } from "@/utils/validate";
import GoodsBatch from "@/components/BatchSelect/GoodsBatch.vue";
// 引入选择部门自定义组件
import DeptSelect from "@/components/DeptSelect/index.vue";
import ExcelUpload from "@/components/Upload/ExcelUpload.vue";
import PdfImgUpload from "@/components/Upload/PdfImgUpload.vue";
// 使用hooks监听扫码枪
import scanHooks from "@/hooks/scanCode";
import { useVxeTable } from "@/hooks/table";
// 引入获取部门列表的hooks
import { deptListHooks } from "@/hooks";
import { useOrderList } from "./utils/hook";

defineOptions({
  name: "BuyOrderAdd",
});

enum ETitle {
  "新建采购单" = 1,
  "编辑采购单",
}

interface Props {
  listId: number; //采购单id
  editFrom: number; //从哪个组件进入add编辑页的标识, 1是从list组件过去,2是detail组件过去, 0是pre组件返回过去的
}

const props = withDefaults(defineProps<Props>(), {
  listId: 0,
  editFrom: 0,
});

// 获取hooks中的变量 并且传入处理扫码后的事件
let { input_barcode } = scanHooks(getBarcodeInfo);
const { departmentList } = deptListHooks();
const state = reactive({
  form: {
    goods: [] as IOrderAddTable[],
    delivery_time: "", //交货日期
    sup_name: undefined, //供应商名称
    contract_no: "", //合同编号
    submit_time: dayjs().format("YYYY-MM-DD"), //提交日期
    dept_id: 0, //需求部门id
    demand_date: dayjs().format("YYYY-MM"), //需求月份
  },
  note: "",
  purpose: "", //采购事由
  file_info: {
    src: "",
    name: "",
  },
  pageType: 1, //1是新建,2是编辑
  tableLoading: false,
  // goodsList: [] as IGoodsItem[], //货品列表数据
  supList: [] as ISupItem[], //供应商列表数据
  drawerShow: false, //抽屉弹窗开关
  selectLoading: false, //供应商选择列表加载状态开关
  uploadShow: false,
});
const {
  // editProp,
  note,
  file_info,
  form,
  pageType,
  tableLoading,
  // goodsList,
  supList,
  drawerShow,
  selectLoading,
  uploadShow,
  purpose,
} = toRefs(state);

const { goods } = toRefs(state.form);
const formRef = ref<FormInstance>();

const { cellClick } = useVxeTable({
  formRef,
  selectChange,
  sup_list: supList,
  selectLoading,
  visibleChange,
  bindInputBlur,
});

const rules = reactive<FormRules>({
  title: [
    {
      required: true,
      message: "请选择名称",
      trigger: "change",
    },
  ],
  num: [
    {
      required: true,
      message: "请输入数量",
      trigger: "blur",
    },
  ],
  price: [
    {
      required: true,
      message: "请输入单价",
      trigger: ["blur", "change"],
    },
  ],
  sup_name: [
    {
      required: true,
      message: "请选择供应商",
      trigger: "change",
    },
  ],
});

const batchSelectRef = ref<InstanceType<typeof GoodsBatch>>();

// 基于类型
const emit = defineEmits<{
  (e: "aboutAdd", data: IAddEmit): void;
}>();

const barcodeArr = computed(() => {
  return goods.value.map((item) => {
    return item.barcode;
  });
});

const immediateDebounce = debounce(handleInputBtn, 1000, true);

const { formColumns, inputStep } = useOrderList({
  selectSubmitDate,
  selectDate,
  immediateDebounce,
});

// 导入货品触发的事件
function handleUpload(importData: ProcureImportType[]) {
  importData.forEach((item, index) => {
    const barcode = item.barcode;
    let findRes = goods.value.find((newitem) => {
      return newitem.barcode == barcode;
    });
    goods.value.push({
      dept_id: 0,
      submit_time: dayjs().format("YYYY-MM-DD"),
      goods_id: item.id,
      barcode: item.barcode,
      title: item.title,
      spec: item.spec,
      price: item.purchase_price ?? "",
      num: item.num,
      sub_total:
        item.num && item.purchase_price ? impomrtCountSubtotal(item.num, item.purchase_price) : "",
      sup_name: !findRes ? item.sup_name : "",
      supplier_id: !findRes ? (item.supplier_id as number) : 0,
      delivery_time: "",
      contract_no: "",
      note: "",
      measure_name: item.measure_name,
      brand: item.brand,
      class_name: item.class_name,
    });
  });
}
function impomrtCountSubtotal(num: string, price: string) {
  let sub_total = parseFloat(num) * parseFloat(price);
  return sub_total.toFixed(2);
}

// 顶部选择供应商触发事件
function selectSupName(index: number) {
  let supItem = supList.value[index];
  console.log("supItem", supItem);
  if (supItem) {
    let barcodeList = goods.value.map((item) => {
      return item.barcode;
    });

    barcodeList = removeDuplicates(barcodeList);

    console.log("barcodeList", barcodeList);

    goods.value.forEach((item) => {
      if (barcodeList.includes(item.barcode)) {
        item.sup_name = supItem.name;
        item.supplier_id = supItem.id;
      }
    });
    console.log("goods.value", goods.value);
  }
}
function removeDuplicates(arr: string[]) {
  const once = new Set();
  const multiple = new Set();
  for (const x of arr) {
    if (multiple.has(x)) continue; // x 之前出现过多次，跳过
    if (once.delete(x)) {
      // x 之前出现过一次，删除并移入 multiple
      multiple.add(x);
    } else {
      // x 之前没有出现，移入 once
      once.add(x);
    }
  }
  return [...once] as string[];
}

// 顶部选择需求部门
function selectDept(val: any) {
  // console.log("val", val);
  goods.value.forEach((item) => {
    item.dept_id = val ?? 0;
  });
}

// 顶部选择提交日期触发事件
function selectSubmitDate(val: string) {
  goods.value.forEach((item) => {
    item.submit_time = val ?? "";
  });
}

// 顶部选择交货日期触发事件
function selectDate(val: string) {
  goods.value.forEach((item) => {
    item.delivery_time = val ?? "";
  });
  // console.log("goods.value", goods.value);
}

function handleInputBtn() {
  console.log("触发了111", form.value);
  inputStep.value = true;
  goods.value.forEach((item) => {
    item.contract_no = form.value.contract_no;
  });

  setTimeout(() => {
    inputStep.value = false;
  }, 1000);
}

// 单元格点击删除
const handleDelete = (row: any, index: number) => {
  goods.value.splice(index, 1);
  console.log("goods.value", goods.value);
};

// 点击添加按钮
const handleAdd = () => {
  console.log("点击了添加");
  // formRef.value?.validate((valid, fields) => {
  //   if (valid) {
  //     console.log("submit!");
  //     goods.value.push({
  //       barcode: "",
  //       title: "",
  //       spec: "",
  //       price: "",
  //       num: "",
  //       sub_total: "",
  //       sup_name: "",
  //       delivery_time: "",
  //       contract_no: "",
  //       note: "",
  //       measure_name: "",
  //       brand: "",
  //       class_name: "",
  //     });
  //   } else {
  //     console.log("error submit!", fields);
  //     return false;
  //   }
  // });
  goods.value.push({
    dept_id: 0,
    submit_time: dayjs().format("YYYY-MM-DD"),
    barcode: "",
    title: "",
    spec: "",
    price: "",
    num: "",
    sub_total: "",
    sup_name: "",
    supplier_id: 0,
    delivery_time: "",
    contract_no: "",
    note: "",
    measure_name: "",
    brand: "",
    class_name: "",
    goods_id: 0,
  });
  // console.log("goods.value",goods.value)
};

// 点击批量添加
const handleBatchAdd = () => {
  drawerShow.value = true;
};

// 监听批量添加抽屉弹窗子组件的 change事件 回调,拿到选择的商品
const batchSelectchange = (batchSelectData: IGoodsItem[]) => {
  tableLoading.value = true;
  console.log("selectData", batchSelectData);
  let dataLength = batchSelectData.length;
  batchSelectData.forEach((item, index) => {
    const barcode = item.barcode;
    let findRes = goods.value.find((newitem) => {
      return newitem.barcode == barcode;
    });

    goods.value.push({
      dept_id: 0,
      submit_time: dayjs().format("YYYY-MM-DD"),
      goods_id: item.id,
      barcode: item.barcode,
      title: item.title,
      spec: item.spec,
      price: item.purchase_price ?? "",
      num: "",
      sub_total: "",
      sup_name: !findRes ? item.sup_name : "",
      supplier_id: !findRes ? (item.supplier_id as number) : 0,
      delivery_time: "",
      contract_no: "",
      note: "",
      measure_name: item.measure_name,
      brand: item.brand,
      class_name: item.class_name,
    });
  });
  batchSelectRef.value?.setStatus();
  tableLoading.value = false;
  ElMessage.success(`已批量添加${dataLength}条商品`);
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
    console.log("arr", arr);
    // 2. 拿到相同barcode数据中的所有供应商id,sup_id
    let supIds = arr.map((item) => {
      return item.supplier_id;
      // return item.sup_name;
    });
    console.log("supIds", supIds);
    // 3. 遍历供应商列表,如果包含这些供应商id则设置disable为true
    supList.value.forEach((item) => {
      if (supIds.includes(item.id)) {
        item.disable = true;
      }
      // if (supIds.includes(item.name)) {
      //   item.disable = true;
      // }
    });
    selectLoading.value = false;
  } else {
    // 下拉框 隐藏时,则将所有设为true的disable该为false,重置
    selectLoading.value = false;
    supList.value.forEach((item) => {
      if (item.disable) item.disable = false;
    });
  }
}

// 监听采购数据和采购单价的失去焦点事件
function bindInputBlur(row: any) {
  const number = Number(row.num);
  const price = row.price;
  if (number && price) {
    row.sub_total = (number * parseFloat(row.price)).toFixed(2);
  }
}

// select下拉选择框的选择触发事件
function selectChange(item: IGoodsItem, row: any) {
  const barcode = item.barcode;
  let findRes = goods.value.find((item) => {
    return item.barcode == barcode;
  });
  if (!findRes) {
    row.supplier_id = item.supplier_id;
    row.sup_name = item.sup_name;
  }

  row.goods_id = item.id;
  row.title = item.title;
  row.barcode = item.barcode;
  row.spec = item.spec;
  row.measure_name = item.measure_name;
  row.class_name = item.class_name;
  row.brand = item.brand;
  row.price = item.purchase_price ?? "";

  const number = Number(row.num);
  const price = row.price;
  if (number && price) {
    row.sub_total = (number * parseFloat(row.price)).toFixed(2);
  } else {
    row.sub_total = "";
  }
  // console.log("row",row)
  // row.supplier_id = item.supplier_id;
  // row.sup_name = item.sup_name;
  console.log("goods.value", goods.value);
}

// 点击取消
const handeleCancel = () => {
  if (props.editFrom == 2) {
    // 如果editFrom为1 表示是从 详情页进来的
    emit("aboutAdd", { val: 3 });
  } else {
    emit("aboutAdd", { val: 1 });
  }

  if (pageType.value == 1) {
    // 当前是新建页面时,点击取消,将数据保存到本地
    let buyOrderData = {
      goods: goods.value,
      note: note.value,
      file_info: file_info.value,
    };
    localStorage.set("buyOrderData", buyOrderData);
  }
};
// 点击下一步
const hanleNext = () => {
  if (goods.value.length < 1) {
    ElMessage.warning("请您先添加数据");
    return;
  }

  formRef.value?.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
      emit("aboutAdd", {
        val: 2,
        preInfo: {
          demand_date: form.value.demand_date,
          id: props.listId,
          goods: goods.value,
          note: note.value,
          purpose: purpose.value,
          file_info: file_info.value,
        },
      });
    } else {
      ElMessage.warning("加*列表项请填写完整");
      return false;
    }
  });
};

// 选择文件改变
const bindFile = (file: { name: string; src: string }) => {
  console.log("file", file);
  file_info.value = file;
};

const headerTitle = computed(() => {
  return ETitle[pageType.value];
});

// 编辑时 请求详情数据
const getDetail = async (id: number) => {
  try {
    tableLoading.value = true;
    const result = await orderDetailApi({ id });
    form.value.demand_date = result.data.demand_date;
    note.value = result.data.note;
    file_info.value = result.data.file_info;
    purpose.value = result.data.purpose;
    goods.value = result.data.goods;
    goods.value.forEach((item) => {
      item.delivery_time = formartDate(item.delivery_time);
      item.submit_time = formartDate(item.submit_time);
    });
    // getData();
  } finally {
    tableLoading.value = false;
  }
};

//  获取供应商列表
const getSupList = async () => {
  const supResult = await getSupListApi();
  supList.value = supResult.data.list;
};

async function getBarcodeInfo() {
  console.log("input_code", input_barcode.value);
  let data = {
    content: input_barcode.value,
    document_type: 1, //采购单 1
  };

  const result = await getLabelGoodsApi(data);
  ElMessage.success("扫描成功");
  const findList = result.data.list;

  findList.forEach((item: any, index: number) => {
    const barcode = item.barcode;
    let findRes = goods.value.find((newitem) => {
      return newitem.barcode == barcode;
    });

    goods.value.push({
      dept_id: 0,
      submit_time: dayjs().format("YYYY-MM-DD"),
      goods_id: item.id,
      barcode: item.barcode,
      title: item.title,
      spec: item.spec,
      price: item.purchase_price ?? "",
      num: "",
      sub_total: "",
      sup_name: !findRes ? item.sup_name : "",
      supplier_id: !findRes ? (item.supplier_id as number) : 0,
      delivery_time: "",
      contract_no: "",
      note: "",
      measure_name: item.measure_name,
      brand: item.brand,
      class_name: item.class_name,
    });
    ElMessage.info(`成功添加${findList.length}条商品`);
  });
}

const handleChange = (values: FieldValues, prop: PlusColumn) => {
  console.log(values, "change");
};

onActivated(() => {
  // editFrom: 0预览,1list,2详情,pageType:1新建,2编辑
  if (props.editFrom != 0 && pageType.value == 1) {
    // 如果不是从预览页返回且是新建页面
    // getData();
    getSupList();
  }
  /*
    当是编辑页时需要判断
    props.editFrom值来判断
    是否获取详情数据,如果为0从pre页面返回的则不获取
  */
  if (pageType.value == 2 && props.editFrom) {
    getDetail(props.listId);
  }
});

watch(
  () => props.listId,
  (newValue, oldValue) => {
    console.log("listId变了", newValue, oldValue);
    if (newValue) {
      console.log("newValue存在");
      pageType.value = 2;
      // getDetail(newValue);
    } else {
      console.log("newValue不存在");
      pageType.value = 1;
      goods.value = [];
      note.value = "";
      file_info.value = {
        src: "",
        name: "",
      };
      if (props.editFrom == 1) {
        // 新建页面, 且从list页面进入的
        let buyOrderData = localStorage.get("buyOrderData");
        if (buyOrderData) {
          goods.value = buyOrderData.goods;
          note.value = buyOrderData.note;
          file_info.value = buyOrderData.file_info;
        }
      }
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="app-container">
    <div class="app-card" v-loading="tableLoading">
      <div class="header-title">
        <span>{{ headerTitle }}</span>
        <el-button type="primary" class="ml-[20px]" @click="uploadShow = true">
          <template #icon>
            <i-ep-Upload></i-ep-Upload>
          </template>
          导入货品
        </el-button>
      </div>
      <PlusForm
        v-model="form"
        :columns="formColumns"
        :hasFooter="false"
        :row-props="{
          gutter: 20,
        }"
        :col-props="{
          span: 8,
        }"
        label-width="90"
        label-position="right"
        @change="handleChange"
      >
        <template #plus-field-dept_id>
          <dept-select
            :department-list="departmentList"
            v-model="form.dept_id"
            @change="selectDept"
          ></dept-select>
        </template>
        <template #plus-field-sup_name>
          <el-select
            v-model="form.sup_name"
            placeholder="请选择供应商"
            filterable
            default-first-option
            @change="selectSupName"
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in supList"
              :key="item.id"
              :label="item.name"
              :value="index"
              :disabled="item.disable"
            ></el-option>
          </el-select>
        </template>
      </PlusForm>

      <el-form ref="formRef" :model="form" @submit.native.prevent>
        <!-- <div class="flex">
          <el-form-item label="供应商">
            <el-select
              v-model="form.sup_name"
              placeholder="请选择供应商"
              filterable
              default-first-option
              @change="selectSupName"
            >
              <el-option
                v-for="(item, index) in supList"
                :key="item.id"
                :label="item.name"
                :value="index"
                :disabled="item.disable"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="需求部门" prop="dept_id" class="ml-[20px]">
            <dept-select
              :department-list="departmentList"
              v-model="form.dept_id"
              @change="selectDept"
            ></dept-select>
          </el-form-item>
          <el-form-item label="提交日期" class="ml-[20px]">
            <el-date-picker
              style="width: 100%"
              v-model="form.submit_time"
              type="date"
              placeholder="请选择日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              @change="selectSubmitDate"
              :clearable="false"
            />
          </el-form-item>
          <el-form-item label="交货日期" class="ml-[20px]">
            <el-date-picker
              style="width: 100%"
              v-model="form.delivery_time"
              type="date"
              placeholder="请选择日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              @change="selectDate"
            />
          </el-form-item>
          <el-form-item label="合同编号" class="ml-[20px]">
            <el-input v-model="form.contract_no" placeholder="请输入合同编号">
              <template #append>
                <el-tooltip effect="dark" content="点击同步到下方表格" placement="top-start">
                  <el-button link type="primary" @click="immediateDebounce">
                    <template #icon>
                      <i-ep-Refresh :class="{ 'step-icon': inputStep }"></i-ep-Refresh>
                    </template>
                  </el-button>
                </el-tooltip>
              </template>
            </el-input>
          </el-form-item>
        </div> -->

        <vxe-table
          :data="goods"
          border
          :column-config="{ resizable: true }"
          :scroll-y="{ enabled: true }"
          :scroll-x="{ enabled: true, gt: 80 }"
          height="720"
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
          <vxe-column field="spec" title="规格型号" min-width="100">
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
          <vxe-column field="class_name" title="分类" width="90">
            <template #default="scope">
              <span class="block pb-4">{{ scope.row.class_name || "-" }}</span>
            </template>
          </vxe-column>
          <vxe-column field="measure_name" title="单位" width="90">
            <template #default="scope">
              <span class="block pb-4">{{ scope.row.measure_name || "-" }}</span>
            </template>
          </vxe-column>
          <vxe-column field="num" title="采购数量" width="120" :params="{ type: 'input' }">
            <template #header>
              <span class="text-red-500">*</span>
              <span>采购数量</span>
            </template>
            <template #default="scope">
              <el-form-item :prop="`goods.${scope.$rowIndex}.num`" :rules="rules.num">
                <div class="ownInput" :default-placeholder="scope.row.num ? '' : '请输入'">
                  {{ scope.row.num }}
                </div>
              </el-form-item>
            </template>
          </vxe-column>
          <vxe-column field="price" title="采购单价(元)" width="100" :params="{ type: 'input' }">
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
          <vxe-column field="sub_total" title="小计" width="90">
            <template #default="scope">
              <span class="block pb-4">{{ scope.row.sub_total || "-" }}</span>
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
          <vxe-column field="dept_id" title="需求部门" min-width="120">
            <template #default="scope">
              <el-form-item>
                <dept-select :department-list="departmentList" v-model="scope.row.dept_id" />
              </el-form-item>
            </template>
          </vxe-column>
          <vxe-column
            field="submit_time"
            title="提交日期"
            width="160"
            :params="{ type: 'selectDate' }"
          >
            <template #default="scope">
              <el-form-item>
                <div
                  class="ownInput"
                  :default-placeholder="scope.row.submit_time ? '' : '请选择提交日期'"
                >
                  {{ scope.row.submit_time }}
                </div>
              </el-form-item>
            </template>
          </vxe-column>
          <vxe-column
            field="delivery_time"
            title="交货期"
            width="160"
            :params="{ type: 'selectDate' }"
          >
            <template #default="scope">
              <el-form-item>
                <div
                  class="ownInput"
                  :default-placeholder="scope.row.delivery_time ? '' : '请选择交货日期'"
                >
                  {{ scope.row.delivery_time }}
                </div>
              </el-form-item>
            </template>
          </vxe-column>
          <vxe-column
            field="contract_no"
            title="合同编号"
            min-width="100"
            :params="{ type: 'input' }"
          >
            <template #default="scope">
              <el-form-item>
                <div class="ownInput" :default-placeholder="scope.row.contract_no ? '' : '请输入'">
                  {{ scope.row.contract_no }}
                </div>
              </el-form-item>
            </template>
          </vxe-column>
          <vxe-column field="note" title="备注" min-width="90" :params="{ type: 'input' }">
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
        <div class="purpose absolute left-0">
          <span class="inline-block w-[60px]">采购事由</span>
          <el-input
            style="width: 240px; margin-left: 10px"
            v-model="purpose"
            placeholder="请输入采购事由"
            clearable
            maxlength="200"
          ></el-input>
        </div>
        <el-button type="success" :icon="Plus" @click="handleAdd" class="w-[100px]">添加</el-button>
        <el-button type="primary" :icon="Plus" @click="handleBatchAdd" class="w-[100px]">
          批量添加
        </el-button>
      </div>

      <div class="note mt-[20px]">
        <span class="inline-block w-[60px]">备注</span>
        <el-input
          style="width: 240px; margin-left: 10px"
          v-model="note"
          placeholder="请输入备注"
          clearable
          maxlength="30"
        ></el-input>
      </div>
      <div class="mt-[20px] flex items-center">
        <span class="block mr-[10px]">附件</span>
        <PdfImgUpload :file_info="file_info" @fileChange="bindFile"></PdfImgUpload>
        <!-- <span class="text-[12px] text-gray-400 inline-block ml-[10px]"
          >可上传pdf和图片格式</span
        > -->
      </div>
      <div class="footer-btn mt-[20px] pb-[10px]">
        <el-divider />
        <el-button @click="handeleCancel" class="w-[100px]" size="large">取消</el-button>
        <el-button type="primary" @click="hanleNext" class="w-[100px]" size="large">
          下一步
        </el-button>
      </div>
    </div>

    <GoodsBatch
      v-model="drawerShow"
      @change="batchSelectchange"
      :barcode-list="barcodeArr"
      ref="batchSelectRef"
    ></GoodsBatch>

    <excel-upload
      v-model:visible="uploadShow"
      :download-type="2"
      @upload="handleUpload"
    ></excel-upload>
  </div>
</template>

<style scoped lang="scss">
.text-omit {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.table-class .el-form-item) {
  margin-bottom: 0px;
}
:deep(.el-input-group__append) {
  background-color: var(--el-bg-color);
}
</style>
