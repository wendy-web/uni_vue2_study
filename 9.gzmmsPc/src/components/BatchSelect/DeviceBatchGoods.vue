<script setup lang="ts">
// 几个 出库单 使用的批量选择货品组件 最新
// 已入库的商品 批量选择组件
import type { FormInstance, TableInstance } from "element-plus";
import { gooddropApi } from "@/api/device/common/index";
import type { DeviceGoodsDrop } from "@/api/device/common/types";
import { useCellOmit } from "@/hooks/table";
import { useTableList } from "./hook";

export interface API {
  /** 批量添加后调用的方法,会将所已选择的商品选择状态设为不可状态且清空已选  */
  setStatus: () => void;
  parentSelectWh: () => void;
}

interface Props {
  ids: number[];
  warehouse_id?: number; //仓库id
  showStockSelect?: boolean; //是否显示库存数选择
}

// const props = defineProps<Props>();
const { handleCellEnter, handleCellLeave, handleCellClass } = useCellOmit({
  editProp: ["title", "spec"],
  type: 1,
});
const { defaultList } = useTableList();

const props = withDefaults(defineProps<Props>(), {
  ids: () => [],
  warehouse_id: 0,
  showStockSelect: false,
});

const model = defineModel({ required: true, default: false });

const state = reactive({
  formData: {
    keyword: "",
    page: 1,
    size: 10,
  },

  //   tableData: [] as IinStockItem[], //当前page页表格绑定的数据
  tableData: [] as DeviceGoodsDrop.GoodsItemData[], //当前page页表格绑定的数据
  selectList: [] as number[], //勾选的数据id列表
  //   selectData: [] as IinStockItem[], //勾选的数据列表
  selectData: [] as DeviceGoodsDrop.GoodsItemData[], //勾选的数据列表
  tableLoading: false,
  total: 0,
  btnLoading: false, //确定选择按钮的loading
  columnList: defaultList,
});

const { tableData, selectList, total, btnLoading, formData, selectData, columnList, tableLoading } =
  toRefs(state);

const prueTableRef = ref();
const batchfromRef = ref<FormInstance>();
const emit = defineEmits(["change", "updateAmount"]);
const idsList = ref<number[]>([]);

const stockOptions = ref([
  {
    label: "大于0",
    value: 0,
  },
  {
    label: "等于0",
    value: 2,
  },
  {
    label: "全部",
    value: 1,
  },
]);
const is_all = ref(0); //是否显示 0为只显示大于0的库存商品 1为全部显示 2等于0

function checkId() {
  tableData.value.forEach((item) => {
    if (idsList.value.includes(item.id)) {
      item.select_status = true;
    } else {
      item.select_status = false;
    }
  });
}

async function getData() {
  try {
    tableLoading.value = true;
    let data = {
      page: formData.value.page,
      size: formData.value.size,
      keyword: formData.value.keyword || undefined,
    };
    const res = await gooddropApi(data);
    const list = res.data.data || [];
    tableData.value = list;
    checkId();
    total.value = res.data.total;
    if (props.showStockSelect && props.warehouse_id) {
      // 如果显示库存数选择,且选择了仓库, 那么需要把总数传给父组件
      emit("updateAmount", res.data.total);
    }
  } finally {
    tableLoading.value = false;
  }
}

function changeSelect(selection: any[]) {
  selectData.value = selection;
}

//点击搜索
function clickSearch() {
  console.log("点击搜索", formData.value.keyword);
  formData.value.page = 1;
  getData();
}

/** 选择库存数触发的事件 */
const stockTypeChange = () => {
  getData();
};

// 分页触发事件
const handleQuery = () => {
  // console.log("分页触发")
  getData();
};
// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  is_all.value = 0;
  getData();
};

const parentSelectWh = () => {
  is_all.value = 0;
  formData.value.keyword = "";
  formData.value.page = 1;
  formData.value.size = 10;
  getData();
};

// 按钮选择单元格事件
const toggleSelection = (row: any) => {
  //   console.log("selectTableRef.value", selectTableRef.value);
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
    selectTableRef.value!.clearSelection();
    selectList.value = [];
    btnLoading.value = false;
    emit("change", arr);
  }, 500);
};

// 点击取消 关闭弹窗
const clickColse = () => {
  model.value = false;
};

// 抽屉弹窗关闭之前的回调
const drawerBeforeClose = () => {
  selectTableRef.value!.clearSelection();
  selectList.value = [];
  btnLoading.value = false;
  selectData.value = [];
  formData.value.keyword = "";
  formData.value.page = 1;
  model.value = false;
};

// 报废单批量添加后调用的方法,会将所已选择的商品选择状态设为不可选状态,且清空已选
const setStatus = () => {
  console.log("selectList.value", selectList.value);
  tableData.value.forEach((item, index) => {
    if (selectList.value.includes(item.id)) {
      item.select_status = true;
    }
  });
  selectTableRef.value!.clearSelection();
  selectList.value = [];
};
defineExpose({
  setStatus: setStatus,
  parentSelectWh: parentSelectWh,
});

const selectNum = computed(() => {
  return selectData.value.length;
});

const placeholderValue = computed(() => {
  return "条码/名称/分类/品牌";
});

const selectTableRef = computed<TableInstance>(() => {
  return prueTableRef.value?.getTableRef();
});
watch(
  () => props.ids,
  (newValue) => {
    idsList.value = newValue;
    checkId();
  },
  {
    immediate: true,
  },
);
watch(model, (newValue) => {
  if (newValue) {
    getData();
  }
});
</script>

<template>
  <div class="batch-select">
    <el-drawer
      title="批量添加"
      v-model="model"
      direction="rtl"
      size="60%"
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
          <el-form-item label="库存数" class="ml-[20px]" v-if="showStockSelect">
            <el-select
              v-model="is_all"
              placeholder="请选择库存数"
              :disabled="!warehouse_id"
              @change="stockTypeChange"
            >
              <el-option
                v-for="item in stockOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
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
          header-cell-class-name="table-gray-header"
          adaptive
          :adaptiveConfig="{ offsetBottom: 200 }"
        >
          <template #operations="scope">
            <el-button
              type="primary"
              :disabled="scope.row.select_status"
              @click="toggleSelection(scope.row)"
            >
              {{ scope.row.select_status ? "已添加" : "选择" }}
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
          layout="->,total, sizes, prev, pager, next, jumper"
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

<style scoped lang="scss">
@import "@/styles/common.scss";
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
</style>
