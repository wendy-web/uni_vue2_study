<!-- 盘点单新建/编辑页 -->
<script setup lang="ts">
import { Delete, Plus } from "@element-plus/icons-vue";
import type { ElTable, FormInstance, FormRules } from "element-plus";
import { dayjs } from "element-plus";
import { getLabelInfoApi } from "@/api/common/index";
import { getInstockApi } from "@/api/common/index";
import type { ICateItem, IinStockItem } from "@/api/common/types";
// 引入获取采购单详情api
import { detailCheckApi } from "@/api/storage/check";
import { CheckGoods, ICheckAdd, ICheckAddInfo } from "@/api/storage/check/types";
import type { IAddEmit } from "@/api/storage/stotypes";
import { formartDate } from "@/utils/validate";
import InStoBatchSelect, { API as batchApi } from "@/components/BatchSelect/InStoBatchSelect.vue";
import PdfImgUpload from "@/components/Upload/PdfImgUpload.vue";
// 使用hooks监听扫码枪
import scanHooks from "@/hooks/scanCode";
// 使用uniqueHooks
import { useUniqueHooks } from "@/hooks/unique";

defineOptions({
  name: "StoCheckAdd",
});

enum ETitle {
  "新建盘点单" = 1,
  "编辑盘点单",
}

interface Props {
  storageList: ICateItem[]; //仓库列表数据
  listId: number; //采购单id
  editFrom: number; //从哪个组件进入add编辑页的标识, 1是从list组件过去,2是detail组件过去, 0是pre组件返回过去的
}
type StorageId = undefined | number;

const props = withDefaults(defineProps<Props>(), {
  storageList: () => [] as ICateItem[],
  listId: 0,
  editFrom: 0,
});

// 获取hooks中的变量
let { input_barcode } = scanHooks(getBarcodeInfo);

const state = reactive({
  form: {
    goods: [] as ICheckAdd[], //待盘商品数据
    warehouse_id: undefined as StorageId, //仓库id
    inventory_time: dayjs().format("YYYY-MM-DD"), //盘点日期
  },
  // 需要编辑的属性
  // editProp: ["inv_num", "note"],
  note: "",
  file_info: {
    src: "",
    name: "",
  },
  pageType: 1, //1是新建,2是编辑
  tableLoading: false,
  stockType: 1,
  stockOptions: [
    {
      label: "大于0",
      value: 1,
    },
    {
      label: "等于0",
      value: 2,
    },
    {
      label: "全部",
      value: 3,
    },
  ],
  originalGoods: [] as ICheckAdd[],
});
const {
  // editProp,
  note,
  file_info,
  form,
  pageType,
  tableLoading,
} = toRefs(state);
const { goods } = toRefs(state.form);

let { stockIdList } = useUniqueHooks<ICheckAdd>(goods);

const formRef = ref<FormInstance>();
/** 是否一键导入了 */
const importAllStatus = ref(false);
const checkTableRef = ref<InstanceType<typeof ElTable>>();
const batchSelectRef = ref<batchApi | null>(null);

const rules = reactive<FormRules>({
  warehouse_id: [
    {
      required: true,
      message: "请选择调出仓库",
      trigger: "change",
    },
  ],
});
const drawerShow = ref(false); //批量选择弹窗开关
const amount = ref(0); //总条数

// 基于类型
const emit = defineEmits<{
  (e: "aboutAdd", data: IAddEmit<ICheckAddInfo>): void;
}>();

// 选择盘点仓库的事件
const checkSelectChange = (val: string) => {
  console.log("选择盘点仓库", val);
  // stockType.value = 1;
  // getData();
  nextTick(() => {
    batchSelectRef.value?.parentSelectWh();
  });
};

// 点击批量添加按钮
const handleBatchAdd = () => {
  formRef.value?.validate((valid, fields) => {
    if (valid) {
      drawerShow.value = true;
    } else {
      console.log("error submit!", fields);
      return false;
    }
  });
};

