<script setup lang="ts">
// 几个入库单使用的批量选择货品组件
// 商品列表批量选择组件
import type { FormInstance, TableInstance } from "element-plus";
import { getGoodsArrApi } from "@/api/common/index";
import type { IGoodsItem } from "@/api/common/types";
import { useCellOmit } from "@/hooks/table";
import { useTableList } from "./hook";

interface IDrawerList {
  id: number;
  barcode: string;
  title: string;
  spec: string;
  class_name: string;
  measure_name: string;
  brand: string;
  price?: string; //价格
  scr_num?: number | string; //数量
  sup_name?: string; //供应商名称
  ph_no?: string; //批次/日期
  warehouse_id?: number;
  warehouse_name?: string;
  unique?: string;
  note?: string;
  select_status?: boolean;
  goods_class?: string;
  ss_num?: number;
  order_point?: number;
  old_scr_num?: number;
}

interface Props {
  /** 用于表格可选择的数据 */
  //   drawerData: unknown[];
  /** 控制抽屉的显隐开关 */
  modelValue: boolean;
  barcodeList?: string[];
}

// const props = defineProps<Props>();
const { handleCellEnter, handleCellLeave, handleCellClass } = useCellOmit({
  editProp: ["title", "spec"],
  type: 1,
});
const { defaultList, list } = useTableList();

const props = defineProps<Props>();

const state = reactive({
  formData: {
    keyword: "",
    page: 1,
    size: 10,
  },

  tableData: [] as IGoodsItem[], //当前page页表格绑定的数据
  selectList: [] as number[], //勾选的数据id列表
  selectData: [] as IDrawerList[],
  tableLoading: false,
  total: 0,
  btnLoading: false, //确定选择按钮的loading
  columnList: defaultList,
});

const { tableData, selectList, total, btnLoading, formData, selectData, columnList, tableLoading } =
  toRefs(state);

const prueTableRef = ref();
const batchfromRef = ref<FormInstance>();

const emit = defineEmits(["update:modelValue", "change"]);

async function getData() {
  try {
    tableLoading.value = true;
    let data = {
      page: formData.value.page,
      size: formData.value.size,
      keyword: formData.value.keyword || undefined,
    };
    const res = await getGoodsArrApi(data);
    const list = res.data.data || [];
    tableData.value = list;
    checkBarcode();
    total.value = res.data.total;
  } finally {
    tableLoading.value = false;
  }
}

function checkBarcode() {
  let barcodeList = props.barcodeList || [];
  if (barcodeList.length > 0) {
    tableData.value.forEach((item) => {
      let findRes = barcodeList.find((el) => {
        return el == item.barcode;
      });
      if (findRes) {
        item.flag = true;
      }
    });
  } else {
    tableData.value.forEach((item) => {
      if (item.flag) {
        item.flag = false;
      }
    });
  }
}

function changeSelect(selection: IDrawerList[]) {
  selectData.value = selection;
}

//点击搜索
function clickSearch() {
  console.log("点击搜索", formData.value.keyword);
  formData.value.page = 1;
  getData();
}

// 分页触发事件
const handleQuery = () => {
  // console.log("分页触发")
  getData();
};
// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  getData();
};

// 按钮选择单元格事件
const toggleSelection = (row: any) => {
  console.log("selectTableRef.value", selectTableRef.value);
  //@ts-expect-error
  selectTableRef.value!.toggleRowSelection(row, undefined);
};

// 点击确认选择
const clickSubmit = () => {
  btnLoading.value = true;
  selectList.value = selectData.value.map((item) => {
    return item.id;
  });
  if (selectList.value.length === 0) {
    btnLoading.value = false;
    return;
  }

  let arr = selectData.value;
  console.log(arr);
  setTimeout(() => {
    // selectTableRef.value!.clearSelection();
    // selectList.value = [];
    btnLoading.value = false;
    // emit("update:modelValue", false);
    emit("change", arr);
  }, 500);
};

// 点击取消 关闭弹窗
const clickColse = () => {
  emit("update:modelValue", false);
};

// 抽屉弹窗关闭之前的回调
const drawerBeforeClose = () => {
  selectTableRef.value!.clearSelection();
  selectList.value = [];
  btnLoading.value = false;
  selectData.value = [];
  formData.value.keyword = "";
  formData.value.page = 1;
  emit("update:modelValue", false);
};

