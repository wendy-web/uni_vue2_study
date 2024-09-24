<script setup lang="ts">
// 引入api
import type { FormInstance, TableInstance } from "element-plus";
import { importBuyInApi } from "@/api/storage/buy-in";
import type { IBuyInImportItem } from "@/api/storage/buy-in/types";

interface Props {
  ids?: number[];
}

const props = withDefaults(defineProps<Props>(), {
  ids: () => [],
});

const model = defineModel({ default: false });
const emit = defineEmits(["update:modelValue", "change"]);

const formRef = ref();
const formData = ref({
  type: 1,
  procure_no: "",
  keyword: "",
  page: 1,
  size: 10,
});

const tableData = ref<IBuyInImportItem[]>([]);
const total = ref(1);
const selectData = ref<IBuyInImportItem[]>([]); //勾选的数据列表
const selectList = ref<number[]>([]); //勾选的数据id列表
const btnLoading = ref(false);
const idsList = ref<number[]>([]);

const prueTableRef = ref();
const selectTableRef = computed<TableInstance>(() => {
  return prueTableRef.value?.getTableRef();
});

const column: TableColumnList = [
  {
    type: "selection",
    width: 40,
    reserveSelection: true,
    selectable: (row: any) => {
      // console.log('row',row)
      return !row.select_status;
    },
    fixed: "left",
  },
  {
    prop: "barcode",
    label: "条码",
    width: 140,
  },
  {
    prop: "title",
    label: "名称",
  },
  {
    prop: "spec",
    label: "规格型号",
  },
  {
    prop: "rem_num",
    label: "待入库数量",
  },
  {
    prop: "measure_name",
    label: "单位",
  },

  {
    prop: "brand",
    label: "品牌",
  },
  {
    prop: "class_name",
    label: "分类",
  },

  {
    label: "操作",
    slot: "operations",
    fixed: "right",
  },
];

const searchColumn: PlusColumnList = [
  {
    label: "关键字",
    prop: "keyword",
    fieldProps: {
      placeholder: "条码/名称/分类/品牌",
    },
    tooltip: "关键字(条码/名称/分类/品牌)",
  },
  {
    label: "",
    prop: "operation",
    hasLabel: false,
  },
];

const getData = async (order_no?: string) => {
  try {
    formData.value.procure_no = order_no ? order_no : formData.value.procure_no;
    const result = await importBuyInApi(formData.value);
    if (result.code === "0") {
      ElMessage.error(result.msg);
      return;
    }
    let list = result.data.data;
    tableData.value = list;
    checkId();
    total.value = result.data.total;
    return true;
  } catch (error) {
    return false;
  }
};

const handleSearch = () => {
  getData();
};

const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  getData();
};

function changeSelect(selection: IBuyInImportItem[]) {
  selectData.value = selection;
}

// 按钮选择单元格事件
const toggleSelection = (row: any) => {
  //   console.log("selectTableRef.value", selectTableRef.value);
  //@ts-expect-error
  selectTableRef.value!.toggleRowSelection(row, undefined);
};

// 点击确认选择
const clickSubmit = () => {
  if (selectData.value.length === 0) {
    btnLoading.value = false;
    return;
  }
  selectList.value = selectData.value.map((item) => {
    return item.id;
  });
  setTimeout(() => {
    btnLoading.value = false;
    emit("change", selectData.value);
  }, 500);
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
function checkId() {
  tableData.value.forEach((item) => {
    if (idsList.value.includes(item.id)) {
      item.select_status = true;
    } else {
      item.select_status = false;
    }
  });
}

defineExpose({ getData, setStatus });
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
</script>
<template>
  <div class="batch-select">
    <el-drawer
      title="选择商品"
      v-model="model"
      direction="rtl"
      size="60%"
      :before-close="drawerBeforeClose"
    >
      <template #default>
        <PlusSearch v-model="formData" :columns="searchColumn" ref="formRef" :hasFooter="false" class="mb-4">
          <!-- <template #footer> -->
          <template #plus-field-operation>
            <div class="flex">
              <el-button type="primary" @click="handleSearch" v-deBounce>
                <template #icon>
                  <i-ep-search></i-ep-search>
                </template>
                搜索
              </el-button>
              <el-button @click="handleReset(formRef?.plusFormInstance.formInstance)">
                <template #icon>
                  <i-ep-Refresh></i-ep-Refresh>
                </template>
                重置
              </el-button>
            </div>
          </template>
          <!-- </template> -->
        </PlusSearch>
        <pure-table
          :data="tableData"
          :columns="column"
          border
          ref="prueTableRef"
          row-key="id"
          @selection-change="changeSelect"
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
            {{ scope.row.select_status ? "已选择" : "选择" }}
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
          @pagination="handleSearch"
        />
      </template>
      <template #footer>
        <div class="flex items-start pb-[20px]">
          <el-button
            size="large"
            type="primary"
            class="w-[100px]"
            @click="clickSubmit"
            :loading="btnLoading"
          >
            确认选择
          </el-button>
          <el-button type="primary" plain size="large" class="w-[100px]" @click="model = false">
            取消
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-drawer__header) {
  margin-bottom: 0;
}

/* 隐藏表格列表全选 */
:deep(.el-table__header-wrapper .el-checkbox) {
  // display: none;//设置不成功，页面卡顿
  visibility: visible !important;
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