// 监听批量添加抽屉弹窗子组件的 change事件 回调,拿到选择的商品
const batchSelectchange = (selectData: IinStockItem[]) => {
  tableLoading.value = true;
  console.log("selectData", selectData);
  let dataLength = selectData.length;
  selectData.forEach((item) => {
    goods.value.unshift({
      goods_id: item.goods_id,
      // goods_all_id: item.id,
      barcode: item.barcode,
      title: item.title,
      spec: item.spec,
      brand: item.brand,
      measure_name: item.measure_name,
      class_name: item.class_name,
      warehouse_id: item.warehouse_id,
      warehouse_name: item.warehouse_name,
      in_num: item.stock,
      inv_num: item.stock,
      ph_no: item.batch_number,
      unique: item.unique,
      note: "",
      diff_num: 0,
      stock_id: item.stock_id,
      ws_code: item.ws_code,
      price: item.price,
      in_wh_date: item.in_wh_date,
    });
  });
  batchSelectRef.value?.setStatus();
  tableLoading.value = false;
  ElMessage.success(`已批量添加${dataLength}条商品`);
};

// 单元格点击删除
const handleDelete = (row: any, index: number) => {
  console.log(index);
  goods.value.splice(index, 1);
  if (goods.value.length === 0) importAllStatus.value = false;
};

const changeAmount = (total: number) => {
  if(importAllStatus.value) return
  amount.value = total;
};

// 监听盘点后数量input框的失去焦点事件
const bindInputBlur = (event: FocusEvent, row: any) => {
  console.log("🚀 ~ bindInputBlur ~ row:", row.inv_num);
  let inv_num = row.inv_num;
  if (typeof inv_num === "string") {
    inv_num = 0;
    row.inv_num = 0;
  }
  let in_num = row.in_num;

  let diff_num = inv_num - in_num;
  row.diff_num = diff_num;
};

// 点击取消
const handeleCancel = () => {
  if (props.editFrom == 2) {
    // 如果editFrom为1 表示是从 详情页进来的
    emit("aboutAdd", { val: 3 });
  } else {
    emit("aboutAdd", { val: 1 });
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
      let warehouse = props.storageList.find((item: ICateItem) => {
        return item.id == Number(form.value.warehouse_id);
      });

      emit("aboutAdd", {
        val: 2,
        preInfo: {
          warehouse_id: warehouse!.id,
          warehouse_name: warehouse!.name,
          surplus_num: surplus_num.value,
          shortage_num: shortage_num.value,
          inventory_time: form.value.inventory_time,
          id: props.listId,
          // goods: alreadyGoods,
          goods: goods.value,
          note: note.value,
          file_info: file_info.value,
        },
      });
    } else {
      console.log("error submit!");
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
    const result = await detailCheckApi({ id });
    form.value.warehouse_id = result.data.warehouse_id;
    nextTick(() => {
      batchSelectRef.value?.parentSelectWh();
    });
    note.value = result.data.note;
    file_info.value = result.data.file_info;
    form.value.inventory_time = formartDate(result.data.inventory_time);

    const detail_goods = result.data.goods;
    let list = detail_goods.map((item) => {
      let changeData = changeDetailData(item);
      return changeData;
    });
    goods.value = list;
  } finally {
    tableLoading.value = false;
  }
};

function rowChangeClass({ row, rowIndex }: { row: any; rowIndex: number }) {
  if (rowIndex === 0 && row.scan_status) {
    setTimeout(() => {
      row.scan_status = false;
    }, 500);
    return "animation-bg";
  } else {
    return "";
  }
}

// 通过扫描枪扫出来的条码添加商品
async function getBarcodeInfo() {
  let code = input_barcode.value;
  let data = {
    content: code,
    document_type: 6, //盘点单 6
  };
  const result = await getLabelInfoApi(data);
  ElMessage.success("扫描成功");
  const findList = result.data.list;
  let success_num = 0;
  let fail_num = 0;
  findList.forEach((element) => {
    let findRes = goods.value.find((item) => {
      return element.stock_id === item.stock_id;
    });
    // 如果不存在则添加
    if (!findRes) {
      goods.value.unshift({
        goods_id: element.goods_id,
        barcode: element.barcode,
        title: element.title,
        spec: element.spec,
        brand: element.brand,
        measure_name: element.measure_name,
        class_name: element.class_name,
        // sup_name: element.sup_name,
        warehouse_id: element.warehouse_id,
        warehouse_name: element.warehouse_name,
        ph_no: element.batch_number,
        unique: element.unique,
        note: "",
        stock_id: element.stock_id,
        ws_code: element.ws_code,
        price: element.price,
        in_wh_date: element.in_wh_date,
        in_num: element.stock,
        inv_num: element.stock,
        diff_num: 0,
      });
      success_num += 1;
    } else {
      fail_num += 1;
    }
  });
  fail_num === 0
    ? ElMessage.info(`成功添加${success_num}条数据`)
    : ElMessage.info(`成功添加${success_num}条商品,${fail_num}条商品已存在`);
}