// 报废单批量添加后调用的方法,会将所已选择的商品选择状态设为不可选状态,且清空已选
const setStatus = () => {
  console.log("selectList.value", selectList.value);
  selectTableRef.value!.clearSelection();
  selectList.value = [];
};
defineExpose({
  setStatus: setStatus,
});

const selectNum = computed(() => {
  return selectData.value.length;
});

const placeholderValue = computed(() => {
  // return props.drawerType == 1 ? "条码/名称/分类/品牌" : "条码/名称/分类/品牌/仓库";
  return "条码/名称/分类/品牌";
});

const selectTableRef = computed<TableInstance>(() => {
  return prueTableRef.value?.getTableRef();
});
watch(
  () => props.barcodeList,
  (newVal) => {
    if (Array.isArray(newVal)) {
      checkBarcode();
    }
  },
  {
    immediate: true,
  },
);

// watchEffect(() => {
//   allData.value = props.drawerData as IDrawerList[];
//   setPage();
// });

// watch(
//   () => props.drawerData,
//   (newValue, oldValue) => {
//     allData.value = newValue as IDrawerList[];
//     setPage();
//   },
//   {
//     immediate: true,
//   },
// );

onMounted(() => {
  getData();
});
</script>
<template>
  <div class="batch-select">
    <el-drawer
      title="批量添加"
      :model-value="modelValue"
      direction="rtl"
      size="50%"
      :before-close="drawerBeforeClose"
      destroy-on-close
    >
      <template #default>
        <el-form :inline="true" :model="formData" @submit.enter.prevent ref="batchfromRef">
          <el-form-item label="当前已勾选:">
            <span>{{ selectNum }}条</span>
          </el-form-item>
          <el-form-item label="关键字" prop="keyword">
            <el-input
              v-model="formData.keyword"
              :placeholder="placeholderValue"
              style="width: 200px"
              @keyup.enter.native="clickSearch"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="clickSearch" v-deBounce>
              <template #icon>
                <i-ep-Search></i-ep-Search>
              </template>
              搜索
            </el-button>
            <el-button @click="handleReset(batchfromRef)">
              <template #icon>
                <i-ep-Refresh></i-ep-Refresh>
              </template>

              重置
            </el-button>
          </el-form-item>
        </el-form>
        <pure-table
          :data="tableData"
          :columns="columnList"
          border
          ref="prueTableRef"
          row-key="id"
          @selection-change="changeSelect"
          :cell-class-name="handleCellClass"
          @cell-mouse-enter="handleCellEnter"
          @cell-mouse-leave="handleCellLeave"
          header-cell-class-name="table-row-header"
          adaptive
          :adaptiveConfig="{ offsetBottom: 200 }"
        >
          <template #operations="scope">
            <el-button
              type="success"
              :disabled="scope.row.select_status"
              @click="toggleSelection(scope.row)"
            >
              选择
            </el-button>
          </template>
        </pure-table>
        <pagination
          class="mt-[20px]"
          v-if="total > 0"
          v-model:total="total"
          v-model:page="formData.page"
          v-model:limit="formData.size"
          :pageSizes="[10, 20]"
          @pagination="handleQuery"
        />
      </template>
      <template #footer>
        <div class="flex items-start">
          <el-button
            size="large"
            type="primary"
            class="w-[100px]"
            @click="clickSubmit"
            :loading="btnLoading"
          >
            确认选择
          </el-button>
          <el-button type="primary" plain size="large" class="w-[100px]" @click="clickColse">
            取消
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<style scoped>
:deep(.el-drawer__header) {
  margin-bottom: 0;
}

:deep(.el-table td.cell-overflow > .cell) {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

:deep(.el-table__header-wrapper .el-checkbox__inner) {
  width: 20px;
  height: 20px;
}

/* 如果需要调整选中后勾选框里的对勾大小 */
:deep(.el-table__header-wrapper .el-checkbox__input.is-checked .el-checkbox__inner::after) {
  left: 7px;
  top: 4px;
}

:deep(.el-table__body .el-checkbox__inner) {
  width: 20px;
  height: 20px;
}

/* 如果需要调整选中后勾选框里的对勾大小 */
:deep(.el-table__body .el-checkbox__input.is-checked .el-checkbox__inner::after) {
  left: 7px;
  top: 4px;
}
</style>
