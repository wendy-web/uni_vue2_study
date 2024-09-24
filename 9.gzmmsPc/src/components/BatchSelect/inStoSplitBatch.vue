<script setup lang="ts">
// 用于拆装单 批量选择组件
import type { FormInstance, TableInstance } from "element-plus";
import { getGoodsSplitApi } from "@/api/common/index";
import type { ISplitPrentList } from "@/api/common/types";
import { useCellOmit } from "@/hooks/table";
import { useTableList } from "./hook";

export interface API {
  /** 报废单批量添加后调用的方法,会将所已选择的商品选择状态设为不可状态且清空已选  */
  setStatus: () => void;
}

interface Props {
  /** 用于表格可选择的数据 */
  //   drawerData: unknown[];
  /** 控制抽屉的显隐开关 */
  modelValue: boolean;
  stockIdList: number[];
  warehouse_id: number;
}

// const props = defineProps<Props>();
const { handleCellEnter, handleCellLeave, handleCellClass } = useCellOmit({
  editProp: ["title", "spec"],
  type: 1,
});
const { list } = useTableList();

const props = withDefaults(defineProps<Props>(), {
  stockIdList: () => [],
  modelValue: false,
  warehouse_id: 0,
});

const state = reactive({
  formData: {
    keyword: "",
    page: 1,
    size: 10,
  },

  tableData: [] as ISplitPrentList[], //当前page页表格绑定的数据
  selectList: [] as number[], //勾选的数据stock_id列表
  selectData: [] as ISplitPrentList[],
  tableLoading: false,
  total: 0,
  btnLoading: false, //确定选择按钮的loading
  columnList: list,
});

const { tableData, selectList, total, btnLoading, formData, selectData, columnList, tableLoading } =
  toRefs(state);

const prueTableRef = ref();
const batchfromRef = ref<FormInstance>();

const emit = defineEmits(["update:modelValue", "change"]);

const idsList = ref<number[]>([]);

function checkId() {
  tableData.value.forEach((item) => {
    if (idsList.value.includes(item.goods.stock_id)) {
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
      warehouse_id: props.warehouse_id,
    };
    const res = await getGoodsSplitApi(data);
    const list = res.data.list || [];
    tableData.value = list;
    checkId();
    total.value = res.data.total;
  } finally {
    tableLoading.value = false;
  }
}

function changeSelect(selection: ISplitPrentList[]) {
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
    return item.goods.stock_id;
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
  tableData.value.forEach((item, index) => {
    if (selectList.value.includes(item.goods.stock_id)) {
      item.select_status = true;
    }
  });
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
  return "条码";
});

const selectTableRef = computed<TableInstance>(() => {
  return prueTableRef.value?.getTableRef();
});
watch(
  () => props.stockIdList,
  (newValue) => {
    idsList.value = newValue;
    checkId();
  },
  {
    immediate: true,
  },
);
watch(
  () => props.warehouse_id,
  (newValue) => {
    getData();
  },
);
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
</style>