// // 通过扫描枪扫出来的条码添加商品
// function getBarcodeInfo() {
//   if (!form.value.warehouse_id) {
//     ElMessage.warning("请您先选择仓库");
//     return;
//   }
//   if (goods.value.length == 0) {
//     ElMessage.warning("当前仓库无已入库商品");
//     return;
//   }
//   console.log("input_barcode.value", input_barcode.value);
//   let find_index = goods.value.findIndex((item) => {
//     return item.barcode == input_barcode.value;
//   });

//   if (find_index !== -1) {
//     let valueArr = goods.value.splice(find_index, 1);

//     valueArr[0].scan_status = true;
//     goods.value.unshift(...valueArr);
//   } else {
//     ElMessage.warning(`扫描条码${input_barcode.value}的商品不在仓库范围内`);
//   }
// }

// 已盘 条数
const yetCheck = computed(() => {
  return goods.value.length;
});

// 待盘 条数
const waitCheck = computed(() => {
  let num = amount.value - yetCheck.value;
  return num > 0 ? num : 0;
});

const surplus_num = computed(() => {
  if (goods.value.length > 0) {
    let sum = 0;
    goods.value.forEach((item) => {
      sum += item.diff_num!;
    });

    // 如果 sum 大于0 则返回sum,否则为0
    return sum > 0 ? sum : 0;
  } else {
    return 0;
  }
});

const shortage_num = computed(() => {
  if (goods.value.length > 0) {
    let sum = 0;
    goods.value.forEach((item) => {
      sum += item.diff_num!;
    });

    // 如果 sum 小于0 则返回sum,否则为0
    return sum < 0 ? sum : 0;
  } else {
    return 0;
  }
});

async function handleAllImport(command: number) {
  let is_all = command === 1 ? 0 : 1;
  tableLoading.value = true;
  let data = {
    is_all,
    warehouse_id: form.value.warehouse_id,
  };
  const result = await getInstockApi(data);
  importAllStatus.value = true;
  let list = result.data.list;
  amount.value = list.length;
  let dataLength = list.length;
  list.forEach((item) => {
    goods.value.unshift({
      goods_id: item.goods_id,
      // goods_all_id: item.id,
      barcode: item.barcode,
      title: item.title,
      spec: item.spec,
      brand: item.brand,
      measure_name: item.measure_name,
      class_name: item.class_name,
      warehouse_id: item.warehouse_id,
      warehouse_name: item.warehouse_name,
      in_num: item.stock,
      inv_num: item.stock,
      ph_no: item.batch_number,
      unique: item.unique,
      note: "",
      diff_num: 0,
      stock_id: item.stock_id,
      ws_code: item.ws_code,
      price: item.price,
      in_wh_date: item.in_wh_date,
    });
  });
  tableLoading.value = false;
  ElMessage.success(`已批量添加${dataLength}条商品`);
}

onActivated(() => {
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
    } else {
      console.log("newValue不存在");
      pageType.value = 1;
      goods.value = [];
      note.value = "";
      file_info.value = {
        src: "",
        name: "",
      };
    }
  },
  { immediate: true },
);

function changeDetailData(data: CheckGoods) {
  let {
    goods_id,
    barcode,
    brand,
    class_name,
    measure_name,
    ph_no,
    in_num,
    inv_num,
    spec,
    title,
    unique,
    warehouse_name,
    warehouse_id,
    stock_id,
    ws_code,
    price,
    in_wh_date,
    diff_num,
    note,
  } = data;
  return {
    goods_id,
    barcode,
    title,
    spec,
    brand,
    measure_name,
    class_name,
    in_num,
    inv_num,
    ph_no: ph_no ?? "",
    warehouse_name,
    warehouse_id,
    diff_num,
    note,
    unique,
    stock_id,
    ws_code,
    price,
    in_wh_date,
  };
}
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <div class="header-title">{{ headerTitle }}</div>
      <el-form ref="formRef" :model="form" :rules="rules" :inline="true">
        <el-form-item label="盘点仓库" prop="warehouse_id">
          <el-select
            v-model="form.warehouse_id"
            placeholder="请选择盘点仓库"
            filterable
            @change="checkSelectChange"
            :disabled="pageType == 2 || goods.length > 0"
          >
            <el-option
              v-for="item in storageList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="盘点日期" class="ml-[20px]" prop="inventory_time">
          <el-date-picker
            style="width: 100%"
            v-model="form.inventory_time"
            type="date"
            placeholder="请选择盘点日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :clearable="false"
          />
        </el-form-item>
        <el-form-item>
          <el-tooltip
            effect="dark"
            content="选择仓库后,可以快速导入该仓库所有商品; 未选择仓库和已添加商品时,该功能不可用"
            placement="top-start"
          >
            <el-dropdown trigger="click" @command="handleAllImport">
              <el-button type="primary" :disabled="!form.warehouse_id || goods.length > 0">
                一键全部导入
                <el-icon class="el-icon--right"><i-ep-arrow-down></i-ep-arrow-down></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :command="1">导入库存数大于0的</el-dropdown-item>
                  <el-dropdown-item :command="2">导入全部(包含库存为0)</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-tooltip>
        </el-form-item>
        <el-table
          :data="form.goods"
          border
          v-loading="tableLoading"
          ref="checkTableRef"
          :default-sort="{ prop: 'check_status', order: 'ascending' }"
          :row-class-name="rowChangeClass"
          height="780"
          scrollbar-always-on
        >
          <el-table-column label="#" type="index" />
          <el-table-column label="条码" prop="barcode" width="160"></el-table-column>
          <el-table-column label="名称" prop="title" width="160"></el-table-column>
          <el-table-column label="规格型号" prop="spec"></el-table-column>
          <el-table-column label="批次/日期" prop="ph_no" width="100"></el-table-column>
          <el-table-column label="单位" prop="measure_name"></el-table-column>
          <el-table-column label="品牌" prop="brand"></el-table-column>
          <el-table-column label="分类" prop="class_name"></el-table-column>
          <el-table-column label="盘点前数量" prop="in_num" width="120"></el-table-column>
          <el-table-column label="盘点后数量" prop="inv_num" width="120">
            <template #default="scope">
              <el-input
                v-model.number="scope.row.inv_num"
                placeholder="请输入内容"
                @blur="bindInputBlur($event, scope.row)"
                v-inputnum.int
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="盘盈盘亏" prop="diff_num" width="120">
            <template #default="{ row }">
              <span
                :class="[{ 'text-green-500': row.diff_num > 0, 'text-red-500': row.diff_num < 0 }]"
              >
                {{ row.diff_num }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="库位" prop="ws_code"></el-table-column>
          <el-table-column label="单价" prop="price"></el-table-column>
          <el-table-column label="入库日期" prop="in_wh_date"></el-table-column>
          <el-table-column label="备注" prop="note">
            <template #default="scope">
              <el-input v-model="scope.row.note" placeholder="请输入备注" maxlength="30"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                type="danger"
                :icon="Delete"
                @click="handleDelete(scope.row, scope.$index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div class="flex justify-center mt-[20px] relative">
        <div class="flex items-center absolute left-0">
          <div class="mr-[20px]">
            <span>总计：</span>
            <span>{{ amount }}条</span>
          </div>
          <div class="mr-[20px] font-bold">
            <span>已盘：</span>
            <span>{{ yetCheck }}条</span>
          </div>
          <div class="mr-[20px]">
            <span>待盘：</span>
            <span>{{ waitCheck }}条</span>
          </div>
        </div>
        <el-button type="primary" :icon="Plus" @click="handleBatchAdd" class="w-[100px]">
          批量添加
        </el-button>
      </div>

      <div class="note">
        <span>备注</span>
        <el-input
          style="width: 240px; margin-left: 10px"
          v-model="note"
          placeholder="请输入备注"
          clearable
          maxlength="30"
        ></el-input>
      </div>
      <div class="mt-[10px] flex items-center">
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
    <InStoBatchSelect
      :stock-id-list="stockIdList"
      ref="batchSelectRef"
      v-model="drawerShow"
      :warehouse_id="form.warehouse_id"
      @change="batchSelectchange"
      show-stock-select
      @updateAmount="changeAmount"
    ></InStoBatchSelect>
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

@keyframes gradientChange {
  0% {
    background-color: #cdd0d6;
  }
  25% {
    background-color: var(--el-table-tr-bg-color);
  }
  50% {
    background-color: #cdd0d6;
  }
  100% {
    background-color: var(--el-table-tr-bg-color);
  }
}

:deep(.el-table .animation-bg) {
  animation: gradientChange 1s linear;
}

.animation-bg {
  animation: gradientChange 1s linear;
}
</style>
